# Implementation Contract

This document is the implementation contract that all future code generation and hand-written code MUST follow.

## Contract Scope

This contract governs:

- Schema design and naming
- Type generation and interfaces
- Interpreter implementation
- Runtime state modeling
- Agent execution
- Artifact versioning
- Project composition

If an implementation idea conflicts with this contract, the contract wins unless the architecture is explicitly re-opened.

## Default Implementation Bias

Implementation MUST prefer fewer, more generic platform abstractions.

Implementation MUST NOT introduce a new platform root concept when an existing abstraction can be specialized.

Default order of preference when adding new concepts:

1. Specialize an existing Platform concept (Tool, Skill, Agent, Project)
2. Add configuration to a definition (Project config, Agent instructions)
3. Add to an extension point (custom Tools, custom Skills)
4. Only then consider a new platform root concept

## 1. Canonical Vocabulary

Implementation MUST use these canonical terms:

**Container & Configuration**
- `Project` - organizing container (not "Workspace")
- `Agent` - autonomous/semi-autonomous actor (first-class, observable)
- `Tool` - external capability (API, function, service)
- `Skill` - composed know-how (reusable combination of Tools/Skills)
- `Schedule` - trigger definition (automation)
- `Channel` - send/receive interface
- `Resource` - context data
- `Artifact` - durable outcome (versioned, auditable)

**Execution & Observation**
- `Run` - execution record (finite, immutable)
- `Thread` - conversation and collaboration
- `Sandbox` - isolated execution environment
- `Eval` - evaluation or assessment

Implementation MUST treat these as deprecated/historical:

- `Workspace` → Use `Project`
- `WorkItem` → Removed (use Agent performing work in Project)
- `Playbook` → Use Agent definition + Schedule
- `Definition/Instance` → Use Tool/Skill (definitions) and Run/Agent (instances)
- `Capability` → Use Tool or Skill
- `Workflow` → Use Agent behavior
- `Integration` → Use Tool
- `componentBindings` → Direct reference to Tools/Skills

## 2. Platform Objects

### Tool Definition

```typescript
interface ToolDefinition {
  id: string;
  name: string;
  version: number;
  description?: string;
  schema: {
    inputs: JSONSchema;
    outputs: JSONSchema;
  };
  implementation: {
    type: 'http' | 'function' | 'process' | 'custom';
    endpoint?: string;
  };
}
```

### Skill Definition

```typescript
interface SkillDefinition {
  id: string;
  name: string;
  version: number;
  instructions: string;
  tools: ToolReference[];
  skills: SkillReference[];
  constraints?: {
    maxConcurrent?: number;
    timeout?: number;
    retryPolicy?: RetryPolicy;
  };
}
```

### Agent Definition

```typescript
interface AgentDefinition {
  id: string;
  name: string;
  type: string; // e.g., 'autonomous', 'supervised', 'reactive'
  version: number;
  instructions: string;
  tools: ToolReference[];
  skills: SkillReference[];
  constraints?: {
    maxIterations?: number;
    timeout?: number;
    sandbox?: SandboxConstraints;
  };
}
```

### Project Definition

```typescript
interface ProjectDefinition {
  id: string;
  name: string;
  version: number;
  agents: AgentReference[];
  tools: ToolReference[];
  skills: SkillReference[];
  channels: ChannelDefinition[];
  schedules: ScheduleDefinition[];
  resources: ResourceDefinition[];
  artifactTypes: ArtifactTypeDefinition[];
  permissions: Permission[];
  policies: Policy[];
}
```

## 3. Runtime Objects

### Run

```typescript
interface Run {
  id: string;
  projectId: string;
  agentId: string;
  
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt: string; // ISO8601
  completedAt?: string;
  
  trigger: {
    type: 'manual' | 'scheduled' | 'event' | 'thread';
    source?: string;
  };
  
  input?: Record<string, any>;
  output?: Record<string, any>;
  artifacts?: string[]; // artifact IDs created
  
  events: Event[];
  error?: string;
  
  metadata?: Record<string, any>;
}
```

### Artifact

```typescript
interface Artifact {
  id: string;
  projectId: string;
  type: string; // Must be defined in Project
  
  version: number;
  status: string; // 'draft' | 'final' | 'archived'
  
  content: Record<string, any>;
  
  createdAt: string;
  createdBy: string; // Agent ID or Human ID
  updatedAt?: string;
  updatedBy?: string;
  
  versions: ArtifactVersion[];
  lineage?: {
    originRunId?: string;
    derivedFrom?: string[]; // artifact IDs
  };
  
  collaborators?: string[]; // participant IDs
  metadata?: Record<string, any>;
}
```

### Thread

```typescript
interface Thread {
  id: string;
  projectId: string;
  
  type: 'conversation' | 'review' | 'discussion';
  status: 'active' | 'resolved' | 'archived';
  
  messages: Message[];
  participants: string[]; // Agent and Human IDs
  
  linkedArtifacts?: string[]; // artifact IDs
  linkedRuns?: string[]; // run IDs
  
  createdAt: string;
  updatedAt?: string;
  
  metadata?: Record<string, any>;
}
```

### Message

```typescript
interface Message {
  id: string;
  authorId: string; // Agent or Human
  authorType: 'agent' | 'human';
  
  content: string;
  timestamp: string;
  
  replyTo?: string; // message ID
  reactions?: Record<string, number>;
  
  metadata?: Record<string, any>;
}
```

## 4. Event Model

Events follow the `<object>.<verb>` pattern:

```typescript
interface Event {
  id: string;
  name: string; // e.g., 'run.started', 'artifact.created'
  
  timestamp: string; // ISO8601
  projectId: string;
  
  subject?: {
    type: string; // 'run', 'artifact', 'thread'
    id: string;
  };
  
  actor?: {
    type: 'agent' | 'human' | 'system';
    id: string;
  };
  
  data: Record<string, any>;
  
  metadata?: Record<string, any>;
}
```

## 5. Interpreter Contract

### Input

The interpreter MUST accept a `ProjectDefinition` or individual definition objects (Tool, Skill, Agent).

### Output

The interpreter MUST produce an executable configuration with:
- Resolved references (Tool/Skill IDs → definitions)
- Validated schemas
- Normalized forms
- Security constraints applied
- Execution sandboxes configured

### Interpretation Stages

1. **Validation** - Definitions conform to schemas
2. **Normalization** - Legacy formats → canonical forms
3. **Resolution** - References → full definitions
4. **Security** - Apply constraints and policies
5. **Compilation** - Generate executable configuration

## 6. Runtime Contract

### Agent Execution

Agents MUST:
- Execute within Sandboxes with resource limits
- Record all invocations as Runs
- Create Artifacts for durable outputs
- Participate in Threads for collaboration
- Report status and errors via Events

### Run Recording

Runs MUST:
- Capture input, output, and error state
- Link to triggering Agent
- Link to created Artifacts
- Include full event history
- Be immutable after completion

### Artifact Versioning

Artifacts MUST:
- Support full version history
- Track provenance (who, when, why)
- Allow concurrent editing with merge semantics
- Support collaborative markup/review
- Be queryable by creation time, creator, type

## 7. No Domain Hardcoding

Implementation MUST:
- Keep all Projects using the same Agent runtime
- Keep all Artifact types defined in Project configuration
- Keep domain language in definitions, not platform code
- Avoid vertical-specific UI or logic in core platform

Different Projects are `ProjectDefinitions` rendered by one platform.

Do not create separate applications or platforms for different domains.

## 8. Backward Compatibility

Implementation MUST handle migration from old vocabulary where necessary:

- `workspace` → `project`
- `workItem` → removed (Agent performs work)
- `playbook` → `schedule` + `agent` definition
- `definition/instance` → `definition` (Tool/Skill/Agent/Project) and `Run`

Normalization SHOULD track all migrations with reason for diagnostics.

## 9. Extensibility Points

Implementation MUST allow:

- Custom Tool implementations (HTTP, functions, services)
- Custom Skill definitions (composing Tools and Skills)
- Custom Agent types (autonomous, supervised, reactive)
- Custom Channel implementations
- Custom Schedule types

But MUST NOT allow creating new platform root concepts through extensions.

## 10. Documentation Requirements

All implementation MUST include:

- Clear mapping between old and new vocabulary in comments
- Reasons for deprecating old concepts
- Migration paths for existing code
- Examples using industry-standard terminology
- References to AGENTS.md and ARCHITECTURE_FREEZE.md

## 11. Code Organization

Implementation MUST organize by platform concept:

```
packages/
  schemas/           # Tool, Skill, Agent, Project, Run, Artifact, Thread
  types/             # TypeScript interfaces
  definitions/       # Builders for definitions
  interpreter/       # Interpret definitions to configs
  runtime/           # Execute Agents, record Runs
  sdk/               # Client SDK for Agent development
  shell/             # Collaboration UI
```

NOT by vertical domain or application.

## 12. Default Conflict Resolution

If a legacy doc or code conflicts with this contract:

1. This contract wins
2. Update the legacy material
3. Track the change in CHANGELOG

The default implementation posture is:

- Align with industry-standard vocabulary
- Prefer generic platform abstractions
- Keep domains in configuration
- Observe and audit everything
