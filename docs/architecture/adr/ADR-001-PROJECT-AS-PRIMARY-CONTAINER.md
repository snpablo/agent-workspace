# ADR-001: Project as the Primary Container

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform uses **Project** as the single top-level container for configuration, execution context, collaboration, and persisted runtime state.

## Context

The platform needs one boundary that:

- groups related agents, resources, schedules, artifacts, threads, and runs
- provides a stable persistence unit
- gives collaboration a clear scope
- aligns with common agent-platform terminology

## Decision

A Project is the organizing container for all work in the platform.

It owns:

- agent definitions and bindings
- shared resources
- schedules and channels
- runtime artifacts, threads, runs, participants, and events

This keeps configuration, execution, and audit history aligned around one durable unit.

## Consequences

### Positive

- Clear execution boundary for loading, running, and persisting work
- Straightforward collaboration scope for humans and agents
- Simple storage and import/export boundary
- Clean alignment between documentation, examples, and runtime

### Tradeoffs

- Projects must be initialized explicitly
- Multi-level organizational structures are deferred rather than modeled now

## Alternatives Considered

1. **Generic context container**
   - Rejected because it does not clearly imply ownership or persistence.

2. **Pure execution container**
   - Rejected because the platform also needs durable collaboration and outcomes, not only transient execution.

3. **Multi-level container hierarchy**
   - Rejected because current requirements do not justify the extra coordination and complexity.

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-008: Layered Platform Model](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V3.md - Runtime Model](../ARCHITECTURE_V3.md#runtime-model)
- [@awp/runtime README](../../../packages/runtime/README.md)
