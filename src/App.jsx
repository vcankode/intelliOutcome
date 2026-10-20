import { useState } from "react";

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

  if (!started) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1d3968]" />

        <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
          <div className="mx-auto mb-7 w-20 h-20 rounded-2xl bg-[#1d3968] flex items-center justify-center text-white text-3xl font-bold">
            IO
          </div>

          <h1 className="text-5xl font-bold text-[#1d3968] tracking-tight">
            IntelliOutcome
          </h1>

          <p className="mt-4 text-gray-500 text-lg">
            AI-Powered CO–PO Attainment & Academic Analytics
          </p>

          <p className="mt-3 text-gray-400">
            Smart academic outcome analysis for teachers and institutions.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="mt-9 px-10 py-4 bg-[#1d3968] text-white rounded-xl font-semibold text-lg hover:bg-[#152c52] transition shadow-lg"
          >
            Get Started →
          </button>
        </div>
      </div>
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


function Reports() {
  return (
    <Page title="Reports" subtitle="Generate academic outcome reports.">

      <div className="grid md:grid-cols-3 gap-5">

        {[
          ["CO Attainment Report", "Complete CO-wise attainment analysis"],
          ["PO Attainment Report", "Program outcome contribution"],
          ["Question Paper Analysis", "Coverage and Bloom's distribution"],
        ].map(([title, description]) => (
          <div
            key={title}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <div className="text-3xl">▥</div>

            <h3 className="font-bold text-gray-800 mt-5">
              {title}
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              {description}
            </p>

            <button className="mt-5 w-full border border-[#1d3968] text-[#1d3968] py-2.5 rounded-lg font-semibold">
              Generate Report
            </button>
          </div>
        ))}

      </div>
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
