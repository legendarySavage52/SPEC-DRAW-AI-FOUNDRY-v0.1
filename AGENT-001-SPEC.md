# Agent 001: Repository Audit v1.0

## Specification

### Purpose
Build a TypeScript/Next.js application that audits a repository's structure, dependencies, features, and architecture, generating comprehensive reports for human review.

### Core Responsibilities

1. **Scanner** - Recursively traverse repository structure
   - Identify all source files
   - Parse dependencies (package.json, imports)
   - Detect configuration files
   - Build file tree with metadata

2. **Dependency Graph** - Map relationships between modules
   - Parse import statements
   - Build directed graph
   - Identify circular dependencies
   - Detect unused modules
   - Calculate dependency depth

3. **Feature Detector** - Identify frameworks and technologies
   - Detect: React, Next.js, Express, TypeScript, etc.
   - Identify patterns: API routes, database models, auth, etc.
   - Detect testing frameworks
   - Detect build tools

4. **Architecture Writer** - Generate documentation
   - System architecture overview
   - Module responsibilities
   - Data flow diagrams (as ASCII/Mermaid)
   - Technology stack summary

5. **Report Builder** - Compile findings into reports
   - Architecture documentation (Markdown)
   - Feature matrix (dependencies, frameworks, patterns)
   - Project status assessment
   - Roadmap recommendations
   - Technical debt report

### Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript (strict mode)
- **Framework:** Next.js with App Router
- **UI:** React components
- **API:** RESTful endpoints
- **Reports:** Markdown generation
- **Testing:** Jest + React Testing Library (unit-test friendly design)

### Deliverable Files

```
src/
├── lib/
│   ├── scanner.ts           # Repository scanner
│   ├── dependency-graph.ts  # Dependency graph builder
│   ├── feature-detector.ts  # Framework/feature detection
│   ├── architecture-writer.ts # Documentation generator
│   └── report-builder.ts    # Report compilation
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   ├── api/
│   │   └── audit/
│   │       └── route.ts     # Audit endpoint
│   └── reports/
│       └── [id]/
│           └── page.tsx     # Report view
├── types/
│   └── index.ts             # Shared types
├── utils/
│   ├── logger.ts            # Logging utility
│   └── errors.ts            # Error handling
next.config.js              # Next.js configuration
tsconfig.json              # TypeScript configuration
```

### Quality Requirements

- ✅ TypeScript strict mode enforced
- ✅ No `any` types without justification
- ✅ JSDoc comments on all public functions
- ✅ Error handling for all external operations
- ✅ Comprehensive logging
- ✅ Unit-test friendly design
- ✅ Modular architecture
- ✅ Clean imports (no circular dependencies)
- ✅ Production-grade code quality

### Acceptance Criteria

- [ ] Scanner recursively traverses repository structure
- [ ] Dependency graph correctly maps module relationships
- [ ] Feature detector identifies all major frameworks
- [ ] Architecture documentation is generated in Markdown
- [ ] All types are strongly typed (no `any`)
- [ ] Comprehensive error handling with logging
- [ ] Unit tests written for all core functions
- [ ] No TypeScript errors in strict mode
- [ ] README documents how to use the agent
- [ ] All code follows the seven foundation rules

### Rules This Agent Follows

**Rule #1:** No breaking changes to existing code
**Rule #2:** Modular scanner, graph, detector, and writer components
**Rule #3:** Full documentation of architecture and decisions
**Rule #4:** Input validation on repository paths and file analysis
**Rule #5:** Tests before any code is merged
**Rule #6:** Commit messages explain architectural reasoning
**Rule #7:** Each module improves code quality and maintainability

### Success Metric

A working, documented, tested repository audit agent that:
- Can analyze a real-world repository in under 30 seconds
- Generates accurate architecture documentation
- Identifies all major dependencies and frameworks
- Runs without errors or warnings
- Is ready for Agent 002 (Builder) to extend