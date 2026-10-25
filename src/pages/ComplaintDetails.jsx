import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import ComplaintTimeline from "../components/complaints/ComplaintTimeline";
import ComplaintCard from "../components/ComplaintCard";
import EmptyState from "../components/common/EmptyState";
import "./ComplaintDetails.css";

/**
 * ComplaintDetails Component (UniFix 2.0)
 * Dynamic route: /complaints/:id
 * Demonstrates: useParams, dynamic lookup, upvoting with optimistic updates,
 * Clipboard API, breadcrumbs, related item recommendations, 404 fallback.
 * (Syllabus: Lectures 37-42 & Lectures 61-66)
 */
export function ComplaintDetails() {
  const { id } = useParams();
  const { complaints, toggleUpvote } = useComplaints();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const complaint = complaints.find((c) => String(c.id) === String(id));

  if (!complaint) {
    return (
      <div className="details-page container animate-fade-in">
        <EmptyState
          icon="❓"
          title="Campus Grievance Not Found"
          description={`No record exists for ticket #${id}. It may have been removed or the ID was mistyped.`}
          actionLabel="← Return to Complaints Feed"
          onAction={() => navigate("/complaints")}
        />
      </div>
    );
  }

  const userEmail = currentUser?.email || "student@chitkara.edu.in";
  const hasUpvoted = complaint.upvotedBy?.includes(userEmail);
  const ticketId = `#UNIFIX-${String(complaint.id).slice(-4)}`;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    showToast({
      type: "info",
      title: "Copied",
      message: `${ticketId} copied to clipboard.`
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `UniFix Ticket: ${complaint.title}`,
        text: `Campus Issue: ${complaint.title} at ${complaint.location}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyTicket();
    }
  };

  // Related complaints in the same category
  const relatedComplaints = complaints
    .filter(
      (c) =>
        String(c.id) !== String(complaint.id) &&
        c.category.toLowerCase().includes(complaint.category.split(" ")[0].toLowerCase())
    )
    .slice(0, 3);

  return (
    <div className="details-page container animate-fade-in">
      {/* Breadcrumbs Navigation */}
      <nav className="details-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/complaints">Complaints</Link>
        <span>›</span>
        <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{ticketId}</span>
      </nav>

      {/* Main Details Card */}
      <article className="details-card">
        {/* Header Row */}
        <div className="details-header-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span className="details-ticket-id">{ticketId}</span>
              <button
                type="button"
                className="btn-card-action"
                onClick={handleCopyTicket}
                title="Copy ticket ID"
              >
                📋 Copy ID
              </button>
            </div>
            <h1 className="details-title">{complaint.title}</h1>
            <div className="details-badges-bar">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <span className="category-badge">{complaint.category}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                🗓️ Reported: {complaint.date}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={`upvote-btn ${hasUpvoted ? "upvoted" : ""}`}
              onClick={() => toggleUpvote(complaint.id)}
              aria-pressed={hasUpvoted}
            >
              <span className="upvote-arrow">▲</span>
              <span className="upvote-text">{hasUpvoted ? "Upvoted" : "Upvote"}</span>
              <span className="upvote-count">{complaint.upvotes || 0}</span>
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleShare}>
              🔗 Share
            </button>
          </div>
        </div>

        {/* 4-Item Metadata Grid */}
        <div className="details-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Campus Location</span>
            <span className="meta-value">📍 {complaint.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Maintenance Department</span>
            <span className="meta-value">🏢 {complaint.department || "General Maintenance"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Reported By</span>
            <span className="meta-value">👤 {complaint.studentName || "Campus Student"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Community Interest</span>
            <span className="meta-value">👍 {complaint.upvotes || 0} Student Upvotes</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
            Incident Details & Impact
          </h2>
          <div className="details-description-box">
            <p style={{ fontSize: "0.98rem", lineHeight: 1.65, color: "var(--text-main)" }}>
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Lifecycle Tracking Timeline */}
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
            Verified Resolution Timeline
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Campus estate maintenance status updates recorded in transparent chronological order.
          </p>
          <ComplaintTimeline currentStatus={complaint.status} events={complaint.timeline} />
        </div>
      </article>

      {/* Related Complaints */}
      {relatedComplaints.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">
            Related Issues in {complaint.category}
          </h2>
          <div className="activity-grid">
            {relatedComplaints.map((item) => (
              <ComplaintCard key={item.id} complaint={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ComplaintDetails;
