# AGENTS.md

This file defines the working assumptions for agents contributing to this repository.

## Mission

Design an `Agent Workspace Platform` whose core abstractions are durable, reusable, and stable across workspace types and agent implementations.

The architecture should support multiple workspace types, output types, and agent roles without forcing domain-specific language into the foundation.

## Primary Design Rule

When in doubt, optimize for the integrity of the output model.

Questions to keep asking:

- What is the work item the workspace is centered on?
- What durable output is the user actually trying to produce?
- Which knowledge sources ground that output?
- Which actions follow from that output?
- Does this concept belong in the platform, or in a workspace configuration?

## Object Boundaries

- `Workspace` contains collaboration context and work state.
- `Work Item` is the real-world case, account, incident, renewal, or decision case under active work.
- `Output` is the primary durable result.
- `Agent` owns reasoning, planning, and delegation.
- `Skill` owns packaged domain workflow logic above one or more tools.
- `Tool` owns bounded execution against systems and services.
- `Knowledge Source` grounds claims, sections, actions, or conclusions.
- `Action` is a proposed or executable next step.
- `Task` is a unit of work tracked through completion.
- `Thread` is interaction history and context.
- `Message` is an item within a thread.
- `Run` is an execution of an agent over a thread.

Accepted capability hierarchy:

- `Agent -> Skill -> Tool`

## Decision Criteria

Prefer an abstraction when it satisfies all of these:

1. It appears across multiple workspace types.
2. It has a distinct lifecycle.
3. It needs separate permissions, UI, or persistence behavior.

Keep a concept out of the core model when it is primarily:

- industry vocabulary
- a workflow variant
- a view concern
- a prompt concern
- a temporary implementation detail

When a meaningful architecture fork is resolved, capture it in both places:

1. update the relevant `docs/architecture/` documents
2. create or update an ADR in `docs/adr/` when the decision has lasting tradeoffs or should remain auditable

## Near-Term Deliverables

- define the domain model
- define the work item model
- define the output type registry shape
- define workspace composition
- define agent, skill, and tool boundaries
- prove the model with multiple workspace types

## Non-Goals For This Phase

- production code
- provider lock-in
- infrastructure setup
- UI framework selection
- detailed persistence design

## Contribution Style

- keep docs concrete and explicit
- prefer examples over vague prose
- use consistent platform terms
- separate platform objects from workspace configuration
- call out unresolved questions directly
- prefer ADRs over leaving settled decisions as lingering open questions
