/**
 * Tests for ProjectRuntime
 */

import { ProjectRuntime } from '../src/project-runtime';
import { PackageRegistry } from '@awp/loader';
import { Project, Agent, Tool, Skill, Participant, Resource, Artifact, Thread } from '@awp/types';
import { replayProjectEvents } from '../src/event-projection';

describe('ProjectRuntime', () => {
  let runtime: ProjectRuntime;
  let registry: PackageRegistry;
  let testProject: Project;
  let testAgent: Agent;
  let testTool: Tool;
  let testSkill: Skill;

  beforeEach(() => {
    // Create test packages
    testTool = {
      kind: 'tool',
      id: 'test-tool',
      name: 'Test Tool',
      version: '1.0.0',
      sourcePath: '/tools/test-tool/test-tool.yaml',
      description: 'A test tool',
    };

    testSkill = {
      kind: 'skill',
      id: 'test-skill',
      name: 'Test Skill',
      version: '1.0.0',
      sourcePath: '/skills/test-skill/test-skill.yaml',
      instructions: 'A test skill',
      tools: [{ id: 'test-tool' }],
    };

    testAgent = {
      kind: 'agent',
      id: 'test-agent',
      name: 'Test Agent',
      version: '1.0.0',
      sourcePath: '/agents/test-agent/agent.yaml',
      role: 'analyzer',
      instructions: 'Test agent instructions',
      model: 'claude-opus',
      tools: [{ id: 'test-tool' }],
      skills: [{ id: 'test-skill' }],
    };

    testProject = {
      kind: 'project',
      id: 'test-project',
      name: 'Test Project',
      version: '1.0.0',
      sourcePath: '/project.yaml',
      agents: [{ id: 'test-agent' }],
      resources: [],
      schedules: [],
    };

    // Create registry with test packages
    registry = new PackageRegistry([
      { package: testTool, sourcePath: testTool.sourcePath, success: true },
      { package: testSkill, sourcePath: testSkill.sourcePath, success: true },
      { package: testAgent, sourcePath: testAgent.sourcePath, success: true },
      { package: testProject, sourcePath: testProject.sourcePath, success: true },
    ]);

    // Create runtime
    runtime = new ProjectRuntime(registry);
  });

  describe('project initialization', () => {
    it('should initialize a project context', async () => {
      const context = await runtime.initializeProject({
        project: testProject,
        participants: [],
      });

      expect(context).toBeDefined();
      expect(context.project.id).toBe('test-project');
      expect(context.agents).toHaveLength(1);
      expect(context.agents[0].agent.id).toBe('test-agent');
    });

    it('should load agents with tools and skills', async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });

      expect(context.agents).toHaveLength(1);
      const agent = context.agents[0];

      expect(agent.tools).toHaveLength(1);
      expect(agent.tools[0].id).toBe('test-tool');

      expect(agent.skills).toHaveLength(1);
      expect(agent.skills[0].id).toBe('test-skill');
    });

    it('should add participants', async () => {
      const participant: Participant = {
        id: 'user-001',
        type: 'human',
        projectId: testProject.id,
        role: 'owner',
        name: 'Alice',
        joinedAt: new Date().toISOString(),
      };

      const context = await runtime.initializeProject({
        project: testProject,
        participants: [participant],
      });

      expect(context.participants.has('user-001')).toBe(true);
    });

    it('should load resources', async () => {
      const resource: Resource = {
        kind: 'resource',
        id: 'doc-001',
        name: 'Document',
        version: '1.0.0',
        sourcePath: '/resources/doc-001.yaml',
        type: 'document',
        content: { text: 'Content' },
      };

      registry.register({
        package: resource,
        sourcePath: resource.sourcePath,
        success: true,
      });

      const context = await runtime.initializeProject({
        project: { ...testProject, resources: [{ id: 'doc-001' }] },
      });

      expect(context.resources).toHaveLength(1);
      expect(context.resources[0].id).toBe('doc-001');
    });
  });

  describe('run execution', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('should execute a tool', async () => {
      const result = await runtime.executeRun(projectId, {
        targetKind: 'tool',
        targetId: 'test-tool',
        triggeredBy: 'user-001',
        input: { query: 'test' },
      });

      expect(result.success).toBe(true);
      expect(result.run.status).toBe('succeeded');
      expect(result.run.output).toBeDefined();
    });

    it('should execute a skill', async () => {
      const result = await runtime.executeRun(projectId, {
        targetKind: 'skill',
        targetId: 'test-skill',
        triggeredBy: 'user-001',
      });

      expect(result.success).toBe(true);
      expect(result.run.status).toBe('succeeded');
    });

    it('should execute an agent', async () => {
      const result = await runtime.executeRun(projectId, {
        targetKind: 'agent',
        targetId: 'test-agent',
        triggeredBy: 'user-001',
        input: { task: 'Analyze' },
      });

      expect(result.success).toBe(true);
      expect(result.run.status).toBe('succeeded');
      expect(result.run.output?.model).toBe('claude-opus');
    });

    it('should handle missing tools', async () => {
      const result = await runtime.executeRun(projectId, {
        targetKind: 'tool',
        targetId: 'non-existent',
        triggeredBy: 'user-001',
      });

      expect(result.success).toBe(false);
      expect(result.run.status).toBe('failed');
      expect(result.error).toContain('not found');
    });

    it('should emit events during execution', async () => {
      const context = runtime.getProjectState(projectId);
      const initialEventCount = context?.events.length || 0;

      await runtime.executeRun(projectId, {
        targetKind: 'tool',
        targetId: 'test-tool',
        triggeredBy: 'user-001',
      });

      const updatedContext = runtime.getProjectState(projectId);
      expect((updatedContext?.events.length || 0) > initialEventCount).toBe(true);
    });

    it('should record run in context', async () => {
      const result = await runtime.executeRun(projectId, {
        targetKind: 'tool',
        targetId: 'test-tool',
        triggeredBy: 'user-001',
      });

      const context = runtime.getProjectState(projectId);
      expect(context?.runs.has(result.run.id)).toBe(true);
    });
  });

  describe('artifact management', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('should create an artifact', async () => {
      const artifact: Artifact = {
        id: 'artifact-001',
        projectId,
        type: 'analysis',
        status: 'draft',
        title: 'Test Analysis',
        content: { data: 'test' },
        createdBy: 'user-001',
        version: 1,
        createdAt: new Date().toISOString(),
      };

      const created = await runtime.createArtifact(projectId, artifact);

      expect(created.id).toBe('artifact-001');
      expect(created.version).toBe(1);
    });

    it('should store artifact in context', async () => {
      const artifact: Artifact = {
        id: 'artifact-001',
        projectId,
        type: 'analysis',
        status: 'draft',
        title: 'Test',
        content: {},
        createdBy: 'user-001',
        version: 1,
        createdAt: new Date().toISOString(),
      };

      await runtime.createArtifact(projectId, artifact);

      const context = runtime.getProjectState(projectId);
      expect(context?.artifacts.has('artifact-001')).toBe(true);
    });

    it('should track artifact versions', async () => {
      const artifact: Artifact = {
        id: 'artifact-001',
        projectId,
        type: 'analysis',
        status: 'draft',
        title: 'Test',
        content: { v: 1 },
        createdBy: 'user-001',
        version: 1,
        createdAt: new Date().toISOString(),
      };

      await runtime.createArtifact(projectId, artifact);

      const context = runtime.getProjectState(projectId);
      const record = context?.artifacts.get('artifact-001');

      expect(record?.versions).toHaveLength(1);
      expect(record?.versions[0].version).toBe(1);
    });

    it('should emit artifact.created event', async () => {
      const artifact: Artifact = {
        id: 'artifact-001',
        projectId,
        type: 'analysis',
        status: 'draft',
        title: 'Test',
        content: {},
        createdBy: 'user-001',
        version: 1,
        createdAt: new Date().toISOString(),
      };

      const context = runtime.getProjectState(projectId);
      const initialCount = context?.events.length || 0;

      await runtime.createArtifact(projectId, artifact);

      const updated = runtime.getProjectState(projectId);
      const newEvents = (updated?.events || []).slice(initialCount);
      const createdEvent = newEvents.find((e) => e.name === 'artifact.created');

      expect(createdEvent).toBeDefined();
      expect(createdEvent?.artifactId).toBe('artifact-001');
    });
  });

  describe('thread management', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('should create a thread', async () => {
      const thread: Thread = {
        id: 'thread-001',
        projectId,
        status: 'active',
        messages: [],
        createdBy: 'user-001',
        createdAt: new Date().toISOString(),
      };

      const created = await runtime.createThread(projectId, thread);

      expect(created.id).toBe('thread-001');
      expect(created.status).toBe('active');
    });

    it('should store thread in context', async () => {
      const thread: Thread = {
        id: 'thread-001',
        projectId,
        status: 'active',
        messages: [],
        createdBy: 'user-001',
        createdAt: new Date().toISOString(),
      };

      await runtime.createThread(projectId, thread);

      const context = runtime.getProjectState(projectId);
      expect(context?.threads.has('thread-001')).toBe(true);
    });
  });

  describe('participant management', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('should add participant', () => {
      const participant: Participant = {
        id: 'user-001',
        type: 'human',
        projectId,
        role: 'owner',
        name: 'Alice',
        joinedAt: new Date().toISOString(),
      };

      runtime.addParticipant(projectId, participant);

      const context = runtime.getProjectState(projectId);
      expect(context?.participants.has('user-001')).toBe(true);
    });

    it('should emit participant.joined event', () => {
      const participant: Participant = {
        id: 'user-001',
        type: 'human',
        projectId,
        role: 'owner',
        name: 'Alice',
        joinedAt: new Date().toISOString(),
      };

      const context = runtime.getProjectState(projectId);
      const initialCount = context?.events.length || 0;

      runtime.addParticipant(projectId, participant);

      const updated = runtime.getProjectState(projectId);
      const newEvents = (updated?.events || []).slice(initialCount);
      const joinedEvent = newEvents.find((e) => e.name === 'participant.joined');

      expect(joinedEvent).toBeDefined();
      expect(joinedEvent?.participantId).toBe('user-001');
    });
  });

  describe('statistics', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('should provide project statistics', () => {
      const stats = runtime.getProjectStats(projectId);

      expect(stats.projectId).toBe('test-project');
      expect(stats.agentCount).toBe(1);
      expect(stats.participantCount).toBeGreaterThanOrEqual(0);
      expect(stats.runCount).toBe(0);
    });

    it('should update statistics after execution', async () => {
      const statsBefore = runtime.getProjectStats(projectId);

      await runtime.executeRun(projectId, {
        targetKind: 'tool',
        targetId: 'test-tool',
        triggeredBy: 'user-001',
      });

      const statsAfter = runtime.getProjectStats(projectId);

      expect(statsAfter.runCount).toBe(statsBefore.runCount + 1);
      expect(statsAfter.eventCount).toBeGreaterThan(statsBefore.eventCount);
    });
  });

  describe('event-primary hiring workflow', () => {
    let projectId: string;

    beforeEach(async () => {
      const context = await runtime.initializeProject({
        project: testProject,
      });
      projectId = context.project.id;
    });

    it('keeps projection state aligned with canonical events', async () => {
      const recruiter: Participant = {
        id: 'recruiter-001',
        type: 'human',
        projectId,
        role: 'owner',
        name: 'Recruiter',
        joinedAt: new Date().toISOString(),
      };

      const hiringManager: Participant = {
        id: 'manager-001',
        type: 'human',
        projectId,
        role: 'reviewer',
        name: 'Hiring Manager',
        joinedAt: new Date().toISOString(),
      };

      const thread: Thread = {
        id: 'candidate-thread-001',
        projectId,
        status: 'active',
        messages: [],
        createdBy: 'recruiter-001',
        createdAt: new Date().toISOString(),
        participants: ['recruiter-001', 'manager-001', 'test-agent'],
        metadata: {
          nextActionOwner: 'manager-001',
          nextActionType: 'review-candidate-packet',
        },
      };

      const artifact: Artifact = {
        id: 'candidate-packet-001',
        projectId,
        type: 'hiring-packet',
        status: 'draft',
        title: 'Candidate Packet',
        content: {
          candidateId: 'candidate-123',
          scorecard: { communication: 'strong', leadership: 'emerging' },
          status: 'waiting-for-human-review',
        },
        createdBy: 'test-agent',
        version: 1,
        createdAt: new Date().toISOString(),
        metadata: {
          waitingFor: ['manager-001'],
        },
      };

      runtime.addParticipant(projectId, recruiter);
      runtime.addParticipant(projectId, hiringManager);
      await runtime.createThread(projectId, thread);
      await runtime.createArtifact(projectId, artifact);
      await runtime.executeRun(projectId, {
        targetKind: 'agent',
        targetId: 'test-agent',
        triggeredBy: 'recruiter-001',
        input: { task: 'Assemble candidate packet for review' },
      });

      const state = runtime.getProjectState(projectId);
      expect(state).toBeDefined();

      expect(state?.participants.get('manager-001')?.role).toBe('reviewer');
      expect(state?.threads.get('candidate-thread-001')?.thread.metadata?.nextActionType).toBe(
        'review-candidate-packet',
      );
      expect(state?.artifacts.get('candidate-packet-001')?.artifact.content).toEqual({
        candidateId: 'candidate-123',
        scorecard: { communication: 'strong', leadership: 'emerging' },
        status: 'waiting-for-human-review',
      });
      expect(Array.from(state?.runs.values() || [])).toHaveLength(1);
    });

    it('reconstructs hiring workflow state from canonical events alone', async () => {
      const recruiter: Participant = {
        id: 'recruiter-001',
        type: 'human',
        projectId,
        role: 'owner',
        name: 'Recruiter',
        joinedAt: new Date().toISOString(),
      };

      const hiringManager: Participant = {
        id: 'manager-001',
        type: 'human',
        projectId,
        role: 'reviewer',
        name: 'Hiring Manager',
        joinedAt: new Date().toISOString(),
      };

      const thread: Thread = {
        id: 'candidate-thread-001',
        projectId,
        status: 'active',
        messages: [],
        createdBy: 'recruiter-001',
        createdAt: new Date().toISOString(),
        participants: ['recruiter-001', 'manager-001', 'test-agent'],
        metadata: {
          nextActionOwner: 'manager-001',
          nextActionType: 'review-candidate-packet',
        },
      };

      const artifact: Artifact = {
        id: 'candidate-packet-001',
        projectId,
        type: 'hiring-packet',
        status: 'draft',
        title: 'Candidate Packet',
        content: {
          candidateId: 'candidate-123',
          scorecard: { communication: 'strong', leadership: 'emerging' },
          status: 'waiting-for-human-review',
        },
        createdBy: 'test-agent',
        version: 1,
        createdAt: new Date().toISOString(),
        metadata: {
          waitingFor: ['manager-001'],
        },
      };

      runtime.addParticipant(projectId, recruiter);
      runtime.addParticipant(projectId, hiringManager);
      await runtime.createThread(projectId, thread);
      await runtime.createArtifact(projectId, artifact);
      await runtime.executeRun(projectId, {
        targetKind: 'agent',
        targetId: 'test-agent',
        triggeredBy: 'recruiter-001',
        input: { task: 'Assemble candidate packet for review' },
      });

      const state = runtime.getProjectState(projectId);
      const projection = replayProjectEvents(state?.events || []);

      expect(projection.participants.get('manager-001')?.role).toBe('reviewer');
      expect(projection.threads.get('candidate-thread-001')?.thread.participants).toEqual([
        'recruiter-001',
        'manager-001',
        'test-agent',
      ]);
      expect(projection.artifacts.get('candidate-packet-001')?.artifact.content).toEqual({
        candidateId: 'candidate-123',
        scorecard: { communication: 'strong', leadership: 'emerging' },
        status: 'waiting-for-human-review',
      });
      expect(projection.runs.size).toBe(1);
      expect(projection.runs.values().next().value?.metadata?.triggeredBy).toBe('recruiter-001');
      expect(projection.artifacts.get('candidate-packet-001')).toEqual(
        state?.artifacts.get('candidate-packet-001'),
      );
      expect(projection.threads.get('candidate-thread-001')).toEqual(
        state?.threads.get('candidate-thread-001'),
      );
    });
  });
});
