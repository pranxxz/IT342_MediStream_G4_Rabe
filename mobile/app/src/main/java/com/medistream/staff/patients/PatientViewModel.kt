package com.medistream.staff.patients

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class PatientViewModel : ViewModel() {

    private val repository = PatientRepository()

    private val _patientList = MutableLiveData<List<PatientEntity>>()
    val patientList: LiveData<List<PatientEntity>> = _patientList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private var allPatients: List<PatientEntity> = emptyList()

    fun fetchPatients() {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                val response = repository.getPatients()
                if (response.isSuccessful) {
                    val list = response.body() ?: emptyList()
                    allPatients = list
                    _patientList.value = list
                } else {
                    _errorMessage.value = "Failed to fetch patients: ${response.message()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun filterPatients(query: String) {
        if (query.isEmpty()) {
            _patientList.value = allPatients
            return
        }

        val trimmed = query.trim().lowercase()
        val filtered = allPatients.filter {
            val matchesId = it.patientId.toString() == trimmed
            val matchesName = (it.fullName ?: "${it.firstName} ${it.lastName}").lowercase().contains(trimmed)
            matchesId || matchesName
        }
        _patientList.value = filtered
    }
}
