/**
 * Repository Scanner Module
 * 
 * Recursively scans a GitHub repository to gather:
 * - File structure and metrics
 * - Source code statistics
 * - Framework/dependency detection
 * - Project configuration analysis
 * 
 * @module lib/scanner
 */

import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

/**
 * File metadata collected during scanning
 */
export interface FileMetadata {
  path: string;
  name: string;
  ext: string;
  size: number;
  lines?: number;
  isDirectory: boolean;
  depth: number;
}

/**
 * Statistics for a file type
 */
export interface FileTypeStats {
  count: number;
  totalSize: number;
  totalLines: number;
  avgLines: number;
  files: string[];
}

/**
 * Complete scan results
 */
export interface ScanResult {
  timestamp: Date;
  rootPath: string;
  totalFiles: number;
  totalDirs: number;
  totalSize: number;
  totalLines: number;
  filesByType: Map<string, FileTypeStats>;
  sourceFiles: FileMetadata[];
  configFiles: FileMetadata[];
  errors: ScanError[];
}

/**
 * Scan error with context
 */
export interface ScanError {
  path: string;
  error: string;
  code: string;
}

/**
 * Directories to ignore during scanning
 */
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel',
  '.turbo',
  'coverage',
  '.cache',
  'out',
  '.env.local',
  '__pycache__',
  '.venv',
]);

/**
 * File extensions for source code
 */
const SOURCE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.py',
  '.java',
  '.cpp',
  '.c',
  '.go',
  '.rs',
  '.php',
  '.cs',
  '.swift',
  '.kt',
  '.scala',
  '.rb',
]);

/**
 * Configuration file patterns
 */
const CONFIG_PATTERNS = new Set([
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'eslint.config.js',
  '.eslintrc',
  '.prettierrc',
  'jest.config.js',
  'vitest.config.ts',
  'dockerfile',
  '.dockerignore',
  '.gitignore',
  'README.md',
  'LICENSE',
  'Makefile',
  'CMakeLists.txt',
  'setup.py',
  'requirements.txt',
  'go.mod',
  'Cargo.toml',
  'Gemfile',
  'pom.xml',
  'build.gradle',
  '.github',
]);

/**
 * Repository Scanner
 * 
 * Provides recursive directory scanning with error handling,
 * file type detection, and comprehensive statistics gathering.
 */
export class RepositoryScanner {
  private logger: Logger;
  private maxDepth: number = 20;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Scan a directory recursively
   * 
   * @param rootPath - Absolute path to the root directory
   * @returns Promise<ScanResult> - Complete scan results
   * @throws Error if rootPath does not exist or is not readable
   */
  async scan(rootPath: string): Promise<ScanResult> {
    try {
      // Verify path exists and is a directory
      if (!fs.existsSync(rootPath)) {
        throw new Error(`Path does not exist: ${rootPath}`);
      }

      const stats = fs.statSync(rootPath);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${rootPath}`);
      }

      this.logger.info(`Starting repository scan: ${rootPath}`);

      const result: ScanResult = {
        timestamp: new Date(),
        rootPath,
        totalFiles: 0,
        totalDirs: 0,
        totalSize: 0,
        totalLines: 0,
        filesByType: new Map(),
        sourceFiles: [],
        configFiles: [],
        errors: [],
      };

      // Begin recursive scan
      await this.scanDirectory(rootPath, rootPath, 0, result);

      // Calculate aggregated statistics
      this.computeStatistics(result);

      this.logger.info(`Scan complete: ${result.totalFiles} files, ${result.totalDirs} directories`);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Scan failed: ${message}`);
      throw error;
    }
  }

  /**
   * Recursively scan a directory
   * 
   * @private
   */
  private async scanDirectory(
    currentPath: string,
    rootPath: string,
    depth: number,
    result: ScanResult
  ): Promise<void> {
    // Prevent infinite depth
    if (depth > this.maxDepth) {
      this.logger.warn(`Max depth exceeded at: ${currentPath}`);
      return;
    }

    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(rootPath, fullPath);

        try {
          if (entry.isDirectory()) {
            // Skip ignored directories
            if (IGNORED_DIRS.has(entry.name)) {
              this.logger.debug(`Skipping ignored directory: ${relativePath}`);
              continue;
            }

            result.totalDirs++;
            await this.scanDirectory(fullPath, rootPath, depth + 1, result);
          } else if (entry.isFile()) {
            const fileMetadata = await this.analyzeFile(fullPath, relativePath, depth);
            result.totalFiles++;
            result.totalSize += fileMetadata.size;

            // Categorize the file
            if (this.isSourceFile(fileMetadata.ext)) {
              result.sourceFiles.push(fileMetadata);
              result.totalLines += fileMetadata.lines || 0;
            }

            if (this.isConfigFile(entry.name)) {
              result.configFiles.push(fileMetadata);
            }

            // Update file type statistics
            this.updateFileTypeStats(result.filesByType, fileMetadata);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          result.errors.push({
            path: relativePath,
            error: message,
            code: 'FILE_ANALYSIS_ERROR',
          });
          this.logger.warn(`Failed to analyze file: ${relativePath} - ${message}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({
        path: path.relative(rootPath, currentPath),
        error: message,
        code: 'DIRECTORY_READ_ERROR',
      });
      this.logger.warn(`Failed to read directory: ${currentPath} - ${message}`);
    }
  }

  /**
   * Analyze a single file
   * 
   * @private
   */
  private async analyzeFile(
    filePath: string,
    relativePath: string,
    depth: number
  ): Promise<FileMetadata> {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const name = path.basename(filePath);

    let lines = 0;

    // Count lines for text files
    if (this.isTextFile(ext)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        lines = content.split('\n').length;
      } catch {
        // Binary file or encoding issue - skip line count
        lines = 0;
      }
    }

    return {
      path: relativePath,
      name,
      ext,
      size: stats.size,
      lines: lines > 0 ? lines : undefined,
      isDirectory: false,
      depth,
    };
  }

  /**
   * Update file type statistics
   * 
   * @private
   */
  private updateFileTypeStats(
    filesByType: Map<string, FileTypeStats>,
    file: FileMetadata
  ): void {
    const ext = file.ext || 'no-extension';

    if (!filesByType.has(ext)) {
      filesByType.set(ext, {
        count: 0,
        totalSize: 0,
        totalLines: 0,
        avgLines: 0,
        files: [],
      });
    }

    const stats = filesByType.get(ext)!;
    stats.count++;
    stats.totalSize += file.size;
    stats.totalLines += file.lines || 0;
    stats.files.push(file.path);
  }

  /**
   * Compute final statistics
   * 
   * @private
   */
  private computeStatistics(result: ScanResult): void {
    // Calculate average lines per file type
    for (const stats of result.filesByType.values()) {
      stats.avgLines = stats.count > 0 ? Math.round(stats.totalLines / stats.count) : 0;
    }
  }

  /**
   * Check if file extension indicates source code
   * 
   * @private
   */
  private isSourceFile(ext: string): boolean {
    return SOURCE_EXTENSIONS.has(ext.toLowerCase());
  }

  /**
   * Check if filename matches config file patterns
   * 
   * @private
   */
  private isConfigFile(filename: string): boolean {
    const lower = filename.toLowerCase();
    return CONFIG_PATTERNS.has(lower);
  }

  /**
   * Check if file is likely text-based
   * 
   * @private
   */
  private isTextFile(ext: string): boolean {
    const textExtensions = new Set([
      '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt',
      '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.cs',
      '.swift', '.kt', '.scala', '.rb', '.xml', '.html', '.css',
      '.scss', '.yaml', '.yml', '.toml', '.ini', '.env',
    ]);
    return textExtensions.has(ext.toLowerCase());
  }
}

export default RepositoryScanner;
