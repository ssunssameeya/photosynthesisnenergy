/* 단원 정원: 배경 그림과 활동 식물(입구) */
(function () {
  var O = 'stroke="#2b3a2a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  function ic(inner) { return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }
  var pot = '<path d="M38 92 h44 l-6 22 h-32z" fill="#c9783f" ' + O + '/><rect x="32" y="84" width="56" height="10" rx="3" fill="#dd9255" ' + O + '/>';

  var willow = ic('<path d="M60 112 V58" stroke="#7a5230" stroke-width="12" stroke-linecap="round"/><path d="M60 20 C20 20 14 58 22 92 C30 70 34 60 40 96 C44 66 50 62 56 98 C60 64 66 64 68 98 C72 62 80 66 84 96 C88 60 94 70 100 92 C106 58 100 20 60 20Z" fill="#7cc67a" ' + O + '/><ellipse cx="60" cy="112" rx="34" ry="6" fill="#6b4a2f"/>');
  var water = ic(pot + '<path d="M60 84 C40 60 44 36 60 16 C76 36 80 60 60 84Z" fill="#5cc08a" ' + O + '/><path d="M60 80 V30" stroke="#2f8f52" stroke-width="4"/><circle cx="92" cy="30" r="14" fill="#fff" ' + O + '/><text x="92" y="36" text-anchor="middle" font-size="14" font-weight="900" fill="#2b3a2a">CO₂</text>');
  var elodea = ic(pot + '<path d="M60 84 V20" stroke="#2f8f52" stroke-width="7" stroke-linecap="round"/>' + [28, 44, 60, 74].map(function (y) { return '<path d="M60 ' + y + ' q-22 -14 -30 2 q16 8 30 -2z M60 ' + y + ' q22 -14 30 2 q-16 8 -30 -2z" fill="#4fbf7a" ' + O + '/>'; }).join('') + '<circle cx="98" cy="22" r="7" fill="#d9f3ff" ' + O + '/><circle cx="104" cy="44" r="4.5" fill="#d9f3ff" ' + O + '/>');
  var graph = ic(pot + '<path d="M60 84 V44" stroke="#2f8f52" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="34" r="20" fill="#ffd84a" ' + O + '/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path d="M60 6 v-0" ' + O + ' transform="rotate(' + a + ' 60 34)"/><line x1="60" y1="8" x2="60" y2="2" stroke="#2b3a2a" stroke-width="5" stroke-linecap="round" transform="rotate(' + a + ' 60 34)"/>'; }).join('') + '<path d="M20 78 q14 -30 36 -8" fill="#6ccf7d" ' + O + '/><path d="M100 78 q-14 -30 -36 -8" fill="#6ccf7d" ' + O + '/>');
  var future = ic('<rect x="14" y="14" width="92" height="92" rx="18" fill="#101a33" ' + O + '/><path d="M60 92 C30 66 34 38 60 22 C86 38 90 66 60 92Z" fill="#36e0c2" stroke="#b6fff2" stroke-width="3"/><path d="M60 88 V34 M60 54 l-14 -10 M60 66 l16 -12" stroke="#101a33" stroke-width="4" stroke-linecap="round"/><circle cx="28" cy="30" r="3" fill="#b6fff2"/><circle cx="94" cy="84" r="3" fill="#b6fff2"/><path d="M84 26 h12 M90 20 v12" stroke="#b6fff2" stroke-width="3"/>');
  var night = ic(pot + '<path d="M60 84 V40" stroke="#2f8f52" stroke-width="7" stroke-linecap="round"/><path d="M60 62 q-26 -16 -34 4 q18 12 34 -4z M60 50 q26 -16 34 4 q-18 12 -34 -4z" fill="#3f9d68" ' + O + '/><path d="M88 8 a18 18 0 1 0 16 26 a14 14 0 0 1 -16 -26z" fill="#ffe27a" ' + O + '/>');
  var arrows = ic(pot + '<path d="M60 84 C34 62 38 34 60 14 C82 34 86 62 60 84Z" fill="#62c56f" ' + O + '/><path d="M12 40 h22 m-8 -8 l8 8 l-8 8" fill="none" ' + O + '/><path d="M108 62 h-22 m8 -8 l-8 8 l8 8" fill="none" stroke="#e0473a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>');
  var market = ic('<path d="M14 46 L24 18 H96 L106 46Z" fill="#e0473a" ' + O + '/><path d="M40 18 L36 46 M60 18 V46 M80 18 L84 46" stroke="#fff" stroke-width="8"/><rect x="20" y="46" width="80" height="56" fill="#fff3d6" ' + O + '/><ellipse cx="44" cy="82" rx="14" ry="10" fill="#c9965a" ' + O + '/><circle cx="76" cy="80" r="11" fill="#b36ad9" ' + O + '/><circle cx="30" cy="12" r="5" fill="#ffd84a"/><circle cx="60" cy="8" r="5" fill="#ffd84a"/><circle cx="90" cy="12" r="5" fill="#ffd84a"/>');

  window.GREENHOUSE_ART = ic('<path d="M16 104 V52 L60 18 L104 52 V104Z" fill="#d9f3ff" fill-opacity=".85" ' + O + '/><path d="M16 52 H104 M60 18 V104 M38 35 V104 M82 35 V104 M16 78 H104" stroke="#2b3a2a" stroke-width="3"/><path d="M60 100 C48 88 50 74 60 66 C70 74 72 88 60 100Z" fill="#4fbf7a" stroke="#2b3a2a" stroke-width="3"/>');

  window.GARDEN_SPOTS = [
    { act: 'a1',  no: '1',     x: 11, y: 60, art: willow },
    { act: 'a23', no: '2 · 3', x: 30, y: 33, art: water + '<span class="vine"></span>' + elodea, wide: true },
    { act: 'a4',  no: '4',     x: 46, y: 66, art: graph },
    { act: 'a5',  no: '5',     x: 61, y: 30, art: future },
    { act: 'a6',  no: '6',     x: 65, y: 72, art: night },
    { act: 'a7',  no: '7',     x: 80, y: 50, art: arrows },
    { act: 'a8',  no: '8',     x: 92, y: 78, art: market }
  ];

  var fl = ''; var seed = 3; function r() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < 46; i++) { var x = r() * 1600, y = 330 + r() * 440, c = ['#ff8fa8', '#fff', '#ffd84a', '#c9a0ff'][i % 4]; fl += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="5" fill="' + c + '"/><circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="2" fill="#f2a91e"/>'; }
  var fence = ''; for (var f = 0; f < 34; f++) fence += '<path d="M' + (f * 48 + 8) + ' 300 v-52 l10 -10 l10 10 v52z" fill="#fff8ea" stroke="#c9a57a" stroke-width="3"/>';
  window.GARDEN_BG = '<svg viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>'
    + '<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6f7"/><stop offset="1" stop-color="#fdf6dc"/></linearGradient>'
    + '<linearGradient id="ggrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8dc8a"/><stop offset="1" stop-color="#74bf6a"/></linearGradient></defs>'
    + '<rect width="1600" height="800" fill="url(#gsky)"/>'
    + '<circle cx="1420" cy="96" r="54" fill="#ffe27a"/><circle cx="1420" cy="96" r="78" fill="#ffe27a" opacity=".3"/>'
    + '<g fill="#fff" opacity=".9"><ellipse cx="260" cy="90" rx="90" ry="26"/><ellipse cx="320" cy="72" rx="60" ry="24"/><ellipse cx="900" cy="120" rx="110" ry="28"/><ellipse cx="840" cy="100" rx="60" ry="22"/></g>'
    + '<path d="M0 300 C200 210 420 250 640 230 C900 200 1200 260 1600 210 V800 H0Z" fill="#cdeab0"/>'
    + '<g opacity=".9">' + fence + '<rect x="0" y="262" width="1600" height="8" fill="#e8d5b5"/><rect x="0" y="284" width="1600" height="8" fill="#e8d5b5"/></g>'
    + '<path d="M0 320 C300 290 700 300 1000 296 C1300 290 1450 300 1600 310 V800 H0Z" fill="url(#ggrass)"/>'
    + '<path d="M-20 700 C200 560 330 380 520 400 C720 420 700 640 880 620 C1040 600 980 360 1180 380 C1380 400 1420 620 1640 700" fill="none" stroke="#f1dfb6" stroke-width="64" stroke-linecap="round"/>'
    + '<path d="M-20 700 C200 560 330 380 520 400 C720 420 700 640 880 620 C1040 600 980 360 1180 380 C1380 400 1420 620 1640 700" fill="none" stroke="#e2c98f" stroke-width="64" stroke-linecap="round" stroke-dasharray="4 30" opacity=".6"/>'
    + fl + '</svg>';
})();
