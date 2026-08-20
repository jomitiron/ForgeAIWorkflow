# Code Generation Pipelines — How We Built It (and How You Can Set It Up Too)

**Organization:** `dev.azure.com/microsoft` · **Project:** `WindowsProtocolTestSuites` · **Pipeline folder:** `\WindowsProtocolTestSuites\Code Generation`
**Folder URL:** https://dev.azure.com/microsoft/WindowsProtocolTestSuites/_build?definitionScope=%5CWindowsProtocolTestSuites%5CCode%20Generation

This is a step-by-step runbook of the full chain, in the order data actually flows through it:

**GenDox → Specification Generation → Work Item Creation → Agency Assignment → Agency Custom Compute → Monitoring & Validation → human review/merge.**

Each step says what we did and why, so you can reproduce it (or adapt it) for another repo/protocol set.

---

## Step 1 — Prerequisites: get CLI access

```bash
az extension add --name azure-devops        # az 2.77.0, azure-devops 1.0.2 in this environment
az login                                     # sign in with your @microsoft.com account
az devops configure --defaults organization=https://dev.azure.com/microsoft \
                                 project=WindowsProtocolTestSuites
```

- `az account show` must return tenant `72f988bf-86f1-41af-91ab-2d7cd011db47` (Microsoft).
- `az rest` calls need `--resource 499b84ac-1321-427f-aa17-267ca6975798` (the Azure DevOps AAD resource ID).
- On Windows, `az rest` can crash (`UnicodeEncodeError`/`charmap`) on responses with non-cp1252 characters — pipe to `--output-file <path>` and set `PYTHONIOENCODING=utf-8` first.
- Requires Contributor (or higher) on `WindowsProtocolTestSuites`, plus read access to `SpecificationGenerationv2` and `Code Generation WPTS`.

---

## Phase 1 — GenDox: the source of truth

**Why this phase exists:** the authoritative copy of each protocol spec lives in GenDox — an internal documentation system hosted in a *different* Azure DevOps organization (`ointprotocol`, project `GenDoxDataProduction`) than the one the pipelines run in (`microsoft`). Every protocol has a "Book" at a path like `Teams/Windows/Published/Books/MS-SMB2`. Reading it means crossing an org boundary, which is why this phase is entirely about setting up cross-org auth before any diffing logic runs.

**Step 2 — Provision a managed identity for cross-org reads.**
Create a user-assigned managed identity, `protocopilotmanagedidentitymvp`, and grant it **Contributor** on the `GenDoxDataProduction` project in the `ointprotocol` org.

**Step 3 — Create the Azure RM service connection.**
In `WindowsProtocolTestSuites`, create an Azure RM service connection named **`SpecGen-GenDox-MI`** using workload identity federation (WIF), bound to that managed identity (connection id `1f7e45a8-43fa-41de-afa9-65339fc63952`).

**Step 4 — Mint a token at run time, not a stored secret.**
Inside the SpecGen pipeline, an `AzureCLI@2` task authenticates via this connection and calls:
```powershell
$env:GENDOX_GIT_TOKEN = (az account get-access-token --resource "499b84ac-1321-427f-aa17-267ca6975798" --query accessToken -o tsv)
```
No PAT is stored for this hop — the token is minted fresh on every run and scoped to Azure DevOps, letting the pipeline read GenDox's git history as if it were local.

---

## Phase 2 — Specification Generation: turning spec changes into diffs

**Why:** protocols change over time (new sections, clarifications, removed content). SpecGen watches for those changes and turns them into two separate outputs — a partner-facing comparison report, and an internal diff that later becomes work items.

**Step 5 — Create the repo and pipeline.**
Repo `SpecificationGenerationv2` (branch `main`), pipeline YAML `azure-pipelines.yml` at the repo root, step logic factored into `ci/specgen-steps.yml`. Create pipeline id **188962** in the `\WindowsProtocolTestSuites\Code Generation` folder, pool `windows-latest`.

**Step 6 — Define the protocol registry.**
`supportedProtocols` in the YAML is the list of protocols the pipeline knows how to run: `MS-SMB2`, `MS-FSA`, `MS-RDPBCGR`. Onboarding a new protocol means adding its code here — it must already exist as a Book in GenDox and be published on Learn.microsoft.com. The `protocolCode` parameter (`all`, one code, or a comma list) gates *which* of the registered protocols actually run on a given trigger, evaluated at compile time via `${{ each }}` / `${{ if }}`.

**Step 7 — Schedule it.**
Cron `0 16 * * 1-5` — 8am PST, weekdays, `always: true` so it still runs with no new commits (state tracking, described below, is what actually decides if there's anything to do).

**Step 8 — Run the partner-facing (LMC) flow.**
For each selected protocol:
```
python -m specgen.pipeline.pipeline <protocol> --source lmc --output-dir <out>/partner --max-previous 15
```
Sourced from the **public** Learn.microsoft.com docs. Publishes `comparison-artifacts.zip` and flagged sections as build artifacts. This flow never touches GenDox content and never creates work items — it's for partner consumption only.

**Step 9 — Run the internal (GenDox) flow.**
First, hydrate the protocol's prior state (last processed commit/baseline) from a variable group — see Step 13. Then, using the `SpecGen-GenDox-MI` connection from Phase 1:
```
python -m specgen.pipeline.pipeline <protocol> --source gendox --branch main --output-dir <out>/internal --state-dir state/gendox
```
If new commits are found since the last run, this writes `gendox-run.json` and the pipeline sets `gendoxHasChanges=true` — the flag that gates everything in Phase 3.

**Step 10 — Validate a single protocol before trusting the full schedule.**
```bash
az pipelines run --id 188962 --parameters protocolCode=MS-SMB2
```

---

## Phase 3 — Work Item Creation: turning a diff into an actionable task

**Why:** a raw diff isn't actionable on its own — it needs to become a tracked, assignable unit of work with enough context that a human *or an AI agent* can act on it without re-reading the whole spec.

**Step 11 — Only runs when there's something new.**
Gated on `gendoxHasChanges == true` (Phase 2, Step 9). Reads `manifest.json` to find the latest-vs-previous version pair, then `flagged-sections-v<new>-v<old>.json` for the per-section diff.

**Step 12 — Create one ADO Task per flagged section**, via `tools/Create-AdoWorkItems.ps1`, in a **different project** than the pipelines run in — `OS`, not `WindowsProtocolTestSuites`:

| Field | Value |
|---|---|
| Title | `[SpecGen] <Protocol> v<version>: Section <X.X.X> - <Title> (<ChangeType>)` |
| Description | HTML: "SpecGen test-impact review" header, then a **unified diff** (Modified) or full content (Added/Removed) in a `<pre>` block, then a footer instructing the assignee that the PR **must** include a line `ADDED TESTS: {names}` or `ADDED TESTS: NONE`. Hard-capped under ADO's 8000-char description limit — truncated content gets a pointer back to the Learn MCP Server for the full text. |
| Tags | `SpecGen; WPTS-AI-TASK; WPTS AI Task; <ProtocolCode>; v<version>; <ChangeType>[; commit:<hash>]` |
| Area Path | `OS\ImPaCT\TEC\Data and Protocols` |
| Iteration | current sprint, resolved live from the `Protocol And Data Compliance` team |
| Assigned To | a **human** reviewer by default (not the AI agent yet — that happens in Phase 4) |

Dedup: skips creating a work item if one with the exact same title already exists.

**Step 13 — Persist state so the next run knows where it left off.**
`specgen.tracking.commit_tracker` records the processed commit into `state/gendox/<protocol>.json`. That JSON is then `PUT` into the **`CodeGenerationStateGroup`** variable group via the ADO REST API — which is why the pipeline's build service identity needs **Administrator** (not just User) on that variable group; a read-only grant lets hydration work but the persist step 403s.

**Step 14 — Publish internal-only audit artifacts.**
`comparison-artifacts.zip` from the GenDox flow is published as a build artifact clearly labelled `INTERNAL` — never shared with partners, unlike the LMC artifacts from Step 8.

---

## Phase 4 — Agency Assignment: handing the task to the AI agent

**Why:** work items created in Phase 3 just sit there until something notices them, prepares a branch, and formally hands them to the AI agent (Agency). That's this pipeline's entire job.

**Step 15 — Create the repo and pipeline.**
Repo `Code Generation WPTS` (branch `main`), YAML `.azuredevops/pipelines/wpts-ai-codegen.yml`. Pipeline id **189142**, `trigger: none` (schedule only — `0 16 * * *`, 8am PST **daily**, independent of SpecGen's weekday cadence, since it just processes whatever's pending regardless of who created it). Pool `TestSuiteBuildESPoolTME-CentralUS` / `windows-latest`.

**Step 16 — Wire up the shared config.**
Service connection **`AgencyWPTS`** (Azure RM), variable group **`CodeGenerationGroup`**:

| Variable | Secret | Purpose |
|---|---|---|
| `PAT` | Yes | ADO PAT (`WIT_PAT`) for work-item and PR-comment writes |
| `ServicePrincipal` | No | `AGENCY_SP_CLIENT_ID` |
| `PipelineForTestID` | No | `190320` — the validation pipeline used later in Phase 6 |
| `UserGroup` | No | escalation target: `Windows Protocol Test Suite Team` |
| `AllowedSpecGenProtocols` | No | `MS-SMB2, MS-FSA` |

**Step 17 — Query for pending AI work items.**
`scripts/query-work-items.ps1` runs one WIQL query **per tag variant** — `WPTS AI Task`, `WPTS-AI-TASK`, `WPTS AI TASK` (guards against inconsistent casing/spacing across whoever/whatever created the item), scoped to `AreaPath UNDER 'OS\ImPaCT\TEC\Data and Protocols'` and `State IN ('Proposed','Committed')`. Strips HTML from descriptions and writes results to a **temp file** (not a pipeline variable — ADO variables cap at 32KB, and a batch of full descriptions can exceed that).

**Step 18 — Process each pending item.**
`scripts/process-work-items.ps1`, only if the query found anything:
1. **Create branch** `ai-work/{workItemId}` from `main` in `WindowsProtocolTestSuites`.
2. **Set work-item state → `Started`.**
3. **Tag and assign** the work item to the AI agent identity — explicitly **not** the bare display name `Agency`, because a second, unrelated identity literally named "agency" (`agency1@microsoft.onmicrosoft.com`) exists in the tenant and makes plain-name assignment ambiguous (ADO rejects it: *"Provide a unique name for this field"*). The pipeline uses a disambiguated identity string instead:
   ```
   Agency <e329845e-a08b-4356-8270-e641496e4aba@72f988bf-86f1-41af-91ab-2d7cd011db47>
   ```
   If assignment fails, the work item is reset to `Proposed` and a comment explains that manual intervention is needed.

**Step 19 — This assignment is the actual trigger.**
Assigning the work item to Agency's identity is what makes Agency itself pick the task up (via "Way A" — work-item assignment / `agency remote create`, per the policy file in Phase 5). Nothing else in this pipeline invokes Agency directly.

---

## Phase 5 — Agency Custom Compute: where the agent actually runs

**Why:** Agency's default managed compute was failing to clone this specific repo. Rather than wait on the platform team, we stood up a **customer-owned** compute pipeline that clones the repo itself and hands control back to Agency's own task — Agency still drives the coding agent; we just own the environment underneath it.

**Step 20 — Author the pipeline in the repo Agency operates on.**
`.azuredevops/pipelines/agency-custom-compute.yml`, on branch `ai-work/agency-custom-compute` in `WindowsProtocolTestSuites` — this location is a hard constraint, not a convention. Extends `v1/1ES.Agency.PipelineTemplate.yml` from `1ESPipelineTemplates/1ESPipelineTemplates`, pinned to `refs/tags/canary` (Public Preview — expect churn, re-test on template bumps). `useAgencyManagedPool: true` (shared `Agency-Prod-Default` pool — no separate provisioning needed), `os: windows`.

**Step 21 — Self-clone instead of relying on built-in sync.**
`skipSourceSync: true`, plus a `preAgentSteps` PowerShell block that clones the repo itself using the build identity:
```powershell
git -c http.extraHeader="AUTHORIZATION: bearer $(System.AccessToken)" clone $repo $dst
```
(Never embed a token in the clone URL — it can leak into error output; use the header instead.)

**Step 22 — Create the pipeline and set the 3 queue-time-only variables.**
Pipeline id **195772**. These three **must never be defined in YAML** — set them only in the pipeline's **Edit → Variables** UI, marked "Settable at queue time," or invocation breaks:

| Variable | Value |
|---|---|
| `Agency.Consent.WindowsProtocolTestSuites` | `true` |
| `Agency_Context` | *(empty — populated by Agency at invocation)* |
| `system.connection.accessTokenScope` | `vso.agentpools vso.build_execute vso.code vso.packaging` (must include `vso.code`) |

**Step 23 — Tell Agency to use this pipeline instead of the default.**
Author `.azuredevops/policies/agency-preferences.yml` at the project root of `WindowsProtocolTestSuites` (main branch — this file must live in the repo Agency operates on):
```yaml
configuration:
  agencyPreferences:
    pipelineConfig:
      organization: microsoft
      projectId: b67fd756-1c65-48ef-9824-eeb3cb9b2728
      pipelineId: 195772
      pipelineTrialMode: true   # only work items tagged agency:pipelineTrialMode=true route here
```
Keep `pipelineTrialMode: true` and tag trial work items accordingly until validated; flip to `false` for full rollout.

**Step 24 — What Agency does once it has compute.**
It works the `ai-work/{workItemId}` branch, and opens a **draft** PR (title prefixed `[WIP]`, placeholder description saying it's still working) while it codes. It **publishes** the PR (draft → active, `[WIP]` removed) only once it believes the work is done. That publish transition is the signal Phase 6 waits on — a still-draft PR is never treated as ready.

**Open item:** the custom clone step in Step 21 doesn't yet check out the correct `ai-work/{workItemId}` branch on its own — the built-in sync it replaced used to do this automatically. The branch name is expected to live in the `Agency_Context` JSON payload, but the exact field isn't documented; get the schema from the Agency team or inspect a real run's logged context before completing that block.

---

## Phase 6 — Monitoring & Validation: closing the loop

**Why:** an AI agent opening a PR isn't "done" — someone has to actually run the tests it claims to have added and hold the line on quality. This phase is the automated version of that someone.

This runs as the **third step** of the same Agency Code Generation pipeline (189142) — `scripts/monitor-copilot-tasks.ps1` — scoped to the same run's work-items file (Phase 4, Step 17), and only if that step found items.

**Step 25 — Resolve which items are still genuinely in-flight.**
Re-fetches current state (not the stale snapshot from the query step) and keeps only items that are `State = Started`, assigned to Agency/GitHub Copilot, and **not** already tagged `AgentCompleted`.

**Step 26 — Resolve the correct PR, not a stale one.**
Computes an "agent-assignment baseline" — the UTC time the item was *most recently* assigned to Agency — by paging through the full work-item update history (not just the first page, which silently misses recent assignments on long-lived items). Any PR link/comment from before that baseline is ignored, so a PR from a prior, abandoned attempt is never mistaken for the current one. If the item has been assigned >24h with no PR comment yet, it checks whether the Agency Custom Compute pipeline (195772) is still actively running for that PR — via the queue-time `Agency_Context` parameter on in-flight builds — and waits for it rather than giving up early.

**Step 27 — Wait for the PR to actually be ready.**
A PR still in draft (or titled `[WIP]`) is not validated — the monitor polls until `isDraft` flips to `false`, which is Agency's authoritative "ready for testing" signal (Step 24).

**Step 28 — Get the list of tests to run.**
Looks for `ADDED TESTS: {names}` (or `ADDED TESTS: NONE`) in the PR description. If missing, it posts a comment mentioning the agent with the **literal text token** `@<Agency>` — not an ADO identity-mention link, which the bot silently ignores — asking it to reply with that line and update the PR description, then polls both signals for up to 20 minutes.
If the PR declares `ADDED TESTS: NONE`, the monitor does **not** attempt validation and escalates for manual review instead — it never auto-completes work with nothing to test.

**Step 29 — Trigger targeted validation.**
Runs the validation pipeline (`PipelineForTestID` = 190320, `FileServer_Standard_Integration_DotNetCoreTME_Azure_Regression`) on the PR's branch, scoped to just the named tests, and polls up to 90 minutes for completion (retrying the trigger itself if the branch ref isn't resolvable yet, common right after PR creation).

**Step 30 — Read real results, trust nothing else.**
Pulls actual test results from the Test Results REST API. If results are unreadable, or the named tests never actually appeared in the run (a name-matching guard against typos in the `ADDED TESTS` line), the monitor refuses to mark anything complete and escalates instead — it never infers success from pipeline status alone.

**Step 31 — All targeted tests pass → done.**
Tags the work item `AgentCompleted`.

**Step 32 — Any test fails → remediation loop.**
Posts **one** consolidated PR comment (agent mentioned once via `@<Agency>`, every failing test's name + error message + stack trace), then:
1. Waits for an acknowledgement comment from the agent (up to 30 min).
2. Waits for a follow-up "fix" comment.
3. Waits for the PR's source commit to actually advance (so it re-tests the fix, not stale code).
4. Re-runs all targeted tests.

If the exact same set of tests is still failing after a fix attempt (no progress at all), or nothing acknowledges/responds/lands within timeouts, or this loop runs 10 rounds without converging, it **escalates**: posts a comment mentioning the team group (`@<team-guid>`, a real notifying mention — falls back to plain text if no group GUID is configured) and stops.

---

## Phase 7 — What happens at the end

**Step 33 — Human review and merge.**
This chain does **not** auto-complete or merge pull requests. Once a work item is tagged `AgentCompleted`, the PR is validated and ready — but final code review and merge remain a manual step by the WPTS team. Everything above exists to make that final review cheap: by the time a human looks at it, the diff is against a real spec change, it's linked to a tracked work item, and its claimed tests have already been proven to pass.

---

## Appendix A — Shared infrastructure reference

| Resource | Type | ID | Used in |
|---|---|---|---|
| `SpecGen-GenDox-MI` | Azure RM service connection (WIF) | `1f7e45a8-43fa-41de-afa9-65339fc63952` | Phase 1 (Steps 3–4), consumed in Phase 2 |
| `AgencyWPTS` | Azure RM service connection | `6ed02e51-da3d-4f62-8ccd-e38adb8d045a` | Phase 4 |
| `CodeGenerationStateGroup` | Variable group (id 6615) | — | Phase 3 (Steps 13) |
| `CodeGenerationGroup` | Variable group (id 6386) | — | Phase 4 (Step 16) |

> **Cleanup candidate:** as of 2026-08-19 `CodeGenerationGroup` still carries leftover `gendoxState_*` values from before `CodeGenerationStateGroup` was split out as its dedicated home. The pipeline only reads/writes the latter now — worth confirming the old values are safe to remove with whoever did the split (Lucien Makutano).

## Appendix B — Pipeline definitions at a glance

| ID | Name | Trigger | Pool | Repo |
|---|---|---|---|---|
| 188962 | Specification Generation | Cron, weekdays 8am PST | windows-latest (hosted) | `SpecificationGenerationv2` |
| 189142 | Agency Code Generation | Cron, daily 8am PST | `TestSuiteBuildESPoolTME-CentralUS` | `Code Generation WPTS` |
| 195772 | Agency Custom Compute | None — invoked by Agency | Agency-managed pool | `WindowsProtocolTestSuites` (branch `ai-work/agency-custom-compute`) |

## Appendix C — Quick CLI reference

```bash
az devops configure --defaults organization=https://dev.azure.com/microsoft project=WindowsProtocolTestSuites

az pipelines list --folder-path "\WindowsProtocolTestSuites\Code Generation" -o table
az pipelines show --id 195772 -o json
az pipelines variable-group list --group-name CodeGenerationGroup -o json
az devops service-endpoint list -o table

export PYTHONIOENCODING=utf-8
az rest --method get \
  --url "https://dev.azure.com/microsoft/WindowsProtocolTestSuites/_apis/git/repositories/<repoId>/items?path=<path>&api-version=7.1&includeContent=true" \
  --resource 499b84ac-1321-427f-aa17-267ca6975798 \
  --output-file out.json

az pipelines run --id 188962 --parameters protocolCode=MS-SMB2
```
