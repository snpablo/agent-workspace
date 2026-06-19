# @awp/types

TypeScript type definitions for Agent Workspace Platform.

This package provides the canonical type system for the platform, organized into three categories matching the architecture: definitions, runtime, and interpreter types.

## Usage

```typescript
import {
  WorkspaceDefinition,
  WorkspaceInstance,
  ComponentTree,
  ArtifactDefinition,
  Run,
} from '@awp/types';

const workspace: WorkspaceDefinition = {
  workspace: {
    id: 'my-workspace',
    type: 'decision',
    version: 1,
  },
  zones: [],
  bindings: [],
};
```

## Type Categories

### Definitions (src/definitions.ts)

Declarative, versioned, portable blueprints for workspace elements.

**Base**
- `DefinitionMetadata` - Common versioning and metadata for all definitions

**Definitions**
- `WorkspaceDefinition` - Complete workspace type and composition
- `ArtifactDefinition` - Durable artifact type definition with sections and relationships
- `PlaybookDefinition` - Process definition with activities and transitions
- `AgentDefinition` - Agent role with skills, tools, and constraints
- `SkillDefinition` - Reusable capability invoked by agents or playbooks
- `ToolDefinition` - Bounded callable capability with parameters

**Supporting Types**
- `Zone` - Structural region in workspace shell
- `Binding` - Connection between zone and object kind/view
- `ArtifactSection` - Structured section within an artifact
- `ArtifactRelationship` - Allowed connections between artifacts
- `PlaybookActivity` - Individual step in a playbook
- `PlaybookTransition` - Control flow between activities
- `SkillReference` - Pointer to a skill definition
- `ToolReference` - Pointer to a tool definition

### Runtime (src/runtime.ts)

Live or persisted instances that exist during workspace execution.

**Workspace & Items**
- `WorkspaceInstance` - Live workspace and all its state
- `WorkItem` - Business anchor for active work with status and assignments
- `Participant` - Human or agent actor in the workspace

**Artifacts & Knowledge**
- `ArtifactInstance` - Durable result with versioning and provenance
- `ArtifactVersion` - Immutable artifact snapshot
- `KnowledgeSource` - Grounding source for artifacts and work

**Execution & Activity**
- `Run` - Finite execution instance from playbook, skill, or action
- `Event` - Canonical activity record with provenance
- `Thread` - Conversation or discussion context
- `Action` - Executable or reviewable next step

**Agents & Orchestration**
- `AgentSession` - Long-lived agent participation context
- `PlaybookInstance` - Runtime realization of playbook definition

**State Management**
- `WorkspaceState` - Complete runtime state model
- `BusinessState` - Work items, artifacts, and core work
- `SelectionState` - User selections within UI
- `NavigationState` - Current route and focus
- `ArtifactState` - Artifact-specific state and versioning
- `AgentState` - Agent sessions and activity
- `ActionState` - Pending and in-progress actions
- `ActivityState` - Events and timeline
- `LayoutState` - Presentation state (visibility, splits)

### Interpreter (src/interpreter.ts)

Component tree and interpretation structures.

**Interpreter Output**
- `ComponentTree` - Normalized interpreter output ready for shell rendering
- `RenderedZone` - Zone with selected component
- `ResolvedBinding` - Binding with resolved component and view
- `ComponentDefinition` - Renderable UI primitive
- `ViewDefinition` - Component variant for specific object kind
- `StateBinding` - Connection between component and workspace state

**Interpretation**
- `InterpretationResult` - Outcome of interpretation pipeline
- `InterpretationError` - Error with code and path
- `InterpreterOptions` - Configuration for interpretation
- `NormalizedDefinition` - Internal representation after normalization
- `Normalization` - Tracked schema migration
- `BindingContext` - Context for binding resolution
- `ComponentSelection` - Result of binding resolution

**Metadata**
- `InterpreterMetadata` - Provenance and diagnostics of interpretation
- `PropDefinition` - Component property definition
- `PropOption` - Option for a property

## Type Patterns

### Status Enums

Types use union types for status values instead of separate enums:

```typescript
export type InstanceStatus = 'active' | 'completed' | 'failed' | 'cancelled' | 'archived';
export type WorkItemStatus = 'open' | 'in_progress' | 'completed' | 'blocked' | 'archived';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'archived';
export type RunStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
```

### Optional Metadata

Most types include an optional `metadata` field for extension:

```typescript
interface MyRuntime {
  id: string;
  type: string;
  metadata?: Record<string, any>;
}
```

### IDs and References

Objects use string IDs with referential integrity enforced at runtime. Foreign keys are represented as strings:

```typescript
interface WorkItem {
  id: string;
  workspaceId: string;
  artifacts?: string[];  // artifact IDs
}
```

### Versioning

Definition objects include `version` as a required integer for compatibility tracking:

```typescript
interface DefinitionMetadata {
  id: string;
  type: string;
  version: number;  // required
}
```

## Design Principles

### Definition/Runtime Separation

The type system maintains strict separation between:
- **Definitions**: declarative, immutable templates (`WorkspaceDefinition`, `ArtifactDefinition`)
- **Runtime**: live, mutable instances (`WorkspaceInstance`, `ArtifactInstance`)

### Canonical Vocabulary

Types enforce the canonical vocabulary from the implementation contract:
- No `Output` type (use `Artifact`)
- No queue root `Task` (use `WorkItem`)
- No `ComponentType` (use `Component`)
- No `ZoneKey` (use `Zone`)

### Minimal Interfaces

Types define only required and commonly-used fields. Domain-specific extensions use `metadata` or specialized subtypes.

### Referential Integrity

Types represent relationships explicitly:
- Foreign keys as strings (`workspaceId`, `artifactId`)
- Collections by ID when needed (`artifacts?: string[]`)
- Populated objects when available (`workspace?: WorkspaceDefinition`)

## Usage in Applications

### Creating Instances

```typescript
const workspace: WorkspaceInstance = {
  id: 'ws-001',
  workspaceDefinitionId: 'definition-v1',
  status: 'active',
  createdAt: new Date().toISOString(),
  createdBy: 'user-001',
  workItems: [],
  artifacts: [],
  participants: [],
  runs: [],
  actions: [],
  threads: [],
  events: [],
  sessions: [],
  playbookInstances: [],
};
```

### Building Definitions

Use `@awp/definitions` builders for fluent definition construction:

```typescript
import { WorkspaceDefinitionBuilder } from '@awp/definitions';

const def = new WorkspaceDefinitionBuilder('workspace-id', 'workspace-type')
  .displayName('My Workspace')
  .addZone('queue', 'Queue')
  .addBinding('queue', 'work_item', 'queue_view')
  .build();
```

### Interpreting Definitions

Use `@awp/interpreter` to transform definitions into component trees:

```typescript
import { WorkspaceInterpreter } from '@awp/interpreter';

const interpreter = new WorkspaceInterpreter();
const result = interpreter.interpret(definition);
```

## Integration with Other Packages

- **@awp/schemas** - JSON Schema definitions; types should align with schemas
- **@awp/definitions** - Builders operate on these types
- **@awp/interpreter** - Accepts and produces these types

## Future Extensions

Future versions may add:
- Generic lifecycle types (created, updated, deleted timestamps)
- Permission and policy type system
- Fine-grained state sub-types
- Specialized artifact types for specific domains
