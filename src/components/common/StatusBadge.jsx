import React from "react";

export function StatusBadge({ status }) {
  const norm = (status || "").toLowerCase().trim();

  let badgeClass = "status-pending";
  let label = status || "Pending";

  if (norm === "resolved") {
    badgeClass = "status-resolved";
    label = "Resolved";
  } else if (norm === "in progress") {
    badgeClass = "status-progress";
    label = "In Progress";
  } else if (norm === "under review" || norm === "review") {
    badgeClass = "status-review";
    label = "Under Review";
  } else if (norm === "submitted") {
    badgeClass = "status-submitted";
    label = "Submitted";
  }

  return <span className={`status-badge ${badgeClass}`}>{label}</span>;
}

export default StatusBadge;
