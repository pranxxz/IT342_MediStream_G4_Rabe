package com.medistream.patient.confirmation

import android.content.Intent
import android.os.Bundle
import com.medistream.core.MainActivity
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityQueueConfirmationBinding

class QueueConfirmationActivity : BaseActivity() {

    private lateinit var binding: ActivityQueueConfirmationBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQueueConfirmationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val queueNo = intent.getStringExtra("QUEUE_NUMBER") ?: "N/A"
        val patientName = intent.getStringExtra("PATIENT_NAME") ?: "N/A"
        val status = intent.getStringExtra("STATUS") ?: "Waiting"
        val estTime = intent.getStringExtra("ESTIMATED_TIME") ?: "N/A"

        binding.tvQueueNumber.text = queueNo
        binding.tvPatientName.text = patientName
        binding.tvQueueStatus.text = status
        binding.tvEstTime.text = estTime

        binding.btnDone.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            finish()
        }
    }
}
