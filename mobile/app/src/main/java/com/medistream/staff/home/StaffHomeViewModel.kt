package com.medistream.staff.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.medistream.staff.queue.QueueItem
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class StaffHomeViewModel : ViewModel() {
    private val repository = StaffHomeRepository()

    private val _totalPatients = MutableLiveData<Int>(0)
    val totalPatients: LiveData<Int> get() = _totalPatients

    private val _inQueue = MutableLiveData<Int>(0)
    val inQueue: LiveData<Int> get() = _inQueue

    private val _totalConsultations = MutableLiveData<Int>(0)
    val totalConsultations: LiveData<Int> get() = _totalConsultations

    private val _totalStaff = MutableLiveData<Int>(0)
    val totalStaff: LiveData<Int> get() = _totalStaff

    private val _recentQueue = MutableLiveData<List<QueueItem>>()
    val recentQueue: LiveData<List<QueueItem>> get() = _recentQueue

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> get() = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> get() = _errorMessage

    fun loadDashboardData() {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                // Run operations in parallel using async coroutines
                val queueDeferred = async { repository.getQueue() }
                val patientsDeferred = async { repository.getPatients() }
                val consultationsDeferred = async { repository.getConsultations() }
                val staffDeferred = async { repository.getMedicalStaff() }

                val queueRes = queueDeferred.await()
                val patientsRes = patientsDeferred.await()
                val consultationsRes = consultationsDeferred.await()
                val staffRes = staffDeferred.await()

                if (queueRes.isSuccessful) {
                    val qList = queueRes.body() ?: emptyList()
                    _inQueue.value = qList.size
                    // Capture only the 5 most recent records
                    _recentQueue.value = qList.take(5)
                }
                if (patientsRes.isSuccessful) {
                    _totalPatients.value = patientsRes.body()?.size ?: 0
                }
                if (consultationsRes.isSuccessful) {
                    _totalConsultations.value = consultationsRes.body()?.size ?: 0
                }
                if (staffRes.isSuccessful) {
                    _totalStaff.value = staffRes.body()?.size ?: 0
                }

                if (!queueRes.isSuccessful || !patientsRes.isSuccessful || !consultationsRes.isSuccessful || !staffRes.isSuccessful) {
                    _errorMessage.value = "Failed to load complete dashboard figures"
                }
            } catch (e: Exception) {
                _errorMessage.value = e.message ?: "Server connection failed"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
