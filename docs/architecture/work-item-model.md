# Work Item Model

## Purpose

The work item is the business object the workspace is actually about.

This matters because many operational screens combine:

- a real-world case or account
- one or more AI-generated outputs
- tasks, knowledge sources, actions, threads, and runs around that case

If we collapse all of that into `Output`, the model becomes too vague for operational workflows.

## Examples

- decision case
- partner renewal
- support case
- quote request
- implementation project
- incident

## Base Shape

```ts
interface WorkItem {
  id: string;
  type: string;
  title: string;
  workspaceId: string;
  status: string;
  ownerId?: string;
  externalRef?: string;
  summary?: string;
  metadata: Record<string, unknown>;
  primaryOutputId?: string;
  outputIds: string[];
  taskIds: string[];
  actionIds: string[];
  threadIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Why It Exists

The work item gives us a clean way to represent operational screens like:

- a renewal with recommendations, proposal drafts, and outreach
- a support case with analysis, timeline, and escalation package
- an acquisition evaluation with a decision report and risk memo

In each case:

- the work item is the case
- outputs are results about the case

## Boundary Rules

- A work item is not the same thing as an output.
- A work item may have multiple linked outputs.
- A work item may outlive any single output version.
- A queue usually lists work items, not outputs.
- A work item should normally own one primary output once active work is underway.

## Common Relationships

```text
Workspace
  |- Work Items

Work Item
  |- Primary Output
  |- Related Outputs
  |- Tasks
  |- Actions
  |- Threads
  |- Knowledge Source References
```

## Design Guidance

Use `Work Item` when the user cares about progressing a business case through a workflow.

Use only `Output` when the system is primarily producing a standalone deliverable and the case context is minimal.

## Ownership Decision

The default ownership model should be:

- one work item owns zero or more outputs
- one work item may designate one primary output
- one output belongs to one owning work item by default
- reuse across work items should happen through references, copies, or forks rather than shared mutable ownership

Knowledge sources may attach directly to the work item when they provide broad case context rather than support for one specific output section.

## Open Questions

- Which work item fields should be standardized across workspace types versus left to metadata?
