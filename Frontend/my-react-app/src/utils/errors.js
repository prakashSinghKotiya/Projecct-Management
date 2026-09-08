/**
 * Turn any thrown error into a single friendly message for the UI.
 * Handles ApiError (thrown by apiClient), network failures and surprises.
 */
export function getErrorMessage(error) {
  if (!error) return 'Something went wrong. Please try again.';

  // ApiError already carries a human-readable server message.
  if (error.name === 'ApiError') {
    return error.message;
  }

  // TypeError from fetch usually means the backend is unreachable.
  if (error instanceof TypeError) {
    return 'Cannot reach the server. Please check your connection and try again.';
  }

  if (typeof error.message === 'string' && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

/**
 * Extract the zod-style field errors { field: ["msg", ...] } from an ApiError.
 * Returns {} when there is nothing usable.
 */
export function getFieldErrors(error) {
  if (error?.name === 'ApiError' && error.data && typeof error.data.error === 'object') {
    const entries = Object.entries(error.data.error);
    if (entries.length > 0) {
      return Object.fromEntries(
        entries.map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : String(messages)])
      );
    }
  }
  return {};
}