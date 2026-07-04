-- PostgreSQL schema for a school management system
-- Production-ready, normalized, and role-aware

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'accountant', 'parent');
CREATE TYPE fee_status AS ENUM ('unpaid', 'partial', 'paid');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

CREATE TABLE teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_teachers_user_id ON teachers (user_id);
CREATE INDEX idx_teachers_department ON teachers (department);

CREATE TABLE parents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    contact_number VARCHAR(30),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parents_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_parents_user_id ON parents (user_id);

CREATE TABLE accountants (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Finance',
    phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accountants_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_accountants_user_id ON accountants (user_id);

CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    homeroom_teacher_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classes_homeroom_teacher
        FOREIGN KEY (homeroom_teacher_id) REFERENCES teachers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_classes_homeroom_teacher_id ON classes (homeroom_teacher_id);

CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_name ON subjects (name);

CREATE TABLE teacher_subject_class (
    teacher_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (teacher_id, subject_id, class_id),
    CONSTRAINT fk_tsc_teacher
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tsc_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tsc_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_tsc_teacher_id ON teacher_subject_class (teacher_id);
CREATE INDEX idx_tsc_subject_id ON teacher_subject_class (subject_id);
CREATE INDEX idx_tsc_class_id ON teacher_subject_class (class_id);

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id BIGINT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    parent_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_students_parent
        FOREIGN KEY (parent_id) REFERENCES parents(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_students_class_id ON students (class_id);
CREATE INDEX idx_students_parent_id ON students (parent_id);
CREATE INDEX idx_students_name ON students (last_name, first_name);

CREATE TABLE grades (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    grade_value NUMERIC(5,2),
    grade_letter VARCHAR(5),
    term VARCHAR(20) NOT NULL,
    date_recorded TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_grades_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_grades_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_grades_teacher
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_grade_value_or_letter
        CHECK (grade_value IS NOT NULL OR grade_letter IS NOT NULL),
    CONSTRAINT chk_grade_value_range
        CHECK (grade_value IS NULL OR grade_value BETWEEN 0 AND 100)
);

CREATE INDEX idx_grades_student_id ON grades (student_id);
CREATE INDEX idx_grades_subject_id ON grades (subject_id);
CREATE INDEX idx_grades_teacher_id ON grades (teacher_id);
CREATE INDEX idx_grades_term ON grades (term);

CREATE TABLE fees (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    due_date DATE NOT NULL,
    class_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fees_class
        FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_fees_class_id ON fees (class_id);
CREATE INDEX idx_fees_due_date ON fees (due_date);

CREATE TABLE fee_assignments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fee_structure_id BIGINT NOT NULL,
    amount_due NUMERIC(10,2) NOT NULL CHECK (amount_due >= 0),
    due_date DATE NOT NULL,
    status fee_status NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fee_assignments_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fee_assignments_fee
        FOREIGN KEY (fee_structure_id) REFERENCES fees(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_fee_assignments_student_id ON fee_assignments (student_id);
CREATE INDEX idx_fee_assignments_status ON fee_assignments (status);
CREATE INDEX idx_fee_assignments_due_date ON fee_assignments (due_date);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fee_assignment_id BIGINT,
    amount_paid NUMERIC(10,2) NOT NULL CHECK (amount_paid > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_payments_fee_assignment
        FOREIGN KEY (fee_assignment_id) REFERENCES fee_assignments(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_payments_student_id ON payments (student_id);
CREATE INDEX idx_payments_fee_assignment_id ON payments (fee_assignment_id);
CREATE INDEX idx_payments_payment_date ON payments (payment_date);

-- Seed data
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@example.com', 'hash_admin', 'admin', 'System Administrator'),
('teacher1@example.com', 'hash_teacher', 'teacher', 'Mrs. Jane Mwangi'),
('accountant1@example.com', 'hash_accountant', 'accountant', 'Mr. David Otieno'),
('parent1@example.com', 'hash_parent', 'parent', 'Mrs. Grace Wanjiku'),
('parent2@example.com', 'hash_parent', 'parent', 'Mr. Peter Kimani');

INSERT INTO teachers (user_id, hire_date, department, phone, address) VALUES
(2, '2020-01-15', 'Mathematics', '0712345678', 'Nairobi');

INSERT INTO accountants (user_id, hire_date, department, phone) VALUES
(3, '2019-06-01', 'Finance', '0723456789');

INSERT INTO parents (user_id, contact_number, address) VALUES
(4, '0734567890', 'Kikuyu'),
(5, '0745678901', 'Kisumu');

INSERT INTO classes (name, homeroom_teacher_id) VALUES
('Grade 7A', 1),
('Grade 8B', 1);

INSERT INTO subjects (name) VALUES
('Mathematics'),
('English'),
('Science');

INSERT INTO teacher_subject_class (teacher_id, subject_id, class_id) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 1, 2);

INSERT INTO students (first_name, last_name, date_of_birth, class_id, enrollment_date, parent_id) VALUES
('John', 'Mwangi', '2012-05-10', 1, '2023-01-15', 1),
('Aisha', 'Kimani', '2011-09-02', 2, '2022-09-01', 2),
('Brian', 'Wanjiku', '2013-02-20', 1, '2023-01-16', 1);

INSERT INTO grades (student_id, subject_id, teacher_id, grade_value, grade_letter, term) VALUES
(1, 1, 1, 88.00, 'A', 'Term 1'),
(1, 2, 1, 76.00, 'B', 'Term 1'),
(2, 1, 1, 92.00, 'A', 'Term 1'),
(3, 1, 1, 70.00, 'B-', 'Term 1');

INSERT INTO fees (description, amount, due_date, class_id) VALUES
('School Tuition', 50000.00, '2026-07-31', 1),
('School Tuition', 55000.00, '2026-07-31', 2);

INSERT INTO fee_assignments (student_id, fee_structure_id, amount_due, due_date, status) VALUES
(1, 1, 50000.00, '2026-07-31', 'partial'),
(2, 2, 55000.00, '2026-07-31', 'unpaid'),
(3, 1, 50000.00, '2026-07-31', 'paid');

INSERT INTO payments (student_id, fee_assignment_id, amount_paid, payment_date, payment_method, receipt_number) VALUES
(1, 1, 30000.00, '2026-06-15', 'Mpesa', 'RCPT-001'),
(3, 3, 50000.00, '2026-06-20', 'Bank Transfer', 'RCPT-002');

-- Example queries
-- Admin
SELECT s.id, s.first_name, s.last_name, c.name AS class_name, u.full_name AS parent_name
FROM students s
JOIN classes c ON c.id = s.class_id
LEFT JOIN parents p ON p.id = s.parent_id
LEFT JOIN users u ON u.id = p.user_id
ORDER BY s.last_name, s.first_name;

-- Teacher
SELECT s.id, s.first_name, s.last_name, c.name AS class_name, sub.name AS subject_name, g.grade_value, g.grade_letter, g.term
FROM teacher_subject_class tsc
JOIN teachers t ON t.id = tsc.teacher_id
JOIN classes c ON c.id = tsc.class_id
JOIN subjects sub ON sub.id = tsc.subject_id
JOIN students s ON s.class_id = tsc.class_id
LEFT JOIN grades g ON g.student_id = s.id AND g.subject_id = tsc.subject_id AND g.teacher_id = tsc.teacher_id
WHERE tsc.teacher_id = 1
ORDER BY s.last_name, s.first_name, sub.name;

-- Accountant
SELECT s.id, s.first_name, s.last_name, c.name AS class_name,
       COALESCE(SUM(fa.amount_due), 0) AS total_due,
       COALESCE(SUM(p.amount_paid), 0) AS total_paid,
       COALESCE(SUM(fa.amount_due), 0) - COALESCE(SUM(p.amount_paid), 0) AS outstanding_balance
FROM students s
JOIN classes c ON c.id = s.class_id
LEFT JOIN fee_assignments fa ON fa.student_id = s.id
LEFT JOIN payments p ON p.fee_assignment_id = fa.id
GROUP BY s.id, s.first_name, s.last_name, c.name
HAVING COALESCE(SUM(fa.amount_due), 0) - COALESCE(SUM(p.amount_paid), 0) > 0
ORDER BY outstanding_balance DESC;

-- Parent
SELECT s.first_name, s.last_name, c.name AS class_name, sub.name AS subject_name, g.grade_value, g.grade_letter, g.term
FROM students s
JOIN classes c ON c.id = s.class_id
LEFT JOIN grades g ON g.student_id = s.id
LEFT JOIN subjects sub ON sub.id = g.subject_id
JOIN parents pr ON pr.id = s.parent_id
JOIN users u ON u.id = pr.user_id
WHERE u.id = 4
ORDER BY s.last_name, s.first_name, sub.name;

-- Suggested RLS concept for PostgreSQL
-- In production, create helper functions that inspect current_setting('app.user_id')
-- and current_setting('app.user_role') and enforce teacher/parent/accountant access.
