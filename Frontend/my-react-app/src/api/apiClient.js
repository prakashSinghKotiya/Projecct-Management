
const BASE_URL = import.meta.env.VITE_API_URL ;


export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data; // raw parsed response body, useful for field errors
  }
}

export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

function dispatchUnauthorized() {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}


export async function request(path, options = {}) {
  const url = BASE_URL ? `${BASE_URL}${path}` : path;

  const response = await fetch(url, {
    credentials: 'include', // always send/receive cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // 204 No Content (e.g. logout, delete) -> nothing to parse.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 401 means the session is gone (expired cookie). Notify the app.
    if (response.status === 401) {
      dispatchUnauthorized();
    }
    throw new ApiError(getServerMessage(data, response.status), response.status, data);
  }

  return data;
}


function getServerMessage(data, status) {
  if (!data) {
    return `Request failed (${status})`;
  }

  if (typeof data.error === 'string') {
    return data.error;
  }

  if (typeof data.message === 'string') {
    return data.message;
  }

  // Zod field errors: { fieldName: ["msg", ...] }
  if (typeof data.error === 'object' && data.error !== null) {
    const fieldMessages = Object.values(data.error).flat().join(' ');
    if (fieldMessages) return fieldMessages;
  }

  return 'Something went wrong. Please try again.';
}