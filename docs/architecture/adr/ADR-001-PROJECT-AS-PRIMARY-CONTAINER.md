# ADR-001: Project as the Primary Container

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Early versions of the platform used "Workspace" as the primary container concept, borrowed from UI frameworks. Workspace was a UI-centric abstraction that confused the separation between:
- Container for organizing work (business concern)
- Container for organizing UI components (presentation concern)

As the platform evolved to support production agent systems with durable collaboration, persistence, and audit trails, we needed a concept that:
- Clearly represents execution context
- Maps to industry standard terminology (Claude Projects, Vercel Eve, LangGraph)
- Emphasizes runtime execution over UI composition
- Clearly owns all runtime state

## Decision

**Project** is the primary organizing container for all agent platform work.

A Project:
- Owns agents, resources, artifacts, threads, runs, schedules
- Represents a coherent execution context
- Is the unit of persistence and reproducibility
- Is the unit of multi-tenancy
- Contains all participants (humans and agents)

```typescript
interface Project {
  id: string;
  name: string;
  version: string;
  
  // Configuration
  agents: Agent[];
  resources: Resource[];
  schedules: Schedule[];
  
  // Runtime state
  artifacts: Map<id, Artifact>;
  threads: Map<id, Thread>;
  runs: Map<id, Run>;
  participants: Map<id, Participant>;
  events: Event[];
}
```

**No Workspace concept exists in the runtime or API.** Workspace is git history only.

## Consequences

### Positive
- **Clear semantics:** Project unambiguously means "execution context," not "UI layout"
- **Industry alignment:** Claude Projects, Vercel Eve, LangGraph all use Project or equivalent
- **Persistence is simple:** Projects are the atomic unit of storage
- **Multi-tenancy is clear:** Each project is isolated with its own state
- **Collaboration is bounded:** All collaboration happens within project scope
- **No UI/runtime confusion:** Project is runtime, UI layer is separate concern

### Negative
- **Breaking change from V1:** Existing Workspace-based code must be rewritten
- **Requires migration:** Projects must be created and initialized explicitly

## Alternatives Considered

1. **Keep "Workspace"**
   - Rejected: Confuses UI organization with runtime execution context
   - Rejected: Doesn't align with industry terminology

2. **Use "Context" instead of "Project"**
   - Rejected: Too generic, doesn't indicate isolation/ownership
   - Rejected: "Context" suggests just data, not execution

3. **Use "Execution" or "Execution Context"**
   - Rejected: Too technical/verbose
   - Rejected: "Execution" suggests momentary, not durable

4. **Hierarchical containers (Organization → Project → Workspace)**
   - Rejected: Over-engineering for v1
   - Rejected: Complexity not justified by current requirements
   - **Future decision** if multi-level hierarchy needed

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V2.md - Runtime Model](../ARCHITECTURE_V2.md#runtime-model)
- [RUNTIME_ARCHITECTURE.md](../../../RUNTIME_ARCHITECTURE.md)
