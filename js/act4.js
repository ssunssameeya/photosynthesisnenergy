/* 활동 4: 환경 요인과 광합성 (예상 → 직접 조작·기록·그래프 → 한 문장 정리 → 그림 저장) */
(function () {
  var F = {
    light: { unit: '%',  xs: [0, 10, 20, 30, 40, 60, 80, 100], ys: [0, 22, 36, 45, 50, 56, 58, 59], shape: 'sat',  fix: ['a4_fix_co2', 'a4_fix_temp'] },
    co2:   { unit: '%',  xs: [0, 0.01, 0.02, 0.03, 0.04, 0.06, 0.08, 0.1], ys: [0, 24, 38, 47, 52, 57, 59, 59], shape: 'sat',  fix: ['a4_fix_light', 'a4_fix_temp'] },
    temp:  { unit: '°C', xs: [5, 10, 15, 20, 25, 30, 35, 40, 45], ys: [8, 14, 22, 32, 43, 53, 58, 30, 4], shape: 'peak', fix: ['a4_fix_light', 'a4_fix_co2'] }
  };
  var KEYS = ['light', 'co2', 'temp'];
  var SH = { inc: 'M6 34 L54 6', sat: 'M6 34 C16 10 28 8 54 8', peak: 'M6 34 C22 8 34 2 42 8 L54 34' };
  function shapeIcon(s) { return '<svg viewBox="0 0 60 40"><path d="M6 4 V34 H56" fill="none" stroke="#2b3a2a" stroke-width="2.5"/><path d="' + SH[s] + '" fill="none" stroke="#e0473a" stroke-width="4" stroke-linecap="round"/></svg>'; }
  var pred = {};

  function shapePick(onPick) {
    var box = h('div', { class: 'shapepick' }), val = null;
    ['inc', 'sat', 'peak'].forEach(function (s) {
      var b = h('button', { type: 'button', class: 'shape', 'aria-pressed': 'false' }, h('span', { html: shapeIcon(s) }), h('span', { k: 'a4_sh_' + s }));
      b.addEventListener('click', function () { val = s; [].forEach.call(box.children, function (x) { x.setAttribute('aria-pressed', x === b); }); onPick(s); });
      box.append(b);
    });
    return box;
  }

  ACT.a4 = { id: 'a4', title: 't_a4', steps: [
    function (box, ctx) {                                    // 예상
      pred = {};
      box.append(todo('a4_s1_todo'), note('a4_s1_desc', 'strong'));
      var grid = h('div', { class: 'cols' });
      KEYS.forEach(function (k) { grid.append(h('div', { class: 'panel' }, h('h3', { k: 'a4_f_' + k }), h('p', { class: 'q', k: 'a4_predq_' + k }), shapePick(function (s) { pred[k] = s; if (Object.keys(pred).length === 3) { App.send({ action: 'answer', act: 'a4', key: 'predict', text: KEYS.map(function (x) { return x + ':' + pred[x]; }).join(', ') }); ctx.ready(); } }))); });
      box.append(grid);
    },
    function (box, ctx) {                                    // 실험
      var cur = null, pts = {}, done = {}, idx = 0, busy = false, lastY = null;
      var chooser = pickOne(['a4_f_light', 'a4_f_co2', 'a4_f_temp'], function (k) { if (busy) return; setF(k.slice(5)); }, 'inline');
      var fixed = h('ul', { class: 'fixlist' }), slider = h('input', { type: 'range', min: '0', max: '7', step: '1', value: '0', id: 'a4-sl' }), val = h('span', { class: 'lcd', dir: 'ltr' }, '-');
      var count = h('span', { class: 'lcd big', dir: 'ltr' }, '0'), tank = h('div', { class: 'tank', html: '<div class="lamp"></div><div class="weed"></div><div class="bub"></div>' });
      var svg = h('div', { class: 'graph' }), cmp = h('div', { class: 'cmp' }), status = h('div', { class: 'row fstatus' });
      KEYS.forEach(function (k) { status.append(h('span', { class: 'chip', 'data-f': k }, h('span', { k: 'a4_f_' + k }), h('b', {}, ' 0/5'))); });
      function setF(k) {
        cur = k; idx = 0; lastY = null; var f = F[k]; slider.max = f.xs.length - 1; slider.value = 0; pts[k] = pts[k] || {};
        fixed.innerHTML = ''; f.fix.forEach(function (x) { fixed.append(h('li', { k: x })); }); applyI18n(fixed);
        show(); draw(); count.textContent = '0'; recB.disabled = true; work.hidden = false;
      }
      function show() { var f = F[cur]; idx = +slider.value; val.textContent = f.xs[idx] + ' ' + f.unit; tank.style.setProperty('--rate', Math.max(.25, 3.2 - f.ys[idx] / 22) + 's'); tank.classList.toggle('still', f.ys[idx] < 3);
        tank.style.setProperty('--glow', cur === 'light' ? f.xs[idx] / 100 : .6); }
      slider.addEventListener('input', function () { if (busy) { slider.value = idx; return; } show(); recB.disabled = true; count.textContent = '0'; lastY = null; });
      var cntB = btn('a4_count', function () {
        if (!cur || busy) return; busy = true; cntB.disabled = true; var f = F[cur], target = Math.max(0, f.ys[idx] + (f.ys[idx] > 3 ? Math.round(Math.random() * 2 - 1) : 0)), n = 0;
        var iv = setInterval(function () { n++; count.textContent = Math.round(target * n / 25); if (n >= 25) { clearInterval(iv); busy = false; cntB.disabled = false; lastY = target; recB.disabled = false; } }, 60);
      }, 'btn primary');
      var recB = btn('record', function () {
        if (lastY == null) return; pts[cur][idx] = lastY; recB.disabled = true; draw();
        var n = Object.keys(pts[cur]).length; status.querySelector('[data-f="' + cur + '"] b').textContent = ' ' + Math.min(n, 5) + '/5';
        if (n >= 5 && !done[cur]) { done[cur] = 1; status.querySelector('[data-f="' + cur + '"]').classList.add('ok');
          cmp.innerHTML = ''; var same = pred[cur] === F[cur].shape;
          cmp.append(h('div', { class: 'note result' }, h('b', { k: 'a4_cmp_pred' }), h('span', { class: 'shico', html: shapeIcon(pred[cur] || 'inc') }), h('b', { k: 'a4_cmp_res' }), h('span', { class: 'shico', html: shapeIcon(F[cur].shape) }), h('b', { k: same ? 'a4_cmp_same' : 'a4_cmp_diff' }))); applyI18n(cmp);
          if (Object.keys(done).length === 3) ctx.ready(); }
      }); recB.disabled = true;
      function draw() {
        var f = F[cur], W = 380, H = 250, L = 46, B = 36, mx = f.xs[f.xs.length - 1], mn = f.xs[0], P = pts[cur] || {};
        var X = function (v) { return L + (v - mn) / (mx - mn) * (W - L - 14); }, Y = function (v) { return H - B - v / 65 * (H - B - 14); };
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '"><path d="M' + L + ' 10 V' + (H - B) + ' H' + (W - 6) + '" fill="none" stroke="#2b3a2a" stroke-width="3"/>';
        [0, 20, 40, 60].forEach(function (v) { s += '<text x="' + (L - 6) + '" y="' + (Y(v) + 5) + '" text-anchor="end" font-size="13">' + v + '</text><line x1="' + L + '" x2="' + (W - 6) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#e3e7da"/>'; });
        f.xs.forEach(function (v) { s += '<text x="' + X(v) + '" y="' + (H - B + 18) + '" text-anchor="middle" font-size="12">' + v + '</text>'; });
        var ids = Object.keys(P).map(Number).sort(function (a, b) { return a - b; });
        if (ids.length > 1) s += '<polyline fill="none" stroke="#e0473a" stroke-width="3.5" points="' + ids.map(function (i) { return X(f.xs[i]) + ',' + Y(P[i]); }).join(' ') + '"/>';
        ids.forEach(function (i) { s += '<circle cx="' + X(f.xs[i]) + '" cy="' + Y(P[i]) + '" r="6" fill="#e0473a" stroke="#2b3a2a" stroke-width="2"/>'; });
        s += '</svg>'; svg.innerHTML = s;
        xl.setAttribute('data-k', 'a4_f_' + cur); xl.textContent = t('a4_f_' + cur) + ' (' + f.unit + ')';
      }
      var xl = h('p', { class: 'axisx' }), work = h('div', { class: 'cols', hidden: '' },
        h('div', { class: 'panel' }, h('h3', { k: 'a4_setup_t' }), h('b', { k: 'a4_same' }), fixed, h('b', { k: 'a4_change' }), h('div', { class: 'row' }, slider, val), tank, h('div', { class: 'row' }, cntB, count, h('span', { k: 'a4_perMin' }), recB)),
        h('div', { class: 'panel' }, h('h3', { k: 'a4_graph_t' }), h('p', { class: 'axisy', k: 'a4_yaxis' }), svg, xl, cmp));
      box.append(todo('a4_s2_todo'), h('div', { class: 'panel' }, h('b', { k: 'a4_pick' }), chooser, status), work);
    },
    function (box, ctx) {                                    // 정리
      var fs = [
        fillBlank('a4_sum_light', [{ opts: ['w_incthen', 'w_decthen'], ans: 'w_incthen' }, { opts: ['w_const', 'w_drop', 'w_keepinc'], ans: 'w_const' }]),
        fillBlank('a4_sum_co2',   [{ opts: ['w_incthen', 'w_decthen'], ans: 'w_incthen' }, { opts: ['w_keepinc', 'w_const', 'w_drop'], ans: 'w_const' }]),
        fillBlank('a4_sum_temp',  [{ opts: ['w_incthen', 'w_decthen'], ans: 'w_incthen' }, { opts: ['w_const', 'w_keepinc', 'w_drop'], ans: 'w_drop' }])
      ];
      var out = h('div', { class: 'panel', hidden: '' }), mean = h('div', { class: 'panel', hidden: '' });
      var ck = btn('check', function () {
        var ok = true; fs.forEach(function (f) { if (!f.check()) ok = false; });
        if (!ok) { ctx.miss(); toast(t('try_again'), 'bad'); return; }
        fs.forEach(function (f) { f.lock(); }); ck.remove(); mean.hidden = false;
      }, 'btn primary');
      mean.append(h('h3', { k: 'a4_mean_t' }), choice('a4_meanq', ['a4_mean1', 'a4_mean2', 'a4_mean3'], 0, function () {
        mean.append(note('a4_meanok', 'result')); applyI18n(mean); out.hidden = false;
        var lines = fs.map(function (f) { return '• ' + f.text(); }).concat(['• ' + t('a4_meanok')]);
        App.send({ action: 'answer', act: 'a4', key: 'summary', text: lines.join(' ') });
        var c = makeCard(t('a4_card_t'), lines, App.id + ' ' + App.me.nick + ' · ' + App.st.today); c.className = 'cardimg';
        out.append(h('h3', { k: 'a4_card_h' }), c, h('div', { class: 'row' }, btn('download', function () { downloadCanvas(c, 'photosynthesis_' + App.id + '.png'); }), btn('finish', ctx.finish, 'btn primary big'))); applyI18n(out);
      }, ctx.miss));
      box.append(todo('a4_s3_todo'), h('div', { class: 'panel' }, fs, ck), mean, out);
    }
  ] };
})();
