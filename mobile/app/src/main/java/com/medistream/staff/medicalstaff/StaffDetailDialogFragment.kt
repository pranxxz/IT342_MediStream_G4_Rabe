package com.medistream.staff.medicalstaff

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.medistream.R
import com.medistream.databinding.DialogStaffDetailBinding

class StaffDetailDialogFragment : DialogFragment() {

    private var _binding: DialogStaffDetailBinding? = null
    private val binding get() = _binding!!

    private var staffId: Int = 0
    private var name: String = ""
    private var role: String = ""
    private var contactNo: String = ""
    private var specialty: String = ""
    private var age: Int = 0
    private var gender: String = ""
    private var department: String = ""
    private var availability: String = ""

    companion object {
        private const val ARG_STAFF_ID = "staff_id"
        private const val ARG_NAME = "name"
        private const val ARG_ROLE = "role"
        private const val ARG_CONTACT = "contact"
        private const val ARG_SPECIALTY = "specialty"
        private const val ARG_AGE = "age"
        private const val ARG_GENDER = "gender"
        private const val ARG_DEPARTMENT = "department"
        private const val ARG_AVAILABILITY = "availability"

        fun newInstance(staff: MedicalStaffEntity): StaffDetailDialogFragment {
            return StaffDetailDialogFragment().apply {
                arguments = Bundle().apply {
                    putInt(ARG_STAFF_ID, staff.staffID)
                    putString(ARG_NAME, staff.name ?: "Unnamed Staff")
                    putString(ARG_ROLE, staff.role ?: "Staff")
                    putString(ARG_CONTACT, staff.contactNo ?: "")
                    putString(ARG_SPECIALTY, staff.specialty ?: "General Practice")
                    putInt(ARG_AGE, staff.age ?: 0)
                    putString(ARG_GENDER, staff.gender ?: "Unknown")
                    putString(ARG_DEPARTMENT, staff.department ?: "General Medicine")
                    putString(ARG_AVAILABILITY, staff.availability ?: "Available")
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NO_TITLE, R.style.CustomDialogTheme)
        arguments?.let {
            staffId = it.getInt(ARG_STAFF_ID)
            name = it.getString(ARG_NAME) ?: "Unnamed Staff"
            role = it.getString(ARG_ROLE) ?: "Staff"
            contactNo = it.getString(ARG_CONTACT) ?: ""
            specialty = it.getString(ARG_SPECIALTY) ?: "General Practice"
            age = it.getInt(ARG_AGE)
            gender = it.getString(ARG_GENDER) ?: "Unknown"
            department = it.getString(ARG_DEPARTMENT) ?: "General Medicine"
            availability = it.getString(ARG_AVAILABILITY) ?: "Available"
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogStaffDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Bind data
        binding.tvStaffName.text = name
        binding.tvStaffId.text = "ID: #$staffId"
        binding.tvStaffRole.text = role
        binding.tvStaffDepartment.text = department
        binding.tvStaffSpecialty.text = specialty
        binding.tvStaffAgeSex.text = "${if (age > 0) "$age yrs old" else "Age N/A"}, $gender"
        binding.tvStaffContact.text = if (contactNo.isNotEmpty()) contactNo else "No contact number"
        binding.tvStaffStatus.text = availability.uppercase()

        // Status color badge
        val badgeColor = when (availability.lowercase()) {
            "available" -> Color.parseColor("#388E3C")
            "busy" -> Color.parseColor("#FFA000")
            "offline" -> Color.parseColor("#D32F2F")
            else -> Color.parseColor("#757575")
        }
        binding.tvStaffStatus.backgroundTintList = ColorStateList.valueOf(badgeColor)

        // Close button
        binding.btnCloseDialog.setOnClickListener {
            dismiss()
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
