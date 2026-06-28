// src/lib/dependency-graph.ts
/**
 * Minimal dependency graph builder stub. For MVP we expose a typed function
 * that can be tested on small fixtures. A future iteration should parse ASTs
 * (ts-morph / TypeScript compiler API) to extract imports precisely.
 */

import { DependencyGraph, ScannedFile } from '../types/index';

/**
 * Build a dependency graph from scanned files. This stub returns an empty graph
 * when there are no files and otherwise returns each file as a node with no edges.
 */
export function buildDependencyGraph(files: ScannedFile[]): DependencyGraph {
  const nodes = files.map((f) => f.path);
  const edges: Array<{ from: string; to: string }> = [];
  return { nodes, edges };
}
