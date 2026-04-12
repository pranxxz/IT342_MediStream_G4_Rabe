package com.medistream

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvToRegister = findViewById<TextView>(R.id.tvToRegister)

        btnLogin.setOnClickListener {
            val email = findViewById<EditText>(R.id.etLoginEmail).text.toString().trim()
            val pass = findViewById<EditText>(R.id.etLoginPass).text.toString().trim()

            if (email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Email and password are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            btnLogin.isEnabled = false
            btnLogin.text = "Logging in..."

            val request = LoginRequest(email, pass)
            RetrofitClient.instance.login(request).enqueue(object : Callback<AuthResponse> {
                override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                    btnLogin.isEnabled = true
                    btnLogin.text = "Login"

                    if (response.isSuccessful && response.body()?.token != null) {
                        // Store token in SharedPreferences
                        val token = response.body()!!.token!!
                        getSharedPreferences("medistream_prefs", MODE_PRIVATE)
                            .edit().putString("auth_token", token).apply()

                        Toast.makeText(this@LoginActivity, "Login Successful!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@LoginActivity, HomeActivity::class.java))
                        finish()
                    } else {
                        val msg = response.body()?.message ?: "Invalid credentials"
                        Toast.makeText(this@LoginActivity, msg, Toast.LENGTH_LONG).show()
                    }
                }

                override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                    btnLogin.isEnabled = true
                    btnLogin.text = "Login"
                    Toast.makeText(this@LoginActivity, "Cannot connect to server. Check your WiFi and server IP.", Toast.LENGTH_LONG).show()
                }
            })
        }

        tvToRegister.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
        }
    }
}