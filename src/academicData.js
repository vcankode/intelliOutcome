export const SESSIONS = ["2026–27", "2025–26", "2024–25"];

export const SECTIONS = ["A", "B", "C"];

export const PROGRAMS = [
  {
    id: "btech",
    name: "B.Tech",
    semesters: 8,
    branches: [
      { id: "it", code: "IT", name: "Information Technology" },
      { id: "ai", code: "AI", name: "Artificial Intelligence" },
      { id: "cs", code: "CS", name: "Computer Science" },
      { id: "bt", code: "BT", name: "Biotechnology" },
      { id: "mt", code: "MT", name: "MT" },
    ],
  },
  {
    id: "mca",
    name: "MCA",
    semesters: 6,
    branches: [{ id: "mca", code: "MCA", name: "Master of Computer Applications" }],
  },
];

// [title, credits] per semester (index 0 = semester 1)
const SUBJECTS = {
  btech: [
    [["Engineering Mathematics I", 4], ["Engineering Physics", 4], ["Programming in C", 4], ["Communication Skills", 2]],
    [["Engineering Mathematics II", 4], ["Basic Electronics", 3], ["Data Structures", 4], ["Environmental Studies", 2]],
    [["Discrete Mathematics", 4], ["Digital Logic Design", 4], ["Object Oriented Programming", 4], ["Economics for Engineers", 3]],
    [["Database Management Systems", 4], ["Operating Systems", 4], ["Computer Networks", 4], ["Software Engineering", 3]],
    [["Design & Analysis of Algorithms", 4], ["Machine Learning", 4], ["Web Technologies", 3], ["Compiler Design", 3]],
    [["Artificial Intelligence", 4], ["Cloud Computing", 3], ["Information Security", 3], ["Mini Project", 2]],
    [["Big Data Analytics", 4], ["Professional Elective I", 3], ["Internship Seminar", 2], ["Professional Ethics", 2]],
    [["Major Project", 8], ["Professional Elective II", 3]],
  ],
  mca: [
    [["Mathematical Foundations", 4], ["Programming in Python", 4], ["Computer Organisation", 3], ["Communication Skills", 2]],
    [["Data Structures", 4], ["Database Management Systems", 4], ["Operating Systems", 3], ["Probability & Statistics", 3]],
    [["Software Engineering", 4], ["Computer Networks", 4], ["Web Development", 3], ["Java Programming", 4]],
    [["Machine Learning", 4], ["Cloud Computing", 3], ["Cyber Security", 3], ["Professional Elective I", 3]],
    [["Big Data Analytics", 4], ["Data Visualisation", 3], ["Professional Elective II", 3], ["Seminar", 2]],
    [["Major Project", 12]],
  ],
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export const semesterLabel = (n) => `Semester ${ROMAN[n - 1] ?? n}`;

export const findProgram = (id) => PROGRAMS.find((p) => p.id === id) || null;

export const findBranch = (programId, branchId) =>
  findProgram(programId)?.branches.find((b) => b.id === branchId) || null;

// Course codes follow the admin dashboard scheme: <BRANCH><SEM><NN>, e.g. CS501
export function getCourses(programId, branchId, semester) {
  const branch = findBranch(programId, branchId);
  const subjects = SUBJECTS[programId]?.[semester - 1];
  if (!branch || !subjects) return [];

  return subjects.map(([title, credits], i) => ({
    code: `${branch.code}${semester}${String(i + 1).padStart(2, "0")}`,
    title,
    credits,
  }));
}