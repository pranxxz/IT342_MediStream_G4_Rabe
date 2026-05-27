package com.medistream.staff.medicalstaff

import retrofit2.Response
import retrofit2.http.*

interface MedicalStaffService {
    @GET("api/medicalstaff/all")
    suspend fun getMedicalStaff(): Response<List<MedicalStaffEntity>>

    @POST("api/medicalstaff/add")
    suspend fun createMedicalStaff(@Body staff: MedicalStaffEntity): Response<MedicalStaffEntity>

    @PUT("api/medicalstaff/update/{id}")
    suspend fun updateMedicalStaff(@Path("id") id: Int, @Body staff: MedicalStaffEntity): Response<MedicalStaffEntity>

    @DELETE("api/medicalstaff/delete/{id}")
    suspend fun deleteMedicalStaff(@Path("id") id: Int): Response<Void>
}
