package com.medistream.staff.patients

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.databinding.FeaturePatientListBinding

class PatientListFragment : Fragment() {

    private var _binding: FeaturePatientListBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: PatientViewModel
    private lateinit var adapter: PatientAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeaturePatientListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[PatientViewModel::class.java]

        setupRecyclerView()
        setupSwipeToRefresh()
        setupSearch()
        setupObservers()

        binding.fabAddPatient.setOnClickListener {
            AddPatientDialogFragment().show(childFragmentManager, "AddPatientDialog")
        }

        viewModel.fetchPatients()
    }

    private fun setupRecyclerView() {
        adapter = PatientAdapter { patient ->
            navigateToPatientDetail(patient)
        }
        binding.rvPatients.layoutManager = LinearLayoutManager(requireContext())
        binding.rvPatients.adapter = adapter
    }

    private fun setupSwipeToRefresh() {
        binding.swipeRefreshLayout.setColorSchemeColors(
            resources.getColor(R.color.brand_maroon, requireActivity().theme)
        )
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.fetchPatients()
        }
    }

    private fun setupSearch() {
        binding.etSearchQuery.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                viewModel.filterPatients(s.toString())
            }

            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun setupObservers() {
        viewModel.patientList.observe(viewLifecycleOwner) { list ->
            adapter.submitList(list)
            
            // Dynamic stats update
            val total = list?.size ?: 0
            val male = list?.count { it.gender?.equals("Male", ignoreCase = true) == true } ?: 0
            val female = list?.count { it.gender?.equals("Female", ignoreCase = true) == true } ?: 0
            
            binding.tvStatTotal.text = total.toString()
            binding.tvStatMale.text = male.toString()
            binding.tvStatFemale.text = female.toString()

            if (list.isNullOrEmpty()) {
                binding.rvPatients.visibility = View.GONE
                binding.emptyStateView.visibility = View.VISIBLE
            } else {
                binding.rvPatients.visibility = View.VISIBLE
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

    private fun navigateToPatientDetail(patient: PatientEntity) {
        val dialog = PatientDetailDialogFragment.newInstance(patient)
        dialog.show(parentFragmentManager, "PatientDetailDialogFragment")
    }

    private fun showSnackbar(message: String, isError: Boolean = false) {
        (activity as? com.medistream.core.ui.BaseActivity)?.showSnackbar(message, isError)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
