# @awp/definitions

Definition builders and validators for Agent Workspace Platform.

This package provides fluent builder APIs for constructing workspace, artifact, playbook, and agent definitions with validation and sensible defaults. It also includes validators for schema compliance and constraint checking.

## Usage

### Building a Workspace Definition

```typescript
import { WorkspaceDefinitionBuilder } from '@awp/definitions';

const workspace = new WorkspaceDefinitionBuilder('my-workspace', 'decision', 1)
  .displayName('Decision Analysis Workspace')
  .layout('operational')
  .addZone('header', 'Header')
  .addZone('queue', 'Queue')
  .addZone('artifact', 'ArtifactSurface')
  .addZone('knowledge', 'KnowledgePanel')
  .addZone('actions', 'ActionPanel')
  .addBinding('queue', 'work_item', 'queue_view')
  .addBinding('artifact', 'artifact', 'editor_view')
  .addBinding('knowledge', 'knowledge_source', 'list_view')
  .addBinding('actions', 'action', 'actions_view')
  .addArtifact('decision-analysis', true)  // primary artifact
  .addArtifact('decision-options')
  .addAction('request-review')
  .addAction('approve-decision')
  .addPlaybook('decision-workflow')
  .build();
```

### Building an Artifact Definition

```typescript
import { ArtifactDefinitionBuilder } from '@awp/definitions';

const artifactDef = new ArtifactDefinitionBuilder(
  'decision-analysis',
  'decision-analysis',
  'Decision Analysis',
  1
)
  .description('Structured analysis of decision options')
  .addSection('executive-summary', 'Executive Summary', 'text')
  .addSection('decision-statement', 'Decision Statement', 'text')
  .addSection('options', 'Options', 'structured')
  .addSection('recommendation', 'Recommendation', 'text')
  .addAction('request-review', 'Request Review')
  .addAction('approve', 'Approve')
  .build();
```

### Validating a Definition

```typescript
import { DefinitionValidator } from '@awp/definitions';

const validator = new DefinitionValidator();
const result = validator.validateWorkspaceDefinition(workspace);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings);
}
```

## Builders

### WorkspaceDefinitionBuilder

Fluent builder for `WorkspaceDefinition`.

**Methods:**
- `displayName(name: string)` - Set human-readable name
- `layout(layout: string)` - Set layout type (e.g., "operational", "review-heavy")
- `addZone(key: string, component: string)` - Add a shell zone
- `addZoneWithOptions(key, component, opts)` - Add zone with placement/priority
- `addBinding(zone, objectKind, view)` - Bind zone to object kind and view
- `addArtifact(type, primary?)` - Add artifact type reference
- `addAction(type)` - Add action type reference
- `addPlaybook(type)` - Add playbook reference
- `build()` - Validate and return the definition

**Validation:**
- Ensures at least one zone
- Ensures at least one binding
- Verifies binding zone references exist

### ArtifactDefinitionBuilder

Fluent builder for `ArtifactDefinition`.

**Methods:**
- `description(desc: string)` - Set artifact description
- `addSection(key, title, type)` - Add artifact section
- `addSectionWithSchema(key, title, type, schema)` - Add section with JSON schema
- `addRelationship(type, targetType, cardinality)` - Add allowed relationship
- `addAction(type, title)` - Add available action
- `setContentSchema(schema)` - Set overall content schema
- `build()` - Validate and return the definition

**Validation:**
- Optional: warns if no sections defined

### PlaybookDefinitionBuilder

Fluent builder for `PlaybookDefinition`.

**Methods:**
- `description(desc: string)` - Set description
- `startActivity(activityId: string)` - Set starting activity
- `addActivity(activity)` - Add activity
- `addActivityWithDefaults(id, type, title)` - Add activity with defaults
- `addTransition(from, to, condition)` - Add activity transition
- `addSkill(skillId)` - Add required skill
- `addTool(toolId)` - Add required tool
- `setInputSchema(schema)` - Set input schema
- `setOutputSchema(schema)` - Set output schema
- `build()` - Validate and return the definition

**Validation:**
- Ensures at least one activity
- Validates transition references

### AgentDefinitionBuilder

Fluent builder for `AgentDefinition`.

**Methods:**
- `role(role: string)` - Set agent role
- `description(desc: string)` - Set description
- `addSkill(skillId)` - Add skill
- `addTool(toolId)` - Add tool
- `systemPrompt(prompt: string)` - Set system prompt
- `model(model: string)` - Set model identifier
- `build()` - Return the definition

### SkillDefinitionBuilder

Fluent builder for `SkillDefinition`.

**Methods:**
- `description(desc: string)` - Set description
- `addTool(toolId)` - Add tool
- `instructions(instructions: string)` - Set capability instructions
- `setInputSchema(schema)` - Set input schema
- `setOutputSchema(schema)` - Set output schema
- `build()` - Return the definition

### ToolDefinitionBuilder

Fluent builder for `ToolDefinition`.

**Methods:**
- `description(desc: string)` - Set description
- `implementation(impl: string)` - Set implementation reference
- `setParameters(schema)` - Set parameter schema
- `setReturns(schema)` - Set return schema
- `setPolicy(policy)` - Set execution policy
- `build()` - Return the definition

## Validators

### DefinitionValidator

Validates definitions against schemas and enforces platform constraints.

**Methods:**
- `validateWorkspaceDefinition(def)` → `ValidationResult`
- `validateArtifactDefinition(def)` → `ValidationResult`
- `validatePlaybookDefinition(def)` → `ValidationResult`
- `validateAgentDefinition(def)` → `ValidationResult`

**ValidationResult:**
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

interface ValidationError {
  path: string;
  message: string;
  value?: any;
}
```

**Constraint Checks:**

*WorkspaceDefinition*
- At least one zone defined
- At least one binding defined
- All binding zones referenced exist
- Primary artifact count ≤ 1 (warning)

*ArtifactDefinition*
- Warns if no sections defined

*PlaybookDefinition*
- At least one activity defined
- All transitions reference valid activities
- startActivity references valid activity

*AgentDefinition*
- Warns if no role specified
- Warns if no system prompt specified

## Examples

The `examples/` directory includes canonical definitions for vertical workspaces:

### Decision Workspace
```typescript
import { createDecisionWorkspaceDefinition } from './examples/decision-workspace';

const definition = createDecisionWorkspaceDefinition();
```

### Partner Workspace
```typescript
import { createPartnerWorkspaceDefinition } from './examples/partner-workspace';

const definition = createPartnerWorkspaceDefinition();
```

### Common Artifacts
```typescript
import {
  createDecisionAnalysisArtifact,
  createRenewalAnalysisArtifact,
  createPlaybookOutputArtifact,
} from './examples/artifact-examples';

const analysis = createDecisionAnalysisArtifact();
const renewal = createRenewalAnalysisArtifact();
const output = createPlaybookOutputArtifact();
```

## Design Patterns

### Method Chaining

All builders use method chaining for fluent API:

```typescript
const workspace = new WorkspaceDefinitionBuilder(id, type, version)
  .displayName('...')
  .addZone('...', '...')
  .addBinding('...', '...', '...')
  .addArtifact('...')
  .build();
```

### Validation on Build

Complex constraints are validated in the `build()` method:

```typescript
const workspace = new WorkspaceDefinitionBuilder(id, type)
  .addZone('queue', 'Queue')
  .addZone('artifact', 'ArtifactSurface')
  .addBinding('queue', 'work_item', 'queue_view')
  .build();  // Validates: zones exist, bindings reference zones
```

### Default Values

Builders provide sensible defaults:

```typescript
// version defaults to 1
const artifact = new ArtifactDefinitionBuilder(id, type, displayName);

// workspace version defaults to 1
const workspace = new WorkspaceDefinitionBuilder(id, type);
```

## Integration

- **@awp/types** - Builders produce these types
- **@awp/interpreter** - Interpreter consumes built definitions
- **@awp/schemas** - Validators use these schemas

## Testing Guidance

Examples in `examples/` can be used for:
- Builder functionality testing
- Validator constraint checking
- Round-trip definition serialization
- Integration with the interpreter

## Future Enhancements

Potential additions:
- Immutable (frozen) builders
- Builder clone/copy functionality
- Schema-driven builder generation
- Builder validation during construction (early errors)
- Definition template system
