import React from "react";

/**
 * StatCard Component
 * Displays live campus operational statistics with badges and icons
 * Demonstrates: Component props, semantic typography, CSS variables
 * (Syllabus: Lectures 25-30, Lectures 49-54)
 */
export function StatCard({ title, value, icon, badgeText, cardType = "default", onClick }) {
  const getBorderColor = () => {
    switch (cardType) {
      case "pending":
        return "var(--status-pending-border)";
      case "progress":
        return "var(--status-progress-border)";
      case "resolved":
        return "var(--status-resolved-border)";
      case "review":
        return "var(--status-review-border)";
      default:
        return "var(--border-color)";
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 22px",
        border: `1.5px solid ${getBorderColor()}`,
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)"
      }}
      className="stat-card-hover"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "1.6rem" }}>{icon}</span>
        {badgeText && (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-subtle)",
              color: "var(--text-muted)",
              letterSpacing: "0.4px"
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)", marginTop: "4px" }}>
          {title}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
