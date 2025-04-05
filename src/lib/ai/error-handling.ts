import { OpenAIError } from 'openai';

/**
 * Handles OpenAI API errors and returns a user-friendly error message
 */
export function handleOpenAIError(error: unknown): string {
  if (error instanceof OpenAIError) {
    // Handle OpenAI errors
    return `OpenAI API error: ${error.message}`;
  } else if (error instanceof Error) {
    // Handle other Error objects
    return error.message;
  } else {
    // Handle unknown error types
    return 'An unknown error occurred while communicating with the OpenAI API.';
  }
} 