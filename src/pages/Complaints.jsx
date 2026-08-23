import React, { useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import "./Complaints.css";

// Page 3: Complaints Dashboard (Team Member 3)
// Demonstrates: Arrays, map(), Components, Props, useState, Conditional Rendering
function Complaints({ complaints, setActivePage }) {
  // useState to filter complaints by status or category (demonstrating useState & conditional rendering)
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Status categories for quick filter buttons
  const filterOptions = ["All", "Pending", "In Progress", "Resolved", "Under Review"];

  // Filter complaints array based on selected status and search query
  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus =
      filterStatus === "All" ||
      item.status.toLowerCase() === filterStatus.toLowerCase() ||
      (filterStatus === "Pending" && item.status === "Submitted");

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="complaints-page container">
      {/* Page Header */}
      <div className="complaints-header">
        <div>
          <span className="badge-tag">Public Feed</span>
          <h1 className="page-title">Campus Complaints Dashboard</h1>
          <p className="page-subtitle">
            Browse, monitor, and upvote student-submitted issues across Chitkara University campus.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setActivePage("report")}
        >
          + Report New Issue
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        {/* Status Filter Buttons using map() & useState */}
        <div className="status-filters">
          <span className="filter-label">Filter by Status:</span>
          {filterOptions.map((statusName, index) => (
            <button
              key={index}
              className={`filter-chip ${filterStatus === statusName ? "active" : ""}`}
              onClick={() => setFilterStatus(statusName)}
            >
              {statusName}
              {statusName === "All" && ` (${complaints.length})`}
            </button>
          ))}
        </div>

        {/* Simple Search Input */}
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search by issue, location or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Summary */}
      <div className="results-count-bar">
        <span>
          Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> complaints
        </span>
        {filterStatus !== "All" && (
          <span className="active-filter-indicator">
            Filtered by: <em>{filterStatus}</em>
          </span>
        )}
      </div>

      {/* COMPLAINTS GRID: Using map() to render reusable ComplaintCard with Props */}
      {filteredComplaints.length > 0 ? (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              title={complaint.title}
              category={complaint.category}
              location={complaint.location}
              status={complaint.status}
              upvotes={complaint.upvotes}
              description={complaint.description}
              date={complaint.date}
            />
          ))}
        </div>
      ) : (
        /* Conditional Rendering: Empty State when no matching complaints */
        <div className="no-complaints-box">
          <div className="empty-icon">📂</div>
          <h3>No complaints found</h3>
          <p>
            No issues match the selected filter "<strong>{filterStatus}</strong>"
            {searchQuery ? ` and search query "${searchQuery}"` : ""}.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilterStatus("All");
              setSearchQuery("");
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Complaints;
