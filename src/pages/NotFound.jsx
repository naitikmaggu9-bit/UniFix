import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFound 404 Component
 * Demonstrates: Catch-all route (*), friendly user guidance, quick recovery links
 * (Syllabus: Lectures 37-42)
 */
export function NotFound() {
  return (
    <div
      className="container animate-fade-in"
      style={{
        paddingTop: "80px",
        paddingBottom: "100px",
        textAlign: "center",
        maxWidth: "600px"
      }}
    >
      <div style={{ fontSize: "5rem", marginBottom: "16px" }}>🏛️ 404</div>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "12px" }}>
        Campus Page Not Found
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "32px" }}>
        The campus link you followed might be outdated, mistyped, or the maintenance ticket may have been moved.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/" className="btn btn-primary btn-lg">
          ← Return to Home
        </Link>
        <Link to="/complaints" className="btn btn-secondary btn-lg">
          View Complaints Feed
        </Link>
        <Link to="/dashboard" className="btn btn-secondary btn-lg">
          Command Center
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
