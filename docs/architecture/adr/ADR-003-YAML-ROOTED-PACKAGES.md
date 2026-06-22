# ADR-003: YAML-Rooted Packages

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

Packages are rooted in YAML files so they stay human-readable, portable, and easy to discover.

## Context

Once the platform chooses filesystem packages, it still needs one concrete representation for package metadata and configuration.

## Decision

Each package is represented by a YAML file that carries the package metadata and configuration.

Typical convention:
```
agents/
  agent-name/
    agent.yaml              # Package definition

tools/
  tool-name/
    tool.yaml              # Package definition

skills/
  skill-name.yaml          # Single file is OK

resources/
  resource-name.yaml       # Single file is OK
```

YAML is the standard package format because it supports structured metadata, long instructions, comments, and ordinary configuration workflows.

## Consequences

### Positive

- Easy to read and review in git
- Good fit for instructions and other multiline content
- Familiar to teams already using cloud-native configuration
- Straightforward discovery by filename and directory pattern

### Tradeoffs

- YAML requires validation beyond parsing
- Loader conventions must be documented and enforced
- Mixed layout styles can be supported, but they increase ambiguity

## Alternatives Considered

1. **JSON**
   - Rejected because it is less readable for package authoring and instructions.

2. **Code-defined packages**
   - Rejected because they require execution environments and narrow the author audience.

3. **Directory-only packages with no root definition file**
   - Rejected because metadata and discovery become less obvious.

4. **Multiple equivalent formats**
   - Rejected because they create avoidable source-of-truth ambiguity.

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-004: Instructions Embedded in YAML](ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)

## References

- [ARCHITECTURE_V2.md - Filesystem Package Model](../ARCHITECTURE_V2.md#filesystem-package-model)
- [@awp/loader - Package discovery](../../../packages/loader/README.md#package-discovery)
