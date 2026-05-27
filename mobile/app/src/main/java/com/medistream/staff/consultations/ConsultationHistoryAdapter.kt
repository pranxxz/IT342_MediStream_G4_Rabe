package com.medistream.staff.consultations

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemConsultationTimelineBinding
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class ConsultationHistoryAdapter(
    private val onConsultationClicked: (ConsultationItem) -> Unit
) : ListAdapter<ConsultationItem, ConsultationHistoryAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemConsultationTimelineBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ViewHolder(
        private val binding: ItemConsultationTimelineBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: ConsultationItem) {
            // Hide timeline indicators for general flat list
            binding.timelineDot.visibility = View.GONE
            binding.timelineLine.visibility = View.GONE
            
            // Adjust margin of the card so it takes full width
            val params = binding.cardTimeline.layoutParams as ViewGroup.MarginLayoutParams
            params.marginStart = 0
            binding.cardTimeline.layoutParams = params

            // Bind values
            val patientText = if (!item.patientName.isNullOrEmpty()) "Patient: ${item.patientName}" else "Patient ID: #${item.cleanPatientId}"
            binding.tvTimelineDoctor.text = "${item.doctorName ?: "Doctor"} | $patientText"
            
            binding.tvTimelineDate.text = formatDate(item.consultationDate)
            binding.tvTimelineSymptoms.text = "Symptoms: ${item.symptoms ?: "None recorded"}"
            binding.tvTimelineDiagnosis.text = "Diagnosis: ${item.diagnosis ?: "No diagnosis"}"
            binding.tvTimelinePrescription.text = "Prescription: ${item.medicinePrescribed ?: "None"}"
            binding.tvTimelineRemarks.text = "Remarks: ${item.remarks ?: "None"}"

            binding.root.setOnClickListener {
                onConsultationClicked(item)
            }
        }

        private fun formatDate(rawDate: String?): String {
            if (rawDate.isNullOrEmpty() || rawDate == "No Date") return "No Date"
            return try {
                val parsed = OffsetDateTime.parse(rawDate)
                val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy - hh:mm a", Locale.ENGLISH)
                parsed.format(formatter)
            } catch (e: Exception) {
                rawDate.split("T").firstOrNull() ?: rawDate
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<ConsultationItem>() {
        override fun areItemsTheSame(oldItem: ConsultationItem, newItem: ConsultationItem): Boolean {
            return oldItem.consultationId == newItem.consultationId
        }

        override fun areContentsTheSame(oldItem: ConsultationItem, newItem: ConsultationItem): Boolean {
            return oldItem == newItem
        }
    }
}
