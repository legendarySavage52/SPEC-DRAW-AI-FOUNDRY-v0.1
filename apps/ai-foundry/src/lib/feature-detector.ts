/**
 * Feature Detector Module
 * 
 * Automatically detects frameworks, libraries, and features in use:
 * - Frontend frameworks (React, Vue, Svelte, etc.)
 * - Backend frameworks (Express, Django, FastAPI, etc.)
 * - Testing frameworks (Jest, Vitest, Pytest, etc.)
 * - Build tools (Webpack, Vite, Turbo, etc.)
 * - Database systems (PostgreSQL, MongoDB, etc.)
 * - Authentication (Auth0, Firebase, etc.)
 * 
 * @module lib/feature-detector
 */

/**
 * Detected feature
 */
export interface DetectedFeature {
  name: string;
  category: string;
  type: 'framework' | 'library' | 'tool' | 'infrastructure';
  confidence: number; // 0-1
  version?: string;
  evidences: string[]; // What led to this detection
  documentation?: string;
}

/**
 * Feature detection result
 */
export interface FeatureDetectionResult {
  features: DetectedFeature[];
  frameworks: DetectedFeature[];
  libraries: DetectedFeature[];
  tools: DetectedFeature[];
  infrastructure: DetectedFeature[];
  techStack: string[];
}

/**
 * Pattern to match for feature detection
 */
interface DetectionPattern {
  name: string;
  category: string;
  type: DetectedFeature['type'];
  patterns: RegExp[];
  documentation?: string;
}

/**
 * Feature Detector
 * 
 * Analyzes repository files to detect what frameworks,
 * libraries, and tools are being used.
 */
export class FeatureDetector {
  private patterns: DetectionPattern[] = [
    // Frontend Frameworks
    {
      name: 'React',
      category: 'Frontend Framework',
      type: 'framework',
      patterns: [
        /react/i,
        /from ['"]react['"]/,
        /jsx/i,
        /next\.js/i,
      ],
      documentation: 'https://react.dev',
    },
    {
      name: 'Next.js',
      category: 'Frontend Framework',
      type: 'framework',
      patterns: [
        /next\.config/i,
        /next\/link/,
        /next\/router/,
        /next\/image/,
      ],
      documentation: 'https://nextjs.org',
    },
    {
      name: 'Vue.js',
      category: 'Frontend Framework',
      type: 'framework',
      patterns: [
        /vue/i,
        /from ['"]vue['"]/,
        /\.vue/,
        /<template>/i,
      ],
      documentation: 'https://vuejs.org',
    },
    {
      name: 'Svelte',
      category: 'Frontend Framework',
      type: 'framework',
      patterns: [
        /svelte/i,
        /from ['"]svelte['"]/,
        /\.svelte/,
      ],
      documentation: 'https://svelte.dev',
    },

    // Backend Frameworks
    {
      name: 'Express.js',
      category: 'Backend Framework',
      type: 'framework',
      patterns: [
        /express/i,
        /app\.use\(/,
        /app\.get\(/,
        /from ['"]express['"]/,
      ],
      documentation: 'https://expressjs.com',
    },
    {
      name: 'Django',
      category: 'Backend Framework',
      type: 'framework',
      patterns: [
        /django/i,
        /from django/,
        /settings\.py/,
        /manage\.py/,
      ],
      documentation: 'https://www.djangoproject.com',
    },
    {
      name: 'FastAPI',
      category: 'Backend Framework',
      type: 'framework',
      patterns: [
        /fastapi/i,
        /from fastapi/,
        /@app\.get/,
        /@app\.post/,
      ],
      documentation: 'https://fastapi.tiangolo.com',
    },

    // Testing Frameworks
    {
      name: 'Jest',
      category: 'Testing Framework',
      type: 'tool',
      patterns: [
        /jest/i,
        /jest\.config/,
        /describe\(/,
        /test\(/,
      ],
      documentation: 'https://jestjs.io',
    },
    {
      name: 'Vitest',
      category: 'Testing Framework',
      type: 'tool',
      patterns: [
        /vitest/i,
        /vitest\.config/,
        /\.test\.ts/,
        /\.spec\.ts/,
      ],
      documentation: 'https://vitest.dev',
    },
    {
      name: 'Pytest',
      category: 'Testing Framework',
      type: 'tool',
      patterns: [
        /pytest/i,
        /test_.*\.py/,
        /def test_/,
      ],
      documentation: 'https://pytest.org',
    },

    // Build Tools
    {
      name: 'Webpack',
      category: 'Build Tool',
      type: 'tool',
      patterns: [
        /webpack/i,
        /webpack\.config/,
        /entry:/,
        /output:/,
      ],
      documentation: 'https://webpack.js.org',
    },
    {
      name: 'Vite',
      category: 'Build Tool',
      type: 'tool',
      patterns: [
        /vite/i,
        /vite\.config/,
        /import\.meta\.env/,
      ],
      documentation: 'https://vitejs.dev',
    },
    {
      name: 'Turbo',
      category: 'Monorepo Tool',
      type: 'tool',
      patterns: [
        /turbo/i,
        /turbo\.json/,
        /turborepo/i,
      ],
      documentation: 'https://turbo.build',
    },

    // Language/Runtime
    {
      name: 'TypeScript',
      category: 'Language',
      type: 'library',
      patterns: [
        /typescript/i,
        /tsconfig\.json/,
        /\.ts$/,
        /\.tsx$/,
      ],
      documentation: 'https://www.typescriptlang.org',
    },
    {
      name: 'Node.js',
      category: 'Runtime',
      type: 'infrastructure',
      patterns: [
        /node_modules/,
        /package\.json/,
        /require\(/,
        /module\.exports/,
      ],
      documentation: 'https://nodejs.org',
    },

    // Database
    {
      name: 'PostgreSQL',
      category: 'Database',
      type: 'infrastructure',
      patterns: [
        /postgres/i,
        /pg/i,
        /postgresql/i,
        /from ['"]pg['"]/,
      ],
      documentation: 'https://www.postgresql.org',
    },
    {
      name: 'MongoDB',
      category: 'Database',
      type: 'infrastructure',
      patterns: [
        /mongodb/i,
        /mongoose/i,
        /from ['"]mongoose['"]/,
      ],
      documentation: 'https://www.mongodb.com',
    },
    {
      name: 'Supabase',
      category: 'Backend as a Service',
      type: 'infrastructure',
      patterns: [
        /supabase/i,
        /from ['"]@supabase/,
      ],
      documentation: 'https://supabase.com',
    },

    // Authentication
    {
      name: 'Auth0',
      category: 'Authentication',
      type: 'library',
      patterns: [
        /auth0/i,
        /from ['"]@auth0/,
      ],
      documentation: 'https://auth0.com',
    },
    {
      name: 'Firebase',
      category: 'Firebase Services',
      type: 'infrastructure',
      patterns: [
        /firebase/i,
        /from ['"]firebase['"]/,
      ],
      documentation: 'https://firebase.google.com',
    },

    // ORM/Query
    {
      name: 'Prisma',
      category: 'ORM',
      type: 'library',
      patterns: [
        /prisma/i,
        /prisma\.schema/,
        /from ['"]@prisma/,
      ],
      documentation: 'https://www.prisma.io',
    },
    {
      name: 'TypeORM',
      category: 'ORM',
      type: 'library',
      patterns: [
        /typeorm/i,
        /from ['"]typeorm['"]/,
      ],
      documentation: 'https://typeorm.io',
    },

    // Styling
    {
      name: 'Tailwind CSS',
      category: 'CSS Framework',
      type: 'library',
      patterns: [
        /tailwindcss/i,
        /tailwind\.config/,
        /class="[^"]*\b(flex|grid|p-|m-|w-|h-)/,
      ],
      documentation: 'https://tailwindcss.com',
    },

    // State Management
    {
      name: 'Redux',
      category: 'State Management',
      type: 'library',
      patterns: [
        /redux/i,
        /from ['"]redux['"]/,
        /store\.dispatch/,
      ],
      documentation: 'https://redux.js.org',
    },
    {
      name: 'Zustand',
      category: 'State Management',
      type: 'library',
      patterns: [
        /zustand/i,
        /from ['"]zustand['"]/,
      ],
      documentation: 'https://github.com/pmndrs/zustand',
    },

    // Documentation
    {
      name: 'Storybook',
      category: 'Component Documentation',
      type: 'tool',
      patterns: [
        /storybook/i,
        /\.stories\./,
        /from ['"]@storybook/,
      ],
      documentation: 'https://storybook.js.org',
    },

    // CI/CD
    {
      name: 'GitHub Actions',
      category: 'CI/CD',
      type: 'tool',
      patterns: [
        /\.github\/workflows/,
        /name:/,
        /on:/,
      ],
      documentation: 'https://github.com/features/actions',
    },
  ];

  /**
   * Detect features from content
   * 
   * @param content - File content to analyze
   * @returns Array of detected features
   */
  detectFromContent(content: string): DetectedFeature[] {
    const detected: Map<string, DetectedFeature> = new Map();

    for (const pattern of this.patterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(content)) {
          // Calculate confidence (more patterns matched = higher confidence)
          const matchCount = pattern.patterns.filter(p => p.test(content)).length;
          const confidence = Math.min(1, matchCount / pattern.patterns.length);

          const key = pattern.name;
          if (!detected.has(key)) {
            detected.set(key, {
              name: pattern.name,
              category: pattern.category,
              type: pattern.type,
              confidence,
              evidences: [regex.source],
              documentation: pattern.documentation,
            });
          } else {
            const existing = detected.get(key)!;
            existing.confidence = Math.min(1, existing.confidence + 0.1);
            existing.evidences.push(regex.source);
          }
        }
      }
    }

    return Array.from(detected.values());
  }

  /**
   * Detect features from multiple files
   * 
   * @param files - Map of file paths to content
   * @returns Feature detection result
   */
  detect(files: Map<string, string>): FeatureDetectionResult {
    const allFeatures = new Map<string, DetectedFeature>();

    for (const [path, content] of files) {
      const detected = this.detectFromContent(content);
      for (const feature of detected) {
        if (!allFeatures.has(feature.name)) {
          allFeatures.set(feature.name, feature);
        } else {
          // Update confidence if this is a stronger match
          const existing = allFeatures.get(feature.name)!;
          existing.confidence = Math.max(existing.confidence, feature.confidence);
          existing.evidences.push(...feature.evidences);
        }
      }
    }

    // Categorize and sort
    const features = Array.from(allFeatures.values())
      .sort((a, b) => b.confidence - a.confidence);

    const frameworks = features.filter(f => f.type === 'framework');
    const libraries = features.filter(f => f.type === 'library');
    const tools = features.filter(f => f.type === 'tool');
    const infrastructure = features.filter(f => f.type === 'infrastructure');

    const techStack = features
      .filter(f => f.confidence >= 0.5)
      .map(f => f.name);

    return {
      features,
      frameworks,
      libraries,
      tools,
      infrastructure,
      techStack,
    };
  }
}

export default FeatureDetector;
