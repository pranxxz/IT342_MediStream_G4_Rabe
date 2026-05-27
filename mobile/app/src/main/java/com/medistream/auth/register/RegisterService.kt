package com.medistream.auth.register

import com.medistream.auth.RegisterRequest
import com.medistream.auth.AuthResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface RegisterService {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
}
