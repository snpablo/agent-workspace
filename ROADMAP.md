# Roadmap

This document is the fastest way for a future agent to understand:

- the current architecture shape
- what has already been completed
- what remains to do next
- where to look for deeper detail

## Current Architecture State

The platform currently centers on:

- `Workspace` as the collaboration boundary
- `Work Item` as the business case in motion
- `Output` as the durable result
- `Thread`, `Message`, and `Run` as interaction and execution objects
- `Knowledge Source` as grounding
- `Action` and `Task` as workflow objects
- `Agent -> Skill -> Tool` as the capability hierarchy

Core references:

- [Architecture Index](docs/architecture/index.md)
- [Domain Model](docs/architecture/domain-model.md)
- [Agent Model](docs/architecture/agent-model.md)
- [Skill Model](docs/architecture/skill-model.md)

## What Is Completed

- core model objects are defined and documented
- Microsoft-aligned terminology is in place
- the `Agent -> Skill -> Tool` hierarchy is explicit
- primary-output and cross-workspace reference rules are documented
- architecture visuals exist for:
  - decision workspace
  - partner workspace
  - agent-skill-tool hierarchy
- initial ADRs exist for the most important architecture decisions

References:

- [Execution Plan Index](exec-plans/index.md)
- [ADR Index](docs/adr/README.md)

## What Is Active Now

The active plan set is tracked in:

- [Execution Plan Index](exec-plans/index.md)

At the moment, the remaining work is concentrated in:

- `02-output-architecture.md`
- `03-workspace-architecture.md`
- `04-agent-skill-tool-architecture.md`
- `05-first-vertical.md`

## What Should Happen Next

Recommended next sequence:

1. finish `02-output-architecture.md`
   - tighten output-splitting rules
   - define when an output is rendered as a Page versus another output experience
2. finish `03-workspace-architecture.md`
   - settle run-history visibility
   - clarify cross-workspace queue behavior
3. finish `04-agent-skill-tool-architecture.md`
   - decide what deserves a first-class skill
   - decide whether skill changes imply run boundaries
4. advance `05-first-vertical.md`
   - pressure-test the model further with the first vertical
   - strengthen skill-selection configuration in the vertical
5. capture any durable decisions as ADRs

## Where To Look

For architecture:

- [docs/architecture/index.md](docs/architecture/index.md)

For decisions and tradeoffs:

- [docs/adr/README.md](docs/adr/README.md)

For plan status and next work:

- [exec-plans/index.md](exec-plans/index.md)
- [PLANS.md](PLANS.md)

For repo-level guidance to future agents:

- [AGENTS.md](AGENTS.md)
