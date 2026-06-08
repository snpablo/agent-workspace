# Partner Workspace

## Goal

Prove that an operational, high-frequency workflow can be expressed on the same platform as the decision workspace.

## Platform Reading

For a partner or renewal workflow:

- the `Work Item` is the partner case or renewal case
- the `Workspace` is the collaboration container
- the `Outputs` are results like analysis, proposal draft, outreach draft, and resolution package
- the `Actions` are business next steps such as apply recommendation, create proposal, or schedule outreach

## Workspace Definition

```json
{
  "workspaceType": "partner-operations",
  "workItemType": "partner-renewal",
  "primaryOutputType": "renewal-analysis",
  "relatedOutputTypes": ["outreach-draft", "proposal-draft"],
  "agentRoles": ["renewal", "licensing", "support", "knowledge", "coordinator"],
  "actionTypes": [
    "apply-recommendation",
    "create-proposal",
    "schedule-call",
    "open-support-ticket",
    "add-internal-note"
  ]
}
```

## Typical Flow

1. A renewal case enters the queue as a work item.
2. A workspace opens around that work item.
3. Agents gather account, product, support, and usage context.
4. The platform produces a renewal-analysis output.
5. Additional outputs may be generated, such as proposal and outreach drafts.
6. Users review recommendations and execute actions.

## Why This Workspace Matters

This is the pressure test for the architecture because it is not centered on a single polished report.

It is centered on a live business case with:

- many tasks
- multiple outputs
- rapid back-and-forth
- direct operational actions

That is why `Work Item` needs to exist alongside `Output`.

## UI Mapping

A partner workspace usually presents:

- left: task queue and thread
- center: work item overview and primary output
- right: actions, agent activity, and quick actions

## Success Condition

If the operational workspace fits the same domain model as the decision workspace, the platform abstraction is on the right track.
