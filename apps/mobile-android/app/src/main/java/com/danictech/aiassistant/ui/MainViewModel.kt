package com.danictech.aiassistant.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.danictech.aiassistant.network.ApiClient
import com.danictech.aiassistant.network.CreateTaskRequest
import com.danictech.aiassistant.network.TaskDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

data class MainUiState(
    val health: String = "Unknown",
    val tasks: List<TaskDto> = emptyList(),
    val inputTitle: String = "",
    val busy: Boolean = false,
    val error: String? = null
)

class MainViewModel : ViewModel() {
    private val _ui = MutableStateFlow(MainUiState())
    val ui: StateFlow<MainUiState> = _ui.asStateFlow()

    fun updateTitle(value: String) {
        _ui.value = _ui.value.copy(inputTitle = value)
    }

    fun loadInitial() {
        viewModelScope.launch {
            _ui.value = _ui.value.copy(busy = true, error = null)
            runCatching {
                val health = ApiClient.service.health()
                val tasks = ApiClient.service.getTasks().tasks
                _ui.value = _ui.value.copy(
                    health = if (health.ok) "OK" else "Not OK",
                    tasks = tasks,
                    busy = false
                )
            }.onFailure {
                _ui.value = _ui.value.copy(
                    busy = false,
                    error = it.message ?: "Failed to reach API"
                )
            }
        }
    }

    fun createTask() {
        val title = _ui.value.inputTitle.trim()
        if (title.isEmpty()) return

        viewModelScope.launch {
            _ui.value = _ui.value.copy(busy = true, error = null)
            runCatching {
                ApiClient.service.createTask(
                    idempotencyKey = UUID.randomUUID().toString(),
                    body = CreateTaskRequest(title = title)
                )
                ApiClient.service.getTasks().tasks
            }.onSuccess { tasks ->
                _ui.value = _ui.value.copy(
                    tasks = tasks,
                    inputTitle = "",
                    busy = false
                )
            }.onFailure {
                _ui.value = _ui.value.copy(
                    busy = false,
                    error = it.message ?: "Failed to create task"
                )
            }
        }
    }
}
