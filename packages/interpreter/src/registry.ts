/**
 * Component and view registries for the interpreter
 *
 * Manages the registration and retrieval of component definitions and
 * view definitions used during binding resolution.
 */

import { ComponentDefinition, ViewDefinition } from '@awp/types';

/**
 * Component registry - stores all available component definitions
 */
export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();

  /**
   * Register a component
   */
  register(component: ComponentDefinition): void {
    this.components.set(component.key, component);
  }

  /**
   * Register multiple components
   */
  registerBatch(components: ComponentDefinition[]): void {
    components.forEach((comp) => this.register(comp));
  }

  /**
   * Get a component by key
   */
  get(key: string): ComponentDefinition | undefined {
    return this.components.get(key);
  }

  /**
   * Get all components
   */
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  /**
   * Check if component exists
   */
  has(key: string): boolean {
    return this.components.has(key);
  }

  /**
   * Get all components of a specific type
   */
  getByType(type: string): ComponentDefinition[] {
    return this.getAll().filter((comp) => comp.type === type);
  }

  /**
   * Export registry as object
   */
  toObject(): Record<string, ComponentDefinition> {
    return Object.fromEntries(this.components);
  }
}

/**
 * View registry - stores all available view definitions
 */
export class ViewRegistry {
  private views: Map<string, ViewDefinition> = new Map();

  /**
   * Register a view
   * Key format: "objectKind:viewKey" e.g., "artifact:editor"
   */
  register(view: ViewDefinition): void {
    const key = `${view.objectKind}:${view.key}`;
    this.views.set(key, view);
  }

  /**
   * Register multiple views
   */
  registerBatch(views: ViewDefinition[]): void {
    views.forEach((view) => this.register(view));
  }

  /**
   * Get a view by objectKind and key
   */
  get(objectKind: string, key: string): ViewDefinition | undefined {
    return this.views.get(`${objectKind}:${key}`);
  }

  /**
   * Get all views for an object kind
   */
  getByObjectKind(objectKind: string): ViewDefinition[] {
    return Array.from(this.views.values()).filter((view) => view.objectKind === objectKind);
  }

  /**
   * Get all views
   */
  getAll(): ViewDefinition[] {
    return Array.from(this.views.values());
  }

  /**
   * Check if view exists
   */
  has(objectKind: string, key: string): boolean {
    return this.views.has(`${objectKind}:${key}`);
  }

  /**
   * Get all views for a component
   */
  getByComponent(componentKey: string): ViewDefinition[] {
    return this.getAll().filter((view) => view.component === componentKey);
  }

  /**
   * Export registry as object
   */
  toObject(): Record<string, ViewDefinition> {
    return Object.fromEntries(this.views);
  }
}

/**
 * Default component registry - canonical workspace shell components
 */
export function createDefaultComponentRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  const components: ComponentDefinition[] = [
    {
      key: 'Header',
      name: 'Workspace Header',
      type: 'container',
      description: 'Header zone containing workspace metadata and controls',
      children: [],
    },
    {
      key: 'Queue',
      name: 'Work Queue',
      type: 'container',
      description: 'Queue zone for work items and tasks',
      children: [],
    },
    {
      key: 'AssistantSurface',
      name: 'Assistant Surface',
      type: 'container',
      description: 'Surface for AI assistant interaction',
      children: [],
    },
    {
      key: 'ArtifactSurface',
      name: 'Artifact Surface',
      type: 'container',
      description: 'Primary surface for artifact display and editing',
      children: [],
    },
    {
      key: 'KnowledgePanel',
      name: 'Knowledge Panel',
      type: 'panel',
      description: 'Panel for knowledge sources and references',
      children: [],
    },
    {
      key: 'AgentPanel',
      name: 'Agent Panel',
      type: 'panel',
      description: 'Panel for agent activity and control',
      children: [],
    },
    {
      key: 'ActionPanel',
      name: 'Action Panel',
      type: 'panel',
      description: 'Panel for actions and next steps',
      children: [],
    },
    {
      key: 'ActivityTimeline',
      name: 'Activity Timeline',
      type: 'panel',
      description: 'Timeline of workspace activity and events',
      children: [],
    },
    {
      key: 'ModalSurface',
      name: 'Modal Surface',
      type: 'overlay',
      description: 'Modal overlay for dialogs and temporary content',
      children: [],
    },
  ];

  registry.registerBatch(components);
  return registry;
}

/**
 * Default view registry - canonical workspace shell views
 */
export function createDefaultViewRegistry(): ViewRegistry {
  const registry = new ViewRegistry();

  const views: ViewDefinition[] = [
    {
      key: 'queue_view',
      name: 'Work Item Queue View',
      objectKind: 'work_item',
      component: 'Queue',
      description: 'Default view for work items in the queue zone',
    },
    {
      key: 'editor_view',
      name: 'Artifact Editor View',
      objectKind: 'artifact',
      component: 'ArtifactSurface',
      description: 'Default view for artifact editing and display',
    },
    {
      key: 'list_view',
      name: 'Knowledge Sources List View',
      objectKind: 'knowledge_source',
      component: 'KnowledgePanel',
      description: 'Default view for knowledge sources',
    },
    {
      key: 'activity_view',
      name: 'Agent Activity View',
      objectKind: 'agent_session',
      component: 'AgentPanel',
      description: 'Default view for agent activity and control',
    },
    {
      key: 'actions_view',
      name: 'Actions List View',
      objectKind: 'action',
      component: 'ActionPanel',
      description: 'Default view for pending and in-progress actions',
    },
    {
      key: 'timeline_view',
      name: 'Event Timeline View',
      objectKind: 'event',
      component: 'ActivityTimeline',
      description: 'Default view for workspace events and activity timeline',
    },
  ];

  registry.registerBatch(views);
  return registry;
}
