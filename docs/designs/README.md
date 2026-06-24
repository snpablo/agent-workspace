# Design Notes

These notes capture implementation-oriented workflow patterns that sit below the architecture model.

Use them when the main architecture model is already settled, but the runtime behavior still needs clarification.

## Design Notes

- [Multi-Participant Resumable Workflow](./multi-participant-resumable-workflow.md) - How humans and agents take turns over time in one shared project
- [V3 Event-Primary Stress Test](./v3-event-primary-stress-test.md) - Why long-running human-agent work makes canonical events the runtime source of truth
- [Current Runtime Event Checklist](./current-runtime-event-checklist.md) - What canonical event payloads need to carry so projections can be rebuilt reliably

## Positioning

- [Architecture Overview](../architecture/README.md) defines the model.
- [Example Projects](../examples/README.md) show the package shape.
- These design notes explain how the runtime should behave inside that model.
