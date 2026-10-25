import React from "react";

/**
 * ComplaintTimeline Component
 * Displays the 4-stage lifecycle of a campus complaint:
 * 1. Submitted -> 2. Under Review -> 3. In Progress -> 4. Resolved
 * Demonstrates: Dynamic step progression, conditional step highlights, array mapping
 * (Syllabus: Lectures 25-30, Lectures 61-66)
 */
export function ComplaintTimeline({ currentStatus = "Pending", events = [] }) {
  const norm = (currentStatus || "").toLowerCase();

  const stages = [
    { key: "pending", label: "1. Lodged", desc: "Submitted by student" },
    { key: "review", label: "2. Under Review", desc: "Assessed by estate office" },
    { key: "progress", label: "3. In Progress", desc: "Ground maintenance active" },
    { key: "resolved", label: "4. Resolved", desc: "Inspection & closure" }
  ];

  // Determine active stage index (0 to 3)
  let activeIndex = 0;
  if (norm === "under review" || norm === "review") activeIndex = 1;
  else if (norm === "in progress") activeIndex = 2;
  else if (norm === "resolved") activeIndex = 3;

  return (
    <div style={{ margin: "20px 0" }}>
      {/* 4-Step Progress Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          position: "relative",
          marginBottom: "24px"
        }}
      >
        {stages.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          let bubbleBg = "var(--bg-subtle)";
          let bubbleColor = "var(--text-muted)";
          let borderColor = "var(--border-color)";

          if (isDone) {
            bubbleBg = "#dcfce7";
            bubbleColor = "#166534";
            borderColor = "#86efac";
          } else if (isCurrent) {
            bubbleBg = idx === 3 ? "#dcfce7" : "var(--primary-light)";
            bubbleColor = idx === 3 ? "#166534" : "var(--primary)";
            borderColor = idx === 3 ? "#86efac" : "var(--primary)";
          }

          return (
            <div
              key={stage.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: bubbleBg,
                  color: bubbleColor,
                  border: `2px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  marginBottom: "8px",
                  zIndex: 2
                }}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? "var(--text-main)" : "var(--text-muted)"
                }}
              >
                {stage.label}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                  display: "none"
                }}
                className="desktop-only-desc"
              >
                {stage.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actual Event History Entries */}
      {events && events.length > 0 && (
        <div
          style={{
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            border: "1px solid var(--border-color)"
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              color: "var(--text-muted)",
              marginBottom: "12px"
            }}
          >
            Activity Audit History
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((evt, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "0.88rem",
                  lineHeight: 1.4
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                    marginTop: "6px",
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                    <strong>{evt.status}</strong>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {evt.timestamp}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-body)", marginTop: "2px" }}>
                    {evt.note}
                  </div>
                  {evt.actor && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Updated by: <em>{evt.actor}</em>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintTimeline;
