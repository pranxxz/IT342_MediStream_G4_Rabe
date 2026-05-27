package com.medistream.staff.medicalstaff

import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.medistream.databinding.ItemMedicalStaffBinding

class MedicalStaffAdapter(
    private val onStaffClicked: (MedicalStaffEntity) -> Unit
) : ListAdapter<MedicalStaffEntity, MedicalStaffAdapter.ViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemMedicalStaffBinding.inflate(
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
        private val binding: ItemMedicalStaffBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: MedicalStaffEntity) {
            binding.tvStaffName.text = item.name ?: "Unnamed Staff"
            
            val specialty = item.specialty ?: "General Practice"
            val department = item.department ?: "General Medicine"
            binding.tvStaffRole.text = "$specialty | $department"
            
            binding.tvStaffContact.text = if (!item.contactNo.isNullOrEmpty()) "Contact: ${item.contactNo}" else "No contact number"

            // Set up availability status badge
            val status = item.availability?.lowercase() ?: "available"
            binding.tvStaffStatus.text = status.uppercase()

            when (status) {
                "available" -> {
                    binding.tvStaffStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#388E3C"))
                }
                "busy" -> {
                    binding.tvStaffStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFA000"))
                }
                "offline" -> {
                    binding.tvStaffStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#D32F2F"))
                }
                else -> {
                    binding.tvStaffStatus.backgroundTintList = ColorStateList.valueOf(Color.parseColor("#757575"))
                }
            }

            binding.root.setOnClickListener {
                onStaffClicked(item)
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<MedicalStaffEntity>() {
        override fun areItemsTheSame(oldItem: MedicalStaffEntity, newItem: MedicalStaffEntity): Boolean {
            return oldItem.staffID == newItem.staffID
        }

        override fun areContentsTheSame(oldItem: MedicalStaffEntity, newItem: MedicalStaffEntity): Boolean {
            return oldItem == newItem
        }
    }
}
