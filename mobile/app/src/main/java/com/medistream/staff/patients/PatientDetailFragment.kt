package com.medistream.staff.patients

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
import com.medistream.databinding.FeaturePatientDetailBinding
import com.medistream.staff.consultations.ConsultationService
import kotlinx.coroutines.launch

class PatientDetailFragment : Fragment() {

    private var _binding: FeaturePatientDetailBinding? = null
    private val binding get() = _binding!!

    private var patientId: Int = 0
    private var fullName: String = ""
    private var age: Int = 0
    private var gender: String = ""
    private var contactNumber: String = ""
    private var address: String = ""

    private lateinit var adapter: TimelineAdapter

    companion object {
        private const val ARG_PATIENT_ID = "patient_id"
        private const val ARG_FULL_NAME = "full_name"
        private const val ARG_AGE = "age"
        private const val ARG_GENDER = "gender"
        private const val ARG_CONTACT = "contact"
        private const val ARG_ADDRESS = "address"

        fun newInstance(
            patientId: Int,
            fullName: String,
            age: Int,
            gender: String,
            contactNumber: String,
            address: String
        ): PatientDetailFragment {
            return PatientDetailFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_PATIENT_ID, patientId)
                    putString(ARG_FULL_NAME, fullName)
                    putInt(ARG_AGE, age)
                    putString(ARG_GENDER, gender)
                    putString(ARG_CONTACT, contactNumber)
                    putString(ARG_ADDRESS, address)
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            patientId = it.getInt(ARG_PATIENT_ID)
            fullName = it.getString(ARG_FULL_NAME) ?: ""
            age = it.getInt(ARG_AGE)
            gender = it.getString(ARG_GENDER) ?: ""
            contactNumber = it.getString(ARG_CONTACT) ?: ""
            address = it.getString(ARG_ADDRESS) ?: ""
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeaturePatientDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupDemographics()
        setupRecyclerView()
        setupListeners()
        fetchTimeline()
    }

    private fun setupDemographics() {
        binding.tvDetailName.text = fullName
        binding.tvDetailId.text = "Patient ID: #$patientId"
        binding.tvDetailGenderAge.text = "$gender, $age yrs old"
        binding.tvDetailContact.text = if (contactNumber.isNotEmpty()) "Contact: $contactNumber" else "No contact number"
        binding.tvDetailAddress.text = if (address.isNotEmpty()) "Address: $address" else "No address listed"
    }

    private fun setupRecyclerView() {
        adapter = TimelineAdapter()
        binding.rvTimeline.layoutManager = LinearLayoutManager(requireContext())
        binding.rvTimeline.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener {
            parentFragmentManager.popBackStack()
        }
    }

    private fun fetchTimeline() {
        binding.progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val service = RetrofitClient.authInstance.create(ConsultationService::class.java)
                val response = service.getConsultationsByPatient(patientId)
                if (response.isSuccessful) {
                    val list = response.body() ?: emptyList()
                    // Sort timeline in reverse chronological order (newest first)
                    val sortedList = list.sortedByDescending { it.consultationId }
                    adapter.submitList(sortedList)

                    if (sortedList.isNullOrEmpty()) {
                        binding.rvTimeline.visibility = View.GONE
                        binding.emptyStateView.visibility = View.VISIBLE
                    } else {
                        binding.rvTimeline.visibility = View.VISIBLE
                        binding.emptyStateView.visibility = View.GONE
                    }
                } else {
                    showSnackbar("Failed to fetch timeline: ${response.message()}", isError = true)
                }
            } catch (e: Exception) {
                showSnackbar("Error fetching timeline: ${e.localizedMessage}", isError = true)
            } finally {
                binding.progressBar.visibility = View.GONE
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
