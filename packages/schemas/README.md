# @awp/schemas

JSON schemas for Agent Platform.

This package provides canonical JSON Schema definitions for platform concepts: Project, Agent, Tool, Skill, Channel, Schedule, Resource, Artifact, Thread, Run, and Event.

## Usage

```typescript
import { project, artifact, run, thread } from '@awp/schemas';

// Use schemas for validation with AJV or similar
const ajv = new Ajv();
const validate = ajv.compile(project);
const valid = validate(myProjectData);
```

## Schema Inventory

### Schemas

- **project.schema.json** - Project container and organization
- **artifact.schema.json** - Versioned outcomes and durable results
- **run.schema.json** - Execution records (tool/skill/agent/schedule)
- **thread.schema.json** - Collaboration context and discussion
- **event.schema.json** - Audit trail and activity records
- **participant.schema.json** - Humans and agents in projects
- **resource.schema.json** - Shared context data

### Supporting Schemas

- **permissions.schema.json** - Access control
- **policies.schema.json** - Project policies

- **component-tree.schema.json** - Normalized interpreter output
- **workspace-state.schema.json** - Runtime state schema used by interpreter-oriented flows

### Policy & Permission Schemas

- **policies.schema.json** - Behavior and visibility constraints
- **permissions.schema.json** - Authorization rules

## Canonical Structure

### Project-Oriented Structure Example

```json
{
  "project": {
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
  "runs": [
    { "type": "string" }
  ]
}
```

### Component Tree Example

```json
{
  "project": {
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

## Schema Versioning

Schemas evolve by updating the package definitions and runtime structures while preserving a single Architecture V3 vocabulary across the repository.

Connector schemas describe outbound integration bindings separately from tool schemas, so authentication and system binding can evolve independently from the discrete operations the model is allowed to call.

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

### With a package validator

```typescript
import { DefinitionValidator } from '@awp/definitions';

const validator = new DefinitionValidator();
const result = validator.validateProjectDefinition(definition);
console.log(result.errors, result.warnings);
```

## Design Notes

### Required Properties

Each schema defines minimal required properties to ensure referential integrity and stable package loading.

### Extensibility

Schemas use `additionalProperties: false` to enforce strict structure. Custom properties should be namespaced in `metadata` fields.

### Relationships

Schemas reference each other via `$ref` for:
- Policies and permissions references
- Zone and binding definitions
- Artifact and runtime relationships

## Inventory Compliance

This schema set satisfies the inventory defined in SCHEMA_INVENTORY.md:

- ✅ All definition-side schemas
- ✅ All runtime-side schemas
- ✅ Interpreter and shell schemas
- ✅ Policy and permission schemas
- ✅ State schema

See [SCHEMA_INVENTORY.md](/SCHEMA_INVENTORY.md) for complete definitions.
