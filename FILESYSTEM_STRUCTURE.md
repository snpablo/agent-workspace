# Filesystem-First Package Structure

This document describes how Projects and Agents are organized as filesystem packages.

## Philosophy

The platform is organized around **filesystem-first declarative packages** rather than abstract configurations.

Each first-class concept (Project, Agent, Tool, Skill) is a **directory rooted by a YAML file**.

Benefits:
- **Discoverable** - Walk the filesystem to understand what exists
- **Portable** - Copy a directory, it works (self-contained)
- **Version-controllable** - Natural fit with git/version control
- **Composable** - Tools and Skills are reusable building blocks
- **Collaborative** - Artifacts, Threads, Runs are shared state
- **Observable** - Execution history visible on filesystem

## Project Package Structure

A Project is a directory with `project.yaml` at the root.

### Full Structure

```
my-project/
├── project.yaml                 # Project definition and metadata
├── agents/                      # Agent definitions
│   ├── decision-analyzer/
│   │   ├── agent.yaml
│   │   ├── tools/
│   │   ├── skills/
│   │   ├── schedules/
│   │   └── sandbox/
│   └── research-agent/
│       ├── agent.yaml
│       ├── tools/
│       └── skills/
├── resources/                   # Shared context (read-only or mutable)
│   ├── company-guidelines.md
│   ├── market-data.json
│   ├── config.yaml
│   └── credentials/
│       └── .gitignore
├── artifacts/                   # Artifact type schemas and examples
│   ├── decision-analysis/
│   │   ├── schema.json
│   │   └── examples/
│   │       └── example-analysis.json
│   └── research-report/
│       └── schema.json
├── schedules/                   # Project-level schedules
│   ├── daily-analysis.yaml
│   └── weekly-review.yaml
├── threads/                     # Collaboration threads (archive)
│   ├── 2026-06-19-strategy-review/
│   │   └── thread.yaml
│   └── 2026-06-18-quarterly-planning/
│       └── thread.yaml
└── runs/                        # Execution history
    ├── 2026-06-19/
    │   ├── run-001.yaml
    │   └── run-002.yaml
    └── 2026-06-18/
        └── run-001.yaml
```

### project.yaml

The root configuration for a Project:

```yaml
project:
  id: decision-analysis-v1
  name: Decision Analysis Project
  type: decision
  version: 1
  description: |
    Analyze strategic decisions using multiple agents
    and preserve decision artifacts for audit.
  created: 2026-06-01
  updated: 2026-06-19

agents:
  - id: decision-analyzer
    name: Decision Analyzer
    description: Analyzes decision options and produces analysis
    path: agents/decision-analyzer
    enabled: true
    
  - id: research-agent
    name: Research Agent
    description: Gathers background information
    path: agents/research-agent
    enabled: true

resources:
  - id: guidelines
    name: Company Guidelines
    path: resources/company-guidelines.md
    type: document
    
  - id: config
    name: Project Configuration
    path: resources/config.yaml
    type: config

artifact_types:
  - type: decision-analysis
    name: Decision Analysis
    description: Structured analysis of decision options
    schema: artifacts/decision-analysis/schema.json
    
  - type: research-report
    name: Research Report
    description: Background research and findings
    schema: artifacts/research-report/schema.json

schedules:
  - id: daily-analysis
    name: Daily Analysis
    path: schedules/daily-analysis.yaml
    agent: decision-analyzer
    
  - id: weekly-review
    name: Weekly Review
    path: schedules/weekly-review.yaml
    agent: decision-analyzer

permissions:
  - role: analyst
    can: ['run_agents', 'review_artifacts', 'edit_resources']
  - role: viewer
    can: ['view_artifacts', 'view_runs']
  - role: admin
    can: '*'

metadata:
  repository: https://github.com/myorg/decision-analysis
  tags: [decision, analysis, strategic-planning]
```

## Agent Package Structure

An Agent is a directory with `agent.yaml` at the root.

### Full Structure

```
agents/decision-analyzer/
├── agent.yaml                   # Agent definition and instructions
├── tools/                       # Tool definitions
│   ├── search-tool.yaml
│   ├── financial-analysis.yaml
│   └── market-data.yaml
├── skills/                      # Skill definitions (compose tools)
│   ├── financial-analysis.yaml
│   ├── strategic-assessment.yaml
│   └── option-evaluation.yaml
├── channels/                    # Communication interfaces
│   ├── slack.yaml
│   └── email.yaml
├── schedules/                   # Agent-specific triggers
│   ├── morning-analysis.yaml
│   └── alert-on-change.yaml
├── evals/                       # Evaluation/assessment definitions
│   ├── output-quality.yaml
│   └── decision-quality.yaml
└── sandbox/                     # Execution environment
    ├── resources.yaml
    └── constraints.yaml
```

### agent.yaml

The root configuration for an Agent:

```yaml
agent:
  id: decision-analyzer-v1
  name: Decision Analyzer
  type: autonomous
  version: 1
  description: |
    Analyzes strategic decisions and produces structured analysis.
    Uses financial tools, market research, and strategic frameworks.
  created: 2026-06-01
  updated: 2026-06-19

instructions: |
  You are an expert strategic decision analyst.
  
  Your role:
  - Analyze complex business decisions
  - Identify key stakeholders and impacts
  - Evaluate financial implications
  - Assess strategic fit and risks
  - Produce structured decision analysis
  
  Process:
  1. Gather context from resources and tools
  2. Search for relevant market data and precedents
  3. Analyze options using financial and strategic frameworks
  4. Identify risks and opportunities
  5. Produce a structured decision analysis artifact
  
  Be thorough, cite sources, and highlight assumptions.
  Escalate to humans for any decisions with significant uncertainty.

tools:
  - id: search-tool
    name: Search Tool
    path: tools/search-tool.yaml
    required: true
    
  - id: financial-analysis
    name: Financial Analysis Tool
    path: tools/financial-analysis.yaml
    required: true
    
  - id: market-data
    name: Market Data API
    path: tools/market-data.yaml
    required: false

skills:
  - id: financial-analysis
    name: Financial Analysis
    path: skills/financial-analysis.yaml
    
  - id: strategic-assessment
    name: Strategic Assessment
    path: skills/strategic-assessment.yaml
    
  - id: option-evaluation
    name: Option Evaluation
    path: skills/option-evaluation.yaml

channels:
  - type: slack
    path: channels/slack.yaml
    enabled: true
    
  - type: email
    path: channels/email.yaml
    enabled: false

constraints:
  max_iterations: 10
  timeout_seconds: 300
  max_tokens: 4000
  
  sandbox:
    path: sandbox/constraints.yaml

metadata:
  author: platform-team
  tags: [analysis, decision-support, strategic]
  contact: decision-team@example.com
```

## Tool Package Structure

A Tool is a directory with `tool.yaml` at the root.

### Full Structure

```
agents/decision-analyzer/tools/
├── search-tool/
│   └── tool.yaml
├── financial-analysis/
│   └── tool.yaml
└── market-data/
    └── tool.yaml
```

### tool.yaml - Platform View

A Tool is what Agents invoke. Its implementation (backing mechanism) is transparent to Agents:

```yaml
tool:
  id: search-tool-v1
  name: Search Tool
  version: 1
  description: Search the internet for information

  # What the Agent sees (platform contract)
  schema:
    inputs:
      type: object
      properties:
        query:
          type: string
          description: Search query
        limit:
          type: integer
          default: 10
          description: Max results
      required: [query]
    
    outputs:
      type: object
      properties:
        results:
          type: array
          items:
            type: object
            properties:
              title: { type: string }
              url: { type: string }
              snippet: { type: string }
        total_results: { type: integer }

  # How it's implemented (not platform vocabulary)
  implementation:
    type: http
    method: POST
    endpoint: https://api.search.example.com/v1/search
    auth:
      type: bearer
      token_env: SEARCH_API_KEY

  # Execution constraints
  timeout_seconds: 30
  retry_policy:
    max_attempts: 3
    backoff_seconds: 2

  metadata:
    cost_per_call: 0.001
    rate_limit: 100_per_minute
```

### Tool Implementation Types

Tools can be backed by different implementation mechanisms. All appear the same to Agents:

#### API Endpoint Tool

```yaml
tool:
  id: search-tool
  name: Search Tool
  description: Query search API
  
  implementation:
    type: http
    method: POST
    endpoint: https://api.search.example.com/v1/search
    auth:
      type: bearer
      token_env: SEARCH_API_KEY
    headers:
      Content-Type: application/json
  
  schema:
    inputs: { ... }
    outputs: { ... }
```

#### Connector Tool

```yaml
tool:
  id: customer-lookup
  name: Customer Lookup
  description: Query customer database
  
  implementation:
    type: connector
    connector_type: postgres
    connection:
      host: db.example.com
      database: customers
      credentials_env: DB_CONNECTION_STRING
    query: |
      SELECT * FROM customers WHERE id = ?
  
  schema:
    inputs:
      type: object
      properties:
        customer_id:
          type: string
    outputs:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        email: { type: string }
```

#### Native Code Tool

```yaml
tool:
  id: financial-calc
  name: Financial Calculator
  description: Calculate financial metrics
  
  implementation:
    type: function
    language: python
    module: financial_tools
    function: calculate_metrics
    environment:
      RATE_DISCOUNT: "0.1"
  
  schema:
    inputs:
      type: object
      properties:
        investment: { type: number }
        cash_flows: 
          type: array
          items: { type: number }
    outputs:
      type: object
      properties:
        roi: { type: number }
        npv: { type: number }
        payback: { type: number }
```

#### MCP Server Tool

```yaml
tool:
  id: document-retrieval
  name: Document Retrieval
  description: Retrieve and search documents via MCP
  
  implementation:
    type: mcp
    server: claude-document-server
    protocol_version: 1.0
    capabilities: [retrieve, search, summarize]
  
  schema:
    inputs:
      type: object
      properties:
        query: { type: string }
        document_type: { type: string }
    outputs:
      type: object
      properties:
        documents:
          type: array
          items:
            type: object
            properties:
              id: { type: string }
              content: { type: string }
              relevance_score: { type: number }
```

#### Platform Service Tool

```yaml
tool:
  id: artifact-create
  name: Create Artifact
  description: Create a durable artifact in the project
  
  implementation:
    type: platform_service
    service: artifact_manager
    operation: create
  
  schema:
    inputs:
      type: object
      properties:
        artifact_type: { type: string }
        content: { type: object }
        metadata: { type: object }
    outputs:
      type: object
      properties:
        artifact_id: { type: string }
        version: { type: number }
        created_at: { type: string }
```

### Key Principle

**From Agent perspective**: invoke Tool with inputs, get outputs.

**Implementation details** (API, connector, MCP, code, service) are transparent.

Platform handles routing, error handling, retry logic regardless of backing type.

## Skill Package Structure

A Skill is a directory with `skill.yaml` at the root.

### Full Structure

```
agents/decision-analyzer/skills/
├── financial-analysis/
│   ├── skill.yaml
│   └── tools/
│       └── financial-tool-ref.yaml
├── strategic-assessment/
│   ├── skill.yaml
│   └── tools/
│       ├── search-ref.yaml
│       └── market-data-ref.yaml
└── option-evaluation/
    ├── skill.yaml
    └── skills/
        ├── financial-analysis-ref.yaml
        └── strategic-assessment-ref.yaml
```

### skill.yaml

```yaml
skill:
  id: financial-analysis-v1
  name: Financial Analysis
  version: 1
  description: Analyze financial implications of options

instructions: |
  You are a financial analyst.
  
  Your task:
  - Analyze the financial implications of each option
  - Calculate key financial metrics (ROI, payback, NPV)
  - Identify financial risks and opportunities
  - Compare options on financial basis
  - Produce structured financial analysis
  
  Use the financial-analysis tool to run calculations.
  Search for comparable transactions and benchmarks.

tools:
  - id: financial-analysis
    name: Financial Analysis Tool
    path: ../tools/financial-analysis.yaml
    
  - id: search-tool
    name: Search Tool
    path: ../tools/search-tool.yaml

skills: []

output_schema:
  type: object
  properties:
    financial_summary:
      type: object
      properties:
        roi_percentage: { type: number }
        payback_months: { type: number }
        npv: { type: number }
    financial_risks:
      type: array
      items: { type: string }
    recommendations:
      type: string
```

## Artifact Type Structure

Artifact schemas are defined in the `artifacts/` directory:

```
artifacts/
├── decision-analysis/
│   ├── schema.json
│   └── examples/
│       ├── good-example.json
│       └── minimal-example.json
└── research-report/
    ├── schema.json
    └── examples/
        └── template.json
```

### schema.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Decision Analysis",
  "type": "object",
  "properties": {
    "decision_statement": {
      "type": "string",
      "description": "Clear statement of the decision to be made"
    },
    "options": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "analysis": {
      "type": "object",
      "properties": {
        "financial": { "type": "object" },
        "strategic": { "type": "object" },
        "risks": { "type": "array" }
      }
    },
    "recommendation": { "type": "string" }
  },
  "required": ["decision_statement", "options", "analysis"]
}
```

## Schedule Structure

Schedules are defined in `project.yaml` or `agent.yaml` but can reference external schedule files:

```yaml
schedules:
  - id: daily-analysis
    name: Daily Analysis
    trigger:
      type: cron
      schedule: "0 9 * * *"  # Every day at 9 AM
    agent: decision-analyzer
    input:
      focus_areas: [strategy, finance]
    
  - id: alert-on-change
    name: Alert on Market Change
    trigger:
      type: event
      source: market-data
      condition: change_percentage > 5
    agent: decision-analyzer
```

## Runs and Threads (Execution Output)

Runs and Threads are produced by the runtime and stored on the filesystem:

```
runs/
├── 2026-06-19/
│   ├── run-001.yaml           # Run metadata
│   ├── run-001-events.yaml    # Event log
│   └── run-001-artifacts/     # Artifacts produced
│       └── analysis-1.json
└── 2026-06-18/
    └── run-001.yaml

threads/
├── 2026-06-19-strategy-review/
│   ├── thread.yaml            # Thread metadata
│   ├── messages.yaml          # All messages
│   └── artifacts/             # Referenced artifacts
└── 2026-06-18-quarterly/
    └── thread.yaml
```

### run.yaml

```yaml
run:
  id: run-001
  project_id: decision-analysis-v1
  agent_id: decision-analyzer-v1
  
  status: completed
  started_at: 2026-06-19T09:00:00Z
  completed_at: 2026-06-19T09:15:00Z
  
  trigger:
    type: schedule
    schedule_id: daily-analysis
  
  input:
    focus_areas: [strategy, finance]
  
  artifacts_created:
    - type: decision-analysis
      id: artifact-001
      path: run-001-artifacts/analysis-1.json
  
  events_log: run-001-events.yaml
  
  metadata:
    model: gpt-4
    tokens_used: 2400
    cost: 0.12
```

## Key Principles

### Single Source of Truth

Each concept has exactly one YAML file as its definition.
No duplication across files.

### Instructions in YAML

All instructions go in the `instructions` field of the YAML file.
No separate markdown files for instructions.

### Filesystem Represents Structure

Walking the filesystem shows the complete structure.
No hidden configuration.

### Portable Packages

Copy a directory, it works.
No external dependencies except referenced tools/skills.

### Version Controllable

Projects fit naturally in git/version control.
Runs and threads are also versioned.

### Discoverable

Anyone can explore the filesystem to understand what agents/tools/skills exist.
No hidden registry needed.

## Examples

### Minimal Project

```
simple-project/
├── project.yaml
└── agents/
    └── assistant/
        ├── agent.yaml
        └── tools/
            └── search.yaml
```

### Complex Project

```
enterprise-project/
├── project.yaml
├── agents/
│   ├── decision-analyzer/
│   ├── research-agent/
│   └── compliance-checker/
├── resources/
│   ├── company-guidelines/
│   ├── market-data/
│   └── compliance-rules/
├── artifacts/
│   ├── decision-analysis/
│   ├── research-report/
│   └── compliance-review/
├── schedules/
│   ├── daily-analysis.yaml
│   └── weekly-review.yaml
├── runs/
│   └── 2026-06-*/
└── threads/
    └── 2026-06-*/
```

## Next Steps for Implementation

Phase 2 should implement:
1. Project loader (read project.yaml)
2. Agent loader (read agent.yaml and compose from tools/skills)
3. Filesystem runtime (execute agents, save runs/threads/artifacts)
4. Manifest validator (ensure all references resolve)

This establishes projects as first-class filesystem packages.
