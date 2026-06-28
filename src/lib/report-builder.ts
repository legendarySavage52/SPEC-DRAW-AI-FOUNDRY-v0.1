// src/lib/report-builder.ts
/**
 * Compose scan results into a human-readable Markdown report.
 */

import { ScanResult, AuditReport, FeatureReport } from '../types/index';
import { randomUUID } from 'crypto';

export function buildMarkdownReport(scan: ScanResult, features?: FeatureReport): string {
  const lines: string[] = [];
  lines.push(`# Repository Audit Report`);
  lines.push(``);
  lines.push(`- Root: \\`${scan.root}\\``);
  lines.push(`- Files scanned: ${scan.files.length}`);
  if (scan.packageJson && typeof scan.packageJson.name === 'string') {
    lines.push(`- Package: ${String(scan.packageJson.name)}`);
  }
  lines.push(``);
  if (features) {
    lines.push(`## Detected features`);
    lines.push(`- TypeScript: ${features.usesTypeScript ? 'yes' : 'no'}`);
    lines.push(`- React: ${features.usesReact ? 'yes' : 'no'}`);
    lines.push(`- Next.js: ${features.usesNext ? 'yes' : 'no'}`);
    lines.push(`- Express: ${features.usesExpress ? 'yes' : 'no'}`);
    if (features.other.length) lines.push(`- Other: ${features.other.join(', ')}`);
    lines.push(``);
  }
  lines.push(`## Top-level files (first 50)`);
  const top = scan.files.slice(0, 50).map((f) => `- ${f.path} (${f.size} bytes)`);
  lines.push(...top);
  lines.push(``);
  lines.push(`---`);
  lines.push(`_This is an automatically generated starter report. Expand detectors to include import parsing, dependency depth, and circular dependency detection._`);
  return lines.join('\n');
}

export function buildAuditReport(scan: ScanResult, features?: FeatureReport): AuditReport {
  const id = randomUUID();
  return {
    id,
    createdAt: new Date().toISOString(),
    summary: buildMarkdownReport(scan, features),
    scan,
    features,
  };
}
