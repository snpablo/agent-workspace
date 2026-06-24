# ADR-009: Borrow Before Inventing

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Borrow familiar terms and proven patterns first. Invent only when the platform has a real gap that borrowing cannot cover cleanly.

## Context

Naming and pattern choices shape how easy the platform is to learn, implement, and explain.

## Decision

The platform prefers established terminology and patterns when they fit the problem well.

This applies to:

- vocabulary such as Project, Agent, Tool, Run, Thread, and Artifact
- packaging and configuration choices such as YAML and filesystem-first structure
- architectural patterns such as providers and reference resolution

Custom structures are acceptable when the platform has a specific need that common patterns do not cover directly.

## Consequences

### Positive

- Lower learning curve
- Better alignment with adjacent agent ecosystems
- Less naming churn inside docs and code
- More predictable implementation patterns

### Tradeoffs

- Borrowed terms may not be a perfect match in every context
- The team must decide carefully when invention is actually justified

## What We Intentionally Invent

The platform still defines some local structures when needed, such as package metadata shape and package reference conventions. The rule is not “never invent”; it is “invent narrowly and on purpose.”

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (borrowed Project term)
- [ADR-006: Tools as Primary Capability](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) (borrowed Tool term)
- [ADR-008: Layered Platform Model](ADR-008-MINIMAL-ONTOLOGY.md) (keeps the model explicit without unnecessary sprawl)

## References

- [ARCHITECTURE_V3.md - Vision](../ARCHITECTURE_V3.md#vision)
- Industry alignment documented in various capability documentation
