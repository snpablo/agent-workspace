# Agent Platform

**A package-first, project-centric runtime for organizing context, executing long-running agents, and producing durable artifacts.**

---

## Overview

Agent Platform is a framework for building AI agent systems that support human-agent collaboration. Projects organize context. Agents perform work. Tools connect agents to capabilities. Artifacts preserve outcomes. Everything is a filesystem-first YAML package, version-controlled and portable.

The runtime is built around three linked ideas:

- **Persisted collaboration state** so long-running work survives crashes, handoffs, and multi-day gaps
- **Wake-on-event execution** so agents stop cleanly and resume only when a relevant event or schedule arrives
- **Evaluation as a sidecar concern** so quality assessment stays important without becoming part of the core runtime loop

The platform is easiest to understand as a layered model:

- **Collaboration and work**: Project, Agent, Skill, Artifact, Thread, Run, Resource, Schedule, Channel
- **Integration and capability**: Connector, Tool
- **Runtime records and state**: Event, AgentSession, projected current state

That same layering drives UI: the filesystem defines the project, events preserve runtime history, projections derive current state, and interpreters/renderers simply make that state visible.

---

## Why Agent Platform Exists

Agent systems in production need clear architectural boundaries. Existing approaches either:
- Conflate UI concerns with runtime execution (confusion)
- Invent custom terminology (fragmentation)
- Over-engineer with unnecessary abstractions (complexity)

Agent Platform solves this by:
1. **Borrowing industry patterns** - Uses familiar concepts like Project, Agent, Tool, and Run
2. **Keeping the model understandable** - separate collaboration objects, integration bindings, and runtime records instead of hiding them behind one overloaded list
3. **Making outcomes first-class** - Artifacts are durable, versioned, auditable (not afterthoughts)
4. **Separating concerns cleanly** - Definitions (packages) vs. Runtime (execution state)
5. **Making everything portable** - YAML packages live in git, deploy anywhere

Result: A clean, focused architecture that scales from prototype to production without rearchitecting.

The hiring process is a good default example:

- a recruiter opens work
- one agent drafts a candidate packet
- a hiring manager reviews later
- another human requests changes
- the agent resumes in a new run
- an approver signs off

That behavior is not just CRUD. It is durable, event-driven, stop-start collaboration across many humans and agents.

---

## Layered Model

### Collaboration and Work

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Project** | Organizing container for all work | Packaged |
| **Agent** | Autonomous actor with instructions | Packaged |
| **Skill** | Reusable know-how (composed tools) | Packaged |
| **Channel** | Inbound communication interface (Slack, email, webhook) | Packaged |
| **Schedule** | Automation trigger (cron, event, manual) | Packaged |
| **Resource** | Shared context data (docs, config, credentials) | Packaged |
| **Artifact** | Versioned, durable outcome | Runtime |
| **Thread** | Collaboration context (discussion history) | Runtime |
| **Run** | Execution record (who did what, when) | Runtime |

### Integration and Capability

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Connector** | Outbound system binding, auth, and routing boundary | Packaged |
| **Tool** | Discrete action or retrieval operation the AI can invoke | Packaged |

### Runtime Records and State

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Event** | Canonical record of what happened | Runtime |
| **AgentSession** | Resumable agent participation context | Runtime |
| **Projection / ProjectState** | Queryable current state rebuilt from events | Runtime |

---

## Package Structure

### Project Layout

```
my-project/
  project.yaml                    # Project definition
  agents/
    decision-analyzer/
      agent.yaml                  # Agent definition with instructions
      tools/
        search-tool.yaml
      connectors/
        notion.yaml
      skills/
        option-analysis.yaml
      channels/
        slack-notifications.yaml
  resources/
    company-guidelines.yaml       # Shared context
  schedules/
    daily-review.yaml             # Automation triggers
  artifacts/
    decision-analysis.yaml        # Output type definition
  views/
    workspace.yaml                # Renderer-neutral workspace/view definition
  threads/
    (created at runtime)
  runs/
    (created at runtime)
  events/
    (created at runtime)
```

### Key Principle: Instructions Live in YAML

Agent behavior is configured in YAML, not code:

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
model: claude-opus
instructions: |
  You are an expert decision analyst.
  
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

Agent behavior lives directly in YAML rather than separate prompt files or code classes.

### Filesystem-Native UI

The project filesystem is the durable source of truth for definitions and durable outputs.

Everything else is a projection:

- loaders project filesystem packages into a typed project model
- event replay projects runtime history into current state
- UI interpreters project model + state into a renderer-neutral view tree
- renderers project that view tree into React, Ink, or future surfaces

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

This keeps the architecture clean:

- the filesystem records what the project is
- events record what happened
- projections derive what is true now
- UI renders projected project state instead of inventing a second truth source

---

## Example: Project Definition

```yaml
# project.yaml
kind: project
id: decision-support
name: Decision Support System
version: 1.0.0
description: Organizational decision-making framework

agents:
  - id: decision-analyzer
    name: Decision Analyzer

resources:
  - id: company-guidelines
    name: Company Decision-Making Guidelines

schedules:
  - id: daily-review
    name: Daily Review of Open Decisions

channels:
  - id: slack-alerts
    name: Slack Notifications
```

---

## Example: Agent Definition

```yaml
# agents/decision-analyzer/agent.yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
model: claude-opus
role: strategic-analyst
version: 1.0.0

instructions: |
  You are an expert strategic decision analyst.
  
  Your role: Evaluate complex organizational decisions
  using structured frameworks and available data.
  
  For each decision:
  1. Gather context from available resources
  2. Identify stakeholders and constraints
  3. Evaluate options using decision matrices
  4. Assess risks and opportunities
  5. Produce structured decision analysis
  
  Format analysis as a decision artifact with:
  - Executive Summary
  - Options Evaluated
  - Recommendation
  - Risk Assessment
  - Implementation Timeline

tools:
  - id: search-tool
    name: Information Search

skills:
  - id: financial-analysis
    name: Financial Analysis

channels:
  - id: slack-notifications
    name: Slack

constraints:
  maxIterations: 10
  timeoutSeconds: 300
```

---

## Example: Tool Definition

```yaml
# agents/decision-analyzer/tools/search-tool.yaml
kind: tool
id: search-tool
name: Information Search
version: 1.0.0
description: Search for information on the internet

implementation:
  type: http
  endpoint: https://api.search.example.com/search
  method: POST
  auth:
    type: bearer
    tokenEnv: SEARCH_API_KEY

schema:
  inputs:
    type: object
    properties:
      query:
        type: string
        description: Search query
  outputs:
    type: object
    properties:
      results:
        type: array
        items:
          type: object
          properties:
            title: { type: string }
            url: { type: string }
            snippet: { type: string }
```

---

## Architecture Principles

The platform is built on seven core principles:

### 1. Package-First
Everything is a filesystem YAML package. Agents, tools, skills, schedules, channels, resources—all are YAML files in organized directories. This makes them:
- Version-controllable (git native)
- Portable (move to any environment)
- Discoverable (filesystem walk)
- Human-readable (YAML, not binary)

### 2. Project-Centric
Projects are the unit of organization, execution, and persistence. All work happens in projects. Projects own:
- Agents (who performs work)
- Tools (what capabilities are available)
- Resources (what context is available)
- Artifacts (what was produced)
- Threads (how collaboration happened)
- Runs (execution history)
- Participants (who was involved)
- Canonical events (what actually happened)

Channels are the inbound side of that model. Connectors are the outbound side.

- `channels/` receive messages, events, and triggers
- `connectors/` hold authenticated bindings to external systems
- `tools/` are the discrete operations the AI is allowed to invoke through those connectors

### 3. Event-Driven Runtime
The runtime records canonical events, derives current state as projections, and keeps agents dormant between meaningful wake-up conditions.

This means:
- executions are bounded
- waiting is explicit
- resumes happen because of events or schedules
- current UI state comes from projections, not ad hoc mutable truth

### 4. Artifact-Centric
Outcomes are first-class concepts, not afterthoughts. Artifacts are:
- Durable (persisted in full)
- Versioned (complete history)
- Auditable (who edited when)
- Discussable (linked to threads)
- Central to business value

### 5. Clear Layering
Keep the architecture understandable by separating:
- collaboration and work concepts
- integration and capability concepts
- runtime records and derived state

That prevents important things like connectors and events from disappearing into implementation details.

### 5. Configuration Over Abstraction
Behavior is configured in YAML, not expressed through class hierarchies. Examples:
- Agent behavior: YAML instructions field
- Tool behavior: YAML implementation field
- Skill composition: YAML tools/skills arrays

No inheritance, no abstract classes, no subtle overrides. Just YAML.

### 6. Convention Over Invention
Uses industry patterns like Project, Agent, Tool, Run, and Thread instead of inventing unnecessary new terms. This means:
- Less learning curve for people familiar with other agent frameworks
- Industry alignment
- Easier cross-platform integration
- Proven patterns

### 7. Borrow Before Inventing
When facing a design choice, look at industry first. Only invent when:
- No industry standard exists
- Existing standards don't fit core needs
- Invention adds significant value

Result: A platform that benefits from community knowledge rather than betting on custom designs.

---

## Why Projects Matter

Projects are the organizing container because:

1. **Bounded Context** - Defines what agents can access, what tools are available, what artifacts exist
2. **Multi-Tenancy** - Each project is isolated (different teams, different use cases, different permissions)
3. **Clear Lifecycle** - Projects have creation, execution, completion
4. **Natural Scale** - One project might be one decision, one workflow, one quarter's work
5. **Portability** - Entire project (agents, tools, resources) can be copied to another environment

Projects are the container for context, participants, and execution.

---

## Why Artifacts Matter

Artifacts are first-class because:

1. **Business Value** - Artifacts ARE the deliverables (decisions, reports, analysis, plans)
2. **Collaboration** - Humans and agents discuss artifacts in threads
3. **Versioning** - Full version history (who changed what, when)
4. **Auditability** - Complete record of how outcomes were produced (via runs and threads)
5. **Durability** - Artifacts persist and are queryable (not logs or temporary state)

Artifacts are not "run outputs" (which are temporary). They're primary.

---

## Design Philosophy

### Simple is Better Than Clever

The codebase favors:
- Explicit over implicit
- Clear over concise
- Repetition over abstraction
- Specific over generic

### Compact Work Model, Explicit Runtime

The platform stays learnable by keeping the work model compact while naming the runtime and integration layers honestly:
- connectors bind outbound systems
- tools expose the precise operations the AI can call
- events preserve what happened
- projections represent what is true now

### Portable Over Perfect

Packages live in git. This means:
- Imperfect solutions that ship beat perfect solutions that don't
- Portability matters more than optimization
- Simple YAML beats sophisticated DSLs
- Version control is the source of truth

### Observable Execution

Every execution is recorded:
- Runs capture what happened
- Artifacts capture what was produced
- Threads capture discussion
- Events capture all changes

This means:
- No magic behavior
- Complete audit trail
- Reproducible execution
- Debuggable systems

---

## Optional Package Kinds

The platform supports three optional package kinds for extensibility:

### Connector

Outbound integration binding (OAuth, service auth, MCP server endpoint, SaaS workspace, enterprise index).

- **Part of the integration layer** (it is a first-class package kind, distinct from collaboration/work records)
- Used to bind tools to external systems
- Keeps authentication and system binding separate from the callable operations exposed to the AI

When to use: Binding to systems like Notion, Salesforce, ServiceNow, Google Drive, or Microsoft Graph

When not to use: Inbound communication surfaces or already-ingested project data

### Sandbox

Execution environment configuration (resource limits, allowed operations, environment variables).

- **Not part of the main collaboration/work layer** (it is execution configuration)
- Used for deployment (containerization, resource constraints)
- Configured as part of agent definition

When to use: Deploying to production with resource constraints

When not to use: Most development and testing

### Eval

Quality evaluation definition (assess outputs, check quality).

- **Not part of the main collaboration/work layer** (evaluation is domain-specific)
- Future extensibility for evaluation/assessment systems
- Should remain separate from the primary execution, dormancy, and wake-up loop
- Can be added as optional package kind if building evaluation systems

When to use: Only if building evaluation frameworks

When not to use: Most projects don't need this

---

## What This Is NOT

### Not a Workflow Engine

No DAGs, no state machines, no pipeline execution models. Workflows emerge from agent composition, not from the platform.

### Not a UI Framework

The platform is pure runtime. UI is a separate concern (can use any framework).

### Not a Database

Uses pluggable persistence (file, database, cloud). Not prescribed by the platform.

### Not a Message Queue

Channels send output, but execution is direct, not async-first.

### Not an Application Framework

The platform is generic. Domain logic lives in agents, tools, skills, and artifact schemas—not in platform code.

---

## Current Status

✅ **Architecture Complete**
- Layered architecture defined across collaboration, integration, and runtime
- 11 Architecture Decision Records (ADRs) documented
- Principles formalized

✅ **Type System Implemented**
- TypeScript interfaces for all concepts
- Base JSON schemas for validation
- Package metadata structure

🟡 **Runtime Foundation**
- Basic project execution engine exists
- Basic agent/tool/skill execution paths exist
- Artifact, thread, and event foundations exist
- Further runtime completion is still needed

🟡 **Package Loading**
- Filesystem discovery
- YAML parsing
- Basic package validation
- Reference resolution

✅ **Documentation**
- Authoritative architecture spec
- ADRs with decision rationale
- Examples and reference implementations
- Contributor guide

**Status:** Architecture and documentation are in strong shape. Core implementation foundations exist, but runtime depth, persistence, and validation still need work.

---

## Documentation

**Start here:**
- [docs/README.md](docs/README.md) - Canonical learning path for terms, examples, runtime, and code
- [AGENTS.md](AGENTS.md) - Contributor guide for working conventions in this repository

**Understand the architecture:**
- [docs/architecture/ARCHITECTURE_V3.md](docs/architecture/ARCHITECTURE_V3.md) - Authoritative specification
- [docs/architecture/README.md](docs/architecture/README.md) - Architecture overview

**Follow the learning path:**
- [docs/project-archetypes/README.md](docs/project-archetypes/README.md) - Project archetype diagrams
- [docs/examples/README.md](docs/examples/README.md) - Example projects
- [docs/posters/README.md](docs/posters/README.md) - Runtime and platform mechanics diagrams
- [packages/README.md](packages/README.md) - Source packages

**Understand design decisions:**
- [docs/architecture/adr/README.md](docs/architecture/adr/README.md) - Architecture Decision Records
  - [ADR-001: Project as Primary Container](docs/architecture/adr/ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md)
  - [ADR-002: Package-First Architecture](docs/architecture/adr/ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
  - [ADR-003: YAML-Rooted Packages](docs/architecture/adr/ADR-003-YAML-ROOTED-PACKAGES.md)
  - [ADR-004: Instructions Embedded in YAML](docs/architecture/adr/ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)
  - [ADR-005: Artifact-Centric Outputs](docs/architecture/adr/ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md)
  - [ADR-006: Tools as Primary Capability Model](docs/architecture/adr/ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)
  - [ADR-007: Channels and Schedules as First-Class](docs/architecture/adr/ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
  - [ADR-008: Layered Platform Model](docs/architecture/adr/ADR-008-MINIMAL-ONTOLOGY.md)
  - [ADR-009: Borrow Before Inventing](docs/architecture/adr/ADR-009-BORROW-BEFORE-INVENTING.md)
  - [ADR-010: Event-Canonical Runtime](docs/architecture/adr/ADR-010-EVENT-CANONICAL-RUNTIME.md)
  - [ADR-011: Connectors as Outbound Bindings](docs/architecture/adr/ADR-011-CONNECTORS-AS-OUTBOUND-BINDINGS.md)

## Architecture Summary

```text
Project Filesystem
        ↓
Project Loader
        ↓
Typed Project Model
        ↓
Event Replay + State Projections
        ↓
Interpreter
        ↓
Renderer-Neutral View Tree
        ↓
Renderer
        ├─ React
        ├─ Ink
        └─ Future Renderers
```

---

## Getting Started

1. **Read docs/README.md** - Follow the canonical learning path
2. **Read AGENTS.md** - Understand repository conventions and the architecture freeze guidance
3. **Read a relevant ADR** - Understand the decision that affects your work
4. **Run code and inspect examples** - Use [docs/examples/](docs/examples/README.md) and the packages to connect the model to implementation

---

## Principles in Practice

### ✅ Prefer
- YAML configuration over code abstractions
- Filesystem packages over database configs
- Explicit concepts over implicit behavior
- Industry patterns over custom terminology
- Simple composition over complex hierarchies

### ❌ Avoid
- Blurring filesystem definitions, runtime history, and UI projections into one layer
- Code-based agent definitions (use YAML)
- Hard-coded domain logic in platform code
- Mixing UI concerns with runtime concerns
- Inventing new patterns before borrowing existing ones

---

## Contributing

This is an open, evolving platform. Contributions are guided by:

1. **Respect the layered architecture** - keep work concepts, integration bindings, and runtime records clearly separated
2. **Keep packages simple** - Filesystem YAML, not complex formats
3. **Document decisions** - Write ADRs for architectural choices
4. **Prefer deletion over deprecation** - Delete obsolete code
5. **Test at boundaries** - Not internal implementation details

See [AGENTS.md](AGENTS.md) for detailed contribution guidelines.

---

## The Vision

A platform where:
- Teams organize work in Projects
- Agents perform work with available Tools
- Outcomes are Artifacts (durable, versioned, auditable)
- Humans and agents collaborate through Threads
- Everything is portable, version-controlled YAML
- No custom terminology, no over-engineering, no unnecessary abstractions

One shared work model, one explicit integration boundary, and one event-driven runtime model.

---

**The Agent Platform. Simple architecture. Powerful execution.**
