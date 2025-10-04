/**
 * Configuration management for migration database
 */

import fs from 'fs';
import { YAML } from 'bun';
import { validateConfig } from './utils';
import { logger } from './logger';
import { errorHandler, ErrorType } from './errorHandler';

export interface DatabaseConfig {
  adapter: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface MigrationConfig {
  name: string;
  table: {
    source: string;
    target: string;
  };
  columns: {
    column: string;
    primary: boolean;
    target_column?: string;
    conversion?: {
      type: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
      target_type?: 'int' | 'boolean' | 'float' | 'text' | 'uuid' | 'bigint' | 'tinytext';
    };
  }[];
}

export interface AppConfig {
  database: {
    source: DatabaseConfig;
    target: DatabaseConfig;
  };
  migrations: MigrationConfig[];
  logging?: {
    level: 'error' | 'warn' | 'info' | 'debug';
    file?: string;
  };
  checkpoint?: {
    file: string;
    autoSave: boolean;
  };
  performance?: {
    batchSize: number;
    maxRetries: number;
    retryDelay: number;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig | null = null;
  private configFile: string | null = null;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public loadFromFile(filePath: string): AppConfig {
    try {
      logger.info(`Loading configuration from: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`Configuration file not found: ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const rawConfig = YAML.parse(fileContent) as any;
      
      // Validate configuration
      const validation = validateConfig(rawConfig);
      if (!validation.isValid) {
        const errorMessage = `Configuration validation failed: ${validation.errors.join(', ')}`;
        logger.error(errorMessage);
        errorHandler.handleValidationError(errorMessage, 'config', { filePath, errors: validation.errors });
        throw new Error(errorMessage);
      }

      // Apply defaults
      this.config = this.applyDefaults(rawConfig);
      this.configFile = filePath;
      
      logger.info('Configuration loaded successfully');
      return this.config;
    } catch (error) {
      const errorMessage = `Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`;
      logger.error(errorMessage, { filePath, error });
      errorHandler.handleFileError(error as Error, filePath, 'read');
      throw new Error(errorMessage);
    }
  }

  public getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadFromFile() first.');
    }
    return this.config;
  }

  public getSourceConfig(): DatabaseConfig {
    return this.getConfig().database.source;
  }

  public getTargetConfig(): DatabaseConfig {
    return this.getConfig().database.target;
  }

  public getMigrations(): MigrationConfig[] {
    return this.getConfig().migrations;
  }

  public getLoggingConfig() {
    return this.getConfig().logging || { level: 'info' };
  }

  public getCheckpointConfig() {
    return this.getConfig().checkpoint || { file: 'checkpoint.json', autoSave: true };
  }

  public getPerformanceConfig() {
    return this.getConfig().performance || { 
      batchSize: 1000, 
      maxRetries: 3, 
      retryDelay: 1000 
    };
  }

  private applyDefaults(config: any): AppConfig {
    return {
      database: config.database,
      migrations: config.migrations,
      logging: {
        level: config.logging?.level || 'info',
        file: config.logging?.file || 'migration.log'
      },
      checkpoint: {
        file: config.checkpoint?.file || 'checkpoint.json',
        autoSave: config.checkpoint?.autoSave !== false
      },
      performance: {
        batchSize: config.performance?.batchSize || 1000,
        maxRetries: config.performance?.maxRetries || 3,
        retryDelay: config.performance?.retryDelay || 1000
      }
    };
  }

  public reload(): AppConfig {
    if (!this.configFile) {
      throw new Error('No configuration file loaded. Cannot reload.');
    }
    return this.loadFromFile(this.configFile);
  }

  public isLoaded(): boolean {
    return this.config !== null;
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();
