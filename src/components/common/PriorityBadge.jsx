import React from "react";

export function PriorityBadge({ priority }) {
  const norm = (priority || "medium").toLowerCase();

  let pClass = "priority-medium";
  let icon = "⚡";

  if (norm === "high") {
    pClass = "priority-high";
    icon = "🔥";
  } else if (norm === "low") {
    pClass = "priority-low";
    icon = "🌱";
  }

  return (
    <span className={`priority-badge ${pClass}`}>
      <span>{icon}</span>
      <span>{priority || "Medium"} Priority</span>
    </span>
  );
}

export default PriorityBadge;
