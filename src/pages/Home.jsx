import React from "react";
import "./Home.css";

// Page 1: Home Page (Team Member 1)
// Demonstrates: Components, Props (setActivePage), Layout, Array Mapping for Feature Cards and Workflow Steps
function Home({ setActivePage }) {
  // Feature cards data array
  const features = [
    {
      id: 1,
      icon: "📝",
      title: "1. Report Issues",
      description: "Easily submit campus problems like Wi-Fi, electricity, cleanliness, or broken furniture in just a few clicks."
    },
    {
      id: 2,
      icon: "🔍",
      title: "2. Track Complaints",
      description: "Monitor real-time status updates as campus staff reviews and works on resolving your reported issues."
    },
    {
      id: 3,
      icon: "👍",
      title: "3. Upvote Issues",
      description: "Upvote common or severe campus problems so the administration can prioritize what matters most."
    },
    {
      id: 4,
      icon: "⚡",
      title: "4. Faster Resolution",
      description: "Direct routing to university maintenance departments ensures timely action and transparent campus care."
    }
  ];

  // How UniFix Works 4-step workflow array
  const steps = [
    {
      stepNumber: "01",
      title: "Report Issue",
      desc: "Student submits issue details, category, location, and photo.",
      badgeColor: "step-1"
    },
    {
      stepNumber: "02",
      title: "Review",
      desc: "Administration reviews the issue and assigns maintenance staff.",
      badgeColor: "step-2"
    },
    {
      stepNumber: "03",
      title: "Work in Progress",
      desc: "Ground staff inspects and carries out the necessary repair work.",
      badgeColor: "step-3"
    },
    {
      stepNumber: "04",
      title: "Resolved",
      desc: "Issue is marked resolved and closed with status confirmation.",
      badgeColor: "step-4"
    }
  ];

  // Campus issue categories for quick visual display
  const campusCategories = [
    { name: "Wi-Fi & Internet", icon: "📶" },
    { name: "Electricity & Lights", icon: "⚡" },
    { name: "Water Leakage", icon: "🚰" },
    { name: "Cleanliness & Sanitation", icon: "🧹" },
    { name: "Hostel Maintenance", icon: "🏢" },
    { name: "Furniture & Classrooms", icon: "🔧" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Chitkara University Student Portal
          </div>
          
          <h1 className="hero-title">UniFix</h1>
          <p className="hero-tagline">"Report. Track. Resolve."</p>
          
          <p className="hero-description">
            UniFix helps students report campus problems and allows the
            administration to track and resolve them efficiently.
          </p>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setActivePage("report")}
            >
              <span>📢 Report an Issue</span>
            </button>
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => setActivePage("complaints")}
            >
              <span>📋 View Complaints</span>
            </button>
          </div>

          {/* Campus performance stats teaser */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="stat-num">1,450+</span>
              <span className="stat-label">Issues Resolved</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-num">&lt; 24h</span>
              <span className="stat-label">Average Response</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Campus Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">
            A comprehensive campus maintenance platform designed for rapid response and student satisfaction.
          </p>

          <div className="features-grid">
            {/* Demonstrating array and map() */}
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How UniFix Works Section */}
      <section className="workflow-section">
        <div className="container">
          <h2 className="section-title">How UniFix Works</h2>
          <p className="section-subtitle">
            A transparent 4-stage lifecycle from complaint submission to resolution.
          </p>

          {/* Step Progression Diagram */}
          <div className="workflow-grid">
            {steps.map((step, index) => (
              <div key={index} className="workflow-card">
                <div className={`step-badge ${step.badgeColor}`}>
                  {step.stepNumber}
                </div>
                <h4 className="workflow-step-title">{step.title}</h4>
                <p className="workflow-step-desc">{step.desc}</p>
                {index < steps.length - 1 && (
                  <div className="workflow-connector">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Simplified Flow Diagram Banner */}
          <div className="flow-banner">
            <span className="flow-pill">Report Issue</span>
            <span className="flow-arrow">➔</span>
            <span className="flow-pill">Review</span>
            <span className="flow-arrow">➔</span>
            <span className="flow-pill">Work in Progress</span>
            <span className="flow-arrow">➔</span>
            <span className="flow-pill flow-resolved">Resolved</span>
          </div>
        </div>
      </section>

      {/* Common Issue Categories Banner */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Campus Issue Categories</h2>
          <p className="section-subtitle">
            Students can report grievances across all university facilities.
          </p>

          <div className="categories-grid">
            {campusCategories.map((cat, idx) => (
              <div key={idx} className="category-tile" onClick={() => setActivePage("report")}>
                <span className="cat-tile-icon">{cat.icon}</span>
                <span className="cat-tile-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Box */}
      <section className="cta-section container">
        <div className="cta-box">
          <div className="cta-content">
            <h3 className="cta-title">Notice a problem on campus?</h3>
            <p className="cta-desc">
              Help us maintain a clean, safe, and efficient Chitkara University campus by lodging your issue today.
            </p>
          </div>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => setActivePage("report")}
          >
            Submit Complaint Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
