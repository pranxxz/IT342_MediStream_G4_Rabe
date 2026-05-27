package com.medistream.auth.login

import com.medistream.auth.LoginRequest
import com.medistream.auth.AuthResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}
