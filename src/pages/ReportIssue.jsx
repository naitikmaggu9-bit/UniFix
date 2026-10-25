import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import "./ReportIssue.css";

/**
 * ReportIssue Component (UniFix 2.0)
 * Multi-step verified reporting workflow:
 * Step 1: Identify Issue -> Step 2: Add Details & Location -> Step 3: Review & Submit.
 * Demonstrates: Controlled components, multi-step validation, character limits,
 * file preview simulation, duplicate submission prevention, and Context mutation.
 * (Syllabus: Lectures 19-24, Lectures 55-60)
 */
export function ReportIssue({ onAddComplaint }) {
  const { addComplaint } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [studentName, setStudentName] = useState(currentUser?.name || "Aarav Sharma");
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || "student@chitkara.edu.in");
  const [issueTitle, setIssueTitle] = useState("");
  const [category, setCategory] = useState("Wi-Fi & Internet");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("IT Support");
  const [description, setDescription] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Validation State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const categories = [
    "Wi-Fi & Internet",
    "Electricity & Lights",
    "Water Leakage",
    "Cleanliness & Sanitation",
    "Hostel Maintenance",
    "Furniture & Classrooms",
    "Other"
  ];

  const departments = [
    "IT Support",
    "Electrical Maintenance",
    "Plumbing & Sanitation",
    "Hostel Facilities",
    "General Maintenance"
  ];

  // Auto-route department based on category
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    if (selected.includes("Wi-Fi")) setDepartment("IT Support");
    else if (selected.includes("Electricity")) setDepartment("Electrical Maintenance");
    else if (selected.includes("Water") || selected.includes("Cleanliness")) setDepartment("Plumbing & Sanitation");
    else if (selected.includes("Hostel")) setDepartment("Hostel Facilities");
    else setDepartment("General Maintenance");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!issueTitle.trim()) {
      errs.issueTitle = "Issue title is required.";
    } else if (issueTitle.trim().length < 6) {
      errs.issueTitle = "Title must be at least 6 characters.";
    } else if (issueTitle.trim().length > 100) {
      errs.issueTitle = "Title cannot exceed 100 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs = {};
    if (!location.trim()) {
      errs.location = "Campus block or room location is required.";
    } else if (location.trim().length < 4) {
      errs.location = "Please provide a specific location (e.g. 'Galileo Block, Room 304').";
    }

    if (!description.trim()) {
      errs.description = "Detailed issue description is required.";
    } else if (description.trim().length < 15) {
      errs.description = "Please describe the problem with more detail (min 15 characters).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        studentName,
        studentEmail,
        title: issueTitle,
        category,
        priority,
        location,
        department,
        description,
        image: imageFileName || null
      };

      const created = await addComplaint(payload);

      // Support legacy prop if passed
      if (onAddComplaint) {
        onAddComplaint(created);
      }

      setSubmittedTicket(created);
    } catch (err) {
      setErrors({ form: err.message || "Failed to submit grievance. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIssueTitle("");
    setLocation("");
    setDescription("");
    setImageFileName("");
    setImagePreview(null);
    setCurrentStep(1);
    setSubmittedTicket(null);
    setErrors({});
  };

  return (
    <div className="report-page container animate-fade-in">
      <div className="page-header" style={{ textAlign: "center", marginBottom: "8px" }}>
        <span className="badge-tag">Chitkara University Student Helpdesk</span>
        <h1 className="page-title">Report a Campus Grievance</h1>
        <p className="page-subtitle">
          Submit verified details regarding campus facilities, maintenance, or electrical concerns for rapid response.
        </p>
      </div>

      {/* Stepper Progress Bar (only if not yet submitted) */}
      {!submittedTicket && (
        <div className="report-stepper" role="navigation" aria-label="Form progress">
          <div
            className={`report-step-item ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
          >
            <div className="step-num-bubble">{currentStep > 1 ? "✓" : "1"}</div>
            <span className="step-label-text">1. Identify Issue</span>
          </div>
          <div
            className={`report-step-item ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}
            onClick={() => currentStep > 2 && setCurrentStep(2)}
          >
            <div className="step-num-bubble">{currentStep > 2 ? "✓" : "2"}</div>
            <span className="step-label-text">2. Location & Details</span>
          </div>
          <div className={`report-step-item ${currentStep === 3 ? "active" : ""}`}>
            <div className="step-num-bubble">3</div>
            <span className="step-label-text">3. Review & Submit</span>
          </div>
        </div>
      )}

      <div className="form-wrapper">
        {/* Success Confirmation State */}
        {submittedTicket ? (
          <div className="success-card">
            <div className="success-icon-circle">✓</div>
            <h2 className="success-title">Grievance Lodged Successfully!</h2>
            <p className="success-desc">
              Your ticket has been recorded into the UniFix operations portal. The maintenance team has been notified.
            </p>

            <div className="review-summary-box" style={{ width: "100%", maxWidth: "520px" }}>
              <div className="review-row">
                <span className="review-label">Ticket ID:</span>
                <span className="review-val" style={{ color: "var(--primary)", fontFamily: "var(--font-mono)" }}>
                  #UNIFIX-{String(submittedTicket.id).slice(-4)}
                </span>
              </div>
              <div className="review-row">
                <span className="review-label">Title:</span>
                <span className="review-val">{submittedTicket.title}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Category:</span>
                <span className="review-val">{submittedTicket.category}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Location:</span>
                <span className="review-val">{submittedTicket.location}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Assigned Unit:</span>
                <span className="review-val">{submittedTicket.department}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Status:</span>
                <StatusBadge status="Pending" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link to={`/complaints/${submittedTicket.id}`} className="btn btn-primary">
                View Full Tracking Page →
              </Link>
              <Link to="/complaints" className="btn btn-secondary">
                Campus Complaints Feed
              </Link>
              <button type="button" className="btn btn-outline-primary" onClick={handleReset}>
                + Submit Another Issue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "var(--radius-md)", marginBottom: "16px", fontSize: "0.88rem" }}>
                ⚠️ {errors.form}
              </div>
            )}

            {/* STEP 1: Identify Issue */}
            {currentStep === 1 && (
              <div className="form-step-content">
                <h3 className="step-heading">Step 1: Identify the Campus Grievance</h3>

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="issueTitle" className="form-label">
                    Issue Title <span className="req-star">*</span>
                  </label>
                  <input
                    id="issueTitle"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Wi-Fi router rebooting frequently in Hostel Block 3"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                  {errors.issueTitle && <span className="field-error-text">⚠️ {errors.issueTitle}</span>}
                  <div className="char-counter">{issueTitle.length} / 100 characters</div>
                </div>

                {/* Two Column: Category & Priority */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Campus Category <span className="req-star">*</span>
                    </label>
                    <select
                      id="category"
                      className="form-select"
                      value={category}
                      onChange={handleCategoryChange}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority" className="form-label">
                      Urgency / Priority <span className="req-star">*</span>
                    </label>
                    <select
                      id="priority"
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">🔥 High (Safety / Severe Outage)</option>
                      <option value="Medium">⚡ Medium (Standard Repair)</option>
                      <option value="Low">🌱 Low (Minor Cosmetic)</option>
                    </select>
                  </div>
                </div>

                <div className="stepper-nav-buttons" style={{ justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next: Add Details & Location →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Location & Description */}
            {currentStep === 2 && (
              <div className="form-step-content">
                <h3 className="step-heading">Step 2: Location, Description & Evidence</h3>

                {/* Location */}
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Specific Campus Location / Block <span className="req-star">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Newton Block A, 1st Floor Corridor near Room 104"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  {errors.location && <span className="field-error-text">⚠️ {errors.location}</span>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Detailed Problem Description <span className="req-star">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="form-textarea"
                    placeholder="Provide specific details about when it started, symptoms, danger hazards, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  {errors.description && <span className="field-error-text">⚠️ {errors.description}</span>}
                  <div className="char-counter">{description.length} characters (min 15 required)</div>
                </div>

                {/* Photo Upload */}
                <div className="form-group">
                  <label htmlFor="photoUpload" className="form-label">
                    Upload Photo Evidence <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-input"
                    style={{ padding: "8px" }}
                  />
                  {imageFileName && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <span>📷 Selected: <strong>{imageFileName}</strong></span>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Evidence preview"
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="stepper-nav-buttons">
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    ← Back to Step 1
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next: Review & Submit →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="form-step-content">
                <h3 className="step-heading">Step 3: Confirm & Submit Grievance</h3>

                <p style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
                  Please review your information below before submitting to the campus maintenance department.
                </p>

                <div className="review-summary-box">
                  <div className="review-row">
                    <span className="review-label">Reporting Student:</span>
                    <span className="review-val">{studentName} ({studentEmail})</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Title:</span>
                    <span className="review-val">{issueTitle}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Category:</span>
                    <span className="review-val">{category}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Priority:</span>
                    <span className="review-val"><PriorityBadge priority={priority} /></span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Location:</span>
                    <span className="review-val">📍 {location}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Routed Unit:</span>
                    <span className="review-val">🏢 {department}</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">Description:</span>
                    <span className="review-val" style={{ maxWidth: "340px", textAlign: "right" }}>
                      {description}
                    </span>
                  </div>
                  {imageFileName && (
                    <div className="review-row">
                      <span className="review-label">Photo Evidence:</span>
                      <span className="review-val">📷 {imageFileName}</span>
                    </div>
                  )}
                </div>

                <div className="stepper-nav-buttons">
                  <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                    ← Edit Details
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Registering Grievance..." : "✓ Confirm & Submit Ticket"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportIssue;
