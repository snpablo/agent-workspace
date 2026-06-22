# Tool Provider Model

This poster explains how tools stay uniform at the agent layer while routing to different implementation providers.

![Tool Provider Model](./images/03-tool-model.svg)

## Covers

- Tool definition shape
- Provider types
- Invocation routing
- Provider abstraction

## Key Concepts

- **5 Provider Types** back tools with different implementations.
- **Tool Providers** expose a consistent interface to agents.
- **Routing** sends invocation requests to the correct provider.
- **Abstraction** keeps provider details out of agent instructions.
- **Extensibility** allows new provider types without changing agent code.
