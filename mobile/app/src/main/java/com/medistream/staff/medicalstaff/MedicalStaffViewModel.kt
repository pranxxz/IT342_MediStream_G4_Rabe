package com.medistream.staff.medicalstaff

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class MedicalStaffViewModel : ViewModel() {

    private val repository = MedicalStaffRepository()

    private val _staffList = MutableLiveData<List<MedicalStaffEntity>>()
    val staffList: LiveData<List<MedicalStaffEntity>> = _staffList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    fun fetchMedicalStaff() {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                val response = repository.getMedicalStaff()
                if (response.isSuccessful) {
                    _staffList.value = response.body() ?: emptyList()
                } else {
                    _errorMessage.value = "Failed to load medical staff: ${response.message()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}
