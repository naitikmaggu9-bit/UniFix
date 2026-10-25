import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useComplaints } from "../context/ComplaintContext";
import { campusAnnouncements } from "../data/sampleComplaints";
import StatCard from "../components/common/StatCard";
import ComplaintCard from "../components/ComplaintCard";
import QuickViewModal from "../components/complaints/QuickViewModal";
import EmptyState from "../components/common/EmptyState";
import "./StudentDashboard.css";

/**
 * Student Command Center Component
 * Personalized dashboard for students to view their submitted complaints,
 * track status updates, view campus notices, and trigger rapid reporting.
 * Demonstrates: useMemo filtering, user identity association, tabbed views
 * (Syllabus: Lectures 43-48, Lectures 49-54)
 */
export function StudentDashboard() {
  const { currentUser, switchRole } = useAuth();
  const { complaints, stats } = useComplaints();
  const [activeTab, setActiveTab] = useState("myReports"); // "myReports" | "allCampus" | "announcements"
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  // Filter complaints submitted by current user
  const myComplaints = useMemo(() => {
    return complaints.filter(
      (c) =>
        c.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
        c.studentName?.toLowerCase() === currentUser.name?.toLowerCase()
    );
  }, [complaints, currentUser]);

  const myPending = myComplaints.filter((c) => c.status === "Pending" || c.status === "Submitted").length;
  const myInProgress = myComplaints.filter((c) => c.status === "In Progress" || c.status === "Under Review").length;
  const myResolved = myComplaints.filter((c) => c.status === "Resolved").length;

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="student-dashboard container animate-fade-in">
      {/* 1. Personalized Greeting Hero */}
      <div className="dashboard-hero-card">
        <div>
          <div style={{ display: "inline-block", background: "rgba(255, 255, 255, 0.15)", padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 700, marginBottom: "8px" }}>
            🎓 Student Portal • {todayStr}
          </div>
          <h1 className="greeting-text">
            Welcome back, {currentUser.name}! {currentUser.avatar || "👨‍🎓"}
          </h1>
          <div className="student-meta-sub">
            <span>Roll No: <strong>{currentUser.rollNo || "2310990001"}</strong></span>
            <span>•</span>
            <span>Dept: <strong>{currentUser.department || "Computer Science"}</strong></span>
            <span>•</span>
            <span>Residence: <strong>{currentUser.hostel || "Hostel Block 3"}</strong></span>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/report" className="btn btn-primary">
            + Report New Grievance
          </Link>
          <Link to="/facilities" className="btn btn-secondary">
            🗺️ Campus Facilities Map
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={switchRole}
            title="Switch demo persona to Admin"
          >
            Switch to Admin ⇄
          </button>
        </div>
      </div>

      {/* 2. Personal Metrics Overview */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-main)" }}>
            My Grievance Overview
          </h2>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing records linked to <em>{currentUser.email}</em>
          </span>
        </div>

        <div className="pulse-grid">
          <StatCard
            title="My Submitted Tickets"
            value={myComplaints.length}
            icon="📋"
            badgeText="Personal"
          />
          <StatCard
            title="Awaiting Action"
            value={myPending}
            icon="⏳"
            badgeText="Pending"
            cardType="pending"
          />
          <StatCard
            title="Being Repaired"
            value={myInProgress}
            icon="🔧"
            badgeText="In Progress"
            cardType="progress"
          />
          <StatCard
            title="Successfully Resolved"
            value={myResolved}
            icon="✅"
            badgeText="Completed"
            cardType="resolved"
          />
        </div>
      </section>

      {/* 3. Tabbed Content: My Reports vs All Campus vs Campus Announcements */}
      <section>
        <div className="dashboard-tabs">
          <button
            className={`dash-tab-btn ${activeTab === "myReports" ? "active" : ""}`}
            onClick={() => setActiveTab("myReports")}
          >
            My Submitted Complaints ({myComplaints.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            Campus Notices & Alerts ({campusAnnouncements.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === "allCampus" ? "active" : ""}`}
            onClick={() => setActiveTab("allCampus")}
          >
            All Campus Public Feed ({complaints.length})
          </button>
        </div>

        {/* Tab 1: My Reports */}
        {activeTab === "myReports" && (
          <div>
            {myComplaints.length > 0 ? (
              <div className="activity-grid">
                {myComplaints.map((item) => (
                  <ComplaintCard
                    key={item.id}
                    complaint={item}
                    onQuickView={(c) => setSelectedComplaint(c)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📝"
                title="You haven't reported any issues yet"
                description="Notice broken furniture, plumbing leaks, or slow Wi-Fi? Lodge a grievance to alert campus facilities."
                actionLabel="+ Report Your First Issue"
                onAction={() => navigate("/report")}
              />
            )}
          </div>
        )}

        {/* Tab 2: Campus Announcements */}
        {activeTab === "announcements" && (
          <div className="announcements-grid">
            {campusAnnouncements.map((notice) => (
              <div key={notice.id} className="announcement-card">
                <div>
                  <div className="announcement-header">
                    <span className="badge-tag" style={{ margin: 0, fontSize: "0.72rem" }}>
                      {notice.type === "warning" ? "⚠️ Advisory" : "📢 Notice"}
                    </span>
                    <span className="announcement-date">{notice.date}</span>
                  </div>
                  <h3 className="announcement-title">{notice.title}</h3>
                  <p className="announcement-desc">{notice.description}</p>
                </div>
                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Issued by: Chitkara University Facilities Office
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: All Campus Feed */}
        {activeTab === "allCampus" && (
          <div>
            <div className="activity-grid">
              {complaints.slice(0, 6).map((item) => (
                <ComplaintCard
                  key={item.id}
                  complaint={item}
                  onQuickView={(c) => setSelectedComplaint(c)}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Link to="/complaints" className="btn btn-secondary">
                Open Full Complaints Feed ({complaints.length}) →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {selectedComplaint && (
        <QuickViewModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;
