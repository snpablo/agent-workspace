# AGENTS.md

**Read this first.** This document is the starting context for future AI agents and contributors joining the repository.

Assume no prior project knowledge. Architecture V3 is the only architecture.

---

## What Is This Repository?

This repository implements the Agent Platform: a framework for building AI agent systems that support human-agent collaboration.

**Core thesis:**
- Projects organize context.
- Agents perform work.
- Tools connect agents to capabilities.
- Skills provide reusable know-how.
- Channels receive and send messages.
- Schedules trigger work.
- Artifacts preserve outcomes.
- Threads capture collaboration.
- Runs record execution.
- Resources provide context.

That is the collaboration and work model. The runtime and integration layers are equally important and should be named explicitly.

**Runtime thesis:**
- Persisted collaboration state makes long-running work survivable.
- Wake-on-event execution makes long-running work resumable.
- Evaluation stays beside the main runtime loop rather than inside it.

---

## Architectural Philosophy

### Layered Architecture

The platform is organized into three explicit layers:

- **Collaboration and work** - Project, Agent, Skill, Artifact, Thread, Run, Resource, Schedule, Channel
- **Integration and capability** - Connector, Tool
- **Runtime records and state** - Event, AgentSession, projected current state

Use the layered architecture instead of forcing everything into one flat list.

### Principles

1. **Package-first** - Everything is a filesystem YAML package
2. **Project-centric** - Projects own all work and participants
3. **Event-primary runtime** - Canonical history is recorded as events and current state is projected
4. **Artifact-centric** - Outcomes are first-class (versioned, auditable)
5. **Layered clarity** - Name collaboration concepts, integration bindings, and runtime records separately
6. **Configuration over abstraction** - YAML config, not code hierarchies
7. **Convention over invention** - Use established ecosystem patterns and terminology
8. **Borrow before inventing** - Use proven patterns, only invent when necessary

---

## Package Structure

### Project Layout

```
project/
  project.yaml                    # Project definition
  agents/
    agent-name/
      agent.yaml                  # Agent definition and instructions
      tools/
        tool-name.yaml
      skills/
        skill-name.yaml
      channels/
        channel-name.yaml
      connectors/
        connector-name.yaml
  resources/
    resource-name.yaml            # Shared context data
  schedules/
    schedule-name.yaml            # Automation triggers
  artifacts/
    artifact-schema.yaml          # Output type definitions
  threads/
    (created at runtime)
  runs/
    (created at runtime)
```

### Key Principle: Instructions Live in YAML

Agent instructions are **not** separate files. They live in `agent.yaml`:

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
model: claude-opus
instructions: |
  You are an expert decision analyst.
  
  Your responsibilities:
  - Analyze complex decisions
  - Evaluate options using structured frameworks
  - Produce detailed analysis artifacts
  
  Process:
  1. Gather decision context
  2. Identify stakeholders
  3. Evaluate each option
  4. Synthesize findings
```

This keeps everything in one place, version-controlled, portable.

### YAML Package Format

Every package (agent, tool, skill, project, channel, schedule, resource, and optional sandbox) is a YAML file with metadata:

```yaml
kind: agent|tool|skill|project|channel|connector|schedule|resource|sandbox
id: unique-identifier
name: Display Name
version: 1.0.0
description: What this does

# Type-specific fields
instructions: |
  (for agents and skills)
model: claude-opus
role: strategic-analyst

# References to other packages
tools:
  - id: tool-id
    name: Display Name

skills:
  - id: skill-id

# Implementation details (for tools)
implementation:
  type: http|mcp|connector|function|platform_service
  endpoint: https://api.example.com
  # ... type-specific config

metadata:
  tags: [category, domain]
  team: platform
```

---

## Core Vocabulary Explained

### Project

A container for all work: agents, tools, resources, artifacts, threads, runs, schedules.

**Owns:**
- Agents (actors)
- Resources (shared context)
- Schedules (triggers)
- Artifacts (outcomes)
- Threads (conversations)
- Runs (execution history)
- Participants (humans and agents)
- Event history (canonical runtime truth)

**Operational rule:**
- Persist what happened as events
- Derive current state as projections
- Keep agents dormant until schedules or relevant events wake them

### Agent

An autonomous actor that performs work. Defined as a package with instructions, tool/skill bindings, and configuration.

```yaml
kind: agent
id: decision-analyzer
instructions: |
  You are a decision analyst...
tools:
  - id: search-tool
  - id: database-query
model: claude-opus
```

### Tool

A capability interface. **Not** the implementation, just the interface.

Tools are backed by providers (implementation detail):
- **http** - REST/GraphQL endpoints
- **mcp** - Model Context Protocol servers
- **connector** - Database/SaaS connections
- **function** - Native code (Python, JavaScript)
- **platform_service** - Built-in platform capabilities

From agent perspective: invoke Tool. Platform handles routing to correct provider.

### Skill

Reusable know-how composed from Tools and other Skills.

```yaml
kind: skill
id: financial-analysis
tools:
  - id: search-tool
  - id: database-query
skills:
  - id: data-validation
instructions: |
  1. Gather financial data using available tools
  2. Validate data quality
  3. Calculate metrics
```

### Channel

Communication interface (Slack, email, webhook, HTTP). Used for:
- Sending run results
- Delivering notifications
- Notifying external systems
- Publishing artifacts

Channels are inbound surfaces. They receive messages, events, and user interaction into the project.

### Connector

Outbound integration binding for external systems.

Used for:
- holding OAuth or service authentication
- binding to MCP servers, SaaS APIs, databases, or enterprise indexes
- exposing one or more tools the agent may actually invoke

Connectors are outbound surfaces. They are where the AI goes to fetch data or perform work.

### Schedule

Automation trigger. Defines when work happens:
- **cron** - Time-based (9 AM daily)
- **event** - Event-driven (when X happens)
- **manual** - On-demand trigger

Schedules are **project-level** (not agent-level). Multiple agents can share one schedule.

### Resource

Shared context data available to all agents:
- Documents
- Configuration
- Credentials
- Policies

### Artifact

Durable, versioned outcome. The primary deliverable.

**Automatic versioning:**
- Current version
- All previous versions
- Who edited, when
- Full audit trail

**Use cases:**
- Decision analysis
- Reports
- Plans
- Recommendations

### Thread

Collaboration context for discussion.

- Message history
- Participants (humans and agents)
- Can reference artifacts and runs
- Used for asynchronous collaboration

### Runtime Behavior

Long-running human-agent work in this repository should be understood through three connected ideas:

1. **Persisted collaboration state**
Persist events, projections, artifacts, runs, threads, and agent-session context so work can survive crashes, handoffs, and multi-day gaps.

2. **Wake-on-event execution**
Agents should work in bounded runs, stop cleanly, persist what they are waiting for, and resume only when a relevant event, channel input, or schedule wake-up occurs.

3. **Evaluation as a sidecar concern**
Evaluation may inspect runs, artifacts, and events, but it should remain outside the core execution loop unless a project is explicitly building an evaluation subsystem.

The hiring project is the default mental model:

- recruiters, coordinators, hiring managers, and interviewers participate over time
- multiple agents draft, revise, summarize, or check policy
- work stops and starts repeatedly
- approvals and requests for changes arrive asynchronously
- the event log preserves the real history of that collaboration

### Run

Execution record. One Run per:
- Tool invocation
- Skill execution
- Agent invocation
- Schedule trigger

Captures:
- What was invoked
- Who triggered it
- Input and output
- Timing
- Success or failure
- Which artifacts were created

---

## Implementation Conventions

### Adding New Features

**Before adding anything:**
1. Can it be expressed cleanly within the layered model?
2. If not, write an ADR (Architecture Decision Record)
3. If yes, implement it without changing the core model

**How to add to an agent:**
- New tool? Add to agents/agent-name/tools/
- New skill? Add to agents/agent-name/skills/
- New capability? Extend Agent.instructions
- New output type? Add Artifact type definition
- New communication? Add a Channel
- New outbound system binding? Add a Connector

**How to add to a project:**
- New agent? Create agents/new-agent/agent.yaml
- New resource? Create resources/resource-name.yaml
- New schedule? Create schedules/schedule-name.yaml
- New artifact type? Create artifacts/type-name.yaml

**Avoid:**
- New top-level architecture concepts (without ADR)
- New type hierarchies
- New execution models
- Hard-coding domain-specific logic in platform code
- Mixing concerns (UI, runtime, persistence, tooling)

### Prefer Configuration Over Code

**Good:**
```yaml
# Agent configuration in agent.yaml
instructions: |
  Handle financial analysis using these tools...
model: claude-opus
tools:
  - id: financial-tool
```

**Avoid:**
```typescript
// Hard-coded agent behavior in code
class FinancialAgent extends Agent {
  async run() { ... }
}
```

### Prefer Deletion Over Deprecation

When concepts become obsolete:
- Delete the code (not deprecate)
- Remove from types
- Update documentation
- Explain in commit message

Why? Smaller codebase, cleaner history, less confusion.

### Prefer Composition Over Hierarchy

**Good:**
```yaml
# Skill composes tools
kind: skill
tools:
  - id: tool-a
  - id: tool-b
```

**Avoid:**
```typescript
// Class hierarchy
class BaseTool { }
class SpecializedTool extends BaseTool { }
```

### Prefer Simple Names Over Clever Abstractions

**Good:**
- ProjectState (clear: it's project state)
- ToolProvider (clear: provides tools)
- ArtifactRecord (clear: record of artifact)

**Avoid:**
- Context (too generic)
- Handler (too generic)
- Manager (too generic)
- Visitor (too clever)

---

## What NOT to Add

### Do NOT Add New Ontology Concepts

Do not add parallel container, execution, or capability concepts that duplicate the existing layered model.

If you need something new, it is usually:
- a field on an existing package
- an Artifact type
- a Resource
- a provider-backed Tool implementation

### Do NOT Add Separate Types for Tool Implementations

Tools are abstracted. Do not add:
- APIConcept (use Tool with implementation.type = 'http')
- MCPServerConcept (use a Connector package plus MCP-backed tools)
- ConnectorConcept as a redundant extra noun (use a first-class Connector package kind instead)
- FunctionConcept (use Tool with implementation.type = 'function')

### Do NOT Mix Concerns

Keep separate:
- **Definitions** (YAML packages) from **Runtime** (execution state)
- **Type system** from **UI models**
- **Persistence** from **Runtime**
- **Platform** from **Domain-specific** logic

### Do NOT Hard-Code Domain Logic

Platform is domain-neutral. Domain logic lives in:
- Agent instructions
- Tool implementations
- Skill definitions
- Artifact schemas
- Channel integrations

NOT in:
- Core types
- Runtime execution
- Package loading
- Persistence layer

---

## Optional Package Kinds

These package kinds are important but should not be confused with the main collaboration/work concepts:

### Connector

Outbound integration binding (OAuth, service auth, base URLs, MCP server endpoints, enterprise indexes).

- **Not a collaboration/work concept** (it is a first-class package kind for the integration layer)
- Used to bind agents and tools to external systems
- Tools should reference connectors when they expose concrete operations through that binding

**When to use:**
- Binding to SaaS systems like Notion, Salesforce, or ServiceNow
- Binding to MCP servers that surface many tools
- Binding to enterprise knowledge connectors or outbound action systems

**When NOT to use:**
- For inbound communication surfaces (use Channel)
- For already-ingested in-project data (use Resource)

### Sandbox

Agent execution configuration (resource limits, allowed operations, environment).

- **Not part of the main collaboration/work layer** (it is execution configuration)
- Agent configuration: `agent.constraints.sandbox`
- Can reference sandbox policy if needed

**When to use:**
- Deploying in containers
- Restricting resource usage
- Setting environment variables

**When NOT to use:**
- Most development and testing
- When defaults are acceptable

### Eval

Quality evaluation definition (assess outputs, check quality).

- **Not part of the main collaboration/work layer** (evaluation is domain-specific)
- Future extensibility for evaluation systems
- Should remain separate from the primary execution, dormancy, and wake-up loop
- Can be added as optional package kind if needed

**When to use:**
- Only if building evaluation/assessment system

**When NOT to use:**
- Most projects don't need this

---

## File Organization

### Code Organization

```
packages/
  types/               # TypeScript type definitions
  loader/              # Package discovery and loading
  runtime/             # Project execution engine
  tools/               # Tool execution with providers
  schemas/             # JSON schemas for validation

docs/
  architecture/        # Architecture specifications and ADRs
  ARCHITECTURE_V3.md   # Authoritative specification
```

### Documentation Files

- **README.md** - Project overview
- **AGENTS.md** - This file (contributor guide)
- **docs/architecture/ARCHITECTURE_V3.md** - Authoritative spec
- **docs/architecture/adr/README.md** - Architecture Decision Records

### Authoritative Sources

Trust these (in order):
1. `docs/architecture/ARCHITECTURE_V3.md` - Authoritative spec
2. `docs/architecture/adr/*.md` - Decision rationale
3. TypeScript types in `packages/types/` - Code of truth
4. This file (AGENTS.md) - Contributor guide

---

## Working on the Codebase

### Before You Start

1. Read ARCHITECTURE_V3.md
2. Read the relevant ADR (docs/architecture/adr/README.md)
3. Read this file (AGENTS.md)

### Current Repository State

The repository is currently strongest in these areas:

- Architecture V3 terminology and documentation consistency
- Example project structure and learning-path docs
- Visual posters that explain the runtime and package model
- Basic workspace test wiring (`npm test`)

The repository is currently weaker in these areas:

- Runtime completeness versus the architecture spec
- Persistence implementation depth
- Full schema enforcement and package validation
- End-to-end execution beyond mock or partial behavior

### Recommended Next Priorities

If you are deciding what to work on next, prefer this order:

1. Close the gap between `docs/architecture/ARCHITECTURE_V3.md` and the real runtime behavior.
2. Strengthen persistence and repository-backed state handling.
3. Improve loader/schema validation so broken packages fail clearly.
4. Add integrations and richer provider behavior only after the core execution path is solid.

Avoid spending the next cycle on:

- new top-level architecture concepts
- renaming exercises unless they fix real inconsistency
- architecture reshaping without corresponding implementation progress

### Architecture Freeze Guidance

Architecture V3 is frozen for normal repository work.

Before changing any of the following, stop and confirm with the user unless the change is a small factual correction, typo fix, broken link fix, or consistency cleanup:

- `docs/architecture/ARCHITECTURE_V3.md`
- files under `docs/architecture/adr/`
- the layered architecture model and core terminology
- core terminology used across the repo

Default behavior should be:

1. prefer implementation work over architecture revision
2. prefer runtime/code alignment with the frozen model
3. ask before making substantive architecture or ADR changes

### When Adding Features

1. Can it be done cleanly within the layered architecture?
2. If yes, implement using YAML packages
3. If no, write an ADR first
4. Update documentation
5. Add examples
6. Add tests

### When You're Confused

1. Check ARCHITECTURE_V3.md
2. Check the relevant ADR
3. Check examples in packages/*/examples/
4. Look at existing implementations

### When You Find a Mistake

1. Fix it immediately
2. Don't deprecate or soft-delete
3. Update related docs
4. Explain in commit message

---

## Quick Reference

| Concept | Type | Location | Use For |
|---------|------|----------|---------|
| Project | Definition | project.yaml | Container |
| Agent | Definition | agents/name/agent.yaml | Actor |
| Tool | Definition | agents/agent/tools/name.yaml | Capability |
| Connector | Definition | agents/agent/connectors/name.yaml | Outbound system binding |
| Skill | Definition | agents/agent/skills/name.yaml | Reusable know-how |
| Channel | Definition | agents/agent/channels/name.yaml | Communication |
| Schedule | Definition | project/schedules/name.yaml | Automation |
| Resource | Definition | resources/name.yaml | Shared context |
| Artifact | Runtime | Project.artifacts | Outcome |
| Thread | Runtime | Project.threads | Collaboration |
| Run | Runtime | Project.runs | Execution record |

---

## Getting Oriented

### The 10-Second Summary

```
Project (organizing context)
    ↓
Agent (performs work)
    ↓
Tool + Skill (enable capabilities)
    ↓
Run (execution record)
    ↓
Artifact (outcome) + Thread (collaboration)
```

### The 10-Minute Deep Dive

Read [ARCHITECTURE_V3.md](docs/architecture/ARCHITECTURE_V3.md)

### The Complete Picture

Read [docs/architecture/adr/README.md](docs/architecture/adr/README.md)

---

## Architecture Decision Records

All major decisions are documented in Architecture Decision Records (ADRs):

| ADR | Decision |
|-----|----------|
| [ADR-001](docs/architecture/adr/ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) | Project as Primary Container |
| [ADR-002](docs/architecture/adr/ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) | Package-First Architecture |
| [ADR-003](docs/architecture/adr/ADR-003-YAML-ROOTED-PACKAGES.md) | YAML-Rooted Packages |
| [ADR-004](docs/architecture/adr/ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md) | Instructions Embedded in YAML |
| [ADR-005](docs/architecture/adr/ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md) | Artifact-Centric Outputs |
| [ADR-006](docs/architecture/adr/ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) | Tools as Primary Capability |
| [ADR-007](docs/architecture/adr/ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md) | Channels and Schedules |
| [ADR-008](docs/architecture/adr/ADR-008-MINIMAL-ONTOLOGY.md) | Layered Platform Model |
| [ADR-010](docs/architecture/adr/ADR-010-EVENT-CANONICAL-RUNTIME.md) | Event-Canonical Runtime |
| [ADR-011](docs/architecture/adr/ADR-011-CONNECTORS-AS-OUTBOUND-BINDINGS.md) | Connectors as Outbound Bindings |
| [ADR-009](docs/architecture/adr/ADR-009-BORROW-BEFORE-INVENTING.md) | Borrow Before Inventing |

Each ADR documents the context, decision, consequences, and alternatives considered.

---

## Joining the Repository

1. Read [docs/README.md](docs/README.md) for the canonical learning path
2. Read this file (AGENTS.md) for repository conventions
3. Read [ARCHITECTURE_V3.md](docs/architecture/ARCHITECTURE_V3.md)
4. Read one relevant ADR (based on what you'll work on)
5. Read the code in `packages/` to understand current state

Then start contributing.

---

**This is the authoritative guide for working in this repository.**

All decisions, structure, and conventions are intentional.

When in doubt, refer back to ARCHITECTURE_V3.md and the ADRs.

Good luck.
