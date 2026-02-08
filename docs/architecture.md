# System Architecture (v1)

## 1) Architecture Principles
1. Voice-first UX, but always provide text fallback.
2. Confirm before mutating user state.
3. Separate orchestration logic from provider integrations.
4. Keep external calls resilient via queues/retries/idempotency.
5. Treat trust, privacy, and observability as first-class concerns.

## 2) C4 Level 1: System Context

```mermaid
flowchart LR
  U[User] --> APP[Mobile App]
  APP --> BE[Assistant Backend]
  BE --> GCAL[Google Calendar API]
  BE --> ACAL[Apple Calendar/CalDAV]
  BE --> MCAL[Microsoft Graph Calendar]
  BE --> LLM[LLM + Speech Providers]
  BE --> PUSH[Push Notification Provider]
  BE --> DATA[(Application Data Stores)]
```

## 3) C4 Level 2: Container Diagram

```mermaid
flowchart TB
  subgraph Mobile
    UI[Voice/Text UI]
    CACHE[Local Cache + Offline Queue]
    AUTH[Auth/OAuth Client]
  end

  subgraph Backend
    API[API Gateway]
    ORCH[Assistant Orchestrator]
    TASK[Task Service]
    CAL[Calendar Sync Service]
    PLAN[Planning/Scheduling Engine]
    PREF[Preference + Memory Service]
    JOBS[Queue + Worker Pool]
    NOTIF[Notification Service]
  end

  subgraph Data
    DB[(Primary Relational DB)]
    MEM[(Memory Store)]
    AUD[(Audit Log Store)]
    SEC[(Secrets/Token Vault)]
  end

  subgraph External
    G[Google Calendar]
    A[Apple/CalDAV]
    M[Microsoft Graph]
    L[LLM + ASR/TTS]
    P[Push Provider]
  end

  UI --> API
  CACHE --> API
  AUTH --> API

  API --> ORCH
  ORCH --> TASK
  ORCH --> CAL
  ORCH --> PLAN
  ORCH --> PREF
  ORCH --> NOTIF
  ORCH --> JOBS

  TASK --> DB
  CAL --> DB
  PLAN --> DB
  PREF --> MEM
  ORCH --> AUD
  ORCH --> SEC

  CAL --> G
  CAL --> A
  CAL --> M
  ORCH --> L
  NOTIF --> P
```

## 4) Key Sequence: Voice Task Creation

```mermaid
sequenceDiagram
  participant U as User
  participant APP as Mobile App
  participant OR as Orchestrator
  participant TS as Task Service
  participant DB as DB
  participant NS as Notification Service

  U->>APP: "Add task: pay rent tomorrow 9 AM"
  APP->>OR: transcript + user context
  OR->>OR: Intent + entity extraction
  OR-->>APP: Parsed action confirmation
  U->>APP: "Yes"
  APP->>OR: confirm action
  OR->>TS: createTask(...)
  TS->>DB: idempotent insert
  DB-->>TS: task_id
  TS-->>OR: success payload
  OR->>NS: schedule reminder
  OR-->>APP: success summary
```

## 5) Key Sequence: Calendar Scheduling Request

```mermaid
sequenceDiagram
  participant U as User
  participant APP as Mobile App
  participant OR as Orchestrator
  participant PE as Planning Engine
  participant CS as Calendar Sync Service
  participant EXT as Calendar Providers

  U->>APP: "Schedule 30 min with Sarah next week"
  APP->>OR: request + context
  OR->>PE: find candidate slots(constraints)
  PE->>CS: fetch availability windows
  CS->>EXT: read calendars
  EXT-->>CS: busy/free blocks
  CS-->>PE: normalized availability
  PE-->>OR: ranked slots
  OR-->>APP: propose top slots
  U->>APP: "Book Tuesday 2 PM"
  APP->>OR: confirmation
  OR->>CS: create event
  CS->>EXT: write event
  EXT-->>CS: created_event_id
  CS-->>OR: success
  OR-->>APP: event confirmed + summary
```

## 6) Trust Boundary + Data Flow

```mermaid
flowchart LR
  subgraph Device Boundary
    D1[Mobile UI]
    D2[Local Cache]
  end

  subgraph Cloud Boundary
    C1[API Gateway]
    C2[Services]
    C3[(DB)]
    C4[(Token Vault)]
    C5[(Audit Store)]
  end

  subgraph Third-Party Boundary
    T1[Calendar APIs]
    T2[LLM/Speech APIs]
    T3[Push Provider]
  end

  D1 -->|TLS| C1
  D2 -->|Encrypted at rest on device| D1
  C1 --> C2
  C2 --> C3
  C2 --> C4
  C2 --> C5
  C2 -->|Scoped OAuth tokens| T1
  C2 -->|Minimized prompts| T2
  C2 --> T3
```

## 7) Deployment View (High Level)

```mermaid
flowchart TB
  subgraph Region A
    LB[Load Balancer/API Edge]
    APP1[Stateless App Pods]
    WRK1[Worker Pods]
    Q[(Queue)]
    DB[(Managed DB)]
    REDIS[(Cache/Session)]
  end

  LB --> APP1
  APP1 --> DB
  APP1 --> REDIS
  APP1 --> Q
  WRK1 --> Q
  WRK1 --> DB
```

## 8) Where to Add More Diagrams Later
1. Detailed design: component internals per service.
2. API design: sequence per high-risk mutation flow.
3. Implementation planning: failure and retry state charts.
4. Operations: SLO/SLI dashboards and incident response flows.
