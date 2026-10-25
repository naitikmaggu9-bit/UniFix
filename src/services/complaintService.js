/**
 * Complaint Service Layer
 * Simulates REST CRUD endpoints with persistent Browser LocalStorage.
 * Enables true asynchronous loading states, errors, retry, and optimistic updates.
 * (Syllabus: Lectures 13-18, 49-54, 67-72)
 */

import { initialComplaints } from "../data/sampleComplaints";

const STORAGE_KEY = "unifix_complaints_v2";
const ACTIVITY_LOG_KEY = "unifix_activity_log_v2";

// Helper delay to demonstrate asynchronous loading & spinners
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialize storage with default data if empty
 */
function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialComplaints));
      return initialComplaints;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialComplaints;
  } catch (err) {
    console.error("Error reading localStorage complaints:", err);
    return initialComplaints;
  }
}

function saveComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error("Error writing complaints to localStorage:", err);
  }
}

/**
 * Retrieve Audit Activity Log
 */
export function getStoredActivityLog() {
  try {
    const raw = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!raw) {
      const defaultLog = [
        { id: 1, action: "STATUS_UPDATE", text: "Water pipe leakage moved to In Progress", time: "23 Feb, 04:00 PM", actor: "Estate Care Officer" },
        { id: 2, action: "ASSIGNMENT", text: "Wi-Fi issue assigned to IT Support NOC", time: "24 Feb, 01:15 PM", actor: "Admin Desk" },
        { id: 3, action: "RESOLVED", text: "Library water dispenser resolved", time: "20 Feb, 03:45 PM", actor: "Library Caretaker" }
      ];
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(defaultLog));
      return defaultLog;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logActivity(action, text, actor = "Administrator") {
  try {
    const logs = getStoredActivityLog();
    const newEntry = {
      id: Date.now(),
      action,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      actor
    };
    const updated = [newEntry, ...logs.slice(0, 19)]; // Keep latest 20
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error logging activity:", err);
    return [];
  }
}

export const complaintService = {
  /**
   * Fetch all complaints (GET /api/complaints)
   */
  async getAll() {
    await delay(100);
    return getStoredComplaints();
  },

  /**
   * Fetch single complaint by ID (GET /api/complaints/:id)
   */
  async getById(id) {
    await delay(80);
    const complaints = getStoredComplaints();
    const found = complaints.find((c) => String(c.id) === String(id));
    if (!found) {
      throw new Error(`Complaint #${id} not found.`);
    }
    return found;
  },

  /**
   * Create new complaint (POST /api/complaints)
   */
  async create(complaintData) {
    await delay(150);
    const complaints = getStoredComplaints();
    const newId = Date.now();
    const nowStr = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newRecord = {
      id: newId,
      studentName: complaintData.studentName.trim(),
      studentEmail: complaintData.studentEmail || "student@chitkara.edu.in",
      title: complaintData.title.trim(),
      category: complaintData.category,
      location: complaintData.location.trim(),
      priority: complaintData.priority || "Medium",
      department: complaintData.department || "General Maintenance",
      description: complaintData.description.trim(),
      status: "Pending",
      upvotes: 1,
      upvotedBy: [complaintData.studentEmail || "student@chitkara.edu.in"],
      date: nowStr,
      image: complaintData.image || null,
      timeline: [
        {
          status: "Pending",
          timestamp: nowStr,
          note: "Issue lodged into UniFix campus portal.",
          actor: complaintData.studentName.trim()
        }
      ]
    };

    const updated = [newRecord, ...complaints];
    saveComplaints(updated);
    logActivity("CREATE", `New complaint lodged: "${newRecord.title}"`, newRecord.studentName);
    return newRecord;
  },

  /**
   * Update complaint status (PATCH /api/complaints/:id/status)
   */
  async updateStatus(id, newStatus, actor = "Campus Administrator", note = "") {
    await delay(120);
    const complaints = getStoredComplaints();
    const nowStr = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    let modifiedItem = null;

    const updated = complaints.map((item) => {
      if (String(item.id) === String(id)) {
        const timeline = Array.isArray(item.timeline) ? [...item.timeline] : [];
        timeline.push({
          status: newStatus,
          timestamp: nowStr,
          note: note || `Status updated to ${newStatus}`,
          actor
        });

        modifiedItem = {
          ...item,
          status: newStatus,
          timeline
        };
        return modifiedItem;
      }
      return item;
    });

    if (!modifiedItem) {
      throw new Error(`Complaint #${id} not found.`);
    }

    saveComplaints(updated);
    logActivity("STATUS_UPDATE", `Complaint #${id} status changed to ${newStatus}`, actor);
    return modifiedItem;
  },

  /**
   * Assign department (PATCH /api/complaints/:id/department)
   */
  async assignDepartment(id, department, actor = "Campus Administrator") {
    await delay(100);
    const complaints = getStoredComplaints();
    let modifiedItem = null;

    const updated = complaints.map((item) => {
      if (String(item.id) === String(id)) {
        modifiedItem = { ...item, department };
        return modifiedItem;
      }
      return item;
    });

    if (!modifiedItem) {
      throw new Error(`Complaint #${id} not found.`);
    }

    saveComplaints(updated);
    logActivity("ASSIGNMENT", `Complaint #${id} routed to ${department}`, actor);
    return modifiedItem;
  },

  /**
   * Toggle Upvote (POST /api/complaints/:id/upvote)
   */
  async toggleUpvote(id, userEmail = "student@chitkara.edu.in") {
    const complaints = getStoredComplaints();
    let targetComplaint = null;

    const updated = complaints.map((item) => {
      if (String(item.id) === String(id)) {
        const upvotedBy = Array.isArray(item.upvotedBy) ? [...item.upvotedBy] : [];
        const hasVoted = upvotedBy.includes(userEmail);
        let newUpvotes = item.upvotes || 0;
        let newUpvotedBy;

        if (hasVoted) {
          newUpvotes = Math.max(0, newUpvotes - 1);
          newUpvotedBy = upvotedBy.filter((e) => e !== userEmail);
        } else {
          newUpvotes += 1;
          newUpvotedBy = [...upvotedBy, userEmail];
        }

        targetComplaint = {
          ...item,
          upvotes: newUpvotes,
          upvotedBy: newUpvotedBy
        };
        return targetComplaint;
      }
      return item;
    });

    if (!targetComplaint) {
      throw new Error(`Complaint #${id} not found.`);
    }

    saveComplaints(updated);
    return targetComplaint;
  },

  /**
   * Delete complaint (DELETE /api/complaints/:id)
   */
  async delete(id, actor = "Campus Administrator") {
    await delay(150);
    const complaints = getStoredComplaints();
    const exists = complaints.some((c) => String(c.id) === String(id));
    if (!exists) {
      throw new Error(`Complaint #${id} not found.`);
    }
    const updated = complaints.filter((c) => String(c.id) !== String(id));
    saveComplaints(updated);
    logActivity("DELETE", `Complaint #${id} deleted from portal`, actor);
    return { success: true, id };
  },

  /**
   * Reset data to default initialComplaints
   */
  async resetToDefault() {
    await delay(150);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialComplaints));
    localStorage.removeItem(ACTIVITY_LOG_KEY);
    return initialComplaints;
  }
};
