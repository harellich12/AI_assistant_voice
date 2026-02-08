package com.danictech.aiassistant.network

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {
    @GET("health")
    suspend fun health(): HealthResponse

    @GET("v1/tasks")
    suspend fun getTasks(@Header("Authorization") auth: String = "Bearer dev"): TasksResponse

    @POST("v1/tasks")
    suspend fun createTask(
        @Header("Authorization") auth: String = "Bearer dev",
        @Header("Idempotency-Key") idempotencyKey: String,
        @Body body: CreateTaskRequest
    ): CreateTaskResponse
}
