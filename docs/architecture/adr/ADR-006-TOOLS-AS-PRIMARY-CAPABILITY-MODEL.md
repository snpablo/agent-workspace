# ADR-006: Tools as the Primary Capability Model

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Agents need capabilities to:
- Call external APIs
- Query databases
- Access files
- Execute functions
- Use specialized services

The platform needs one model for all these, but the backing mechanisms are diverse:
- REST APIs
- Database connectors
- MCP servers
- Native code (Python, JavaScript)
- Built-in platform services

Previous approaches mixed concepts:
- Some capabilities were "integrations"
- Some were "connectors"
- Some were "functions"
- This created confusion about what's first-class

## Decision

**Tool is the single, primary capability model. Everything else is a provider mechanism.**

A Tool:
- Has a uniform interface (schema with inputs/outputs)
- Is independent of backing mechanism
- Can be swapped for different implementation without changing agent code
- Is versioned and discoverable like any package

Backing mechanisms are NOT first-class concepts:
- **API** is a provider type for tools backed by HTTP endpoints
- **Connector** is a provider type for database/SaaS tools
- **MCP** is a provider type for Model Context Protocol servers
- **Function** is a provider type for native code
- **Platform Service** is a provider type for built-in services

From agent perspective:

```typescript
// Agent doesn't care HOW the tool works
const result = await platform.executeTool({
  toolId: 'search',
  input: { query: 'market trends' }
});

// Platform routes to correct provider:
// - If tool.implementation.type = 'http' → ApiToolProvider
// - If tool.implementation.type = 'connector' → ConnectorToolProvider
// - If tool.implementation.type = 'mcp' → McpToolProvider
// - etc.
```

Tool definition:

```yaml
kind: tool
id: search
name: Web Search
version: 1.0.0

description: Search the internet for information

implementation:
  type: http                    # Provider type, not tool type
  endpoint: https://api.search.example.com/search
  method: POST
  auth:
    type: bearer
    token_env: SEARCH_API_KEY

schema:
  inputs:
    type: object
    properties:
      query:
        type: string
  outputs:
    type: object
    properties:
      results:
        type: array
```

## Consequences

### Positive
- **Unified interface:** All capabilities look the same to agents
- **Provider abstraction:** Swap implementations without changing agent code
- **Clear separation:** Tool = what agent sees, Provider = how it's executed
- **Easy to extend:** New provider type = new tool implementation option, not new concept
- **Composition friendly:** Skills can combine tools from any provider
- **Type safety:** Tool schema is validated, inputs/outputs checked
- **Vendor independence:** Tool doesn't lock to specific API or database

### Negative
- **Less specific terminology:** "Tool" less precise than "API" or "database"
- **Extra abstraction:** One more layer for simple cases
- **Provider complexity:** Must implement providers for each mechanism type

## Alternatives Considered

1. **Keep separate concepts (API, Connector, Function, etc.)**
   - Rejected: Confusing to agents which type they're using
   - Rejected: Requires different code paths for different types
   - Rejected: Adds concepts to minimal ontology
   - **Old V1 approach**

2. **Make provider type part of tool interface**
   - Rejected: Agents care about inputs/outputs, not implementation
   - Rejected: Violates separation of concerns

3. **Hide implementation completely (auto-detect)**
   - Rejected: Still need configuration somewhere
   - Rejected: Makes debugging harder

4. **Multiple capability types (Tool, Integration, Connector, Function)**
   - Rejected: Violates minimal ontology
   - Rejected: Confusing to users and developers
   - **Causes problems in V1**

---

## Provider Pattern

Each provider implements:

```typescript
interface ToolProvider {
  type: string;  // 'http', 'mcp', 'connector', 'function', 'platform_service'
  
  canHandle(tool: Tool): boolean;
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;
  validate(tool: Tool): ValidationResult;
}
```

New backing mechanism?
- **Old approach:** Add new capability type (breaks API)
- **New approach:** Add new provider (extends toolkit)

This is how you add a GraphQL tool provider, for example:

```typescript
class GraphQLToolProvider implements ToolProvider {
  type = 'graphql';
  
  canHandle(tool: Tool) {
    return tool.implementation?.type === 'graphql';
  }
  
  async execute(request: ToolExecutionRequest) {
    // Execute GraphQL query
  }
}
```

Agent code doesn't change. Platform routing handles it.

---

## Skills Compose Tools

Skills are the next level of composition:

```yaml
kind: skill
id: financial-analysis
name: Financial Analysis

tools:
  - id: search-tool              # Could be API, connector, MCP, etc.
  - id: database-query           # Could be any provider type
  - id: calculation-function     # Function provider

instructions: |
  Use available tools to analyze financial data.
```

Skills don't care which provider backs each tool.

---

## Related Decisions

- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md) (Tool is the single concept)
- [ADR-009: Borrow Before Inventing](ADR-009-BORROW-BEFORE-INVENTING.md) (Tool from industry standard)

## References

- [ARCHITECTURE_V2.md - Tool Model](../ARCHITECTURE_V2.md#tool-model)
- [TOOL_EXECUTION_MODEL.md](../../../TOOL_EXECUTION_MODEL.md)
- [@awp/tools Documentation](../../../packages/tools/README.md)
