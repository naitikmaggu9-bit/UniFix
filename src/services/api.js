/**
 * Centralized API Client & Fetch Utility
 * Demonstrates: Fetch API, async/await, Promises, Error Handling, AbortController
 * (Syllabus: Lectures 13-18 & Lectures 67-72)
 */

const DEFAULT_TIMEOUT = 10000;

/**
 * Custom API Error class with normalized properties
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal fetch wrapper with timeout and error parsing
 */
export async function request(url, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, signal, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Link external signal if provided
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const headers = {
    "Content-Type": "application/json",
    ...(customConfig.headers || {})
  };

  const config = {
    ...customConfig,
    headers,
    signal: controller.signal
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Return empty for 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ApiError("Request timed out or was aborted", 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.message || "Network error. Please check your internet connection.",
      0
    );
  }
}
