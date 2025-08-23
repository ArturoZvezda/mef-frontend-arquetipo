/**
 * Configuration utilities for environment variables
 * Browser-safe environment detection
 */

/**
 * Get environment from window location or default
 */
export function getEnvironment(): string {
  if (typeof window !== 'undefined') {
    // Browser environment - check hostname
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
    return 'production';
  }
  // Node.js environment (for SSR/testing)
  return 'production';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if MSW should be enabled
 */
export function isMSWEnabled(): boolean {
  // Enable MSW in development or when explicitly enabled
  if (typeof window !== 'undefined') {
    return isDevelopment() || !!(window as any).MSW_ENABLED;
  }
  return false;
}

/**
 * Browser-safe environment object
 */
export const environment = {
  production: !isDevelopment(),
  development: isDevelopment(),
  enableMSW: isMSWEnabled(),
  nodeEnv: getEnvironment()
};