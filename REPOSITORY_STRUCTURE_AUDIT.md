# Repository Structure Audit

**Date:** June 19, 2026  
**Baseline:** Architecture V2 (10 concepts, no V1)  
**Scope:** docs/, examples/, images/ directories

---

## Executive Summary

**Status:** Structure needs cleanup
- ❌ 2 empty directories (V1 remnants)
- ❌ 1 stale directory (posters with V1 terminology)
- ⚠️ 1 stale directory (images with V1 terminology)
- ✅ 1 good example project (keep and expand)
- ⚠️ 2 empty root-level directories (unused)

**Total Recommendations:** Delete 2, Reorganize 2, Populate 1, Keep 1, Delete 2

---

## Detailed Directory Audit

### docs/ Directory Structure

#### `docs/README.md`

**Path:** docs/README.md  
**Current:** Minimal file listing architecture docs  
**Status:** Keep but expand  
**Rationale:** Good starting point for docs navigation  
**Recommended Action:**
- Expand to include full docs map
- Add links to all major documentation
- Include examples index
- Add getting started guide

---

#### `docs/architecture/`

**Path:** docs/architecture/  
**Contents:**
- ARCHITECTURE_V2.md (authoritative spec)
- 9 ADR files
- diagrams/ subdirectory

**Status:** Keep  
**Rationale:** Core architectural documentation, complete and well-organized  
**Recommended Action:** None (excellent)

---

#### `docs/architecture/adr/`

**Path:** docs/architecture/adr/  
**Contents:** 9 Architecture Decision Records (complete)  
**Status:** Keep  
**Rationale:** All major decisions documented with context and rationale  
**Recommended Action:** None (excellent)

---

#### `docs/architecture/diagrams/`

**Path:** docs/architecture/diagrams/  
**Contents:**
- 4 diagram files
- README.md

**Status:** Keep but enhance  
**Rationale:** Supports architecture spec with visual aids  
**Recommended Action:**
- Add diagrams:
  - Tool provider routing diagram
  - Project lifecycle diagram
  - Artifact versioning flow
  - Channel message flow
  - Schedule execution flow

---

#### `docs/examples/`

**Path:** docs/examples/  
**Contents:** decision-project/ subdirectory  
**Status:** Populate  
**Rationale:** Examples are critical for contributors and users  
**Recommended Action:**
- Keep decision-project/ (well-structured)
- Add 2-3 more example projects:
  - analysis-project (report generation)
  - planning-project (structured planning)
  - review-project (decision approval)
- Create examples/README.md with:
  - Guide to each example
  - Which concepts each demonstrates
  - How to run each example

---

#### `docs/examples/decision-project/`

**Path:** docs/examples/decision-project/  
**Contents:**
- project.yaml (root definition)
- agents/decision-analyzer/ (complete agent)
  - agent.yaml
  - tools/search-tool.yaml
  - skills/option-analysis.yaml
  - sandbox/ (configuration)
- artifacts/ (schema definitions)
- resources/ (context data)

**Status:** Keep and reference  
**Rationale:** Good, working example of Architecture V2 project  
**Recommended Action:**
- Keep as-is (well-structured)
- Add to examples/README.md as primary example
- Consider adding README within project explaining structure
- Add example runs/ and threads/ showing runtime state

---

#### `docs/images/`

**Path:** docs/images/  
**Status:** Reorganize and clean  
**Rationale:** Contains stale V1 terminology and unused originals  
**Recommended Action:**
- Keep diagrams/ subdirectory
- Delete originals/ subdirectory
- Ensure all images use V2 terminology

---

#### `docs/images/diagrams/`

**Path:** docs/images/diagrams/  
**Contents:** 1 diagram file  
**Status:** Keep  
**Rationale:** Visual aids for documentation  
**Recommended Action:**
- Add V2-aligned diagrams:
  - Project/Agent/Tool/Run relationships
  - Tool provider routing
  - Artifact versioning
  - Package loading flow

---

#### `docs/images/originals/`

**Path:** docs/images/originals/  
**Contents:** 4 original/source files  
**Status:** Delete  
**Rationale:** No longer referenced, V1 terminology, source files belong in tooling not repo  
**Recommended Action:** Delete entire directory

---

#### `docs/posters/`

**Path:** docs/posters/  
**Contents:**
- 8 files (README, txt, svg, diagrams)
- Heavy V1 terminology (Workspace, Playbook, Definition/Instance)

**Status:** Delete or repurpose  
**Rationale:** 
- Contains V1 terminology (Workspace, Playbook, WorkspaceDefinition)
- Not referenced in current architecture
- Outdated and confusing
- Posters are marketing material, better handled separately

**Recommended Action:**
- **Option A (Recommended):** Delete entire directory
  - Rationale: These are outdated V1 materials. Any future posters should be built from scratch in marketing/design.
  - Cost: ~8 files
  - Benefit: Cleaner repo, eliminates V1 confusion

- **Option B (Alternative):** Repurpose
  - Rationale: Keep structure, update for V2
  - Cost: ~4 hours remaking graphics
  - Benefit: Preserve any useful concepts
  
**Recommendation:** Delete (Option A)

**Files to Delete:**
```
docs/posters/README.md
docs/posters/platform-layers.svg
docs/posters/platform-layers.txt
docs/posters/interpreter-pipeline.txt
docs/posters/definition-vs-runtime.svg
docs/posters/metamodel.txt
docs/posters/vertical-validation.svg
docs/posters/vertical-validation.txt
```

---

#### `docs/specification/`

**Path:** docs/specification/  
**Current State:** Empty directory (from V1 cleanup)  
**Status:** Delete  
**Rationale:** 
- Empty after deletion of docs/specification/v1/
- Contents have been replaced by ARCHITECTURE_V2.md and ADRs
- No purpose in current structure

**Recommended Action:** Delete

---

#### `docs/verticals/`

**Path:** docs/verticals/  
**Current State:** Empty directory (from V1 cleanup)  
**Status:** Delete  
**Rationale:**
- Empty after deletion of V1 vertical examples (decision, finance, HR, partner)
- Examples now in docs/examples/ with Architecture V2 structure
- No purpose in current structure

**Recommended Action:** Delete

---

### examples/ Directory

**Path:** examples/ (root level)  
**Current State:** Empty directory  
**Status:** Delete  
**Rationale:**
- No files present
- Examples have been moved to docs/examples/
- Creating confusion about where examples should go

**Recommended Action:** Delete (consolidate to docs/examples/)

---

### images/ Directory

**Path:** images/ (root level)  
**Current State:** Empty directory  
**Status:** Delete  
**Rationale:**
- No files present
- Images should be in docs/images/ with documentation
- No purpose as root-level directory

**Recommended Action:** Delete (consolidate to docs/images/)

---

## V1 Terminology Found

### Critical (Must Fix)

These files contain V1 terminology and should be deleted or updated:

1. **docs/posters/platform-layers.svg**
   - "Workspace Definition Packages"
   - "Workspace Interpreter"
   - "Workspace Runtime"
   - **Action:** Delete

2. **docs/posters/platform-layers.txt**
   - Same as above
   - **Action:** Delete

3. **docs/posters/vertical-validation.svg**
   - "Decision Workspace"
   - "Finance Workspace"
   - "HR Workspace"
   - "Partner Workspace"
   - **Action:** Delete

4. **docs/posters/vertical-validation.txt**
   - Same as above
   - **Action:** Delete

5. **docs/posters/README.md**
   - References "Workspace Definition Language"
   - References "Workspace Shell"
   - **Action:** Delete

6. **docs/posters/definition-vs-runtime.svg**
   - "WorkspaceDefinition → WorkspaceInstance"
   - "PlaybookDefinition → PlaybookInstance"
   - **Action:** Delete

7. **docs/posters/interpreter-pipeline.txt**
   - Likely contains V1 concepts
   - **Action:** Delete

8. **docs/posters/metamodel.txt**
   - "WorkspaceDefinition → WorkspaceInstance"
   - **Action:** Delete

### Recommendation

Delete entire docs/posters/ directory (8 files). These are V1 artifacts that would confuse users discovering the project.

---

## Missing Documentation

### Identified Gaps

1. **Tool Implementation Guides** (CRITICAL)
   - How to implement HTTP-backed tools
   - How to implement MCP-backed tools
   - How to implement connector-backed tools
   - How to implement function-backed tools
   - How to implement platform service tools

2. **Skill Composition Guide** (IMPORTANT)
   - How to compose skills from tools
   - Transitive dependency resolution
   - Skill versioning and reuse

3. **Artifact Schema Guide** (IMPORTANT)
   - How to define artifact types
   - Artifact versioning semantics
   - Publishing and sharing workflows

4. **Project Template Library** (IMPORTANT)
   - Decision-making template (start with decision-project)
   - Analysis template
   - Planning template
   - Review template

5. **CLI Quick Reference** (NEEDED)
   - Available commands
   - Common workflows
   - Examples for each command

6. **Channel Integration Cookbook** (NEEDED)
   - How to integrate with Slack
   - How to integrate with email
   - How to integrate with webhooks
   - How to implement custom channels

7. **Troubleshooting Guide** (NEEDED)
   - Common errors and solutions
   - Debugging tips
   - Performance considerations

---

## Recommended docs/ Tree Structure

```
docs/
  ├── README.md                          # Docs index and navigation
  ├── architecture/
  │   ├── ARCHITECTURE_V2.md             # Authoritative spec (keep)
  │   ├── adr/                           # 9 ADRs (keep)
  │   └── diagrams/                      # Architecture diagrams (enhance)
  ├── examples/
  │   ├── README.md                      # NEW: Examples guide
  │   ├── decision-project/              # Example: decision-making
  │   ├── analysis-project/              # NEW: Analysis/reporting
  │   ├── planning-project/              # NEW: Planning/proposal
  │   └── review-project/                # NEW: Review/approval
  ├── guides/                            # NEW: Implementation guides
  │   ├── tools-implementation.md         # NEW: Tool provider guide
  │   ├── skills-composition.md           # NEW: Skill guide
  │   ├── artifacts-schema.md             # NEW: Artifact guide
  │   ├── channels-integration.md         # NEW: Channel integration
  │   ├── cli-reference.md                # NEW: CLI guide
  │   └── troubleshooting.md              # NEW: Debugging guide
  ├── templates/                         # NEW: Project templates
  │   ├── decision-template/
  │   ├── analysis-template/
  │   ├── planning-template/
  │   └── review-template/
  └── images/
      └── diagrams/                      # Architecture diagrams (keep/enhance)
```

---

## Action Plan

### Phase 1: Cleanup (Immediate, ~30 minutes)

**Delete:**
- [ ] docs/posters/ (8 files) - V1 terminology, unused
- [ ] docs/specification/ - Empty (V1 cleanup artifact)
- [ ] docs/verticals/ - Empty (V1 cleanup artifact)
- [ ] examples/ (root) - Empty, consolidate to docs/examples/
- [ ] images/ (root) - Empty, consolidate to docs/images/
- [ ] docs/images/originals/ - Unused source files

**Commands:**
```bash
rm -rf docs/posters/
rm -rf docs/specification/
rm -rf docs/verticals/
rm -rf examples/
rm -rf images/
rm -rf docs/images/originals/
```

**Verify:** No remaining directories should be empty after cleanup

### Phase 2: Enhancement (1-2 weeks)

**Create:**
- [ ] docs/examples/README.md - Guide to examples
- [ ] docs/examples/analysis-project/ - Example project
- [ ] docs/examples/planning-project/ - Example project
- [ ] docs/examples/review-project/ - Example project
- [ ] docs/guides/ directory with 6 implementation guides
- [ ] docs/templates/ directory with 4 project templates
- [ ] Enhanced docs/README.md with full navigation

### Phase 3: Enhancement (2-3 weeks)

**Create:**
- [ ] docs/architecture/diagrams/ enhancements (5 new diagrams)
- [ ] Example runs/ directories showing runtime state
- [ ] Example threads/ directories showing collaboration
- [ ] Project-specific README files within examples

---

## Files/Directories to Delete

### Immediate (Phase 1 Cleanup)

```
docs/posters/                    # 8 files - V1 terminology
  ├── README.md
  ├── platform-layers.svg
  ├── platform-layers.txt
  ├── interpreter-pipeline.txt
  ├── definition-vs-runtime.svg
  ├── metamodel.txt
  ├── vertical-validation.svg
  └── vertical-validation.txt

docs/specification/              # Empty directory - V1 cleanup artifact

docs/verticals/                  # Empty directory - V1 cleanup artifact

examples/                        # Root-level empty directory

images/                          # Root-level empty directory

docs/images/originals/           # 4 unused source files
  ├── ...
```

**Total files to delete:** 19  
**Total directories to delete:** 6

---

## Files/Directories to Create

### Phase 2 (1-2 weeks)

**New directories:**
```
docs/guides/
docs/templates/
docs/examples/ subdirectories
```

**New documentation files (6):**
- docs/guides/tools-implementation.md (~500 lines)
- docs/guides/skills-composition.md (~300 lines)
- docs/guides/artifacts-schema.md (~400 lines)
- docs/guides/channels-integration.md (~400 lines)
- docs/guides/cli-reference.md (~300 lines)
- docs/guides/troubleshooting.md (~300 lines)

**New example projects (3):**
- docs/examples/analysis-project/ (complete structure)
- docs/examples/planning-project/ (complete structure)
- docs/examples/review-project/ (complete structure)

**New guide files:**
- docs/examples/README.md - Examples guide
- docs/README.md - Enhanced docs index

### Phase 3 (2-3 weeks)

**Enhanced diagrams (5):**
- docs/architecture/diagrams/project-agent-tool-run.svg
- docs/architecture/diagrams/tool-provider-routing.svg
- docs/architecture/diagrams/artifact-versioning-flow.svg
- docs/architecture/diagrams/channel-message-flow.svg
- docs/architecture/diagrams/schedule-execution-flow.svg

---

## Summary

| Item | Count | Action | Time |
|------|-------|--------|------|
| Empty directories to delete | 2 | Delete | 5 min |
| Stale directories to delete | 2 | Delete | 5 min |
| Files with V1 terminology | 8 | Delete | 5 min |
| Root-level empty dirs | 2 | Delete | 5 min |
| Directories to reorganize | 0 | - | - |
| Example projects to add | 3 | Create | 1 week |
| Implementation guides to add | 6 | Create | 1-2 weeks |
| Documentation files to enhance | 2 | Update | 3 hours |
| Diagrams to add | 5 | Create | 1 week |

**Phase 1 Cleanup:** ~20 minutes  
**Phase 2 Enhancements:** 1-2 weeks  
**Phase 3 Diagrams:** 1+ weeks

---

## Verification Checklist (Post-Cleanup)

- [ ] No empty directories remain (except .git subdirs)
- [ ] No V1 terminology in any file paths
- [ ] No V1 terminology in any documentation
- [ ] All docs/ subdirectories have clear purpose
- [ ] All examples/ use Architecture V2 structure
- [ ] All images are current/relevant
- [ ] docs/examples/README.md links to all examples
- [ ] docs/guides/ contains implementation guides
- [ ] docs/templates/ contains project templates
- [ ] Main docs/README.md serves as navigation hub

---

## Conclusion

**Current State:** Repository has V1 remnants and empty directories  
**Target State:** Clean V2-only structure with comprehensive examples and guides  
**Effort:** ~1 hour cleanup + 2-3 weeks enhancements  
**Priority:** High (cleanup phase 1, enhancements phase 2-3)

The repository will be significantly improved by removing stale content and populating with Architecture V2 examples and guides.
