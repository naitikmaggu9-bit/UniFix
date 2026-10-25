import React from "react";
import { Link } from "react-router-dom";

/**
 * About Page Component
 * Demonstrates: Institutional background, syllabus topic demonstration summary,
 * campus maintenance workflow architecture.
 * (Syllabus: Lectures 1-6 & Lectures 43-48)
 */
export function About() {
  const syllabusHighlights = [
    { module: "Lectures 1-6", topic: "HTML5 & CSS3 Design System", desc: "Semantic tags, CSS variables, glassmorphism, responsive flex/grid layouts, mobile-first breakpoints." },
    { module: "Lectures 7-18", topic: "JavaScript & Async ES6+", desc: "Arrow functions, destructuring, Promises, async/await, centralized REST API client, LocalStorage sync." },
    { module: "Lectures 19-30", topic: "React Fundamentals & JSX", desc: "Component architecture, props, list rendering, conditional badges, event handling, controlled components." },
    { module: "Lectures 31-36", topic: "Advanced React Hooks", desc: "useState, useEffect, useRef (input focus), useMemo (derived stats), useCallback, and custom hooks (useDebounce, useLocalStorage, useFetch)." },
    { module: "Lectures 37-48", topic: "Routing & Multi-Page SPA", desc: "React Router with dynamic routes (/complaints/:id), protected routes, breadcrumbs, 404 handling, active NavLinks." },
    { module: "Lectures 49-54", topic: "Context API State Architecture", desc: "ComplaintProvider, AuthProvider, ToastProvider for zero prop-drilling and seamless multi-page consistency." },
    { module: "Lectures 55-66", topic: "Forms, Validation & Interactive UI", desc: "Multi-step reporting wizard, accessible modals, tabs, dropdowns, toast notification queue, confirm dialogs." },
    { module: "Lectures 67-72", topic: "Consuming REST APIs & CRUD", desc: "Full CRUD workflow, simulation of network latency, debounced search, pagination, and live Open-Meteo Campus Weather & Facility Advisory REST API." }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <span className="badge-tag">Academic Project Evaluation II</span>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "8px" }}>
          About UniFix 2.0
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "640px", margin: "0 auto" }}>
          A campus technology operating platform built for Chitkara University Front End Engineering-II.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}
      >
        <div style={{ background: "var(--bg-surface)", padding: "28px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>
            🎯 The Problem
          </h2>
          <p style={{ color: "var(--text-body)", lineHeight: 1.6, fontSize: "0.95rem" }}>
            Campus maintenance grievances—such as flickering classroom lights, broken hostel Wi-Fi routers, or water cooler leaks—are traditionally reported through informal word-of-mouth or manual registers, leading to lost tickets and zero student transparency.
          </p>
        </div>

        <div style={{ background: "var(--bg-surface)", padding: "28px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "10px" }}>
            💡 The Solution: UniFix 2.0
          </h2>
          <p style={{ color: "var(--text-body)", lineHeight: 1.6, fontSize: "0.95rem" }}>
            UniFix creates a unified digital ecosystem where students log verified issues with evidence, track chronological progress in real time, upvote shared problems, and university administrators dispatch specialized maintenance units with clear audit accountability.
          </p>
        </div>
      </div>

      {/* Syllabus Coverage Showcase */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "36px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "40px"
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Full Course Syllabus Coverage (Lectures 1–72)
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "24px" }}>
          Every major topic from the Chitkara University Front End Engineering-II syllabus is genuinely implemented and demonstrated in the codebase.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {syllabusHighlights.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-subtle)",
                padding: "18px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <span className="badge-tag" style={{ margin: 0, alignSelf: "flex-start", fontSize: "0.72rem" }}>
                {s.module}
              </span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)" }}>
                {s.topic}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-body)", lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Call to Action */}
      <div style={{ textAlign: "center" }}>
        <Link to="/complaints" className="btn btn-primary btn-lg" style={{ marginRight: "12px" }}>
          Explore Live Complaints Feed →
        </Link>
        <Link to="/admin" className="btn btn-secondary btn-lg">
          Open Admin Portal
        </Link>
      </div>
    </div>
  );
}

export default About;
