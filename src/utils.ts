import fs from 'fs';
import type { Migration } from "../types";

/**
 * Validates the migration configuration
 * @param config - The configuration object to validate
 * @returns Object containing validation result and error messages
 */
export function validateConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config) {
    errors.push("Config is required");
    return { isValid: false, errors };
  }

  if (!config.database) {
    errors.push("Database configuration is required");
    return { isValid: false, errors };
  }

  if (!config.database.source) {
    errors.push("Source database is required");
  } else {
    const source = config.database.source;
    if (!source.adapter) errors.push("Source adapter is required");
    if (!source.host) errors.push("Source host is required");
    if (!source.port) errors.push("Source port is required");
    if (!source.user) errors.push("Source user is required");
    if (!source.password) errors.push("Source password is required");
    if (!source.database) errors.push("Source database name is required");
  }

  if (!config.database.target) {
    errors.push("Target database is required");
  } else {
    const target = config.database.target;
    if (!target.adapter) errors.push("Target adapter is required");
    if (!target.host) errors.push("Target host is required");
    if (!target.port) errors.push("Target port is required");
    if (!target.user) errors.push("Target user is required");
    if (!target.password) errors.push("Target password is required");
    if (!target.database) errors.push("Target database name is required");
  }

  if (!config.migrations) {
    errors.push("Migrations are required");
  } else if (!Array.isArray(config.migrations)) {
    errors.push("Migrations must be an array");
  } else if (config.migrations.length === 0) {
    errors.push("At least one migration is required");
  } else {
    config.migrations.forEach((migration: any, index: number) => {
      if (!migration.name) {
        errors.push(`Migration ${index}: name is required`);
      }
      if (!migration.table) {
        errors.push(`Migration ${index}: table configuration is required`);
      } else {
        if (!migration.table.source) {
          errors.push(`Migration ${index}: source table is required`);
        }
        if (!migration.table.target) {
          errors.push(`Migration ${index}: target table is required`);
        }
      }
      if (!migration.columns || !Array.isArray(migration.columns)) {
        errors.push(`Migration ${index}: columns must be an array`);
      } else if (migration.columns.length === 0) {
        errors.push(`Migration ${index}: at least one column is required`);
      } else {
        migration.columns.forEach((column: any, colIndex: number) => {
          if (!column.column) {
            errors.push(`Migration ${index}, Column ${colIndex}: column name is required`);
          }
        });
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Saves an inserted ID to the checkpoint file for resumable migrations
 * @param id - The ID to save to checkpoint
 * @param checkpointFile - Path to the checkpoint file (default: 'checkpoint.json')
 */
export function saveInsertedIds(id: any, checkpointFile: string = 'checkpoint.json') {
    if (!fs.existsSync(checkpointFile)) {
        fs.writeFileSync(checkpointFile, JSON.stringify([id], null, 2));
        return;
    }

    const checkpoint = fs.readFileSync(checkpointFile, 'utf8');
    const checkpointData = JSON.parse(checkpoint);
    checkpointData.push(id);
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpointData, null, 2));
}

/**
 * Converts data according to migration column specifications
 * @param data - The source data to convert
 * @param migration - The migration configuration containing column specifications
 * @returns Converted data object
 */
export const convertData = (data: any, migration: Migration) => {
    let newData: any = {};
    for (const column of migration.columns) {
        if (column.conversion) {
            newData[column.column] = column.conversion.type === 'int' ? data[column.column] === 1 : data[column.column];
        } else {
            newData[column.column] = data[column.column];
        }
    }
    return newData;
}

/**
 * Generates an INSERT SQL query for the given data and migration
 * @param data - The data to insert
 * @param migration - The migration configuration
 * @returns SQL INSERT query string
 */
export const makeInsertQuery = (data: any, migration: Migration) => {
    const values = migration.columns.map(column => {
        switch (typeof data[column.column]) {
            case 'boolean':
                return data[column.column];
            case 'number':
                return data[column.column];
            case 'string':
                return `'${data[column.column]}'`;
            case 'object':
                return `'${JSON.stringify(data[column.column])}'`;
            default:
                return `'${data[column.column]}'`;
        }
    }).join(', ');

    return `
        INSERT INTO ${migration.table.target} (${migration.columns.map(column => column.column).join(', ')}) VALUES (${values})
    `;
}

/**
 * Generates a SELECT SQL query to extract data from the source table
 * @param migration - The migration configuration
 * @returns SQL SELECT query string
 */
export const extractionQuery = (migration: Migration) => `
    SELECT ${migration.columns.map(column => column.column).join(', ')} FROM ${migration.table.source}
`;

/**
 * Formats migration analytics for display
 * @param analytics - The analytics data object
 * @param avgTime - Average time per operation in milliseconds
 * @returns Formatted analytics string
 */
export function formatAnalytics(analytics: any, avgTime: number) {
    console.clear();

    return `
        Migration: ${analytics.name}
        Inserted: ${analytics.inserted}
        Total: ${analytics.total}
        Percentage: ${(analytics.inserted + analytics.error) / analytics.total * 100}%
        TimeTaken: ${analytics.time / 1000}s
        Estimated Time: ${avgTime * analytics.total / 1000}s
        Error: ${analytics.error}
    `;
}
