# @awp/loader

Filesystem package loader for Agent Platform.

Discovers, loads, validates, and manages packages from the filesystem. Handles package discovery, YAML parsing, reference resolution, and dependency tracking.

## Concepts

### Packages

Every package is a directory with a YAML file matching its directory name:

```
project-name/
  project-name.yaml          # Project package
  agents/
    agent-name/
      agent-name.yaml        # Agent package
      tools/
        tool-name.yaml       # Tool package
      connectors/
        connector-name.yaml  # Connector package
      skills/
        skill-name.yaml      # Skill package
  resources/
    resource-name.yaml       # Resource package
  schedules/
    schedule-name.yaml       # Schedule package
```

### Package Metadata

Every package includes metadata:

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
version: 1.0.0
```

The loader automatically adds `sourcePath` pointing to the YAML file.

## Usage

### Basic Discovery

```typescript
import { PackageLoader } from '@awp/loader';

const loader = new PackageLoader({
  rootPath: './my-project',
});

const result = await loader.discover();
console.log(`Found ${result.count} packages`);
console.log(`Failed: ${result.failed.length}`);
```

### Load Specific Package

```typescript
const result = await loader.loadPackage('./my-project/agents/my-agent');

if (result.success) {
  const agent = result.package;
  console.log(`Loaded: ${agent.name}`);
} else {
  console.error(result.error);
}
```

### Registry Management

```typescript
import { PackageRegistry } from '@awp/loader';

// Create registry from discovered packages
const registry = new PackageRegistry(result.packages);

// Get packages
const agent = registry.get('my-agent');
const allTools = registry.getByKind('tool');

// Resolve references
const tools = registry.resolveTools(agent);
const skills = registry.resolveSkills(agent);
const resources = registry.resolveResources(project);

// Check dependencies
const deps = registry.getDependencies('my-agent');
const referencers = registry.getReferencers('my-tool');

// Validate references
const issues = registry.validateReferences();
const resolution = registry.resolveReferences();
```

## Agent Packages

Agent packages have a special filesystem-first structure:

```
agent-name/
  agent.yaml                 # Agent definition
  tools/
    tool-name.yaml          # Tool packages
  skills/
    skill-name.yaml         # Skill packages
  channels/
    channel-name.yaml       # Channel packages
  connectors/
    connector-name.yaml     # Outbound connector packages
  schedules/
    schedule-name.yaml      # Schedule packages
  sandbox/
    sandbox.yaml            # Sandbox definition
  evals/
    eval-name.yaml          # Evaluation definitions
```

### Load Agent Package

```typescript
import { AgentLoader } from '@awp/loader';

const agentLoader = new AgentLoader('./agents/my-agent');

// Load with registries
const { agentDefinition, registries } = await agentLoader.loadWithRegistries();

// Access capabilities
registries.tools.getAll()           // All tools
registries.skills.getAll()          // All skills
registries.channels.getAll()        // All channels
registries.connectors.getAll()      // All connectors
registries.schedules.getAll()       // All schedules

// Get tools for a skill
registries.skills.getToolsForSkill('skill-id')

// Find tools by type
registries.tools.getHttpTools()
registries.tools.getConnectorTools()
registries.tools.getMcpTools()
registries.tools.getFunctionTools()
registries.connectors.getActionConnectors()
registries.connectors.getKnowledgeConnectors()
```

## Registries

Specialized registries for managing different package types.

### ToolRegistry

Manages tool packages.

```typescript
const toolRegistry = new ToolRegistry();
toolRegistry.register(tool);

// Query methods
toolRegistry.get(id)                    // Get by ID
toolRegistry.getAll()                   // All tools
toolRegistry.getByType(type)            // Tools by implementation
toolRegistry.getHttpTools()             // HTTP-backed
toolRegistry.getConnectorTools()        // Connector-backed
toolRegistry.getMcpTools()              // MCP-backed
toolRegistry.getFunctionTools()         // Function-backed
toolRegistry.getPlatformServiceTools()  // Platform service tools
toolRegistry.resolve(references)        // Resolve references
```

### SkillRegistry

Manages skill packages and their dependencies.

```typescript
const skillRegistry = new SkillRegistry(toolRegistry);
skillRegistry.register(skill);

// Query methods
skillRegistry.getToolsForSkill(skillId)         // Tools used by skill
skillRegistry.getSkillsUsingTool(toolId)        // Skills that use tool
skillRegistry.getAllToolsForSkill(skillId)      // Transitive tools
skillRegistry.resolve(references)               // Resolve references
```

### ChannelRegistry

Manages channel packages.

```typescript
const channelRegistry = new ChannelRegistry();
channelRegistry.register(channel);

// Query methods
channelRegistry.getByType(type)         // Channels by type
channelRegistry.getSlackChannels()      // Slack channels
channelRegistry.getEmailChannels()      // Email channels
channelRegistry.getHttpChannels()       // HTTP channels
channelRegistry.getWebhookChannels()    // Webhook channels
channelRegistry.resolve(references)     // Resolve references
```

### ConnectorRegistry

Manages outbound connector packages.

```typescript
const connectorRegistry = new ConnectorRegistry();
connectorRegistry.register(connector);

// Query methods
connectorRegistry.getByType(type)            // Connectors by type
connectorRegistry.getByMode('action')        // Action connectors
connectorRegistry.getActionConnectors()      // Action-oriented
connectorRegistry.getKnowledgeConnectors()   // Knowledge-oriented
connectorRegistry.resolve(references)        // Resolve references
```

### ScheduleRegistry

Manages schedule packages.

```typescript
const scheduleRegistry = new ScheduleRegistry();
scheduleRegistry.register(schedule);

// Query methods
scheduleRegistry.getByType(type)        // Schedules by type
scheduleRegistry.getCronSchedules()     // Cron schedules
scheduleRegistry.getEventSchedules()    // Event schedules
scheduleRegistry.getManualSchedules()   // Manual schedules
scheduleRegistry.resolve(references)    // Resolve references
```

### AgentCapabilityRegistry

Composite registry for all agent capabilities.

```typescript
const registry = new AgentCapabilityRegistry();

// Access individual registries
registry.tools        // ToolRegistry
registry.skills       // SkillRegistry
registry.channels     // ChannelRegistry
registry.connectors   // ConnectorRegistry
registry.schedules    // ScheduleRegistry
registry.sandboxes    // SandboxRegistry

// Statistics
registry.getStats()   // { tools: N, skills: N, channels: N, ... }
registry.clear()      // Clear all registries
```

## API

### PackageLoader

Discovers and loads packages from filesystem.

```typescript
class PackageLoader {
  constructor(options: LoaderOptions);
  
  // Discover all packages in root path
  async discover(): Promise<DiscoveryResult>;
  
  // Load a single package by path
  async loadPackage<T extends AnyPackage>(path: string): Promise<PackageLoadResult<T>>;
  
  // Get a loaded package by ID
  getPackageById(id: string): PackageLoadResult | undefined;
  
  // Get all loaded packages
  getAllPackages(): PackageLoadResult[];
  
  // Validate a package
  validate(pkg: AnyPackage, options?: ValidationOptions): ValidationResult;
}
```

**Options:**

```typescript
interface LoaderOptions {
  rootPath: string;           // Root directory to scan
  recursive?: boolean;        // Recursively scan dirs (default: true)
  ignore?: string[];          // Dirs to skip (default: node_modules, .git)
  validateReferences?: boolean; // Validate references (default: true)
  validateSchema?: boolean;   // Validate YAML schema (default: false)
}
```

### PackageRegistry

Manages loaded packages and resolves references.

```typescript
class PackageRegistry {
  constructor(packages?: PackageLoadResult[]);
  
  // Register a package
  register(result: PackageLoadResult): void;
  
  // Get package by ID
  get<T extends AnyPackage>(id: string): T | undefined;
  
  // Get packages by kind
  getByKind(kind: PackageKind): AnyPackage[];
  
  // Get all packages
  getAll(): AnyPackage[];
  
  // Check if package exists
  has(id: string): boolean;
  
  // Get references in a package
  getReferences(id: string): PackageRef[];
  
  // Resolve all references
  resolveReferences(): ReferenceResolutionResult;
  
  // Get packages that reference a package
  getReferencers(targetId: string): string[];
  
  // Get dependency graph
  getDependencies(packageId: string, deep?: boolean): Map<string, AnyPackage>;
  
  // Validate all references
  validateReferences(): Array<{ id: string; missing: PackageRef[] }>;
  
  // Resolve tool references
  resolveTools(pkg: Agent | Skill): Tool[];
  
  // Resolve skill references
  resolveSkills(pkg: Agent | Skill): Skill[];
  
  // Resolve resource references
  resolveResources(project: Project): Resource[];
  
  // Resolve agent references
  resolveAgents(project: Project): Agent[];
  
  // Export registry state
  toJSON(): any;
  
  // Get registry statistics
  getStats(): { total: number; byKind: Record<PackageKind, number>; totalReferences: number };
  
  // Clear registry
  clear(): void;
}
```

## Examples

### Load and Validate a Project

```typescript
import { PackageLoader, PackageRegistry } from '@awp/loader';

async function loadProject(projectPath: string) {
  const loader = new PackageLoader({
    rootPath: projectPath,
    validateSchema: true,
    validateReferences: true,
  });

  const discovery = await loader.discover();
  console.log(`Discovered ${discovery.count} packages`);

  if (discovery.failed.length > 0) {
    console.error('Failed to load:');
    for (const { path, error } of discovery.failed) {
      console.error(`  ${path}: ${error}`);
    }
  }

  return discovery.packages;
}
```

### Navigate Dependencies

```typescript
function analyzeDependencies(registry: PackageRegistry) {
  const stats = registry.getStats();
  console.log(`Total packages: ${stats.total}`);
  console.log(`By kind:`, stats.byKind);

  // Find unused packages
  const allIds = registry.getAll().map((p) => p.id);
  for (const id of allIds) {
    const referencers = registry.getReferencers(id);
    if (referencers.length === 0) {
      console.log(`Unused: ${id}`);
    }
  }

  // Find deep dependencies
  const agent = registry.get('my-agent');
  if (agent) {
    const deps = registry.getDependencies(agent.id, true);
    console.log(`${agent.id} depends on ${deps.size} packages (transitive)`);
  }
}
```

### Validate All References

```typescript
function validateProject(registry: PackageRegistry) {
  const issues = registry.validateReferences();

  if (issues.length === 0) {
    console.log('✓ All references valid');
    return;
  }

  for (const { id, missing } of issues) {
    console.error(`Package ${id}:`);
    for (const ref of missing) {
      console.error(`  Missing ${ref.kind}: ${ref.id}`);
    }
  }
}
```

## File Structure

```
packages/loader/
├── src/
│   ├── package-loader.ts    # Main loader class
│   ├── package-registry.ts  # Package storage and management
│   ├── types.ts             # Type definitions
│   └── index.ts             # Public exports
├── examples/
│   ├── load-project.ts
│   ├── resolve-dependencies.ts
│   └── validate-project.ts
├── README.md                # This file
├── package.json
└── tsconfig.json
```

## Related Packages

- **@awp/types** - Package type definitions
- **@awp/definitions** - Builder pattern for packages
- **@awp/interpreter** - Interprets loaded packages into executable configuration

## Error Handling

The loader provides detailed error information:

```typescript
const result = await loader.loadPackage('./path/to/package');

if (!result.success) {
  console.error(`Failed to load package`);
  console.error(`Path: ${result.sourcePath}`);
  console.error(`Error: ${result.error}`);
  if (result.warnings?.length) {
    console.warn('Warnings:', result.warnings);
  }
}
```

## Performance

- **Discovery**: O(n) where n = number of files in directory tree
- **Reference Resolution**: O(m × k) where m = packages, k = average refs per package
- **Dependency Graph**: O(m) with memoization

Typical 1000-package project loads in <100ms.

## Validation

Packages are validated for:
- Required fields (id, name, version, kind)
- Field types (strings, objects, arrays)
- Reference existence (if enabled)
- Circular dependencies (if enabled)
- YAML structure (if enabled)

## License

Apache 2.0
