import React, { useState } from "react";
import "./ReportIssue.css";

// Page 2: Report Issue (Team Member 2)
// Demonstrates: useState, Form handling, Controlled Inputs, Conditional Rendering, Props
function ReportIssue({ onAddComplaint, setActivePage }) {
  // Categories array for dropdown options
  const categories = [
    "Wi-Fi",
    "Electricity",
    "Water",
    "Cleanliness",
    "Hostel",
    "Maintenance",
    "Other"
  ];

  // useState to manage form inputs
  const [studentName, setStudentName] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [category, setCategory] = useState("Wi-Fi");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFileName, setImageFileName] = useState("");

  // useState to track form submission status (for Conditional Rendering)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  // Handle file input change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFileName(e.target.files[0].name);
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!studentName.trim() || !issueTitle.trim() || !location.trim() || !description.trim()) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    setErrorMessage("");

    // Create new complaint object
    const newComplaint = {
      id: Date.now(),
      studentName: studentName,
      title: issueTitle,
      category: category,
      location: location,
      description: description,
      status: "Submitted", // initial status
      upvotes: 1,
      date: "Just now",
      image: imageFileName || "Photo attached"
    };

    // Pass data to parent component (App.jsx) via props
    if (onAddComplaint) {
      onAddComplaint(newComplaint);
    }

    // Save submitted record to display in conditional success view
    setSubmittedData(newComplaint);

    // Toggle submission state to trigger Conditional Rendering
    setIsSubmitted(true);
  };

  // Reset form to submit another complaint
  const handleResetForm = () => {
    setStudentName("");
    setIssueTitle("");
    setCategory("Wi-Fi");
    setLocation("");
    setDescription("");
    setImageFileName("");
    setIsSubmitted(false);
    setErrorMessage("");
    setSubmittedData(null);
  };

  return (
    <div className="report-page container">
      {/* Page Header */}
      <div className="page-header">
        <span className="badge-tag">Student Helpdesk</span>
        <h1 className="page-title">Report a Campus Issue</h1>
        <p className="page-subtitle">
          Submit details about maintenance, facilities, or technical issues across Chitkara University.
        </p>
      </div>

      <div className="form-wrapper">
        {/* CONDITIONAL RENDERING: Display Success Message OR Submission Form */}
        {isSubmitted ? (
          /* Success Screen displayed via Conditional Rendering */
          <div className="success-card">
            <div className="success-icon-circle">✓</div>
            <h2 className="success-title">Complaint submitted successfully!</h2>
            <p className="success-desc">
              Your grievance has been logged into the UniFix portal. The administration has received your ticket and will review it shortly.
            </p>

            {/* Summary of submitted complaint */}
            {submittedData && (
              <div className="submitted-summary">
                <h4 className="summary-heading">Ticket Summary:</h4>
                <div className="summary-row">
                  <span className="summary-label">Ticket ID:</span>
                  <span className="summary-value">#UNIFIX-{submittedData.id.toString().slice(-4)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Student:</span>
                  <span className="summary-value">{submittedData.studentName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Title:</span>
                  <span className="summary-value">{submittedData.title}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Category:</span>
                  <span className="summary-value">{submittedData.category}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Location:</span>
                  <span className="summary-value">{submittedData.location}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Status:</span>
                  <span className="status-badge status-submitted">Submitted</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setActivePage("complaints")}
              >
                View in Complaints Dashboard
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleResetForm}
              >
                + Submit Another Complaint
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Submission Form */
          <form className="report-form" onSubmit={handleSubmit}>
            {/* Validation Alert via Conditional Rendering */}
            {errorMessage && (
              <div className="error-banner">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Student Name */}
            <div className="form-group">
              <label htmlFor="studentName" className="form-label">
                Student Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                id="studentName"
                className="form-input"
                placeholder="e.g. Aarav Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            {/* Issue Title */}
            <div className="form-group">
              <label htmlFor="issueTitle" className="form-label">
                Issue Title <span className="req-star">*</span>
              </label>
              <input
                type="text"
                id="issueTitle"
                className="form-input"
                placeholder="e.g. Wi-Fi router not responding in hostel floor"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
            </div>

            {/* Two-column row: Category and Location */}
            <div className="form-row">
              {/* Category Dropdown */}
              <div className="form-group form-col">
                <label htmlFor="category" className="form-label">
                  Category <span className="req-star">*</span>
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="form-group form-col">
                <label htmlFor="location" className="form-label">
                  Location / Block <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  className="form-input"
                  placeholder="e.g. Galileo Block, Room 302"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Detailed Description <span className="req-star">*</span>
              </label>
              <textarea
                id="description"
                rows="4"
                className="form-textarea"
                placeholder="Provide specific details about what is broken, how long it has been an issue, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="imageUpload" className="form-label">
                Upload Image / Photo <span className="optional-tag">(Optional)</span>
              </label>
              <div className="file-upload-box">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="file-upload-label">
                  <span className="upload-icon">📷</span>
                  <span className="upload-text">
                    {imageFileName ? `Selected: ${imageFileName}` : "Click to select a photo from your device"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-submit">
                Submit Complaint
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportIssue;
