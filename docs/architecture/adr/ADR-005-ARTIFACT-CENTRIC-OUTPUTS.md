# ADR-005: Artifact-Centric Outputs

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Agent work produces outputs. The platform needs to:
- Preserve durable results
- Support versioning and history
- Enable collaboration around outcomes
- Track provenance (who created what)
- Support audit trails

Traditional approaches treat outputs as:
- Ephemeral (live in memory or logs)
- Not queryable (buried in run records)
- Not first-class (secondary to execution)
- Static (no versioning)

This works for batch processing but fails for:
- Complex decisions (need discussion)
- Multi-stage workflows (need intermediate results)
- Compliance (need audit trails)
- Collaboration (need version history)

## Decision

**Artifacts are first-class runtime concepts, not just "run outputs."**

An Artifact is:
- Created by agents or humans
- Versioned automatically
- Discussed in threads
- Editable by participants
- Queryable by type or status
- Persistent with full history
- Central to business value

```typescript
interface Artifact {
  id: string;
  projectId: string;
  type: string;             // e.g., 'decision-analysis', 'report'
  
  // Current state
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
  
  // Automatic versioning
  version: number;
  versions: Array<{
    version: number;
    content: Record<string, any>;
    createdAt: string;
    createdBy: string;
  }>;
  
  // Metadata
  createdAt: string;
  createdBy: string;        // Agent or human
  updatedAt: string;
  editors: string[];        // All who edited
  
  // References
  runId?: string;           // Created by this run
  threadId?: string;        // Discussed here
}
```

Agents can create artifacts through run execution:

```typescript
const run = await runtime.executeRun(projectId, {
  targetKind: 'agent',
  targetId: 'analyzer',
  input: { decision: 'Should we expand?' },
});

// If agent output includes artifact data,
// platform automatically creates/updates artifact
const artifact = await runtime.createArtifact(projectId, {
  id: 'analysis-001',
  type: 'decision-analysis',
  content: run.output,
  createdBy: run.targetId,  // The agent
});
```

## Consequences

### Positive
- **Business value first:** Artifacts represent actual deliverables, not just execution logs
- **Collaboration:** Teams discuss artifacts in threads
- **Versioning:** Full history of changes, who made them, when
- **Discoverability:** Artifacts are queryable and searchable
- **Audit trail:** Complete record of creation, modification, participants
- **First-class persistence:** Artifacts are primary persistence target
- **Value chain visible:** Can trace decision → analysis → artifact → thread → consensus
- **Reproducibility:** Can reference specific artifact versions

### Negative
- **Storage overhead:** Versioning requires storing multiple copies
- **Complexity:** More state to manage than simple run output
- **Requires explicit creation:** Agents must intentionally create artifacts
- **Schema diversity:** Each artifact type needs its own schema

### Mitigation
- Archive old versions to save space
- Provide helpers for common artifact types
- Clear guidance on when to create artifacts

## Alternatives Considered

1. **Ephemeral run outputs**
   - Rejected: No collaboration support
   - Rejected: No versioning
   - Rejected: Loses business value

2. **Run outputs as database records**
   - Rejected: Not distinguished from execution logs
   - Rejected: No versioning by default
   - Rejected: Not first-class in API

3. **Artifacts without versioning**
   - Rejected: Can't see change history
   - Rejected: No way to revert changes
   - Rejected: Audit trail incomplete

4. **Immutable artifacts (no edits)**
   - Rejected: Real collaboration requires edits
   - Rejected: Refinement through discussion needed
   - Rejected: Humans need to revise

---

## Artifact Lifecycle

1. **Creation:** Agent run creates artifact
2. **Initial state:** `draft` (not final)
3. **Discussion:** Thread discusses artifact
4. **Refinement:** Participants edit (creates new version)
5. **Finalization:** Move to `active` status
6. **Archival:** Move to `archived` when done

Full version history maintained throughout.

---

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (project owns artifacts)
- [ADR-007: Channels and Schedules as First-Class Concepts](ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V2.md - Artifact Model](../ARCHITECTURE_V2.md#artifacts-preserve-outcomes)
- [RUNTIME_ARCHITECTURE.md - Artifact Versioning](../../../RUNTIME_ARCHITECTURE.md)
