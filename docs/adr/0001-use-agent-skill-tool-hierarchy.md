# 0001 Use Agent-Skill-Tool Hierarchy

## Status

Accepted

## Context

The architecture initially flattened packaged workflow behavior and atomic execution into a two-layer `Agent -> Tool` model. That created a gap between:

- top-level orchestration
- reusable domain workflow behavior
- narrow callable execution

Treating `Skill` and `Tool` as synonyms weakened the model.

## Decision

The platform will use a three-tier hierarchy:

- `Agent`: orchestrator responsible for reasoning, planning, and coordination
- `Skill`: reusable domain workflow layer responsible for guardrails, sequencing, and output shaping
- `Tool`: atomic callable execution layer

Agents select skills. Skills use tools.

## Consequences

- The model is more reusable and clearer than a flattened `Agent -> Tool` design.
- Domain behavior can be packaged without turning every workflow into a top-level agent.
- Tools remain small and composable.
- The architecture gains one more concept to explain, but the separation is worth the added precision.

## References

- [Agent Model](../architecture/agent-model.md)
- [Skill Model](../architecture/skill-model.md)
- [Domain Model](../architecture/domain-model.md)
