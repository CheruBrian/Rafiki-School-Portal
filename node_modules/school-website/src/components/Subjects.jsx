// Subject sets grouped by grade level. Preschool, Lower Primary, and JSS
// share the same curriculum; SSS has its own broader subject list.
export const SUBJECTS_BY_LEVEL = {
  Preschool: [
    "Mathematics",
    "Science",
    "Kiswahili",
    "Social Studies",
    "English",
  ],
  "Lower Primary": [
    "Mathematics",
    "Science",
    "Kiswahili",
    "Social Studies",
    "English",
  ],
  JSS: ["Mathematics", "Science", "Kiswahili", "Social Studies", "English"],
  SSS: [
    "English",
    "Mathematics",
    "Physics",
    "Kiswahili",
    "Biology",
    "Chemistry",
    "History",
    "Geography",
    "Home Science",
    "Business Studies",
  ],
};

export const getSubjectsForLevel = (level) => SUBJECTS_BY_LEVEL[level] || [];

// Derive a letter grade from a numeric score - one source of truth instead
// of storing grade separately and letting it drift out of sync.
export const scoreToGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "E";
};

export const averageOf = (subjects = []) => {
  if (!subjects.length) return 0;
  const total = subjects.reduce(
    (sum, s) => sum + Number(s.score ?? s.marks ?? 0),
    0,
  );
  return total / subjects.length;
};
