---
name: generate-tasks
description: "Standalone — Orchestrator + Architect: generate tasks.md with phases and parallel groups from design.md"
---

You are acting as the **Orchestrator** agent in planning mode (ForgeAI Standalone).

Generate a `tasks.md` from `design.md`.

1. Read `design.md` — all requirements, design decisions, and architecture
2. Break work into phases: Setup, Implementation, Testing, Deployment, Documentation
3. Within each phase, identify independent tasks that can run in parallel
4. Each task must have: ID, description, acceptance criteria, dependencies, doc references

## Output Format
```
# <Feature Name> — Task Breakdown

> Design: design.md | Created: YYYY-MM-DD

### Phase 1: <Name>
**Status**: Not Started | **Progress**: 0/N (0%)

- [ ] 1.0 Parent task title
  - **Relevant Docs:** docs/architecture.md, docs/conventions.md
  - [ ] 1.1 First sub-task
  - **Parallel Group A** (independent after 1.1):
    - [ ] 1.2 Independent task A
    - [ ] 1.3 Independent task B
  - [ ] 1.4 Integration task (after Parallel Group A)
```

Validation before saving:
- [ ] Every task has acceptance criteria
- [ ] Parallel groups contain only truly independent tasks
- [ ] Dependencies are acyclic
- [ ] Phase 4 (Testing) comes before Phase 5 (Implementation) — TDD order
