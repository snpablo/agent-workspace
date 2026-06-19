# Tool Model

This document clarifies what Tools are and what is NOT platform vocabulary.

## Core Principle

**Tools are first-class platform concepts.**

Agents invoke Tools. What backs a Tool is transparent.

```
Agent
  ├─ invokes Tool
       ├─ Tool has schema (inputs/outputs)
       ├─ Tool has implementation (how it works)
       │   ├─ Could be API
       │   ├─ Could be Connector
       │   ├─ Could be MCP
       │   ├─ Could be native code
       │   └─ Could be platform service
       └─ Platform handles the details
```

From the Agent's perspective: invoke Tool with schema-defined inputs, get schema-defined outputs.

## What IS Platform Vocabulary

- **Tool** - Capability that an Agent can invoke
- **Skill** - Reusable know-how composed from Tools
- **Agent** - Actor that uses Tools and Skills
- **Run** - Execution record of Tool/Skill invocation

## What IS NOT Platform Vocabulary

The following are implementation details behind Tools. Do NOT use as platform root concepts:

### ❌ Connector

Connectors are one way Tools can be backed:
- Database connectors (PostgreSQL, MySQL, MongoDB)
- SaaS connectors (Salesforce, HubSpot, Slack)
- Data source connectors (S3, Snowflake, BigQuery)

But from the platform perspective: it's just a Tool.

```yaml
# BAD - "Connector" is not platform vocabulary
connectors:
  - id: customer-db
    type: postgres

# GOOD - Tool that happens to be connector-backed
tools:
  - id: customer-lookup
    implementation:
      type: connector
      connector_type: postgres
```

### ❌ MCPServer

MCP (Model Context Protocol) servers are one way Tools can be backed.

But from the platform perspective: it's just a Tool backed by MCP.

```yaml
# BAD - "MCPServer" is not platform vocabulary
mcp_servers:
  - id: document-server
    protocol: claude-mcp

# GOOD - Tool backed by MCP
tools:
  - id: document-retrieval
    implementation:
      type: mcp
      server: claude-document-server
```

### ❌ Provider

Providers are abstract concepts of capability sources. Use Tool instead.

```yaml
# BAD
providers:
  - id: openweather-provider
    type: api

# GOOD
tools:
  - id: weather-lookup
    implementation:
      type: http
      endpoint: https://api.openweathermap.org/...
```

### ❌ Integration

Integrations are ways to connect to external systems. Use Tool instead.

```yaml
# BAD - "Integration" is not platform vocabulary
integrations:
  - id: slack-integration
    type: chat
  - id: jira-integration
    type: project-management

# GOOD - Tools with different implementations
tools:
  - id: slack-notify
    implementation:
      type: connector
      connector_type: slack
  
  - id: jira-create-issue
    implementation:
      type: connector
      connector_type: jira
```

## Tool Backing Mechanisms

Tools can be backed by any of these mechanisms. All are implementation details:

### 1. API Endpoints

Tool backed by HTTP/REST API, GraphQL, or webhooks.

```yaml
tool:
  id: search-tool
  implementation:
    type: http
    method: POST
    endpoint: https://api.example.com/search
    auth:
      type: bearer
      token_env: API_KEY
```

### 2. Connectors

Tool backed by connector to data source or SaaS system.

```yaml
tool:
  id: database-query
  implementation:
    type: connector
    connector_type: postgres
    connection:
      host: db.example.com
      database: customers
      credentials_env: DB_CONNECTION
    query: SELECT * FROM users WHERE id = ?
```

### 3. MCP Servers

Tool backed by Claude Model Context Protocol server.

```yaml
tool:
  id: document-retrieval
  implementation:
    type: mcp
    server: claude-document-server
    capabilities: [retrieve, search, summarize]
```

### 4. Native Code

Tool backed by Python, JavaScript, Go, or other compiled/interpreted code.

```yaml
tool:
  id: financial-calculator
  implementation:
    type: function
    language: python
    module: financial_tools
    function: calculate_roi
    environment:
      DISCOUNT_RATE: "0.10"
```

### 5. Platform Services

Tool backed by built-in platform capabilities.

```yaml
tool:
  id: create-artifact
  implementation:
    type: platform_service
    service: artifact_manager
    operation: create
```

## Tool Contract

### What Platform MUST Enforce

1. **Schema Validation** - Inputs conform to schema, outputs conform to schema
2. **Error Handling** - Tool errors are caught and logged
3. **Timeout** - Tool invocations respect timeout
4. **Retry** - Tool invocations follow retry policy
5. **Audit** - All Tool invocations are recorded in Runs
6. **Cost** - Tool usage is tracked and billed if applicable

### What Platform MUST NOT Enforce

Platform does NOT care about implementation mechanism. These are transparent:

- ❌ Whether Tool is HTTP or MCP
- ❌ Whether database is PostgreSQL or MongoDB
- ❌ Whether code is Python or JavaScript
- ❌ Whether connector is Salesforce or HubSpot

Platform routes Tool invocations to correct implementation based on `implementation.type` and related config.

## Design Implications

### For Tool Authors

Define a Tool with:
1. Clear schema (inputs/outputs)
2. Implementation mechanism
3. Constraints (timeout, retries, cost)

```yaml
tool:
  id: my-tool
  name: My Capability
  description: What it does
  
  schema:
    inputs: {...}
    outputs: {...}
  
  implementation:
    type: <mechanism>  # http, connector, mcp, function, platform_service
    # mechanism-specific config
  
  timeout_seconds: 30
  retry_policy: {...}
```

### For Agent Authors

Use a Tool:
1. Know its schema (inputs/outputs)
2. Don't care how it works
3. Handle responses and errors

```yaml
agent:
  instructions: |
    You can use the search-tool to find information.
    It takes a query and returns results.
    
    You can use the database-query tool to access customer data.
    Same interface, different backing mechanism.
```

### For Platform

Route Tool invocation:
1. Receive invocation for Tool X with inputs
2. Look up Tool X definition
3. Route to correct implementation handler (HTTP, MCP, function, etc.)
4. Execute with timeout/retry policies
5. Validate outputs against schema
6. Record in Run
7. Return to Agent

## Examples

### Example 1: Database Connector as Tool

A database system appears as a Tool from the Agent's perspective:

```yaml
# In project config
tools:
  - name: customer-database
    path: tools/customer-database.yaml

# In tools/customer-database.yaml
tool:
  id: customer-db
  name: Customer Database
  implementation:
    type: connector
    connector_type: postgres
    connection: ...
  schema:
    inputs:
      type: object
      properties:
        query: { type: string }
    outputs:
      type: array
      items: { type: object }
```

Agent uses it:
```
Agent: "I need customer data. Let me use the customer-database tool with query 'SELECT * FROM customers WHERE status = active'"
→ Platform invokes tool via connector
→ Returns results
→ Agent processes results
```

### Example 2: MCP Server as Tool

A Claude Model Context Protocol server appears as a Tool:

```yaml
tool:
  id: document-retrieval
  name: Retrieve Documents
  implementation:
    type: mcp
    server: claude-document-server
    capabilities: [retrieve, search, summarize]
  schema:
    inputs:
      type: object
      properties:
        query: { type: string }
    outputs:
      type: array
      items:
        type: object
        properties:
          document_id: { type: string }
          content: { type: string }
```

Agent uses it:
```
Agent: "I need to find documents about Q3 strategy. Let me use the document-retrieval tool"
→ Platform invokes via MCP
→ Returns documents
→ Agent reasons about documents
```

### Example 3: Native Function as Tool

A Python function appears as a Tool:

```yaml
tool:
  id: financial-calculator
  name: Calculate Financials
  implementation:
    type: function
    language: python
    module: financial_tools
    function: calculate_metrics
  schema:
    inputs:
      type: object
      properties:
        initial_investment: { type: number }
        cash_flows: { type: array }
    outputs:
      type: object
      properties:
        roi: { type: number }
        npv: { type: number }
```

Agent uses it:
```
Agent: "Let me calculate the financial metrics for this option"
→ Platform invokes function
→ Returns metrics
→ Agent analyzes
```

All three are Tools. Implementation mechanism is transparent.

## Non-Goals

The following are NOT platform concerns:

- ❌ Managing credentials for each connector type
- ❌ Connection pooling and optimization
- ❌ Database query optimization
- ❌ API rate limiting (delegated to Tool config)
- ❌ Provider-specific behaviors

These are Tool implementation concerns or infrastructure concerns, not platform concerns.

## Summary

| Concept | Status | Example |
|---------|--------|---------|
| Tool | ✅ Platform concept | Agent invokes Tool |
| Connector | ❌ Implementation detail | One way to back a Tool |
| MCPServer | ❌ Implementation detail | Another way to back a Tool |
| Provider | ❌ Not platform vocabulary | Use Tool with api implementation |
| Integration | ❌ Not platform vocabulary | Use Tool with connector implementation |
| Skill | ✅ Platform concept | Composes multiple Tools |
| Agent | ✅ Platform concept | Uses Tools and Skills |
| Run | ✅ Platform concept | Records Tool invocation |

The platform vocabulary is simple: **Agents use Tools and Skills to do work.**

How those Tools work is an implementation detail the platform handles transparently.
