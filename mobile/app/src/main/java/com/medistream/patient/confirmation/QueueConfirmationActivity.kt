package com.medistream.patient.confirmation

import android.os.Bundle
import android.view.LayoutInflater
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import com.medistream.core.ui.BaseActivity
import com.medistream.databinding.ActivityQueueConfirmationBinding
import com.medistream.databinding.ItemPatientQueueBinding
import com.medistream.patient.queue.PatientQueueResponse
import com.medistream.patient.queue.PatientQueueViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class QueueConfirmationActivity : BaseActivity() {
    private lateinit var binding: ActivityQueueConfirmationBinding
    private val viewModel: PatientQueueViewModel by viewModels()
    private var pollJob: Job? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQueueConfirmationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Retrieve "Your Number" from intent extra
        val activeQueueNumber = intent.getStringExtra("KEY_ACTIVE_NUMBER") ?: "—"
        binding.tvYourNumber.text = activeQueueNumber

        // Observe viewmodel
        viewModel.liveQueueDashboardList.observe(this) { queueList ->
            updateDashboard(activeQueueNumber, queueList)
        }

        viewModel.errorMessage.observe(this) { err ->
            showSnackbar(err, isError = true)
        }
    }

    override fun onStart() {
        super.onStart()
        startPolling()
    }

    override fun onStop() {
        super.onStop()
        stopPolling()
    }

    private fun startPolling() {
        stopPolling()
        pollJob = lifecycleScope.launch {
            while (true) {
                viewModel.loadActiveQueueStandings()
                delay(10000) // Poll every 10 seconds to keep standings alive
            }
        }
    }

    private fun stopPolling() {
        pollJob?.cancel()
        pollJob = null
    }

    private fun updateDashboard(yourNumber: String, queueList: List<PatientQueueResponse>) {
        if (queueList.isEmpty()) {
            binding.tvNowServing.text = "—"
            binding.tvTotalPatients.text = "0"
            binding.tvWaiting.text = "0"
            binding.tvConsulting.text = "0"
            binding.tvCompleted.text = "0"
            
            // Clear patients but keep title "Patient Queue" which is the first child view
            val childCount = binding.llPatientListContainer.childCount
            if (childCount > 1) {
                binding.llPatientListContainer.removeViews(1, childCount - 1)
            }
            return
        }

        // Calculatestands
        val nowServing = queueList.find { it.status.uppercase() == "CONSULTING" }?.queueNumber 
            ?: queueList.firstOrNull { it.status.uppercase() == "WAITING" }?.queueNumber 
            ?: "—"
        
        binding.tvNowServing.text = nowServing
        binding.tvTotalPatients.text = queueList.size.toString()
        
        val waitingCount = queueList.count { it.status.uppercase() == "WAITING" }
        val consultingCount = queueList.count { it.status.uppercase() == "CONSULTING" }
        val completedCount = queueList.count { it.status.uppercase() == "COMPLETED" }

        binding.tvWaiting.text = waitingCount.toString()
        binding.tvConsulting.text = consultingCount.toString()
        binding.tvCompleted.text = completedCount.toString()

        // Populate patient list container
        // Keep the first child (TextView for title "Patient Queue"), remove rest
        val childCount = binding.llPatientListContainer.childCount
        if (childCount > 1) {
            binding.llPatientListContainer.removeViews(1, childCount - 1)
        }

        // Add dynamic cards
        queueList.forEach { item ->
            val itemBinding = ItemPatientQueueBinding.inflate(
                LayoutInflater.from(this), 
                binding.llPatientListContainer, 
                false
            )
            
            itemBinding.tvQueueIndex.text = item.queueNumber
            
            val patientNameText = item.patient?.fullName 
                ?: item.patientName 
                ?: "${item.patient?.firstName ?: ""} ${item.patient?.lastName ?: ""}".trim()
            
            itemBinding.tvPatientName.text = if (patientNameText.isNotEmpty()) patientNameText else "Anonymous"
            itemBinding.tvPatientId.text = "ID: ${item.patient?.patientId ?: "—"}"
            
            val statusTitle = item.status.lowercase().replaceFirstChar { 
                if (it.isLowerCase()) it.titlecase() else it.toString() 
            }
            itemBinding.tvStatusBadge.text = statusTitle

            // Optional: Highlight current user's card
            if (item.queueNumber == yourNumber) {
                itemBinding.root.setCardBackgroundColor(android.graphics.Color.parseColor("#fff5f5"))
            }

            binding.llPatientListContainer.addView(itemBinding.root)
        }
    }
}
