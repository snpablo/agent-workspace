# Architecture Overview

Architecture V3 models the platform in three explicit layers:

- **Collaboration and work**: Project, Agent, Skill, Artifact, Thread, Run, Resource, Schedule, Channel
- **Integration and capability**: Connector, Tool
- **Runtime records and state**: Event, AgentSession, projected current state

Its runtime behavior is organized around three connected ideas:

- **Persisted collaboration state** preserves long-running work across crashes and handoffs
- **Wake-on-event execution** lets agents stop, wait, and resume from relevant events or schedules
- **Evaluation as a sidecar concern** keeps quality assessment outside the primary execution loop

## Learning Path

1. Read the [authoritative specification](./ARCHITECTURE_V3.md).
2. Read the relevant [ADRs](./adr/README.md).
3. Compare the model with the [project archetypes](../project-archetypes/README.md).
4. Inspect the [example projects](../examples/README.md).
5. Read the [source packages](../../packages/README.md).

## Platform Flow

```text
Project filesystem
        ↓
Project loader
        ↓
Typed project model
        ↓
Canonical events recorded and replayed
        ↓
Projected workspace state
        ↓
Interpreter builds renderer-neutral workspace tree
        ↓
Renderer outputs React, Ink, or future surfaces
```

The same filesystem-native flow also powers UI: the UI does not become its own truth source. It interprets loaded project definitions plus projected runtime state.

## References

- [ARCHITECTURE_V3.md](./ARCHITECTURE_V3.md)
- [ADR Guide](./adr/README.md)
- [Posters](../posters/README.md)
