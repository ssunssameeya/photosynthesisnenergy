/* 활동 6: 식물의 호흡에서 기체의 출입 확인하기 */
(function () {
  ACT.a6 = { id: 'a6', title: 't_a6', steps: [
    function (box, ctx) {                                     // 활동 2에서 남긴 질문 되살리기
      var pk = pickOne(['a6_g1', 'a6_g2', 'a6_g3'], function (k) { App.send({ action: 'answer', act: 'a6', key: 'guess', text: t(k) }); App.a6guess = k; ctx.ready(); });
      box.append(todo('a6_s1_todo'), h('div', { class: 'cols' },
        h('div', { class: 'panel' }, h('h3', { k: 'a6_recall_t' }), note('a6_recall', 'strong'),
          h('table', { class: 'data' }, h('tr', {}, h('th', { k: 'a23_cond' }), h('th', { k: 'a23_cocol' }), h('th', { k: 'a23_ocol' })),
            h('tr', {}, h('th', { k: 'a23_dark' }), h('td', { class: 'num', dir: 'ltr' }, '400 → 424'), h('td', { class: 'num', dir: 'ltr' }, '20.90 → 20.88')))),
        h('div', { class: 'panel' }, h('h3', { k: 'a6_guess_t' }), h('p', { class: 'q', k: 'a6_guessq' }), pk)));
    },
    function (box, ctx) {                                     // 석회수 실험
      var lab = h('div', { class: 'bags st0', html: '<figure><div class="bag ba"><i></i></div><div class="lime la"></div><figcaption data-k="a6_bagA"></figcaption></figure><figure><div class="bag bb"></div><div class="lime lb"></div><figcaption data-k="a6_bagB"></figcaption></figure><div class="darkbox"></div>' });
      var log = h('div', { class: 'explog' }), qa = h('div', {});
      function say(k, c) { log.append(note(k, c)); applyI18n(log); }
      function ask(q, opts, ans, okK, nx) { qa.innerHTML = ''; qa.append(choice(q, opts, ans, function () { say(okK, 'result'); qa.innerHTML = ''; nx && nx(); }, ctx.miss)); applyI18n(qa); }
      var steps = [
        ['a6_b1', function (nx) { lab.className = 'bags st1'; say('a6_b1r'); ask('a6_ctrlq', ['a6_ctrl1', 'a6_ctrl2', 'a6_ctrl3'], 0, 'a6_ctrlok', nx); }],
        ['a6_b2', function (nx) { lab.className = 'bags st2'; say('a6_b2r'); ask('a6_darkq', ['a6_dark1', 'a6_dark2', 'a6_dark3', 'a6_dark4'], 1, 'a6_darkok', nx); }],
        ['a6_b3', function (nx) { lab.className = 'bags st3'; say('a6_b3r', 'result'); ask('a6_limeq', ['m_o2', 'm_co2', 'm_n2'], 1, 'a6_limeok', function () { ctx.ready(); }); }]
      ];
      var bar = h('div', { class: 'row' });
      steps.forEach(function (s, i) { var b = btn(s[0], function () { b.disabled = true; b.classList.add('donebtn'); s[1](function () { if (bar.children[i + 1]) bar.children[i + 1].disabled = false; }); }, i ? 'btn' : 'btn primary'); b.disabled = i > 0; bar.append(b); });
      box.append(todo('a6_s2_todo'), h('div', { class: 'cols' },
        h('div', { class: 'panel' }, h('h3', { k: 'a6_s2_t' }), lab, bar),
        h('div', { class: 'panel' }, h('h3', { k: 'obs_t' }), log, qa)));
    },
    function (box, ctx) {                                     // 정리
      var fb = fillBlank('a6_sum', [{ opts: ['m_o2', 'm_co2'], ans: 'm_o2' }, { opts: ['m_o2', 'm_co2'], ans: 'm_co2' }, { opts: ['a6_always', 'a6_onlyday', 'a6_onlynight'], ans: 'a6_always' }]);
      var after = h('div', { class: 'panel', hidden: '' });
      var ck = btn('check', function () {
        if (!fb.check()) { ctx.miss(); toast(t('try_again'), 'bad'); return; }
        fb.lock(); ck.remove(); App.send({ action: 'answer', act: 'a6', key: 'summary', text: fb.text() });
        after.hidden = false; after.append(h('h3', { k: 'a6_back_t' }), App.a6guess ? h('p', { class: 'note strong' }, h('span', { k: 'a1_mypred' }), ' ', h('b', { k: App.a6guess })) : null, note('a6_back', 'result'), btn('finish', ctx.finish, 'btn primary big')); applyI18n(after);
      }, 'btn primary');
      box.append(todo('a6_s3_todo'), h('div', { class: 'panel' }, h('h3', { k: 'rule_t' }), fb, ck), after);
    }
  ] };
})();
