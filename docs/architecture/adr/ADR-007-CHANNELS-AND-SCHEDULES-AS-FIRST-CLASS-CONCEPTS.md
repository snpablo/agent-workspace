# ADR-007: Channels and Schedules as First-Class Concepts

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Channels and Schedules are explicit packages so communication and automation stay discoverable, reusable, and versioned.

## Context

The platform needs to model:

- where outputs and notifications go
- when work should run automatically

These concerns must be visible in package definitions rather than hidden in code or external runtime-only configuration.

## Decision

Channels and Schedules are first-class concepts.

- **Channel** describes a communication interface such as Slack, email, HTTP, or webhook delivery.
- **Schedule** describes an automation trigger such as cron, event, or manual execution.

Schedules are project-level. Multiple agents can reference or be triggered by the same schedule.

## Consequences

### Positive

- Communication paths are explicit and reusable
- Automation is declarative and auditable
- Project structure reveals how work is triggered and delivered
- Scheduling logic can be shared instead of duplicated

### Tradeoffs

- More package types need validation and runtime support
- Credentials and delivery configuration need careful handling
- Advanced routing remains a later concern

## Alternatives Considered

1. **Embedding channels and schedules only inside agents**
   - Rejected because it reduces reuse and increases duplication.

2. **Keeping channels and schedules in runtime-only config**
   - Rejected because it weakens version control and discoverability.

3. **Treating schedules as agents**
   - Rejected because triggers and actors have different responsibilities.

---

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (project owns channels/schedules)
- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) (channels/schedules are packages)
- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V2.md - Core Vocabulary](../ARCHITECTURE_V2.md#core-vocabulary)
- [AGENTS.md - Package Structure](../../../AGENTS.md#package-structure)
