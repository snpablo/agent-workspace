# Vocabulary Transition Guide

This document explains the transition from custom platform vocabulary to industry-standard agent terminology.

## Why the Change

The platform's original vocabulary ("Workspace", "WorkItem", "Playbook", "Definition/Instance") was custom-designed but created friction:

- Unfamiliar to people who work with agent frameworks (LangGraph, AutoGen, etc.)
- Required explaining concepts that have standard names in the industry
- Made integration with other systems harder
- Added unnecessary cognitive overhead

The new vocabulary aligns with how the AI/agent platform industry already discusses these concepts.

## Complete Vocabulary Mapping

### Organizing & Configuration

| Old | New | Reason |
|-----|-----|--------|
| `Workspace` | `Project` | Standard term for execution context; "Workspace" implies UI/IDE, not suitable for headless systems |
| `WorkspaceDefinition` | `ProjectDefinition` | Follows from Workspace → Project |
| `WorkspaceInstance` | `Project` (runtime) | Simplified; definitions and instances are just configurations and running systems |
| `Capability` | `Tool` or `Skill` | Industry standard; Tool = external, Skill = composed |
| `Integration` | `Tool` | Integrations ARE tools that connect to external systems |
| `Workflow` | `Agent` + `Schedule` | More specific; explicit about what's performing work (Agent) and what triggers it (Schedule) |
| `Playbook` | `ScheduleDefinition` + `AgentDefinition` | Playbooks describe automation; broken into trigger (Schedule) and executor (Agent) |
| `Definition/Instance` | `Definition` and `Run` | Simpler; Tool/Skill/Agent are definitions; Run is what happens when they execute |
| `WorkItem` | (removed) | Ambiguous; use Agent + Run instead. Agents perform work; Runs record it. |
| `Queue` | (removed) | Not a first-class concept in agent systems; use Schedules or Channels for triggers |
| `Action` | (removed/generalized) | Covered by Run (what happened) and Thread (discussion about it) |
| `Knowledge Source` | `Resource` | More general; covers documents, configs, credentials, any context |
| `Session` | `Thread` | More concrete; threads are conversations; agents and humans participate in them |

### Execution & Outcomes

| Old | New | Reason |
|-----|-----|--------|
| `Run` | `Run` | Kept; already standard in agent platforms |
| `Event` | `Event` | Kept; standard for activity records |
| `ArtifactDefinition/Instance` | `Artifact` (with `type` and `version`) | Simplified; definitions are just type definitions in Project config |
| `Output` | `Artifact` | Standard term; "Output" is too vague |
| `Thread` | `Thread` | Kept; standard for conversations |
| `Participant` | (removed) | Implicit; Agents and Humans both participate in Threads and Projects |

### Removed/Deprecated Concepts

| Old Term | Reason for Removal | Alternative |
|----------|-------------------|------------|
| `Workspace` + `WorkItem` | Too abstract; conflates organizing context (Workspace) with work units (WorkItem) | Use `Project` for context; `Agent` for who does work; `Run` for recording it |
| `Playbook` + `Definition/Instance` | Double abstraction; unclear relationship | Use Agent definition (template) and Run (execution) |
| `Definition/Instance` pattern | Verbose; creates naming clutter (ArtifactDefinition vs ArtifactInstance) | Tool/Skill/Agent are definitions; Projects configure them; Runs execute them |
| `Capability` | Vague; could mean Tool, Skill, or Action | Use Tool (external) or Skill (composed) |
| `ComponentBinding` | UI-specific; not a platform concept | Direct reference in Project to Tools/Skills/Agents |
| `Zone`/`Binding` | UI implementation detail | Not a platform concept; implementation detail of shell |

## Code Examples: Old vs New

### Old Approach (Workspace-centric)

```typescript
// Old vocabulary
const workspace = {
  workspaceId: 'decision-v1',
  workspaceType: 'decision',
  workItems: [
    { workItemId: 'item-1', title: 'Analyze decision', status: 'open' }
  ],
  artifacts: [
    { artifactId: 'analysis-1', type: 'decision-analysis', version: 1 }
  ]
};

// Playbooks define workflows
const playbook = {
  playbookId: 'decision-review',
  activities: [
    { activityId: 'gather', type: 'GatherInfo' },
    { activityId: 'analyze', type: 'AnalyzeOptions' }
  ]
};

// Execution is implicit through playbook invocation
const execution = executePlaybook(playbook, workspace);
```

### New Approach (Agent-centric)

```typescript
// New vocabulary
const project = {
  projectId: 'decision-v1',
  agents: [
    {
      agentId: 'decision-analyzer',
      instructions: 'Analyze decision options...',
      tools: ['info-gatherer', 'analyst'],
      skills: []
    }
  ],
  tools: [
    { toolId: 'info-gatherer', endpoint: '/api/search' },
    { toolId: 'analyst', type: 'function', implementation: analyzeOptions }
  ],
  schedules: [
    { scheduleId: 'daily-review', trigger: 'cron(0 9 * * *)', agentId: 'decision-analyzer' }
  ],
  artifactTypes: [
    { type: 'decision-analysis', schema: {...} }
  ]
};

// Execution is explicit through Agent
const run = await agent.execute({
  projectId: project.projectId,
  input: { decision: 'Where should we invest?' }
});

// Run produces Artifact
const artifact = await getArtifact(run.artifacts[0]);
```

## Migration Path for Existing Code

### Phase 1: Conceptual Alignment (Documentation Only)

1. Read AGENTS.md (new vocabulary)
2. Read this document
3. Understand the mapping
4. Do NOT change code yet

### Phase 2: Type System Update

1. Create new types alongside old types (with deprecation warnings)
2. Add converters from old types to new types
3. Update interpreter to accept both old and new

### Phase 3: Code Migration

1. Update schemas to use new vocabulary
2. Update type definitions
3. Update implementations
4. Update tests and examples

### Phase 4: Cleanup

1. Remove deprecated types
2. Remove old code paths
3. Consolidate implementations

## Benefits of the New Vocabulary

### For Users

- **Less friction**: Familiar terminology from other agent frameworks
- **Clearer concepts**: Tool vs Skill vs Agent are distinct
- **Less custom learning**: Can apply knowledge from other platforms

### For Developers

- **Standards alignment**: Easier to integrate with LangGraph, AutoGen, etc.
- **Better naming**: Tool, Skill, Agent map to standard concepts in AI
- **Simpler mental model**: Agent executes (Run), creates Artifact, discusses in Thread

### For the Platform

- **More extensible**: Community understands the model
- **Better positioning**: Aligns with how enterprise AI platforms work
- **Easier hiring**: Engineers familiar with agent frameworks need less training

## Tool Model Clarification

### Tools Are First-Class

Tools are a first-class platform concept. Agents have Tools.

What backs a Tool is **not platform vocabulary**:

| Backing Mechanism | Status | Why |
|---|---|---|
| API endpoints | Implementation detail | Not platform root; use Tool |
| Connectors | Implementation detail | Not platform root; use Tool |
| MCP servers | Implementation detail | Not platform root; use Tool |
| Native code | Implementation detail | Not platform root; use Tool |
| Platform services | Implementation detail | Not platform root; use Tool |

### What NOT to Use as Platform Vocabulary

These are implementation mechanisms, not concepts:

- ❌ `Connector` (→ use `Tool`)
- ❌ `MCPServer` (→ use `Tool`)
- ❌ `Provider` (not a platform concept)
- ❌ `Integration` (→ use `Tool`)
- ❌ `APIAdapter` (not a platform concept)
- ❌ `WebhookReceiver` (→ use `Tool`)
- ❌ `Endpoint` (implementation detail of Tool)

### Examples: Tool Backing is Transparent

```yaml
# All of these are Tools from Agent perspective
tools:
  - search-api-tool      # Backed by HTTP API
  - database-query-tool  # Backed by database connector
  - mcp-document-tool    # Backed by MCP server
  - calc-tool            # Backed by native Python function
  - artifact-tool        # Backed by platform service
```

From the Agent's perspective: "I invoke Tool X with these inputs, I get these outputs."

How Tool X works (HTTP, MCP, connector, code, service) is the platform's concern, not the Agent's.

## Terminology Examples

### Example 1: Decision Analysis

**Old Way:**
```
Workspace: "Decision Analysis"
  → WorkItem: "Evaluate options for Q3 strategy"
  → Playbook: "Decision Review"
    → Activity: "Gather Information" (using Capability/Integration)
    → Activity: "Analyze Options"
  → Artifact: "Decision Analysis" (created during Playbook execution)
```

**New Way:**
```
Project: "Decision Analysis"
  → Agent: "Decision Analyzer"
    → Uses Tool: "Information Gatherer" (search, documents)
    → Uses Skill: "Option Analysis" (composes Tools)
  → Schedule: "Daily Review" (runs agent daily)
  → Artifact Type: "Decision Analysis" (output of Agent)
```

### Example 2: Partner Renewal

**Old Way:**
```
Workspace: "Partner Operations"
  → WorkItem: "ABC Corp Renewal" (renewal opportunity)
  → Playbook: "Renewal Review" (multi-step process)
    → Activity: "Analyze Account" (Capability)
    → Activity: "Build Proposal" (Capability)
  → Artifact: "Renewal Analysis" (output)
```

**New Way:**
```
Project: "Partner Operations"
  → Agent: "Renewal Specialist"
    → Uses Tool: "CRM API" (account data)
    → Uses Skill: "Financial Analysis" (composes multiple Tools)
  → Schedule: "Renewal Check" (triggers for upcoming renewals)
  → Artifact Type: "Renewal Analysis"
```

## Questions & Answers

### Q: Will old code still work?

A: During migration, we'll support both old and new vocabulary through normalization. After migration (Phase 4), only new vocabulary is supported.

### Q: Do I need to update my Projects/Artifacts now?

A: No. During Phase 2-3, there will be migration tools to convert old to new format.

### Q: What about existing integrations?

A: Tool is a better term than "Integration". During Phase 2, we'll provide converters so existing integrations work with new APIs.

### Q: Is this a breaking change?

A: Yes, but it happens in phases. Phase 1-2 support both old and new. Phase 3-4 require new vocabulary.

### Q: Why "Project" instead of "Workspace"?

A: "Workspace" implies UI/IDE. "Project" is more neutral and widely used in AI platforms (Anthropic's Anthropic Playground is a project, LangGraph works with projects, etc.)

## See Also

- [AGENTS.md](AGENTS.md) - Complete model with new vocabulary
- [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) - Frozen decisions
- [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md) - Implementation requirements
