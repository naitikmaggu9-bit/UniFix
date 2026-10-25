import React from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import ComplaintTimeline from "./ComplaintTimeline";
import { useToast } from "../../context/ToastContext";

/**
 * QuickViewModal Component
 * Accessible popup for inspecting complaint details from cards or tables
 * Demonstrates: Modal composition, Clipboard API, dynamic routing link
 * (Syllabus: Lectures 61-66)
 */
export function QuickViewModal({ complaint, isOpen, onClose }) {
  const { showToast } = useToast();

  if (!complaint) return null;

  const handleCopyId = () => {
    const ticketId = `#UNIFIX-${String(complaint.id).slice(-4)}`;
    navigator.clipboard.writeText(ticketId);
    showToast({
      type: "info",
      title: "Copied to Clipboard",
      message: `${ticketId} copied successfully.`
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Ticket #UNIFIX-${String(complaint.id).slice(-4)}`}
      footer={
        <>
          <button className="btn btn-secondary btn-sm" onClick={handleCopyId}>
            📋 Copy Ticket ID
          </button>
          <Link
            to={`/complaints/${complaint.id}`}
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            Open Full Tracking Page →
          </Link>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Meta badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
          <span className="category-badge">{complaint.category}</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            🗓️ {complaint.date}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
          {complaint.title}
        </h3>

        {/* Location & Department */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            padding: "12px 16px",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            fontSize: "0.9rem"
          }}
        >
          <div>
            <strong>📍 Location:</strong> {complaint.location}
          </div>
          <div>
            <strong>🏢 Assigned Unit:</strong> {complaint.department || "General Maintenance"}
          </div>
          <div>
            <strong>👤 Student:</strong> {complaint.studentName || "Campus Student"}
          </div>
          <div>
            <strong>👍 Community Upvotes:</strong> {complaint.upvotes || 0}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "6px" }}>
            Problem Description:
          </h4>
          <p style={{ lineHeight: 1.6, color: "var(--text-body)" }}>{complaint.description}</p>
        </div>

        {/* Timeline */}
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "4px" }}>
            Resolution Lifecycle:
          </h4>
          <ComplaintTimeline currentStatus={complaint.status} events={complaint.timeline} />
        </div>
      </div>
    </Modal>
  );
}

export default QuickViewModal;
