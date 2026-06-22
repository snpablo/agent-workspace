# ADR-006: Tools as the Primary Capability Model

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Tool is the single capability concept. Provider types are execution mechanisms behind that concept.

## Context

Agents need many kinds of capability, but the platform should not expose a different ontology concept for every backing mechanism.

## Decision

The platform models capability through Tools with uniform metadata and interfaces.

Provider-backed implementation details such as HTTP, connector, MCP, function, or platform service remain part of the tool implementation, not separate platform concepts.

## Consequences

### Positive

- Agents interact with one capability concept
- Skills can compose tools without caring about backing mechanism
- New provider types extend the system without changing the ontology
- Tool validation and routing can happen in one consistent layer

### Tradeoffs

- Provider code must handle the diversity hidden behind the uniform tool model
- Some simple cases may feel more indirect than dedicated one-off integrations

## Alternatives Considered

1. **Separate concepts for each capability mechanism**
   - Rejected because it increases ontology size and complicates composition.

2. **Implementation-aware agent model**
   - Rejected because agents should care about capability shape, not routing mechanics.

3. **Auto-detected implementations with no declared type**
   - Rejected because explicit implementation metadata improves validation and debugging.

---

## Related Decisions

- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md) (Tool is the single concept)
- [ADR-009: Borrow Before Inventing](ADR-009-BORROW-BEFORE-INVENTING.md) (Tool from industry standard)

## References

- [ARCHITECTURE_V2.md - Tool Model](../ARCHITECTURE_V2.md#tool-model)
- [@awp/tools Documentation](../../../packages/tools/README.md)
