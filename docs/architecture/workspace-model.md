# Workspace Model

## Purpose

A workspace is the collaboration container where users and agents work around a work item, one or more outputs, and one or more threads.

It is not just a chat screen. It is the operating context for work.

## Workspace Responsibilities

- define scope
- anchor on a work item
- hold members and permissions
- track active tasks
- host threads
- organize outputs
- surface knowledge sources and derived agent state
- expose available actions

## Base Shape

```ts
interface Workspace {
  id: string;
  type: string;
  title: string;
  status: "active" | "archived";
  primaryWorkItemId?: string;
  members: WorkspaceMember[];
  outputIds: string[];
  taskIds: string[];
  threadIds: string[];
  actionIds: string[];
  metadata: Record<string, unknown>;
}
```

## Workspace Type

Workspace type should define orientation and defaults, not replace the core model.

Examples:

- decision
- research
- partner-operations
- incident
- implementation

A workspace type may define:

- default output types
- available agent roles
- default action sets
- layout preferences
- workflow rules

## Suggested Surface Areas

```text
Workspace
  |- Work Item Header
  |- Work Queue
  |- AI Assistant
  |- Primary Output
  |- Knowledge Panel
  |- Agents
  |- Actions
```

## Interaction Guidance

The visual hierarchy should reinforce the cognitive flow of the workspace:

1. `Work Item` stays fixed and visible as the top-level context.
2. `AI Assistant -> Output -> Knowledge Source` forms the main left-to-right reading path.
3. `Agents` and run-derived state explain the lower-level execution activity that is moving the output forward.

In practice, this means:

- the work-item header should remain stable while users move between the assistant surface, output, and references
- the output should remain the visual center of gravity
- execution-state surfaces should support inspection without permanently consuming prime screen real estate

## Composition Rules

1. A workspace may contain multiple outputs.
2. A workspace should usually have one primary work item in focus.
3. One output may be marked as primary for the current flow.
4. Outputs may link to each other.
5. A thread may reference tasks, knowledge sources, and outputs, but does not replace them.
6. Agent state should be inspectable without exposing every internal reasoning trace.

## Primary Output Decision

A workspace does not need a primary output at the instant it is created.

However:

- active collaborative workspaces should normally designate one primary output
- workspace types that intentionally operate without a durable output should declare that explicitly
- UI shells should not assume outputlessness as the default steady state

This keeps intake and setup lightweight without weakening the output-centered model.

## Cross-Workspace Reference Decision

Cross-workspace references should be supported as links, not shared mutable ownership.

That means:

- one workspace owns an output
- another workspace may reference it
- edits in the non-owning workspace require a copy, fork, or new local output
- tasks and actions remain local to the workspace that creates them

## Collaboration Model

Workspace collaboration can happen on several layers:

- users collaborate with users
- users collaborate with agents
- agents collaborate with other agents through tasks, runs, and output handoffs

The platform should treat these as explicit interactions, not implicit prompt state.

## Layout Recommendations

### Inspectable Agent State

Visible agent state is often a projection over `Run`, `Task`, and `Action` data rather than its own primary object.

Recommendation:

- treat the visible `Agents` panel as a compact roster or summary surface
- allow deeper run inspection to expand on demand rather than permanently consuming prime screen real estate
- keep the main shell centered on work item, assistant, output, knowledge, and actions

### Anchored Actions

High-value actions such as approval, export, publish, or escalation should remain visible without requiring the user to scroll through assistant history.

Recommendation:

- anchor critical actions either:
  - in a sticky bottom action bar, or
  - pinned near the upper-right area of the primary output

### Thread-To-Output Traceability

An assistant interaction that requests a change to a specific output section should visibly map to the output surface.

Recommendation:

- changing sections should show loading, updating, or highlighted states
- output updates should reflect which region is currently being modified
- the user should not have to infer whether the assistant request affected the output

## Open Questions

- Should a workspace ever exist without a primary work item?
- How much run history should remain visible after output publication?
- Are cross-workspace queues first-class, or derived views across workspace-local tasks?
