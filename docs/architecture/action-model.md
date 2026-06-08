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
  assigneeId?: string;
  targetRef?: string;
  metadata: Record<string, unknown>;
}
```

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

## Open Questions

- Which actions are safe for direct execution by an agent?
- Which actions require approval gates?
- Do actions live independently, or only as projections from outputs and tasks?
