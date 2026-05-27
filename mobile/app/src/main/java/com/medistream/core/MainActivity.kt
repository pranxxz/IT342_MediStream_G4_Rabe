package com.medistream.core

import android.content.Intent
import android.os.Bundle
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityMainBinding
import com.medistream.patient.queue.PatientQueueActivity

class MainActivity : BaseActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnJoinQueue.setOnClickListener {
            startActivity(Intent(this, PatientQueueActivity::class.java))
        }
    }
}