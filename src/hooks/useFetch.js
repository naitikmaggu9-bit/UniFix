import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom Hook: useFetch
 * Generic REST API fetcher with loading, error, retry, and AbortController
 * Demonstrates: useState, useEffect, useCallback, useRef, cleanups
 * (Syllabus: Lectures 31-36 & Lectures 67-72)
 */
export function useFetch(fetcherFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async () => {
    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await fetcherFn(abortControllerRef.current.signal);
      setData(result);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to fetch data.");
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    execute();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute]);

  return { data, loading, error, retry: execute, setData };
}

export default useFetch;
