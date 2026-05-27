package com.medistream.staff.queue

import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemQueuePatientBinding

class QueueAdapter(
    private val onStartConsultation: (QueueItem) -> Unit,
    private val onLogVisit: (QueueItem) -> Unit
) : ListAdapter<QueueItem, QueueAdapter.QueueViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): QueueViewHolder {
        val binding = ItemQueuePatientBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return QueueViewHolder(binding)
    }

    override fun onBindViewHolder(holder: QueueViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class QueueViewHolder(
        private val binding: ItemQueuePatientBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: QueueItem) {
            binding.tvQueueNumber.text = item.queueNumber
            
            val patient = item.patient
            if (patient != null) {
                binding.tvPatientName.text = patient.fullName
                binding.tvPatientDetails.text = "${patient.gender ?: "Unknown gender"}, ${patient.age ?: "-"} years old"
            } else {
                binding.tvPatientName.text = "Unknown Patient"
                binding.tvPatientDetails.text = "-"
            }

            binding.tvArrivalTime.text = "Arr: ${item.arrivalTime ?: "--:--"}"
            binding.tvAssignedDoctor.text = item.assignedDoctor ?: "Unassigned"

            // Set up badge status colors
            val status = item.status.uppercase()
            binding.tvQueueStatus.text = status

            when (status) {
                "WAITING" -> {
                    binding.tvQueueStatus.setTextColor(Color.parseColor("#FFA000"))
                    binding.tvQueueStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFF3CD"))
                    
                    binding.btnPrimaryAction.visibility = View.VISIBLE
                    binding.btnPrimaryAction.text = "Start Consultation"
                    binding.btnPrimaryAction.setOnClickListener { onStartConsultation(item) }
                }
                "CONSULTING" -> {
                    binding.tvQueueStatus.setTextColor(Color.parseColor("#1976D2"))
                    binding.tvQueueStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#D1ECF1"))
                    
                    binding.btnPrimaryAction.visibility = View.VISIBLE
                    binding.btnPrimaryAction.text = "Log Consultation"
                    binding.btnPrimaryAction.setOnClickListener { onLogVisit(item) }
                }
                else -> { // DONE / OTHER
                    binding.tvQueueStatus.setTextColor(Color.parseColor("#388E3C"))
                    binding.tvQueueStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#D4EDDA"))
                    
                    binding.btnPrimaryAction.visibility = View.GONE
                }
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<QueueItem>() {
        override fun areItemsTheSame(oldItem: QueueItem, newItem: QueueItem): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: QueueItem, newItem: QueueItem): Boolean {
            return oldItem == newItem
        }
    }
}
