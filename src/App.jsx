import { useState } from "react";
import Landing from "../Landing.jsx";
import UserTypeSelect from "../UserTypeSelect.jsx";
import TeacherAuth from "./TeacherAuth.jsx";
import AdminAuth from "./AdminAuth.jsx";
const menuItems = [
  { name: "Dashboard", icon: "⌂" },
  { name: "My Courses", icon: "▣" },
  { name: "Question Papers", icon: "▤" },
  { name: "CO–PO Mapping", icon: "◎" },
  { name: "Students & Marks", icon: "♙" },
  { name: "Attainment", icon: "◒" },
  { name: "AI Insights", icon: "✦" },
  { name: "Reports", icon: "▥" },
];

const courses = [
  {
    code: "CS301",
    name: "Data Structures & Algorithms",
    students: 62,
    attainment: 78,
    color: "bg-blue-600",
  },
  {
    code: "CS302",
    name: "Object Oriented Programming",
    students: 58,
    attainment: 84,
    color: "bg-indigo-600",
  },
  {
    code: "CS305",
    name: "Database Management Systems",
    students: 61,
    attainment: 71,
    color: "bg-violet-600",
  },
];

function App() {
  const [started, setStarted] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [currentScreen, setCurrentScreen] = useState("landing");

  
  if (currentScreen === "landing") {
    return (
      <Landing
        onLogin={() => setCurrentScreen("userType")}
        onSignup={() => setCurrentScreen("userType")}
      />
    );
  }

  if (currentScreen === "userType") {
    return (
      <UserTypeSelect
        onSelect={(type) => {
          if (type === "teacher") {
            setCurrentScreen("teacherAuth");
          } else {
           setCurrentScreen("adminAuth");
          }
        }}
      />
    );
  }
  if (currentScreen === "teacherAuth") {
      return (
        <TeacherAuth
          onLoginSuccess={() => setCurrentScreen("dashboard")}
        />
      );
  }
  if (currentScreen === "adminAuth") {
  return (
    <AdminAuth
      onLoginSuccess={() => {
        window.location.href = "/admin-dashboard/index.html";
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#142d55] text-white flex flex-col">

        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#142d55] font-bold mr-3">
            IO
          </div>

          <div>
            <h1 className="font-bold text-lg">IntelliOutcome</h1>
            <p className="text-xs text-blue-200">Academic Analytics</p>
          </div>
        </div>

        <div className="px-4 pt-7 flex-1">
          <p className="text-xs uppercase tracking-wider text-blue-200 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition ${
                  activePage === item.name
                    ? "bg-white text-[#142d55] shadow"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <span className="text-xl w-6 text-center">
                  {item.icon}
                </span>

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <div className="w-10 h-10 rounded-full bg-blue-200 text-[#142d55] flex items-center justify-center font-bold">
              VK
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                Faculty Member
              </p>
              <p className="text-xs text-blue-200 truncate">
                Computer Science
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="ml-64 flex-1">

        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {activePage}
            </h2>

            <p className="text-sm text-gray-400">
              Academic Session 2026–27
            </p>
          </div>

          <div className="flex items-center gap-5">

            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white">
              <option>Semester VI</option>
              <option>Semester V</option>
              <option>Semester IV</option>
            </select>

            <button className="relative text-gray-500 text-xl">
              ♢
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#1d3968] text-white flex items-center justify-center font-semibold">
              VK
            </div>

          </div>
        </header>

        <div className="p-8">

          {activePage === "Dashboard" && (
            <Dashboard setActivePage={setActivePage} />
          )}

          {activePage === "My Courses" && <Courses />}

          {activePage === "Question Papers" && <QuestionPapers />}

          {activePage === "CO–PO Mapping" && <Mapping />}

          {activePage === "Students & Marks" && <Students />}

          {activePage === "Attainment" && <Attainment />}

          {activePage === "AI Insights" && <AIInsights />}

          {activePage === "Reports" && <Reports />}

        </div>
      </main>
    </div>
  );
}


/* ================= DASHBOARD ================= */

function Dashboard({ setActivePage }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Good morning, Faculty Member 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Here's what's happening with your courses and academic outcomes.
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="My Courses"
          value="3"
          subtitle="Active courses"
          icon="▣"
        />

        <StatCard
          title="Total Students"
          value="181"
          subtitle="Across all sections"
          icon="♙"
        />

        <StatCard
          title="Average CO Attainment"
          value="77.6%"
          subtitle="+5.2% from last assessment"
          icon="◒"
          positive
        />

        <StatCard
          title="Pending Tasks"
          value="4"
          subtitle="Requires your attention"
          icon="!"
          warning
        />

      </div>

      {/* QUICK ACTIONS */}

      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-400">
              Frequently used academic tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <ActionButton
            icon="↑"
            title="Upload Question Paper"
            onClick={() => setActivePage("Question Papers")}
          />

          <ActionButton
            icon="↥"
            title="Upload Marks"
            onClick={() => setActivePage("Students & Marks")}
          />

          <ActionButton
            icon="◎"
            title="CO–PO Mapping"
            onClick={() => setActivePage("CO–PO Mapping")}
          />

          <ActionButton
            icon="▥"
            title="Generate Report"
            onClick={() => setActivePage("Reports")}
          />

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* CHART */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                CO Attainment Overview
              </h2>
              <p className="text-sm text-gray-400">
                Current semester performance
              </p>
            </div>

            <span className="text-sm text-gray-400">
              Target: 70%
            </span>
          </div>

          <div className="mt-8 space-y-5">

            {[
              ["CO1", 82],
              ["CO2", 76],
              ["CO3", 69],
              ["CO4", 84],
              ["CO5", 73],
            ].map(([co, value]) => (
              <div key={co}>

                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-600">
                    {co}
                  </span>

                  <span className="font-semibold text-gray-700">
                    {value}%
                  </span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      value >= 70 ? "bg-[#1d3968]" : "bg-orange-400"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* AI CARD */}

        <div className="bg-[#142d55] rounded-2xl p-6 text-white">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
              ✦
            </div>

            <div>
              <h2 className="font-bold text-lg">
                AI Insights
              </h2>

              <p className="text-blue-200 text-sm">
                Intelligent analysis
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">

            <Insight
              title="CO3 needs attention"
              text="Attainment is 69%, below the target threshold."
            />

            <Insight
              title="Topic weakness detected"
              text="Graph algorithms show lower student performance."
            />

            <Insight
              title="Suggested action"
              text="Conduct additional practice on traversal algorithms."
            />

          </div>

          <button
            onClick={() => setActivePage("AI Insights")}
            className="mt-7 w-full bg-white text-[#142d55] py-3 rounded-xl font-semibold"
          >
            View AI Analysis →
          </button>

        </div>

      </div>

      {/* COURSES */}

      <div className="mt-8">

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              My Courses
            </h2>

            <p className="text-sm text-gray-400">
              Your currently assigned courses
            </p>
          </div>

          <button
            onClick={() => setActivePage("My Courses")}
            className="text-[#1d3968] font-semibold text-sm"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>

      </div>
    </>
  );
}


/* ================= COMPONENTS ================= */

function StatCard({ title, value, subtitle, icon, positive, warning }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">

      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
            warning
              ? "bg-orange-50 text-orange-500"
              : "bg-blue-50 text-[#1d3968]"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`text-xs mt-4 ${
          positive
            ? "text-green-600"
            : warning
            ? "text-orange-500"
            : "text-gray-400"
        }`}
      >
        {subtitle}
      </p>

    </div>
  );
}


function ActionButton({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-4 text-left hover:border-[#1d3968] hover:shadow-sm transition"
    >
      <div className="w-10 h-10 bg-blue-50 text-[#1d3968] rounded-lg flex items-center justify-center text-xl">
        {icon}
      </div>

      <p className="font-semibold text-gray-700 mt-3 text-sm">
        {title}
      </p>
    </button>
  );
}


function Insight({ title, text }) {
  return (
    <div className="border-l-2 border-blue-300 pl-4">
      <p className="font-semibold text-sm">
        {title}
      </p>

      <p className="text-blue-100 text-xs mt-1 leading-5">
        {text}
      </p>
    </div>
  );
}


function CourseCard({ course }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">

      <div className="flex justify-between">
        <span className={`${course.color} text-white px-3 py-1 rounded-lg text-xs font-bold`}>
          {course.code}
        </span>

        <span className="text-xs text-gray-400">
          {course.students} students
        </span>
      </div>

      <h3 className="font-bold text-gray-800 mt-5">
        {course.name}
      </h3>

      <div className="mt-5">

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">
            CO Attainment
          </span>

          <span className="font-bold text-gray-700">
            {course.attainment}%
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-full bg-[#1d3968] rounded-full"
            style={{ width: `${course.attainment}%` }}
          />
        </div>

      </div>

      <button className="mt-5 text-sm font-semibold text-[#1d3968]">
        View Course →
      </button>

    </div>
  );
}


/* ================= OTHER PAGES ================= */

function Courses() {
  return (
    <Page title="My Courses" subtitle="Manage your assigned courses and sections.">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseCard key={course.code} course={course} />
        ))}
      </div>
    </Page>
  );
}


function QuestionPapers() {
  return (
    <Page title="Question Papers" subtitle="Upload, analyze and validate question papers.">

      <div className="bg-white rounded-2xl border border-gray-200 p-8">

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">

          <div className="text-4xl">↑</div>

          <h2 className="font-bold text-gray-700 mt-4">
            Upload Question Paper
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            PDF files supported
          </p>

          <button className="mt-5 bg-[#1d3968] text-white px-6 py-3 rounded-xl">
            Choose File
          </button>

        </div>

        <div className="mt-7">
          <h3 className="font-bold text-gray-700">
            Recent Question Papers
          </h3>

          <div className="mt-4 space-y-3">
            {["Mid Term Examination", "End Semester Examination", "Class Test – II"].map(
              (paper) => (
                <div
                  key={paper}
                  className="flex justify-between items-center border border-gray-100 p-4 rounded-xl"
                >
                  <span className="font-medium text-gray-700">
                    {paper}
                  </span>

                  <span className="text-green-600 text-sm">
                    ✓ Analyzed
                  </span>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </Page>
  );
}


function Mapping() {
  return (
    <Page title="CO–PO Mapping" subtitle="Map Course Outcomes with Program Outcomes.">

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        <div className="p-6 border-b">
          <h3 className="font-bold text-gray-800">
            CO–PO Mapping Matrix
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            AI-generated mapping awaiting faculty approval
          </p>
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Course Outcome</th>
              <th className="p-4">PO1</th>
              <th className="p-4">PO2</th>
              <th className="p-4">PO3</th>
              <th className="p-4">PO4</th>
              <th className="p-4">PO5</th>
            </tr>
          </thead>

          <tbody>
            {[
              ["CO1", "3", "2", "1", "-", "2"],
              ["CO2", "2", "3", "2", "1", "-"],
              ["CO3", "1", "2", "3", "2", "1"],
              ["CO4", "2", "1", "2", "3", "2"],
            ].map((row) => (
              <tr key={row[0]} className="border-t">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`p-4 text-center ${
                      i === 0 ? "font-semibold text-left" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </Page>
  );
}


function Students() {
  return (
    <Page title="Students & Marks" subtitle="Manage student marks and assessment data.">

      <div className="bg-white border border-gray-200 rounded-2xl p-6">

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">
              Student Marks
            </h3>

            <p className="text-sm text-gray-400">
              CS301 · Section A
            </p>
          </div>

          <button className="bg-[#1d3968] text-white px-5 py-2.5 rounded-lg text-sm">
            Upload Excel
          </button>
        </div>

        <div className="overflow-x-auto mt-6">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4">CO1</th>
                <th className="p-4">CO2</th>
                <th className="p-4">CO3</th>
                <th className="p-4">CO4</th>
                <th className="p-4">Overall</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["Aarav Sharma", 82, 76, 65, 88, 78],
                ["Ananya Singh", 91, 84, 73, 92, 85],
                ["Riya Gupta", 72, 69, 61, 79, 70],
                ["Rahul Mehta", 88, 81, 74, 86, 82],
              ].map((student) => (
                <tr className="border-t" key={student[0]}>
                  {student.map((item, i) => (
                    <td
                      className={`p-4 text-center ${
                        i === 0 ? "text-left font-medium" : ""
                      }`}
                      key={i}
                    >
                      {item}
                      {i > 0 && i < 5 ? "%" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </Page>
  );
}


function Attainment() {
  return (
    <Page title="CO–PO Attainment" subtitle="Analyze academic outcome performance.">

      <div className="grid md:grid-cols-3 gap-5">

        <StatCard title="Average CO Attainment" value="77.6%" subtitle="Above target" icon="◒" positive />

        <StatCard title="Average PO Attainment" value="74.2%" subtitle="Across mapped outcomes" icon="◎" />

        <StatCard title="Students Meeting Target" value="82%" subtitle="148 of 181 students" icon="♙" />

      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-7 mt-6">

        <h3 className="font-bold text-gray-800">
          Outcome Performance
        </h3>

        <div className="grid md:grid-cols-2 gap-8 mt-7">

          {[
            ["CO1", 82],
            ["CO2", 76],
            ["CO3", 69],
            ["CO4", 84],
            ["CO5", 73],
            ["CO6", 80],
          ].map(([name, value]) => (
            <div key={name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">{name}</span>
                <span className="font-bold">{value}%</span>
              </div>

              <div className="h-4 bg-gray-100 rounded-full">
                <div
                  className={`h-full rounded-full ${
                    value < 70 ? "bg-orange-400" : "bg-[#1d3968]"
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}

        </div>

      </div>
    </Page>
  );
}


function AIInsights() {
  return (
    <Page title="AI Insights" subtitle="AI-powered academic recommendations.">

      <div className="grid md:grid-cols-2 gap-6">

        <AIBox
          title="Weak CO Detected"
          description="CO3 attainment is below the defined target."
          recommendation="Increase practice questions related to graph traversal and shortest path algorithms."
        />

        <AIBox
          title="Learning Gap"
          description="Students are struggling with Graph Algorithms."
          recommendation="Conduct a remedial session and provide additional practice problems."
        />

        <AIBox
          title="Question Paper Analysis"
          description="CO2 is underrepresented in the latest paper."
          recommendation="Include 2–3 additional questions mapped to CO2 in the next assessment."
        />

        <AIBox
          title="Bloom's Taxonomy"
          description="Most questions currently target Remember and Understand levels."
          recommendation="Add more Apply and Analyze level questions."
        />

      </div>
    </Page>
  );
}


function AIBox({ title, description, recommendation }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1d3968] flex items-center justify-center text-xl">
          ✦
        </div>

        <h3 className="font-bold text-gray-800">
          {title}
        </h3>
      </div>

      <p className="text-gray-500 text-sm mt-5">
        {description}
      </p>

      <div className="mt-5 bg-blue-50 rounded-xl p-4">
        <p className="text-xs font-bold text-[#1d3968] uppercase">
          Recommended Action
        </p>

        <p className="text-sm text-gray-600 mt-2 leading-6">
          {recommendation}
        </p>
      </div>

    </div>
  );
}


const TARGET = 70;

const sampleScores = {
  CO1: [82, 75, 91, 68, 77, 84, 72, 88, 65, 79, 81, 73, 94, 70, 86, 78, 83, 67, 90, 76, 85, 71, 80, 74, 89],
  CO2: [76, 81, 84, 69, 73, 78, 88, 71, 65, 82, 79, 74, 90, 68, 85, 77, 80, 72, 86, 75, 83, 70, 78, 81, 74],
  CO3: [65, 72, 68, 61, 75, 69, 73, 64, 58, 71, 67, 62, 79, 66, 70, 63, 74, 60, 76, 68, 72, 65, 69, 71, 64],
  CO4: [88, 82, 91, 76, 85, 79, 87, 90, 72, 84, 81, 78, 94, 75, 89, 83, 86, 77, 92, 80, 88, 74, 85, 82, 90],
};

const sampleStudentMarks = Array.from({ length: 25 }, (_, i) => ({
  student: `Student ${String(i + 1).padStart(2, "0")}`,
  CO1: sampleScores.CO1[i],
  CO2: sampleScores.CO2[i],
  CO3: sampleScores.CO3[i],
  CO4: sampleScores.CO4[i],
}));

// Mapping strength: 0 = not mapped, 1 = low, 2 = medium, 3 = high.
const coPoMapping = {
  CO1: { PO1: 3, PO2: 2, PO3: 0, PO4: 0 },
  CO2: { PO1: 2, PO2: 3, PO3: 2, PO4: 0 },
  CO3: { PO1: 1, PO2: 2, PO3: 3, PO4: 2 },
  CO4: { PO1: 2, PO2: 1, PO3: 2, PO4: 3 },
};

function calculateCOAttainment() {
  return Object.keys(sampleScores).map((co) => {
    const total = sampleStudentMarks.reduce(
      (sum, student) => sum + student[co],
      0
    );

    return {
      name: co,
      attainment: total / sampleStudentMarks.length,
      target: TARGET,
    };
  });
}

function calculatePOAttainment(coResults) {
  return ["PO1", "PO2", "PO3", "PO4"].map((po) => {
    let weightedTotal = 0;
    let totalWeight = 0;

    coResults.forEach((co) => {
      const weight = coPoMapping[co.name][po];

      if (weight > 0) {
        weightedTotal += co.attainment * weight;
        totalWeight += weight;
      }
    });

    return {
      name: po,
      attainment: totalWeight > 0 ? weightedTotal / totalWeight : 0,
      target: TARGET,
    };
  });
}


function Reports() {
  const [showReport, setShowReport] = useState(false);

  const coResults = calculateCOAttainment();
  const poResults = calculatePOAttainment(coResults);
  const allResults = [...coResults, ...poResults];

  const average = (results) =>
    results.reduce((sum, item) => sum + item.attainment, 0) /
    results.length;

  const averageCO = average(coResults);
  const averagePO = average(poResults);

  const renderTable = (title, results) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Outcome</th>
              <th className="p-3 text-right">Attainment</th>
              <th className="p-3 text-right">Target</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((item) => {
              const belowTarget = item.attainment < item.target;

              return (
                <tr key={item.name} className="border-t border-gray-100">
                  <td className="p-3 font-semibold">{item.name}</td>

                  <td
                    className={`p-3 text-right font-bold ${
                      belowTarget ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {item.attainment.toFixed(1)}%
                  </td>

                  <td className="p-3 text-right">
                    {item.target}%
                  </td>

                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        belowTarget ? "text-red-600" : "text-green-700"
                      }`}
                    >
                      {belowTarget ? "Below target" : "Target met"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Page
      title="CO–PO Attainment Report"
      subtitle="Outcome performance calculated from sample marks for 25 students."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Demonstration data · Target: {TARGET}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            These are sample results, not official institutional data.
          </p>
        </div>

        <button
          onClick={() => setShowReport((previous) => !previous)}
          className="bg-[#1d3968] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#152c52]"
        >
          {showReport ? "Hide Report" : "Generate CO–PO Report"}
        </button>
      </div>

      {showReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Average CO Attainment"
              value={`${averageCO.toFixed(1)}%`}
              subtitle={`Across ${coResults.length} course outcomes`}
              icon="◒"
              positive={averageCO >= TARGET}
              warning={averageCO < TARGET}
            />

            <StatCard
              title="Average PO Attainment"
              value={`${averagePO.toFixed(1)}%`}
              subtitle={`Across ${poResults.length} program outcomes`}
              icon="◎"
              positive={averagePO >= TARGET}
              warning={averagePO < TARGET}
            />

            <StatCard
              title="Students Included"
              value={String(sampleStudentMarks.length)}
              subtitle="Sample student records"
              icon="♙"
            />
          </div>

          {renderTable("Course Outcome (CO) Attainment", coResults)}

          {renderTable("Program Outcome (PO) Attainment", poResults)}

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800">
              CO and PO Attainment Comparison
            </h3>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Each bar uses the same calculated value shown in the tables.
              The dashed line represents the {TARGET}% target.
            </p>

            <div className="flex flex-wrap gap-5 text-sm mb-6">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#1d3968]" />
                Target met
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-red-500" />
                Below target
              </span>
            </div>

            <div className="space-y-5">
              {allResults.map((item) => {
                const belowTarget = item.attainment < item.target;

                return (
                  <div key={item.name}>
                    <div className="flex justify-between gap-3 text-sm mb-2">
                      <span className="font-semibold text-gray-700">
                        {item.name}
                      </span>
                      <span
                        className={`font-bold ${
                          belowTarget ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {item.attainment.toFixed(1)}%
                      </span>
                    </div>

                    <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          belowTarget ? "bg-red-500" : "bg-[#1d3968]"
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, item.attainment)
                          )}%`,
                        }}
                      />

                      <div
                        className="absolute top-0 bottom-0 border-l-2 border-dashed border-orange-500"
                        style={{ left: `${TARGET}%` }}
                        title={`Target: ${TARGET}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 mt-5">
              CO values are mean student scores. PO values are weighted
              averages based on the demonstration CO–PO mapping matrix.
            </p>
          </div>
        </div>
      )}
    </Page>
  );
}


function Page({ title, subtitle, children }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {title}
        </h1>

        <p className="text-gray-500 mt-2">
          {subtitle}
        </p>
      </div>

      {children}
    </>
  );
}

export default App;
