# @awp/tools

Tool execution and provider management for Agent Platform.

**Core Principle:** Tools are first-class abstractions. Connectors bind external systems; tools are the discrete actions or retrieval operations surfaced through those bindings.

## Concepts

### Tool

A capability that an agent can invoke.

```typescript
const tool: Tool = {
  kind: 'tool',
  id: 'web-search',
  name: 'Web Search',
  version: '1.0.0',
  description: 'Search the web for information',
  connector: {
    id: 'search-platform',
  },
  implementation: {
    type: 'http',
    endpoint: 'https://api.search.example.com/search',
  },
};
```

Tools may reference exactly one connector package that holds auth, base URLs, remote MCP server endpoints, or tenant/workspace binding details.

**Key principle:** Agents see only the tool interface (name, description, schema). Connector credentials and transport details stay hidden behind that tool boundary.

### ToolProvider

Abstraction for executing a tool with a specific backing mechanism.

```typescript
interface ToolProvider {
  type: string; // 'http', 'connector', 'mcp', 'function', 'platform_service'
  canHandle(tool: Tool): boolean;
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;
  validate(tool: Tool): { valid: boolean; errors: string[] };
}
```

### Execution Request/Result

```typescript
interface ToolExecutionRequest {
  toolId: string;
  input: Record<string, any>;
  options?: {
    timeout?: number;
    retries?: number;
  };
}

interface ToolExecutionResult {
  success: boolean;
  output?: Record<string, any>;
  error?: string;
  metadata?: {
    executionTime?: number;
    provider?: string;
  };
}
```

## Supported Backing Types

### 1. HTTP/API Tools

External REST APIs.

```yaml
kind: tool
id: web-search-api
name: Web Search
implementation:
  type: http
  endpoint: https://api.search.example.com/search
  method: POST
  auth:
    type: bearer
    token_env: SEARCH_API_KEY
```

**Provider:** `ApiToolProvider`
**Validates:** Requires endpoint

### Connectors vs Tools

- A **connector** binds to an external system as a specific user, tenant, or service account.
- A **tool** is the discrete operation the model may call through that connector.

Examples:

- One Google Drive MCP connector may surface `search_files`, `read_document`, and `share_link`.
- One ServiceNow connector may surface `Get_Ticket_Details` and `Update_Status`.

### 2. Connector Tools

Database and SaaS connectors.

```yaml
kind: tool
id: company-database
name: Company Database
implementation:
  type: connector
  connector_type: postgres
  config:
    host: db.example.com
    port: 5432
```

**Provider:** `ConnectorToolProvider`
**Validates:** Requires connector_type

Connector-backed tools should ideally reference a connector package as well, so auth and system binding stay separate from the callable operation.
One connector may surface many tools, but each tool should execute through one connector interface.

**Supported connectors:**
- postgres
- mysql
- mongodb
- salesforce
- hubspot
- (extensible)

### 3. MCP Tools

Model Context Protocol servers.

```yaml
kind: tool
id: document-retrieval
name: Document Retrieval
implementation:
  type: mcp
  server: claude-document-server
  capabilities: [read, search, index]
```

**Provider:** `McpToolProvider`
**Validates:** Requires server

In many deployments, an MCP-backed tool is exposed by a connector package that points at a specific MCP server and user/session binding.

### 4. Native Code Tools

Python, JavaScript, or other native functions.

```yaml
kind: tool
id: financial-calculator
name: Financial Calculator
implementation:
  type: function
  language: python
  module: financial_tools
  function: calculate_metrics
  
# Alternative: JavaScript
implementation:
  type: function
  language: javascript
  module: @tools/financial
  function: calculateMetrics
```

**Provider:** `NativeToolProvider`
**Validates:** Requires module or function

### 5. Platform Service Tools

Built-in platform services.

```yaml
kind: tool
id: artifact-manager
name: Artifact Manager
implementation:
  type: platform_service
  service: artifact_manager
  operation: create
```

**Provider:** `PlatformServiceToolProvider`
**Validates:** Requires service and operation

**Built-in services:**
- artifact_manager (create, update, list)
- thread_manager (create, add_message, close)
- schedule_manager (create, update, execute)
- participant_manager (add, remove, list)

## Usage

### Basic Tool Execution

```typescript
import { ToolRegistry } from '@awp/tools';
import { Tool } from '@awp/types';

// Create registry with default providers
const registry = new ToolRegistry();

// Define a tool
const tool: Tool = {
  kind: 'tool',
  id: 'web-search',
  name: 'Web Search',
  version: '1.0.0',
  sourcePath: '/tools/web-search/web-search.yaml',
  implementation: {
    type: 'http',
    endpoint: 'https://api.search.example.com/search',
  },
};

// Register the tool
const registered = registry.registerTool(tool);

// Execute the tool
const result = await registry.execute({
  toolId: 'web-search',
  input: {
    query: 'agent framework',
    limit: 10,
  },
});

if (result.success) {
  console.log(result.output);
} else {
  console.error(result.error);
}
```

### Multiple Tools with Different Backing

```typescript
// Same registry, different backing mechanisms
const httpTool = { /* ... type: http ... */ };
const connectorTool = { /* ... type: connector ... */ };
const mcpTool = { /* ... type: mcp ... */ };
const nativeTool = { /* ... type: function ... */ };

registry.registerTool(httpTool);
registry.registerTool(connectorTool);
registry.registerTool(mcpTool);
registry.registerTool(nativeTool);

// All execute the same way
await registry.execute({ toolId: 'http-tool-id', input: {} });
await registry.execute({ toolId: 'connector-tool-id', input: {} });
await registry.execute({ toolId: 'mcp-tool-id', input: {} });
await registry.execute({ toolId: 'native-tool-id', input: {} });

// Platform transparently routes to correct provider
```

### Custom Provider

Create a custom provider for a new backing type.

```typescript
import { BaseToolProvider } from '@awp/tools';

class GraphQLToolProvider extends BaseToolProvider {
  type = 'graphql';

  canHandle(tool: Tool): boolean {
    const impl = tool.implementation as any;
    return impl.type === 'graphql';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    // Your GraphQL execution logic
    return {
      success: true,
      output: { /* ... */ },
      metadata: { provider: 'graphql' },
    };
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const errors = [];
    const impl = tool.implementation as any;
    if (!impl.endpoint) errors.push('GraphQL tool must specify endpoint');
    return { valid: errors.length === 0, errors };
  }
}

// Register custom provider
registry.registerProvider(new GraphQLToolProvider({
  type: 'graphql',
  config: { endpoint: 'https://...' },
}));
```

## Provider API

### ToolProvider Interface

```typescript
interface ToolProvider {
  type: string;

  canHandle(tool: Tool): boolean;
  execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;
  validate(tool: Tool): { valid: boolean; errors: string[] };
  getMetadata?(): Record<string, any>;
}
```

### BaseToolProvider

Base class for implementing providers.

```typescript
abstract class BaseToolProvider implements ToolProvider {
  abstract type: string;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig);
  abstract canHandle(tool: Tool): boolean;
  abstract execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;
  validate(tool: Tool): { valid: boolean; errors: string[] };
  getMetadata(): Record<string, any>;
}
```

## ToolRegistry API

```typescript
class ToolRegistry implements IToolRegistry {
  // Register
  registerTool(tool: Tool, provider?: ToolProvider): boolean;
  registerProvider(provider: ToolProvider): void;

  // Query
  getProvider(tool: Tool): ToolProvider | undefined;
  getToolBinding(toolId: string): ToolBinding | undefined;
  getTools(): Tool[];
  getProviders(): ToolProvider[];

  // Execute
  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  // Stats & cleanup
  getStats(): Record<string, any>;
  clear(): void;
}
```

### Statistics

```typescript
const stats = registry.getStats();

// {
//   tools: 5,              // Registered tools
//   providers: 5,          // Available providers
//   execution: {
//     total: 42,           // Total executions
//     successful: 38,      // Successful
//     failed: 4,           // Failed
//     byProvider: {        // By provider type
//       http: 20,
//       connector: 15,
//       mcp: 3,
//       function: 2,
//       platform_service: 2,
//     }
//   }
// }
```

## Execution Options

### Timeout

```typescript
const result = await registry.execute({
  toolId: 'web-search',
  input: { query: 'test' },
  options: { timeout: 30 }, // 30 seconds
});
```

### Retry

```typescript
const result = await registry.execute({
  toolId: 'api-call',
  input: { /* ... */ },
  options: {
    retries: 3,
    retryBackoff: 2, // 2 seconds
  },
});
```

## Error Handling

### Validation Errors

Tools are validated before registration.

```typescript
const tool = { /* invalid tool */ };
const success = registry.registerTool(tool);

if (!success) {
  console.error('Registration failed - tool does not match provider');
}
```

### Execution Errors

Execution failures are returned in result.

```typescript
const result = await registry.execute({
  toolId: 'missing-tool',
  input: {},
});

if (!result.success) {
  console.error('Execution failed:', result.error);
  // Error details in result.error
  // Provider info in result.metadata.provider
}
```

## Design Principles

### 1. Tool Abstraction

Agents see tools as abstract interfaces. They don't need to reason about OAuth, service bindings, or MCP transport details directly.

### 2. Provider Pattern

Backing mechanisms are plugins. The platform routes tools to appropriate providers based on implementation type.

### 3. Separation of Concerns

- **Tool** = what (schema, inputs, outputs)
- **Provider** = how (implementation mechanism)
- **Registry** = management and routing

### 4. Extensibility

New provider types are added by implementing ToolProvider interface. No changes needed to tool or registry abstractions.

### 5. Transparency

Platform handles provider complexity. Agents use consistent interface regardless of backing.

## Integration

### With AgentCapabilityRegistry

```typescript
import { AgentCapabilityRegistry } from '@awp/loader';
import { ToolRegistry } from '@awp/tools';

// Registries loaded from agent package
const agentRegistry = new AgentCapabilityRegistry();
const tools = agentRegistry.tools.getAll();

// Create tool execution registry
const toolRegistry = new ToolRegistry();
for (const tool of tools) {
  toolRegistry.registerTool(tool);
}
```

### With ProjectRuntime

```typescript
import { ProjectRuntime } from '@awp/runtime';
import { ToolRegistry } from '@awp/tools';

const toolRegistry = new ToolRegistry();

// When agent is loaded with tools
for (const tool of agent.tools) {
  toolRegistry.registerTool(tool);
}

// Runtime executes tools via registry
const result = await toolRegistry.execute({
  toolId: selectedTool.id,
  input: agentInput,
});
```

## Examples

See [examples/tool-execution.ts](examples/tool-execution.ts).

```typescript
// Show tool execution with multiple providers
npm run example examples/tool-execution.ts

// Show tool abstraction principle
```

## Tests

Comprehensive test coverage for all providers and registry.

```bash
npm test
```

**Test categories:**
- Provider identification and routing
- Tool validation
- Execution success and failure
- Statistics tracking
- Tool abstraction (same tool type, different backing)

## Performance

- **Provider initialization:** <1ms
- **Tool registration:** <0.1ms per tool
- **Tool execution:** <10ms (mock), varies by backing mechanism
- **Statistics queries:** O(1)

## What's Not in Here

These are implementation details, not top-level platform concepts:

- Specific API formats (REST vs GraphQL)
- Specific database engines (PostgreSQL vs MySQL)
- Specific MCP servers
- Specific function runtimes

All of these are handled by their respective providers.

## Architecture Diagram

```
Agent
  │
  ├─→ Tool ID
  │
ToolRegistry
  │
  ├─→ Tool Binding (Tool + Provider)
  │
  ├─→ Provider Router
  │      │
  │      ├─→ ApiToolProvider (HTTP)
  │      ├─→ ConnectorToolProvider (DB/SaaS)
  │      ├─→ McpToolProvider (MCP)
  │      ├─→ NativeToolProvider (Code)
  │      └─→ PlatformServiceProvider (Built-in)
  │
  └─→ ToolExecutionResult
```

## Next Steps

- Real provider implementations (with actual HTTP, DB, MCP calls)
- Provider configuration and auth management
- Tool versioning and compatibility
- Provider performance monitoring
- Tool composition and chaining

## Conclusion

The tool model provides:

✅ **Tool abstraction** - Agents see uniform interface
✅ **Provider pattern** - Backing mechanisms are pluggable
✅ **Extensibility** - Add new provider types easily
✅ **Composability** - Tools compose into skills
✅ **Observability** - Execution statistics and metadata
✅ **Type safety** - Full TypeScript support

Tools are first-class. Connectors define outbound bindings. Providers execute the resulting tool calls.
