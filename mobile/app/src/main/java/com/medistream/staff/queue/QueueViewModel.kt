package com.medistream.staff.queue

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class QueueViewModel : ViewModel() {

    private val repository = QueueRepository()

    private val _queueList = MutableLiveData<List<QueueItem>>()
    val queueList: LiveData<List<QueueItem>> = _queueList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private val _nextConsultationSuccess = MutableLiveData<QueueItem?>()
    val nextConsultationSuccess: LiveData<QueueItem?> = _nextConsultationSuccess

    // Counts
    private val _countWaiting = MutableLiveData<Int>().apply { value = 0 }
    val countWaiting: LiveData<Int> = _countWaiting

    private val _countConsulting = MutableLiveData<Int>().apply { value = 0 }
    val countConsulting: LiveData<Int> = _countConsulting

    private val _countDone = MutableLiveData<Int>().apply { value = 0 }
    val countDone: LiveData<Int> = _countDone

    fun fetchQueues() {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                val response = repository.getQueue()
                if (response.isSuccessful) {
                    val list = response.body() ?: emptyList()
                    val filteredList = list.filter {
                        !it.status.equals("Completed", ignoreCase = true) &&
                        !it.status.equals("COMPLETED", ignoreCase = true) &&
                        !it.status.equals("DONE", ignoreCase = true)
                    }
                    // Sort queue items: WAITING first, then CONSULTING, then DONE
                    // Within WAITING/CONSULTING, sort by queueNumber (e.g. Q-001)
                    val sortedList = filteredList.sortedWith(compareBy<QueueItem> {
                        when (it.status.uppercase()) {
                            "WAITING" -> 0
                            "CONSULTING" -> 1
                            else -> 2
                        }
                    }.thenBy { it.queueNumber })

                    _queueList.value = sortedList
                    calculateStats(list)
                } else {
                    _errorMessage.value = "Failed to load queues: ${response.message()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Network error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun calculateStats(list: List<QueueItem>) {
        var waiting = 0
        var consulting = 0
        var done = 0

        for (item in list) {
            when (item.status.uppercase()) {
                "WAITING" -> waiting++
                "CONSULTING" -> consulting++
                "DONE" -> done++
            }
        }

        _countWaiting.value = waiting
        _countConsulting.value = consulting
        _countDone.value = done
    }

    fun callNextPatient(doctorName: String) {
        val currentList = _queueList.value ?: return
        
        // Find the patient with status "WAITING" and the lowest queue number (first in sorted list)
        val nextPatient = currentList.firstOrNull { it.status.uppercase() == "WAITING" }
        
        if (nextPatient == null) {
            _errorMessage.value = "No patients waiting in queue"
            return
        }

        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                // Prepare updated item
                val updatedItem = nextPatient.copy(
                    status = "CONSULTING",
                    assignedDoctor = doctorName
                )
                
                val response = repository.updateQueueItem(updatedItem.id, updatedItem)
                if (response.isSuccessful) {
                    _nextConsultationSuccess.value = response.body()
                    fetchQueues() // Refresh list and counters
                } else {
                    _errorMessage.value = "Failed to update patient status: ${response.message()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Network error: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun updateStatus(queueItem: QueueItem, newStatus: String, doctorName: String?) {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            try {
                val updatedItem = queueItem.copy(
                    status = newStatus.uppercase(),
                    assignedDoctor = doctorName ?: queueItem.assignedDoctor
                )
                val response = repository.updateQueueItem(updatedItem.id, updatedItem)
                if (response.isSuccessful) {
                    fetchQueues() // Refresh
                } else {
                    _errorMessage.value = "Failed to update queue: ${response.message()}"
                }
            } catch (e: Exception) {
                _errorMessage.value = "Error updating status: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearResult() {
        _nextConsultationSuccess.value = null
    }
}
