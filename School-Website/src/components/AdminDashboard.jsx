import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import {
  getSubjectsForLevel,
  scoreToGrade,
  averageOf,
} from "../components/Subjects";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

const emptySubjectEntry = () => ({ name: "", score: "" });

const AdminDashboard = () => {
  const {
    logout,
    user,
    schoolData,
    addSchoolEntity,
    removeSchoolEntity,
    addStudentSubject,
  } = useAuth();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTeacherCategory, setSelectedTeacherCategory] = useState("All");
  const [selectedStudentCategory, setSelectedStudentCategory] = useState("All");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    studentId: "",
    entries: [emptySubjectEntry()],
  });
  const [subjectSubmitting, setSubjectSubmitting] = useState(false);
  const [entityForm, setEntityForm] = useState({
    name: "",
    subject: "",
    class: "A1",
    fee: "5000",
    paid: "0",
    status: "Active",
    role: "Finance Officer",
    category: "Preschool",
  });

  const gradeLevels = ["Preschool", "Primary", "JSS", "SSS"];
  const {
    students = [],
    teachers = [],
    accountants = [],
    financeTeam = [],
    directory = [],
  } = schoolData;
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryRoleFilter, setDirectoryRoleFilter] = useState("All");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStudentNameClick = (studentId) => {
    setSelectedTeacherId(null);
    setSelectedStudentId((currentId) =>
      currentId === studentId ? null : studentId,
    );
  };

  const handleTeacherNameClick = (teacherId) => {
    setSelectedStudentId(null);
    setSelectedTeacherId((currentId) =>
      currentId === teacherId ? null : teacherId,
    );
  };

  const resetEntityForm = () => {
    setEntityForm({
      name: "",
      subject: "",
      class: "A1",
      fee: "5000",
      paid: "0",
      status: "Active",
      role: "Finance Officer",
      category:
        activeTab === "teachers"
          ? selectedTeacherCategory === "All"
            ? "Preschool"
            : selectedTeacherCategory
          : activeTab === "students"
            ? selectedStudentCategory === "All"
              ? "Preschool"
              : selectedStudentCategory
            : "Preschool",
    });
  };

  const getEntityLabel = () => {
    switch (activeTab) {
      case "students":
        return "Student";
      case "teachers":
        return "Teacher";
      case "accountants":
        return "Accountant";
      case "finances":
        return "Finance Staff";
      default:
        return "Item";
    }
  };

  const handleToggleAddForm = () => {
    if (showAddForm) {
      resetEntityForm();
    } else {
      const defaultCategory =
        activeTab === "teachers"
          ? selectedTeacherCategory === "All"
            ? "Preschool"
            : selectedTeacherCategory
          : activeTab === "students"
            ? selectedStudentCategory === "All"
              ? "Preschool"
              : selectedStudentCategory
            : "Preschool";

      setEntityForm((prev) => ({ ...prev, category: defaultCategory }));
    }
    setShowAddForm(!showAddForm);
  };

  const handleAddEntity = (event) => {
    event.preventDefault();
    if (!entityForm.name.trim()) return;

    addSchoolEntity(activeTab, entityForm);
    resetEntityForm();
    setShowAddForm(false);
  };

  const handleRemoveEntity = (id) => {
    removeSchoolEntity(activeTab, id);
  };

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

  const renderAddForm = () => {
    const entityLabel = getEntityLabel();

    return (
      <form className="inline-form" onSubmit={handleAddEntity}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="entityName">{entityLabel} Name</label>
            <input
              id="entityName"
              className="input-field"
              value={entityForm.name}
              onChange={(e) =>
                setEntityForm({ ...entityForm, name: e.target.value })
              }
              placeholder={`Enter ${entityLabel.toLowerCase()} name`}
              required
            />
          </div>

          {(activeTab === "teachers" || activeTab === "students") && (
            <div className="form-field">
              <label htmlFor="entityCategory">Level</label>
              <select
                id="entityCategory"
                className="select-field"
                value={entityForm.category}
                onChange={(e) =>
                  setEntityForm({ ...entityForm, category: e.target.value })
                }
              >
                {gradeLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === "teachers" && (
            <>
              <div className="form-field">
                <label htmlFor="entitySubject">Subject</label>
                <input
                  id="entitySubject"
                  className="input-field"
                  value={entityForm.subject}
                  onChange={(e) =>
                    setEntityForm({ ...entityForm, subject: e.target.value })
                  }
                  placeholder="Mathematics, English, Science..."
                />
              </div>
              <div className="form-field">
                <label htmlFor="entityClass">Class</label>
                <input
                  id="entityClass"
                  className="input-field"
                  value={entityForm.class}
                  onChange={(e) =>
                    setEntityForm({ ...entityForm, class: e.target.value })
                  }
                  placeholder="A1, B2, C3"
                />
              </div>
            </>
          )}

          {activeTab === "students" && (
            <>
              <div className="form-field">
                <label htmlFor="entityClass">Class</label>
                <input
                  id="entityClass"
                  className="input-field"
                  value={entityForm.class}
                  onChange={(e) =>
                    setEntityForm({ ...entityForm, class: e.target.value })
                  }
                  placeholder="A1, B2, C3"
                />
              </div>
              <div className="form-field">
                <label htmlFor="entityFee">School Fee</label>
                <input
                  id="entityFee"
                  type="number"
                  className="input-field"
                  value={entityForm.fee}
                  onChange={(e) =>
                    setEntityForm({ ...entityForm, fee: e.target.value })
                  }
                  placeholder="5000"
                />
              </div>
              <div className="form-field">
                <label htmlFor="entityPaid">Amount Paid</label>
                <input
                  id="entityPaid"
                  type="number"
                  className="input-field"
                  value={entityForm.paid}
                  onChange={(e) =>
                    setEntityForm({ ...entityForm, paid: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </>
          )}

          {activeTab === "accountants" && (
            <div className="form-field">
              <label htmlFor="entityStatus">Status</label>
              <select
                id="entityStatus"
                className="select-field"
                value={entityForm.status}
                onChange={(e) =>
                  setEntityForm({ ...entityForm, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}

          {activeTab === "finances" && (
            <div className="form-field">
              <label htmlFor="entityRole">Finance Role</label>
              <select
                id="entityRole"
                className="select-field"
                value={entityForm.role}
                onChange={(e) =>
                  setEntityForm({ ...entityForm, role: e.target.value })
                }
              >
                <option value="Finance Officer">Finance Officer</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Finance Coordinator">Finance Coordinator</option>
              </select>
            </div>
          )}
        </div>

        <button type="submit" className="action-btn primary">
          Add {entityLabel}
        </button>
      </form>
    );
  };

  const renderAddSubjectForm = () => (
    <form className="inline-form" onSubmit={handleAddSubject}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="subjectStudent">Student</label>
          <select
            id="subjectStudent"
            className="select-field"
            value={subjectForm.studentId}
            onChange={(e) => handleSubjectStudentChange(e.target.value)}
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
                handleSubjectEntryChange(index, "name", e.target.value)
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
                handleSubjectEntryChange(index, "score", e.target.value)
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
  );

  const totalFees = students.reduce((sum, s) => sum + s.fee, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.paid, 0);
  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const filteredTeachers =
    selectedTeacherCategory === "All"
      ? teachers
      : teachers.filter(
          (teacher) =>
            (teacher.category || "Preschool") === selectedTeacherCategory,
        );
  const filteredStudents =
    selectedStudentCategory === "All"
      ? students
      : students.filter(
          (student) =>
            (student.category || "Preschool") === selectedStudentCategory,
        );
  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );
  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === selectedTeacherId,
  );
  const roleFilters = [
    "All",
    "Teacher",
    "Accountant",
    "Finance Staff",
    "Student",
  ];
  const filteredDirectory = directory.filter((entry) => {
    const matchesRole =
      directoryRoleFilter === "All" || entry.role === directoryRoleFilter;
    const matchesSearch = entry.name
      .toLowerCase()
      .includes(directorySearch.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>School Administration Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button
            onClick={() => navigate("/sql-client")}
            className="action-btn primary"
            style={{ marginRight: "10px" }}
          >
            SQL Client
          </button>
          <ProfileMenu
            userName={user?.name || "Admin"}
            onLogout={handleLogout}
            onEditProfile={() => {}}
          />
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("overview");
            setShowAddForm(false);
          }}
        >
          Overview
        </button>
        <button
          className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("students");
            setShowAddForm(false);
          }}
        >
          Students
        </button>
        <button
          className={`nav-btn ${activeTab === "teachers" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("teachers");
            setShowAddForm(false);
          }}
        >
          Teachers
        </button>
        <button
          className={`nav-btn ${activeTab === "accountants" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("accountants");
            setShowAddForm(false);
          }}
        >
          Accountants
        </button>
        <button
          className={`nav-btn ${activeTab === "finances" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("finances");
            setShowAddForm(false);
          }}
        >
          Finances
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "overview" && (
          <div className="tab-content">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-value">{students.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Fees</h3>
                <p className="stat-value">KES {totalFees.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Fees Paid</h3>
                <p className="stat-value">KES {totalPaid.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Outstanding Balance</h3>
                <p className="stat-value">
                  KES {totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <h3>Total Teachers</h3>
                <p className="stat-value">{teachers.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Accountants</h3>
                <p className="stat-value">{accountants.length}</p>
              </div>
            </div>

            <div className="directory-card">
              <div className="directory-header">
                <h3>Staff Directory</h3>
                <p>Search and browse added staff members by role.</p>
              </div>
              <div className="directory-controls">
                <input
                  className="input-field"
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="Search by name"
                />
                <div className="filter-buttons">
                  {roleFilters.map((role) => (
                    <button
                      key={role}
                      className={`filter-btn ${directoryRoleFilter === role ? "active" : ""}`}
                      onClick={() => setDirectoryRoleFilter(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="directory-list">
                {filteredDirectory.map((entry) => (
                  <li key={entry.id}>
                    <span>{entry.name}</span>
                    <small>
                      {entry.role} • {entry.category}
                    </small>
                  </li>
                ))}
              </ul>
              {filteredDirectory.length === 0 && (
                <p className="no-data">No matching staff found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Student Management</h2>
                <p>{filteredStudents.length} student(s) in this section</p>
              </div>
              <div>
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={handleToggleAddForm}
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
            <div className="filter-section">
              <h3>Filter by level</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedStudentCategory === "All" ? "active" : ""}`}
                  onClick={() => setSelectedStudentCategory("All")}
                >
                  All
                </button>
                {gradeLevels.map((level) => (
                  <button
                    key={level}
                    className={`filter-btn ${selectedStudentCategory === level ? "active" : ""}`}
                    onClick={() => setSelectedStudentCategory(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            {showAddForm && renderAddForm()}
            {showAddSubjectForm && renderAddSubjectForm()}
            {filteredStudents.length === 0 ? (
              <p className="no-data">
                No students available for this level. Use the Add Student button
                to begin.
              </p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Class</th>
                    <th>School Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>
                        <button
                          className="entity-name-link"
                          onClick={() => handleStudentNameClick(student.id)}
                        >
                          {student.name}
                        </button>
                      </td>
                      <td>{student.category || "Preschool"}</td>
                      <td>{student.class}</td>
                      <td>KES {student.fee.toLocaleString()}</td>
                      <td>KES {student.paid.toLocaleString()}</td>
                      <td
                        className={
                          student.balance > 0 ? "balance-due" : "balance-paid"
                        }
                      >
                        KES {student.balance.toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveEntity(student.id)}
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
                    <p>{selectedStudent.performance?.remark}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Teacher Management</h2>
                <p>{filteredTeachers.length} teacher(s) in this section</p>
              </div>
              <button
                className="action-btn primary"
                onClick={handleToggleAddForm}
              >
                {showAddForm ? "Cancel" : "Add Teacher"}
              </button>
            </div>
            <div className="filter-section">
              <h3>Filter by level</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedTeacherCategory === "All" ? "active" : ""}`}
                  onClick={() => setSelectedTeacherCategory("All")}
                >
                  All
                </button>
                {gradeLevels.map((level) => (
                  <button
                    key={level}
                    className={`filter-btn ${selectedTeacherCategory === level ? "active" : ""}`}
                    onClick={() => setSelectedTeacherCategory(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            {showAddForm && renderAddForm()}
            {filteredTeachers.length === 0 ? (
              <p className="no-data">
                No teachers available for this level. Use the Add Teacher button
                to begin.
              </p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Level</th>
                    <th>Class</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.id}</td>
                      <td>
                        <button
                          className="entity-name-link"
                          onClick={() => handleTeacherNameClick(teacher.id)}
                        >
                          {teacher.name}
                        </button>
                      </td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.category || "Preschool"}</td>
                      <td>{teacher.class}</td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveEntity(teacher.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedTeacher && (
              <div className="detail-panel">
                <div className="detail-panel-header">
                  <h3>{selectedTeacher.name}</h3>
                  <span>
                    {selectedTeacher.category} • {selectedTeacher.class}
                  </span>
                </div>
                <div className="detail-grid">
                  <div className="detail-card">
                    <h4>Teaches</h4>
                    <ul className="detail-list">
                      {selectedTeacher.teaches.map((subject) => (
                        <li key={subject}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-card">
                    <h4>Performance</h4>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {selectedTeacher.performance.rating}/5
                    </p>
                    <p>
                      <strong>Average Class Score:</strong>{" "}
                      {selectedTeacher.performance.averageClassScore}%
                    </p>
                    <p>
                      <strong>Students:</strong>{" "}
                      {selectedTeacher.performance.students}
                    </p>
                    <p>{selectedTeacher.performance.remark}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "accountants" && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Accountant Management</h2>
                <p>{accountants.length} accountant(s) available</p>
              </div>
              <button
                className="action-btn primary"
                onClick={handleToggleAddForm}
              >
                {showAddForm ? "Cancel" : "Add Accountant"}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {accountants.length === 0 ? (
              <p className="no-data">
                No accountants available. Use the Add Accountant button to
                begin.
              </p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accountants.map((accountant) => (
                    <tr key={accountant.id}>
                      <td>{accountant.id}</td>
                      <td>{accountant.name}</td>
                      <td>
                        <span className="status-badge">
                          {accountant.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveEntity(accountant.id)}
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

        {activeTab === "finances" && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Finance Team Management</h2>
                <p>{financeTeam.length} finance team member(s)</p>
              </div>
              <button
                className="action-btn primary"
                onClick={handleToggleAddForm}
              >
                {showAddForm ? "Cancel" : "Add Finance Staff"}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {financeTeam.length === 0 ? (
              <p className="no-data">
                No finance staff available. Use the Add Finance Staff button to
                begin.
              </p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {financeTeam.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveEntity(member.id)}
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
      </main>
    </div>
  );
};

export default AdminDashboard;
