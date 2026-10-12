/* 활동 2·3: 광합성에 필요한 물질과 만들어지는 물질 (발견학습 → 광합성 식) */
var MOL = {
  co2:     '<svg viewBox="0 0 64 44"><circle cx="12" cy="22" r="10" fill="#e0473a" stroke="#2b3a2a" stroke-width="2.5"/><circle cx="32" cy="22" r="10" fill="#444" stroke="#2b3a2a" stroke-width="2.5"/><circle cx="52" cy="22" r="10" fill="#e0473a" stroke="#2b3a2a" stroke-width="2.5"/></svg>',
  water:   '<svg viewBox="0 0 64 44"><circle cx="32" cy="18" r="12" fill="#e0473a" stroke="#2b3a2a" stroke-width="2.5"/><circle cx="16" cy="32" r="7" fill="#fff" stroke="#2b3a2a" stroke-width="2.5"/><circle cx="48" cy="32" r="7" fill="#fff" stroke="#2b3a2a" stroke-width="2.5"/></svg>',
  o2:      '<svg viewBox="0 0 64 44"><circle cx="22" cy="22" r="12" fill="#e0473a" stroke="#2b3a2a" stroke-width="2.5"/><circle cx="42" cy="22" r="12" fill="#e0473a" stroke="#2b3a2a" stroke-width="2.5"/></svg>',
  glucose: '<svg viewBox="0 0 64 44"><path d="M20 4 h24 l12 18 l-12 18 h-24 l-12 -18z" fill="#f6c445" stroke="#2b3a2a" stroke-width="2.5"/></svg>',
  soil:    '<svg viewBox="0 0 64 44"><path d="M8 34 q6 -22 24 -20 q20 -6 24 20z" fill="#7a5230" stroke="#2b3a2a" stroke-width="2.5"/></svg>'
};
(function () {
  var DATA = { dark: { c: [400, 424], o: [20.90, 20.88] }, weak: { c: [400, 362], o: [20.90, 20.94] }, strong: { c: [400, 288], o: [20.90, 21.01] } };
  function chart(color, min, max) {
    var s = h('div', { class: 'minichart', html: '<svg viewBox="0 0 200 90" preserveAspectRatio="none"><line x1="0" y1="45" x2="200" y2="45" stroke="#ccc" stroke-dasharray="4 4"/><polyline fill="none" stroke="' + color + '" stroke-width="4" points=""/></svg>' });
    s.draw = function (a, b, p) { var pts = []; for (var i = 0; i <= 20 * p; i++) { var v = a + (b - a) * (i / 20); pts.push((i * 10) + ',' + (90 - (v - min) / (max - min) * 90).toFixed(1)); } s.querySelector('polyline').setAttribute('points', pts.join(' ')); };
    return s;
  }
  var elodea = '<svg viewBox="0 0 200 220"><path d="M30 40 h140 v160 q0 14 -14 14 h-112 q-14 0 -14 -14z" fill="#d9f3ff" fill-opacity=".7" stroke="#2b3a2a" stroke-width="4"/><path d="M34 70 h132" stroke="#8fd0f5" stroke-width="3"/><path d="M100 206 V90" stroke="#2f8f52" stroke-width="7" stroke-linecap="round"/>' + [100, 122, 144, 166, 188].map(function (y) { return '<path d="M100 ' + y + ' q-26 -14 -36 2 q18 10 36 -2z M100 ' + y + ' q26 -14 36 2 q-18 10 -36 -2z" fill="#4fbf7a" stroke="#2b3a2a" stroke-width="3"/>'; }).join('') + '<g class="bubbles">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<circle cx="' + (84 + i * 7) + '" cy="150" r="' + (3 + i % 3) + '" fill="#fff" stroke="#6bb6e0" stroke-width="1.5" style="animation-delay:' + (i * .35) + 's"/>'; }).join('') + '</g></svg>';

  ACT.a23 = { id: 'a23', title: 't_a23', steps: [
    /* ① 센서 실험 */
    function (box, ctx) {
      var cond = 'dark', busy = false, got = {};
      var co = h('span', { class: 'lcd', dir: 'ltr' }, '400 ppm'), ox = h('span', { class: 'lcd', dir: 'ltr' }, '20.90 %');
      var c1 = chart('#e0473a', 270, 440), c2 = chart('#2f7dd0', 20.84, 21.04);
      var cham = h('div', { class: 'chamber c-dark', html: '<div class="lightcone"></div><div class="ch-plant">' + plantSVG('lettuce', 3) + '</div><div class="ch-cover"></div>' });
      var tb = h('tbody');
      var sel = pickOne(['a23_dark', 'a23_weak', 'a23_strong'], function (k) { if (busy) return; cond = k.slice(4); cham.className = 'chamber c-' + cond; reset(); }, 'inline');
      function reset() { co.textContent = '400 ppm'; ox.textContent = '20.90 %'; c1.draw(400, 400, 0); c2.draw(20.9, 20.9, 0); rec.disabled = true; }
      var run = btn('a23_run', function () {
        if (busy) return; busy = true; run.disabled = true; var d = DATA[cond], n = 0;
        var iv = setInterval(function () { n++; var p = n / 40; co.textContent = Math.round(d.c[0] + (d.c[1] - d.c[0]) * p) + ' ppm'; ox.textContent = (d.o[0] + (d.o[1] - d.o[0]) * p).toFixed(2) + ' %'; c1.draw(d.c[0], d.c[1], p); c2.draw(d.o[0], d.o[1], p);
          if (n >= 40) { clearInterval(iv); busy = false; run.disabled = false; rec.disabled = false; } }, 70);
      }, 'btn primary');
      var rec = btn('record', function () {
        var d = DATA[cond]; if (got[cond]) return; got[cond] = 1; rec.disabled = true;
        tb.append(h('tr', {}, h('th', { k: 'a23_' + cond }), h('td', { class: 'num', dir: 'ltr' }, d.c[0] + ' → ' + d.c[1]), h('td', { class: 'num', dir: 'ltr' }, d.o[0].toFixed(2) + ' → ' + d.o[1].toFixed(2))));
        applyI18n(tb); if (Object.keys(got).length === 3) { rule.hidden = false; rule.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
      }); rec.disabled = true;
      sel.children[0].click();
      var fbA = fillBlank('a23_ruleA', [{ opts: ['m_co2', 'm_o2', 'm_n2'], ans: 'm_co2' }, { opts: ['m_o2', 'm_co2', 'm_n2'], ans: 'm_o2' }, { opts: ['w_bigger', 'w_smaller', 'w_same'], ans: 'w_bigger' }]);
      var rule = h('div', { class: 'panel', hidden: '' }, h('h3', { k: 'rule_t' }), fbA,
        btn('check', function (e) { if (fbA.check()) { fbA.lock(); e.target.remove(); rule.append(note('a23_darkq', 'warn')); applyI18n(rule); App.send({ action: 'answer', act: 'a23', key: 'ruleA', text: fbA.text() }); ctx.ready(); } else { ctx.miss(); toast(t('try_again'), 'bad'); } }, 'btn primary'));
      box.append(todo('a23_s1_todo'),
        h('div', { class: 'cols' },
          h('div', { class: 'panel' }, h('h3', { k: 'a23_s1_t' }), note('a23_s1_desc'), sel, cham, h('div', { class: 'row' }, run, rec)),
          h('div', { class: 'panel' }, h('h3', { k: 'a23_sensor_t' }),
            h('div', { class: 'sensor' }, h('b', { k: 'm_co2' }), co, c1), h('div', { class: 'sensor' }, h('b', { k: 'm_o2' }), ox, c2),
            h('table', { class: 'data' }, h('thead', {}, h('tr', {}, h('th', { k: 'a23_cond' }), h('th', { k: 'a23_cocol' }), h('th', { k: 'a23_ocol' }))), tb))),
        rule);
    },
    /* ② 검정말 기포 */
    function (box, ctx) {
      var stage = h('div', { class: 'beaker', html: elodea + '<div class="tube"><i></i></div><div class="incense"><i></i></div>' });
      var log = h('div', { class: 'explog' });
      var q = choice('a23_gasq', ['m_co2', 'm_o2', 'm_n2'], 1, function () { log.append(note('a23_gasok', 'result')); applyI18n(log); ctx.ready(); }, ctx.miss);
      q.hidden = true;
      var b3 = btn('a23_b3', function () { b3.disabled = true; stage.classList.add('flare'); log.append(note('a23_b3r', 'result')); applyI18n(log); q.hidden = false; }); b3.disabled = true;
      var b2 = btn('a23_b2', function () { b2.disabled = true; stage.classList.add('collect'); log.append(note('a23_b2r')); applyI18n(log); setTimeout(function () { b3.disabled = false; }, 1800); }); b2.disabled = true;
      var b1 = btn('a23_b1', function () { b1.disabled = true; stage.classList.add('lit'); log.append(note('a23_b1r')); applyI18n(log); b2.disabled = false; }, 'btn primary');
      box.append(todo('a23_s2_todo'), h('div', { class: 'cols' },
        h('div', { class: 'panel' }, h('h3', { k: 'a23_s2_t' }), stage, h('div', { class: 'row' }, b1, b2, b3)),
        h('div', { class: 'panel' }, h('h3', { k: 'obs_t' }), log, q)));
    },
    /* ③ 녹말 검출 */
    function (box, ctx) {
      var lab = h('div', { class: 'leaves st0', html: '<figure><div class="leafshape la"></div><figcaption data-k="a23_leafA"></figcaption></figure><figure><div class="leafshape lb"></div><figcaption data-k="a23_leafB"></figcaption></figure><div class="bath"><i></i></div>' });
      var log = h('div', { class: 'explog' }), qa = h('div', {});
      function say(k, cls) { log.append(note(k, cls)); applyI18n(log); }
      var fbB = fillBlank('a23_ruleB', [{ opts: ['m_o2', 'm_co2', 'w_soil'], ans: 'm_o2' }, { opts: ['m_glu', 'm_co2', 'w_water'], ans: 'm_glu' }]);
      var rule = h('div', { class: 'panel', hidden: '' }, h('h3', { k: 'rule_t' }), fbB,
        btn('check', function (e) { if (fbB.check()) { fbB.lock(); e.target.remove(); App.send({ action: 'answer', act: 'a23', key: 'ruleB', text: fbB.text() }); ctx.ready(); } else { ctx.miss(); toast(t('try_again'), 'bad'); } }, 'btn primary'));
      var steps = [
        ['a23_c1', function (nx) { lab.className = 'leaves st1'; say('a23_c1r'); nx(); }],
        ['a23_c2', function (nx) {
          qa.innerHTML = ''; qa.append(choice('a23_heatq', ['a23_heat1', 'a23_heat2'], 1, function () { say('a23_heatok', 'result'); lab.className = 'leaves st2';
            qa.innerHTML = ''; qa.append(choice('a23_ethq', ['a23_eth1', 'a23_eth2', 'a23_eth3'], 0, function () { say('a23_ethok', 'result'); qa.innerHTML = ''; nx(); }, ctx.miss)); applyI18n(qa); }, ctx.miss)); applyI18n(qa); }],
        ['a23_c3', function (nx) { lab.className = 'leaves st3'; say('a23_c3r'); nx(); }],
        ['a23_c4', function (nx) { lab.className = 'leaves st4'; say('a23_c4r', 'result');
          qa.append(choice('a23_starchq', ['m_starch', 'm_o2', 'w_water'], 0, function () { say('a23_starchok', 'result'); qa.innerHTML = ''; rule.hidden = false; }, ctx.miss)); applyI18n(qa); }]
      ];
      var bar = h('div', { class: 'row' });
      steps.forEach(function (s, i) { var b = btn(s[0], function () { b.disabled = true; b.classList.add('donebtn'); s[1](function () { if (bar.children[i + 1]) bar.children[i + 1].disabled = false; }); }, i ? 'btn' : 'btn primary'); b.disabled = i > 0; bar.append(b); });
      box.append(todo('a23_s3_todo'), h('div', { class: 'cols' },
        h('div', { class: 'panel' }, h('h3', { k: 'a23_s3_t' }), note('a23_s3_desc'), lab, bar),
        h('div', { class: 'panel' }, h('h3', { k: 'obs_t' }), log, qa)), rule);
    },
    /* ④ 광합성 식 완성 */
    function (box, ctx) {
      var slots = ['A', 'B', 'C', 'D'].map(function (s) { return h('div', { 'data-slot': s }); });
      var board = dragBoard([{ id: 'o2', k: 'm_o2', html: MOL.o2 }, { id: 'water', k: 'w_water', html: MOL.water }, { id: 'soil', k: 'w_soil', html: MOL.soil }, { id: 'glucose', k: 'm_glu', html: MOL.glucose }, { id: 'co2', k: 'm_co2', html: MOL.co2 }], slots);
      var after = h('div', { class: 'panel', hidden: '' }), rev = answerBox('a23', 'revise', 'a23_rev_ph');
      var ck = btn('check', function () {
        var L = [board.get('A'), board.get('B')].sort().join(), Rr = [board.get('C'), board.get('D')].sort().join();
        var okL = L === 'co2,water', okR = Rr === 'glucose,o2';
        ['A', 'B'].forEach(function (s) { board.mark(s, okL); }); ['C', 'D'].forEach(function (s) { board.mark(s, okR); });
        if (okL && okR) { board.lock(); ck.remove(); after.hidden = false; var hyp = App.me.ans && App.me.ans['a1.hyp'];
          after.append(h('h3', { k: 'a23_back_t' }), note('a23_eqdone', 'result'), hyp ? h('p', { class: 'note strong' }, h('span', { k: 'a23_myhyp' }), ' “' + hyp + '”') : null, h('label', { k: 'a23_rev_lb' }), rev,
            btn('finish', function () { if (!rev.ok()) { toast(t('need_write'), 'bad'); return; } rev.save(); ctx.finish(); }, 'btn primary big')); applyI18n(after); }
        else { ctx.miss(); toast(t('try_again'), 'bad'); }
      }, 'btn primary');
      box.append(todo('a23_s4_todo'),
        h('div', { class: 'panel scaffold' }, h('h3', { k: 'a23_clue_t' }), h('ul', {}, h('li', { k: 'a23_clue1' }), h('li', { k: 'a23_clue2' }), h('li', { k: 'a23_clue3' }), h('li', { k: 'a23_clue4' }))),
        h('div', { class: 'panel' }, h('h3', { k: 'a23_eq_t' }),
          h('div', { class: 'eq', dir: 'ltr' }, slots[0], '+', slots[1], h('span', { class: 'arrow' }, h('span', { k: 'w_light' }), h('b', {}, '→')), slots[2], '+', slots[3]),
          board.tray, ck), after);
    }
  ] };
})();
