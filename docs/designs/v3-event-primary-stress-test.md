# V3 Event-Primary Stress Test

This note started as a practical test for a recurring architecture question:

Should the platform remain `Project`-centric with events as supporting runtime records, or should it evolve toward an event-primary architecture where canonical state is derived from an event log?

For long-running human-in-the-loop work, the answer is now clear enough to guide implementation:

- the platform remains `Project`-centric as the execution boundary
- the runtime becomes event-primary for canonical history
- current workspace state is maintained as projections
- artifacts remain durable outputs
- threads remain the human-readable collaboration layer

## The Question

Two plausible models exist:

### Model A: V2 Project-Centric Runtime

- `Project` owns the durable shared state
- `Artifact`, `Thread`, `Run`, and `AgentSession` are stored directly
- `Event` acts as audit trail and wake-up signal
- replay is helpful, but optional

### Model B: Event-Primary Runtime

- the append-only `Event` log is the canonical source of truth
- `Artifact`, `Thread`, `Run`, and `AgentSession` are projections
- replay is a normal recovery mechanism
- routing and subscriptions become central runtime behavior

The repo does not need to answer this philosophically. It needs to answer it operationally.

## Stress-Test Standard

Ask the same question of each major runtime object:

Is this object stored directly, or is it really a projection over events?

Apply that question to:

- `Artifact`
- `Thread`
- `Run`
- `AgentSession`
- project-level participant and resource state

If most answers become "projection," V3 is probably warranted.

If most answers remain "stored directly," V2 still holds.

## Scenario Drill

Use this scenario:

1. Human A creates a thread
2. Agent A runs and drafts an artifact
3. Human B joins later and adds missing input
4. The project is persisted
5. The runtime process disappears
6. The system must recover and continue work

Now ask two recovery questions.

### Recovery Test 1: State-First Recovery

Can the system recover by loading persisted project state directly?

Expected signs:

- artifacts load with current content
- threads load with participants and messages
- runs remain queryable
- sessions know what they were waiting for
- events remain available for audit and wake-up logic

If yes, V2 remains strong.

### Recovery Test 2: Event-Only Recovery

Can the system recover the same state only from the event stream?

Expected signs:

- artifacts can be rebuilt with current content
- threads can be rebuilt with participants and messages
- sessions can be rebuilt with waiting conditions
- no separate canonical project-state snapshot is required

If yes, event-primary architecture is becoming natural.

If not, events are still supporting records rather than the primary model.

## Hiring Workflow Pressure Test

Hiring work makes the need obvious:

1. A recruiter opens a candidate packet
2. A sourcing or research agent drafts initial findings
3. A hiring manager reviews later
4. A coordinator requests changes
5. The agent resumes and revises
6. An approver signs off

That sequence is not well described as plain CRUD. It is a history of:

- attempts
- reviews
- handoffs
- revisions
- approvals
- resumptions
- failures and retries

The canonical truth therefore needs to be the event log.

## What The Runtime Should Now Do

The runtime should:

1. record rich canonical events for runs, artifacts, threads, human actions, and resumable agent state
2. rebuild current state from those events after restart
3. keep query-friendly projections for UI and operational reads
4. preserve artifacts as durable outputs rather than reducing them to raw event inspection
5. use threads/comments to explain intent in human terms rather than forcing operators to read event payloads directly

## Practical Conclusion

The clean model is:

- **Events** are the source of truth
- **Current state** is a projection
- **Artifacts** are durable outputs
- **Threads/comments** explain human intent
- **Runs** are execution trace

The key architectural phrase is:

> The system records what happened as events, then derives what is true now as projections.
