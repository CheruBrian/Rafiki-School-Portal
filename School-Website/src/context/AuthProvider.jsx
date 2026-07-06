import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = "http://localhost:3001";

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
      category: "Lower Primary",
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
      category: "Lower Primary",
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [schoolData, setSchoolData] = useState(getInitialSchoolData);

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

  // Mock user database - in production, this would be a backend
  const validUsers = {
    admin: { password: "admin123", role: "admin", name: "Administrator" },
    accountant: {
      password: "accountant123",
      role: "accountant",
      name: "Accountant",
    },
    teacher: { password: "teacher123", role: "teacher", name: "Teacher" },
    parent: { password: "parent123", role: "parent", name: "Parent" },
  };

  const login = (username, password) => {
    const userData = validUsers[username];
    if (userData && userData.password === password) {
      setUser({
        username,
        role: userData.role,
        name: userData.name,
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
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
          headers: { "Content-Type": "application/json" },
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

  const removeSchoolEntity = async (entityType, id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/school-data/${entityType}/${id}`,
        {
          method: "DELETE",
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
    }),
    [user, isAuthenticated, schoolData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
