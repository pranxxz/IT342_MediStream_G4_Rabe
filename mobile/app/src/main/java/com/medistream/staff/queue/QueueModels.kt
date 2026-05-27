package com.medistream.staff.queue

import com.google.gson.annotations.SerializedName

data class QueueItem(
    val id: Long,
    val queueNumber: String,
    val status: String,
    val arrivalTime: String?,
    val assignedDoctor: String?,
    val patient: PatientInfo?
)

data class PatientInfo(
    @SerializedName("patientId")
    val patientId: Int,
    val firstName: String,
    val lastName: String,
    val age: Int?,
    val gender: String?,
    val contactNumber: String?,
    val address: String?,
    val status: String?
) {
    val fullName: String
        get() = "$firstName $lastName"
}
