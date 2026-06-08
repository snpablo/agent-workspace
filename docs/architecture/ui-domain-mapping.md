# UI Domain Mapping

This document connects the architecture model to the mockup screens.

The goal is not to claim that every visible panel is exactly one persisted domain object. The goal is to show how the main domain objects tend to surface in the UI.

## Visual Set

### Decision Workspace

- Original: [Decision Workspace Original](../../images/architecture/originals/decision-workspace.png)
- Annotated: [Decision Workspace Annotated](../../images/architecture/annotated/decision-workspace.png)

### Partner Workspace

- Original: [Partner Workspace Original](../../images/architecture/originals/partner-workspace.png)
- Generic base: [Partner Workspace Generic Base](../../images/architecture/derived/partner-workspace-generic.png)
- Annotated: [Partner Workspace Annotated](../../images/architecture/annotated/partner-workspace.png)

## Core Reading

Across both screens:

- `Workspace` is the outer shell and collaboration boundary
- `Work Item` is the real-world case in motion
- `Output` is the durable result produced about that case
- `Thread` is the live interaction surface
- `Knowledge Source` supports grounding, trust, and review
- `Action` turns insight into operational next steps
- `Agent Activity` exposes what the system is doing around the work
- `Run` explains execution history beyond thread history

`Skill` is intentionally not boxed as a primary screen region in these mockups. It is a runtime and workflow layer between `Agent` and `Tool`, not usually a first-class content panel.

## Decision Workspace Mapping

Reference: [Decision Workspace Annotated](../../images/architecture/annotated/decision-workspace.png)

- `Workspace`: the full shell, navigation, and active session frame
- `Thread`: the left panel where the user and agents interact
- `Work Item`: the acquisition evaluation context across the top of the main content area
- `Output`: the central decision report and its sections
- `Knowledge Source`: the right rail with source material
- `Agent Activity`: the lower center panel with agent progress
- `Action`: approval controls
- `Run`: execution timeline area

This screen leans heavily toward a single primary output with supporting knowledge sources and explicit approval actions.

## Partner Workspace Mapping

Reference: [Partner Workspace Annotated](../../images/architecture/annotated/partner-workspace.png)

- `Workspace`: the full shell around the active account or renewal flow
- `Task Queue`: the left queue of active business cases
- `Work Item`: the renewal case header and business context
- `Thread`: the assistant thread in the mid-left column
- `Output`: the recommendations panel and the draft outreach panel
- `Agent Activity`: visible on both the lower-left agent roster and the right-side activity panel
- `Action`: visible in recommendation cards and the quick actions rail
- `Work Item Data`: operational details such as products, renewal date, value, and trend

This screen is more operational than the decision screen. It centers on a live work item that can produce multiple outputs and multiple actions at once.

## Important Caveat

The mapping is intentionally approximate in a few places:

- a single panel may surface more than one domain object
- an `Output` may be represented as multiple UI blocks
- `Action` can appear both as a side rail and inline controls
- `Agent Activity` may appear as both a roster and an execution feed
- `Run` history may appear as a dedicated panel or as part of agent activity

That looseness is expected. The domain model should stay stable even when the UI composition varies by workspace type.

## Microsoft References

- [How Microsoft 365 Copilot Pages works](https://support.microsoft.com/en-US/Microsoft-365-Copilot/how-microsoft-365-copilot-pages-works)
- [Get started with Microsoft Loop](https://support.microsoft.com/en-us/office/get-started-with-microsoft-loop-9f4d8d4f-dfc6-4518-9ef6-069408c21f0c)
- [View agent activity in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-agent-365/observe-agents-microsoft-365-copilot)
- [Custom engine agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-custom-engine-agent)
- [Microsoft References](resources.md)
