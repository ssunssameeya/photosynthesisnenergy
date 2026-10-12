/* 로그인 · 내 식물 · 단원 정원 · 랭킹 */
var ACT = {};          // 활동 모듈이 여기에 등록됩니다: ACT.a1 = { title, steps, ... }
var App = {
  me: null, st: null, id: '', pw: '', tab: 'plant',
  send: function (req) { req.id = App.id; req.pw = App.pw; return API.call(req).then(function (r) { if (r && r.ok && r.me) { App.st = r; App.me = r.me; } return r; }); },
  errMsg: function (r) { return t('err_' + (r && r.err || 'net')); },

  /* ---------- 로그인 ---------- */
  login: function () {
    var root = $('#app'); root.className = 'view-login';
    var id = h('input', { id: 'f-id', inputmode: 'numeric', autocomplete: 'off', 'data-kp': 'ph_id', placeholder: t('ph_id') });
    var pw = h('input', { id: 'f-pw', type: 'password', 'data-kp': 'ph_pw', placeholder: t('ph_pw') });
    var msg = h('p', { class: 'formmsg' });
    function go() {
      App.id = id.value.trim(); if (!App.id) return;
      App.pw = API.hashPw(App.id, pw.value);
      msg.textContent = t('loading');
      App.send({ action: 'login' }).then(function (r) {
        if (!r.ok) { msg.textContent = App.errMsg(r); return; }
        try { sessionStorage.setItem('garden5-sess', JSON.stringify({ id: App.id, pw: App.pw })); } catch (e) {}
        if (r.setup) App.setup(r, pw.value); else App.home('plant');
      });
    }
    pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    root.innerHTML = '';
    root.append(h('div', { class: 'login-card' },
      h('div', { class: 'login-art', html: plantSVG('tomato', 5) + plantSVG('sunflower', 4) + plantSVG('strawberry', 2) }),
      h('h1', { k: 'site' }), h('p', { class: 'sub', k: 'site_sub' }),
      h('label', { for: 'f-id', k: 'lb_id' }), id, h('label', { for: 'f-pw', k: 'lb_pw' }), pw,
      h('p', { class: 'hint', k: 'first_hint' }), btn('enter', go, 'btn primary big'), msg,
      API.local ? h('p', { class: 'localnote', k: 'local_note' }) : null));
  },
  setup: function (r, rawPw) {
    var root = $('#app'); root.className = 'view-login'; root.innerHTML = '';
    var pw1 = h('input', { type: 'password', 'data-kp': 'ph_newpw', placeholder: t('ph_newpw') }), pw2 = h('input', { type: 'password', 'data-kp': 'ph_newpw2', placeholder: t('ph_newpw2') });
    var nick = h('input', { maxlength: '8', 'data-kp': 'ph_nick', placeholder: t('ph_nick') }), msg = h('p', { class: 'formmsg' }), sp = r.sp || '';
    var picks = h('div', { class: 'picks' });
    CFG.SPECIES.forEach(function (s) {
      var b = h('button', { type: 'button', class: 'pick', 'aria-pressed': 'false' }, h('span', { html: plantSVG(s.id, 5) }), h('b', {}, cfgName(s.name)));
      b.addEventListener('click', function () { sp = s.id; [].forEach.call(picks.children, function (x) { x.setAttribute('aria-pressed', x === b); }); });
      picks.append(b);
    });
    function go() {
      if (!r.hasPw) { if (pw1.value.length < 4) { msg.textContent = t('err_pwshort'); return; } if (pw1.value !== pw2.value) { msg.textContent = t('err_pwdiff'); return; } App.pw = API.hashPw(App.id, pw1.value); }
      if (!nick.value.trim()) { msg.textContent = t('err_nick'); return; }
      if (!sp) { msg.textContent = t('err_sp'); return; }
      App.send({ action: 'setup', nick: nick.value.trim(), sp: sp }).then(function (x) {
        if (!x.ok) { msg.textContent = App.errMsg(x); return; }
        try { sessionStorage.setItem('garden5-sess', JSON.stringify({ id: App.id, pw: App.pw })); } catch (e) {}
        App.home('plant');
      });
    }
    root.append(h('div', { class: 'login-card wide' }, h('h1', {}, (r.name || '') + ' ', h('span', { k: 'welcome' })),
      r.hasPw ? null : [h('label', { k: 'lb_newpw' }), pw1, pw2],
      h('label', { k: 'lb_nick' }), nick, h('p', { class: 'hint', k: 'nick_hint' }),
      r.sp ? null : [h('label', { k: 'lb_sp' }), picks, h('p', { class: 'hint', k: 'sp_hint' })],
      btn('startGrow', go, 'btn primary big'), msg));
  },
  logout: function () { try { sessionStorage.removeItem('garden5-sess'); } catch (e) {} App.me = null; App.login(); },

  /* ---------- 홈 (탭) ---------- */
  home: function (tab) {
    App.tab = tab || App.tab;
    var root = $('#app'); root.className = 'view-home'; root.innerHTML = '';
    var tabs = h('nav', { class: 'tabs' });
    [['plant', 'tab_plant'], ['garden', 'tab_garden'], ['rank', 'tab_rank']].forEach(function (x) {
      tabs.append(h('button', { type: 'button', k: x[1], 'aria-pressed': String(App.tab === x[0]), on: { click: function () { App.home(x[0]); } } }));
    });
    var who = h('div', { class: 'who' }, h('b', {}, App.me.nick), h('span', {}, ' · ' + App.me.xp + ' XP'), btn('logout', App.logout, 'btn ghost small'));
    var pane = h('div', { class: 'pane pane-' + App.tab });
    root.append(h('header', { class: 'topbar' }, h('h1', { k: 'site' }), tabs, who), pane);
    App['draw_' + App.tab](pane); applyI18n(root);
    App.send({ action: 'state' }).then(function (r) { if (r.ok && $('#app').className === 'view-home') { pane.innerHTML = ''; App['draw_' + App.tab](pane); who.children[1].textContent = ' · ' + App.me.xp + ' XP'; applyI18n(pane); } });
  },
  logLabel: function (k) {
    var all = CFG.ITEMS.concat(CFG.EVENTS).filter(function (x) { return x.id === k; })[0];
    if (all) return all.icon + ' ' + cfgName(all.name);
    if (k.indexOf('care_') === 0) return t('log_' + k);
    if (k.indexOf('done_') === 0) return t('log_done') + ' · ' + t('t_' + k.slice(5));
    return k;
  },
  draw_plant: function (pane) {
    var me = App.me, lv = levelOf(me.peak), L = CFG.LEVELS, cur = L[lv - 1], nxt = L[lv];
    var pct = nxt ? Math.min(100, Math.max(0, (me.peak - cur.need) / (nxt.need - cur.need) * 100)) : 100;
    var stage = h('div', { class: 'stage' + (me.wilt ? ' wilted' : '') }, h('div', { class: 'sky' }), h('div', { class: 'fxlayer' }), h('div', { class: 'mine', html: plantSVG(me.sp, lv, { wilt: me.wilt }) }));
    var c = (me.care && me.care.d === App.st.today) ? me.care : {};
    var cares = h('div', { class: 'cares' });
    [['w', '💧', 'care_w'], ['a', '🍃', 'care_a'], ['s', '☀️', 'care_s']].forEach(function (x) {
      var b = h('button', { type: 'button', class: 'care', disabled: c[x[0]] ? '' : null }, h('span', { class: 'ico' }, x[1]), h('span', { k: x[2] }), h('small', {}, c[x[0]] ? '✓' : '+' + App.st.rules.care + ' XP'));
      b.addEventListener('click', function () {
        b.disabled = true; stage.classList.add('fx-' + x[0]);
        App.send({ action: 'care', kind: x[0] }).then(function (r) { setTimeout(function () { if (r.ok) App.home('plant'); else toast(App.errMsg(r), 'bad'); }, 1300); });
      });
      cares.append(b);
    });
    var log = h('ul', { class: 'loglist' });
    (me.log || []).slice().reverse().slice(0, 6).forEach(function (e) { log.append(h('li', { class: e.x < 0 ? 'neg' : '' }, h('span', {}, App.logLabel(e.k)), h('b', { dir: 'ltr' }, (e.x > 0 ? '+' : '') + e.x))); });
    if (!log.children.length) log.append(h('li', { class: 'empty', k: 'log_empty' }));
    pane.append(
      h('section', { class: 'plantcard' }, stage,
        h('div', { class: 'pinfo' },
          h('h2', {}, me.nick + ' ', h('small', {}, cfgName((CFG.SPECIES.filter(function (s) { return s.id === me.sp; })[0] || {}).name))),
          h('div', { class: 'lv' }, h('b', {}, 'Lv.' + lv), h('span', {}, cfgName(cur.name))),
          h('div', { class: 'xpbar', dir: 'ltr' }, h('i', { style: 'width:' + pct + '%' })),
          h('p', { class: 'xptxt', dir: 'ltr' }, nxt ? me.peak + ' / ' + nxt.need + ' XP' : me.peak + ' XP · MAX'),
          me.wilt ? h('p', { class: 'wiltmsg', k: 'wilt_msg' }) : null,
          todo('todo_care'), cares)),
      h('aside', { class: 'side' }, h('h3', { k: 'log_title' }), log, h('h3', { k: 'tab_rank' }), App.rankList(5)));
  },
  rankList: function (n) {
    var R = App.st.rank, ol = h('ol', { class: 'rank' });
    R.top.slice(0, n).forEach(function (r, i) {
      ol.append(h('li', { class: (r.me ? 'me ' : '') + 'r' + (i + 1) }, h('b', { class: 'no', dir: 'ltr' }, String(i + 1)), h('span', { class: 'mini', html: plantSVG(r.sp, levelOf(r.peak), { wilt: r.wilt }) }), h('span', { class: 'nick' }, r.nick), h('b', { class: 'xp', dir: 'ltr' }, r.xp + ' XP')));
    });
    var wrap = h('div', {}, ol);
    if (R.my) wrap.append(h('p', { class: 'myrank' }, h('span', { k: 'my_rank' }), h('b', { dir: 'ltr' }, ' ' + R.my + ' / ' + R.total)));
    return wrap;
  },
  draw_rank: function (pane) { pane.append(h('section', { class: 'rankcard' }, h('h2', { k: 'rank_title' }), h('p', { class: 'note', k: 'rank_note' }), App.rankList(CFG.RANK_TOP))); },

  /* ---------- 단원 정원 ---------- */
  draw_garden: function (pane) {
    var g = h('div', { class: 'garden' }, h('div', { class: 'garden-bg', html: GARDEN_BG }));
    GARDEN_SPOTS.forEach(function (sp) {
      var state = App.st.open[sp.act], mine = App.me.done && App.me.done[sp.act];
      var b = h('button', { type: 'button', class: 'spot s-' + state + (mine ? ' mine-done' : '') + (sp.wide ? ' wide' : ''), style: 'left:' + sp.x + '%;top:' + sp.y + '%', disabled: state === 'locked' ? '' : null },
        h('span', { class: 'spot-art', html: sp.art }),
        h('span', { class: 'spot-no', dir: 'ltr' }, sp.no), h('span', { class: 'spot-name', k: 't_' + sp.act }),
        h('span', { class: 'spot-tag', k: state === 'locked' ? 'st_locked' : state === 'done' ? 'st_done' : 'st_open' }),
        mine ? h('span', { class: 'spot-check' }, '✓') : null);
      b.addEventListener('click', function () { App.open(sp.act); });
      g.append(b);
    });
    var nb = h('button', { type: 'button', class: 'spot greenhouse', style: 'left:84%;top:16%' }, h('span', { class: 'spot-art', html: GREENHOUSE_ART }), h('span', { class: 'spot-name', k: 'greenhouse' }));
    nb.addEventListener('click', function () { var u = App.st.notebook || CFG.NOTEBOOK_URL; if (u) window.open(u, '_blank', 'noopener'); else toast(t('greenhouse_soon')); });
    g.append(nb);
    pane.append(todo('todo_garden'), g);
  },
  open: function (act) {
    var def = ACT[act]; if (!def) { toast(t('soon')); return; }
    var root = $('#app'); root.className = 'view-act';
    runActivity(root, def); applyI18n(root);
  },
  finish: function (act, bonus) {
    App.send({ action: 'done', act: act, bonus: bonus }).then(function (r) {
      if (!r.ok) { toast(App.errMsg(r), 'bad'); return; }
      var lv = levelOf(App.me.peak);
      var m = h('div', { class: 'modal' }, h('div', { class: 'reward' },
        h('h2', { k: r.gained ? 'reward_title' : 'reward_again' }),
        h('div', { class: 'mine big', html: plantSVG(App.me.sp, lv) }),
        r.gained ? h('p', { class: 'gain', dir: 'ltr' }, '+' + r.gained + ' XP') : null,
        r.gained && bonus ? h('p', { class: 'note', k: 'reward_bonus' }) : null,
        btn('toGarden', function () { m.remove(); App.home('garden'); }, 'btn primary big')));
      document.body.append(m); applyI18n(m);
    });
  }
};

window.addEventListener('DOMContentLoaded', function () {
  buildLangBar();
  var s = null; try { s = JSON.parse(sessionStorage.getItem('garden5-sess')); } catch (e) {}
  if (s && s.id) { App.id = s.id; App.pw = s.pw; App.send({ action: 'login' }).then(function (r) { if (r.ok && !r.setup) App.home('plant'); else App.login(); }); }
  else App.login();
});
