import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import StatCard from "../components/common/StatCard";
import QuickViewModal from "../components/complaints/QuickViewModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import "./AdminDashboard.css";

/**
 * Administrator Operations Center Component (UniFix 2.0)
 * Demonstrates: KPI metrics, department workload visualizations, administrative CRUD operations,
 * department routing, status updating, deletion confirmation modal, audit logging, CSV export.
 * (Syllabus: Lectures 43-48, Lectures 49-54, Lectures 61-66)
 */
export function AdminDashboard(props) {
  // Support both context and legacy props
  const context = useComplaints();
  const complaints = props.complaints || context.complaints;
  const updateStatus = props.onUpdateStatus || context.updateStatus;
  const { assignDepartment, deleteComplaint, resetData, activityLog, stats } = context;

  const { currentUser, switchRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const pageSize = 8;

  const departmentsList = [
    "IT Support",
    "Electrical Maintenance",
    "Plumbing & Sanitation",
    "Hostel Facilities",
    "General Maintenance"
  ];

  const statusOptions = ["Pending", "Under Review", "In Progress", "Resolved"];

  // Filter complaints based on tab & search
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // Tab filter
      let matchesTab = true;
      if (activeTab === "Pending") {
        matchesTab = item.status === "Pending" || item.status === "Submitted";
      } else if (activeTab === "In Progress") {
        matchesTab = item.status === "In Progress" || item.status === "Under Review";
      } else if (activeTab === "Resolved") {
        matchesTab = item.status === "Resolved";
      } else if (activeTab === "High Priority") {
        matchesTab = item.priority === "High";
      }

      // Search filter
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.studentName || "").toLowerCase().includes(q) ||
        String(item.id).includes(q);

      return matchesTab && matchesSearch;
    });
  }, [complaints, activeTab, searchTerm]);

  // Paginated complaints for table
  const totalItems = filteredComplaints.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(start, start + pageSize);
  }, [filteredComplaints, currentPage, pageSize]);

  // Handle department change
  const handleDepartmentChange = (id, newDept) => {
    if (assignDepartment) {
      assignDepartment(id, newDept);
    }
  };

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    if (updateStatus) {
      updateStatus(id, newStatus);
    }
  };

  // Handle delete action
  const handleConfirmDelete = () => {
    if (deleteTargetId && deleteComplaint) {
      deleteComplaint(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Export Table to CSV
  const handleExportCSV = () => {
    const headers = ["Ticket ID", "Title", "Category", "Priority", "Status", "Department", "Location", "Student", "Date", "Upvotes"];
    const rows = complaints.map((c) => [
      `#UNIFIX-${String(c.id).slice(-4)}`,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      c.category,
      c.priority || "Medium",
      c.status,
      c.department || "General",
      `"${(c.location || "").replace(/"/g, '""')}"`,
      c.studentName || "Campus Student",
      c.date,
      c.upvotes || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `unifix_complaints_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: "success",
      title: "Exported",
      message: "Complaints CSV downloaded successfully."
    });
  };

  return (
    <div className="admin-page container animate-fade-in">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <div className="admin-badge">
            <span>🛡️ Chitkara University Facilities Administration</span>
          </div>
          <h1 className="page-title">Operations & Grievance Center</h1>
          <p className="page-subtitle">
            Oversee campus maintenance workload, assign specialized repair departments, update verified timelines, and manage resolution audits.
          </p>
        </div>

        <div className="admin-top-actions">
          <div className="admin-status-indicator">
            <span className="live-dot" aria-hidden="true"></span>
            <span>Live Maintenance Dispatch</span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={switchRole}
            title="Switch demo persona to Student"
          >
            Switch to Student ⇄
          </button>
        </div>
      </div>

      {/* 5-Column KPI Statistics Grid */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Registered"
          value={stats.total}
          icon="📊"
          badgeText="Campus Wide"
          onClick={() => setActiveTab("All")}
        />
        <StatCard
          title="Action Needed"
          value={stats.pending}
          icon="⏳"
          badgeText="Pending"
          cardType="pending"
          onClick={() => setActiveTab("Pending")}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress + stats.underReview}
          icon="⚙️"
          badgeText="Active Dispatch"
          cardType="progress"
          onClick={() => setActiveTab("In Progress")}
        />
        <StatCard
          title="High Urgency"
          value={stats.highPriority}
          icon="🔥"
          badgeText="Safety Alert"
          onClick={() => setActiveTab("High Priority")}
        />
        <StatCard
          title="Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon="✅"
          badgeText={`${stats.resolved} Closed`}
          cardType="resolved"
          onClick={() => setActiveTab("Resolved")}
        />
      </div>

      {/* Visual Analytics: Department Workload & Audit Log */}
      <div className="analytics-two-col">
        {/* Department Workload Distribution Chart */}
        <div className="admin-insights-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="insights-title" style={{ margin: 0 }}>
              Department Workload Distribution
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {stats.departmentBreakdown.length} Active Units
            </span>
          </div>

          <div className="dept-bars-grid">
            {stats.departmentBreakdown.map((dept, idx) => (
              <div key={dept.dept} className="dept-bar-item">
                <div className="dept-bar-header">
                  <span>🏢 {dept.dept}</span>
                  <span>{dept.count} Tickets ({dept.percentage}%)</span>
                </div>
                <div className="dept-progress-track">
                  <div
                    className={`dept-progress-fill fill-${idx % 5}`}
                    style={{ width: `${Math.max(dept.percentage, 8)}%` }}
                    role="progressbar"
                    aria-valuenow={dept.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Activity Audit Trail */}
        <div className="admin-insights-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="insights-title" style={{ margin: 0 }}>
              Administrative Activity Audit
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Recent Audit Events
            </span>
          </div>

          <div className="audit-list">
            {activityLog && activityLog.length > 0 ? (
              activityLog.map((log) => (
                <div key={log.id} className="audit-item">
                  <span style={{ fontSize: "1.1rem" }}>
                    {log.action === "STATUS_UPDATE" ? "🔄" : log.action === "ASSIGNMENT" ? "🏢" : log.action === "DELETE" ? "🗑️" : "📝"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{log.text}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {log.time} • By: <em>{log.actor || "Administrator"}</em>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No audit activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Table: Complaints Management */}
      <div className="recent-complaints-section">
        <div className="section-header-row">
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "4px" }}>
              Campus Complaints Management
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Change statuses, assign specialized ground teams, and oversee ticket resolution.
            </p>
          </div>

          {/* Action Tools */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Filter table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ width: "200px", padding: "6px 12px", fontSize: "0.85rem" }}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              📥 Export CSV
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsResetConfirmOpen(true)}
            >
              🔄 Reset Demo Data
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="admin-tabs">
          {["All", "Pending", "In Progress", "Resolved", "High Priority"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Details</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Assign Department</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((item) => (
                  <tr key={item.id} className="admin-row">
                    {/* Ticket ID */}
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.82rem", color: "var(--primary)" }}>
                      <Link to={`/complaints/${item.id}`} title="View full tracking details">
                        #UNIFIX-{String(item.id).slice(-4)}
                      </Link>
                    </td>

                    {/* Issue Title & Student */}
                    <td style={{ minWidth: "200px" }}>
                      <div className="issue-title-text">{item.title}</div>
                      <div className="issue-sub-info">
                        <span>👤 {item.studentName || "Campus Student"}</span>
                        <span>•</span>
                        <span>👍 {item.upvotes || 0}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-badge">{item.category}</span>
                    </td>

                    {/* Location */}
                    <td style={{ minWidth: "150px" }}>
                      <span style={{ fontSize: "0.85rem" }}>📍 {item.location}</span>
                    </td>

                    {/* Priority */}
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>

                    {/* Department Assign Dropdown */}
                    <td>
                      <select
                        className="table-select"
                        value={item.department || "General Maintenance"}
                        onChange={(e) => handleDepartmentChange(item.id, e.target.value)}
                        aria-label={`Assign department for complaint #${item.id}`}
                      >
                        {departmentsList.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Update Dropdown */}
                    <td>
                      <select
                        className="table-select"
                        value={item.status === "Submitted" ? "Pending" : item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        aria-label={`Change status for complaint #${item.id}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions: Quick View & Delete */}
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          className="btn-icon-action"
                          onClick={() => setSelectedComplaint(item)}
                          title="Quick View Details"
                          aria-label="Quick view"
                        >
                          👁️
                        </button>
                        <Link
                          to={`/complaints/${item.id}`}
                          className="btn-icon-action"
                          title="View Full Tracking Page"
                          aria-label="View tracking"
                        >
                          🔗
                        </Link>
                        <button
                          type="button"
                          className="btn-icon-action btn-icon-danger"
                          onClick={() => setDeleteTargetId(item.id)}
                          title="Delete Complaint"
                          aria-label="Delete ticket"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon="📋"
                      title="No records matched"
                      description={`No complaints found under filter: "${activeTab}"`}
                      actionLabel="Reset Table Filter"
                      onAction={() => {
                        setActiveTab("All");
                        setSearchTerm("");
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(pg) => setCurrentPage(pg)}
        />
      </div>

      {/* Quick View Modal */}
      {selectedComplaint && (
        <QuickViewModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Campus Grievance"
        message={`Are you sure you want to permanently delete ticket #UNIFIX-${String(deleteTargetId).slice(-4)}? This audit action cannot be undone.`}
        confirmLabel="Yes, Delete Ticket"
        isDanger={true}
      />

      {/* Reset Demo Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => resetData && resetData()}
        title="Reset Demo Dataset"
        message="Are you sure you want to restore the default sample complaints and clear the current activity log?"
        confirmLabel="Reset to Initial Data"
        isDanger={false}
      />
    </div>
  );
}

export default AdminDashboard;
