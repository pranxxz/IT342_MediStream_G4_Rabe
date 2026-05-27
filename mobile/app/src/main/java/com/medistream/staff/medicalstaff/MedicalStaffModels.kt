package com.medistream.staff.medicalstaff

data class MedicalStaffEntity(
    val staffID: Int = 0,
    val name: String?,
    val role: String?,
    val contactNo: String?,
    val specialty: String?,
    val age: Int?,
    val gender: String?,
    val department: String?,
    val availability: String?
)
