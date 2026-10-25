import React, { useState, useEffect } from "react";
import { useComplaints } from "../context/ComplaintContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/common/ConfirmDialog";

/**
 * Settings Page Component
 * Demonstrates: Theme mode toggling (Dark/Light), layout density configuration,
 * notification preferences, and persistent localStorage state management.
 * (Syllabus: Lectures 43-48, Lectures 49-54)
 */
export function Settings() {
  const { resetData } = useComplaints();
  const { showToast } = useToast();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("unifix_theme") || "light";
  });

  const [density, setDensity] = useState(() => {
    return localStorage.getItem("unifix_density") || "comfortable";
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Apply theme to DOM
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("unifix_theme", theme);
  }, [theme]);

  // Apply density
  useEffect(() => {
    if (density === "compact") {
      document.documentElement.setAttribute("data-density", "compact");
    } else {
      document.documentElement.removeAttribute("data-density");
    }
    localStorage.setItem("unifix_density", density);
  }, [density]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    showToast({
      type: "info",
      title: "Theme Updated",
      message: `Interface switched to ${newTheme} mode.`
    });
  };

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    showToast({
      type: "info",
      title: "Display Density",
      message: `Layout adjusted to ${newDensity} spacing.`
    });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "36px", paddingBottom: "60px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px" }}>
        <span className="badge-tag">Preferences</span>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Platform Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Customize your UniFix appearance, interface density, notifications, and local development data.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* 1. Theme Configuration */}
        <section
          style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
            Visual Appearance
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Choose between daylight high-contrast palette or nighttime dark theme.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={`btn ${theme === "light" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleThemeChange("light")}
            >
              ☀️ Clean Light Theme
            </button>
            <button
              type="button"
              className={`btn ${theme === "dark" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleThemeChange("dark")}
            >
              🌙 Night Dark Mode
            </button>
          </div>
        </section>

        {/* 2. Display Density */}
        <section
          style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
            Display Density
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Adjust the padding and spacing of cards, tables, and lists.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={`btn ${density === "comfortable" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleDensityChange("comfortable")}
            >
              🛋️ Comfortable Spacing
            </button>
            <button
              type="button"
              className={`btn ${density === "compact" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => handleDensityChange("compact")}
            >
              📏 Compact Density
            </button>
          </div>
        </section>

        {/* 3. Notifications */}
        <section
          style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "4px", color: "var(--text-main)" }}>
                In-App Action Notifications
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
                Display confirmation toasts when status updates, upvotes, or assignments occur.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </div>
        </section>

        {/* 4. Local Demonstration Storage Reset */}
        <section
          style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            border: "1px solid #fecaca",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "#dc2626" }}>
            Reset Demonstration Data
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Restore the initial Chitkara University sample complaints dataset and purge local edits from localStorage.
          </p>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setIsResetDialogOpen(true)}
          >
            🔄 Reset Portal to Default Sample Data
          </button>
        </section>
      </div>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={() => {
          resetData();
          showToast({
            type: "success",
            title: "Reset Complete",
            message: "Demonstration dataset has been restored to factory state."
          });
        }}
        title="Reset All Campus Data?"
        message="This will reset all complaints back to the default sample list and clear your audit history."
        confirmLabel="Yes, Reset Data"
        isDanger={true}
      />
    </div>
  );
}

export default Settings;
