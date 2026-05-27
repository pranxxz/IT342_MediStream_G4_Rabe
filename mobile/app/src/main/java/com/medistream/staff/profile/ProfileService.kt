package com.medistream.staff.profile

import retrofit2.Response
import retrofit2.http.*

interface ProfileService {
    @GET("api/medicalstaff/{id}")
    suspend fun getStaffProfile(@Path("id") id: Int): Response<StaffProfileResponse>

    @PUT("api/medicalstaff/update/{id}")
    suspend fun updateStaffProfile(@Path("id") id: Int, @Body request: StaffProfileResponse): Response<StaffProfileResponse>
}

data class StaffProfileResponse(
    val staffID: Int,
    val name: String,
    val role: String,
    val contactNo: String?,
    val specialty: String?,
    val age: Int?,
    val gender: String?,
    val department: String?,
    val availability: String?
)
