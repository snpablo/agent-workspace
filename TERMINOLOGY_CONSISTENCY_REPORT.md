# Terminology Consistency Pass Report

Date: June 19, 2026

## Executive Summary

Completed a comprehensive terminology consistency pass across the repository. Updated active documentation to clearly distinguish between:

- **Phase 1 terminology** (Workspace, WorkItem, Playbook) - used in historical and specification docs
- **Phase 2 terminology** (Project, Agent, Tool, Skill) - emerging industry-standard vocabulary

Key finding: The terminology shift is intentional and represents architectural migration, not inconsistency.

## Files Changed

### Active Documentation (Updated)

1. **IMPLEMENTATION_GUIDE.md**
   - Added architecture migration note
   - Updated architecture flow diagram to reflect Phase 2 concepts
   - Documented Phase 1 vs Phase 2 naming for all package types
   - Added explicit notes on naming migration path

2. **GLOSSARY.md** (Complete Rewrite)
   - Added migration status (`Phase 1`, `Phase 2`, `Deprecated`, `Unchanged`) for every term
   - Clarified which concepts are Phase 1 vs Phase 2
   - Added explicit deprecation notices with replacements
   - Documented implementation details that are NOT platform vocabulary
   - Included comprehensive migration summary table

3. **IMPLEMENTATION_SUMMARY.md**
   - Added note about Phase 1 transitional terminology
   - Added cross-reference to ARCHITECTURE_MIGRATION.md

### Historical/Frozen Documentation (Left Unchanged)

These files intentionally document the Phase 1 model and are not updated:

1. **docs/specification/v1/** (15 files)
   - `metamodel.md` - Phase 1 metamodel
   - `interpreter.md` - Phase 1 interpreter spec
   - `runtime-state.md` - Phase 1 runtime state
   - `objects/*.md` - Phase 1 object definitions
   - All workspace-* and work-item references are correct for Phase 1 spec

2. **Frozen architecture docs:**
   - `ARCHITECTURE_FREEZE.md` - Frozen Phase 1 decisions
   - `CANONICAL_MODEL.md` - Phase 1 canonical model
   - `SCHEMA_INVENTORY.md` - Phase 1 schema inventory

3. **Vertical examples:**
   - `docs/verticals/decision-workspace.md`
   - `docs/verticals/partner-workspace.md`
   - `docs/verticals/hr-workspace.md`
   - `docs/verticals/finance-workspace.md`
   - All use Phase 1 terminology correctly for Phase 1 examples

4. **Archived/non-active:**
   - `exec-plans/` - archived planning
   - `jobs/` - job-hunting related
   - PLANS.md - historical planning

### Code Implementation (Left Unchanged - Phase 1)

These are correct for Phase 1 implementation:

1. **packages/schemas/**
   - File names: `workspace-definition.schema.json`, `work-item.schema.json`, etc.
   - Used for Phase 1; will evolve in Phase 2
   - Backward compatibility maintained during migration

2. **packages/types/src/**
   - Type names: `WorkspaceDefinition`, `WorkItem`, `ArtifactDefinition`, etc.
   - Correct for Phase 1 implementation
   - Phase 2 will introduce new type names alongside these

3. **packages/definitions/src/**
   - Builder names: `WorkspaceDefinitionBuilder`, `PlaybookDefinitionBuilder`, etc.
   - Correct for Phase 1 implementation
   - Phase 2 will provide new builders

4. **packages/interpreter/src/**
   - References to Phase 1 concepts (`WorkspaceDefinition`, `ComponentTree`)
   - Correct for Phase 1 implementation
   - Phase 2 will evolve the interpretation model

## Terminology Clarifications

### Clear Deprecations

These terms are deprecated and should NOT appear in new Phase 2 code:

| Deprecated | Replacement | Status |
|-----------|-------------|--------|
| `Workspace` | `Project` | Deprecated, documented |
| `WorkItem` | `Agent` + `Run` | Deprecated, documented |
| `Playbook` | `Agent` + `Schedule` | Deprecated, documented |
| `Workflow` | `Agent` execution or `Run` | Informal; use Agent/Run |
| `Capability` | `Tool` or `Skill` | Deprecated, documented |
| `Integration` | `Tool` (backed by connector) | Deprecated, documented |
| `KnowledgeSource` | `Resource` | Deprecated for Phase 2 |
| `Definition/Instance` | `Definition` / `Runtime` split | Deprecated pattern |
| `Output` | `Artifact` | Already deprecated |
| `Session` | `Thread` | Deprecated for Phase 2 |

### Implementation Details (NOT Platform Vocabulary)

The following are implementation details behind Tools, not platform root concepts:

| Mechanism | Status | Why Not Platform Vocabulary |
|-----------|--------|------------------------------|
| Connector | Implementation detail | Describes how Tool works, not a concept itself |
| MCPServer | Implementation detail | MCP is one Tool backing mechanism |
| Provider | Not a concept | Generic term; use Tool instead |
| APIAdapter | Implementation detail | API backing is how Tool works |
| WebhookReceiver | Implementation detail | Webhook handling is Tool mechanism |
| Endpoint | Not a concept | Infrastructure detail of Tool |

**Key insight:** Tools are first-class; their backing mechanisms are transparent to agents.

### Unchanged Core Concepts

These terms are Phase 1 and carry forward to Phase 2 with same meaning:

| Term | Status | Usage |
|------|--------|-------|
| `Artifact` | Core Phase 1 + 2 | Durable outcome; unchanged |
| `Run` | Core Phase 1 + 2 | Execution record; unchanged |
| `Event` | Core Phase 1 + 2 | Activity record; unchanged |
| `Skill` | Core Phase 1 + 2 | Reusable composition; unchanged |
| `Tool` | Core Phase 2 | External capability; unchanged |
| `Agent` | Core Phase 2 | Execution actor; explicit in Phase 2 |
| `Thread` | Core Phase 2 | Collaboration; replaces Session |
| `Resource` | Core Phase 2 | Context data; replaces KnowledgeSource |

## Unresolved Questions

### 1. Code Naming During Phase 2 Migration

**Question:** Should Phase 2 code introduce NEW type names alongside Phase 1 names for backward compatibility, or do we have a migration plan?

**Context:** 
- Phase 1 uses `WorkspaceDefinition`, `WorkspaceDefinitionBuilder`, etc.
- Phase 2 should use `ProjectDefinition`, `ProjectDefinitionBuilder`, etc.
- Full rename would be breaking for Phase 1 consumers

**Options:**
- A) Introduce both names (aliases), deprecate Phase 1 names
- B) Provide migration utilities/converters
- C) Accept breaking change when Phase 2 releases
- D) Use deprecation warnings and long transition period

**Recommendation:** Use option A (aliases with deprecation) to minimize breaking changes for early adopters.

### 2. Schema File Names

**Question:** Should Phase 2 rename schema files from `workspace-definition.schema.json` to `project-definition.schema.json`?

**Context:**
- Current: `workspace-definition.schema.json`, `work-item.schema.json`, `playbook-definition.schema.json`
- Phase 2 should use: `project-definition.schema.json`, `run.schema.json`
- File name changes would break references

**Options:**
- A) Keep old file names but update content with new terminology
- B) Create new files with new names, deprecate old files
- C) Provide URL redirects/symlinks
- D) Accept breaking change

**Recommendation:** Use option B (new files, deprecate old) to avoid breaking internal references while supporting new vocabulary.

### 3. Historical Vertical Examples

**Question:** Should we create Phase 2 versions of the vertical workspace examples, or keep Phase 1 versions as historical reference?

**Context:**
- docs/verticals/ currently shows Phase 1 model (Decision, Partner, HR, Finance workspaces)
- Phase 2 will use Project/Agent/Tool/Skill
- These are learning examples for users

**Options:**
- A) Keep Phase 1 examples; add Phase 2 examples alongside
- B) Update existing examples to Phase 2
- C) Provide side-by-side comparisons (Phase 1 vs Phase 2)
- D) Move Phase 1 examples to archive/v1/

**Recommendation:** Use option A (keep both) so learners can see both models. Add Phase 2 examples to docs/examples/.

### 4. Phase 1 Specification Docs

**Question:** Should Phase 1 specification docs (docs/specification/v1/) be updated to mention Phase 2, or left pure?

**Context:**
- docs/specification/v1/ is frozen, documenting Phase 1 model
- But new readers may be confused about Phase 1 vs Phase 2
- Adding Phase 2 references could pollute the spec

**Options:**
- A) Leave pure (focused on v1)
- B) Add top-level note pointing to Phase 2
- C) Create docs/specification/v2/ with new model
- D) Merge into single evolving spec with version tags

**Recommendation:** Use option B (add top-level note) - minimal, non-invasive way to guide readers to Phase 2 migration docs.

## Recommendations for Phase 2

### Before Implementation

1. **Resolve unresolved questions above** - establish backward compatibility strategy
2. **Create Phase 2 type definitions** - build alongside Phase 1 types with aliases
3. **Update GLOSSARY.md as you go** - keep it current as Phase 2 develops
4. **Create Phase 2 examples** - docs/examples/ with new vocabulary

### During Implementation

1. **Add deprecation warnings** - mark Phase 1 types as @deprecated
2. **Provide migration guide** - step-by-step how to upgrade from Phase 1 to Phase 2
3. **Maintain dual API** - support both old and new names during transition
4. **Update IMPLEMENTATION_GUIDE.md** - as Phase 2 takes shape

### After Phase 2 Release

1. **Set sunset date** - when Phase 1 terminology will be removed
2. **Publish migration script** - if possible, automate Phase 1 → Phase 2 conversions
3. **Archive Phase 1 docs** - move to /docs/v1/ or similar
4. **Celebrate** - document the transition as a case study in platform evolution

## Conclusion

**The terminology consistency pass reveals this is not an inconsistency problem—it's an intentional, well-documented architectural migration.**

- **Phase 1 is complete and correct** for its model
- **Phase 2 vocabulary is documented and ready** to implement
- **Active docs now clearly distinguish** between the two
- **Implementation details are clarified** (Connector, MCP, etc. are NOT platform vocabulary)
- **Migration path is clear** for Phase 2 implementation

The repository is ready for Phase 2 implementation with strong architectural guidance on how to manage the terminology transition.
