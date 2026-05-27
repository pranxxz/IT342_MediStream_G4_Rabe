package com.medistream.patient.queue

data class PatientQueueRequest(
    val firstName: String,
    val lastName: String,
    val age: Int,
    val gender: String,
    val contactNo: String,
    val address: String
)
