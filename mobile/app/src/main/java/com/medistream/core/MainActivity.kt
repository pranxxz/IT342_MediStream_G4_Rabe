package com.medistream.core

import android.content.Intent
import android.os.Bundle
import com.medistream.core.network.TokenManager
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityMainBinding
import com.medistream.auth.login.LoginActivity
import com.medistream.patient.queue.PatientQueueActivity
import com.medistream.staff.home.StaffHomeActivity

class MainActivity : BaseActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Auto-login redirection for logged-in staff
        if (!TokenManager.getToken(this).isNullOrEmpty()) {
            val intent = Intent(this, StaffHomeActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            finish()
            return
        }

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnPatient.setOnClickListener {
            startActivity(Intent(this, PatientQueueActivity::class.java))
        }

        binding.btnStaffLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }
}
