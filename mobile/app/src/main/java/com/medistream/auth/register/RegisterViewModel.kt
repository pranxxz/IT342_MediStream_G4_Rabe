package com.medistream.auth.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medistream.auth.RegisterRequest
import com.medistream.auth.AuthResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class RegisterViewModel : ViewModel() {
    private val repository = RegisterRepository()

    private val _registerResult = MutableLiveData<Result<AuthResponse>?>()
    val registerResult: LiveData<Result<AuthResponse>?> get() = _registerResult

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> get() = _isLoading

    fun register(firstName: String, lastName: String, email: String, pass: String) {
        _isLoading.value = true
        _registerResult.value = null
        viewModelScope.launch {
            try {
                val request = RegisterRequest(firstName, lastName, email, pass, "staff")
                val response = withContext(Dispatchers.IO) {
                    repository.register(request)
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null && body.success) {
                        _registerResult.value = Result.success(body)
                    } else {
                        val msg = body?.message ?: "Registration failed"
                        _registerResult.value = Result.failure(Exception(msg))
                    }
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Network error"
                    _registerResult.value = Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                _registerResult.value = Result.failure(e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearResult() {
        _registerResult.value = null
    }
}
