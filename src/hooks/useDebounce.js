import { useState, useEffect } from "react";

/**
 * Custom Hook: useDebounce
 * Delays updating the debounced value until after delay ms have elapsed
 * Demonstrates: useEffect cleanup, setTimeout, cancel on unmount
 * (Syllabus: Lectures 31-36, Lectures 67-72)
 * 
 * @param {any} value - Input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default 300ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer if value or delay changes before timeout expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
