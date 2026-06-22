# Agent Platform - Implementation Packages

This directory contains the implementation of the Agent Platform core packages:

- **@awp/types** - TypeScript type definitions for all platform concepts
- **@awp/schemas** - JSON schemas for runtime persistence
- **@awp/loader** - Filesystem package discovery and loading
- **@awp/tools** - Tool execution with pluggable providers
- **@awp/runtime** - Project runtime and execution engine
- **@awp/interpreter** - Package interpretation and normalization (if needed)

## Architecture Overview

```
Package Definitions (YAML/JSON files)
        ↓
Package Loader (@awp/loader)
    ├─ Filesystem discovery
    ├─ YAML parsing
    ├─ Reference resolution
    └─ Registry creation
        ↓
Project Runtime (@awp/runtime)
    ├─ Project initialization
    ├─ Agent loading (with tools/skills)
    ├─ Run execution (tools/skills/agents/schedules)
    ├─ Artifact versioning
    └─ Thread collaboration
        ↓
Persistence Layer
    ├─ InMemoryProjectRepository (testing)
    ├─ FileProjectRepository (local development)
    └─ DatabaseProjectRepository (production)
```

## Core Packages

### @awp/types

TypeScript type definitions for all platform concepts:

**Definitions** (`src/definitions.ts`) - Filesystem packages:
- `Tool` - Interface to external capability
- `Skill` - Reusable know-how
- `Agent` - Actor definition
- `Project` - Organizing container
- `Channel` - Communication interface
- `Schedule` - Automation trigger
- `Resource` - Shared context
- `Sandbox` - Execution constraints

**Runtime** (`src/runtime.ts`) - Executable state:
- `ProjectContext` - Project runtime state
- `Run` - Execution record
- `Artifact` - Versioned outcome
- `Thread` - Collaboration
- `Event` - Audit trail
- `Participant` - Humans and agents

### @awp/schemas

JSON schemas for runtime persistence:

- `project.schema.json` - Project container
- `artifact.schema.json` - Versioned outcomes
- `run.schema.json` - Execution records
- `thread.schema.json` - Collaboration
- `event.schema.json` - Audit trail
- `participant.schema.json` - Actors
- `resource.schema.json` - Context data

### @awp/loader

Filesystem package discovery and management:

**Main Classes:**
- `PackageLoader` - Discovers and loads YAML packages
- `PackageRegistry` - Manages packages and resolves references
- `AgentLoader` - Loads agent packages with capabilities

**Specialized Registries:**
- `ToolRegistry` - Manages tools
- `SkillRegistry` - Manages skills with dependencies
- `ChannelRegistry` - Manages channels
- `ScheduleRegistry` - Manages schedules

### @awp/tools

Tool execution with pluggable provider pattern:

**Provider Types:**
- `ApiToolProvider` - HTTP/REST APIs
- `ConnectorToolProvider` - Database/SaaS connectors
- `McpToolProvider` - MCP servers
- `NativeToolProvider` - Native code (Python/JS)
- `PlatformServiceToolProvider` - Built-in services

**Main Class:**
- `ToolRegistry` - Manages tools and routes to providers

### @awp/runtime

Project runtime and execution engine:

**Main Classes:**
- `ProjectRuntime` - Orchestrates project execution
- `InMemoryProjectRepository` - In-memory persistence
- `FileProjectRepository` - File-based persistence

**Services:**
- Initialize projects
- Execute runs (tools, skills, agents, schedules)
- Create artifacts and threads
- Manage participants
- Track events

### @awp/interpreter

Package interpretation and transformation (if needed for complex scenarios):

- Normalizes package definitions
- Validates references
- Produces executable configurations

## Filesystem Package Structure

### Project Package

```
my-project/
  project.yaml                    # Project metadata
  agents/
    analyzer/
      agent.yaml                  # Agent definition
      tools/
        search.yaml
        database.yaml
      skills/
        analysis.yaml
      channels/
        slack.yaml
      schedules/
        daily-run.yaml
      sandbox/
        sandbox.yaml
  resources/
    guidelines.md
    company-policy.yaml
```

### Package Format (YAML)

```yaml
kind: agent|tool|skill|project|...
id: unique-identifier
name: Display Name
version: 1.0.0
description: What this does

# Type-specific fields
instructions: |
  Agent instructions or tool description
model: claude-opus
role: strategic-analyst

# References
tools:
  - id: tool-id
skills:
  - id: skill-id
agents:
  - id: agent-id

# Implementation
implementation:
  type: http|mcp|connector|function|platform_service
  # type-specific config...
```

## Integration Example

```typescript
import { PackageLoader } from '@awp/loader';
import { ProjectRuntime } from '@awp/runtime';
import { FileProjectRepository } from '@awp/runtime';

// 1. Load packages
const loader = new PackageLoader({ rootPath: './my-project' });
const discovery = await loader.discover();
const registry = new PackageRegistry(discovery.packages);

// 2. Create runtime with persistence
const fileRepo = new FileProjectRepository('./projects');
const runtime = new ProjectRuntime(registry, fileRepo);

// 3. Initialize project
const context = await runtime.initializeProject({
  project: registry.get('my-project') as Project,
  participants: [{ id: 'user-001', type: 'human', role: 'owner' }],
});

// 4. Execute agent
const result = await runtime.executeRun(context.project.id, {
  targetKind: 'agent',
  targetId: 'analyzer',
  triggeredBy: 'user-001',
  input: { task: 'Analyze this' },
});

// 5. Create artifact
const artifact = await runtime.createArtifact(context.project.id, {
  id: 'analysis-001',
  type: 'analysis',
  content: result.run.output,
  createdBy: 'agent-analyzer',
});

// Project is automatically persisted
```

## Package Status

| Package | Status | Purpose |
|---------|--------|---------|
| @awp/types | ✅ Complete | Type definitions |
| @awp/schemas | ✅ Complete | JSON schemas |
| @awp/loader | ✅ Complete | Package discovery |
| @awp/tools | ✅ Complete | Tool execution |
| @awp/runtime | ✅ Complete | Runtime engine |
| @awp/interpreter | ⏳ Optional | Package interpretation |

## Key Concepts

### Project
The organizing container for all work. Owns agents, resources, artifacts, threads, runs, schedules, and participants.

### Agent
Autonomous actor definition with instructions, tools, skills, and constraints. Executed via the runtime.

### Tool
Interface to external capability (API, MCP server, database connector, function, or platform service). Providers handle execution.

### Skill
Reusable know-how composed from tools and other skills. Enables capability composition.

### Run
Execution record for any work (tool invocation, skill composition, agent action, schedule trigger).

### Artifact
Versioned, durable outcome with full history. Immutable versions, mutable current state.

### Thread
Collaboration context. Humans and agents discuss artifacts, runs, or specific topics.

### Resource
Shared context data (documents, config, guidelines) available to all agents in a project.

## Design Principles

- **Filesystem-First**: Packages are filesystem directories with YAML definitions
- **No Definition/Instance Split**: Definitions are YAML, runtime state is ProjectContext
- **Provider Pattern**: Tool backing mechanisms are pluggable
- **Project-Centric**: Everything organized around projects
- **Artifact-Centric**: Outcomes are first-class and versioned
- **Event-Driven**: All activity produces audit trail events
- **Type-Safe**: Full TypeScript support throughout

## Next Steps

- Integrate with shell/UI for visualization
- Implement real agent executor (LLM integration)
- Add database persistence for production
- Implement schedule execution engine
- Add more tool provider types

## Documentation

- [../docs/architecture/ARCHITECTURE_V2.md](../docs/architecture/ARCHITECTURE_V2.md) - Authoritative architecture
- [../docs/examples/README.md](../docs/examples/README.md) - Example projects
- [../docs/posters/README.md](../docs/posters/README.md) - Runtime and platform posters
