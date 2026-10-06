import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);

    if (result.success) {
      switch (result.user.role) {
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
        <p className="subtitle">Sign in to your school account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter username"
              className="form-control"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="form-control password-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0013.42 13.42" />
                    <path d="M9.88 5.36A10.94 10.94 0 0112 5c4.97 0 8.5 4.1 10 7-1.04 1.9-2.62 3.62-4.5 4.8" />
                    <path d="M14.12 18.64A10.94 10.94 0 0112 19c-4.97 0-8.5-4.1-10-7 1.04-1.9 2.62-3.62 4.5-4.8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>

          <div className="credentials-info">
            <p>
              <strong>Demo Accounts:</strong>
            </p>
            <ul>
              <li>Admin: admin / admin123</li>
              <li>Accountant: accountant / accountant123</li>
              <li>Teacher: teacher / teacher123</li>
              <li>Parent: parent / parent123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
