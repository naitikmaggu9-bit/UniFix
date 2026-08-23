import React from "react";
import "./Navbar.css";

function Navbar({ activePage, setActivePage }) {
  return (
    <header className="navbar-wrapper">
      {/* Top University Context Bar */}
      <div className="top-uni-bar">
        <div className="container top-uni-content">
          <span className="uni-tag">🏛️ Chitkara University • Campus Facilities & Maintenance Portal</span>
          <span className="eval-tag">📞 24x7 Helpdesk: 1800-267-1999</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar container">
        {/* Logo & Brand */}
        <div 
          className="navbar-brand" 
          onClick={() => setActivePage("home")}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">UniFix</span>
            <span className="brand-sub">Chitkara University</span>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${activePage === "home" ? "active" : ""}`}
              onClick={() => setActivePage("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activePage === "report" ? "active" : ""}`}
              onClick={() => setActivePage("report")}
            >
              Report Issue
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activePage === "complaints" ? "active" : ""}`}
              onClick={() => setActivePage("complaints")}
            >
              Complaints
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activePage === "admin" ? "active" : ""}`}
              onClick={() => setActivePage("admin")}
            >
              Admin Dashboard
            </button>
          </li>
        </ul>

        {/* Quick Action Button */}
        <div className="nav-cta">
          <button 
            className="btn btn-primary nav-action-btn"
            onClick={() => setActivePage("report")}
          >
            <span>+ Report Issue</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
