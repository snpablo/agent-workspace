# @awp/runtime

Project-centric runtime for Agent Platform.

Manages project execution, state, and collaboration. **Project is the primary container** for all agents, resources, artifacts, threads, runs, and canonical runtime events.

## Core Concept

**Project is not a container for UI.**

Project is the **runtime execution context** that owns:

- **Agents** - Autonomous actors that perform work
- **Runs** - Execution records of tools, skills, agents
- **Artifacts** - Durable outcomes created by execution
- **Threads** - Conversations and collaboration
- **Resources** - Context data available to agents
- **Schedules** - Automated execution triggers
- **Participants** - Humans and agents collaborating
- **Events** - Canonical history of what happened

## Canonical Rule

The runtime records what happened as events, then derives what is true now as projections.

In practice:

- `events` are the source of truth
- `artifacts`, `threads`, `runs`, `participants`, and `agentSessions` are current-state projections
- `artifacts` remain durable outputs
- `threads` remain the human-readable collaboration layer

## Architecture

### ProjectRuntime

Central runtime class managing project execution.

```typescript
const runtime = new ProjectRuntime(registry);

// Initialize project
const context = await runtime.initializeProject({
  project,
  participants: [user1, user2],
  resources: [doc1, doc2],
});

// Execute runs
const result = await runtime.executeRun(projectId, {
  targetKind: 'agent',
  targetId: 'analyzer',
  triggeredBy: 'user-001',
  input: { task: 'Analyze decision' },
});

// Create artifacts
const artifact = await runtime.createArtifact(projectId, artifact);

// Create threads
const thread = await runtime.createThread(projectId, thread);

// Manage participants
runtime.addParticipant(projectId, participant);

// View statistics
const stats = runtime.getProjectStats(projectId);
```

### ProjectContext

Runtime state container for a project. Event history is canonical; the mutable collections are query-friendly projections.

```typescript
interface ProjectContext {
  // Configuration
  project: Project;

  // Execution actors
  agents: AgentInstance[];
  schedules: ScheduleInstance[];

  // Canonical history
  events: Event[];

  // Current projections
  artifacts: Map<string, ArtifactRecord>;
  threads: Map<string, ThreadRecord>;
  runs: Map<string, Run>;

  // Participants and context
  resources: Resource[];
  participants: Map<string, Participant>;
  agentSessions: Map<string, AgentSession>;

  metadata?: Record<string, any>;
}
```

## Execution Model

### Runs

Runs represent execution of tools, skills, agents, or schedules. They are projected from canonical run events.

```typescript
const result = await runtime.executeRun(projectId, {
  targetKind: 'tool' | 'skill' | 'agent' | 'schedule',
  targetId: 'my-tool',
  triggeredBy: 'user-001',
  input: { query: 'search term' },
  threadId: 'thread-001', // Optional: associate with thread
});

// Result contains:
result.run              // The run record
result.success          // Whether execution succeeded
result.error            // Error message if failed
result.artifactsCreated // Artifact IDs created
result.events           // Events emitted
```

### Agent Execution

Agents are loaded and kept in memory.

```typescript
const context = runtime.getProjectContext(projectId);

// Agents are resolved with their tools and skills
for (const agentInstance of context.agents) {
  agentInstance.agent      // Agent definition
  agentInstance.tools      // Resolved Tool objects
  agentInstance.skills     // Resolved Skill objects
  agentInstance.status     // 'idle' | 'running' | 'failed' | etc.
  agentInstance.session    // Optional: AgentSession
}
```

### Artifacts

Artifacts are versioned, collaborative outcomes. Their current shape is derived from events, while the artifact itself remains a durable work product.

```typescript
const artifact = await runtime.createArtifact(projectId, {
  id: 'decision-analysis-001',
  type: 'decision-analysis',
  title: 'Strategic Analysis',
  content: { decision: '...', options: [...] },
  createdBy: 'agent-001',
});

// Artifacts have:
artifact.status      // 'draft' | 'active' | 'archived'
artifact.version     // Incremental version number
artifact.createdAt   // ISO timestamp
artifact.updatedAt   // ISO timestamp

// Full version history maintained
const record = context.artifacts.get(artifactId);
record.versions      // All versions
record.editors       // All participants who edited
record.lastModified  // Last change time
```

### Threads

Threads enable collaboration and discussion. They explain human intent, requests, approvals, and handoffs in a readable form.

```typescript
const thread = await runtime.createThread(projectId, {
  id: 'thread-001',
  status: 'active',
  targetKind: 'artifact',   // Can reference artifacts, runs, or project
  targetId: 'artifact-001',
  participants: ['user-001', 'agent-001'],
  messages: [],
});

// Threads track:
thread.messageCount        // Number of messages
thread.lastMessageAt       // When last message added
thread.participants        // All participants
```

## Usage

### Initialize Project

```typescript
import { ProjectRuntime } from '@awp/runtime';
import { PackageRegistry } from '@awp/loader';

const registry = new PackageRegistry(packages);
const runtime = new ProjectRuntime(registry);

const project = registry.get('my-project');

const context = await runtime.initializeProject({
  project,
  participants: [
    { id: 'user-1', type: 'human', role: 'owner', ... }
  ],
  resources: [
    { id: 'doc-1', type: 'document', ... }
  ],
});
```

### Persist Project State

The runtime ships with both in-memory and file-backed repositories. File reload prefers replaying persisted events into projections rather than trusting stored projection maps blindly.

```typescript
import { FileProjectRepository } from '@awp/runtime';

const repository = new FileProjectRepository('./data/projects');
await repository.save(context);

const restored = await repository.load(project.id);
```

### Execute Tool

```typescript
const result = await runtime.executeRun(projectId, {
  targetKind: 'tool',
  targetId: 'search-tool',
  triggeredBy: 'user-001',
  input: { query: 'market analysis' },
});

if (result.success) {
  console.log('Result:', result.run.output);
} else {
  console.error('Failed:', result.error);
}
```

### Execute Agent

```typescript
const result = await runtime.executeRun(projectId, {
  targetKind: 'agent',
  targetId: 'decision-analyzer',
  triggeredBy: 'user-001',
  input: { task: 'Analyze strategic options' },
  threadId: 'discussion-001', // Link to thread
});

// Agent executes with access to:
// - All tools defined in agent package
// - All skills defined in agent package
// - All resources in project
// - Project-level context and participants
```

### Create Artifact

```typescript
const artifact = await runtime.createArtifact(projectId, {
  id: 'analysis-001',
  projectId,
  type: 'decision-analysis',
  status: 'draft',
  title: 'Strategic Analysis',
  content: {
    decision: 'Market expansion',
    options: ['Option A', 'Option B', 'Option C'],
    recommendation: 'Option B',
    reasoning: '...',
  },
  createdBy: 'agent-analyzer',
});

// Artifact is automatically:
// - Stored with full version history
// - Indexed for search
// - Added to events
// - Available for reference in threads
```

### Create Thread

```typescript
const thread = await runtime.createThread(projectId, {
  id: 'discussion-001',
  projectId,
  status: 'active',
  targetKind: 'artifact',
  targetId: 'analysis-001',
  messages: [],
  createdBy: 'user-001',
  participants: ['user-001'],
});

// Thread can now be:
// - Referenced in runs
// - Updated with messages
// - Closed when discussion ends
// - Archived with project
```

## Event System

All activity emits events.

```typescript
// Events are automatically emitted:
const context = runtime.getProjectContext(projectId);

context.events.forEach(event => {
  event.id          // Unique ID
  event.name        // 'run.started', 'artifact.created', etc.
  event.timestamp   // ISO timestamp
  event.projectId   // Which project
  event.runId       // If related to run
  event.artifactId  // If related to artifact
  event.threadId    // If related to thread
  event.payload     // Event-specific data
});

// Event names:
// - run.started, run.succeeded, run.failed
// - artifact.created, artifact.updated
// - thread.created, thread.closed
// - participant.joined
// - resource.added
// - schedule.executed
```

## Persistence

### In-Memory Repository

```typescript
import { InMemoryProjectRepository } from '@awp/runtime';

const repo = new InMemoryProjectRepository();

// Save project state
await repo.save(context);

// Load project state
const loaded = await repo.load(projectId);

// List all projects
const projectIds = await repo.list();

// Delete project
await repo.delete(projectId);
```

### File-Based Repository

```typescript
import { FileProjectRepository } from '@awp/runtime';

const repo = new FileProjectRepository('./projects');

// Same API as InMemoryProjectRepository
// Persists to JSON files on disk
```

## Statistics

```typescript
const stats = runtime.getProjectStats(projectId);

stats.projectId           // Project ID
stats.agentCount          // Number of agents loaded
stats.resourceCount       // Number of resources available
stats.artifactCount       // Number of artifacts created
stats.threadCount         // Number of threads
stats.runCount            // Number of runs executed
stats.participantCount    // Number of participants
stats.eventCount          // Total events emitted
stats.scheduleCount       // Number of schedules
```

## What's Not Here

**This is NOT:**

- ❌ A UI component system
- ❌ A persistence system (repositories are pluggable)
- ❌ An authentication system
- ❌ An actual agent executor (uses mock execution)
- ❌ A message queue system

**What IS included:**

- ✅ Project context management
- ✅ Run execution (tools, skills, agents, schedules)
- ✅ Artifact creation and versioning
- ✅ Thread management
- ✅ Event emission and tracking
- ✅ Participant management
- ✅ Resource availability
- ✅ Statistics and reporting

## Integration

### With @awp/loader

```typescript
import { PackageLoader, PackageRegistry } from '@awp/loader';

const loader = new PackageLoader({ rootPath: './project' });
const discovery = await loader.discover();
const registry = new PackageRegistry(discovery.packages);

const runtime = new ProjectRuntime(registry);
```

### With @awp/interpreter (Future)

```typescript
import { PlatformInterpreter } from '@awp/interpreter';

const interpreter = new PlatformInterpreter();
const config = interpreter.interpret(project);

// Use config in runtime
```

### With @awp/shell (Future)

```typescript
import { ProjectShell } from '@awp/shell';

const shell = new ProjectShell(runtime);

// Render project UI
shell.render(projectId);
```

## Example

See [examples/project-execution.ts](examples/project-execution.ts) for a complete working example.

```bash
npm run build
node dist/examples/project-execution.js
```

## Testing

```bash
npm test
```

Tests cover:
- Project initialization
- Run execution (tools, skills, agents)
- Artifact creation and versioning
- Thread creation and management
- Participant management
- Event emission
- Statistics

## Performance

- **Initialize project:** O(agents + resources)
- **Execute run:** O(target complexity)
- **Create artifact:** O(1)
- **Query statistics:** O(1)
- **List events:** O(events)

Typical 100-agent project initializes in <50ms.

## License

Apache 2.0
