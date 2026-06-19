# ADR-007: Channels and Schedules as First-Class Concepts

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Agent systems need:
- **Output routing:** Send results to users, systems, applications
- **Automation triggers:** Run work on schedules, events, conditions

These can be:
- Hardcoded in agent logic
- Runtime configuration
- First-class platform concepts

Treating them as first-class has implications for:
- Composability (can agents share channels?)
- Discoverability (can you see all channels?)
- Reusability (can you reference channels from multiple agents?)
- Configuration management (how are they versioned?)

## Decision

**Channels and Schedules are first-class concepts, defined as packages.**

### Channel

A communication interface that agents and runs can send output to:

```yaml
kind: channel
id: slack-notifications
name: Slack Notifications
version: 1.0.0

type: slack
description: Send notifications to Slack workspace

config:
  workspace_id: T123456
  channel: "#analysis"
  auth:
    type: oauth
    token_env: SLACK_BOT_TOKEN
```

Channel types:
- **slack** - Slack workspace messaging
- **email** - Email notifications
- **http** - HTTP webhooks
- **webhook** - Generic webhooks

Agents can reference channels:

```yaml
kind: agent
id: decision-analyzer

channels:
  - id: slack-notifications
  - id: email-alerts
```

### Schedule

An automation trigger that runs agents on a schedule:

```yaml
kind: schedule
id: daily-analysis
name: Daily Analysis
version: 1.0.0

type: cron
description: Run analysis every day at 9 AM

trigger:
  expression: "0 9 * * *"
  timezone: "America/New_York"

action:
  agentId: decision-analyzer
  input:
    task: Daily strategic analysis

channels:
  - id: slack-notifications
```

Schedule types:
- **cron** - Time-based (cron expressions)
- **event** - Event-driven triggers
- **manual** - Manual trigger only

## Consequences

### Positive - Channel
- **Composable:** Multiple agents can use same channel
- **Discoverable:** Can see all channels in project
- **Reusable:** Channel config in one place
- **Decoupled:** Agents don't hardcode channel config
- **Versioned:** Channel config is version controlled
- **Testable:** Can mock channels in tests

### Positive - Schedule
- **Declarative:** Automation defined in YAML, not code
- **Discoverable:** Can see all automations in project
- **Manageable:** Enable/disable schedules without code change
- **Auditable:** Schedule executions are runs (full audit trail)
- **Reusable:** Multiple agents can share same schedule
- **Observable:** When did last execution happen?

### Negative
- **Extra complexity:** More types to understand
- **Configuration management:** Channel credentials need secure storage
- **Coordination:** Multiple channels create branching logic

---

## Alternatives Considered

1. **Channels and Schedules only in agent definition**
   - Rejected: Not reusable across agents
   - Rejected: Can't see all channels in project
   - Rejected: Configuration duplication

2. **Channels and Schedules in runtime configuration only**
   - Rejected: Not version controlled
   - Rejected: Not discoverable alongside code
   - Rejected: Harder to reason about agent capabilities

3. **Channels as infrastructure (outside platform)**
   - Rejected: Agents still need to reference them
   - Rejected: No way to know which channels exist

4. **Schedules only as special agents**
   - Rejected: Schedules are trigger rules, not actors
   - Rejected: Different semantics confuses model

---

## Schedule Scope Clarification

**Schedules are project-level, not agent-level.**

- Schedules are defined at `project/schedules/` level
- Multiple agents can reference the same schedule
- Agent schedules (if agent-specific) are rare and should be modeled as project schedules
- This avoids duplication and keeps scheduling logic centralized and discoverable

**Example: Multiple agents using same schedule**

```yaml
# project/schedules/daily-reports.yaml
kind: schedule
id: daily-reports
action:
  agents:
    - id: financial-reporter    # Multiple agents triggered by same schedule
    - id: operations-reporter
  input:
    task: Generate daily report
```

Each agent executes independently but uses the same trigger logic.

## Channel Use Cases

1. **Notifications:** Send run results to Slack/email
2. **Webhooks:** Notify external systems of completions
3. **Audit:** Send events to compliance systems
4. **Integration:** Route results to downstream systems
5. **Publishing:** Publish artifacts to internal wikis

## Schedule Use Cases

1. **Daily reports:** Generate daily analysis
2. **Periodic review:** Review and approve decisions
3. **Event-driven:** React to external events
4. **Manual trigger:** Run on-demand via UI
5. **Conditional:** Run when conditions met

---

## Not Included: Advanced Routing

Out of scope for v1:
- Complex routing rules (if/then/else)
- Channel selection at runtime
- Dynamic channel creation
- Message transformation pipelines

These can be built with Channels + Schedules + Skills.

---

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (project owns channels/schedules)
- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) (channels/schedules are packages)
- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md)

## References

- [ARCHITECTURE_V2.md - Core Vocabulary](../ARCHITECTURE_V2.md#core-vocabulary)
- [AGENT_PACKAGE_MODEL.md - Channels and Schedules](../../../AGENT_PACKAGE_MODEL.md#channel-packages-channels)
