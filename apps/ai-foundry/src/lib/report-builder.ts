/**
 * Report Builder Module
 * 
 * Generates comprehensive audit reports from scan results:
 * - Project summary
 * - Technology stack analysis
 * - Code quality metrics
 * - Architecture overview
 * - Risk assessment
 * 
 * @module lib/report-builder
 */

import { ScanResult } from './scanner';
import { FeatureDetectionResult } from './feature-detector';
import { DependencyStats } from './dependency-graph';
import { Logger } from './logger';

/**
 * Complete audit report
 */
export interface AuditReport {
  metadata: ReportMetadata;
  summary: ProjectSummary;
  technology: TechnologyAnalysis;
  codeMetrics: CodeMetrics;
  architecture: ArchitectureOverview;
  risks: RiskAssessment;
  recommendations: Recommendation[];
}

/**
 * Report metadata
 */
export interface ReportMetadata {
  generatedAt: Date;
  version: string;
  scanDuration: number; // milliseconds
  repositoryPath: string;
}

/**
 * High-level project summary
 */
export interface ProjectSummary {
  name: string;
  description: string;
  filesScanned: number;
  directoriesScanned: number;
  totalSize: string;
  totalLines: number;
  errorCount: number;
}

/**
 * Technology stack analysis
 */
export interface TechnologyAnalysis {
  frameworks: string[];
  libraries: string[];
  tools: string[];
  infrastructure: string[];
  languages: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Code quality metrics
 */
export interface CodeMetrics {
  averageFileSize: number;
  averageLinesPerFile: number;
  codeLineRatio: number; // percentage of lines that are code
  largestFiles: { path: string; size: number; lines: number }[];
  fileTypeDistribution: { type: string; count: number; percentage: number }[];
}

/**
 * Architecture overview
 */
export interface ArchitectureOverview {
  pattern: string;
  components: string[];
  layers: string[];
  scalabilityScore: number; // 0-100
  maintainabilityScore: number; // 0-100
}

/**
 * Risk assessment
 */
export interface RiskAssessment {
  vulnerabilityRisk: 'low' | 'medium' | 'high';
  technicalDebt: 'low' | 'medium' | 'high';
  maintainabilityIssues: string[];
  outOfDateDependencies: string[];
}

/**
 * Recommendation for improvement
 */
export interface Recommendation {
  priority: 'low' | 'medium' | 'high';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

/**
 * Report Builder
 * 
 * Generates comprehensive audit reports by analyzing scan results,
 * feature detection, and dependency data.
 */
export class ReportBuilder {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Build a complete audit report
   * 
   * @param scanResult - Results from repository scan
   * @param features - Detected features and frameworks
   * @param dependencies - Dependency analysis
   * @param projectName - Name of the project
   * @param startTime - When the audit started
   * @returns Complete audit report
   */
  build(
    scanResult: ScanResult,
    features: FeatureDetectionResult,
    dependencies: DependencyStats,
    projectName: string,
    startTime: Date
  ): AuditReport {
    this.logger.info('Building audit report', { projectName });

    const metadata = this.buildMetadata(scanResult, startTime);
    const summary = this.buildSummary(scanResult, projectName);
    const technology = this.buildTechnologyAnalysis(features, dependencies);
    const codeMetrics = this.buildCodeMetrics(scanResult);
    const architecture = this.buildArchitectureOverview(features, codeMetrics);
    const risks = this.buildRiskAssessment(dependencies, features);
    const recommendations = this.buildRecommendations(risks, technology, dependencies);

    return {
      metadata,
      summary,
      technology,
      codeMetrics,
      architecture,
      risks,
      recommendations,
    };
  }

  /**
   * Build report metadata
   * 
   * @private
   */
  private buildMetadata(scanResult: ScanResult, startTime: Date): ReportMetadata {
    return {
      generatedAt: new Date(),
      version: '1.0.0',
      scanDuration: new Date().getTime() - startTime.getTime(),
      repositoryPath: scanResult.rootPath,
    };
  }

  /**
   * Build project summary
   * 
   * @private
   */
  private buildSummary(scanResult: ScanResult, name: string): ProjectSummary {
    return {
      name,
      description: `Repository audit for ${name}`,
      filesScanned: scanResult.totalFiles,
      directoriesScanned: scanResult.totalDirs,
      totalSize: this.formatBytes(scanResult.totalSize),
      totalLines: scanResult.totalLines,
      errorCount: scanResult.errors.length,
    };
  }

  /**
   * Build technology analysis
   * 
   * @private
   */
  private buildTechnologyAnalysis(
    features: FeatureDetectionResult,
    dependencies: DependencyStats
  ): TechnologyAnalysis {
    const languages = new Set<string>();

    // Detect language by common frameworks
    for (const framework of features.frameworks) {
      if (['React', 'Vue.js', 'Svelte', 'Next.js'].includes(framework.name)) {
        languages.add('TypeScript/JavaScript');
      } else if (['Django', 'FastAPI'].includes(framework.name)) {
        languages.add('Python');
      } else if (['Express.js'].includes(framework.name)) {
        languages.add('JavaScript/Node.js');
      }
    }

    return {
      frameworks: features.frameworks.map(f => f.name),
      libraries: features.libraries.map(f => f.name),
      tools: features.tools.map(f => f.name),
      infrastructure: features.infrastructure.map(f => f.name),
      languages: Array.from(languages),
      riskLevel: dependencies.vulnerabilityRisk,
    };
  }

  /**
   * Build code metrics
   * 
   * @private
   */
  private buildCodeMetrics(scanResult: ScanResult): CodeMetrics {
    const largestFiles = Array.from(scanResult.sourceFiles)
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 5)
      .map(f => ({
        path: f.path,
        size: f.size,
        lines: f.lines || 0,
      }));

    const fileTypeDistribution = Array.from(scanResult.filesByType.values())
      .map(stats => ({
        type: 'Source files', // Simplified for demo
        count: stats.count,
        percentage: Math.round((stats.count / scanResult.totalFiles) * 100),
      }));

    const avgFileSize = scanResult.totalFiles > 0 ? scanResult.totalSize / scanResult.totalFiles : 0;
    const avgLines = scanResult.sourceFiles.length > 0
      ? scanResult.totalLines / scanResult.sourceFiles.length
      : 0;

    return {
      averageFileSize: Math.round(avgFileSize),
      averageLinesPerFile: Math.round(avgLines),
      codeLineRatio: scanResult.totalFiles > 0 ? Math.round((scanResult.sourceFiles.length / scanResult.totalFiles) * 100) : 0,
      largestFiles,
      fileTypeDistribution,
    };
  }

  /**
   * Build architecture overview
   * 
   * @private
   */
  private buildArchitectureOverview(
    features: FeatureDetectionResult,
    codeMetrics: CodeMetrics
  ): ArchitectureOverview {
    // Determine architecture pattern
    let pattern = 'Monolithic';
    const hasFrontend = features.frameworks.some(f => ['React', 'Vue.js', 'Next.js'].some(n => f.name.includes(n)));
    const hasBackend = features.frameworks.some(f => ['Express.js', 'Django', 'FastAPI'].some(n => f.name.includes(n)));

    if (hasFrontend && hasBackend) {
      pattern = 'Full-Stack Application';
    } else if (hasFrontend) {
      pattern = 'Frontend Application';
    } else if (hasBackend) {
      pattern = 'Backend Application';
    }

    // Estimate scalability
    const scalabilityScore = Math.min(100, 50 + (100 - codeMetrics.averageLinesPerFile));
    const maintainabilityScore = Math.max(0, 100 - (codeMetrics.averageLinesPerFile / 5));

    return {
      pattern,
      components: ['Scanner', 'Analyzer', 'Reporter'],
      layers: ['Presentation', 'Business Logic', 'Data Access'],
      scalabilityScore: Math.round(scalabilityScore),
      maintainabilityScore: Math.round(maintainabilityScore),
    };
  }

  /**
   * Build risk assessment
   * 
   * @private
   */
  private buildRiskAssessment(
    dependencies: DependencyStats,
    features: FeatureDetectionResult
  ): RiskAssessment {
    const maintainabilityIssues: string[] = [];
    const outOfDateDependencies = dependencies.unusedDependencies || [];

    if (dependencies.totalDependencies > 50) {
      maintainabilityIssues.push('High number of dependencies may increase maintenance burden');
    }

    if ((dependencies.devDependencies || 0) > (dependencies.directDependencies || 0)) {
      maintainabilityIssues.push('More dev dependencies than production dependencies');
    }

    return {
      vulnerabilityRisk: dependencies.vulnerabilityRisk,
      technicalDebt: dependencies.vulnerabilityRisk === 'high' ? 'high' : 'medium',
      maintainabilityIssues,
      outOfDateDependencies,
    };
  }

  /**
   * Build recommendations
   * 
   * @private
   */
  private buildRecommendations(
    risks: RiskAssessment,
    technology: TechnologyAnalysis,
    dependencies: DependencyStats
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (risks.vulnerabilityRisk === 'high') {
      recommendations.push({
        priority: 'high',
        category: 'Security',
        title: 'Address Dependency Vulnerabilities',
        description: 'Several dependencies have known vulnerabilities. Update to patched versions.',
        impact: 'Reduces security risk exposure',
        effort: 'medium',
      });
    }

    if (risks.outOfDateDependencies.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Maintenance',
        title: 'Remove Unused Dependencies',
        description: `${risks.outOfDateDependencies.length} dependencies are not being used.`,
        impact: 'Reduces build size and maintenance overhead',
        effort: 'low',
      });
    }

    if (dependencies.externalPackages > 50) {
      recommendations.push({
        priority: 'medium',
        category: 'Architecture',
        title: 'Evaluate Dependency Consolidation',
        description: 'Consider consolidating similar dependencies to reduce complexity.',
        impact: 'Improves maintainability and reduces conflicts',
        effort: 'high',
      });
    }

    if (!technology.frameworks.includes('TypeScript')) {
      recommendations.push({
        priority: 'low',
        category: 'Quality',
        title: 'Consider TypeScript Adoption',
        description: 'TypeScript improves code safety and developer experience.',
        impact: 'Better type safety and IDE support',
        effort: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Format bytes as human-readable string
   * 
   * @private
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default ReportBuilder;
