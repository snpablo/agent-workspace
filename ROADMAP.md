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
- [Workspace Composition Model](docs/architecture/workspace-composition-model.md)
- [Agent Model](docs/architecture/agent-model.md)
- [Skill Model](docs/architecture/skill-model.md)

## What Is Completed

- core model objects are defined and documented
- shared platform terminology is in place
- the `Agent -> Skill -> Tool` hierarchy is explicit
- primary-output and cross-workspace reference rules are documented
- shared workspace visual system rules are documented
- manual object-to-panel mappings exist for the current workspace originals
- architecture visuals exist for:
  - decision workspace
  - partner workspace
  - HR workspace
  - finance workspace
  - agent-skill-tool hierarchy
- initial ADRs exist for the most important architecture decisions

References:

- [ADR Index](docs/adr/README.md)
- [Workspace Visual System](docs/architecture/workspace-visual-system.md)
- [Workspace Object-Panel Mapping](docs/architecture/workspace-object-panel-mapping.md)

At the moment, the remaining work is concentrated in:

- output refinement
- workspace composition refinement
- agent, skill, and tool boundary refinement
- additional vertical pressure-testing

## What Should Happen Next

Recommended next sequence:

1. tighten output guidance
   - tighten output-splitting rules
   - define when an output is rendered as a Page versus another output experience
2. refine workspace composition guidance
   - settle run-history visibility
   - clarify cross-workspace queue behavior and right-rail conventions
   - keep the manual object-to-panel mapping aligned as visuals evolve
3. refine agent, skill, and tool guidance
   - decide what deserves a first-class skill
   - decide whether skill changes imply run boundaries
4. pressure-test more verticals
   - strengthen skill-selection configuration in the verticals
   - confirm the shared shell continues to hold across additional workspace families
5. capture any durable decisions as ADRs

## Where To Look

For architecture:

- [docs/architecture/index.md](docs/architecture/index.md)
- [docs/architecture/workspace-object-panel-mapping.md](docs/architecture/workspace-object-panel-mapping.md)

For decisions and tradeoffs:

- [docs/adr/README.md](docs/adr/README.md)

For repo-level guidance to future agents:

- [AGENTS.md](AGENTS.md)
