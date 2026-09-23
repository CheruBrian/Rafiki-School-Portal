import express from "express";
import cors from "cors";
import pkg from "pg";
import mysql from "mysql2/promise";
import {
  initializeDatabase,
  getSchoolData,
  createSchoolEntity,
  deleteSchoolEntity,
  addStudentSubject,
  updateStudentSubjectAssessments,
  verifyCredentials,
} from "./db.js";

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await verifyCredentials(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Demo token - not a real session/JWT, fine for local/demo use only
    const token = Buffer.from(`${user.username}:${Date.now()}`).toString(
      "base64",
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/school-data", async (_req, res) => {
  try {
    const schoolData = await getSchoolData();
    res.json({ ok: true, data: schoolData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/school-data/:entityType", async (req, res) => {
  try {
    const schoolData = await createSchoolEntity(
      req.params.entityType,
      req.body,
    );
    res.json({ ok: true, data: schoolData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/school-data/:entityType/:id", async (req, res) => {
  try {
    const schoolData = await deleteSchoolEntity(
      req.params.entityType,
      Number(req.params.id),
    );
    res.json({ ok: true, data: schoolData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/school-data/students/:id/subjects", async (req, res) => {
  try {
    const schoolData = await addStudentSubject(Number(req.params.id), req.body);
    res.json({ ok: true, data: schoolData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch(
  "/api/school-data/students/:id/subjects/:subjectName/assessments",
  async (req, res) => {
    try {
      const schoolData = await updateStudentSubjectAssessments(
        Number(req.params.id),
        decodeURIComponent(req.params.subjectName),
        req.body,
      );
      res.json({ ok: true, data: schoolData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

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

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`School backend listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
