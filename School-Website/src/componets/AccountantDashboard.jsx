import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

const AccountantDashboard = () => {
  const { logout, user, schoolData } = useAuth();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("All");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const students = schoolData.students || [];
  const categories = ["All", "Preschool", "Lower Primary", "JSS", "SSS"];

  const filteredStudents =
    filterCategory === "All"
      ? students
      : students.filter((s) => (s.category || "Preschool") === filterCategory);

  const totalBalance = filteredStudents.reduce(
    (sum, s) => sum + Number(s.balance || 0),
    0,
  );
  const totalFees = filteredStudents.reduce(
    (sum, s) => sum + Number(s.fee || 0),
    0,
  );
  const totalPaid = filteredStudents.reduce(
    (sum, s) => sum + Number(s.paid || 0),
    0,
  );
  const studentsWithBalance = filteredStudents.filter(
    (s) => Number(s.balance || 0) > 0,
  ).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Accountant Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="accountant-summary">
          <h2>Fee Collection Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p className="stat-value">{filteredStudents.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total School Fees</h3>
              <p className="stat-value">KES {totalFees.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Total Paid</h3>
              <p className="stat-value">KES {totalPaid.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Outstanding Balance</h3>
              <p className="stat-value outstanding">
                KES {totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="stat-card">
              <h3>Students with Balance</h3>
              <p className="stat-value">{studentsWithBalance}</p>
            </div>
            <div className="stat-card">
              <h3>Collection Rate</h3>
              <p className="stat-value">
                {totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(1) : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Filter by Level:</h3>
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${filterCategory === category ? "active" : ""}`}
                onClick={() => setFilterCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="students-section">
          <h3>Student Fee Status</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Level</th>
                <th>Class</th>
                <th>School Fee</th>
                <th>Amount Paid</th>
                <th>Balance (School Fee Left)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.category || "Preschool"}</td>
                  <td>{student.class}</td>
                  <td>KES {Number(student.fee || 0).toLocaleString()}</td>
                  <td className="paid-amount">
                    KES {Number(student.paid || 0).toLocaleString()}
                  </td>
                  <td
                    className={
                      Number(student.balance || 0) > 0
                        ? "balance-due"
                        : "balance-paid"
                    }
                  >
                    KES {Number(student.balance || 0).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${Number(student.balance || 0) === 0 ? "paid" : "pending"}`}
                    >
                      {Number(student.balance || 0) === 0 ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {studentsWithBalance > 0 && (
          <div className="warning-section">
            <h3>⚠️ Outstanding Fees Alert</h3>
            <p>
              {studentsWithBalance} student(s) have outstanding school fees
              totaling KES {totalBalance.toLocaleString()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountantDashboard;
