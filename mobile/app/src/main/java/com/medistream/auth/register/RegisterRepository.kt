package com.medistream.auth.register

import com.medistream.auth.RegisterRequest
import com.medistream.auth.AuthResponse
import com.medistream.core.network.RetrofitClient
import retrofit2.Response

class RegisterRepository {
    private val service = RetrofitClient.publicInstance.create(RegisterService::class.java)

    suspend fun register(request: RegisterRequest): Response<AuthResponse> {
        return service.register(request)
    }
}
