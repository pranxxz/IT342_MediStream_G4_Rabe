package com.medistream.staff.patients

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemPatientDirectoryBinding
import com.medistream.R

class PatientAdapter(
    private val onPatientClicked: (PatientEntity) -> Unit
) : ListAdapter<PatientEntity, PatientAdapter.PatientViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PatientViewHolder {
        val binding = ItemPatientDirectoryBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return PatientViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PatientViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class PatientViewHolder(
        private val binding: ItemPatientDirectoryBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: PatientEntity) {
            val name = item.fullName ?: "${item.firstName} ${item.lastName}"
            binding.tvPatientName.text = name
            binding.tvPatientId.text = "ID: #${item.patientId}"
            binding.tvPatientDemographics.text = "${item.age ?: "-"} yrs · ${item.gender ?: "Unknown"}"
            binding.tvContact.text = "Contact: ${item.contactNumber ?: "None"}"
            binding.tvLastVisit.text = "Last visit: ${formatLastVisit(item.lastVisit)}"

            val fn = if (item.firstName.isNotEmpty()) item.firstName[0].toString() else ""
            val ln = if (item.lastName.isNotEmpty()) item.lastName[0].toString() else ""
            binding.tvAvatarInitials.text = (fn + ln).uppercase().ifEmpty { "P" }

            val statusStr = item.status ?: "Waiting"
            binding.tvStatusBadge.text = statusStr

            val context = binding.root.context
            val statusColor = when (statusStr.lowercase()) {
                "waiting" -> context.getColor(R.color.status_waiting)
                "consulting" -> context.getColor(R.color.status_consulting)
                "completed", "done" -> context.getColor(R.color.status_completed)
                else -> context.getColor(R.color.status_waiting)
            }
            val statusColorBg = when (statusStr.lowercase()) {
                "waiting" -> context.getColor(R.color.status_waiting_bg)
                "consulting" -> context.getColor(R.color.status_consulting_bg)
                "completed", "done" -> context.getColor(R.color.status_completed_bg)
                else -> context.getColor(R.color.status_waiting_bg)
            }
            binding.tvStatusBadge.background = context.getDrawable(R.drawable.bg_status_badge)
            binding.tvStatusBadge.backgroundTintList = android.content.res.ColorStateList.valueOf(statusColorBg)
            binding.tvStatusBadge.setTextColor(statusColor)

            binding.root.setOnClickListener {
                onPatientClicked(item)
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<PatientEntity>() {
        override fun areItemsTheSame(oldItem: PatientEntity, newItem: PatientEntity): Boolean {
            return oldItem.patientId == newItem.patientId
        }

        override fun areContentsTheSame(oldItem: PatientEntity, newItem: PatientEntity): Boolean {
            return oldItem == newItem
        }
    }
}
