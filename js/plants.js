/* 식물 캐릭터: 5종 × 5단계. plantSVG('tomato', 3, {wilt:false}) → SVG 문자열
   CFG.SPECIES[].img 에 그림 파일이 있으면 그 그림을 대신 씁니다. */
(function () {
  var OL = '#2b3a2a';
  var SP = {
    tomato:     { leaf: '#4caf6a', leaf2: '#2f8f52', fruit: '#ef4b3f', fruit2: '#c9342b', flower: '#ffd84a' },
    strawberry: { leaf: '#56b96f', leaf2: '#35955a', fruit: '#f0475f', fruit2: '#c92f49', flower: '#ffffff' },
    lettuce:    { leaf: '#9bd66a', leaf2: '#63b548', fruit: '#b9e986', fruit2: '#7cc653', flower: '#fff3a6' },
    paprika:    { leaf: '#4fae74', leaf2: '#2f8a57', fruit: '#ffc531', fruit2: '#f09a1a', flower: '#ffffff' },
    sunflower:  { leaf: '#5cb85f', leaf2: '#3a9645', fruit: '#ffcf33', fruit2: '#f2a91e', flower: '#ffcf33' }
  };
  function face(cx, cy, s, wilt) {
    var e = 13 * s, ex = 17 * s;
    var eyes = wilt
      ? '<path d="M' + (cx - ex - e * .6) + ' ' + cy + ' q' + e * .6 + ' ' + e * .5 + ' ' + e * 1.2 + ' 0 M' + (cx + ex - e * .6) + ' ' + cy + ' q' + e * .6 + ' ' + e * .5 + ' ' + e * 1.2 + ' 0" fill="none" stroke="' + OL + '" stroke-width="' + 3.5 * s + '" stroke-linecap="round"/>'
      : [-1, 1].map(function (d) { var x = cx + d * ex; return '<ellipse cx="' + x + '" cy="' + cy + '" rx="' + e * .62 + '" ry="' + e * .8 + '" fill="' + OL + '"/><circle cx="' + (x - e * .2) + '" cy="' + (cy - e * .3) + '" r="' + e * .27 + '" fill="#fff"/><circle cx="' + (x + e * .22) + '" cy="' + (cy + e * .25) + '" r="' + e * .13 + '" fill="#fff"/>'; }).join('');
    var mouth = wilt
      ? '<path d="M' + (cx - 6 * s) + ' ' + (cy + 16 * s) + ' q' + 6 * s + ' ' + -5 * s + ' ' + 12 * s + ' 0" fill="none" stroke="' + OL + '" stroke-width="' + 3 * s + '" stroke-linecap="round"/>'
      : '<path d="M' + (cx - 7 * s) + ' ' + (cy + 12 * s) + ' q' + 7 * s + ' ' + 9 * s + ' ' + 14 * s + ' 0z" fill="#e2555f" stroke="' + OL + '" stroke-width="' + 2.5 * s + '" stroke-linejoin="round"/>';
    var blush = wilt ? '' : '<ellipse cx="' + (cx - ex - 9 * s) + '" cy="' + (cy + 11 * s) + '" rx="' + 7 * s + '" ry="' + 4.5 * s + '" fill="#ff9aa8" opacity=".75"/><ellipse cx="' + (cx + ex + 9 * s) + '" cy="' + (cy + 11 * s) + '" rx="' + 7 * s + '" ry="' + 4.5 * s + '" fill="#ff9aa8" opacity=".75"/>';
    var sweat = wilt ? '<path d="M' + (cx + ex + 20 * s) + ' ' + (cy - 20 * s) + ' q7 12 0 16 q-7 -4 0 -16z" fill="#8fd0f5" stroke="' + OL + '" stroke-width="2"/>' : '';
    return eyes + mouth + blush + sweat;
  }
  function leaf(x, y, w, hgt, rot, c, c2) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M0 0 C' + w * .5 + ' ' + -hgt * .7 + ' ' + w + ' ' + -hgt * .5 + ' ' + w * 1.1 + ' 0 C' + w + ' ' + hgt * .5 + ' ' + w * .5 + ' ' + hgt * .5 + ' 0 0Z" fill="' + c + '" stroke="' + OL + '" stroke-width="4" stroke-linejoin="round"/><path d="M4 0 L' + w * .85 + ' 0" stroke="' + c2 + '" stroke-width="3" stroke-linecap="round"/></g>';
  }
  function soil() { return '<ellipse cx="100" cy="222" rx="74" ry="14" fill="#6b4a2f" stroke="' + OL + '" stroke-width="4"/><ellipse cx="80" cy="218" rx="10" ry="3" fill="#8a6644"/>'; }
  function flower(x, y, r, c) {
    var p = ''; for (var i = 0; i < 5; i++) p += '<ellipse cx="' + x + '" cy="' + (y - r) + '" rx="' + r * .55 + '" ry="' + r * .8 + '" fill="' + c + '" stroke="' + OL + '" stroke-width="3" transform="rotate(' + i * 72 + ' ' + x + ' ' + y + ')"/>';
    return p + '<circle cx="' + x + '" cy="' + y + '" r="' + r * .45 + '" fill="#ffb02e" stroke="' + OL + '" stroke-width="3"/>';
  }
  function sparkle(x, y, s) { return '<path class="spk" d="M' + x + ' ' + (y - 9 * s) + ' l' + 3 * s + ' ' + 6 * s + ' l' + 6 * s + ' ' + 3 * s + ' l' + -6 * s + ' ' + 3 * s + ' l' + -3 * s + ' ' + 6 * s + ' l' + -3 * s + ' ' + -6 * s + ' l' + -6 * s + ' ' + -3 * s + ' l' + 6 * s + ' ' + -3 * s + 'z" fill="#fff6b0" stroke="#f2b01e" stroke-width="1.5"/>'; }

  function body(sp, st, wilt) {
    var c = SP[sp] || SP.tomato, o = '';
    if (st === 1) {            // 씨앗
      o += soil() + '<path d="M100 132 C140 150 146 200 100 210 C54 200 60 150 100 132Z" fill="#c9965a" stroke="' + OL + '" stroke-width="5"/><path d="M78 160 q8 -14 20 -18" stroke="#e8c08c" stroke-width="5" fill="none" stroke-linecap="round"/>' + face(100, 176, .8, wilt);
      if (sp === 'sunflower') o += '<path d="M100 132 l-8 22 M100 132 l8 22" stroke="' + OL + '" stroke-width="3"/>';
    } else if (st === 2) {     // 새싹
      o += soil() + '<path d="M100 150 V116" stroke="' + c.leaf2 + '" stroke-width="9" stroke-linecap="round"/>' + leaf(100, 118, 42, 34, -150, c.leaf, c.leaf2) + leaf(100, 118, 42, 34, -30, c.leaf, c.leaf2)
        + '<ellipse cx="100" cy="176" rx="46" ry="40" fill="' + c.fruit2 + '" opacity=".0"/><path d="M100 140 C146 140 150 212 100 212 C50 212 54 140 100 140Z" fill="#dff3c4" stroke="' + OL + '" stroke-width="5"/>' + face(100, 176, .85, wilt);
    } else if (st === 3) {     // 어린 식물
      o += soil() + '<path d="M100 214 V96" stroke="' + c.leaf2 + '" stroke-width="10" stroke-linecap="round"/>'
        + leaf(100, 190, 56, 40, -165, c.leaf, c.leaf2) + leaf(100, 190, 56, 40, -15, c.leaf, c.leaf2) + leaf(100, 86, 40, 30, -140, c.leaf, c.leaf2) + leaf(100, 86, 40, 30, -40, c.leaf, c.leaf2)
        + '<circle cx="100" cy="140" r="44" fill="' + (sp === 'lettuce' ? c.fruit : '#cdeeb0') + '" stroke="' + OL + '" stroke-width="5"/>' + face(100, 140, .9, wilt);
    } else if (st === 4) {     // 꽃
      o += soil() + '<path d="M100 214 V86" stroke="' + c.leaf2 + '" stroke-width="11" stroke-linecap="round"/>'
        + leaf(100, 196, 64, 44, -168, c.leaf, c.leaf2) + leaf(100, 196, 64, 44, -12, c.leaf, c.leaf2) + leaf(100, 168, 50, 36, -200, c.leaf, c.leaf2) + leaf(100, 168, 50, 36, 20, c.leaf, c.leaf2)
        + '<circle cx="100" cy="120" r="50" fill="#cdeeb0" stroke="' + OL + '" stroke-width="5"/>' + face(100, 124, 1, wilt)
        + flower(100, 62, 20, c.flower) + flower(58, 84, 13, c.flower) + flower(142, 84, 13, c.flower);
    } else {                   // 열매: 종마다 모습이 다름
      o += soil() + leaf(100, 204, 70, 46, -170, c.leaf, c.leaf2) + leaf(100, 204, 70, 46, -10, c.leaf, c.leaf2);
      if (sp === 'sunflower') {
        o += '<path d="M100 214 V130" stroke="' + c.leaf2 + '" stroke-width="12" stroke-linecap="round"/>';
        for (var i = 0; i < 14; i++) o += '<ellipse cx="100" cy="36" rx="13" ry="26" fill="' + c.fruit + '" stroke="' + OL + '" stroke-width="3.5" transform="rotate(' + i * 25.7 + ' 100 104)"/>';
        o += '<circle cx="100" cy="104" r="48" fill="#b9793a" stroke="' + OL + '" stroke-width="5"/>' + face(100, 104, 1, wilt);
      } else if (sp === 'lettuce') {
        o += '<path d="M100 60 C130 40 170 60 160 100 C190 120 176 170 140 172 C130 200 70 200 60 172 C24 170 10 120 40 100 C30 60 70 40 100 60Z" fill="' + c.fruit2 + '" stroke="' + OL + '" stroke-width="5" stroke-linejoin="round"/>'
          + '<path d="M100 80 C124 66 150 82 144 108 C164 122 154 156 130 156 C122 176 78 176 70 156 C46 156 36 122 56 108 C50 82 76 66 100 80Z" fill="' + c.fruit + '" stroke="' + OL + '" stroke-width="4"/>' + face(100, 124, 1, wilt);
      } else if (sp === 'strawberry') {
        o += '<path d="M100 196 C40 150 30 80 100 76 C170 80 160 150 100 196Z" fill="' + c.fruit + '" stroke="' + OL + '" stroke-width="5" stroke-linejoin="round"/>';
        [[70, 100], [130, 100], [100, 92], [62, 132], [138, 132], [84, 168], [116, 168]].forEach(function (p) { o += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="3" ry="4.5" fill="#ffe27a"/>'; });
        o += '<path d="M100 82 l-34 -16 l22 -2 l-8 -20 l20 14 l20 -14 l-8 20 l22 2z" fill="' + c.leaf + '" stroke="' + OL + '" stroke-width="4" stroke-linejoin="round"/>' + face(100, 128, .95, wilt);
      } else if (sp === 'paprika') {
        o += '<path d="M100 76 C130 60 168 78 162 126 C160 176 136 198 118 192 C108 200 92 200 82 192 C64 198 40 176 38 126 C32 78 70 60 100 76Z" fill="' + c.fruit + '" stroke="' + OL + '" stroke-width="5" stroke-linejoin="round"/><path d="M82 96 q-10 40 0 86 M118 96 q10 40 0 86" stroke="' + c.fruit2 + '" stroke-width="4" fill="none"/>'
          + '<path d="M92 76 q0 -30 22 -34 l4 10 q-10 4 -10 24z" fill="' + c.leaf + '" stroke="' + OL + '" stroke-width="4" stroke-linejoin="round"/>' + face(100, 132, 1, wilt);
      } else {
        o += '<circle cx="100" cy="132" r="64" fill="' + c.fruit + '" stroke="' + OL + '" stroke-width="5"/><path d="M62 104 q12 -24 34 -28" stroke="#ff9a8f" stroke-width="7" fill="none" stroke-linecap="round"/>'
          + '<path d="M100 74 l-36 -8 l24 -8 l-10 -22 l22 14 l22 -14 l-10 22 l24 8z" fill="' + c.leaf + '" stroke="' + OL + '" stroke-width="4" stroke-linejoin="round"/>' + face(100, 138, 1.05, wilt);
      }
      if (!wilt) o += sparkle(32, 60, 1.2) + sparkle(170, 44, 1) + sparkle(176, 150, .8);
    }
    return o;
  }
  window.plantSVG = function (sp, stage, opt) {
    opt = opt || {}; var st = Math.max(1, Math.min(5, stage || 1));
    var cfg = (CFG.SPECIES || []).filter(function (x) { return x.id === sp; })[0];
    if (cfg && cfg.img && cfg.img[st - 1]) return '<img class="plantimg' + (opt.wilt ? ' wilt' : '') + '" src="' + cfg.img[st - 1] + '" alt="">';
    return '<svg class="plantsvg' + (opt.wilt ? ' wilt' : '') + '" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg"><g class="pbody">' + body(sp, st, !!opt.wilt) + '</g></svg>';
  };
  window.levelOf = function (peak) { var L = CFG.LEVELS, n = 1; for (var i = 0; i < L.length; i++) if (peak >= L[i].need) n = i + 1; return n; };
})();
