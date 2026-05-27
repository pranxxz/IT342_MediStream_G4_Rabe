package com.medistream.staff.consultations

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.medistream.R
import com.medistream.core.network.RetrofitClient
import com.medistream.core.network.TokenManager
import com.medistream.databinding.FeatureConsultationFormBinding
import com.medistream.staff.queue.QueueItem
import com.medistream.staff.queue.QueueService
import kotlinx.coroutines.launch
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

class ConsultationFormFragment : Fragment() {

    private var _binding: FeatureConsultationFormBinding? = null
    private val binding get() = _binding!!

    private var patientId: Int = 0
    private var patientName: String = ""
    private var queueId: Long = 0L

    companion object {
        private const val ARG_PATIENT_ID = "patient_id"
        private const val ARG_PATIENT_NAME = "patient_name"
        private const val ARG_QUEUE_ID = "queue_id"

        fun newInstance(patientId: Int, patientName: String, queueId: Long = 0L): ConsultationFormFragment {
            return ConsultationFormFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_PATIENT_ID, patientId)
                    putString(ARG_PATIENT_NAME, patientName)
                    putLong(ARG_QUEUE_ID, queueId)
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            patientId = it.getInt(ARG_PATIENT_ID)
            patientName = it.getString(ARG_PATIENT_NAME) ?: ""
            queueId = it.getLong(ARG_QUEUE_ID)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FeatureConsultationFormBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.tvPatientHeaderName.text = "Patient: $patientName"
        binding.tvPatientHeaderId.text = "Patient ID: #$patientId"

        binding.btnCancel.setOnClickListener {
            parentFragmentManager.popBackStack()
        }

        binding.btnSubmit.setOnClickListener {
            validateAndSubmit()
        }
    }

    private fun validateAndSubmit() {
        val symptoms = binding.etSymptoms.text.toString().trim()
        val diagnosis = binding.etDiagnosis.text.toString().trim()
        val prescription = binding.etPrescription.text.toString().trim()
        val remarks = binding.etRemarks.text.toString().trim()

        if (symptoms.isEmpty() || diagnosis.isEmpty()) {
            showSnackbar("Symptoms and Diagnosis are required fields", isError = true)
            return
        }

        binding.progressBar.visibility = View.VISIBLE
        binding.btnSubmit.isEnabled = false

        val context = requireContext()
        val staffId = TokenManager.getUserId(context)

        // Generate date in ISO 8601 OffsetDateTime format
        val currentOffsetDateTime = OffsetDateTime.now()
        val formattedDate = currentOffsetDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

        val request = ConsultationRequest(
            patientId = patientId,
            staffId = staffId,
            symptoms = symptoms,
            diagnosis = diagnosis,
            medicinePrescribed = prescription,
            remarks = remarks,
            consultationDate = formattedDate
        )

        lifecycleScope.launch {
            try {
                val service = RetrofitClient.authInstance.create(ConsultationService::class.java)
                val response = service.createConsultation(request)

                if (response.isSuccessful) {
                    showSnackbar("Consultation logged successfully!")
                    
                    // If queueId is valid, update its queue status to DONE
                    if (queueId > 0L) {
                        updateQueueToDone()
                    } else {
                        parentFragmentManager.popBackStack()
                    }
                } else {
                    showSnackbar("Failed to log consultation: ${response.message()}", isError = true)
                    binding.progressBar.visibility = View.GONE
                    binding.btnSubmit.isEnabled = true
                }
            } catch (e: Exception) {
                showSnackbar("Error logging consultation: ${e.localizedMessage}", isError = true)
                binding.progressBar.visibility = View.GONE
                binding.btnSubmit.isEnabled = true
            }
        }
    }

    private suspend fun updateQueueToDone() {
        try {
            val qService = RetrofitClient.authInstance.create(QueueService::class.java)
            // Create minimal QueueItem
            val updatedQueueItem = QueueItem(
                id = queueId,
                queueNumber = "",
                status = "DONE",
                arrivalTime = null,
                assignedDoctor = null,
                patient = null
            )
            qService.updateQueueItem(queueId, updatedQueueItem)
        } catch (e: Exception) {
            // Silently ignore or show quick warning since consultation is already saved
            e.printStackTrace()
        } finally {
            parentFragmentManager.popBackStack()
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
