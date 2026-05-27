package com.medistream.patient.queue

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import androidx.lifecycle.ViewModelProvider
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityPatientQueueBinding
import com.medistream.patient.confirmation.QueueConfirmationActivity

class PatientQueueActivity : BaseActivity() {

    private lateinit var binding: ActivityPatientQueueBinding
    private lateinit var viewModel: PatientQueueViewModel

    private val genders = listOf("Male", "Female", "Other")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPatientQueueBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar(binding.toolbar, "Register Queue", showBackButton = true)

        viewModel = ViewModelProvider(this)[PatientQueueViewModel::class.java]

        // Setup dropdown
        val genderAdapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, genders)
        binding.spinnerGender.setAdapter(genderAdapter)
        binding.spinnerGender.setText(genders[0], false)

        binding.btnSubmit.setOnClickListener {
            val fName = binding.etFirstName.text.toString().trim()
            val lName = binding.etLastName.text.toString().trim()
            val ageStr = binding.etAge.text.toString().trim()
            val gender = binding.spinnerGender.text.toString()
            val contact = binding.etContact.text.toString().trim()
            val address = binding.etAddress.text.toString().trim()

            // Clear errors
            binding.tilFirstName.error = null
            binding.tilLastName.error = null
            binding.tilAge.error = null
            binding.tilContact.error = null
            binding.tilAddress.error = null

            var hasError = false

            if (fName.isEmpty()) {
                binding.tilFirstName.error = "First name is required"
                hasError = true
            }
            if (lName.isEmpty()) {
                binding.tilLastName.error = "Last name is required"
                hasError = true
            }
            if (ageStr.isEmpty()) {
                binding.tilAge.error = "Age is required"
                hasError = true
            }
            if (contact.isEmpty()) {
                binding.tilContact.error = "Contact number is required"
                hasError = true
            }
            if (address.isEmpty()) {
                binding.tilAddress.error = "Address is required"
                hasError = true
            }

            if (hasError) return@setOnClickListener

            val age = ageStr.toIntOrNull() ?: 0
            viewModel.joinQueue(fName, lName, age, gender, contact, address)
        }

        setupObservers()
    }

    private fun setupObservers() {
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnSubmit.isEnabled = !isLoading
        }

        viewModel.joinResult.observe(this) { result ->
            if (result == null) return@observe

            if (result.isSuccess) {
                val response = result.getOrNull()
                if (response != null) {
                    val intent = Intent(this, QueueConfirmationActivity::class.java).apply {
                        putExtra("QUEUE_NUMBER", response.queueNumber)
                        putExtra("PATIENT_NAME", response.patientName)
                        putExtra("STATUS", response.status)
                        putExtra("ESTIMATED_TIME", response.estimatedTime)
                    }
                    startActivity(intent)
                    finish()
                } else {
                    showSnackbar("Failed to parse queue details", isError = true)
                }
            } else {
                val exception = result.exceptionOrNull()
                showSnackbar(exception?.message ?: "Server error joining the queue", isError = true)
            }
        }
    }
}
