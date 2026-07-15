import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Login from "./components/Login.jsx";
import Schoolhome from "./components/Schoolhome.jsx";
import SchoolAbout from "./components/SchoolAbout.jsx";
import SchoolContact from "./components/SchoolContact.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AccountantDashboard from "./components/AccountantDashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import ParentDashboard from "./components/ParentDashboard.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import SqlClient from "./components/SqlClient.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Schoolhome />} />
        <Route path="/about" element={<SchoolAbout />} />
        <Route path="/contact" element={<SchoolContact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Route - Admin Only. This tool runs raw SQL, it must never be public. */}
        <Route
          path="/sql-client"
          element={
            <ProtectedRoute requiredRole="admin">
              <SqlClient />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Only */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Accountant Only */}
        <Route
          path="/accountant-dashboard"
          element={
            <ProtectedRoute requiredRole="accountant">
              <AccountantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Teacher Only */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Parent Only */}
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
