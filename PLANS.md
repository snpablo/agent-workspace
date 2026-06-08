# Execution Plans

This repository uses `exec-plans/` for structured execution plans.

The intent is similar to OpenAI-style execution plans: a plan should define what we intend to do, why it matters, how we will know it is complete, and what order we expect to tackle the work in.

## Directory Layout

```text
exec-plans/
  README.md
  templates/
    exec-plan-template.md
  active/
  completed/
```

## Naming

Plan files should use numeric prefixes so the intended sequence is easy to scan.

Examples:

- `01-model-objects.md`
- `02-output-architecture.md`
- `03-workspace-architecture.md`
- `04-agent-skill-tool-architecture.md`
- `05-first-vertical.md`

The numbers express intended order, not rigid dependency. It is acceptable to skip a number or add a new plan between existing ones with a wider prefix strategy if needed later.

## What Belongs In A Plan

Each plan should capture:

- objective
- scope
- outputs or deliverables
- dependencies or prerequisites
- open questions
- completion criteria

Use concise prose. A plan is not a meeting transcript.

## Relationship To Other Folders

- `docs/architecture/` explains what the system is
- `docs/adr/` records durable architecture decisions
- `docs/internal/` holds internal notes and prep material
- `exec-plans/` holds what we plan to do in this repository

When a plan resolves a non-trivial architecture question:

1. update the affected `docs/architecture/` documents
2. create or update an ADR in `docs/adr/` if the decision has lasting tradeoffs

## Lifecycle

- active plans live in `exec-plans/active/`
- completed plans move to `exec-plans/completed/`
- reusable format guidance lives in `exec-plans/templates/`
