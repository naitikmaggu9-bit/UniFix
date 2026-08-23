import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Complaints from "./pages/Complaints";
import AdminDashboard from "./pages/AdminDashboard";
import { initialComplaints } from "./data/sampleComplaints";

// Main App Component
function App() {
  // Active page state: 'home' | 'report' | 'complaints' | 'admin'
  const [activePage, setActivePage] = useState("home");

  // Manage complaints array across pages
  const [complaints, setComplaints] = useState(initialComplaints);

  // Handler to add a new complaint
  const handleAddComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  // Handler to update complaint status
  const handleUpdateStatus = (id, newStatus) => {
    const updated = complaints.map((complaint) => {
      if (complaint.id === id) {
        return { ...complaint, status: newStatus };
      }
      return complaint;
    });
    setComplaints(updated);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === "home" && (
          <Home setActivePage={setActivePage} />
        )}

        {activePage === "report" && (
          <ReportIssue 
            onAddComplaint={handleAddComplaint} 
            setActivePage={setActivePage} 
          />
        )}

        {activePage === "complaints" && (
          <Complaints 
            complaints={complaints} 
            setActivePage={setActivePage} 
          />
        )}

        {activePage === "admin" && (
          <AdminDashboard 
            complaints={complaints} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}
      </main>

      {/* Footer Component */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default App;
