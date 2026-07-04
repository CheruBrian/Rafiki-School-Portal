import express from "express";
import cors from "cors";
import pkg from "pg";
import mysql from "mysql2/promise";

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/query", async (req, res) => {
  const { databaseType, host, port, user, password, database, query } =
    req.body;

  if (!databaseType || !host || !user || !database || !query) {
    return res
      .status(400)
      .json({ error: "Missing required connection details." });
  }

  try {
    let connection;
    let result;

    if (databaseType === "postgres") {
      const pool = new Pool({
        host,
        port: Number(port || 5432),
        user,
        password,
        database,
      });
      result = await pool.query(query);
      await pool.end();
    } else if (databaseType === "mysql") {
      connection = await mysql.createConnection({
        host,
        port: Number(port || 3306),
        user,
        password,
        database,
      });
      const [rows] = await connection.execute(query);
      result = { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
      await connection.end();
    } else {
      return res.status(400).json({ error: "Unsupported database type." });
    }

    res.json({
      ok: true,
      data: result.rows || result,
      rowCount:
        result.rowCount ??
        (Array.isArray(result.rows) ? result.rows.length : 0),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`SQL client server listening on port ${port}`);
});
