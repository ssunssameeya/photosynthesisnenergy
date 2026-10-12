/* 공통 규칙 처리기: 브라우저(연습 모드)와 구글 Apps Script가 같은 코드를 씁니다.
   db = { students:{학번:obj}, settings:{}, progress:{반:{활동:'locked'|'open'|'reopen'}}, dirty:{}, answers:[], logs:[] } */
var ACTS = ['a1', 'a23', 'a4', 'a5', 'a6', 'a7', 'a8'];
var ALWAYS_OPEN = { a5: 1 };

function coreNum(v, d) { var n = Number(v); return isNaN(n) || v === '' || v == null ? d : n; }
function coreRules(db) {
  var s = db.settings;
  return { care: coreNum(s.carexp, 1), done: coreNum(s.donexp, 10), bonus: coreNum(s.bonusxp, 5) };
}
function corePublic(s) {
  return { id: s.id, name: s.name, cls: s.cls, grp: s.grp || '', nick: s.nick || '', sp: s.sp || '', xp: s.xp || 0, peak: s.peak || 0,
    wilt: !!s.wilt, care: s.care || {}, done: s.done || {}, log: s.log || [], ans: s.ans || {} };
}
function coreAddXp(db, s, x, label, now) {
  s.xp = Math.max(0, (s.xp || 0) + x);
  s.peak = Math.max(s.peak || 0, s.xp);
  s.log = (s.log || []).concat([{ t: now, k: label, x: x }]).slice(-12);
  db.dirty[s.id] = 1;
  db.logs.push([now, s.id, s.name, s.cls, label, x, s.xp]);
}
function coreClassPct(db, cls, act) {
  var n = 0, d = 0;
  for (var id in db.students) { var s = db.students[id]; if (String(s.cls) === String(cls)) { n++; if (s.done && s.done[act]) d++; } }
  return n ? Math.round(d / n * 100) : 0;
}
function coreActState(db, cls, act) {           // locked | open | done
  if (ALWAYS_OPEN[act]) return 'open';
  var st = (db.progress[cls] || {})[act] || 'locked';
  if (st === 'locked') return 'locked';
  if (st === 'reopen') return 'open';
  return coreClassPct(db, cls, act) >= 80 ? 'done' : 'open';
}
function coreRank(db, me, top) {
  var arr = [];
  for (var id in db.students) { var s = db.students[id]; if (s.nick) arr.push(s); }
  arr.sort(function (a, b) { return (b.xp || 0) - (a.xp || 0) || (b.peak || 0) - (a.peak || 0); });
  var my = 0;
  for (var i = 0; i < arr.length; i++) if (me && arr[i].id === me.id) my = i + 1;
  return { top: arr.slice(0, top || 10).map(function (s) { return { nick: s.nick, sp: s.sp, xp: s.xp || 0, peak: s.peak || 0, wilt: !!s.wilt, me: !!(me && s.id === me.id) }; }), my: my, total: arr.length };
}
function coreState(db, s, req) {
  var open = {};
  for (var i = 0; i < ACTS.length; i++) open[ACTS[i]] = coreActState(db, s.cls, ACTS[i]);
  return { ok: true, me: corePublic(s), open: open, rules: coreRules(db), notebook: db.settings.notebook || '', rank: coreRank(db, s, req.top), today: req.today };
}

function coreHandle(db, req) {
  var a = req.action, now = req.now, S = db.students, s, i;
  db.dirty = db.dirty || {}; db.answers = db.answers || []; db.logs = db.logs || [];

  /* ---------- 교사 ---------- */
  if (a.charAt(0) === 't') {
    if (String(req.tpw || '') !== String(db.settings.teacherPw || '') || !db.settings.teacherPw) return { ok: false, err: 'tpw' };
    if (a === 'tOverview') {
      var list = [], prog = {};
      for (var id in S) { var p = corePublic(S[id]); p.hasPw = !!S[id].pw; delete p.log; list.push(p); }
      (req.classes || []).forEach(function (c) { prog[c] = {}; ACTS.forEach(function (ac) { prog[c][ac] = { state: coreActState(db, c, ac), pct: coreClassPct(db, c, ac) }; }); });
      return { ok: true, students: list, progress: prog, settings: { notebook: db.settings.notebook || '' }, rules: coreRules(db) };
    }
    if (a === 'tOpen') {
      db.progress[req.cls] = db.progress[req.cls] || {};
      db.progress[req.cls][req.act] = req.state; db.progDirty = 1; return { ok: true };
    }
    if (a === 'tGive') {
      (req.ids || []).forEach(function (id) { var st = S[id]; if (!st) return; coreAddXp(db, st, Number(req.x) || 0, req.label || '', now); if (req.x < 0) st.wilt = true; });
      return { ok: true };
    }
    if (a === 'tResetPw') { s = S[req.id]; if (s) { s.pw = ''; db.dirty[s.id] = 1; } return { ok: true }; }
    if (a === 'tResetNick') { s = S[req.id]; if (s) { s.nick = ''; db.dirty[s.id] = 1; } return { ok: true }; }
    if (a === 'tSet') { db.settings[req.key] = req.value; db.setDirty = db.setDirty || {}; db.setDirty[req.key] = 1; return { ok: true }; }
    if (a === 'tResetYear') {
      for (var k in S) { s = S[k]; s.pw = ''; s.nick = ''; s.sp = ''; s.xp = 0; s.peak = 0; s.wilt = false; s.care = {}; s.done = {}; s.log = []; s.ans = {}; db.dirty[k] = 1; }
      db.progress = {}; db.progDirty = 1; return { ok: true };
    }
    return { ok: false, err: 'action' };
  }

  /* ---------- 학생 ---------- */
  s = S[String(req.id || '').trim()];
  if (!s) return { ok: false, err: 'noid' };
  if (a === 'login') {
    if (!s.pw) return { ok: true, setup: true, name: s.name, needNick: true };
    if (s.pw !== req.pw) return { ok: false, err: 'badpw' };
    if (!s.nick || !s.sp) return { ok: true, setup: true, name: s.name, hasPw: true, sp: s.sp || '' };
    return coreState(db, s, req);
  }
  if (a === 'setup') {
    if (s.pw && s.pw !== req.pw) return { ok: false, err: 'badpw' };
    var nick = String(req.nick || '').trim().slice(0, 8);
    if (!nick) return { ok: false, err: 'nick' };
    for (var o in S) if (o !== s.id && S[o].nick === nick) return { ok: false, err: 'nickdup' };
    if (s.nick && s.sp) return { ok: false, err: 'already' };
    s.pw = req.pw; s.nick = nick; s.sp = s.sp || req.sp; db.dirty[s.id] = 1;
    return coreState(db, s, req);
  }
  if (s.pw !== req.pw) return { ok: false, err: 'badpw' };
  var R = coreRules(db);
  if (a === 'state') return coreState(db, s, req);
  if (a === 'care') {
    var c = s.care || {}; if (c.d !== req.today) c = { d: req.today };
    if (!c[req.kind] && { w: 1, a: 1, s: 1 }[req.kind]) { c[req.kind] = 1; s.care = c; s.wilt = false; coreAddXp(db, s, R.care, 'care_' + req.kind, now); }
    return coreState(db, s, req);
  }
  if (a === 'done') {
    if (ACTS.indexOf(req.act) < 0) return { ok: false, err: 'action' };
    if (coreActState(db, s.cls, req.act) === 'locked') return { ok: false, err: 'locked' };
    s.done = s.done || {};
    var gained = 0;
    if (!s.done[req.act]) { gained = R.done + (req.bonus ? R.bonus : 0); s.done[req.act] = { t: now, b: req.bonus ? 1 : 0 }; s.wilt = false; coreAddXp(db, s, gained, 'done_' + req.act, now); }
    var r = coreState(db, s, req); r.gained = gained; return r;
  }
  if (a === 'answer') {
    s.ans = s.ans || {}; var txt = String(req.text || '').slice(0, 400);
    s.ans[req.act + '.' + req.key] = txt; db.dirty[s.id] = 1;
    db.answers.push([now, s.id, s.name, s.cls, req.act, req.key, txt]);
    return { ok: true };
  }
  return { ok: false, err: 'action' };
}
