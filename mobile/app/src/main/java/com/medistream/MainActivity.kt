package com.medistream

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    // Values match your backend requirements
    private val roles = listOf("staff", "doctor", "nurse", "patient")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Initialize Views with correct types to match activity_main.xml
        val btnRegister = findViewById<Button>(R.id.btnRegister)
        val tvToLogin = findViewById<TextView>(R.id.tvToLogin)

        // Fix: Changed from Spinner to AutoCompleteTextView to stop the crash
        val roleDropdown = findViewById<AutoCompleteTextView>(R.id.spinnerRole)

        val etFirstName = findViewById<EditText>(R.id.etFirstName)
        val etLastName = findViewById<EditText>(R.id.etLastName)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)

        // 2. Set up Material Dropdown Adapter
        // Using simple_list_item_1 which works better for Material AutoComplete views
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, roles)
        roleDropdown.setAdapter(adapter)

        // Optional: Pre-select the first role so the field isn't empty
        roleDropdown.setText(roles[0], false)

        // 3. Registration Logic
        btnRegister.setOnClickListener {
            val fName = etFirstName.text.toString().trim()
            val lName = etLastName.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val pass = etPassword.text.toString().trim()

            // Fix: Get selected role text directly from the AutoCompleteTextView
            val role = roleDropdown.text.toString()

            if (fName.isEmpty() || email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "First name, email and password are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (pass.length < 6) {
                Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Provide UI feedback
            btnRegister.isEnabled = false
            btnRegister.text = "Registering..."

            // 4. API Call
            val request = RegisterRequest(fName, lName, email, pass, role)
            RetrofitClient.instance.register(request).enqueue(object : Callback<AuthResponse> {
                override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                    btnRegister.isEnabled = true
                    btnRegister.text = "Sign up"

                    when (response.code()) {
                        201 -> {
                            response.body()?.token?.let { token ->
                                getSharedPreferences("medistream_prefs", MODE_PRIVATE)
                                    .edit().putString("auth_token", token).apply()
                            }
                            Toast.makeText(this@MainActivity, "Registration Successful!", Toast.LENGTH_SHORT).show()
                            startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                            finish()
                        }
                        409 -> {
                            Toast.makeText(this@MainActivity, "Email already registered. Please login.", Toast.LENGTH_LONG).show()
                        }
                        400 -> {
                            val msg = response.body()?.message ?: "Invalid input"
                            Toast.makeText(this@MainActivity, "Error: $msg", Toast.LENGTH_LONG).show()
                        }
                        else -> {
                            // ✅ Log goes HERE inside onResponse
                            android.util.Log.e("RETROFIT", "HTTP ${response.code()}: ${response.errorBody()?.string()}")
                            Toast.makeText(this@MainActivity, "Registration Failed: ${response.body()?.message}", Toast.LENGTH_LONG).show()
                        }
                    }
                }

                override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                    btnRegister.isEnabled = true
                    btnRegister.text = "Sign up"
                    // ✅ Log goes HERE inside onFailure
                    android.util.Log.e("RETROFIT", "FAILURE: ${t.message}", t)
                    Toast.makeText(this@MainActivity, "Server Error: Check your connection.", Toast.LENGTH_LONG).show()
                }
            })
        }

        // 5. Navigation to Login screen
        tvToLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }
}