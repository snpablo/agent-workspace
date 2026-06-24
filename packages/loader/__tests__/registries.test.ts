/**
 * Tests for specialized registries
 */

import {
  ToolRegistry,
  SkillRegistry,
  ChannelRegistry,
  ConnectorRegistry,
  ScheduleRegistry,
  AgentCapabilityRegistry,
} from '../src/registries';
import { Tool, Skill, Channel, Connector, Schedule } from '@awp/types';

describe('Registries', () => {
  describe('ToolRegistry', () => {
    let registry: ToolRegistry;
    let httpTool: Tool;
    let connectorTool: Tool;

    beforeEach(() => {
      registry = new ToolRegistry();

      httpTool = {
        kind: 'tool',
        id: 'search-api',
        name: 'Search API',
        version: '1.0.0',
        sourcePath: '/tools/search-api/search-api.yaml',
        implementation: { type: 'http', endpoint: 'https://...' },
      };

      connectorTool = {
        kind: 'tool',
        id: 'database-query',
        name: 'Database Query',
        version: '1.0.0',
        sourcePath: '/tools/database-query/database-query.yaml',
        implementation: { type: 'connector', connector_type: 'postgres' },
      };
    });

    it('should register and retrieve tools', () => {
      registry.register(httpTool);
      expect(registry.get('search-api')).toBe(httpTool);
    });

    it('should find tools by implementation type', () => {
      registry.register(httpTool);
      registry.register(connectorTool);

      const httpTools = registry.getByType('http');
      expect(httpTools).toHaveLength(1);
      expect(httpTools[0].id).toBe('search-api');

      const connectorTools = registry.getByType('connector');
      expect(connectorTools).toHaveLength(1);
      expect(connectorTools[0].id).toBe('database-query');
    });

    it('should find HTTP tools', () => {
      registry.register(httpTool);
      registry.register(connectorTool);

      const httpTools = registry.getHttpTools();
      expect(httpTools).toHaveLength(1);
      expect(httpTools[0].id).toBe('search-api');
    });

    it('should find connector tools', () => {
      registry.register(httpTool);
      registry.register(connectorTool);

      const connectorTools = registry.getConnectorTools();
      expect(connectorTools).toHaveLength(1);
      expect(connectorTools[0].id).toBe('database-query');
    });

    it('should resolve tool references', () => {
      registry.register(httpTool);
      registry.register(connectorTool);

      const resolved = registry.resolve([
        { id: 'search-api' },
        { id: 'database-query' },
        { id: 'non-existent' },
      ]);

      expect(resolved).toHaveLength(2);
      expect(resolved.map((t) => t.id)).toEqual(['search-api', 'database-query']);
    });
  });

  describe('SkillRegistry', () => {
    let toolRegistry: ToolRegistry;
    let skillRegistry: SkillRegistry;
    let tool: Tool;
    let skill: Skill;

    beforeEach(() => {
      toolRegistry = new ToolRegistry();
      skillRegistry = new SkillRegistry(toolRegistry);

      tool = {
        kind: 'tool',
        id: 'search-tool',
        name: 'Search',
        version: '1.0.0',
        sourcePath: '/tools/search/search.yaml',
      };

      skill = {
        kind: 'skill',
        id: 'analysis-skill',
        name: 'Analysis',
        version: '1.0.0',
        sourcePath: '/skills/analysis/analysis.yaml',
        tools: [{ id: 'search-tool' }],
      };

      toolRegistry.register(tool);
      skillRegistry.register(skill);
    });

    it('should get tools for a skill', () => {
      const tools = skillRegistry.getToolsForSkill('analysis-skill');
      expect(tools).toHaveLength(1);
      expect(tools[0].id).toBe('search-tool');
    });

    it('should find skills using a tool', () => {
      const skills = skillRegistry.getSkillsUsingTool('search-tool');
      expect(skills).toHaveLength(1);
      expect(skills[0].id).toBe('analysis-skill');
    });

    it('should resolve skill references', () => {
      const resolved = skillRegistry.resolve([
        { id: 'analysis-skill' },
        { id: 'non-existent' },
      ]);

      expect(resolved).toHaveLength(1);
      expect(resolved[0].id).toBe('analysis-skill');
    });
  });

  describe('ChannelRegistry', () => {
    let registry: ChannelRegistry;
    let slackChannel: Channel;
    let emailChannel: Channel;

    beforeEach(() => {
      registry = new ChannelRegistry();

      slackChannel = {
        kind: 'channel',
        id: 'slack-notifications',
        name: 'Slack Notifications',
        version: '1.0.0',
        sourcePath: '/channels/slack/slack.yaml',
        type: 'slack',
        config: { workspace: 'myworkspace' },
      };

      emailChannel = {
        kind: 'channel',
        id: 'email-alerts',
        name: 'Email Alerts',
        version: '1.0.0',
        sourcePath: '/channels/email/email.yaml',
        type: 'email',
        config: { smtp: 'smtp.example.com' },
      };
    });

    it('should find channels by type', () => {
      registry.register(slackChannel);
      registry.register(emailChannel);

      const slackChannels = registry.getByType('slack');
      expect(slackChannels).toHaveLength(1);
      expect(slackChannels[0].id).toBe('slack-notifications');
    });

    it('should find Slack channels', () => {
      registry.register(slackChannel);
      registry.register(emailChannel);

      const slack = registry.getSlackChannels();
      expect(slack).toHaveLength(1);
    });

    it('should find email channels', () => {
      registry.register(slackChannel);
      registry.register(emailChannel);

      const emails = registry.getEmailChannels();
      expect(emails).toHaveLength(1);
    });
  });

  describe('ConnectorRegistry', () => {
    let registry: ConnectorRegistry;
    let notionConnector: Connector;
    let graphConnector: Connector;

    beforeEach(() => {
      registry = new ConnectorRegistry();

      notionConnector = {
        kind: 'connector',
        id: 'notion-workspace',
        name: 'Notion Workspace',
        version: '1.0.0',
        sourcePath: '/connectors/notion/notion.yaml',
        type: 'notion',
        mode: 'action',
        config: { workspaceId: 'workspace-123' },
      };

      graphConnector = {
        kind: 'connector',
        id: 'microsoft-graph-index',
        name: 'Microsoft Graph Index',
        version: '1.0.0',
        sourcePath: '/connectors/graph/graph.yaml',
        type: 'microsoft_graph',
        mode: 'knowledge',
        config: { tenantId: 'tenant-123' },
      };
    });

    it('should find connectors by type', () => {
      registry.register(notionConnector);
      registry.register(graphConnector);

      const notion = registry.getByType('notion');
      expect(notion).toHaveLength(1);
      expect(notion[0].id).toBe('notion-workspace');
    });

    it('should find action connectors', () => {
      registry.register(notionConnector);
      registry.register(graphConnector);

      const connectors = registry.getActionConnectors();
      expect(connectors).toHaveLength(1);
      expect(connectors[0].id).toBe('notion-workspace');
    });

    it('should find knowledge connectors', () => {
      registry.register(notionConnector);
      registry.register(graphConnector);

      const connectors = registry.getKnowledgeConnectors();
      expect(connectors).toHaveLength(1);
      expect(connectors[0].id).toBe('microsoft-graph-index');
    });
  });

  describe('ScheduleRegistry', () => {
    let registry: ScheduleRegistry;
    let cronSchedule: Schedule;
    let eventSchedule: Schedule;

    beforeEach(() => {
      registry = new ScheduleRegistry();

      cronSchedule = {
        kind: 'schedule',
        id: 'daily-report',
        name: 'Daily Report',
        version: '1.0.0',
        sourcePath: '/schedules/daily-report/daily-report.yaml',
        type: 'cron',
        trigger: { expression: '0 0 * * *' },
      };

      eventSchedule = {
        kind: 'schedule',
        id: 'on-message',
        name: 'On Message',
        version: '1.0.0',
        sourcePath: '/schedules/on-message/on-message.yaml',
        type: 'event',
        trigger: { event: 'message.created' },
      };
    });

    it('should find schedules by type', () => {
      registry.register(cronSchedule);
      registry.register(eventSchedule);

      const crons = registry.getByType('cron');
      expect(crons).toHaveLength(1);
      expect(crons[0].id).toBe('daily-report');
    });

    it('should find cron schedules', () => {
      registry.register(cronSchedule);
      registry.register(eventSchedule);

      const crons = registry.getCronSchedules();
      expect(crons).toHaveLength(1);
    });

    it('should find event schedules', () => {
      registry.register(cronSchedule);
      registry.register(eventSchedule);

      const events = registry.getEventSchedules();
      expect(events).toHaveLength(1);
    });
  });

  describe('AgentCapabilityRegistry', () => {
    let registry: AgentCapabilityRegistry;
    let tool: Tool;
    let skill: Skill;
    let channel: Channel;
    let connector: Connector;
    let schedule: Schedule;

    beforeEach(() => {
      registry = new AgentCapabilityRegistry();

      tool = {
        kind: 'tool',
        id: 'search',
        name: 'Search',
        version: '1.0.0',
        sourcePath: '/tools/search/search.yaml',
      };

      skill = {
        kind: 'skill',
        id: 'analysis',
        name: 'Analysis',
        version: '1.0.0',
        sourcePath: '/skills/analysis/analysis.yaml',
        tools: [{ id: 'search' }],
      };

      channel = {
        kind: 'channel',
        id: 'slack',
        name: 'Slack',
        version: '1.0.0',
        sourcePath: '/channels/slack/slack.yaml',
        type: 'slack',
      };

      connector = {
        kind: 'connector',
        id: 'notion',
        name: 'Notion',
        version: '1.0.0',
        sourcePath: '/connectors/notion/notion.yaml',
        type: 'notion',
        mode: 'action',
      };

      schedule = {
        kind: 'schedule',
        id: 'daily',
        name: 'Daily',
        version: '1.0.0',
        sourcePath: '/schedules/daily/daily.yaml',
        type: 'cron',
      };
    });

    it('should register across all registries', () => {
      registry.tools.register(tool);
      registry.skills.register(skill);
      registry.channels.register(channel);
      registry.connectors.register(connector);
      registry.schedules.register(schedule);

      expect(registry.tools.count()).toBe(1);
      expect(registry.skills.count()).toBe(1);
      expect(registry.channels.count()).toBe(1);
      expect(registry.connectors.count()).toBe(1);
      expect(registry.schedules.count()).toBe(1);
    });

    it('should provide composite statistics', () => {
      registry.tools.register(tool);
      registry.skills.register(skill);
      registry.channels.register(channel);
      registry.connectors.register(connector);
      registry.schedules.register(schedule);

      const stats = registry.getStats();
      expect(stats.tools).toBe(1);
      expect(stats.skills).toBe(1);
      expect(stats.channels).toBe(1);
      expect(stats.connectors).toBe(1);
      expect(stats.schedules).toBe(1);
      expect(stats.sandboxes).toBe(0);
    });

    it('should clear all registries', () => {
      registry.tools.register(tool);
      registry.skills.register(skill);
      registry.channels.register(channel);
      registry.connectors.register(connector);
      registry.schedules.register(schedule);

      registry.clear();

      expect(registry.tools.count()).toBe(0);
      expect(registry.skills.count()).toBe(0);
      expect(registry.channels.count()).toBe(0);
      expect(registry.connectors.count()).toBe(0);
      expect(registry.schedules.count()).toBe(0);
    });
  });
});
