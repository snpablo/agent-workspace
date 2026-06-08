# Execution Plan Index

This index tracks the active execution plans in this repository, what has already been accomplished, and what remains before each plan can be considered complete.

For the fastest repo-level orientation, start with [ROADMAP.md](../ROADMAP.md).

## Active Plans

### `01-model-objects.md`

- Status: `complete`
- Accomplished:
  - core model objects are defined in [docs/architecture/domain-model.md](../docs/architecture/domain-model.md)
  - all core objects are now explicitly explained in the domain model
  - Microsoft-aligned terminology is in place
  - ownership, lifecycle, and boundary rules are documented
  - `Skill` has been restored as a first-class object between `Agent` and `Tool`
  - persistence-boundary decisions are documented
  - the primary-output rule is documented
  - cross-workspace reference rules are documented
- Remaining:
  - none for this plan; future refinements should move to later plans or ADRs

### `02-output-architecture.md`

- Status: `mostly complete`
- Accomplished:
  - [docs/architecture/output-model.md](../docs/architecture/output-model.md) exists
  - output families and output type registry shape are documented
  - decision and operational outputs both fit the model
- Remaining:
  - define stronger rules for when an output becomes multiple linked outputs
  - decide when an output should be rendered specifically as a Page versus another output experience
  - add more concrete sample output type definitions if needed

### `03-workspace-architecture.md`

- Status: `mostly complete`
- Accomplished:
  - [docs/architecture/workspace-model.md](../docs/architecture/workspace-model.md) exists
  - workspace composition is documented
  - decision and partner mockups can both be explained through the workspace model
  - UI mapping doc and annotated images support the shell concept
- Remaining:
  - decide how much run history should remain visible by default
  - clarify whether cross-workspace queues are first-class or derived
  - tighten the distinction between workspace type, layout preference, and workflow policy

### `04-agent-skill-tool-architecture.md`

- Status: `substantially complete`
- Accomplished:
  - [docs/architecture/agent-model.md](../docs/architecture/agent-model.md) now uses the three-tier hierarchy
  - [docs/architecture/skill-model.md](../docs/architecture/skill-model.md) was added
  - `Agent -> Skill -> Tool` is now explicit in the architecture
  - a supporting diagram was added: [Agent - Skill - Tool Hierarchy](../images/architecture/derived/agent-skill-tool-hierarchy.svg)
- Remaining:
  - decide which workflow packages deserve first-class skills versus embedded policy
  - decide whether skill changes should imply run boundaries
  - deepen Microsoft source references for skills where helpful

### `05-first-vertical.md`

- Status: `in progress`
- Accomplished:
  - [verticals/decision-workspace.md](../verticals/decision-workspace.md) exists
  - the decision-oriented experience fits the shared platform model
  - the vertical maps back to the architecture and the UI references
- Remaining:
  - prove the same architecture holds under stronger cross-vertical pressure
  - tighten the configuration story for skill selection in the first vertical
  - decide whether approval patterns need additional first-class modeling

## Completion Signal

The active plan set can be considered complete when:

- the core architecture docs are internally consistent
- the Microsoft terminology layer is stable
- the first vertical is clearly configuration on top of the platform
- the remaining open questions are either resolved or intentionally deferred into ADRs
