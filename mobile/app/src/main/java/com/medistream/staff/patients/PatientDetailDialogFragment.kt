package com.medistream.staff.patients

import android.content.res.ColorStateList
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.medistream.R
import com.medistream.databinding.DialogPatientDetailBinding

class PatientDetailDialogFragment : DialogFragment() {

    private var _binding: DialogPatientDetailBinding? = null
    private val binding get() = _binding!!

    private var patientId: Int = 0
    private var firstName: String = ""
    private var lastName: String = ""
    private var fullName: String = ""
    private var age: Int = 0
    private var gender: String = ""
    private var contactNumber: String = ""
    private var address: String = ""
    private var status: String = ""
    private var assignedDoctor: String = ""

    companion object {
        private const val ARG_PATIENT_ID = "patient_id"
        private const val ARG_FIRST_NAME = "first_name"
        private const val ARG_LAST_NAME = "last_name"
        private const val ARG_FULL_NAME = "full_name"
        private const val ARG_AGE = "age"
        private const val ARG_GENDER = "gender"
        private const val ARG_CONTACT = "contact"
        private const val ARG_ADDRESS = "address"
        private const val ARG_STATUS = "status"
        private const val ARG_DOCTOR = "doctor"

        fun newInstance(patient: PatientEntity): PatientDetailDialogFragment {
            return PatientDetailDialogFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_PATIENT_ID, patient.patientId)
                    putString(ARG_FIRST_NAME, patient.firstName)
                    putString(ARG_LAST_NAME, patient.lastName)
                    putString(ARG_FULL_NAME, patient.fullName ?: "${patient.firstName} ${patient.lastName}")
                    putInt(ARG_AGE, patient.age ?: 0)
                    putString(ARG_GENDER, patient.gender ?: "Unknown")
                    putString(ARG_CONTACT, patient.contactNumber ?: "")
                    putString(ARG_ADDRESS, patient.address ?: "")
                    putString(ARG_STATUS, patient.status ?: "ACTIVE")
                    putString(ARG_DOCTOR, patient.assignedDoctor ?: "Unassigned")
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NO_TITLE, R.style.CustomDialogTheme)
        arguments?.let {
            patientId = it.getInt(ARG_PATIENT_ID)
            firstName = it.getString(ARG_FIRST_NAME) ?: ""
            lastName = it.getString(ARG_LAST_NAME) ?: ""
            fullName = it.getString(ARG_FULL_NAME) ?: ""
            age = it.getInt(ARG_AGE)
            gender = it.getString(ARG_GENDER) ?: ""
            contactNumber = it.getString(ARG_CONTACT) ?: ""
            address = it.getString(ARG_ADDRESS) ?: ""
            status = it.getString(ARG_STATUS) ?: "ACTIVE"
            assignedDoctor = it.getString(ARG_DOCTOR) ?: "Unassigned"
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogPatientDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Bind data
        binding.tvPatientName.text = fullName
        binding.tvPatientId.text = "ID: #$patientId"
        binding.tvPatientAgeGender.text = "${age} yrs old · ${gender}"
        binding.tvPatientContact.text = if (contactNumber.isNotEmpty()) contactNumber else "No contact number"
        binding.tvPatientAddress.text = if (address.isNotEmpty()) address else "No address listed"
        binding.tvPatientDoctor.text = assignedDoctor
        binding.tvPatientStatus.text = status.uppercase()

        val initials = if (fullName.isNotEmpty()) {
            val parts = fullName.trim().split("\\s+".toRegex())
            if (parts.size >= 2) {
                "${parts[0][0]}${parts[1][0]}".uppercase()
            } else {
                "${parts[0][0]}".uppercase()
            }
        } else {
            "P"
        }
        binding.tvAvatarInitials.text = initials

        // Badge styling based on status
        val context = binding.root.context
        val badgeColor = when (status.uppercase()) {
            "ACTIVE", "DONE", "COMPLETED" -> context.getColor(R.color.status_completed)
            "WAITING" -> context.getColor(R.color.status_waiting)
            "IN_PROGRESS", "IN PROGRESS", "CONSULTING" -> context.getColor(R.color.status_consulting)
            else -> context.getColor(R.color.brand_primary)
        }
        val badgeColorBg = when (status.uppercase()) {
            "ACTIVE", "DONE", "COMPLETED" -> context.getColor(R.color.status_completed_bg)
            "WAITING" -> context.getColor(R.color.status_waiting_bg)
            "IN_PROGRESS", "IN PROGRESS", "CONSULTING" -> context.getColor(R.color.status_consulting_bg)
            else -> context.getColor(R.color.status_waiting_bg)
        }
        binding.tvPatientStatus.background = context.getDrawable(R.drawable.bg_status_badge)
        binding.tvPatientStatus.backgroundTintList = ColorStateList.valueOf(badgeColorBg)
        binding.tvPatientStatus.setTextColor(badgeColor)

        // Listeners
        binding.btnCloseDialog.setOnClickListener {
            dismiss()
        }

        binding.btnViewHistory.setOnClickListener {
            dismiss()
            // Navigate to detail fragment
            val fragment = PatientDetailFragment.newInstance(
                patientId = patientId,
                fullName = fullName,
                age = age,
                gender = gender,
                contactNumber = contactNumber,
                address = address
            )
            parentFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .addToBackStack(null)
                .commit()
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
