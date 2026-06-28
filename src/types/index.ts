// src/types/index.ts
/**
 * Shared types for Agent-001 repository audit.
 * Keep these small and well-typed so downstream modules can evolve.
 */

export type ScannedFile = {
  path: string;
  ext: string;
  size: number;
  imports: string[];
};

export type ScanResult = {
  root: string;
  files: ScannedFile[];
  packageJson?: Record<string, unknown>;
};

export type DependencyGraph = {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
};

export type FeatureReport = {
  usesTypeScript: boolean;
  usesReact: boolean;
  usesNext: boolean;
  usesExpress: boolean;
  other: string[];
};

export type AuditReport = {
  id: string;
  createdAt: string;
  summary: string; // Markdown
  scan: ScanResult;
  features?: FeatureReport;
};
