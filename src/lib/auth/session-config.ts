/**
 * Session timeout configuration
 * 
 * This file contains configuration for session timeout settings.
 * The timeout duration can be configured via environment variables.
 */

// Default timeout in milliseconds (30 minutes)
const DEFAULT_TIMEOUT = 30 * 60 * 1000;

/**
 * Get the session timeout duration in milliseconds
 * 
 * This function reads the SESSION_TIMEOUT_MINUTES environment variable
 * and returns the timeout duration in milliseconds.
 * 
 * @returns The session timeout duration in milliseconds
 */
export function getSessionTimeoutMs(): number {
  // Get the timeout from environment variable (in minutes)
  const timeoutMinutes = process.env.SESSION_TIMEOUT_MINUTES;
  
  // If the environment variable is set, convert to milliseconds
  if (timeoutMinutes) {
    const timeoutMs = parseInt(timeoutMinutes, 10) * 60 * 1000;
    
    // Ensure the timeout is at least 5 minutes
    return Math.max(timeoutMs, 5 * 60 * 1000);
  }
  
  // Return the default timeout if the environment variable is not set
  return DEFAULT_TIMEOUT;
} 