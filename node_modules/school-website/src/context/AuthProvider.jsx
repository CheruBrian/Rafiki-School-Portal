import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { API_BASE_URL } from "../config/api";

const createDefaultSchoolData = () => ({
  students: [
    {
      id: 1,
      name: "John Doe",
      class: "A1",
      category: "Preschool",
      fee: 5000,
      paid: 3000,
      balance: 2000,
      grade: "A",
      marks: 85,
      subjects: [
        { name: "Mathematics", score: 88 },
        { name: "English", score: 84 },
        { name: "Science", score: 90 },
      ],
      performance: {
        averageScore: 87,
        grade: "A",
        remark: "Very strong progress this term.",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "B2",
      category: "Primary",
      fee: 5000,
      paid: 5000,
      balance: 0,
      grade: "A",
      marks: 92,
      subjects: [
        { name: "Reading", score: 92 },
        { name: "Math", score: 89 },
        { name: "Creative Arts", score: 95 },
      ],
      performance: {
        averageScore: 92,
        grade: "A",
        remark: "Excellent performance across all subjects.",
      },
    },
    {
      id: 3,
      name: "Mike Johnson",
      class: "A1",
      category: "JSS",
      fee: 5000,
      paid: 2000,
      balance: 3000,
      grade: "B",
      marks: 78,
      subjects: [
        { name: "Computer Studies", score: 78 },
        { name: "History", score: 81 },
        { name: "Biology", score: 76 },
      ],
      performance: {
        averageScore: 78,
        grade: "B",
        remark: "Steady improvement and good effort.",
      },
    },
  ],
  teachers: [
    {
      id: 1,
      name: "Mrs. Emma Wilson",
      subject: "Mathematics",
      class: "A1",
      category: "Preschool",
      teaches: ["Mathematics", "Early Literacy"],
      performance: {
        rating: 4.8,
        averageClassScore: 88,
        students: 24,
        remark: "Excellent classroom engagement and results.",
      },
    },
    {
      id: 2,
      name: "Mr. Robert Brown",
      subject: "English",
      class: "B2",
      category: "Primary",
      teaches: ["English", "Social Studies"],
      performance: {
        rating: 4.6,
        averageClassScore: 86,
        students: 30,
        remark: "Consistent and thoughtful teaching style.",
      },
    },
    {
      id: 3,
      name: "Mrs. Sarah Davis",
      subject: "Science",
      class: "A1",
      category: "JSS",
      teaches: ["Science", "Chemistry"],
      performance: {
        rating: 4.7,
        averageClassScore: 84,
        students: 27,
        remark: "Strong subject mastery and student support.",
      },
    },
  ],
  accountants: [
    { id: 1, name: "Mr. Alex Thompson", status: "Active" },
    { id: 2, name: "Ms. Lisa Anderson", status: "Active" },
  ],
  financeTeam: [
    { id: 1, name: "Ms. Grace Mwangi", role: "Finance Officer" },
    { id: 2, name: "Mr. Samuel Oduor", role: "Finance Manager" },
  ],
  directory: [
    {
      id: 101,
      name: "Mrs. Emma Wilson",
      role: "Teacher",
      category: "Preschool",
    },
    {
      id: 102,
      name: "Mr. Alex Thompson",
      role: "Accountant",
      category: "Admin",
    },
    {
      id: 103,
      name: "Ms. Grace Mwangi",
      role: "Finance Staff",
      category: "Finance",
    },
  ],
});

const getInitialSchoolData = () => createDefaultSchoolData();

const AUTH_STORAGE_KEY = "rafiki_auth_session";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

const getStoredSession = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);
  const user = session?.user ?? null;
  const token = session?.token ?? null;
  const isAuthenticated = !!session;
  const [schoolData, setSchoolData] = useState(getInitialSchoolData);

  const logout = () => {
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        // best-effort - clear the local session regardless
      });
    }
    setSession(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!session) return;

    let timerId;
    const resetInactivityTimer = () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = window.setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, {
        passive: true,
      });
    });

    resetInactivityTimer();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [session, token]);

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/school-data`);
        if (!response.ok) {
          throw new Error("Unable to load school data");
        }
        const result = await response.json();
        if (result?.data) {
          setSchoolData(result.data);
        }
      } catch {
        setSchoolData(getInitialSchoolData());
      }
    };

    loadSchoolData();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result?.error || "Invalid username or password",
        };
      }
      const nextSession = { token: result.token, user: result.user };
      setSession(nextSession);
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
      } catch {
        // sessionStorage may be unavailable (e.g. private browsing) - auth
        // still works for this tab, it just won't survive a refresh.
      }
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Unable to reach the server. Please try again.",
      };
    }
  };

  const createNextId = (items = []) =>
    items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  const addSchoolEntity = async (entityType, payload = {}) => {
    const trimmedName = payload.name?.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/school-data/${entityType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to save school data");
      }

      const result = await response.json();
      if (result?.data) {
        setSchoolData(result.data);
      }
    } catch {
      // keep the UI responsive even if the backend is temporarily unavailable
    }
  };
  const addStudentSubject = async (studentId, subject) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/school-data/students/${studentId}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(subject), // { name, score }
        },
      );

      if (!response.ok) {
        throw new Error("Unable to add subject");
      }

      const result = await response.json();
      if (result?.data) {
        setSchoolData(result.data);
      }
    } catch {
      // keep the UI responsive even if the backend is temporarily unavailable
    }
  };

  const updateStudentSubjectAssessments = async (
    studentId,
    subjectName,
    assessments,
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/school-data/students/${studentId}/subjects/${encodeURIComponent(subjectName)}/assessments`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(assessments),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to save assessment scores");
      }

      const result = await response.json();
      if (result?.data) {
        setSchoolData(result.data);
      }
      return result?.data;
    } catch {
      return null;
    }
  };

  const removeSchoolEntity = async (entityType, id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/school-data/${entityType}/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );

      if (!response.ok) {
        throw new Error("Unable to delete school data");
      }

      const result = await response.json();
      if (result?.data) {
        setSchoolData(result.data);
      }
    } catch {
      // keep the UI responsive even if the backend is temporarily unavailable
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      schoolData,
      addSchoolEntity,
      removeSchoolEntity,
      addStudentSubject,
      updateStudentSubjectAssessments,
    }),
    [session, schoolData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
