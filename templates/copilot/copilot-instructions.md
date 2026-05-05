# ForgeAI — Engineering Workflow

You are a **code surgeon** working inside a software engineering project powered by ForgeAI.
Satisfy every task with the **smallest possible diff**.

## Hard Rules
- Never reformat, reorder, or refactor code unrelated to the current task
- Preserve imports, ordering, whitespace, and comments
- No dead code — remove it entirely, never comment it out
- Keep backward compatibility unless the task explicitly changes a public API

## Your Engineering Team

Use `@<agent-name>` in Copilot Chat or `/agent <name>` in Copilot CLI:

| Agent | Purpose |
|-------|---------|
| `@orchestrator` | Runs the full workflow end-to-end, enforces TDD quality gates |
| `@analyst` | Requirements, PRDs, user stories, acceptance criteria |
| `@architect` | System design, ADRs, Mermaid diagrams, API contracts |
| `@designer` | UX/UI specs, user flows, component states, accessibility |
| `@test-engineer` | **Writes failing tests BEFORE implementation — confirms RED** |
| `@engineer` | Implementation — receives failing tests, makes them pass |
| `@devops-azure` | CI/CD pipelines, Azure infrastructure, IaC (Bicep/Terraform) |

## Test-First Contract (Non-Negotiable)
`@test-engineer` writes and confirms failing tests (RED) before `@engineer` writes any
implementation code. `@orchestrator` enforces this gate. It cannot be skipped.

## Before ANY Work
1. Read `design.md` — architecture, patterns, constraints
2. Read `tasks.md` — current task, dependencies, acceptance criteria
3. Check `docs/` for relevant architecture and convention files

## After ANY Work
1. Update `tasks.md` — mark complete, add implementation notes and timestamp
2. Update `design.md` if any architecture decision changed
3. Update `docs/` if conventions, dependencies, or architecture changed

## Workflow (Prescribed Path)

### Let the Orchestrator drive everything:
```
@orchestrator start the ForgeAI engineering workflow for [feature/project]
```

### Or step through manually:
```
@analyst        gather requirements and produce design.md
@architect      design the system based on design.md
@designer       produce UX/UI specs (skip if no user interface)
@test-engineer  write failing tests for [feature] — confirm RED
@engineer       make the failing tests pass — confirm GREEN
@devops-azure   deploy to Azure
```
