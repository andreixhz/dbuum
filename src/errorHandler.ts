/**
 * Centralized error handling system for migration database
 */

import { logger } from './logger';

export enum ErrorType {
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  MIGRATION_ERROR = 'MIGRATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class MigrationError extends Error {
  public readonly type: ErrorType;
  public readonly context?: any;
  public readonly timestamp: string;

  constructor(
    message: string, 
    type: ErrorType = ErrorType.UNKNOWN_ERROR, 
    context?: any
  ) {
    super(message);
    this.name = 'MigrationError';
    this.type = type;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorCount: Map<ErrorType, number> = new Map();
  private criticalErrors: MigrationError[] = [];

  private constructor() {
    // Initialize error counts
    Object.values(ErrorType).forEach(type => {
      this.errorCount.set(type, 0);
    });
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handle(error: Error | MigrationError, context?: any): void {
    const migrationError = error instanceof MigrationError 
      ? error 
      : new MigrationError(error.message, ErrorType.UNKNOWN_ERROR, context);

    // Increment error count
    const currentCount = this.errorCount.get(migrationError.type) || 0;
    this.errorCount.set(migrationError.type, currentCount + 1);

    // Log error
    logger.error(`Migration Error [${migrationError.type}]: ${migrationError.message}`, {
      type: migrationError.type,
      context: migrationError.context,
      timestamp: migrationError.timestamp,
      stack: migrationError.stack
    });

    // Store critical errors
    if (this.isCriticalError(migrationError)) {
      this.criticalErrors.push(migrationError);
    }
  }

  public handleDatabaseError(error: Error, query?: string, context?: any): void {
    const migrationError = new MigrationError(
      `Database error: ${error.message}`,
      ErrorType.DATABASE_ERROR,
      { originalError: error.message, query, ...context }
    );
    this.handle(migrationError);
  }

  public handleMigrationError(error: Error, migrationName: string, context?: any): void {
    const migrationError = new MigrationError(
      `Migration error in ${migrationName}: ${error.message}`,
      ErrorType.MIGRATION_ERROR,
      { migrationName, originalError: error.message, ...context }
    );
    this.handle(migrationError);
  }

  public handleValidationError(message: string, field?: string, context?: any): void {
    const migrationError = new MigrationError(
      `Validation error: ${message}`,
      ErrorType.VALIDATION_ERROR,
      { field, ...context }
    );
    this.handle(migrationError);
  }

  public handleFileError(error: Error, filePath: string, operation: string): void {
    const migrationError = new MigrationError(
      `File ${operation} error: ${error.message}`,
      ErrorType.FILE_ERROR,
      { filePath, operation, originalError: error.message }
    );
    this.handle(migrationError);
  }

  private isCriticalError(error: MigrationError): boolean {
    return [
      ErrorType.CONFIGURATION_ERROR,
      ErrorType.DATABASE_ERROR
    ].includes(error.type);
  }

  public getErrorCount(type?: ErrorType): number {
    if (type) {
      return this.errorCount.get(type) || 0;
    }
    return Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0);
  }

  public getCriticalErrors(): MigrationError[] {
    return [...this.criticalErrors];
  }

  public hasCriticalErrors(): boolean {
    return this.criticalErrors.length > 0;
  }

  public getErrorSummary(): { [key: string]: number } {
    const summary: { [key: string]: number } = {};
    this.errorCount.forEach((count, type) => {
      summary[type] = count;
    });
    return summary;
  }

  public reset(): void {
    this.errorCount.clear();
    this.criticalErrors = [];
    Object.values(ErrorType).forEach(type => {
      this.errorCount.set(type, 0);
    });
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
