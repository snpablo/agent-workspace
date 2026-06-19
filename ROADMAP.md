# Roadmap

Implementation progress toward a metadata-driven collaborative AI workspace platform.

## Phase 1: Core Packages ✅ COMPLETE

Successfully implemented the four foundational packages forming the "Definition → Interpreter → ComponentTree" architectural center:

- ✅ `packages/schemas` - 20 canonical JSON schemas
- ✅ `packages/types` - 50+ TypeScript type interfaces  
- ✅ `packages/definitions` - Fluent builders and validators with examples
- ✅ `packages/interpreter` - Complete transformation pipeline with normalization

**Status:** Phase 1 is architecture-validated. The frozen model holds under implementation.

See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for completion details.

## Phase 2: Runtime State (Next)

The next phase builds on the validated foundation to implement runtime state management:

- `@awp/runtime` - Workspace state management and lifecycle
- State persistence and serialization
- Event model and event sourcing
- Audit trails and versioning

## Phase 2: Runtime State

Build workspace state management for runtime execution:

### `packages/runtime`

- Implement `WorkspaceState` and sub-state models
- State persistence and serialization  
- Event model and event sourcing
- Audit trails and versioning
- Participant and session lifecycle

**Dependencies:** Phase 1 packages

**Success Criteria:**
- Complete state model implementation
- Persistence layer integration  
- Event sourcing and audit trails working
- Tested with Phase 1 definitions

## Phase 3: Workspace Shell

Implement reference shell using Phase 1 and Phase 2:

### `packages/shell`

- Zone and component rendering
- State binding and reactivity
- User interaction handling
- Responsive layout management
- Modal and overlay support

**Dependencies:** Phase 1, Phase 2 packages

**Success Criteria:**
- All 9 canonical zones rendering
- State binding working end-to-end
- Example workspace fully interactive

## Phase 4: Vertical Applications

Build verticals using only definitions (no platform code changes):

- Decision Workspace
- Partner Workspace
- HR Workspace  
- Finance Workspace

**Dependencies:** Phase 1, 2, 3 packages

**Constraint:** All verticals must work with shared platform (no vertical forks).

**Success Criteria:**
- 4 fully functional vertical workspaces
- Each using only definition packages
- No platform code changes required for new verticals

## Guiding Principles

### One Runtime, Many Workspaces

Decision, Finance, HR, Partner are `WorkspaceDefinitions` rendered by one runtime.

Do not build separate applications for them.

### Metadata-Driven

Prefer fewer, more generic platform abstractions.

Do not introduce new platform root concepts when specialization suffices.

### Discovery Through Implementation

Let implementation pressure drive discoveries. If implementation reveals gaps:

1. Capture minimum necessary decisions
2. Update frozen contracts
3. Continue implementation

### No Speculative Expansion

Do not start phases not listed above.

Do not add features before needed.

Do not pre-design for undefined requirements.
