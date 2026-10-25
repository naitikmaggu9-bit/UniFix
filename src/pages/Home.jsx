import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import ComplaintCard from "../components/ComplaintCard";
import QuickViewModal from "../components/complaints/QuickViewModal";
import StatCard from "../components/common/StatCard";
import "./Home.css";

/**
 * Home Page Component (UniFix 2.0)
 * Demonstrates: Split hero layout, live campus pulse metrics derived from Context API,
 * dynamic category navigation, recent community activity cards, quick view modal.
 * (Syllabus: Lectures 1-6, Lectures 25-30, Lectures 49-54)
 */
export function Home() {
  const { complaints, stats, loading } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  // Features of UniFix
  const features = [
    {
      id: 1,
      icon: "📢",
      title: "1. Rapid Issue Reporting",
      description: "Lodge campus grievances across Wi-Fi, electricity, plumbing, cleanliness, or hostel facilities in under 60 seconds."
    },
    {
      id: 2,
      icon: "🔍",
      title: "2. Real-Time Status Tracking",
      description: "Watch tickets progress through verified stages from intake to review, active maintenance, and verified closure."
    },
    {
      id: 3,
      icon: "👍",
      title: "3. Democratic Upvoting",
      description: "Upvote shared issues to signal high-impact campus problems, helping administrators prioritize urgent repairs."
    },
    {
      id: 4,
      icon: "⚡",
      title: "4. Department Accountability",
      description: "Direct routing to dedicated university maintenance teams ensures transparent turnaround times."
    }
  ];

  // 4-step workflow
  const steps = [
    {
      stepNumber: "01",
      title: "Report Issue",
      desc: "Student submits issue details, category, location, and photo evidence.",
      badgeColor: "step-1"
    },
    {
      stepNumber: "02",
      title: "Review & Route",
      desc: "Estate office verifies grievance and assigns specialized maintenance crew.",
      badgeColor: "step-2"
    },
    {
      stepNumber: "03",
      title: "Work in Progress",
      desc: "On-ground technicians carry out repair with recorded audit updates.",
      badgeColor: "step-3"
    },
    {
      stepNumber: "04",
      title: "Resolved & Closed",
      desc: "Issue verified resolved with closure confirmation for student transparency.",
      badgeColor: "step-4"
    }
  ];

  // Categories
  const campusCategories = [
    { name: "Wi-Fi & Internet", icon: "📶", desc: "Network routers, portal access, hostel APs" },
    { name: "Electricity & Lights", icon: "⚡", desc: "Power, wiring, fans, pathway lights" },
    { name: "Water Leakage", icon: "🚰", desc: "Dispensers, pipeline leaks, washroom taps" },
    { name: "Cleanliness & Sanitation", icon: "🧹", desc: "Hostel & block hygiene, waste disposal" },
    { name: "Hostel Maintenance", icon: "🏢", desc: "Room fittings, elevators, HVAC units" },
    { name: "Furniture & Classrooms", icon: "🔧", desc: "Chairs, projectors, whiteboards, podiums" }
  ];

  // Helper to count issues in a category
  const getCategoryCount = (catName) => {
    return complaints.filter((c) =>
      c.category.toLowerCase().includes(catName.split(" ")[0].toLowerCase())
    ).length;
  };

  // Recent 3 complaints for community activity
  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="home-page animate-fade-in">
      {/* Live Campus Operations Ticker Banner */}
      <div style={{ backgroundColor: "var(--secondary)", color: "#94a3b8", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "0.85rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", animation: "pulseGlow 1.5s infinite" }} />
            <strong style={{ color: "#ffffff" }}>Campus Status:</strong>
            <span>Active maintenance in progress • Optical NOC maintenance in Turing • RO filter audit in Newton Block</span>
          </div>
          <Link to="/facilities" style={{ color: "var(--accent-light)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            View Zone Health Map →
          </Link>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-split">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" aria-hidden="true"></span>
              Chitkara University • Operations Platform
            </div>

            <h1 className="hero-title">UniFix 2.0</h1>
            <p className="hero-tagline">"Your Campus, Connected • Report. Track. Resolve."</p>

            <p className="hero-description">
              UniFix bridges the gap between students, resident hostelers, faculty, and campus maintenance departments.
              Report issues swiftly, monitor transparent timelines, and inspect real-time building infrastructure.
            </p>

            <div className="hero-buttons">
              <Link to="/report" className="btn btn-primary btn-lg">
                <span>📢 Report an Issue</span>
              </Link>
              <Link to="/complaints" className="btn btn-secondary btn-lg">
                <span>📋 Complaints Feed ({complaints.length})</span>
              </Link>
              <Link to="/facilities" className="btn btn-outline-primary btn-lg">
                <span>🗺️ Campus Map & Zones</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Status Panel in Hero */}
          <div className="hero-live-panel" aria-label="Campus Live Activity Summary">
            <div className="panel-header">
              <span className="panel-title">🏛️ Campus Maintenance Hub</span>
              <span className="live-indicator">Live Operations</span>
            </div>

            <div className="hero-metric-row">
              <div className="hero-metric-box">
                <span className="metric-box-val">{stats.total}</span>
                <span className="metric-box-lbl">Total Registered</span>
              </div>
              <div className="hero-metric-box">
                <span className="metric-box-val" style={{ color: "#16a34a" }}>
                  {stats.resolved}
                </span>
                <span className="metric-box-lbl">Resolved Issues</span>
              </div>
            </div>

            {/* Latest active complaint ticker */}
            {complaints.length > 0 && (
              <div className="hero-panel-ticket">
                <div className="ticket-header">
                  <span>Latest Campus Report</span>
                  <span>{complaints[0].category}</span>
                </div>
                <div className="ticket-title">{complaints[0].title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>📍 {complaints[0].location}</span>
                  <span>👍 {complaints[0].upvotes} upvotes</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Resolution Efficiency: <strong>{stats.resolutionRate}%</strong>
              </span>
              <Link to="/dashboard" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>
                Command Center →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campus Pulse Dashboard (Live Metrics derived from dataset) */}
      <section className="container">
        <h2 className="section-title">Campus Pulse Dashboard</h2>
        <p className="section-subtitle">
          Real-time analytics computed directly from active student complaints across Chitkara University campus blocks.
        </p>

        <div className="pulse-grid">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon="📊"
            badgeText="All Time"
            onClick={() => navigate("/complaints")}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon="⏳"
            badgeText="Action Needed"
            cardType="pending"
            onClick={() => navigate("/complaints?status=Pending")}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress + stats.underReview}
            icon="⚙️"
            badgeText="Ground Staff"
            cardType="progress"
            onClick={() => navigate("/complaints?status=In Progress")}
          />
          <StatCard
            title="Resolved Issues"
            value={stats.resolved}
            icon="✅"
            badgeText={`${stats.resolutionRate}% Rate`}
            cardType="resolved"
            onClick={() => navigate("/complaints?status=Resolved")}
          />
          <StatCard
            title="Community Upvotes"
            value={stats.totalUpvotes}
            icon="👍"
            badgeText="Student Voices"
            onClick={() => navigate("/complaints?sort=upvotes")}
          />
        </div>
      </section>

      {/* 3. Category Explorer */}
      <section className="container">
        <h2 className="section-title">Campus Category Explorer</h2>
        <p className="section-subtitle">
          Filter and explore reported issues organized by specialized university facilities departments.
        </p>

        <div className="categories-grid">
          {campusCategories.map((cat, idx) => {
            const count = getCategoryCount(cat.name);
            return (
              <div
                key={idx}
                className="category-tile"
                onClick={() => navigate(`/complaints?category=${encodeURIComponent(cat.name.split(" ")[0])}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/complaints?category=${encodeURIComponent(cat.name.split(" ")[0])}`);
                }}
              >
                <span className="cat-tile-icon" aria-hidden="true">{cat.icon}</span>
                <span className="cat-tile-name">{cat.name}</span>
                <span className="cat-tile-count">{count} active tickets</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. How UniFix Works */}
      <section className="container">
        <h2 className="section-title">How UniFix Works</h2>
        <p className="section-subtitle">
          A transparent 4-stage lifecycle from initial grievance submission to verified on-site resolution.
        </p>

        <div className="workflow-grid">
          {steps.map((step, index) => (
            <div key={index} className="workflow-card">
              <div className={`step-badge ${step.badgeColor}`}>{step.stepNumber}</div>
              <h3 className="workflow-step-title">{step.title}</h3>
              <p className="workflow-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Key Features */}
      <section className="container">
        <h2 className="section-title">Platform Capabilities</h2>
        <p className="section-subtitle">
          Designed to ensure swift turnaround, full transparency, and student empowerment.
        </p>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Community Activity (Live Complaints) */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)" }}>
              Recent Community Activity
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Latest issues reported and updated by students across campus blocks.
            </p>
          </div>
          <Link to="/complaints" className="btn btn-secondary btn-sm">
            View All ({complaints.length}) →
          </Link>
        </div>

        <div className="activity-grid">
          {recentComplaints.map((item) => (
            <ComplaintCard
              key={item.id}
              complaint={item}
              onQuickView={(c) => setSelectedComplaint(c)}
            />
          ))}
        </div>
      </section>

      {/* 7. Call To Action Box */}
      <section className="container">
        <div className="cta-box">
          <div>
            <h3 className="cta-title">Notice a facility problem on campus?</h3>
            <p className="cta-desc">
              Help us maintain a clean, safe, and efficient Chitkara University campus by lodging your issue today.
              Track updates live through our verified resolution timeline.
            </p>
          </div>
          <Link to="/report" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
            <span>Submit Complaint Now →</span>
          </Link>
        </div>
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

export default Home;
