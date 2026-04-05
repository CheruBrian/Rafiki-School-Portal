import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - student grades for this teacher
  const studentGrades = [
    { 
      id: 1, 
      name: 'John Doe', 
      class: 'A1',
      grade: 'A',
      marks: 85,
      fee: 5000,
      paid: 3000,
      balance: 2000
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      class: 'A1',
      grade: 'B',
      marks: 78,
      fee: 5000,
      paid: 5000,
      balance: 0
    },
    { 
      id: 3, 
      name: 'Mike Wilson', 
      class: 'A1',
      grade: 'A',
      marks: 92,
      fee: 5000,
      paid: 2000,
      balance: 3000
    },
    { 
      id: 4, 
      name: 'Emma Davis', 
      class: 'A1',
      grade: 'B+',
      marks: 80,
      fee: 5000,
      paid: 4000,
      balance: 1000
    },
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return '#51cf66';
      case 'B':
      case 'B+':
        return '#4c6ef5';
      case 'C':
      case 'C+':
        return '#fcc419';
      default:
        return '#ff6b6b';
    }
  };

  const avgGrade = studentGrades.reduce((sum, s) => sum + s.marks, 0) / studentGrades.length;
  const totalBalance = studentGrades.reduce((sum, s) => sum + s.balance, 0);
  const allFeePaid = studentGrades.filter(s => s.balance === 0).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          My Students
        </button>
        <button 
          className={`nav-btn ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          Grades Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveTab('fees')}
        >
          Fees Status
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'students' && (
          <div className="tab-content">
            <h2>My Students</h2>
            <div className="teacher-info">
              <p><strong>Class:</strong> A1</p>
              <p><strong>Total Students:</strong> {studentGrades.length}</p>
              <p><strong>Average Marks:</strong> {avgGrade.toFixed(1)}</p>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>Marks</th>
                  <th>School Fee Balance</th>
                  <th>Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: getGradeColor(student.grade),
                        color: 'white',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {student.grade}
                      </span>
                    </td>
                    <td>{student.marks}</td>
                    <td className={student.balance > 0 ? 'balance-due' : 'balance-paid'}>
                      KES {student.balance.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${student.balance === 0 ? 'paid' : 'pending'}`}>
                        {student.balance === 0 ? 'Paid' : 'Outstanding'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="tab-content">
            <h2>Grades Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Average Class Mark</h3>
                <p className="stat-value">{avgGrade.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-value">{studentGrades.length}</p>
              </div>
              <div className="stat-card">
                <h3>Highest Mark</h3>
                <p className="stat-value">{Math.max(...studentGrades.map(s => s.marks))}</p>
              </div>
              <div className="stat-card">
                <h3>Lowest Mark</h3>
                <p className="stat-value">{Math.min(...studentGrades.map(s => s.marks))}</p>
              </div>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Student Performance</h3>
            <div style={{ overflowX: 'auto' }}>
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
                  {studentGrades.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.marks}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          backgroundColor: getGradeColor(student.grade),
                          color: 'white',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {student.grade}
                        </span>
                      </td>
                      <td>
                        <div style={{
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          height: '20px',
                          minWidth: '100px'
                        }}>
                          <div style={{
                            backgroundColor: getGradeColor(student.grade),
                            height: '100%',
                            width: `${(student.marks / 100) * 100}%`,
                            transition: 'width 0.3s'
                          }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="tab-content">
            <h2>Students Fee Status</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Outstanding</h3>
                <p className="stat-value">{totalBalance > 0 ? 'KES ' + totalBalance.toLocaleString() : '0'}</p>
              </div>
              <div className="stat-card">
                <h3>Fees Paid</h3>
                <p className="stat-value">{allFeePaid} of {studentGrades.length}</p>
              </div>
              <div className="stat-card">
                <h3>Collection Rate</h3>
                <p className="stat-value">{((allFeePaid / studentGrades.length) * 100).toFixed(0)}%</p>
              </div>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Fee Details</h3>
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
                {studentGrades.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>KES {student.fee.toLocaleString()}</td>
                    <td className="paid-amount">KES {student.paid.toLocaleString()}</td>
                    <td className={student.balance > 0 ? 'balance-due' : 'balance-paid'}>
                      KES {student.balance.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${student.balance === 0 ? 'paid' : 'pending'}`}>
                        {student.balance === 0 ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalBalance > 0 && (
              <div className="warning-section">
                <h3>⚠️ Fee Collection Alert</h3>
                <p>Total outstanding fee balance: KES {totalBalance.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
