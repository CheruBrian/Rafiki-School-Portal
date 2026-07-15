import React, { useState } from "react";
import "./Dashboard.css";
import { API_BASE_URL } from "../config/api";

const defaultQuery = `SELECT current_database() AS database_name;`;

const SqlClient = () => {
  const [connection, setConnection] = useState({
    databaseType: "postgres",
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "",
    database: "postgres",
  });
  const [query, setQuery] = useState(defaultQuery);
  const [adminToken, setAdminToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setConnection((prev) => ({ ...prev, [name]: value }));
  };

  const runQuery = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ ...connection, query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SQL Client</h1>
        <p>Connect to PostgreSQL or MySQL and run SQL queries.</p>
      </header>

      <main className="dashboard-content">
        <div className="directory-card">
          <div className="form-row">
            <div className="form-field">
              <label>Database Type</label>
              <select
                name="databaseType"
                value={connection.databaseType}
                onChange={handleChange}
                className="select-field"
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>
            <div className="form-field">
              <label>Host</label>
              <input
                name="host"
                value={connection.host}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label>Port</label>
              <input
                name="port"
                value={connection.port}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>User</label>
              <input
                name="user"
                value={connection.user}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={connection.password}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label>Database</label>
              <input
                name="database"
                value={connection.database}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Admin token</label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="input-field"
              placeholder="Required to run queries"
            />
          </div>

          <div className="form-field">
            <label>SQL Query</label>
            <textarea
              rows="8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field"
              style={{ minHeight: "180px" }}
            />
          </div>

          <button
            className="action-btn primary"
            onClick={runQuery}
            disabled={loading}
          >
            {loading ? "Running..." : "Run Query"}
          </button>

          {error && (
            <p className="no-data" style={{ color: "#c92a2a" }}>
              {error}
            </p>
          )}

          {result && (
            <div style={{ marginTop: "20px" }}>
              <h3>Results</h3>
              <p>
                <strong>Rows:</strong> {result.rowCount}
              </p>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "12px",
                  borderRadius: "6px",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SqlClient;
