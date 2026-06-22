# ADR-008: Minimal Ontology

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform has exactly 10 core concepts, and extensions should happen through fields, types, and providers rather than new ontology entries.

## Context

Every new platform concept increases implementation, documentation, and learning cost.

## Decision

The platform has exactly 10 concepts:

```
1. Project
2. Agent
3. Tool
4. Skill
5. Channel
6. Schedule
7. Resource
8. Artifact
9. Thread
10. Run
```

Rationale:

| Concept | Why It's Required |
|---------|------------------|
| **Project** | Container for execution context (see [ADR-001](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md)) |
| **Agent** | Autonomous actor that performs work |
| **Tool** | Capability interface (see [ADR-006](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)) |
| **Skill** | Composition of tools and skills for reuse |
| **Channel** | Communication interface (see [ADR-007](ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)) |
| **Schedule** | Automation trigger (see [ADR-007](ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)) |
| **Resource** | Shared context data for agents |
| **Artifact** | Durable, versioned output (see [ADR-005](ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md)) |
| **Thread** | Collaboration context for discussion |
| **Run** | Execution record and audit trail |

Each is essential and intentionally distinct.

Optional areas such as sandboxing or evaluation can exist as package kinds or configuration patterns without expanding the core ontology.

## Boundaries

The following are not core concepts:

- **Connector/Integration:** Provider mechanism, not concept (see [ADR-006](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md))
- **API:** Provider mechanism for Tool (not separate concept)
- **Function:** Provider mechanism for Tool (not separate concept)
- **Role:** Agent property, not separate concept
- **Permission:** Not a core concept
- **Zone/Binding:** UI concern, not runtime concept
- **Component/View:** UI concern, not runtime concept

## Consequences

### Positive

- The platform stays teachable
- Definitions, docs, and code have clearer boundaries
- Extension pressure moves toward configuration and providers instead of ontology growth

### Tradeoffs

- The team must resist adding concepts whenever a new use case appears
- Some concepts intentionally cover broad ground

## How to Extend Without New Concepts

- Add provider types for new tool backings
- Add fields or schemas for richer artifact or channel variation
- Add configuration to existing package kinds
- Use Resources for new shared context needs

## Alternatives Considered

1. **20-30 concepts (traditional SOA)**
   - Rejected: Too complex for focused scope
   - Rejected: More concepts = more bugs

2. **2-3 concepts (ultra-minimal)**
   - Rejected: Can't represent necessary distinctions
   - Rejected: Would require extensive sub-typing

3. **Unbounded concepts (add as needed)**
   - Rejected: Leads to bloat
   - Rejected: Creates confusion

The minimal ontology is a design constraint on purpose: when new needs appear, the first question should be whether they fit an existing concept plus configuration, not whether the platform needs a new noun.

---

## Related Decisions

- All ADRs depend on minimal ontology
- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) (these 10 concepts are packages)
- [ADR-006: Tools as Primary Capability](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) (not multiple capability types)

## References

- [ARCHITECTURE_V2.md - Core Vocabulary](../ARCHITECTURE_V2.md#core-vocabulary)
- [ARCHITECTURE_V2.md - Vision](../ARCHITECTURE_V2.md#vision) (10-line summary)
