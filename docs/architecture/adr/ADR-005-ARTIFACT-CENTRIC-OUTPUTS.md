# ADR-005: Artifact-Centric Outputs

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Artifacts are first-class runtime objects because durable outcomes are the main business value of the platform.

## Context

The platform needs outcomes that are:

- durable rather than ephemeral
- versioned rather than overwritten
- discussable by humans and agents
- traceable back to the work that produced them

## Decision

Artifacts are stored, versioned, discussed, and audited as explicit runtime entities.

An artifact can be created by an agent or a human, updated over time, linked to runs and threads, and queried independently of raw execution logs.

## Consequences

### Positive

- Outcomes remain visible after execution completes
- Threads can focus on concrete artifacts rather than transient outputs
- Version history and provenance are built into the collaboration model
- Persistence can prioritize business results, not just runs

### Tradeoffs

- Artifact lifecycle and storage are more complex than simple run output capture
- Artifact types need structure and validation discipline
- Editing workflows require clear versioning behavior

## Alternatives Considered

1. **Ephemeral run outputs only**
   - Rejected because they do not support collaboration, versioning, or durable review.

2. **Artifacts with no version history**
   - Rejected because provenance and refinement matter to the platform.

3. **Immutable artifacts only**
   - Rejected because human-agent collaboration requires revision and iteration.

---

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (project owns artifacts)
- [ADR-007: Channels and Schedules as First-Class Concepts](ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
- [ADR-008: Layered Platform Model](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V3.md - Artifact Model](../ARCHITECTURE_V3.md#artifacts-preserve-outcomes)
- [@awp/runtime README](../../../packages/runtime/README.md)
