package com.medistream.staff.medicalstaff

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.databinding.FeatureMedicalStaffListBinding

class MedicalStaffListFragment : Fragment() {

    private var _binding: FeatureMedicalStaffListBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: MedicalStaffViewModel
    private lateinit var adapter: MedicalStaffAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeatureMedicalStaffListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[MedicalStaffViewModel::class.java]

        setupRecyclerView()
        setupSwipeToRefresh()
        setupObservers()

        viewModel.fetchMedicalStaff()
    }

    private fun setupRecyclerView() {
        adapter = MedicalStaffAdapter { staff ->
            val dialog = StaffDetailDialogFragment.newInstance(staff)
            dialog.show(parentFragmentManager, "StaffDetailDialogFragment")
        }
        binding.rvMedicalStaff.layoutManager = LinearLayoutManager(requireContext())
        binding.rvMedicalStaff.adapter = adapter
    }

    private fun setupSwipeToRefresh() {
        binding.swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.brand_maroon, requireActivity().theme)
        )
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.fetchMedicalStaff()
        }
    }

    private fun setupObservers() {
        viewModel.staffList.observe(viewLifecycleOwner) { list ->
            adapter.submitList(list)
            if (list.isNullOrEmpty()) {
                binding.rvMedicalStaff.visibility = View.GONE
                binding.emptyStateView.visibility = View.VISIBLE
            } else {
                binding.rvMedicalStaff.visibility = View.VISIBLE
                binding.emptyStateView.visibility = View.GONE
            }
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading && binding.swipeRefreshLayout.isRefreshing
            binding.progressBar.visibility = if (isLoading && !binding.swipeRefreshLayout.isRefreshing) View.VISIBLE else View.GONE
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                showSnackbar(error, isError = true)
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
