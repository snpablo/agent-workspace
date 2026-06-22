/**
 * ProjectRuntime - primary runtime container for project execution
 */

import { randomUUID } from 'crypto';
import {
  Project,
  Agent,
  Tool,
  Skill,
  Run,
  Artifact,
  Thread,
  Resource,
  Participant,
  Event,
  AgentSession,
  Channel,
  Schedule,
} from '@awp/types';
import { PackageRegistry } from '@awp/loader';
import {
  ProjectState,
  ProjectInitOptions,
  RunRequest,
  RunResult,
  ExecutionOptions,
  AgentInstance,
  ArtifactRecord,
  ThreadRecord,
  ScheduleInstance,
} from './types';

/**
 * ProjectRuntime - manages project execution and state
 */
export class ProjectRuntime {
  private contexts: Map<string, ProjectState> = new Map();
  private registry: PackageRegistry;

  constructor(registry: PackageRegistry) {
    this.registry = registry;
  }

  /**
   * Initialize a project context
   */
  async initializeProject(options: ProjectInitOptions): Promise<ProjectState> {
    const projectId = options.project.id;

    // Create context
    const context: ProjectState = {
      project: options.project,
      agents: [],
      resources: options.resources || [],
      artifacts: new Map(),
      threads: new Map(),
      runs: new Map(),
      agentSessions: new Map(),
      participants: new Map(),
      events: [],
      schedules: [],
      metadata: options.metadata,
    };

    // Load agents
    if (options.project.agents) {
      for (const agentRef of options.project.agents) {
        const agent = this.registry.get<Agent>(agentRef.id);
        if (agent) {
          const tools = this.registry.resolveTools(agent);
          const skills = this.registry.resolveSkills(agent);

          context.agents.push({
            agent,
            tools,
            skills,
            status: 'idle',
          });
        }
      }
    }

    // Load resources
    if (options.project.resources) {
      for (const resourceRef of options.project.resources) {
        const resource = this.registry.get<Resource>(resourceRef.id);
        if (resource) {
          context.resources.push(resource);
        }
      }
    }

    // Load schedules
    if (options.project.schedules) {
      for (const scheduleRef of options.project.schedules) {
        const schedule = this.registry.get<Schedule>(scheduleRef.id);
        if (schedule) {
          context.schedules.push({
            schedule,
            active: false,
            executionCount: 0,
          });
        }
      }
    }

    // Add participants
    if (options.participants) {
      for (const participant of options.participants) {
        context.participants.set(participant.id, participant);
      }
    }

    // Store context
    this.contexts.set(projectId, context);

    return context;
  }

  /**
   * Get project context
   */
  getProjectState(projectId: string): ProjectState | undefined {
    return this.contexts.get(projectId);
  }

  /**
   * Execute a run request
   */
  async executeRun(
    projectId: string,
    request: RunRequest,
    options?: ExecutionOptions,
  ): Promise<RunResult> {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const runId = randomUUID();
    const now = new Date().toISOString();

    // Create run record
    const run: Run = {
      id: runId,
      projectId,
      status: 'running',
      startedAt: now,
      targetKind: request.targetKind,
      targetId: request.targetId,
      input: request.input,
      metadata: request.metadata,
    };

    // Store run
    context.runs.set(runId, run);

    // Emit started event
    const startEvent: Event = {
      id: randomUUID(),
      name: 'run.started',
      timestamp: now,
      projectId,
      runId,
      payload: { targetKind: request.targetKind, targetId: request.targetId },
    };

    context.events.push(startEvent);

    try {
      // Execute based on target kind
      let output: Record<string, any> | undefined;
      const artifactsCreated: string[] = [];

      switch (request.targetKind) {
        case 'tool':
          output = await this.executeTool(context, request.targetId, request.input);
          break;

        case 'skill':
          output = await this.executeSkill(context, request.targetId, request.input);
          break;

        case 'agent':
          output = await this.executeAgent(context, request.targetId, request.input);
          break;

        case 'schedule':
          output = await this.executeSchedule(context, request.targetId);
          break;
      }

      // Update run with results
      run.status = 'succeeded';
      run.completedAt = new Date().toISOString();
      run.output = output;

      // Emit succeeded event
      const successEvent: Event = {
        id: randomUUID(),
        name: 'run.succeeded',
        timestamp: new Date().toISOString(),
        projectId,
        runId,
        payload: { output },
      };
      context.events.push(successEvent);

      return {
        run,
        success: true,
        artifactsCreated,
        events: [startEvent, successEvent],
      };
    } catch (error) {
      // Update run with error
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.error = error instanceof Error ? error.message : String(error);

      // Emit failed event
      const failEvent: Event = {
        id: randomUUID(),
        name: 'run.failed',
        timestamp: new Date().toISOString(),
        projectId,
        runId,
        payload: { error: run.error },
      };
      context.events.push(failEvent);

      return {
        run,
        success: false,
        error: run.error,
        artifactsCreated: [],
        events: [startEvent, failEvent],
      };
    }
  }

  /**
   * Execute a tool
   */
  private async executeTool(
    context: ProjectState,
    toolId: string,
    input?: Record<string, any>,
  ): Promise<Record<string, any>> {
    const tool = this.registry.get<Tool>(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }

    // Simulate tool execution
    return {
      toolId: tool.id,
      result: `Executed tool: ${tool.name}`,
      input,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Execute a skill
   */
  private async executeSkill(
    context: ProjectState,
    skillId: string,
    input?: Record<string, any>,
  ): Promise<Record<string, any>> {
    const skill = this.registry.get<Skill>(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    // Skill might use tools
    const tools = this.registry.resolveTools(skill);
    let result: any = {
      skillId: skill.id,
      toolsUsed: tools.map((t) => t.id),
    };

    // Execute each tool
    for (const tool of tools) {
      try {
        const toolResult = await this.executeTool(context, tool.id, input);
        result.toolResults = result.toolResults || {};
        result.toolResults[tool.id] = toolResult;
      } catch (error) {
        // Tool execution failed
        result.errors = result.errors || {};
        result.errors[tool.id] = error instanceof Error ? error.message : String(error);
      }
    }

    return result;
  }

  /**
   * Execute an agent
   */
  private async executeAgent(
    context: ProjectState,
    agentId: string,
    input?: Record<string, any>,
  ): Promise<Record<string, any>> {
    const agentInstance = context.agents.find((a) => a.agent.id === agentId);
    if (!agentInstance) {
      throw new Error(`Agent not found or not loaded: ${agentId}`);
    }

    const agent = agentInstance.agent;

    // Update agent status
    agentInstance.status = 'running';

    try {
      // Simulate agent execution
      // In real implementation, this would invoke the agent model
      const result = {
        agentId: agent.id,
        model: agent.model || 'claude-opus',
        role: agent.role,
        toolsAvailable: agentInstance.tools.map((t) => t.id),
        skillsAvailable: agentInstance.skills.map((s) => s.id),
        execution: {
          started: new Date().toISOString(),
          status: 'completed',
        },
      };

      agentInstance.status = 'idle';
      return result;
    } catch (error) {
      agentInstance.status = 'failed';
      throw error;
    }
  }

  /**
   * Execute a schedule
   */
  private async executeSchedule(
    context: ProjectState,
    scheduleId: string,
  ): Promise<Record<string, any>> {
    const scheduleInstance = context.schedules.find((s) => s.schedule.id === scheduleId);
    if (!scheduleInstance) {
      throw new Error(`Schedule not found: ${scheduleId}`);
    }

    const schedule = scheduleInstance.schedule;

    // Update execution metadata
    scheduleInstance.lastExecutedAt = new Date().toISOString();
    scheduleInstance.executionCount++;

    return {
      scheduleId: schedule.id,
      type: schedule.type,
      executionCount: scheduleInstance.executionCount,
      lastExecuted: scheduleInstance.lastExecutedAt,
    };
  }

  /**
   * Create an artifact
   */
  async createArtifact(projectId: string, artifact: Artifact): Promise<Artifact> {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const now = new Date().toISOString();

    // Store artifact
    const record: ArtifactRecord = {
      artifact: {
        ...artifact,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      versions: [
        {
          id: randomUUID(),
          artifactId: artifact.id,
          version: 1,
          content: artifact.content,
          createdAt: now,
          createdBy: artifact.createdBy,
        },
      ],
      editors: [artifact.createdBy],
      lastModified: now,
    };

    context.artifacts.set(artifact.id, record);

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'artifact.created',
      timestamp: now,
      projectId,
      artifactId: artifact.id,
      payload: { type: artifact.type },
    };
    context.events.push(event);

    return record.artifact;
  }

  /**
   * Add participant to project
   */
  addParticipant(projectId: string, participant: Participant): void {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    context.participants.set(participant.id, participant);

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'participant.joined',
      timestamp: new Date().toISOString(),
      projectId,
      participantId: participant.id,
      payload: { role: participant.role },
    };
    context.events.push(event);
  }

  /**
   * Add resource to project
   */
  addResource(projectId: string, resource: Resource): void {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    context.resources.push(resource);

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'resource.added',
      timestamp: new Date().toISOString(),
      projectId,
      payload: { resourceId: resource.id, type: resource.type },
    };
    context.events.push(event);
  }

  /**
   * Create a thread
   */
  async createThread(projectId: string, thread: Thread): Promise<Thread> {
    const context = this.contexts.get(projectId);
    if (!context) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const threadRecord: ThreadRecord = {
      thread: {
        ...thread,
        createdAt: new Date().toISOString(),
      },
      messageCount: 0,
      participants: thread.participants || [],
      lastMessageAt: undefined,
    };

    context.threads.set(thread.id, threadRecord);

    // Emit event
    const event: Event = {
      id: randomUUID(),
      name: 'thread.created',
      timestamp: new Date().toISOString(),
      projectId,
      threadId: thread.id,
    };
    context.events.push(event);

    return threadRecord.thread;
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId: string): Record<string, any> {
    const context = this.contexts.get(projectId);
    if (!context) {
      return {};
    }

    return {
      projectId,
      agentCount: context.agents.length,
      resourceCount: context.resources.length,
      artifactCount: context.artifacts.size,
      threadCount: context.threads.size,
      runCount: context.runs.size,
      participantCount: context.participants.size,
      eventCount: context.events.length,
      scheduleCount: context.schedules.length,
    };
  }
}
