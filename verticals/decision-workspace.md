# Decision Workspace

## Goal

Prove that a decision-oriented product can be represented as a workspace configuration on the platform rather than as a separate architecture.

## Workspace Definition

```json
{
  "workspaceType": "decision",
  "workItemType": "decision-case",
  "primaryOutputType": "decision-report",
  "agentRoles": ["research", "analyst", "risk", "editor"],
  "actionTypes": ["approve", "request-revision", "export", "create-followup-task"]
}
```

## Typical Flow

1. A user opens a decision workspace around a decision case.
2. A coordinator or research agent creates initial tasks.
3. Agents collect knowledge and draft output sections.
4. The output is reviewed by users and optionally other agents.
5. The workspace produces actions such as approval, export, or follow-up work.

## Decision Report Shape

Suggested sections:

- summary
- framing
- options
- recommendation
- risks
- knowledge sources
- next steps

## Why This Works As A Workspace Type

Nothing in the flow above requires `decision` to be a foundational platform object.

The workspace is expressed through:

- workspace type
- work item type
- output type
- agent mix
- action set
- section definitions

That is the test the platform needs to pass.

## Failure Condition

If we discover that decision work requires unique foundational objects that cannot be generalized, then the platform abstraction is too thin or incorrectly named.
