import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "school.db");

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });

// Password hashing using Node's built-in crypto (scrypt) - no extra
// dependency needed. Stored as "salt:hash", both hex-encoded.
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = (storedHash || "").split(":");
  if (!salt || !hash) return false;
  const candidateHash = crypto.scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(hash, "hex");
  if (candidateHash.length !== storedHashBuffer.length) return false;
  return crypto.timingSafeEqual(candidateHash, storedHashBuffer);
};

// Kept in sync with src/constants/subjects.js scoreToGrade - duplicated
// here since db.js can't import from src/ (separate build contexts).
const scoreToGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "E";
};

const seedData = {
  students: [
    {
      id: 1,
      name: "John Doe",
      class: "A1",
      category: "Preschool",
      fee: 5000,
      paid: 3000,
      balance: 2000,
      grade: "A",
      marks: 85,
      subjects: [{ name: "Mathematics", score: 88 }],
      performance: {
        averageScore: 87,
        grade: "A",
        remark: "Very strong progress this term.",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "B2",
      category: "Primary",
      fee: 5000,
      paid: 5000,
      balance: 0,
      grade: "A",
      marks: 92,
      subjects: [{ name: "Reading", score: 92 }],
      performance: {
        averageScore: 92,
        grade: "A",
        remark: "Excellent performance across all subjects.",
      },
    },
  ],
  teachers: [
    {
      id: 1,
      name: "Mrs. Emma Wilson",
      subject: "Mathematics",
      class: "A1",
      category: "Preschool",
      teaches: ["Mathematics", "Early Literacy"],
      performance: {
        rating: 4.8,
        averageClassScore: 88,
        students: 24,
        remark: "Excellent classroom engagement and results.",
      },
    },
  ],
  accountants: [{ id: 1, name: "Mr. Alex Thompson", status: "Active" }],
  financeTeam: [{ id: 1, name: "Ms. Grace Mwangi", role: "Finance Officer" }],
  directory: [
    {
      id: 101,
      name: "Mrs. Emma Wilson",
      role: "Teacher",
      category: "Preschool",
    },
  ],
};

const createTables = async () => {
  await run(`PRAGMA foreign_keys = ON;`);

  await run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      category TEXT NOT NULL,
      fee REAL NOT NULL DEFAULT 0,
      paid REAL NOT NULL DEFAULT 0,
      balance REAL NOT NULL DEFAULT 0,
      grade TEXT NOT NULL,
      marks REAL NOT NULL DEFAULT 0,
      subjects TEXT NOT NULL,
      performance TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      class TEXT NOT NULL,
      category TEXT NOT NULL,
      teaches TEXT NOT NULL,
      performance TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS accountants (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS finance_team (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS directory (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const ensureSeedData = async () => {
  const [
    studentCount,
    teacherCount,
    accountantCount,
    financeCount,
    directoryCount,
  ] = await Promise.all([
    get("SELECT COUNT(*) AS count FROM students"),
    get("SELECT COUNT(*) AS count FROM teachers"),
    get("SELECT COUNT(*) AS count FROM accountants"),
    get("SELECT COUNT(*) AS count FROM finance_team"),
    get("SELECT COUNT(*) AS count FROM directory"),
  ]);

  if (studentCount.count === 0) {
    for (const student of seedData.students) {
      await run(
        `INSERT INTO students (id, name, class, category, fee, paid, balance, grade, marks, subjects, performance)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          student.id,
          student.name,
          student.class,
          student.category,
          student.fee,
          student.paid,
          student.balance,
          student.grade,
          student.marks,
          JSON.stringify(student.subjects),
          JSON.stringify(student.performance),
        ],
      );
    }
  }

  if (teacherCount.count === 0) {
    for (const teacher of seedData.teachers) {
      await run(
        `INSERT INTO teachers (id, name, subject, class, category, teaches, performance)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          teacher.id,
          teacher.name,
          teacher.subject,
          teacher.class,
          teacher.category,
          JSON.stringify(teacher.teaches),
          JSON.stringify(teacher.performance),
        ],
      );
    }
  }

  if (accountantCount.count === 0) {
    for (const accountant of seedData.accountants) {
      await run(
        `INSERT INTO accountants (id, name, status) VALUES (?, ?, ?);`,
        [accountant.id, accountant.name, accountant.status],
      );
    }
  }

  if (financeCount.count === 0) {
    for (const member of seedData.financeTeam) {
      await run(`INSERT INTO finance_team (id, name, role) VALUES (?, ?, ?);`, [
        member.id,
        member.name,
        member.role,
      ]);
    }
  }

  if (directoryCount.count === 0) {
    for (const entry of seedData.directory) {
      await run(
        `INSERT INTO directory (id, name, role, category) VALUES (?, ?, ?, ?);`,
        [entry.id, entry.name, entry.role, entry.category],
      );
    }
  }

  const userCount = await get("SELECT COUNT(*) AS count FROM users");
  if (userCount.count === 0) {
    // Demo accounts only. CHANGE THESE PASSWORDS (or replace this seed
    // entirely) before a real/public deployment - anyone who has read
    // this open-source repo knows these defaults.
    const demoUsers = [
      {
        username: "admin",
        name: "Administrator",
        role: "admin",
        password: "admin123",
      },
      {
        username: "accountant",
        name: "Accountant",
        role: "accountant",
        password: "accountant123",
      },
      {
        username: "teacher",
        name: "Teacher",
        role: "teacher",
        password: "teacher123",
      },
      {
        username: "parent",
        name: "Parent",
        role: "parent",
        password: "parent123",
      },
    ];
    for (const demoUser of demoUsers) {
      await run(
        `INSERT INTO users (username, name, role, password_hash) VALUES (?, ?, ?, ?);`,
        [
          demoUser.username,
          demoUser.name,
          demoUser.role,
          hashPassword(demoUser.password),
        ],
      );
    }
  }
};

const getNextId = async (tableName) => {
  const row = await get(`SELECT MAX(id) AS max_id FROM ${tableName}`);
  return (row?.max_id || 0) + 1;
};

const requiredColumns = {
  students: [
    "id",
    "name",
    "class",
    "category",
    "fee",
    "paid",
    "balance",
    "grade",
    "marks",
    "subjects",
    "performance",
    "created_at",
  ],
  teachers: [
    "id",
    "name",
    "subject",
    "class",
    "category",
    "teaches",
    "performance",
    "created_at",
  ],
  accountants: ["id", "name", "status", "created_at"],
  finance_team: ["id", "name", "role", "created_at"],
  directory: ["id", "name", "role", "category", "created_at"],
  users: ["id", "username", "name", "role", "password_hash", "created_at"],
};

const verifyDatabaseSchema = async () => {
  const integrityRow = await get("PRAGMA integrity_check");
  if (!integrityRow || integrityRow.integrity_check !== "ok") {
    return false;
  }

  for (const [tableName, columns] of Object.entries(requiredColumns)) {
    const tableInfo = await all(`PRAGMA table_info(${tableName})`);
    const existingColumns = new Set(tableInfo.map((column) => column.name));
    const missingColumns = columns.filter(
      (column) => !existingColumns.has(column),
    );

    if (missingColumns.length > 0) {
      return false;
    }
  }

  return true;
};

const rebuildDatabase = async () => {
  await run("PRAGMA foreign_keys = OFF;");
  await run("DROP TABLE IF EXISTS directory;");
  await run("DROP TABLE IF EXISTS finance_team;");
  await run("DROP TABLE IF EXISTS accountants;");
  await run("DROP TABLE IF EXISTS teachers;");
  await run("DROP TABLE IF EXISTS students;");
  await run("PRAGMA foreign_keys = ON;");
  await createTables();
  await ensureSeedData();
};

export const initializeDatabase = async () => {
  await createTables();

  const isSchemaValid = await verifyDatabaseSchema();
  if (!isSchemaValid) {
    await rebuildDatabase();
    return;
  }

  await ensureSeedData();
};

export const verifyCredentials = async (username, password) => {
  const user = await get(
    "SELECT id, username, name, role, password_hash FROM users WHERE username = ?",
    [username],
  );
  if (!user || !verifyPassword(password, user.password_hash)) {
    return null;
  }
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
};

export const getSchoolData = async () => {
  const [students, teachers, accountants, financeTeam, directory] =
    await Promise.all([
      all("SELECT * FROM students ORDER BY id DESC"),
      all("SELECT * FROM teachers ORDER BY id DESC"),
      all("SELECT * FROM accountants ORDER BY id DESC"),
      all("SELECT * FROM finance_team ORDER BY id DESC"),
      all("SELECT * FROM directory ORDER BY id DESC"),
    ]);

  return {
    students: students.map((student) => ({
      ...student,
      fee: Number(student.fee),
      paid: Number(student.paid),
      balance: Number(student.balance),
      marks: Number(student.marks),
      subjects: JSON.parse(student.subjects || "[]"),
      performance: JSON.parse(student.performance || "{}"),
    })),
    teachers: teachers.map((teacher) => ({
      ...teacher,
      teaches: JSON.parse(teacher.teaches || "[]"),
      performance: JSON.parse(teacher.performance || "{}"),
    })),
    accountants: accountants.map((accountant) => ({
      ...accountant,
    })),
    financeTeam: financeTeam.map((member) => ({
      ...member,
    })),
    directory: directory.map((entry) => ({
      ...entry,
    })),
  };
};

const insertDirectoryEntry = async (entityType, payload) => {
  const id = await getNextId("directory");
  await run(
    `INSERT INTO directory (id, name, role, category) VALUES (?, ?, ?, ?);`,
    [
      id,
      payload.name,
      payload.role || entityType,
      payload.category || "General",
    ],
  );
};

export const createSchoolEntity = async (entityType, payload = {}) => {
  const trimmedName = payload.name?.trim();
  if (!trimmedName) {
    throw new Error("A name is required.");
  }

  const entityMap = {
    students: {
      table: "students",
      sql: `INSERT INTO students (id, name, class, category, fee, paid, balance, grade, marks, subjects, performance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      values: async () => {
        const id = await getNextId("students");
        const fee = Number(payload.fee) || 0;
        const paid = Number(payload.paid) || 0;
        return [
          id,
          trimmedName,
          payload.class?.trim() || "A1",
          payload.category || "Preschool",
          fee,
          paid,
          Math.max(fee - paid, 0),
          payload.grade?.trim() || "TBD",
          Number(payload.marks) || 0,
          JSON.stringify(
            payload.subjects || [
              { name: "General Studies", score: Number(payload.marks) || 0 },
            ],
          ),
          JSON.stringify(
            payload.performance || {
              averageScore: Number(payload.marks) || 0,
              grade: payload.grade?.trim() || "TBD",
              remark: "Added from the school portal.",
            },
          ),
        ];
      },
    },
    teachers: {
      table: "teachers",
      sql: `INSERT INTO teachers (id, name, subject, class, category, teaches, performance)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
      values: async () => {
        const id = await getNextId("teachers");
        return [
          id,
          trimmedName,
          payload.subject?.trim() || "General Studies",
          payload.class?.trim() || "A1",
          payload.category || "Preschool",
          JSON.stringify(payload.teaches || ["General Studies"]),
          JSON.stringify(
            payload.performance || {
              rating: 4.5,
              averageClassScore: 0,
              students: 0,
              remark: "Added from the school portal.",
            },
          ),
        ];
      },
    },
    accountants: {
      table: "accountants",
      sql: `INSERT INTO accountants (id, name, status) VALUES (?, ?, ?);`,
      values: async () => {
        const id = await getNextId("accountants");
        return [id, trimmedName, payload.status || "Active"];
      },
    },
    finances: {
      table: "finance_team",
      sql: `INSERT INTO finance_team (id, name, role) VALUES (?, ?, ?);`,
      values: async () => {
        const id = await getNextId("finance_team");
        return [id, trimmedName, payload.role || "Finance Officer"];
      },
    },
  };

  const config = entityMap[entityType];
  if (!config) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  const values = await config.values();
  await run(config.sql, values);

  await insertDirectoryEntry(entityType, {
    name: trimmedName,
    role:
      entityType === "students"
        ? "Student"
        : entityType === "teachers"
          ? "Teacher"
          : entityType === "accountants"
            ? "Accountant"
            : "Finance Staff",
    category:
      payload.category ||
      (entityType === "accountants"
        ? "Admin"
        : entityType === "finances"
          ? "Finance"
          : "Preschool"),
  });

  return getSchoolData();
};

export const addStudentSubject = async (studentId, subject = {}) => {
  const subjectName = subject.name?.trim();
  if (!subjectName) {
    throw new Error("A subject name is required.");
  }

  const score = Number(subject.score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("Score must be a number between 0 and 100.");
  }

  const student = await get("SELECT * FROM students WHERE id = ?;", [
    studentId,
  ]);
  if (!student) {
    throw new Error("Student not found.");
  }

  const subjects = JSON.parse(student.subjects || "[]");
  const existingIndex = subjects.findIndex((s) => s.name === subjectName);

  if (existingIndex >= 0) {
    // Replace the score if the subject already exists, rather than
    // creating a duplicate entry.
    subjects[existingIndex] = { name: subjectName, score };
  } else {
    subjects.push({ name: subjectName, score });
  }

  const averageScore =
    subjects.reduce((sum, s) => sum + Number(s.score || 0), 0) /
    subjects.length;
  const grade = scoreToGrade(averageScore);

  const performance = {
    ...JSON.parse(student.performance || "{}"),
    averageScore,
    grade,
  };

  await run(
    `UPDATE students
     SET subjects = ?, performance = ?, marks = ?, grade = ?
     WHERE id = ?;`,
    [
      JSON.stringify(subjects),
      JSON.stringify(performance),
      averageScore,
      grade,
      studentId,
    ],
  );

  return getSchoolData();
};

export const updateStudentSubjectAssessments = async (
  studentId,
  subjectName,
  assessments = {},
) => {
  const normalizedSubjectName = subjectName?.trim();
  if (!normalizedSubjectName) {
    throw new Error("A subject name is required.");
  }

  const student = await get("SELECT * FROM students WHERE id = ?;", [
    studentId,
  ]);
  if (!student) {
    throw new Error("Student not found.");
  }

  const subjects = JSON.parse(student.subjects || "[]");
  const subjectIndex = subjects.findIndex(
    (subject) => subject.name === normalizedSubjectName,
  );
  if (subjectIndex < 0) {
    throw new Error("Subject not found.");
  }

  const currentSubject = subjects[subjectIndex];
  const nextAssessments = {
    cat1: Number(currentSubject.score || 0),
    assessment1: Number(currentSubject.score || 0),
    cat2: Number(currentSubject.score || 0),
    assessment2: Number(currentSubject.score || 0),
    finalExam: Number(currentSubject.score || 0),
    ...(currentSubject.assessments || {}),
    ...assessments,
  };
  const assessmentValues = [
    nextAssessments.cat1,
    nextAssessments.assessment1,
    nextAssessments.cat2,
    nextAssessments.assessment2,
    nextAssessments.finalExam,
  ].map(Number);

  if (
    assessmentValues.some(
      (value) => Number.isNaN(value) || value < 0 || value > 100,
    )
  ) {
    throw new Error("Assessment scores must be numbers between 0 and 100.");
  }

  const score =
    assessmentValues.reduce((sum, value) => sum + value, 0) /
    assessmentValues.length;
  subjects[subjectIndex] = {
    ...currentSubject,
    score,
    assessments: nextAssessments,
  };

  const averageScore =
    subjects.reduce((sum, subject) => sum + Number(subject.score || 0), 0) /
    subjects.length;
  const grade = scoreToGrade(averageScore);
  const performance = {
    ...JSON.parse(student.performance || "{}"),
    averageScore,
    grade,
  };

  await run(
    `UPDATE students
     SET subjects = ?, performance = ?, marks = ?, grade = ?
     WHERE id = ?;`,
    [
      JSON.stringify(subjects),
      JSON.stringify(performance),
      averageScore,
      grade,
      studentId,
    ],
  );

  return getSchoolData();
};

export const deleteSchoolEntity = async (entityType, id) => {
  const entityMap = {
    students: { table: "students", role: "Student" },
    teachers: { table: "teachers", role: "Teacher" },
    accountants: { table: "accountants", role: "Accountant" },
    finances: { table: "finance_team", role: "Finance Staff" },
  };

  const config = entityMap[entityType];
  if (!config) {
    throw new Error(`Unsupported entity type: ${entityType}`);
  }

  const entry = await get(`SELECT name FROM ${config.table} WHERE id = ?;`, [
    id,
  ]);
  if (!entry) {
    return getSchoolData();
  }

  await run(`DELETE FROM ${config.table} WHERE id = ?;`, [id]);
  await run(`DELETE FROM directory WHERE name = ? AND role = ?;`, [
    entry.name,
    config.role,
  ]);

  return getSchoolData();
};
