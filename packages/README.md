# Agent Workspace Platform - Implementation Packages

This directory contains the implementation of the Agent Workspace Platform core packages:

- **@awp/schemas** - JSON schemas for all platform objects
- **@awp/types** - TypeScript type definitions
- **@awp/definitions** - Definition builders and validators
- **@awp/interpreter** - Workspace interpreter for definition → component tree transformation

## Architecture Overview

```
WorkspaceDefinition (YAML/JSON)
        ↓
Workspace Interpreter
    ├─ Normalization (legacy format migration)
    ├─ Validation (schema and constraint checking)
    ├─ Binding Resolution (component and view selection)
    ├─ Policy Evaluation
    ├─ Layout Resolution
    └─ Component Tree Generation
        ↓
ComponentTree (normalized, resolved, ready to render)
        ↓
Workspace Runtime (manages state, execution, collaboration)
        ↓
Workspace Shell (renders zones and components)
```

## Implementation Status

### Completed

- ✅ Schema inventory formalization (@awp/schemas)
- ✅ Type system definition (@awp/types)
- ✅ Definition builders and validators (@awp/definitions)
- ✅ Core interpreter with normalization pipeline (@awp/interpreter)
- ✅ Canonical component and view registries

### Next Steps

- Runtime state management (@awp/runtime)
- Workspace shell components and zone rendering
- Persistence and audit layers
- Vertical workspace implementations

## Quick Start

### Building All Packages

```bash
yarn install
yarn workspace @awp/schemas build
yarn workspace @awp/types build
yarn workspace @awp/definitions build
yarn workspace @awp/interpreter build
```

### Using the Interpreter

```typescript
import { WorkspaceInterpreter } from '@awp/interpreter';
import { WorkspaceDefinitionBuilder } from '@awp/definitions';

// Build or load a workspace definition
const definition = new WorkspaceDefinitionBuilder('my-workspace', 'decision', 1)
  .displayName('My Workspace')
  .addZone('header', 'Header')
  .addZone('queue', 'Queue')
  .addZone('artifact', 'ArtifactSurface')
  .addBinding('queue', 'work_item', 'queue_view')
  .addBinding('artifact', 'artifact', 'editor_view')
  .addArtifact('decision-analysis', true)
  .build();

// Interpret the definition
const interpreter = new WorkspaceInterpreter();
const result = interpreter.interpret(definition);

if (result.success) {
  console.log('Component Tree:', result.componentTree);
} else {
  console.error('Errors:', result.errors);
}
```

## Package Details

### @awp/schemas

Provides access to canonical JSON schemas for all platform objects.

**Exports:**
- Definition schemas: `workspaceDefinition`, `artifactDefinition`, `playbookDefinition`, `agentDefinition`, etc.
- Runtime schemas: `workspaceInstance`, `workItem`, `artifactInstance`, `run`, etc.
- Interpreter schemas: `componentTree`

### @awp/types

TypeScript type definitions organized into three categories:

**Definitions** (`src/definitions.ts`)
- `WorkspaceDefinition` - Declarative workspace composition
- `ArtifactDefinition` - Artifact type definition
- `PlaybookDefinition` - Process/orchestration definition
- `AgentDefinition` - Agent role and capabilities
- `SkillDefinition` - Reusable capability
- `ToolDefinition` - Callable tool or function

**Runtime** (`src/runtime.ts`)
- `WorkspaceInstance` - Live workspace
- `WorkItem` - Queue item and business anchor
- `ArtifactInstance` - Artifact with versioning
- `Run` - Finite execution instance
- `Event` - Activity record
- `AgentSession` - Long-lived agent context
- `WorkspaceState` - Runtime state model

**Interpreter** (`src/interpreter.ts`)
- `ComponentTree` - Interpreter output
- `ComponentDefinition` - UI component definition
- `ViewDefinition` - Component variant for object kind
- `InterpretationResult` - Interpretation outcome

### @awp/definitions

Fluent builders and validators for creating and validating definitions.

**Builders:**
- `WorkspaceDefinitionBuilder` - Build workspace definitions
- `ArtifactDefinitionBuilder` - Build artifact definitions
- `PlaybookDefinitionBuilder` - Build playbook definitions
- `AgentDefinitionBuilder` - Build agent definitions
- `SkillDefinitionBuilder` - Build skill definitions
- `ToolDefinitionBuilder` - Build tool definitions

**Validators:**
- `DefinitionValidator` - Validates definitions against schemas and constraints

**Examples:**
- `decision-workspace.ts` - Decision workspace definition
- `partner-workspace.ts` - Partner operations workspace definition
- `artifact-examples.ts` - Common artifact types

### @awp/interpreter

Transforms workspace definitions into component trees.

**Main Classes:**
- `WorkspaceInterpreter` - Main interpreter orchestrating the pipeline
- `ComponentRegistry` - Manages component definitions
- `ViewRegistry` - Manages view definitions
- `NormalizationContext` - Tracks schema migrations

**Interpretation Pipeline:**

1. **Normalization** - Migrates legacy formats to canonical form
   - `top-level.id` → `workspace.id`
   - `workspaceType` → `workspace.type`
   - `componentBindings` → `bindings`
   - `task` → `work_item`
   - `Output` → `Artifact`

2. **Validation** - Checks schema compliance and constraints

3. **Binding Resolution** - Resolves zone/objectKind/view to components

4. **Policy Evaluation** - Applies policies and permissions (TODO)

5. **Component Tree Generation** - Produces normalized output

## Architectural Principles

### Definition/Runtime Separation

Definitions are declarative, versioned, and reusable. Runtime objects are live, mutable, and persistent.

### Canonical Vocabulary

The platform enforces a canonical vocabulary via the implementation contract:
- `ArtifactDefinition` + `ArtifactInstance` (not `Output`)
- `WorkItem` (not queue root `Task`)
- `AgentSession` (not transient conversation)

### Metadata-Driven Composition

Workspace experiences are composed from definitions without hard-coded domain logic. The same runtime renders all vertical workspaces.

### Domain-Neutral Interpreter

The interpreter remains generic across all workspace types. Vertical-specific behavior lives in definitions, not the platform core.

## Testing Guidance

Each package includes example definitions and builders that can be used for:
- Unit testing the builders
- Integration testing the validator
- End-to-end testing the interpreter

The `packages/definitions/examples/` directory provides reference implementations for:
- Decision Workspace
- Partner Workspace
- Common artifact types

## Design Decisions

### Schema Validation

The validator uses a simplified approach for core constraint checking. For full JSON Schema validation, integration with AJV or similar is recommended at the persistence layer.

### Component Registry

Components and views are registered with the interpreter at initialization. Custom registries can be provided via interpreter options.

### Normalization Tracking

All schema migrations are tracked with reason and provenance. This enables diagnostics, migration planning, and version tracking.

## Future Work

1. **Policy System** - Full policy evaluation engine for visibility and execution constraints
2. **Permission System** - Authorization and access control
3. **Runtime State** - Complete workspace state management model
4. **Shell Components** - Reference implementations of canonical zones
5. **Persistence Layer** - Storage adapters for definitions and instances
6. **Audit Trail** - Event-based audit logging and replay
