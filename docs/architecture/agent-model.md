# Agent Model

## Core Distinction

The platform needs a strict three-tier boundary:

- `Agent` owns reasoning.
- `Skill` owns domain workflow.
- `Tool` owns execution.

If that boundary collapses, the platform becomes hard to govern, debug, and compose.

## Agent Responsibilities

- interpret goals
- decide task sequencing
- choose which skills to invoke
- synthesize outputs and updates
- post messages to threads
- request clarification or escalation when needed

## Skill Responsibilities

- apply domain-specific workflow logic
- choose which tools to invoke within its scope
- enforce guardrails and formatting rules
- shape intermediate and final results for the agent

## Tool Responsibilities

- perform a bounded operation
- accept explicit inputs
- return structured outputs
- operate within a defined permission boundary

## Agent Shape

```ts
interface AgentDefinition {
  key: string;
  name: string;
  purpose: string;
  allowedSkillKeys: string[];
  outputRoles: string[];
  policies: Record<string, unknown>;
}
```

## Skill Shape

```ts
interface SkillDefinition {
  key: string;
  name: string;
  purpose: string;
  allowedToolKeys: string[];
  inputContract: Record<string, unknown>;
  outputContract: Record<string, unknown>;
  guardrails?: string[];
  formattingRules?: string[];
  workflowHints?: string[];
}
```

## Tool Shape

```ts
interface ToolDefinition {
  key: string;
  name: string;
  purpose: string;
  category: "knowledge" | "action" | "workflow" | "custom";
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  sideEffects: string[];
  permissionClass: string;
}
```

## Example

```json
{
  "agent": {
    "key": "research",
    "name": "Research Agent",
    "allowedSkillKeys": ["research-analysis", "source-synthesis"]
  }
}
```

The research agent decides what to investigate and which skill best fits the current goal.

A skill then applies domain behavior such as:

- source selection
- ranking and summarization strategy
- confidence thresholds
- output formatting rules

The individual tools execute concrete operations such as:

- search a source
- retrieve a document
- extract entities
- summarize a set of results
- call an external system

## Visual Reference

- [Agent - Skill - Tool Hierarchy](../../images/architecture/derived/agent-skill-tool-hierarchy.svg)

## Multi-Agent Coordination

Agents should collaborate through explicit objects:

- tasks
- output sections
- knowledge source bundles
- review requests
- runs

Avoid hidden coordination through long implicit prompts.

## Recommended Initial Roles

- `research`
- `analyst`
- `risk`
- `editor`
- `coordinator`

These are platform-friendly roles because they recur across workspace types.

## Open Questions

- When does an agent become a workflow policy instead of a distinct role?
- Which workflow packages deserve first-class skills?
- How should agent memory be represented: per workspace, per work item, per thread, or per run?
- Which agent actions require human approval before tool execution?

## Microsoft References

- [Microsoft Build 2026: Be yourself at work](https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/)
- [Agents hub](https://learn.microsoft.com/en-us/agents/)
- [Threads, runs, and messages in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/threads-runs-messages)
- [What are tools in Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog)
- [Custom engine agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-custom-engine-agent)
- [Skill Model](skill-model.md)
- [Microsoft References](resources.md)
