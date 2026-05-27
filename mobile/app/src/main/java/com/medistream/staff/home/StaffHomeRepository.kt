package com.medistream.staff.home

import com.medistream.core.network.RetrofitClient
import com.medistream.staff.consultations.ConsultationItem
import com.medistream.staff.consultations.ConsultationService
import com.medistream.staff.medicalstaff.MedicalStaffEntity
import com.medistream.staff.medicalstaff.MedicalStaffService
import com.medistream.staff.patients.PatientEntity
import com.medistream.staff.patients.PatientService
import com.medistream.staff.queue.QueueItem
import com.medistream.staff.queue.QueueService
import retrofit2.Response

class StaffHomeRepository {
    private val queueService = RetrofitClient.authInstance.create(QueueService::class.java)
    private val patientService = RetrofitClient.authInstance.create(PatientService::class.java)
    private val consultationService = RetrofitClient.authInstance.create(ConsultationService::class.java)
    private val medicalStaffService = RetrofitClient.authInstance.create(MedicalStaffService::class.java)

    suspend fun getQueue(): Response<List<QueueItem>> = queueService.getQueue()
    suspend fun getPatients(): Response<List<PatientEntity>> = patientService.getPatients()
    suspend fun getConsultations(): Response<List<ConsultationItem>> = consultationService.getConsultations()
    suspend fun getMedicalStaff(): Response<List<MedicalStaffEntity>> = medicalStaffService.getMedicalStaff()
}
