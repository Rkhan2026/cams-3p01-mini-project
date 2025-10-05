#!/usr/bin/env node

/**
 * Integration Test Runner
 *
 * This script runs all integration tests in the tests/integration directory
 * using Vitest. It provides a comprehensive test suite for the placement
 * management system.
 */

import { execSync } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";

const INTEGRATION_TEST_DIR = "./tests/integration";

console.log("Starting Integration Test Suite for Placement Management System");
console.log("=".repeat(70));

try {
  // Get all test files
  const testFiles = readdirSync(INTEGRATION_TEST_DIR)
    .filter((file) => file.endsWith(".test.jsx"))
    .sort();

  console.log(`Found ${testFiles.length} integration test files:`);
  testFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  console.log("\n" + "=".repeat(70));
  console.log("Running tests with Vitest...\n");

  // Run all integration tests
  const command = "npx vitest run tests/integration --reporter=verbose";

  execSync(command, {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log("\n" + "=".repeat(70));
  console.log("✅ All integration tests completed successfully!");
} catch (error) {
  console.error("\n" + "=".repeat(70));
  console.error("❌ Integration tests failed!");
  console.error("Error:", error.message);
  process.exit(1);
}
