# Architecture Index

This folder captures the current architecture baseline for the `Agent Workspace Platform`, tuned to Microsoft’s Build-era vocabulary announced on **June 2, 2026** and reviewed against current Microsoft documentation on **June 8, 2026**.

The documents are ordered from core domain concepts outward into workspace composition and vertical proof points.

Use these docs for the current architecture model. Use `docs/adr/` for durable decisions and tradeoffs that explain why the model looks the way it does.

## Core Models

- [Domain Model](domain-model.md): core objects and their boundaries
- [Workspace Model](workspace-model.md): the collaboration container
- [Work Item Model](work-item-model.md): the business case or object under active work
- [Output Model](output-model.md): the durable results produced in the workspace
- [Agent Model](agent-model.md): reasoning roles and orchestration boundaries
- [Skill Model](skill-model.md): packaged domain workflow behavior between agents and tools
- [Knowledge Source Model](knowledge-source-model.md): grounding and support for claims and recommendations
- [Action Model](action-model.md): executable or reviewable next steps
- [Microsoft References](resources.md): source material for the terminology and architecture alignment

## Vertical Proofs

- [Decision Workspace](../../verticals/decision-workspace.md)
- [Partner Workspace](../../verticals/partner-workspace.md)

## Visual References

- [UI Domain Mapping](ui-domain-mapping.md)
- [Decision Workspace Original](../../images/architecture/originals/decision-workspace.png)
- [Decision Workspace Annotated](../../images/architecture/annotated/decision-workspace.png)
- [Agent - Skill - Tool Hierarchy](../../images/architecture/derived/agent-skill-tool-hierarchy.svg)
- [Partner Workspace Original](../../images/architecture/originals/partner-workspace.png)
- [Partner Workspace Generic Base](../../images/architecture/derived/partner-workspace-generic.png)
- [Partner Workspace Annotated](../../images/architecture/annotated/partner-workspace.png)

## Reading Order

1. [Domain Model](domain-model.md)
2. [Workspace Model](workspace-model.md)
3. [Work Item Model](work-item-model.md)
4. [Output Model](output-model.md)
5. [Agent Model](agent-model.md)
6. [Skill Model](skill-model.md)
7. [Knowledge Source Model](knowledge-source-model.md)
8. [Action Model](action-model.md)
9. [Microsoft References](resources.md)
10. the two vertical workspace docs
11. [UI Domain Mapping](ui-domain-mapping.md)

## Interpretation Note

The annotated mockups are intended to show how domain objects may surface in the UI. They are not strict one-to-one declarations that every boxed region equals exactly one persisted object.
