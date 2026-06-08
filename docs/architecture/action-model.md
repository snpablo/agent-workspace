# Action Model

## Purpose

Actions represent what the system recommends or enables next.

An output without actions may still be useful, but many high-value workflows end with a decision, approval, handoff, export, or system update.

## Action Shape

```ts
interface Action {
  id: string;
  type: string;
  title: string;
  status: "proposed" | "approved" | "queued" | "executed" | "failed" | "canceled";
  sourceOutputId?: string;
  sourceSectionId?: string;
  executionRunId?: string;
  assigneeId?: string;
  targetRef?: string;
  metadata: Record<string, unknown>;
}
```

## Action And Run Relationship

An action may trigger execution, but not every action does.

Examples:

- an approval action may remain human-only
- an export action may trigger a run
- a CRM update action may trigger a run
- a follow-up call action may only assign work to a person

Recommended rule:

- `Action.executionRunId?` is optional
- `Run.triggerActionId?` should be allowed in the run model when a run is action-driven

This keeps the model flexible while preserving traceability for operational pipelines.

## Common Action Families

- review and approval
- follow-up task creation
- export or publish
- customer communication
- CRM or ERP update
- escalation
- scheduling

## Boundary With Tasks

Use `Action` when the emphasis is the business next step.

Use `Task` when the emphasis is tracked work.

Example:

- `Action`: approve renewal recommendation
- `Task`: finance validates pricing assumptions

An action may generate one or more tasks, but the concepts should remain distinct.

When an action shifts into active execution, its status should reflect that state and point to the run responsible for the execution path.

## Open Questions

- Which actions are safe for direct execution by an agent?
- Which actions require approval gates?
- Do actions live independently, or only as projections from outputs and tasks?
