package com.medistream.staff.consultations

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.medistream.R
import com.medistream.databinding.DialogConsultationDetailBinding
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class ConsultationDetailDialogFragment : DialogFragment() {

    private var _binding: DialogConsultationDetailBinding? = null
    private val binding get() = _binding!!

    private var consultationId: Int = 0
    private var diagnosis: String = ""
    private var remarks: String = ""
    private var symptoms: String = ""
    private var medicinePrescribed: String = ""
    private var consultationDate: String = ""
    private var doctorName: String = ""
    private var patientId: String = ""
    private var patientName: String = ""

    companion object {
        private const val ARG_CONSULTATION_ID = "consultation_id"
        private const val ARG_DIAGNOSIS = "diagnosis"
        private const val ARG_REMARKS = "remarks"
        private const val ARG_SYMPTOMS = "symptoms"
        private const val ARG_MEDICINE = "medicine"
        private const val ARG_DATE = "date"
        private const val ARG_DOCTOR = "doctor"
        private const val ARG_PATIENT_ID = "patient_id"
        private const val ARG_PATIENT_NAME = "patient_name"

        fun newInstance(item: ConsultationItem): ConsultationDetailDialogFragment {
            return ConsultationDetailDialogFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_CONSULTATION_ID, item.consultationId)
                    putString(ARG_DIAGNOSIS, item.diagnosis ?: "No diagnosis")
                    putString(ARG_REMARKS, item.remarks ?: "None")
                    putString(ARG_SYMPTOMS, item.symptoms ?: "None recorded")
                    putString(ARG_MEDICINE, item.medicinePrescribed ?: "None")
                    putString(ARG_DATE, item.consultationDate ?: "")
                    putString(ARG_DOCTOR, item.doctorName ?: "Doctor")
                    putString(ARG_PATIENT_ID, item.cleanPatientId)
                    putString(ARG_PATIENT_NAME, item.patientName ?: "Patient")
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NO_TITLE, R.style.CustomDialogTheme)
        arguments?.let {
            consultationId = it.getInt(ARG_CONSULTATION_ID)
            diagnosis = it.getString(ARG_DIAGNOSIS) ?: "No diagnosis"
            remarks = it.getString(ARG_REMARKS) ?: "None"
            symptoms = it.getString(ARG_SYMPTOMS) ?: "None recorded"
            medicinePrescribed = it.getString(ARG_MEDICINE) ?: "None"
            consultationDate = it.getString(ARG_DATE) ?: ""
            doctorName = it.getString(ARG_DOCTOR) ?: "Doctor"
            patientId = it.getString(ARG_PATIENT_ID) ?: "N/A"
            patientName = it.getString(ARG_PATIENT_NAME) ?: "Patient"
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogConsultationDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Bind data
        binding.tvConsultationPatientName.text = "Patient: $patientName (#$patientId)"
        binding.tvConsultationDoctorName.text = "Doctor: $doctorName"
        binding.tvConsultationDate.text = "Date: ${formatDate(consultationDate)}"
        binding.tvConsultationSymptoms.text = symptoms
        binding.tvConsultationDiagnosis.text = diagnosis
        binding.tvConsultationPrescription.text = medicinePrescribed
        binding.tvConsultationRemarks.text = remarks

        // Close button
        binding.btnCloseDialog.setOnClickListener {
            dismiss()
        }
    }

    private fun formatDate(rawDate: String?): String {
        if (rawDate.isNullOrEmpty() || rawDate == "No Date") return "No Date"
        return try {
            val parsed = OffsetDateTime.parse(rawDate)
            val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy - hh:mm a", Locale.ENGLISH)
            parsed.format(formatter)
        } catch (e: Exception) {
            rawDate.split("T").firstOrNull() ?: rawDate
        }
    }

    override fun onStart() {
        super.onStart()
        dialog?.window?.setLayout(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
