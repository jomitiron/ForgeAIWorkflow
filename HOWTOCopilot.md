# HOWTOCopilot.md — ForgeAI for GitHub Copilot

ForgeAI gives your project a team of nine specialized AI engineering agents that work through a structured, gate-enforced workflow or can be invoked standalone for specific tasks. It is built for both Claude Code and GitHub Copilot — this guide covers Copilot specifically. If you are new to agentic workflows or ForgeAI in general, this guide will walk you through setup, every agent, and six complete scenarios with real conversations.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Copilot-Specific Setup](#copilot-specific-setup)
3. [How to Talk to Agents](#how-to-talk-to-agents)
4. [Scenario 1 — Building a Blog App from Scratch](#scenario-1--building-a-blog-app-from-scratch)
5. [Scenario 2 — Adding a Feature to an Existing App](#scenario-2--adding-a-feature-to-an-existing-app)
6. [Scenario 3 — Resuming an Interrupted Workflow](#scenario-3--resuming-an-interrupted-workflow)
7. [Scenario 4 — Standalone: Documenting a Codebase](#scenario-4--standalone-documenting-a-codebase)
8. [Scenario 5 — QA on a Deployed Feature](#scenario-5--qa-on-a-deployed-feature)
9. [Scenario 6 — Architecture Health Scan](#scenario-6--architecture-health-scan)
10. [Quick Reference](#quick-reference)

---

## Introduction

ForgeAI installs a team of nine AI agents into your project via `npx forgeai-workflow init`. Each agent has a focused role — requirements, architecture, design, testing, implementation, QA, or deployment — and they hand off to one another through explicit quality gates. No agent skips ahead, no gate is cleared without evidence, and no file is written without your approval.

This guide is for developers who are new to ForgeAI or to AI-powered agentic workflows. It assumes you have GitHub Copilot Chat available in VS Code or on GitHub.com, and that you have run `npx forgeai-workflow init` and selected the Copilot option. For installation, see the [README](README.md).

> **Copilot-specific note:** ForgeAI agent files for Copilot live in `.github/agents/` and prompt files live in `.github/prompts/forge/`. This is different from Claude Code, where agents live in `.claude/agents/` and commands live in `.claude/commands/`. Instructions for the whole team are in `.github/copilot-instructions.md`.

---

## Copilot-Specific Setup

### Opening Copilot Chat in VS Code

1. Open your project in VS Code.
2. Click the Copilot icon in the Activity Bar (left side) or press `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Shift+I` (Mac).
3. The Copilot Chat panel opens on the left. This is where all ForgeAI agent conversations happen.

> **Copilot vs inline suggestions:** Copilot also provides inline code completions as you type in the editor. ForgeAI agents do not work through inline completions — they work exclusively through the Copilot Chat panel. When this guide says "type `@orchestrator`", it means type that into the Copilot Chat input box, not into your code file.

### Invoking Agents by Name

In the Copilot Chat input box, type the agent's handle preceded by `@`:

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

Copilot may show agent name suggestions as you type — you can click them in the sidebar or finish typing and press Enter. Either way, the agent scans the project silently, then greets you.

> **Copilot difference:** In Claude Code, agents are invoked as sub-agents or via `/forge/*` slash commands. In Copilot, the primary way to invoke an agent is `@agent-name` in the Chat panel. Slash commands are available as a secondary option (see below).

### Using Slash Commands

ForgeAI also registers prompt files as Copilot slash commands. Use these to jump directly to a phase without going through the Orchestrator:

```
/forge/orchestrate       — full workflow, Jabari drives
/forge/requirements      — Imani gathers requirements
/forge/architecture      — Zuberi designs the system
/forge/design            — Zuri specs the UI
/forge/testing           — Kofi writes failing tests
/forge/implementation    — Rashidi implements against tests
/forge/deployment        — Faraji deploys to Azure
```

> **Note on slash command format:** ForgeAI slash commands use a path-style format with a forward slash: `/forge/requirements`. Both Claude Code and Copilot use this format.

### Where Files Are Installed

After `npx forgeai-workflow init` (Copilot mode), your project will contain:

```
.github/
├── copilot-instructions.md       — global Copilot workspace instructions
├── agents/
│   ├── orchestrator.agent.md
│   ├── analyst.agent.md
│   ├── architect.agent.md
│   ├── designer.agent.md
│   ├── engineer.agent.md
│   ├── test-engineer.agent.md
│   ├── qa.agent.md
│   ├── devops-azure.agent.md
│   └── codebase-docs.agent.md
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

## How to Talk to Agents

### The STOP Pattern

Every ForgeAI agent is instructed to stop and wait after every output. This is not a bug — it is the core conversational contract. When an agent says "STOP" or ends with a question, it will not proceed until you respond. This gives you full control at every step.

If you try to rush ahead (for example, saying "just do everything"), the Orchestrator will acknowledge your intent, show you what it would do, ask for confirmation, and still wait before acting.

### Change Reports

Before any agent writes a file, it shows you a Change Report:

```
Change Report — [Agent name]

Will create / update:
  - [file list]
Will NOT touch:
  - [explicit exclusions]
Risks:
  - [side effects, or "none"]

Proceed? (yes / no)
```

You must say **yes** to proceed. Saying "go ahead", "sure", or "sounds good" also works — the agent will accept natural affirmatives. Saying **no** stops the agent and invites you to adjust.

### Gates

Gates are hard checkpoints that prevent the next phase from starting until the current one is genuinely complete. The gates are:

| Gate message | Meaning | Who says it |
|---|---|---|
| `✅ Requirements complete` | Requirements approved, design.md written | Imani |
| `✅ Architecture complete` | Architecture done, ADRs written | Zuberi |
| `✅ Design complete` | UX specs written for all screens | Zuri |
| `✅ Tests written — all failing` | Tests written, all failing | Kofi |
| `✅ Implementation complete — all tests passing` | All tests passing | Rashidi |
| `✅ Browser QA complete` | All critical/high bugs resolved | Neema |
| `✅ Deployed and running` | Deployed, smoke tests passed | Faraji |

"Should be fine", "probably passing", or "looks good" does not clear any gate. The Orchestrator will name the blocker and ask how to proceed.

---

## Scenario 1 — Building a Blog App from Scratch

**Setup:** Empty repository. No source code, no documentation. You want to build Inkwell, a personal blogging platform with React, Node/Express, and PostgreSQL.

**Features:** Write, edit, and delete blog posts. Organize posts by category. Author login. Public reading without login.

Open VS Code. Open the Copilot Chat panel. Type `@orchestrator` and press Enter.

---

### Phase 0 — Orchestrator Greets

*Jabari silently checks the repository before saying anything — no source code, no design.md, no tasks.md, no docs.*

**Jabari:**

> 👋 I'm Jabari, your ForgeAI Orchestrator.
>
> Mode: New Project
> design.md:  ✗ not found
> tasks.md:   ✗ not found
> Docs:       ✗ not found
>
> No code yet — we'll start from requirements.
>
> What would you like to do?
>   W · Full workflow from scratch
>   R · Resume from a specific phase
>   P · Run one phase only
>   D · Document existing codebase first (Amina)
>   S · Show team and workflow status
>   ? · All options

*Jabari stops here. He will not do anything until you respond.*

**You:** `W`

**Jabari:**

> What are we building? One sentence.

**You:** `Inkwell — a personal blogging platform`

**Jabari:**

> Change Report — Phase 1: Requirements
>
> Agent:    Imani (@analyst)
> Will do:
>   - Ask you 5 questions about Inkwell
>   - Write design.md with requirements, user stories, and acceptance criteria
> Will NOT touch:
>   - Source code, tests, or configuration files
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 1 — Requirements (Imani)

*Jabari hands off to Imani. In Copilot, this means Imani's instructions take effect for the next turn. Imani scans silently and picks up the project name from context.*

**Imani:**

> 👋 I'm Imani, your ForgeAI Analyst. I'll turn your idea into clear requirements.
>
> What would you like to do?
>   R · Gather requirements for a new feature
>   P · Write a full PRD (design.md)
>   S · Write user stories only
>   A · Define acceptance criteria for existing stories
>   ? · Show all options

*Because Jabari already confirmed this is a new project called Inkwell, Imani recognises the intent.*

**You:** `P`

**Imani:**

> What are we building? One or two sentences.

**You:** `Inkwell is a personal blogging platform. Authors can write, edit, and delete posts, organize them into categories, and log in. Readers browse and read posts publicly without logging in.`

**Imani:**

> Who uses it and what problem does it solve?

**You:** `Two users: the author (one person) who needs a clean writing and publishing tool, and public readers who want to read articles without signing up for anything.`

**Imani:**

> What does success look like — measurable?

**You:** `Author can publish a new post in under 2 minutes. Pages load in under 1 second. Zero reader sign-up friction.`

**Imani:**

> Any hard constraints? (tech stack, deadline, compliance, budget)

**You:** `React frontend, Node/Express backend, PostgreSQL. No deadline. No compliance requirements. Hosting budget under $20/month.`

**Imani:**

> What's explicitly out of scope?

**You:** `Comments, likes, social sharing, multiple authors, RSS feed, email newsletters.`

*Imani has all he needs. He summarises what he captured.*

**Imani:**

> Here's what I've captured:
>
> - **What:** Personal blogging platform — write, edit, delete posts; organize by category; author login; public reading
> - **Users:** Author (single) + public readers
> - **Success:** Publish in <2 min, pages <1s, zero reader friction
> - **Stack:** React + Node/Express + PostgreSQL
> - **Budget:** <$20/month hosting
> - **Out of scope:** Comments, likes, social sharing, multiple authors, RSS, email
>
> Does this capture it? Anything missing or wrong?

**You:** `That's it. Add a rich text editor for writing.`

**Imani:**

> Noted — rich text editor for the post authoring screen.
>
> Change Report — Imani (Analyst)
>
> Will create / update:
>   - design.md  [new]
> Will NOT touch:
>   - Source code, tests, or other docs
>
> Proceed? (yes / no)

**You:** `yes`

*Imani writes design.md. The file contains the overview, goals, user stories table, functional requirements table with GIVEN/WHEN/THEN acceptance criteria, non-functional requirements, non-goals, and open questions.*

**Imani:**

> design.md ready.
>
> ✅ Requirements complete

*Jabari picks up the gate signal.*

**Jabari:**

> ✓ Phase 1 done — starting Phase 2
>
> Change Report — Phase 2: Architecture
>
> Agent:    Zuberi (@architect)
> Will do:
>   - Read design.md
>   - Present 2 key architectural decisions with options
>   - Draw C4 container diagram and sequence diagram (Mermaid)
>   - Write docs/architecture.md and ADRs
> Will NOT touch:
>   - Source code, tests, or design.md content
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 2 — Architecture (Zuberi)

*Zuberi scans design.md silently, then greets.*

**Zuberi:**

> 👋 I'm Zuberi, your ForgeAI Architect. I design systems and record the decisions that shape them.
>
> What would you like to do?
>   D · Design the system (reads design.md)
>   A · Write an ADR for a specific decision
>   C · Draw a C4 or sequence diagram
>   R · Review and critique an existing design
>   ? · Show all options

**You:** `D`

**Zuberi:**

> Any constraints I should know before designing? (existing stack, team size, cost limits, timeline)

**You:** `Single developer. Hosting budget $20/month — so no Kubernetes, no managed containers. Keep it simple.`

*Zuberi identifies the two decisions that shape everything else.*

**Zuberi:**

> Decision 1: Frontend hosting strategy
>
> Option A: Static site (Vite build → S3/Cloudflare Pages)
> Pros: Free or near-free hosting, fast CDN delivery
> Cons: No SSR, SEO relies on client-side rendering
>
> Option B: Server-rendered React (Next.js on App Service)
> Pros: Better SEO, simpler data fetching
> Cons: Adds ~$10-15/month for App Service
>
> Recommendation: Option A — budget constraint is firm, and a personal blog's SEO needs are modest
>
> Go with A or B?

**You:** `A`

**Zuberi:**

> Decision 2: API and database topology
>
> Option A: Express API + managed PostgreSQL (Azure Database for PostgreSQL Flexible Server — Basic tier)
> Pros: Fully managed, backups included, ~$15/month Basic
> Cons: Slightly higher than raw VM
>
> Option B: Express API + self-managed PostgreSQL on a small VM
> Pros: Potentially cheaper
> Cons: You manage backups, patching, security
>
> Recommendation: Option A — managed database removes operational risk for a solo developer
>
> Go with A or B?

**You:** `A`

*Zuberi draws the diagrams.*

**Zuberi:**

> Here's the C4 container diagram:
>
> ```mermaid
> C4Container
>   title Inkwell — Container Diagram
>
>   Person(author, "Author", "Creates and manages posts")
>   Person(reader, "Reader", "Reads published posts")
>
>   Container(spa, "React SPA", "React + Vite", "Author dashboard and public blog")
>   Container(api, "Express API", "Node.js / Express", "REST API — posts, categories, auth")
>   ContainerDb(db, "PostgreSQL", "Azure Database for PostgreSQL", "Posts, categories, authors")
>   Container(storage, "Blob Storage", "Azure Blob", "Uploaded images")
>
>   Rel(author, spa, "Uses", "HTTPS")
>   Rel(reader, spa, "Reads", "HTTPS")
>   Rel(spa, api, "API calls", "HTTPS / JSON")
>   Rel(api, db, "Reads / writes", "TLS")
>   Rel(api, storage, "Stores images", "SDK")
> ```
>
> Does this look right?

**You:** `yes`

**Zuberi:**

> Here's the sequence diagram for publishing a post:
>
> ```mermaid
> sequenceDiagram
>   participant A as Author (Browser)
>   participant SPA as React SPA
>   participant API as Express API
>   participant DB as PostgreSQL
>
>   A->>SPA: Writes post content
>   A->>SPA: Clicks Publish
>   SPA->>API: POST /api/posts (JWT in header)
>   API->>API: Validate JWT
>   API->>DB: INSERT post (status=published)
>   DB-->>API: post_id
>   API-->>SPA: 201 { id, slug, published_at }
>   SPA-->>A: Redirects to /posts/:slug
> ```
>
> Does this look right?

**You:** `yes`

*Zuberi shows the Change Report.*

**Zuberi:**

> Change Report — Zuberi (Architect)
>
> Will create / update:
>   - design.md  (Design Considerations section)
>   - docs/architecture.md
>   - docs/adr/ADR-001-static-spa-hosting.md
>   - docs/adr/ADR-002-managed-postgresql.md
> Will NOT touch:
>   - Source code, tests, or configuration files
>
> Proceed? (yes / no)

**You:** `yes`

*Zuberi writes the files.*

**Zuberi:**

> Architecture done — 2 ADRs recorded.
>
> ✅ Architecture complete

**Jabari:**

> ✓ Phase 2 done — starting Phase 3
>
> Inkwell has a user interface (author dashboard + public reading pages). Should Zuri spec the screens?

**You:** `yes`

---

### Phase 3 — UX Design (Zuri)

*Jabari shows the Change Report for Phase 3.*

**Jabari:**

> Change Report — Phase 3: Design
>
> Agent:    Zuri (@designer)
> Will do:
>   - Spec all screens: Login, Author Dashboard, Post Editor, Public Blog, Post Detail
>   - Define component states, user flows, error states, accessibility notes
>   - Write docs/ux-specs.md
> Will NOT touch:
>   - Source code, tests, design.md, or architecture docs
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

**Zuri:**

> 👋 I'm Zuri, your ForgeAI Designer. I'll spec every screen so the engineers know exactly what to build.
>
> What would you like to do?
>   S · Spec all screens for a feature
>   F · Map a user flow
>   C · Define a component (states, interactions)
>   A · Accessibility review of an existing spec
>   ? · Show all options

**You:** `S`

**Zuri:**

> How many screens or surfaces does this feature touch? List them briefly.

**You:** `Login screen, Author Dashboard (post list), Post Editor (rich text), Public Blog homepage, Public Post detail page.`

**Zuri:**

> Is there an existing design system or component library I should follow?

**You:** `No design system. Keep it minimal — think Substack-like aesthetic.`

*Zuri works through each screen, asking the primary action question, showing the spec, and waiting for confirmation. Below is the condensed version of three key screens.*

**Zuri:**

> What's the primary user action on the Login screen?

**You:** `Enter email and password, click Sign In.`

*Zuri shows the Login screen spec and asks "Does this look right?" — you confirm. She repeats for the Post Editor and Public Blog Homepage.*

**Zuri:**

> Change Report — Zuri (Designer)
>
> Will create / update:
>   - docs/ux-specs.md  [screens: Login, Author Dashboard, Post Editor, Public Blog, Post Detail]
> Will NOT touch:
>   - Source code, tests, design.md, or architecture docs
>
> Proceed? (yes / no)

**You:** `yes`

*Zuri writes docs/ux-specs.md.*

**Zuri:**

> UX specs done — 5 screens.
>
> ✅ Design complete

**Jabari:**

> ✓ Phase 3 done — starting Phase 4
>
> Change Report — Phase 4: Testing
>
> Agent:    Kofi (@test-engineer)
> Will do:
>   - Read design.md acceptance criteria
>   - Write failing tests (unit + integration + E2E) for all FRs
>   - Confirm all tests are RED before clearing the gate
> Will NOT touch:
>   - Implementation code, design.md, or docs
> Risks:
>   - none — tests are designed to fail at this stage
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 4 — Testing (Kofi)

**Kofi:**

> 👋 I'm Kofi, your ForgeAI Test Engineer. Tests come first — always.
>
> What would you like to do?
>   W · Write failing tests for a feature (RED)
>   V · Validate tests after implementation (GREEN)
>   S · Show test scope for a feature
>   ? · Show all options

**You:** `W`

**Kofi:**

> Which feature or component?

**You:** `All of Inkwell — posts CRUD, categories, auth, public reading.`

*Kofi reads design.md and shows the proposed test scope.*

**Kofi:**

> I'll write tests for:
>   - POST /api/posts         → integration (create post)
>   - GET /api/posts          → integration (list posts)
>   - GET /api/posts/:id      → integration (get single)
>   - PUT /api/posts/:id      → integration (update)
>   - DELETE /api/posts/:id   → integration (delete)
>   - POST /api/auth/login    → integration (auth flow)
>   - GET /api/categories     → integration (list categories)
>   - PostService.createPost  → unit (validation logic)
>   - PostService.slugify     → unit (slug generation)
>   - Auth middleware         → unit (JWT validation)
>   - Public blog page        → E2E (reader visits homepage, clicks post)
>   - Author login + publish  → E2E (full author journey)
>
> Proceed?

**You:** `yes`

**Kofi:**

> Change Report — Kofi (Test Engineer)
>
> Will create / update:
>   - tests/unit/post-service.test.js
>   - tests/unit/auth-middleware.test.js
>   - tests/integration/posts.test.js
>   - tests/integration/auth.test.js
>   - tests/integration/categories.test.js
>   - tests/e2e/reader-journey.spec.js
>   - tests/e2e/author-journey.spec.js
> Will NOT touch:
>   - Implementation code, design.md, or any non-test files
> Note:
>   - Tests will fail by design (RED) — this is expected
>
> Proceed? (yes / no)

**You:** `yes`

*Kofi writes all test files. Tests import modules that do not yet exist, so they fail immediately.*

**Kofi:**

> ✅ Tests written — all failing — 24 tests written
>
> Unit:        8   tests/unit/
> Integration: 12  tests/integration/
> E2E:         4   tests/e2e/
>
> FR coverage:
> - FR-001 (create post)  → TC-001, TC-002, TC-003
> - FR-002 (edit post)    → TC-004, TC-005
> - FR-003 (delete post)  → TC-006
> - FR-004 (auth)         → TC-007, TC-008, TC-009
> - FR-005 (categories)   → TC-010, TC-011
> - FR-006 (public read)  → TC-012 (E2E)
>
> Ready for Engineer (Rashidi).

**Jabari:**

> ✓ Phase 4 done — tests confirmed failing
>
> Change Report — Phase 5: Implementation
>
> Agent:    Rashidi (@engineer)
> Will do:
>   - Read the 24 failing tests
>   - Implement source code to make all tests pass
>   - Smallest possible diff — no extra features, no reformatting
> Will NOT touch:
>   - Test files, design.md, or docs
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 5 — Implementation (Rashidi)

**Rashidi:**

> 👋 I'm Rashidi, your ForgeAI Engineer. I turn failing tests green with the smallest diff possible.
>
> What would you like to do?
>   I · Implement (TDD — requires confirmed failing tests)
>   R · Code review
>   T · Write test + implement from scratch (standalone TDD)
>   ? · Show all options

**You:** `I`

*Rashidi checks that failing tests are confirmed — found in context.*

**Rashidi:**

> I have 24 failing tests. Any constraints before I start? (approach, patterns, files to avoid)

**You:** `Use Express Router pattern. Prisma for ORM. Separate routes, controllers, and services.`

**Rashidi:**

> Change Report — Rashidi (Engineer)
>
> Will create / update:
>   - src/app.js
>   - src/routes/posts.js
>   - src/routes/auth.js
>   - src/routes/categories.js
>   - src/controllers/post.controller.js
>   - src/controllers/auth.controller.js
>   - src/controllers/category.controller.js
>   - src/services/post.service.js
>   - src/services/auth.service.js
>   - src/middleware/auth.middleware.js
>   - src/db/schema.prisma
>   - src/db/client.js
> Will NOT touch:
>   - Test files, design.md, docs/, or any file not listed above
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

*Rashidi implements all source files. Each file is minimal — only what the tests require.*

**Rashidi:**

> ✅ Implementation complete — all tests passing
> 24 passing, 0 failing
> Files changed: src/app.js, src/routes/*.js, src/controllers/*.js, src/services/*.js, src/middleware/auth.middleware.js, src/db/schema.prisma, src/db/client.js

**Jabari:**

> ✓ Phase 5 done — all tests passing
>
> Would you like Neema to run a QA pass on the running app before we deploy?

**You:** `yes`

---

### Phase 5.5 — QA (Neema)

**Jabari:**

> Change Report — Phase 5.5: QA
>
> Agent:    Neema (@qa)
> Will do:
>   - Standard tier: systematic exploration of all Inkwell routes
>   - Playwright scripts for each page
>   - Bug report with severity levels
>   - Health score
>   - Fix critical/high bugs
> Will NOT touch:
>   - Test files, design.md, or docs (unless fixing a bug requires a source change)
> Risks:
>   - Bug fixes are small targeted changes — each requires its own Change Report
>
> Proceed? (yes / no)

**You:** `yes`

**Neema:**

> 👋 I'm Neema, your ForgeAI QA Engineer. I test what's built so nothing ships broken.
>
> What would you like to do?
>   Q · Quick — smoke test (homepage + top 5 routes, ~1 min)
>   S · Standard — systematic exploration of all affected routes
>   E · Exhaustive — full app including accessibility and edge cases
>   F · Fix bugs found in a previous QA run
>   ? · Show all options

**You:** `S`

*Neema checks that implementation is complete — confirmed. Asks for the URL.*

**Neema:**

> What's the app URL?

**You:** `http://localhost:3000`

*Neema runs the orientation script, finds the app, maps all routes, then runs page-check scripts for each route. Screenshots land in `.qa/screenshots/`.*

*After exploring all routes, Neema documents findings.*

**Neema:**

> QA exploration complete. Here's what I found:
>
> Bug 1
> Severity: high
> Page:     http://localhost:3000/posts/new
> Found:    Submitting the post editor with an empty title returns a 500 error with a raw stack trace visible in the browser
> Expected: Validation error message: "Title is required"
> Evidence: .qa/screenshots/post-editor-empty-submit.png
> Steps:    1. Log in as author  2. Click New Post  3. Leave title empty  4. Click Publish
>
> Bug 2
> Severity: medium
> Page:     http://localhost:3000
> Found:    Homepage shows "undefined" for post date when no posts exist
> Expected: Empty state message: "No posts yet"
> Evidence: .qa/screenshots/homepage-empty.png
> Steps:    1. Open homepage with zero published posts
>
> ---
>
> Health Score — Inkwell
>
> Category          Weight   Score   Weighted
> ─────────────────────────────────────────────
> Functional          20%     7/10    14.0
> Console errors      15%     9/10    13.5
> Accessibility       15%     7/10    10.5
> UX / flows          15%     8/10    12.0
> Performance         10%     9/10     9.0
> Visual              10%     8/10     8.0
> Links / routing     10%     9/10     9.0
> Content             5%      7/10     3.5
> ─────────────────────────────────────────────
> TOTAL                               79.5/100
>
> Ship readiness: ⚠️ SHIP WITH CAUTION
>
> ---
>
> Fix Bug 1 (high severity)? (yes / skip)

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Empty title causes 500 with stack trace
> Will fix:
>   - src/controllers/post.controller.js:18 — add title validation before DB call, return 400 with message
> Will NOT touch:
>   - All other files
> Risk:
>   - low
>
> Proceed? (yes / no)

**You:** `yes`

*Neema applies the fix, re-runs the page-check script for the post editor route, takes an after screenshot.*

**Neema:**

> Bug 1 fixed and verified. Re-run shows 400 with "Title is required" — no stack trace.
>
> Bug 2 (medium — homepage empty state) — fix? (yes / skip)

**You:** `skip`

**Neema:**

> ✅ Browser QA complete
>
> Health score: 84/100  (79.5 → 84 after fix)
> Bugs found:   2 total  (0 critical, 1 high, 1 medium)
> Bugs fixed:   1 — empty title 500 error
> Remaining:    1 medium item (homepage empty state — noted in report)
> Report:       .qa/report-20260506-143022.md
>
> Ready for deployment. Next: `/forge/deployment`

**Jabari:**

> ✓ Phase 5.5 done — browser QA complete
>
> Change Report — Phase 6: Deployment
>
> Agent:    Faraji (@devops-azure)
> Will do:
>   - Create GitHub Actions CI/CD pipeline
>   - Provision Azure Static Web Apps (frontend) + App Service (API) + Azure Database for PostgreSQL
>   - Deploy Inkwell to production
>   - Configure App Insights monitoring
> Will NOT touch:
>   - Source code, test files, or application logic
> Risks:
>   - Azure resources will incur cost (~$15-20/month estimated)
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 6 — Deployment (Faraji)

**Faraji:**

> 👋 I'm Faraji, your ForgeAI DevOps Engineer. I get your code running in Azure — safely.
>
> What would you like to do?
>   P · Create or update a CI/CD pipeline
>   I · Provision Azure infrastructure (Bicep / Terraform)
>   D · Deploy to an environment
>   M · Set up monitoring and alerts
>   ? · Show all options

**You:** `P`

*Faraji checks that all tests pass and QA is complete — both confirmed.*

**Faraji:**

> Is there an existing pipeline? (yes / no — if yes, I'll extend it rather than replace)

**You:** `No existing pipeline.`

**Faraji:**

> What environments does this pipeline need? (dev / staging / prod)

**You:** `staging and prod`

**Faraji:**

> Any existing service connections or Azure subscriptions to use?

**You:** `Yes — subscription ID: sub-12345. Service connection: inkwell-azure.`

**Faraji:**

> I'll create / update:
>   - Pipeline: CI (lint → test → build) + CD (staging deploy → prod approve → prod deploy)
>   - Environments: staging (auto-deploy on merge to main), prod (manual approval gate)
>   - Approval gates: prod requires manual approval
>
> Proceed?

**You:** `yes`

*Faraji shows the Change Report, then produces the pipeline YAML, Bicep infrastructure files, and deployment configuration.*

**Faraji:**

> Change Report — Faraji (DevOps Azure)
>
> Will create / update:
>   - .github/workflows/inkwell-ci-cd.yml
>   - infrastructure/main.bicep
>   - infrastructure/api.bicep
>   - infrastructure/database.bicep
>   - infrastructure/monitoring.bicep
> Will deploy to:
>   - staging (automatic), prod (manual approval)
> Will NOT touch:
>   - Source code, test files, or application logic
> Risks:
>   - Azure resources will be provisioned — estimated $15-20/month
>
> Proceed? (yes / no)

**You:** `yes`

*Faraji runs the security checklist.*

**Faraji:**

> Security checklist:
>   [x] No secrets in pipeline YAML
>   [x] Managed Identity configured
>   [x] Prod has approval gate
>   [x] Smoke test after each stage
>   [x] IaC scanned (Checkov)
>
> All items confirmed. Proceed with deployment?

**You:** `yes`

*Faraji provisions infrastructure, deploys, runs smoke tests.*

**Faraji:**

> ✅ Deployed and running
> Environment: production
> Health: PASSED
> App Insights: https://portal.azure.com/#resource/inkwell-insights
> Pipeline: https://github.com/you/inkwell/actions/runs/12345

**Jabari:**

> FORGEAI WORKFLOW COMPLETE
>
> Inkwell is live.
>
> Summary:
>   Phase 1 — design.md written
>   Phase 2 — architecture.md + 2 ADRs
>   Phase 3 — ux-specs.md (5 screens)
>   Phase 4 — 24 tests written, all RED
>   Phase 5 — 24 tests passing, all GREEN
>   Phase 5.5 — health score 84/100, 1 bug fixed
>   Phase 6 — deployed to staging + prod
>
> The docs, tests, and infrastructure are all in version control. Amina can document the codebase any time.

---

## Scenario 2 — Adding a Feature to an Existing App

**Setup:** You have TaskFlow, a project management web app. You have been working on it for several months. No ForgeAI. No documentation. The codebase is undocumented — other agents will not have the full picture without a scan first.

**Feature to add:** Global search across projects, tasks, and comments.

---

### Step 1 — Install ForgeAI

Open a terminal in your project root:

```bash
npx forgeai-workflow init
```

The CLI prompts you:

```
Which platform?
  1. Claude Code
  2. GitHub Copilot
  3. Both

> 2
```

ForgeAI installs the `.github/` directory with all agent and prompt files.

---

### Step 2 — Open Copilot Chat, Invoke Orchestrator

Open VS Code. Open the Copilot Chat panel. Type `@orchestrator`.

> **Copilot note:** After `npx forgeai-workflow init`, the agent files are now in `.github/agents/`. Copilot reads these automatically — no restart required. If agents do not appear, reload the VS Code window with `Ctrl+Shift+P` → "Developer: Reload Window".

*Jabari silently scans TaskFlow. He finds source code, no design.md, no tasks.md, no docs folder.*

**Jabari:**

> 👋 I'm Jabari, your ForgeAI Orchestrator.
>
> Mode: Existing Codebase
> design.md:  ✗ not found
> tasks.md:   ✗ not found
> Docs:       ✗ not found
>
> I can see an existing project with no documentation. Amina should document it first — that gives every agent the full picture.
>
> What would you like to do?
>   W · Full workflow from scratch
>   R · Resume from a specific phase
>   P · Run one phase only
>   D · Document existing codebase first (Amina)
>   S · Show team and workflow status
>   ? · All options

**You:** `D`

**Jabari:**

> Change Report — Phase 0: Codebase Documentation
>
> Agent:    Amina (@codebase-docs)
> Will do:
>   - Scan the full TaskFlow codebase
>   - Ask 5 scoping questions
>   - Write docs/ (architecture.md, conventions.md, setup.md, testing.md, dependencies.md, components/)
> Will NOT touch:
>   - Source code, tests, or configuration files
> Risks:
>   - none
>
> Proceed? (yes / no)

**You:** `yes`

---

### Phase 0 — Codebase Documentation (Amina)

*Amina silently scans TaskFlow. He finds the folder structure, package.json, entry points, no CI/CD, no test folder.*

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    Node.js, React, Express, MongoDB
> Entry points:  server/index.js, client/src/main.jsx
> Existing docs: README.md (minimal — setup only)
> Test coverage: test folder exists: no
> CI/CD:         pipeline files found: no
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `D`

*Amina runs the Documentation Sequence — five questions, one at a time.*

**Amina:**

> Who is the primary audience for these docs?
>   1. New engineers joining the team
>   2. External developers consuming an API
>   3. Ops / DevOps running the system
>   4. All of the above

**You:** `1 — new engineers`

**Amina:**

> What level of documentation do you need?
>   1. High-level only — architecture, setup, key concepts
>   2. Component-level — each module/service documented
>   3. Full depth — architecture + components + public API reference

**You:** `2 — component level`

**Amina:**

> What do new team members always ask about or get wrong?

**You:** `They always ask why we use MongoDB instead of PostgreSQL, and they get confused about the task status state machine — it has 6 states and the transitions aren't obvious.`

**Amina:**

> Is there code that is deprecated, experimental, or should be ignored?

**You:** `Yes — the server/legacy-import/ folder. It was used for a one-time data migration and should never be touched.`

**Amina:**

> Are there naming decisions or structures that look odd but are intentional?

**You:** `The 'projects' folder in the client contains both the project list view and the Kanban board — it looks like it should be split but it's intentional because they share a lot of state.`

*Amina scans component relationships and finds an ambiguous module.*

**Amina:**

> `server/utils/transformer.js` appears to format API responses. Is that accurate, or is its actual purpose different?

**You:** `It does two things — it formats responses AND sanitizes user input before DB writes. The name is misleading.`

*Amina confirms the doc plan.*

**Amina:**

> Here's what I'll document:
>
> [ ] docs/architecture.md       — system overview, component map, data flow
> [ ] docs/conventions.md        — naming, patterns, intentional decisions (incl. transformer.js note)
> [ ] docs/setup.md              — getting started, prerequisites, env vars
> [ ] docs/testing.md            — test strategy (noting: no tests currently)
> [ ] docs/dependencies.md       — MongoDB rationale, key libraries
> [ ] docs/components/server.md  — Express API, routes, middleware
> [ ] docs/components/client.md  — React SPA, routing, state
> [ ] docs/components/projects.md — note on intentional co-location
>
> Skipping: server/legacy-import/ (deprecated, flagged by you)
>
> Proceed with all, or adjust the list?

**You:** `Proceed.`

**Amina:**

> Change Report — Amina (Codebase Docs)
>
> Will create / update:
>   - docs/architecture.md
>   - docs/conventions.md
>   - docs/setup.md
>   - docs/testing.md
>   - docs/dependencies.md
>   - docs/components/server.md
>   - docs/components/client.md
>   - docs/components/projects.md
> Will NOT touch:
>   - Source code, tests, or configuration files
>
> Proceed? (yes / no)

**You:** `yes`

*Amina writes each file, showing it before saving and asking "Does this look right?" before moving on. Once all eight files are written:*

**Amina:**

> Documentation complete.
>
> Created:
> - docs/architecture.md
> - docs/conventions.md
> - docs/setup.md
> - docs/testing.md
> - docs/dependencies.md
> - docs/components/server.md
> - docs/components/client.md
> - docs/components/projects.md
>
> Recommended next steps:
> - Add these docs to your PR template checklist
> - Review quarterly — docs go stale
> - Run `/forge/requirements` to plan new features on this documented base

**Jabari:**

> ✓ Phase 0 done — TaskFlow is documented.
>
> What would you like to build next?

**You:** `Global search — across projects, tasks, and comments.`

**Jabari:**

> Sounds like a new feature starting at Phase 1. Shall I proceed with requirements?

**You:** `yes`

---

### Phases 1–2 — Requirements and Architecture (Verbatim)

*Phase 1 proceeds exactly as in Scenario 1 — Imani asks five questions about the search feature. The verbatim answers:*

**Imani:** `What are we building? One or two sentences.`

**You:** `Global search for TaskFlow. Users type a query and see matching results across projects, task titles, task descriptions, and comments — in real time as they type.`

**Imani:** `Who uses it and what problem does it solve?`

**You:** `All TaskFlow users. Problem: users can't find things when they have many projects. They're currently scrolling Kanban boards to find tasks by name.`

**Imani:** `What does success look like — measurable?`

**You:** `Search results appear in under 300ms as the user types. Results include the matching text with the query term highlighted. No more than 20 results per query.`

**Imani:** `Any hard constraints? (tech stack, deadline, compliance, budget)`

**You:** `Must use existing MongoDB. No Elasticsearch — too expensive. No deadline.`

**Imani:** `What's explicitly out of scope?`

**You:** `Saved searches, search history, filtering by date, searching file attachments.`

*Imani writes design.md for the search feature. ✅ Requirements complete.*

*Phase 2 proceeds — Zuberi reads design.md and the existing docs/architecture.md. He presents one key decision (MongoDB text index vs regex search) and draws diagrams. ✅ Architecture complete.*

---

### Phases 3–6 — Summary

*Because global search touches server-side API and client-side UI, Zuri specs two screens: the Search Results overlay and the empty-results state. ✅ Design complete.*

*Kofi writes failing tests for the search endpoint, the text-index behaviour, and the client-side SearchBar component. ✅ Tests written — all failing.*

*Rashidi implements the MongoDB text index, the `/api/search` endpoint, and the SearchBar React component. ✅ Implementation complete — all tests passing.*

*Neema runs a Standard QA pass. No critical or high bugs found. Health score: 91/100. ✅ Browser QA complete.*

*Faraji extends the existing pipeline with a search-specific smoke test. ✅ Deployed and running.*

---

## Scenario 3 — Resuming an Interrupted Workflow

**Setup:** You started a ForgeAI workflow for a new feature last week. You completed Phases 1 and 2 (design.md and architecture docs exist). You were interrupted before Phase 3. You want to resume from Phase 4 (testing) — UX is straightforward enough that you are skipping Zuri.

Open VS Code. Open the Copilot Chat panel. Type `@orchestrator`.

*Jabari silently scans the project. He finds design.md, docs/architecture.md, docs/adr/, no test files, no implementation files.*

**Jabari:**

> 👋 I'm Jabari, your ForgeAI Orchestrator.
>
> Mode: Existing Codebase
> design.md:  ✓ found
> tasks.md:   ✗ not found
> Docs:       ✓ found
>
> What would you like to do?
>   W · Full workflow from scratch
>   R · Resume from a specific phase
>   P · Run one phase only
>   D · Document existing codebase first (Amina)
>   S · Show team and workflow status
>   ? · All options

**You:** `R`

**Jabari:**

> Which phase?
>   1 Requirements
>   2 Architecture
>   3 Design
>   4 Testing
>   5 Implementation
>   5.5 QA
>   6 Deployment

**You:** `4`

*Jabari checks: design.md found, architecture docs found — prerequisites for Phase 4 are present.*

**Jabari:**

> design.md and architecture docs confirmed.
>
> Change Report — Phase 4: Testing
>
> Agent:    Kofi (@test-engineer)
> Will do:
>   - Read design.md acceptance criteria
>   - Write failing tests for all FRs (unit + integration + E2E)
>   - Confirm all tests are RED before clearing the gate
> Will NOT touch:
>   - Implementation code, design.md, or docs
> Risks:
>   - none — tests are designed to fail at this stage
>
> Proceed? (yes / no)

**You:** `yes`

*The workflow resumes from Phase 4 exactly as normal — Kofi greets, writes tests, and confirms all failing. The workflow then proceeds through Phases 5, 5.5, and 6.*

> **Copilot note:** When you resume a workflow, Jabari reads the project's existing files to determine state. He does not rely on conversation history from previous sessions — he re-scans every time. This means resuming always works, even after closing VS Code.

---

## Scenario 4 — Standalone: Documenting a Codebase

**Setup:** You have an undocumented codebase. You do not need the full ForgeAI workflow right now — you just want clean documentation so your team can understand the system.

Open VS Code. Open the Copilot Chat panel. Type `@codebase-docs` and press Enter.

*Amina silently scans the codebase — folder structure, entry points, tech stack, existing docs, tests, CI/CD.*

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    TypeScript, Next.js, Prisma, PostgreSQL
> Entry points:  src/app/layout.tsx, src/app/page.tsx
> Existing docs: README.md (setup only), CHANGELOG.md
> Test coverage: test folder exists: yes (__tests__/)
> CI/CD:         pipeline files found: yes (.github/workflows/ci.yml)
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `D`

*Amina runs the full Documentation Sequence — five scoping questions, architecture scan, clarifying questions, doc plan confirmation, then writes each file.*

**Amina:** `Who is the primary audience for these docs?`

**You:** `4 — all of the above`

**Amina:** `What level of documentation do you need?`

**You:** `3 — full depth`

**Amina:** `What do new team members always ask about or get wrong?`

**You:** `They always ask why we have two authentication flows — one for the web app and one for the API. The web app uses NextAuth, the API uses short-lived JWTs issued by a separate token endpoint. It confuses everyone.`

**Amina:** `Is there code that is deprecated, experimental, or should be ignored?`

**You:** `src/lib/legacy-cache.ts — it's from a failed Redis experiment. Will be deleted next sprint.`

**Amina:** `Are there naming decisions or structures that look odd but are intentional?`

**You:** `The src/app/(auth)/ route group — the parentheses are Next.js syntax for a layout group that doesn't add to the URL path. New engineers always think it's a bug.`

*Amina scans the component relationships. In the scan, it finds an ambiguous file.*

**Amina:**

> `src/lib/data.ts` contains functions named `fetchUser`, `fetchProject`, and `fetchDashboard`. These appear to be server-side data fetching functions for Next.js Server Components. Is that accurate, or do they also run on the client?

**You:** `Server-side only. They use Prisma directly and can never run on the client.`

*Amina surfaces clarifying questions in a batch.*

**Amina:**

> I have 3 questions before I start writing. Let's go through them:
>
> 1. `src/lib/utils.ts` contains 18 exported functions. What is the unifying principle — are they truly general-purpose or are they domain-specific to one area?
> 2. `src/middleware.ts` is 180 lines and appears to handle auth, rate limiting, and logging. Was this intended to be split, or is it intentionally combined?
> 3. There are TODOs in `src/app/api/v1/projects/route.ts` at lines 44 and 87 — what is their status?

**You:** `1. They're general-purpose — formatting, date math, string manipulation. 2. Intentional — we know it should be split but haven't done it. 3. The TODOs at line 44 are real — pagination isn't implemented. Line 87 is stale — that feature shipped.`

*Amina confirms the doc plan.*

**Amina:**

> Here's what I'll document:
>
> [ ] docs/architecture.md       — system overview, component map, data flow, auth architecture callout
> [ ] docs/conventions.md        — naming, Next.js route group note, Server Components vs Client Components boundary
> [ ] docs/setup.md              — prerequisites, getting started, env vars
> [ ] docs/testing.md            — test strategy, how to run, coverage
> [ ] docs/dependencies.md       — Next.js, Prisma, NextAuth rationale
> [ ] docs/components/api.md     — API routes, v1 endpoints, known gap (pagination TODO)
> [ ] docs/components/auth.md    — two auth flows explained
> [ ] docs/components/data.md    — server-side data layer, Prisma access patterns
> [ ] docs/components/ui.md      — component library, shared UI
>
> Skipping: src/lib/legacy-cache.ts (deprecated, flagged by you)
>
> Proceed with all, or adjust the list?

**You:** `Proceed.`

**Amina:**

> Change Report — Amina (Codebase Docs)
>
> Will create / update:
>   - docs/architecture.md
>   - docs/conventions.md
>   - docs/setup.md
>   - docs/testing.md
>   - docs/dependencies.md
>   - docs/components/api.md
>   - docs/components/auth.md
>   - docs/components/data.md
>   - docs/components/ui.md
> Will NOT touch:
>   - Source code, tests, or configuration files
>
> Proceed? (yes / no)

**You:** `yes`

*Amina writes each document one at a time, showing each to you before saving. After the final file:*

**Amina:**

> Documentation complete.
>
> Created:
> - docs/architecture.md
> - docs/conventions.md
> - docs/setup.md
> - docs/testing.md
> - docs/dependencies.md
> - docs/components/api.md
> - docs/components/auth.md
> - docs/components/data.md
> - docs/components/ui.md
>
> Recommended next steps:
> - Add these docs to your PR template checklist
> - Review quarterly — docs go stale
> - Run `/forge/requirements` to plan new features on this documented base

---

## Scenario 5 — QA on a Deployed Feature

**Setup:** Your team just merged and deployed a new user profile feature. You want a systematic QA pass before announcing it to users. The feature is running at `http://localhost:4000`.

Open VS Code. Open the Copilot Chat panel. Type `@qa` and press Enter.

*Neema silently detects Playwright before greeting.*

**Neema:**

> 👋 I'm Neema, your ForgeAI QA Engineer. I test what's built so nothing ships broken.
>
> What would you like to do?
>   Q · Quick — smoke test (homepage + top 5 routes, ~1 min)
>   S · Standard — systematic exploration of all affected routes
>   E · Exhaustive — full app including accessibility and edge cases
>   F · Fix bugs found in a previous QA run
>   ? · Show all options

**You:** `S`

*Neema checks that implementation is complete. It is confirmed in tasks.md.*

**Neema:**

> What's the app URL?

**You:** `http://localhost:4000`

*Neema runs the discovery script. The app is reachable at port 4000.*

*Neema runs the orientation script. Finds: title "TaskFlow", landing at `/login`, console shows zero errors, 12 navigation links.*

**Neema:**

> Orientation complete.
> App: TaskFlow at http://localhost:4000
> Console errors on landing: none
> Routes found: /login, /dashboard, /projects, /projects/:id, /profile, /profile/edit, /settings, /team
>
> Does the app require login to test? (yes / no)

**You:** `yes`

**Neema:**

> What are the test credentials? (username only — I'll keep the password redacted in the report)

**You:** `Username: qa-test@taskflow.app`

*Neema writes and runs the Playwright auth script. Cookies are saved to `.qa/session.json`.*

**Neema:**

> AUTH: ok — cookies saved to .qa/session.json
>
> Starting Standard tier — I'll test all routes: /dashboard, /projects, /projects/:id, /profile, /profile/edit, /settings

*Neema runs a page-check script for each route. For each one: screenshot taken, console errors checked, network failures checked, links enumerated. After all routes:*

**Neema:**

> Exploration complete. Here's what I found:
>
> Bug 1
> Severity: critical
> Page:     http://localhost:4000/profile/edit
> Found:    Uploading a profile photo over 2MB causes an unhandled promise rejection. The upload spinner runs indefinitely and the page becomes unresponsive. No error message is shown.
> Expected: File size validation error: "Photo must be under 2MB"
> Evidence: .qa/screenshots/profile-edit-large-upload.png
> Steps:    1. Log in  2. Go to /profile/edit  3. Upload a file > 2MB  4. Observe spinner

> Bug 2
> Severity: high
> Page:     http://localhost:4000/profile
> Found:    If display name contains an ampersand (&), the profile page renders it as &amp; (HTML entity not decoded)
> Expected: Ampersand rendered correctly in the display name
> Evidence: .qa/screenshots/profile-ampersand.png
> Steps:    1. Set display name to "R&D Team Lead"  2. View /profile

> Bug 3
> Severity: medium
> Page:     http://localhost:4000/settings
> Found:    The "Notification preferences" section has no focus ring on the toggle switches — keyboard navigation is possible but invisible
> Expected: Visible focus ring on all interactive elements
> Evidence: .qa/screenshots/settings-no-focus-ring.png

> Bug 4
> Severity: cosmetic
> Page:     http://localhost:4000/dashboard
> Found:    "Last seen" timestamp says "in 0 minutes" instead of "just now" for events in the last 30 seconds
> Evidence: .qa/screenshots/dashboard-timestamp.png

> ---
>
> Health Score — TaskFlow (profile feature)
>
> Category          Weight   Score   Weighted
> ─────────────────────────────────────────────
> Functional          20%     6/10    12.0
> Console errors      15%    10/10    15.0
> Accessibility       15%     6/10     9.0
> UX / flows          15%     8/10    12.0
> Performance         10%     9/10     9.0
> Visual              10%     8/10     8.0
> Links / routing     10%    10/10    10.0
> Content             5%      9/10     4.5
> ─────────────────────────────────────────────
> TOTAL                               79.5/100
>
> Ship readiness: ⚠️ SHIP WITH CAUTION

**Neema:**

> Fix Bug 1 (critical — large upload unhandled rejection)? (yes / skip)

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Large profile photo upload causes unhandled promise rejection and infinite spinner
> Will fix:
>   - src/api/profile/upload.ts:34 — add file size check (max 2MB) before multer processes the file
>   - src/components/ProfileEditor/PhotoUpload.tsx:67 — catch the error response and display user-facing message
> Will NOT touch:
>   - All other files
> Risk:
>   - low — adding validation before existing logic, not changing the upload flow
>
> Proceed? (yes / no)

**You:** `yes`

*Neema applies the fix, re-runs the profile-edit page-check script, takes a new screenshot showing the validation error.*

**Neema:**

> Bug 1 fixed and verified. Re-run shows "Photo must be under 2MB" at correct timing — no spinner.
>
> Fix Bug 2 (high — ampersand rendering)? (yes / skip)

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Ampersand in display name renders as HTML entity
> Will fix:
>   - src/components/ProfileCard/index.tsx:22 — display name is being passed through a dangerouslySetInnerHTML call; switch to a text node (children) instead
> Will NOT touch:
>   - All other files
> Risk:
>   - low
>
> Proceed? (yes / no)

**You:** `yes`

*Neema applies the fix, re-runs the profile page-check, verifies the display name renders correctly.*

**Neema:**

> Bug 2 fixed and verified.
>
> Bug 3 (medium — missing focus ring). Fix? (yes / skip)

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Toggle switches on /settings have no visible focus ring
> Will fix:
>   - src/components/ToggleSwitch/index.css:14 — add `:focus-visible` rule with 2px offset outline
> Will NOT touch:
>   - All other files
> Risk:
>   - low — CSS only
>
> Proceed? (yes / no)

**You:** `yes`

*Neema applies the CSS fix, re-runs the settings page-check.*

**Neema:**

> Bug 3 fixed and verified.
>
> Bug 4 (cosmetic — "in 0 minutes"). Fix? (yes / skip)

**You:** `skip`

**Neema:**

> ✅ Browser QA complete
>
> Health score: 93/100  (79.5 → 93 after fixes)
> Bugs found:   4 total  (1 critical, 1 high, 1 medium, 1 cosmetic)
> Bugs fixed:   3 — large upload error, ampersand rendering, missing focus ring
> Remaining:    1 cosmetic item ("in 0 minutes" timestamp — noted in report)
> Report:       .qa/report-20260506-160411.md
>
> Ready for deployment. Next: `/forge/deployment`

---

## Scenario 6 — Architecture Health Scan

**Setup:** You have been on a project for six months. The codebase has grown organically. You want to know where the structural problems are before starting a major new feature.

Open VS Code. Open the Copilot Chat panel. Type `@codebase-docs`.

*Amina silently scans the codebase.*

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    Python, FastAPI, SQLAlchemy, React
> Entry points:  backend/main.py, frontend/src/index.tsx
> Existing docs: docs/ (partial — architecture.md only)
> Test coverage: test folder exists: yes (tests/)
> CI/CD:         pipeline files found: yes (.github/workflows/)
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `H`

*Amina runs the Architecture Health Scan. He checks for tight coupling, shallow modules, unclear boundaries, and agent-unfriendly structure across the entire codebase.*

**Amina:**

> Architecture Health Scan — TaskFlow Backend
> Scanned: 87 files / 14 modules
>
> 🔴 Critical
>
>   - `backend/api/routes.py` — 634 lines containing route handlers, business logic, DB queries, and email sending. A single file doing four distinct jobs makes it impossible for the Engineer agent to make a targeted change without reading the entire file. Every edit to this file risks unintended side effects.
>
>   - `backend/services/project_service.py` directly imports from `backend/services/user_service.py` and `backend/services/task_service.py`, which both import back from `backend/services/project_service.py`. Circular dependency between three service modules — Python resolves this at runtime but it causes unpredictable import order issues and prevents unit testing any service in isolation.
>
>   - `backend/models/` and `backend/api/` share direct SQLAlchemy session access. Business logic is scattered across both layers — changing the database schema requires tracing changes through routes, models, and services simultaneously.
>
> 🟡 Warning
>
>   - `backend/utils/helpers.py` — 290 lines, 22 exported functions covering date formatting, slug generation, email validation, and JWT encoding. No unifying principle. Any agent asked to modify email logic must read 290 lines of unrelated code to find the right function.
>
>   - `backend/api/routes.py` contains 3 functions over 120 lines each (`create_project`, `update_project_members`, `generate_report`). Deeply nested conditionals (5 levels in `generate_report`) make the logic unreadable and untestable.
>
>   - `frontend/src/components/Dashboard/index.tsx` — 480 lines. Mixes layout, data fetching, filtering logic, and three distinct sub-views in one file. Zuri cannot spec a change to one sub-view without understanding all 480 lines.
>
>   - `frontend/src/utils.ts` — 15 functions, all under 8 lines, each wrapping a single standard library call. Pure pass-throughs with no added logic — these functions add indirection without value.
>
> 🟢 Healthy areas
>
>   - `backend/models/` — SQLAlchemy models are clean, single-responsibility, and well-named. Each model file contains exactly one model class.
>   - `frontend/src/components/ProjectCard/` — small, focused component with co-located test. Clear inputs and outputs. Easy for Rashidi to modify without side effects.
>   - `frontend/src/hooks/` — custom hooks are well-scoped. Each hook does one thing and is independently testable.
>   - `.github/workflows/ci.yml` — CI pipeline is clean, runs lint + test + build in correct order, no secrets in YAML.
>
> Architectural deepening opportunities:
>
>   1. **Split `routes.py` into routers + controllers + services** — Extract route handlers into a `/routers/` layer (HTTP only), move business logic to `/controllers/`, and keep `/services/` for cross-cutting operations. Expected benefit: each file under 100 lines, agents can target changes precisely, all three layers independently testable.
>
>   2. **Break the circular dependency between service modules** — Introduce a thin `domain/` layer with pure Python dataclasses and no imports from services. Services depend only on `domain/` objects and the DB session — never on each other directly. Expected benefit: each service becomes independently unit-testable, import order is deterministic.
>
>   3. **Split `Dashboard/index.tsx` by view** — Extract `ProjectListView`, `ActivityFeedView`, and `QuickActionsView` into separate component files. Keep `Dashboard/index.tsx` as a layout-only coordinator. Expected benefit: Zuri can spec one view without reading the others; Rashidi can implement one view without risk to the others.
>
> Want me to dig deeper into any of these areas?

*Amina stops here and waits. He will not recommend code changes unless you ask.*

**You:** `Tell me more about fixing the circular dependency.`

**Amina:**

> The circular dependency chain is: `project_service.py` imports `user_service.py` (to look up project members), `user_service.py` imports `task_service.py` (to count tasks per user), and `task_service.py` imports `project_service.py` (to validate the project exists before creating a task).
>
> The fix is to remove the cross-service imports by introducing a narrow interface at the point of crossing:
>
> - Instead of `task_service.py` importing `project_service.py` to validate a project, pass the project ID in and do the validation with a direct DB query or a shared repository function in a new `backend/repositories/` layer.
> - Instead of `user_service.py` importing `task_service.py`, expose a task count query as a repository function that both services call independently.
>
> This does not require a big-bang refactor — it can be done one import at a time. Would you like me to document the proposed dependency structure in `docs/architecture.md`, or would you prefer to take this to Zuberi for a formal ADR?

**You:** `Add it to architecture.md.`

**Amina:**

> Change Report — Amina (Codebase Docs)
>
> Will create / update:
>   - docs/architecture.md  (add "Circular Dependency — Current State + Proposed Fix" section)
> Will NOT touch:
>   - Source code, tests, or configuration files
>
> Proceed? (yes / no)

**You:** `yes`

*Amina updates docs/architecture.md with a Mermaid dependency diagram showing the current circular state and a second diagram showing the proposed repository-layer fix.*

**Amina:**

> docs/architecture.md updated.
>
> The circular dependency section is in "Known Structural Issues" with both diagrams. When you're ready to fix it, run `/forge/requirements` to scope the refactor, or invoke `@architect` directly to write the ADR.

---

## Quick Reference

### The Team

| Handle | Name | Role | When to invoke |
|---|---|---|---|
| `@orchestrator` | Jabari | Workflow coordinator | Starting or resuming any workflow |
| `@codebase-docs` | Amina | Documentation + health scans | Undocumented codebases, architecture review |
| `@analyst` | Imani | Requirements, PRDs | New feature scoping |
| `@architect` | Zuberi | System design, ADRs, diagrams | Architecture decisions |
| `@designer` | Zuri | UX/UI screen specs | Features with a user interface |
| `@test-engineer` | Kofi | TDD — writes failing tests | Before any implementation begins |
| `@engineer` | Rashidi | Implementation | After tests are confirmed failing |
| `@qa` | Neema | Browser testing via Playwright | After all tests pass |
| `@devops-azure` | Faraji | CI/CD, Azure infrastructure | After all tests pass and QA is complete |

### Copilot Slash Commands

| Command | What it does |
|---|---|
| `/forge/orchestrate` | Full workflow — Jabari drives |
| `/forge/requirements` | Phase 1 — Imani gathers requirements |
| `/forge/architecture` | Phase 2 — Zuberi designs the system |
| `/forge/design` | Phase 3 — Zuri specs the UI |
| `/forge/testing` | Phase 4 — Kofi writes failing tests |
| `/forge/implementation` | Phase 5 — Rashidi implements |
| `/forge/deployment` | Phase 6 — Faraji deploys to Azure |

> **Reminder:** Always use `/forge/requirements` (path separator). Both Claude Code and Copilot use this format.

### Gate Messages — Exact Text

| Gate | Confirmation | Who produces it |
|---|---|---|
| Phase 1 complete | `✅ Requirements complete` | Imani |
| Phase 2 complete | `✅ Architecture complete` | Zuberi |
| Phase 3 complete | `✅ Design complete` | Zuri |
| Gate 4 — tests failing | `✅ Tests written — all failing` | Kofi |
| Gate 5 — tests passing | `✅ Implementation complete — all tests passing` | Rashidi |
| QA cleared | `✅ Browser QA complete` | Neema |
| Phase 6 complete | `✅ Deployed and running` | Faraji |

No paraphrasing. No "all tests are basically passing". The confirmation text must appear for the Orchestrator to proceed.

### Copilot vs Claude Code — Key Differences

| Concern | Claude Code | GitHub Copilot |
|---|---|---|
| Agent files | `.claude/agents/` | `.github/agents/` |
| Prompt / command files | `.claude/commands/` | `.github/prompts/forge/` |
| Global instructions | `CLAUDE.md` | `.github/copilot-instructions.md` |
| Slash command format | `/forge/requirements` | `/forge/requirements` |
| Agent invocation | `/forge/orchestrate` or `@orchestrator` | `@orchestrator` in Chat panel |
| Where agents work | Terminal + editor | Copilot Chat panel only — NOT inline suggestions |
| Session state | Persists in Claude session | Re-scanned from files every session |

### Workflow Phase Sequence

```
0   → Amina  (@codebase-docs)  optional — undocumented existing codebases
1   → Imani   (@analyst)        → ✅ Requirements complete
2   → Zuberi   (@architect)      → ✅ Architecture complete
3   → Zuri   (@designer)       → ✅ Design complete              optional — ask Jabari
4   → Kofi (@test-engineer)  → ✅ Tests written — all failing
5   → Rashidi  (@engineer)       → ✅ Implementation complete — all tests passing
5.5 → Neema  (@qa)             → ✅ Browser QA complete          recommended — ask Jabari
6   → Faraji  (@devops-azure)   → ✅ Deployed and running
```

### Rules Every Agent Follows

1. Scan silently before greeting
2. Greet with their name and a short-code menu
3. Say STOP and wait after every output
4. Ask one question at a time
5. Show a Change Report before writing any file
6. Only proceed when the user says yes
7. Never skip a gate
8. Never write a file without explicit user approval
