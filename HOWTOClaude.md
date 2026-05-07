# HOWTOClaude.md — ForgeAI User Guide

> This guide is for Claude Code specifically. All slash commands use `/forge/*` syntax.

---

## Introduction

ForgeAI installs a team of nine specialised AI engineering agents into your project via `npx forgeai-workflow init`. The agents work through a structured, gate-enforced workflow — from requirements all the way to deployment — or can be invoked individually for standalone tasks. Every agent asks before it acts, shows you exactly what it will change, and waits for your approval.

This guide is for developers who are new to ForgeAI or who have not worked with AI agents before. It walks through six realistic scenarios with verbatim conversations so you can see exactly how the system behaves before you use it.

For installation, see the [README](./README.md).

---

## How to Talk to Agents

### How Claude Code agents work

After running `npx forgeai-workflow init`, agent files are installed into your `.claude/agents/` folder. Claude Code reads these automatically. To invoke an agent, type its `@name` directly in the chat panel — no commands required.

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

You can also use slash commands to invoke the workflow phases directly:

```
/forge/orchestrate
/forge/requirements
/forge/architecture
/forge/design
/forge/testing
/forge/implementation
/forge/deployment
/forge/document-codebase
```

### The STOP pattern

Every agent stops and waits after every output. They never proceed automatically. When you see an agent has finished speaking, it is waiting for you. You do not need to type anything special — just reply naturally. If you want to pause and think, nothing will happen until you respond.

### Change Reports

Before any agent writes, modifies, or creates a file, it shows you a Change Report. This is a brief summary of exactly what will be created or changed, what will not be touched, and any risks. You must reply `yes` before the agent proceeds. If you reply `no`, the agent stops and asks what you would like to do instead.

### Gates

ForgeAI enforces four hard gates in the workflow:

| Gate | Cleared by | Confirmation text |
|------|-----------|---------------|
| Gate 4 | Kofi (Test Engineer) | `✅ Tests written — all failing` |
| Gate 5 | Rashidi (Engineer) | `✅ Implementation complete — all tests passing` |
| Gate QA | Neema (QA) | `✅ Browser QA complete` |
| Phase 6 | Faraji (DevOps Azure) | `✅ Deployed and running` |

No gate can be cleared by assumption. "Should be fine" does not clear a gate. "Looks good" does not clear a gate. Kofi must run the tests and confirm they are all failing before Gate 4 clears. Rashidi must run the tests and confirm they all pass before Gate 5 clears.

---

## Scenario 1: Building a Blog App from Scratch

**Setup:** You have an empty repository. You want to build Inkwell, a personal blogging platform with React, Node/Express, and PostgreSQL. Features: write, edit, and delete posts; categories; author login; public reading view.

### Phase 0 — Jabari Scans and Greets

*You open Claude Code and type the orchestrator's name.*

**You:** `@orchestrator`

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

*Jabari is waiting. Nothing will happen until you respond.*

**You:** `W`

**Jabari:**

> What are we building? One sentence.

**You:** `Inkwell — a personal blog platform. React frontend, Node/Express backend, PostgreSQL.`

### Phase 1 — Requirements (Imani)

*Jabari shows a Change Report before handing off to Imani.*

**Jabari:**

> Change Report — Phase 1: Requirements
>
> Agent:    Imani (@analyst)
> Will do:
>   - Run requirements Q&A (5 questions)
>   - Produce design.md
> Will NOT touch:
>   - Source code, tests, or architecture files
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

**Jabari:** `✓ Handing off to Imani.`

---

**Imani:**

> 👋 I'm Imani, your ForgeAI Analyst. I'll turn your idea into clear requirements.
>
> What would you like to do?
>   R · Gather requirements for a new feature
>   P · Write a full PRD (design.md)
>   S · Write user stories only
>   A · Define acceptance criteria for existing stories
>   ? · Show all options

*Imani is now running Phase 1 under Jabari's coordination. Imani will ask five questions, one at a time.*

**Imani:** `What are we building? One or two sentences.`

**You:** `Inkwell is a personal blogging platform. Authors can write, edit, and delete posts; readers can browse by category without logging in.`

**Imani:** `Got it. Who uses it and what problem does it solve?`

**You:** `Two users: authors who want a clean, distraction-free writing experience, and public readers who want to find and read posts without creating an account.`

**Imani:** `Understood. What does success look like — measurable?`

**You:** `An author can publish a post in under 2 minutes from a blank editor. A reader can reach any post from the homepage in 3 clicks or fewer.`

**Imani:** `Good. Any hard constraints? (tech stack, deadline, compliance, budget)`

**You:** `React + Node/Express + PostgreSQL — already decided. No deadline. No compliance requirements. Solo project.`

**Imani:** `Last one: what's explicitly out of scope?`

**You:** `No comments, no social sharing, no newsletter, no analytics, no multi-author support.`

---

*Imani summarises before writing anything.*

**Imani:**

> Does this capture it? Anything missing or wrong?
>
> - **What:** Personal blogging platform — Inkwell
> - **Users:** Authors (write/edit/delete/categorise posts, require login) and public readers (browse and read, no account)
> - **Stack:** React, Node/Express, PostgreSQL
> - **Success:** Post published in < 2 min; any post reachable in ≤ 3 clicks from homepage
> - **Constraints:** None beyond agreed stack
> - **Out of scope:** Comments, social sharing, newsletter, analytics, multi-author

**You:** `That's right. One addition — authors should be able to upload a cover image for each post.`

**Imani:** `Added. I'll include image upload as a functional requirement with acceptance criteria. Ready to write design.md?`

**You:** `yes`

**Imani:**

> Change Report — Imani (Analyst)
>
> Will create / update:
>   - design.md  [new]
> Will NOT touch:
>   - Source code, tests, or other docs
>
> Proceed? (yes / no)

**You:** `yes`

*Imani writes design.md.*

**Imani:**

> design.md ready.
>
> ✅ Requirements complete

---

### Phase 2 — Architecture (Zuberi)

*Jabari picks up immediately after Imani's gate message.*

**Jabari:**

> Change Report — Phase 2: Architecture
>
> Agent:    Zuberi (@architect)
> Will do:
>   - Read design.md
>   - Ask one constraints question
>   - Present 2–3 key technology decisions
>   - Produce C4 container diagram and sequence diagram
>   - Write docs/architecture.md and ADRs
> Will NOT touch:
>   - Source code, tests, design.md content
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

---

**Zuberi:**

> 👋 I'm Zuberi, your ForgeAI Architect. I design systems and record the decisions that shape them.
>
> What would you like to do?
>   D · Design the system (reads design.md)
>   A · Write an ADR for a specific decision
>   C · Draw a C4 or sequence diagram
>   R · Review and critique an existing design
>   ? · Show all options

**Zuberi:** `Any constraints I should know before designing? (existing stack, team size, cost limits, timeline)`

**You:** `Solo developer. Keeping it simple — no microservices. Want to host cheaply, probably a VPS or small cloud VM. No need for a CDN yet.`

---

*Zuberi works through key decisions one at a time.*

**Zuberi:**

> Decision: How should the API be structured?
>
> Option A: REST — conventional, easy to test, widely understood, natural fit for CRUD-heavy blog operations
> Option B: GraphQL — flexible queries, reduces over-fetching, but adds schema complexity for a solo project
>
> Recommendation: Option A (REST) — the data model is simple and CRUD-focused, GraphQL overhead is not justified
>
> Go with A or B?

**You:** `A`

**Zuberi:**

> Decision: How should authentication work?
>
> Option A: JWT (stateless) — tokens in HTTP-only cookies, no server-side session storage, scales simply
> Option B: Session-based (stateful) — server stores session, simpler token revocation, requires session store
>
> Recommendation: Option A (JWT) — stateless fits a single-server deployment and avoids a Redis dependency
>
> Go with A or B?

**You:** `A`

---

*Zuberi now produces the diagrams.*

**Zuberi:**

> Here's the C4 container diagram — does this look right?
>
> ```mermaid
> C4Container
>   title Inkwell — Container Diagram
>
>   Person(author, "Author", "Writes and manages blog posts")
>   Person(reader, "Reader", "Browses and reads posts")
>
>   Container_Boundary(inkwell, "Inkwell") {
>     Container(spa, "React SPA", "React 18", "Author dashboard and public reading view")
>     Container(api, "Express API", "Node 20 / Express 5", "REST API — posts, categories, auth, image upload")
>     ContainerDb(db, "PostgreSQL", "PostgreSQL 16", "Posts, categories, authors, images metadata")
>     Container(storage, "File Storage", "Local filesystem (MVP)", "Uploaded cover images")
>   }
>
>   Rel(author, spa, "Uses", "HTTPS")
>   Rel(reader, spa, "Reads", "HTTPS")
>   Rel(spa, api, "Calls", "REST / JSON")
>   Rel(api, db, "Reads/Writes", "SQL")
>   Rel(api, storage, "Stores/Serves", "File I/O")
> ```

**You:** `Looks right. Local filesystem for images is fine for MVP.`

**Zuberi:**

> Here's the sequence diagram for the primary flow — publishing a post — does this look right?
>
> ```mermaid
> sequenceDiagram
>   participant A as Author
>   participant SPA as React SPA
>   participant API as Express API
>   participant DB as PostgreSQL
>   participant FS as File Storage
>
>   A->>SPA: Open post editor
>   A->>SPA: Upload cover image
>   SPA->>API: POST /api/images (multipart)
>   API->>FS: Save image file
>   API-->>SPA: { imageUrl }
>   A->>SPA: Write post content, select category, click Publish
>   SPA->>API: POST /api/posts { title, body, categoryId, imageUrl }
>   API->>DB: INSERT INTO posts
>   DB-->>API: { postId }
>   API-->>SPA: 201 { post }
>   SPA-->>A: Navigate to published post
> ```

**You:** `That's correct.`

**Zuberi:**

> Change Report — Zuberi (Architect)
>
> Will create / update:
>   - design.md (Design Considerations section)
>   - docs/architecture.md
>   - docs/adr/ADR-001-rest-over-graphql.md
>   - docs/adr/ADR-002-jwt-authentication.md
> Will NOT touch:
>   - Source code, tests, or configuration files
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

*Zuberi writes the files.*

**Zuberi:**

> Architecture done — 2 ADRs recorded.
>
> ✅ Architecture complete

---

### Phase 3 — Design (Zuri)

**Jabari:** `Does this feature have a user interface?`

**You:** `yes`

**Jabari:**

> Change Report — Phase 3: Design
>
> Agent:    Zuri (@designer)
> Will do:
>   - Ask about screens and design system
>   - Spec each screen one at a time
>   - Write docs/ux-specs.md
> Will NOT touch:
>   - Source code, tests, design.md, or architecture docs
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

---

**Zuri:**

> 👋 I'm Zuri, your ForgeAI Designer. I'll spec every screen so the engineers know exactly what to build.
>
> What would you like to do?
>   S · Spec all screens for a feature
>   F · Map a user flow
>   C · Define a component (states, interactions)
>   A · Accessibility review of an existing spec
>   ? · Show all options

**Zuri:** `How many screens or surfaces does this feature touch? List them briefly.`

**You:** `Three: the login screen, the post list (dashboard for authors / homepage for readers), and the post editor.`

**Zuri:** `Is there an existing design system or component library I should follow?`

**You:** `No existing system. Keep it clean and minimal — think classic blog typography. No UI framework constraint.`

---

*Zuri specs each screen one at a time.*

**Zuri:**

> What's the primary user action on the Login screen?

**You:** `Enter email and password, submit, land on the author dashboard.`

**Zuri:**

> Here's the spec for Login — does this look right before I move on?
>
> ---
> ## Login
> Purpose: Authenticate an existing author
> Entry: Direct URL `/login` or redirect from a protected route
> Exit: Author dashboard (`/dashboard`) on success; stays on login on failure
>
> Components:
> | Name | Type | States | On interaction |
> |------|------|--------|----------------|
> | Email field | Input (email) | default · focus · error | Validates format on blur |
> | Password field | Input (password) | default · focus · error | Masked; toggle show/hide |
> | Submit button | Button (primary) | default · hover · focus · loading · disabled | Submits form; shows spinner while request in flight |
> | Error banner | Alert | hidden · visible | Shows "Invalid email or password" on 401; no field-specific hints |
>
> States required: default · focus · loading · error
>
> User flow:
> ```mermaid
> flowchart TD
>   A[User navigates to /login] --> B[Login form displayed]
>   B --> C[User enters email + password]
>   C --> D[Submit]
>   D --> E{API response}
>   E -->|200 + JWT| F[Store token in HTTP-only cookie]
>   F --> G[Redirect to /dashboard]
>   E -->|401| H[Show error banner]
>   H --> B
> ```
>
> Errors:
> | Trigger | Message | Recovery |
> |---------|---------|----------|
> | Invalid credentials | "Invalid email or password." | User re-enters credentials |
> | Network failure | "Could not reach the server. Try again." | Retry button |
> | Empty fields | Field border turns red; button stays disabled | Fill in both fields |
>
> Accessibility:
> - Tab order: Email → Password → Submit
> - ARIA labels: `aria-label="Email address"`, `aria-label="Password"`
> - Contrast: text on background minimum 4.5:1
> ---

**You:** `That looks right.`

**Zuri:** `What's the primary user action on the Post List screen?`

**You:** `Authors see their own posts with edit and delete actions. Readers see all published posts filterable by category.`

**Zuri:**

> Here's the spec for Post List — does this look right?
>
> ---
> ## Post List
> Purpose: Browse posts (readers) or manage posts (authors)
> Entry: Homepage (`/`) for readers; Dashboard (`/dashboard`) for authors after login
> Exit: Post detail page on click; Post editor on new/edit
>
> Components:
> | Name | Type | States | On interaction |
> |------|------|--------|----------------|
> | Post card | Card | default · hover · focus | Navigate to post detail |
> | Category filter | Pill group | default · active | Filters list client-side |
> | New Post button | Button (primary) | default · hover · focus | Authors only — opens editor |
> | Edit icon | Icon button | default · hover · focus | Authors only — opens editor pre-filled |
> | Delete icon | Icon button | default · hover · focus · confirming | Authors only — shows inline confirm before delete |
> | Empty state | Illustration + text | visible when list is empty | "No posts yet. Write your first one." with CTA |
>
> States required: default · loading · empty · error
>
> Accessibility:
> - Tab order: Category filters → Post cards (in order) → New Post (if author)
> - ARIA: `role="list"` on post list; `aria-label` on filter pills
> - Delete confirm must be keyboard-accessible
> ---

**You:** `Good. Add a search input at the top too — full text search.`

**Zuri:** `Added — I'll include a search input component with debounced query state and a "no results" empty state. Does that cover it?`

**You:** `yes`

**Zuri:** `What's the primary user action on the Post Editor screen?`

**You:** `Write or edit a post — title, cover image, category, rich text body — then save as draft or publish.`

**Zuri:**

> Here's the spec for Post Editor — does this look right?
>
> ---
> ## Post Editor
> Purpose: Create or edit a blog post
> Entry: New Post button (`/editor/new`) or Edit action (`/editor/:postId`)
> Exit: Post List (on save/publish) or discard dialog (on navigation with unsaved changes)
>
> Components:
> | Name | Type | States | On interaction |
> |------|------|--------|----------------|
> | Title field | Input (text, large) | default · focus · error | Character count displayed at 80+ chars |
> | Cover image upload | File dropzone | default · dragging · uploading · preview · error | Accepts JPEG/PNG/WebP; shows preview after upload; progress bar during upload |
> | Category selector | Dropdown | default · open · selected | Single select; "Add new category" option at bottom |
> | Rich text editor | WYSIWYG | default · focus | Bold, italic, headings, blockquote, ordered/unordered lists, code block, link |
> | Save Draft button | Button (secondary) | default · hover · focus · loading | Saves without publishing; stays on editor |
> | Publish button | Button (primary) | default · hover · focus · loading | Saves and publishes; redirects to post |
> | Discard dialog | Modal | hidden · visible | Shown when navigating away with unsaved changes |
>
> States required: new · editing · saving · publishing · error
>
> Errors:
> | Trigger | Message | Recovery |
> |---------|---------|----------|
> | Missing title | "Title is required." | Focus title field |
> | Image too large (> 5 MB) | "Image must be under 5 MB." | Re-upload |
> | Upload failure | "Image upload failed. Try again." | Retry button |
> | Save failure | "Could not save. Check your connection." | Retry button; draft preserved in localStorage |
>
> Accessibility:
> - Tab order: Title → Image upload → Category → Body → Save Draft → Publish
> - ARIA live region for upload progress
> - Discard dialog traps focus until dismissed
> ---

**You:** `Perfect.`

**Zuri:**

> Change Report — Zuri (Designer)
>
> Will create / update:
>   - docs/ux-specs.md  [screens: Login, Post List, Post Editor]
> Will NOT touch:
>   - Source code, tests, design.md, or architecture docs
>
> Proceed? (yes / no)

**You:** `yes`

*Zuri writes docs/ux-specs.md.*

**Zuri:**

> UX specs done — 3 screens.
>
> ✅ Design complete

---

### Phase 4 — Testing (Kofi)

**Jabari:**

> Change Report — Phase 4: Testing
>
> Agent:    Kofi (@test-engineer)
> Will do:
>   - Read design.md acceptance criteria
>   - Show proposed test scope
>   - Write failing tests (unit + integration + E2E)
>   - Run tests to confirm all failing
> Will NOT touch:
>   - Implementation code, design.md, or any non-test files
> Risks:
>   - None — tests will fail by design
>
> Proceed? (yes / no)

**You:** `yes`

---

**Kofi:**

> 👋 I'm Kofi, your ForgeAI Test Engineer. Tests come first — always.
>
> What would you like to do?
>   W · Write failing tests for a feature (RED)
>   V · Validate tests after implementation (GREEN)
>   S · Show test scope for a feature
>   ? · Show all options

*Kofi reads design.md and identifies the test scope.*

**Kofi:**

> I'll write tests for:
>   - `authController.login`                  → unit + integration
>   - `postController.create`                 → unit + integration
>   - `postController.update`                 → unit + integration
>   - `postController.delete`                 → unit
>   - `postController.list`                   → unit + integration
>   - `imageController.upload`                → integration
>   - `categoryController.list`               → unit
>   - Login flow (author → dashboard)         → E2E
>   - Create and publish a post               → E2E
>   - Public reader — browse and filter       → E2E
>
> Proceed?

**You:** `yes`

**Kofi:**

> Change Report — Kofi (Test Engineer)
>
> Will create / update:
>   - tests/unit/authController.test.js
>   - tests/unit/postController.test.js
>   - tests/unit/categoryController.test.js
>   - tests/integration/auth.test.js
>   - tests/integration/posts.test.js
>   - tests/integration/images.test.js
>   - tests/e2e/login.spec.js
>   - tests/e2e/createPost.spec.js
>   - tests/e2e/publicBrowse.spec.js
> Will NOT touch:
>   - Implementation code, design.md, or any non-test files
> Note:
>   - Tests will fail by design (RED) — this is expected
>
> Proceed? (yes / no)

**You:** `yes`

*Kofi writes all test files and runs them.*

**Kofi:**

> ✅ Tests written — all failing — 34 tests written
>
> Unit:        18  tests/unit/
> Integration: 10  tests/integration/
> E2E:          6  tests/e2e/
>
> FR coverage:
> - FR-001 (Author login)              → TC-001, TC-002, TC-003
> - FR-002 (Create post)               → TC-004, TC-005, TC-006, TC-007
> - FR-003 (Edit post)                 → TC-008, TC-009
> - FR-004 (Delete post)               → TC-010, TC-011
> - FR-005 (Browse by category)        → TC-012, TC-013, TC-014
> - FR-006 (Image upload)              → TC-015, TC-016
> - FR-007 (Public reading view)       → TC-017, TC-018
>
> Ready for Engineer (Rashidi).

---

### Phase 5 — Implementation (Rashidi)

**Jabari:**

> Change Report — Phase 5: Implementation
>
> Agent:    Rashidi (@engineer)
> Will do:
>   - Read all 34 failing tests
>   - Ask one constraints question
>   - Implement only what is needed to make tests pass
>   - Run tests to confirm all tests passing
> Will NOT touch:
>   - Test files, design.md, docs/, or any file not required
> Risks:
>   - None beyond normal code changes
>
> Proceed? (yes / no)

**You:** `yes`

---

**Rashidi:**

> 👋 I'm Rashidi, your ForgeAI Engineer. I turn failing tests green with the smallest diff possible.
>
> What would you like to do?
>   I · Implement (TDD — requires confirmed failing tests)
>   R · Code review
>   T · Write test + implement from scratch (standalone TDD)
>   ? · Show all options

*Rashidi confirms failing tests are ready and asks one question.*

**Rashidi:** `I have 34 failing tests. Any constraints before I start? (approach, patterns, files to avoid)`

**You:** `Use async/await throughout. Middleware in separate files. No ORM — raw pg queries only.`

**Rashidi:**

> Change Report — Rashidi (Engineer)
>
> Will create / update:
>   - src/controllers/authController.js
>   - src/controllers/postController.js
>   - src/controllers/categoryController.js
>   - src/controllers/imageController.js
>   - src/middleware/auth.js
>   - src/middleware/upload.js
>   - src/routes/index.js
>   - src/db/queries/posts.js
>   - src/db/queries/categories.js
>   - src/db/queries/auth.js
>   - src/db/schema.sql
>   - src/app.js
>   - src/index.js
> Will NOT touch:
>   - Test files, design.md, docs/, or any file not listed above
> Risks:
>   - None — no existing source code to break
>
> Proceed? (yes / no)

**You:** `yes`

*Rashidi implements and runs the tests.*

**Rashidi:**

> ✅ Implementation complete — all tests passing
> 34 passing, 0 failing
> Files changed: src/controllers/ (4 files), src/middleware/ (2 files), src/routes/index.js, src/db/ (3 files), src/app.js, src/index.js

---

### Phase 5.5 — QA (Neema)

**Jabari:** `Would you like QA testing before deployment?`

**You:** `yes`

**Jabari:**

> Change Report — Phase 5.5: QA
>
> Agent:    Neema (@qa)
> Will do:
>   - Check Playwright is installed
>   - Run Standard QA (all routes, interactive elements, mobile viewports)
>   - Document any bugs found
>   - Show health score
>   - Fix critical/high bugs with Change Reports
> Will NOT touch:
>   - Test files, design.md, or architecture docs
> Risks:
>   - Bug fixes may touch source files
>
> Proceed? (yes / no)

**You:** `yes`

---

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

*Neema finds the running app on port 3000 and begins exploration.*

**Neema:**

> App found: http://localhost:3000
> Setting up report: .qa/report-20260506-143022.md
>
> Running page-check scripts across all routes...

```
node -e "
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [], networkFails = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) networkFails.push({ url: r.url(), status: r.status() }); });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: '.qa/screenshots/home.png', fullPage: true });
  const title = await page.title();
  const h1 = await page.\$eval('h1', el => el.textContent?.trim()).catch(() => null);
  console.log(JSON.stringify({ url: page.url(), title, h1, consoleErrors, networkFails }, null, 2));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

**Neema:** `Does the app require login to test? (yes / no)`

**You:** `yes — test@inkwell.dev / testpass123`

*Neema writes and runs an auth script, saves session cookies, then checks each route systematically.*

**Neema:**

> Exploration complete. 2 bugs found.
>
> ---
> Bug 1
> Severity: high
> Page:     http://localhost:3000/editor/new
> Found:    Cover image upload shows no progress indicator during upload; the UI appears frozen for up to 4 seconds on large files
> Expected: Progress bar visible during upload as specified in ux-specs.md
> Evidence: .qa/screenshots/editor-upload-frozen.png
> Steps:    1. Log in as author  2. Open /editor/new  3. Drop a 3 MB JPEG onto the dropzone  4. Observe — no progress indicator appears
>
> ---
> Bug 2
> Severity: medium
> Page:     http://localhost:3000/dashboard
> Found:    Delete confirmation appears as a browser `confirm()` dialog, not an inline confirmation as specified
> Expected: Inline confirm UI within the post card (as specified in ux-specs.md)
> Evidence: .qa/screenshots/dashboard-delete-confirm.png
> Steps:    1. Log in as author  2. Go to /dashboard  3. Click delete icon on any post  4. Browser native dialog appears instead of inline confirm

**Neema:**

> Health Score — Inkwell
>
> Category          Weight   Score   Weighted
> ─────────────────────────────────────────────
> Functional          20%     8/10    16
> Console errors      15%    10/10    15
> Accessibility       15%     8/10    12
> UX / flows          15%     7/10    10.5
> Performance         10%     9/10     9
> Visual              10%     9/10     9
> Links / routing     10%    10/10    10
> Content              5%     9/10     4.5
> ─────────────────────────────────────────────
> TOTAL                               86/100
>
> Ship readiness: ⚠️ SHIP WITH CAUTION

*Neema offers to fix Bug 1 (high severity).*

**Neema:**

> Fix Bug 1 — Upload progress indicator missing? (yes / skip)

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Cover image upload shows no progress during upload
> Will fix:
>   - src/controllers/imageController.js — emit upload progress events via Server-Sent Events
>   - src/components/ImageUpload.jsx — listen for progress events; render a `<progress>` element
> Will NOT touch:
>   - Test files, design.md, or any other source file
> Risk:
>   - Low — isolated to image upload component
>
> Proceed? (yes / no)

**You:** `yes`

*Neema applies the fix, re-runs the page-check for /editor/new, confirms the progress bar appears.*

**Neema:**

> ✅ Browser QA complete
>
> Health score: 91/100  (86 → 91 after fixes)
> Bugs found:   2 total  (0 critical, 1 high, 1 medium)
> Bugs fixed:   1 — cover image upload progress indicator
> Remaining:    1 medium item — inline delete confirm (noted in report)
> Report:       .qa/report-20260506-143022.md
>
> Ready for deployment. Next: `/forge/deployment`

---

### Phase 6 — Deployment (Faraji)

**Jabari:**

> Change Report — Phase 6: Deployment
>
> Agent:    Faraji (@devops-azure)
> Will do:
>   - Ask about target environment and existing pipelines
>   - Show infrastructure plan
>   - Run security checklist
>   - Create CI/CD pipeline and Bicep infrastructure
>   - Deploy to target environment
> Will NOT touch:
>   - Source code, test files, or application logic
> Risks:
>   - Azure resources incur cost from point of creation
>
> Proceed? (yes / no)

**You:** `yes`

---

**Faraji:**

> 👋 I'm Faraji, your ForgeAI DevOps Engineer. I get your code running in Azure — safely.
>
> What would you like to do?
>   P · Create or update a CI/CD pipeline
>   I · Provision Azure infrastructure (Bicep / Terraform)
>   D · Deploy to an environment
>   M · Set up monitoring and alerts
>   ? · Show all options

**Faraji:** `Is there an existing pipeline? (yes / no — if yes, I'll extend it rather than replace)`

**You:** `No existing pipeline. Starting from scratch.`

**Faraji:** `What environments does this pipeline need?`

**You:** `Dev and prod. No staging for now.`

**Faraji:** `Any existing service connections or Azure subscriptions to use?`

**You:** `Yes — subscription ID is in the environment as AZURE_SUBSCRIPTION_ID. No existing service connections.`

**Faraji:**

> I'll create / update:
>   - Pipeline: build (lint + test + Docker build) + CD (deploy to Container Apps)
>   - Environments: dev (auto-deploy on push to main), prod (manual approval gate)
>   - Approval gates: prod requires manual approval
>
> Proceed?

**You:** `yes`

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

**Faraji:**

> Change Report — Faraji (DevOps Azure)
>
> Will create / update:
>   - .github/workflows/ci-cd.yml
>   - infra/main.bicep
>   - infra/modules/containerApp.bicep
>   - infra/modules/database.bicep
>   - infra/parameters/dev.json
>   - infra/parameters/prod.json
> Will deploy to:
>   - Azure Container Apps (dev environment)
> Will NOT touch:
>   - Source code, test files, or application logic
> Risks:
>   - Azure resources provisioned — cost begins on creation
>
> Proceed? (yes / no)

**You:** `yes`

*Faraji creates the files, provisions the infrastructure, and deploys.*

**Faraji:**

> ✅ Deployed and running
> Environment: dev
> Health: PASSED
> App Insights: https://portal.azure.com/#resource/subscriptions/.../inkwell-insights
> Pipeline: https://github.com/yourname/inkwell/actions

**Jabari:**

> FORGEAI WORKFLOW COMPLETE
>
> ✓ Phase 0 — Skipped (new project)
> ✓ Phase 1 — Requirements  (design.md)
> ✓ Phase 2 — Architecture  (docs/architecture.md, 2 ADRs)
> ✓ Phase 3 — Design        (docs/ux-specs.md, 3 screens)
> ✓ Phase 4 — Testing       (34 tests, all failing → Gate 4 cleared)
> ✓ Phase 5 — Implementation (34 tests, all tests passing → Gate 5 cleared)
> ✓ Phase 5.5 — QA          (91/100 → Gate QA cleared)
> ✓ Phase 6 — Deployment    (dev deployed to Azure Container Apps)

---

## Scenario 2: Adding a Feature to an Existing App

**Setup:** You have TaskFlow, a project management app (React + Express + PostgreSQL). ForgeAI is not installed. No documentation exists. You want to add global search across tasks and projects.

### Installing ForgeAI

*First, install the agents into the project.*

**You:** (in terminal) `npx forgeai-workflow init`

```
? Which editor are you using?
  > Claude Code
    GitHub Copilot
    Both

? Choose project type:
  > Web application
    API / backend service
    Library / package
    Mobile app

Installing ForgeAI for Claude Code...
✓ .claude/agents/orchestrator.md
✓ .claude/agents/analyst.md
✓ .claude/agents/architect.md
✓ .claude/agents/designer.md
✓ .claude/agents/engineer.md
✓ .claude/agents/test-engineer.md
✓ .claude/agents/devops-azure.md
✓ .claude/agents/qa.md
✓ .claude/agents/codebase-docs.md
✓ .claude/commands/forge-orchestrate.md
✓ .claude/commands/forge-requirements.md
✓ .claude/commands/forge-architecture.md
✓ .claude/commands/forge-design.md
✓ .claude/commands/forge-testing.md
✓ .claude/commands/forge-implementation.md
✓ .claude/commands/forge-deployment.md
✓ CLAUDE.md

ForgeAI installed. Open Claude Code and type @orchestrator to begin.
```

*Now open Claude Code in the project folder.*

### Phase 0 — Jabari Detects an Existing Codebase

**You:** `@orchestrator`

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

### Phase 0 — Amina Documents the Codebase

**Jabari:**

> Change Report — Phase 0: Codebase Documentation
>
> Agent:    Amina (@codebase-docs)
> Will do:
>   - Silently scan the existing codebase
>   - Run full documentation sequence (audience, scope, clarifying questions)
>   - Write docs/ with architecture, conventions, setup, testing, dependencies
> Will NOT touch:
>   - Source code, tests, or configuration files
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

---

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    Node 20 / Express 5 (backend) · React 18 / Vite (frontend) · PostgreSQL 16
> Entry points:  server/index.js · client/src/main.jsx
> Existing docs: None found
> Test coverage: test folder exists: yes (server/tests/, client/src/__tests__/)
> CI/CD:         No pipeline files found
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `D`

**Amina:** `Would you like a deep scan? I'll read every file before asking questions — takes a moment but produces more accurate docs. (yes / no)`

**You:** `yes`

*Amina reads all files silently, then asks the audience and scope questions one at a time.*

**Amina:** `Who is the primary audience for these docs?`
`  1. New engineers joining the team`
`  2. External developers consuming an API`
`  3. Ops / DevOps running the system`
`  4. All of the above`

**You:** `1 — new engineers joining the team.`

**Amina:** `What level of documentation do you need?`
`  1. High-level only — architecture, setup, key concepts`
`  2. Component-level — each module/service documented`
`  3. Full depth — architecture + components + public API reference`

**You:** `2 — component-level.`

**Amina:** `What do new team members always ask about or get wrong?`

**You:** `They always get confused about the task/project relationship — tasks belong to projects, but a task can be linked to multiple projects via a junction table. People assume it's a simple one-to-many.`

**Amina:** `Is there code that is deprecated, experimental, or should be ignored?`

**You:** `Yes — the server/legacy-import/ folder. It was a one-time data migration script. Ignore it.`

**Amina:** `Are there naming decisions or structures that look odd but are intentional?`

**You:** `The client uses "workspace" in some component names but "project" everywhere else in the codebase. They mean the same thing — it's a historical accident from a rebrand we never fully finished.`

---

*Amina surfaces clarifying questions from the deep scan.*

**Amina:**

> I have 3 questions before I start writing. Let's go through them:
>
> 1. `server/middleware/permissions.js` appears to check both role-based and ownership-based access in the same function. Is that by design, or should those be separate concerns?
> 2. `client/src/utils/dateHelpers.js` contains 14 functions but only 3 are imported anywhere in the app. Are the other 11 in use (perhaps via dynamic import) or are they dead code?
> 3. The `tasks` table has a `metadata` JSONB column that is never read or written in the application layer. Is that intentionally reserved for future use, or a leftover from a removed feature?

**You:** `1. By design — it's intentional that role check and ownership check are combined so the caller never forgets either. 2. The 11 unused functions are dead code from a feature we removed — they can be ignored in docs. 3. The metadata column is a leftover — we meant to add custom fields but never did. Flag it as technical debt.`

*Amina confirms the documentation plan.*

**Amina:**

> Here's what I'll document:
>
> [ ] docs/architecture.md         — system overview, component map, data flow
> [ ] docs/conventions.md          — naming, patterns, intentional decisions (including workspace/project note)
> [ ] docs/setup.md                — getting started, prerequisites, env vars
> [ ] docs/testing.md              — test strategy, how to run, coverage targets
> [ ] docs/dependencies.md         — key libraries, why they were chosen
> [ ] docs/components/tasks.md     — task model, many-to-many project relationship
> [ ] docs/components/projects.md  — project model, membership, permissions
> [ ] docs/components/auth.md      — permissions middleware (combined role + ownership — intentional)
>
> Skipping: server/legacy-import/ (deprecated migration script), dead code in dateHelpers.js
>
> Proceed with all, or adjust the list?

**You:** `Proceed with all.`

*Amina shows each document before saving.*

**Amina:** `Here's docs/architecture.md — does this look right before I save it?`

*(Amina displays the full architecture.md content including Mermaid diagrams for system context and data flow.)*

**You:** `Looks good.`

*Amina continues through each document, showing and confirming before saving.*

**Amina:**

> Documentation complete.
>
> Created:
> - docs/architecture.md
> - docs/conventions.md
> - docs/setup.md
> - docs/testing.md
> - docs/dependencies.md
> - docs/components/tasks.md
> - docs/components/projects.md
> - docs/components/auth.md
>
> DOCS COMPLETE
>
> Recommended next steps:
> - Add these docs to your PR template checklist
> - Review quarterly — docs go stale
> - Run `/forge/requirements` to plan new features on this documented base

---

### Feature Planning — Global Search

**Jabari:** `Ready to plan the search feature now?`

**You:** `yes`

**Jabari:**

> Change Report — Phase 1: Requirements
>
> Agent:    Imani (@analyst)
> Will do:
>   - Run requirements Q&A for the global search feature
>   - Produce design.md
> Will NOT touch:
>   - Source code, tests, or existing docs
> Risks:
>   - None — document creation only
>
> Proceed? (yes / no)

**You:** `yes`

#### Phase 1 — Imani (Requirements for Search)

*Imani runs the same five-question Q&A pattern as in Scenario 1, adapted to the search feature.*

**Imani:** `What are we building? One or two sentences.`

**You:** `Global search across tasks and projects — a user types in a search bar and gets instant results from both task titles/descriptions and project names.`

**Imani:** `Who uses it and what problem does it solve?`

**You:** `All authenticated users. The problem: TaskFlow has hundreds of tasks across dozens of projects and there's no way to find anything without clicking through project by project.`

**Imani:** `What does success look like — measurable?`

**You:** `Search results appear within 300 ms. Results are accurate — no phantom results for tasks the user can't see. Users can reach any result in one click.`

**Imani:** `Any hard constraints?`

**You:** `Must use PostgreSQL full-text search — no Elasticsearch or external service. Must respect existing permission model — users must not see tasks they don't have access to.`

**Imani:** `What's explicitly out of scope?`

**You:** `No search history, no saved searches, no search within a specific project (global only), no filtering by date or assignee in this iteration.`

*Imani summarises, user confirms, Imani shows Change Report, user says yes, Imani writes design.md and says ✅ Requirements complete.*

#### Phase 2 — Zuberi (Architecture for Search)

*Jabari shows Change Report for Zuberi. User says yes. Zuberi greets, asks constraints question, walks through one key decision (PostgreSQL full-text search vs trigram index vs external search), produces C4 context showing where the search API slot fits, and a sequence diagram for the search request flow. Zuberi shows Change Report, user says yes, Zuberi writes docs and says ✅ Architecture complete.*

*From this point the workflow continues identically to Scenario 1 — Phase 3 (Zuri specs the search results UI), Phase 4 (Kofi writes failing tests for the search endpoint and the results component, confirms all failing), Phase 5 (Rashidi implements until all tests passing), Phase 5.5 (Neema QA), Phase 6 (Faraji deploys) — each with the same STOP-wait-Change Report-confirm pattern shown in full in Scenario 1.*

---

## Scenario 3: Resuming an Interrupted Workflow

**Setup:** Inkwell project. You completed Phase 1 and Phase 2 last week — design.md and docs/architecture.md both exist. No tests have been written yet. You want to continue from Phase 4.

**You:** `@orchestrator`

**Jabari:**

> 👋 I'm Jabari, your ForgeAI Orchestrator.
>
> Mode: Existing Codebase
> design.md:  ✓ found
> tasks.md:   ✗ not found
> Docs:       ✓ found (docs/architecture.md, 2 ADRs)
>
> What would you like to do?
>   W · Full workflow from scratch
>   R · Resume from a specific phase
>   P · Run one phase only
>   D · Document existing codebase first (Amina)
>   S · Show team and workflow status
>   ? · All options

**You:** `R`

**Jabari:** `Which phase? (1 Requirements / 2 Architecture / 3 Design / 4 Testing / 5 Implementation / 5.5 QA / 6 Deployment)`

**You:** `4 — testing`

*Jabari checks prerequisites before proceeding.*

**Jabari:**

> Checking prerequisites for Phase 4...
>
> ✓ design.md found — Kofi can read acceptance criteria
> ✓ docs/architecture.md found — test scope is informed by architecture
> ✗ Tests not yet written
>
> Ready to hand off to Kofi.
>
> Change Report — Phase 4: Testing
>
> Agent:    Kofi (@test-engineer)
> Will do:
>   - Read design.md acceptance criteria
>   - Show proposed test scope
>   - Write failing tests (unit + integration + E2E)
>   - Run tests to confirm all failing
> Will NOT touch:
>   - Implementation code, design.md, or any non-test files
> Risks:
>   - None — tests will fail by design
>
> Proceed? (yes / no)

**You:** `yes`

*Kofi greets, reads design.md, proposes test scope, shows Change Report, writes tests, runs them, and confirms all failing. The workflow continues from Phase 5 exactly as shown in Scenario 1.*

---

## Scenario 4: Standalone — Documenting an Existing Codebase

**Setup:** You have a legacy Node.js REST API with no documentation. No ForgeAI workflow is running — you just want Amina to document the codebase.

**You:** `@codebase-docs`

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    Node 14 / Express 4 · MongoDB (Mongoose)
> Entry points:  src/server.js
> Existing docs: README.md (last updated 2021)
> Test coverage: test folder exists: no
> CI/CD:         No pipeline files found
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `D`

*Amina asks audience and scope questions one at a time.*

**Amina:** `Who is the primary audience for these docs?`
`  1. New engineers joining the team`
`  2. External developers consuming an API`
`  3. Ops / DevOps running the system`
`  4. All of the above`

**You:** `2 — external developers consuming the API.`

**Amina:** `What level of documentation do you need?`
`  1. High-level only — architecture, setup, key concepts`
`  2. Component-level — each module/service documented`
`  3. Full depth — architecture + components + public API reference`

**You:** `3 — full depth.`

**Amina:** `What do new team members always ask about or get wrong?`

**You:** `Authentication. We use API keys in the header, not Bearer tokens — people always try Bearer first and get a 403.`

**Amina:** `Is there code that is deprecated, experimental, or should be ignored?`

**You:** `The src/webhooks/ folder — it was built for a feature that never launched. Don't document it.`

**Amina:** `Are there naming decisions or structures that look odd but are intentional?`

**You:** `The src/resolvers/ folder is misleadingly named — it's not GraphQL resolvers, it's business logic handlers. Historical naming from before we added Express.`

---

*Amina surfaces three clarifying questions from the scan.*

**Amina:**

> I have 3 questions before I start writing. Let's go through them:
>
> 1. `src/middleware/rateLimit.js` imports `express-rate-limit` but appears to be bypassed in all routes via a `process.env.SKIP_RATE_LIMIT` check. Is rate limiting currently active in production, or is this disabled?
> 2. `src/models/AuditLog.js` is defined but I can't find any route or resolver that writes to it. Is audit logging active, partially implemented, or abandoned?
> 3. Several routes have a `// TODO: validate input` comment. Should I document the validation that is implemented, or note the missing validation as a known gap?

**You:** `1. Rate limiting is active in production — SKIP_RATE_LIMIT is only set in local dev. 2. Audit logging is abandoned — document it as technical debt to remove. 3. Document the missing validation as a known gap — it's a real security concern.`

*Amina confirms the documentation plan.*

**Amina:**

> Here's what I'll document:
>
> [ ] docs/architecture.md               — system overview, component map, data flow
> [ ] docs/conventions.md                — naming (resolvers = business logic), patterns
> [ ] docs/setup.md                      — prerequisites, getting started, API key auth (NOT Bearer)
> [ ] docs/testing.md                    — test strategy (note: no tests currently exist)
> [ ] docs/dependencies.md               — key libraries, why chosen
> [ ] docs/api-reference.md              — all public endpoints, request/response shapes
> [ ] docs/components/resolvers.md       — business logic handlers (naming explained)
> [ ] docs/components/auth.md            — API key authentication, header format
>
> Skipping: src/webhooks/ (unshipped feature), AuditLog model (flagged as technical debt)
>
> Proceed with all, or adjust the list?

**You:** `Proceed with all.`

---

*Amina shows architecture.md before saving.*

**Amina:**

> Here's docs/architecture.md — does this look right before I save it?
>
> ---
> # Architecture — [API Name]
>
> ## System Overview
>
> This is a REST API built with Node 14 and Express 4, backed by MongoDB via Mongoose. It serves external developers via API key authentication. There is no web frontend — the API is the product.
>
> ## Component Map
>
> ```mermaid
> graph TD
>   Client["External Client"]
>   Gateway["Express Router\nsrc/routes/"]
>   Auth["API Key Middleware\nsrc/middleware/auth.js"]
>   Resolvers["Business Logic\nsrc/resolvers/\n(named 'resolvers' for historical reasons)"]
>   Models["Mongoose Models\nsrc/models/"]
>   DB["MongoDB"]
>
>   Client -->|"X-API-Key header"| Gateway
>   Gateway --> Auth
>   Auth -->|"key valid"| Resolvers
>   Auth -->|"key invalid"| Client
>   Resolvers --> Models
>   Models --> DB
> ```
>
> ## Known Technical Debt
>
> - `AuditLog` model exists but is never written to — candidate for removal
> - Input validation is missing on several routes (noted per-endpoint in docs/api-reference.md)
> - `src/webhooks/` contains an unshipped feature — marked for removal
>
> ---

**You:** `Looks right. Add a note that rate limiting is active in production — local dev bypasses it with SKIP_RATE_LIMIT.`

*Amina applies the correction and asks again before saving.*

**Amina:** `Updated. Here's the revised architecture.md with the rate limiting note — does this look right now?`

*(Amina shows the updated version.)*

**You:** `yes`

*Amina saves architecture.md and continues through each document, showing and confirming before each save.*

**Amina:** `Here's docs/conventions.md — does this look right before I save it?`

*(Amina shows conventions.md, highlighting the resolvers naming, API key authentication pattern, and rate limiting bypass convention.)*

**You:** `yes`

*This continues for setup.md, testing.md, dependencies.md, api-reference.md, components/resolvers.md, and components/auth.md — each shown and confirmed before saving.*

**Amina:**

> Documentation complete.
>
> Created:
> - docs/architecture.md
> - docs/conventions.md
> - docs/setup.md
> - docs/testing.md
> - docs/dependencies.md
> - docs/api-reference.md
> - docs/components/resolvers.md
> - docs/components/auth.md
>
> DOCS COMPLETE
>
> Recommended next steps:
> - Add these docs to your PR template checklist
> - Review quarterly — docs go stale
> - Run `/forge/requirements` to plan new features on this documented base

---

## Scenario 5: QA on a Deployed Feature

**Setup:** The Inkwell search feature is live in the dev environment. Implementation is complete and all tests are passing. You want to run QA standalone before signing off.

**You:** `@qa`

*Neema silently checks for Playwright before greeting.*

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

*Neema checks that implementation is complete, finds confirmation in tasks.md, then locates the running app.*

```bash
for port in 3000 4000 5173 5000 8080 8000; do
  curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null | \
    grep -qE "^(200|301|302|304)" && echo "APP: http://localhost:$port" && break
done || echo "APP: not found"
```

```
APP: http://localhost:3000
```

**Neema:**

> App found: http://localhost:3000
> Setting up report directory and report file...
> Reading design.md for FR coverage guidance...

**Neema:** `Does the app require login to test? (yes / no)`

**You:** `yes — test@inkwell.dev / testpass123`

*Neema writes and runs the authentication script.*

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name=\"email\"]', 'test@inkwell.dev');
  await page.fill('input[name=\"password\"]', '[REDACTED]');
  await page.click('button[type=\"submit\"]');
  await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
  const cookies = await page.context().cookies();
  require('fs').writeFileSync('.qa/session.json', JSON.stringify(cookies));
  console.log('AUTH: ok — cookies saved to .qa/session.json');
  await browser.close();
})().catch(e => { console.error('AUTH FAILED:', e.message); process.exit(1); });
"
```

```
AUTH: ok — cookies saved to .qa/session.json
```

*Neema runs the orientation script.*

```bash
node -e "
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  await ctx.addCookies(JSON.parse(fs.readFileSync('.qa/session.json', 'utf8')));
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.qa/screenshots/home.png', fullPage: true });
  const links = await page.\$\$eval('a[href]', as =>
    as.map(a => ({ text: a.textContent?.trim().slice(0, 60), href: a.href }))
      .filter(l => l.href && !l.href.startsWith('javascript'))
  );
  const title = await page.title();
  console.log(JSON.stringify({ title, url: page.url(), consoleErrors, links: links.slice(0, 30) }, null, 2));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

```json
{
  "title": "Inkwell",
  "url": "http://localhost:3000/dashboard",
  "consoleErrors": [],
  "links": [
    { "text": "Dashboard", "href": "http://localhost:3000/dashboard" },
    { "text": "New Post", "href": "http://localhost:3000/editor/new" },
    { "text": "Search", "href": "http://localhost:3000/search" },
    { "text": "Categories", "href": "http://localhost:3000/categories" },
    { "text": "Log out", "href": "http://localhost:3000/logout" }
  ]
}
```

*Neema runs page-check scripts for each route discovered.*

```bash
node -e "
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [], networkFails = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) networkFails.push({ url: r.url(), status: r.status() }); });
  await page.goto('http://localhost:3000/search', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: '.qa/screenshots/search.png', fullPage: true });
  // Test search interaction
  await page.fill('input[type=\"search\"]', 'quarterly');
  await page.waitForTimeout(400); // debounce
  await page.screenshot({ path: '.qa/screenshots/search-results.png', fullPage: true });
  const title = await page.title();
  const h1 = await page.\$eval('h1', el => el.textContent?.trim()).catch(() => null);
  console.log(JSON.stringify({ url: page.url(), title, h1, consoleErrors, networkFails }, null, 2));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

```json
{
  "url": "http://localhost:3000/search",
  "title": "Search — Inkwell",
  "h1": "Search",
  "consoleErrors": [
    "Uncaught TypeError: Cannot read properties of undefined (reading 'highlight')"
  ],
  "networkFails": [
    { "url": "http://localhost:3000/api/search?q=quarterly", "status": 500 }
  ]
}
```

**Neema:**

> 2 bugs found.
>
> ---
> Bug 1
> Severity: critical
> Page:     http://localhost:3000/search
> Found:    Search query returns HTTP 500 from /api/search; UI shows unhandled JS error: "Cannot read properties of undefined (reading 'highlight')"
> Expected: Search returns results within 300 ms (FR-008)
> Evidence: .qa/screenshots/search-results.png · console error above
> Steps:    1. Log in as author  2. Navigate to /search  3. Type "quarterly" in the search input  4. Wait 400 ms for debounce  5. API returns 500; JS TypeError thrown in results renderer
>
> ---
> Bug 2
> Severity: medium
> Page:     http://localhost:3000/search
> Found:    Search input has no `aria-label` attribute; screen readers will announce it as an unlabelled field
> Expected: Input has `aria-label="Search tasks and projects"` (ux-specs.md)
> Evidence: .qa/screenshots/search.png
> Steps:    1. Navigate to /search  2. Inspect the search input element  3. `aria-label` attribute is absent

**Neema:**

> Health Score — Inkwell
>
> Category          Weight   Score   Weighted
> ─────────────────────────────────────────────
> Functional          20%     3/10     6
> Console errors      15%     2/10     3
> Accessibility       15%     7/10    10.5
> UX / flows          15%     8/10    12
> Performance         10%     9/10     9
> Visual              10%     9/10     9
> Links / routing     10%    10/10    10
> Content              5%     9/10     4.5
> ─────────────────────────────────────────────
> TOTAL                               64/100
>
> Ship readiness: 🔴 DO NOT SHIP

**Neema:** `Fix Bug 1 — Search API returns 500 on query? (yes / skip)`

**You:** `yes`

**Neema:**

> Change Report — Neema (QA)
>
> Bug:    Search API returns 500; results renderer crashes on undefined highlight property
> Will fix:
>   - server/controllers/searchController.js — investigate and fix the query error causing 500
>   - client/src/components/SearchResults.jsx — add null guard before accessing `.highlight` property
> Will NOT touch:
>   - Test files, design.md, or any other source file
> Risk:
>   - Low — isolated to search controller and results component
>
> Proceed? (yes / no)

**You:** `yes`

*Neema reads the controller, finds the bug (a missing `ILIKE` parameter in the PostgreSQL full-text query causing a binding error), fixes it, re-runs the page-check script for /search.*

```bash
node -e "
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [], networkFails = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) networkFails.push({ url: r.url(), status: r.status() }); });
  await page.goto('http://localhost:3000/search', { waitUntil: 'networkidle', timeout: 15000 });
  await page.fill('input[type=\"search\"]', 'quarterly');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '.qa/screenshots/search-results-fixed.png', fullPage: true });
  console.log(JSON.stringify({ consoleErrors, networkFails }, null, 2));
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"
```

```json
{
  "consoleErrors": [],
  "networkFails": []
}
```

**Neema:**

> ✅ Browser QA complete
>
> Health score: 87/100  (64 → 87 after fixes)
> Bugs found:   2 total  (1 critical, 0 high, 1 medium)
> Bugs fixed:   1 — search API 500 + results renderer null guard
> Remaining:    1 medium item — missing aria-label on search input (noted in report)
> Report:       .qa/report-20260506-161544.md
>
> Ready for deployment. Next: `/forge/deployment`

---

## Scenario 6: Architecture Health Scan

**Setup:** You have a codebase that has grown for two years. You suspect structural problems but have not done a formal review.

**You:** `@codebase-docs`

**Amina:**

> 👋 I'm Amina, your ForgeAI Codebase Docs Engineer.
>
> Codebase scan complete.
> Tech stack:    Node 18 / Express 4 · React 17 · PostgreSQL 14
> Entry points:  server/app.js · client/src/index.jsx
> Existing docs: docs/README.md (sparse)
> Test coverage: test folder exists: yes
> CI/CD:         .github/workflows/ci.yml found
>
> What would you like to do?
>   D · Full codebase documentation
>   H · Architecture health scan (coupling, shallow modules, agent-unfriendly structure)
>   Q · Just ask clarifying questions about the codebase
>   ? · Show all options

**You:** `H`

*Amina scans silently — reading import graphs, file sizes, function lengths, and dependency patterns.*

**Amina:**

> Architecture Health Scan — [your-app]
> Scanned: 187 files / 31 modules
>
> 🔴 Critical
>   - `server/routes/api.js` (1,847 lines) — all API routes defined in a single file with inline business logic; new routes cannot be found by name; agents and engineers will read the wrong section when making changes
>   - `server/db/index.js` — circular dependency: `db/index.js` imports `models/User.js` which imports `db/index.js`; this causes intermittent startup failures in Node's module cache
>   - `client/src/components/Dashboard.jsx` (923 lines, 14 distinct concerns) — renders the nav, fetches multiple data types, handles all CRUD, manages three separate modals, and formats dates; changes to any part require reading all 923 lines
>
> 🟡 Warning
>   - `server/utils/helpers.js` (312 lines) — 22 functions with no shared theme: date formatting, string truncation, email validation, currency rounding, and S3 URL building are all in one file; unclear where to add new utilities
>   - `client/src/context/AppContext.jsx` — stores 34 different state values including UI state (modal open), server state (current user), and cache state (fetched projects) in a single context; every component re-renders on any state change
>   - `server/middleware/auth.js` — authentication and authorisation are merged into one 200-line function; testing one aspect requires setting up the other
>   - Functions over 80 lines: 18 found (list in detail below) — these resist unit testing and confuse AI agents
>
> 🟢 Healthy areas
>   - Database migration files in `server/db/migrations/` — well-named, sequential, never modified after creation
>   - Test structure in `server/tests/` — mirrors source layout; easy to locate the test for any module
>   - Environment variable handling — all read through `server/config/env.js`, never scattered in business logic
>   - CI pipeline — clean, fast, sensible stage order
>
> Architectural deepening opportunities:
>   1. Split `server/routes/api.js` into one file per resource (`routes/users.js`, `routes/projects.js`, etc.) with controllers extracted to `controllers/` — eliminates the 1,847-line file and makes every route locatable by name in under 10 seconds
>   2. Break the circular dependency: move shared DB initialisation to `server/db/connection.js` with no model imports; have models import from `connection.js` — resolves intermittent startup failures immediately
>   3. Split `Dashboard.jsx` into container + presentational components — one container per data concern; reduces re-render surface and makes each component testable in isolation
>
> Want me to dig deeper into any of these areas?

**You:** `Dig deeper into the auth module.`

**Amina:**

> Deeper analysis — `server/middleware/auth.js`
>
> **What it currently does (200 lines, one function)**
>
> The single `authenticate` middleware function does six things in sequence:
> 1. Reads the `Authorization` header and extracts the token
> 2. Verifies the JWT signature and expiry
> 3. Looks up the user record in the database
> 4. Checks the user's role against a hardcoded allowed-roles list
> 5. Checks whether the user owns the resource being accessed (by parsing `req.params.id`)
> 6. Attaches `req.user` to the request and calls `next()`
>
> **Problems**
>
> - Steps 1–3 are authentication (who are you?). Steps 4–5 are authorisation (can you do this?). Merging them means you cannot test authentication without also satisfying authorisation, and vice versa.
> - The allowed-roles list is hardcoded in the middleware file. Adding a new role means editing authentication code.
> - `req.params.id` is parsed as an ownership check, but this only works for routes with a single ID parameter. Routes with nested resources (e.g., `/projects/:projectId/tasks/:taskId`) cannot use this middleware correctly.
> - The 200-line single function has 4 levels of nesting in the ownership check block — difficult to follow and resistant to unit testing.
>
> **Recommended split**
>
> ```
> server/middleware/
>   authenticate.js   — verify JWT, attach req.user (steps 1–3)
>   authorise.js      — role check factory: authorise('admin', 'editor') (step 4)
>   requireOwner.js   — ownership check, accepts a resolver fn for nested IDs (step 5)
> ```
>
> This allows routes to compose:
>
> ```javascript
> router.delete('/posts/:id',
>   authenticate,
>   authorise('admin', 'author'),
>   requireOwner(req => req.params.id),
>   postController.delete
> );
> ```
>
> Each middleware becomes independently testable with a mock `req` object. The roles list moves to a constants file. Nested resource routes can pass a custom resolver.
>
> **Risk if left unchanged**
> The current circular dependency in `db/index.js` interacts with this middleware — if the DB connection initialises out of order, `authenticate` will call `next()` with an undefined user. This is currently masked by Node's module caching behaviour but will surface under load or after a server restart in certain environments.
>
> Want me to document this as an ADR-style recommendation, or move on to another area?

---

## Quick Reference

### Agents

| Agent | Name | Invoke in Claude Code | When to use |
|-------|------|-----------------------|-------------|
| Orchestrator | Jabari | `@orchestrator` | Starting or resuming the full workflow |
| Codebase Docs | Amina | `@codebase-docs` | Documenting existing code; architecture health scans |
| Analyst | Imani | `@analyst` | Requirements, PRDs, user stories |
| Architect | Zuberi | `@architect` | System design, ADRs, Mermaid diagrams |
| Designer | Zuri | `@designer` | UX/UI screen specs, user flows |
| Test Engineer | Kofi | `@test-engineer` | Writing failing tests before implementation |
| Engineer | Rashidi | `@engineer` | Implementation — only after tests are written and failing |
| QA | Neema | `@qa` | Browser testing via Playwright after all tests pass |
| DevOps Azure | Faraji | `@devops-azure` | CI/CD, Azure infrastructure, deployment |

### Slash Commands

| Command | What it does |
|---------|-------------|
| `/forge/orchestrate` | Start or resume the full ForgeAI workflow with Jabari |
| `/forge/requirements` | Run Phase 1 — requirements Q&A and design.md |
| `/forge/architecture` | Run Phase 2 — system design, ADRs, diagrams |
| `/forge/design` | Run Phase 3 — UX/UI screen specs |
| `/forge/testing` | Run Phase 4 — write failing tests |
| `/forge/implementation` | Run Phase 5 — implement to make tests pass |
| `/forge/deployment` | Run Phase 6 — CI/CD and Azure deployment |
| `/forge/document-codebase` | Standalone — document an existing codebase with Amina |

### Gate Cheat Sheet

| Gate | Who clears it | What must happen | Confirmation |
|------|--------------|-----------------|------------|
| Gate 4 | Kofi | All tests written and confirmed failing | `✅ Tests written — all failing` |
| Gate 5 | Rashidi | All tests passing, 0 failing | `✅ Implementation complete — all tests passing` |
| Gate QA | Neema | All critical and high bugs resolved | `✅ Browser QA complete` |
| Phase 6 | Faraji | Deployment completed and healthy | `✅ Deployed and running` |

No gate is cleared by assumption, estimation, or optimism. Each gate requires the confirmation above.
