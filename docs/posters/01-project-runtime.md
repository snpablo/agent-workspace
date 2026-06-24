# Project Runtime Architecture

This poster explains how a project moves from layered package definitions into event-canonical runtime state, projections, persistence, and audit history.

![Project Runtime Architecture](./images/01-project-runtime.svg)

## Covers

- Project runtime state
- Event replay and projection rebuild
- Lifecycle transitions
- Package loading and persistence support
- Event logging and audit history

## Key Concepts

- **ProjectState** is the queryable current-state projection around a project definition.
- **Registry** handles package discovery and indexing.
- **Loader** transforms YAML packages into runtime objects.
- **Storage** persists project state and history.
- **Event Log** captures canonical runtime truth.
