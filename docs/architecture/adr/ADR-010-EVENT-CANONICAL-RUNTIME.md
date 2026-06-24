# ADR-010: Event-Canonical Runtime

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform keeps the broader Architecture V3 model from earlier freezes, but the runtime now treats canonical events as the primary record of what happened.

Current workspace state is derived from those events as projections.

## Context

The repository increasingly targets long-running work where:

- agents run in bounded slices rather than one-shot completions
- humans review, request changes, approve, or unblock work asynchronously
- work may pause for hours or days
- crashes or restarts must not lose the real collaboration history

The hiring workflow makes the need clear:

- a recruiter opens work
- one agent drafts candidate materials
- a hiring manager reviews later
- another human requests changes
- the agent resumes in a new run
- approval arrives through a later event or scheduled review

That behavior is not well modeled as mutable rows alone. It is better modeled as a history of attempts, handoffs, revisions, approvals, and resumptions.

## Decision

The runtime adopts four rules:

1. Events are the canonical runtime record.
2. Current state is maintained as projections for query and UI use.
3. Agents run in bounded slices and wait for matching events or schedules before resuming.
4. Evaluation remains outside the core execution loop unless a project explicitly builds an evaluation subsystem.

This means:

- event logs are the audit and coordination truth
- artifacts remain durable work products
- threads remain the human-readable collaboration layer
- runs remain execution trace records that can be rebuilt from events
- repositories should be able to recover current state by replaying persisted events

## Consequences

### Positive

- Better recovery for long-running human-agent work
- Clearer handoff and approval history
- Stronger audit trail
- Cleaner separation between canonical history and query-friendly current state
- Better fit for stop/start agent execution

### Tradeoffs

- Event payloads must be rich enough to rebuild meaningful projections
- Projection logic becomes a first-class runtime concern
- Thin lifecycle pings are no longer sufficient for important state transitions

## Alternatives Considered

1. **Direct mutable state as the only source of truth**
   - Rejected because it weakens recovery, replay, and coordination history.

2. **Event-only system with no maintained projections**
   - Rejected because UI and operational reads should not depend on raw event traversal everywhere.

3. **Embedding evaluation in the core runtime loop**
   - Rejected because evaluation is important but not part of the main execution cycle.

---

## Related Decisions

- [ADR-001: Project as the Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md)
- [ADR-005: Artifact-Centric Outputs](ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md)
- [ADR-008: Layered Platform Model](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V3.md - Runtime Model](../ARCHITECTURE_V3.md#runtime-model)
- [ARCHITECTURE_V3.md - Events Are Canonical Runtime Truth](../ARCHITECTURE_V3.md#events-are-canonical-runtime-truth)
- [Multi-Participant Resumable Workflow](../../designs/multi-participant-resumable-workflow.md)
