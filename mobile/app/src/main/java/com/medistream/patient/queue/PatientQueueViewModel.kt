package com.medistream.patient.queue

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PatientQueueViewModel : ViewModel() {
    private val repository = PatientQueueRepository()

    private val _joinResult = MutableLiveData<Result<QueueJoinResponse>?>()
    val joinResult: LiveData<Result<QueueJoinResponse>?> get() = _joinResult

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> get() = _isLoading

    fun joinQueue(firstName: String, lastName: String, age: Int, gender: String, contactNo: String, address: String) {
        _isLoading.value = true
        _joinResult.value = null
        viewModelScope.launch {
            try {
                val request = PatientQueueRequest(firstName, lastName, age, gender, contactNo, address)
                val response = withContext(Dispatchers.IO) {
                    repository.joinQueue(request)
                }
                if (response.isSuccessful) {
                    val body = response.body()
                    if (body != null) {
                        _joinResult.value = Result.success(body)
                    } else {
                        _joinResult.value = Result.failure(Exception("Failed to join queue: Empty response"))
                    }
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Network error"
                    _joinResult.value = Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                _joinResult.value = Result.failure(e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearResult() {
        _joinResult.value = null
    }
}
