package com.medistream.staff.patients

import retrofit2.Response
import retrofit2.http.*

interface PatientService {
    @GET("api/patients")
    suspend fun getPatients(): Response<List<PatientEntity>>

    @POST("api/patients")
    suspend fun createPatient(@Body patient: PatientEntity): Response<PatientEntity>

    // FIXED: was "api/patients/update/{id}" — backend uses PUT /api/patients/{id}
    @PUT("api/patients/{id}")
    suspend fun updatePatient(@Path("id") id: Int, @Body patient: PatientEntity): Response<PatientEntity>

    // FIXED: was "api/patients/delete/{id}" — backend uses DELETE /api/patients/{id}
    @DELETE("api/patients/{id}")
    suspend fun deletePatient(@Path("id") id: Int): Response<Void>
}
