package com.danictech.aiassistant.network

data class HealthResponse(val ok: Boolean)

data class TaskDto(
    val id: String,
    val title: String,
    val priority: String,
    val createdAt: String
)

data class TasksResponse(val tasks: List<TaskDto>)

data class CreateTaskRequest(
    val title: String,
    val priority: String = "medium",
    val reminder_at: String? = null
)

data class CreateTaskResponse(
    val status: String,
    val task: TaskDto
)
