import { describe, it, expect } from "bun:test";
import { convertData } from "../src/utils";
import type { Migration } from "../types";

describe("convertData", () => {
  it("should convert data without conversions", () => {
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

    const result = convertData(data, migration);

    expect(result).toEqual({
      id: 1,
      name: "Test Item",
      price: 99.99
    });
  });

  it("should convert int to boolean (1 -> true)", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "is_active", conversion: { type: "int", target_type: "boolean" } }
      ]
    };

    const data = {
      id: 1,
      is_active: 1
    };

    const result = convertData(data, migration);

    expect(result).toEqual({
      id: 1,
      is_active: true
    });
  });

  it("should convert int to boolean (0 -> false)", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "is_active", conversion: { type: "int", target_type: "boolean" } }
      ]
    };

    const data = {
      id: 1,
      is_active: 0
    };

    const result = convertData(data, migration);

    expect(result).toEqual({
      id: 1,
      is_active: false
    });
  });

  it("should handle mixed conversions and non-conversions", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "name" },
        { column: "is_active", conversion: { type: "int", target_type: "boolean" } },
        { column: "is_verified", conversion: { type: "int", target_type: "boolean" } },
        { column: "price" }
      ]
    };

    const data = {
      id: 1,
      name: "Test Item",
      is_active: 1,
      is_verified: 0,
      price: 99.99
    };

    const result = convertData(data, migration);

    expect(result).toEqual({
      id: 1,
      name: "Test Item",
      is_active: true,
      is_verified: false,
      price: 99.99
    });
  });

  it("should handle non-int conversion types", () => {
    const migration: Migration = {
      name: "test",
      table: { source: "source", target: "target" },
      columns: [
        { column: "id", primary: true },
        { column: "data", conversion: { type: "text", target_type: "text" } }
      ]
    };

    const data = {
      id: 1,
      data: "some text"
    };

    const result = convertData(data, migration);

    expect(result).toEqual({
      id: 1,
      data: "some text"
    });
  });
});
