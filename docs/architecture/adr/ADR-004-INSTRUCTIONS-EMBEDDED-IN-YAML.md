# ADR-004: Instructions Embedded in YAML

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Agent instructions live directly in `agent.yaml` so behavior and definition stay together.

## Context

The platform needs agent behavior to be:

- reviewable with the rest of the package
- portable with the agent definition
- understandable from a single file
- editable without adding another authoring system

## Decision

Instructions are embedded directly in the package YAML as a field.

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
version: 1.0.0

instructions: |
  You are an expert strategic decision analyst.
  
  Your responsibilities:
  - Analyze complex business decisions
  - Evaluate options using structured frameworks
  - Identify risks and opportunities
  - Produce detailed analysis artifacts
  
  Process:
  1. Gather decision context
  2. Identify stakeholders
  3. Evaluate each option
  4. Synthesize findings

model: claude-opus
tools:
  - id: search-tool
```

## Consequences

### Positive

- One file explains what the agent is and how it should behave
- Pull requests capture behavior changes alongside package changes
- Agents stay portable and self-contained
- Non-code contributors can still inspect and refine behavior

### Tradeoffs

- Large instructions can make `agent.yaml` verbose
- Shared prompt fragments and templating are intentionally deferred

## Alternatives Considered

1. **Separate prompt files**
   - Rejected because they split behavior from package definition.

2. **Database-managed instructions**
   - Rejected because they break the filesystem-first model.

3. **Runtime-supplied instructions**
   - Rejected because reproducibility and reviewability suffer.

4. **Instruction templating system**
   - Rejected because the extra abstraction is not yet justified.

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-003: YAML-Rooted Packages](ADR-003-YAML-ROOTED-PACKAGES.md)

## References

- [ARCHITECTURE_V2.md - YAML Package Format](../ARCHITECTURE_V2.md#package-format-yaml)
- [AGENTS.md - Instructions Live in YAML](../../../AGENTS.md#key-principle-instructions-live-in-yaml)
