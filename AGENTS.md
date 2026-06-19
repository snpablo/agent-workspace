# AGENTS.md

This file is the starting context for future AI coding agents working in this repository.

Assume no prior project knowledge.

Read this file first.

## Platform Thesis

Agents perform work in Projects.
Tools and Skills enable agent capabilities.
Artifacts preserve outcomes.
Humans and agents collaborate through shared Threads and Runs.
Schedules trigger work.
Resources provide context.

## Architectural Principles

- Project-centric (organizing context)
- Artifact-centric (preserving outcomes)
- Agent-driven (explicit execution actors)
- Tool-oriented (connecting to capabilities)
- Durable collaboration (versioned, auditable)
- Industry-standard vocabulary (Agent, Tool, Skill, Run, Thread)
- Generic platform over domain-specific implementations

## Filesystem-First Package Structure

The platform is organized around filesystem-first declarative packages.

### Project Package

A Project is a directory with a `project.yaml` file at the root:

```
my-project/
  project.yaml                    # Project metadata and configuration
  agents/                         # Agent definitions
    decision-analyzer/
      agent.yaml
      tools/
      skills/
  resources/                      # Shared context data
    guidelines.md
    company-policy.yaml
  artifacts/                      # Output types and examples
    decision-analysis/
      schema.json
  threads/                        # Discussion/collaboration archives
  runs/                           # Execution history
  schedules/                      # Automated triggers
    daily-review.yaml
```

### Agent Package

An Agent is a directory with an `agent.yaml` file at the root:

```
agents/decision-analyzer/
  agent.yaml                      # Agent definition, instructions, configuration
  tools/                          # Tool definitions available to this Agent
    search-tool.yaml
    analysis-tool.yaml
  skills/                         # Skill definitions (compose Tools)
    financial-analysis.yaml
  channels/                       # Communication interfaces
    slack.yaml
    email.yaml
  schedules/                      # Triggers for this Agent
    daily-analysis.yaml
  evals/                          # Evaluation definitions
    output-quality.yaml
  sandbox/                        # Execution environment config
    resources.yaml
    constraints.yaml
```

### Tool and Skill Packages

Tools and Skills follow the same pattern:

```
agents/decision-analyzer/
  tools/
    search/
      tool.yaml                   # Tool definition and configuration
  skills/
    financial-analysis/
      skill.yaml                  # Skill definition, instructions
      tools/                      # References to tools used
        tool-reference.yaml
```

### YAML Structure Principles

- All instructions go in the YAML file under an `instructions` field
- No separate .md files for instructions
- YAML is the single source of truth for each package
- Files are organized by type and relationship
- Directories group related definitions

Example `project.yaml`:

```yaml
project:
  id: decision-analysis-v1
  name: Decision Analysis Project
  version: 1

agents:
  - name: decision-analyzer
    path: agents/decision-analyzer
    
resources:
  - name: company-guidelines
    path: resources/company-policy.yaml
    
artifact_types:
  - type: decision-analysis
    schema: artifacts/decision-analysis/schema.json
    
permissions:
  - role: analyst
    can: ['run_agents', 'review_artifacts']
```

Example `agent.yaml`:

```yaml
agent:
  id: decision-analyzer-v1
  name: Decision Analyzer
  type: autonomous
  version: 1

instructions: |
  You are an expert decision analyst.
  Your role is to evaluate strategic decisions.
  
  Process:
  1. Gather context from available resources
  2. Analyze options using financial and strategic tools
  3. Produce a structured decision analysis
  
  Be thorough and cite sources for all claims.

tools:
  - name: search-tool
    path: tools/search-tool.yaml
  - name: analysis-tool
    path: tools/analysis-tool.yaml

skills:
  - name: financial-analysis
    path: skills/financial-analysis.yaml

constraints:
  max_iterations: 10
  timeout: 300
  sandbox:
    path: sandbox/resources.yaml
```

## Core Model

### Top-Level Nouns

- **Project** - Organizing container for context, participants, and work
- **Agent** - Autonomous or semi-autonomous actor performing work
- **Tool** - Interface to external capabilities, APIs, or functions
- **Skill** - Reusable know-how composed from Tools or other Skills
- **Channel** - Message send/receive point (email, Slack, HTTP, etc.)
- **Schedule** - Trigger definition for automated work
- **Artifact** - Durable output with versioning and provenance
- **Thread** - Conversation or discussion context
- **Run** - Execution record (Agent action, tool invocation, skill execution)
- **Resource** - Context data for Agents (documents, configs, credentials)
- **Sandbox** - Isolated execution environment for Agents
- **Eval** - Evaluation or assessment of outputs

### Relationships

```text
Project
  ├─ Agents (perform work in the project)
  ├─ Tools (available to agents)
  ├─ Skills (available to agents)
  ├─ Schedules (trigger work)
  ├─ Channels (receive/send)
  ├─ Resources (provide context)
  ├─ Artifacts (preserve outcomes)
  ├─ Runs (execution history)
  ├─ Threads (collaboration history)
  └─ Participants (humans and agents)

Agent
  ├─ uses Tools
  ├─ uses Skills
  ├─ creates Runs
  ├─ creates Artifacts
  ├─ participates in Threads
  └─ accesses Resources

Tool
  └─ exposes capability (API, function, external service)

Skill
  ├─ uses Tools
  ├─ uses other Skills
  └─ defines know-how

Run
  ├─ Agent executing
  ├─ invokes Tools
  ├─ invokes Skills
  └─ produces Artifacts or updates Resources

Thread
  ├─ message history
  ├─ Agents and Humans participating
  └─ may link to Artifacts or Runs
```

## Canonical Vocabulary

### Durable Outcome

Canonical term: **Artifact**

Artifacts are versioned, timestamped, and auditable.

### Execution Record

Canonical term: **Run**

Runs record what happened, who did it, and what was produced.

### Execution Actor

Canonical term: **Agent**

Agents are explicit first-class actors (human or autonomous).

### Reusable Capability

Canonical terms: **Tool** (external), **Skill** (composed)

Tools connect to external capabilities.
Skills compose Tools and other Skills into reusable know-how.

## Architecture

```text
Project (organizing context)
    ↓
Agent (performs work)
    ↓
Tools + Skills (enable capabilities)
    ↓
Run (execution record)
    ↓
Artifacts + Threads (outcomes + collaboration)
```

The key architectural boundary is:

```text
Tool/Skill Definition
    ↓
Agent Invocation
    ↓
Run (execution + effects)
```

One generic platform supports many project types and use cases.

## Project Interface

Projects expose these to participants:

- **Channels** - Where work is requested or reported
- **Artifacts** - What was produced
- **Runs** - How it was done (audit trail)
- **Threads** - Discussion and context
- **Resources** - Shared context data
- **Schedules** - Automated triggers

## Constraints

Do not introduce new platform root concepts without explicit approval.

Prefer specialization over new abstractions.

Do not hard-code vertical-specific behavior:

- Decision-making Projects
- Partner management Projects
- HR/Finance Projects

These are Projects with different Agents, Tools, Skills, and Artifact types.

Vertical language should live in:

- Tool configurations
- Skill definitions
- Agent instructions
- Artifact schemas
- Channel integrations

and not in platform foundations.

## Implementation Order

1. Schemas (Tool, Skill, Artifact, Run, Agent, Project)
2. Types (TypeScript interfaces for all concepts)
3. Interpreters (transform definitions to executable)
4. Runtime (execute Agents, Runs, manage state)
5. SDK (client library for Agents)
6. Shell UI (render Projects and collaboration)
7. Tool integrations (connect external capabilities)
8. Reference implementations (example Projects)

If work is ambiguous, prefer progress in this order.

## Working Rules

Treat the following as architectural source of truth:

- `README.md`
- `ARCHITECTURE_FREEZE.md`
- `IMPLEMENTATION_CONTRACT.md`
- `SCHEMA_INVENTORY.md`
- `docs/`
- `schemas/`

Keep the platform domain-neutral.

Keep Agent execution explicit and observable.

Keep Artifacts first-class and durable.

Capture reusable platform concepts before introducing project-specific language.

## Design Heuristics

When deciding whether something belongs in the platform:

1. Does it apply across multiple project types?
2. Does it have a distinct lifecycle (creation, execution, completion)?
3. Does it require separate persistence?
4. Does it require separate permissions?
5. Does it require distinct UI treatment?

Keep a concept out of the platform core when it is primarily:

- project-specific vocabulary
- agent-specific behavior
- tool-specific integration
- temporary implementation detail
- view or presentation concern

## Current Intent

The vocabulary is being aligned with industry standard agent platform patterns.

The architecture emphasizes:
- Agents as first-class execution actors
- Tools and Skills as capability composition
- Artifacts as durable, versioned outcomes
- Runs as observable execution records
- Projects as organizing containers (not custom "Workspace" terminology)

The immediate goal is to implement the core model using industry-standard vocabulary that aligns with how agents and autonomous systems are discussed across platforms.

This makes the platform:
- More accessible to people familiar with agent frameworks
- Less custom jargon to learn
- Easier to integrate with other systems
- More aligned with emerging standards
