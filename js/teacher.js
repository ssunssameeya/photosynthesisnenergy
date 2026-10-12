/* 교사 전용 페이지 (한국어) */
(function () {
  var NAMES = { a1: '1 필요한 물질', a23: '2·3 광합성 실험', a4: '4 환경 요인', a5: '5 인공 광합성', a6: '6 호흡', a7: '7 모형', a8: '8 양분 저장' };
  var STATE = { locked: '잠김', open: '활동 중', done: '활동 끝남' };
  var KEYNAME = { predict: '예상', reason: '이유', hyp: '새 가설', summary: '정리 문장', ruleA: '규칙 ①', ruleB: '규칙 ②', revise: '고친 가설', idea: '내 생각', guess: '예상' };
  var T = { pw: '', data: null, tab: 'prog', classes: CFG.CLASSES.slice(), cls: CFG.CLASSES[0], act: 'a1', sel: {} };
  function clsLabel(c) { return c === '' ? '반 미입력' : (/^\d+$/.test(c) ? c + '반' : c); }
  function call(req) { req.tpw = T.pw; req.classes = T.classes; return API.call(req); }
  function el() { return h.apply(null, arguments); }
  function load() {                       // 시트에 적힌 반 이름을 그대로 읽어 진도표의 반 목록으로 씁니다
    return call({ action: 'tOverview' }).then(function (r) {
      if (!r.ok) return r;
      var seen = {}, found = [];
      r.students.forEach(function (s) { var c = String(s.cls == null ? '' : s.cls); if (!seen[c]) { seen[c] = 1; found.push(c); } });
      found.sort(function (a, b) { return a.localeCompare(b, 'ko', { numeric: true }); });
      if (found.length && found.join('|') !== T.classes.join('|')) {
        T.classes = found; if (found.indexOf(T.cls) < 0) T.cls = found[0];
        return call({ action: 'tOverview' }).then(function (r2) { if (r2.ok) T.data = r2; return r2; });
      }
      T.data = r; return r;
    });
  }
  function inCls() { return T.data.students.filter(function (s) { return String(s.cls) === String(T.cls); }).sort(function (a, b) { return a.id < b.id ? -1 : 1; }); }
  function clsPick(onChange) {
    var s = el('select', { class: 'tsel' }); T.classes.forEach(function (c) { s.append(el('option', { value: c }, clsLabel(c))); }); s.value = T.cls;
    s.addEventListener('change', function () { T.cls = s.value; T.sel = {}; onChange(); }); return s;
  }

  function login() {
    var root = $('#app'); root.innerHTML = '';
    var pw = el('input', { type: 'password', placeholder: '교사 비밀번호' }), msg = el('p', { class: 'formmsg' });
    function go() { T.pw = pw.value; load().then(function (r) { if (!r.ok) { msg.textContent = r.err === 'tpw' ? '비밀번호가 맞지 않습니다.' : '연결 오류: ' + (r.msg || r.err); return; } try { sessionStorage.setItem('garden5-t', T.pw); } catch (e) {} draw(); }); }
    pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    root.append(el('div', { class: 'login-card' }, el('h1', {}, '교사 페이지'), el('p', { class: 'sub' }, '식물과 에너지 정원'), pw, el('button', { class: 'btn primary big', on: { click: go } }, '들어가기'), msg,
      API.local ? el('p', { class: 'localnote' }, '연습 모드입니다(구글 시트 미연결). 교사 비밀번호: 1234') : null));
  }

  function draw() {
    var root = $('#app'); root.innerHTML = '';
    var tabs = el('nav', { class: 'tabs' });
    [['prog', '진도표'], ['give', '점수 주기'], ['done', '현황표'], ['ans', '학생 답'], ['admin', '관리']].forEach(function (x) {
      tabs.append(el('button', { 'aria-pressed': String(T.tab === x[0]), on: { click: function () { T.tab = x[0]; draw(); } } }, x[1]));
    });
    var pane = el('div', { class: 'pane tpane' });
    root.append(el('header', { class: 'topbar' }, el('h1', {}, '교사 페이지'), tabs, el('button', { class: 'btn small', on: { click: function () { load().then(draw); } } }, '새로 고침')), pane);
    VIEW[T.tab](pane);
  }

  var VIEW = {
    prog: function (p) {
      var acts = ['a1', 'a23', 'a4', 'a5', 'a6', 'a7', 'a8'];
      var tb = el('table', { class: 'data ttable' }, el('tr', {}, el('th', {}, '반'), acts.map(function (a) { return el('th', {}, NAMES[a]); })));
      T.classes.forEach(function (c) {
        var tr = el('tr', {}, el('th', {}, clsLabel(c)));
        acts.forEach(function (a) {
          var g = T.data.progress[c][a], td = el('td', { class: 'pc st-' + g.state }, el('b', {}, a === 'a5' ? '항상 열림' : STATE[g.state]), el('small', {}, ' 완료 ' + g.pct + '%'));
          function set(st) { call({ action: 'tOpen', cls: c, act: a, state: st }).then(function () { load().then(draw); }); }
          if (a !== 'a5') {
            if (g.state === 'locked') td.append(el('button', { class: 'btn small primary', on: { click: function () { set('open'); } } }, '열기'));
            else { if (g.state === 'done') td.append(el('button', { class: 'btn small', on: { click: function () { set('reopen'); } } }, '활동 중으로')); td.append(el('button', { class: 'btn small', on: { click: function () { set('locked'); } } }, '잠그기')); }
          }
          tr.append(td);
        });
        tb.append(tr);
      });
      p.append(el('p', { class: 'note strong' }, '"열기"를 누르면 그 반 학생에게 활동이 열립니다. 반 학생의 80% 이상이 완료하면 자동으로 "활동 끝남"이 됩니다. 끝난 활동도 학생은 다시 들어갈 수 있습니다.'), el('div', { class: 'scroll' }, tb));
    },
    give: function (p) {
      var list = inCls(), tb = el('table', { class: 'data ttable' }), cnt = el('b', {}, '0명 선택');
      function upd() { cnt.textContent = Object.keys(T.sel).length + '명 선택'; }
      tb.append(el('tr', {}, el('th', {}, '선택'), el('th', {}, '학번'), el('th', {}, '이름'), el('th', {}, '별명'), el('th', {}, '모둠'), el('th', {}, '식물'), el('th', {}, '경험치'), el('th', {}, '상태')));
      list.forEach(function (s) {
        var cb = el('input', { type: 'checkbox', class: 'tcb' }); cb.checked = !!T.sel[s.id];
        cb.addEventListener('change', function () { if (cb.checked) T.sel[s.id] = 1; else delete T.sel[s.id]; upd(); });
        tb.append(el('tr', { 'data-g': s.grp }, el('td', {}, cb), el('td', {}, s.id), el('td', {}, s.name), el('td', {}, s.nick || '-'), el('td', {}, s.grp || '-'), el('td', { class: 'mini', html: s.sp ? plantSVG(s.sp, levelOf(s.peak), { wilt: s.wilt }) : '' }), el('td', { class: 'num' }, String(s.xp)), el('td', {}, s.wilt ? '시듦' : (s.hasPw ? '' : '미가입'))));
      });
      function pick(fn) { T.sel = {}; list.forEach(function (s) { if (fn(s)) T.sel[s.id] = 1; }); draw(); }
      var grps = {}; list.forEach(function (s) { if (s.grp) grps[s.grp] = 1; });
      var quick = el('div', { class: 'row' }, el('button', { class: 'btn small', on: { click: function () { pick(function () { return true; }); } } }, '반 전체'), el('button', { class: 'btn small', on: { click: function () { pick(function () { return false; }); } } }, '선택 해제'),
        Object.keys(grps).sort().map(function (g) { return el('button', { class: 'btn small', on: { click: function () { pick(function (s) { return s.grp === g; }); } } }, g + '모둠'); }));
      function give(it) { var ids = Object.keys(T.sel); if (!ids.length) { toast('학생을 먼저 선택하세요.', 'bad'); return; } call({ action: 'tGive', ids: ids, x: it.xp, label: it.id }).then(function () { toast(it.icon + ' ' + it.name.ko + ' → ' + ids.length + '명'); load().then(draw); }); }
      var good = el('div', { class: 'row' }, CFG.ITEMS.map(function (it) { return el('button', { class: 'btn givebtn good', on: { click: function () { give(it); } } }, it.icon + ' ' + it.name.ko + ' +' + it.xp); }));
      var bad = el('div', { class: 'row' }, CFG.EVENTS.map(function (it) { return el('button', { class: 'btn givebtn bad', on: { click: function () { give(it); } } }, it.icon + ' ' + it.name.ko + ' ' + it.xp); }));
      p.append(el('div', { class: 'row' }, clsPick(draw), quick, cnt), el('div', { class: 'panel' }, el('h3', {}, '칭찬 아이템'), good, el('h3', {}, '재해 이벤트 (식물이 시듭니다)'), bad), el('div', { class: 'scroll' }, tb)); upd();
    },
    done: function (p) {
      var acts = ['a1', 'a23', 'a4', 'a5', 'a6', 'a7', 'a8'], tb = el('table', { class: 'data ttable' }, el('tr', {}, el('th', {}, '학번'), el('th', {}, '이름'), acts.map(function (a) { return el('th', {}, NAMES[a]); }), el('th', {}, '경험치')));
      inCls().forEach(function (s) { tb.append(el('tr', {}, el('td', {}, s.id), el('td', {}, s.name), acts.map(function (a) { var d = s.done[a]; return el('td', { class: d ? 'okc' : '' }, d ? (d.b ? '★' : '✓') : ''); }), el('td', { class: 'num' }, String(s.xp)))); });
      p.append(el('div', { class: 'row' }, clsPick(draw), el('span', { class: 'note' }, '✓ 완료 · ★ 정확하게 해결해 추가 점수')), el('div', { class: 'scroll' }, tb));
    },
    ans: function (p) {
      var as = el('select', { class: 'tsel' }); Object.keys(NAMES).forEach(function (a) { as.append(el('option', { value: a }, NAMES[a])); }); as.value = T.act;
      as.addEventListener('change', function () { T.act = as.value; draw(); });
      var tb = el('table', { class: 'data ttable anst' }, el('tr', {}, el('th', {}, '학번'), el('th', {}, '이름'), el('th', {}, '답')));
      inCls().forEach(function (s) {
        var cell = el('td', { class: 'anscell' });
        Object.keys(s.ans).filter(function (k) { return k.indexOf(T.act + '.') === 0; }).forEach(function (k) { cell.append(el('p', {}, el('b', {}, (KEYNAME[k.split('.')[1]] || k.split('.')[1]) + ': '), s.ans[k])); });
        tb.append(el('tr', {}, el('td', {}, s.id), el('td', {}, s.name), cell));
      });
      p.append(el('div', { class: 'row' }, clsPick(draw), as), el('p', { class: 'note' }, '모든 답은 구글 시트의 "답" 시트에도 시간순으로 쌓입니다.'), el('div', { class: 'scroll' }, tb));
    },
    admin: function (p) {
      var link = el('input', { class: 'tinput', placeholder: 'https://notebooklm.google.com/…', value: T.data.settings.notebook || '' });
      var tb = el('table', { class: 'data ttable' }, el('tr', {}, el('th', {}, '학번'), el('th', {}, '이름'), el('th', {}, '별명'), el('th', {}, '관리')));
      inCls().forEach(function (s) {
        tb.append(el('tr', {}, el('td', {}, s.id), el('td', {}, s.name), el('td', {}, s.nick || '-'), el('td', {},
          el('button', { class: 'btn small', on: { click: function () { if (window.confirm(s.name + ' 학생의 비밀번호를 지울까요? 다음 로그인 때 새로 정합니다.')) call({ action: 'tResetPw', id: s.id }).then(function () { toast('비밀번호를 초기화했습니다.'); load().then(draw); }); } } }, '비밀번호 초기화'),
          el('button', { class: 'btn small', on: { click: function () { if (window.confirm(s.name + ' 학생의 별명을 지울까요?')) call({ action: 'tResetNick', id: s.id }).then(function () { toast('별명을 초기화했습니다.'); load().then(draw); }); } } }, '별명 초기화'))));
      });
      var word = el('input', { class: 'tinput', placeholder: '초기화 라고 입력' });
      p.append(
        el('div', { class: 'panel' }, el('h3', {}, '스마트팜 연구소(노트북LM) 링크'), el('div', { class: 'row' }, link, el('button', { class: 'btn primary', on: { click: function () { call({ action: 'tSet', key: 'notebook', value: link.value.trim() }).then(function () { toast('저장했습니다.'); }); } } }, '저장'))),
        el('div', { class: 'panel' }, el('h3', {}, '학생 계정'), el('div', { class: 'row' }, clsPick(draw)), el('div', { class: 'scroll' }, tb)),
        el('div', { class: 'panel' }, el('h3', {}, '새 학년 초기화'), el('p', { class: 'note warn' }, '모든 학생의 비밀번호, 별명, 식물, 경험치, 활동 기록과 진도표가 지워집니다. 학번과 이름은 구글 시트에서 직접 바꾸세요.'),
          el('div', { class: 'row' }, word, el('button', { class: 'btn', on: { click: function () { if (word.value.trim() !== '초기화') { toast('"초기화"라고 입력해야 합니다.', 'bad'); return; } call({ action: 'tResetYear' }).then(function () { toast('초기화했습니다.'); load().then(draw); }); } } }, '전체 초기화'))));
    }
  };

  window.addEventListener('DOMContentLoaded', function () {
    var s = null; try { s = sessionStorage.getItem('garden5-t'); } catch (e) {}
    if (s) { T.pw = s; load().then(function (r) { if (r.ok) draw(); else login(); }); } else login();
  });
})();
