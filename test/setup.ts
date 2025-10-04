// Test setup and utilities
import { beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import fs from 'fs';
import path from 'path';
import { saveInsertedIds as saveInsertedIdsUtil } from "../src/utils";
import type { Migration } from "../types";

// Mock checkpoint file for tests
const TEST_CHECKPOINT_FILE = 'test-checkpoint.json';

beforeEach(() => {
  // Clean up test checkpoint file before each test
  if (fs.existsSync(TEST_CHECKPOINT_FILE)) {
    fs.unlinkSync(TEST_CHECKPOINT_FILE);
  }
});

afterEach(() => {
  // Clean up test checkpoint file after each test
  if (fs.existsSync(TEST_CHECKPOINT_FILE)) {
    fs.unlinkSync(TEST_CHECKPOINT_FILE);
  }
});

// Helper function to create test checkpoint file
export const createTestCheckpoint = (ids: any[]) => {
  fs.writeFileSync(TEST_CHECKPOINT_FILE, JSON.stringify(ids, null, 2));
};

// Helper function to read test checkpoint file
export const readTestCheckpoint = (): any[] => {
  if (!fs.existsSync(TEST_CHECKPOINT_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(TEST_CHECKPOINT_FILE, 'utf8'));
};

// Re-export saveInsertedIds for tests
export const saveInsertedIds = saveInsertedIdsUtil;

// Mock data for testing
export const mockMigration: Migration = {
  name: "test_migration",
  table: {
    source: "source_table",
    target: "target_table"
  },
  columns: [
    { column: "id", primary: true },
    { column: "name" },
    { column: "is_active", conversion: { type: "int", target_type: "boolean" } },
    { column: "price" },
    { column: "metadata" }
  ]
};

export const mockData = {
  id: 1,
  name: "Test Item",
  is_active: 1,
  price: 99.99,
  metadata: { category: "test" }
};

export const mockConfig = {
  database: {
    source: {
      adapter: "postgres",
      host: "localhost",
      port: 5432,
      user: "test_user",
      password: "test_password",
      database: "test_source"
    },
    target: {
      adapter: "postgres",
      host: "localhost",
      port: 5432,
      user: "test_user",
      password: "test_password",
      database: "test_target"
    }
  },
  migrations: [mockMigration]
};
