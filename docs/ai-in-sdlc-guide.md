# AI in Software Engineering — A Team Guide

> Practical steps for using AI across the SDLC we already run — grounded in Google's *"The New SDLC With Vibe Coding"* and the wider 2025–2026 research on AI-assisted engineering.

This guide does not propose a new process. It maps AI practices onto the SDLC phases your team already uses — plan, design, build, test, review, deploy, operate — and says what to do differently at each one. It is tool-agnostic: it applies whether you're on GitHub Copilot, Claude Code, Cursor, or [ForgeAI](../playbook/PLAYBOOK.md).

---

## The Core Shift

Google's whitepaper (Osmani, Saboo & Kartakis, May 2026) frames it precisely: **writing code is no longer the expensive part of software engineering. Specifying what to build, and verifying what the machine wrote, is.**

Two ideas from that paper anchor everything below:

**1. Agent = Model + Harness.** The model — GPT, Gemini, Claude — is roughly 10% of what makes an AI coding agent work. The other 90% is the *harness*: instructions and rule files, tools and MCP servers, sandboxes, orchestration, hooks, and observability. When an agent produces bad output, the harness is almost always the fix, not "waiting for a better model." Everything in this guide is harness engineering.

**2. Vibe coding and agentic engineering are the same activity at different verification rigor**, not two different things. There's no bright line — it's a spectrum, and where a task sits on it should be a deliberate choice, not a default:

| | Vibe coding | Structured AI-assisted | Agentic engineering |
|---|---|---|---|
| **Verification** | "Does it seem to work?" | Code review + existing test suite | Written spec, automated evals, CI/CD gates |
| **Appropriate for** | Prototypes, spikes, throwaway scripts, hackathons | Most day-to-day feature work | Production systems, anything touching money, auth, or PII |
| **Failure mode if misapplied** | N/A — it's disposable | Slop ships to prod | Wasted ceremony on a one-off script |

**The practical rule: match verification effort to what's at stake, and default one notch stricter than feels necessary.** A throwaway internal script doesn't need a spec and an eval suite. A payments change does — full stop, regardless of how confident the diff looks.

---

## The Amplifier Principle

The [2025 DORA State of AI-assisted Software Development report](https://dora.dev/dora-report-2025/) (Google Cloud/DORA, ~5,000 respondents, Feb 2026) is blunt about this: **AI does not fix a team's problems. It amplifies whatever is already there.**

DORA's data splits teams into profiles from "Legacy Bottleneck" (~11%, AI makes them write code faster into systems too fragile to hold it) to "Harmonious High Achievers" (~20%, AI compounds an already-strong loop). The same tool, wildly different outcomes — determined entirely by the engineering foundation underneath it.

This is the same finding Stripe's engineering org reached independently: **"the walls matter more than the model."** A codebase with good test coverage, clear conventions, and tight CI/CD produces excellent agent output. A codebase without these produces the same problems, just faster and at higher volume.

**Practical implication: don't scale AI usage ahead of your foundations.** Before rolling this out past pilot users on a repo, be honest about whether these are true:

- [ ] CI runs on every PR and is fast enough that agents get feedback in the loop, not after
- [ ] Test coverage exists for the code AI will touch — untested code means AI has no way to verify its own work
- [ ] Conventions are written down somewhere an agent can read them, not just in senior engineers' heads
- [ ] Version control discipline is solid (small commits, clean history) — AI output multiplies whatever discipline already exists
- [ ] There's an actual owner for "AI tooling policy" — GitLab's 2026 DevSecOps survey found 80% of orgs adopted AI tools faster than they built governance for them, and 92% report struggling to govern AI-generated code as a result

If most of these are false, fix them first. AI on top of a weak foundation is how you get GitLab's other finding: 82% of teams now deploy at least weekly, but tool sprawl and governance gaps eat back nearly a full workday per person per week.

---

## Practical Steps, By SDLC Phase

### Phase 1 — Planning & Requirements

The old model: a PM writes a doc, hands it to engineering weeks later. The new model, per Google's paper: **requirements become a real-time conversation that produces spec and prototype together**, not a static handoff.

**Do:**
- Before any implementation, have someone interview the AI-in-reverse: describe the feature, and have the assistant ask clarifying questions until it can restate acceptance criteria back to you. This surfaces edge cases faster than a human alone typically does.
- Write the spec down. A one-line Jira ticket produces a one-line-quality feature. A spec with GIVEN/WHEN/THEN acceptance criteria, explicit non-goals, and quality targets (coverage, perf budget) is what actually controls output quality — it's the single highest-leverage document in the whole pipeline.
- Decide up front where this task sits on the vibe-coding-to-agentic-engineering spectrum, and say so in the ticket. That decision drives how much verification phases 4–5 require.

**Don't:**
- Let "the AI wrote a plausible plan" substitute for someone with domain knowledge reading it. Agents fill gaps with plausible-sounding assumptions when a spec is vague — they don't flag the gap, they paper over it.

---

### Phase 2 — Design & Architecture

Every source agrees on this one: **architecture is the most stubbornly human phase, and stays that way.** Google's paper is explicit that structural trade-offs reflect business context, cost constraints, and organizational reality that models don't have visibility into. Thoughtworks' guidance on agentic SDLC makes the same point about "who manages the loop."

**Do:**
- Use AI as a thinking partner for architecture — generating options, surfacing trade-offs you hadn't considered, drafting the first pass of an ADR. Useful accelerant.
- Make the human own the decision and write it down. The ADR (or equivalent) is what gives every downstream agent the context to implement consistently, instead of each one inventing its own pattern.
- Treat undocumented architecture decisions as a liability specifically *because* of AI: an agent working from an undocumented codebase will infer a plausible-looking architecture that may not match what you actually intended.

**Don't:**
- Delegate the actual trade-off decision to the model. It can produce a system design that looks defensible and still be wrong for reasons only a human with business context would catch.

---

### Phase 3 — Development / Implementation

This is where the compression is real — Google cites productivity gains in the 25–39% range from vendor-reported surveys — and also where the sharpest counter-evidence sits: [METR's 2025 randomized controlled trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found experienced developers working in codebases they knew deeply were **19% slower** with AI assistance, while *believing* they were 20% faster. Both are true simultaneously — the gain is real on unfamiliar or boilerplate-heavy work, and can invert on complex work in a codebase you already hold in your head.

**Do:**
- Maintain a harness file (`CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md` — whichever your tool reads) documenting stack, conventions, test commands, and house rules. This is the single highest-leverage artifact for implementation quality — it's most of the "90%" in Agent = Model + Harness.
- Point agents at code, not descriptions: file paths, function names, and an existing pattern to follow ("match the style in `UserRepository.ts`") consistently outperforms a prose description of what you want.
- Use red/green TDD when the tool supports it: tests written and **confirmed failing** before implementation starts. Skipping the failure-confirmation step is the most common way this goes wrong — a test that was never confirmed failing might not be testing anything.
- Work in small batches. This is one of DORA's seven AI Capabilities Model practices for a reason: small diffs are the unit AI verification (and human review) actually works at.
- On complex, familiar-to-you code: notice if AI is helping or performing helping. If you'd have written it faster yourself, say so and take the wheel — the METR finding means this isn't a hypothetical.

**Don't:**
- Let context accumulate across unrelated tasks in one session. Start fresh for each new feature; use subagents/sub-tasks for research so exploration doesn't pollute the main thread's context.

---

### Phase 4 — Testing & QA

Google's paper describes this as an inversion: tests stop being something written *after* code to check it, and become **the mechanism you use to steer the agent** — the specification of correctness the agent works against.

**Do:**
- Write tests/evals before generation for anything past "structured AI-assisted" on the spectrum. For agentic/autonomous work, this means output evaluation (is the result correct) *and* trajectory evaluation (was the reasoning sound) — a right answer reached the wrong way is a landmine for the next similar task.
- Run deterministic tests for anything with a deterministic answer (unit/integration tests). Reserve LLM-graded evals for genuinely subjective output (tone, summarization quality) — don't use an eval where a test would do; it's slower and less reliable.
- Set the verification bar at the eval suite, not the demo. A demo shows the happy path worked once. An eval suite is what tells you it'll keep working.

**Don't:**
- Accept mocked integration tests from an agent without asking why. Agents default to mocking when the real integration is hard to set up — and a mocked test can pass while the real path is broken. This is one of the most common quality failures teams report.

---

### Phase 5 — Code Review

**No source in this research suggests review becomes optional. Every one says the opposite.**

**Do:**
- Review AI-generated code the way you'd review a capable junior engineer's PR: read it, understand it, be able to explain it before it merges. Never ship code you can't explain.
- Get a second, fresh-context review pass — a session that didn't write the code, reviewing the diff cold — for anything non-trivial. It catches what the writer (human or agent) won't, because it has no sunk-cost bias toward the approach taken.
- Check for the same handful of smells every time: obvious/redundant comments, defensive code (null guards, try/catch) that doesn't match surrounding patterns, type-system workarounds (`any`, unchecked casts, suppressed lint), and invented patterns that don't exist elsewhere in the file. These are the fast tells for AI-generated slop.

**Don't:**
- Rubber-stamp because the diff "looks clean." Clean-looking and correct are different properties, and AI output optimizes for the former by default.

---

### Phase 6 — Deployment & Release

The security research is unambiguous that **the CI/CD gate is where AI-introduced risk gets caught or doesn't** — this is a supply-chain and secrets problem as much as a code-quality one.

**Do:**
- Run static analysis, dependency scanning, and secret scanning on every AI-assisted change before merge — not as an optional step. [OWASP/OpenSSF guidance](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html) on AI code specifically flags **hallucinated package names** as a live risk: studies have found up to ~20% of AI-suggested dependencies don't exist, which is exploitable ("slopsquatting") if someone registers the fake package name first. Never let an agent add a dependency that isn't resolved through your normal package manager.
- Generate/maintain an SBOM (SPDX or CycloneDX) and pin dependencies and container images by digest, not by mutable tag — standard supply-chain hygiene that matters more, not less, once AI is proposing dependency changes at higher volume.
- Keep staged rollout discipline (canary, feature flags, gradual ramp) exactly as tight as before AI — arguably tighter, since AI can now produce a larger change in a single PR than a human typically would in the same review cycle.

**Don't:**
- Loosen deploy gates to keep pace with AI-accelerated PR volume. Faros AI's analysis of 10,000+ developers found AI increased PR throughput 98% but increased production incidents 242% at organizations that didn't also invest in quality infrastructure. The gate is what prevents that trade.

---

### Phase 7 — Maintenance & Operations

This is the most underrated phase in most teams' AI rollout, and the one Google's paper calls out explicitly: agents are good at exactly the work that piles up because humans avoid it.

**Do:**
- Point AI at legacy modernization, dependency upgrades, deprecation cleanup, and large mechanical refactors with explicit rules — this is a strong fit: repetitive, well-specified, high-tedium, previously deprioritized because no one wanted to do it by hand.
- Use AI to read and document undocumented code before extending it. Generating docs and a health/coupling scan of an unfamiliar codebase before touching it prevents agents (and humans) from inventing assumptions about architecture that isn't there.

**Don't:**
- Point autonomous agents at production incident response unsupervised. Use AI to accelerate investigation and root-cause analysis (Ramp reports an 80% reduction in investigation time via MCP-connected agents) — but keep a human deciding what action to take.

---

## Cross-Cutting: Security & Governance

This isn't a phase, it's a constraint on all of them.

1. **Write a security-focused harness file.** Whatever your tool reads (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `copilot-instructions.md`), it should state: input validation rules, "never hardcode secrets — use the vault/env pattern already in this repo," parameterized queries only, and a pointer to OWASP ASVS / CWE Top 25 for the stack you're on. [OpenSSF's guide](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html) has a ready-made template per language/platform — don't write this from scratch.
2. **Avoid persona prompts for security ("act as a security expert").** Counter-intuitively, research cited in the OpenSSF guide found this tends to make output *worse*, not better — specific, concrete rules outperform role-play framing.
3. **The developer is accountable, not the tool.** State this explicitly in team policy: whoever's name is on the commit owns the correctness and security of that code, regardless of how much of it a model wrote.
4. **Have an actual tool policy.** Which assistants are approved, what data they're allowed to see (source, prod data, customer PII), and who owns updating that policy as tools change. GitLab's finding that 49% of teams now run more than five different AI tools without a coordinating policy is the tool-sprawl failure mode to avoid — pick a small approved set deliberately.
5. **Keep an audit trail.** For agentic (not just assisted) work, log what the agent did and why, not just the resulting diff — you need this if something goes wrong three weeks later and no human remembers the reasoning.

---

## Cross-Cutting: What to Measure

Don't measure AI adoption by lines of code generated or percentage of AI-authored commits — both are vanity metrics that reward volume over judgment.

**Track instead:**
- **DORA four keys** (deployment frequency, lead time, change failure rate, MTTR) — unchanged by AI adoption, still the right delivery-health signal, and the metric that actually shows whether AI is helping or just producing more PRs.
- **Escaped defect / incident rate**, specifically for AI-touched changes vs. human-only changes, for the first few quarters of rollout — this is how you catch a Faros-style 242%-incident-increase trend before it compounds.
- **Perceived vs. actual velocity, periodically sanity-checked.** METR's core finding — developers *felt* 20% faster while measurably running 19% slower — means self-reported speed is not trustworthy on its own for complex, familiar-codebase work. Spot-check with time-to-merge data.
- **Team well-being**, not just throughput. DORA's "Harmonious High Achievers" profile scores well on delivery *and* burnout/satisfaction — teams that trade one for the other haven't actually adopted AI well, they've just moved the cost somewhere less visible.

---

## Adoption Roadmap

Map your rollout to the same spectrum the whitepaper uses — don't try to jump straight to full agentic engineering team-wide.

**Stage 1 — Foundations (weeks 1–4).** Fix the prerequisites in "The Amplifier Principle" above before scaling past a pilot. Pick one approved tool set. Write the harness file for one repo.

**Stage 2 — Structured AI-assisted, pilot team (weeks 4–10).** One team, real feature work, spec-before-code and mandatory human review enforced. Track the metrics above from day one so you have a baseline before wider rollout, not after.

**Stage 3 — Scale with guardrails (quarter 2+).** Roll out the harness-file pattern, tool policy, and CI/CD gates org-wide. Reserve full agentic engineering (autonomous multi-step agents, minimal per-step review) for well-specified, high-repetition work — migrations, dependency upgrades, test generation — not for judgment-heavy feature work, until the team has a track record with the simpler mode.

At every stage, new engineers should: read this guide, run a health/docs scan on the codebase before their first AI-assisted change, and pair with an experienced teammate through their first full feature so they see what "confirm before proceeding" actually looks like in practice.

---

## Anti-Patterns to Avoid

- **Vibe coding in production.** Fine for prototypes and throwaway scripts. Shipping unreviewed, unspecified AI output to a system with real users is the failure mode the whole spectrum concept exists to prevent.
- **The approval rubber-stamp.** Approving every AI change report / PR without reading it defeats the entire point of having a human-in-the-loop gate.
- **Context overload.** Long-running sessions that accumulate corrections from unrelated earlier tasks degrade output quality. Clear context between tasks.
- **Delegating architecture.** Letting an agent make structural decisions it doesn't have the business context to make.
- **Mocked tests as a substitute for real verification.** A passing mock is not evidence the real path works.
- **Tool sprawl without a policy.** More AI tools does not mean more capability if nobody owns coordinating how they're used and governed.
- **Measuring only speed.** If throughput is up and nothing else is being tracked, you won't see the incident-rate or burnout cost until it's already large.

---

## One-Page Quick Reference

1. Match verification effort to what's at stake — vibe code a spike, spec-and-test anything customer-facing.
2. Fix your engineering foundations (tests, CI, docs, conventions) before scaling AI usage — it amplifies what's already there.
3. Write a harness file (`CLAUDE.md`/`AGENTS.md`/equivalent) per repo: stack, conventions, test commands, security rules.
4. Spec before code. Always.
5. Red/green: tests written and confirmed failing before implementation, for anything past a prototype.
6. Small batches, fresh context per task.
7. Every AI-authored change gets human review — no exceptions, no rubber-stamping.
8. Security/dependency scanning runs on every AI-assisted change; never let an agent add an unresolved dependency.
9. Measure DORA four keys + escaped defects + well-being, not lines-of-code or commit-count.
10. Notice when AI is making you slower on code you know deeply — and take the wheel when it is.

---

## Research Grounding

- **Google — [*The New SDLC With Vibe Coding*](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding)** (Osmani, Saboo & Kartakis, May 2026) — the vibe-coding/agentic-engineering spectrum, Agent = Model + Harness, SDLC phase redistribution, context engineering.
- **DORA / Google Cloud — [State of AI-assisted Software Development 2025](https://dora.dev/dora-report-2025/)** and the accompanying [AI Capabilities Model](https://dora.dev/ai/capabilities-model/report/) — the amplifier principle, seven team archetypes, seven foundational capabilities (incl. quality internal platforms as the largest amplifier).
- **GitLab — 2026 Global DevSecOps Report** — the "AI Paradox," tool sprawl (49% run 5+ AI tools), governance gap (80% adopted AI faster than governance; 92% report governance challenges).
- **METR — [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)** — randomized controlled trial finding 19% slower completion despite a perceived 20% speedup, on complex tasks in familiar codebases.
- **OWASP / OpenSSF — [Security-Focused Guide for AI Code Assistant Instructions](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html)** — harness-file security templates, dependency hallucination risk, RCI (recursive criticism and improvement) technique.
- **Stripe Engineering** — "the walls matter more than the model"; Minions architecture (1,300+ AI-authored PRs/week via a structured "Blueprints" workflow).
- **Ramp** — 80% reduction in incident investigation time via MCP-connected agents.
- **Faros AI** — analysis of 10,000+ developers: AI increases PR volume 98% but increases incidents 242% without quality infrastructure investment.
- **Thoughtworks** — agentic SDLC guidance on human-managed loops and organizational/governance implications.
- **McKinsey (2025)** — only 5.5% of organizations see measurable AI ROI; high performers redesign workflows rather than layering tools on unchanged process.

The consistent thread across all of them: **the model is not the bottleneck. The team's engineering discipline is** — and AI adoption reveals that discipline rather than replacing the need for it.
