/**
 * Dependency Graph Module
 * 
 * Builds and analyzes dependency relationships between:
 * - npm/yarn packages (from package.json)
 * - Import statements (TypeScript/JavaScript)
 * - Internal modules
 * 
 * @module lib/dependency-graph
 */

/**
 * Dependency node in the graph
 */
export interface DependencyNode {
  id: string;
  name: string;
  type: 'package' | 'module' | 'internal';
  version?: string;
  source?: string;
  isDev: boolean;
  isPeer: boolean;
  isOptional: boolean;
}

/**
 * Edge between two dependencies
 */
export interface DependencyEdge {
  from: string;
  to: string;
  type: 'imports' | 'depends' | 'peerDeps' | 'devDeps';
  weight: number;
}

/**
 * Dependency statistics
 */
export interface DependencyStats {
  totalDependencies: number;
  directDependencies: number;
  devDependencies: number;
  peerDependencies: number;
  optionalDependencies: number;
  externalPackages: number;
  internalModules: number;
  criticalDependencies: string[];
  unusedDependencies: string[];
  vulnerabilityRisk: 'low' | 'medium' | 'high';
}

/**
 * Dependency Graph Builder
 * 
 * Constructs a directed graph of all dependencies in the project,
 * including npm packages, internal modules, and import relationships.
 */
export class DependencyGraphBuilder {
  private nodes: Map<string, DependencyNode>;
  private edges: DependencyEdge[];
  private adjacencyList: Map<string, Set<string>>;

  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.adjacencyList = new Map();
  }

  /**
   * Add a dependency node to the graph
   * 
   * @param node - Dependency node to add
   */
  addNode(node: DependencyNode): void {
    // Prevent duplicate nodes
    if (this.nodes.has(node.id)) {
      return;
    }

    this.nodes.set(node.id, node);
    this.adjacencyList.set(node.id, new Set());
  }

  /**
   * Add multiple nodes
   * 
   * @param nodes - Array of nodes to add
   */
  addNodes(nodes: DependencyNode[]): void {
    for (const node of nodes) {
      this.addNode(node);
    }
  }

  /**
   * Add an edge between two nodes
   * 
   * @param from - Source node ID
   * @param to - Target node ID
   * @param type - Type of dependency
   * @param weight - Edge weight (for importance/strength)
   */
  addEdge(
    from: string,
    to: string,
    type: DependencyEdge['type'] = 'depends',
    weight: number = 1
  ): void {
    // Ensure both nodes exist
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      return;
    }

    // Prevent duplicate edges
    const existingEdge = this.edges.find(e => e.from === from && e.to === to);
    if (existingEdge) {
      existingEdge.weight += weight;
      return;
    }

    this.edges.push({ from, to, type, weight });
    this.adjacencyList.get(from)?.add(to);
  }

  /**
   * Add multiple edges
   * 
   * @param edges - Array of edges to add
   */
  addEdges(edges: DependencyEdge[]): void {
    for (const edge of edges) {
      this.addEdge(edge.from, edge.to, edge.type, edge.weight);
    }
  }

  /**
   * Get the dependency graph as JSON
   */
  toJSON() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  /**
   * Calculate statistics about the dependency graph
   * 
   * @returns Dependency statistics
   */
  getStatistics(): DependencyStats {
    const devDeps = Array.from(this.nodes.values()).filter(n => n.isDev);
    const peerDeps = Array.from(this.nodes.values()).filter(n => n.isPeer);
    const optionalDeps = Array.from(this.nodes.values()).filter(n => n.isOptional);
    const external = Array.from(this.nodes.values()).filter(n => n.type === 'package');
    const internal = Array.from(this.nodes.values()).filter(n => n.type === 'internal');

    // Identify critical dependencies (frequently depended upon)
    const criticalDependencies = this.findCriticalDependencies();

    // Identify unused dependencies
    const unusedDependencies = this.findUnusedDependencies();

    return {
      totalDependencies: this.nodes.size,
      directDependencies: external.length - devDeps.length - peerDeps.length,
      devDependencies: devDeps.length,
      peerDependencies: peerDeps.length,
      optionalDependencies: optionalDeps.length,
      externalPackages: external.length,
      internalModules: internal.length,
      criticalDependencies,
      unusedDependencies,
      vulnerabilityRisk: this.assessVulnerabilityRisk(),
    };
  }

  /**
   * Find all dependencies that are depended upon by many others
   * 
   * @private
   */
  private findCriticalDependencies(): string[] {
    const inDegree = new Map<string, number>();

    // Count incoming edges for each node
    for (const edge of this.edges) {
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    // Find nodes with high in-degree
    const critical: [string, number][] = Array.from(inDegree.entries());
    critical.sort((a, b) => b[1] - a[1]);

    // Return top 10% as critical, minimum 3
    const threshold = Math.max(3, Math.ceil(this.nodes.size * 0.1));
    return critical.slice(0, threshold).map(([id]) => id);
  }

  /**
   * Find dependencies that have no incoming edges
   * 
   * @private
   */
  private findUnusedDependencies(): string[] {
    const hasDependents = new Set<string>();

    for (const edge of this.edges) {
      hasDependents.add(edge.to);
    }

    const unused: string[] = [];
    for (const [id, node] of this.nodes) {
      if (node.type === 'package' && !hasDependents.has(id)) {
        unused.push(id);
      }
    }

    return unused;
  }

  /**
   * Assess vulnerability risk based on dependency patterns
   * 
   * @private
   */
  private assessVulnerabilityRisk(): 'low' | 'medium' | 'high' {
    // Risk increases with:
    // 1. Number of external dependencies
    // 2. Many unused dependencies (potential outdated packages)
    // 3. Deep dependency chains

    const external = Array.from(this.nodes.values()).filter(n => n.type === 'package').length;
    const unused = this.findUnusedDependencies().length;
    const maxDepth = this.findMaxDependencyDepth();

    // Scoring: each factor contributes to risk
    let riskScore = 0;

    if (external > 50) riskScore += 2; // Many external deps
    else if (external > 20) riskScore += 1;

    if (unused > external * 0.2) riskScore += 2; // > 20% unused
    else if (unused > external * 0.1) riskScore += 1;

    if (maxDepth > 10) riskScore += 2; // Deep chains
    else if (maxDepth > 5) riskScore += 1;

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Find the deepest dependency chain
   * 
   * @private
   */
  private findMaxDependencyDepth(): number {
    let maxDepth = 0;

    for (const startNode of this.nodes.keys()) {
      const depth = this.calculateDepth(startNode, new Set());
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  /**
   * Calculate depth from a starting node using BFS
   * 
   * @private
   */
  private calculateDepth(nodeId: string, visited: Set<string>): number {
    if (visited.has(nodeId)) {
      return 0;
    }

    visited.add(nodeId);

    const neighbors = this.adjacencyList.get(nodeId) || new Set();
    if (neighbors.size === 0) {
      return 1;
    }

    let maxChildDepth = 0;
    for (const neighbor of neighbors) {
      const childDepth = this.calculateDepth(neighbor, new Set(visited));
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }

    return 1 + maxChildDepth;
  }

  /**
   * Get all direct dependencies of a node
   * 
   * @param nodeId - Node ID to query
   * @returns Array of dependency node IDs
   */
  getDependencies(nodeId: string): string[] {
    return Array.from(this.adjacencyList.get(nodeId) || new Set());
  }

  /**
   * Find all circular dependencies
   * 
   * @returns Array of circular dependency paths
   */
  findCircularDependencies(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        this.dfs(nodeId, visited, recursionStack, [], cycles);
      }
    }

    return cycles;
  }

  /**
   * DFS for cycle detection
   * 
   * @private
   */
  private dfs(
    nodeId: string,
    visited: Set<string>,
    recursionStack: Set<string>,
    path: string[],
    cycles: string[][]
  ): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = this.adjacencyList.get(nodeId) || new Set();

    for (const neighbor of neighbors) {
      if (recursionStack.has(neighbor)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      } else if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited, recursionStack, [...path], cycles);
      }
    }

    recursionStack.delete(nodeId);
  }
}

export default DependencyGraphBuilder;
