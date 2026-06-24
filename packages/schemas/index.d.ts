/**
 * JSON Schema exports for Agent Workspace Platform
 *
 * Each schema is a JSONSchema object that defines the structure and validation
 * constraints for corresponding TypeScript types in @awp/types.
 */

export interface JSONSchema {
  $schema?: string;
  $id?: string;
  title?: string;
  type?: string;
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

/**
 * Definition schemas - declarative descriptions of workspace elements
 */
export declare const workspaceDefinition: JSONSchema;
export declare const artifactDefinition: JSONSchema;
export declare const playbookDefinition: JSONSchema;
export declare const agentDefinition: JSONSchema;
export declare const skillDefinition: JSONSchema;
export declare const toolDefinition: JSONSchema;
export declare const connectorDefinition: JSONSchema;

/**
 * Runtime schemas - live or persisted instances during workspace execution
 */
export declare const workspaceInstance: JSONSchema;
export declare const workItem: JSONSchema;
export declare const artifactInstance: JSONSchema;
export declare const knowledgeSource: JSONSchema;
export declare const action: JSONSchema;
export declare const thread: JSONSchema;
export declare const run: JSONSchema;
export declare const playbookInstance: JSONSchema;
export declare const agentSession: JSONSchema;
export declare const event: JSONSchema;
export declare const participant: JSONSchema;

/**
 * Interpreter and shell schemas
 */
export declare const componentTree: JSONSchema;

/**
 * Policy and permission schemas
 */
export declare const policies: JSONSchema;
export declare const permissions: JSONSchema;

/**
 * State schemas
 */
export declare const workspaceState: JSONSchema;
