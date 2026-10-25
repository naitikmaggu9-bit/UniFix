import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

/**
 * Toast Provider Component
 * Manages toast notification stack with automatic timeout dismissal
 * Demonstrates: React Context API, useState, useCallback, UUID generation
 * (Syllabus: Lectures 49-54 & Lectures 61-66)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((options) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const toast = {
      id,
      type: options.type || "info", // "success" | "error" | "info" | "warning"
      title: options.title || "",
      message: options.message || "",
      duration: options.duration || 4000
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastContext;
