package com.medistream.patient.queue

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface PatientQueueService {
    @POST("api/queue/join")
    suspend fun joinQueue(@Body request: PatientQueueRequest): Response<QueueJoinResponse>
}
