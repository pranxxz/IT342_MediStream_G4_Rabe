package com.medistream.patient.queue

data class PatientQueueResponse(
    val queueNumber: String,
    val patientName: String?,
    val status: String,
    val estimatedTime: String?,
    val patient: PatientDto? = null
)

data class PatientDto(
    val patientId: Int,
    val firstName: String,
    val lastName: String,
    val fullName: String?,
    val age: Int,
    val gender: String,
    val contactNumber: String?,
    val address: String?
)
