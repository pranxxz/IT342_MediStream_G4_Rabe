package com.medistream.patient.confirmation

import android.os.Bundle
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityQueueConfirmationBinding

class QueueConfirmationActivity : BaseActivity() {
    private lateinit var binding: ActivityQueueConfirmationBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQueueConfirmationBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}
