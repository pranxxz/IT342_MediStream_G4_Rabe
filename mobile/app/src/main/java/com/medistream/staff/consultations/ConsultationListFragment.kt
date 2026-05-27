package com.medistream.staff.consultations

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.core.network.RetrofitClient
import com.medistream.databinding.FeatureConsultationHistoryListBinding
import kotlinx.coroutines.launch

class ConsultationListFragment : Fragment() {

    private var _binding: FeatureConsultationHistoryListBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: ConsultationHistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeatureConsultationHistoryListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupSwipeToRefresh()
        fetchConsultations()
    }

    private fun setupRecyclerView() {
        adapter = ConsultationHistoryAdapter { consultation ->
            val dialog = ConsultationDetailDialogFragment.newInstance(consultation)
            dialog.show(parentFragmentManager, "ConsultationDetailDialogFragment")
        }
        binding.rvConsultations.layoutManager = LinearLayoutManager(requireContext())
        binding.rvConsultations.adapter = adapter
    }

    private fun setupSwipeToRefresh() {
        binding.swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.brand_maroon, requireActivity().theme)
        )
        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchConsultations()
        }
    }

    private fun fetchConsultations() {
        binding.progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val service = RetrofitClient.authInstance.create(ConsultationService::class.java)
                val response = service.getConsultations()

                if (response.isSuccessful) {
                    val list = response.body() ?: emptyList()
                    // Sort by consultationId descending (newest first)
                    val sortedList = list.sortedByDescending { it.consultationId }
                    adapter.submitList(sortedList)

                    if (sortedList.isNullOrEmpty()) {
                        binding.rvConsultations.visibility = View.GONE
                        binding.emptyStateView.visibility = View.VISIBLE
                    } else {
                        binding.rvConsultations.visibility = View.VISIBLE
                        binding.emptyStateView.visibility = View.GONE
                    }
                } else {
                    showSnackbar("Failed to fetch consultations: ${response.message()}", isError = true)
                }
            } catch (e: Exception) {
                showSnackbar("Error fetching consultations: ${e.localizedMessage}", isError = true)
            } finally {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefreshLayout.isRefreshing = false
            }
        }
    }

    private fun showSnackbar(message: String, isError: Boolean = false) {
        (activity as? com.medistream.core.ui.BaseActivity)?.showSnackbar(message, isError)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
