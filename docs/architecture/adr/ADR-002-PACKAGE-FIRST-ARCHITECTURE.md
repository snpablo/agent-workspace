# ADR-002: Package-First Architecture

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform is **package-first**: definitions live on the filesystem as versioned packages, and the loader/runtime are built around that assumption.

## Context

The platform needs definitions that are:

- easy to inspect in git
- portable across environments
- readable without running code
- compatible with pull-request workflows

## Decision

Definitions for projects, agents, tools, skills, channels, schedules, and resources live as filesystem packages.

The filesystem package is the source of truth. The loader discovers those packages, validates them, and registers them for runtime use.

Other systems can support the platform later, but they do not replace the package-first model.

## Consequences

### Positive

- Git-native authoring and review
- Clear repo structure for humans and tooling
- Easy portability of example and real projects
- Minimal infrastructure required to start

### Tradeoffs

- Large package sets need better indexing and caching
- Loader quality becomes critical platform infrastructure
- Hot-reload or distributed authoring are deferred concerns

## Alternatives Considered

1. **Database-first definitions**
   - Rejected because it weakens portability and git-based review.

2. **API-first definitions**
   - Rejected because it makes local development and offline inspection harder.

3. **Code-first definitions**
   - Rejected because it couples authoring to execution environments and developer-only tooling.

4. **Multi-source definitions from day one**
   - Rejected because it adds complexity before the filesystem model is fully proven.

---

## Related Decisions

- [ADR-003: YAML-Rooted Packages](ADR-003-YAML-ROOTED-PACKAGES.md)
- [ADR-004: Instructions Embedded in YAML](ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)

## References

- [ARCHITECTURE_V2.md - Filesystem Package Model](../ARCHITECTURE_V2.md#filesystem-package-model)
- [AGENTS.md - Package Structure](../../../AGENTS.md#package-structure)
- [@awp/loader documentation](../../../packages/loader/README.md)
