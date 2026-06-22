/**
 * Tool provider implementations
 */

import { Tool } from '@awp/types';
import { ToolProvider, ToolExecutionRequest, ToolExecutionResult, ProviderConfig } from './types';

/**
 * Base class for tool providers
 */
export abstract class BaseToolProvider implements ToolProvider {
  abstract type: string;
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract canHandle(tool: Tool): boolean;

  abstract execute(request: ToolExecutionRequest): Promise<ToolExecutionResult>;

  /**
   * Default validation - check for required fields
   */
  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tool.id) {
      errors.push('Tool must have an id');
    }

    if (!tool.implementation) {
      errors.push('Tool must have implementation config');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  getMetadata(): Record<string, any> {
    return {
      type: this.type,
      config: this.config,
    };
  }

  protected getExecutionConfig(): Record<string, any> {
    return this.config.config || {};
  }
}

/**
 * Provider for HTTP/API-backed tools
 */
export class ApiToolProvider extends BaseToolProvider {
  type = 'http';

  canHandle(tool: Tool): boolean {
    if (!tool.implementation) return false;
    const impl = tool.implementation as any;
    return impl.type === 'http' || impl.type === 'api';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate HTTP call
      const result = {
        success: true,
        output: {
          api_endpoint: impl.endpoint,
          method: impl.method || 'POST',
          request_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          input_received: request.input,
        },
        metadata: {
          provider: 'api',
          executionTime: Math.random() * 1000,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'api' },
      };
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = tool.implementation as any;
    if (!impl.endpoint) {
      errors.push('HTTP tool must have endpoint');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for connector-backed tools (databases, SaaS)
 */
export class ConnectorToolProvider extends BaseToolProvider {
  type = 'connector';

  canHandle(tool: Tool): boolean {
    if (!tool.implementation) return false;
    const impl = tool.implementation as any;
    return impl.type === 'connector';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate connector call
      const result = {
        success: true,
        output: {
          connector_type: impl.connector_type,
          connection_id: Math.random().toString(36).substring(7),
          rows_affected: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString(),
          query_result: [
            { id: '1', name: 'Row 1' },
            { id: '2', name: 'Row 2' },
          ],
        },
        metadata: {
          provider: 'connector',
          executionTime: Math.random() * 500,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'connector' },
      };
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = tool.implementation as any;
    if (!impl.connector_type) {
      errors.push('Connector tool must specify connector_type');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for MCP server-backed tools
 */
export class McpToolProvider extends BaseToolProvider {
  type = 'mcp';

  canHandle(tool: Tool): boolean {
    if (!tool.implementation) return false;
    const impl = tool.implementation as any;
    return impl.type === 'mcp';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate MCP call
      const result = {
        success: true,
        output: {
          server: impl.server,
          capabilities: impl.capabilities || [],
          session_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          mcp_response: {
            status: 'ok',
            data: request.input,
          },
        },
        metadata: {
          provider: 'mcp',
          executionTime: Math.random() * 800,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'mcp' },
      };
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = tool.implementation as any;
    if (!impl.server) {
      errors.push('MCP tool must specify server');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for native code-backed tools
 */
export class NativeToolProvider extends BaseToolProvider {
  type = 'function';

  canHandle(tool: Tool): boolean {
    if (!tool.implementation) return false;
    const impl = tool.implementation as any;
    return impl.type === 'function' || impl.type === 'code';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate function call
      const result = {
        success: true,
        output: {
          language: impl.language || 'python',
          module: impl.module,
          function: impl.function,
          execution_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          result: {
            computed: true,
            value: this.computeResult(request.input),
          },
        },
        metadata: {
          provider: 'function',
          executionTime: Math.random() * 300,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'function' },
      };
    }
  }

  private computeResult(input: Record<string, any>): any {
    // Simple computation simulation
    if (input.numbers && Array.isArray(input.numbers)) {
      return input.numbers.reduce((a: number, b: number) => a + b, 0);
    }
    return Object.values(input).length;
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = tool.implementation as any;
    if (!impl.module && !impl.function) {
      errors.push('Function tool must specify module or function');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Provider for platform service-backed tools
 */
export class PlatformServiceToolProvider extends BaseToolProvider {
  type = 'platform_service';

  canHandle(tool: Tool): boolean {
    if (!tool.implementation) return false;
    const impl = tool.implementation as any;
    return impl.type === 'platform_service' || impl.type === 'service';
  }

  async execute(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    try {
      const impl = this.getExecutionConfig();

      // Simulate platform service call
      const result = {
        success: true,
        output: {
          service: impl.service,
          operation: impl.operation,
          service_id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          service_response: {
            status: 'success',
            data: request.input,
          },
        },
        metadata: {
          provider: 'platform_service',
          executionTime: Math.random() * 200,
        },
      };

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: { provider: 'platform_service' },
      };
    }
  }

  validate(tool: Tool): { valid: boolean; errors: string[] } {
    const baseValidation = super.validate(tool);
    const errors = [...baseValidation.errors];

    const impl = tool.implementation as any;
    if (!impl.service) {
      errors.push('Platform service tool must specify service');
    }

    if (!impl.operation) {
      errors.push('Platform service tool must specify operation');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
