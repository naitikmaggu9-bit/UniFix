import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * Register Component (Demonstration Registration)
 * Demonstrates: Controlled inputs, password match validation, email validation,
 * automatic demo login on submit.
 * (Syllabus: Lectures 19-24, Lectures 55-60)
 */
export function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [hostel, setHostel] = useState("Hostel Block 3");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid campus email address.");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    register({
      name,
      email,
      rollNo,
      department,
      hostel,
      role: "student"
    });

    showToast({
      type: "success",
      title: "Account Created",
      message: `Welcome to UniFix, ${name}!`
    });

    navigate("/dashboard");
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "520px" }}>
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
          <div className="badge-tag">Chitkara University Student Registration</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
            Create Student Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
            Join the UniFix campus reporting platform to submit and monitor facility tickets.
          </p>
        </div>

        {error && (
          <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="req-star">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Navjot Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campus Email <span className="req-star">*</span></label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. navjot.singh@chitkara.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="231099xxxx"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hostel / Block</label>
              <input
                type="text"
                className="form-input"
                placeholder="Hostel Block 1, Day Scholar, etc."
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Department</label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Business School">Chitkara Business School</option>
              <option value="Pharmacy & Health Sciences">Pharmacy & Health Sciences</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "10px" }}>
            Register & Open Command Center
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Already have a demonstration account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
