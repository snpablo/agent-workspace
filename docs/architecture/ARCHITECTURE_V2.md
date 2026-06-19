# Agent Platform Architecture V2

**Authoritative Source:** This document is the single source of truth for the Agent Platform architecture.

**Date:** June 2026  
**Version:** 2.0  
**Status:** Production

---

## Vision

The Agent Platform enables teams to build AI agent systems that support human-agent collaboration with minimal boilerplate and maximum reusability.

**Core Insight:** Work happens in Projects. Agents perform it. Humans and AI collaborate around durable outcomes.

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

This is the complete model. Nothing else is needed.

---

## Core Vocabulary

The platform uses exactly 12 concepts:

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Project** | Organizing container for work | Durable (persisted) |
| **Agent** | Autonomous actor with instructions | Durable (packaged) |
| **Tool** | Interface to external capability | Durable (packaged) |
| **Skill** | Reusable know-how (composed tools) | Durable (packaged) |
| **Channel** | Communication interface | Durable (packaged) |
| **Schedule** | Automation trigger | Durable (packaged) |
| **Resource** | Shared context data | Durable (persisted) |
| **Artifact** | Versioned, durable outcome | Durable (persisted) |
| **Thread** | Collaboration context | Durable (persisted) |
| **Run** | Execution record | Durable (persisted) |
| **Eval** | Quality evaluation definition | Durable (packaged) |
| **Sandbox** | Execution constraints | Durable (packaged) |

**No other concepts exist.**

Everything maps cleanly to one of these 12. If you find yourself needing something else, you're over-modeling.

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
        channel-name.yaml
      schedules/
        schedule-name.yaml
      evals/
        eval-name.yaml
      sandbox/
        sandbox.yaml
  resources/
    resource-name.yaml          # Shared context
  artifacts/
    artifact-schema.yaml        # Artifact type definitions
  threads/
    (none - created at runtime)
  runs/
    (none - created at runtime)
  schedules/
    (none - part of agents)
```

### Package Format (YAML)

Every package is a YAML file with metadata:

```yaml
kind: agent|tool|skill|project|channel|schedule|resource|eval|sandbox
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
  
  // Project state
  artifacts: Map<id, Artifact>; // Versioned outcomes
  threads: Map<id, Thread>;     // Collaboration contexts
  runs: Map<id, Run>;           // Execution records
  participants: Map<id, Participant>; // Humans and agents
  events: Event[];              // Complete audit trail
}
```

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

### Runs Record Everything

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

### Artifacts Preserve Outcomes

**Artifact** is versioned, durable:

```typescript
interface Artifact {
  id: string;
  projectId: string;
  type: string;                 // e.g., 'analysis', 'report'
  
  // Current state
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

**Thread** is where humans and agents discuss:

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

### Events Form the Audit Trail

**Event** records every action:

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
  
  // Details
  payload: Record<string, any>;
}
```

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

### Backing Mechanisms (Not Primary Concepts)

Tools can be backed by five mechanisms. Each is handled by a **provider**:

| Type | Example | Provider |
|------|---------|----------|
| **API** | REST endpoint, third-party service | `ApiToolProvider` |
| **Connector** | Database, SaaS (Salesforce, etc.) | `ConnectorToolProvider` |
| **MCP** | Model Context Protocol server | `McpToolProvider` |
| **Function** | Python, JavaScript, native code | `NativeToolProvider` |
| **Platform Service** | Built-in (artifact_manager, etc.) | `PlatformServiceToolProvider` |

**Critical:** APIs, connectors, and MCP are **implementation details**. They are not primary ontology concepts. Agents see only the tool interface, not the backing mechanism.

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
- Projects own agents, resources, artifacts, threads, runs
- Projects are the atomic unit of execution context
- Projects are the unit of persistence

Benefits:
- Clear scope boundary
- Easy to reason about
- Natural multi-tenancy
- Simple persistence model

### 3. Artifact-Centric

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

### 4. Minimal Ontology

Only 12 concepts. No more. Period.

Benefits:
- Easy to learn
- Easy to implement
- Easy to extend
- No confusion about concepts

### 5. Configuration Over Abstraction

Behavior is configured in YAML, not inherited through class hierarchies:
- Agent behavior is in instructions field
- Tool behavior is in implementation field
- Skill composition is in tools/skills fields

Benefits:
- No code required for variations
- Behavior is version controlled
- Easy to modify
- Non-technical users can understand

### 6. Convention Over Invention

- Follow industry patterns (Agent, Tool, Skill, Run)
- Borrow from Claude Projects, Vercel Eve, LangGraph
- Don't invent new patterns
- Align with how agents are already discussed

Benefits:
- Familiar to users
- Proven patterns
- Community alignment
- Less learning curve

### 7. Extensibility Through Providers

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
└── Events (audit trail)
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
Emit Events
    ↓
Update Project State
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

The Agent Platform consists of exactly 12 concepts organized in three layers:

### Definitions (Filesystem Packages)
- Agent, Tool, Skill, Channel, Schedule, Eval, Sandbox

### Runtime (Project State)
- Project, Run, Artifact, Thread, Resource

### Execution (Through Providers)
- Tools are backed by providers (API, Connector, MCP, Function, Service)

Everything flows from this model. Nothing else is needed.

---

## References

This document is authoritative. All other documentation should reference it.

Related documents:
- [RUNTIME_ARCHITECTURE.md](../../RUNTIME_ARCHITECTURE.md) - Project runtime implementation
- [AGENT_PACKAGE_MODEL.md](../../AGENT_PACKAGE_MODEL.md) - Agent package structure
- [TOOL_EXECUTION_MODEL.md](../../TOOL_EXECUTION_MODEL.md) - Tool execution and providers
- [PERSISTENCE_REVIEW.md](../../PERSISTENCE_REVIEW.md) - Storage design

Implementation:
- [@awp/types](../../packages/types) - TypeScript definitions
- [@awp/loader](../../packages/loader) - Package loading
- [@awp/runtime](../../packages/runtime) - Project execution
- [@awp/tools](../../packages/tools) - Tool execution

---

**Last Updated:** June 2026  
**Status:** Production  
**Canonical:** Yes - All documentation defers to this document
