import React from "react";

/**
 * SkeletonLoader Component
 * Demonstrates: Shimmer placeholder animations during async data fetching
 * (Syllabus: Lectures 67-72)
 */
export function SkeletonLoader({ type = "card", count = 3 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "table-row") {
    return (
      <>
        {items.map((i) => (
          <tr key={i} className="skeleton-row" style={{ opacity: 0.7 }}>
            <td colSpan="5" style={{ padding: "16px" }}>
              <div
                style={{
                  height: "20px",
                  background: "linear-gradient(90deg, var(--bg-subtle) 25%, var(--border-color) 50%, var(--bg-subtle) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite linear",
                  borderRadius: "var(--radius-sm)"
                }}
              />
            </td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        width: "100%"
      }}
    >
      {items.map((i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div
            style={{
              height: "16px",
              width: "40%",
              background: "var(--bg-subtle)",
              borderRadius: "4px"
            }}
          />
          <div
            style={{
              height: "24px",
              width: "80%",
              background: "var(--bg-subtle)",
              borderRadius: "4px"
            }}
          />
          <div
            style={{
              height: "40px",
              width: "100%",
              background: "var(--bg-subtle)",
              borderRadius: "4px"
            }}
          />
          <div
            style={{
              height: "16px",
              width: "60%",
              background: "var(--bg-subtle)",
              borderRadius: "4px"
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default SkeletonLoader;
