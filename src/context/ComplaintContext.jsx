import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { complaintService, getStoredActivityLog } from "../services/complaintService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const ComplaintContext = createContext(null);

/**
 * ComplaintProvider Component
 * Core state management for all campus complaints and administrative operations.
 * Demonstrates: Context API, useState, useEffect, useMemo, useCallback, service layer integration
 * (Syllabus: Lectures 49-54 & Lectures 31-36)
 */
export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Load complaints & activity log from service
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintService.getAll();
      setComplaints(data);
      const logs = getStoredActivityLog();
      setActivityLog(logs);
    } catch (err) {
      setError(err.message || "Failed to load campus complaints.");
      showToast({ type: "error", title: "Error", message: "Failed to load complaint data." });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create new complaint
  const addComplaint = useCallback(
    async (formData) => {
      try {
        const payload = {
          ...formData,
          studentName: formData.studentName || currentUser.name,
          studentEmail: formData.studentEmail || currentUser.email
        };
        const newRecord = await complaintService.create(payload);
        setComplaints((prev) => [newRecord, ...prev]);
        setActivityLog(getStoredActivityLog());

        showToast({
          type: "success",
          title: "Ticket Lodged Successfully",
          message: `Complaint #${String(newRecord.id).slice(-4)} has been registered.`
        });
        return newRecord;
      } catch (err) {
        showToast({
          type: "error",
          title: "Submission Failed",
          message: err.message || "Could not submit your complaint."
        });
        throw err;
      }
    },
    [currentUser, showToast]
  );

  // Update complaint status
  const updateStatus = useCallback(
    async (id, newStatus, note = "") => {
      try {
        const updated = await complaintService.updateStatus(
          id,
          newStatus,
          currentUser.name,
          note
        );
        setComplaints((prev) =>
          prev.map((c) => (String(c.id) === String(id) ? updated : c))
        );
        setActivityLog(getStoredActivityLog());

        showToast({
          type: "success",
          title: "Status Updated",
          message: `Ticket #${String(id).slice(-4)} is now ${newStatus}.`
        });
        return updated;
      } catch (err) {
        showToast({
          type: "error",
          title: "Update Failed",
          message: err.message
        });
        throw err;
      }
    },
    [currentUser, showToast]
  );

  // Assign department
  const assignDepartment = useCallback(
    async (id, department) => {
      try {
        const updated = await complaintService.assignDepartment(
          id,
          department,
          currentUser.name
        );
        setComplaints((prev) =>
          prev.map((c) => (String(c.id) === String(id) ? updated : c))
        );
        setActivityLog(getStoredActivityLog());

        showToast({
          type: "info",
          title: "Department Assigned",
          message: `Ticket routed to ${department}.`
        });
        return updated;
      } catch (err) {
        showToast({ type: "error", title: "Error", message: err.message });
        throw err;
      }
    },
    [currentUser, showToast]
  );

  // Toggle upvote
  const toggleUpvote = useCallback(
    async (id) => {
      const userEmail = currentUser?.email || "student@chitkara.edu.in";
      try {
        const updated = await complaintService.toggleUpvote(id, userEmail);
        setComplaints((prev) =>
          prev.map((c) => (String(c.id) === String(id) ? updated : c))
        );
        const hasVoted = updated.upvotedBy?.includes(userEmail);
        showToast({
          type: hasVoted ? "success" : "info",
          title: hasVoted ? "Upvoted" : "Upvote Removed",
          message: hasVoted
            ? "Your upvote was counted for this campus issue."
            : "You removed your upvote."
        });
        return updated;
      } catch (err) {
        showToast({ type: "error", title: "Error", message: err.message });
      }
    },
    [currentUser, showToast]
  );

  // Delete complaint
  const deleteComplaint = useCallback(
    async (id) => {
      try {
        await complaintService.delete(id, currentUser.name);
        setComplaints((prev) => prev.filter((c) => String(c.id) !== String(id)));
        setActivityLog(getStoredActivityLog());

        showToast({
          type: "info",
          title: "Complaint Deleted",
          message: `Complaint #${String(id).slice(-4)} has been removed.`
        });
      } catch (err) {
        showToast({ type: "error", title: "Delete Failed", message: err.message });
        throw err;
      }
    },
    [currentUser, showToast]
  );

  // Reset to default sample data
  const resetData = useCallback(async () => {
    try {
      const resetList = await complaintService.resetToDefault();
      setComplaints(resetList);
      setActivityLog(getStoredActivityLog());
      showToast({
        type: "success",
        title: "Demo Reset",
        message: "Complaints have been reset to default campus dataset."
      });
    } catch (err) {
      showToast({ type: "error", title: "Reset Error", message: err.message });
    }
  }, [showToast]);

  // Derived Performance Metrics using useMemo
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(
      (c) => c.status === "Pending" || c.status === "Submitted"
    ).length;
    const underReview = complaints.filter((c) => c.status === "Under Review").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const highPriority = complaints.filter((c) => c.priority === "High").length;
    const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Department Distribution
    const deptMap = {};
    complaints.forEach((c) => {
      const dept = c.department || "General Maintenance";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(deptMap).map(([dept, count]) => ({
      dept,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    // Category Distribution
    const catMap = {};
    complaints.forEach((c) => {
      const cat = c.category || "General";
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({
      category,
      count
    }));

    return {
      total,
      pending,
      underReview,
      inProgress,
      resolved,
      highPriority,
      totalUpvotes,
      resolutionRate,
      departmentBreakdown,
      categoryBreakdown
    };
  }, [complaints]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        error,
        activityLog,
        stats,
        refreshComplaints: loadData,
        addComplaint,
        updateStatus,
        assignDepartment,
        deleteComplaint,
        toggleUpvote,
        resetData
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
}

export default ComplaintContext;
