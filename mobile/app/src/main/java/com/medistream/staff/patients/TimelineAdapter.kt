package com.medistream.staff.patients

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemConsultationTimelineBinding
import com.medistream.staff.consultations.ConsultationItem
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class TimelineAdapter : ListAdapter<ConsultationItem, TimelineAdapter.TimelineViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TimelineViewHolder {
        val binding = ItemConsultationTimelineBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return TimelineViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TimelineViewHolder, position: Int) {
        holder.bind(getItem(position), position == itemCount - 1)
    }

    inner class TimelineViewHolder(
        private val binding: ItemConsultationTimelineBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: ConsultationItem, isLast: Boolean) {
            binding.tvTimelineDoctor.text = item.doctorName ?: "Unassigned Doctor"
            binding.tvTimelineDate.text = formatDate(item.consultationDate)
            binding.tvTimelineSymptoms.text = "Symptoms: ${item.symptoms ?: "None recorded"}"
            binding.tvTimelineDiagnosis.text = "Diagnosis: ${item.diagnosis ?: "No diagnosis"}"
            binding.tvTimelinePrescription.text = "Prescription: ${item.medicinePrescribed ?: "None"}"
            binding.tvTimelineRemarks.text = "Remarks: ${item.remarks ?: "None"}"

            // Hide bottom part of vertical track if it's the last item in the list
            binding.timelineLine.visibility = if (isLast) View.INVISIBLE else View.VISIBLE
        }

        private fun formatDate(rawDate: String?): String {
            if (rawDate.isNullOrEmpty() || rawDate == "No Date") return "No Date"
            return try {
                val parsed = OffsetDateTime.parse(rawDate)
                val formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy - hh:mm a", Locale.ENGLISH)
                parsed.format(formatter)
            } catch (e: Exception) {
                // If it fails to parse, check if it is already formatted or just return raw
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
