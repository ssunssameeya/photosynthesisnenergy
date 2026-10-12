/* 활동 1: 식물이 자랄 때 필요한 물질 추론하기 (예상 → 관찰 → 설명) */
function pickOne(optKeys, onPick, cls) {          // 정답 없이 하나 고르는 버튼 묶음
  var box = h('div', { class: 'pickone ' + (cls || '') }), val = null;
  optKeys.forEach(function (k) {
    var b = h('button', { type: 'button', class: 'opt', k: k, 'aria-pressed': 'false' });
    b.addEventListener('click', function () { val = k; [].forEach.call(box.children, function (x) { x.setAttribute('aria-pressed', x === b); }); onPick && onPick(k); });
    box.append(b);
  });
  box.val = function () { return val; };
  return box;
}
(function () {
  var W = { tree0: 2.2, tree5: 76.7, soil0: 90.7, soil5: 90.6 };
  function tree(s) { return '<svg viewBox="0 0 120 120"><path d="M60 112 V' + (70 - s * 20) + '" stroke="#7a5230" stroke-width="' + (6 + s * 8) + '" stroke-linecap="round"/><ellipse cx="60" cy="' + (62 - s * 22) + '" rx="' + (16 + s * 30) + '" ry="' + (14 + s * 26) + '" fill="#7cc67a" stroke="#2b3a2a" stroke-width="4"/></svg>'; }
  var soilSvg = '<svg viewBox="0 0 120 120"><path d="M22 50 h76 l-10 60 h-56z" fill="#c9783f" stroke="#2b3a2a" stroke-width="4"/><ellipse cx="60" cy="50" rx="38" ry="10" fill="#6b4a2f" stroke="#2b3a2a" stroke-width="4"/></svg>';
  var ART = { tree0: tree(0), tree5: tree(1), soil0: soilSvg, soil5: soilSvg };

  ACT.a1 = { id: 'a1', title: 't_a1', steps: [
    function (box, ctx) {                                   // 예상
      var reason = answerBox('a1', 'reason', 'a1_reason_ph');
      var pk = pickOne(['w_soil', 'w_water', 'w_air', 'w_sun'], chk);
      function chk() { if (pk.val() && reason.ok()) ctx.ready(); }
      reason.addEventListener('input', chk);
      box.append(todo('a1_p_todo'),
        h('div', { class: 'cols' },
          h('div', { class: 'panel' }, h('h3', { k: 'a1_story_t' }), note('a1_story', 'strong'),
            h('div', { class: 'beforeafter' }, h('figure', {}, h('span', { html: ART.tree0 }), h('figcaption', { k: 'a1_tree0' })), h('b', { class: 'bigarrow' }, '→'), h('figure', {}, h('span', { html: ART.tree5 }), h('figcaption', { k: 'a1_tree5' })))),
          h('div', { class: 'panel' }, h('h3', { k: 'a1_predict_t' }), h('p', { class: 'q', k: 'a1_q' }), pk, h('label', { k: 'a1_reason_lb' }), reason)));
      ctx.onNext(function () { App.send({ action: 'answer', act: 'a1', key: 'predict', text: t(pk.val()) }); reason.save(); App.a1pred = pk.val(); });
    },
    function (box, ctx) {                                   // 관찰: 저울
      var measured = {}, lcd = h('span', { class: 'lcd big', dir: 'ltr' }, '0.0 kg'), plate = h('div', { class: 'plate' });
      var cells = {}; ['tree0', 'tree5', 'soil0', 'soil5'].forEach(function (k) { cells[k] = h('td', { class: 'num', dir: 'ltr' }, '?'); });
      var dT = h('td', { class: 'num', dir: 'ltr' }, '?'), dS = h('td', { class: 'num', dir: 'ltr' }, '?');
      var items = h('div', { class: 'items' });
      ['tree0', 'tree5', 'soil0', 'soil5'].forEach(function (k) {
        var b = h('button', { type: 'button', class: 'item' }, h('span', { html: ART[k] }), h('b', { k: 'a1_' + k }));
        b.addEventListener('click', function () {
          plate.innerHTML = ART[k]; plate.classList.remove('drop'); void plate.offsetWidth; plate.classList.add('drop');
          var v = 0, target = W[k], n = 0; var iv = setInterval(function () { n++; v = target * Math.min(1, n / 18); lcd.textContent = v.toFixed(1) + ' kg'; if (n >= 18) { clearInterval(iv); cells[k].textContent = target.toFixed(1); measured[k] = 1; b.classList.add('done'); upd(); } }, 40);
        });
        items.append(b);
      });
      function upd() {
        if (measured.tree0 && measured.tree5) dT.textContent = '+' + (W.tree5 - W.tree0).toFixed(1);
        if (measured.soil0 && measured.soil5) dS.textContent = (W.soil5 - W.soil0).toFixed(1);
        if (Object.keys(measured).length === 4) ctx.ready();
      }
      box.append(todo('a1_o_todo'),
        h('div', { class: 'cols' },
          h('div', { class: 'panel' }, h('h3', { k: 'a1_scale_t' }), items, h('div', { class: 'scale' }, plate, h('div', { class: 'scalebase' }, lcd))),
          h('div', { class: 'panel' }, h('h3', { k: 'a1_table_t' }),
            h('table', { class: 'data' },
              h('tr', {}, h('th', {}), h('th', { k: 'a1_col0' }), h('th', { k: 'a1_col5' }), h('th', { k: 'a1_cold' })),
              h('tr', {}, h('th', { k: 'w_willow' }), cells.tree0, cells.tree5, dT),
              h('tr', {}, h('th', { k: 'w_soil' }), cells.soil0, cells.soil5, dS)),
            note('a1_unit'))));
    },
    function (box, ctx) {                                   // 설명
      var fb = fillBlank('a1_sum', [{ opts: ['w_soil', 'w_water', 'w_willow'], ans: 'w_soil' }, { opts: ['w_willow', 'w_soil', 'w_water'], ans: 'w_soil' }, { opts: ['w_soil', 'w_willow', 'w_water'], ans: 'w_willow' }]);
      var after = h('div', { class: 'panel', hidden: '' }), hyp = answerBox('a1', 'hyp', 'a1_hyp_ph');
      var fin = btn('finish', function () { if (!hyp.ok()) { toast(t('need_write'), 'bad'); return; } hyp.save(); App.send({ action: 'answer', act: 'a1', key: 'summary', text: fb.text() }); ctx.finish(); }, 'btn primary big');
      var ck = btn('check', function () {
        if (fb.check()) { fb.lock(); ck.remove(); after.hidden = false;
          after.append(h('h3', { k: 'a1_next_t' }), App.a1pred ? h('p', { class: 'note strong' }, h('span', { k: 'a1_mypred' }), ' ', h('b', { k: App.a1pred })) : null, note('a1_next', 'result'), h('label', { k: 'a1_hyp_lb' }), hyp, fin); applyI18n(after); }
        else { ctx.miss(); toast(t('try_again'), 'bad'); }
      }, 'btn primary');
      box.append(todo('a1_e_todo'), h('div', { class: 'panel' }, h('h3', { k: 'a1_sum_t' }),
        h('table', { class: 'data' }, h('tr', {}, h('th', {}), h('th', { k: 'a1_col0' }), h('th', { k: 'a1_col5' }), h('th', { k: 'a1_cold' })),
          h('tr', {}, h('th', { k: 'w_willow' }), h('td', { class: 'num' }, '2.2'), h('td', { class: 'num' }, '76.7'), h('td', { class: 'num' }, '+74.5')),
          h('tr', {}, h('th', { k: 'w_soil' }), h('td', { class: 'num' }, '90.7'), h('td', { class: 'num' }, '90.6'), h('td', { class: 'num' }, '-0.1'))),
        fb, ck), after);
    }
  ] };
})();
