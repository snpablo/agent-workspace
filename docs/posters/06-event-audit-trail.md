# Event Audit Trail and Logging

This poster explains how the platform records execution activity into a canonical event history and rebuilds queryable current state from it.

![Event Audit Trail and Logging](./images/06-event-audit-trail.svg)

## Covers

- Activity sources
- Event capture structure
- Event storage
- Projection rebuild
- Audit and compliance features

## Key Concepts

- **Complete Audit Trail** means every important action is recorded.
- **Canonical Runtime Record** means events are the source of truth for what happened.
- **Event Structure** includes timestamp, actor, action, context, and result.
- **Immutable History** preserves append-only event records.
- **Queryable Storage** supports time-, actor-, and type-based analysis.
- **Projections** rebuild the current workspace view from event history.
- **Compliance** is supported through durable audit records.
