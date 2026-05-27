package com.medistream.auth.login

import com.medistream.auth.LoginRequest
import com.medistream.auth.AuthResponse
import com.medistream.core.network.RetrofitClient
import retrofit2.Response

class LoginRepository {
    private val service = RetrofitClient.publicInstance.create(LoginService::class.java)

    suspend fun login(request: LoginRequest): Response<AuthResponse> {
        return service.login(request)
    }
}
