# Glossary

This glossary defines vocabulary for the Agent Platform.

> **Note:** The platform is migrating from Phase 1 (Workspace/WorkItem/Playbook) to Phase 2 (Project/Agent/Tool/Skill). This glossary documents both. See [ARCHITECTURE_MIGRATION.md](ARCHITECTURE_MIGRATION.md) for the full transition.

## A

### Action

Executable or reviewable next step in a project.

**Status:** Phase 1 concept; may be subsumed into Run + Artifact + Thread in Phase 2.

### Agent

Autonomous or semi-autonomous actor that performs work in a project.

**Status:** Core Phase 2 concept (replaces Playbook/Agent role).

### AgentDefinition

Declarative description of an agent's capabilities, configuration, and behavior.

**Status:** Phase 2 (replaces PlaybookDefinition as the orchestration root).

### AgentPanel

Canonical shell zone for agent and run visibility.

**Status:** Phase 1 concept; will be recontextualized for Phase 2 runtime shell.

### AgentSession

Long-lived participation context for an agent. May span multiple runs.

**Status:** Phase 1 concept; kept in Phase 2 for agent continuity.

### Artifact

Durable result or outcome of work. Versioned, auditable, collaborative.

**Status:** Core Phase 1 and Phase 2 concept (replaces `Output`).

Historical terms:
- `Output` (deprecated)

### ArtifactDefinition

Declarative description of an artifact type, including sections, relationships, and schema.

**Status:** Phase 1 and Phase 2 (unchanged).

### ArtifactInstance

Runtime artifact created, edited, reviewed, or published in a project.

**Status:** Phase 1 (will be simplified to just `Artifact` in Phase 2).

### ArtifactSurface

Canonical shell zone where artifacts are rendered and edited.

**Status:** Phase 1 concept; will be recontextualized for Phase 2 shell.

## B

### Binding

Mapping between a zone, an object kind, and the view that renders that object kind in that zone.

**Status:** Phase 1 UI concept; may be deprecated in Phase 2 headless-first model.

### BusinessState

Runtime state branch holding durable business objects and relationships.

**Status:** Phase 1 concept; will evolve for Phase 2 state model.

## C

### Capability

Generalized concept for something an agent can invoke.

**Status:** Deprecated. Use `Tool` (external capability) or `Skill` (composed know-how) instead.

### Channel

Message send/receive point (Slack, email, HTTP webhook, etc.).

**Status:** Phase 2 concept; first-class platform object for communication.

### ComponentDefinition

Renderable component type for shell rendering.

**Status:** Phase 1 UI concept; role may change in Phase 2.

### ComponentTree

Normalized interpreter output describing shell structure, selected components, bindings, and metadata.

**Status:** Phase 1 concept; will become `ExecutableConfiguration` in Phase 2.

### Connector

Backend mechanism for a Tool (database connector, SaaS connector, etc.).

**Status:** Implementation detail, NOT platform vocabulary. Use `Tool` instead.

## D

### Definition

Declarative, versioned, portable description of a platform concept (Agent, Tool, Skill, etc.).

**Status:** Phase 1 uses Definition/Instance split; Phase 2 uses Definition and Runtime separately.

## E

### Event

Canonical runtime event. Named with `<object>.<verb>` pattern.

**Status:** Phase 1 and Phase 2 (unchanged).

### Eval

Evaluation or assessment of outputs.

**Status:** Phase 2 concept; planned for evaluation/quality assessment.

## I

### Instance

Runtime realization of a definition.

**Status:** Phase 1 pattern (Definition/Instance split); Phase 2 uses Definition for configs and Runtime for instances.

### Integration

Connection to external systems.

**Status:** Deprecated. Use `Tool` instead; integrations are tool backing mechanisms.

### Interpreter

Platform component that transforms definitions into executable configuration.

**Status:** Phase 1 and Phase 2 (core to both).

## K

### KnowledgePanel

Canonical shell zone for grounding sources and supporting evidence.

**Status:** Phase 1 concept; will be recontextualized for Phase 2.

### KnowledgeSource

Document, dataset, note, system, or evidence source grounding work.

**Status:** Phase 1 concept; will become `Resource` in Phase 2.

## L

### LayoutState

Runtime state branch for shell presentation (visibility, splits, modals, pinning).

**Status:** Phase 1 concept; may evolve for Phase 2 shell.

## M

### Metadata-driven composition

Architectural principle that experiences are assembled from definitions rather than hard-coded logic.

**Status:** Core principle across both phases.

### ModalSurface

Canonical shell zone for overlays and interruptive flows.

**Status:** Phase 1 concept; will be recontextualized for Phase 2.

### MCP

Model Context Protocol - a tool backing mechanism.

**Status:** Implementation detail, NOT platform vocabulary. Tools can be MCP-backed; MCP is not a platform concept.

## N

### NavigationState

Runtime state branch describing current path, focus, history, and active surface.

**Status:** Phase 1 concept; will evolve for Phase 2.

## P

### Participant

Human or agent actor in a project.

**Status:** Phase 1 and Phase 2 (unchanged).

### Permission

Declarative rule for access or allowed operations.

**Status:** Phase 1 and Phase 2 (unchanged).

### Playbook

Process or orchestration definition (deprecated).

**Status:** Phase 1 concept. In Phase 2, broken into: Agent (who), Schedule (when), and Tool/Skill invocation (what).

**Replaces:** `Playbook` → `Agent` + `Schedule`

### PlaybookDefinition

Declarative orchestration definition with activities and transitions.

**Status:** Phase 1 concept; will be replaced by Agent + Schedule in Phase 2.

### PlaybookInstance

Runtime execution of a playbook.

**Status:** Phase 1 concept; will be replaced by Run in Phase 2.

### Policy

Declarative rule for behavior, visibility, or execution constraints.

**Status:** Phase 1 and Phase 2 (unchanged).

### Project

Organizing container for agents, tools, resources, and work (replaces Workspace).

**Status:** Phase 2 core concept (replaces `Workspace`).

### Provider

Generic source of capabilities (deprecated).

**Status:** Not platform vocabulary. Use `Tool` instead.

## Q

### Queue

Canonical shell zone for work items.

**Status:** Phase 1 concept; role may change in Phase 2 runtime model.

## R

### Resource

Context data (documents, configs, credentials) available to agents.

**Status:** Phase 2 concept (replaces `KnowledgeSource`).

### Run

Finite execution instance. Emits events and represents auditable work.

**Status:** Phase 1 and Phase 2 core concept (unchanged).

### Runtime

Live execution layer managing state, collaboration, activity, and persistence.

**Status:** Core to both phases.

## S

### Sandbox

Isolated execution environment for agents with resource constraints.

**Status:** Phase 2 concept; part of agent execution model.

### Schedule

Automated trigger definition (time-based, event-based, etc.).

**Status:** Phase 2 concept; replaces PlaybookInstance scheduling.

### SelectionState

Runtime state branch for currently selected item, artifact, thread, etc.

**Status:** Phase 1 and Phase 2 (evolved scope).

### Skill

Reusable, composable know-how built from Tools and other Skills.

**Status:** Phase 1 and Phase 2 core concept (unchanged).

### SkillDefinition

Declarative reusable capability definition.

**Status:** Phase 1 and Phase 2 (unchanged).

## T

### Thread

Conversation or discussion with collaboration context.

**Status:** Phase 1 (as Session); Phase 2 (as Thread, more general).

### Tool

Capability that an agent can invoke. First-class platform concept.

Backing mechanisms (NOT platform vocabulary):
- API endpoints
- Connectors (database, SaaS, etc.)
- MCP servers
- Native code (Python, JavaScript, etc.)
- Platform services

**Status:** Phase 2 core concept.

### ToolDefinition

Declarative description of a tool capability.

**Status:** Phase 1 and Phase 2 (unchanged).

## V

### View

Specialized rendering profile for a component bound to an object kind.

**Status:** Phase 1 UI concept; role may change in Phase 2.

## W

### Workflow

Sequential or parallel execution of work (deprecated).

**Status:** Phase 1 informal term. Use `Agent` or `Run` instead.

### Workspace

Organizing container for work (deprecated).

**Status:** Phase 1 concept. Replaced by `Project` in Phase 2.

### WorkspaceDefinition

Declarative workspace type description.

**Status:** Phase 1 concept. Replaced by `ProjectDefinition` in Phase 2.

### WorkspaceInstance

Runtime realization of a workspace definition.

**Status:** Phase 1 concept. Replaced by `Project` (runtime) in Phase 2.

### Workspace Shell

Zone-based UI frame for workspace rendering.

**Status:** Phase 1 concept; architectural model may change for Phase 2 headless focus.

### WorkspaceState

Top-level runtime state tree.

**Status:** Phase 1 and Phase 2 (evolved scope for Phase 2).

### WorkItem

Business anchor for active work (deprecated in Phase 2).

**Status:** Phase 1 queue root concept. In Phase 2, replaced by explicit Agent execution and Run records.

**Replacement:** `WorkItem` → `Agent` + `Run`

## Z

### Zone

Named region in the workspace shell.

**Status:** Phase 1 UI concept; role may change in Phase 2 headless model.

---

## Migration Summary

| Phase 1 | Phase 2 | Type |
|---------|---------|------|
| Workspace | Project | Container |
| WorkItem | (removed) | Use Agent + Run |
| Playbook | Agent + Schedule | Process |
| Capability | Tool or Skill | Capability |
| Integration | Tool | Backing mechanism |
| KnowledgeSource | Resource | Context |
| Session | Thread | Collaboration |
| Definition/Instance | Definition / Runtime | Organization |
| Output | Artifact | Outcome |

See [ARCHITECTURE_MIGRATION.md](ARCHITECTURE_MIGRATION.md) for full context.
