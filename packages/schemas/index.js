/**
 * Schema exports for Agent Workspace Platform
 *
 * This module provides access to all canonical JSON schemas used in the platform.
 * Schemas define the structure and constraints for definitions, runtime objects,
 * and interpreter outputs.
 */

module.exports = {
  // Definition schemas
  workspaceDefinition: require('./workspace-definition.schema.json'),
  artifactDefinition: require('./artifact-definition.schema.json'),
  playbookDefinition: require('./playbook-definition.schema.json'),
  agentDefinition: require('./agent-definition.schema.json'),
  skillDefinition: require('./skill-definition.schema.json'),
  toolDefinition: require('./tool-definition.schema.json'),
  connectorDefinition: require('./connector.schema.json'),

  // Runtime schemas
  workspaceInstance: require('./workspace-instance.schema.json'),
  workItem: require('./work-item.schema.json'),
  artifactInstance: require('./artifact-instance.schema.json'),
  knowledgeSource: require('./knowledge-source.schema.json'),
  action: require('./action.schema.json'),
  thread: require('./thread.schema.json'),
  run: require('./run.schema.json'),
  playbookInstance: require('./playbook-instance.schema.json'),
  agentSession: require('./agent-session.schema.json'),
  event: require('./event.schema.json'),
  participant: require('./participant.schema.json'),

  // Interpreter and shell schemas
  componentTree: require('./component-tree.schema.json'),

  // Policy and permission schemas
  policies: require('./policies.schema.json'),
  permissions: require('./permissions.schema.json'),

  // State schemas
  workspaceState: require('./workspace-state.schema.json'),
};
