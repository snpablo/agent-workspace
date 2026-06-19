# Roadmap

Implementation progress toward a platform for building AI agent systems with human-agent collaboration.

## Phase 1: Core Packages ✅ COMPLETE

Successfully implemented the four foundational packages:

- ✅ `packages/schemas` - Tool, Skill, Agent, Project, Run, Artifact, Thread definitions
- ✅ `packages/types` - 50+ TypeScript type interfaces  
- ✅ `packages/definitions` - Builders and validators
- ✅ `packages/interpreter` - Definition validation and normalization

**Status:** Phase 1 is complete with industry-standard vocabulary (Project, Agent, Tool, Skill, Run, Artifact, Thread).

See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) and [VOCABULARY_TRANSITION.md](VOCABULARY_TRANSITION.md) for details.

## Phase 2: Agent Runtime (Next)

Build Agent execution and Run recording:

### `packages/runtime`

- Execute Agents with Tool and Skill invocation
- Record Runs (finite, immutable execution records)
- Manage Sandboxes (isolated execution environments)
- Generate Events for all activity
- Support Artifact creation and versioning
- Thread management for collaboration

**Scope:**
- Agent execution engine
- Run state machine
- Artifact versioning
- Thread and Event recording
- Permission enforcement
- Audit logging

**Dependencies:** Phase 1 packages

**Success Criteria:**
- Agents execute Runs in Projects
- Artifacts created by Runs are versioned and auditable
- Threads capture human-agent collaboration
- Complete audit trail of all activity
- Full test coverage with example Agents

## Phase 3: SDK & Integrations

Provide Agent development and Tool integration:

### `packages/sdk`

- Agent client library
- Tool/Skill definition helpers
- Project client
- Run inspection
- Artifact management

### Tool Integrations

- HTTP/API Tools
- Function-based Tools
- Service connectors (Slack, email, etc.)
- Database access

**Dependencies:** Phase 1, 2 packages

**Success Criteria:**
- Easy to develop new Agents
- Easy to create Tools
- Examples for common integrations

## Phase 4: Collaboration UI

Build reference UI for Project collaboration:

### `packages/shell`

- Project dashboard
- Run inspection and debugging
- Artifact review and versioning
- Thread/discussion interface
- Agent status and logs
- Resource management

**Dependencies:** Phase 1, 2, 3 packages

**Success Criteria:**
- View running Projects and Agents
- Inspect Runs and Artifacts
- Participate in Threads
- Full audit trail visible
- Responsive and accessible

## Phase 5: Reference Projects

Implement example Projects using only definitions:

- Decision Analysis
- Partner Operations
- Content Generation
- Data Analysis

**Constraint:** No platform code changes for new Projects.

**Success Criteria:**
- 4 fully functional Projects
- Each uses only definition packages
- Demonstrate platform capability

## Guiding Principles

### One Runtime, Many Projects

Decision, Finance, HR, Partner are Projects defined declaratively.

Do not create separate platforms or applications for different domains.

### Industry-Standard Vocabulary

Use Agent, Tool, Skill, Run, Artifact, Thread—align with agent frameworks.

Do not invent domain-specific platform concepts.

### Explicit & Observable

Agents execute (Run), create Artifacts, discuss in Threads.
All activity is recorded, versioned, and auditable.

### Metadata-Driven

Prefer fewer, more generic platform abstractions.

Do not introduce new platform root concepts when specialization suffices.

### Discovery Through Implementation

Let implementation pressure drive discoveries. If implementation reveals gaps:

1. Capture minimum necessary decisions
2. Update frozen contracts
3. Continue implementation

### No Speculative Expansion

Do not start phases not listed above.

Do not add features before needed.

Do not pre-design for undefined requirements.
