/**
 * Example: Execute a project with agents, tools, and artifact creation
 */

import { ProjectRuntime } from '../src/project-runtime';
import { PackageLoader, PackageRegistry } from '@awp/loader';
import { Participant } from '@awp/types';

/**
 * Execute a complete project scenario
 */
async function executeProject() {
  console.log('📋 Project Execution Example\n');

  // Step 1: Load packages
  console.log('Loading packages...');
  const loader = new PackageLoader({
    rootPath: './docs/examples/decision-project',
    recursive: true,
  });

  const discovery = await loader.discover();
  const registry = new PackageRegistry(discovery.packages);

  console.log(`✓ Loaded ${discovery.count} packages\n`);

  // Step 2: Create runtime
  const runtime = new ProjectRuntime(registry);

  // Step 3: Get project
  const project = registry.get('decision-project');
  if (!project) {
    console.error('Project not found');
    return;
  }

  console.log(`🏗 Project: ${project.name} (${project.id})`);
  console.log(`  Version: ${project.version}\n`);

  // Step 4: Initialize project context
  console.log('Initializing project...');
  const context = await runtime.initializeProject({
    project,
    participants: [
      {
        id: 'user-001',
        type: 'human',
        projectId: project.id,
        role: 'owner',
        name: 'Alice',
        email: 'alice@example.com',
        joinedAt: new Date().toISOString(),
      },
    ],
  });

  console.log(`✓ Initialized project\n`);

  // Step 5: Show project composition
  console.log('📦 Project Composition:');
  console.log(`  Agents: ${context.agents.length}`);
  for (const agent of context.agents) {
    console.log(`    - ${agent.agent.id} (${agent.agent.name})`);
    console.log(`      Tools: ${agent.tools.length}, Skills: ${agent.skills.length}`);
  }

  console.log(`  Resources: ${context.resources.length}`);
  for (const resource of context.resources) {
    console.log(`    - ${resource.id} (${resource.type})`);
  }

  console.log(`  Schedules: ${context.schedules.length}\n`);

  // Step 6: Execute tools
  console.log('🔨 Executing Tools:\n');

  // Find a tool to execute
  if (context.agents.length > 0 && context.agents[0].tools.length > 0) {
    const tool = context.agents[0].tools[0];
    console.log(`Executing tool: ${tool.name}`);

    const toolResult = await runtime.executeRun(project.id, {
      targetKind: 'tool',
      targetId: tool.id,
      triggeredBy: 'user-001',
      input: { query: 'test query' },
    });

    console.log(`  Status: ${toolResult.success ? '✓ Success' : '✗ Failed'}`);
    if (toolResult.run.output) {
      console.log(`  Output:`, toolResult.run.output.result);
    }
    console.log();
  }

  // Step 7: Execute skill
  console.log('🎯 Executing Skills:\n');

  if (context.agents.length > 0 && context.agents[0].skills.length > 0) {
    const skill = context.agents[0].skills[0];
    console.log(`Executing skill: ${skill.name}`);

    const skillResult = await runtime.executeRun(project.id, {
      targetKind: 'skill',
      targetId: skill.id,
      triggeredBy: 'user-001',
    });

    console.log(`  Status: ${skillResult.success ? '✓ Success' : '✗ Failed'}`);
    console.log(`  Events: ${skillResult.events.length}`);
    console.log();
  }

  // Step 8: Execute agent
  console.log('👤 Executing Agent:\n');

  if (context.agents.length > 0) {
    const agent = context.agents[0];
    console.log(`Executing agent: ${agent.agent.name}`);

    const agentResult = await runtime.executeRun(project.id, {
      targetKind: 'agent',
      targetId: agent.agent.id,
      triggeredBy: 'user-001',
      input: { task: 'Analyze the decision' },
    });

    console.log(`  Status: ${agentResult.success ? '✓ Success' : '✗ Failed'}`);
    console.log(`  Output:`, agentResult.run.output?.model);
    console.log();
  }

  // Step 9: Create artifact
  console.log('📄 Creating Artifacts:\n');

  const artifact = await runtime.createArtifact(project.id, {
    id: 'decision-analysis-001',
    projectId: project.id,
    type: 'decision-analysis',
    status: 'draft',
    title: 'Strategic Decision Analysis',
    content: {
      decision: 'Whether to expand into new market',
      options: ['Option A', 'Option B'],
      analysis: 'Detailed analysis here...',
    },
    version: 1,
    createdBy: 'agent-analyzer',
    createdAt: new Date().toISOString(),
  });

  console.log(`✓ Created artifact: ${artifact.id}`);
  console.log(`  Type: ${artifact.type}`);
  console.log(`  Status: ${artifact.status}\n`);

  // Step 10: Create thread
  console.log('💬 Creating Threads:\n');

  const thread = await runtime.createThread(project.id, {
    id: 'thread-001',
    projectId: project.id,
    status: 'active',
    targetKind: 'artifact',
    targetId: artifact.id,
    messages: [],
    createdAt: new Date().toISOString(),
    createdBy: 'user-001',
    participants: ['user-001'],
  });

  console.log(`✓ Created thread: ${thread.id}`);
  console.log(`  Discussing: ${thread.targetKind}/${thread.targetId}\n`);

  // Step 11: Add participant
  console.log('👥 Managing Participants:\n');

  const newParticipant: Participant = {
    id: 'agent-001',
    type: 'agent',
    projectId: project.id,
    role: 'editor',
    name: 'Decision Analyzer Agent',
    joinedAt: new Date().toISOString(),
  };

  runtime.addParticipant(project.id, newParticipant);
  console.log(`✓ Added participant: ${newParticipant.name}\n`);

  // Step 12: Show project statistics
  console.log('📊 Project Statistics:\n');
  const stats = runtime.getProjectStats(project.id);
  console.log(`  Agents: ${stats.agentCount}`);
  console.log(`  Resources: ${stats.resourceCount}`);
  console.log(`  Artifacts: ${stats.artifactCount}`);
  console.log(`  Threads: ${stats.threadCount}`);
  console.log(`  Runs: ${stats.runCount}`);
  console.log(`  Participants: ${stats.participantCount}`);
  console.log(`  Events: ${stats.eventCount}`);
  console.log(`  Schedules: ${stats.scheduleCount}\n`);

  // Step 13: Show events
  console.log('📋 Events:\n');
  const eventContext = runtime.getProjectContext(project.id);
  if (eventContext) {
    const recentEvents = eventContext.events.slice(-5);
    for (const event of recentEvents) {
      console.log(`  [${event.timestamp}] ${event.name}`);
    }
  }
}

/**
 * Run the example
 */
async function runExample() {
  try {
    await executeProject();
    console.log('\n✓ Project execution example completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runExample();
}

export { executeProject };
