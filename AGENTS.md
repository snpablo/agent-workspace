# AGENTS.md

**Read this first.** This document is the starting context for future AI agents and contributors joining the repository.

Assume no prior project knowledge. Architecture V2 is the only architecture.

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

That's the complete model. Nothing else is needed.

---

## Architectural Philosophy

### 10 Core Concepts (Not 11, Not 9)

1. **Project** - Organizing container
2. **Agent** - Autonomous actor
3. **Tool** - Capability interface
4. **Skill** - Reusable know-how
5. **Channel** - Communication interface
6. **Schedule** - Automation trigger
7. **Resource** - Shared context
8. **Artifact** - Versioned outcome
9. **Thread** - Collaboration context
10. **Run** - Execution record

These 10 concepts represent the complete ontology. Resist adding more.

### Why These 10?

- **Project:** Container for execution context (vs. Workspace, which was too UI-centric)
- **Agent:** First-class execution actor (vs. implicit or reactive systems)
- **Tool:** Unified capability model (not separate API/Connector/Function types)
- **Skill:** Composition of tools and skills (reusable know-how)
- **Channel:** Communication interface (send/receive)
- **Schedule:** Automation trigger (when work happens)
- **Resource:** Shared context (data, config, credentials)
- **Artifact:** Durable, versioned outcome (primary deliverable)
- **Thread:** Collaboration context (discussion history)
- **Run:** Execution record (who did what, when, why)

### Principles

1. **Package-first** - Everything is a filesystem YAML package
2. **Project-centric** - Projects own all work and participants
3. **Artifact-centric** - Outcomes are first-class (versioned, auditable)
4. **Minimal ontology** - 10 concepts, zero unnecessary abstractions
5. **Configuration over abstraction** - YAML config, not code hierarchies
6. **Convention over invention** - Use industry patterns (Claude, LangGraph, Anthropic)
7. **Borrow before inventing** - Use proven patterns, only invent when necessary

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

Every package (agent, tool, skill, etc.) is a YAML file with metadata:

```yaml
kind: agent|tool|skill|project|channel|schedule|resource
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
1. Can it be expressed with the 10 core concepts?
2. If not, write an ADR (Architecture Decision Record)
3. If yes, implement it without changing the core model

**How to add to an agent:**
- New tool? Add to agents/agent-name/tools/
- New skill? Add to agents/agent-name/skills/
- New capability? Extend Agent.instructions
- New output type? Add Artifact type definition
- New communication? Add a Channel

**How to add to a project:**
- New agent? Create agents/new-agent/agent.yaml
- New resource? Create resources/resource-name.yaml
- New schedule? Create schedules/schedule-name.yaml
- New artifact type? Create artifacts/type-name.yaml

**Avoid:**
- New ontology concepts (without ADR)
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

These 10 concepts are complete. Do not add:
- Workspace (that's Project)
- WorkItem (that's Run)
- Playbook (that's Agent + Schedule)
- Integration (that's Tool implementation)
- Capability (that's Tool)
- Role (that's Agent.role field)
- Step (that's Run)
- Action (that's Run)

If you need something new, it's probably an Artifact type or Resource.

### Do NOT Add Separate Types for Tool Implementations

Tools are abstracted. Do not add:
- APIConcept (use Tool with implementation.type = 'http')
- ConnectorConcept (use Tool with implementation.type = 'connector')
- MCPServerConcept (use Tool with implementation.type = 'mcp')
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

Two optional package kinds exist but are NOT core:

### Sandbox

Agent execution configuration (resource limits, allowed operations, environment).

- **Not a core concept** (doesn't represent business value)
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

- **Not a core concept** (evaluation is domain-specific)
- Future extensibility for evaluation systems
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
  examples/            # Reference implementations

docs/
  architecture/        # Architecture specifications and ADRs
  ARCHITECTURE_V2.md   # Authoritative specification
```

### Documentation Files

- **README.md** - Project overview
- **AGENTS.md** - This file (contributor guide)
- **docs/architecture/ARCHITECTURE_V2.md** - Authoritative spec
- **docs/architecture/adr/** - Architecture Decision Records
- **ARCHITECTURE_REFINEMENT_REPORT.md** - Recent changes

### Authoritative Sources

Trust these (in order):
1. `docs/architecture/ARCHITECTURE_V2.md` - Authoritative spec
2. `docs/architecture/adr/` - Decision rationale
3. TypeScript types in `packages/types/` - Code of truth
4. This file (AGENTS.md) - Contributor guide

---

## Working on the Codebase

### Before You Start

1. Read ARCHITECTURE_V2.md
2. Read the relevant ADR (docs/architecture/adr/)
3. Read this file (AGENTS.md)

### When Adding Features

1. Can it be done with 10 core concepts?
2. If yes, implement using YAML packages
3. If no, write an ADR first
4. Update documentation
5. Add examples
6. Add tests

### When You're Confused

1. Check ARCHITECTURE_V2.md
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

Read [ARCHITECTURE_V2.md](docs/architecture/ARCHITECTURE_V2.md)

### The Complete Picture

Read [docs/architecture/adr/](docs/architecture/adr/)

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
| [ADR-008](docs/architecture/adr/ADR-008-MINIMAL-ONTOLOGY.md) | Minimal Ontology (10 Concepts) |
| [ADR-009](docs/architecture/adr/ADR-009-BORROW-BEFORE-INVENTING.md) | Borrow Before Inventing |

Each ADR documents the context, decision, consequences, and alternatives considered.

---

## Joining the Repository

1. Read this file (AGENTS.md) - **you are here**
2. Read [ARCHITECTURE_V2.md](docs/architecture/ARCHITECTURE_V2.md)
3. Read one relevant ADR (based on what you'll work on)
4. Look at examples in `packages/*/examples/`
5. Read the code in `packages/` to understand current state

Then start contributing.

---

**This is the authoritative guide for working in this repository.**

All decisions, structure, and conventions are intentional.

When in doubt, refer back to ARCHITECTURE_V2.md and the ADRs.

Good luck.
