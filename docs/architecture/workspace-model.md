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
- surface knowledge sources and agent activity
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
  |- Task Queue
  |- Thread
  |- Primary Output
  |- Knowledge Panel
  |- Agent Activity
  |- Actions
  |- Run History
```

## Composition Rules

1. A workspace may contain multiple outputs.
2. A workspace should usually have one primary work item in focus.
3. One output may be marked as primary for the current flow.
4. Outputs may link to each other.
5. A thread may reference tasks, knowledge sources, and outputs, but does not replace them.
6. Agent activity should be inspectable without exposing every internal reasoning trace.

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

## Open Questions

- Should a workspace ever exist without a primary work item?
- How much run history should remain visible after output publication?
- Are cross-workspace queues first-class, or derived views across workspace-local tasks?

## Microsoft References

- [Set up your environment for Azure AI Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-services/agents/environment-setup)
- [Get started with Microsoft Loop](https://support.microsoft.com/en-us/office/get-started-with-microsoft-loop-9f4d8d4f-dfc6-4518-9ef6-069408c21f0c)
- [How Microsoft 365 Copilot Pages works](https://support.microsoft.com/en-US/Microsoft-365-Copilot/how-microsoft-365-copilot-pages-works)
- [Microsoft References](resources.md)
