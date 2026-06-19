# ADR-003: YAML-Rooted Packages

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Given that packages live on the filesystem ([ADR-002](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)), we need a convention for:
- How to identify a package in a directory
- What constitutes a valid package
- How to discover packages
- How to name packages

Options include:
- Each package is a JSON file (one file per package)
- Each package is a YAML file (one file per package)
- Each package is a Python class (requires runtime)
- Each package is a directory with internal structure

## Decision

**Each package is a YAML file, named after its kind and id.**

Convention:
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

The YAML file contains all package metadata and configuration:

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
version: 1.0.0

instructions: |
  You are a strategic decision analyst.
  ...

tools:
  - id: search-tool

metadata:
  tags: [decision-support]
```

**Why YAML?**
- Human-readable (better than JSON for configs)
- Standard in DevOps/Kubernetes/Docker
- Supports multi-line strings (for instructions)
- Wide tool support
- Minimal syntax

## Consequences

### Positive
- **Discoverable:** `find . -name "*.yaml" -path "*/agents/*"` finds all agents
- **Standard format:** YAML is industry standard for config
- **Human-editable:** Technical and non-technical users can edit
- **Simple parsing:** Standard YAML parsers available everywhere
- **Supports long text:** Instructions, descriptions in multi-line strings
- **Comments supported:** YAML comments help document inline
- **Git-friendly:** Text format diffs clearly

### Negative
- **Larger file size:** YAML less compact than JSON
- **Whitespace sensitivity:** Indentation matters (but less than Python)
- **No embedded code:** Logic must be external (by design)
- **No schema validation by format:** Must validate content explicitly

## Alternatives Considered

1. **JSON format**
   - Rejected: Less readable for humans
   - Rejected: Multi-line strings awkward (requires escape sequences)
   - Rejected: No comments support
   - **Possible future** for machine generation

2. **Python classes (dataclasses/Pydantic)**
   - Rejected: Requires Python runtime
   - Rejected: Prevents non-technical authoring
   - Rejected: Not portable without Python

3. **Directory-as-package (no single root file)**
   - Rejected: Harder to discover
   - Rejected: No single place to put metadata
   - Rejected: Less clear what the package is

4. **Multiple formats (YAML + JSON + Python)**
   - Rejected: Complexity for v1
   - Rejected: Conflicting source-of-truth issues
   - **Possible future** once single format proven

5. **Toml or other format**
   - Rejected: YAML more standard in agent/DevOps community
   - Rejected: Unnecessary additional format diversity

---

## Discovery Convention

PackageLoader discovers packages by pattern:

```
agents/
  agent-name/           # Directory matches package id
    agent.yaml          # File named after kind
  another-agent/
    agent.yaml

tools/
  tool-name/
    tool.yaml           # Or just tool.yaml in tools/

skills/
  skill-name.yaml       # Or directory with skill.yaml
```

Mixed styles supported but discouraged for clarity.

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-004: Instructions Embedded in YAML](ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)

## References

- [ARCHITECTURE_V2.md - Filesystem Package Model](../ARCHITECTURE_V2.md#filesystem-package-model)
- [@awp/loader - Package discovery](../../../packages/loader/README.md#package-discovery)
