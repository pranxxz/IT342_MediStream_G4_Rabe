package com.medistream.staff.patients

import com.medistream.core.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response

class PatientRepository {

    private val apiService: PatientService by lazy {
        RetrofitClient.authInstance.create(PatientService::class.java)
    }

    suspend fun getPatients(): Response<List<PatientEntity>> = withContext(Dispatchers.IO) {
        apiService.getPatients()
    }

    suspend fun createPatient(patient: PatientEntity): Response<PatientEntity> = withContext(Dispatchers.IO) {
        apiService.createPatient(patient)
    }

    suspend fun updatePatient(id: Int, patient: PatientEntity): Response<PatientEntity> = withContext(Dispatchers.IO) {
        apiService.updatePatient(id, patient)
    }

    suspend fun deletePatient(id: Int): Response<Void> = withContext(Dispatchers.IO) {
        apiService.deletePatient(id)
    }
}
