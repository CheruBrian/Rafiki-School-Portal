import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [entityForm, setEntityForm] = useState({
    name: '',
    subject: '',
    class: 'A1',
    fee: '5000',
    paid: '0',
    status: 'Active',
    role: 'Finance Officer'
  });

  const initialStudents = [
    { id: 1, name: 'John Doe', class: 'A1', fee: 5000, paid: 3000, balance: 2000 },
    { id: 2, name: 'Jane Smith', class: 'B2', fee: 5000, paid: 5000, balance: 0 },
    { id: 3, name: 'Mike Johnson', class: 'A1', fee: 5000, paid: 2000, balance: 3000 }
  ];

  const initialTeachers = [
    { id: 1, name: 'Mrs. Emma Wilson', subject: 'Mathematics', class: 'A1' },
    { id: 2, name: 'Mr. Robert Brown', subject: 'English', class: 'B2' },
    { id: 3, name: 'Mrs. Sarah Davis', subject: 'Science', class: 'A1' }
  ];

  const initialAccountants = [
    { id: 1, name: 'Mr. Alex Thompson', status: 'Active' },
    { id: 2, name: 'Ms. Lisa Anderson', status: 'Active' }
  ];

  const initialFinanceTeam = [
    { id: 1, name: 'Ms. Grace Mwangi', role: 'Finance Officer' },
    { id: 2, name: 'Mr. Samuel Oduor', role: 'Finance Manager' }
  ];

  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [accountants, setAccountants] = useState(initialAccountants);
  const [financeTeam, setFinanceTeam] = useState(initialFinanceTeam);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resetEntityForm = () => {
    setEntityForm({
      name: '',
      subject: '',
      class: 'A1',
      fee: '5000',
      paid: '0',
      status: 'Active',
      role: 'Finance Officer'
    });
  };

  const getEntityLabel = () => {
    switch (activeTab) {
      case 'students':
        return 'Student';
      case 'teachers':
        return 'Teacher';
      case 'accountants':
        return 'Accountant';
      case 'finances':
        return 'Finance Staff';
      default:
        return 'Item';
    }
  };

  const getActiveEntityCount = () => {
    switch (activeTab) {
      case 'students':
        return students.length;
      case 'teachers':
        return teachers.length;
      case 'accountants':
        return accountants.length;
      case 'finances':
        return financeTeam.length;
      default:
        return 0;
    }
  };

  const createNextId = (items) => {
    return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
  };

  const handleToggleAddForm = () => {
    if (showAddForm) {
      resetEntityForm();
    }
    setShowAddForm(!showAddForm);
  };

  const handleAddEntity = (event) => {
    event.preventDefault();
    if (!entityForm.name.trim()) return;

    switch (activeTab) {
      case 'students': {
        const fee = Number(entityForm.fee) || 0;
        const paid = Number(entityForm.paid) || 0;
        const newStudent = {
          id: createNextId(students),
          name: entityForm.name.trim(),
          class: entityForm.class.trim() || 'A1',
          fee,
          paid,
          balance: Math.max(fee - paid, 0)
        };
        setStudents([newStudent, ...students]);
        break;
      }
      case 'teachers': {
        const newTeacher = {
          id: createNextId(teachers),
          name: entityForm.name.trim(),
          subject: entityForm.subject.trim() || 'General Studies',
          class: entityForm.class.trim() || 'A1'
        };
        setTeachers([newTeacher, ...teachers]);
        break;
      }
      case 'accountants': {
        const newAccountant = {
          id: createNextId(accountants),
          name: entityForm.name.trim(),
          status: entityForm.status
        };
        setAccountants([newAccountant, ...accountants]);
        break;
      }
      case 'finances': {
        const newFinance = {
          id: createNextId(financeTeam),
          name: entityForm.name.trim(),
          role: entityForm.role
        };
        setFinanceTeam([newFinance, ...financeTeam]);
        break;
      }
      default:
        break;
    }

    resetEntityForm();
    setShowAddForm(false);
  };

  const handleRemoveEntity = (id) => {
    switch (activeTab) {
      case 'students':
        setStudents(students.filter(student => student.id !== id));
        break;
      case 'teachers':
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        break;
      case 'accountants':
        setAccountants(accountants.filter(accountant => accountant.id !== id));
        break;
      case 'finances':
        setFinanceTeam(financeTeam.filter(member => member.id !== id));
        break;
      default:
        break;
    }
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
              onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
              placeholder={`Enter ${entityLabel.toLowerCase()} name`}
              required
            />
          </div>

          {activeTab === 'teachers' && (
            <>
              <div className="form-field">
                <label htmlFor="entitySubject">Subject</label>
                <input
                  id="entitySubject"
                  className="input-field"
                  value={entityForm.subject}
                  onChange={(e) => setEntityForm({ ...entityForm, subject: e.target.value })}
                  placeholder="Mathematics, English, Science..."
                />
              </div>
              <div className="form-field">
                <label htmlFor="entityClass">Class</label>
                <input
                  id="entityClass"
                  className="input-field"
                  value={entityForm.class}
                  onChange={(e) => setEntityForm({ ...entityForm, class: e.target.value })}
                  placeholder="A1, B2, C3"
                />
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <div className="form-field">
                <label htmlFor="entityClass">Class</label>
                <input
                  id="entityClass"
                  className="input-field"
                  value={entityForm.class}
                  onChange={(e) => setEntityForm({ ...entityForm, class: e.target.value })}
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
                  onChange={(e) => setEntityForm({ ...entityForm, fee: e.target.value })}
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
                  onChange={(e) => setEntityForm({ ...entityForm, paid: e.target.value })}
                  placeholder="0"
                />
              </div>
            </>
          )}

          {activeTab === 'accountants' && (
            <div className="form-field">
              <label htmlFor="entityStatus">Status</label>
              <select
                id="entityStatus"
                className="select-field"
                value={entityForm.status}
                onChange={(e) => setEntityForm({ ...entityForm, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="form-field">
              <label htmlFor="entityRole">Finance Role</label>
              <select
                id="entityRole"
                className="select-field"
                value={entityForm.role}
                onChange={(e) => setEntityForm({ ...entityForm, role: e.target.value })}
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
          onClick={() => { setActiveTab('overview'); setShowAddForm(false); }}
        >
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => { setActiveTab('students'); setShowAddForm(false); }}
        >
          Students
        </button>
        <button 
          className={`nav-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('teachers'); setShowAddForm(false); }}
        >
          Teachers
        </button>
        <button 
          className={`nav-btn ${activeTab === 'accountants' ? 'active' : ''}`}
          onClick={() => { setActiveTab('accountants'); setShowAddForm(false); }}
        >
          Accountants
        </button>
        <button 
          className={`nav-btn ${activeTab === 'finances' ? 'active' : ''}`}
          onClick={() => { setActiveTab('finances'); setShowAddForm(false); }}
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
            <div className="tab-actions">
              <div>
                <h2>Student Management</h2>
                <p>{students.length} student(s) registered</p>
              </div>
              <button className="action-btn primary" onClick={handleToggleAddForm}>
                {showAddForm ? 'Cancel' : 'Add Student'}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {students.length === 0 ? (
              <p className="no-data">No students available. Use the Add Student button to begin.</p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>School Fee</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td>KES {student.fee.toLocaleString()}</td>
                      <td>KES {student.paid.toLocaleString()}</td>
                      <td className={student.balance > 0 ? 'balance-due' : 'balance-paid'}>
                        KES {student.balance.toLocaleString()}
                      </td>
                      <td>
                        <button className="btn-remove" onClick={() => handleRemoveEntity(student.id)}>
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

        {activeTab === 'teachers' && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Teacher Management</h2>
                <p>{teachers.length} teacher(s) on record</p>
              </div>
              <button className="action-btn primary" onClick={handleToggleAddForm}>
                {showAddForm ? 'Cancel' : 'Add Teacher'}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {teachers.length === 0 ? (
              <p className="no-data">No teachers available. Use the Add Teacher button to begin.</p>
            ) : (
              <table className="data-table entity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(teacher => (
                    <tr key={teacher.id}>
                      <td>{teacher.id}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.class}</td>
                      <td>
                        <button className="btn-remove" onClick={() => handleRemoveEntity(teacher.id)}>
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

        {activeTab === 'accountants' && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Accountant Management</h2>
                <p>{accountants.length} accountant(s) available</p>
              </div>
              <button className="action-btn primary" onClick={handleToggleAddForm}>
                {showAddForm ? 'Cancel' : 'Add Accountant'}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {accountants.length === 0 ? (
              <p className="no-data">No accountants available. Use the Add Accountant button to begin.</p>
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
                  {accountants.map(accountant => (
                    <tr key={accountant.id}>
                      <td>{accountant.id}</td>
                      <td>{accountant.name}</td>
                      <td><span className="status-badge">{accountant.status}</span></td>
                      <td>
                        <button className="btn-remove" onClick={() => handleRemoveEntity(accountant.id)}>
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

        {activeTab === 'finances' && (
          <div className="tab-content">
            <div className="tab-actions">
              <div>
                <h2>Finance Team Management</h2>
                <p>{financeTeam.length} finance team member(s)</p>
              </div>
              <button className="action-btn primary" onClick={handleToggleAddForm}>
                {showAddForm ? 'Cancel' : 'Add Finance Staff'}
              </button>
            </div>
            {showAddForm && renderAddForm()}
            {financeTeam.length === 0 ? (
              <p className="no-data">No finance staff available. Use the Add Finance Staff button to begin.</p>
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
                  {financeTeam.map(member => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>
                        <button className="btn-remove" onClick={() => handleRemoveEntity(member.id)}>
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
