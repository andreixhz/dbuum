import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { saveInsertedIds, createTestCheckpoint, readTestCheckpoint } from "./setup";
import fs from 'fs';

const TEST_CHECKPOINT_FILE = 'test-checkpoint.json';

describe("saveInsertedIds", () => {
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

  it("should create checkpoint file with first ID when file doesn't exist", () => {
    const id = 123;

    saveInsertedIds(id, TEST_CHECKPOINT_FILE);

    expect(fs.existsSync(TEST_CHECKPOINT_FILE)).toBe(true);
    
    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([123]);
  });

  it("should append ID to existing checkpoint file", () => {
    // Create initial checkpoint file
    createTestCheckpoint([1, 2, 3]);

    const newId = 456;
    saveInsertedIds(newId, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([1, 2, 3, 456]);
  });

  it("should handle multiple IDs being added", () => {
    // Create initial checkpoint file
    createTestCheckpoint([1]);

    saveInsertedIds(2, TEST_CHECKPOINT_FILE);
    saveInsertedIds(3, TEST_CHECKPOINT_FILE);
    saveInsertedIds(4, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([1, 2, 3, 4]);
  });

  it("should handle string IDs", () => {
    const id = "uuid-123-456";

    saveInsertedIds(id, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual(["uuid-123-456"]);
  });

  it("should handle mixed ID types", () => {
    createTestCheckpoint([1, "string-id"]);

    const newId = { complex: "object", id: 789 };
    saveInsertedIds(newId, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([1, "string-id", { complex: "object", id: 789 }]);
  });

  it("should handle empty initial checkpoint file", () => {
    createTestCheckpoint([]);

    const id = 999;
    saveInsertedIds(id, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([999]);
  });

  it("should handle null and undefined IDs", () => {
    createTestCheckpoint([1, 2]);

    saveInsertedIds(null, TEST_CHECKPOINT_FILE);
    saveInsertedIds(undefined, TEST_CHECKPOINT_FILE);

    const checkpointData = readTestCheckpoint();
    expect(checkpointData).toEqual([1, 2, null, null]); // undefined becomes null when serialized
  });
});
