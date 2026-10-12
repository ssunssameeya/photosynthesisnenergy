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
    function (box, ctx) {                                     // 잎 모형: 기체 화살표
      var S = {}; ['SI', 'SO', 'DI', 'DO'].forEach(function (k) { S[k] = h('div', { 'data-slot': k }); });
      var board = dragBoard([{ id: 'co2_1', k: 'm_co2', html: MOL.co2 }, { id: 'o2_1', k: 'm_o2', html: MOL.o2 }, { id: 'co2_2', k: 'm_co2', html: MOL.co2 }, { id: 'o2_2', k: 'm_o2', html: MOL.o2 }], [S.SI, S.SO, S.DI, S.DO]);
      function model(tk, i, o, cls) { return h('div', { class: 'panel leafmodel ' + cls }, h('h3', { k: tk }), h('div', { class: 'lm' }, h('div', { class: 'io' }, h('b', { k: 'a7_in' }), i, h('span', { class: 'arr' }, '→')), h('div', { class: 'leafpic', html: leafSvg }), h('div', { class: 'io' }, h('span', { class: 'arr' }, '→'), o, h('b', { k: 'a7_out' })))); }
      var ck = btn('check', function () {
        var want = { SI: 'co2', SO: 'o2', DI: 'o2', DO: 'co2' }, ok = true;
        for (var k in want) { var g = (board.get(k) || '').split('_')[0] === want[k]; board.mark(k, g); if (!g) ok = false; }
        if (ok) { board.lock(); ck.remove(); box.append(note('a7_s2ok', 'result')); applyI18n(box); ctx.ready(); } else { ctx.miss(); toast(t('try_again'), 'bad'); }
      }, 'btn primary');
      box.append(todo('a7_s2_todo'), h('div', { class: 'cols' }, model('a7_L2', S.SI, S.SO, 'day'), model('a7_L0', S.DI, S.DO, 'nightm')), board.tray, ck);
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
