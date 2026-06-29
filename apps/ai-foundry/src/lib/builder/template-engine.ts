/**
 * Template Engine Module
 * 
 * Manages code templates for multiple languages and frameworks.
 * Templates are parameterized and can be customized during code generation.
 * 
 * Supports:
 * - TypeScript/JavaScript (Node.js, Next.js, React)
 * - Python (FastAPI, Django)
 * - Go
 * - Java
 * 
 * @module lib/builder/template-engine
 */

/**
 * Code template with placeholders
 */
export interface CodeTemplate {
  id: string;
  name: string;
  language: string;
  framework?: string;
  category: 'function' | 'class' | 'module' | 'component' | 'service';
  content: string;
  placeholders: TemplatePlaceholder[];
  examples: TemplateExample[];
}

/**
 * Placeholder in a template
 */
export interface TemplatePlaceholder {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

/**
 * Example usage of a template
 */
export interface TemplateExample {
  name: string;
  placeholders: Record<string, unknown>;
  expectedOutput: string;
}

/**
 * Template Engine
 * 
 * Manages code templates and handles variable substitution
 * to generate customized code.
 */
export class TemplateEngine {
  private templates: Map<string, CodeTemplate> = new Map();

  constructor() {
    this.initializeBuiltInTemplates();
  }

  /**
   * Initialize built-in templates for common patterns
   * @private
   */
  private initializeBuiltInTemplates(): void {
    // TypeScript API Handler
    this.registerTemplate({
      id: 'ts-api-handler',
      name: 'TypeScript API Handler',
      language: 'typescript',
      framework: 'express',
      category: 'function',
      content: `/**
 * {{FUNCTION_NAME}}
 * 
 * {{DESCRIPTION}}
 */
export async function {{FUNCTION_NAME}}(
  req: Request,
  res: Response
): Promise<void> {
  try {
    {{IMPLEMENTATION}}

    res.status(200).json({
      success: true,
      data: {{RETURN_VALUE}},
    });
  } catch (error) {
    console.error('Error in {{FUNCTION_NAME}}:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}`,
      placeholders: [
        {
          name: 'FUNCTION_NAME',
          type: 'string',
          required: true,
          description: 'Name of the API handler function',
        },
        {
          name: 'DESCRIPTION',
          type: 'string',
          required: true,
          description: 'JSDoc description of the handler',
        },
        {
          name: 'IMPLEMENTATION',
          type: 'string',
          required: true,
          description: 'Main function body',
        },
        {
          name: 'RETURN_VALUE',
          type: 'string',
          required: true,
          description: 'Value to return in response',
        },
      ],
      examples: [],
    });

    // TypeScript Service Class
    this.registerTemplate({
      id: 'ts-service-class',
      name: 'TypeScript Service Class',
      language: 'typescript',
      category: 'class',
      content: `/**
 * {{CLASS_NAME}}
 * 
 * {{DESCRIPTION}}
 */
export class {{CLASS_NAME}} {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * {{METHOD_NAME}}
   * 
   * @param {{PARAM_NAME}} - {{PARAM_DESCRIPTION}}
   * @returns {{RETURN_TYPE}}
   * @throws {{ERROR_TYPE}} - {{ERROR_DESCRIPTION}}
   */
  async {{METHOD_NAME}}({{METHOD_PARAMS}}): Promise<{{RETURN_TYPE}}> {
    this.logger.info('Executing {{METHOD_NAME}}', {
      params: { {{PARAM_NAME}} },
    });

    try {
      {{IMPLEMENTATION}}
      
      this.logger.info('{{METHOD_NAME}} completed successfully');
      return {{RETURN_VALUE}};
    } catch (error) {
      this.logger.error('{{METHOD_NAME}} failed', error);
      throw error;
    }
  }
}`,
      placeholders: [
        {
          name: 'CLASS_NAME',
          type: 'string',
          required: true,
          description: 'Name of the service class',
        },
        {
          name: 'DESCRIPTION',
          type: 'string',
          required: true,
          description: 'Class description',
        },
        {
          name: 'METHOD_NAME',
          type: 'string',
          required: true,
          description: 'Name of the method',
        },
        {
          name: 'METHOD_PARAMS',
          type: 'string',
          required: true,
          description: 'Method parameters',
        },
        {
          name: 'PARAM_NAME',
          type: 'string',
          required: true,
          description: 'Parameter name',
        },
        {
          name: 'PARAM_DESCRIPTION',
          type: 'string',
          required: true,
          description: 'Parameter description',
        },
        {
          name: 'IMPLEMENTATION',
          type: 'string',
          required: true,
          description: 'Method implementation',
        },
        {
          name: 'RETURN_TYPE',
          type: 'string',
          required: true,
          description: 'Return type',
        },
        {
          name: 'RETURN_VALUE',
          type: 'string',
          required: true,
          description: 'Value to return',
        },
        {
          name: 'ERROR_TYPE',
          type: 'string',
          required: false,
          description: 'Error type that may be thrown',
        },
        {
          name: 'ERROR_DESCRIPTION',
          type: 'string',
          required: false,
          description: 'Error description',
        },
      ],
      examples: [],
    });

    // Python FastAPI Endpoint
    this.registerTemplate({
      id: 'py-fastapi-endpoint',
      name: 'Python FastAPI Endpoint',
      language: 'python',
      framework: 'fastapi',
      category: 'function',
      content: `@app.{{HTTP_METHOD}}("{{ROUTE}}")
async def {{FUNCTION_NAME}}({{PARAMS}}) -> {{RESPONSE_TYPE}}:
    """
    {{DESCRIPTION}}
    
    Args:
        {{ARG_DOCS}}
    
    Returns:
        {{RETURN_DOCS}}
    
    Raises:
        {{ERROR_DOCS}}
    """
    logger.info(f"Executing {{FUNCTION_NAME}}")
    
    try:
        {{IMPLEMENTATION}}
        
        logger.info(f"{{FUNCTION_NAME}} completed successfully")
        return {{RETURN_VALUE}}
    except Exception as error:
        logger.error(f"{{FUNCTION_NAME}} failed: {error}")
        raise HTTPException(status_code=500, detail=str(error))`,
      placeholders: [
        {
          name: 'HTTP_METHOD',
          type: 'string',
          required: true,
          description: 'HTTP method (get, post, put, delete)',
        },
        {
          name: 'ROUTE',
          type: 'string',
          required: true,
          description: 'API route path',
        },
        {
          name: 'FUNCTION_NAME',
          type: 'string',
          required: true,
          description: 'Function name',
        },
        {
          name: 'PARAMS',
          type: 'string',
          required: true,
          description: 'Function parameters',
        },
        {
          name: 'RESPONSE_TYPE',
          type: 'string',
          required: true,
          description: 'Response type annotation',
        },
        {
          name: 'DESCRIPTION',
          type: 'string',
          required: true,
          description: 'Function docstring',
        },
        {
          name: 'IMPLEMENTATION',
          type: 'string',
          required: true,
          description: 'Function implementation',
        },
        {
          name: 'RETURN_VALUE',
          type: 'string',
          required: true,
          description: 'Return value',
        },
      ],
      examples: [],
    });

    // Unit Test Template
    this.registerTemplate({
      id: 'ts-unit-test',
      name: 'TypeScript Unit Test',
      language: 'typescript',
      category: 'module',
      content: `import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { {{CLASS_NAME}} } from './{{MODULE_NAME}}';

describe('{{CLASS_NAME}}', () => {
  let service: {{CLASS_NAME}};
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    service = new {{CLASS_NAME}}(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('{{METHOD_NAME}}', () => {
    it('should {{TEST_DESCRIPTION}}', async () => {
      // Arrange
      {{ARRANGE_CODE}}

      // Act
      const result = await service.{{METHOD_NAME}}({{TEST_INPUT}});

      // Assert
      expect(result).toEqual({{EXPECTED_OUTPUT}});
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      {{ERROR_ARRANGE}}

      // Act & Assert
      await expect(service.{{METHOD_NAME}}({{ERROR_INPUT}})).rejects.toThrow();
    });
  });
});`,
      placeholders: [
        {
          name: 'CLASS_NAME',
          type: 'string',
          required: true,
          description: 'Class being tested',
        },
        {
          name: 'MODULE_NAME',
          type: 'string',
          required: true,
          description: 'Module file name',
        },
        {
          name: 'METHOD_NAME',
          type: 'string',
          required: true,
          description: 'Method being tested',
        },
        {
          name: 'TEST_DESCRIPTION',
          type: 'string',
          required: true,
          description: 'What the test should verify',
        },
        {
          name: 'ARRANGE_CODE',
          type: 'string',
          required: true,
          description: 'Test setup code',
        },
        {
          name: 'TEST_INPUT',
          type: 'string',
          required: true,
          description: 'Input for the test',
        },
        {
          name: 'EXPECTED_OUTPUT',
          type: 'string',
          required: true,
          description: 'Expected output',
        },
      ],
      examples: [],
    });
  }

  /**
   * Register a new template
   * 
   * @param template - Template to register
   */
  registerTemplate(template: CodeTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get a template by ID
   * 
   * @param id - Template ID
   * @returns Template or undefined
   */
  getTemplate(id: string): CodeTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * List all templates matching criteria
   * 
   * @param language - Optional language filter
   * @param framework - Optional framework filter
   * @returns Array of matching templates
   */
  listTemplates(language?: string, framework?: string): CodeTemplate[] {
    return Array.from(this.templates.values()).filter(t => {
      if (language && t.language !== language) return false;
      if (framework && t.framework !== framework) return false;
      return true;
    });
  }

  /**
   * Render a template with placeholders
   * 
   * @param templateId - Template ID
   * @param values - Placeholder values
   * @returns Rendered code
   * @throws Error if template not found or required placeholders missing
   */
  render(templateId: string, values: Record<string, unknown>): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate required placeholders
    for (const placeholder of template.placeholders) {
      if (placeholder.required && !(placeholder.name in values)) {
        throw new Error(`Required placeholder missing: ${placeholder.name}`);
      }
    }

    // Replace placeholders
    let rendered = template.content;
    for (const [key, value] of Object.entries(values)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Remove any unreplaced placeholders with defaults
    for (const placeholder of template.placeholders) {
      if (placeholder.defaultValue) {
        const pattern = `{{${placeholder.name}}}`;
        rendered = rendered.replace(new RegExp(pattern, 'g'), placeholder.defaultValue);
      }
    }

    return rendered;
  }

  /**
   * Validate placeholders against a template
   * 
   * @param templateId - Template ID
   * @param values - Values to validate
   * @returns Validation result
   */
  validatePlaceholders(
    templateId: string,
    values: Record<string, unknown>
  ): { isValid: boolean; errors: string[] } {
    const template = this.templates.get(templateId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template not found: ${templateId}`],
      };
    }

    const errors: string[] = [];

    // Check required placeholders
    for (const placeholder of template.placeholders) {
      if (placeholder.required && !(placeholder.name in values)) {
        errors.push(`Required placeholder missing: ${placeholder.name} (${placeholder.type})`);
      }

      // Type validation
      if (placeholder.name in values) {
        const value = values[placeholder.name];
        const actualType = typeof value;
        if (actualType !== placeholder.type && placeholder.type !== 'any') {
          errors.push(
            `Placeholder "${placeholder.name}" expected ${placeholder.type} but got ${actualType}`
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default TemplateEngine;
