import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <p className="error-code">Error 403</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn-back"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
