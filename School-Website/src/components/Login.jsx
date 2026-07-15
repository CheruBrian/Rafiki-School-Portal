import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("admin");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(userType, password);
    setSubmitting(false);

    if (result.success) {
      // Redirect based on role
      switch (userType) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "accountant":
          navigate("/accountant-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "parent":
          navigate("/parent-dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>School Portal Login</h1>
        <p className="subtitle">Select your role and login</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                setPassword("");
                setError("");
              }}
              className="form-control"
            >
              <option value="admin">Administrator</option>
              <option value="accountant">Accountant</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password"
              className="form-control"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>

          <div className="credentials-info">
            <p>
              <strong>Demo Credentials:</strong>
            </p>
            <ul>
              <li>Admin: User Type: Administrator | Password: admin123</li>
              <li>
                Accountant: User Type: Accountant | Password: accountant123
              </li>
              <li>Teacher: User Type: Teacher | Password: teacher123</li>
              <li>Parent: User Type: Parent | Password: parent123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
