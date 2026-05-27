package com.medistream.patient.queue

import android.app.Dialog
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.View
import android.view.Window
import android.widget.ArrayAdapter
import androidx.activity.viewModels
import com.medistream.R
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityPatientRegisterBinding
import com.medistream.databinding.DialogQueueConfirmationBinding
import com.medistream.patient.confirmation.QueueConfirmationActivity

class PatientQueueActivity : BaseActivity() {
    private lateinit var binding: ActivityPatientRegisterBinding
    private val viewModel: PatientQueueViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPatientRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupGenderDropdown()

        binding.btnSubmit.setOnClickListener {
            submitForm()
        }

        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnSubmit.isEnabled = !isLoading
        }

        viewModel.queueSubmissionResult.observe(this) { response ->
            if (response != null) {
                showConfirmationModal(response.queueNumber)
            }
        }

        viewModel.errorMessage.observe(this) { err ->
            showSnackbar(err, isError = true)
        }
    }

    private fun setupGenderDropdown() {
        val genders = arrayOf("Male", "Female", "Other")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, genders)
        binding.spinnerGender.setAdapter(adapter)
    }

    private fun submitForm() {
        val firstName = binding.etFirstName.text.toString().trim()
        val lastName = binding.etLastName.text.toString().trim()
        val ageStr = binding.etAge.text.toString().trim()
        val gender = binding.spinnerGender.text.toString().trim()
        val contactNo = binding.etContact.text.toString().trim()
        val address = binding.etAddress.text.toString().trim()

        if (firstName.isEmpty()) {
            showSnackbar("First Name is required", isError = true)
            return
        }
        if (lastName.isEmpty()) {
            showSnackbar("Last Name is required", isError = true)
            return
        }
        if (ageStr.isEmpty()) {
            showSnackbar("Age is required", isError = true)
            return
        }
        val age = ageStr.toIntOrNull()
        if (age == null || age <= 0) {
            showSnackbar("Please enter a valid age", isError = true)
            return
        }
        if (gender.isEmpty()) {
            showSnackbar("Gender selection is required", isError = true)
            return
        }
        if (contactNo.isEmpty()) {
            showSnackbar("Contact Number is required", isError = true)
            return
        }

        viewModel.submitQueue(firstName, lastName, age, gender, contactNo, address)
    }

    private fun showConfirmationModal(queueNumber: String) {
        val dialog = Dialog(this)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        val dialogBinding = DialogQueueConfirmationBinding.inflate(layoutInflater)
        dialog.setContentView(dialogBinding.root)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.setCancelable(false)

        dialogBinding.tvDialogQueueNumber.text = queueNumber
        dialogBinding.btnDialogDismiss.setOnClickListener {
            dialog.dismiss()
            val intent = Intent(this, QueueConfirmationActivity::class.java).apply {
                putExtra("KEY_ACTIVE_NUMBER", queueNumber)
            }
            startActivity(intent)
            finish()
        }
        dialog.show()
    }
}
