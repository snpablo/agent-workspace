/**
 * ProjectRepository implementations
 */

import { mkdir, readFile, readdir, rename, rm, writeFile } from 'fs/promises';
import * as path from 'path';
import { ProjectState, ProjectRepository } from './types';
import { replayProjectEvents } from './event-projection';

interface SerializedProjectState {
  projectionVersion?: number;
  project: ProjectState['project'];
  agents: ProjectState['agents'];
  resources: ProjectState['resources'];
  artifacts: Array<[string, ProjectState['artifacts'] extends Map<string, infer T> ? T : never]>;
  threads: Array<[string, ProjectState['threads'] extends Map<string, infer T> ? T : never]>;
  runs: Array<[string, ProjectState['runs'] extends Map<string, infer T> ? T : never]>;
  agentSessions: Array<[string, ProjectState['agentSessions'] extends Map<string, infer T> ? T : never]>;
  participants: Array<[string, ProjectState['participants'] extends Map<string, infer T> ? T : never]>;
  events: ProjectState['events'];
  schedules: ProjectState['schedules'];
  metadata?: ProjectState['metadata'];
}

function cloneProjectState(context: ProjectState): ProjectState {
  return {
    ...context,
    artifacts: new Map(context.artifacts),
    threads: new Map(context.threads),
    runs: new Map(context.runs),
    agentSessions: new Map(context.agentSessions),
    participants: new Map(context.participants),
    events: [...context.events],
    agents: [...context.agents],
    resources: [...context.resources],
    schedules: [...context.schedules],
  };
}

function serializeProjectState(context: ProjectState): SerializedProjectState {
  return {
    projectionVersion: 1,
    project: context.project,
    agents: context.agents,
    resources: context.resources,
    artifacts: Array.from(context.artifacts.entries()),
    threads: Array.from(context.threads.entries()),
    runs: Array.from(context.runs.entries()),
    agentSessions: Array.from(context.agentSessions.entries()),
    participants: Array.from(context.participants.entries()),
    events: context.events,
    schedules: context.schedules,
    metadata: context.metadata,
  };
}

function deserializeProjectState(serialized: SerializedProjectState): ProjectState {
  const projection = replayProjectEvents(serialized.events || []);

  return {
    project: serialized.project,
    agents: serialized.agents,
    resources: projection.resources.length > 0 ? projection.resources : serialized.resources,
    artifacts:
      projection.artifacts.size > 0 ? projection.artifacts : new Map(serialized.artifacts),
    threads: projection.threads.size > 0 ? projection.threads : new Map(serialized.threads),
    runs: projection.runs.size > 0 ? projection.runs : new Map(serialized.runs),
    agentSessions:
      projection.agentSessions.size > 0
        ? projection.agentSessions
        : new Map(serialized.agentSessions),
    participants:
      projection.participants.size > 0
        ? projection.participants
        : new Map(serialized.participants),
    events: serialized.events || [],
    schedules: serialized.schedules,
    metadata: serialized.metadata,
  };
}

/**
 * In-memory repository for projects
 * Useful for testing and single-process deployments
 */
export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Map<string, ProjectState> = new Map();

  /**
   * Save project context to memory
   */
  async save(context: ProjectState): Promise<void> {
    this.projects.set(context.project.id, cloneProjectState(context));
  }

  /**
   * Load project context from memory
   */
  async load(projectId: string): Promise<ProjectState | undefined> {
    const context = this.projects.get(projectId);
    if (!context) {
      return undefined;
    }

    return cloneProjectState(context);
  }

  /**
   * Delete project
   */
  async delete(projectId: string): Promise<void> {
    this.projects.delete(projectId);
  }

  /**
   * List all project IDs
   */
  async list(): Promise<string[]> {
    return Array.from(this.projects.keys());
  }

  /**
   * Clear all projects (for testing)
   */
  clear(): void {
    this.projects.clear();
  }

  /**
   * Get all projects (for testing/debugging)
   */
  getAll(): ProjectState[] {
    return Array.from(this.projects.values());
  }
}

/**
 * File-based repository for projects
 * Persists to JSON files on disk
 */
export class FileProjectRepository implements ProjectRepository {
  constructor(private basePath: string = './projects') {
  }

  private getProjectFilePath(projectId: string): string {
    return path.join(this.basePath, `${projectId}.json`);
  }

  /**
   * Save project context to file
   */
  async save(context: ProjectState): Promise<void> {
    await mkdir(this.basePath, { recursive: true });

    const filePath = this.getProjectFilePath(context.project.id);
    const tempPath = `${filePath}.tmp`;
    const serialized = serializeProjectState(context);

    await writeFile(tempPath, JSON.stringify(serialized, null, 2), 'utf-8');
    await rename(tempPath, filePath);
  }

  /**
   * Load project context from file
   */
  async load(projectId: string): Promise<ProjectState | undefined> {
    const filePath = this.getProjectFilePath(projectId);

    try {
      const contents = await readFile(filePath, 'utf-8');
      const serialized = JSON.parse(contents) as SerializedProjectState;
      return cloneProjectState(deserializeProjectState(serialized));
    } catch (error) {
      const fileError = error as NodeJS.ErrnoException;
      if (fileError.code === 'ENOENT') {
        return undefined;
      }

      throw error;
    }
  }

  /**
   * Delete project file
   */
  async delete(projectId: string): Promise<void> {
    try {
      await rm(this.getProjectFilePath(projectId));
    } catch (error) {
      const fileError = error as NodeJS.ErrnoException;
      if (fileError.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * List all project files
   */
  async list(): Promise<string[]> {
    try {
      const files = await readdir(this.basePath, { withFileTypes: true });
      return files
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => entry.name.replace(/\.json$/, ''))
        .sort();
    } catch (error) {
      const fileError = error as NodeJS.ErrnoException;
      if (fileError.code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }
}
