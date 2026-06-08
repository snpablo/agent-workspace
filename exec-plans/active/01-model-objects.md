# 01 Model Objects

## Objective

Define the core platform nouns and make their boundaries explicit using Microsoft-aligned terminology.

## Why It Matters

If the core object model is vague or mislabeled, every later workspace, output, and agent design becomes harder to reason about.

This is the equivalent of the original domain-discovery day: identify the nouns, define ownership, and clarify lifecycle before implementation decisions start pulling the model around.

## Scope

- workspace
- work item
- output
- agent
- skill
- tool
- knowledge source
- action
- task
- thread
- message
- run

## Deliverables

- a stable domain model doc
- relationship sketches
- boundary rules
- open questions requiring later validation
- ownership and lifecycle notes for the core objects

## Dependencies

- Microsoft terminology alignment
- references to Foundry, Microsoft 365 Copilot, Loop, and Build framing

## Open Questions

- which capabilities deserve first-class skills instead of embedded workflow policy?

## Completion Criteria

- the domain model doc exists and uses Microsoft terms consistently
- core relationships are defined
- obvious term conflicts are removed
- persistence-boundary decisions are documented
- primary-output and cross-workspace-reference rules are documented
