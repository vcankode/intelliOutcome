/*
 * IntelliOutcome · Admin dashboard — data layer
 * ---------------------------------------------
 * Demo build: records live in localStorage and are seeded with SAMPLE data
 * (faculty names, emails and phone numbers are placeholders).
 *
 * When merging into the main project, keep the public shape of
 * window.IntelliData.DS and replace the method bodies with calls to the
 * backend API. app.js never touches storage directly.
 */
(function (global) {
  'use strict';

  var KEY = 'intelliout_admin_v1';
  var DOMAIN = 'banasthali.in';
  var EMAIL_RE = /^[^\s@]+@banasthali\.in$/i;
  var DOMAIN_ERROR = 'Access is restricted to registered faculty with a verified @banasthali.in address.';
  var MAX_LOAD = 4;          // courses per faculty per semester before an overload conflict is raised
  var FACULTY_COUNT = 14;
  var DEPTS = ['Computer Science', 'Information Technology', 'Biotechnology', 'Engineering'];

  var PROGRAMS = [
    {
      id: 'btech', name: 'B.Tech', level: 'Undergraduate', semesters: 8,
      branches: [
        { id: 'it', code: 'IT', name: 'Information Technology', dept: 'Information Technology', intake: 60 },
        { id: 'ai', code: 'AI', name: 'Artificial Intelligence', dept: 'Computer Science', intake: 60 },
        { id: 'cs', code: 'CS', name: 'Computer Science', dept: 'Computer Science', intake: 60 },
        { id: 'bt', code: 'BT', name: 'Biotechnology', dept: 'Biotechnology', intake: 60 },
        { id: 'mt', code: 'MT', name: 'MT', dept: 'Engineering', intake: 60 }
      ]
    },
    {
      id: 'mca', name: 'MCA', level: 'Postgraduate', semesters: 6,
      branches: [
        { id: 'mca', code: 'MCA', name: 'Master of Computer Applications', dept: 'Computer Science', intake: 60 }
      ]
    }
  ];

  // [title, credits] per semester (index 0 = semester 1)
  var SUBJECTS = {
    btech: [
      [['Engineering Mathematics I', 4], ['Engineering Physics', 4], ['Programming in C', 4], ['Communication Skills', 2]],
      [['Engineering Mathematics II', 4], ['Basic Electronics', 3], ['Data Structures', 4], ['Environmental Studies', 2]],
      [['Discrete Mathematics', 4], ['Digital Logic Design', 4], ['Object Oriented Programming', 4], ['Economics for Engineers', 3]],
      [['Database Management Systems', 4], ['Operating Systems', 4], ['Computer Networks', 4], ['Software Engineering', 3]],
      [['Design & Analysis of Algorithms', 4], ['Machine Learning', 4], ['Web Technologies', 3], ['Compiler Design', 3]],
      [['Artificial Intelligence', 4], ['Cloud Computing', 3], ['Information Security', 3], ['Mini Project', 2]],
      [['Big Data Analytics', 4], ['Professional Elective I', 3], ['Internship Seminar', 2], ['Professional Ethics', 2]],
      [['Major Project', 8], ['Professional Elective II', 3]]
    ],
    mca: [
      [['Mathematical Foundations', 4], ['Programming in Python', 4], ['Computer Organisation', 3], ['Communication Skills', 2]],
      [['Data Structures', 4], ['Database Management Systems', 4], ['Operating Systems', 3], ['Probability & Statistics', 3]],
      [['Software Engineering', 4], ['Computer Networks', 4], ['Web Development', 3], ['Java Programming', 4]],
      [['Machine Learning', 4], ['Cloud Computing', 3], ['Cyber Security', 3], ['Professional Elective I', 3]],
      [['Big Data Analytics', 4], ['Data Visualisation', 3], ['Professional Elective II', 3], ['Seminar', 2]],
      [['Major Project', 12]]
    ]
  };

  /* ---------- small helpers ---------- */
  function pad(n, w) { return String(n).padStart(w || 2, '0'); }
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function coAvg(c) { return avg(c.co); }
  function todayIso() { return new Date().toISOString().slice(0, 10); }
  function findProgram(pid) { return PROGRAMS.find(function (p) { return p.id === pid; }) || null; }
  function findBranch(pid, bid) {
    var p = findProgram(pid);
    return p ? (p.branches.find(function (b) { return b.id === bid; }) || null) : null;
  }
  function allBranches() {
    var out = [];
    PROGRAMS.forEach(function (p) { p.branches.forEach(function (b) { out.push({ program: p, branch: b }); }); });
    return out;
  }

  /* ---------- seed data ---------- */
  function buildSeed() {
    var r = rng(20262027);
    var faculty = [];
    for (var i = 1; i <= FACULTY_COUNT; i++) {
      faculty.push({
        id: 'F' + pad(i, 3),
        facultyId: 'BV-FAC-' + pad(i, 3),
        name: 'Sample Faculty ' + pad(i, 2),
        email: 'sample.faculty' + pad(i, 2) + '@' + DOMAIN,
        phone: '90000' + String(10000 + i),
        dept: DEPTS[i % DEPTS.length],
        status: i === FACULTY_COUNT ? 'Suspended' : 'Active',
        joined: '2024-07-01'
      });
    }

    var courses = [];
    var seq = 0;
    PROGRAMS.forEach(function (p) {
      p.branches.forEach(function (b, bi) {
        for (var sem = 1; sem <= p.semesters; sem++) {
          SUBJECTS[p.id][sem - 1].forEach(function (s, si) {
            seq++;
            var co = [];
            for (var k = 0; k < 5; k++) co.push(Math.round(55 + r() * 40));
            courses.push({
              id: 'C' + pad(seq, 4),
              code: b.code + sem + pad(si + 1, 2),
              title: s[0],
              credits: s[1],
              programId: p.id,
              branchId: b.id,
              semester: sem,
              teacherId: (seq % 9 === 4) ? null : faculty[(seq * 3 + bi) % FACULTY_COUNT].id,
              students: b.intake - (seq % 4),
              co: co,
              marksSubmitted: r() > 0.3,
              coPoMapped: r() > 0.15
            });
          });
        }
      });
    });

    return {
      faculty: faculty,
      courses: courses,
      targets: { threshold: 70, wDirect: 80, wIndirect: 20, currentSemester: 5, updatedAt: null },
      audit: [
        { id: 'A0008', at: '2026-10-20T13:45:00+05:30', actor: 'System Admin', action: 'Faculty account created', detail: 'Sample Faculty 14 added via CSV import', level: 'info' },
        { id: 'A0007', at: '2026-10-20T11:18:00+05:30', actor: 'System Admin', action: 'Report generated', detail: 'CO Attainment Report · CS · Semester 5', level: 'info' },
        { id: 'A0006', at: '2026-10-20T10:02:00+05:30', actor: 'System Admin', action: 'Role privilege edited', detail: 'Sample Faculty 14 set to Suspended', level: 'warn' },
        { id: 'A0005', at: '2026-10-20T09:30:00+05:30', actor: 'Sample Faculty 03', action: 'Matrix approved', detail: 'CO–PO matrix approved for IT501', level: 'info' },
        { id: 'A0004', at: '2026-10-19T16:05:00+05:30', actor: 'System', action: 'Failed login attempt', detail: 'Two failed attempts on sample.faculty09@banasthali.in', level: 'warn' },
        { id: 'A0003', at: '2026-10-19T11:40:00+05:30', actor: 'Sample Faculty 03', action: 'Marks uploaded', detail: 'Mid-term marks uploaded for CS501', level: 'info' },
        { id: 'A0002', at: '2026-10-19T10:12:00+05:30', actor: 'System Admin', action: 'Target updated', detail: 'Target threshold set to 70%', level: 'info' },
        { id: 'A0001', at: '2026-10-18T15:20:00+05:30', actor: 'System Admin', action: 'Target updated', detail: 'Formula weightage W_direct 80% / W_indirect 20%', level: 'info' }
      ]
    };
  }

  /* ---------- persistence (best effort) ---------- */
  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  var state = load() || buildSeed();
  function persist() {
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: keep in memory */ }
  }
  function log(action, detail, level) {
    state.audit.unshift({
      id: 'A' + Date.now().toString(36),
      at: new Date().toISOString(),
      actor: 'System Admin',
      action: action,
      detail: detail,
      level: level || 'info'
    });
    if (state.audit.length > 500) state.audit.length = 500;
    persist();
  }

  function facultyById(id) {
    return state.faculty.find(function (f) { return f.id === id; }) || null;
  }
  function branchOf(c) { return findBranch(c.programId, c.branchId); }
  function createFaculty(input) {
    var name = (input.name || '').trim();
    var fid = (input.facultyId || '').trim();
    var email = (input.email || '').trim().toLowerCase();
    if (!fid) return { ok: false, error: 'Faculty ID is required.' };
    if (!name) return { ok: false, error: 'Name is required.' };
    if (!EMAIL_RE.test(email)) return { ok: false, error: DOMAIN_ERROR };
    if (state.faculty.some(function (f) { return f.email === email; })) return { ok: false, error: 'An account with this email already exists.' };
    if (state.faculty.some(function (f) { return f.facultyId.toLowerCase() === fid.toLowerCase(); })) return { ok: false, error: 'Faculty ID ' + fid + ' is already in use.' };
    var rec = {
      id: 'F' + Date.now().toString(36),
      facultyId: fid, name: name, email: email,
      phone: (input.phone || '').trim(),
      dept: input.dept || DEPTS[0],
      status: 'Active',
      joined: todayIso()
    };
    state.faculty.push(rec);
    return { ok: true, item: rec };
  }

  var DS = {
    programs: function () { return PROGRAMS; },
    program: function (pid) { return findProgram(pid); },
    branch: function (pid, bid) { return findBranch(pid, bid); },
    departments: function () { return DEPTS.slice(); },
    targets: function () { return Object.assign({}, state.targets); },

    setTargets: function (input) {
      var t = Number(input.threshold), wd = Number(input.wDirect), wi = Number(input.wIndirect), sem = Number(input.currentSemester);
      if (!(t >= 50 && t <= 100)) return { ok: false, error: 'Target threshold must be between 50% and 100%.' };
      if (wd < 0 || wi < 0 || wd + wi !== 100) return { ok: false, error: 'W_direct and W_indirect must add up to exactly 100%.' };
      if (!(sem >= 1 && sem <= 8)) return { ok: false, error: 'Current semester must be between 1 and 8.' };
      state.targets = { threshold: t, wDirect: wd, wIndirect: wi, currentSemester: sem, updatedAt: new Date().toISOString() };
      log('Target updated', 'Threshold ' + t + '% · W_direct ' + wd + '% / W_indirect ' + wi + '% · current semester ' + sem, 'info');
      return { ok: true };
    },

    faculty: function (f) {
      f = f || {};
      var q = (f.q || '').trim().toLowerCase();
      return state.faculty.filter(function (x) {
        return (!f.status || x.status === f.status) &&
          (!q || x.name.toLowerCase().includes(q) || x.email.includes(q) || x.facultyId.toLowerCase().includes(q));
      });
    },
    facultyById: facultyById,

    addFaculty: function (input) {
      var res = createFaculty(input);
      if (res.ok) log('Faculty account created', res.item.name + ' (' + res.item.email + ')', 'info');
      return res;
    },

    importFaculty: function (rows) {
      var added = 0, rejected = [];
      rows.forEach(function (row) {
        var res = createFaculty({
          facultyId: row.facultyid, name: row.name, email: row.email, phone: row.phone, dept: row.dept
        });
        if (res.ok) added++;
        else rejected.push({ line: row._line, email: row.email || '', reason: res.error });
      });
      log('Bulk faculty import', added + ' added, ' + rejected.length + ' rejected', rejected.length ? 'warn' : 'info');
      return { added: added, rejected: rejected };
    },

    setFacultyStatus: function (id, status) {
      var f = facultyById(id);
      if (!f || ['Active', 'Suspended', 'Deactivated'].indexOf(status) < 0) return { ok: false };
      f.status = status;
      log('Account status changed', f.name + ' → ' + status, status === 'Active' ? 'info' : 'warn');
      return { ok: true };
    },

    courses: function (f) {
      f = f || {};
      var q = (f.q || '').trim().toLowerCase();
      return state.courses.filter(function (c) {
        return (!f.programId || c.programId === f.programId) &&
          (!f.branchId || c.branchId === f.branchId) &&
          (!f.semester || c.semester === Number(f.semester)) &&
          (!f.teacherId || c.teacherId === f.teacherId) &&
          (!f.unassigned || !c.teacherId) &&
          (!q || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      });
    },
    courseById: function (id) { return state.courses.find(function (c) { return c.id === id; }) || null; },

    addCourse: function (i) {
      var code = (i.code || '').trim().toUpperCase();
      var title = (i.title || '').trim();
      var credits = Number(i.credits);
      var sem = Number(i.semester);
      var p = findProgram(i.programId), b = findBranch(i.programId, i.branchId);
      if (!code) return { ok: false, error: 'Course code is required.' };
      if (!title) return { ok: false, error: 'Course title is required.' };
      if (!(credits >= 0 && credits <= 12)) return { ok: false, error: 'Credits must be between 0 and 12.' };
      if (!p || !b) return { ok: false, error: 'Choose a valid program and branch.' };
      if (!(sem >= 1 && sem <= p.semesters)) return { ok: false, error: 'Semester must be between 1 and ' + p.semesters + ' for ' + p.name + '.' };
      if (state.courses.some(function (c) { return c.code === code; })) return { ok: false, error: 'Course code ' + code + ' already exists in the catalog.' };
      if (i.teacherId && !facultyById(i.teacherId)) return { ok: false, error: 'Selected faculty member was not found.' };
      var rec = {
        id: 'C' + Date.now().toString(36),
        code: code, title: title, credits: credits,
        programId: p.id, branchId: b.id, semester: sem,
        teacherId: i.teacherId || null,
        students: b.intake,
        co: [],                 // no assessments yet
        marksSubmitted: false,
        coPoMapped: false
      };
      state.courses.push(rec);
      log('Course added to catalog', code + ' · ' + title + ' · ' + b.code + ' Sem ' + sem, 'info');
      return { ok: true, item: rec };
    },

    deleteCourse: function (id) {
      var c = DS.courseById(id);
      if (!c) return { ok: false };
      state.courses = state.courses.filter(function (x) { return x.id !== id; });
      log('Course removed from catalog', c.code + ' · ' + c.title, 'warn');
      return { ok: true };
    },

    assignTeacher: function (courseId, teacherId) {
      var c = DS.courseById(courseId);
      if (!c) return { ok: false };
      var f = teacherId ? facultyById(teacherId) : null;
      c.teacherId = f ? f.id : null;
      log('Faculty allocation changed', c.code + ' → ' + (f ? f.name : 'Unassigned'), 'info');
      return { ok: true };
    },

    teacherCourses: function (fid) {
      return state.courses.filter(function (c) { return c.teacherId === fid; });
    },

    auditList: function (f) {
      f = f || {};
      var q = (f.q || '').trim().toLowerCase();
      return state.audit.filter(function (a) {
        return (!f.action || a.action === f.action) &&
          (!q || (a.detail + ' ' + a.actor + ' ' + a.action).toLowerCase().includes(q));
      });
    },
    auditActions: function () {
      var seen = {};
      state.audit.forEach(function (a) { seen[a.action] = true; });
      return Object.keys(seen).sort();
    },

    overview: function (dept) {
      var sem = state.targets.currentSemester;
      var pairs = allBranches().filter(function (x) { return !dept || x.branch.dept === dept; });
      var inScope = function (c) {
        return pairs.some(function (x) { return x.program.id === c.programId && x.branch.id === c.branchId; });
      };
      var courses = state.courses.filter(inScope);
      var scored = courses.filter(function (c) { return c.co.length; });
      var cur = courses.filter(function (c) { return c.semester === sem; });
      var facs = state.faculty.filter(function (f) { return !dept || f.dept === dept; });
      var students = pairs.reduce(function (s, x) { return s + x.branch.intake * (x.program.semesters / 2); }, 0);
      var submitted = cur.filter(function (c) { return c.marksSubmitted; }).length;
      return {
        activeFaculty: facs.filter(function (f) { return f.status === 'Active'; }).length,
        totalFaculty: facs.length,
        students: students,
        poAttainment: avg(scored.map(coAvg)),
        submissionRate: cur.length ? submitted / cur.length * 100 : 0,
        threshold: state.targets.threshold,
        semester: sem,
        branches: pairs.map(function (x) {
          var bc = scored.filter(function (c) { return c.programId === x.program.id && c.branchId === x.branch.id; });
          var all = courses.filter(function (c) { return c.programId === x.program.id && c.branchId === x.branch.id; });
          return { program: x.program.name, branch: x.branch, courses: all.length, po: avg(bc.map(coAvg)) };
        })
      };
    },

    compliance: function () {
      var sem = state.targets.currentSemester;
      var cur = state.courses.filter(function (c) { return c.semester === sem; });
      var rows = DEPTS.map(function (d) {
        var cs = cur.filter(function (c) { return branchOf(c).dept === d; });
        var sub = cs.filter(function (c) { return c.marksSubmitted; }).length;
        return {
          dept: d, total: cs.length, submitted: sub,
          pct: cs.length ? sub / cs.length * 100 : 0,
          unmapped: cs.filter(function (c) { return !c.coPoMapped; }).length,
          overdue: cs.filter(function (c) { return !c.marksSubmitted; }).length
        };
      }).filter(function (r) { return r.total > 0; });
      var describe = function (c) {
        var f = facultyById(c.teacherId);
        return { course: c, branch: branchOf(c), teacher: f };
      };
      return {
        semester: sem,
        rows: rows,
        overdue: cur.filter(function (c) { return !c.marksSubmitted; }).map(describe),
        unmapped: cur.filter(function (c) { return !c.coPoMapped; }).map(describe)
      };
    },

    conflicts: function () {
      var unassigned = state.courses.filter(function (c) { return !c.teacherId; });
      var inactive = state.courses.filter(function (c) {
        var f = facultyById(c.teacherId);
        return f && f.status !== 'Active';
      });
      var loads = {};
      state.courses.forEach(function (c) {
        if (!c.teacherId) return;
        var k = c.teacherId + '|' + c.semester;
        loads[k] = (loads[k] || 0) + 1;
      });
      var overloaded = Object.keys(loads).filter(function (k) { return loads[k] > MAX_LOAD; }).map(function (k) {
        var p = k.split('|');
        return { faculty: facultyById(p[0]), semester: Number(p[1]), count: loads[k] };
      });
      return { unassigned: unassigned, inactive: inactive, overloaded: overloaded };
    },

    resetDemo: function () {
      state = buildSeed();
      persist();
    }
  };

  // Shared with app.js so every view uses the same rules
  function parseCsv(text) {
    var lines = String(text || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.length < 2) return [];
    var header = lines[0].split(',').map(function (h) { return h.trim().toLowerCase(); });
    return lines.slice(1).map(function (line, i) {
      var cells = line.split(',').map(function (c) { return c.trim(); });
      var row = { _line: i + 2 };
      header.forEach(function (h, j) { row[h] = cells[j] || ''; });
      return row;
    });
  }

  global.IntelliData = {
    DS: DS,
    DOMAIN_ERROR: DOMAIN_ERROR,
    MAX_LOAD: MAX_LOAD,
    parseCsv: parseCsv,
    CSV_TEMPLATE: 'facultyId,name,email,phone,dept\nBV-FAC-901,Sample Faculty 901,sample.faculty901@banasthali.in,9000090901,Computer Science\n'
  };
})(window);
