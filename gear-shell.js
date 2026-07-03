// ════════════════════════════════════════════════════════════
//  GEAR SHELL — 기어(⚙) 메뉴 공유 기능 (업데이트 로그 · 버그 제보 · 웹앱 설치)
//  index.html(플레이어 시트) · GMSheet.html(GM 로비) 공통.
//  모달 CSS·HTML을 스스로 주입하고 window.* 핸들러를 노출한다.
//  의존(있으면 사용, 없으면 우회): window.CHANGELOG, currentUser, db, firebase,
//    PF_ENV, closeGearMenu, MapSync.resizeMapImage.
//  CHANGELOG 데이터는 changelog.js(먼저 로드)에서 제공.
// ════════════════════════════════════════════════════════════
(function () {
  'use strict';
  var G = (typeof window !== 'undefined') ? window : this;
  // 호스트 전역 접근 — currentUser/db는 let/const 선언이라 window에 안 붙으므로 bare+typeof로 읽는다.
  function _cu() { try { return (typeof currentUser !== 'undefined') ? currentUser : (G.currentUser || null); } catch (e) { return null; } }
  function _db() { try { return (typeof db !== 'undefined') ? db : (G.db || null); } catch (e) { return null; } }

  // ── 모달 CSS 주입 (1회) ──
  var CSS = ''
    + '#changelog-modal{position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;padding:16px;}'
    + '#changelog-modal.open{display:flex;}'
    + '#changelog-modal .cl-panel{background:var(--bg2);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);width:420px;max-width:100%;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;}'
    + '.cl-header{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--border);}'
    + '.cl-title{font-weight:800;font-size:15px;color:var(--accent);}'
    + '.cl-close{background:transparent;border:none;color:var(--text2);font-size:18px;cursor:pointer;line-height:1;padding:2px 4px;}'
    + '.cl-close:hover{color:var(--accent);}'
    + '.cl-content{padding:14px 16px;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:0;overscroll-behavior:contain;}'
    + '.cl-info{text-align:center;font-size:12px;color:var(--text2);line-height:1.8;padding-bottom:12px;margin-bottom:10px;border-bottom:1px dashed var(--border);}'
    + '.cl-info-row a{color:var(--text2);text-decoration:underline;}'
    + '.cl-info-row a:hover{color:var(--accent);}'
    + '.cl-info-thanks{margin-top:6px;color:var(--text);font-weight:600;}'
    + '.cl-log-head{font-size:11px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}'
    + '.cl-entry{padding:8px 0;border-bottom:1px solid var(--border2);}'
    + '.cl-entry:last-child{border-bottom:none;}'
    + '.cl-entry-head{display:flex;align-items:baseline;gap:8px;margin-bottom:3px;}'
    + '.cl-ver{font-weight:800;color:var(--accent);font-size:13px;}'
    + '.cl-date{font-size:10px;color:#888;}'
    + '.cl-items{margin:0;padding-left:18px;font-size:12.5px;color:var(--text);line-height:1.6;}'
    + '.cl-items li{margin:1px 0;}'
    + '#bugreport-modal{position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;padding:16px;}'
    + '#bugreport-modal.open{display:flex;}'
    + '#bugreport-modal .br-panel{background:var(--bg2);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);width:440px;max-width:100%;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;}'
    + '.br-header{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--border);}'
    + '.br-title{font-weight:800;font-size:15px;color:var(--accent);}'
    + '.br-close{background:transparent;border:none;color:var(--text2);font-size:18px;cursor:pointer;line-height:1;padding:2px 4px;}'
    + '.br-close:hover{color:var(--accent);}'
    + '.br-content{padding:14px 16px;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:0;overscroll-behavior:contain;}'
    + '.br-intro{font-size:12px;color:var(--text);line-height:1.7;background:var(--bg3);border:1px solid var(--border2);border-left:3px solid var(--accent);border-radius:6px;padding:10px 12px;margin-bottom:14px;}'
    + '.br-label{display:block;font-size:11px;font-weight:700;color:var(--accent);margin:10px 0 4px;}'
    + '.br-opt{font-weight:400;color:var(--text2);}'
    + '.br-input,.br-textarea{width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;padding:8px 10px;font-family:inherit;}'
    + '.br-input:focus,.br-textarea:focus{outline:none;border-color:var(--accent);}'
    + '.br-textarea{resize:vertical;line-height:1.6;}'
    + '.br-file{width:100%;font-size:12px;color:var(--text2);margin-top:2px;}'
    + '.br-preview{margin-top:8px;}'
    + '.br-preview img{max-width:100%;max-height:180px;border:1px solid var(--border);border-radius:6px;display:block;}'
    + '.br-preview .br-imgmeta{font-size:10px;color:var(--text2);margin-top:3px;}'
    + '.br-submit{width:100%;justify-content:center;margin-top:14px;background:var(--accent);color:#fff;border:none;font-weight:700;padding:10px;border-radius:6px;cursor:pointer;font-size:13px;}'
    + '.br-submit:hover{filter:brightness(1.08);}'
    + '.br-submit:disabled{opacity:.5;cursor:default;}'
    + '.br-status{font-size:12px;text-align:center;margin-top:10px;min-height:16px;line-height:1.5;}'
    + '.br-status.ok{color:#2e9e5b;}'
    + '.br-status.err{color:#d05050;}';

  var MODALS = ''
    + '<div id="changelog-modal" onclick="if(event.target===this)closeChangelog()">'
    +   '<div class="cl-panel">'
    +     '<div class="cl-header"><span class="cl-title">📋 업데이트 &amp; 공지</span>'
    +       '<button class="cl-close" onclick="closeChangelog()" aria-label="닫기">✕</button></div>'
    +     '<div id="changelog-body" class="cl-content"></div>'
    +   '</div>'
    + '</div>'
    + '<div id="bugreport-modal" onclick="if(event.target===this)closeBugReport()">'
    +   '<div class="br-panel">'
    +     '<div class="br-header"><span class="br-title">🐞 버그 제보</span>'
    +       '<button class="br-close" onclick="closeBugReport()" aria-label="닫기">✕</button></div>'
    +     '<div class="br-content">'
    +       '<div class="br-intro">각종 기능은 1인 개발이라 플레이테스트가 충분히 이루어지지 않은 상태라 많은 제보 부탁드립니다. 항상 감사합니다 :)</div>'
    +       '<label class="br-label" for="br-name">제보자 이름</label>'
    +       '<input id="br-name" class="br-input" type="text" maxlength="40" placeholder="닉네임 또는 이름">'
    +       '<label class="br-label" for="br-body">내용</label>'
    +       '<textarea id="br-body" class="br-textarea" rows="6" maxlength="3000" placeholder="어떤 화면에서, 무엇을 하다가, 어떤 문제가 생겼는지 적어주세요. (재현 방법이 있으면 큰 도움이 됩니다)"></textarea>'
    +       '<label class="br-label" for="br-image">첨부 이미지 <span class="br-opt">(선택)</span></label>'
    +       '<input id="br-image" class="br-file" type="file" accept="image/*" onchange="_onBugImage(event)">'
    +       '<div id="br-image-preview" class="br-preview"></div>'
    +       '<button id="br-submit" class="btn br-submit" onclick="submitBugReport()">제보 보내기</button>'
    +       '<div id="br-status" class="br-status"></div>'
    +     '</div>'
    +   '</div>'
    + '</div>';

  function _inject() {
    if (document.getElementById('gear-shell-css')) return;
    var st = document.createElement('style'); st.id = 'gear-shell-css'; st.textContent = CSS;
    document.head.appendChild(st);
    var wrap = document.createElement('div'); wrap.innerHTML = MODALS;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  // ─────────── 업데이트 로그 ───────────
  var CHANGELOG_SEEN_KEY = 'pf2e_changelog_seen';
  function _log() { return (typeof G.CHANGELOG !== 'undefined' && G.CHANGELOG) ? G.CHANGELOG : []; }
  function _latest() { var c = _log(); return c.length ? c[0].v : 0; }
  function _major() { return String(_latest()).split('.')[0]; }
  function _unseen() {
    try { return String(localStorage.getItem(CHANGELOG_SEEN_KEY) || '') !== String(_latest()); }
    catch (e) { return false; }
  }
  function updateChangelogDot() {
    var unseen = _unseen();
    document.querySelectorAll('#hdr-gear, .hdr-gear-btn').forEach(function (b) { b.classList.toggle('has-update', unseen); });
    var d = document.getElementById('gear-changelog-dot');
    if (d) d.style.display = unseen ? '' : 'none';
  }
  function renderChangelog() {
    var body = document.getElementById('changelog-body');
    if (!body) return;
    var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    var html = '<div class="cl-info">'
      + '<div class="cl-info-row">제작자: 네이버 TRPG 카페 Sepi</div>'
      + '<div class="cl-info-row">번역 참조: <a href="https://github.com/Rutz179/PF2e-KR" target="_blank" rel="noopener">github.com/Rutz179/PF2e-KR</a></div>'
      + '<div class="cl-info-row">현재 버전: v' + _latest() + '</div>'
      + '<div class="cl-info-thanks">사용해주셔서 감사합니다.</div>'
      + '</div><div class="cl-log-head">업데이트 로그</div><div class="cl-log">';
    var maj = _major();
    _log().filter(function (e) { return String(e.v).split('.')[0] === maj; }).forEach(function (e) {
      html += '<div class="cl-entry"><div class="cl-entry-head"><span class="cl-ver">v' + e.v + '</span><span class="cl-date">' + esc(e.date || '') + '</span></div>'
        + '<ul class="cl-items">' + (e.items || []).map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') + '</ul></div>';
    });
    html += '</div>';
    body.innerHTML = html;
  }
  function openChangelog() {
    if (typeof G.closeGearMenu === 'function') G.closeGearMenu();
    var ov = document.getElementById('changelog-modal'); if (!ov) return;
    renderChangelog();
    ov.classList.add('open');
    try { localStorage.setItem(CHANGELOG_SEEN_KEY, String(_latest())); } catch (e) {}
    updateChangelogDot();
  }
  function closeChangelog() {
    var ov = document.getElementById('changelog-modal'); if (ov) ov.classList.remove('open');
  }

  // ─────────── 버그 제보 (Firestore + 이미지 압축) ───────────
  var _bugImageData = null;
  function openBugReport() {
    if (typeof G.closeGearMenu === 'function') G.closeGearMenu();
    var cu = _cu();
    if (!cu) { alert('버그 제보는 로그인 후 이용할 수 있습니다.'); return; }
    var ov = document.getElementById('bugreport-modal'); if (!ov) return;
    _bugImageData = null;
    var nameEl = document.getElementById('br-name');
    if (nameEl && !nameEl.value) nameEl.value = cu.displayName || '';
    var bodyEl = document.getElementById('br-body'); if (bodyEl) bodyEl.value = '';
    var imgEl = document.getElementById('br-image'); if (imgEl) imgEl.value = '';
    var prev = document.getElementById('br-image-preview'); if (prev) prev.innerHTML = '';
    var st = document.getElementById('br-status'); if (st) { st.textContent = ''; st.className = 'br-status'; }
    var sub = document.getElementById('br-submit'); if (sub) { sub.disabled = false; sub.textContent = '제보 보내기'; }
    ov.classList.add('open');
  }
  function closeBugReport() {
    var ov = document.getElementById('bugreport-modal'); if (ov) ov.classList.remove('open');
  }
  function _onBugImage(event) {
    var file = event.target.files && event.target.files[0];
    var prev = document.getElementById('br-image-preview');
    if (!file) { _bugImageData = null; if (prev) prev.innerHTML = ''; return; }
    if (typeof G.MapSync === 'undefined' || !G.MapSync.resizeMapImage) {
      var r = new FileReader();
      r.onload = function () { _bugImageData = r.result; if (prev) prev.innerHTML = '<img src="' + r.result + '">'; };
      r.readAsDataURL(file); return;
    }
    if (prev) prev.innerHTML = '<span style="font-size:11px;color:var(--text2);">이미지 처리 중…</span>';
    G.MapSync.resizeMapImage(file).then(function (res) {
      _bugImageData = res.dataUrl;
      var kb = Math.round((_bugImageData.length * 0.75) / 1024);
      if (prev) prev.innerHTML = '<img src="' + _bugImageData + '"><div class="br-imgmeta">첨부됨 · 약 ' + kb + 'KB (자동 압축)</div>';
    }).catch(function (err) {
      console.error('[bug-image]', err); _bugImageData = null;
      if (prev) prev.innerHTML = '<span style="font-size:11px;color:#d05050;">이미지 처리 실패</span>';
    });
  }
  function submitBugReport() {
    var st = document.getElementById('br-status');
    var sub = document.getElementById('br-submit');
    var setStatus = function (msg, cls) { if (st) { st.textContent = msg; st.className = 'br-status' + (cls ? ' ' + cls : ''); } };
    var cu = _cu();
    if (!cu) { setStatus('로그인이 필요합니다.', 'err'); return; }
    var name = ((document.getElementById('br-name') || {}).value || '').trim();
    var body = ((document.getElementById('br-body') || {}).value || '').trim();
    if (!body) { setStatus('내용을 입력해주세요.', 'err'); return; }
    var image = _bugImageData || null;
    if (image && image.length > 920000) { image = null; setStatus('이미지가 너무 커서 제외하고 전송합니다…', ''); }
    if (sub) { sub.disabled = true; sub.textContent = '전송 중…'; }
    var payload = {
      uid: cu.uid,
      reporter: name || (cu.displayName || cu.email || '익명'),
      email: cu.email || null,
      body: body, image: image,
      env: (typeof G.PF_ENV !== 'undefined' ? G.PF_ENV : 'prod'),
      version: String(_latest()),
      ua: navigator.userAgent, page: location.pathname,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    _db().collection('bug_reports').add(payload).then(function () {
      setStatus('제보가 접수되었습니다. 감사합니다! :)', 'ok');
      if (sub) sub.textContent = '전송 완료';
      setTimeout(closeBugReport, 1400);
    }).catch(function (err) {
      console.error('[bug-report]', err);
      setStatus('전송 실패: ' + (err && err.message ? err.message : err), 'err');
      if (sub) { sub.disabled = false; sub.textContent = '다시 시도'; }
    });
  }

  // ─────────── PWA 웹앱 설치 ───────────
  var _deferredInstall = null;
  G.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); _deferredInstall = e; });
  function pfInstallApp() {
    if (_deferredInstall) {
      _deferredInstall.prompt();
      _deferredInstall.userChoice.finally(function () { _deferredInstall = null; });
    } else {
      alert('이미 설치되었거나 이 브라우저는 자동 설치를 지원하지 않습니다.\n\n• iPhone(Safari): 공유 → "홈 화면에 추가"\n• Android/데스크톱(Chrome): 주소창 메뉴 → "앱 설치"');
    }
  }

  // ── 노출 + 초기화 ──
  G.openChangelog = openChangelog; G.closeChangelog = closeChangelog;
  G.renderChangelog = renderChangelog; G.updateChangelogDot = updateChangelogDot;
  G.openBugReport = openBugReport; G.closeBugReport = closeBugReport;
  G._onBugImage = _onBugImage; G.submitBugReport = submitBugReport;
  G.pfInstallApp = pfInstallApp;

  function _boot() { _inject(); updateChangelogDot(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _boot);
  else _boot();
})();
