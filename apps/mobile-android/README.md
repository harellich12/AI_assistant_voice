# Android App Scaffold

This module is an Android-first MVP client scaffold for the backend API.

## What is wired
1. Compose UI with task list and create task form.
2. API connectivity to:
   - `GET /health`
   - `GET /v1/tasks`
   - `POST /v1/tasks`
3. Auth header uses `Bearer dev` for current backend dev middleware.

## Base URL
Configured in `app/build.gradle.kts` as:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:3000/\"")
```

Use `10.0.2.2` for Android emulator access to host machine localhost.

## Run
1. Open `apps/mobile-android` in Android Studio.
2. Let Android Studio sync and generate wrapper files if prompted.
3. Run on emulator/device.

## Notes
1. This is scaffold-level and intentionally minimal.
2. Next increment: wire voice capture and assistant endpoints (`/v1/assistant/interpret`, `/v1/assistant/confirm`).
