import { describe, it, expect } from "bun:test";
import { extractionQuery } from "../src/utils";
import type { Migration } from "../types";

describe("extractionQuery", () => {
  it("should generate correct SELECT query for single column", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source_table", target: "target_table" },
      columns: [
        { column: "id", primary: true }
      ]
    };

    const result = extractionQuery(migration);

    expect(result.trim()).toBe("SELECT id FROM source_table");
  });

  it("should generate correct SELECT query for multiple columns", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "users", target: "users" },
      columns: [
        { column: "id", primary: true },
        { column: "username" },
        { column: "email" },
        { column: "created_at" }
      ]
    };

    const result = extractionQuery(migration);

    expect(result.trim()).toBe("SELECT id, username, email, created_at FROM users");
  });

  it("should handle columns with conversions", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "products", target: "products" },
      columns: [
        { column: "id", primary: true },
        { column: "name" },
        { column: "is_active", conversion: { type: "int", target_type: "boolean" } },
        { column: "price" }
      ]
    };

    const result = extractionQuery(migration);

    expect(result.trim()).toBe("SELECT id, name, is_active, price FROM products");
  });

  it("should handle different table names", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "old_orders", target: "new_orders" },
      columns: [
        { column: "order_id", primary: true },
        { column: "customer_id" },
        { column: "total_amount" }
      ]
    };

    const result = extractionQuery(migration);

    expect(result.trim()).toBe("SELECT order_id, customer_id, total_amount FROM old_orders");
  });

  it("should handle many columns", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "large_table", target: "large_table" },
      columns: [
        { column: "id", primary: true },
        { column: "field1" },
        { column: "field2" },
        { column: "field3" },
        { column: "field4" },
        { column: "field5" },
        { column: "field6" },
        { column: "field7" },
        { column: "field8" },
        { column: "field9" },
        { column: "field10" }
      ]
    };

    const result = extractionQuery(migration);

    expect(result.trim()).toBe(
      "SELECT id, field1, field2, field3, field4, field5, field6, field7, field8, field9, field10 FROM large_table"
    );
  });
});
