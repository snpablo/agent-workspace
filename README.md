# Agent Platform

A metadata-driven platform for building AI agent systems that support human-agent collaboration.

It is not a single application for one use case. It is a reusable platform for defining agent capabilities, orchestrating execution, and supporting durable collaboration around shared outcomes.


## What This Platform Is

A system that lets teams build agent systems declaratively without hard-coding for each domain.

In this platform:

- work happens in **Projects** (organizing containers)
- **Agents** perform work (autonomous or semi-autonomous actors)
- **Tools** and **Skills** enable capabilities (external APIs or composed know-how)
- durable results are preserved as **Artifacts** (versioned, auditable outcomes)
- **Runs** record execution (who did what, when, why)
- **Threads** capture collaboration (humans and agents discussing)
- **Resources** provide context (data, documents, credentials)
- **Schedules** trigger work (automated or event-driven)

The central architecture is:

```text
Agent Definition (Tool, Skill, Agent, Project config)
        ↓
Platform Interpreter
        ↓
Agent Runtime
        ↓
Execution + Collaboration
```

## Why It Exists

Most agent products focus narrowly on chatbots, prompt orchestration, or single-threaded automation. This platform exists to support durable, observable, collaborative work:

- agent work is larger than a single inference
- users care about outcomes (Artifacts), not execution logs
- collaboration, review, and audit trails need first-class support
- different teams need different agent configurations, but should not require separate code
- agents should be observable, versioned, and composable

The platform supports operational, analytical, and review-heavy work with Agents, Humans, and AI as first-class participants.

## Core Principles

- **Project-centric**: work happens inside organizing containers with participants, context, and outcomes
- **Agent-driven**: agents are explicit, first-class actors with observable execution
- **Artifact-centric**: durable results are versioned and auditable
- **Tool-oriented**: capabilities are composed from Tools and Skills
- **Metadata-driven**: projects, agents, and execution are configured declaratively
- **Industry-standard vocabulary**: aligns with how agent platforms discuss these concepts
- **Durable collaboration**: runs, threads, artifacts can be persisted and audited

## Platform Layers

```text
Applications (built on the platform)
        ↓
Agent & Project Definitions (what agents do, how projects are organized)
        ↓
Platform Interpreter (validate, normalize, resolve)
        ↓
Agent Runtime (execute agents, manage state, record runs)
        ↓
Persistence Layer (store artifacts, runs, threads, resources)
        ↓
Infrastructure (hosting, networking, storage)
```

Each layer:

- **Applications**: product experiences built using the platform
- **Agent & Project Definitions**: declarative Tool, Skill, Agent, and Project configurations
- **Platform Interpreter**: validates definitions, resolves references, produces executable configurations
- **Agent Runtime**: executes agents, manages project state, records Runs and events
- **Persistence**: stores Artifacts, Runs, Threads, Resources, and audit trails
- **Infrastructure**: compute, storage, networking, integration points

## First-Class Concepts

Platform objects organized by lifecycle:

### Definitions (declarative, versioned, reusable)

- **Tool** - Interface to external capability (API, function, service)
- **Skill** - Reusable know-how (composes Tools and Skills)
- **Agent** - Actor definition (instructions, Tools, Skills, constraints)
- **Project** - Organizing container (Agents, Channels, Resources, Artifact types)

### Runtime (executable, persistable, observable)

- **Project** - Live instance of project container
- **Run** - Execution record (Agent action, trigger, invocation of Tool/Skill)
- **Artifact** - Durable outcome with versioning and provenance
- **Thread** - Conversation or discussion (Humans and Agents)
- **Resource** - Context data (documents, configs, credentials)
- **Participant** - Human or Agent actor
- **Event** - Activity record (Run event, Artifact created, Thread message, etc.)
- **Sandbox** - Isolated execution environment

### Supporting Concepts

- **Channel** - Send/receive interface (Slack, email, HTTP, webhook)
- **Schedule** - Trigger definition (time-based, event-based, manual)

## Vocabulary Alignment

This platform aligns with industry standard agent platform terminology:

| Concept | Term |
|---------|------|
| Organizing container | **Project** |
| Autonomous actor | **Agent** |
| External capability | **Tool** |
| Composed know-how | **Skill** |
| Durable outcome | **Artifact** |
| Execution record | **Run** |
| Collaboration history | **Thread** |
| Context data | **Resource** |
| Automated trigger | **Schedule** |
| Communication interface | **Channel** |
| Evaluation | **Eval** |
| Execution isolation | **Sandbox** |

This vocabulary makes the platform:
- More accessible to people familiar with agent frameworks
- Less custom jargon to learn
- Easier to integrate with other systems
- More aligned with emerging industry standards

## Project Structure

```text
packages/                          # Core implementation
  schemas/                         # JSON Schema definitions
  types/                           # TypeScript type system
  definitions/                     # Builders and validators
  interpreter/                     # Definition interpreter
  runtime/                         # Agent runtime (Phase 2)
  shell/                           # Collaboration UI (Phase 3)

docs/
  specification/                   # Technical specification
  architecture/                    # Architecture diagrams
  verticals/                       # Use case examples

AGENTS.md                          # Starting context
ARCHITECTURE_FREEZE.md             # Architectural decisions
IMPLEMENTATION_CONTRACT.md         # Implementation obligations
SCHEMA_INVENTORY.md                # Schema catalog
README.md                          # This file
```

## Implementation Status

### Phase 1: Core Packages ✅ COMPLETE

- `@awp/schemas` - Definitions for Tool, Skill, Agent, Project, Run, Artifact, Thread
- `@awp/types` - TypeScript interfaces
- `@awp/definitions` - Builders and validators
- `@awp/interpreter` - Definition → executable configuration

### Phase 2: Runtime (Next)

- `@awp/runtime` - Agent execution, Run recording, State management
- Artifact versioning and audit
- Thread and collaboration support

### Phase 3: Shell UI (Planned)

- `@awp/shell` - Collaboration interface
- Project visualization
- Run inspection and Artifact review

### Phase 4: Reference Implementations (Planned)

- Example Projects for common domains
- Tool and Skill integrations
- Deployment templates

See [ROADMAP.md](ROADMAP.md) for detailed phase breakdown.

## Key Concepts

### Project

A Project organizes context for collaborative work:

- **Agents** that participate
- **Tools** and **Skills** they can use
- **Resources** (context data)
- **Channels** (communication interfaces)
- **Schedules** (automated triggers)
- **Artifacts** (outcomes)
- **Runs** (execution history)
- **Threads** (discussions)
- **Participants** (humans and agents)

### Agent

An Agent is an autonomous or semi-autonomous actor:

- Defined by **Tools**, **Skills**, and **Instructions**
- Executes **Runs** (creating Artifacts or updating Resources)
- Participates in **Threads** (with Humans or other Agents)
- Observable and auditable (all actions recorded)

### Run

A Run is an execution record:

- Who executed (Agent)
- What was invoked (Tool, Skill, or Agent action)
- When it happened (timestamp)
- What was produced (Artifact, state change)
- Why it happened (trigger, context)

Runs are immutable and provide complete audit trail.

### Artifact

An Artifact is a durable outcome:

- Created by Runs
- Versioned (full history preserved)
- Auditable (who created it, when, why)
- Collaborative (Humans and Agents can review and modify)
- Typed (different Projects have different Artifact types)

### Thread

A Thread captures collaboration:

- Conversation between Humans and Agents
- Linked to Artifacts (discussing outcomes)
- Linked to Runs (discussing execution)
- Part of Project history

## Filesystem-First Organization

The platform organizes Projects and Agents as filesystem packages:

```
my-project/
├── project.yaml              # Project definition
├── agents/
│   └── my-agent/
│       ├── agent.yaml        # Agent definition and instructions
│       ├── tools/            # Tool definitions
│       └── skills/           # Skill definitions
├── resources/                # Shared context (guidelines, data)
├── artifacts/                # Artifact type schemas
└── schedules/                # Automated triggers
```

Each first-class concept (Project, Agent, Tool, Skill) is a directory with a YAML file at the root.

**Key principle**: Instructions live in the YAML file under an `instructions` field, not in separate markdown files.

See [FILESYSTEM_STRUCTURE.md](FILESYSTEM_STRUCTURE.md) for complete details and examples in [docs/examples/](docs/examples/).

## Design Heuristics

When adding concepts to the platform:

1. Does it apply across multiple Project types?
2. Does it have a distinct lifecycle?
3. Does it require separate persistence?
4. Does it require separate permissions?
5. Does it require distinct UI treatment?

Keep concepts in configuration/definitions when they are:

- Project-specific
- Agent-specific
- Tool-specific
- Domain language
- Temporary implementation detail

Keep concepts in the platform core only when they appear across all Projects and use cases.

## Key References

**Getting Started**
- [AGENTS.md](AGENTS.md) - Conceptual model and vocabulary
- [ROADMAP.md](ROADMAP.md) - Implementation phases
- [packages/README.md](packages/README.md) - Package overview

**Architecture & Design**
- [ARCHITECTURE_MIGRATION.md](ARCHITECTURE_MIGRATION.md) - Evolution from custom to industry-standard vocabulary (start here if upgrading)
- [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) - Frozen decisions
- [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md) - Implementation requirements
- [SCHEMA_INVENTORY.md](SCHEMA_INVENTORY.md) - Complete schema catalog

**Implementation**
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Phase 1 completion
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Architecture integration

**Specification**
- [docs/specification/](docs/specification/) - Technical specification
- [docs/architecture/](docs/architecture/) - Architecture and design
- [docs/verticals/](docs/verticals/) - Use case examples

## License

Released under the [Apache License 2.0](LICENSE).

Copyright (c) 2026 DecisionForge LLC
