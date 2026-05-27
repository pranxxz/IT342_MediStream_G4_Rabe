package com.medistream.staff.queue

import com.medistream.core.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class QueueRepository {

    private val apiService: QueueService by lazy {
        RetrofitClient.authInstance.create(QueueService::class.java)
    }

    suspend fun getQueue(): Response<List<QueueItem>> = withContext(Dispatchers.IO) {
        apiService.getQueue()
    }

    suspend fun updateQueueItem(id: Long, queueItem: QueueItem): Response<QueueItem> = withContext(Dispatchers.IO) {
        apiService.updateQueueItem(id, queueItem)
    }

    suspend fun deleteQueueItem(id: Long): Response<Void> = withContext(Dispatchers.IO) {
        apiService.deleteQueueItem(id)
    }
}
