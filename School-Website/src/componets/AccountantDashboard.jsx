import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

const AccountantDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [filterClass, setFilterClass] = useState('All');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock student data
  const students = [
    { id: 1, name: 'John Doe', class: 'A1', fee: 5000, paid: 3000, balance: 2000 },
    { id: 2, name: 'Jane Smith', class: 'B2', fee: 5000, paid: 5000, balance: 0 },
    { id: 3, name: 'Mike Johnson', class: 'A1', fee: 5000, paid: 2000, balance: 3000 },
    { id: 4, name: 'Sarah Williams', class: 'B2', fee: 5000, paid: 4000, balance: 1000 },
    { id: 5, name: 'David Brown', class: 'A1', fee: 5000, paid: 1000, balance: 4000 },
  ];

  const classes = ['All', 'A1', 'B2'];
  
  const filteredStudents = filterClass === 'All' 
    ? students 
    : students.filter(s => s.class === filterClass);

  const totalBalance = filteredStudents.reduce((sum, s) => sum + s.balance, 0);
  const totalFees = filteredStudents.reduce((sum, s) => sum + s.fee, 0);
  const totalPaid = filteredStudents.reduce((sum, s) => sum + s.paid, 0);
  const studentsWithBalance = filteredStudents.filter(s => s.balance > 0).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Accountant Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
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
              <p className="stat-value outstanding">KES {totalBalance.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Students with Balance</h3>
              <p className="stat-value">{studentsWithBalance}</p>
            </div>
            <div className="stat-card">
              <h3>Collection Rate</h3>
              <p className="stat-value">{totalFees > 0 ? ((totalPaid / totalFees) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Filter by Class:</h3>
          <div className="filter-buttons">
            {classes.map(cls => (
              <button
                key={cls}
                className={`filter-btn ${filterClass === cls ? 'active' : ''}`}
                onClick={() => setFilterClass(cls)}
              >
                {cls}
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
                <th>Class</th>
                <th>School Fee</th>
                <th>Amount Paid</th>
                <th>Balance (School Fee Left)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>KES {student.fee.toLocaleString()}</td>
                  <td className="paid-amount">KES {student.paid.toLocaleString()}</td>
                  <td className={student.balance > 0 ? 'balance-due' : 'balance-paid'}>
                    KES {student.balance.toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-badge ${student.balance === 0 ? 'paid' : 'pending'}`}>
                      {student.balance === 0 ? 'Paid' : 'Pending'}
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
            <p>{studentsWithBalance} student(s) have outstanding school fees totaling KES {totalBalance.toLocaleString()}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountantDashboard;
