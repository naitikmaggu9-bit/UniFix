import React, { useState } from "react";
import "./ComplaintCard.css";

// Reusable ComplaintCard Component
// Demonstrates: Components, Props, useState, Conditional Rendering
function ComplaintCard({ title, category, location, status, upvotes: initialUpvotes, description, date }) {
  // useState to manage upvote count and active state locally
  const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  // Handle Upvote click
  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(upvotes - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setHasUpvoted(true);
    }
  };

  // Helper function for conditional status badge styling & icon
  const getStatusBadge = () => {
    if (status === "Resolved") {
      return <span className="status-badge status-resolved">✓ Resolved</span>;
    } else if (status === "In Progress") {
      return <span className="status-badge status-progress">⏳ In Progress</span>;
    } else if (status === "Under Review") {
      return <span className="status-badge status-review">🔍 Under Review</span>;
    } else {
      return <span className="status-badge status-pending">📌 Pending</span>;
    }
  };

  // Helper function for category icon
  const getCategoryIcon = () => {
    switch (category) {
      case "Wi-Fi":
        return "📶";
      case "Electricity":
        return "⚡";
      case "Water":
        return "🚰";
      case "Cleanliness":
        return "🧹";
      case "Hostel":
        return "🏢";
      case "Maintenance":
        return "🔧";
      default:
        return "📋";
    }
  };

  return (
    <div className="complaint-card">
      {/* Top Meta: Category & Status Badge */}
      <div className="card-top-meta">
        <span className="card-category">
          <span className="cat-icon">{getCategoryIcon()}</span>
          {category}
        </span>
        {/* Conditional Rendering of Status Badge */}
        {getStatusBadge()}
      </div>

      {/* Title */}
      <h3 className="card-title">{title}</h3>

      {/* Description if provided */}
      {description && <p className="card-description">{description}</p>}

      {/* Location info */}
      <div className="card-location">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>{location}</span>
      </div>

      {/* Footer Info: Upvote Button & Date */}
      <div className="card-footer">
        {date && <span className="card-date">🗓️ {date}</span>}
        
        {/* Upvote button utilizing useState */}
        <button
          className={`upvote-btn ${hasUpvoted ? "upvoted" : ""}`}
          onClick={handleUpvote}
          title={hasUpvoted ? "Remove Upvote" : "Upvote this issue"}
        >
          <span className="upvote-arrow">▲</span>
          <span className="upvote-text">Upvote</span>
          <span className="upvote-count">{upvotes}</span>
        </button>
      </div>
    </div>
  );
}

export default ComplaintCard;
