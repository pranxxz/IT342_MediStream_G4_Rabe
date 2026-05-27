package com.medistream.staff.patients

import com.google.gson.annotations.SerializedName

data class PatientEntity(
    @SerializedName("patientId")
    val patientId: Int = 0,
    val firstName: String,
    val lastName: String,
    val fullName: String? = null,
    val age: Int?,
    val gender: String?,
    val address: String?,
    val contactNumber: String?,
    val status: String?,
    val assignedDoctor: String?,
    @SerializedName("lastVisit")
    val lastVisit: String?
)

fun formatLastVisit(rawDate: String?): String {
    if (rawDate.isNullOrEmpty() || rawDate.equals("never", ignoreCase = true)) return "Never"
    return try {
        // Try parsing yyyy-MM-dd
        val date = java.time.LocalDate.parse(rawDate)
        date.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy", java.util.Locale.ENGLISH))
    } catch (e: Exception) {
        try {
            // Try parsing ISO/OffsetDateTime
            val parsed = java.time.OffsetDateTime.parse(rawDate)
            parsed.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy", java.util.Locale.ENGLISH))
        } catch (ex: Exception) {
            rawDate
        }
    }
}
