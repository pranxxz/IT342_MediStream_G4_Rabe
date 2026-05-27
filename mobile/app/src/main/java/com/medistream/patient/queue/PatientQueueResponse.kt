package com.medistream.patient.queue

data class QueueJoinResponse(
    val queueNumber: String,
    val patientName: String,
    val status: String,
    val estimatedTime: String
)
