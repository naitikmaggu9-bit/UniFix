import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "unifix_auth_user_v2";

const DEFAULT_STUDENT = {
  id: "std-001",
  name: "Aarav Sharma",
  email: "aarav.sharma@chitkara.edu.in",
  rollNo: "2310990001",
  department: "Computer Science & Engineering",
  semester: "4th Semester",
  hostel: "Hostel Block 3, Room 214",
  role: "student",
  joined: "Aug 2023",
  avatar: "👨‍🎓"
};

const DEFAULT_ADMIN = {
  id: "adm-001",
  name: "Dr. Sandeep Chauhan",
  email: "admin@chitkara.edu.in",
  rollNo: "FAC-8891",
  department: "Campus Facilities & Operations",
  role: "admin",
  joined: "Jan 2019",
  avatar: "🏛️"
};

/**
 * AuthProvider Component
 * Handles demonstration authentication, roles, profile persistence
 * Demonstrates: Context API, localStorage synchronization, role-based state
 * (Syllabus: Lectures 49-54 & Lectures 37-42)
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (err) {
      console.warn("Could not save auth session:", err);
    }
  }, [currentUser]);

  // Demo Login
  const login = (email, role = "student") => {
    if (role === "admin" || email.toLowerCase().includes("admin")) {
      setCurrentUser(DEFAULT_ADMIN);
      return { success: true, role: "admin" };
    } else {
      const studentUser = {
        ...DEFAULT_STUDENT,
        email: email || DEFAULT_STUDENT.email
      };
      setCurrentUser(studentUser);
      return { success: true, role: "student" };
    }
  };

  // Demo Registration
  const register = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || "Chitkara Student",
      email: userData.email || "student@chitkara.edu.in",
      rollNo: userData.rollNo || "2310999999",
      department: userData.department || "Engineering",
      hostel: userData.hostel || "Day Scholar",
      role: userData.role || "student",
      joined: "Today",
      avatar: userData.role === "admin" ? "🏛️" : "👨‍🎓"
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(DEFAULT_STUDENT);
  };

  const switchRole = () => {
    if (currentUser.role === "admin") {
      setCurrentUser(DEFAULT_STUDENT);
    } else {
      setCurrentUser(DEFAULT_ADMIN);
    }
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const isAdmin = currentUser?.role === "admin";
  const isStudent = currentUser?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        DEFAULT_STUDENT,
        DEFAULT_ADMIN
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
