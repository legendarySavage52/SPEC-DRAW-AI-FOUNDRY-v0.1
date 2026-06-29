/**
 * Architecture Writer Module
 * 
 * Generates markdown documentation from audit results:
 * - Architecture diagram (ASCII/Mermaid)
 * - Project overview
 * - Technology stack documentation
 * - Code structure explanation
 * - Setup and development guide
 * 
 * @module lib/architecture-writer
 */

import { AuditReport } from './report-builder';
import { Logger } from './logger';

/**
 * Architecture Writer
 * 
 * Converts audit reports into human-readable markdown documentation
 * with diagrams, code examples, and actionable insights.
 */
export class ArchitectureWriter {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Generate markdown documentation from audit report
   * 
   * @param report - Complete audit report
   * @returns Markdown string
   */
  generateMarkdown(report: AuditReport): string {
    this.logger.info('Generating architecture documentation');

    const sections = [
      this.generateHeader(report),
      this.generateTableOfContents(),
      this.generateProjectOverview(report),
      this.generateTechnologyStack(report),
      this.generateCodeMetrics(report),
      this.generateArchitecture(report),
      this.generateRiskAssessment(report),
      this.generateRecommendations(report),
      this.generateMetadata(report),
    ];

    return sections.join('\n\n');
  }

  /**
   * Generate header section
   * 
   * @private
   */
  private generateHeader(report: AuditReport): string {
    return `# Repository Audit Report

**Project:** ${report.summary.name}  
**Generated:** ${report.metadata.generatedAt.toISOString()}  
**Repository:** ${report.metadata.repositoryPath}  

${report.summary.description}`;
  }

  /**
   * Generate table of contents
   * 
   * @private
   */
  private generateTableOfContents(): string {
    return `## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Code Metrics](#code-metrics)
4. [Architecture](#architecture)
5. [Risk Assessment](#risk-assessment)
6. [Recommendations](#recommendations)
7. [Metadata](#metadata)`;
  }

  /**
   * Generate project overview section
   * 
   * @private
   */
  private generateProjectOverview(report: AuditReport): string {
    const { summary } = report;

    return `## Project Overview

### Summary Statistics

| Metric | Value |
|--------|-------|
| Files Scanned | ${summary.filesScanned} |
| Directories | ${summary.directoriesScanned} |
| Total Size | ${summary.totalSize} |
| Total Lines | ${summary.totalLines.toLocaleString()} |
| Scan Errors | ${summary.errorCount} |

### Project Information

- **Name:** ${summary.name}
- **Type:** ${report.architecture.pattern}
- **Description:** ${summary.description}`;
  }

  /**
   * Generate technology stack section
   * 
   * @private
   */
  private generateTechnologyStack(report: AuditReport): string {
    const { technology } = report;

    let md = `## Technology Stack

### Languages
${technology.languages.length > 0 ? technology.languages.map(l => `- ${l}`).join('\n') : 'No languages detected'}

### Frameworks & Libraries

**Frameworks:**
${technology.frameworks.length > 0 ? technology.frameworks.map(f => `- ${f}`).join('\n') : '- None detected'}

**Libraries:**
${technology.libraries.length > 0 ? technology.libraries.map(l => `- ${l}`).join('\n') : '- None detected'}

### Infrastructure & Tools

**Infrastructure:**
${technology.infrastructure.length > 0 ? technology.infrastructure.map(i => `- ${i}`).join('\n') : '- None detected'}

**Tools:**
${technology.tools.length > 0 ? technology.tools.map(t => `- ${t}`).join('\n') : '- None detected'}

### Vulnerability Assessment
**Risk Level:** ${this.formatRiskLevel(technology.riskLevel)}`;

    return md;
  }

  /**
   * Generate code metrics section
   * 
   * @private
   */
  private generateCodeMetrics(report: AuditReport): string {
    const { codeMetrics } = report;

    let md = `## Code Metrics

### Overview

| Metric | Value |
|--------|-------|
| Avg File Size | ${codeMetrics.averageFileSize.toLocaleString()} bytes |
| Avg Lines/File | ${codeMetrics.averageLinesPerFile.toLocaleString()} |
| Code Line Ratio | ${codeMetrics.codeLineRatio}% |

### Largest Files

${codeMetrics.largestFiles.map((f, i) => `${i + 1}. **${f.path}** - ${f.lines.toLocaleString()} lines (${f.size.toLocaleString()} bytes)`).join('\n')}

### File Type Distribution

| Type | Count | Percentage |
|------|-------|-----------|
${codeMetrics.fileTypeDistribution.map(d => `| ${d.type} | ${d.count} | ${d.percentage}% |`).join('\n')}`;

    return md;
  }

  /**
   * Generate architecture section
   * 
   * @private
   */
  private generateArchitecture(report: AuditReport): string {
    const { architecture } = report;

    return `## Architecture

### Pattern
**${architecture.pattern}**

### Components
${architecture.components.map(c => `- ${c}`).join('\n')}

### Layers
${architecture.layers.map(l => `- ${l}`).join('\n')}

### Scores

| Metric | Score |
|--------|-------|
| Scalability | ${architecture.scalabilityScore}/100 |
| Maintainability | ${architecture.maintainabilityScore}/100 |`;
  }

  /**
   * Generate risk assessment section
   * 
   * @private
   */
  private generateRiskAssessment(report: AuditReport): string {
    const { risks } = report;

    let md = `## Risk Assessment

### Vulnerability Risk
**${this.formatRiskLevel(risks.vulnerabilityRisk)}**

### Technical Debt
**${this.formatRiskLevel(risks.technicalDebt)}**

### Identified Issues

${risks.maintainabilityIssues.length > 0
  ? risks.maintainabilityIssues.map(i => `- ⚠️ ${i}`).join('\n')
  : '- No major issues identified'}

### Unused Dependencies

${risks.outOfDateDependencies.length > 0
  ? risks.outOfDateDependencies.map(d => `- ${d}`).join('\n')
  : '- No unused dependencies'}`;

    return md;
  }

  /**
   * Generate recommendations section
   * 
   * @private
   */
  private generateRecommendations(report: AuditReport): string {
    const { recommendations } = report;

    if (recommendations.length === 0) {
      return `## Recommendations

No recommendations at this time.`;
    }

    const byPriority = {
      high: recommendations.filter(r => r.priority === 'high'),
      medium: recommendations.filter(r => r.priority === 'medium'),
      low: recommendations.filter(r => r.priority === 'low'),
    };

    let md = `## Recommendations

### 🔴 High Priority (${byPriority.high.length})

${this.formatRecommendations(byPriority.high)}

### 🟡 Medium Priority (${byPriority.medium.length})

${this.formatRecommendations(byPriority.medium)}

### 🟢 Low Priority (${byPriority.low.length})

${this.formatRecommendations(byPriority.low)}`;

    return md;
  }

  /**
   * Format recommendations as markdown
   * 
   * @private
   */
  private formatRecommendations(recs: typeof report.recommendations): string {
    if (recs.length === 0) {
      return 'No recommendations in this category.';
    }

    return recs.map(rec => `
#### ${rec.title}
- **Category:** ${rec.category}
- **Description:** ${rec.description}
- **Impact:** ${rec.impact}
- **Effort:** ${rec.effort}`).join('\n');
  }

  /**
   * Generate metadata section
   * 
   * @private
   */
  private generateMetadata(report: AuditReport): string {
    const { metadata } = report;

    return `## Metadata

- **Report Version:** ${metadata.version}
- **Generated At:** ${metadata.generatedAt.toISOString()}
- **Scan Duration:** ${metadata.scanDuration}ms
- **Repository Path:** ${metadata.repositoryPath}`;
  }

  /**
   * Format risk level for display
   * 
   * @private
   */
  private formatRiskLevel(level: 'low' | 'medium' | 'high'): string {
    const icons: Record<string, string> = {
      low: '🟢',
      medium: '🟡',
      high: '🔴',
    };
    return `${icons[level]} ${level.toUpperCase()}`;
  }
}

export default ArchitectureWriter;
