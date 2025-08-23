// MSW Server for Node.js environments (tests only)
// This file should only be used in testing environments

/**
 * MSW Server utilities for testing
 * This module is excluded from browser builds
 */

// Placeholder for browser environment - MSW server is not available
export async function createMSWServer() {
  console.warn('MSW server is only available in Node.js test environment');
  return null;
}

/**
 * Test utilities for MSW server
 * These are placeholders for browser environment
 */
export const mswTestUtils = {
  async setupForTests() {
    console.warn('MSW test setup is only available in Node.js environment');
  },

  resetHandlers() {
    console.warn('MSW handler reset is only available in Node.js environment');
  },

  close() {
    console.warn('MSW server close is only available in Node.js environment');
  }
};

/**
 * Test configuration types
 */
export const testConfigs = {
  unit: {
    onUnhandledRequest: 'warn' as const,
    quiet: true,
  },
  integration: {
    onUnhandledRequest: 'error' as const,
    quiet: false,
  },
  e2e: {
    onUnhandledRequest: 'bypass' as const,
    quiet: true,
  }
};

/**
 * Test helpers placeholder for browser environment
 * Real implementation only available in Node.js test environment
 */
export const createTestHelpers = async () => {
  console.warn('MSW test helpers are only available in Node.js test environment');
  return null;
};