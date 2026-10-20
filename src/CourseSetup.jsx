import { useState } from "react";
import {
  SESSIONS,
  SECTIONS,
  PROGRAMS,
  findProgram,
  findBranch,
  getCourses,
  semesterLabel,
} from "./academicData.js";

const STORAGE_KEY = "intellioutcome_teacher_setup";

const EMPTY = {
  session: SESSIONS[0],
  programId: "",
  branchId: "",
  semester: "",
  courseCode: "",
  section: "",
};

function loadLast() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function saveLast(form) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch {
    /* storage blocked: ignore */
  }
}

function CourseSetup({ initial, onContinue, onBack, backLabel = "← Back" }) {
  // "initial" is the saved selection (an already-processed object), so
  // convert it back to form fields; otherwise use the last remembered choice.
  const [form, setForm] = useState(() =>
    initial
      ? {
          session: initial.session,
          programId: initial.programId,
          branchId: initial.branchId,
          semester: String(initial.semester),
          courseCode: initial.courseCode,
          section: initial.section,
        }
      : loadLast()
  );

  const program = findProgram(form.programId);
  const branch = findBranch(form.programId, form.branchId);
  const semester = form.semester ? Number(form.semester) : null;
  const courses =
    program && branch && semester
      ? getCourses(form.programId, form.branchId, semester)
      : [];
  const course = courses.find((c) => c.code === form.courseCode) || null;

  const complete =
    form.session && program && branch && semester && course && form.section;

  // Each field resets the fields that depend on it.
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const onProgram = (programId) =>
    set({ programId, branchId: "", semester: "", courseCode: "" });
  const onBranch = (branchId) => set({ branchId, courseCode: "" });
  const onSemester = (semester) => set({ semester, courseCode: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!complete) return;
    saveLast(form);
    onContinue({
      session: form.session,
      programId: program.id,
      programName: program.name,
      branchId: branch.id,
      branchCode: branch.code,
      branchName: branch.name,
      semester,
      semesterLabel: semesterLabel(semester),
      courseCode: course.code,
      courseTitle: course.title,
      credits: course.credits,
      section: form.section,
    });
  };

  const summary = [
    ["Session", form.session],
    ["Program", program?.name],
    ["Branch", branch?.name],
    ["Semester", semester && semesterLabel(semester)],
    ["Course", course && `${course.code} · ${course.title}`],
    ["Section", form.section && `Section ${form.section}`],
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <header className="h-16 bg-[#142d55] text-white flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#142d55] font-bold text-sm">
            IO
          </div>
          <span className="font-bold">IntelliOutcome</span>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-blue-100 hover:text-white"
          >
            {backLabel}
          </button>
        )}
      </header>

      <main className="flex-1 flex items-start md:items-center justify-center p-6">
        <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-6">
          {/* FORM */}
          <form
            onSubmit={submit}
            className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-7 md:p-8"
          >
            <h1 className="text-2xl font-bold text-gray-800">
              Set up your teaching context
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Choose the class you want to work on. Your dashboard will show
              data for this course only. You can change it later.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-7">
              <Select
                label="Academic session"
                value={form.session}
                onChange={(v) => set({ session: v })}
                options={SESSIONS.map((s) => ({ value: s, label: s }))}
              />

              <Select
                label="Program"
                value={form.programId}
                onChange={onProgram}
                placeholder="Select program"
                options={PROGRAMS.map((p) => ({ value: p.id, label: p.name }))}
              />

              <Select
                label="Branch"
                value={form.branchId}
                onChange={onBranch}
                placeholder="Select branch"
                disabled={!program}
                options={(program?.branches || []).map((b) => ({
                  value: b.id,
                  label: `${b.code} – ${b.name}`,
                }))}
              />

              <Select
                label="Semester"
                value={form.semester}
                onChange={onSemester}
                placeholder="Select semester"
                disabled={!program}
                options={Array.from({ length: program?.semesters || 0 }, (_, i) => ({
                  value: String(i + 1),
                  label: semesterLabel(i + 1),
                }))}
              />

              <div className="sm:col-span-2">
                <Select
                  label="Course"
                  value={form.courseCode}
                  onChange={(v) => set({ courseCode: v })}
                  placeholder={
                    branch && semester ? "Select course" : "Select branch and semester first"
                  }
                  disabled={!branch || !semester}
                  options={courses.map((c) => ({
                    value: c.code,
                    label: `${c.code} · ${c.title} (${c.credits} credits)`,
                  }))}
                />
              </div>

              <Select
                label="Section / Class"
                value={form.section}
                onChange={(v) => set({ section: v })}
                placeholder="Select section"
                options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))}
              />
            </div>

            <button
              type="submit"
              disabled={!complete}
              className="mt-8 w-full bg-[#1d3968] text-white py-3 rounded-xl font-semibold transition hover:bg-[#152c52] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to Dashboard →
            </button>
          </form>

          {/* SUMMARY */}
          <aside className="lg:col-span-2 bg-[#142d55] text-white rounded-2xl p-7 md:p-8 h-fit">
            <p className="text-xs uppercase tracking-wider text-blue-200">
              Your selection
            </p>

            <dl className="mt-5 space-y-4">
              {summary.map(([label, value]) => (
                <div key={label} className="border-l-2 border-blue-300 pl-4">
                  <dt className="text-xs text-blue-200">{label}</dt>
                  <dd className="text-sm font-semibold mt-0.5">
                    {value || <span className="text-blue-300/60 font-normal">Not selected</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1d3968] disabled:bg-gray-50 disabled:text-gray-400"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CourseSetup;