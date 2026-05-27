package com.medistream.staff.consultations

import retrofit2.Response
import retrofit2.http.*

interface ConsultationService {
    @GET("api/consultations/all")
    suspend fun getConsultations(): Response<List<ConsultationItem>>

    @POST("api/consultations/add")
    suspend fun createConsultation(@Body request: ConsultationRequest): Response<ConsultationItem>

    @PUT("api/consultations/update/{id}")
    suspend fun updateConsultation(@Path("id") id: Int, @Body request: ConsultationRequest): Response<ConsultationItem>

    @DELETE("api/consultations/delete/{id}")
    suspend fun deleteConsultation(@Path("id") id: Int): Response<Void>

    @GET("api/consultations/patient/{patientId}")
    suspend fun getConsultationsByPatient(@Path("patientId") patientId: Int): Response<List<ConsultationItem>>
}
