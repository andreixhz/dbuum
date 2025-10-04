import { describe, it, expect } from "bun:test";
import type { Config, Migration } from "../types";

// Helper function to validate config structure
function validateConfig(config: any): { isValid: boolean; errors: string[] } {
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
          if (column.primary === undefined) {
            errors.push(`Migration ${index}, Column ${colIndex}: primary flag is required`);
          }
        });
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

describe("Config Validation", () => {
  it("should validate correct config", () => {
    const validConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          table: {
            source: "source_table",
            target: "target_table"
          },
          columns: [
            { column: "id", primary: true },
            { column: "name", primary: false }
          ]
        }
      ]
    };

    const result = validateConfig(validConfig);
    if (!result.isValid) {
      console.log("Validation errors:", result.errors);
    }
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should reject config without database", () => {
    const invalidConfig = {
      migrations: []
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Database configuration is required");
  });

  it("should reject config without source database", () => {
    const invalidConfig = {
      database: {
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: []
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Source database is required");
  });

  it("should reject config with incomplete source database", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost"
          // missing port, user, password, database
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: []
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Source port is required");
    expect(result.errors).toContain("Source user is required");
    expect(result.errors).toContain("Source password is required");
    expect(result.errors).toContain("Source database name is required");
  });

  it("should reject config without migrations", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      }
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migrations are required");
  });

  it("should reject config with empty migrations array", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: []
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("At least one migration is required");
  });

  it("should reject migration without name", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          table: {
            source: "source_table",
            target: "target_table"
          },
          columns: [
            { column: "id", primary: true }
          ]
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0: name is required");
  });

  it("should reject migration without table configuration", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          columns: [
            { column: "id", primary: true }
          ]
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0: table configuration is required");
  });

  it("should reject migration without columns", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          table: {
            source: "source_table",
            target: "target_table"
          }
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0: columns must be an array");
  });

  it("should reject migration with empty columns array", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          table: {
            source: "source_table",
            target: "target_table"
          },
          columns: []
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0: at least one column is required");
  });

  it("should reject column without name", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          table: {
            source: "source_table",
            target: "target_table"
          },
          columns: [
            { primary: true }
          ]
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0, Column 0: column name is required");
  });

  it("should reject column without primary flag", () => {
    const invalidConfig = {
      database: {
        source: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "source_db"
        },
        target: {
          adapter: "postgres",
          host: "localhost",
          port: 5432,
          user: "user",
          password: "password",
          database: "target_db"
        }
      },
      migrations: [
        {
          name: "test_migration",
          table: {
            source: "source_table",
            target: "target_table"
          },
          columns: [
            { column: "id" }
          ]
        }
      ]
    };

    const result = validateConfig(invalidConfig);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Migration 0, Column 0: primary flag is required");
  });
});
