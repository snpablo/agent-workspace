# UI Domain Mapping

This document connects the architecture model to the mockup screens.

The goal is not to claim that every visible panel is exactly one persisted domain object. The goal is to show how the main domain objects tend to surface in the UI shell.

## Visual Set

### Decision Workspace

- Original: [Decision Workspace Original](../../images/originals/decision-workspace.png)

### Partner Workspace

- Original: [Partner Workspace Original](../../images/originals/partner-workspace.png)

### HR Workspace

- Original: [HR Workspace Original](../../images/originals/hr-workspace.png)

### Finance Workspace

- Original: [Finance Workspace Original](../../images/originals/finance-workspace.png)

## Core Reading

Across the current workspace set:

- `Workspace` is the outer shell and collaboration boundary
- `Work Item` is the real-world case in motion
- `AI Assistant` is the request, synthesis, and follow-up surface
- `Output` is the durable result produced about that case
- `Knowledge Source` supports grounding, trust, and review
- the `Agents` panel makes specialist agent roles visible and inspectable as a shared UI surface over run state
- `Action` turns insight into operational next steps
- `Run` explains execution history beyond thread history

`Skill` is intentionally not boxed as a primary screen region in these mockups. It is a runtime and workflow layer between `Agent` and `Tool`, not usually a first-class content panel.

The shared shell is:

1. left: work queue
2. center-left: AI assistant surface
3. center-right: primary output plus supporting outputs
4. right: knowledge sources, agents, and actions

## Decision Workspace Mapping

Reference: [Decision Workspace Original](../../images/originals/decision-workspace.png)

- `Workspace`: the full shell, navigation, and active session frame
- `AI Assistant`: the center-left panel where the user asks follow-up questions and the assistant synthesizes the case
- `Work Item`: the acquisition evaluation context across the top of the main content area
- `Output`: the central decision report and its sections
- `Knowledge Source`: the top-right rail with source material
- `Agents`: the mid-right panel with visible specialist agent roles
- `Action`: the bottom-right approval and follow-up controls

This screen leans heavily toward a single primary output with supporting knowledge sources and explicit approval actions, while still using the same shared shell as the more operational workspaces.

Interaction guidance for this layout:

- keep the work-item context fixed at the top
- keep the AI assistant focused on synthesis and follow-up rather than making it the system of record
- keep approval controls anchored rather than buried in scrollable history
- visually map AI follow-up prompts to output-section updates

## Partner Workspace Mapping

Reference: [Partner Workspace Original](../../images/originals/partner-workspace.png)

- `Workspace`: the full shell around the active account or renewal flow
- `Work Queue`: the left queue of active business cases
- `Work Item`: the renewal case header and business context
- `AI Assistant`: the center-left panel where the assistant synthesizes risks and proposes next steps
- `Output`: the renewal analysis and draft outreach surfaces in the center-right region
- `Knowledge Source`: the top-right panel with partner context and supporting documents
- `Agents`: the mid-right panel with visible specialist agents
- `Action`: the bottom-right panel with operational next steps
- `Work Item Data`: operational details such as products, renewal date, value, and trend

This screen is more operational than the decision workspace. It centers on a live work item that can produce multiple outputs and multiple actions at once.

Interaction guidance for this layout:

- preserve the work-item header as fixed context
- keep the AI assistant visible during long operational sessions
- keep actions anchored and visible during long thread sessions
- reflect AI-driven updates directly in the related output panel

## HR Workspace Mapping

Reference: [HR Workspace Original](../../images/originals/hr-workspace.png)

- `Workspace`: the full shell around the active hiring or candidate-review case
- `Work Queue`: the left queue of candidate review cases
- `Work Item`: the candidate header and case metadata across the top
- `AI Assistant`: the center-left panel where the assistant summarizes feedback, answers reviewer questions, and proposes next steps
- `Output`: the evaluation summary and supporting interview materials in the center-right region
- `Knowledge Source`: the top-right panel with interview notes, rubric items, and policy material
- `Agents`: the mid-right panel with specialist agents such as evaluation, summary, and policy check
- `Action`: the bottom-right panel with advancement, revision, and scheduling actions

This screen demonstrates that the same shell can support people workflows with sensitive context, durable evaluation outputs, and explicit next-step actions.

## Finance Workspace Mapping

Reference: [Finance Workspace Original](../../images/originals/finance-workspace.png)

- `Workspace`: the full shell around the active vendor or spend review case
- `Work Queue`: the left queue of finance review cases
- `Work Item`: the vendor or review-case header and financial metadata across the top
- `AI Assistant`: the center-left panel where the assistant synthesizes pricing, risk, and recommendation logic
- `Output`: the recommendation report and related finance artifacts in the center-right region
- `Knowledge Source`: the top-right panel with contracts, budgets, benchmarks, and prior approvals
- `Agents`: the mid-right panel with finance, risk, benchmark, and approval-brief agents
- `Action`: the bottom-right panel with approval, revision, escalation, and follow-up actions

This screen demonstrates that the same shell can support structured, auditable finance workflows without changing the core object model.

## Important Caveat

The mapping is intentionally approximate in a few places:

- a single panel may surface more than one domain object
- an `Output` may be represented as multiple UI blocks
- `Action` can appear both as a side rail and inline controls
- `Agents` may appear as a roster even when underlying run data is richer than what is shown
- `Run` history may appear as dedicated inspection detail even when it is not exposed in the main shell

That looseness is expected. The domain model should stay stable even when the UI composition varies by workspace type.
