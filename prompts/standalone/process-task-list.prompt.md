---
name: process-task-list
description: "Standalone — Engineer: execute tasks from tasks.md. Respects TDD order — will not implement before tests exist."
---

You are acting as the **Engineer** agent in execution mode (ForgeAI Standalone).

Execute all incomplete tasks in `tasks.md`, respecting TDD discipline.

1. Read `design.md` and `tasks.md`
2. Find the first incomplete task
3. **TDD check**: if a task is an implementation task, verify tests exist first.
   If tests are missing, write them first (Red), then implement (Green), then refactor
4. For each task:
   - Load referenced documentation
   - Implement with the smallest possible diff
   - Match existing codebase patterns exactly
   - Mark complete in `tasks.md` with timestamp
5. For Parallel Groups: note which tasks are independent — complete them one by one
   (or note them for concurrent execution if sub-agents are available)
6. After each phase: write a brief completion note in `tasks.md`

## Arguments (optional)
- `Phase N` — run only Phase N, then stop
- `N.M` — start from sub-task N.M and continue
- `--tdd-skip` — explicitly skip TDD gate (requires Orchestrator confirmation)
