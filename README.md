# Agent Workspace Platform

This repository is an architecture baseline for an agent-driven workspace platform using Microsoft-aligned terminology updated against Microsoft Build announcements from **June 2, 2026** and current Microsoft documentation reviewed on **June 8, 2026**.

The core idea is:

- people work inside a `Workspace`
- work is organized around a `Work Item`
- agents reason, plan, and coordinate
- skills package domain expertise and workflow logic
- tools execute bounded capabilities
- threads, messages, and runs drive interaction
- the system produces durable `Outputs`
- outputs are grounded in `Knowledge Sources`
- actions and tasks move work forward

This is intentionally not a single-purpose decision application. The goal is to define a platform that can express decision work, research, planning, and operational workflows using Microsoft-familiar agent terms.

## Core Thesis

The durable thing the user keeps is not the chat transcript and not the raw model response. It is the output.

Models will change. Agent implementations will change. Skills and tools will change. The output is the unit the user reviews, edits, shares, approves, exports, and acts on.

The architecture docs explain the model. The ADRs explain why the durable architecture decisions were made.

## Platform Objects

- `Workspace`: the collaboration boundary
- `Work Item`: the business case or object under active work
- `Output`: the durable result produced in the workspace
- `Agent`: the reasoning and orchestration component
- `Skill`: a reusable domain workflow package
- `Tool`: a bounded capability invoked by a skill
- `Knowledge Source`: grounding and supporting source material
- `Action`: a proposed or executable next step
- `Task`: a tracked unit of work
- `Thread`: the interaction session
- `Message`: an item within a thread
- `Run`: an execution of an agent over a thread

## Repo Structure

```text
docs/
  index.md
  architecture/
    index.md
    domain-model.md
    workspace-model.md
    work-item-model.md
    output-model.md
    agent-model.md
    skill-model.md
    knowledge-source-model.md
    action-model.md
    ui-domain-mapping.md
    resources.md
  adr/
  internal/
verticals/
  decision-workspace.md
  partner-workspace.md
exec-plans/
  README.md
  active/
  completed/
  templates/
PLANS.md
AGENTS.md
README.md
```

## Documents

- [Roadmap](ROADMAP.md)
- [Docs Index](docs/index.md)
- [Architecture Index](docs/architecture/index.md)
- [Domain Model](docs/architecture/domain-model.md)
- [Workspace Model](docs/architecture/workspace-model.md)
- [Work Item Model](docs/architecture/work-item-model.md)
- [Output Model](docs/architecture/output-model.md)
- [Agent Model](docs/architecture/agent-model.md)
- [Skill Model](docs/architecture/skill-model.md)
- [Knowledge Source Model](docs/architecture/knowledge-source-model.md)
- [Action Model](docs/architecture/action-model.md)
- [Decision Workspace](verticals/decision-workspace.md)
- [Partner Workspace](verticals/partner-workspace.md)
- [Execution Plan Guide](PLANS.md)
- [Exec Plans](exec-plans/README.md)
- [Execution Plan Index](exec-plans/index.md)

## Principles

1. `Output` is the center of the durable user experience.
2. `Work Item` gives the workspace its business context.
3. `Agent`, `Skill`, and `Tool` are distinct concepts.
4. `Thread`, `Message`, and `Run` are first-class runtime concepts.
5. `Knowledge Source` should be first-class, not implied.
6. Industry-specific language should be configuration where possible.

## Current State

This repo is architecture-first. It does not yet commit to:

- implementation framework
- database schema
- hosting platform
- authentication strategy
- UI framework

Those choices should follow the domain model, not lead it.
