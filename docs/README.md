# Agent Platform Documentation

This is the canonical onboarding path for learning Architecture V3.

Use these docs in order:

1. [Architecture Overview](./architecture/README.md)
2. [Project Archetypes](./project-archetypes/README.md)
3. [Example Projects](./examples/README.md)
4. [Design Notes](./designs/README.md)
5. [Architecture Posters](./posters/README.md)
6. [Source Packages](../packages/README.md)

## Terms First

If you are new to the repo, start by learning the 10 Architecture V3 concepts in [ARCHITECTURE_V3.md](./architecture/ARCHITECTURE_V3.md):

- `Project` organizes context
- `Agent` performs work
- `Tool` provides capability
- `Skill` packages reusable know-how
- `Channel` communicates outward
- `Schedule` triggers execution
- `Resource` provides shared context
- `Artifact` preserves outcomes
- `Thread` captures collaboration
- `Run` records execution

Everything else in the docs builds on those terms.

## Learn By Layer

- [Architecture Overview](./architecture/README.md) explains the Architecture V3 model and links to the authoritative spec and ADRs.
- [Project Archetypes](./project-archetypes/README.md) shows the four domain dashboards used to explain the platform in business terms.
- [Example Projects](./examples/README.md) maps those archetypes into filesystem-first YAML examples.
- [Design Notes](./designs/README.md) explains concrete runtime behavior patterns, especially the event-primary runtime model and projected workspace state.
- [Posters](./posters/README.md) explains the runtime, tool, artifact, and package-loading mechanics with diagrams.
- [Source Packages](../packages/README.md) maps the model to the implementation.

## Recommended Read Order

1. Read [ARCHITECTURE_V3.md](./architecture/ARCHITECTURE_V3.md) for the vocabulary.
2. Read [Project Archetypes](./project-archetypes/README.md) to see the concepts in business-facing dashboards.
3. Read [Example Projects](./examples/README.md) to see the filesystem package shape.
4. Read [Design Notes](./designs/README.md) for concrete runtime patterns.
5. Read [Architecture Posters](./posters/README.md) to understand runtime behavior.
6. Read [Source Packages](../packages/README.md) to connect the model to code.

## Core References

- [ARCHITECTURE_V3.md](./architecture/ARCHITECTURE_V3.md)
- [AGENTS.md](../AGENTS.md)
- [packages/README.md](../packages/README.md)
