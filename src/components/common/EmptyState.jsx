import React from "react";

/**
 * EmptyState Component
 * Displays helpful feedback and action button when no data is returned
 * Demonstrates: Component reusability, conditional rendering
 * (Syllabus: Lectures 25-30, Lectures 61-66)
 */
export function EmptyState({
  icon = "📂",
  title = "No complaints found",
  description = "No items match your active filters or search criteria.",
  actionLabel,
  onAction
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-color)",
        margin: "24px 0"
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "12px" }}>{icon}</div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          maxWidth: "460px",
          margin: "0 auto 20px auto",
          lineHeight: 1.5
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
