# @awp/types

TypeScript type definitions for Agent Platform.

This package provides the canonical type system for the platform. Definitions are filesystem packages, and runtime state is kept in runtime types.

## Type Model

The package model is:
```
Tool, Skill, Agent, Project (filesystem packages)
  ↓
PackageMetadata (kind, id, name, version, sourcePath)

Artifact, Run, Thread, AgentSession (runtime state)
  ↓
ProjectState (complete runtime state of a project)
```

Definitions are YAML files on disk. Runtime objects are live execution state.

## Usage

```typescript
import {
  Project,       // Filesystem package definition
  Agent,         // Filesystem package definition  
  Tool,          // Filesystem package definition
  Run,           // Runtime execution record
  Artifact,      // Runtime outcome
  Thread,        // Runtime conversation
  ProjectState,  // Complete runtime state
} from '@awp/types';

// Define an agent (filesystem package)
const agent: Agent = {
  kind: 'agent',
  id: 'decision-analyzer',
  name: 'Decision Analyzer',
  version: '1.0.0',
  sourcePath: 'agents/decision-analyzer/agent.yaml',
  instructions: 'You are a decision analyst...',
  tools: [
    { id: 'search-tool', name: 'Search', required: true },
  ],
};

// Runtime execution
const run: Run = {
  id: 'run-001',
  projectId: 'proj-001',
  agentId: 'decision-analyzer',
  status: 'running',
  startedAt: new Date().toISOString(),
  targetKind: 'tool',
  targetId: 'search-tool',
};
```

## Type Categories

### Package Definitions (src/definitions.ts)

Filesystem packages with metadata.

**Base**
- `PackageMetadata` - Common metadata for all packages (kind, id, name, version, sourcePath)

**Package Types**
- `Tool` - External capability (API, MCP, connector, function, service)
- `Connector` - Outbound system binding (OAuth, MCP server, SaaS, enterprise index)
- `Skill` - Reusable know-how (composes tools and skills)
- `Agent` - Actor definition (role, instructions, tools, skills)
- `Project` - Organizing container (agents, resources, artifacts, channels, connectors, schedules)
- `Channel` - Inbound communication interface (Slack, email, webhook, etc.)
- `Schedule` - Trigger definition (cron, event, manual)
- `Resource` - Context data (documents, configs, credentials, data)
- `Sandbox` - Execution constraints (limits, permissions)
- `ArtifactType` - Artifact type definition

**References**
- `ToolReference`, `SkillReference`, `AgentReference` - Links between packages
- `ResourceReference`, `ChannelReference`, `ConnectorReference`, `ScheduleReference` - Cross-package references

### Runtime State (src/runtime.ts)

Live execution objects.

**Core Runtime**
- `Run` - Finite execution instance (tool invocation, skill execution, agent action)
- `Artifact` - Durable outcome with versioning and audit trail
- `ArtifactVersion` - Immutable snapshot of artifact
- `Thread` - Conversation or discussion
- `Message` - Message in a thread
- `Event` - Activity record

**Agents & Collaboration**
- `AgentSession` - Long-lived agent participation context
- `Participant` - Human or agent actor in a project
- `Resource` - Context data in a project

**State Container**
- `ProjectState` - Complete runtime state of a project

**Status Types**
- `RunStatus` - 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled'
- `ThreadStatus` - 'active' | 'closed' | 'archived'
- `ArtifactStatus` - 'draft' | 'active' | 'archived'
- `ParticipantRole` - 'owner' | 'editor' | 'reviewer' | 'viewer'

### Interpreter (src/interpreter.ts)

Component tree and interpretation structures (UI concerns).

**Interpreter Output**
- `ComponentTree` - Normalized interpreter output for UI rendering
- `RenderedZone`, `ResolvedBinding` - Resolved UI structure
- `ComponentDefinition`, `ViewDefinition` - UI primitives

**Interpretation**
- `InterpretationResult` - Outcome of interpretation
- `NormalizedDefinition` - Representation after normalization

## Type Patterns

### Package Metadata

All packages include metadata about themselves:

```typescript
const tool: Tool = {
  kind: 'tool',
  id: 'search-api',
  name: 'Search API',
  version: '2.1.0',
  sourcePath: 'agents/my-agent/tools/search-api.yaml',
  description: 'Search external knowledge...',
  implementation: { type: 'http', endpoint: '...' },
};
```

### Runtime Relationships

Runtime objects link to packages and each other:

```typescript
const run: Run = {
  id: 'run-001',
  projectId: 'proj-001',      // Links to project package
  agentId: 'agent-001',        // Links to agent package
  targetKind: 'tool',          // What was invoked
  targetId: 'search-api',      // ID of what was invoked
  threadId: 'thread-001',      // Associated thread
  agentSessionId: 'session-001', // Agent session context
  status: 'running',
  startedAt: '2026-06-19T...',
};
```

### Optional Metadata

Most types include optional `metadata` for extension:

```typescript
interface MyObject {
  id: string;
  metadata?: Record<string, any>;
}
```

## Design Principles

### Filesystem-First Definitions

Definitions ARE filesystem packages:
- Tool is a `tools/tool.yaml` file
- Skill is a `skills/skill.yaml` file
- Agent is an `agent.yaml` file
- Project is a `project.yaml` file

Package metadata includes `sourcePath` for discovery.

### Definitions and Runtime State

- Tool is a filesystem package
- Agent is a filesystem package
- ArtifactType describes artifact structure
- Artifact, Run, Thread, and ProjectState represent runtime state

### Canonical Vocabulary

Types use industry-standard agent platform vocabulary:
- `Project`
- `Agent`
- `Tool`
- `Skill`
- `Run`
- `Artifact`
- `Thread`
- `Resource`

### Minimal Interfaces

Types include required and commonly-used fields. Extensions use `metadata`.

## Usage Examples

### Creating a Package Definition

```typescript
import { Tool, Skill, Agent, Project } from '@awp/types';

const searchTool: Tool = {
  kind: 'tool',
  id: 'search',
  name: 'Web Search',
  version: '1.0.0',
  sourcePath: 'agents/analyst/tools/search.yaml',
  description: 'Search the web for information',
  implementation: { type: 'http', endpoint: 'https://...' },
  parameters: { type: 'object', properties: { query: { type: 'string' } } },
  returns: { type: 'object', properties: { results: { type: 'array' } } },
};

const analyst: Agent = {
  kind: 'agent',
  id: 'decision-analyst',
  name: 'Decision Analyst',
  version: '1.0.0',
  sourcePath: 'agents/decision-analyst/agent.yaml',
  instructions: 'You analyze strategic decisions...',
  tools: [{ id: 'search', name: 'Search' }],
  model: 'claude-opus',
};
```

### Creating Runtime State

```typescript
import { ProjectState, Run, Artifact, Thread } from '@awp/types';

const projectState: ProjectState = {
  projectId: 'my-project',
  artifacts: [],
  runs: [],
  threads: [],
  resources: [],
  agentSessions: [],
  participants: [],
  events: [],
};

const run: Run = {
  id: 'run-001',
  projectId: 'my-project',
  agentId: 'decision-analyst',
  status: 'running',
  startedAt: new Date().toISOString(),
  targetKind: 'tool',
  targetId: 'search',
};
```

## Integration with Other Packages

- **@awp/schemas** - JSON Schema for validation; types align with schemas
- **@awp/definitions** - Builders create these package types
- **@awp/interpreter** - Interprets package definitions
- **@awp/runtime** - Uses runtime state types

## Architecture Alignment

This package reflects Architecture V3: filesystem package definitions plus runtime state types aligned with event-canonical runtime behavior.
Use [ARCHITECTURE_V3.md](../../docs/architecture/ARCHITECTURE_V3.md) and the [ADR guide](../../docs/architecture/adr/README.md) as the canonical reference.
