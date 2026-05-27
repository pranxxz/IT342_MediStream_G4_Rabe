package com.medistream.staff.patients

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.ViewModelProvider
import com.medistream.R
import com.medistream.databinding.DialogAddPatientBinding

class AddPatientDialogFragment : DialogFragment() {

    private var _binding: DialogAddPatientBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: PatientViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setStyle(STYLE_NO_TITLE, R.style.CustomDialogTheme)
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = DialogAddPatientBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(requireParentFragment())[PatientViewModel::class.java]

        binding.btnSave.setOnClickListener { savePatient() }
        binding.btnCancel.setOnClickListener { dismiss() }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.btnSave.isEnabled = !isLoading
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                binding.tilFirstName.error = error
            }
        }
    }

    private fun savePatient() {
        val firstName = binding.etFirstName.text.toString().trim()
        val lastName = binding.etLastName.text.toString().trim()
        val age = binding.etAge.text.toString().trim().toIntOrNull()
        val gender = if (binding.rbMale.isChecked) "Male" else "Female"
        val address = binding.etAddress.text.toString().trim()
        val contact = binding.etContact.text.toString().trim()

        if (firstName.isEmpty()) { binding.tilFirstName.error = "Required"; return }
        if (lastName.isEmpty()) { binding.tilLastName.error = "Required"; return }

        val patient = PatientEntity(
            patientId = 0,
            firstName = firstName,
            lastName = lastName,
            fullName = "$firstName $lastName",
            age = age,
            gender = gender,
            address = address.ifEmpty { null },
            contactNumber = contact.ifEmpty { null },
            status = "Waiting",
            assignedDoctor = null,
            lastVisit = null
        )

        viewModel.createPatient(patient)

        // Observe once for success — dismiss on next successful fetch
        viewModel.patientList.observe(viewLifecycleOwner) {
            if (viewModel.isLoading.value == false) dismiss()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
