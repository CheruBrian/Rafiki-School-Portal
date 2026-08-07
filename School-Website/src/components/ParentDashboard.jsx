import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

const ParentDashboard = () => {
  const { logout, user, schoolData } = useAuth();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const buildAssessmentBreakdown = (score = 0) => {
    const base = Number(score) || 0;
    const exam1 = Math.max(0, Math.min(100, Math.round(base * 0.9)));
    const exam2 = Math.max(0, Math.min(100, Math.round(base * 0.95)));
    const finalExam = Math.max(0, Math.min(100, Math.round(base * 1.0)));
    const cat1 = Math.max(0, Math.min(100, Math.round(base * 0.88)));
    const cat2 = Math.max(0, Math.min(100, Math.round(base * 0.92)));
    const cat3 = Math.max(0, Math.min(100, Math.round(base * 0.9)));
    const finalScore = (exam1 + exam2 + finalExam + cat1 + cat2 + cat3) / 6;

    return { exam1, exam2, finalExam, cat1, cat2, cat3, finalScore };
  };

  const children = (schoolData.students || []).map((student) => ({
    id: student.id,
    name: student.name,
    grade: student.performance?.grade || student.grade || "TBD",
    class: student.class || "A1",
    subjects: (student.subjects || []).length
      ? student.subjects.map((subject) => ({
          name: subject.name,
          marks: subject.score || subject.marks || 0,
          grade: subject.grade || student.performance?.grade || "TBD",
          assessmentBreakdown: buildAssessmentBreakdown(
            Number(subject.score || subject.marks || 0),
          ),
        }))
      : [
          {
            name: "General Studies",
            marks: Number(student.marks || 0),
            grade: student.performance?.grade || "TBD",
            assessmentBreakdown: buildAssessmentBreakdown(
              Number(student.marks || 0),
            ),
          },
        ],
    fee: Number(student.fee || 0),
    paid: Number(student.paid || 0),
    balance: Number(
      student.balance ||
        Math.max(Number(student.fee || 0) - Number(student.paid || 0), 0),
    ),
  }));

  const child = children[selectedChild] || children[0];

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
      case "A+":
        return "#51cf66";
      case "B":
      case "B+":
        return "#4c6ef5";
      case "C":
      case "C+":
        return "#fcc419";
      default:
        return "#ff6b6b";
    }
  };

  const avgMarks =
    child.subjects.reduce((sum, s) => sum + s.marks, 0) / child.subjects.length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Parent Portal</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>My Children</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {children.map((c, index) => (
              <button
                key={c.id}
                onClick={() => setSelectedChild(index)}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    selectedChild === index ? "#667eea" : "#f0f0f0",
                  color: selectedChild === index ? "white" : "#333",
                  border: selectedChild === index ? "none" : "2px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Student Information: {child.name}</h2>
          <div className="teacher-info">
            <p>
              <strong>Grade:</strong> {child.grade}
            </p>
            <p>
              <strong>Class:</strong> {child.class}
            </p>
            <p>
              <strong>Average Marks:</strong> {avgMarks.toFixed(1)}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Academic Performance</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Average Mark</h3>
              <p className="stat-value">{avgMarks.toFixed(1)}</p>
            </div>
            <div className="stat-card">
              <h3>Highest Subject</h3>
              <p className="stat-value">
                {Math.max(...child.subjects.map((s) => s.marks))}
              </p>
            </div>
            <div className="stat-card">
              <h3>Number of Subjects</h3>
              <p className="stat-value">{child.subjects.length}</p>
            </div>
          </div>

          <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
            Subject Grades
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {child.subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.name}</td>
                  <td>{subject.marks}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        backgroundColor: getGradeColor(subject.grade),
                        color: "white",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {subject.grade}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                        height: "20px",
                        minWidth: "100px",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: getGradeColor(subject.grade),
                          height: "100%",
                          width: `${(subject.marks / 100) * 100}%`,
                          transition: "width 0.3s",
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
            Assessment Breakdown
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam 1</th>
                <th>Exam 2</th>
                <th>Final Exam</th>
                <th>C.A.T 1</th>
                <th>C.A.T 2</th>
                <th>C.A.T 3</th>
                <th>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {child.subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.name}</td>
                  <td>{subject.assessmentBreakdown?.exam1 ?? 0}</td>
                  <td>{subject.assessmentBreakdown?.exam2 ?? 0}</td>
                  <td>{subject.assessmentBreakdown?.finalExam ?? 0}</td>
                  <td>{subject.assessmentBreakdown?.cat1 ?? 0}</td>
                  <td>{subject.assessmentBreakdown?.cat2 ?? 0}</td>
                  <td>{subject.assessmentBreakdown?.cat3 ?? 0}</td>
                  <td>
                    <strong>
                      {subject.assessmentBreakdown?.finalScore?.toFixed(1) ??
                        "0.0"}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>School Fee Status</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>School Fee</h3>
              <p className="stat-value">KES {child.fee.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Amount Paid</h3>
              <p className="stat-value">KES {child.paid.toLocaleString()}</p>
            </div>
            <div
              className={`stat-card ${child.balance > 0 ? "" : ""}`}
              style={{
                background:
                  child.balance > 0
                    ? "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)"
                    : "linear-gradient(135deg, #51cf66 0%, #40c057 100%)",
              }}
            >
              <h3>Balance Left</h3>
              <p className="stat-value">KES {child.balance.toLocaleString()}</p>
            </div>
          </div>

          <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
            Fee Details
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>School Fee (Annual)</td>
                <td>KES {child.fee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Amount Paid</td>
                <td className="paid-amount">
                  KES {child.paid.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Balance Left (Outstanding)</strong>
                </td>
                <td
                  className={child.balance > 0 ? "balance-due" : "balance-paid"}
                >
                  <strong>KES {child.balance.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {child.balance > 0 && (
            <div className="warning-section">
              <h3>⚠️ Outstanding Fee Notice</h3>
              <p>
                Your child has an outstanding school fee balance of{" "}
                <strong>KES {child.balance.toLocaleString()}</strong>. Please
                make payment at your earliest convenience.
              </p>
              <p>Contact the school accountant for payment arrangements.</p>
            </div>
          )}

          {child.balance === 0 && (
            <div
              style={{
                background: "#e8f5e9",
                borderLeft: "4px solid #51cf66",
                padding: "20px",
                borderRadius: "4px",
                color: "#2e7d32",
                marginTop: "20px",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#1b5e20" }}>
                ✓ Fees Paid in Full
              </h3>
              <p>Thank you! All school fees have been paid in full.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
