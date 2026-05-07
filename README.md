# ForgeAI

> AI-first agentic engineering workflow for software engineering projects.

ForgeAI gives your project a team of specialized AI engineering agents that work through a
structured workflow or can be invoked standalone. Built for **Claude Code** and **GitHub Copilot**.

---

## Quick Start

```bash
npx forgeai-workflow init
```

## How-To Guides

Full walkthroughs with verbatim agent conversations for every scenario:

- [HOWTOClaude.md](HOWTOClaude.md) — Claude Code guide (blog from scratch, existing apps, resuming, standalone agents, QA, health scans)
- [HOWTOCopilot.md](HOWTOCopilot.md) — GitHub Copilot guide (same scenarios, Copilot-specific commands)

---

## The Team

| Agent | Name | Role | Core Responsibility |
|-------|------|------|-------------------|
| **Orchestrator** | Jabari | Project coordinator | Runs the workflow, enforces quality checkpoints, routes tasks |
| **Codebase Docs** | Amina | Documentation | Scans and documents codebases — no assumptions. Architecture health scans. |
| **Analyst** | Imani | Requirements | PRDs, user stories, acceptance criteria |
| **Architect** | Zuberi | System design | Architecture, ADRs, Mermaid diagrams, API design |
| **Designer** | Zuri | UX/UI | User flows, screen specs, accessibility |
| **Test Engineer** | Kofi | TDD | Writes failing tests BEFORE implementation — confirms all tests are failing |
| **Engineer** | Rashidi | Implementation | Makes failing tests pass — minimal diff, no test changes |
| **QA** | Neema | Browser testing | Playwright-driven QA, health scores, bug fix workflow |
| **DevOps Azure** | Faraji | Delivery | CI/CD, Azure infrastructure, IaC |

---

## Two Paths

### Prescribed Workflow
Jabari (Orchestrator) guides you through the full engineering lifecycle with hard quality checkpoints.
**Kofi (Test Engineer) must write and confirm all tests are failing before Rashidi (Engineer) writes
any implementation code** — this is non-negotiable.

```
Requirements → Architecture → Design → [Tests Failing] → Implementation → [Tests Passing] → QA → Deploy
```

**Claude Code:**
```
/forge-orchestrate       # Let Jabari (Orchestrator) drive everything
/forge-requirements      # Imani (Analyst)
/forge-architecture      # Zuberi (Architect)
/forge-design            # Zuri (Designer)
/forge-testing           # Kofi (Test Engineer)
/forge-implementation    # Rashidi (Engineer)
/forge-deployment        # Faraji (DevOps Azure)
/forge-document-codebase # Standalone: scan and document an existing codebase
```

**GitHub Copilot:**
```
/forge/orchestrate       # Let Jabari (Orchestrator) drive everything
/forge/requirements      # Imani (Analyst)
/forge/architecture      # Zuberi (Architect)
/forge/design            # Zuri (Designer)
/forge/testing           # Kofi (Test Engineer)
/forge/implementation    # Rashidi (Engineer)
/forge/deployment        # Faraji (DevOps Azure)
```

### Standalone
Invoke any agent directly for a specific task:

**Claude Code:**
```
@orchestrator
@analyst
@architect
@designer
@test-engineer
@engineer
@qa
@devops-azure
@codebase-docs
```

**Copilot Chat:**
```
@orchestrator   start the ForgeAI workflow
@analyst        write a PRD for user authentication
@architect      review the current system design and produce ADRs
@designer       spec the UI for the login flow
@test-engineer  write failing tests for the payment module
@engineer       implement the payment module so all tests pass
@qa             run a full browser QA pass on the current build
@devops-azure   create a CI/CD pipeline for this Node.js app
```

---

## Test-First Contract

ForgeAI enforces TDD through an explicit handoff contract:

```
1. Jabari (Orchestrator) → Kofi (Test Engineer)    "Write failing tests for [feature]"
2. Kofi (Test Engineer)  → Jabari (Orchestrator)   "Tests written — all failing"
3. Jabari (Orchestrator) → Rashidi (Engineer)      "Make these tests pass. Do not write tests."
4. Rashidi (Engineer)    → Jabari (Orchestrator)   "Implementation complete — all tests passing"
5. Jabari (Orchestrator) → Neema (QA)              "Browser-test the feature"
6. Neema (QA)            → Jabari (Orchestrator)   "Browser QA complete"
```

Neither Rashidi (Engineer) nor Jabari (Orchestrator) may skip step 2.

---

## What Gets Installed

### Claude Code
```
CLAUDE.md
.claude/
├── agents/
│   ├── orchestrator.md
│   ├── codebase-docs.md
│   ├── analyst.md
│   ├── architect.md
│   ├── designer.md
│   ├── test-engineer.md
│   ├── engineer.md
│   ├── qa.md
│   └── devops-azure.md
└── commands/
    ├── forge-orchestrate.md
    ├── forge-requirements.md
    ├── forge-architecture.md
    ├── forge-design.md
    ├── forge-testing.md
    ├── forge-implementation.md
    └── forge-deployment.md
```

### GitHub Copilot
```
.github/
├── copilot-instructions.md
├── agents/
│   ├── orchestrator.agent.md
│   ├── codebase-docs.agent.md
│   ├── analyst.agent.md
│   ├── architect.agent.md
│   ├── designer.agent.md
│   ├── test-engineer.agent.md
│   ├── engineer.agent.md
│   ├── qa.agent.md
│   └── devops-azure.agent.md
└── prompts/
    └── forge/
        ├── orchestrate.prompt.md
        ├── requirements.prompt.md
        ├── architecture.prompt.md
        ├── design.prompt.md
        ├── testing.prompt.md
        ├── implementation.prompt.md
        └── deployment.prompt.md
```

---

## Core Principles

1. **Orchestrator owns the workflow** — agents do not self-assign tasks or skip checkpoints
2. **Test-first is non-negotiable** — no implementation without confirmed failing tests
3. **Smallest possible diff** — Rashidi (Engineer) never reformats or refactors unrelated code
4. **Design.md is the source of truth** — all agents read it before acting
5. **Explicit over implicit** — every handoff has a written confirmation message

---

## Inspired By

- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD)
- [CampAIR](https://campair.dev) by Greg Ratajik

---

## License

MIT
