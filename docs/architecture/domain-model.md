# Domain Model

## Goal

Define the core nouns of the platform and give each one a clear ownership boundary and lifecycle using Microsoft-aligned agent terminology.

## Core Objects

### Workspace

The collaboration boundary in which work happens.

Owns:

- work item context
- members
- tasks
- threads
- outputs
- agent activity
- actions

Lifecycle:

- created
- active
- archived

### Work Item

The real-world unit of business work the workspace is organized around.

Examples:

- acquisition evaluation
- partner renewal
- support escalation
- implementation project
- incident investigation

Owns:

- business identity and metadata
- linked outputs
- linked tasks
- linked actions
- domain-specific status

Lifecycle:

- opened
- active
- pending_decision
- completed
- archived

### Output

The durable result produced in the workspace.

Examples:

- decision report
- renewal analysis
- proposal draft
- outreach draft
- project plan

Owns:

- sections
- conclusions or recommendations
- linked knowledge sources
- linked actions
- versions

Lifecycle:

- draft
- in_review
- approved
- published
- superseded
- archived

### Agent

A configurable orchestration component that interprets goals, decides what work to perform, and invokes skills.

Owns:

- instructions and policies
- task assignment
- output contributions
- skill selection history
- tool invocation history

Lifecycle:

- registered
- available
- active
- paused
- retired

### Skill

A reusable domain workflow layer that packages instructions, guardrails, sequencing, and output-shaping logic above one or more tools.

Owns:

- domain workflow rules
- tool selection rules
- safety and formatting guardrails
- reusable expertise for a class of work

Lifecycle:

- registered
- enabled
- disabled
- deprecated

### Tool

A bounded capability used by a skill to access knowledge, take action, or automate one narrow workflow step.

Owns:

- input contract
- execution method
- output contract
- permission boundary

Lifecycle:

- registered
- enabled
- disabled
- deprecated

### Knowledge Source

Grounding material that supports claims, conclusions, and actions.

Owns:

- source reference
- source type
- summary
- provenance
- citations or excerpts

Lifecycle:

- collected
- linked
- verified
- stale
- rejected

### Action

A proposed or executable next step that follows from the current workspace state.

Owns:

- action type
- target
- status
- assignee
- audit trail

Lifecycle:

- proposed
- approved
- queued
- executed
- failed
- canceled

### Task

A unit of work assigned to a user or agent.

Owns:

- objective
- assignee
- dependencies
- outputs
- status

Lifecycle:

- created
- ready
- in_progress
- blocked
- completed
- abandoned

### Thread

The interaction session between users and agents.

Owns:

- messages
- participants
- references to work items, outputs, and knowledge sources

Lifecycle:

- open
- active
- closed

### Message

An individual communication item in a thread.

Owns:

- author
- content
- attachments
- timestamps

Lifecycle:

- created
- delivered
- superseded

### Run

An execution of an agent over a thread.

Owns:

- agent reference
- skill references
- thread reference
- tool calls
- status
- produced outputs and actions

Lifecycle:

- queued
- in_progress
- completed
- failed
- waiting_for_input
- canceled

## Relationship Sketch

```text
Workspace
  |- Work Item
  |- Outputs
  |- Tasks
  |- Threads
  |- Actions
  |- Agent Activity

Work Item
  |- Business Context
  |- Outputs
  |- Tasks
  |- Actions

Thread
  |- Messages
  |- Runs

Output
  |- Sections
  |- Knowledge Source Links
  |- Action Links
  |- Version History

Agent
  |- uses Skills
  |- works on Tasks
  |- contributes to Outputs
  |- executes Runs

Skill
  |- uses Tools
  |- shapes Outputs
```

## Persistence Decisions

The platform should not give every visible concept its own persistence boundary by default.

First-class persisted objects:

- `Workspace`
- `Work Item`
- `Output`
- `Agent` definition
- `Skill` definition
- `Tool` definition
- `Knowledge Source`
- `Action`
- `Task`
- `Thread`
- `Message`
- `Run`

Derived or projected concepts:

- `Agent Activity` should usually be a projection over runs, tasks, actions, and messages rather than its own primary persistence root.
- UI regions such as `Knowledge Panel`, `Run History`, or `Task Queue` are views over persisted objects, not separate domain objects.

## Boundary Rules

- A `Workspace` is not an `Output`.
- A `Work Item` is not an `Output`, though it may own one or more outputs.
- A `Thread` is not the durable output.
- An `Agent` is not a `Skill`.
- A `Skill` is not a `Tool`.
- A `Run` is not the same thing as a `Thread`; it is an execution over a thread.
- A `Knowledge Source` does not become truth by being collected; it needs provenance and review.
- An `Action` is distinct from a `Task`: actions are business next steps, while tasks are work units.
- Cross-workspace references are links, not transfers of ownership.

## Cross-Workspace Reference Rules

Cross-workspace references are allowed, but they should follow strict ownership rules:

1. A persisted object has one owning workspace.
2. Cross-workspace use should happen through references, not shared mutable ownership.
3. Referenced outputs should be treated as read-only in the non-owning workspace unless an explicit copy or fork is created.
4. References should preserve provenance back to the owning workspace and work item.
5. Actions and tasks remain local to the workspace that creates them, even if they are informed by referenced objects.

## Primary Output Rule

Not every workspace needs a primary output at creation time.

The rule should be:

- a workspace may begin without a primary output during intake, discovery, or setup
- once active collaborative work is underway, the workspace should either:
  - designate a primary output, or
  - explicitly declare itself `outputless` by type or mode

In practice, most decision and operations workspaces should end up with a primary output.

## Open Questions

- Does every workspace require exactly one primary work item?
- Should tasks attach directly to output sections, or only to outputs at the top level?
- Which capabilities deserve first-class `Skill` objects rather than embedded workflow policy?

## Microsoft References

- [Agents hub](https://learn.microsoft.com/en-us/agents/)
- [Threads, runs, and messages in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/threads-runs-messages)
- [Set up your environment for Azure AI Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-services/agents/environment-setup)
- [View agent activity in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-agent-365/observe-agents-microsoft-365-copilot)
- [Microsoft References](resources.md)
