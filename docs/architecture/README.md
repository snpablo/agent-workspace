# Architecture Overview

Architecture V2 models the platform with 10 concepts: Project, Agent, Tool, Skill, Channel, Schedule, Resource, Artifact, Thread, and Run.

## Learning Path

1. Read the [authoritative specification](./ARCHITECTURE_V2.md).
2. Read the relevant [ADRs](./adr/README.md).
3. Compare the model with the [project archetypes](../project-archetypes/README.md).
4. Inspect the [example projects](../examples/README.md).
5. Read the [source packages](../../packages/README.md).

## Platform Flow

```text
Project packages
        ↓
Package loading and validation
        ↓
Project runtime
        ↓
Agent, tool, and schedule execution
        ↓
Artifacts, threads, and runs
```

## References

- [ARCHITECTURE_V2.md](./ARCHITECTURE_V2.md)
- [ADR Guide](./adr/README.md)
- [Posters](../posters/README.md)
