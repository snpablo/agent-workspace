# Agent Platform Roadmap

Implementation roadmap for building out the Agent Platform ecosystem. Architecture V2 is complete and frozen.

**Focus:** Implementation and ecosystem evolution, not ontology.

---

## Current Snapshot

The repository is now in a good Architecture V2 state:

- The V2 vocabulary is consistent across architecture docs, examples, posters, and root navigation.
- `docs/README.md` is the canonical onboarding flow for new readers.
- Example projects under `docs/examples/` use the V2 package layout and align to the archetype images.
- Architecture posters are SVG-backed Markdown pages that explain runtime behavior visually.
- Jest is wired at the workspace level and currently passes from the root test command.

What this means in practice:

- The architecture and documentation are in better shape than the implementation.
- Terminology cleanup, documentation consolidation, and architecture framing are largely complete.
- The next meaningful work is turning the documented model into more complete runtime behavior.

## Recommended Next Work

If a future agent needs to choose what to do next, prefer this order:

1. Make the runtime behavior match the architecture more closely.
2. Add persistence and execution behavior before adding new package kinds or abstractions.
3. Improve validation and package/schema enforcement.
4. Only after that, add integrations like channels, schedules, and richer tool providers.

In other words:

- Prefer implementation depth over more architecture writing.
- Treat terminology and documentation cleanup as maintenance work, not the main roadmap driver.
- Prefer closing spec/code gaps over adding new concepts.
- Prefer end-to-end vertical slices that prove the model works.

---

## Guiding Principles

### The Architecture is Intentionally Minimal

Agent Platform implements exactly 10 core concepts: Project, Agent, Tool, Skill, Channel, Schedule, Resource, Artifact, Thread, and Run.

This is not a constraint. It's a feature. The minimal ontology forces:
- Clear thinking about abstractions
- Composition over inheritance
- Configuration over code
- Reusable patterns instead of one-off types

### Future Work Must

1. **Prefer implementation over abstraction** - Ship working code, not new concepts
2. **Prefer configuration over new ontology** - Extend via YAML, not new types
3. **Prefer borrowing emerging standards over inventing terminology** - Use established protocols, interface specifications, and ecosystem conventions where they fit
4. **Require an ADR for any proposed new ontology concept** - No new core concepts without decision record and justification

### What Should NOT Happen

- Adding new core ontology concepts (Eval and Sandbox are optional, not core)
- Inventing new terminology (don't create custom versions of industry concepts)
- Over-engineering extensibility (keep it simple until needed)
- Hard-coding domain logic in platform code (belongs in agents, tools, skills, artifact schemas)

---

## Phase 1: Foundation ✅ (Complete)

### Completed

- ✅ Core type definitions (packages/types)
- ✅ Base JSON schemas added (packages/schemas)
- ✅ Package metadata structure
- ✅ YAML parsing and basic validation
- ✅ Architecture specification (ARCHITECTURE_V2.md)
- ✅ 9 Architecture Decision Records
- ✅ Contributor guide (AGENTS.md)

### Current State

The type system is complete and aligned with V2:
- Project, Agent, Tool, Skill, Channel, Schedule, Resource
- Artifact, Thread, Run (runtime concepts)
- Clean separation of definitions (packages) from runtime state

---

## Phase 2: Foundation Implementation (Current)

**Practical priority inside Phase 2:**

- First: runtime completion
- Second: persistence
- Third: schema validation and loader hardening

These three areas are the highest-leverage path to turning the repository from a strong architecture/spec repo into a stronger working platform repo.

### 2.1 Package Loading

**Status:** Core framework exists, partially improved, still needs hardening

**Work:**
- [ ] Add full package validation with JSON Schema
- [ ] Validate package references and missing dependencies clearly
- [ ] Add package caching for performance
- [ ] Support optional packages (Sandbox, Eval)
- [ ] Add package dependency resolution
- [ ] Add package version conflict detection

**Deliverable:** Robust package discovery and loading

### 2.2 YAML Schemas

**Status:** Basic schemas exist, but enforcement is incomplete

**Work:**
- [ ] Create comprehensive JSON schemas for all package kinds
- [ ] Validate all YAML packages against schemas
- [ ] Add schema documentation
- [ ] Add schema versioning
- [ ] Create schema evolution policy

**Deliverable:** Complete, documented schema specifications

### 2.3 Runtime Model

**Status:** Type definitions exist, basic implementation exists, still incomplete relative to the architecture

**Work:**
- [ ] Replace mock execution paths with real execution flow where appropriate
- [ ] Implement ProjectState management thoroughly
- [ ] Implement AgentInstance resolution (load agent with tools/skills)
- [ ] Implement Run execution model
- [ ] Implement Artifact creation and versioning
- [ ] Implement Thread message handling
- [ ] Implement Event emission and audit trail
- [ ] Align runtime README/examples with the actual current runtime API

**Deliverable:** Complete project runtime engine

### 2.4 Persistence Layer

**Status:** Architecture expects persistence; implementation still needs to catch up

**Work:**
- [ ] Implement file-based persistence (JSON files)
- [ ] Implement database persistence (pluggable)
- [ ] Implement artifact versioning storage
- [ ] Implement event log persistence
- [ ] Add persistence abstraction layer (Repository pattern)
- [ ] Add backup and recovery mechanisms

**Deliverable:** Pluggable persistence implementation

---

## Phase 3: Projects

### 3.1 Project Lifecycle

**Status:** Not started

**Work:**
- [ ] Implement project creation
- [ ] Implement project initialization from template
- [ ] Implement project state transitions (creation, active, archived)
- [ ] Implement project cleanup
- [ ] Add participant management
- [ ] Add resource allocation

**Deliverable:** Full project lifecycle management

### 3.2 Project Templates

**Status:** Not started

**Work:**
- [ ] Create project template format
- [ ] Build template library (decision-making, analysis, planning, etc.)
- [ ] Implement template instantiation
- [ ] Add template customization
- [ ] Document template creation

**Deliverable:** Template system with reference templates

### 3.3 Project Import/Export

**Status:** Not started

**Work:**
- [ ] Implement project export (to archive)
- [ ] Implement project import (from archive)
- [ ] Handle migration between environments
- [ ] Add compatibility checking
- [ ] Document migration process

**Deliverable:** Import/export and migration tools

### 3.4 Project Validation

**Status:** Not started

**Work:**
- [ ] Implement project structure validation
- [ ] Validate all package references resolve
- [ ] Validate no circular dependencies
- [ ] Validate resource availability
- [ ] Add validation reporting

**Deliverable:** Comprehensive project validation

---

## Phase 4: Agents

### 4.1 Tool Registry

**Status:** Basic implementation exists

**Work:**
- [ ] Implement tool registration
- [ ] Implement tool discovery by type
- [ ] Implement tool permissions/access control
- [ ] Implement tool versioning
- [ ] Add tool metadata search

**Deliverable:** Complete tool registry

### 4.2 Skill Loading

**Status:** Basic support exists

**Work:**
- [ ] Implement skill loading with transitive tool resolution
- [ ] Implement skill composition (skills using other skills)
- [ ] Implement skill versioning
- [ ] Add skill metadata and documentation
- [ ] Implement skill validation

**Deliverable:** Full skill composition support

### 4.3 Channel Implementations

**Status:** Type definitions exist

**Work:**
- [ ] Implement Slack channel integration
- [ ] Implement email channel integration
- [ ] Implement webhook channel integration
- [ ] Implement HTTP POST channel
- [ ] Add channel authentication handling
- [ ] Add channel message formatting

**Deliverable:** Multi-channel communication support

### 4.4 Scheduling

**Status:** Type definitions exist

**Work:**
- [ ] Implement cron-based scheduling
- [ ] Implement event-based scheduling
- [ ] Implement manual triggering
- [ ] Implement schedule state management
- [ ] Add schedule execution logging
- [ ] Implement schedule enable/disable

**Deliverable:** Full scheduling system

### 4.5 Sandboxing Configuration

**Status:** Optional package kind exists

**Work:**
- [ ] Implement sandbox policy enforcement
- [ ] Implement resource limits (memory, CPU, timeout)
- [ ] Implement operation allowlists/blocklists
- [ ] Implement environment variable injection
- [ ] Add sandbox validation
- [ ] Document sandbox policies

**Deliverable:** Sandbox configuration and enforcement

### 4.6 Evaluation Support

**Status:** Optional package kind exists, not implemented

**Work:**
- [ ] If/when evaluation systems needed:
  - [ ] Define Eval package schema
  - [ ] Implement evaluation execution
  - [ ] Add evaluation result recording
  - [ ] Implement evaluation metrics
  - [ ] Add evaluation reporting

**Deliverable:** Evaluation framework (if needed)

---

## Phase 5: Artifacts

### 5.1 Versioning

**Status:** Type definitions exist

**Work:**
- [ ] Implement automatic artifact versioning
- [ ] Implement version history storage
- [ ] Implement version retrieval
- [ ] Implement version comparison
- [ ] Add version diff/delta tracking
- [ ] Implement version pruning/cleanup

**Deliverable:** Complete artifact versioning system

### 5.2 Rendering

**Status:** Not started

**Work:**
- [ ] Implement artifact schema to template conversion
- [ ] Implement HTML rendering
- [ ] Implement Markdown rendering
- [ ] Implement custom rendering support
- [ ] Add asset/resource handling

**Deliverable:** Artifact rendering system

### 5.3 Publishing

**Status:** Not started

**Work:**
- [ ] Implement artifact publication workflow
- [ ] Implement publication status tracking
- [ ] Implement publication access control
- [ ] Add publication notifications
- [ ] Implement withdrawal/archival

**Deliverable:** Artifact publishing workflow

### 5.4 Sharing

**Status:** Not started

**Work:**
- [ ] Implement artifact sharing controls
- [ ] Implement temporary access tokens
- [ ] Implement share expiration
- [ ] Implement share auditing
- [ ] Add share notifications

**Deliverable:** Artifact sharing system

### 5.5 Dependency Tracking

**Status:** Not started

**Work:**
- [ ] Implement artifact dependency graph
- [ ] Implement dependency resolution
- [ ] Implement circular dependency detection
- [ ] Add dependency visualization
- [ ] Implement impact analysis

**Deliverable:** Artifact dependency tracking

---

## Phase 6: Resources

### 6.1 File Resources

**Status:** Not started

**Work:**
- [ ] Implement file resource storage
- [ ] Implement file versioning
- [ ] Implement file access control
- [ ] Implement large file handling
- [ ] Add file compression/decompression

**Deliverable:** File resource support

### 6.2 Search

**Status:** Not started

**Work:**
- [ ] Implement resource metadata search
- [ ] Implement full-text search (if large deployments need it)
- [ ] Implement search indexing
- [ ] Add search filtering
- [ ] Implement search performance optimization

**Deliverable:** Resource search capability

### 6.3 Retrieval

**Status:** Not started

**Work:**
- [ ] Implement resource retrieval API
- [ ] Implement resource caching
- [ ] Implement resource streaming
- [ ] Add retrieval metrics/monitoring
- [ ] Implement retrieval failure handling

**Deliverable:** Efficient resource retrieval

### 6.4 Indexing

**Status:** Not started

**Work:**
- [ ] Implement resource indexing strategy
- [ ] Implement index maintenance
- [ ] Implement index rebuilding
- [ ] Add index statistics
- [ ] Implement index optimization

**Deliverable:** Resource indexing system

---

## Phase 7: Tools

### 7.1 Native Tools

**Status:** Type definitions exist

**Work:**
- [ ] Implement JavaScript/TypeScript tool execution
- [ ] Implement Python tool execution
- [ ] Implement Go tool execution
- [ ] Add code safety/sandboxing
- [ ] Implement tool discovery from code
- [ ] Add performance profiling

**Deliverable:** Multi-language native tool support

### 7.2 Connector-Backed Tools

**Status:** Type definitions exist

**Work:**
- [ ] Implement database connector (SQL, NoSQL)
- [ ] Implement SaaS connectors (Salesforce, etc.)
- [ ] Implement data source connectors
- [ ] Add connection pooling
- [ ] Implement connection error handling
- [ ] Add performance monitoring

**Deliverable:** Enterprise connector support

### 7.3 MCP-Backed Tools

**Status:** Type definitions exist

**Work:**
- [ ] Implement MCP server client
- [ ] Implement MCP capability discovery
- [ ] Implement MCP request/response handling
- [ ] Add MCP server authentication
- [ ] Implement timeout and retry logic
- [ ] Add MCP monitoring and logging

**Deliverable:** Full MCP integration

### 7.4 Tool Discovery

**Status:** Not started

**Work:**
- [ ] Implement tool metadata search
- [ ] Implement tool capability matching
- [ ] Implement tool recommendation engine
- [ ] Add tool usage analytics
- [ ] Implement tool rating/feedback

**Deliverable:** Tool discovery and recommendation

### 7.5 Tool Permissions

**Status:** Not started

**Work:**
- [ ] Implement tool-level access control
- [ ] Implement tool capability restrictions
- [ ] Implement tool usage quotas
- [ ] Add tool audit logging
- [ ] Implement tool deprecation workflow

**Deliverable:** Tool permission and access system

---

## Phase 8: Developer Experience

### 8.1 CLI

**Status:** Not started

**Work:**
- [ ] Implement `agent new` (create project)
- [ ] Implement `agent add` (add agent/tool/skill)
- [ ] Implement `agent run` (execute run)
- [ ] Implement `agent show` (display package)
- [ ] Implement `agent validate` (validate project)
- [ ] Implement `agent export` (export project)

**Deliverable:** Comprehensive CLI tooling

### 8.2 Project Scaffolding

**Status:** Not started

**Work:**
- [ ] Create project templates
- [ ] Implement scaffolding generator
- [ ] Add example projects
- [ ] Create onboarding flow
- [ ] Build quickstart guides

**Deliverable:** Easy project creation and onboarding

### 8.3 Validation

**Status:** Not started

**Work:**
- [ ] Implement schema validation
- [ ] Implement reference validation
- [ ] Implement consistency checking
- [ ] Add validation error reporting
- [ ] Implement auto-fix for common issues

**Deliverable:** Comprehensive validation tooling

### 8.4 Documentation Generation

**Status:** Not started

**Work:**
- [ ] Generate project documentation from packages
- [ ] Generate agent capability documentation
- [ ] Generate tool API documentation
- [ ] Implement documentation rendering
- [ ] Add documentation hosting

**Deliverable:** Auto-generated documentation

### 8.5 Testing Utilities

**Status:** Not started

**Work:**
- [ ] Implement agent execution testing
- [ ] Implement tool mocking
- [ ] Implement artifact validation testing
- [ ] Create test data generators
- [ ] Add performance testing utilities

**Deliverable:** Comprehensive testing framework

---

## Phase 9: Observability

### 9.1 Logging

**Status:** Basic event system exists

**Work:**
- [ ] Implement structured logging
- [ ] Implement log levels
- [ ] Implement log aggregation support
- [ ] Add log retention policies
- [ ] Implement log searching

**Deliverable:** Production logging system

### 9.2 Metrics

**Status:** Not started

**Work:**
- [ ] Implement execution metrics
- [ ] Implement performance metrics
- [ ] Implement usage metrics
- [ ] Add metrics collection
- [ ] Implement metrics export (Prometheus, etc.)

**Deliverable:** Comprehensive metrics collection

### 9.3 Tracing

**Status:** Not started

**Work:**
- [ ] Implement execution tracing
- [ ] Implement distributed tracing support
- [ ] Add trace visualization
- [ ] Implement trace storage
- [ ] Add performance profiling

**Deliverable:** Execution tracing system

### 9.4 Monitoring

**Status:** Not started

**Work:**
- [ ] Implement health checks
- [ ] Implement alerting
- [ ] Implement dashboards
- [ ] Add anomaly detection
- [ ] Implement incident response

**Deliverable:** Production monitoring

---

## Phase 10: Future Exploration

### Do Not Implement Now

The following are interesting areas for future exploration. Do NOT implement these as core platform features. Instead:
1. Build as optional extensions (new package kinds)
2. Build as separate tools/systems
3. Build as examples showing how to use the platform

### Multi-Agent Coordination

**Rationale:** Complex, emergent behavior. Let agents/skills handle coordination via tools.

**Possible Future Approach:**
- Implement coordination agents (agents that orchestrate other agents)
- Use existing Project/Agent/Run model
- No new ontology needed

**Example:**
```yaml
kind: agent
id: orchestrator
instructions: |
  Coordinate multiple specialized agents to solve problems
tools:
  - id: analyst-agent
  - id: reviewer-agent
  - id: synthesizer-agent
```

### Long-Running Projects

**Rationale:** Most projects are relatively short-lived. Long-running support can be built as extension.

**Possible Future Approach:**
- Implement project checkpointing
- Implement agent hibernation/resumption
- Add project state snapshots
- No new ontology needed

### Distributed Execution

**Rationale:** Start with single machine. Scaling is separate concern.

**Possible Future Approach:**
- Implement tool execution on remote workers
- Add execution plan distribution
- Implement result aggregation
- No new ontology needed

### Artifact Dependency Graphs

**Rationale:** Interesting for complex projects, but optional.

**Possible Future Approach:**
- Track artifact dependencies in metadata
- Build dependency visualization
- Implement impact analysis
- No new ontology needed

### Hosted Runtimes

**Rationale:** Self-hosted is fine for now. Hosting is infrastructure, not platform.

**Possible Future Approach:**
- Containerize runtime
- Add cloud deployment tools
- Implement multi-tenant isolation
- No new ontology needed

---

## Implementation Strategy

### Principles

1. **Build what's needed, not what's imagined** - Implement based on real projects
2. **Keep the core minimal** - Platform should be small, tight, focused
3. **Make extensions composable** - New capabilities should layer on top
4. **Prefer examples over framework** - Show how to do things, don't build frameworks
5. **Test thoroughly** - Platform code must be rock solid

### Quality Gates

Each phase must:
- ✅ Have comprehensive type coverage
- ✅ Have passing tests
- ✅ Have documentation
- ✅ Have at least one working example
- ✅ Not add new ontology concepts without ADR

### Release Strategy

1. **Alpha:** Foundation phases complete (1-2)
2. **Beta:** Core phases complete (3-7)
3. **1.0:** Developer experience solid (1-8)
4. **1.x:** Observability and stability (9)
5. **2.0:** Future exploration features

---

## Metrics for Success

### Foundation
- [ ] All package types loading correctly
- [ ] All YAML validated against schemas
- [ ] Project runtime executing agents and recording runs
- [ ] Artifacts versioned and queryable
- [ ] Persistence works with multiple backends

### Projects
- [ ] Projects can be created from templates
- [ ] Projects can be imported/exported
- [ ] Project validation catches all issues
- [ ] Project lifecycle is clear and manageable

### Agents
- [ ] Agents execute with full tool access
- [ ] Skills compose correctly
- [ ] Channels send to multiple destinations
- [ ] Schedules trigger reliably
- [ ] Sandboxing enforces constraints

### Artifacts
- [ ] Artifact versioning works smoothly
- [ ] Artifacts render in multiple formats
- [ ] Artifacts can be published and shared
- [ ] Dependencies are tracked correctly

### Resources
- [ ] Resources load quickly
- [ ] Resources are searchable
- [ ] Resources scale to large projects
- [ ] Retrieval is reliable

### Tools
- [ ] Multiple tool types work seamlessly
- [ ] Tool discovery is intuitive
- [ ] Tool permissions are enforced
- [ ] Tool errors are handled gracefully

### Developer Experience
- [ ] CLI is intuitive and helpful
- [ ] Scaffolding gets projects started in 5 minutes
- [ ] Validation catches mistakes immediately
- [ ] Documentation is auto-generated and complete

---

## What NOT to Do

❌ **Do not** add new core ontology concepts without an ADR
❌ **Do not** build frameworks when examples would do
❌ **Do not** over-engineer before real usage patterns emerge
❌ **Do not** hard-code domain logic in platform code
❌ **Do not** invent terminology instead of borrowing from industry
❌ **Do not** ship features without tests
❌ **Do not** deprecate; delete or make optional

---

## Communication

This roadmap is living. As implementation progresses:
- Update completion status regularly
- Add new items based on learnings
- Remove items that become irrelevant
- Keep the guiding principles front and center

The architecture is frozen. The implementation is the work.
