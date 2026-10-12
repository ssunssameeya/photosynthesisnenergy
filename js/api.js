/* 서버 통신. CFG.API_URL이 비어 있으면 이 기기(localStorage)에 저장하는 연습 모드로 동작합니다. */
(function () {
  var LKEY = 'garden5-local-db';
  function hash(str) {                       // 비밀번호를 그대로 보내지 않기 위한 간단한 해시
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < str.length; i++) { var ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function localDb() {
    var db = null; try { db = JSON.parse(localStorage.getItem(LKEY)); } catch (e) {}
    if (!db) {
      db = { students: {}, settings: { teacherPw: '1234', carexp: 1, donexp: 10, bonusxp: 5, notebook: '' }, progress: {} };
      var names = ['김하늘', '이도윤', '박서연', '최민준', '정지우', '강예린'];
      names.forEach(function (n, i) { var id = '2060' + (i + 1); db.students[id] = { id: id, name: n, cls: '6', grp: String(Math.floor(i / 3) + 1) }; });
    }
    return db;
  }
  function saveLocal(db) { delete db.dirty; delete db.answers; delete db.logs; delete db.progDirty; delete db.setDirty; try { localStorage.setItem(LKEY, JSON.stringify(db)); } catch (e) {} }

  window.API = {
    local: !CFG.API_URL,
    hashPw: function (id, pw) { return hash(String(id) + ':' + String(pw) + ':garden5'); },
    call: function (req) {
      req.top = CFG.RANK_TOP;
      if (!CFG.API_URL) {
        req.now = new Date().toISOString(); req.today = today();
        var db = localDb(), res;
        try { res = coreHandle(db, req); } catch (e) { res = { ok: false, err: 'server', msg: String(e) }; }
        saveLocal(db);
        return new Promise(function (r) { setTimeout(function () { r(res); }, 120); });
      }
      return fetch(CFG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(req), redirect: 'follow' })
        .then(function (r) { return r.json(); })
        .catch(function (e) { return { ok: false, err: 'net', msg: String(e) }; });
    }
  };
})();
