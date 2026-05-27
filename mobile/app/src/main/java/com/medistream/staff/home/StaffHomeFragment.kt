package com.medistream.staff.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.medistream.core.network.TokenManager
import com.medistream.databinding.FragmentStaffHomeBinding

class StaffHomeFragment : Fragment() {

    private var _binding: FragmentStaffHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: StaffHomeViewModel
    private lateinit var adapter: RecentQueueAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentStaffHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[StaffHomeViewModel::class.java]

        // Load greetings
        val staffName = TokenManager.getUserName(requireContext()) ?: "Staff Member"
        binding.tvWelcomeStaff.text = "Welcome, $staffName!"

        // Recycler View setup
        binding.rvRecentQueue.layoutManager = LinearLayoutManager(requireContext())
        adapter = RecentQueueAdapter()
        binding.rvRecentQueue.adapter = adapter

        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.loadDashboardData()
        }

        setupObservers()

        // Load initially
        viewModel.loadDashboardData()
    }

    private fun setupObservers() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) { errorMsg ->
            if (!errorMsg.isNullOrEmpty()) {
                Toast.makeText(requireContext(), errorMsg, Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.totalPatients.observe(viewLifecycleOwner) { count ->
            binding.tvTotalPatientsCount.text = count.toString()
        }

        viewModel.inQueue.observe(viewLifecycleOwner) { count ->
            binding.tvInQueueCount.text = count.toString()
        }

        viewModel.totalConsultations.observe(viewLifecycleOwner) { count ->
            binding.tvConsultationsCount.text = count.toString()
        }

        viewModel.totalStaff.observe(viewLifecycleOwner) { count ->
            binding.tvStaffCount.text = count.toString()
        }

        viewModel.recentQueue.observe(viewLifecycleOwner) { queueList ->
            if (queueList.isNullOrEmpty()) {
                binding.emptyStateView.visibility = View.VISIBLE
                binding.rvRecentQueue.visibility = View.GONE
            } else {
                binding.emptyStateView.visibility = View.GONE
                binding.rvRecentQueue.visibility = View.VISIBLE
                adapter.updateData(queueList)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
