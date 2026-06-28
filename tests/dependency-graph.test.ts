// tests/dependency-graph.test.ts
import { buildDependencyGraph } from '../src/lib/dependency-graph';

describe('dependency graph', () => {
  it('builds a graph with nodes for provided files', () => {
    const files = [
      { path: 'src/index.ts', ext: '.ts', size: 10, imports: [] },
      { path: 'src/util.ts', ext: '.ts', size: 20, imports: [] },
    ];
    const g = buildDependencyGraph(files as any);
    expect(g.nodes).toContain('src/index.ts');
    expect(g.nodes).toContain('src/util.ts');
    expect(Array.isArray(g.edges)).toBe(true);
  });
});
