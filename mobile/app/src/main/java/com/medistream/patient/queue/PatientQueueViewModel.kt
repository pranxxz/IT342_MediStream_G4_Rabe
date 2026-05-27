package com.medistream.patient.queue

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class PatientQueueViewModel : ViewModel() {
    private val repository = PatientQueueRepository()

    private val _queueSubmissionResult = MutableLiveData<PatientQueueResponse?>()
    val queueSubmissionResult: LiveData<PatientQueueResponse?> = _queueSubmissionResult

    private val _liveQueueDashboardList = MutableLiveData<List<PatientQueueResponse>>()
    val liveQueueDashboardList: LiveData<List<PatientQueueResponse>> = _liveQueueDashboardList

    private val _errorMessage = MutableLiveData<String>()
    val errorMessage: LiveData<String> = _errorMessage

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun submitQueue(
        firstName: String,
        lastName: String,
        age: Int,
        gender: String,
        contactNo: String,
        address: String
    ) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val response = repository.joinQueue(
                    PatientQueueRequest(firstName, lastName, age, gender, contactNo, address)
                )
                _isLoading.postValue(false)
                if (response.isSuccessful && response.body() != null) {
                    _queueSubmissionResult.postValue(response.body())
                } else {
                    _errorMessage.postValue("Registration Error: ${response.code()}")
                }
            } catch (e: Exception) {
                _isLoading.postValue(false)
                _errorMessage.postValue(e.localizedMessage ?: "Network connection failed")
            }
        }
    }

    fun loadActiveQueueStandings() {
        viewModelScope.launch {
            try {
                val response = repository.fetchActiveQueue()
                if (response.isSuccessful && response.body() != null) {
                    _liveQueueDashboardList.postValue(response.body())
                }
            } catch (e: Exception) {
                _errorMessage.postValue(e.localizedMessage ?: "Failed to synchronize standing logs")
            }
        }
    }
}
