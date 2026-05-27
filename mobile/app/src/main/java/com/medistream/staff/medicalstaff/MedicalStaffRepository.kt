package com.medistream.staff.medicalstaff

import com.medistream.core.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class MedicalStaffRepository {

    private val apiService: MedicalStaffService by lazy {
        RetrofitClient.authInstance.create(MedicalStaffService::class.java)
    }

    suspend fun getMedicalStaff(): Response<List<MedicalStaffEntity>> = withContext(Dispatchers.IO) {
        apiService.getMedicalStaff()
    }
}
