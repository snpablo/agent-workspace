# ADR-008: Minimal Ontology

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Every new platform concept adds:
- Cognitive load (what is this? how does it relate to others?)
- Implementation work (types, schemas, APIs, tests)
- Documentation overhead
- Potential confusion (overlapping semantics)

The question: How many concepts does the platform actually need?

## Decision

**The platform has exactly 12 concepts. No more. Period.**

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
11. Eval
12. Sandbox
```

**Rationale for each:**

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
| **Eval** | Quality evaluation definition |
| **Sandbox** | Execution constraints and isolation |

Each is essential. None is redundant with others.

## No Additional Concepts

The following are **NOT** concepts:

- **Workspace:** Replaced by Project
- **WorkItem:** Replaced by Run
- **Playbook/Workflow:** Replaced by Agent + Schedule
- **Connector/Integration:** Provider mechanism, not concept (see [ADR-006](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md))
- **API:** Provider mechanism for Tool (not separate concept)
- **Function:** Provider mechanism for Tool (not separate concept)
- **Role:** Agent property, not separate concept
- **Permission:** Out of scope for v1, not a core concept
- **Zone/Binding:** UI concern, not runtime concept
- **Component/View:** UI concern, not runtime concept

## Consequences

### Positive
- **Simple to learn:** 12 concepts vs. 30+
- **Easy to implement:** Focused scope
- **Coherent model:** Every concept has clear purpose
- **Scalable documentation:** Not overwhelming
- **Testable:** Finite number of interactions to verify
- **Extensible:** Add providers/variants without new concepts

### Negative
- **Requires discipline:** Tempting to add new concepts when stuck
- **Some concepts broad:** Artifact covers many output types
- **Custom behavior:** Can't represent every use case with 12 concepts
- **May feel limiting:** Users might want more granularity

### How to Extend Without New Concepts
- **New tool type?** Add provider type, not new concept
- **New artifact type?** Add artifact.type field, not new concept
- **New channel type?** Add channel.type field, not new concept
- **New execution context?** That's what Resource is for
- **New actor type?** Still an Agent, use role field

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

---

## Design Pressure

The minimal ontology creates healthy design pressure:

- **When you want to add a concept:** Ask: "Can this be a provider type? A field? A value in an enum?"
- **When unclear:** That's feedback the model isn't complete
- **When overlapping:** Indicates concepts should merge or be renamed

This constraint has driven better design decisions throughout the platform.

---

## Testing Minimal Ontology

How do you verify 12 concepts are enough?

1. **Can you build the platform?** Yes - all features fit in these concepts
2. **Can agents express all needed capabilities?** Yes - via Tool + Skill composition
3. **Can you persist all state?** Yes - Project contains everything
4. **Can you support multiple agent types?** Yes - Agent + role field
5. **Can you support multiple output types?** Yes - Artifact + type field
6. **Can you automate?** Yes - Schedule concept
7. **Can you route communication?** Yes - Channel concept
8. **Can you audit everything?** Yes - Event (in Project.events)

If any answer is "no," the ontology is incomplete.

---

## Related Decisions

- All ADRs depend on minimal ontology
- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) (these 12 concepts are packages)
- [ADR-006: Tools as Primary Capability](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) (not multiple capability types)

## References

- [ARCHITECTURE_V2.md - Core Vocabulary](../ARCHITECTURE_V2.md#core-vocabulary)
- [ARCHITECTURE_V2.md - Vision](../ARCHITECTURE_V2.md#vision) (10-line summary)
