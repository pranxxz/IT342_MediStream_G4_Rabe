package com.medistream.auth.login

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.lifecycle.ViewModelProvider
import com.medistream.core.MainActivity
import com.medistream.core.network.TokenManager
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityLoginBinding
import com.medistream.auth.register.RegisterActivity

class LoginActivity : BaseActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[LoginViewModel::class.java]

        // Clear previous navigation flow
        viewModel.clearResult()

        binding.btnLogin.setOnClickListener {
            val email = binding.etLoginEmail.text.toString().trim()
            val password = binding.etLoginPass.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                showSnackbar("Email and password are required", isError = true)
                return@setOnClickListener
            }

            viewModel.login(email, password)
        }

        binding.tvToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        setupObservers()
    }

    private fun setupObservers() {
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnLogin.isEnabled = !isLoading
        }

        viewModel.loginResult.observe(this) { result ->
            if (result == null) return@observe

            if (result.isSuccess) {
                val authResponse = result.getOrNull()
                val token = authResponse?.token
                val user = authResponse?.user

                if (!token.isNullOrEmpty()) {
                    // Extract values from response dynamically and store
                    val medicalStaffMap = user?.get("medicalStaff") as? Map<*, *>

                    val userId = when (val idVal = medicalStaffMap?.get("staffID") ?: user?.get("id")) {
                        is Number -> idVal.toInt()
                        is String -> idVal.toDoubleOrNull()?.toInt() ?: 0
                        else -> 0
                    }

                    val role = user?.get("role") as? String ?: "staff"
                    val rawName = medicalStaffMap?.get("name") as? String
                    val name = rawName?.takeIf { it.isNotBlank() }
                        ?: (user?.get("firstName") as? String)?.takeIf { it.isNotBlank() }
                        ?: "Staff Member"
                    val email = user?.get("email") as? String ?: ""

                    TokenManager.saveToken(this, token)
                    TokenManager.saveUser(this, userId, role, name)
                    TokenManager.saveEmail(this, email)

                    showSnackbar("Login successful!")
                    
                    val intent = Intent(this, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    }
                    startActivity(intent)
                    finish()
                } else {
                    showSnackbar("Login failed: Missing authentication token", isError = true)
                }
            } else {
                val exception = result.exceptionOrNull()
                val errorMsg = exception?.message ?: "Invalid credentials. Please try again."
                showSnackbar(errorMsg, isError = true)
            }
        }
    }
}
