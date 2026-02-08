# AI Assistant Planning Pack

This folder contains the top-down planning artifacts for the mobile AI assistant:

1. `requirements-v1.md`: Product requirements (scope, use cases, NFRs, metrics).
2. `architecture.md`: System context, container architecture, and key sequence diagrams.
3. `data-model.md`: Domain entities, schema drafts, lifecycle, and data governance.
4. `api-contracts.md`: API surface and request/response contract drafts.
5. `security-privacy.md`: Threat model, controls, and compliance-oriented design choices.
6. `roadmap-v1.md`: Phase-based rollout plan with milestones and risks.
7. `backlog-v1.md`: Prioritized epics and user stories with acceptance criteria.
8. `adr/0001-platform-and-architecture-baseline.md`: Initial architecture decision record.
9. `word/`: Word-compatible exports (RTF) for sharing/review in Microsoft Word.
10. `integration-strategy.md`: API/provider integration approach and key management model.
11. `cost-estimate-v1.md`: Operating cost model with assumptions and scenario math.
12. `cost-calculator-single-user.csv`: Spreadsheet-style single-user calculator with OpenAI vs Gemini side-by-side comparison.
13. `stage-2-execution-design/`: Execution design stage package (scope lock, sprint plan, vertical slice, quality gates).
14. `stage-3-build/`: Build-stage execution package (ticket breakdown, import mapping, sprint build plan).
15. `stage-3-build/jira-AAA-import.csv`: Jira-targeted import file for project key `AAA`.
16. `stage-3-build/jira-AAA-traceability.csv`: Full docs-to-Jira traceability matrix.
17. `stage-4-build-kickoff/`: Build kickoff stage package (stack decisions, repo/env setup, sprint checklist).
18. `stage-4-build-kickoff/architecture-decision-rationale.md`: Detailed rationale and tradeoffs behind architectural choices.
19. `stage-3-build/jira-AAA-sprint-1-import.csv`: Sprint 1-focused Jira import file.
20. `process-log-executive.md`: Executive summary of process, phases, and decisions.
21. `process-log-detailed.md`: Detailed step-by-step process and rationale log.
22. `stage-4-build-kickoff/tech-stack-rationale.md`: Detailed rationale and alternatives for selected tech stack.
23. `stage-5-implementation/`: Implementation start package (day-by-day plan, setup commands, readiness gate).
24. `stage-3-build/jira-automation.md`: Jira automation guide (bootstrap key map + sync transitions from commits).

Note: the `.rtf` files are Word-compatible and open in Word directly. Mermaid diagrams are preserved as text blocks in those exports.

All diagrams are Mermaid so they can be rendered in most modern Markdown viewers.
