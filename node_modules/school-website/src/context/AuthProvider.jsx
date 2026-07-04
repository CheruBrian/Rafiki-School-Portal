import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE_KEY = "school-portal-data";

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

const getInitialSchoolData = () => {
  if (typeof window === "undefined") {
    return createDefaultSchoolData();
  }

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      return {
        ...createDefaultSchoolData(),
        ...parsed,
        students: parsed.students || createDefaultSchoolData().students,
        teachers: parsed.teachers || createDefaultSchoolData().teachers,
        accountants:
          parsed.accountants || createDefaultSchoolData().accountants,
        financeTeam:
          parsed.financeTeam || createDefaultSchoolData().financeTeam,
        directory: parsed.directory || createDefaultSchoolData().directory,
      };
    }
  } catch {
    // Fall back to defaults if storage data is invalid.
  }

  return createDefaultSchoolData();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [schoolData, setSchoolData] = useState(getInitialSchoolData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolData));
    }
  }, [schoolData]);

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

  const addSchoolEntity = (entityType, payload = {}) => {
    const trimmedName = payload.name?.trim();
    if (!trimmedName) return;

    switch (entityType) {
      case "students": {
        const fee = Number(payload.fee) || 0;
        const paid = Number(payload.paid) || 0;
        const newStudent = {
          id: createNextId(schoolData.students),
          name: trimmedName,
          class: payload.class?.trim() || "A1",
          category: payload.category || "Preschool",
          fee,
          paid,
          balance: Math.max(fee - paid, 0),
          grade: payload.grade?.trim() || "TBD",
          marks: Number(payload.marks) || 0,
          subjects: payload.subjects || [
            { name: "General Studies", score: Number(payload.marks) || 0 },
          ],
          performance: payload.performance || {
            averageScore: Number(payload.marks) || 0,
            grade: payload.grade?.trim() || "TBD",
            remark: "Added from the school portal.",
          },
        };

        setSchoolData((prev) => ({
          ...prev,
          students: [newStudent, ...prev.students],
          directory: [
            {
              id: Date.now() + Math.floor(Math.random() * 1000),
              name: trimmedName,
              role: "Student",
              category: payload.category || "Preschool",
            },
            ...prev.directory,
          ].slice(0, 8),
        }));
        break;
      }
      case "teachers": {
        const newTeacher = {
          id: createNextId(schoolData.teachers),
          name: trimmedName,
          subject: payload.subject?.trim() || "General Studies",
          class: payload.class?.trim() || "A1",
          category: payload.category || "Preschool",
          teaches: payload.teaches || ["General Studies"],
          performance: payload.performance || {
            rating: 4.5,
            averageClassScore: 0,
            students: 0,
            remark: "Added from the school portal.",
          },
        };

        setSchoolData((prev) => ({
          ...prev,
          teachers: [newTeacher, ...prev.teachers],
          directory: [
            {
              id: Date.now() + Math.floor(Math.random() * 1000),
              name: trimmedName,
              role: "Teacher",
              category: payload.category || "Preschool",
            },
            ...prev.directory,
          ].slice(0, 8),
        }));
        break;
      }
      case "accountants": {
        const newAccountant = {
          id: createNextId(schoolData.accountants),
          name: trimmedName,
          status: payload.status || "Active",
        };

        setSchoolData((prev) => ({
          ...prev,
          accountants: [newAccountant, ...prev.accountants],
          directory: [
            {
              id: Date.now() + Math.floor(Math.random() * 1000),
              name: trimmedName,
              role: "Accountant",
              category: "Admin",
            },
            ...prev.directory,
          ].slice(0, 8),
        }));
        break;
      }
      case "finances": {
        const newFinance = {
          id: createNextId(schoolData.financeTeam),
          name: trimmedName,
          role: payload.role || "Finance Officer",
        };

        setSchoolData((prev) => ({
          ...prev,
          financeTeam: [newFinance, ...prev.financeTeam],
          directory: [
            {
              id: Date.now() + Math.floor(Math.random() * 1000),
              name: trimmedName,
              role: "Finance Staff",
              category: "Finance",
            },
            ...prev.directory,
          ].slice(0, 8),
        }));
        break;
      }
      default:
        break;
    }
  };

  const removeSchoolEntity = (entityType, id) => {
    switch (entityType) {
      case "students":
        setSchoolData((prev) => ({
          ...prev,
          students: prev.students.filter((student) => student.id !== id),
          directory: prev.directory.filter(
            (entry) =>
              !(
                entry.name ===
                  prev.students.find((student) => student.id === id)?.name &&
                entry.role === "Student"
              ),
          ),
        }));
        break;
      case "teachers":
        setSchoolData((prev) => ({
          ...prev,
          teachers: prev.teachers.filter((teacher) => teacher.id !== id),
          directory: prev.directory.filter(
            (entry) =>
              !(
                entry.name ===
                  prev.teachers.find((teacher) => teacher.id === id)?.name &&
                entry.role === "Teacher"
              ),
          ),
        }));
        break;
      case "accountants":
        setSchoolData((prev) => ({
          ...prev,
          accountants: prev.accountants.filter(
            (accountant) => accountant.id !== id,
          ),
          directory: prev.directory.filter(
            (entry) =>
              !(
                entry.name ===
                  prev.accountants.find((accountant) => accountant.id === id)
                    ?.name && entry.role === "Accountant"
              ),
          ),
        }));
        break;
      case "finances":
        setSchoolData((prev) => ({
          ...prev,
          financeTeam: prev.financeTeam.filter((member) => member.id !== id),
          directory: prev.directory.filter(
            (entry) =>
              !(
                entry.name ===
                  prev.financeTeam.find((member) => member.id === id)?.name &&
                entry.role === "Finance Staff"
              ),
          ),
        }));
        break;
      default:
        break;
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
