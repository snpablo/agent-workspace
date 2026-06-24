# Current Runtime Event Checklist

This note evaluates the runtime event model against a simple question:

If events are canonical, what must each event carry so current-state projections can be rebuilt reliably?

This is based on the current runtime implementation in `packages/runtime/src/project-runtime.ts`.

## What Exists Today

The runtime currently leans on these event families:

- `run.started`
- `run.succeeded`
- `run.failed`
- `artifact.created`
- `participant.joined`
- `resource.added`
- `thread.created`

The runtime README and design notes also point toward richer or additional names such as:

- `artifact.updated`
- `thread.closed`
- `schedule.executed`

Those names matter because long-running human-agent workflows need canonical handoff and revision history, not just lifecycle pings.

## Thin Event Test

For each event, ask:

1. Can I understand what changed?
2. Can I tell who it affects?
3. Can I resume work from it?
4. Can I rebuild state from it?

If the answer is mostly "no," the event is too thin to act as canonical truth.

## Current Event Assessment

### `run.started`

Canonical payload should include:

- full `run` snapshot
- trigger identity
- thread or session references
- relevant input metadata

Why:

- current run projection must be rebuildable
- resumptions and retries must be attributable
- agents and humans need a clear handoff trail

### `run.succeeded`

Canonical payload should include:

- full completed `run`
- output summary
- created or revised artifact references
- follow-up state such as waiting conditions or next action

### `run.failed`

Canonical payload should include:

- full failed `run`
- error details
- retryability or terminal classification
- blocked-on or escalation metadata

### `artifact.created`

Canonical payload should include:

- full artifact snapshot
- version metadata
- artifact record or version record
- provenance references to run, thread, or participant actions

### `participant.joined`

Canonical payload should include:

- full participant snapshot
- role
- metadata relevant to routing or responsibility

### `resource.added`

Canonical payload should include:

- full resource snapshot
- enough metadata to decide whether dormant work should resume

### `thread.created`

Canonical payload should include:

- full thread snapshot
- participants
- initial messages if present
- workflow metadata such as next action owner or review state

## Summary Table

| Event | Must carry canonical snapshot? | Why |
|------|-------------------------------|-----|
| `run.started` | Yes | Run queue and handoff replay |
| `run.succeeded` | Yes | Completed execution and next action |
| `run.failed` | Yes | Retry and escalation behavior |
| `artifact.created` | Yes | Artifact/version reconstruction |
| `participant.joined` | Yes | Membership and routing reconstruction |
| `resource.added` | Yes | Context availability and wake-up logic |
| `thread.created` | Yes | Collaboration state reconstruction |

## Conditions Where Thin Events Stop Working

The current event model will likely stop being enough when any of these become normal:

- agents resume from specific waiting conditions
- multiple participants edit or review the same artifact over time
- event routing depends on actual semantic changes, not just object type
- replay becomes part of recovery, not just debugging
- conflict detection depends on versions, authorship, and causality
- threads become workflow coordination surfaces rather than simple logs

## Practical Reading

At the current repo stage, thin events are acceptable for:

- audit trail
- notifications
- wake-up hints
- basic tracing

They are not yet sufficient for:

- event-primary canonical recovery
- rich multi-user coordination
- deterministic agent resume
- projection-first architecture

## Most Important Gap

If only one question matters, it is probably this:

Can a dormant agent tell whether a new event actually clears its blocker?

With the current event model, that answer is often "no."

That suggests the immediate problem is not that the architecture must become V3.

It suggests that any serious event-driven runtime will eventually need richer event payloads, especially around:

- artifact state transitions
- thread updates and ownership
- agent session waiting/resume changes
- run stop and handoff reasons

## Recommendation

Use this checklist as a gate:

- If events remain signals, the current thin model is acceptable.
- If events need to become trustworthy state transitions, enrich them before making an architecture jump.

That allows the runtime to evolve empirically instead of renaming the architecture too early.
