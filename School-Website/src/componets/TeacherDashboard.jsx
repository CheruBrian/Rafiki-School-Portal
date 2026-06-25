import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

const TeacherDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      class: "A1",
      grade: "A",
      marks: 85,
      fee: 5000,
      paid: 3000,
      balance: 2000,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      class: "A1",
      grade: "B",
      marks: 78,
      fee: 5000,
      paid: 5000,
      balance: 0,
    },
    {
      id: 3,
      name: "Mike Wilson",
      class: "A1",
      grade: "A",
      marks: 92,
      fee: 5000,
      paid: 2000,
      balance: 3000,
    },
    {
      id: 4,
      name: "Emma Davis",
      class: "A1",
      grade: "B+",
      marks: 80,
      fee: 5000,
      paid: 4000,
      balance: 1000,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    marks: "",
    fee: "5000",
    paid: "0",
  });
  const teacherClass = "A1";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

  const resetAddForm = () => {
    setNewStudent({
      name: "",
      grade: "",
      marks: "",
      fee: "5000",
      paid: "0",
    });
  };

  const handleAddStudent = (event) => {
    event.preventDefault();
    if (!newStudent.name.trim()) return;

    const marks = Number(newStudent.marks) || 0;
    const fee = Number(newStudent.fee) || 5000;
    const paid = Number(newStudent.paid) || 0;
    const addedStudent = {
      id: students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1,
      name: newStudent.name.trim(),
      class: teacherClass,
      grade: newStudent.grade.trim() || "TBD",
      marks,
      fee,
      paid,
      balance: Math.max(fee - paid, 0),
    };

    setStudents([addedStudent, ...students]);
    resetAddForm();
    setShowAddForm(false);
  };

  const handleRemoveStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const avgGrade = students.length
    ? students.reduce((sum, s) => sum + s.marks, 0) / students.length
    : 0;
  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const allFeePaid = students.filter((s) => s.balance === 0).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          My Students
        </button>
        <button
          className={`nav-btn ${activeTab === "grades" ? "active" : ""}`}
          onClick={() => setActiveTab("grades")}
        >
          Grades Overview
        </button>
        <button
          className={`nav-btn ${activeTab === "fees" ? "active" : ""}`}
          onClick={() => setActiveTab("fees")}
        >
          Fees Status
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "students" && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>My Students</h2>
                <p>
                  <strong>Class:</strong> {teacherClass} •{" "}
                  <strong>Total Students:</strong> {students.length} •{" "}
                  <strong>Average Marks:</strong> {avgGrade.toFixed(1)}
                </p>
              </div>
              <button
                className="action-btn primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "Cancel" : "Add Student"}
              </button>
            </div>
            {showAddForm && (
              <form className="inline-form" onSubmit={handleAddStudent}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="studentName">Student Name</label>
                    <input
                      id="studentName"
                      className="input-field"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      placeholder="Enter student name"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="studentGrade">Grade</label>
                    <input
                      id="studentGrade"
                      className="input-field"
                      value={newStudent.grade}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, grade: e.target.value })
                      }
                      placeholder="A, B+, C"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="studentMarks">Marks</label>
                    <input
                      id="studentMarks"
                      type="number"
                      className="input-field"
                      value={newStudent.marks}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, marks: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="studentFee">School Fee</label>
                    <input
                      id="studentFee"
                      type="number"
                      className="input-field"
                      value={newStudent.fee}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, fee: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="studentPaid">Amount Paid</label>
                    <input
                      id="studentPaid"
                      type="number"
                      className="input-field"
                      value={newStudent.paid}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, paid: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="action-btn primary">
                  Add Student
                </button>
              </form>
            )}

            {students.length === 0 ? (
              <p className="no-data">
                No students assigned yet. Add a student to your class.
              </p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Marks</th>
                    <th>School Fee Balance</th>
                    <th>Fee Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            backgroundColor: getGradeColor(student.grade),
                            color: "white",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          {student.grade}
                        </span>
                      </td>
                      <td>{student.marks}</td>
                      <td
                        className={
                          student.balance > 0 ? "balance-due" : "balance-paid"
                        }
                      >
                        KES {student.balance.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${student.balance === 0 ? "paid" : "pending"}`}
                        >
                          {student.balance === 0 ? "Paid" : "Outstanding"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "grades" && (
          <div className="tab-content">
            <h2>Grades Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Average Class Mark</h3>
                <p className="stat-value">{avgGrade.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-value">{students.length}</p>
              </div>
              <div className="stat-card">
                <h3>Highest Mark</h3>
                <p className="stat-value">
                  {students.length
                    ? Math.max(...students.map((s) => s.marks))
                    : 0}
                </p>
              </div>
              <div className="stat-card">
                <h3>Lowest Mark</h3>
                <p className="stat-value">
                  {students.length
                    ? Math.min(...students.map((s) => s.marks))
                    : 0}
                </p>
              </div>
            </div>

            <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
              Student Performance
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.marks}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            backgroundColor: getGradeColor(student.grade),
                            color: "white",
                            borderRadius: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          {student.grade}
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
                              backgroundColor: getGradeColor(student.grade),
                              height: "100%",
                              width: `${(student.marks / 100) * 100}%`,
                              transition: "width 0.3s",
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="tab-content">
            <h2>Students Fee Status</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Outstanding</h3>
                <p className="stat-value">
                  {totalBalance > 0
                    ? "KES " + totalBalance.toLocaleString()
                    : "0"}
                </p>
              </div>
              <div className="stat-card">
                <h3>Fees Paid</h3>
                <p className="stat-value">
                  {allFeePaid} of {students.length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Collection Rate</h3>
                <p className="stat-value">
                  {students.length
                    ? ((allFeePaid / students.length) * 100).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>

            <h3 style={{ marginTop: "30px", marginBottom: "20px" }}>
              Fee Details
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>School Fee</th>
                  <th>Amount Paid</th>
                  <th>Balance Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>KES {student.fee.toLocaleString()}</td>
                    <td className="paid-amount">
                      KES {student.paid.toLocaleString()}
                    </td>
                    <td
                      className={
                        student.balance > 0 ? "balance-due" : "balance-paid"
                      }
                    >
                      KES {student.balance.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${student.balance === 0 ? "paid" : "pending"}`}
                      >
                        {student.balance === 0 ? "Complete" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalBalance > 0 && (
              <div className="warning-section">
                <h3>⚠️ Fee Collection Alert</h3>
                <p>
                  Total outstanding fee balance: KES{" "}
                  {totalBalance.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
