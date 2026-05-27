package com.medistream.staff.consultations

data class ConsultationRequest(
    val patientId: Int,
    val staffId: Int,
    val symptoms: String?,
    val diagnosis: String?,
    val medicinePrescribed: String?,
    val remarks: String?,
    val consultationDate: String?
)

data class ConsultationItem(
    val consultationId: Int,
    val diagnosis: String?,
    val remarks: String?,
    val symptoms: String?,
    val medicinePrescribed: String?,
    val consultationDate: String?,
    val doctorName: String?,
    val patientId: Any?,
    val patientName: String?,
    val age: Any?
) {
    val cleanPatientId: String
        get() = when (val id = patientId) {
            is Double -> id.toInt().toString()
            is Float -> id.toInt().toString()
            is Number -> id.toLong().toString()
            null -> "N/A"
            else -> {
                val str = id.toString()
                if (str.endsWith(".0")) str.substring(0, str.length - 2) else str
            }
        }

    val cleanAge: String
        get() = when (val a = age) {
            is Double -> a.toInt().toString()
            is Float -> a.toInt().toString()
            is Number -> a.toLong().toString()
            null -> "N/A"
            else -> {
                val str = a.toString()
                if (str.endsWith(".0")) str.substring(0, str.length - 2) else str
            }
        }
}

