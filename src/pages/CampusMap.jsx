import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import { campusWeatherService } from "../services/campusWeatherService";
import Modal from "../components/common/Modal";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import SkeletonLoader from "../components/common/SkeletonLoader";
import "./CampusMap.css";

/**
 * Campus Facilities & Live Health Inspector Component
 * Integrates: Open-Meteo REST API (Live Weather & Facility Hazard Advisory),
 * interactive campus building block inspection, live complaint matching by zone.
 * (Syllabus: Lectures 43-48 & Lectures 67-72)
 */
export function CampusMap() {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const fetchWeather = async (signal) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await campusWeatherService.getLiveCampusAdvisory(signal);
      setWeather(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setWeatherError("Weather telemetry temporarily unavailable.");
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchWeather(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  // 8 Defined Campus Building Blocks & Zones
  const campusBlocks = [
    {
      id: "galileo",
      name: "Galileo Block",
      type: "Academic & Lecture Theaters",
      icon: "🏛️",
      features: "Classrooms 101–404, AV Projectors, Ceiling Fans, Smart Podiums",
      supervisor: "Er. Ramesh Verma (Ext. 402)",
      department: "Electrical Maintenance"
    },
    {
      id: "newton",
      name: "Newton Block A",
      type: "Sciences & Faculty Offices",
      icon: "🔬",
      features: "Physics Labs, RO Water Stations, Corridor Restrooms, Ground Floor Lobby",
      supervisor: "Mr. Satish Kumar (Ext. 210)",
      department: "Plumbing & Sanitation"
    },
    {
      id: "turing",
      name: "Turing Center",
      type: "Computing & IT Backbone",
      icon: "💻",
      features: "High-Density Computer Labs, Optical Fiber NOC, Campus Wi-Fi Gateways",
      supervisor: "Er. Manpreet Singh (Ext. 108)",
      department: "IT Support"
    },
    {
      id: "tesla",
      name: "Tesla Block",
      type: "Engineering & Workshops",
      icon: "⚙️",
      features: "Mechanical Workshops, Robotics Lab, Desk Chairs, Safety Junctions",
      supervisor: "Mr. Balwinder (Ext. 305)",
      department: "General Maintenance"
    },
    {
      id: "edison",
      name: "Edison Block",
      type: "Electrical & HVAC Grid",
      icon: "⚡",
      features: "Campus Substation, Split AC Chillers, Backup DG Sets, Electronics Labs",
      supervisor: "Er. Gurdeep (Ext. 512)",
      department: "Electrical Maintenance"
    },
    {
      id: "library",
      name: "Central Library",
      type: "Research & Study Halls",
      icon: "📚",
      features: "2nd Floor Reading Rooms, Digital Archive, Water Coolers, Silent Zones",
      supervisor: "Dr. Anupama (Ext. 115)",
      department: "General Maintenance"
    },
    {
      id: "hostel3",
      name: "Hostel Block 3",
      type: "Student Residence",
      icon: "🏢",
      features: "Resident Rooms, Wi-Fi Access Points, Corridor Lighting, Dining Mess",
      supervisor: "Hostel Warden Office (Ext. 312)",
      department: "Hostel Facilities"
    },
    {
      id: "pathway",
      name: "Pathway & Food Court",
      type: "Campus Common Grounds",
      icon: "🌳",
      features: "LED Streetlamp Poles, Student Dining Plaza, Dustbins, Walkway Safety",
      supervisor: "Campus Estate Desk (Ext. 100)",
      department: "Plumbing & Sanitation"
    }
  ];

  // Helper to retrieve complaints associated with a specific block
  const getBlockComplaints = (blockName) => {
    const key = blockName.toLowerCase().split(" ")[0];
    return complaints.filter((c) =>
      c.location.toLowerCase().includes(key) ||
      (blockName.includes("Hostel") && c.location.toLowerCase().includes("hostel")) ||
      (blockName.includes("Library") && c.location.toLowerCase().includes("library")) ||
      (blockName.includes("Pathway") && c.location.toLowerCase().includes("pathway"))
    );
  };

  return (
    <div className="campus-facilities-page container animate-fade-in">
      {/* 1. Live Weather & Campus Hazard Advisory Banner (Third-Party REST API) */}
      <section className="advisory-hero-card">
        <div className="advisory-top-row">
          <div className="advisory-title-box">
            <span style={{ fontSize: "2rem" }}>🛰️</span>
            <div>
              <div style={{ fontSize: "0.82rem", textTransform: "uppercase", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.5px" }}>
                Chitkara University Campus Telemetry • Rajpura, Punjab
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "2px 0 0 0", color: "#ffffff" }}>
                Live Facilities & Weather Hazard Advisory
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {weather && (
              <span className="weather-condition-badge">
                <span>{weather.conditionIcon}</span>
                <span>{weather.conditionText}</span>
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
              onClick={() => fetchWeather()}
              title="Refresh telemetry"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {weatherLoading ? (
          <div style={{ padding: "20px 0" }}>
            <SkeletonLoader count={4} />
          </div>
        ) : weather ? (
          <>
            <div className="advisory-metrics-row">
              <div className="advisory-metric-chip">
                <span className="metric-chip-val">{weather.temperature}°C</span>
                <span className="metric-chip-lbl">Campus Temperature</span>
              </div>
              <div className="advisory-metric-chip">
                <span className="metric-chip-val">{weather.humidity}%</span>
                <span className="metric-chip-lbl">Relative Humidity</span>
              </div>
              <div className="advisory-metric-chip">
                <span className="metric-chip-val">{weather.windSpeed} km/h</span>
                <span className="metric-chip-lbl">Surface Wind Speed</span>
              </div>
              <div className="advisory-metric-chip">
                <span className="metric-chip-val">{weather.precipitation} mm</span>
                <span className="metric-chip-lbl">Precipitation Level</span>
              </div>
            </div>

            <div className="advisory-notice-box">
              <span style={{ fontSize: "1.6rem" }}>⚡</span>
              <div>
                <strong>Automated Facility Hazard Assessment:</strong> {weather.facilityAdvisory}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: "#fca5a5" }}>⚠️ {weatherError || "Unable to reach telemetry service."}</div>
        )}
      </section>

      {/* 2. Interactive Campus Building Block Explorer */}
      <section>
        <div className="blocks-section-header">
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "4px" }}>
              Interactive Campus Facility Inspector
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Click any campus block to inspect its active grievance count, maintenance lead, and open tickets.
            </p>
          </div>
          <Link to="/report" className="btn btn-primary">
            + Report Issue for Block
          </Link>
        </div>

        <div className="campus-blocks-grid">
          {campusBlocks.map((block) => {
            const blockTickets = getBlockComplaints(block.name);
            const activeTickets = blockTickets.filter((t) => t.status !== "Resolved");
            const healthScore = Math.max(70, 100 - activeTickets.length * 10);
            const isGood = activeTickets.length <= 1;

            return (
              <div
                key={block.id}
                className="block-card"
                onClick={() => setSelectedBlock({ ...block, tickets: blockTickets, activeCount: activeTickets.length, healthScore })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedBlock({ ...block, tickets: blockTickets, activeCount: activeTickets.length, healthScore });
                }}
              >
                <div>
                  <div className="block-card-header">
                    <div className="block-icon-bubble">{block.icon}</div>
                    <span className={`health-badge ${isGood ? "health-good" : "health-warning"}`}>
                      {healthScore}% Operational
                    </span>
                  </div>

                  <h3 className="block-name">{block.name}</h3>
                  <div className="block-type">{block.type}</div>
                  <p className="block-features-list">{block.features}</p>
                </div>

                <div className="block-footer">
                  <span className="block-tickets-count">
                    {activeTickets.length > 0 ? `⚠️ ${activeTickets.length} Active Issue(s)` : "✓ All Systems Normal"}
                  </span>
                  <span className="block-inspect-link">
                    Inspect Block →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Block Inspector Modal */}
      {selectedBlock && (
        <Modal
          isOpen={Boolean(selectedBlock)}
          onClose={() => setSelectedBlock(null)}
          title={`Campus Zone: ${selectedBlock.name}`}
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const key = selectedBlock.name.split(" ")[0];
                  setSelectedBlock(null);
                  navigate(`/complaints?search=${encodeURIComponent(key)}`);
                }}
              >
                View in Complaints Feed
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedBlock(null);
                  navigate("/report");
                }}
              >
                + Log Grievance for {selectedBlock.name}
              </button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Meta bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                background: "var(--bg-subtle)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                fontSize: "0.88rem"
              }}
            >
              <div><strong>Category:</strong> {selectedBlock.type}</div>
              <div><strong>Facility Lead:</strong> {selectedBlock.supervisor}</div>
              <div><strong>Primary Unit:</strong> {selectedBlock.department}</div>
              <div><strong>Health Rating:</strong> {selectedBlock.healthScore}% Operational</div>
            </div>

            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                Key Infrastructure in this Block:
              </h4>
              <p style={{ fontSize: "0.92rem", color: "var(--text-body)", lineHeight: 1.5 }}>
                {selectedBlock.features}
              </p>
            </div>

            {/* List of active complaints in this block */}
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
                Grievances Logged for {selectedBlock.name} ({selectedBlock.tickets.length}):
              </h4>

              {selectedBlock.tickets.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {selectedBlock.tickets.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: "12px 14px",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)" }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          📍 {t.location} • 👍 {t.upvotes || 0} upvotes
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                        <Link
                          to={`/complaints/${t.id}`}
                          className="btn-card-action"
                          onClick={() => setSelectedBlock(null)}
                        >
                          Track →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-muted)" }}>
                  ✓ No open complaints currently registered for {selectedBlock.name}.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CampusMap;
