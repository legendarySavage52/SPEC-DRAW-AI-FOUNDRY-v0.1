/**
 * Structured Logging Module
 * 
 * Provides consistent, production-grade logging with:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - Structured output (JSON compatible)
 * - Timestamp and context tracking
 * - Performance metrics
 * 
 * @module lib/logger
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: string;
}

/**
 * Structured Logger
 * 
 * Production-ready logging with configurable levels,
 * context support, and structured output.
 */
export class Logger {
  private level: LogLevel;
  private context: Map<string, unknown>;
  private startTime: Map<string, number>;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.context = new Map();
    this.startTime = new Map();
  }

  /**
   * Set a context value that will be included in all logs
   * 
   * @param key - Context key
   * @param value - Context value
   */
  setContext(key: string, value: unknown): void {
    this.context.set(key, value);
  }

  /**
   * Clear a context value
   * 
   * @param key - Context key to remove
   */
  clearContext(key: string): void {
    this.context.delete(key);
  }

  /**
   * Get all current context
   */
  getContext(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of this.context) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Start a performance timer
   * 
   * @param label - Timer label
   */
  startTimer(label: string): void {
    this.startTime.set(label, Date.now());
  }

  /**
   * End a performance timer and log the duration
   * 
   * @param label - Timer label
   * @param level - Log level for the result
   */
  endTimer(label: string, level: LogLevel = LogLevel.DEBUG): void {
    const start = this.startTime.get(label);
    if (!start) {
      this.warn(`Timer "${label}" not found`);
      return;
    }

    const duration = Date.now() - start;
    this.startTime.delete(label);

    this.log(level, `Timer: ${label}`, { duration_ms: duration });
  }

  /**
   * Log a debug message
   * 
   * @param message - Log message
   * @param context - Optional context data
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   * 
   * @param message - Log message
   * @param context - Optional context data
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   * 
   * @param message - Log message
   * @param context - Optional context data
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   * 
   * @param message - Log message
   * @param error - Optional error object
   * @param context - Optional context data
   */
  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      context: { ...this.getContext(), ...context },
      error: errorMessage,
    };

    console.error(JSON.stringify(entry));
  }

  /**
   * Core logging method
   * 
   * @private
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    // Check if this log level should be output
    if (level < this.level) {
      return;
    }

    const levelName = LogLevel[level];
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
      context: { ...this.getContext(), ...context },
    };

    const json = JSON.stringify(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(json);
        break;
      case LogLevel.INFO:
        console.info(json);
        break;
      case LogLevel.WARN:
        console.warn(json);
        break;
      case LogLevel.ERROR:
        console.error(json);
        break;
    }
  }
}

export default Logger;
