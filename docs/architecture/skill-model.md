# Skill Model

## Purpose

A skill is the reusable domain-expert layer between an `Agent` and a `Tool`.

In the platform hierarchy:

- `Agent` is the orchestrator
- `Skill` is the domain workflow layer
- `Tool` is the atomic execution layer

## Why Skill Exists

Without `Skill`, the architecture tends to flatten:

- orchestration
- domain behavior
- atomic execution

into a single layer.

That makes reuse harder and blurs the difference between:

- reasoning about a business goal
- applying a packaged workflow
- executing a narrow callable capability

## Responsibilities

A skill may own:

- domain-specific instructions
- workflow sequencing
- tool selection rules
- safety guardrails
- output shaping
- step-level validation

A skill should not own:

- top-level user or session orchestration
- general workspace coordination across multiple goals
- raw atomic execution contracts

## Examples

Examples of skills:

- renewal analysis
- support triage
- financial audit
- acquisition risk review
- proposal drafting

Examples of tools a skill may use:

- CRM lookup
- document search
- SQL query runner
- pricing calculator
- email draft action
- MCP action

## Shape

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

## Relationship To Agents And Tools

```text
Agent
  |- selects Skill
  |- evaluates progress
  |- coordinates Tasks, Threads, Runs, and Outputs

Skill
  |- applies domain workflow
  |- chooses or sequences Tools within its scope
  |- shapes intermediate and final results

Tool
  |- performs one bounded callable operation
```

## Design Rules

1. A skill should be reusable across multiple work items of the same general kind.
2. A skill may call multiple tools.
3. A tool should not need awareness of the business goal.
4. An agent may switch skills as the overall task evolves.
5. Skills should be the main place for packaged workflow expertise.

## Open Questions

- Which skills should be first-class objects versus embedded workflow policy?
- Can one run span multiple skills, or should skill changes create explicit run boundaries?
- How should skill-level memory differ from agent-level memory?

## Microsoft References

- [Custom engine agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-custom-engine-agent)
- [What are tools in Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog)
- [Microsoft References](resources.md)
