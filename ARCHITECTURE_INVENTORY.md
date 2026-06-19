# Architecture Inventory: Phase 1 → Phase 2 Migration

This document catalogs every major component and maps it to the new ontology.

**Scope:** Read-only analysis. No code changes in this phase.

---

## 1. Packages Overview

### Current State

```
packages/
├── schemas/           (23 JSON Schema files)
├── types/             (4 TypeScript modules)
├── definitions/       (3 builder classes, 3 examples)
└── interpreter/       (3 core modules)
```

### Total Components Inventoried

- **23 JSON schemas**
- **4 type definition modules**
- **6 builder/validator classes**
- **3 interpreter modules**
- **3 core registry classes**
- **3 example definition sets**

---

## 2. Schemas Inventory

### Current Schemas (23 total)

#### Definition Schemas (6)
| File | Current Purpose | Maps to | Status |
|------|-----------------|---------|--------|
| workspace-definition | Project blueprint | `ProjectDefinition` | **RENAME** |
| artifact-definition | Artifact type schema | `ArtifactDefinition` | ✅ Keep |
| playbook-definition | Process/orchestration | `Schedule` + metadata | **REFACTOR** |
| agent-definition | Agent configuration | `AgentDefinition` | ✅ Keep |
| skill-definition | Reusable capability | `SkillDefinition` | ✅ Keep |
| tool-definition | External capability | `ToolDefinition` | ✅ Keep |

#### Runtime Schemas (11)
| File | Current Purpose | Maps to | Status |
|------|-----------------|---------|--------|
| workspace-instance | Live workspace | `Project` (runtime) | **RENAME** |
| work-item | Queue item/business anchor | ❌ **REMOVE** | **DELETE** |
| artifact-instance | Durable artifact | `Artifact` | **RENAME** |
| knowledge-source | Context data | `Resource` | **RENAME** |
| action | Executable step | ❌ **MERGE** into `Run` | **DELETE** |
| thread | Conversation | `Thread` | ✅ Keep |
| run | Execution record | `Run` | ✅ Keep |
| playbook-instance | Running playbook | ❌ **REMOVE** | **DELETE** |
| agent-session | Agent context | `AgentSession` | ✅ Keep |
| event | Activity record | `Event` | ✅ Keep |
| participant | Human/agent actor | `Participant` | ✅ Keep |

#### Interpreter/Shell Schemas (1)
| File | Current Purpose | Maps to | Status |
|------|-----------------|---------|--------|
| component-tree | Interpreter output | `ExecutableConfig` | **RENAME** |

#### Policy/Other Schemas (5)
| File | Current Purpose | Maps to | Status |
|------|-----------------|---------|--------|
| policies | Behavior constraints | `Policy` | ✅ Keep |
| permissions | Access rules | `Permission` | ✅ Keep |
| workspace-state | Runtime state model | `ProjectState` | **RENAME** |
| action | *(duplicate in runtime)* | N/A | **CONSOLIDATE** |
| participant | *(defined in runtime)* | `Participant` | ✅ Keep |

### Schema Inventory Summary

- **Keep as-is:** 7 schemas (artifact-definition, agent-definition, skill-definition, tool-definition, thread, run, event)
- **Rename:** 5 schemas (workspace-definition, workspace-instance, artifact-instance, knowledge-source, workspace-state)
- **Delete:** 3 schemas (work-item, playbook-instance, action → merge into run)
- **Consolidate:** 1 schema (action - duplicate/redundant)
- **Refactor:** 1 schema (playbook-definition → schedule + metadata)

**New schemas needed:**
- `channel.schema.json` - Communication interface definition
- `schedule.schema.json` - Trigger/automation definition
- `resource.schema.json` - Context data (rename knowledge-source)
- `sandbox.schema.json` - Execution environment constraints
- `eval.schema.json` - Evaluation/assessment definition
- `project-state.schema.json` - Runtime state (rename workspace-state)

---

## 3. Types Inventory (@awp/types)

### Current Modules

#### definitions.ts
**Current purpose:** Workspace, artifact, playbook, agent definitions

**Current types (30+ interfaces):**
- `DefinitionMetadata` - Base for all definitions
- `WorkspaceDefinition` - **RENAME to ProjectDefinition**
- `ArtifactDefinition` - ✅ Keep
- `PlaybookDefinition` - **REFACTOR to Schedule + Agent behavior**
- `AgentDefinition` - ✅ Keep
- `SkillDefinition` - ✅ Keep
- `ToolDefinition` - ✅ Keep
- `Zone` - ⚠️ **MOVE to shell/UI layer** (not platform concept)
- `Binding` - ⚠️ **MOVE to shell/UI layer** (not platform concept)
- `ArtifactSection`, `ArtifactRelationship` - ✅ Keep
- `PlaybookActivity`, `PlaybookTransition` - **REFACTOR**

**Missing from Phase 2:**
- `ProjectDefinition` interface (wrapper)
- `ChannelDefinition` interface
- `ScheduleDefinition` interface
- `SandboxConstraints` interface
- `EvalDefinition` interface

#### runtime.ts
**Current purpose:** Runtime instances and state

**Current types (35+ interfaces):**
- `WorkspaceInstance` - **RENAME to Project**
- `WorkItem` - **DELETE** (use Agent + Run instead)
- `ArtifactInstance` - **RENAME to Artifact**
- `Run` - ✅ Keep (expand to include action data)
- `Event` - ✅ Keep
- `AgentSession` - ✅ Keep
- `Thread` - ✅ Keep
- `KnowledgeSource` - **RENAME to Resource**
- `Participant` - ✅ Keep
- `PlaybookInstance` - **DELETE** (use Run instead)
- `Action` - **MERGE into Run**
- `WorkspaceState` - **RENAME to ProjectState**
- Sub-state types (BusinessState, SelectionState, etc.) - ✅ Keep but evolve

**Missing from Phase 2:**
- `Channel` interface (runtime instance)
- `Schedule` interface (runtime instance)
- `Sandbox` interface (execution environment)
- `Eval` interface (evaluation record)

#### interpreter.ts
**Current purpose:** Interpretation and component tree

**Current types (15+ interfaces):**
- `ComponentTree` - **RENAME to ExecutableConfiguration**
- `ComponentDefinition` - ⚠️ **MOVE to shell layer**
- `ViewDefinition` - ⚠️ **MOVE to shell layer**
- `InterpretationResult` - ✅ Keep (rename to `InterpretationResult`)
- `NormalizedDefinition` - ✅ Keep (evolve for Phase 2)
- `BindingContext` - ⚠️ **MOVE to shell layer**

**Semantics change:**
- Phase 1: Interpreter produces UI component tree
- Phase 2: Interpreter produces executable configuration (no UI concepts)

### Types Inventory Summary

- **Total Phase 1 types:** 80+ interfaces
- **Keep unchanged:** ~25 types
- **Rename:** ~10 types
- **Delete:** ~5 types
- **Move to shell layer:** ~8 types
- **Create new:** ~10 types for Phase 2 concepts

---

## 4. Definitions Package Inventory

### Builders (6 classes)

| Class | Current Purpose | Phase 2 Target | Status |
|-------|-----------------|----------------|--------|
| `WorkspaceDefinitionBuilder` | Build workspace def | `ProjectDefinitionBuilder` | **RENAME** |
| `ArtifactDefinitionBuilder` | Build artifact type | `ArtifactDefinitionBuilder` | ✅ Keep |
| `PlaybookDefinitionBuilder` | Build process flow | **SPLIT** into `ScheduleDefinitionBuilder` + agent config | **REFACTOR** |
| `AgentDefinitionBuilder` | Build agent config | `AgentDefinitionBuilder` | ✅ Keep |
| `SkillDefinitionBuilder` | Build skill reuse | `SkillDefinitionBuilder` | ✅ Keep |
| `ToolDefinitionBuilder` | Build tool spec | `ToolDefinitionBuilder` | ✅ Keep |

#### New Builders Needed
- `ProjectDefinitionBuilder` - Renamed from Workspace
- `ChannelDefinitionBuilder` - Communication interface
- `ScheduleDefinitionBuilder` - Automation/trigger
- `ResourceDefinitionBuilder` - Context data
- `SandboxDefinitionBuilder` - Execution constraints
- `EvalDefinitionBuilder` - Evaluation/assessment

### Validator (1 class)

| Class | Current Purpose | Phase 2 Target | Status |
|-------|-----------------|----------------|--------|
| `DefinitionValidator` | Schema validation | `DefinitionValidator` (evolved) | ✅ Keep |

**Method renames needed:**
- `validateWorkspaceDefinition()` → `validateProjectDefinition()`
- `validatePlaybookDefinition()` → `validateScheduleDefinition()`
- Add: `validateChannelDefinition()`
- Add: `validateResourceDefinition()`
- Add: `validateSandboxDefinition()`

### Examples (3 sets)

| File | Current Purpose | Phase 2 Target | Status |
|------|-----------------|----------------|--------|
| decision-workspace.ts | Example workspace | Example project | **MIGRATE** |
| partner-workspace.ts | Example workspace | Example project | **MIGRATE** |
| artifact-examples.ts | Artifact definitions | Artifact definitions | ✅ Keep |

**Action:** Update examples to use new vocabulary (Project, Agent, Tool, Skill, Schedule, Resource, Channel)

---

## 5. Interpreter Package Inventory

### Modules (3)

#### interpreter.ts
**Current purpose:** Main interpretation pipeline

**Current classes:**
- `WorkspaceInterpreter` - **RENAME to PlatformInterpreter**
- Methods: `interpret()`, `normalize()`, `resolveBindings()`, `generateComponentTree()`

**Phase 2 changes:**
- Rename to `PlatformInterpreter` or `ConfigurationGenerator`
- `normalize()` stays but expands for new concepts
- `resolveBindings()` becomes `resolveReferences()` (more general)
- `generateComponentTree()` becomes `generateExecutableConfiguration()`
- Remove UI-focused stages (layout resolution, component tree generation)
- Add new stages: sandbox resolution, constraint evaluation, channel binding

**New methods needed:**
- `resolveTools()` - Resolve tool references
- `resolveChannels()` - Resolve channel references
- `resolveSchedules()` - Resolve schedule references
- `validateConstraints()` - Validate sandbox constraints

#### normalizer.ts
**Current purpose:** Legacy format migration

**Current functions:**
- `normalizeDefinition()` - Migrate old → new format
- `normalizeWorkspaceStructure()` - **RENAME to normalizeProjectStructure()**
- `normalizeBinding()` - **REMOVE** (zone/binding are UI concepts)
- Phase 1 migrations (workspace→project, etc.)

**Phase 2 changes:**
- Keep normalization framework
- Remove zone/binding normalization
- Add new Phase 2 migrations (playbook→schedule+agent, etc.)
- Add Phase 1→Phase 2 definition migration
- Preserve backward compatibility during transition

#### registry.ts
**Current purpose:** Component and view definitions

**Current classes:**
- `ComponentRegistry` - ⚠️ **MOVE to shell layer**
- `ViewRegistry` - ⚠️ **MOVE to shell layer**
- `createDefaultComponentRegistry()` - ⚠️ **MOVE to shell layer**
- `createDefaultViewRegistry()` - ⚠️ **MOVE to shell layer**

**Phase 2 change:**
- These are UI/shell concerns, not platform concerns
- Move to `@awp/shell` package (future)
- Replace with:
  - `ToolRegistry` - Tool definition registry
  - `SkillRegistry` - Skill definition registry
  - `ChannelRegistry` - Channel capability registry
  - `SandboxRegistry` - Sandbox template registry

### Interpreter Inventory Summary

- **Core interpreter:** Rename + evolve for Phase 2 semantics
- **Normalizer:** Keep framework, add Phase 1→Phase 2 migrations
- **Registry:** Move UI-focused registries to shell layer; create capability registries

---

## 6. Directory Structure Inventory

### Current Root Directories

| Directory | Purpose | Phase 2 Status |
|-----------|---------|----------------|
| `packages/` | Platform packages | ✅ Evolve |
| `docs/` | Documentation | ✅ Keep |
| `schemas/` | Legacy schema location | **DEPRECATE** (use packages/schemas/) |
| `exec-plans/`, `jobs/` | Administrative | N/A (not platform) |

### Current packages/

| Package | Purpose | Phase 2 Status |
|---------|---------|----------------|
| schemas/ | JSON schemas | ✅ Expand |
| types/ | TypeScript types | ✅ Expand |
| definitions/ | Builders + validators | ✅ Expand |
| interpreter/ | Transformation engine | ✅ Evolve |
| *(planned)* runtime/ | Execution state | **CREATE** (Phase 2) |
| *(planned)* shell/ | UI components | **CREATE** (Phase 3) |
| *(planned)* sdk/ | Client library | **CREATE** (Phase 2) |

### Recommended New Directories

For Phase 2 implementation:

```
packages/
├── schemas/              (expand)
├── types/                (expand)
├── definitions/          (expand)
├── interpreter/          (evolve)
├── runtime/              (NEW) - Project execution state
├── sdk/                  (NEW) - Client libraries
├── shell/                (NEW) - UI components (Phase 3)
└── examples/             (NEW) - Reference implementations
```

---

## 7. Concept Mapping Table

### Phase 1 → Phase 2 Ontology

| Phase 1 Concept | Phase 2 Concept | Type | Status |
|-----------------|-----------------|------|--------|
| Workspace | Project | Container | Rename |
| WorkspaceDefinition | ProjectDefinition | Definition | Rename |
| WorkspaceInstance | Project | Runtime | Rename |
| WorkspaceState | ProjectState | State | Rename |
| WorkItem | ❌ REMOVE | Queue concept | Delete |
| Playbook | Agent + Schedule | Process | Refactor |
| PlaybookDefinition | ScheduleDefinition + AgentDef | Process def | Refactor |
| PlaybookInstance | Run | Execution | Merge |
| Zone | ⚠️ Shell concept | UI | Move to shell/ |
| Binding | ⚠️ Shell concept | UI | Move to shell/ |
| ComponentTree | ExecutableConfiguration | Output | Rename |
| KnowledgeSource | Resource | Context | Rename |
| Session | Thread | Collaboration | Rename/clarify |
| Action | Run | Execution | Merge |
| Capability | Tool or Skill | Abstraction | Clarify |
| Integration | ❌ Not a concept | Mechanism | Remove term |
| Definition/Instance | Definition / Runtime | Pattern | Keep pattern |
| *(none)* | Channel | Communication | ✨ NEW |
| *(none)* | Schedule | Automation | ✨ NEW |
| *(none)* | Sandbox | Execution env | ✨ NEW |
| *(none)* | Eval | Assessment | ✨ NEW |

---

## 8. Deletion Recommendations

### Schemas to Delete

1. **work-item.schema.json**
   - **Reason:** WorkItem concept is removed in Phase 2
   - **Migration:** Replaced by Agent + Run pattern
   - **Impact:** 3 dependent types in @awp/types

2. **playbook-instance.schema.json**
   - **Reason:** PlaybookInstance is replaced by Run in Phase 2
   - **Migration:** Playbook execution becomes Run with context
   - **Impact:** 1 dependent type in @awp/types

3. **action.schema.json** (if separate from runtime action)
   - **Reason:** Action concept merged into Run
   - **Migration:** Actions become attributes of Runs
   - **Impact:** May consolidate with run.schema.json

### Types to Delete

1. **WorkItem interface** (runtime.ts)
   - **Reason:** Removed in Phase 2 ontology
   - **Impact:** References in WorkspaceInstance need update

2. **PlaybookInstance interface** (runtime.ts)
   - **Reason:** Merged into Run
   - **Impact:** References need update

3. **Action interface** (if separate)
   - **Reason:** Merged into Run
   - **Impact:** References need update

### Classes to Delete

1. **PlaybookDefinitionBuilder** (definitions.ts)
   - **Reason:** Playbook concept refactored
   - **Replacement:** ScheduleDefinitionBuilder + evolved AgentDefinitionBuilder
   - **Impact:** Builder examples need update

2. **ComponentRegistry** (interpreter.ts)
   - **Reason:** UI concern, move to shell layer
   - **Impact:** None if moved cleanly

3. **ViewRegistry** (interpreter.ts)
   - **Reason:** UI concern, move to shell layer
   - **Impact:** None if moved cleanly

### Directories to Delete/Deprecate

1. **schemas/** (root level)
   - **Reason:** Redundant with packages/schemas/
   - **Migration:** Consolidate into packages/schemas/
   - **Impact:** Update documentation references

---

## 9. Rename Recommendations

### Critical Renames (Breaking)

1. **workspace-definition.schema.json** → **project-definition.schema.json**
   - Also rename export: `workspaceDefinition` → `projectDefinition`
   
2. **workspace-instance.schema.json** → **project.schema.json**
   - Also rename export: `workspaceInstance` → `project`

3. **artifact-instance.schema.json** → **artifact.schema.json**
   - Also rename export: `artifactInstance` → `artifact`

4. **knowledge-source.schema.json** → **resource.schema.json**
   - Also rename export: `knowledgeSource` → `resource`

5. **workspace-state.schema.json** → **project-state.schema.json**
   - Also rename export: `workspaceState` → `projectState`

6. **component-tree.schema.json** → **executable-configuration.schema.json**
   - Also rename export: `componentTree` → `executableConfiguration`

### Type Renames

1. `WorkspaceDefinition` → `ProjectDefinition`
2. `WorkspaceInstance` → `Project`
3. `ArtifactInstance` → `Artifact`
4. `KnowledgeSource` → `Resource`
5. `WorkspaceState` → `ProjectState`
6. `ComponentTree` → `ExecutableConfiguration`
7. `WorkspaceInterpreter` → `PlatformInterpreter` or `DefinitionInterpreter`

### Builder Renames

1. `WorkspaceDefinitionBuilder` → `ProjectDefinitionBuilder`
2. Validator methods: `validateWorkspaceDefinition()` → `validateProjectDefinition()`

---

## 10. New Packages Recommended

### Phase 2 New Packages

1. **packages/runtime** (Phase 2)
   - Purpose: Project execution state management
   - Modules: `project-state.ts`, `state-mutations.ts`, `event-emitter.ts`
   - Types: ProjectState, mutations, effect handlers
   - Replace: Current runtime concepts scattered in @awp/types

2. **packages/sdk** (Phase 2)
   - Purpose: Client library for building agents and projects
   - Modules: `project-client.ts`, `agent-client.ts`, `tool-registry.ts`
   - Types: Client interfaces, SDK configuration
   - Support: Agent and tool definitions, project interaction

3. **packages/shell** (Phase 3)
   - Purpose: UI components and rendering layer
   - Modules: `components/`, `zones/`, `views/`
   - Types: ComponentRegistry, ViewRegistry, ComponentDefinition
   - Move: Zone, Binding, ComponentTree concepts from Phase 1

4. **packages/examples** (Phase 2)
   - Purpose: Reference implementations and vertical examples
   - Modules: `verticals/`, `tutorials/`
   - Content: Decision, Partner, HR, Finance workspace definitions (in new vocabulary)
   - Move: Examples from packages/definitions/examples/

---

## 11. Implementation Sequence Recommendation

### Phase 2a: Schema & Type Updates (1-2 weeks)

**Dependencies:** None (standalone)

1. Create new schema files:
   - `channel.schema.json`
   - `schedule.schema.json`
   - `resource.schema.json`
   - `sandbox.schema.json`
   - `eval.schema.json`
   - Renamed files: project-definition, project.schema.json, etc.

2. Delete schemas:
   - `work-item.schema.json`
   - `playbook-instance.schema.json`

3. Update @awp/types:
   - Add new type modules for Channel, Schedule, Resource, Sandbox, Eval
   - Rename existing types
   - Delete WorkItem, PlaybookInstance, Action types
   - Update runtime type structure for ProjectState

4. Update @awp/schemas exports:
   - New getters
   - Renamed getters
   - Deprecation warnings for old names

**Backward compatibility strategy:**
- Keep aliases in @awp/schemas for old names (deprecated)
- Add deprecation notices to @awp/types
- Provide migration guide

### Phase 2b: Definitions & Builder Updates (1-2 weeks)

**Dependencies:** Phase 2a

1. Update @awp/definitions builders:
   - Rename `WorkspaceDefinitionBuilder` → `ProjectDefinitionBuilder`
   - Add new builders: Channel, Schedule, Resource, Sandbox, Eval
   - Refactor `PlaybookDefinitionBuilder` (split concern)
   - Update `DefinitionValidator` with new validation methods

2. Update examples:
   - Migrate decision-workspace.ts to new vocabulary
   - Migrate partner-workspace.ts to new vocabulary
   - Keep artifact-examples.ts unchanged
   - Add new examples: Channel, Schedule, Resource definitions

3. Maintain backward compatibility:
   - Keep old builders with deprecation warnings
   - Provide migration utilities

### Phase 2c: Interpreter Updates (1-2 weeks)

**Dependencies:** Phase 2a, 2b

1. Update @awp/interpreter:
   - Rename `WorkspaceInterpreter` → `PlatformInterpreter`
   - Refactor interpretation pipeline:
     - Rename `resolveBindings()` → `resolveReferences()`
     - Rename `generateComponentTree()` → `generateExecutableConfiguration()`
     - Add `resolveTools()`, `resolveChannels()`, `resolveSchedules()`
     - Remove UI-specific stages
   - Update normalizer for Phase 1→Phase 2 migrations
   - Move registry classes to shell layer (or create new registries)

2. Add new capabilities:
   - Tool registry and resolution
   - Channel resolution
   - Schedule resolution
   - Sandbox constraint validation

3. Update normalization:
   - Handle Playbook → Agent + Schedule migration
   - Handle WorkItem → (remove) migration
   - Preserve Phase 1 format support with warnings

### Phase 2d: Runtime Package Creation (2-3 weeks)

**Dependencies:** Phase 2a, 2b, 2c

1. Create @awp/runtime:
   - Implement ProjectState management
   - Move runtime types from @awp/types
   - Event emission and propagation
   - State mutation framework

2. Runtime capabilities:
   - Project instance lifecycle
   - Run execution tracking
   - Event handling
   - State persistence abstractions

### Phase 3: Shell Package & UI Layer (3-4 weeks)

**Dependencies:** Phase 2a, 2b, 2c, 2d

1. Create @awp/shell:
   - Move ComponentRegistry, ViewRegistry from interpreter
   - Create new registries for capabilities
   - Zone and component rendering
   - State-to-component bindings

2. Shell components:
   - Project dashboard
   - Run inspector
   - Agent activity view
   - Thread viewer
   - Artifact editor

---

## 12. Obsolete Terminology to Remove

| Term | Context | Action |
|------|---------|--------|
| Capability | Use Tool or Skill | Remove from platform vocab |
| Integration | Use Tool | Remove from platform vocab |
| Workflow | Use Agent or Run | Remove informal term |
| ComponentType | Use component | Remove |
| ZoneKey | Use zone | Remove |
| ViewKey | Use view | Remove |
| Definition/Instance pattern | Keep pattern, evolve naming | Update naming |
| Workspace | Use Project | Phase 2 rename |
| WorkItem | Use Agent + Run | Phase 2 remove |
| Playbook | Use Schedule + Agent | Phase 2 refactor |

---

## 13. Duplicate Abstractions to Consolidate

### Duplicates Identified

1. **Action vs Run**
   - Both represent executable units
   - **Solution:** Merge Action into Run; Run is the canonical execution record
   - **Impact:** Simplifies runtime model

2. **KnowledgeSource vs Resource**
   - Both represent context data
   - **Solution:** Standardize on Resource
   - **Impact:** Simpler naming, clearer semantics

3. **Session vs Thread**
   - Both represent conversation context
   - **Solution:** Standardize on Thread (more specific than Session)
   - **Impact:** Clearer intent

4. **PlaybookInstance vs Run**
   - Both represent execution
   - **Solution:** Merge PlaybookInstance into Run
   - **Impact:** Fewer runtime types

---

## 14. Undefined Concept Gaps

### Missing from Phase 1, Needed in Phase 2

1. **Channel**
   - Needed for: Communication interfaces (Slack, email, webhooks)
   - How defined: ChannelDefinition
   - How instantiated: Channel (runtime)
   - Where: packages/schemas, packages/types, packages/definitions

2. **Schedule**
   - Needed for: Automation triggers (cron, event-based)
   - How defined: ScheduleDefinition
   - How instantiated: Schedule (runtime)
   - Where: packages/schemas, packages/types, packages/definitions

3. **Sandbox**
   - Needed for: Execution environment constraints
   - How defined: SandboxConstraints (part of AgentDefinition or separate)
   - How instantiated: SandboxEnvironment (runtime)
   - Where: packages/schemas, packages/types

4. **Eval**
   - Needed for: Quality assessment and evaluation
   - How defined: EvalDefinition
   - How instantiated: EvalResult (runtime)
   - Where: packages/schemas, packages/types, packages/definitions

---

## 15. Simplification Opportunities

### Can Be Simplified

1. **Definition/Instance Pattern**
   - Current: Separate Definition and Instance types for each concept
   - Opportunity: Keep pattern but reduce naming verbosity
   - Action: Rename ArtifactInstance → Artifact, ProjectInstance → Project
   - Benefit: Less cognitive load, clearer intent

2. **Zone/Binding Abstraction**
   - Current: In @awp/types definitions, but UI-specific
   - Opportunity: Move to shell layer, out of platform core
   - Action: Move Zone, Binding, ComponentTree to packages/shell
   - Benefit: Platform types focus on runtime semantics, not UI

3. **Normalizer Scope**
   - Current: Handles multiple migration paths (zone, binding, terminology)
   - Opportunity: Focus only on definition normalization
   - Action: Move UI format migration to shell layer
   - Benefit: Clearer responsibility boundaries

4. **Interpreter Stages**
   - Current: 7 stages including UI-specific ones (binding resolution, layout resolution)
   - Opportunity: Keep 5 core stages (validate, normalize, resolve, evaluate, generate)
   - Action: Remove UI-specific stages; move to shell renderer
   - Benefit: Cleaner, more focused pipeline

---

## Summary: Architecture Changes Needed

### Delete
- 3 schemas (work-item, playbook-instance, action)
- 3 types (WorkItem, PlaybookInstance, Action)
- 1 builder (PlaybookDefinitionBuilder - refactor)
- 2 registries (ComponentRegistry, ViewRegistry - move)
- 1 root directory (schemas/ - consolidate)

### Rename
- 6 schemas
- 7 types
- 1 builder class
- 1 interpreter class

### Create
- 5 new schemas
- 5 new type modules
- 6 new builders
- 4 new packages (runtime, sdk, shell, examples)

### Move
- Zone, Binding concepts → shell layer
- ComponentRegistry, ViewRegistry → shell layer
- Registry-related code → shell layer

### Evolve
- Normalizer: Add Phase 1→Phase 2 migration paths
- Interpreter: Remove UI stages, add capability resolution
- Validator: Support new definition types

---

## Next Steps

This inventory provides the blueprint for Phase 2 implementation.

**Ready for:** Phase 2a implementation (Schema & Type Updates)

**Decision needed:** Backward compatibility strategy (see section 11 Phase 2a)

**Not blocked on:** Any external dependencies
