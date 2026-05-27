package com.medistream.staff.queue

import com.medistream.patient.queue.PatientQueueRequest
import com.medistream.patient.queue.QueueJoinResponse
import retrofit2.Response
import retrofit2.http.*

interface QueueService {
    @GET("api/queue")
    suspend fun getQueue(): Response<List<QueueItem>>

    @POST("api/queue/join")
    suspend fun joinQueue(@Body request: PatientQueueRequest): Response<QueueJoinResponse>

    @PUT("api/queue/{id}")
    suspend fun updateQueueItem(@Path("id") id: Long, @Body queueItem: QueueItem): Response<QueueItem>

    @DELETE("api/queue/{id}")
    suspend fun deleteQueueItem(@Path("id") id: Long): Response<Void>
}
