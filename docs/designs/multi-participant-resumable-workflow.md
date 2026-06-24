# Multi-Participant Resumable Workflow

This note describes a concrete runtime pattern for long-lived collaboration involving multiple humans and agents.

It does not add any new top-level architecture concepts. It uses the existing Architecture V3 model:

- `Project` as the shared durable workspace
- `Participant` as the humans and agents involved
- `Thread` as the coordination surface
- `Artifact` as the evolving work product
- `Run` as one bounded execution slice
- `Event` as the wake-up signal and audit trail
- `AgentSession` as resumable agent context
- `Schedule` and `Channel` as external triggers

## Why This Pattern Matters

Single-turn interactions are easy to model as one request and one response.

Real work is different:

- one human starts the work
- an agent produces a draft
- another human adds missing context later
- a reviewer requests changes days after that
- the same or a different agent resumes from the updated state

The system therefore needs to behave like a shared, long-lived project rather than a stateless function call.

## Concrete Scenario

Use this scenario as the default reference pattern:

- `Human A` creates a project request
- `Agent A` drafts an artifact
- `Human B` adds required missing input
- `Human C` reviews and requests changes
- `Agent A` resumes and revises the artifact

Example domains:

- hiring packet review
- partner contract review
- decision memo drafting
- financial variance analysis

## Core Rule

The source of truth lives in the project's canonical event history, not in any single participant's memory.

That means:

- the canonical history lives in `Event`
- the latest work product is projected into `Artifact`
- collaboration history is projected into `Thread`
- execution slices are projected into `Run`
- resumable agent context is projected into `AgentSession`

## Recommended Lifecycle

### 1. Initial Request

`Human A` starts work in a `Project`.

Expected records:

- create or reference a `Thread`
- create an initial `Artifact` or artifact placeholder
- create an `AgentSession` for the assigned agent
- emit an event such as `thread.created` or `artifact.created`

### 2. First Agent Pass

`Agent A` runs for one bounded slice of work.

Expected records:

- create a `Run`
- update the `Artifact`
- add a `Thread` message summarizing progress
- update `AgentSession.context`
- emit `run.started`, `artifact.updated`, and `run.succeeded`

If the agent is blocked on input, it should stop cleanly instead of looping.

### 3. Waiting On Human Input

The system enters a dormant state.

The agent is not "done." It is waiting.

Recommended persisted state:

- `AgentSession.status = 'idle'`
- `AgentSession.context.waitingFor = ['participant-id']`
- `AgentSession.context.blockedOn = 'artifact-input' | 'approval' | 'resource-update'`
- `Thread.metadata.nextActionOwner = 'participant-id'`
- `Thread.metadata.nextActionType = 'provide-input' | 'review' | 'approve'`

At this point, no active compute should be running.

### 4. Another Participant Updates State

`Human B` or `Human C` returns hours, days, or weeks later and updates the project.

Possible actions:

- add a message to the `Thread`
- update a `Resource`
- revise the `Artifact`
- approve or reject the current draft

Each action emits an `Event`.

### 5. Event-Based Resume

The runtime matches the new event to the relevant dormant work.

Recommended matching inputs:

- thread participation
- artifact dependency
- waiting-on participant list
- schedule subscriptions
- event name and target object

If the event satisfies the agent's blocked condition:

- reload `Project` state
- reload the relevant `AgentSession`
- create a new `Run`
- resume from `AgentSession.context`

### 6. Repeat Until Completion

The loop continues until:

- the `Artifact` reaches a terminal useful state
- the required reviewers approve
- the work is explicitly archived or closed

The important point is that the project survives changing participants and long gaps in time.

## Runtime Implications

### Shared State Must Be Canonical

Do not rely on in-memory conversational context as the main source of truth.

Important state must be recoverable by replaying persisted events into runtime projections:

- `Artifact`
- `Thread`
- `Run`
- `Event`
- `AgentSession`

### Dormancy Must Be Explicit

Dormancy is not just "nothing is happening."

It should be represented as a known waiting condition:

- waiting for a specific participant
- waiting for any reviewer
- waiting for a resource change
- waiting for schedule time
- waiting for another agent output

### Resume Must Be Event-Driven

Agents should not poll continuously.

They should wake only when:

- a matching `Event` occurs
- a `Schedule` triggers
- a `Channel` delivers new input

### Runs Should Stay Bounded

Each `Run` should do one coherent slice of work and then stop.

That keeps the system:

- auditable
- resumable
- less fragile across long delays
- safer for human-in-the-loop workflows

## Suggested Metadata Conventions

These are implementation conventions, not new concepts.

### AgentSession Context

Suggested fields inside `AgentSession.context`:

```yaml
waitingFor:
  - human-b
blockedOn: reviewer-input
watchedThreadIds:
  - thread-001
watchedArtifactIds:
  - artifact-001
resumeWhen:
  eventNames:
    - thread.message_added
    - artifact.updated
  participantIds:
    - human-b
    - human-c
progress:
  stage: draft-revision
  checklist:
    - gather missing facts
    - revise recommendation
    - request approval
```

### Thread Metadata

Suggested fields inside `Thread.metadata`:

```yaml
nextActionOwner: human-b
nextActionType: provide-input
artifactId: artifact-001
reviewState: waiting-for-input
```

### Run Metadata

Suggested fields inside `Run.metadata`:

```yaml
resumedFromSessionId: session-001
resumeReason: artifact.updated
stopReason: waiting-for-reviewer
handoffTo:
  - human-c
```

## Example Event Flow

```text
Human A creates thread
  -> event: thread.created
  -> schedule/router assigns Agent A

Agent A drafts artifact
  -> event: run.started
  -> event: artifact.updated
  -> event: run.succeeded
  -> session enters waiting-for-input

Human B adds missing data three days later
  -> event: thread.message_added
  -> dormant session matches event
  -> Agent A resumes in new run

Agent A revises artifact
  -> event: artifact.updated
  -> event: run.succeeded
  -> handoff to Human C

Human C approves one week later
  -> event: artifact.approved
  -> final run or closure event
```

## Minimum Runtime Features Needed

To support this pattern well, the runtime should prioritize:

1. Durable `Project` persistence
2. Persisted `AgentSession` context
3. Participant-aware `Thread` and `Artifact` updates
4. Event routing from project changes to dormant sessions
5. Conflict-aware artifact updates with version checks
6. Explicit stop and resume reasons on `Run`

## First Implementation Slice

The first useful end-to-end slice should be:

1. Create an `AgentSession` attached to a project
2. Let an agent set a waiting condition in session context
3. Persist that session with the project
4. Emit an event when another participant updates the watched thread or artifact
5. Match that event to the dormant session
6. Resume the agent in a fresh `Run`

That slice is small enough to implement incrementally and strong enough to prove the collaboration model.

## Relationship To Evaluation

Evaluation remains separate from this loop.

Core execution flow:

- wake on event
- load state
- run bounded work
- persist changes
- return to dormancy

Optional evaluation flow:

- inspect artifact/run history
- score quality or policy compliance
- record evaluation results separately

This keeps runtime collaboration and quality assessment decoupled.
