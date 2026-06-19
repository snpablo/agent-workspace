# @awp/interpreter

Workspace interpreter for Agent Workspace Platform.

This package transforms `WorkspaceDefinition` into a `ComponentTree` through a multi-stage interpretation pipeline: normalization, validation, binding resolution, and component tree generation.

## Quick Start

```typescript
import { WorkspaceInterpreter } from '@awp/interpreter';
import { WorkspaceDefinitionBuilder } from '@awp/definitions';

// Build or load a workspace definition
const definition = new WorkspaceDefinitionBuilder('my-workspace', 'decision', 1)
  .displayName('My Decision Workspace')
  .addZone('header', 'Header')
  .addZone('queue', 'Queue')
  .addZone('artifact', 'ArtifactSurface')
  .addBinding('queue', 'work_item', 'queue_view')
  .addBinding('artifact', 'artifact', 'editor_view')
  .addArtifact('decision-analysis', true)
  .build();

// Create interpreter and interpret
const interpreter = new WorkspaceInterpreter();
const result = interpreter.interpret(definition);

if (result.success) {
  console.log('Component Tree:', result.componentTree);
  console.log('Normalizations:', result.componentTree?.metadata.normalizations);
} else {
  console.error('Interpretation errors:', result.errors);
  console.error('Warnings:', result.warnings);
}
```

## Interpretation Pipeline

The interpreter transforms definitions through 5 stages:

### 1. Normalization

Migrates legacy definition formats to canonical form and tracks all transformations.

**Supported Migrations:**
- `root.id` → `workspace.id`
- `root.type` → `workspace.type`
- `workspaceType` → `workspace.type`
- `componentBindings` → `bindings`
- `binding.zoneKey` → `binding.zone`
- `binding.viewKey` → `binding.view`
- `binding.componentType` → `binding.component`
- `binding.objectKind: "task"` → `binding.objectKind: "work_item"`
- `artifact.type: "Output"` → `artifact.type: "Artifact"`

**Output:** `NormalizedDefinition` with provenance of all changes

### 2. Validation

Checks schema compliance and enforces platform constraints.

**Checks:**
- Required properties present (workspace, zones, bindings)
- Property types correct
- Binding zone references exist
- Artifact relationships valid
- Playbook activity references valid

**Output:** Validation errors and warnings

### 3. Binding Resolution

Resolves zone/objectKind/view tuples to concrete component and view definitions.

**Process:**
- For each binding, lookup component and view definitions
- Resolve component properties
- Build view specializations
- Handle missing or ambiguous bindings

**Output:** `ResolvedBinding[]` with resolved component/view definitions

### 4. Policy Evaluation

Evaluates policies and permissions (currently stubbed).

**Future:** Apply visibility rules, access control, and execution constraints

### 5. Component Tree Generation

Produces the final `ComponentTree` ready for shell rendering.

**Output:** Normalized component tree with:
- Resolved zones and bindings
- Component registry
- State bindings
- Interpretation metadata

## API

### WorkspaceInterpreter

Main class orchestrating the interpretation pipeline.

**Constructor:**
```typescript
constructor(options?: InterpreterOptions)
```

**Methods:**

`interpret(definition: any, options?: InterpreterOptions): InterpretationResult`
- Interprets a workspace definition into a component tree
- Returns success/failure with component tree or errors
- Options can override interpreter configuration

`registerComponent(component: ComponentDefinition): void`
- Register a custom component definition
- Components are used during binding resolution

`registerView(view: ViewDefinition): void`
- Register a custom view definition
- Views specialize components for object kinds

**Example:**
```typescript
const interpreter = new WorkspaceInterpreter();

// Register custom components
interpreter.registerComponent({
  key: 'CustomQueue',
  name: 'Custom Queue Component',
  type: 'container',
  description: 'Custom queue implementation',
});

const result = interpreter.interpret(definition);
```

### InterpretationResult

Result object from interpretation.

```typescript
interface InterpretationResult {
  success: boolean;
  componentTree?: ComponentTree;
  errors: InterpretationError[];
  warnings: string[];
  diagnostics?: Record<string, any>;
}
```

### ComponentTree

The primary output of the interpreter.

```typescript
interface ComponentTree {
  workspace: {
    id: string;
    type: string;
    version: number;
    displayName?: string;
    layout?: string;
  };
  zones: RenderedZone[];
  bindings: ResolvedBinding[];
  components: Record<string, ComponentDefinition>;
  stateBindings: StateBinding[];
  metadata: InterpreterMetadata;
}
```

### NormalizedDefinition

Internal representation after normalization.

Includes provenance of all schema migrations and transformations.

## Registries

### ComponentRegistry

Manages component definitions.

```typescript
const registry = new ComponentRegistry();
registry.register(headerComponent);
registry.register(queueComponent);

const header = registry.get('Header');
const containers = registry.getByType('container');
```

**Methods:**
- `register(component)` - Register component
- `registerBatch(components)` - Register multiple components
- `get(key)` - Get by key
- `getAll()` - Get all components
- `has(key)` - Check existence
- `getByType(type)` - Get components of type
- `toObject()` - Export as object

### ViewRegistry

Manages view definitions for object kinds.

```typescript
const registry = new ViewRegistry();
registry.register(workItemQueueView);
registry.register(artifactEditorView);

const views = registry.getByObjectKind('work_item');
const editorView = registry.get('artifact', 'editor_view');
```

**Methods:**
- `register(view)` - Register view (key format: "objectKind:viewKey")
- `registerBatch(views)` - Register multiple views
- `get(objectKind, key)` - Get view by kind and key
- `getAll()` - Get all views
- `has(objectKind, key)` - Check existence
- `getByObjectKind(objectKind)` - Get views for kind
- `getByComponent(componentKey)` - Get views for component
- `toObject()` - Export as object

### Default Registries

The interpreter includes default registries for canonical components and views:

**Canonical Components:**
- `Header` - Workspace header zone
- `Queue` - Work queue zone
- `AssistantSurface` - AI assistant interaction zone
- `ArtifactSurface` - Artifact display and editing zone
- `KnowledgePanel` - Knowledge sources panel
- `AgentPanel` - Agent activity panel
- `ActionPanel` - Actions panel
- `ActivityTimeline` - Event timeline panel
- `ModalSurface` - Modal/overlay zone

**Canonical Views:**
- `work_item_queue` - Work items in Queue
- `artifact_editor` - Artifacts in ArtifactSurface
- `knowledge_sources` - Knowledge sources in KnowledgePanel
- `agent_activity` - Agent sessions in AgentPanel
- `actions_list` - Actions in ActionPanel
- `event_timeline` - Events in ActivityTimeline

## Normalization Details

The normalizer handles legacy format migration with full provenance tracking.

### Migration Examples

**Legacy workspace structure:**
```json
{
  "id": "my-workspace",
  "type": "decision",
  "zones": [],
  "bindings": []
}
```

**Normalized to:**
```json
{
  "workspace": {
    "id": "my-workspace",
    "type": "decision",
    "version": 1
  },
  "zones": [],
  "bindings": []
}
```

**Tracking:**
```typescript
normalizations: [
  {
    from: "root.id",
    to: "workspace.id",
    reason: "Legacy format migration - top-level id moved to workspace object"
  },
  {
    from: "root.type",
    to: "workspace.type",
    reason: "Legacy format migration - top-level type moved to workspace object"
  }
]
```

## Options

### InterpreterOptions

Configuration for interpretation behavior.

```typescript
interface InterpreterOptions {
  validate?: boolean;              // Enable schema validation (default: true)
  normalize?: boolean;             // Enable format normalization (default: true)
  resolveReferences?: boolean;     // Resolve all references (default: true)
  evaluatePolicies?: boolean;      // Evaluate policies (default: false)
  componentRegistry?: Record<...>; // Custom component registry
  viewRegistry?: Record<...>;      // Custom view registry
}
```

**Example:**
```typescript
const result = interpreter.interpret(definition, {
  validate: true,
  normalize: true,
  evaluatePolicies: false,  // TODO: not yet implemented
});
```

## Error Handling

Interpretation errors include diagnostic information:

```typescript
interface InterpretationError {
  code: string;           // VALIDATION_ERROR, MISSING_REQUIRED, etc.
  message: string;        // Human-readable error message
  path?: string;          // JSONPointer path to error location
  suggestion?: string;    // Suggested fix or alternative
}
```

**Example Error:**
```javascript
{
  code: 'VALIDATION_ERROR',
  message: 'Definition must have at least one zone',
  path: 'zones',
  suggestion: 'Add at least one zone definition'
}
```

## Diagnostics

The interpreter provides rich diagnostics in the component tree metadata:

```typescript
result.componentTree?.metadata.normalizations; // All schema migrations
result.componentTree?.metadata.warnings;       // Non-critical issues
result.componentTree?.metadata.interpreterVersion; // Version used
result.componentTree?.metadata.schemaVersion;  // Schema version
result.componentTree?.metadata.timestamp;      // When interpreted
```

## Design Principles

### Domain-Neutral

The interpreter remains generic across all workspace types. Vertical-specific behavior lives in definitions, not the interpreter.

### Normalization First

Legacy formats are normalized before validation. This allows the system to accept both old and new definition formats during transition.

### Provenance Tracking

All schema migrations are tracked with reason and source/target. This enables:
- Diagnostic error messages
- Migration planning
- Version tracking

### Extensible Registries

Custom components and views can be registered at initialization. This allows:
- Custom shell implementations
- Domain-specific components
- Behavioral variants

## Integration

- **@awp/types** - Uses these types
- **@awp/definitions** - Interprets definitions built with builders
- **@awp/schemas** - Validates against schemas
- **@awp/runtime** - Accepts ComponentTree as input (future)

## Testing

The interpreter can be tested with:
- Built definitions from `@awp/definitions` builders
- Example definitions in `@awp/definitions/examples`
- Legacy format definitions for normalization testing
- Custom component registries

## Future Work

1. **Policy Evaluation** - Full policy evaluation engine
2. **Permission Evaluation** - Authorization checking
3. **Layout Resolution** - Resolve responsive and variant layouts
4. **State Binding** - Complete state binding generation
5. **Custom Policies** - Policy language and DSL
6. **Caching** - Cache normalization and interpretation results
