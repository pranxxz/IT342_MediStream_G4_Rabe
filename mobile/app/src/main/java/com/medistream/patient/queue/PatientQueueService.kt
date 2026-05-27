package com.medistream.patient.queue

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface PatientQueueService {

    @POST("api/queue/join")
    suspend fun submitQueueApplication(
        @Body request: PatientQueueRequest
    ): Response<PatientQueueResponse>

    @GET("api/queue")
    suspend fun getActiveQueueDashboardList(): Response<List<PatientQueueResponse>>
}
