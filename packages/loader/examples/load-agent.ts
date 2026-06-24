/**
 * Example: Load and inspect an Agent package
 */

import { AgentLoader, getAgentSummary } from '../src';

/**
 * Load and inspect an agent package
 */
async function loadAgentPackage(agentPath: string) {
  console.log(`📦 Loading Agent Package: ${agentPath}\n`);

  const loader = new AgentLoader(agentPath);

  // Load with registries
  const { agentDefinition, registries, structure } = await loader.loadWithRegistries();

  console.log(`✓ Agent loaded: ${agentDefinition.name}\n`);

  // Print agent info
  console.log('🎯 Agent Definition:');
  console.log(`  ID: ${agentDefinition.id}`);
  console.log(`  Name: ${agentDefinition.name}`);
  console.log(`  Model: ${agentDefinition.model || 'not specified'}`);
  console.log(`  Role: ${agentDefinition.role || 'not specified'}`);
  console.log();

  // Print agent instructions preview
  if (agentDefinition.instructions) {
    const preview = agentDefinition.instructions.substring(0, 100);
    console.log('📝 Instructions:');
    console.log(`  ${preview}${agentDefinition.instructions.length > 100 ? '...' : ''}`);
    console.log();
  }

  // Print tools
  console.log('🔨 Tools:');
  const tools = registries.tools.getAll();
  if (tools.length === 0) {
    console.log('  (none)');
  } else {
    for (const tool of tools) {
      console.log(`  - ${tool.id} (${tool.name})`);
      if (tool.implementation) {
        const impl = tool.implementation as any;
        console.log(`    Type: ${impl.type}`);
      }
    }
  }
  console.log();

  // Print skills
  console.log('🎯 Skills:');
  const skills = registries.skills.getAll();
  if (skills.length === 0) {
    console.log('  (none)');
  } else {
    for (const skill of skills) {
      console.log(`  - ${skill.id} (${skill.name})`);

      // Show tools used by skill
      const toolsForSkill = registries.skills.getToolsForSkill(skill.id);
      if (toolsForSkill.length > 0) {
        console.log(`    Tools: ${toolsForSkill.map((t) => t.id).join(', ')}`);
      }

      // Show skills composed by this skill
      if (skill.skills && skill.skills.length > 0) {
        console.log(`    Skills: ${skill.skills.map((s) => s.id).join(', ')}`);
      }
    }
  }
  console.log();

  // Print channels
  console.log('📡 Channels:');
  const channels = registries.channels.getAll();
  if (channels.length === 0) {
    console.log('  (none)');
  } else {
    for (const channel of channels) {
      console.log(`  - ${channel.id} (${channel.type})`);
    }
  }
  console.log();

  // Print connectors
  console.log('🔌 Connectors:');
  const connectors = registries.connectors.getAll();
  if (connectors.length === 0) {
    console.log('  (none)');
  } else {
    for (const connector of connectors) {
      console.log(`  - ${connector.id} (${connector.type}${connector.mode ? ` / ${connector.mode}` : ''})`);
    }
  }
  console.log();

  // Print schedules
  console.log('⏰ Schedules:');
  const schedules = registries.schedules.getAll();
  if (schedules.length === 0) {
    console.log('  (none)');
  } else {
    for (const schedule of schedules) {
      console.log(`  - ${schedule.id} (${schedule.type})`);
    }
  }
  console.log();

  // Print sandboxes
  console.log('🏝️ Sandboxes:');
  const sandboxes = registries.sandboxes.getAll();
  if (sandboxes.length === 0) {
    console.log('  (none)');
  } else {
    for (const sandbox of sandboxes) {
      console.log(`  - ${sandbox.id}`);
      if (sandbox.limits) {
        console.log(`    Memory: ${sandbox.limits.memoryMb}MB`);
        console.log(`    Timeout: ${sandbox.limits.timeoutSeconds}s`);
      }
    }
  }
  console.log();

  // Print stats
  console.log('📊 Statistics:');
  const summary = getAgentSummary(structure);
  console.log(`  Tools: ${summary.toolCount}`);
  console.log(`  Skills: ${summary.skillCount}`);
  console.log(`  Channels: ${summary.channelCount}`);
  console.log(`  Connectors: ${summary.connectorCount}`);
  console.log(`  Schedules: ${summary.scheduleCount}`);
  console.log(`  Sandboxes: ${summary.sandboxCount}`);

  if (summary.errors > 0) {
    console.log(`  ⚠️ Errors: ${summary.errors}`);

    console.log('\n⚠️ Errors:');
    for (const error of structure.errors) {
      console.log(`  ${error.directory}: ${error.error}`);
    }
  }

  // Print registry stats
  console.log();
  console.log('📈 Registry Stats:');
  const stats = registries.getStats();
  for (const [key, value] of Object.entries(stats)) {
    console.log(`  ${key}: ${value}`);
  }

  return { agentDefinition, registries, structure };
}

/**
 * Show agent capability analysis
 */
function analyzeCapabilities(agentPath: string, registries: any) {
  console.log('\n🔍 Capability Analysis:\n');

  // Tools by implementation type
  console.log('Tools by implementation:');
  const httpTools = registries.tools.getHttpTools();
  if (httpTools.length > 0) console.log(`  HTTP API: ${httpTools.length}`);

  const connectorTools = registries.tools.getConnectorTools();
  if (connectorTools.length > 0) console.log(`  Connector: ${connectorTools.length}`);

  const mcpTools = registries.tools.getMcpTools();
  if (mcpTools.length > 0) console.log(`  MCP: ${mcpTools.length}`);

  const functionTools = registries.tools.getFunctionTools();
  if (functionTools.length > 0) console.log(`  Function: ${functionTools.length}`);

  const serviceTools = registries.tools.getPlatformServiceTools();
  if (serviceTools.length > 0) console.log(`  Platform Service: ${serviceTools.length}`);

  // Channels by type
  if (registries.channels.count() > 0) {
    console.log('\nChannels by type:');
    const slackChannels = registries.channels.getSlackChannels();
    if (slackChannels.length > 0) console.log(`  Slack: ${slackChannels.length}`);

    const emailChannels = registries.channels.getEmailChannels();
    if (emailChannels.length > 0) console.log(`  Email: ${emailChannels.length}`);

    const httpChannels = registries.channels.getHttpChannels();
    if (httpChannels.length > 0) console.log(`  HTTP: ${httpChannels.length}`);
  }

  if (registries.connectors.count() > 0) {
    console.log('\nConnectors by mode:');
    const actionConnectors = registries.connectors.getActionConnectors();
    if (actionConnectors.length > 0) console.log(`  Action: ${actionConnectors.length}`);

    const knowledgeConnectors = registries.connectors.getKnowledgeConnectors();
    if (knowledgeConnectors.length > 0) console.log(`  Knowledge: ${knowledgeConnectors.length}`);
  }

  // Schedules by type
  if (registries.schedules.count() > 0) {
    console.log('\nSchedules by type:');
    const cronSchedules = registries.schedules.getCronSchedules();
    if (cronSchedules.length > 0) console.log(`  Cron: ${cronSchedules.length}`);

    const eventSchedules = registries.schedules.getEventSchedules();
    if (eventSchedules.length > 0) console.log(`  Event: ${eventSchedules.length}`);

    const manualSchedules = registries.schedules.getManualSchedules();
    if (manualSchedules.length > 0) console.log(`  Manual: ${manualSchedules.length}`);
  }
}

/**
 * Run the example
 */
async function runExample() {
  try {
    const agentPath = './docs/examples/decision-project/agents/decision-analyzer';
    const result = await loadAgentPackage(agentPath);

    analyzeCapabilities(agentPath, result.registries);

    console.log('\n✓ Agent package inspection completed');
  } catch (error) {
    console.error('Error loading agent:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runExample();
}

export { loadAgentPackage, analyzeCapabilities };
