/**
 * ProjectRepository implementations
 */

import { ProjectState, ProjectRepository } from './types';

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
    this.projects.set(context.project.id, {
      ...context,
      // Create deep copies to prevent mutations
      artifacts: new Map(context.artifacts),
      threads: new Map(context.threads),
      runs: new Map(context.runs),
      agentSessions: new Map(context.agentSessions),
      participants: new Map(context.participants),
      events: [...context.events],
      agents: [...context.agents],
      resources: [...context.resources],
      schedules: [...context.schedules],
    });
  }

  /**
   * Load project context from memory
   */
  async load(projectId: string): Promise<ProjectState | undefined> {
    const context = this.projects.get(projectId);
    if (!context) {
      return undefined;
    }

    // Return copy to prevent external mutations
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
    // In real implementation, would check/create directory
  }

  /**
   * Save project context to file
   */
  async save(context: ProjectState): Promise<void> {
    // In real implementation, would write to JSON file
    // For now, this is a stub
    console.log(`Saving project to ${this.basePath}/${context.project.id}.json`);
  }

  /**
   * Load project context from file
   */
  async load(projectId: string): Promise<ProjectState | undefined> {
    // In real implementation, would read from JSON file
    // For now, this is a stub
    console.log(`Loading project from ${this.basePath}/${projectId}.json`);
    return undefined;
  }

  /**
   * Delete project file
   */
  async delete(projectId: string): Promise<void> {
    // In real implementation, would delete file
    console.log(`Deleting project ${this.basePath}/${projectId}.json`);
  }

  /**
   * List all project files
   */
  async list(): Promise<string[]> {
    // In real implementation, would list files in directory
    console.log(`Listing projects in ${this.basePath}`);
    return [];
  }
}
