import { describe, it, expect } from "bun:test";
import { formatAnalytics } from "../src/utils";

describe("formatAnalytics", () => {
  it("should format analytics with basic data", () => {
    const analytics = {
      name: "test_migration",
      inserted: 100,
      total: 1000,
      time: 5000,
      error: 10,
      success: 90
    };

    const avgTime = 50; // 50ms average

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: test_migration");
    expect(result).toContain("Inserted: 100");
    expect(result).toContain("Total: 1000");
    expect(result).toContain("Percentage: 11%"); // (100 + 10) / 1000 * 100
    expect(result).toContain("TimeTaken: 5s");
    expect(result).toContain("Estimated Time: 50s"); // 50ms * 1000 / 1000
    expect(result).toContain("Error: 10");
  });

  it("should handle zero values", () => {
    const analytics = {
      name: "empty_migration",
      inserted: 0,
      total: 0,
      time: 0,
      error: 0,
      success: 0
    };

    const avgTime = 0;

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: empty_migration");
    expect(result).toContain("Inserted: 0");
    expect(result).toContain("Total: 0");
    expect(result).toContain("Percentage: NaN%"); // 0/0 = NaN
    expect(result).toContain("TimeTaken: 0s");
    expect(result).toContain("Estimated Time: 0s");
    expect(result).toContain("Error: 0");
  });

  it("should handle high values", () => {
    const analytics = {
      name: "large_migration",
      inserted: 50000,
      total: 100000,
      time: 300000, // 5 minutes
      error: 1000,
      success: 49000
    };

    const avgTime = 300; // 300ms average

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: large_migration");
    expect(result).toContain("Inserted: 50000");
    expect(result).toContain("Total: 100000");
    expect(result).toContain("Percentage: 51%"); // (50000 + 1000) / 100000 * 100
    expect(result).toContain("TimeTaken: 300s");
    expect(result).toContain("Estimated Time: 30000s"); // 300ms * 100000 / 1000
    expect(result).toContain("Error: 1000");
  });

  it("should handle partial completion", () => {
    const analytics = {
      name: "partial_migration",
      inserted: 250,
      total: 1000,
      time: 12500, // 12.5 seconds
      error: 50,
      success: 200
    };

    const avgTime = 50; // 50ms average

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: partial_migration");
    expect(result).toContain("Inserted: 250");
    expect(result).toContain("Total: 1000");
    expect(result).toContain("Percentage: 30%"); // (250 + 50) / 1000 * 100
    expect(result).toContain("TimeTaken: 12.5s");
    expect(result).toContain("Estimated Time: 50s"); // 50ms * 1000 / 1000
    expect(result).toContain("Error: 50");
  });

  it("should handle decimal time values", () => {
    const analytics = {
      name: "decimal_migration",
      inserted: 100,
      total: 1000,
      time: 1234, // 1.234 seconds
      error: 0,
      success: 100
    };

    const avgTime = 12.34; // 12.34ms average

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: decimal_migration");
    expect(result).toContain("Inserted: 100");
    expect(result).toContain("Total: 1000");
    expect(result).toContain("Percentage: 10%"); // (100 + 0) / 1000 * 100
    expect(result).toContain("TimeTaken: 1.234s");
    expect(result).toContain("Estimated Time: 12.34s"); // 12.34ms * 1000 / 1000
    expect(result).toContain("Error: 0");
  });

  it("should handle very small time values", () => {
    const analytics = {
      name: "fast_migration",
      inserted: 10,
      total: 100,
      time: 5, // 5ms
      error: 0,
      success: 10
    };

    const avgTime = 0.5; // 0.5ms average

    const result = formatAnalytics(analytics, avgTime);

    expect(result).toContain("Migration: fast_migration");
    expect(result).toContain("Inserted: 10");
    expect(result).toContain("Total: 100");
    expect(result).toContain("Percentage: 10%"); // (10 + 0) / 100 * 100
    expect(result).toContain("TimeTaken: 0.005s");
    expect(result).toContain("Estimated Time: 0.05s"); // 0.5ms * 100 / 1000
    expect(result).toContain("Error: 0");
  });
});
