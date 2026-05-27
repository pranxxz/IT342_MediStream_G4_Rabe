package com.medistream.patient.queue

import com.medistream.core.network.RetrofitClient
import retrofit2.Response

class PatientQueueRepository {
    private val service = RetrofitClient.publicInstance.create(PatientQueueService::class.java)

    suspend fun joinQueue(request: PatientQueueRequest): Response<QueueJoinResponse> {
        return service.joinQueue(request)
    }
}
