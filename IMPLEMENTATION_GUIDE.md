# Implementation Guide: Packages & Architecture

This document describes the implementation of the core packages and how they fit into the Agent Workspace Platform architecture.

## Overview

The implementation consists of four interdependent packages:

```
packages/
├── schemas/        # JSON schema definitions
├── types/          # TypeScript type definitions
├── definitions/    # Definition builders and validators
└── interpreter/    # Workspace definition → component tree transformation
```

## Architecture Flow

```
WorkspaceDefinition (YAML/JSON)
        ↓
    Built with @awp/definitions builders
        ↓
Workspace Interpreter (@awp/interpreter)
    │
    ├─ Normalization (migrate legacy formats)
    ├─ Validation (schema and constraint checks)
    ├─ Binding Resolution (select components/views)
    ├─ Policy Evaluation (evaluate constraints)
    └─ Component Tree Generation (normalized output)
        ↓
ComponentTree (ready for shell rendering)
        ↓
Workspace Runtime (@awp/runtime - future)
        ↓
Workspace Shell (@awp/shell - future)
```

## Package Responsibilities

### @awp/schemas

**Purpose:** Canonical JSON Schema definitions for all platform objects

**Exports:**
- Definition schemas: `workspaceDefinition`, `artifactDefinition`, `playbookDefinition`, `agentDefinition`, `skillDefinition`, `toolDefinition`
- Runtime schemas: `workspaceInstance`, `workItem`, `artifactInstance`, `run`, `event`, `agentSession`, etc.
- Interpreter schemas: `componentTree`
- Policy/permission schemas: `policies`, `permissions`

**Key Concepts:**
- Defines the shape of all objects
- Enforces required properties and types
- Enables validation and code generation
- Versioned alongside implementations

### @awp/types

**Purpose:** TypeScript type definitions aligned with schemas

**Organization:**
- `src/definitions.ts` - Workspace composition types
- `src/runtime.ts` - Live instance types
- `src/interpreter.ts` - Transformation types

**Key Interfaces:**

*Definitions:*
```typescript
WorkspaceDefinition    // Complete workspace type
ArtifactDefinition     // Artifact type definition
PlaybookDefinition     // Process definition
AgentDefinition        // Agent capabilities
SkillDefinition        // Reusable capability
ToolDefinition         // Callable capability
```

*Runtime:*
```typescript
WorkspaceInstance      // Live workspace
WorkItem               // Queue item
ArtifactInstance       // Artifact with versioning
Run                    // Execution instance
Event                  // Activity record
AgentSession           // Agent context
WorkspaceState         // Complete state model
```

*Interpreter:*
```typescript
ComponentTree          // Interpreter output
ComponentDefinition    // UI component
ViewDefinition         // Component variant
InterpretationResult   // Transformation result
```

### @awp/definitions

**Purpose:** Fluent builders and validators for creating definitions

**Builders:**
```typescript
WorkspaceDefinitionBuilder
ArtifactDefinitionBuilder
PlaybookDefinitionBuilder
AgentDefinitionBuilder
SkillDefinitionBuilder
ToolDefinitionBuilder
```

**Validators:**
```typescript
DefinitionValidator
```

**Usage Pattern:**
```typescript
const definition = new WorkspaceDefinitionBuilder(id, type, version)
  .displayName('...')
  .addZone('...', '...')
  .addBinding('...', '...', '...')
  .addArtifact('...')
  .build();  // Validates and returns

const validator = new DefinitionValidator();
const result = validator.validateWorkspaceDefinition(definition);
```

**Examples:**
```
examples/
├── decision-workspace.ts      # Decision vertical
├── partner-workspace.ts       # Partner vertical
└── artifact-examples.ts       # Common artifacts
```

### @awp/interpreter

**Purpose:** Transform WorkspaceDefinition into ComponentTree

**Main Class:**
```typescript
WorkspaceInterpreter
```

**Interpretation Pipeline:**
1. Normalization - Migrate legacy formats
2. Validation - Check schema compliance
3. Binding Resolution - Select components
4. Policy Evaluation - Apply constraints (TODO)
5. Component Tree Generation - Produce output

**Supporting Classes:**
```typescript
ComponentRegistry       // Manage components
ViewRegistry          // Manage views
NormalizationContext  // Track migrations
```

## Integration Points

### Building a Workspace

```typescript
// 1. Create definition with @awp/definitions
const definition = new WorkspaceDefinitionBuilder('my-workspace', 'decision')
  .displayName('My Workspace')
  .addZone('queue', 'Queue')
  .addZone('artifact', 'ArtifactSurface')
  .addBinding('queue', 'work_item', 'queue_view')
  .addBinding('artifact', 'artifact', 'editor_view')
  .build();

// 2. Validate with @awp/definitions
const validator = new DefinitionValidator();
if (!validator.validateWorkspaceDefinition(definition).valid) {
  throw new Error('Invalid workspace definition');
}

// 3. Interpret with @awp/interpreter
const interpreter = new WorkspaceInterpreter();
const result = interpreter.interpret(definition);

if (!result.success) {
  throw new Error('Interpretation failed');
}

// 4. Use component tree
const tree = result.componentTree;
// Pass to shell rendering engine
```

## Canonical Patterns

### Workspace Definition Canonical Form

All definitions normalize to this structure:

```json
{
  "workspace": {
    "id": "string (required)",
    "type": "string (required)",
    "version": "integer (required, ≥ 1)",
    "displayName": "string (optional)",
    "layout": "string (optional)"
  },
  "zones": [
    { "key": "string", "component": "string", ... }
  ],
  "bindings": [
    { "zone": "string", "objectKind": "string", "view": "string", ... }
  ],
  "artifacts": [
    { "type": "string", "primary": "boolean" }
  ],
  "actions": [
    { "type": "string" }
  ],
  "playbooks": [
    { "type": "string" }
  ]
}
```

### Component Tree Canonical Form

Interpreter output always has this structure:

```json
{
  "workspace": { "id", "type", "version", "displayName", "layout" },
  "zones": [ { "key", "component", "bindings" } ],
  "bindings": [ { "zone", "objectKind", "view", "componentDef", "viewDef" } ],
  "components": { "componentKey": ComponentDefinition },
  "stateBindings": [ { "componentKey", "stateProperty", "path" } ],
  "metadata": {
    "interpreterVersion": "string",
    "schemaVersion": "string",
    "normalizations": [ { "from", "to", "reason" } ],
    "warnings": [ "string" ],
    "errors": [ "string" ],
    "timestamp": "ISO8601"
  }
}
```

### Canonical Vocabulary

The implementation enforces these canonical terms:

| Term | Legacy | Canonical |
|------|--------|-----------|
| Artifact type | `Output` | `Artifact` |
| Queue root | `task` (binding) | `work_item` |
| Zone reference | `zoneKey` | `zone` |
| View reference | `viewKey` | `view` |
| Component reference | `componentType` | `component` |
| Workspace id | `id` (root) | `workspace.id` |
| Workspace type | `type` (root) or `workspaceType` | `workspace.type` |
| Bindings collection | `componentBindings` | `bindings` |

## Design Decisions

### Normalization Happens First

Legacy formats are normalized before validation. This allows:
- Gradual migration from old to new formats
- Single validation path
- Diagnostic tracking of changes

Example:
```typescript
// Input with legacy format
const legacy = {
  id: 'my-ws',
  type: 'decision',
  componentBindings: [...]
};

// Normalized to canonical form
const normalized = {
  workspace: { id: 'my-ws', type: 'decision', version: 1 },
  bindings: [...]
};
```

### Builders Validate on Build

Complex constraints are validated only in the `build()` method. This provides:
- Immediate feedback on definition errors
- Ability to compose without intermediate validation
- Clear error messages at the end

```typescript
const def = new WorkspaceDefinitionBuilder(id, type)
  .addZone('queue', 'Queue')
  .addBinding('queue', 'work_item', 'queue_view')
  .build();  // Validates: zones exist, binding zone matches
```

### Registries Are Extensible

Component and view registries can be customized per interpreter instance:

```typescript
const interpreter = new WorkspaceInterpreter(options);
interpreter.registerComponent(customComponent);
interpreter.registerView(customView);
```

This allows:
- Custom shell implementations
- Domain-specific components
- Alternative renderings

### Provenance Tracking

All schema migrations track what changed and why:

```typescript
{
  from: 'root.id',
  to: 'workspace.id',
  reason: 'Legacy format migration - top-level id moved to workspace object'
}
```

This enables:
- Migration planning and auditing
- Backward compatibility warnings
- Version tracking

## Testing Strategy

### Unit Tests

Test each package independently:

```bash
# Test schemas
yarn workspace @awp/schemas test

# Test types (structural, not functional)
yarn workspace @awp/types test

# Test builders and validators
yarn workspace @awp/definitions test

# Test interpreter
yarn workspace @awp/interpreter test
```

### Integration Tests

Test the full pipeline:

```typescript
import { WorkspaceDefinitionBuilder } from '@awp/definitions';
import { DefinitionValidator } from '@awp/definitions';
import { WorkspaceInterpreter } from '@awp/interpreter';

// 1. Build definition
const definition = new WorkspaceDefinitionBuilder('test', 'test')
  .addZone('q', 'Queue')
  .addBinding('q', 'work_item', 'queue_view')
  .build();

// 2. Validate
const validator = new DefinitionValidator();
expect(validator.validateWorkspaceDefinition(definition).valid).toBe(true);

// 3. Interpret
const interpreter = new WorkspaceInterpreter();
const result = interpreter.interpret(definition);
expect(result.success).toBe(true);
expect(result.componentTree).toBeDefined();
```

### Example-Based Tests

Use canonical examples for regression testing:

```typescript
import {
  createDecisionWorkspaceDefinition,
  createPartnerWorkspaceDefinition,
} from '@awp/definitions/examples';

describe('Interpreter with Examples', () => {
  it('interprets decision workspace', () => {
    const def = createDecisionWorkspaceDefinition();
    const result = interpreter.interpret(def);
    expect(result.success).toBe(true);
  });

  it('interprets partner workspace', () => {
    const def = createPartnerWorkspaceDefinition();
    const result = interpreter.interpret(def);
    expect(result.success).toBe(true);
  });
});
```

## Building and Publishing

### Local Development

```bash
# Install dependencies
yarn install

# Build all packages
yarn workspaces run build

# Or individually
yarn workspace @awp/schemas build
yarn workspace @awp/types build
yarn workspace @awp/definitions build
yarn workspace @awp/interpreter build
```

### Publishing (Future)

When ready to publish:

```bash
# Update versions
yarn version

# Build
yarn workspaces run build

# Publish to npm
npm publish
```

## Next Phases

### Phase 2: Runtime State
- `@awp/runtime` - Workspace state management
- State persistence and serialization
- Event model and event sourcing
- Audit trails and versioning

### Phase 3: Workspace Shell
- `@awp/shell` - Reference shell implementation
- Zone and component rendering
- State binding and reactivity
- User interaction handling

### Phase 4: Applications
- Decision Workspace
- Partner Workspace
- HR Workspace
- Finance Workspace

All built on the platform using only definitions, no platform code changes.

## Documentation Structure

```
docs/
├── README.md                           # Overview
├── specification/v1/
│   ├── metamodel.md                   # Type relationships
│   ├── interpreter.md                 # Interpretation algorithm
│   ├── runtime-state.md               # State model
│   └── persistence.md                 # Persistence layer
├── architecture/
│   ├── canonical-domain-model.md      # Object semantics
│   └── workspace-shell.md             # Shell architecture
└── verticals/
    ├── decision-workspace.md          # Decision examples
    ├── partner-workspace.md           # Partner examples
    ├── hr-workspace.md                # HR examples
    └── finance-workspace.md           # Finance examples

AGENTS.md                              # Starting context for agents
ARCHITECTURE_FREEZE.md                 # Frozen decisions
CANONICAL_MODEL.md                     # Object boundaries
IMPLEMENTATION_CONTRACT.md             # Implementation obligations
SCHEMA_INVENTORY.md                    # Schema definitions
IMPLEMENTATION_GUIDE.md                # This file
```

## Key Files

**Root Configuration:**
- `package.json` - Monorepo workspace configuration
- `tsconfig.base.json` - Shared TypeScript configuration
- `.gitignore` - Version control

**Packages:**
```
packages/
├── schemas/
│   ├── package.json
│   ├── index.js           # Export all schemas
│   ├── index.d.ts         # TypeScript definitions
│   └── *.schema.json      # 20+ JSON schemas
├── types/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts       # Main export
│   │   ├── definitions.ts # Definition types
│   │   ├── runtime.ts     # Runtime types
│   │   └── interpreter.ts # Interpreter types
│   └── tsconfig.json
├── definitions/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts       # Main export
│   │   ├── builders.ts    # All builders
│   │   └── validator.ts   # Definition validator
│   ├── examples/
│   │   ├── decision-workspace.ts
│   │   ├── partner-workspace.ts
│   │   └── artifact-examples.ts
│   └── tsconfig.json
└── interpreter/
    ├── package.json
    ├── src/
    │   ├── index.ts       # Main export
    │   ├── interpreter.ts # Main interpreter
    │   ├── normalizer.ts  # Legacy migration
    │   └── registry.ts    # Component registries
    └── tsconfig.json
```

## Summary

The four-package implementation provides:

1. **Schemas** - Canonical JSON schema definitions
2. **Types** - TypeScript type system aligned with schemas
3. **Definitions** - Fluent builders and validators
4. **Interpreter** - Transformation engine: definitions → component trees

Together they implement the core "Definition → Interpreter → ComponentTree" flow that is the architectural center of gravity for the platform. All downstream work (runtime, shell, applications) depends on these packages being stable, correct, and well-documented.
