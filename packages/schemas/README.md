# @awp/schemas

JSON schemas for Agent Workspace Platform.

This package provides canonical JSON Schema definitions for all platform objects, organized into three categories: definitions, runtime, and interpreter schemas.

## Usage

```typescript
import { workspaceDefinition, artifactDefinition, componentTree } from '@awp/schemas';

// Use schemas for validation with AJV or similar
const ajv = new Ajv();
const validate = ajv.compile(workspaceDefinition);
const valid = validate(myWorkspaceData);
```

## Schema Inventory

### Definition Schemas

These define the declarative, portable blueprint for workspace composition and capabilities.

- **workspace-definition.schema.json** - Complete workspace type and shell composition
- **artifact-definition.schema.json** - Durable artifact type definition
- **playbook-definition.schema.json** - Process/orchestration definition
- **agent-definition.schema.json** - Agent role and capabilities
- **skill-definition.schema.json** - Reusable capability for agents/playbooks
- **tool-definition.schema.json** - Bounded callable capability

### Runtime Schemas

These define the live or persisted instances that exist during workspace execution.

- **workspace-instance.schema.json** - Live workspace and its state
- **work-item.schema.json** - Queue item and business anchor
- **artifact-instance.schema.json** - Artifact with versioning
- **knowledge-source.schema.json** - Grounding source for artifacts
- **action.schema.json** - Executable or reviewable next step
- **thread.schema.json** - Conversation context
- **run.schema.json** - Finite execution instance
- **playbook-instance.schema.json** - Running playbook instance
- **agent-session.schema.json** - Long-lived agent context
- **event.schema.json** - Canonical activity record
- **participant.schema.json** - Human or agent actor

### Interpreter & Shell Schemas

These define the output of the interpreter and shell composition.

- **component-tree.schema.json** - Normalized interpreter output
- **workspace-state.schema.json** - Runtime state model

### Policy & Permission Schemas

- **policies.schema.json** - Behavior and visibility constraints
- **permissions.schema.json** - Authorization rules

## Canonical Structure

### WorkspaceDefinition

```json
{
  "workspace": {
    "id": "string",
    "type": "string",
    "version": 1,
    "displayName": "string",
    "layout": "string"
  },
  "zones": [
    { "key": "string", "component": "string" }
  ],
  "bindings": [
    {
      "zone": "string",
      "objectKind": "string",
      "view": "string"
    }
  ],
  "artifacts": [
    { "type": "string", "primary": true }
  ],
  "actions": [
    { "type": "string" }
  ],
  "playbooks": [
    { "type": "string" }
  ]
}
```

### ComponentTree

```json
{
  "workspace": {
    "id": "string",
    "type": "string",
    "version": 1
  },
  "zones": [
    {
      "key": "string",
      "component": "string",
      "bindings": []
    }
  ],
  "bindings": [],
  "components": {},
  "stateBindings": [],
  "metadata": {
    "interpreterVersion": "string",
    "normalizations": [],
    "timestamp": "string"
  }
}
```

## Schema Migration & Versioning

The interpreter normalizes legacy schema formats into canonical form. Supported migrations:

- `root.id` → `workspace.id`
- `workspaceType` → `workspace.type`
- `componentBindings` → `bindings`
- `binding.zoneKey` → `binding.zone`
- `binding.viewKey` → `binding.view`
- `binding.componentType` → `binding.component`
- `binding.objectKind: "task"` → `binding.objectKind: "work_item"`
- `artifact.type: "Output"` → `artifact.type: "Artifact"`

## Validation

All schemas enforce JSON Schema 2020-12 constraints. Recommended validation approaches:

### With AJV

```typescript
import Ajv from 'ajv';
import { workspaceDefinition } from '@awp/schemas';

const ajv = new Ajv();
const validate = ajv.compile(workspaceDefinition);
const valid = validate(data);
if (!valid) {
  console.error(validate.errors);
}
```

### With the @awp/definitions validator

```typescript
import { DefinitionValidator } from '@awp/definitions';

const validator = new DefinitionValidator();
const result = validator.validateWorkspaceDefinition(definition);
console.log(result.errors, result.warnings);
```

## Design Notes

### Required Properties

Each schema defines minimal required properties to ensure referential integrity:

- WorkspaceDefinition: `workspace`, `zones`, `bindings`
- ArtifactDefinition: `id`, `type`, `version`, `displayName`
- PlaybookDefinition: `id`, `type`, `version`, `activities`
- WorkItem: `id`, `type`, `workspaceId`, `status`, `title`

### Extensibility

Schemas use `additionalProperties: false` to enforce strict structure. Custom properties should be namespaced in `metadata` fields.

### Relationships

Schemas reference each other via `$ref` for:
- Policies and permissions references
- Zone and binding definitions
- Artifact and artifact instance relationships

## Inventory Compliance

This schema set satisfies the inventory defined in SCHEMA_INVENTORY.md:

- ✅ All definition-side schemas
- ✅ All runtime-side schemas
- ✅ Interpreter and shell schemas
- ✅ Policy and permission schemas
- ✅ State schema

See [SCHEMA_INVENTORY.md](/SCHEMA_INVENTORY.md) for complete definitions.
