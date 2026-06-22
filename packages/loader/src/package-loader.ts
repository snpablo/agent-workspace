/**
 * PackageLoader - discovers and loads packages from filesystem
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import {
  Tool,
  Skill,
  Agent,
  Project,
  Channel,
  Schedule,
  Resource,
  Sandbox,
  ArtifactType,
  AnyPackage,
} from '@awp/types';
import {
  LoaderOptions,
  PackageLoadResult,
  DiscoveryResult,
  PackageKind,
  ValidationResult,
  ValidationError,
  ValidationOptions,
} from './types';

/**
 * Discovers and loads packages from the filesystem
 */
export class PackageLoader {
  private options: Required<LoaderOptions>;
  private loadedPackages: Map<string, PackageLoadResult> = new Map();

  constructor(options: LoaderOptions) {
    this.options = {
      recursive: options.recursive ?? true,
      ignore: options.ignore ?? ['node_modules', '.git', 'dist'],
      validateReferences: options.validateReferences ?? true,
      validateSchema: options.validateSchema ?? false,
      ...options,
    };
  }

  /**
   * Discover all packages in the root path
   */
  async discover(): Promise<DiscoveryResult> {
    const startTime = Date.now();
    const packages: PackageLoadResult[] = [];
    const failed: Array<{ path: string; error: string }> = [];

    try {
      await this.scanDirectory(this.options.rootPath, packages, failed);
    } catch (error) {
      failed.push({
        path: this.options.rootPath,
        error: `Failed to scan directory: ${error instanceof Error ? error.message : String(error)}`,
      });
    }

    const durationMs = Date.now() - startTime;

    return {
      packages,
      failed,
      durationMs,
      count: packages.length,
    };
  }

  /**
   * Load a single package by path
   */
  async loadPackage<T extends AnyPackage = AnyPackage>(packagePath: string): Promise<PackageLoadResult<T>> {
    try {
      const yamlPath = packagePath.endsWith('.yaml')
        ? packagePath
        : path.join(packagePath, `${path.basename(packagePath)}.yaml`);

      if (!fs.existsSync(yamlPath)) {
        return {
          package: {} as T,
          sourcePath: yamlPath,
          success: false,
          error: `Package file not found: ${yamlPath}`,
        };
      }

      const yaml = fs.readFileSync(yamlPath, 'utf-8');
      const parsed = parse(yaml);

      if (!parsed || typeof parsed !== 'object') {
        return {
          package: {} as T,
          sourcePath: yamlPath,
          success: false,
          error: 'Invalid YAML: expected object',
        };
      }

      // Add sourcePath to package
      const pkg = {
        ...parsed,
        sourcePath: yamlPath,
      } as T;

      const result: PackageLoadResult<T> = {
        package: pkg,
        sourcePath: yamlPath,
        success: true,
      };

      // Validate if requested
      if (this.options.validateSchema) {
        const validation = this.validate(pkg);
        if (validation.errors.length > 0) {
          result.warnings = (result.warnings || []).concat(
            validation.errors.map((e) => e.message),
          );
        }
      }

      // Cache the loaded package
      this.loadedPackages.set(this.getPackageId(pkg), result);

      return result;
    } catch (error) {
      return {
        package: {} as T,
        sourcePath: packagePath,
        success: false,
        error: `Failed to load package: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Load a package by ID (must be already discovered)
   */
  getPackageById(id: string): PackageLoadResult | undefined {
    return this.loadedPackages.get(id);
  }

  /**
   * Get all loaded packages
   */
  getAllPackages(): PackageLoadResult[] {
    return Array.from(this.loadedPackages.values());
  }

  /**
   * Validate a package
   */
  validate(pkg: AnyPackage, options?: ValidationOptions): ValidationResult {
    const opts = { checkRequired: true, checkTypes: true, ...options };
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const packageId = this.getPackageId(pkg);

    // Check required fields
    if (opts.checkRequired) {
      if (!pkg.kind) {
        errors.push({ message: 'Missing required field: kind', severity: 'error' });
      }
      if (!pkg.id) {
        errors.push({ message: 'Missing required field: id', severity: 'error' });
      }
      if (!pkg.name) {
        errors.push({ message: 'Missing required field: name', severity: 'error' });
      }
      if ('version' in pkg && !pkg.version) {
        errors.push({ message: 'Missing required field: version', severity: 'error' });
      }
    }

    // Check types
    if (opts.checkTypes) {
      if (typeof pkg.id !== 'string') {
        errors.push({ message: 'Field id must be string', path: 'id', severity: 'error' });
      }
      if (typeof pkg.name !== 'string') {
        errors.push({ message: 'Field name must be string', path: 'name', severity: 'error' });
      }
      if ('version' in pkg && typeof pkg.version !== 'string') {
        errors.push({ message: 'Field version must be string', path: 'version', severity: 'error' });
      }
    }

    return {
      packageId,
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get package ID from package
   */
  private getPackageId(pkg: any): string {
    return pkg.id || 'unknown';
  }

  /**
   * Scan a directory for packages
   */
  private async scanDirectory(
    dir: string,
    packages: PackageLoadResult[],
    failed: Array<{ path: string; error: string }>,
  ): Promise<void> {
    if (!fs.existsSync(dir)) {
      failed.push({ path: dir, error: 'Directory does not exist' });
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip ignored directories
      if (this.options.ignore.includes(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (this.options.recursive) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, packages, failed);
        }
      } else if (entry.isFile() && entry.name.endsWith('.yaml')) {
        const result = await this.loadPackage(fullPath);
        if (result.success) {
          packages.push(result);
        } else {
          failed.push({ path: fullPath, error: result.error || 'Unknown error' });
        }
      }
    }
  }
}

/**
 * Detect package kind from content
 */
export function detectPackageKind(pkg: any): PackageKind | undefined {
  if (pkg.kind) return pkg.kind;

  // Heuristic detection
  if (pkg.instructions && pkg.tools) return 'agent';
  if (pkg.type === 'object' && pkg.properties && pkg.implementation) return 'tool';
  if (pkg.trigger) return 'schedule';
  if (pkg.agents) return 'project';
  if (pkg.schema && pkg.structure) return 'artifact';

  return undefined;
}

/**
 * Load packages from multiple root paths
 */
export async function loadFromMultiplePaths(
  paths: string[],
  options?: Omit<LoaderOptions, 'rootPath'>,
): Promise<DiscoveryResult> {
  const allPackages: PackageLoadResult[] = [];
  const allFailed: Array<{ path: string; error: string }> = [];
  let totalDuration = 0;

  for (const rootPath of paths) {
    const loader = new PackageLoader({
      rootPath,
      ...options,
    });

    const result = await loader.discover();
    allPackages.push(...result.packages);
    allFailed.push(...result.failed);
    totalDuration += result.durationMs;
  }

  return {
    packages: allPackages,
    failed: allFailed,
    durationMs: totalDuration,
    count: allPackages.length,
  };
}
