# Agent Platform Architecture V3

**Authoritative Source:** This document is the single source of truth for the Agent Platform architecture.

**Date:** June 2026  
**Version:** 3.0  
**Status:** Frozen

---

## Vision

The Agent Platform enables teams to build AI agent systems that support human-agent collaboration with minimal boilerplate and maximum reusability.

**Core Insight:** Work happens in Projects. Agents perform it. Humans and AI collaborate around durable outcomes. What happened is recorded as events, and what is true now is derived as projections.

### The Model

```
Projects organize context.
Agents perform work.
Tools connect agents to capabilities.
Skills provide reusable know-how.
Channels receive and send messages.
Schedules trigger work.
Artifacts preserve outcomes.
Threads capture collaboration.
Runs record execution.
Resources provide context.
```

The architecture is easier to understand in layers rather than as one flat list.

Events are the canonical runtime record across that model. Connectors are the outbound integration boundary. Both are central enough that they should be named explicitly.

---

## Layered Vocabulary

### Collaboration and Work

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Project** | Organizing container for work | Durable (persisted) |
| **Agent** | Autonomous actor with instructions | Durable (packaged) |
| **Skill** | Reusable know-how (composed tools) | Durable (packaged) |
| **Channel** | Inbound communication interface | Durable (packaged) |
| **Schedule** | Automation trigger | Durable (packaged) |
| **Resource** | Shared context data | Durable (persisted) |
| **Artifact** | Versioned, durable outcome | Durable (persisted) |
| **Thread** | Collaboration context | Durable (persisted) |
| **Run** | Execution record | Durable (persisted) |

### Integration and Capability

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Connector** | Outbound system binding, auth, and routing boundary | Durable (packaged) |
| **Tool** | Discrete operation the model may invoke | Durable (packaged) |

### Runtime Records and State

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Event** | Canonical record of what happened | Durable (persisted) |
| **AgentSession** | Resumable agent participation context | Durable (persisted) |
| **Projection / ProjectState** | Queryable current state rebuilt from events | Durable (persisted) |

---

## Filesystem Package Model

### Directory Structure

```
project/
  project.yaml                  # Project definition
  agents/
    agent-name/
      agent.yaml                # Agent definition
      tools/
        tool-name.yaml
      skills/
        skill-name.yaml
      channels/
        channel-name.yaml       # Inbound surfaces
      connectors/
        connector-name.yaml     # Outbound system bindings
  resources/
    resource-name.yaml          # Shared context
  schedules/
    schedule-name.yaml          # Automation triggers
  artifacts/
    artifact-schema.yaml        # Artifact type definitions
  views/
    workspace.yaml              # Renderer-neutral workspace/view definitions
  threads/
    (none - created at runtime)
  runs/
    (none - created at runtime)
  events/
    (none - created at runtime)
```

### Package Format (YAML)

Every package is a YAML file with metadata:

```yaml
kind: agent|tool|skill|project|channel|connector|schedule|resource
id: unique-identifier
name: Display Name
version: 1.0.0
description: What this does

# Type-specific fields
instructions: |
  Agent instructions or capability description
model: claude-opus
role: strategic-analyst

# References to other packages
tools:
  - id: tool-id
    name: Tool Display Name

skills:
  - id: skill-id

# Implementation details
implementation:
  type: http|mcp|connector|function|platform_service
  endpoint: https://api.example.com
  # ... type-specific config

metadata:
  tags: [decision-support, analysis]
  team: platform
```

### Key Principle: Instructions Live in YAML

Agent instructions are not separate prompts or runtime config. They live in `agent.yaml`:

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
model: claude-opus
instructions: |
  You are an expert strategic decision analyst.
  
  Your responsibilities:
  - Analyze complex business decisions
  - Evaluate options using structured frameworks
  - Identify risks and opportunities
  - Produce detailed analysis artifacts
  
  Process:
  1. Gather decision context
  2. Identify stakeholders
  3. Evaluate each option
  4. Synthesize findings
```

This keeps everything in one place, version-controlled, and portable.

### Filesystem-Native UI Interpretation

The filesystem is the durable definition boundary for the platform. `project.yaml`, `agents/`, `artifacts/`, `resources/`, `schedules/`, and `views/` define what the project is. Runtime history is preserved separately as events, runs, and threads.

UI is not a separate source of truth. It is a projection over:

- the loaded project model
- event-derived current state
- optional view metadata that describes workspace composition

```text
Project Filesystem
    ├── project.yaml
    ├── agents/
    ├── artifacts/
    ├── views/
    ├── threads/
    ├── runs/
    └── events/
            ↓
Project Loader
            ↓
Typed Project Model
            ↓
Event Replay + State Projections
            ↓
UI Interpreter
            ↓
Renderer-Neutral View Tree
            ↓
Renderer
    ├── React
    ├── Ink
    └── Future Renderers
```

This means:

- the filesystem records what the project is
- events record what happened
- projections derive what is true now
- interpreters decide how project state becomes visible workspace structure
- renderers only render that interpreted state

---

## Runtime Model

### Project as Container

A **Project** is the organizing container for all work:

```typescript
interface Project {
  id: string;
  name: string;
  version: string;
  
  // What's in the project
  agents: Agent[];              // Loaded agents with tools/skills
  resources: Resource[];        // Available context data
  schedules: Schedule[];        // Loaded schedules
  
  // Canonical runtime history
  events: Event[];              // Source of truth for what happened

  // Derived current state
  artifacts: Map<id, Artifact>; // Current artifact projection
  threads: Map<id, Thread>;     // Current collaboration projection
  runs: Map<id, Run>;           // Current execution projection
  participants: Map<id, Participant>; // Current participant projection
}
```

### Canonical Rule

The runtime follows one simple rule:

> The system records what happened as events, then derives what is true now as projections.

That means:

- the **event log** is the legal, audit, and coordination truth
- **project state tables/maps** are queryable current-state projections
- **artifacts** remain durable work products
- **threads** remain the human-readable collaboration layer
- **runs** remain execution trace records that are also replayable from events

The UI and most runtime queries should read projections, not raw events. But replay from events must be able to rebuild the same current state.

### Agents Execute in Projects

**Agent** is the actor. When loaded into a project:

```typescript
interface AgentInstance {
  agent: Agent;                 // Agent definition
  tools: Tool[];                // Resolved tools
  skills: Skill[];              // Resolved skills
  status: 'idle' | 'running' | 'complete';
}
```

### Runs Record Execution

A **Run** is how any work is recorded:

```typescript
interface Run {
  id: string;
  projectId: string;
  
  // What executed
  targetKind: 'tool' | 'skill' | 'agent' | 'schedule';
  targetId: string;
  
  // Context
  triggeredBy: string;          // User ID or schedule ID
  input: Record<string, any>;
  
  // Results
  status: 'started' | 'succeeded' | 'failed';
  output: Record<string, any>;
  error?: string;
  
  // Timing
  startedAt: string;
  completedAt?: string;
  
  // References
  threadId?: string;            // If part of discussion
  artifactIds?: string[];       // If created artifacts
}
```

Runs are visible as current-state records, but their authoritative lifecycle is still the event stream:

- `run.started`
- `run.succeeded`
- `run.failed`
- future handoff, retry, cancellation, and resume events

### Artifacts Preserve Outcomes

**Artifact** is the durable work product. Its current state is projected from the event log, and its versions remain durable:

```typescript
interface Artifact {
  id: string;
  projectId: string;
  type: string;                 // e.g., 'analysis', 'report'
  
  // Current projected state
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
  
  // Versioning (automatic)
  version: number;              // Current version
  versions: Array<{
    version: number;
    content: Record<string, any>;
    createdAt: string;
    createdBy: string;
  }>;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  editors: string[];            // All who edited
  
  // References
  runId?: string;               // If created by run
  threadId?: string;            // If discussed
}
```

### Threads Capture Collaboration

**Thread** is the human-readable collaboration layer where humans and agents explain intent, request changes, and document handoffs:

```typescript
interface Thread {
  id: string;
  projectId: string;
  
  // What's being discussed
  targetKind?: 'artifact' | 'run' | 'agent';
  targetId?: string;
  
  // Metadata
  status: 'active' | 'closed';
  createdAt: string;
  createdBy: string;
  participants: string[];       // User and agent IDs
  
  // Activity
  messages: Message[];
  lastMessageAt?: string;
}
```

### Schedules Trigger Work

**Schedule** is a package that defines when work happens:

```yaml
kind: schedule
id: daily-analysis
name: Daily Analysis
type: cron
trigger:
  expression: "0 9 * * *"       # 9 AM daily
action:
  agent_id: decision-analyzer
  input:
    task: Daily strategic analysis
```

When triggered, it creates a **Run** with `targetKind: 'schedule'`.

### Resources Provide Context

**Resource** is shared data available to all agents:

```typescript
interface Resource {
  id: string;
  projectId: string;
  name: string;
  type: string;                 // 'document', 'data', 'config'
  
  content: Record<string, any>; // The actual data
  createdAt: string;
  createdBy: string;
}
```

Examples:
- Company guidelines
- Financial data
- Policy documents
- Configuration files

### Connectors Bind Outbound Systems

**Connector** is a first-class outbound package kind for external system binding.

It is not where user messages enter the platform. It is where an agent reaches outward to authenticate, retrieve context, or perform actions against another system.

Typical responsibilities:

- hold authentication and authorization bindings
- define base URLs, remote servers, tenant/workspace identifiers, or scopes
- describe whether the integration is action-oriented, knowledge-oriented, or hybrid
- surface one or more allowed tools that the agent can actually invoke

Examples:

- an MCP server bound to Google Drive for a specific user session
- a Power Platform connector bound to Salesforce or ServiceNow
- a Microsoft Graph connector that indexes external knowledge into enterprise search
- a Notion workspace connection that exposes document retrieval and update tools

### Events Are Canonical Runtime Truth

**Event** records every action and serves as the canonical runtime system-of-record:

```typescript
interface Event {
  id: string;
  projectId: string;
  name: string;                 // e.g., 'run.started', 'artifact.created'
  timestamp: string;
  
  // What changed
  runId?: string;
  artifactId?: string;
  threadId?: string;
  
  // Canonical details sufficient for projection replay
  payload: Record<string, any>;
}
```

Typical event families include:

- `project.*`
- `item.*` or domain-specific workflow events
- `artifact.*`
- `run.*`
- `human.*`
- `agent_session.*`

Example long-running hiring workflow:

- `ProjectCreated`
- `CandidateQueued`
- `AgentAssigned`
- `AgentStartedRun`
- `ArtifactDrafted`
- `HumanReviewed`
- `HumanRequestedChanges`
- `AgentRevisedArtifact`
- `ApprovalGranted`
- `CandidatePacketCompleted`

The visible workspace state is then derived from those events:

- `Item.status = "Waiting for Human Review"`
- `Artifact.version = 4`
- `Assigned agent = "Research Agent"`
- `Last action = "Human requested changes"`

---

## Tool Model

### Principle: Tools are First-Class

Agents have tools. The platform provides a unified interface to all tool capabilities.

```typescript
interface Tool {
  kind: 'tool';
  id: string;
  name: string;
  
  description: string;          // What it does
  connector?: ConnectorReference; // Outbound binding this tool uses
  implementation: {
    type: 'http' | 'connector' | 'mcp' | 'function' | 'platform_service';
    // Type-specific config
  };
  
  schema?: {
    inputs: object;
    outputs: object;
  };
}
```

### Channels, Connectors, and Tools

These three things play different roles:

- **Channel** is inbound. It is where messages, UI events, or external triggers enter the project.
- **Connector** is outbound. It carries the authenticated system binding and hides credentials, server state, and routing details from the AI.
- **Tool** is the discrete action or retrieval operation the agent is allowed to invoke through that connector.

Examples:

- A Slack channel receives a hiring request.
- A Notion connector authenticates to the workspace.
- The connector exposes tools such as `search_pages`, `read_document`, or `share_link`.

- A Power Platform connector binds to ServiceNow.
- The connector exposes tools such as `Get_Ticket_Details` or `Update_Status`.

- An MCP server binds to Google Drive for a specific user session.
- The connector exposes tools such as `search_files`, `read_document`, and `share_link`.

Operationally:

- the AI sees the tool description, inputs, and purpose
- the AI does not directly see connector credentials or transport details
- one connector can surface many tools
- one tool should execute through exactly one connector interface

### Backing Mechanisms

Tools can be backed by five mechanisms. Each is handled by a **provider**:

| Type | Example | Provider |
|------|---------|----------|
| **API** | REST endpoint, third-party service | `ApiToolProvider` |
| **Connector** | Tool surfaced through a packaged connector binding | `ConnectorToolProvider` |
| **MCP** | Model Context Protocol-backed tool surfaced by a connector/server | `McpToolProvider` |
| **Function** | Python, JavaScript, native code | `NativeToolProvider` |
| **Platform Service** | Built-in (artifact_manager, etc.) | `PlatformServiceToolProvider` |

**Critical:** tools remain the callable capability surface. Connectors define outbound system bindings and can surface many tools. Agents still invoke tools rather than raw connectors.

```typescript
// From agent perspective
const result = await execute({
  toolId: 'search',
  input: { query: 'market trends' }
});

// Platform handles routing to correct provider:
// - If implementation.type === 'http' → ApiToolProvider
// - If implementation.type === 'connector' → ConnectorToolProvider
// - If implementation.type === 'mcp' → McpToolProvider
// - etc.

// Agent doesn't care which provider. Same interface for all.
```

### Skills Compose Tools

**Skill** is reusable know-how built from tools and other skills:

```yaml
kind: skill
id: financial-analysis
name: Financial Analysis
tools:
  - id: search-api
  - id: database-query
skills:
  - id: data-validation
instructions: |
  1. Gather financial data using available tools
  2. Validate data quality
  3. Calculate metrics
```

When an agent uses a skill, the platform:
1. Resolves all tools the skill needs
2. Resolves all skills the skill needs (transitive)
3. Provides them all to the agent

---

## Architecture Principles

### 1. Package-First

Everything is a filesystem-first package (YAML + directory):
- Agents are packages
- Tools are packages
- Connectors are packages
- Skills are packages
- Resources are packages
- Schedules are packages

Benefits:
- Version controlled
- Portable
- Discoverable
- Human-readable
- Git-native

### 2. Project-Centric

All work happens in projects:
- Projects own agents, resources, artifacts, threads, runs, and their event log
- Projects are the atomic unit of execution context
- Projects are the unit of persistence

Benefits:
- Clear scope boundary
- Natural place for canonical event history
- Natural multi-tenancy
- Simple replay and recovery boundary

### 3. Event-Primary Runtime

The runtime is event-primary, but not event-only:

- Events are the source of truth
- Projections provide queryable current state
- Artifacts remain durable outputs
- Threads remain the collaboration surface

Benefits:
- Strong auditability
- Better long-running human-in-the-loop recovery
- Clear retries, handoffs, approvals, and revisions
- Cleaner reconstruction after crashes or restarts

### 4. Artifact-Centric

Durable outcomes are first-class:
- Artifacts are versioned
- Artifacts can be discussed in threads
- Artifacts are the primary deliverable
- Runs create artifacts

Benefits:
- Clear business value
- Collaboration around outcomes
- Complete history
- Audit trail

### 5. Layered Clarity

The platform should name important layers explicitly instead of hiding them:

- work and collaboration concepts
- integration and capability concepts
- runtime record and state concepts

Benefits:
- Easier to understand quickly
- Less confusion about what the AI sees versus what infrastructure manages
- Better alignment between the docs and the actual runtime behavior

### 6. Configuration Over Abstraction

Behavior is configured in YAML, not inherited through class hierarchies:
- Agent behavior is in instructions field
- Tool behavior is in implementation field
- Skill composition is in tools/skills fields

Benefits:
- No code required for variations
- Behavior is version controlled
- Easy to modify
- Non-technical users can understand

### 7. Convention Over Invention

- Follow industry patterns (Agent, Tool, Skill, Run)
- Borrow from established agent-platform and workflow patterns
- Don't invent new patterns
- Align with how agents are already discussed

Benefits:
- Familiar to users
- Proven patterns
- Community alignment
- Less learning curve

### 8. Extensibility Through Providers

New backing mechanisms are added as providers, not new concepts:
- New API type? Add ApiToolProvider variant
- New database? Add ConnectorToolProvider variant
- New protocol? Add new provider

Benefits:
- Clean separation of concerns
- No conceptual bloat
- Easy to extend
- Keep tool model simple

---

## Diagrams

### Project Structure

```
Project
├── Agents (actors)
│   ├── Tools (capabilities)
│   ├── Skills (know-how)
│   ├── Channels (communication)
│   └── Schedules (triggers)
├── Resources (context)
├── Artifacts (outcomes)
│   └── Versions (history)
├── Threads (collaboration)
├── Runs (execution records)
└── Events (canonical history)
```

### Execution Flow

```
Trigger (Manual, Schedule, Message)
    ↓
Create Run
    ↓
Load Agent with Tools/Skills
    ↓
Execute (via ToolProviders)
    ↓
Create Artifacts (if any)
    ↓
Emit Canonical Events
    ↓
Update Projections
```

### Tool Provider Pattern

```
Agent → ToolRegistry → ToolProvider → Execution Mechanism
                    ↓
          ApiToolProvider → HTTP call
          ConnectorToolProvider → Database query
          McpToolProvider → MCP server call
          NativeToolProvider → Function execution
          PlatformServiceToolProvider → Built-in service
```

### Package Hierarchy

```
project/
├── project.yaml (project definition)
├── agents/
│   └── agent-name/
│       ├── agent.yaml (agent definition with instructions)
│       ├── tools/ (tool packages)
│       ├── connectors/ (outbound connector packages)
│       ├── skills/ (skill packages)
│       ├── channels/ (channel packages)
│       ├── schedules/ (schedule packages)
│       ├── evals/ (evaluation definitions)
│       └── sandbox/ (execution constraints)
└── resources/ (resource packages)
```

---

## Examples

### Simple Agent

```yaml
# agents/analyzer/agent.yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
version: 1.0.0
model: claude-opus

instructions: |
  You are a strategic decision analyst.
  Analyze the provided decision using structured frameworks.
  Consider stakeholders, risks, and alternatives.
  Produce a detailed analysis artifact.

tools:
  - id: search-tool
  - id: database-query

skills:
  - id: option-evaluation
```

### Tool (HTTP-Backed)

```yaml
# agents/analyzer/tools/search-tool.yaml
kind: tool
id: search-tool
name: Web Search
version: 1.0.0

description: Search the internet for information

implementation:
  type: http
  endpoint: https://api.search.example.com/search
  method: POST
  auth:
    type: bearer
    token_env: SEARCH_API_KEY
```

### Skill (Composed)

```yaml
# agents/analyzer/skills/option-evaluation.yaml
kind: skill
id: option-evaluation
name: Option Evaluation
version: 1.0.0

tools:
  - id: search-tool
  - id: database-query

instructions: |
  1. Gather information on each option
  2. Evaluate against criteria
  3. Identify pros and cons
  4. Synthesize recommendation
```

### Project Execution

```typescript
// Load packages
const loader = new PackageLoader({ rootPath: './my-project' });
const discovery = await loader.discover();
const registry = new PackageRegistry(discovery.packages);

// Create runtime
const runtime = new ProjectRuntime(registry);

// Initialize project
const context = await runtime.initializeProject({
  project: registry.get('my-project'),
  participants: [{ id: 'user-001', type: 'human', role: 'owner' }],
});

// Execute agent
const result = await runtime.executeRun(context.project.id, {
  targetKind: 'agent',
  targetId: 'decision-analyzer',
  triggeredBy: 'user-001',
  input: { decision: 'Should we expand to new market?' },
});

// Create artifact with outcome
const artifact = await runtime.createArtifact(context.project.id, {
  id: 'analysis-001',
  type: 'decision-analysis',
  title: 'Market Expansion Analysis',
  content: result.run.output,
  createdBy: 'agent-decision-analyzer',
});

// Create thread for discussion
const thread = await runtime.createThread(context.project.id, {
  id: 'discussion-001',
  targetKind: 'artifact',
  targetId: 'analysis-001',
  participants: ['user-001'],
});
```

---

## Summary

The Agent Platform is organized in three explicit layers:

### Collaboration and Work
- Project, Agent, Skill, Artifact, Thread, Run, Resource, Schedule, Channel

### Integration and Capability
- Connector, Tool

### Runtime Records and State
- Event, AgentSession, projected current state

### Execution (Through Providers)
- Tools are backed by providers (API, Connector, MCP, Function, Service)

Everything flows from this model. The runtime records what happened as events, then derives current collaborative state as projections.

**Extensibility:**
- Sandbox: Agent configuration (constraints field)
- Eval: Optional package kind for future evaluation systems

---

## Architecture Decision Records (ADRs)

This architecture is formalized through Architecture Decision Records. See [adr/README.md](adr/README.md) for the ADR guide and recommended reading order:

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](adr/ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) | Project as Primary Container | Accepted |
| [ADR-002](adr/ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) | Package-First Architecture | Accepted |
| [ADR-003](adr/ADR-003-YAML-ROOTED-PACKAGES.md) | YAML-Rooted Packages | Accepted |
| [ADR-004](adr/ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md) | Instructions Embedded in YAML | Accepted |
| [ADR-005](adr/ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md) | Artifact-Centric Outputs | Accepted |
| [ADR-006](adr/ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) | Tools as Primary Capability Model | Accepted |
| [ADR-007](adr/ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md) | Channels and Schedules as First-Class | Accepted |
| [ADR-008](adr/ADR-008-MINIMAL-ONTOLOGY.md) | Layered Platform Model | Accepted |
| [ADR-009](adr/ADR-009-BORROW-BEFORE-INVENTING.md) | Borrow Before Inventing | Accepted |
| [ADR-010](adr/ADR-010-EVENT-CANONICAL-RUNTIME.md) | Event-Canonical Runtime | Accepted |
| [ADR-011](adr/ADR-011-CONNECTORS-AS-OUTBOUND-BINDINGS.md) | Connectors as Outbound Bindings | Accepted |
Read the ADRs to understand the reasoning behind each architectural decision.

---

## References

This document is authoritative. All other documentation should reference it.

Related documents:
- [README.md](../../README.md) - Repository overview and learning path
- [../examples/README.md](../examples/README.md) - Architecture V3 example projects
- [../posters/README.md](../posters/README.md) - Visual runtime and platform explanations

Implementation:
- [@awp/types](../../packages/types) - TypeScript definitions
- [@awp/loader](../../packages/loader) - Package loading
- [@awp/runtime](../../packages/runtime) - Project execution
- [@awp/tools](../../packages/tools) - Tool execution

---

**Last Updated:** June 2026  
**Status:** Production  
**Canonical:** Yes - All documentation defers to this document
