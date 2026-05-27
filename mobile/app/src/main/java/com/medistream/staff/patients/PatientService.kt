package com.medistream.staff.patients

import retrofit2.Response
import retrofit2.http.*

interface PatientService {
    @GET("api/patients")
    suspend fun getPatients(): Response<List<PatientEntity>>

    @POST("api/patients")
    suspend fun createPatient(@Body patient: PatientEntity): Response<PatientEntity>

    @PUT("api/patients/update/{id}")
    suspend fun updatePatient(@Path("id") id: Int, @Body patient: PatientEntity): Response<PatientEntity>

    @DELETE("api/patients/delete/{id}")
    suspend fun deletePatient(@Path("id") id: Int): Response<Void>
}
