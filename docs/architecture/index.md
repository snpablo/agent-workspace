# Architecture Index

This folder captures the current architecture baseline for the `Agent Workspace Platform`.

The documents are ordered from core domain concepts outward into workspace composition and vertical proof points.

**Key design principle:** The platform uses **metadata-driven composition** (inspired by the wizard framework pattern) to enable different workspace shells to share the same core domain model. Agents, skills, tools, and outputs are stable across workspace types; UI zones, panel layouts, and component bindings are defined through configuration metadata rather than hard-coded screens. This approach eliminates duplicate UI logic, enables skill reuse across partner, HR, finance, decision, and research workflows, and keeps the architecture extensible.

Use these docs for the current architecture model. Use `docs/adr/` for durable decisions and tradeoffs that explain why the model looks the way it does.

## Core Models

- [Domain Model](domain-model.md): core objects and their boundaries
- [Workspace Model](workspace-model.md): the collaboration container
- [Workspace Composition Model](workspace-composition-model.md): metadata-driven UI composition and interpreter boundaries
- [Workspace Visual System](workspace-visual-system.md): shared visual rules for workspace mockups across domains
- [Workspace Object-Panel Mapping](workspace-object-panel-mapping.md): manual object-to-panel references for annotating the current workspace originals
- [Runtime Event Model](runtime-event-model.md): transient execution signals for live agent workflows
- [Work Item Model](work-item-model.md): the business case or object under active work
- [Output Model](output-model.md): the durable results produced in the workspace
- [Agent Model](agent-model.md): reasoning roles and orchestration boundaries
- [Skill Model](skill-model.md): packaged domain workflow behavior between agents and tools
- [Knowledge Source Model](knowledge-source-model.md): grounding and support for claims and recommendations
- [Action Model](action-model.md): executable or reviewable next steps

## Vertical Proofs

- [Partner Workspace](../../verticals/partner-workspace.md)
- [Decision Workspace](../../verticals/decision-workspace.md)
- [HR Workspace](../../verticals/hr-workspace.md)
- [Finance Workspace](../../verticals/finance-workspace.md)

## Visual References

- [UI Domain Mapping](ui-domain-mapping.md)
- [Decision Workspace Original](../../images/originals/decision-workspace.png)
- [Partner Workspace Original](../../images/originals/partner-workspace.png)
- [HR Workspace Original](../../images/originals/hr-workspace.png)
- [Finance Workspace Original](../../images/originals/finance-workspace.png)
- [Agent - Skill - Tool Hierarchy](../../images/diagrams/agent-skill-tool-hierarchy.svg)

## Reading Order

1. [Domain Model](domain-model.md)
2. [Workspace Model](workspace-model.md)
3. [Workspace Composition Model](workspace-composition-model.md)
4. [Workspace Visual System](workspace-visual-system.md)
5. [Workspace Object-Panel Mapping](workspace-object-panel-mapping.md)
6. [Runtime Event Model](runtime-event-model.md)
7. [Work Item Model](work-item-model.md)
8. [Output Model](output-model.md)
9. [Agent Model](agent-model.md)
10. [Skill Model](skill-model.md)
11. [Knowledge Source Model](knowledge-source-model.md)
12. [Action Model](action-model.md)
13. the vertical workspace docs
14. [UI Domain Mapping](ui-domain-mapping.md)

## Interpretation Note

The current visual set intentionally keeps the original workspace mockups as the baseline reference. Future annotations may evolve, but the domain model should remain stable even as the visual overlays change.
