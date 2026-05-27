package com.medistream.staff.queue

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.core.network.TokenManager
import com.medistream.databinding.FeatureQueueDashboardBinding
import com.medistream.staff.consultations.ConsultationFormFragment

class QueueManagementFragment : Fragment() {

    private var _binding: FeatureQueueDashboardBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: QueueViewModel
    private lateinit var adapter: QueueAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeatureQueueDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[QueueViewModel::class.java]

        setupRecyclerView()
        setupSwipeToRefresh()
        setupObservers()

        val context = requireContext()
        val doctorName = TokenManager.getUserName(context) ?: "Dr. Staff"

        // Next Consultation Primary Action Button
        binding.btnNextConsultation.setOnClickListener {
            viewModel.callNextPatient(doctorName)
        }

        viewModel.fetchQueues()
    }

    private fun setupRecyclerView() {
        val doctorName = TokenManager.getUserName(requireContext()) ?: "Dr. Staff"

        adapter = QueueAdapter(
            onStartConsultation = { item ->
                viewModel.updateStatus(item, "CONSULTING", doctorName)
            },
            onLogVisit = { item ->
                navigateToConsultationForm(item)
            }
        )

        binding.rvQueueItems.layoutManager = LinearLayoutManager(requireContext())
        binding.rvQueueItems.adapter = adapter
    }

    private fun setupSwipeToRefresh() {
        binding.swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.brand_maroon, requireActivity().theme)
        )
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.fetchQueues()
        }
    }

    private fun setupObservers() {
        viewModel.queueList.observe(viewLifecycleOwner) { list ->
            adapter.submitList(list)
            if (list.isNullOrEmpty()) {
                binding.rvQueueItems.visibility = View.GONE
                binding.emptyStateView.visibility = View.VISIBLE
            } else {
                binding.rvQueueItems.visibility = View.VISIBLE
                binding.emptyStateView.visibility = View.GONE
            }
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            // Update loading indicators
            binding.swipeRefreshLayout.isRefreshing = isLoading && binding.swipeRefreshLayout.isRefreshing
            binding.progressBar.visibility = if (isLoading && !binding.swipeRefreshLayout.isRefreshing) View.VISIBLE else View.GONE
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                showSnackbar(error, isError = true)
            }
        }

        viewModel.countWaiting.observe(viewLifecycleOwner) { count ->
            binding.tvCountWaiting.text = count.toString()
        }

        viewModel.countConsulting.observe(viewLifecycleOwner) { count ->
            binding.tvCountConsulting.text = count.toString()
        }

        viewModel.countDone.observe(viewLifecycleOwner) { count ->
            binding.tvCountDone.text = count.toString()
        }

        viewModel.nextConsultationSuccess.observe(viewLifecycleOwner) { nextItem ->
            if (nextItem != null) {
                showSnackbar("Called patient: ${nextItem.patient?.fullName ?: nextItem.queueNumber} to consultation!")
                viewModel.clearResult()
            }
        }
    }

    private fun navigateToConsultationForm(item: QueueItem) {
        val patientId = item.patient?.patientId ?: 0
        val patientName = item.patient?.fullName ?: "Patient"
        val queueId = item.id

        val fragment = ConsultationFormFragment.newInstance(patientId, patientName, queueId)
        
        parentFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .addToBackStack(null)
            .commit()
    }

    private fun showSnackbar(message: String, isError: Boolean = false) {
        (activity as? com.medistream.core.ui.BaseActivity)?.showSnackbar(message, isError)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
