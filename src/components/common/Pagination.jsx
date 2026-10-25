import React from "react";

/**
 * Pagination Component
 * Demonstrates: Controlled pagination state, math calculations, disabling boundary states
 * (Syllabus: Lectures 67-72)
 */
export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "24px",
        paddingTop: "16px",
        borderTop: "1px solid var(--border-color)"
      }}
    >
      <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
        Showing <strong>{startIdx}</strong> to <strong>{endIdx}</strong> of{" "}
        <strong>{totalItems}</strong> complaints
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 600,
              fontSize: "0.85rem",
              background: currentPage === pg ? "var(--primary)" : "var(--bg-surface)",
              color: currentPage === pg ? "#ffffff" : "var(--text-main)",
              border: `1px solid ${currentPage === pg ? "var(--primary)" : "var(--border-color)"}`,
              cursor: "pointer"
            }}
            aria-current={currentPage === pg ? "page" : undefined}
          >
            {pg}
          </button>
        ))}

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;
