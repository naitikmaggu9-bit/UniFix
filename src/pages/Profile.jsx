import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useComplaints } from "../context/ComplaintContext";
import { useToast } from "../context/ToastContext";
import ComplaintCard from "../components/ComplaintCard";

/**
 * Profile Page Component
 * Demonstrates: Controlled profile editing, Context synchronization,
 * user-associated complaint listing.
 * (Syllabus: Lectures 43-48, Lectures 49-54)
 */
export function Profile() {
  const { currentUser, updateProfile, switchRole, isAdmin } = useAuth();
  const { complaints } = useComplaints();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [department, setDepartment] = useState(currentUser.department || "");
  const [hostel, setHostel] = useState(currentUser.hostel || "");

  // Personal complaints
  const userComplaints = complaints.filter(
    (c) =>
      c.studentEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      c.studentName?.toLowerCase() === currentUser.name?.toLowerCase()
  );

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email, department, hostel });
    setIsEditing(false);
    showToast({
      type: "success",
      title: "Profile Updated",
      message: "Your profile details have been updated."
    });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "36px", paddingBottom: "60px" }}>
      {/* Profile Header Card */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "32px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              border: "2px solid var(--primary-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem"
            }}
          >
            {currentUser.avatar || "👤"}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
                {currentUser.name}
              </h1>
              <span className="badge-tag" style={{ margin: 0, textTransform: "uppercase" }}>
                {currentUser.role}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
              {currentUser.email} • Joined {currentUser.joined || "Aug 2023"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Editing" : "✏️ Edit Profile"}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={switchRole}
          >
            Switch to {isAdmin ? "Student" : "Admin"} ⇄
          </button>
        </div>
      </div>

      {/* Edit Form OR Details View */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "28px",
            border: "1px solid var(--border-color)",
            marginBottom: "32px",
            maxWidth: "600px"
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>
            Edit Profile Details
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / School</label>
              <input
                type="text"
                className="form-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hostel Residence / Location</label>
              <input
                type="text"
                className="form-input"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "36px"
          }}
        >
          <div style={{ background: "var(--bg-surface)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Roll / Employee ID</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px" }}>{currentUser.rollNo || "2310990001"}</div>
          </div>
          <div style={{ background: "var(--bg-surface)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Academic Department</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px" }}>{currentUser.department || "Engineering"}</div>
          </div>
          <div style={{ background: "var(--bg-surface)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Hostel Accommodation</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px" }}>{currentUser.hostel || "Hostel Block 3"}</div>
          </div>
          <div style={{ background: "var(--bg-surface)", padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Total Lodged Grievances</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--primary)" }}>{userComplaints.length} Tickets</div>
          </div>
        </div>
      )}

      {/* User's Submitted Complaints */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
            My Grievance Submissions ({userComplaints.length})
          </h2>
          <Link to="/report" className="btn btn-primary btn-sm">
            + Report New Issue
          </Link>
        </div>

        {userComplaints.length > 0 ? (
          <div className="activity-grid">
            {userComplaints.map((item) => (
              <ComplaintCard key={item.id} complaint={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
            <p style={{ color: "var(--text-muted)" }}>You have no active grievance submissions on file.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
