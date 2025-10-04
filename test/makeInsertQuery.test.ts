import { describe, it, expect } from "bun:test";
import { makeInsertQuery } from "../src/utils";
import type { Migration } from "../types";

describe("makeInsertQuery", () => {
  it("should generate correct INSERT query for basic data types", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "name" },
        { column: "price" }
      ]
    };

    const data = {
      id: 1,
      name: "Test Item",
      price: 99.99
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, name, price) VALUES (1, 'Test Item', 99.99)"
    );
  });

  it("should handle boolean values correctly", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "is_active" }
      ]
    };

    const data = {
      id: 1,
      is_active: true
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, is_active) VALUES (1, true)"
    );
  });

  it("should handle string values with proper escaping", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "description" }
      ]
    };

    const data = {
      id: 1,
      description: "Test description with 'quotes'"
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, description) VALUES (1, 'Test description with 'quotes'')"
    );
  });

  it("should handle object values as JSON strings", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "metadata" }
      ]
    };

    const data = {
      id: 1,
      metadata: { category: "test", tags: ["tag1", "tag2"] }
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, metadata) VALUES (1, '{\"category\":\"test\",\"tags\":[\"tag1\",\"tag2\"]}')"
    );
  });

  it("should handle mixed data types", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "name" },
        { column: "is_active" },
        { column: "price" },
        { column: "metadata" }
      ]
    };

    const data = {
      id: 1,
      name: "Test Item",
      is_active: true,
      price: 99.99,
      metadata: { category: "test" }
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, name, is_active, price, metadata) VALUES (1, 'Test Item', true, 99.99, '{\"category\":\"test\"}')"
    );
  });

  it("should handle null and undefined values", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "optional_field" }
      ]
    };

    const data = {
      id: 1,
      optional_field: null
    };

    const result = makeInsertQuery(data, migration);

    expect(result.trim()).toBe(
      "INSERT INTO target (id, optional_field) VALUES (1, 'null')"
    );
  });
});
