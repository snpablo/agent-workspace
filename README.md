# Agent Platform

**A package-first, project-centric runtime for organizing context, executing agents, and producing durable artifacts.**

---

## Overview

Agent Platform is a framework for building AI agent systems that support human-agent collaboration. Projects organize context. Agents perform work. Tools connect agents to capabilities. Artifacts preserve outcomes. Everything is a filesystem-first YAML package, version-controlled and portable.

The platform implements exactly 10 core concepts: Project, Agent, Tool, Skill, Channel, Schedule, Resource, Artifact, Thread, and Run. Nothing else is needed.

---

## Why Agent Platform Exists

Agent systems in production need clear architectural boundaries. Existing approaches either:
- Conflate UI concerns with runtime execution (confusion)
- Invent custom terminology (fragmentation)
- Over-engineer with unnecessary abstractions (complexity)

Agent Platform solves this by:
1. **Borrowing industry patterns** - Uses Project, Agent, Tool, Run (not custom Workspace, WorkItem, Playbook)
2. **Keeping the ontology minimal** - 10 concepts, each essential, none redundant
3. **Making outcomes first-class** - Artifacts are durable, versioned, auditable (not afterthoughts)
4. **Separating concerns cleanly** - Definitions (packages) vs. Runtime (execution state)
5. **Making everything portable** - YAML packages live in git, deploy anywhere

Result: A clean, focused architecture that scales from prototype to production without rearchitecting.

---

## Core Concepts

| Concept | Purpose | Scope |
|---------|---------|-------|
| **Project** | Organizing container for all work | Persisted |
| **Agent** | Autonomous actor with instructions | Packaged |
| **Tool** | Interface to external capability | Packaged |
| **Skill** | Reusable know-how (composed tools) | Packaged |
| **Channel** | Communication interface (Slack, email, webhook) | Packaged |
| **Schedule** | Automation trigger (cron, event, manual) | Packaged |
| **Resource** | Shared context data (docs, config, credentials) | Persisted |
| **Artifact** | Versioned, durable outcome | Persisted |
| **Thread** | Collaboration context (discussion history) | Persisted |
| **Run** | Execution record (who did what, when) | Persisted |

**That's it.** These 10 concepts represent the complete model.

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
      skills/
        option-analysis.yaml
      channels/
        slack-notifications.yaml
  resources/
    company-guidelines.yaml       # Shared context
  schedules/
    daily-review.yaml             # Automation triggers
  artifacts/
    decision-analysis/
      schema.yaml                 # Output type definitions
  threads/
    (created at runtime)
  runs/
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

No separate files, no code, no runtimes. Just YAML.

---

## Example: Project Definition

```yaml
# project.yaml
kind: project
id: decision-support-v1
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

### 3. Artifact-Centric
Outcomes are first-class concepts, not afterthoughts. Artifacts are:
- Durable (persisted in full)
- Versioned (complete history)
- Auditable (who edited when)
- Discussable (linked to threads)
- Central to business value

### 4. Minimal Ontology
Exactly 10 core concepts. No more. This forces clarity:
- Can't hide complexity in new types
- Forces composition over inheritance
- Makes the model learnable
- Prevents accidental bloat

### 5. Configuration Over Abstraction
Behavior is configured in YAML, not expressed through class hierarchies. Examples:
- Agent behavior: YAML instructions field
- Tool behavior: YAML implementation field
- Skill composition: YAML tools/skills arrays

No inheritance, no abstract classes, no subtle overrides. Just YAML.

### 6. Convention Over Invention
Uses industry patterns (Project, Agent, Tool, Run, Thread) instead of inventing custom terminology (Workspace, WorkItem, Playbook, Definition, Instance). This means:
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

Projects are not Workspaces (too UI-centric) or Workflows (too execution-focused). They're the container.

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

### Minimal Core, Rich Extensions

The core is minimal (10 concepts). Extensions happen through:
- Tool implementations (HTTP, MCP, connectors, functions, services)
- Artifact types (different output schemas)
- Channel types (Slack, email, webhook, etc.)
- Schedule types (cron, event, manual)

The core doesn't grow; extensibility does.

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

The platform supports two optional package kinds for extensibility:

### Sandbox

Execution environment configuration (resource limits, allowed operations, environment variables).

- **Not a core concept** (doesn't represent business value like Artifact or Run)
- Used for deployment (containerization, resource constraints)
- Configured as part of agent definition

When to use: Deploying to production with resource constraints

When not to use: Most development and testing

### Eval

Quality evaluation definition (assess outputs, check quality).

- **Not a core concept** (evaluation is domain-specific)
- Future extensibility for evaluation/assessment systems
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
- 10 core concepts defined
- 9 Architecture Decision Records (ADRs) documented
- Principles formalized

✅ **Type System Implemented**
- TypeScript interfaces for all concepts
- JSON schemas for validation
- Package metadata structure

✅ **Runtime Foundation**
- Project execution engine
- Agent loading and execution
- Tool provider pattern
- Artifact and thread management
- Event audit trail

✅ **Package Loading**
- Filesystem discovery
- YAML parsing
- Package validation
- Reference resolution

✅ **Documentation**
- Authoritative architecture spec
- ADRs with decision rationale
- Examples and reference implementations
- Contributor guide

**Status:** Production-ready for initial implementation. Ready for teams to build projects.

---

## Key Differentiators

### vs. Workflow Engines

Workflow engines are task-centric (execute a DAG). Agent Platform is actor-centric (agents perform work using available tools). This is fundamentally different.

### vs. Custom Agent Frameworks

Many teams build custom agent frameworks. Agent Platform provides the glue:
- Standard vocabulary (not custom terminology)
- Package discovery (not hardcoded configs)
- Artifact persistence (not logs)
- Collaboration primitives (threads, runs)

### vs. LangGraph / AutoGen

These are great for orchestration within a single execution. Agent Platform is the container for many agents, many executions, collaboration, and durable outcomes.

### vs. Claude Projects

Claude Projects are hosted, proprietary. Agent Platform is open, self-hosted, extensible through code.

---

## Documentation

**Start here:**
- [AGENTS.md](AGENTS.md) - Contributor guide (read this first if joining)

**Understand the architecture:**
- [docs/architecture/ARCHITECTURE_V2.md](docs/architecture/ARCHITECTURE_V2.md) - Authoritative specification

**Understand design decisions:**
- [docs/architecture/adr/](docs/architecture/adr/) - Architecture Decision Records
  - [ADR-001: Project as Primary Container](docs/architecture/adr/ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md)
  - [ADR-002: Package-First Architecture](docs/architecture/adr/ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
  - [ADR-003: YAML-Rooted Packages](docs/architecture/adr/ADR-003-YAML-ROOTED-PACKAGES.md)
  - [ADR-004: Instructions Embedded in YAML](docs/architecture/adr/ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)
  - [ADR-005: Artifact-Centric Outputs](docs/architecture/adr/ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md)
  - [ADR-006: Tools as Primary Capability Model](docs/architecture/adr/ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)
  - [ADR-007: Channels and Schedules as First-Class](docs/architecture/adr/ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
  - [ADR-008: Minimal Ontology](docs/architecture/adr/ADR-008-MINIMAL-ONTOLOGY.md)
  - [ADR-009: Borrow Before Inventing](docs/architecture/adr/ADR-009-BORROW-BEFORE-INVENTING.md)

**See recent refinements:**
- [EXTERNAL_ARCHITECTURE_REVIEW.md](EXTERNAL_ARCHITECTURE_REVIEW.md) - Independent review by principal architect
- [ARCHITECTURE_REFINEMENT_REPORT.md](ARCHITECTURE_REFINEMENT_REPORT.md) - Simplification work

---

## Architecture Summary

```
Package Structure (on Filesystem)
        ↓
Package Loading & Discovery
        ↓
Package Registry & Resolution
        ↓
Project Runtime
        ├─ Agents (with resolved tools/skills)
        ├─ Resources
        └─ Schedules
        ↓
Execution
        ├─ Tool Providers (HTTP, MCP, Connector, Function, Service)
        ├─ Runs (record everything)
        └─ Artifacts (preserve outcomes)
        ↓
Collaboration
        ├─ Threads (discussion)
        ├─ Channels (communication)
        └─ Events (audit trail)
```

---

## Getting Started

1. **Read AGENTS.md** - Understand how to work in this repository
2. **Read ARCHITECTURE_V2.md** - Understand the model
3. **Read a relevant ADR** - Understand the decision that affects your work
4. **Look at examples** - See how concepts are used in packages/*/examples/
5. **Run code** - Start implementing

---

## Principles in Practice

### ✅ Prefer
- YAML configuration over code abstractions
- Filesystem packages over database configs
- Explicit concepts over implicit behavior
- Industry patterns over custom terminology
- Simple composition over complex hierarchies

### ❌ Avoid
- New ontology concepts (use the 10 we have)
- Code-based agent definitions (use YAML)
- Hard-coded domain logic in platform code
- Mixing UI concerns with runtime concerns
- Inventing new patterns before borrowing existing ones

---

## Contributing

This is an open, evolving platform. Contributions are guided by:

1. **Respect the 10 core concepts** - Don't add new ones without an ADR
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

Just 10 concepts. Everything you need. Nothing you don't.

---

**The Agent Platform. Simple architecture. Powerful execution.**
