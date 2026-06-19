# Persistence and Storage Review

**Date:** June 19, 2026
**Status:** 🔍 REVIEW COMPLETE - Alignment with Phase 2 Architecture

## Executive Summary

The current persistence model is based on Phase 1 Definition/Instance patterns that no longer fit Phase 2 architecture. A systematic cleanup and realignment is needed to support Project-centric execution.

**Current State:** ❌ Misaligned
**Target State:** ✅ Project-centric with clean separation of concerns

---

## Current Persistence Architecture

### Existing Schemas

Located in `packages/schemas/`:

**Old UI-Oriented (Remove):**
- ❌ workspace-definition.schema.json (Zones, Bindings - UI layout)
- ❌ workspace-instance.schema.json (UI state)
- ❌ component-tree.schema.json (UI component tree)

**Old Definition/Instance Split (Remove):**
- ❌ artifact-definition.schema.json (Definition)
- ❌ artifact-instance.schema.json (Instance with workspaceId, workItemId)
- ❌ playbook-definition.schema.json (Definition)
- ❌ playbook-instance.schema.json (Instance)
- ❌ agent-definition.schema.json (Package version, should be YAML)
- ❌ agent-session.schema.json (Old session model)

**Old Concepts (Remove/Replace):**
- ❌ work-item.schema.json (Replaced by Run + Agent)
- ❌ workspace-state.schema.json (Replaced by ProjectContext)
- ❌ action.schema.json (Replaced by Run/Artifact)

**Keep (Realign):**
- ✅ event.schema.json (Audit trail - keep, update)
- ✅ participant.schema.json (Keep, align with Phase 2)
- ✅ thread.schema.json (Keep, update for new model)
- ✅ run.schema.json (Keep, update for new model)
- ✅ skill-definition.schema.json (Keep as Package)
- ✅ tool-definition.schema.json (Keep as Package)

**Deprecated (Soft):**
- 🟡 knowledge-source.schema.json (Renamed to Resource)
- 🟡 permissions.schema.json (Not yet Phase 2 aligned)
- 🟡 policies.schema.json (Not yet Phase 2 aligned)

### Current Repository Implementation

**packages/runtime/src/repository.ts:**

```typescript
class InMemoryProjectRepository
  - save(context: ProjectContext): Promise<void>
  - load(projectId: string): Promise<ProjectContext | undefined>
  - delete(projectId: string): Promise<void>
  - list(): Promise<string[]>

class FileProjectRepository (stub only)
  - Same interface, not implemented
```

**Issues:**
- InMemoryProjectRepository works for testing
- FileProjectRepository is a stub with no real implementation
- No real database implementation
- No transaction support
- No versioning support
- No query API

### Current Builders

**packages/definitions/src/builders.ts:**

```
WorkspaceDefinitionBuilder - ❌ REMOVE (UI-only concept)
ArtifactDefinitionBuilder - 🟡 REFACTOR (now package-based)
PlaybookDefinitionBuilder - ❌ REMOVE (replaced by Agent + Schedule)
AgentDefinitionBuilder - 🟡 REFACTOR (packages are YAML)
SkillDefinitionBuilder - 🟡 REFACTOR (packages are YAML)
ToolDefinitionBuilder - 🟡 REFACTOR (packages are YAML)
```

---

## Phase 2 Persistence Model

### Concepts and Storage

#### 1. Project

**What It Is:** Execution context container

**Phase 1:** None (WorkspaceInstance)
**Phase 2:** First-class persistence concept

**Storage Model:**
```
projects/
  {projectId}/
    project.json           # Project metadata
```

**Schema:**
```typescript
interface ProjectSnapshot {
  // Identity
  id: string;
  name: string;
  version: string;
  
  // Metadata
  description?: string;
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
  createdBy: string;        // User/system ID
  
  // Configuration
  agents: { id: string }[];         // Agent references
  resources: { id: string }[];      // Resource references
  schedules: { id: string }[];      // Schedule references
  
  // Status
  status: 'active' | 'archived' | 'deleted';
  
  // Metadata for extensibility
  metadata?: Record<string, any>;
}
```

**Storage Guarantees:**
- Immutable project definition (versioned)
- Mutable project status
- All changes logged in events

#### 2. Agent

**What It Is:** Filesystem package defining capability

**Phase 1:** AgentDefinition (with separate runtime session)
**Phase 2:** Filesystem package + runtime loading

**Storage Model:**
```
agents/
  {agentId}/
    agent.yaml                    # Package definition
    tools/
      tool-id.yaml
    skills/
      skill-id.yaml
    channels/
      channel-id.yaml
    schedules/
      schedule-id.yaml
    sandbox/
      sandbox.yaml
    evals/
      eval-id.yaml
```

**Not Persisted Separately:**
- AgentSession is now ephemeral (created during run execution)
- No separate "definition" file (agent.yaml is it)
- No "instance" concept

**Schema (agent.yaml):**
```typescript
interface AgentPackage {
  kind: 'agent';
  id: string;
  name: string;
  version: string;
  
  description?: string;
  model?: string;
  role?: string;
  instructions?: string;
  
  agents?: Array<{ id: string }>;
  tools?: Array<{ id: string }>;
  skills?: Array<{ id: string }>;
  channels?: Array<{ id: string }>;
  schedules?: Array<{ id: string }>;
  
  metadata?: Record<string, any>;
}
```

#### 3. Run

**What It Is:** Execution record

**Phase 1:** WorkItem (queue) + Activity (in playbook)
**Phase 2:** Unified Run model

**Storage Model:**
```
projects/
  {projectId}/
    runs/
      {runId}.json                # Immutable execution record
```

**Schema:**
```typescript
interface RunRecord {
  // Identity
  id: string;
  projectId: string;
  
  // Execution target
  targetKind: 'tool' | 'skill' | 'agent' | 'schedule';
  targetId: string;
  
  // Execution context
  triggeredBy: string;            // User/system ID
  input?: Record<string, any>;
  
  // Results
  status: 'started' | 'succeeded' | 'failed' | 'cancelled';
  output?: Record<string, any>;
  error?: string;
  
  // Timing
  startedAt: string;              // ISO datetime
  completedAt?: string;           // ISO datetime
  durationMs?: number;
  
  // Context
  threadId?: string;              // If part of thread
  artifactIds?: string[];         // Artifacts created
  
  // Metadata
  metadata?: Record<string, any>;
}
```

**Persistence Guarantees:**
- Immutable (no updates after completion)
- Indexed by projectId
- Complete audit trail

#### 4. Artifact

**What It Is:** Versioned outcome

**Phase 1:** ArtifactDefinition + ArtifactInstance (split)
**Phase 2:** Single unified model with automatic versioning

**Storage Model:**
```
projects/
  {projectId}/
    artifacts/
      {artifactId}.json           # Current version + history
```

**Schema:**
```typescript
interface ArtifactRecord {
  // Identity
  id: string;
  projectId: string;
  type: string;                   // e.g., 'analysis', 'document'
  
  // Current state
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'active' | 'archived';
  
  // Version tracking
  version: number;                // Current version
  versions: Array<{
    version: number;
    content: Record<string, any>;
    status: 'draft' | 'active' | 'archived';
    createdAt: string;
    createdBy: string;
  }>;
  
  // Collaboration
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  editors: string[];              // Users who edited
  
  // References
  runId?: string;                 // If created by run
  threadId?: string;              // If discussed in thread
  
  // Metadata
  metadata?: Record<string, any>;
}
```

**Persistence Guarantees:**
- Version history immutable (append-only)
- No Definition/Instance split
- Automatic versioning on updates

#### 5. Thread

**What It Is:** Collaboration context

**Phase 1:** Implicit in workspace
**Phase 2:** First-class persistence concept

**Storage Model:**
```
projects/
  {projectId}/
    threads/
      {threadId}.json             # Thread definition + state
      {threadId}/
        messages/
          {messageId}.json        # Immutable messages
```

**Schema:**
```typescript
interface ThreadRecord {
  // Identity
  id: string;
  projectId: string;
  
  // Status
  status: 'active' | 'closed' | 'archived';
  
  // Context
  targetKind?: 'artifact' | 'run' | 'agent';
  targetId?: string;              // Artifact/Run/Agent ID
  
  // Participants
  createdAt: string;
  createdBy: string;
  participants: Array<{
    id: string;                   // User/Agent ID
    joinedAt: string;
  }>;
  
  // Messages
  messageCount: number;
  lastMessageAt?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

interface MessageRecord {
  id: string;
  threadId: string;
  projectId: string;
  
  authorId: string;               // User/Agent ID
  authorType: 'human' | 'agent';
  
  content: string;
  attachments?: string[];         // Artifact IDs
  
  createdAt: string;
  
  // Immutable
  metadata?: Record<string, any>;
}
```

**Persistence Guarantees:**
- Threads mutable until closed
- Messages immutable (append-only)
- Audit trail via createdAt/createdBy

#### 6. Resource

**What It Is:** Shared context data

**Phase 1:** KnowledgeSource (renamed)
**Phase 2:** Aligned with Project resources

**Storage Model:**
```
projects/
  {projectId}/
    resources/
      {resourceId}.json           # Immutable resource
```

**Schema:**
```typescript
interface ResourceRecord {
  // Identity
  id: string;
  projectId: string;
  name: string;
  type: string;                   // 'document', 'data', 'config', etc.
  
  // Content
  content: Record<string, any>;
  schema?: Record<string, any>;   // Optional schema
  
  // Metadata
  createdAt: string;
  createdBy: string;
  
  // Status
  status: 'active' | 'archived';
  
  // Access
  accessLevel: 'public' | 'private' | 'restricted';
  
  // Reference
  metadata?: Record<string, any>;
}
```

**Persistence Guarantees:**
- Immutable (create new version for changes)
- Versioning via resourceId-v{version}
- Access control metadata stored

#### 7. Schedule

**What It Is:** Automation trigger

**Phase 1:** Part of Playbook (implicit)
**Phase 2:** Filesystem package as first-class

**Storage Model:**
```
agents/
  {agentId}/
    schedules/
      {scheduleId}.yaml           # Schedule definition (YAML)

projects/
  {projectId}/
    schedule-executions/
      {scheduleId}.json           # Execution history
```

**Schema:**
```typescript
interface ScheduleExecution {
  // Identity
  id: string;                     // Auto-generated
  projectId: string;
  scheduleId: string;
  
  // Execution
  triggeredAt: string;            // When triggered
  executedAt?: string;            // When started
  completedAt?: string;           // When finished
  
  // Result
  status: 'scheduled' | 'running' | 'succeeded' | 'failed';
  runId?: string;                 // Associated Run
  error?: string;
  
  // Next execution
  nextExecutionAt?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}
```

**Persistence Guarantees:**
- Schedule definition immutable (in packages)
- Execution history append-only
- Audit trail via timestamps

---

## Schemas to Remove

### 1. UI-Related (Delete Completely)

**Files:**
- ❌ workspace-definition.schema.json
- ❌ workspace-instance.schema.json  
- ❌ component-tree.schema.json

**Reason:** UI layout is not runtime concern; handled by shell layer

**Impact:**
- Builders affected: WorkspaceDefinitionBuilder
- No runtime impact (UI concerns separate)

### 2. Definition/Instance Split (Replace)

**Files:**
- ❌ artifact-definition.schema.json → Single Artifact schema
- ❌ artifact-instance.schema.json → Single Artifact schema
- ❌ playbook-definition.schema.json → Agent + Schedule
- ❌ playbook-instance.schema.json → Run + Schedule Execution
- ❌ workspace-state.schema.json → ProjectContext (runtime-only)

**Reason:** Phase 2 uses filesystem packages for definitions, ProjectContext for runtime

**Impact:**
- Database queries must change
- Migration: Move instance data to project state
- Builders affected: All Definition/Instance builders

### 3. Obsolete Concepts (Delete)

**Files:**
- ❌ work-item.schema.json (→ Run)
- ❌ action.schema.json (→ Run/Artifact)
- ❌ agent-session.schema.json (→ ephemeral, not persisted)

**Reason:** Concepts replaced by Phase 2 model

**Impact:**
- Queries referencing these removed
- No direct replacement for sessions (now ephemeral)

---

## Schemas to Create

### New Schemas

```json
// 1. project.schema.json - Project container
{
  "title": "Project",
  "type": "object",
  "required": ["id", "name", "version", "createdAt", "status"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "version": { "type": "string" },
    "description": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "status": { "enum": ["active", "archived", "deleted"] },
    "agents": { "type": "array", "items": { "type": "object" } },
    "resources": { "type": "array", "items": { "type": "object" } },
    "schedules": { "type": "array", "items": { "type": "object" } },
    "metadata": { "type": "object" }
  }
}

// 2. run.schema.json - Updated (already exists, needs update)
{
  "title": "Run",
  "type": "object",
  "required": ["id", "projectId", "targetKind", "targetId", "status", "startedAt"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "targetKind": { "enum": ["tool", "skill", "agent", "schedule"] },
    "targetId": { "type": "string" },
    "triggeredBy": { "type": "string" },
    "status": { "enum": ["started", "succeeded", "failed", "cancelled"] },
    "output": { "type": "object" },
    "error": { "type": "string" },
    "startedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "threadId": { "type": "string" },
    "artifactIds": { "type": "array", "items": { "type": "string" } }
  }
}

// 3. artifact.schema.json - Updated (replaces Definition + Instance)
{
  "title": "Artifact",
  "type": "object",
  "required": ["id", "projectId", "type", "status", "version", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "type": { "type": "string" },
    "title": { "type": "string" },
    "content": { "type": "object" },
    "status": { "enum": ["draft", "active", "archived"] },
    "version": { "type": "number" },
    "versions": { "type": "array" },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "editors": { "type": "array", "items": { "type": "string" } }
  }
}

// 4. thread.schema.json - Updated
{
  "title": "Thread",
  "type": "object",
  "required": ["id", "projectId", "createdAt", "status"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "status": { "enum": ["active", "closed", "archived"] },
    "targetKind": { "enum": ["artifact", "run", "agent"] },
    "targetId": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "participants": { "type": "array" },
    "messageCount": { "type": "number" },
    "lastMessageAt": { "type": "string", "format": "date-time" }
  }
}

// 5. resource.schema.json - New (replaces knowledge-source)
{
  "title": "Resource",
  "type": "object",
  "required": ["id", "projectId", "name", "type", "status", "createdAt"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "name": { "type": "string" },
    "type": { "type": "string" },
    "content": { "type": "object" },
    "status": { "enum": ["active", "archived"] },
    "createdAt": { "type": "string", "format": "date-time" },
    "createdBy": { "type": "string" },
    "accessLevel": { "enum": ["public", "private", "restricted"] }
  }
}

// 6. event.schema.json - Keep and document
// (Already exists, update to reference Phase 2 concepts)

// 7. participant.schema.json - Keep, no changes needed
// (Already exists, aligns with Phase 2)

// 8. schedule-execution.schema.json - New
{
  "title": "ScheduleExecution",
  "type": "object",
  "required": ["id", "projectId", "scheduleId", "triggeredAt", "status"],
  "properties": {
    "id": { "type": "string" },
    "projectId": { "type": "string" },
    "scheduleId": { "type": "string" },
    "triggeredAt": { "type": "string", "format": "date-time" },
    "executedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "status": { "enum": ["scheduled", "running", "succeeded", "failed"] },
    "runId": { "type": "string" },
    "error": { "type": "string" },
    "nextExecutionAt": { "type": "string", "format": "date-time" }
  }
}
```

---

## Repository Implementations

### Phase 2 Requirements

**Current:** InMemoryProjectRepository (works), FileProjectRepository (stub)

**Needed:**
1. FileProjectRepository (complete implementation)
2. DatabaseProjectRepository (for real deployments)
3. TransactionProjectRepository (wrapper for ACID)

### InMemoryProjectRepository

**Status:** ✅ Keep as-is
**Use:** Testing, single-process deployments

### FileProjectRepository

**Status:** 🟡 Implement
**Use:** Local development, single-server deployments

**Structure:**
```
projects/
  {projectId}/
    project.json              # Project metadata
    runs/
      {runId}.json            # Individual runs
    artifacts/
      {artifactId}.json       # Individual artifacts
    threads/
      {threadId}.json         # Thread metadata
      messages/
        {messageId}.json      # Individual messages
    resources/
      {resourceId}.json       # Individual resources
    schedule-executions/
      {scheduleId}.json       # Execution history
    events.jsonl              # Event log (append-only)
```

**Implementation:**
```typescript
class FileProjectRepository implements ProjectRepository {
  constructor(basePath: string = './projects')
  
  async save(context: ProjectContext): Promise<void> {
    // Write each component to its file
    // Atomic file operations
    // Backup on write
  }
  
  async load(projectId: string): Promise<ProjectContext | undefined> {
    // Read all files for project
    // Reconstruct ProjectContext
    // Handle missing files gracefully
  }
  
  async delete(projectId: string): Promise<void> {
    // Remove project directory
    // Archive instead of delete
  }
  
  async list(): Promise<string[]> {
    // List project directories
  }
}
```

### DatabaseProjectRepository

**Status:** 🟡 Design only (implement Phase 3)
**Use:** Production deployments

**Tables Needed:**
```sql
-- Projects
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(20) NOT NULL,
  description TEXT,
  status ENUM('active', 'archived', 'deleted'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Runs
CREATE TABLE runs (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  target_kind VARCHAR(50) NOT NULL,
  target_id VARCHAR(255) NOT NULL,
  triggered_by VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  input JSON,
  output JSON,
  error TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  thread_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX (project_id, status),
  INDEX (started_at DESC)
);

-- Artifacts
CREATE TABLE artifacts (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  content JSON,
  status VARCHAR(50) NOT NULL,
  version INT NOT NULL,
  created_at TIMESTAMP,
  created_by VARCHAR(255),
  updated_at TIMESTAMP,
  updated_by VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX (project_id, status),
  INDEX (updated_at DESC)
);

-- Artifact versions
CREATE TABLE artifact_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  artifact_id VARCHAR(255) NOT NULL,
  version INT NOT NULL,
  content JSON,
  created_at TIMESTAMP,
  created_by VARCHAR(255),
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id),
  UNIQUE KEY (artifact_id, version)
);

-- Threads
CREATE TABLE threads (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  target_kind VARCHAR(50),
  target_id VARCHAR(255),
  created_at TIMESTAMP,
  created_by VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX (project_id, status)
);

-- Messages
CREATE TABLE messages (
  id VARCHAR(255) PRIMARY KEY,
  thread_id VARCHAR(255) NOT NULL,
  project_id VARCHAR(255) NOT NULL,
  author_id VARCHAR(255),
  author_type VARCHAR(50),
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES threads(id),
  INDEX (thread_id, created_at),
  INDEX (project_id)
);

-- Resources
CREATE TABLE resources (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  content JSON,
  status VARCHAR(50),
  access_level VARCHAR(50),
  created_at TIMESTAMP,
  created_by VARCHAR(255),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX (project_id, status)
);

-- Events (append-only)
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP,
  payload JSON,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX (project_id, timestamp),
  INDEX (event_name, timestamp)
);
```

---

## Migration Path

### Phase 2a (Immediate - Now)

**Delete Old Schemas:**
1. Remove workspace-definition.schema.json
2. Remove workspace-instance.schema.json
3. Remove component-tree.schema.json
4. Remove artifact-definition.schema.json
5. Remove artifact-instance.schema.json
6. Remove playbook-*.schema.json
7. Remove work-item.schema.json
8. Remove action.schema.json
9. Remove agent-session.schema.json

**Create New Schemas:**
1. Add project.schema.json
2. Update run.schema.json (with Phase 2 fields)
3. Add artifact.schema.json (unified)
4. Update thread.schema.json
5. Add resource.schema.json
6. Add schedule-execution.schema.json

**Update Builders:**
1. Remove WorkspaceDefinitionBuilder
2. Remove PlaybookDefinitionBuilder
3. Remove ArtifactDefinitionBuilder
4. Remove old builders or deprecate with warnings

**Impact:**
- Breaking change for code using old builders
- No data migration needed (old data not in use)
- Schemas published in @awp/schemas

### Phase 2b (Short Term - Next Sprint)

**Implement FileProjectRepository:**
1. Complete implementation
2. Add tests
3. Add to @awp/runtime package

**Create @awp/persistence package:**
1. Move repository interfaces here
2. Add migration utilities
3. Add backup/restore tools

**Update ProjectRuntime:**
1. Accept repository in constructor
2. Use for persistence
3. Add examples with FileProjectRepository

**Impact:**
- File-based persistence available
- Better than in-memory for local development
- Transactions not yet supported

### Phase 2c (Medium Term - Phase 3)

**Implement DatabaseProjectRepository:**
1. SQL schema for each database type
2. Connection pooling
3. Transaction support
4. Query optimization

**Create Migration Tools:**
1. File → Database migration
2. Backup before migration
3. Validation after migration

**Add Query APIs:**
1. Find runs by agent
2. Find artifacts by status
3. Find threads by participant
4. Event filtering and search

**Impact:**
- Production-ready persistence
- Scalable to many projects
- Real transaction support

### Phase 3 (Long Term)

**Add Caching:**
1. Redis for hot projects
2. Cache invalidation strategy
3. Consistency guarantees

**Add Replication:**
1. Read replicas
2. Backup strategy
3. Disaster recovery

**Add Sharding:**
1. Partition by projectId
2. Shard management
3. Rebalancing strategy

---

## Compatibility Notes

### Breaking Changes

❌ **These will break existing code:**

1. **Old Builders Removed**
   - WorkspaceDefinitionBuilder
   - PlaybookDefinitionBuilder
   - Any code using these fails

2. **Old Schemas Gone**
   - Cannot validate against removed schemas
   - Old stored data unusable
   - No automatic upgrade path

3. **Old Type Imports**
   - WorkspaceDefinition type removed
   - PlaybookDefinition type removed
   - WorkItem type removed
   - Code using these types won't compile

### Non-Breaking Changes

✅ **These are safe:**

1. **New Schemas Coexist**
   - Old/new schemas can exist in same repo temporarily
   - Validation can accept either during transition

2. **Deprecated Builders**
   - Keep old builders but mark @deprecated
   - Log warnings when used
   - Remove in next major version

3. **Repository Interfaces**
   - InMemoryProjectRepository unchanged
   - New implementations don't affect existing code
   - Old and new can coexist

### Transition Strategy

**Recommended Order:**

1. **Week 1:** Add new schemas, keep old
2. **Week 2:** Deprecate old builders (add warnings)
3. **Week 3:** Remove old schemas from examples
4. **Week 4:** Remove old builders
5. **Week 5:** Remove old schemas from package

---

## Follow-Up Work

### Immediate (This Sprint)

- [ ] Delete old Definition/Instance schemas
- [ ] Create new Phase 2 schemas
- [ ] Update repository.ts types
- [ ] Update README in schemas package
- [ ] Add migration guide

### Short Term (Next Sprint)

- [ ] Implement FileProjectRepository
- [ ] Add persistence tests
- [ ] Create @awp/persistence package
- [ ] Document file structure
- [ ] Backup/restore utilities

### Medium Term (Phase 3)

- [ ] Design DatabaseProjectRepository
- [ ] Implement SQL schemas
- [ ] Add transaction support
- [ ] Create migration tools
- [ ] Performance optimization

### Long Term (Phase 4+)

- [ ] Add caching layer
- [ ] Implement replication
- [ ] Add sharding support
- [ ] Query optimization
- [ ] Monitoring and observability

---

## File Changes Summary

### Deletions

```
packages/schemas/
  ❌ workspace-definition.schema.json
  ❌ workspace-instance.schema.json
  ❌ component-tree.schema.json
  ❌ artifact-definition.schema.json
  ❌ artifact-instance.schema.json
  ❌ playbook-definition.schema.json
  ❌ playbook-instance.schema.json
  ❌ work-item.schema.json
  ❌ action.schema.json
  ❌ agent-session.schema.json
  ❌ workspace-state.schema.json
  (11 files deleted)
```

### Additions

```
packages/schemas/
  ✅ project.schema.json (new)
  ✅ artifact.schema.json (replaces Definition + Instance)
  ✅ resource.schema.json (replaces knowledge-source)
  ✅ schedule-execution.schema.json (new)
  (4 files added)

packages/tools/ or packages/runtime/
  ✅ Move repositories to dedicated package
```

### Updates

```
packages/schemas/
  🟡 run.schema.json (update with new fields)
  🟡 thread.schema.json (update references)
  🟡 event.schema.json (document Phase 2 events)
  🟡 index.d.ts (update exports)

packages/definitions/
  🟡 builders.ts (remove old builders or deprecate)
  🟡 validator.ts (update for new schemas)

packages/runtime/
  🟡 repository.ts (enhance implementations)
```

---

## Conclusion

The current persistence model is fundamentally misaligned with Phase 2 architecture. A systematic cleanup is required:

**What's Wrong:**
- Definition/Instance split no longer needed
- UI-oriented schemas irrelevant to runtime
- Old concepts (WorkItem, Playbook) not applicable
- Storage model doesn't match execution model

**What's Needed:**
- Project as primary storage unit
- Run, Artifact, Thread as first-class concepts
- Filesystem packages for definitions
- Clean separation of concerns

**Next Action:**
Begin Phase 2b with schema cleanup and FileProjectRepository implementation.

**Timeline:**
- 1 week: Schema cleanup and design
- 2 weeks: FileProjectRepository
- 4+ weeks: DatabaseProjectRepository (Phase 3)
