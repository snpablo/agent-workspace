/**
 * Definition builders for Agent Workspace Platform
 *
 * Provides fluent builder APIs for constructing workspace, artifact,
 * playbook, and agent definitions with validation and sensible defaults.
 */

import {
  WorkspaceDefinition,
  Zone,
  Binding,
  ArtifactDefinition,
  ArtifactSection,
  PlaybookDefinition,
  PlaybookActivity,
  PlaybookTransition,
  AgentDefinition,
  SkillDefinition,
  ToolDefinition,
  ArtifactReference,
  TypeReference,
} from '@awp/types';

/**
 * Builder for WorkspaceDefinition
 */
export class WorkspaceDefinitionBuilder {
  private def: WorkspaceDefinition;

  constructor(id: string, type: string, version: number = 1) {
    this.def = {
      workspace: {
        id,
        type,
        version,
      },
      zones: [],
      bindings: [],
    };
  }

  displayName(name: string): this {
    this.def.workspace.displayName = name;
    return this;
  }

  layout(layout: string): this {
    this.def.workspace.layout = layout;
    return this;
  }

  addZone(key: string, component: string): this {
    this.def.zones.push({
      key,
      component,
    });
    return this;
  }

  addZoneWithOptions(key: string, component: string, opts: Partial<Zone>): this {
    this.def.zones.push({
      key,
      component,
      ...opts,
    });
    return this;
  }

  addBinding(zone: string, objectKind: string, view: string): this {
    this.def.bindings.push({
      zone,
      objectKind,
      view,
    });
    return this;
  }

  addArtifact(type: string, primary?: boolean): this {
    if (!this.def.artifacts) {
      this.def.artifacts = [];
    }
    this.def.artifacts.push({ type, primary });
    return this;
  }

  addAction(type: string): this {
    if (!this.def.actions) {
      this.def.actions = [];
    }
    this.def.actions.push({ type });
    return this;
  }

  addPlaybook(type: string): this {
    if (!this.def.playbooks) {
      this.def.playbooks = [];
    }
    this.def.playbooks.push({ type });
    return this;
  }

  build(): WorkspaceDefinition {
    if (this.def.zones.length === 0) {
      throw new Error('WorkspaceDefinition must have at least one zone');
    }
    if (this.def.bindings.length === 0) {
      throw new Error('WorkspaceDefinition must have at least one binding');
    }
    return { ...this.def };
  }
}

/**
 * Builder for ArtifactDefinition
 */
export class ArtifactDefinitionBuilder {
  private def: ArtifactDefinition;

  constructor(id: string, type: string, displayName: string, version: number = 1) {
    this.def = {
      id,
      type,
      version,
      displayName,
    };
  }

  description(desc: string): this {
    this.def.description = desc;
    return this;
  }

  addSection(key: string, title: string, sectionType: string): this {
    if (!this.def.sections) {
      this.def.sections = [];
    }
    this.def.sections.push({
      key,
      title,
      type: sectionType,
    });
    return this;
  }

  addSectionWithSchema(key: string, title: string, sectionType: string, schema: Record<string, any>): this {
    if (!this.def.sections) {
      this.def.sections = [];
    }
    this.def.sections.push({
      key,
      title,
      type: sectionType,
      schema,
    });
    return this;
  }

  addRelationship(type: string, targetType: string, cardinality?: string): this {
    if (!this.def.relationships) {
      this.def.relationships = [];
    }
    this.def.relationships.push({
      type,
      targetType,
      cardinality: cardinality as any,
    });
    return this;
  }

  addAction(type: string, title?: string): this {
    if (!this.def.actions) {
      this.def.actions = [];
    }
    this.def.actions.push({
      type,
      title,
    });
    return this;
  }

  setContentSchema(schema: Record<string, any>): this {
    this.def.contentSchema = schema;
    return this;
  }

  build(): ArtifactDefinition {
    return { ...this.def };
  }
}

/**
 * Builder for PlaybookDefinition
 */
export class PlaybookDefinitionBuilder {
  private def: PlaybookDefinition;

  constructor(id: string, type: string, displayName: string, version: number = 1) {
    this.def = {
      id,
      type,
      version,
      displayName,
      activities: [],
    };
  }

  description(desc: string): this {
    this.def.description = desc;
    return this;
  }

  startActivity(activityId: string): this {
    this.def.startActivity = activityId;
    return this;
  }

  addActivity(activity: PlaybookActivity): this {
    this.def.activities.push(activity);
    return this;
  }

  addActivityWithDefaults(id: string, type: string, title?: string): this {
    this.def.activities.push({
      id,
      type,
      title,
    });
    return this;
  }

  addTransition(from: string, to: string, condition?: string): this {
    if (!this.def.transitions) {
      this.def.transitions = [];
    }
    this.def.transitions.push({
      from,
      to,
      condition,
    });
    return this;
  }

  addSkill(skillId: string): this {
    if (!this.def.skills) {
      this.def.skills = [];
    }
    this.def.skills.push({ skillId });
    return this;
  }

  addTool(toolId: string): this {
    if (!this.def.tools) {
      this.def.tools = [];
    }
    this.def.tools.push({ toolId });
    return this;
  }

  setInputSchema(schema: Record<string, any>): this {
    this.def.inputSchema = schema;
    return this;
  }

  setOutputSchema(schema: Record<string, any>): this {
    this.def.outputSchema = schema;
    return this;
  }

  build(): PlaybookDefinition {
    if (this.def.activities.length === 0) {
      throw new Error('PlaybookDefinition must have at least one activity');
    }
    return { ...this.def };
  }
}

/**
 * Builder for AgentDefinition
 */
export class AgentDefinitionBuilder {
  private def: AgentDefinition;

  constructor(id: string, type: string, displayName: string, version: number = 1) {
    this.def = {
      id,
      type,
      version,
      displayName,
    };
  }

  role(role: string): this {
    this.def.role = role;
    return this;
  }

  description(desc: string): this {
    this.def.description = desc;
    return this;
  }

  addSkill(skillId: string): this {
    if (!this.def.skills) {
      this.def.skills = [];
    }
    this.def.skills.push({ skillId });
    return this;
  }

  addTool(toolId: string): this {
    if (!this.def.tools) {
      this.def.tools = [];
    }
    this.def.tools.push({ toolId });
    return this;
  }

  systemPrompt(prompt: string): this {
    this.def.systemPrompt = prompt;
    return this;
  }

  model(model: string): this {
    this.def.model = model;
    return this;
  }

  build(): AgentDefinition {
    return { ...this.def };
  }
}

/**
 * Builder for SkillDefinition
 */
export class SkillDefinitionBuilder {
  private def: SkillDefinition;

  constructor(id: string, type: string, displayName: string, version: number = 1) {
    this.def = {
      id,
      type,
      version,
      displayName,
    };
  }

  description(desc: string): this {
    this.def.description = desc;
    return this;
  }

  addTool(toolId: string): this {
    if (!this.def.tools) {
      this.def.tools = [];
    }
    this.def.tools.push({ toolId });
    return this;
  }

  instructions(instructions: string): this {
    this.def.instructions = instructions;
    return this;
  }

  setInputSchema(schema: Record<string, any>): this {
    this.def.inputSchema = schema;
    return this;
  }

  setOutputSchema(schema: Record<string, any>): this {
    this.def.outputSchema = schema;
    return this;
  }

  build(): SkillDefinition {
    return { ...this.def };
  }
}

/**
 * Builder for ToolDefinition
 */
export class ToolDefinitionBuilder {
  private def: ToolDefinition;

  constructor(id: string, type: string, displayName: string, version: number = 1) {
    this.def = {
      id,
      type,
      version,
      displayName,
    };
  }

  description(desc: string): this {
    this.def.description = desc;
    return this;
  }

  implementation(impl: string): this {
    this.def.implementation = impl;
    return this;
  }

  setParameters(schema: Record<string, any>): this {
    this.def.parameters = schema;
    return this;
  }

  setReturns(schema: Record<string, any>): this {
    this.def.returns = schema;
    return this;
  }

  setPolicy(policy: Record<string, any>): this {
    this.def.policy = policy;
    return this;
  }

  build(): ToolDefinition {
    return { ...this.def };
  }
}
