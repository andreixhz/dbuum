/**
 * Centralized logging system for migration database
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

class Logger {
  private level: LogLevel;
  private logFile?: string;

  constructor(level: LogLevel = LogLevel.INFO, logFile?: string) {
    this.level = level;
    this.logFile = logFile;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
  }

  private writeToFile(message: string): void {
    if (this.logFile) {
      const fs = require('fs');
      fs.appendFileSync(this.logFile, message + '\n');
    }
  }

  private log(level: LogLevel, message: string, context?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    
    // Console output
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }

    // File output
    this.writeToFile(formattedMessage);
  }

  error(message: string, context?: any): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setLogFile(filePath: string): void {
    this.logFile = filePath;
  }
}

// Default logger instance
export const logger = new Logger();

// Migration-specific logger
export const migrationLogger = new Logger(LogLevel.INFO, 'migration.log');
