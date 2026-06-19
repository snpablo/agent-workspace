# Remaining Work Items

**Date:** June 19, 2026  
**Status:** Post Phase 1-2 completion

---

## Summary

**Completed:** Architecture spec, cleanup, documentation review, image specs, 4 example projects  
**Remaining:** Images, complete example packages, Phase 3 cross-linking, architecture posters

**Organized by:** Priority, Category, Effort

---

## CRITICAL PATH

### 1. Project Archetype Images (BLOCKING Phase 3)

**Status:** ⏳ Pending  
**Effort:** 2-3 days (designer)  
**Blocker:** Yes - Phase 3 cannot proceed without images

**Work:**
- [ ] Designer creates/adapts 4 images using ARCHETYPE_IMAGE_SPECIFICATIONS.md
  - [ ] decision-project.png (Decision Project Archetype)
  - [ ] finance-project.png (Finance Project Archetype)
  - [ ] hiring-project.png (Hiring Project Archetype)
  - [ ] partner-project.png (Partner Project Archetype)
- [ ] Images placed in docs/images/projects/
- [ ] Verify images match specifications

**Or (Alternative - Quick Path):**
- [ ] Copy original workspace images as placeholders
- [ ] Rename to project names
- [ ] Schedule designer refresh in future sprint

**Acceptance Criteria:**
- Images show domain dashboards (not tree diagrams)
- Architecture V2 terminology visible in labels
- No V1 concepts visible
- Looks like "Claude Projects + Artifacts + Agent Collaboration + Enterprise Dashboard"

---

### 2. Complete Example Project Packages

**Status:** 🟡 Partially Complete  
**Effort:** 1-2 days  
**Priority:** High

Each of 4 projects needs:

#### 2.1 Agent Definitions (YAML)

**Decision Project:**
- [ ] agents/decision-analyzer.yaml (started)
- [ ] agents/risk-assessor.yaml
- [ ] agents/options-synthesizer.yaml

**Finance Project:**
- [ ] agents/financial-analyst.yaml
- [ ] agents/budget-reviewer.yaml
- [ ] agents/forecaster.yaml

**Hiring Project:**
- [ ] agents/hr-coordinator.yaml
- [ ] agents/policy-reviewer.yaml
- [ ] agents/hiring-assistant.yaml

**Partner Project:**
- [ ] agents/partner-manager.yaml
- [ ] agents/contract-reviewer.yaml
- [ ] agents/relationship-analyst.yaml

**Per Agent Include:**
- kind, id, name, role, model
- instructions (domain-specific prompt)
- tools (list of tool IDs)
- skills (list of skill IDs)
- channels (notification channels)
- metadata

#### 2.2 Resource Definitions (YAML)

**Decision Project (4):**
- [ ] resources/company-strategy.yaml
- [ ] resources/decision-criteria.yaml
- [ ] resources/stakeholder-list.yaml
- [ ] resources/historical-decisions.yaml

**Finance Project (4):**
- [ ] resources/financial-data-sources.yaml
- [ ] resources/budget-structure.yaml
- [ ] resources/historical-financials.yaml
- [ ] resources/financial-policies.yaml

**Hiring Project (4):**
- [ ] resources/company-structure.yaml
- [ ] resources/hiring-policies.yaml
- [ ] resources/compliance-requirements.yaml
- [ ] resources/employee-database.yaml

**Partner Project (4):**
- [ ] resources/partner-database.yaml
- [ ] resources/contract-templates.yaml
- [ ] resources/kpi-definitions.yaml
- [ ] resources/communication-protocols.yaml

**Per Resource Include:**
- kind, id, name, description
- resource_type (data, policy, template, configuration)
- schema (what data it contains)
- metadata

#### 2.3 Artifact Schemas (YAML)

**Decision Project (2):**
- [ ] artifacts/decision-analysis.yaml (started)
- [ ] artifacts/risk-assessment.yaml

**Finance Project (4):**
- [ ] artifacts/monthly-report.yaml
- [ ] artifacts/budget-analysis.yaml
- [ ] artifacts/financial-forecast.yaml
- [ ] artifacts/variance-report.yaml

**Hiring Project (6):**
- [ ] artifacts/hiring-plan.yaml
- [ ] artifacts/job-description.yaml
- [ ] artifacts/candidate-evaluation.yaml
- [ ] artifacts/onboarding-checklist.yaml
- [ ] artifacts/employee-record.yaml
- [ ] artifacts/policy-compliance-report.yaml

**Partner Project (4):**
- [ ] artifacts/partner-agreement.yaml
- [ ] artifacts/contract-analysis.yaml
- [ ] artifacts/relationship-status-report.yaml
- [ ] artifacts/performance-report.yaml

**Per Schema Include:**
- kind: artifact-type
- id, name, description
- schema (JSON schema defining structure)
- versioning policy
- metadata

#### 2.4 Schedule Definitions (YAML)

**Decision Project (3):**
- [ ] schedules/daily-review.yaml
- [ ] schedules/weekly-synthesis.yaml
- [ ] schedules/monthly-review.yaml

**Finance Project (4):**
- [ ] schedules/daily-sync.yaml
- [ ] schedules/monthly-report.yaml
- [ ] schedules/quarterly-review.yaml
- [ ] schedules/annual-forecast.yaml

**Hiring Project (3):**
- [ ] schedules/weekly-hiring-review.yaml
- [ ] schedules/monthly-onboarding.yaml
- [ ] schedules/quarterly-policy-review.yaml

**Partner Project (3):**
- [ ] schedules/monthly-review.yaml
- [ ] schedules/quarterly-review.yaml
- [ ] schedules/annual-strategy.yaml

**Per Schedule Include:**
- kind, id, name, description
- trigger (cron expression)
- action (what runs)
- enabled (true/false)
- metadata

**Total YAML files to create:** ~52 files

---

## PHASE 3: Documentation Cross-Linking

**Status:** ⏳ Ready (blocked on images)  
**Effort:** 2-3 hours  
**Blocker:** No (but blocked by images being available)

### 3.1 Create Example Navigation Hub

- [ ] Create `docs/examples/README.md`
  - [ ] Gallery of 4 archetype images
  - [ ] Description of each domain
  - [ ] Quick reference table (agents, resources, artifacts, schedules)
  - [ ] Links to individual example projects
  - [ ] "How to use these examples" guide
  - [ ] Link to ARCHITECTURE_V2.md

### 3.2 Update ARCHITECTURE_V2.md

- [ ] Add "Project Archetypes" section
- [ ] Display all 4 archetype images
- [ ] Explain how each demonstrates same 10 concepts
- [ ] Link to corresponding example projects in docs/examples/
- [ ] Show that same architecture supports multiple domains

### 3.3 Update Each Example README

**Decision Project:**
- [ ] Add archetype image at top
- [ ] Add link to ARCHITECTURE_V2.md
- [ ] Add navigation links to other 3 examples
- [ ] Verify all 10 concepts referenced

**Finance Project:**
- [ ] Add archetype image at top
- [ ] Add link to ARCHITECTURE_V2.md
- [ ] Add navigation links to other 3 examples
- [ ] Verify all 10 concepts referenced

**Hiring Project:**
- [ ] Add archetype image at top
- [ ] Add link to ARCHITECTURE_V2.md
- [ ] Add navigation links to other 3 examples
- [ ] Verify all 10 concepts referenced

**Partner Project:**
- [ ] Add archetype image at top
- [ ] Add link to ARCHITECTURE_V2.md
- [ ] Add navigation links to other 3 examples
- [ ] Verify all 10 concepts referenced

### 3.4 Create Image Index

- [ ] Create `docs/images/projects/README.md`
  - [ ] Index of all 4 archetype images
  - [ ] Purpose of each image
  - [ ] What each demonstrates
  - [ ] Links to corresponding examples
  - [ ] Links to architecture posters (future)

### 3.5 Verify Navigation Flow

- [ ] Test: ARCHITECTURE_V2.md → Archetype section → Example projects
- [ ] Test: docs/examples/README.md → Individual examples → ARCHITECTURE_V2.md
- [ ] Test: Each example README → Other examples
- [ ] Test: Each example README → ARCHITECTURE_V2.md

---

## ARCHITECTURE POSTERS (Future)

**Status:** 📋 Not Started  
**Effort:** 3-5 days (design)  
**Priority:** Medium (after project archetypes)

**Purpose:** Teach how the platform works (separate from domain exemplars)

**Posters to Create:**

- [ ] Project Runtime Poster
  - Shows project lifecycle, state management, execution model
  
- [ ] Agent Runtime Poster
  - Shows agent activation, tool invocation, skill composition
  
- [ ] Tool Model Poster
  - Shows 5 tool provider types, routing, capabilities
  
- [ ] Artifact Lifecycle Poster
  - Shows versioning, history, metadata, publication
  
- [ ] Package Loading Poster
  - Shows YAML to runtime transformation, registry pattern
  
- [ ] Event Audit Trail Poster
  - Shows logging, event types, audit record structure

**Location:** docs/posters/

**Note:** These are NOT the project archetypes (which are dashboards). These are conceptual architecture diagrams.

---

## DOCUMENTATION ENHANCEMENTS

**Status:** 📋 Partially Complete  
**Effort:** 1-2 days

- [ ] Enhance docs/README.md
  - [ ] Add link to project archetypes
  - [ ] Add link to examples gallery
  - [ ] Add link to architecture posters (future)
  - [ ] Navigation structure
  
- [ ] Verify main README.md references
  - [ ] Check links to docs/architecture/
  - [ ] Check links to docs/examples/
  - [ ] Add project archetype section
  
- [ ] Verify ROADMAP.md alignment
  - [ ] No V1 terminology
  - [ ] References to examples if applicable
  
- [ ] Update AGENTS.md if needed
  - [ ] Add reference to project examples
  - [ ] Add reference to archetype images

---

## QUALITY ASSURANCE

**Status:** 📋 Not Started  
**Effort:** 1 day

### Validation Checklist

- [ ] No V1 terminology in active documentation
  - [ ] No "Workspace"
  - [ ] No "WorkItem"
  - [ ] No "Playbook"
  - [ ] No "Workflow"
  - [ ] No "Definition/Instance" (except as historical references)

- [ ] All 10 Architecture V2 concepts appear in examples
  - [ ] Project ✅
  - [ ] Agent ✅
  - [ ] Tool ✅
  - [ ] Skill ✅
  - [ ] Channel ✅
  - [ ] Schedule ✅
  - [ ] Resource ✅
  - [ ] Artifact ✅
  - [ ] Thread ✅
  - [ ] Run ✅

- [ ] Navigation flow works
  - [ ] Architecture → Examples → Code
  - [ ] Examples → Architecture
  - [ ] Examples ↔ Examples (cross-links)

- [ ] Images display correctly
  - [ ] All 4 archetype images present
  - [ ] Images render in README files
  - [ ] Images are referenced in ARCHITECTURE_V2.md

- [ ] All links are valid
  - [ ] No broken links
  - [ ] Cross-references work
  - [ ] Relative paths correct

---

## CLEANUP & MAINTENANCE

**Status:** 🟢 Mostly Complete  
**Effort:** 30 minutes

- [x] Delete V1 posters (done)
- [x] Delete empty directories (done)
- [x] Clean up terminology (done)
- [ ] Delete IMAGE_REGENERATION_REPORT.md (obsolete - can delete after images created)
- [ ] Delete ARCHETYPE_IMAGE_SPECIFICATIONS.md (once images created - or keep as reference)

---

## QUICK REFERENCE: Priority Matrix

| Category | Priority | Effort | Blocker | Status |
|----------|----------|--------|---------|--------|
| **Archetype Images** | 🔴 Critical | 2-3d | Yes | ⏳ Pending |
| **Example YAML (16 agents)** | 🔴 Critical | 1d | No | 📋 Ready |
| **Example YAML (16 resources)** | 🔴 Critical | 1d | No | 📋 Ready |
| **Example YAML (16 artifacts)** | 🔴 Critical | 1d | No | 📋 Ready |
| **Example YAML (13 schedules)** | 🔴 Critical | 1d | No | 📋 Ready |
| **Phase 3 Cross-linking** | 🟠 High | 2-3h | Images | ⏳ Blocked |
| **Navigation Hub** | 🟠 High | 1h | Images | ⏳ Blocked |
| **Image Index README** | 🟠 High | 30m | Images | ⏳ Blocked |
| **Documentation Updates** | 🟡 Medium | 1d | No | 📋 Ready |
| **Architecture Posters** | 🟡 Medium | 3-5d | No | 📋 Future |
| **QA & Validation** | 🟡 Medium | 1d | No | 📋 Ready |
| **Cleanup** | 🟢 Low | 30m | No | 🟢 Ready |

---

## CRITICAL PATH TIMELINE

```
Immediate (Today):
  ✅ Phases 1-2 complete
  ⏳ Decide: Move images as placeholders OR wait for designer

If moving images as placeholders:
  → 30 min: Copy & rename images
  → 1-2 days: Create 52 example YAML files
  → 2-3 hours: Phase 3 cross-linking
  → 1 day: QA & validation
  Total: 2-3 days (without designer)

If waiting for designer (proper approach):
  → 2-3 days: Designer creates images
  → 1-2 days: Create 52 example YAML files (in parallel)
  → 2-3 hours: Phase 3 cross-linking
  → 1 day: QA & validation
  Total: 2-3 days (with designer in parallel)

Then (Future Sprint):
  → 3-5 days: Create architecture posters
  → 1 day: Final documentation review
```

---

## Files Created So Far

**Phase 1 & 2 Deliverables:**
- ARCHETYPE_IMAGE_SPECIFICATIONS.md (436 lines)
- 4 × README.md (1,520 lines)
- 4 × project.yaml (140 lines)
- DOCUMENTATION_REVIEW_REPORT.md (647 lines)
- REPOSITORY_STRUCTURE_AUDIT.md (546 lines)
- IMAGE_REGENERATION_REPORT.md (421 lines)
- PROJECT_ARCHETYPES_STATUS.md (334 lines)
- REMAINING_WORK_ITEMS.md (this file)

**Total: 4,044 lines of specifications, documentation, and configuration**

---

## Decision Points Needed

1. **Images:** Move placeholders now or wait for designer? (2-3 day impact)
2. **Effort:** Should we create all 52 YAML files or just core structure?
3. **Timeline:** Sprint this work now or schedule for next sprint?
4. **Posters:** Should architecture posters be created before or after examples?

