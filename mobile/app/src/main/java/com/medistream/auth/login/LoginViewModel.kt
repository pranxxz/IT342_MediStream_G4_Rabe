package com.medistream.auth.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medistream.auth.LoginRequest
import com.medistream.auth.AuthResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginViewModel : ViewModel() {
    private val repository = LoginRepository()

    private val _loginResult = MutableLiveData<Result<AuthResponse>?>()
    val loginResult: LiveData<Result<AuthResponse>?> get() = _loginResult

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> get() = _isLoading

    fun login(email: String, pass: String) {
        _isLoading.value = true
        _loginResult.value = null
        viewModelScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    repository.login(LoginRequest(email, pass))
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null && body.success) {
                        _loginResult.value = Result.success(body)
                    } else {
                        val errMsg = body?.message ?: "Login failed. Please check your credentials."
                        _loginResult.value = Result.failure(Exception(errMsg))
                    }
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Network error"
                    _loginResult.value = Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                _loginResult.value = Result.failure(e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearResult() {
        _loginResult.value = null
    }
}
