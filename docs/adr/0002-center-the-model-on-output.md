# 0002 Center The Model On Output

## Status

Accepted

## Context

The architecture needed a durable center that survives beyond chat, raw model responses, and execution history.

Possible centers included:

- chat or thread history
- agent execution
- work item metadata
- durable generated content

For both decision-heavy and operations-heavy workflows, the thing the user usually reviews, edits, shares, approves, exports, and acts on is the durable result.

## Decision

The platform centers on `Output` as the durable result model.

Supporting objects around it include:

- `Workspace` as collaboration boundary
- `Work Item` as business context
- `Thread`, `Message`, and `Run` as runtime interaction and execution
- `Knowledge Source` as grounding
- `Action` and `Task` as next-step workflow objects

## Consequences

- The model remains stable even when chat or execution patterns change.
- Decision, research, planning, and operational workflows can share the same core output abstraction.
- Some user-facing experiences may still render outputs as pages, drafts, reports, or plans rather than literally calling them “outputs.”

## References

- [Output Model](../architecture/output-model.md)
- [Domain Model](../architecture/domain-model.md)
- [UI Domain Mapping](../architecture/ui-domain-mapping.md)
- [Microsoft References](../architecture/resources.md)
