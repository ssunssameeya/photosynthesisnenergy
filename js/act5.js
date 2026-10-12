/* 활동 5 (심화, 항상 열림): 인공 광합성 — 미래 기술 느낌의 화면 */
(function () {
  var ICON = [
    '<svg viewBox="0 0 120 90"><circle cx="24" cy="22" r="14" fill="#ffe27a"/><path d="M60 80 C36 60 40 34 60 18 C80 34 84 60 60 80Z" fill="none" stroke="#36e0c2" stroke-width="4"/><path d="M60 76 V30 M60 50 l-12 -9 M60 60 l13 -10" stroke="#36e0c2" stroke-width="3"/><path d="M92 30 h18 M92 46 h18 M92 62 h18" stroke="#b6fff2" stroke-width="3" stroke-dasharray="4 4"/></svg>',
    '<svg viewBox="0 0 120 90"><rect x="36" y="14" width="48" height="62" rx="6" fill="none" stroke="#36e0c2" stroke-width="4"/><path d="M10 70 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#6fb6ff" stroke-width="3"/><circle cx="22" cy="36" r="7" fill="none" stroke="#b6fff2" stroke-width="3"/><circle cx="100" cy="30" r="9" fill="none" stroke="#ff8a7a" stroke-width="3"/><text x="22" y="20" fill="#b6fff2" font-size="12" text-anchor="middle">H₂</text><text x="100" y="14" fill="#ff8a7a" font-size="12" text-anchor="middle">O₂</text></svg>',
    '<svg viewBox="0 0 120 90"><text x="20" y="50" fill="#b6fff2" font-size="20" font-weight="700">CO₂</text><path d="M62 44 h22 m-8 -8 l8 8 l-8 8" fill="none" stroke="#36e0c2" stroke-width="4"/><rect x="90" y="26" width="22" height="40" rx="4" fill="none" stroke="#ffe27a" stroke-width="4"/><path d="M96 26 v-8 h10 v8" fill="none" stroke="#ffe27a" stroke-width="3"/></svg>',
    '<svg viewBox="0 0 120 90"><path d="M14 74 L40 50 L60 60 L84 28 L106 40" fill="none" stroke="#36e0c2" stroke-width="4"/><circle cx="84" cy="28" r="6" fill="#ffe27a"/><path d="M14 80 H110" stroke="#b6fff2" stroke-width="2"/><text x="60" y="20" fill="#ff8a7a" font-size="16" text-anchor="middle">?</text></svg>'
  ];
  ACT.a5 = { id: 'a5', title: 't_a5', theme: 'future', steps: [
    function (box, ctx) {
      var i = 0, seen = {}, card = h('article', { class: 'fcard' }), nav = h('div', { class: 'row fnav' });
      function show(n) { i = n; seen[n] = 1;
        card.innerHTML = ''; card.append(h('div', { class: 'ficon', html: ICON[n] }), h('div', {}, h('span', { class: 'fno', dir: 'ltr' }, '0' + (n + 1) + ' / 04'), h('h3', { k: 'a5_c' + (n + 1) + 't' }), h('p', { k: 'a5_c' + (n + 1) }))); applyI18n(card);
        [].forEach.call(nav.children, function (b, j) { b.setAttribute('aria-pressed', j === n); });
        if (Object.keys(seen).length === 4) { tbl.hidden = false; ctx.ready(); } }
      [0, 1, 2, 3].forEach(function (n) { nav.append(h('button', { type: 'button', class: 'btn', on: { click: function () { show(n); } } }, '0' + (n + 1))); });
      var tbl = h('div', { class: 'panel', hidden: '' }, h('h3', { k: 'a5_cmp_t' }), h('table', { class: 'data' },
        h('tr', {}, h('th', {}), h('th', { k: 'a5_cmp_plant' }), h('th', { k: 'a5_cmp_art' })),
        h('tr', {}, h('th', { k: 'a5_r1' }), h('td', { k: 'a5_r1p' }), h('td', { k: 'a5_r1a' })),
        h('tr', {}, h('th', { k: 'a5_r2' }), h('td', { k: 'a5_r2p' }), h('td', { k: 'a5_r2a' })),
        h('tr', {}, h('th', { k: 'a5_r3' }), h('td', { k: 'a5_r3p' }), h('td', { k: 'a5_r3a' }))));
      box.append(todo('a5_s1_todo'), nav, card, tbl); show(0);
    },
    function (box, ctx) {
      var w = answerBox('a5', 'idea', 'a5_idea_ph', 10), okq = false;
      var fin = btn('finish', function () { if (!okq) { toast(t('a5_needq'), 'bad'); return; } if (!w.ok()) { toast(t('need_write'), 'bad'); return; } w.save(); ctx.finish(); }, 'btn primary big');
      box.append(todo('a5_s2_todo'),
        h('div', { class: 'panel' }, choice('a5_q', ['a5_q1', 'a5_q2', 'a5_q3'], 0, function () { okq = true; }, ctx.miss)),
        h('div', { class: 'panel' }, h('label', { k: 'a5_idea_lb' }), w, fin));
    }
  ] };
})();
