/* 활동 8: 광합성으로 만들어진 양분의 저장과 이용 — 농산물 야시장 카드 짝 맞추기 */
(function () {
  var PAIRS = [
    { id: 'glu',    form: 'm_glu',    plant: 'p_grape',  icon: '🍇', more: 'a8_more_glu' },
    { id: 'sugar',  form: 'm_sugar',  plant: 'p_cane',   icon: '🎋', more: 'a8_more_sugar' },
    { id: 'starch', form: 'm_starch', plant: 'p_potato', icon: '🥔', more: 'a8_more_starch' },
    { id: 'fat',    form: 'm_fat',    plant: 'p_peanut', icon: '🥜', more: 'a8_more_fat' },
    { id: 'prot',   form: 'm_prot',   plant: 'p_bean',   icon: '🫘', more: 'a8_more_prot' }
  ];
  var FORM_ART = {
    glu: MOL.glucose,
    sugar: '<svg viewBox="0 0 64 44"><path d="M10 6 h16 l8 14 l-8 14 h-16 l-8 -14z" fill="#f6c445" stroke="#2b3a2a" stroke-width="2.5"/><path d="M38 10 h14 l8 12 l-8 12 h-14 l-8 -12z" fill="#ffb05c" stroke="#2b3a2a" stroke-width="2.5"/></svg>',
    starch: '<svg viewBox="0 0 64 44">' + [8, 22, 36, 50].map(function (x, i) { return '<circle cx="' + x + '" cy="' + (i % 2 ? 16 : 28) + '" r="8" fill="#f6c445" stroke="#2b3a2a" stroke-width="2.5"/>'; }).join('') + '</svg>',
    fat: '<svg viewBox="0 0 64 44"><circle cx="14" cy="22" r="9" fill="#ffe27a" stroke="#2b3a2a" stroke-width="2.5"/><path d="M24 12 h34 M24 22 h34 M24 32 h34" stroke="#2b3a2a" stroke-width="5" stroke-linecap="round"/><path d="M24 12 h34 M24 22 h34 M24 32 h34" stroke="#ffb05c" stroke-width="2.5" stroke-linecap="round"/></svg>',
    prot: '<svg viewBox="0 0 64 44"><path d="M6 30 q8 -26 16 -8 t16 0 t16 -6" fill="none" stroke="#2b3a2a" stroke-width="7" stroke-linecap="round"/><path d="M6 30 q8 -26 16 -8 t16 0 t16 -6" fill="none" stroke="#b36ad9" stroke-width="3.5" stroke-linecap="round"/></svg>'
  };
  ACT.a8 = { id: 'a8', title: 't_a8', theme: 'market', steps: [
    function (box, ctx) {                                     // 양분의 이동
      var fb = fillBlank('a8_move', [{ opts: ['a8_night', 'a8_day'], ans: 'a8_night' }, { opts: ['m_sugar', 'm_starch', 'm_prot'], ans: 'm_sugar' }, { opts: ['a8_phloem', 'a8_xylem'], ans: 'a8_phloem' }]);
      var ck = btn('check', function () { if (fb.check()) { fb.lock(); ck.remove(); ctx.ready(); } else { ctx.miss(); toast(t('try_again'), 'bad'); } }, 'btn primary');
      box.append(todo('a8_s1_todo'), h('div', { class: 'panel' }, h('h3', { k: 'a8_s1_t' }),
        h('ol', { class: 'flow' }, h('li', { k: 'a8_f1' }), h('li', { k: 'a8_f2' }), h('li', { k: 'a8_f3' }), h('li', { k: 'a8_f4' })), fb, ck));
    },
    function (box, ctx) {                                     // 카드 짝 맞추기
      var cards = [], open = [], lock = false, left = PAIRS.length, tries = 0;
      PAIRS.forEach(function (p) { cards.push({ p: p, kind: 'form' }, { p: p, kind: 'plant' }); });
      cards.sort(function () { return Math.random() - .5; });
      var grid = h('div', { class: 'mgrid' }), found = h('ul', { class: 'found' }), cnt = h('b', { dir: 'ltr' }, '0');
      cards.forEach(function (c) {
        var face = c.kind === 'form' ? h('div', { class: 'face formface' }, h('span', { class: 'art', html: FORM_ART[c.p.id] }), h('b', { k: c.p.form })) : h('div', { class: 'face plantface' }, h('span', { class: 'emo' }, c.p.icon), h('b', { k: c.p.plant }));
        var el = h('button', { type: 'button', class: 'mcard' }, h('div', { class: 'inner' }, h('div', { class: 'back' }, '🏮'), face));
        el.addEventListener('click', function () {
          if (lock || el.classList.contains('up')) return; el.classList.add('up'); open.push({ el: el, c: c });
          if (open.length < 2) return; tries++; cnt.textContent = tries; var a = open[0], b = open[1]; open = [];
          if (a.c.p === b.c.p && a.c.kind !== b.c.kind) { a.el.classList.add('matched'); b.el.classList.add('matched'); found.append(h('li', {}, h('b', {}, a.c.p.icon + ' '), h('span', { k: a.c.p.more }))); applyI18n(found); if (--left === 0) ctx.ready(); }
          else { lock = true; if (tries > 12) ctx.miss(); setTimeout(function () { a.el.classList.remove('up'); b.el.classList.remove('up'); lock = false; }, 900); }
        });
        grid.append(el);
      });
      box.append(todo('a8_s2_todo'), h('div', { class: 'cols' }, h('div', { class: 'panel stall' }, grid, h('p', { class: 'note' }, h('span', { k: 'a8_tries' }), ' ', cnt)), h('div', { class: 'panel' }, h('h3', { k: 'a8_found_t' }), found)));
    },
    function (box, ctx) {                                     // 양분의 쓰임
      var fb = fillBlank('a8_use', [{ opts: ['w_resp', 'w_photo'], ans: 'w_resp' }, { opts: ['a8_build', 'a8_break'], ans: 'a8_build' }, { opts: ['a8_store', 'a8_throw'], ans: 'a8_store' }]);
      var ck = btn('check', function () { if (fb.check()) { fb.lock(); ck.remove(); App.send({ action: 'answer', act: 'a8', key: 'summary', text: fb.text() }); box.append(btn('finish', ctx.finish, 'btn primary big')); applyI18n(box); } else { ctx.miss(); toast(t('try_again'), 'bad'); } }, 'btn primary');
      box.append(todo('a8_s3_todo'), h('div', { class: 'panel' }, h('h3', { k: 'rule_t' }), fb, ck));
    }
  ] };
})();
