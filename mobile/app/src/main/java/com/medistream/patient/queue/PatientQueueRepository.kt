package com.medistream.patient.queue

import com.medistream.core.network.RetrofitClient
import retrofit2.Response

class PatientQueueRepository {
    private val queueApi = RetrofitClient.publicInstance.create(PatientQueueService::class.java)

    suspend fun joinQueue(request: PatientQueueRequest): Response<PatientQueueResponse> {
        return queueApi.submitQueueApplication(request)
    }

    suspend fun fetchActiveQueue(): Response<List<PatientQueueResponse>> {
        return queueApi.getActiveQueueDashboardList()
    }
}
