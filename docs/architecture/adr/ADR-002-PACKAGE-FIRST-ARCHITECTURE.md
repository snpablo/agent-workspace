# ADR-002: Package-First Architecture

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Agent definitions can be stored in multiple ways:
- Database (normalized, queryable)
- File system (git-native, portable)
- APIs (distributed, scalable)
- In-memory (fast, ephemeral)

The platform needs to support:
- Version control (git)
- Portability (move between environments)
- Discoverability (find agents by browsing)
- Non-technical authoring (YAML, not code)
- Team collaboration (pull requests, code review)

Traditional approaches store definitions in databases or code-as-configuration, neither of which fully support all requirements.

## Decision

**Definitions live as filesystem packages first.**

Every definition (Agent, Tool, Skill, Project, etc.) is:
- A directory on the filesystem
- Contains a YAML file with the definition
- Discovered through directory scanning
- Loaded by PackageLoader
- Indexed in PackageRegistry
- Version controlled in git

```
project/
  agents/
    decision-analyzer/
      agent.yaml              # The definition
      tools/
        search-tool.yaml
      skills/
        option-evaluation.yaml
```

Packages can be backed by additional systems:
- Git for version control (primary)
- Database for runtime state (secondary)
- APIs for distributed packages (future)

But the filesystem package is the source of truth.

## Consequences

### Positive
- **Git-native:** Definitions are version controlled by default
- **Portable:** Copy a directory, entire agent moves to another environment
- **Discoverable:** Browse filesystem to explore agents and capabilities
- **Human-readable:** YAML is human-editable
- **Non-technical authoring:** Anyone can write YAML, no code required
- **Easy to understand:** "Agents live in agents/ directory" is clear
- **Minimal infrastructure:** No database required to get started
- **Branching friendly:** Git workflows naturally support experimentation

### Negative
- **Scalability limits:** Can't efficiently query across thousands of packages
- **Requires loader:** Must implement package discovery and loading
- **Not real-time:** Changes require reloading packages, not live database query
- **File system limitations:** Large monorepos can be slow

## Alternatives Considered

1. **Database-first (definitions in SQL)**
   - Rejected: No version control without extra work
   - Rejected: Not portable
   - Rejected: Requires persistent storage from day 1
   - **Future option** for large deployments

2. **API-first (definitions served by API)**
   - Rejected: Requires network for local development
   - Rejected: Makes git integration complex
   - Rejected: Less portable

3. **Code-first (definitions as Python/TypeScript)**
   - Rejected: Requires code execution
   - Rejected: Makes non-technical authoring impossible
   - Rejected: Not readable to non-developers

4. **Hybrid (read from multiple sources)**
   - Rejected for v1: Too much complexity
   - **Future possibility** once filesystem model is proven

---

## Scaling Path

- **v1 (current):** Filesystem packages with PackageLoader
- **v2 (future):** Add optional caching layer for large deployments
- **v3 (future):** Support loading from multiple sources (filesystem, database, API)

---

## Related Decisions

- [ADR-003: YAML-Rooted Packages](ADR-003-YAML-ROOTED-PACKAGES.md)
- [ADR-004: Instructions Embedded in YAML](ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)

## References

- [ARCHITECTURE_V2.md - Filesystem Package Model](../ARCHITECTURE_V2.md#filesystem-package-model)
- [AGENT_PACKAGE_MODEL.md](../../../AGENT_PACKAGE_MODEL.md)
- [@awp/loader documentation](../../../packages/loader/README.md)
