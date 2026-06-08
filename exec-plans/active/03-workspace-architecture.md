# 03 Workspace Architecture

## Objective

Define the collaboration container that ties together work items, outputs, threads, tasks, runs, and actions.

## Why It Matters

The workspace is the primary product shell and must support both decision-heavy and operations-heavy experiences.

This is the equivalent of the original workspace-architecture day: design the shell before worrying about a concrete React implementation.

## Scope

- workspace responsibilities
- workspace composition
- suggested surface areas
- collaboration model

## Deliverables

- workspace model doc
- UI composition guidance
- open questions about queueing and visibility
- a clear explanation of how queue, thread, output, knowledge, agent activity, actions, and run history fit together

## Dependencies

- domain model
- output model
- work item model

## Open Questions

- should a workspace ever exist without a primary work item?
- how much run history should stay visible?
- what is workspace type versus layout preference?

## Completion Criteria

- workspace model is documented
- decision and partner screens can both be explained through it
