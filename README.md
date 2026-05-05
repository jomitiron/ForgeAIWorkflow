# ForgeAI

> AI-first agentic engineering workflow for software engineering projects.

ForgeAI gives your project a team of specialized AI engineering agents that work through a
structured workflow or can be invoked standalone. Built for **Claude Code** and **GitHub Copilot**.

---

## Quick Start

```bash
npx forgeai init
```

---

## The Team

| Agent | Name | Role | Core Responsibility |
|-------|------|------|-------------------|
| **Orchestrator** | Max | Project coordinator | Runs the workflow, enforces quality gates, routes tasks |
| **Codebase Docs** | Sage | Documentation | Scans and documents existing codebases — no assumptions |
| **Analyst** | Sam | Requirements | PRDs, user stories, acceptance criteria |
| **Architect** | Leo | System design | Architecture, ADRs, Mermaid diagrams, API design |
| **Designer** | Mia | UX/UI | User flows, screen specs, accessibility |
| **Engineer** | Finn | Implementation | Code, code review, debugging — minimal diff |
| **Test Engineer** | Riley | Quality | TDD, unit/integration/E2E tests, coverage |
| **DevOps Azure** | Drew | Delivery | CI/CD, Azure infrastructure, IaC |

---

## Two Paths

### Prescribed Workflow
The Orchestrator guides you through the full engineering lifecycle with hard quality gates.
The **Test Engineer must write and confirm failing tests before the Engineer writes any
implementation code** — this is a non-negotiable gate.

```
Requirements → Architecture → Design → [Tests Written] → Implementation → [Tests Pass] → Deploy
```

**Claude Code / Copilot:**
```
/forge-orchestrate       # Let the Orchestrator drive everything
/forge-requirements
/forge-architecture
/forge-design
/forge-testing
/forge-implementation
/forge-deployment
/forge-document-codebase # Standalone: scan and document an existing codebase
```

**Copilot Chat:**
```
@orchestrator start the ForgeAI workflow
```

### Standalone
Invoke any agent directly for a specific task:

**Claude Code (sub-agents):**
```
claude --agent analyst        "write a PRD for a user authentication feature"
claude --agent architect      "design the database schema for multi-tenancy"
claude --agent test-engineer  "write tests for the auth module before I implement it"
claude --agent engineer       "implement the login endpoint — tests already exist"
claude --agent devops-azure   "create a CI/CD pipeline for this Node.js app"
```

**Copilot Chat:**
```
@analyst write a PRD for user authentication
@architect review the current system design and produce ADRs
@test-engineer write failing tests for the payment module
@engineer implement the payment module so all tests pass
```

---

## Test-First Contract

ForgeAI enforces TDD through an explicit handoff contract between the Orchestrator
and Test Engineer:

```
1. Orchestrator → Test Engineer   "Write failing tests for [feature]"
2. Test Engineer → Orchestrator   Confirms tests written + all RED
3. Orchestrator → Engineer        "Make these tests pass. Do not write tests."
4. Engineer → Orchestrator        Confirms all tests GREEN
5. Orchestrator → Engineer        "Refactor if needed. Tests must stay GREEN."
```

Neither the Engineer nor the Orchestrator may skip step 2.

---

## What Gets Installed

### Claude Code
```
CLAUDE.md
.claude/
├── agents/
│   ├── orchestrator.md
│   ├── analyst.md
│   ├── architect.md
│   ├── designer.md
│   ├── engineer.md
│   ├── test-engineer.md
│   └── devops-azure.md
└── commands/
    ├── forge-orchestrate.md
    ├── forge-requirements.md
    ├── forge-architecture.md
    ├── forge-design.md
    ├── forge-testing.md
    ├── forge-implementation.md
    ├── forge-deployment.md
    ├── forge-create-prd.md
    ├── forge-review-architecture.md
    ├── forge-generate-tasks.md
    └── forge-process-task-list.md
```

### GitHub Copilot
```
.github/
├── copilot-instructions.md
├── agents/
│   ├── orchestrator.agent.md
│   ├── analyst.agent.md
│   ├── architect.agent.md
│   ├── designer.agent.md
│   ├── engineer.agent.md
│   ├── test-engineer.agent.md
│   └── devops-azure.agent.md
└── prompts/
    ├── forge-orchestrate.prompt.md
    ├── forge-requirements.prompt.md
    ├── forge-architecture.prompt.md
    ├── forge-design.prompt.md
    ├── forge-testing.prompt.md
    ├── forge-implementation.prompt.md
    ├── forge-deployment.prompt.md
    ├── forge-create-prd.prompt.md
    ├── forge-review-architecture.prompt.md
    ├── forge-generate-tasks.prompt.md
    └── forge-process-task-list.prompt.md
```

---

## Core Principles

1. **Orchestrator owns the workflow** — agents do not self-assign tasks or skip gates
2. **Test-first is non-negotiable** — no implementation without confirmed failing tests
3. **Smallest possible diff** — Engineer never reformats or refactors unrelated code
4. **Design.md is the source of truth** — all agents read it before acting
5. **Explicit over implicit** — every handoff has a written confirmation message

---

## Inspired By

- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD)
- [CampAIR](https://campair.dev) by Greg Ratajik

---

## License

MIT
