# ADR-008: Layered Platform Model

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform is best described as a layered model rather than a flat fixed concept list.

The architecture is organized into collaboration/work packages, integration/capability packages, and runtime records with projected current state.

## Context

Every new platform concept increases implementation, documentation, and learning cost, but flattening unlike concepts into a single list can also hide important boundaries.

## Decision

The platform uses three explicit layers:

### Collaboration and Work

- Project
- Agent
- Skill
- Resource
- Artifact
- Thread
- Run
- Schedule
- Channel

These describe who is collaborating, what work is being organized, what outputs are being produced, and how work is triggered or discussed.

### Integration and Capability

- Connector
- Tool

Connectors bind the platform to external systems. Tools expose the narrow operations the AI may invoke through those bindings.

### Runtime Records and State

- Event
- projections of current state
- execution traces such as sessions and run history

Events are canonical for runtime history. Projections make current state queryable and usable in product surfaces.

## Boundaries

The following should not be confused with the main layered model:

- **API implementation details:** one backing mechanism for a Tool
- **Function implementation details:** another backing mechanism for a Tool
- **Role:** an Agent property, not a separate package kind
- **Permission policy:** a policy or configuration concern
- **Zone, binding, component, view:** UI composition concerns, not platform architecture concepts

## Consequences

### Positive

- The platform stays teachable
- Definitions, docs, and code have clearer boundaries
- Connectors become visible as first-class outbound bindings
- Event-driven runtime behavior becomes explicit instead of implied
- Extension pressure moves toward configuration, package kinds, providers, and projections instead of accidental conflation

### Tradeoffs

- The model is slightly less slogan-friendly than a short numbered list
- Documentation must explain the differences between packages, runtime records, and projections clearly

## How to Extend Cleanly

- Add provider types for new tool backings
- Add package kinds when a distinct architectural boundary needs to be modeled
- Add fields or schemas for richer artifact, connector, or channel variation
- Add configuration to existing package kinds
- Use events plus projections when runtime history and current state need to coexist

## Alternatives Considered

1. **Large flat concept list (traditional SOA style)**
   - Rejected: Too complex for focused scope
   - Rejected: More top-level nouns create more confusion than clarity

2. **Ultra-minimal model**
   - Rejected: Can't represent necessary distinctions like Channel vs Connector or Tool vs Event
   - Rejected: Would force too much hidden meaning into a few overloaded words

3. **Unbounded concepts (add as needed)**
   - Rejected: Leads to bloat
   - Rejected: Creates confusion

The layered model is a design constraint on purpose: when new needs appear, the first question should be which architectural layer they belong to and whether they fit an existing package, runtime record, or projection before inventing new structure.

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-006: Tools as Primary Capability](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)
- [ADR-010: Event-Canonical Runtime](ADR-010-EVENT-CANONICAL-RUNTIME.md)
- [ADR-011: Connectors as Outbound Bindings](ADR-011-CONNECTORS-AS-OUTBOUND-BINDINGS.md)

## References

- [ARCHITECTURE_V3.md - Layered Vocabulary](../ARCHITECTURE_V3.md#layered-vocabulary)
- [ARCHITECTURE_V3.md - Summary](../ARCHITECTURE_V3.md#summary)
