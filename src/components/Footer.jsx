import React from "react";
import "./Footer.css";

function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container footer-content">
        {/* Project Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="footer-logo">UniFix</span>
            <span className="footer-uni">Chitkara University</span>
          </div>
          <p className="footer-tagline">"Report. Track. Resolve."</p>
          <p className="footer-desc">
            A centralized campus issue reporting and maintenance management
            platform built for students, faculty, and administrative staff.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => setActivePage("home")}>Home Page</button></li>
            <li><button onClick={() => setActivePage("report")}>Report Campus Issue</button></li>
            <li><button onClick={() => setActivePage("complaints")}>Complaints Dashboard</button></li>
            <li><button onClick={() => setActivePage("admin")}>Admin Management</button></li>
          </ul>
        </div>

        {/* Campus Support & Contacts */}
        <div className="footer-col team-col">
          <h4 className="footer-heading">Campus Maintenance Units</h4>
          <ul className="team-list">
            <li>
              <span className="member-role">Electrical & AC:</span>
              <span className="member-desc">Galileo Block, Ext. 402</span>
            </li>
            <li>
              <span className="member-role">Hostel Care:</span>
              <span className="member-desc">Hostel Block 3 Office</span>
            </li>
            <li>
              <span className="member-role">IT & Network:</span>
              <span className="member-desc">Turing Center, Room 108</span>
            </li>
            <li>
              <span className="member-role">Sanitation:</span>
              <span className="member-desc">Admin Block, Ground Floor</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2025 UniFix • Chitkara University Campus Operations. All rights reserved.</p>
          <p className="tech-badge">Secure Campus Portal • 24x7 Facility Services</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
