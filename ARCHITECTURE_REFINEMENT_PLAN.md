# Architecture Refinement Plan

Based on External Architecture Review recommendations, implementing 5 key simplifications.

---

## Decision Summary

### 1. Project Naming ✅ DECIDED
**Decision:** Rename ProjectContext → ProjectState
- ProjectContext is runtime state wrapper, not a conceptually distinct thing
- ProjectState is clearer (mirrors artifact/thread records)
- Project = definition, ProjectState = runtime state

**Scope:** 10+ files
- packages/runtime/src/types.ts (main definition)
- packages/runtime/src/project-runtime.ts
- packages/runtime/src/repository.ts  
- packages/runtime/__tests__/project-runtime.test.ts
- packages/runtime/examples/project-execution.ts
- packages/loader/examples/load-project.ts
- Documentation (ARCHITECTURE_V2.md)

### 2. Eval ✅ DECIDED
**Decision:** Remove Eval from core ontology
- Not implemented in packages/types
- No reference from other concepts
- Feels future-looking only
- Cost: Zero (no implementation to change)
- Benefit: Cleaner core model (11 concepts)

**Scope:** Documentation only
- ARCHITECTURE_V2.md (remove from core 12)
- ADR-008 (update rationale)
- All examples and diagrams

### 3. Sandbox ✅ DECIDED
**Decision:** Move Sandbox from core ontology to agent configuration
- Remove from PackageMetadata.kind
- Keep as optional agent constraint field
- Keep as package kind (discovery/versioning) but not core concept
- Document as configuration pattern

**Rationale:**
- Sandbox is non-functional (doesn't affect logic)
- Different from Artifact/Run/Thread (no business value)
- More like containerization config than ontology
- Industry leaders don't make this first-class

**Scope:** 
- packages/types/src/definitions.ts (update PackageMetadata)
- packages/runtime/src/types.ts (move to Agent constraints)
- ARCHITECTURE_V2.md (remove from core 12)
- ADR-007 (update rationale)
- Examples

### 4. Agent.role ✅ DECIDED
**Decision:** Keep Agent.role field
- Provides semantic clarity (Agent has name, role, instructions)
- Runtime can use for display/routing
- Low cost to keep (one optional field)
- Better than requiring extraction from instructions

**Rationale:**
- Name is display identifier
- Role is semantic category (strategic-analyst, reporter, etc.)
- Instructions are detailed behavior
- All three provide value

**Scope:** No changes (keep as-is)

### 5. Schedule Scope ✅ DECIDED
**Decision:** Schedules are project-level only
- Agent schedules are agent-local references
- But actual schedule definitions live at project level
- Remove `/agents/<agent>/schedules/` directory pattern
- Clarify in AGENT_PACKAGE_MODEL.md

**Rationale:**
- Schedules trigger execution in project context
- Multiple agents might share same schedule
- Reduces duplication
- Cleaner mental model

**Scope:**
- ARCHITECTURE_V2.md (clarify structure)
- AGENT_PACKAGE_MODEL.md (update examples)
- Filesystem structure documentation

---

## Changes Required

### Type Changes (packages/types/src/definitions.ts)
1. Remove 'eval' from PackageMetadata.kind union
2. Remove 'sandbox' from PackageMetadata.kind union
3. Remove Sandbox interface entirely
4. Keep Agent.role (no change)

### Runtime Changes (packages/runtime/src/types.ts)
1. Rename ProjectContext → ProjectState (everywhere)
2. Move sandbox from Agent.constraints to inline configuration
3. No Eval changes (never existed)

### Documentation Changes
1. ARCHITECTURE_V2.md:
   - Remove Eval from core 12 vocabulary table
   - Remove Sandbox from core 12 vocabulary table
   - Update core vocabulary to 10 concepts
   - Update diagrams
   - Update examples

2. ADR-008 (Minimal Ontology):
   - Change "12 concepts" to "10 concepts"
   - Remove Eval row from rationale table
   - Remove Sandbox row from rationale table
   - Update status to reflect decision

3. ADR-007 (Channels and Schedules):
   - Clarify schedule scope (project-level)
   - Document schedule as trigger mechanism
   - Remove ambiguity about agent-level schedules

4. Update ADR-004, ADR-005, others as needed

### Examples Changes
1. Remove Eval examples (don't exist)
2. Update Sandbox references to agent constraints
3. Update schedule examples (project-level)

### Schema Changes
1. Update packages/schemas/project.schema.json
2. Update packages/schemas/agent.schema.json
3. Remove packages/schemas/eval.schema.json (if exists)
4. Remove packages/schemas/sandbox.schema.json (if exists)

### Tests
1. Update packages/runtime/__tests__/project-runtime.test.ts
2. Update ProjectState references throughout

---

## Core Vocabulary (After Changes)

From 12 concepts to 10:

| # | Concept | Purpose |
|---|---------|---------|
| 1 | **Project** | Organizing container |
| 2 | **Agent** | Autonomous actor |
| 3 | **Tool** | Capability interface |
| 4 | **Skill** | Reusable know-how |
| 5 | **Channel** | Communication interface |
| 6 | **Schedule** | Automation trigger |
| 7 | **Resource** | Shared context |
| 8 | **Artifact** | Versioned outcome |
| 9 | **Thread** | Collaboration context |
| 10 | **Run** | Execution record |

**Removed:**
- ~~Eval~~ (future concern, not needed for v1)
- ~~Sandbox~~ (agent configuration, not ontology)

**Kept as Optional:**
- Eval: Can be packaged and discovered (extensibility)
- Sandbox: Part of agent.constraints field

---

## Implementation Order

1. ✅ Type definitions (packages/types/src/definitions.ts)
2. ✅ Runtime types (packages/runtime/src/types.ts)
3. ✅ Runtime implementation (packages/runtime/src/*.ts)
4. ✅ Tests (packages/runtime/__tests__/*.ts)
5. ✅ Examples (packages/*/examples/*.ts)
6. ✅ Schemas (packages/schemas/*.json)
7. ✅ ARCHITECTURE_V2.md
8. ✅ ADRs (008, 007, others as needed)
9. ✅ README updates
10. ✅ Generate refinement report

---

## Estimated Effort

- Type changes: 1 hour
- Runtime changes: 2 hours
- Documentation: 3 hours
- Examples: 1 hour
- Schemas: 1 hour
- **Total: 8 hours**

---

## Risks & Mitigations

**Risk:** Breaking change to type system
- Mitigation: This is okay - V2 is frozen, changes are intentional

**Risk:** Missing ProjectState → ProjectContext renames
- Mitigation: Grep for all occurrences before committing

**Risk:** Schema files don't exist yet
- Mitigation: Check first, create only if needed

**Status:** Ready to implement
