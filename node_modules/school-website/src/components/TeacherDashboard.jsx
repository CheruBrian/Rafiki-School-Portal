import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  getSubjectsForLevel,
  scoreToGrade,
  averageOf,
} from "../components/Subjects";
import "./Dashboard.css";

const emptySubjectEntry = () => ({ name: "", score: "" });

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

const TeacherDashboard = () => {
  const {
    logout,
    user,
    schoolData,
    addSchoolEntity,
    removeSchoolEntity,
    addStudentSubject,
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    studentId: "",
    entries: [emptySubjectEntry()],
  });
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "",
    marks: "",
    fee: "5000",
    paid: "0",
  });
  const teacherClass = "A1";
  const students = (schoolData.students || []).filter(
    (student) => (student.class || teacherClass) === teacherClass,
  );
  const subjectData = [
    {
      name: "Math",
      average: 84,
      color: "#4c6ef5",
      students: [
        { name: "John Doe", marks: 85 },
        { name: "Sarah Johnson", marks: 78 },
        { name: "Mike Wilson", marks: 92 },
        { name: "Emma Davis", marks: 80 },
      ],
    },
    {
      name: "English",
      average: 81,
      color: "#2f9e44",
      students: [
        { name: "John Doe", marks: 82 },
        { name: "Sarah Johnson", marks: 79 },
        { name: "Mike Wilson", marks: 88 },
        { name: "Emma Davis", marks: 75 },
      ],
    },
    {
      name: "Science",
      average: 86,
      color: "#f08c00",
      students: [
        { name: "John Doe", marks: 90 },
        { name: "Sarah Johnson", marks: 83 },
        { name: "Mike Wilson", marks: 89 },
        { name: "Emma Davis", marks: 82 },
      ],
    },
  ];

  const handleStudentClick = (id) =>
    setSelectedStudentId((current) => (current === id ? null : id));

  // --- Subject form (supports adding several subjects for one student
  // in a single submission) ---

  const handleToggleAddSubjectForm = () => {
    if (!showAddSubjectForm) {
      setSubjectForm({ studentId: "", entries: [emptySubjectEntry()] });
    }
    setShowAddSubjectForm(!showAddSubjectForm);
  };

  const subjectFormStudent = students.find(
    (s) => String(s.id) === String(subjectForm.studentId),
  );
  const subjectOptions = getSubjectsForLevel(
    subjectFormStudent?.category || "Preschool",
  );

  const handleSubjectStudentChange = (studentId) => {
    setSubjectForm({ studentId, entries: [emptySubjectEntry()] });
  };

  const handleSubjectEntryChange = (index, field, value) => {
    setSubjectForm((prev) => {
      const entries = prev.entries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      );
      return { ...prev, entries };
    });
  };

  const handleAddSubjectRow = () => {
    setSubjectForm((prev) => ({
      ...prev,
      entries: [...prev.entries, emptySubjectEntry()],
    }));
  };

  const handleRemoveSubjectRow = (index) => {
    setSubjectForm((prev) => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index),
    }));
  };

  const subjectOptionsForRow = (rowIndex) => {
    const chosenElsewhere = subjectForm.entries
      .filter((_, i) => i !== rowIndex)
      .map((entry) => entry.name)
      .filter(Boolean);
    return subjectOptions.filter((s) => !chosenElsewhere.includes(s));
  };

  const canAddMoreSubjectRows =
    subjectForm.entries.length < subjectOptions.length;

  const handleAddSubject = async (event) => {
    event.preventDefault();
    if (!subjectForm.studentId) return;

    const validEntries = subjectForm.entries.filter((entry) => entry.name);
    if (validEntries.length === 0) return;

    setSubjectSubmitting(true);
    try {
      for (const entry of validEntries) {
        await addStudentSubject(subjectForm.studentId, {
          name: entry.name,
          score: Number(entry.score) || 0,
        });
      }
    } finally {
      setSubjectSubmitting(false);
    }

    setSubjectForm({ studentId: "", entries: [emptySubjectEntry()] });
    setShowAddSubjectForm(false);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

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

    addSchoolEntity("students", {
      name: newStudent.name.trim(),
      class: teacherClass,
      category: "Preschool",
      grade: newStudent.grade.trim() || "TBD",
      marks,
      fee,
      paid,
      balance: Math.max(fee - paid, 0),
      performance: {
        averageScore: marks,
        grade: newStudent.grade.trim() || "TBD",
        remark: "Added from the teacher dashboard.",
      },
    });

    resetAddForm();
    setShowAddForm(false);
  };

  const handleRemoveStudent = (id) => {
    removeSchoolEntity("students", id);
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
              <div>
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "Cancel" : "Add Student"}
                </button>
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={handleToggleAddSubjectForm}
                  style={{ marginLeft: "10px" }}
                >
                  {showAddSubjectForm ? "Cancel" : "Add Subject"}
                </button>
              </div>
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

            {showAddSubjectForm && (
              <form className="inline-form" onSubmit={handleAddSubject}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="subjectStudent">Student</label>
                    <select
                      id="subjectStudent"
                      className="select-field"
                      value={subjectForm.studentId}
                      onChange={(e) =>
                        handleSubjectStudentChange(e.target.value)
                      }
                      required
                    >
                      <option value="">Select student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category || "Preschool"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {subjectForm.entries.map((entry, index) => (
                  <div className="form-row" key={index}>
                    <div className="form-field">
                      <label htmlFor={`subjectName-${index}`}>Subject</label>
                      <select
                        id={`subjectName-${index}`}
                        className="select-field"
                        value={entry.name}
                        onChange={(e) =>
                          handleSubjectEntryChange(
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        disabled={!subjectForm.studentId}
                        required
                      >
                        <option value="">Select subject</option>
                        {subjectOptionsForRow(index).map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor={`subjectScore-${index}`}>Score</label>
                      <input
                        id={`subjectScore-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        className="input-field"
                        value={entry.score}
                        onChange={(e) =>
                          handleSubjectEntryChange(
                            index,
                            "score",
                            e.target.value,
                          )
                        }
                        placeholder="0-100"
                      />
                    </div>
                    {subjectForm.entries.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoveSubjectRow(index)}
                        style={{ alignSelf: "flex-end" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <div className="form-row">
                  <button
                    type="button"
                    className="action-btn"
                    onClick={handleAddSubjectRow}
                    disabled={!subjectForm.studentId || !canAddMoreSubjectRows}
                  >
                    + Add another subject
                  </button>
                </div>

                <button
                  type="submit"
                  className="action-btn primary"
                  disabled={!subjectForm.studentId || subjectSubmitting}
                >
                  {subjectSubmitting ? "Saving…" : "Save Subjects"}
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
                      <td>
                        <button
                          className="entity-name-link"
                          onClick={() => handleStudentClick(student.id)}
                        >
                          {student.name}
                        </button>
                      </td>
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

            {selectedStudent && (
              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3>{selectedStudent.name}</h3>
                  <span>
                    {selectedStudent.category} • {selectedStudent.class}
                  </span>
                </div>
                <div className="detail-grid">
                  <div className="detail-card">
                    <h4>Subjects</h4>
                    <ul className="detail-list">
                      {(selectedStudent.subjects || []).map((subject) => (
                        <li key={subject.name}>
                          <span>{subject.name}</span>
                          <strong>{subject.score}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-card">
                    <h4>Performance</h4>
                    <p>
                      <strong>Average:</strong>{" "}
                      {averageOf(selectedStudent.subjects).toFixed(1)}%
                    </p>
                    <p>
                      <strong>Grade:</strong>{" "}
                      {scoreToGrade(averageOf(selectedStudent.subjects))}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <h4>Assessment Breakdown</h4>
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
                      {(selectedStudent.subjects || []).map((subject) => {
                        const breakdown = buildAssessmentBreakdown(
                          Number(subject.score || 0),
                        );

                        return (
                          <tr key={subject.name}>
                            <td>{subject.name}</td>
                            <td>{breakdown.exam1}</td>
                            <td>{breakdown.exam2}</td>
                            <td>{breakdown.finalExam}</td>
                            <td>{breakdown.cat1}</td>
                            <td>{breakdown.cat2}</td>
                            <td>{breakdown.cat3}</td>
                            <td>
                              <strong>{breakdown.finalScore.toFixed(1)}</strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
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
              Subject Performance
            </h3>
            <div className="subject-grid">
              {subjectData.map((subject) => (
                <button
                  key={subject.name}
                  className={`subject-card ${selectedSubject === subject.name ? "active" : ""}`}
                  onClick={() =>
                    setSelectedSubject(
                      selectedSubject === subject.name ? null : subject.name,
                    )
                  }
                >
                  <h4>{subject.name}</h4>
                  <p className="subject-average">{subject.average}%</p>
                  <span className="subject-caption">Click to view marks</span>
                </button>
              ))}
            </div>

            {selectedSubject && (
              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3>{selectedSubject} Marks</h3>
                  <span>Student-by-student performance</span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Marks</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData
                      .find((subject) => subject.name === selectedSubject)
                      ?.students.map((student) => (
                        <tr key={student.name}>
                          <td>{student.name}</td>
                          <td>{student.marks}%</td>
                          <td>
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${student.marks}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

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
