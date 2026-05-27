package com.medistream.staff.home

import android.content.res.ColorStateList
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.medistream.R
import com.medistream.databinding.ItemRecentQueueBinding
import com.medistream.staff.queue.QueueItem

class RecentQueueAdapter(private var items: List<QueueItem> = emptyList()) :
    RecyclerView.Adapter<RecentQueueAdapter.ViewHolder>() {

    fun updateData(newItems: List<QueueItem>) {
        items = newItems
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemRecentQueueBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class ViewHolder(private val binding: ItemRecentQueueBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: QueueItem) {
            binding.tvQueueNo.text = item.queueNumber
            
            val p = item.patient
            binding.tvPatientName.text = if (p != null) "${p.firstName} ${p.lastName}" else "Unknown Patient"
            binding.tvStatusBadge.text = item.status

            val context = binding.root.context
            val statusColor = when (item.status.lowercase()) {
                "waiting" -> context.getColor(R.color.status_waiting)
                "in_progress", "in progress" -> context.getColor(R.color.status_in_progress)
                "done" -> context.getColor(R.color.status_done)
                else -> context.getColor(R.color.status_cancelled)
            }
            binding.tvStatusBadge.background = context.getDrawable(R.drawable.button_background_maroon)
            binding.tvStatusBadge.backgroundTintList = ColorStateList.valueOf(statusColor)
        }
    }
}
