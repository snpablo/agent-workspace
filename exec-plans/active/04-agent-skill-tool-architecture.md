# 04 Agent, Skill, And Tool Architecture

## Objective

Define the three-tier separation between reasoning components, packaged domain workflow, and bounded execution capabilities.

## Why It Matters

This is the boundary that keeps the platform governable, composable, and understandable.

This restores the original intent of the agent-and-skill architecture day while preserving Microsoft’s `Tool` term at the execution layer.

## Scope

- agent responsibilities
- skill responsibilities
- tool responsibilities
- runtime interactions with threads, messages, and runs
- coordination between multiple agents

## Deliverables

- agent model doc
- skill model doc
- tool definition shape
- examples of initial agent roles
- explicit separation between orchestration, domain workflow, and execution responsibilities

## Dependencies

- domain model
- Microsoft Foundry runtime terms
- Microsoft 365 and Copilot Studio skill patterns

## Open Questions

- what should count as memory?
- which domain capabilities deserve first-class skills?
- which actions require approval before tool execution?
- when does a policy stop being an agent?

## Completion Criteria

- the agent/skill/tool hierarchy is explicit
- the docs consistently distinguish `Skill` from `Tool`
- runtime objects are connected to agent behavior
