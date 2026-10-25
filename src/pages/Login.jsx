import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * Login Component (Demonstration Authentication)
 * Demonstrates: Controlled login forms, validation, role switching, redirect after login
 * (Syllabus: Lectures 19-24, Lectures 55-60)
 */
export function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your campus email address.");
      return;
    }

    login(email, role);
    showToast({
      type: "success",
      title: "Authenticated",
      message: `Signed in as ${role === "admin" ? "Campus Administrator" : "Student"}.`
    });
    navigate(role === "admin" ? "/admin" : from, { replace: true });
  };

  const handleDemoStudent = () => {
    login("aarav.sharma@chitkara.edu.in", "student");
    showToast({
      type: "success",
      title: "Student Demo Persona",
      message: "Signed in as Aarav Sharma."
    });
    navigate("/dashboard");
  };

  const handleDemoAdmin = () => {
    login("admin@chitkara.edu.in", "admin");
    showToast({
      type: "success",
      title: "Administrator Persona",
      message: "Signed in as Campus Administrator."
    });
    navigate("/admin");
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "48px", paddingBottom: "60px", maxWidth: "480px" }}>
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "36px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="badge-tag">Chitkara Single Sign-On Demo</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
            Sign In to UniFix
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            Access student grievances, maintenance tracking, and campus facilities.
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleDemoStudent}
          >
            ⚡ Quick Demo: Student (Aarav Sharma)
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleDemoAdmin}
          >
            🛡️ Quick Demo: Administrator (Dr. Sandeep)
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
          <span>or sign in manually</span>
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
        </div>

        {error && (
          <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Campus Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. yourname@chitkara.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role Persona</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">👨‍🎓 Student</option>
              <option value="admin">🏛️ Campus Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              (Any password accepted for demonstration purposes)
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
            Sign In to UniFix
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Don't have a demo account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Register Student
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
