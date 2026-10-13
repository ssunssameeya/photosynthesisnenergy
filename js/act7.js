/* 활동 7: 광합성과 호흡에서 물질과 에너지의 출입을 모형으로 표현하기 */
(function () {
  var leafSvg = '<svg viewBox="0 0 200 120"><path d="M20 60 C60 6 150 6 184 60 C150 114 60 114 20 60Z" fill="#62c56f" stroke="#2b3a2a" stroke-width="5"/><path d="M22 60 H180 M70 60 l-18 -22 M70 60 l-18 22 M110 60 l-20 -28 M110 60 l-20 28 M148 60 l-16 -20 M148 60 l-16 20" stroke="#2f8f52" stroke-width="3"/></svg>';
  ACT.a7 = { id: 'a7', title: 't_a7', steps: [
    function (box, ctx) {                                     // 빛의 세기에 따른 비교
      var left = 3, grid = h('div', { class: 'cols' });
      [['a7_L0', '400 → 424', '20.90 → 20.88', 0], ['a7_L1', '400 → 400', '20.90 → 20.90', 1], ['a7_L2', '400 → 288', '20.90 → 21.01', 2]].forEach(function (c) {
        grid.append(h('div', { class: 'panel lightcard lc' + c[3] }, h('h3', { k: c[0] }),
          h('table', { class: 'data' }, h('tr', {}, h('th', { k: 'a23_cocol' }), h('td', { class: 'num', dir: 'ltr' }, c[1])), h('tr', {}, h('th', { k: 'a23_ocol' }), h('td', { class: 'num', dir: 'ltr' }, c[2]))),
          choice('a7_cmpq', ['a7_cmp_lt', 'a7_cmp_eq', 'a7_cmp_gt'], c[3], function () { if (--left === 0) { box.append(note('a7_s1ok', 'result')); applyI18n(box); ctx.ready(); } }, ctx.miss)));
      });
      box.append(todo('a7_s1_todo'), note('a7_s1_desc', 'strong'), grid);
    },
    function (box, ctx) {                                     // 두 과정의 모형 → 빛에 따라 동시에 일어나는 양 비교
      var S = {}; ['PI', 'PO', 'RI', 'RO'].forEach(function (k) { S[k] = h('div', { 'data-slot': k }); });
      var board = dragBoard([{ id: 'co2_1', k: 'm_co2', html: MOL.co2 }, { id: 'o2_1', k: 'm_o2', html: MOL.o2 }, { id: 'co2_2', k: 'm_co2', html: MOL.co2 }, { id: 'o2_2', k: 'm_o2', html: MOL.o2 }], [S.PI, S.PO, S.RI, S.RO]);
      function prow(tk, i, o, cls) { return h('div', { class: 'prow ' + cls }, h('b', { class: 'ptag', k: tk }), h('div', { class: 'io' }, h('span', { k: 'a7_in' }), i), h('span', { class: 'arr' }, '→'), h('div', { class: 'leafpic small', html: leafSvg }), h('span', { class: 'arr' }, '→'), h('div', { class: 'io' }, o, h('span', { k: 'a7_out' }))); }
      var viewer = h('div', { class: 'panel', hidden: '' }), seen = {};
      var W = { 0: [0, 9], 1: [9, 9], 2: [24, 9] };           // [광합성 화살표 굵기, 호흡 화살표 굵기]
      function arrow(x1, x2, y, w, col) { return w ? '<line x1="' + x1 + '" y1="' + y + '" x2="' + (x2 - w * 1.2) + '" y2="' + y + '" stroke="' + col + '" stroke-width="' + w + '"/><polygon points="' + (x2 - w * 1.6) + ',' + (y - w * 1.3 - 4) + ' ' + x2 + ',' + y + ' ' + (x2 - w * 1.6) + ',' + (y + w * 1.3 + 4) + '" fill="' + col + '"/>' : ''; }
      function draw(L) {
        var p = W[L][0], r = W[L][1], G = '#2f9d5c', Oc = '#e0733a';
        pic.innerHTML = '<svg viewBox="0 0 640 250"><path d="M230 125 C270 50 370 50 410 125 C370 200 270 200 230 125Z" fill="#62c56f" stroke="#2b3a2a" stroke-width="5"/><path d="M232 125 H406" stroke="#2f8f52" stroke-width="3"/>'
          + '<text x="20" y="34" font-size="20" font-weight="700" fill="' + G + '" data-k="a7_ps"></text><text x="20" y="232" font-size="20" font-weight="700" fill="' + Oc + '" data-k="a7_rs"></text>'
          + (p ? arrow(110, 232, 86, p, G) + arrow(408, 530, 86, p, G) + '<text x="100" y="92" text-anchor="end" font-size="17" font-weight="700" data-k="m_co2"></text><text x="540" y="92" font-size="17" font-weight="700" data-k="m_o2"></text>'
               : '<text x="320" y="34" text-anchor="middle" font-size="17" fill="#888" data-k="a7_none"></text>')
          + arrow(110, 232, 164, r, Oc) + arrow(408, 530, 164, r, Oc) + '<text x="100" y="170" text-anchor="end" font-size="17" font-weight="700" data-k="m_o2"></text><text x="540" y="170" font-size="17" font-weight="700" data-k="m_co2"></text></svg>';
        cap.setAttribute('data-k', 'a7_v' + L); cap.textContent = t('a7_v' + L); applyI18n(pic);
        seen[L] = 1; if (Object.keys(seen).length === 3) quiz.hidden = false;
      }
      var pic = h('div', { class: 'flowpic' }), cap = h('p', { class: 'note result' });
      var lights = pickOne(['a7_L0', 'a7_L1', 'a7_L2'], function (k) { draw(+k.slice(-1)); }, 'inline');
      var quiz = h('div', { hidden: '' }, choice('a7_mq', ['a7_m1', 'a7_m2', 'a7_m3'], 1, function () { quiz.append(note('a7_mok', 'result')); applyI18n(quiz); ctx.ready(); }, ctx.miss));
      viewer.append(h('h3', { k: 'a7_view_t' }), note('a7_thick', 'strong'), lights, pic, cap, quiz);
      var ck = btn('check', function () {
        var want = { PI: 'co2', PO: 'o2', RI: 'o2', RO: 'co2' }, ok = true;
        for (var k in want) { var g = (board.get(k) || '').split('_')[0] === want[k]; board.mark(k, g); if (!g) ok = false; }
        if (ok) { board.lock(); ck.remove(); board.tray.remove(); model.append(note('a7_s2ok', 'result')); viewer.hidden = false; applyI18n(box); lights.children[0].click(); viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        else { ctx.miss(); toast(t('try_again'), 'bad'); }
      }, 'btn primary');
      var model = h('div', { class: 'panel' }, h('h3', { k: 'a7_model_t' }), prow('a7_ps', S.PI, S.PO, 'ps'), prow('a7_rs', S.RI, S.RO, 'rs'), board.tray, ck);
      box.append(todo('a7_s2_todo'), model, viewer);
    },
    function (box, ctx) {                                     // 물질과 에너지 정리
      var f1 = fillBlank('a7_sum1', [{ opts: ['w_lightE', 'w_heatE'], ans: 'w_lightE' }, { opts: ['m_co2', 'm_o2', 'm_glu'], ans: 'm_co2' }, { opts: ['m_glu', 'm_co2', 'w_water'], ans: 'm_glu' }]);
      var f2 = fillBlank('a7_sum2', [{ opts: ['m_glu', 'm_co2'], ans: 'm_glu' }, { opts: ['m_o2', 'm_co2'], ans: 'm_o2' }, { opts: ['w_energy', 'w_lightE'], ans: 'w_energy' }]);
      var f3 = fillBlank('a7_sum3', [{ opts: ['a7_onlylight', 'a6_always'], ans: 'a7_onlylight' }, { opts: ['a6_always', 'a7_onlylight'], ans: 'a6_always' }]);
      var ck = btn('check', function () {
        var ok = [f1, f2, f3].map(function (f) { return f.check(); }).every(Boolean);
        if (!ok) { ctx.miss(); toast(t('try_again'), 'bad'); return; }
        [f1, f2, f3].forEach(function (f) { f.lock(); }); ck.remove();
        App.send({ action: 'answer', act: 'a7', key: 'summary', text: [f1.text(), f2.text(), f3.text()].join(' ') });
        box.append(h('div', { class: 'panel' }, h('h3', { k: 'a7_eq_t' }),
          h('p', { class: 'eqline', dir: 'ltr' }, h('b', { k: 'a7_ps' }), ' : ', h('span', { k: 'm_co2' }), ' + ', h('span', { k: 'w_water' }), ' → ', h('span', { k: 'm_glu' }), ' + ', h('span', { k: 'm_o2' })),
          h('p', { class: 'eqline', dir: 'ltr' }, h('b', { k: 'a7_rs' }), ' : ', h('span', { k: 'm_glu' }), ' + ', h('span', { k: 'm_o2' }), ' → ', h('span', { k: 'm_co2' }), ' + ', h('span', { k: 'w_water' }), ' + ', h('span', { k: 'w_energy' })),
          btn('finish', ctx.finish, 'btn primary big'))); applyI18n(box);
      }, 'btn primary');
      box.append(todo('a7_s3_todo'), h('div', { class: 'panel' }, h('h3', { k: 'rule_t' }), f1, f2, f3, ck));
    }
  ] };
})();
