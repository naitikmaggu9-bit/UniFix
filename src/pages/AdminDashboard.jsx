import React, { useState } from "react";
import "./AdminDashboard.css";

// Page 4: Admin Dashboard (Team Member 4)
// Demonstrates: Arrays, map(), Components, Props, useState, Conditional Rendering, CSS Statistics
function AdminDashboard({ complaints, onUpdateStatus }) {
  // useState for admin active filter tab
  const [activeTab, setActiveTab] = useState("All");

  // Calculate statistics from the complaints array dynamically
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === "Pending" || c.status === "Submitted"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "Under Review"
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // 4 Statistic Cards Array for map()
  const statsData = [
    {
      id: "total",
      label: "Total Complaints",
      count: totalCount,
      icon: "📊",
      cardClass: "stat-card-total",
      badgeText: "Campus Wide"
    },
    {
      id: "pending",
      label: "Pending Review",
      count: pendingCount,
      icon: "⏳",
      cardClass: "stat-card-pending",
      badgeText: "Action Needed"
    },
    {
      id: "progress",
      label: "In Progress",
      count: inProgressCount,
      icon: "⚙️",
      cardClass: "stat-card-progress",
      badgeText: "Assigned"
    },
    {
      id: "resolved",
      label: "Resolved",
      count: resolvedCount,
      icon: "✅",
      cardClass: "stat-card-resolved",
      badgeText: "Completed"
    }
  ];

  // Department breakdown stats (CSS-based presentable statistics)
  const departmentBreakdown = [
    { dept: "Hostel & Facilities", count: complaints.filter(c => c.category === "Hostel" || c.category === "Maintenance").length, pct: "35%" },
    { dept: "Electrical & Power", count: complaints.filter(c => c.category === "Electricity").length, pct: "25%" },
    { dept: "IT & Wi-Fi Network", count: complaints.filter(c => c.category === "Wi-Fi").length, pct: "20%" },
    { dept: "Plumbing & Sanitation", count: complaints.filter(c => c.category === "Water" || c.category === "Cleanliness").length, pct: "20%" }
  ];

  // Filter complaints based on active tab
  const filteredComplaints = complaints.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return item.status === "Pending" || item.status === "Submitted";
    if (activeTab === "In Progress") return item.status === "In Progress" || item.status === "Under Review";
    if (activeTab === "Resolved") return item.status === "Resolved";
    return true;
  });

  // Helper for conditional status badge rendering
  const renderStatusBadge = (status) => {
    if (status === "Resolved") {
      return <span className="status-badge status-resolved">Resolved</span>;
    } else if (status === "In Progress" || status === "Under Review") {
      return <span className="status-badge status-progress">{status}</span>;
    } else {
      return <span className="status-badge status-pending">Pending</span>;
    }
  };

  return (
    <div className="admin-page container">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <div className="admin-badge">
            <span className="admin-icon">🛡️</span>
            <span>Chitkara Campus Administration</span>
          </div>
          <h1 className="page-title">Admin Management Portal</h1>
          <p className="page-subtitle">
            Manage complaint statuses, monitor maintenance resolution, and oversee campus facilities.
          </p>
        </div>

        <div className="admin-status-indicator">
          <span className="live-dot"></span>
          <span>System Status: <strong>Live Operations</strong></span>
        </div>
      </div>

      {/* 4 STATISTIC CARDS: Rendered using map() */}
      <div className="stats-grid">
        {statsData.map((stat) => (
          <div key={stat.id} className={`stat-card ${stat.cardClass}`}>
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-badge">{stat.badgeText}</span>
            </div>
            <div className="stat-count">{stat.count}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CSS-based statistics preview section */}
      <div className="admin-insights-card">
        <h3 className="insights-title">Campus Department Workload Distribution</h3>
        <div className="dept-bars-grid">
          {departmentBreakdown.map((dept, idx) => (
            <div key={idx} className="dept-bar-item">
              <div className="dept-bar-header">
                <span className="dept-name">{dept.dept}</span>
                <span className="dept-count">{dept.count} Tickets</span>
              </div>
              <div className="dept-progress-track">
                <div 
                  className={`dept-progress-fill fill-${idx}`}
                  style={{ width: `${Math.max(dept.count * 15, 12)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="recent-complaints-section">
        <div className="section-header-row">
          <div>
            <h2 className="recent-heading">Recent Complaints Management</h2>
            <p className="recent-sub">
              Click any status button to immediately update the issue state on the frontend.
            </p>
          </div>

          {/* Tab Filters */}
          <div className="admin-tabs">
            {["All", "Pending", "In Progress", "Resolved"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Table / List using map() */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Issue Details</th>
                <th>Category</th>
                <th>Location</th>
                <th>Current Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => (
                <tr key={item.id} className="admin-row">
                  {/* Issue Info */}
                  <td className="col-issue">
                    <div className="issue-title-text">{item.title}</div>
                    <div className="issue-sub-info">
                      <span>Reported by: <strong>{item.studentName || "Campus Student"}</strong></span>
                      <span>•</span>
                      <span>👍 {item.upvotes || 0} upvotes</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>

                  {/* Location */}
                  <td>
                    <span className="location-text">📍 {item.location}</span>
                  </td>

                  {/* Status with Conditional Rendering */}
                  <td>
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Status Action Buttons */}
                  <td className="col-actions">
                    <div className="status-button-group">
                      <button
                        className={`btn-action-status btn-pending ${item.status === "Pending" || item.status === "Submitted" ? "current" : ""}`}
                        onClick={() => onUpdateStatus(item.id, "Pending")}
                        title="Mark as Pending"
                      >
                        Pending
                      </button>

                      <button
                        className={`btn-action-status btn-progress ${item.status === "In Progress" ? "current" : ""}`}
                        onClick={() => onUpdateStatus(item.id, "In Progress")}
                        title="Mark as In Progress"
                      >
                        In Progress
                      </button>

                      <button
                        className={`btn-action-status btn-resolve ${item.status === "Resolved" ? "current" : ""}`}
                        onClick={() => onUpdateStatus(item.id, "Resolved")}
                        title="Mark as Resolved"
                      >
                        Resolved
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length === 0 && (
          <div className="empty-admin-table">
            <p>No complaints found for status: <strong>{activeTab}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
