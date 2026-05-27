package com.medistream.auth.register

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.lifecycle.ViewModelProvider
import com.medistream.auth.login.LoginActivity
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityRegisterBinding

class RegisterActivity : BaseActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private lateinit var viewModel: RegisterViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[RegisterViewModel::class.java]

        viewModel.clearResult()

        binding.btnRegister.setOnClickListener {
            val staffId = binding.etRegStaffId.text.toString().trim()
            val fName = binding.etRegFirstName.text.toString().trim()
            val lName = binding.etRegLastName.text.toString().trim()
            val email = binding.etRegEmail.text.toString().trim()
            val pass = binding.etRegPassword.text.toString().trim()
            val confirmPass = binding.etRegConfirmPassword.text.toString().trim()

            if (staffId.isEmpty() || fName.isEmpty() || lName.isEmpty() || email.isEmpty() || pass.isEmpty() || confirmPass.isEmpty()) {
                showSnackbar("All fields including Staff ID are required", isError = true)
                return@setOnClickListener
            }

            if (pass.length < 6) {
                showSnackbar("Password must be at least 6 characters", isError = true)
                return@setOnClickListener
            }

            if (pass != confirmPass) {
                showSnackbar("Passwords do not match", isError = true)
                return@setOnClickListener
            }

            viewModel.register(fName, lName, email, pass)
        }

        binding.tvToLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        setupObservers()
    }

    private fun setupObservers() {
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnRegister.isEnabled = !isLoading
        }

        viewModel.registerResult.observe(this) { result ->
            if (result == null) return@observe

            if (result.isSuccess) {
                showSnackbar("Registration Successful! Please log in.")
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            } else {
                val exception = result.exceptionOrNull()
                val errorMsg = exception?.message ?: "Registration failed. Check your fields or network."
                showSnackbar(errorMsg, isError = true)
            }
        }
    }
}
