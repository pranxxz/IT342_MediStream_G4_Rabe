package com.medistream.staff.patients

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemPatientDirectoryBinding

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
            binding.tvPatientDemographics.text = "${item.gender ?: "Unknown"}, ${item.age ?: "-"} yrs old"
            binding.tvContact.text = "Contact: ${item.contactNumber ?: "None"}"
            binding.tvLastVisit.text = "Last visit: ${formatLastVisit(item.lastVisit)}"

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
