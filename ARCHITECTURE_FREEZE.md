# Architecture Freeze

This file marks the end of architecture discovery for the current phase.

The architecture is frozen with industry-standard agent platform vocabulary.

## Frozen Decisions

### Canonical Vocabulary

The following terms are canonical and must be used consistently:

**Organizing & Configuration**
- `Project` - organizing container (replaces "Workspace")
- `Tool` - external capability definition (API, function, service)
- `Skill` - reusable know-how (composes Tools and Skills)
- `Agent` - autonomous or semi-autonomous actor
- `Schedule` - trigger definition (time-based, event-based)
- `Channel` - send/receive interface (Slack, email, HTTP)
- `Resource` - context data (documents, credentials, configs)

**Execution & Outcomes**
- `Run` - execution record (finite, immutable, auditable)
- `Artifact` - durable outcome (versioned, collaborative)
- `Thread` - conversation or discussion context
- `Sandbox` - isolated execution environment
- `Eval` - evaluation or assessment

**Relationships**
- Agents execute in Projects
- Agents use Tools and Skills
- Runs record Agent execution
- Artifacts preserve outcomes
- Threads capture collaboration
- Resources provide context
- Schedules trigger work

### Deprecated Terms

The following historical terms are deprecated and should not appear in new implementation work:

- `Workspace` → use `Project`
- `WorkItem` → removed (use Agent to perform work in Projects)
- `Playbook` → use Agent definition + Schedule
- `Definition/Instance` pattern → use Tool/Skill (definitions) and Run/Agent (instances)
- `Capability` → use Tool or Skill
- `Workflow` → use Agent behavior or Schedule
- `Integration` → use Tool
- `WorkspaceDefinition` → use Project definition or Agent definition

### Event Naming

Events follow `<object>.<verb>` pattern:
- `Agent.executed`
- `Run.created`
- `Artifact.created`
- `Artifact.versioned`
- `Thread.message_added`
- etc.

### Project Composition

Projects expose these top-level configurations:

```yaml
Project:
  id: string
  type: string
  version: integer
  displayName: string
  agents:
    - Agent definitions available in this project
  tools:
    - Tool definitions available to agents
  skills:
    - Skill definitions available to agents
  channels:
    - Channel integrations for this project
  schedules:
    - Automated triggers
  resources:
    - Shared context data
  artifact_types:
    - Artifact types created in this project
  permissions:
    - Access and authorization rules
  policies:
    - Behavioral constraints
```

### Core Abstractions

**Run**
- Finite execution instance
- Immutable record
- References Agent, Tool/Skill invoked
- Records outcome (Artifact, state change)
- Auditable with full provenance

**Artifact**
- Durable outcome of work
- Versioned and timestamped
- Auditable (who, when, why)
- Collaborative (Humans and Agents can review/modify)
- Typed per Project

**Agent**
- Autonomous or semi-autonomous actor
- Has Tools, Skills, and Instructions
- Creates Runs and Artifacts
- Participates in Threads
- Observable execution

**Thread**
- Conversation between Humans and Agents
- Linked to Artifacts and Runs for context
- Part of Project collaboration history

## Architecture Evolution Notes

The v1 architecture transitions from custom "Workspace" vocabulary to industry-standard "Project/Agent/Tool/Skill" vocabulary.

This change:
- Aligns with how agent platforms (LangGraph, AutoGen, etc.) describe these concepts
- Reduces cognitive load for people familiar with agent frameworks
- Makes integration with other systems easier
- Better reflects industry standards

Earlier terminology in historical docs is retained for context but not normative.

Reference documents:

- [CANONICAL_MODEL.md](CANONICAL_MODEL.md)
- [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md)
- [SCHEMA_INVENTORY.md](SCHEMA_INVENTORY.md)

## Implementation Scope For Next Phase

The next phase is establishing runtime infrastructure.

In scope:

- Schema updates for new vocabulary
- Type system for Tool, Skill, Agent, Project, Run, Artifact, Thread
- Interpreter for Agent and Project definitions
- Runtime for executing Agents and recording Runs
- Collaboration support (Threads, Participants)
- Artifact versioning and audit

Out of scope:

- Domain-specific runtime behavior
- Separate applications for different project types
- Advanced scheduling features
- Custom UI components

## Explicit Non-Goals

The following are non-goals for this phase:

- production-grade Agent execution
- provider-specific integrations beyond basic Tool support
- infrastructure setup and deployment
- fully realized UI application code
- Machine learning model hosting
- Cost optimization

## Next Packages To Implement

Implementation order:

1. `packages/schemas` - Tool, Skill, Agent, Project, Run, Artifact, Thread
2. `packages/types` - TypeScript interfaces
3. `packages/definitions` - Builders for definitions
4. `packages/interpreter` - Interpret definitions to runtime configs
5. `packages/runtime` - Execute Agents, record Runs
6. `packages/sdk` - Client SDK for Agent development
7. `packages/shell` - Collaboration and inspection UI

## Final Constraints

**Generic Over Specific**

Prefer fewer, more generic platform abstractions.

Do not introduce new platform root concepts when specialization suffices.

**One Runtime**

All Project types must work with a single runtime and Agent execution model.

Do not create separate platforms or runtimes for different domains.

**Standards Alignment**

Use industry-standard vocabulary (Agent, Tool, Skill, Run) rather than inventing domain-specific terms.

This makes the platform more accessible and easier to integrate.
