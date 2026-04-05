import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for admin
  const students = [
    { id: 1, name: 'John Doe', class: 'A1', fee: 5000, paid: 3000, balance: 2000 },
    { id: 2, name: 'Jane Smith', class: 'B2', fee: 5000, paid: 5000, balance: 0 },
    { id: 3, name: 'Mike Johnson', class: 'A1', fee: 5000, paid: 2000, balance: 3000 },
  ];

  const teachers = [
    { id: 1, name: 'Mrs. Emma Wilson', subject: 'Mathematics', class: 'A1' },
    { id: 2, name: 'Mr. Robert Brown', subject: 'English', class: 'B2' },
    { id: 3, name: 'Mrs. Sarah Davis', subject: 'Science', class: 'A1' },
  ];

  const accountants = [
    { id: 1, name: 'Mr. Alex Thompson', status: 'Active' },
    { id: 2, name: 'Ms. Lisa Anderson', status: 'Active' },
  ];

  const totalStudents = students.length;
  const totalFees = students.reduce((sum, s) => sum + s.fee, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.paid, 0);
  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>School Administration Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button 
          className={`nav-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          Teachers
        </button>
        <button 
          className={`nav-btn ${activeTab === 'accountants' ? 'active' : ''}`}
          onClick={() => setActiveTab('accountants')}
        >
          Accountants
        </button>
        <button 
          className={`nav-btn ${activeTab === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveTab('finances')}
        >
          Finances
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-value">{totalStudents}</p>
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
                <p className="stat-value">KES {totalBalance.toLocaleString()}</p>
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
          </div>
        )}

        {activeTab === 'students' && (
          <div className="tab-content">
            <h2>Student Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>School Fee</th>
                  <th>Paid</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>KES {student.fee}</td>
                    <td>KES {student.paid}</td>
                    <td className={student.balance > 0 ? 'balance-due' : 'balance-paid'}>
                      KES {student.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="tab-content">
            <h2>Teacher Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'accountants' && (
          <div className="tab-content">
            <h2>Accountant Management</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accountants.map(accountant => (
                  <tr key={accountant.id}>
                    <td>{accountant.id}</td>
                    <td>{accountant.name}</td>
                    <td><span className="status-badge">{accountant.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="tab-content">
            <h2>Financial Summary</h2>
            <div className="finance-summary">
              <div className="finance-card">
                <h3>Total School Fees</h3>
                <p className="finance-value">KES {totalFees.toLocaleString()}</p>
              </div>
              <div className="finance-card">
                <h3>Total Paid</h3>
                <p className="finance-value">KES {totalPaid.toLocaleString()}</p>
              </div>
              <div className="finance-card">
                <h3>Outstanding Balance</h3>
                <p className="finance-value">KES {totalBalance.toLocaleString()}</p>
              </div>
              <div className="finance-card">
                <h3>Collection Rate</h3>
                <p className="finance-value">{((totalPaid / totalFees) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
