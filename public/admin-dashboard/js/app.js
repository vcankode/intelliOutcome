/* IntelliOutcome · Admin dashboard — views, routing and interactions */
(function () {
  'use strict';

  var D = window.IntelliData;
  var DS = D.DS;
  var viewEl = document.getElementById('view');
  var modalRoot = document.getElementById('modal-root');
  var overlay = document.getElementById('session-overlay');

  // Filter state for list views (kept between re-renders)
  var ui = {
    dept: '', facQ: '', facStatus: '',
    crsQ: '', crsBranch: '', crsSem: '', crsOnly: '',
    audQ: '', audAction: ''
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function pct(n) { return (Math.round(n * 10) / 10).toFixed(1) + '%'; }
  function pill(text, tone) { return '<span class="pill pill-' + tone + '">' + esc(text) + '</span>'; }
  function statusTone(s) {
    return { Active: 'good', Submitted: 'good', Compliant: 'good', Suspended: 'warn', Pending: 'warn',
      'At risk': 'warn', Upcoming: 'muted', Deactivated: 'bad', Unassigned: 'bad', Overdue: 'bad' }[s] || 'muted';
  }
  function fmtTime(iso) {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
      });
    } catch (e) { return iso; }
  }
  function bar(value, target) {
    var low = value < target;
    var w = Math.min(100, Math.max(0, value)).toFixed(1);
    return '<div class="bar-row"><div class="progress' + (low ? ' low' : '') + '"><span style="width:' + w + '%"></span></div>' +
      '<b class="bar-val' + (low ? ' low-text' : '') + '">' + pct(value) + '</b></div>';
  }
  function emptyRow(cols, text) {
    return '<tr><td colspan="' + cols + '" class="empty">' + esc(text) + '</td></tr>';
  }
  function teacherCell(id) {
    if (!id) return pill('Unassigned', 'bad');
    var f = DS.facultyById(id);
    if (!f) return '<span class="muted">—</span>';
    return '<button class="link-btn" type="button" data-action="open-teacher" data-id="' + esc(f.id) + '">' + esc(f.name) + '</button>' +
      (f.status !== 'Active' ? '<span class="inline-pill">' + pill(f.status, statusTone(f.status)) + '</span>' : '');
  }
  function emailCell(id) {
    var f = id ? DS.facultyById(id) : null;
    if (!f) return '<span class="muted">—</span>';
    return '<a href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a>';
  }
  function branchLabel(c) {
    var p = DS.program(c.programId), b = DS.branch(c.programId, c.branchId);
    return { prog: p, br: b, text: (b ? b.code : '') + ' · ' + (p ? p.name : '') };
  }
  function setFlash(msg, bad) {
    document.querySelectorAll('.toast').forEach(function (old) { old.remove(); });
    var t = document.createElement('div');
    t.className = 'toast' + (bad ? ' bad' : '');
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  }

  /* ---------- modal ---------- */
  function openModal(title, bodyHtml) {
    modalRoot.innerHTML =
      '<div class="modal-backdrop">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">' +
          '<div class="modal-head"><h2 id="m-title">' + esc(title) + '</h2>' +
          '<button class="icon-btn" type="button" data-action="close-modal" aria-label="Close">×</button></div>' +
          '<div class="modal-body">' + bodyHtml + '</div>' +
        '</div>' +
      '</div>';
    var field = modalRoot.querySelector('form input, form select, form textarea');
    var dialog = modalRoot.querySelector('.modal');
    if (dialog) dialog.setAttribute('tabindex', '-1');
    if (field) field.focus();
    else if (dialog) dialog.focus({ preventScroll: true });
  }
  function closeModal() { modalRoot.innerHTML = ''; }
  function showFormError(form, msg) {
    var box = form.querySelector('.form-error');
    if (!box) return;
    box.textContent = msg;
    box.hidden = false;
  }

  /* ---------- rendering ---------- */
  function rerender(focusId) {
    var a = document.activeElement;
    var id = focusId || (a && a.id);
    var pos = a && typeof a.selectionStart === 'number' ? a.selectionStart : null;
    render();
    if (id) {
      var el = document.getElementById(id);
      if (el) {
        el.focus();
        if (pos !== null && el.setSelectionRange) { try { el.setSelectionRange(pos, pos); } catch (e) { /* not text input */ } }
      }
    }
  }

  function kpi(label, value, hint) {
    return '<div class="kpi"><div class="label">' + esc(label) + '</div><div class="value">' + value +
      '</div><div class="hint">' + esc(hint) + '</div></div>';
  }

  function currentPath() {
    var raw = location.hash.replace(/^#\/?/, '');
    var parts = raw.split('?');
    return {
      parts: parts[0].split('/').filter(Boolean),
      params: new URLSearchParams(parts[1] || '')
    };
  }

  function notFound() {
    return '<section class="card"><h2>Page not found</h2><p class="muted">That link does not match any admin page.</p>' +
      '<a class="btn" href="#/overview">Back to overview</a></section>';
  }

  /* ----- Overview ----- */
  function renderOverview() {
    var o = DS.overview(ui.dept);
    var deptOpts = '<option value="">All departments</option>' + DS.departments().map(function (d) {
      return '<option value="' + esc(d) + '"' + (ui.dept === d ? ' selected' : '') + '>' + esc(d) + '</option>';
    }).join('');

    var comp = DS.compliance();
    var compRows = comp.rows.map(function (r) {
      var st = r.pct >= 90 ? 'Compliant' : 'At risk';
      return '<tr><td>' + esc(r.dept) + '</td><td class="num">' + pct(r.pct) + '</td><td class="num">' + r.overdue +
        '</td><td>' + pill(st, statusTone(st)) + '</td></tr>';
    }).join('') || emptyRow(4, 'No courses in the current semester');

    var recent = DS.auditList({}).slice(0, 5).map(function (a) {
      return '<li><span><b>' + esc(a.action) + '</b> — ' + esc(a.detail) + '</span>' +
        '<span class="muted small">' + esc(fmtTime(a.at)) + '</span></li>';
    }).join('') || '<li class="muted">No activity yet</li>';

    return '' +
      '<div class="page-head"><div><h1>Admin Overview</h1>' +
      '<p class="sub">Platform-wide OBE metrics · current semester ' + o.semester + '</p></div>' +
      '<div class="toolbar"><label class="field">Department<select class="select select-sm" id="f-dept" data-filter="dept">' + deptOpts + '</select></label></div></div>' +
      '<div class="kpi-grid">' +
        kpi('Active faculty', o.activeFaculty, 'of ' + o.totalFaculty + ' accounts') +
        kpi('Marks submitted', pct(o.submissionRate), 'current semester courses') +
      '</div>' +
      '<div class="grid-2">' +
        '<section class="card"><h2>Compliance by department</h2><div class="table-wrap"><table>' +
          '<thead><tr><th>Department</th><th class="num">Submitted</th><th class="num">Overdue</th><th>Status</th></tr></thead>' +
          '<tbody>' + compRows + '</tbody></table></div></section>' +
      '</div>' +
      '<section class="card"><div class="row-between"><h2>Recent audit activity</h2><a href="#/audit">View full log →</a></div>' +
        '<ul class="list-plain">' + recent + '</ul></section>';
  }

  /* ----- Programs → branches → semester subjects ----- */
  function renderPrograms(sub, params) {
    var pid = sub[0], bid = sub[1];
    if (!pid) return programTiles();
    var prog = DS.program(pid);
    if (!prog) return notFound();
    if (!bid) return branchTiles(prog);
    var br = DS.branch(pid, bid);
    if (!br) return notFound();
    return branchView(prog, br, params);
  }

  function programTiles() {
    var tiles = DS.programs().map(function (p) {
      var courses = DS.courses({ programId: p.id }).length;
      return '<a class="tile" href="#/programs/' + p.id + '">' +
        '<div class="badge">' + esc(p.name.replace('.', '')) + '</div>' +
        '<h3>' + esc(p.name) + '</h3><p>' + esc(p.level) + '</p>' +
        '<div class="meta"><span><b>' + p.branches.length + '</b> branches</span><span><b>' + p.semesters + '</b> semesters</span>' +
        '<span><b>' + courses + '</b> courses</span></div></a>';
    }).join('');
    return '<div class="page-head"><div><h1>Programs &amp; Branches</h1>' +
      '<p class="sub">Choose a program, then a branch, to see semester subjects and the teachers assigned to them.</p></div></div>' +
      '<div class="tile-grid">' + tiles + '</div>';
  }

  function branchTiles(prog) {
    var cur = DS.targets().currentSemester;
    var tiles = prog.branches.map(function (b) {
      var cs = DS.courses({ programId: prog.id, branchId: b.id });
      var teachers = {};
      cs.forEach(function (c) { if (c.teacherId) teachers[c.teacherId] = true; });
      return '<a class="tile" href="#/programs/' + prog.id + '/' + b.id + '?sem=' + cur + '">' +
        '<div class="badge">' + esc(b.code) + '</div>' +
        '<h3>' + esc(b.name) + '</h3><p>' + esc(b.dept) + '</p>' +
        '<div class="meta"><span><b>' + cs.length + '</b> courses</span><span><b>' + Object.keys(teachers).length + '</b> teachers</span>' +
        '</div></a>';
    }).join('');
    return '<div class="crumbs"><a href="#/programs">Programs</a> / ' + esc(prog.name) + '</div>' +
      '<div class="page-head"><div><h1>' + esc(prog.name) + ' · Branches</h1>' +
      '<p class="sub">' + esc(prog.level) + ' · ' + prog.semesters + ' semesters</p></div></div>' +
      '<div class="tile-grid">' + tiles + '</div>';
  }

  function branchView(prog, br, params) {
    var cur = DS.targets().currentSemester;
    var sem = parseInt(params.get('sem'), 10);
    if (!(sem >= 1 && sem <= prog.semesters)) sem = cur <= prog.semesters ? cur : 1;

    var tabs = '';
    for (var s = 1; s <= prog.semesters; s++) {
      tabs += '<a class="seg' + (s === sem ? ' on' : '') + '" href="#/programs/' + prog.id + '/' + br.id + '?sem=' + s + '">Sem ' + s +
        (s === cur ? '<i>current</i>' : '') + '</a>';
    }

    var subjects = DS.courses({ programId: prog.id, branchId: br.id, semester: sem });
    var credits = subjects.reduce(function (t, c) { return t + c.credits; }, 0);
    var teachers = {};
    subjects.forEach(function (c) { if (c.teacherId) teachers[c.teacherId] = true; });

    var rows = subjects.map(function (c) {
      var status = sem > cur ? 'Upcoming' : (c.marksSubmitted ? 'Submitted' : 'Pending');
      return '<tr>' +
        '<td class="code-cell">' + esc(c.code) + '</td>' +
        '<td>' + esc(c.title) + '</td>' +
        '<td class="num">' + c.credits + '</td>' +
        '<td>' + teacherCell(c.teacherId) + '</td>' +
        '<td class="small">' + emailCell(c.teacherId) + '</td>' +
        '<td class="num">' + c.students + '</td>' +
        '<td>' + pill(status, statusTone(status)) + '</td>' +
        '</tr>';
    }).join('') || emptyRow(7, 'No subjects are catalogued for this semester yet');

    return '<div class="crumbs"><a href="#/programs">Programs</a> / <a href="#/programs/' + prog.id + '">' + esc(prog.name) +
      '</a> / ' + esc(br.name) + '</div>' +
      '<div class="page-head"><div><h1>' + esc(br.name) + ' <span class="muted" style="font-size:16px">(' + esc(br.code) + ')</span></h1>' +
      '<p class="sub">' + esc(prog.name) + ' · intake ' + br.intake + ' · ' + esc(br.dept) + '</p></div></div>' +
      '<div class="sem-bar"><div class="seg-track" role="tablist" aria-label="Semester">' + tabs + '</div>' +
      '<div class="muted small">Semester ' + sem + ' · ' + subjects.length + ' subjects · ' + credits + ' credits · ' + Object.keys(teachers).length + ' teachers</div></div>' +
      '<section class="card" style="padding:0"><div class="table-wrap" style="border:0;border-radius:var(--radius)"><table>' +
        '<thead><tr><th>Code</th><th>Subject</th><th class="num">Credits</th><th>Teacher</th><th>Email</th>' +
        '<th class="num">Students</th><th>Marks</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></section>' +
      '<p class="hint-line">Click a teacher’s name to see their phone, faculty ID and full teaching load.</p>';
  }

  /* ----- Faculty accounts ----- */
  function renderFaculty() {
    var list = DS.faculty({ q: ui.facQ, status: ui.facStatus });
    var rows = list.map(function (f) {
      var load = DS.teacherCourses(f.id).length;
      var actions = '<button class="btn btn-ghost btn-sm" type="button" data-action="open-teacher" data-id="' + esc(f.id) + '">View</button>';
      if (f.status === 'Active') {
        actions += '<button class="btn btn-ghost btn-sm" type="button" data-action="toggle-status" data-id="' + esc(f.id) + '" data-to="Suspended">Suspend</button>';
      } else if (f.status === 'Suspended') {
        actions += '<button class="btn btn-ghost btn-sm" type="button" data-action="toggle-status" data-id="' + esc(f.id) + '" data-to="Active">Reactivate</button>';
      }
      if (f.status !== 'Deactivated') {
        actions += '<button class="btn btn-danger btn-sm" type="button" data-action="toggle-status" data-id="' + esc(f.id) + '" data-to="Deactivated">Deactivate</button>';
      }
      return '<tr><td><button class="link-btn" type="button" data-action="open-teacher" data-id="' + esc(f.id) + '">' + esc(f.name) + '</button>' +
        '<small>' + esc(f.dept) + '</small></td>' +
        '<td>' + esc(f.facultyId) + '</td>' +
        '<td class="small"><a href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a></td>' +
        '<td class="small">' + esc(f.phone || '—') + '</td>' +
        '<td class="num">' + load + '</td>' +
        '<td>' + pill(f.status, statusTone(f.status)) + '</td>' +
        '<td><div class="cell-actions">' + actions + '</div></td></tr>';
    }).join('') || emptyRow(7, 'No faculty accounts match these filters');

    var statusOpts = [['', 'All statuses'], ['Active', 'Active'], ['Suspended', 'Suspended'], ['Deactivated', 'Deactivated']]
      .map(function (o) { return '<option value="' + o[0] + '"' + (ui.facStatus === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');

    return '<div class="page-head"><div><h1>Faculty Accounts</h1>' +
      '<p class="sub">Provision, suspend or deactivate faculty. Only @banasthali.in addresses are accepted.</p></div>' +
      '<div class="cell-actions"><button class="btn btn-ghost" type="button" data-action="bulk-import">Bulk import (CSV)</button>' +
      '<button class="btn" type="button" data-action="add-faculty">+ Add faculty</button></div></div>' +
      '<div class="toolbar">' +
        '<label class="field">Search<input class="input" id="f-facq" data-filter="facQ" type="search" placeholder="Name, email or faculty ID" value="' + esc(ui.facQ) + '"></label>' +
        '<label class="field">Status<select class="select select-sm" id="f-facst" data-filter="facStatus">' + statusOpts + '</select></label>' +
      '</div>' +
      '<section class="card" style="padding:0"><div class="table-wrap" style="border:0;border-radius:var(--radius)"><table>' +
        '<thead><tr><th>Name</th><th>Faculty ID</th><th>Email</th><th>Mobile</th><th class="num">Courses</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></section>' +
      '<p class="hint-line">' + list.length + ' of ' + DS.faculty({}).length + ' accounts shown.</p>';
  }

  /* ----- Course catalogue + allocation ----- */
  function renderCourses() {
    var conf = DS.conflicts();
    var progOpts = '<option value="">All programs and branches</option>' + DS.programs().map(function (p) {
      return '<optgroup label="' + esc(p.name) + '">' + p.branches.map(function (b) {
        var val = p.id + '|' + b.id;
        return '<option value="' + val + '"' + (ui.crsBranch === val ? ' selected' : '') + '>' + esc(b.code + ' · ' + b.name) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
    var semOpts = '<option value="">All semesters</option>' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (s) {
      return '<option value="' + s + '"' + (String(s) === ui.crsSem ? ' selected' : '') + '>Semester ' + s + '</option>';
    }).join('');

    var parts = ui.crsBranch ? ui.crsBranch.split('|') : [];
    var list = DS.courses({
      q: ui.crsQ,
      programId: parts[0] || '',
      branchId: parts[1] || '',
      semester: ui.crsSem,
      unassigned: ui.crsOnly === 'unassigned'
    });

    var facOpts = function (selected) {
      return '<option value="">— Unassigned —</option>' + D.DS.faculty({}).map(function (f) {
        return '<option value="' + esc(f.id) + '"' + (f.id === selected ? ' selected' : '') + '>' +
          esc(f.name) + (f.status !== 'Active' ? ' (' + f.status.toLowerCase() + ')' : '') + '</option>';
      }).join('');
    };

    var rows = list.map(function (c) {
      var bl = branchLabel(c);
      return '<tr><td class="code-cell">' + esc(c.code) + '</td><td>' + esc(c.title) + '<small>' + c.credits + ' credits</small></td>' +
        '<td class="small">' + esc(bl.text) + '</td><td class="num">' + c.semester + '</td>' +
        '<td><select class="select select-sm" style="min-width:200px" aria-label="Allocate teacher for ' + esc(c.code) + '" data-action="assign" data-id="' + esc(c.id) + '">' +
          facOpts(c.teacherId) + '</select></td>' +
        '<td><button class="btn btn-danger btn-sm" type="button" data-action="delete-course" data-id="' + esc(c.id) + '">Remove</button></td></tr>';
    }).join('') || emptyRow(6, 'No courses match these filters');

    var overloadText = conf.overloaded.length
      ? conf.overloaded.map(function (o) { return esc(o.faculty ? o.faculty.name : 'Unknown') + ' (' + o.count + ' in sem ' + o.semester + ')'; }).join(', ')
      : 'None (limit ' + D.MAX_LOAD + ' per semester)';

    return '<div class="page-head"><div><h1>Courses &amp; Allocation</h1>' +
      '<p class="sub">Master catalogue of course codes, credits and semesters, and the teacher allocated to each.</p></div>' +
      '<div><button class="btn" type="button" data-action="add-course">+ Add course</button></div></div>' +
      '<div class="stat-grid">' +
        '<div class="card ' + (conf.unassigned.length ? 'is-bad' : 'is-good') + '"><div class="t">Unassigned courses</div><div class="n">' + conf.unassigned.length + '</div>' +
          '<div style="margin-top:8px"><button class="btn btn-ghost btn-sm" type="button" data-action="show-unassigned">Show them</button></div></div>' +
        '<div class="card ' + (conf.inactive.length ? 'is-warn' : 'is-good') + '"><div class="t">Taught by suspended / deactivated faculty</div><div class="n">' + conf.inactive.length + '</div>' +
          '<div class="hint-line">Reassign these courses to an active teacher.</div></div>' +
        '<div class="card ' + (conf.overloaded.length ? 'is-bad' : 'is-good') + '"><div class="t">Over-allocated faculty</div><div class="n" style="font-size:15px;line-height:1.4">' + overloadText + '</div></div>' +
      '</div>' +
      '<div class="toolbar">' +
        '<label class="field">Search<input class="input" id="f-crsq" data-filter="crsQ" type="search" placeholder="Course code or title" value="' + esc(ui.crsQ) + '"></label>' +
        '<label class="field">Branch<select class="select select-sm" id="f-crsbr" data-filter="crsBranch">' + progOpts + '</select></label>' +
        '<label class="field">Semester<select class="select select-sm" id="f-crssem" data-filter="crsSem">' + semOpts + '</select></label>' +
        '<label class="field">Allocation<select class="select select-sm" id="f-crsonly" data-filter="crsOnly">' +
          '<option value="">All courses</option><option value="unassigned"' + (ui.crsOnly === 'unassigned' ? ' selected' : '') + '>Unassigned only</option></select></label>' +
      '</div>' +
      '<section class="card" style="padding:0"><div class="table-wrap" style="border:0;border-radius:var(--radius)"><table>' +
        '<thead><tr><th>Code</th><th>Course title</th><th>Branch</th><th class="num">Sem</th><th>Allocated teacher</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></section>' +
      '<p class="hint-line">' + list.length + ' courses shown. Changing a teacher in the dropdown saves immediately and is written to the audit log.</p>';
  }

  /* ----- Compliance ----- */
  function renderCompliance() {
    var c = DS.compliance();
    var deptRows = c.rows.map(function (r) {
      var st = r.pct >= 90 ? 'Compliant' : 'At risk';
      return '<tr><td>' + esc(r.dept) + '</td><td class="num">' + r.total + '</td><td style="min-width:200px">' + bar(r.pct, 90) +
        '</td><td class="num">' + r.overdue + '</td><td>' + pill(st, statusTone(st)) + '</td></tr>';
    }).join('') || emptyRow(5, 'No courses in the current semester');

    var lineItem = function (x) {
      return '<tr><td class="code-cell">' + esc(x.course.code) + '</td><td>' + esc(x.course.title) + '</td>' +
        '<td class="small">' + esc(x.branch ? x.branch.code : '') + '</td>' +
        '<td>' + (x.teacher ? '<span>' + esc(x.teacher.name) + '</span><small><a href="mailto:' + esc(x.teacher.email) + '">' + esc(x.teacher.email) + '</a></small>' : pill('Unassigned', 'bad')) + '</td></tr>';
    };
    var overdueRows = c.overdue.map(lineItem).join('') || emptyRow(4, 'No pending marks in the current semester');
    return '<div class="page-head"><div><h1>Compliance Tracking</h1>' +
      '<p class="sub">Real-time submission status per department for semester ' + c.semester + ' (current).</p></div></div>' +
      '<section class="card"><h2>Submission status by department</h2><div class="table-wrap"><table>' +
        '<thead><tr><th>Department</th><th class="num">Courses</th><th>Marks submitted</th><th class="num">Overdue</th><th>Status</th></tr></thead>' +
        '<tbody>' + deptRows + '</tbody></table></div><p class="hint-line">A department is Compliant at 90% or more of marks submitted.</p></section>' +
      '<section class="card"><h2>Overdue marks <span class="pill pill-bad">' + c.overdue.length + '</span></h2><div class="table-wrap"><table>' +
          '<thead><tr><th>Code</th><th>Course</th><th>Branch</th><th>Teacher</th></tr></thead><tbody>' + overdueRows + '</tbody></table></div></section>';
  }

  /* ----- Audit log ----- */
  function renderAudit() {
    var list = DS.auditList({ q: ui.audQ, action: ui.audAction });
    var actOpts = '<option value="">All actions</option>' + DS.auditActions().map(function (a) {
      return '<option value="' + esc(a) + '"' + (ui.audAction === a ? ' selected' : '') + '>' + esc(a) + '</option>';
    }).join('');
    var rows = list.map(function (a) {
      return '<tr><td class="small" style="white-space:nowrap">' + esc(fmtTime(a.at)) + '</td>' +
        '<td><b>' + esc(a.action) + '</b></td><td class="small">' + esc(a.actor) + '</td>' +
        '<td>' + esc(a.detail) + '</td><td>' + pill(a.level === 'warn' ? 'Attention' : 'Recorded', a.level === 'warn' ? 'warn' : 'muted') + '</td></tr>';
    }).join('') || emptyRow(5, 'No audit entries match these filters');
    return '<div class="page-head"><div><h1>Audit Log</h1>' +
      '<p class="sub">Timestamped record of marks uploads, allocations, target changes, role edits and failed logins. Entries cannot be edited or deleted.</p></div>' +
      '<div><button class="btn btn-ghost" type="button" data-action="export-audit">Export CSV</button></div></div>' +
      '<div class="toolbar">' +
        '<label class="field">Search<input class="input" id="f-audq" data-filter="audQ" type="search" placeholder="Search detail or actor" value="' + esc(ui.audQ) + '"></label>' +
        '<label class="field">Action<select class="select select-sm" id="f-audact" data-filter="audAction">' + actOpts + '</select></label>' +
      '</div>' +
      '<section class="card" style="padding:0"><div class="table-wrap" style="border:0;border-radius:var(--radius)"><table>' +
        '<thead><tr><th>Time (IST)</th><th>Action</th><th>Actor</th><th>Detail</th><th>Level</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></section>';
  }

  /* ---------- router ---------- */
  var routes = {
    overview: renderOverview,
    programs: function () { var p = currentPath(); return renderPrograms(p.parts.slice(1), p.params); },
    faculty: renderFaculty,
    courses: renderCourses,
    compliance: renderCompliance,
    audit: renderAudit
  };

  function updateNavCounts() {
    var conf = DS.conflicts();
    var cNav = document.getElementById('nav-conflicts');
    var n = conf.unassigned.length + conf.inactive.length;
    cNav.textContent = n;
    cNav.hidden = n === 0;
    var oNav = document.getElementById('nav-overdue');
    var od = DS.compliance().overdue.length;
    oNav.textContent = od;
    oNav.hidden = od === 0;
  }

  function render() {
    var page = currentPath().parts[0] || 'overview';
    if (!routes[page]) page = 'overview';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === page;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    viewEl.innerHTML = routes[page]();
    updateNavCounts();
    var titles = { overview: 'Overview', programs: 'Programs', faculty: 'Faculty', courses: 'Courses', compliance: 'Compliance', audit: 'Audit log' };
    document.title = (titles[page] || 'Admin') + ' · IntelliOutcome Admin';
  }

  /* ---------- teacher detail ---------- */
  function openTeacher(id) {
    var f = DS.facultyById(id);
    if (!f) return;
    var courses = DS.teacherCourses(f.id);
    var list = courses.map(function (c) {
      var bl = branchLabel(c);
      return '<tr><td class="code-cell">' + esc(c.code) + '</td><td>' + esc(c.title) + '</td>' +
        '<td class="small">' + esc(bl.text) + '</td><td class="num">' + c.semester + '</td><td class="num">' + c.students + '</td></tr>';
    }).join('') || emptyRow(5, 'No courses allocated');
    openModal(f.name, '' +
      '<p style="margin:0 0 12px">' + pill(f.status, statusTone(f.status)) + '</p>' +
      '<dl class="info-grid">' +
        '<div><dt>Email</dt><dd><a href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a></dd></div>' +
        '<div><dt>Mobile</dt><dd>' + (f.phone ? '<a href="tel:+91' + esc(f.phone) + '">' + esc(f.phone) + '</a>' : '—') + '</dd></div>' +
        '<div><dt>Faculty ID</dt><dd>' + esc(f.facultyId) + '</dd></div>' +
        '<div><dt>Department</dt><dd>' + esc(f.dept) + '</dd></div>' +
        '<div><dt>Joined</dt><dd>' + esc(f.joined) + '</dd></div>' +
        '<div><dt>Courses this cycle</dt><dd>' + courses.length + '</dd></div>' +
      '</dl>' +
      '<h2>Teaching load</h2>' +
      '<div class="table-wrap"><table><thead><tr><th>Code</th><th>Subject</th><th>Branch</th><th class="num">Sem</th><th class="num">Students</th></tr></thead>' +
      '<tbody>' + list + '</tbody></table></div>' +
      '<div class="form-actions"><a class="btn btn-ghost" href="mailto:' + esc(f.email) + '">Email faculty</a>' +
      '<button class="btn" type="button" data-action="close-modal">Close</button></div>');
  }

  /* ---------- forms ---------- */
  function openFacultyForm() {
    var deptOpts = DS.departments().map(function (d) { return '<option>' + esc(d) + '</option>'; }).join('');
    openModal('Add faculty account', '' +
      '<form data-form="faculty" novalidate>' +
        '<div class="form-grid">' +
          '<label class="field">Faculty ID<input class="input" name="facultyId" required placeholder="e.g. BV-FAC-015"></label>' +
          '<label class="field">Full name<input class="input" name="name" required placeholder="Full name"></label>' +
          '<label class="field full">Institutional email<input class="input" name="email" type="email" required placeholder="yourname@banasthali.in"></label>' +
          '<label class="field">Mobile number<input class="input" name="phone" inputmode="tel" placeholder="10 digits"></label>' +
          '<label class="field">Department<select class="select" name="dept">' + deptOpts + '</select></label>' +
        '</div>' +
        '<p class="alert alert-error form-error" hidden></p>' +
        '<div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
        '<button class="btn" type="submit">Create account</button></div>' +
      '</form>');
  }

  function openBulkForm() {
    openModal('Bulk import faculty (CSV)', '' +
      '<form data-form="bulk" novalidate>' +
        '<p class="muted" style="margin-top:0">Columns, in this order: <b>facultyId, name, email, phone, dept</b>. Every email must end in @banasthali.in. Rows that fail validation are skipped and listed after import.</p>' +
        '<div class="cell-actions" style="margin-bottom:12px">' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="download-template">Download template</button>' +
          '<input type="file" accept=".csv,text/csv" aria-label="Choose CSV file" data-file="bulk">' +
        '</div>' +
        '<label class="field">CSV content<textarea class="input" id="bulk-csv" name="csv" rows="7" placeholder="facultyId,name,email,phone,dept"></textarea></label>' +
        '<p class="alert alert-error form-error" hidden></p>' +
        '<div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
        '<button class="btn" type="submit">Import</button></div>' +
      '</form>');
  }

  function openCourseForm() {
    var branchOpts = DS.programs().map(function (p) {
      return '<optgroup label="' + esc(p.name) + '">' + p.branches.map(function (b) {
        return '<option value="' + p.id + '|' + b.id + '">' + esc(b.code + ' · ' + b.name) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
    var teacherOpts = '<option value="">— Unassigned for now —</option>' + DS.faculty({ status: 'Active' }).map(function (f) {
      return '<option value="' + esc(f.id) + '">' + esc(f.name) + '</option>';
    }).join('');
    openModal('Add course to catalogue', '' +
      '<form data-form="course" novalidate>' +
        '<div class="form-grid">' +
          '<label class="field">Course code<input class="input" name="code" required placeholder="e.g. CS507"></label>' +
          '<label class="field">Credits<input class="input" name="credits" type="number" min="0" max="12" step="1" value="4" required></label>' +
          '<label class="field full">Course title<input class="input" name="title" required placeholder="Course title"></label>' +
          '<label class="field">Branch<select class="select" name="branch" required>' + branchOpts + '</select></label>' +
          '<label class="field">Semester<select class="select" name="semester">' +
            [1, 2, 3, 4, 5, 6, 7, 8].map(function (s) { return '<option value="' + s + '">Semester ' + s + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field full">Allocate teacher<select class="select" name="teacherId">' + teacherOpts + '</select></label>' +
        '</div>' +
        '<p class="alert alert-error form-error" hidden></p>' +
        '<div class="form-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
        '<button class="btn" type="submit">Add course</button></div>' +
      '</form>');
  }

  function submitFaculty(form) {
    var fd = new FormData(form);
    var res = DS.addFaculty({
      facultyId: fd.get('facultyId'), name: fd.get('name'), email: fd.get('email'),
      phone: fd.get('phone'), dept: fd.get('dept')
    });
    if (!res.ok) return showFormError(form, res.error);
    closeModal();
    setFlash('Faculty account created');
    render();
  }

  function submitCourse(form) {
    var fd = new FormData(form);
    var parts = String(fd.get('branch') || '').split('|');
    var res = DS.addCourse({
      code: fd.get('code'), title: fd.get('title'), credits: fd.get('credits'),
      programId: parts[0], branchId: parts[1], semester: fd.get('semester'), teacherId: fd.get('teacherId')
    });
    if (!res.ok) return showFormError(form, res.error);
    closeModal();
    setFlash('Course added to catalogue');
    render();
  }

  function submitBulk(form) {
    var text = form.querySelector('#bulk-csv').value;
    var rows = D.parseCsv(text);
    if (!rows.length) return showFormError(form, 'Paste or choose a CSV with a header row and at least one faculty row.');
    var res = DS.importFaculty(rows);
    var body = '<p class="alert ' + (res.rejected.length ? 'alert-warn' : 'alert-ok') + '" style="margin-top:0">' +
      res.added + ' account' + (res.added === 1 ? '' : 's') + ' created' +
      (res.rejected.length ? ', ' + res.rejected.length + ' rejected' : '') + '.</p>';
    if (res.rejected.length) {
      body += '<div class="table-wrap"><table><thead><tr><th>Line</th><th>Email</th><th>Reason</th></tr></thead><tbody>' +
        res.rejected.map(function (r) {
          return '<tr><td>' + r.line + '</td><td class="small">' + esc(r.email) + '</td><td class="small">' + esc(r.reason) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    body += '<div class="form-actions"><button class="btn" type="button" data-action="close-modal">Done</button></div>';
    openModal('Import finished', body);
    render();
  }

  /* ---------- exports + small actions ---------- */
  function downloadText(name, text) {
    var blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function csvCell(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }

  function exportAudit() {
    var list = DS.auditList({ q: ui.audQ, action: ui.audAction });
    var lines = ['time,action,actor,detail,level'];
    list.forEach(function (a) {
      lines.push([a.at, a.action, a.actor, a.detail, a.level].map(csvCell).join(','));
    });
    downloadText('audit-log.csv', lines.join('\n') + '\n');
    setFlash('Audit log exported');
  }

  function changeStatus(id, to) {
    var f = DS.facultyById(id);
    if (!f) return;
    if (to === 'Deactivated' && !window.confirm('Deactivate ' + f.name + '? Deactivated accounts cannot be reactivated from this screen.')) return;
    DS.setFacultyStatus(id, to);
    setFlash(f.name + ' → ' + to, to !== 'Active');
    render();
  }

  /* ---------- global event wiring ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('modal-backdrop')) return closeModal();
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    switch (action) {
      case 'close-modal': closeModal(); break;
      case 'open-teacher': openTeacher(id); break;
      case 'add-faculty': openFacultyForm(); break;
      case 'bulk-import': openBulkForm(); break;
      case 'add-course': openCourseForm(); break;
      case 'toggle-status': changeStatus(id, el.getAttribute('data-to')); break;
      case 'delete-course':
        var c = DS.courseById(id);
        if (c && window.confirm('Remove ' + c.code + ' · ' + c.title + ' from the catalogue?')) {
          DS.deleteCourse(id);
          setFlash('Course removed', true);
          render();
        }
        break;
      case 'show-unassigned':
        ui.crsOnly = 'unassigned';
        render();
        break;
      case 'export-audit': exportAudit(); break;
      case 'download-template': downloadText('faculty-import-template.csv', D.CSV_TEMPLATE); break;
      case 'reset-demo':
        if (window.confirm('Reset all sample data in this browser to the original seed?')) {
          DS.resetDemo();
          setFlash('Sample data restored');
          render();
        }
        break;
      default: break;
    }
  });

  function onFieldChange(e) {
    var el = e.target;
    if (el.getAttribute && el.getAttribute('data-file') === 'bulk') {
      var file = el.files && el.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var ta = document.getElementById('bulk-csv');
        if (ta) ta.value = String(reader.result || '');
      };
      reader.readAsText(file);
      return;
    }
    if (el.getAttribute && el.getAttribute('data-live') === 'weights') updateWeightHint();
    var key = el.getAttribute && el.getAttribute('data-filter');
    if (key && key in ui) {
      ui[key] = el.value;
      rerender(el.id);
      return;
    }
    if (el.getAttribute && el.getAttribute('data-action') === 'assign') {
      DS.assignTeacher(el.getAttribute('data-id'), el.value || null);
      setFlash('Allocation saved');
      render();
    }
  }
  document.addEventListener('input', onFieldChange);
  document.addEventListener('change', onFieldChange);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    var kind = form.getAttribute('data-form');
    if (!kind) return;
    e.preventDefault();
    if (kind === 'faculty') submitFaculty(form);
    else if (kind === 'course') submitCourse(form);
    else if (kind === 'bulk') submitBulk(form);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalRoot.innerHTML) closeModal();
  });

  window.addEventListener('hashchange', function () {
    closeModal();
    window.scrollTo(0, 0);
    render();
  });

  /* ---------- session timeout (SRS NFR-3.2.2.4: 15 min inactivity) ---------- */
  var IDLE_LIMIT = 15 * 60 * 1000;
  var lastActive = Date.now();
  ['pointerdown', 'keydown', 'input', 'scroll'].forEach(function (ev) {
    document.addEventListener(ev, function () { lastActive = Date.now(); }, true);
  });
  setInterval(function () {
    if (overlay.hidden && Date.now() - lastActive > IDLE_LIMIT) overlay.hidden = false;
  }, 15000);
  document.getElementById('session-continue').addEventListener('click', function () {
    lastActive = Date.now();
    overlay.hidden = true;
  });

  /* ---------- boot ---------- */
  if (!location.hash) location.replace('#/overview');
  render();
})();
