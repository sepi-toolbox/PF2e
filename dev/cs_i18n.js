// ═══════════════════════════════════════════════════════════════
//  cs_i18n.js — 런타임 UI 번역 오버레이 (한글 소스 → 영어 표시)
//  · PFLocale 테이블(ko→en, cs_locale.js)을 사용. 앱 호출부 무수정.
//  · DOM 텍스트노드 + 번역대상 속성을 "정확 일치"로만 치환 → 오역/부분치환 방지.
//  · 원문을 WeakMap에 보존 → 한국어로 가역 복원.
//  · MutationObserver로 동적 렌더분도 자동 번역. 기본(한국어) 모드 오버헤드 ≈ 0.
//  · 토글은 우하단 다이스 FAB와 안 겹치게 좌하단 자동 주입(#i18n-toggle).
//  설계 철학: 데이터층 Babele 오버레이("영어에 한글 씌우기")의 UI 역방향판.
// ═══════════════════════════════════════════════════════════════
(function (root) {
  'use strict';
  const TRANS_ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, OPTION: 0 }; // OPTION은 번역 허용
  const KO = /[가-힣]/;
  const _origText = new WeakMap();   // textNode → 원문 nodeValue
  const _origAttr = new WeakMap();   // element  → { attr: 원문 }
  let _observer = null, _on = false;

  function _has(k) { return typeof PFLocale !== 'undefined' && PFLocale.has(k); }
  function _tr(k) { return typeof PFLocale !== 'undefined' ? PFLocale.t(k) : k; }

  // ── 번역 핵심 추출: [선두장식, 테이블키, 후미장식] (핵심은 항상 정확일치) ──
  const PFX = /^([^0-9A-Za-z가-힣]+)(.+)$/;             // 선두 기호/이모지(⚠ 🎲 ◆ 등)
  const TAIL = /^(.+?)(\s+\d+)$/;                       // 후미 정수(" 1", " 10") = 보간된 카운터/수치
  const LEADNUM = /^(\d[\d/]*\s+)(.+)$/;               // 선두 카운터("0/4 선택", "3 회")
  const ELLIP = /^(.+?)(\.{3}|…)$/;                    // 후미 생략부호(목록 미리보기 "desc...")
  function _findKey(key) {
    if (_has(key)) return ['', key, ''];                // 전체 정확일치
    let m = key.match(PFX);
    if (m) {
      if (_has(m[2])) return [m[1], m[2], ''];          // "⚠ 의식불명" → core "의식불명"
      const tt = m[2].match(TAIL); if (tt && _has(tt[1])) return [m[1], tt[1], tt[2]]; // "⚠ 빈사 1"
    }
    m = key.match(TAIL); if (m && _has(m[1])) return ['', m[1], m[2]];   // "레벨 1" / "근력 10"
    m = key.match(LEADNUM); if (m && _has(m[2])) return [m[1], m[2], '']; // "0/4 선택"
    m = key.match(ELLIP); if (m && _has(m[1])) return ['', m[1], m[2]];   // "생사의 기로...사망...."
    return null;
  }
  // ── 텍스트 노드 1개 번역 ──
  function _doText(node) {
    const raw = node.nodeValue;
    if (!raw) return;
    const key = raw.trim();
    if (!key || !KO.test(key)) return;
    const f = _findKey(key); if (!f) return;
    const en = _tr(f[1]); if (en === f[1]) return;
    if (!_origText.has(node)) _origText.set(node, raw);
    const out = raw.replace(key, f[0] + en + f[2]);      // 앞뒤 공백·장식 보존
    if (node.nodeValue !== out) node.nodeValue = out;
  }
  // ── 엘리먼트 번역대상 속성 ──
  function _doAttrs(el) {
    for (let i = 0; i < TRANS_ATTRS.length; i++) {
      const a = TRANS_ATTRS[i];
      if (!el.hasAttribute || !el.hasAttribute(a)) continue;
      const raw = el.getAttribute(a), key = (raw || '').trim();
      if (!key || !KO.test(key) || !_has(key)) continue;
      let store = _origAttr.get(el); if (!store) { store = {}; _origAttr.set(el, store); }
      if (store[a] == null) store[a] = raw;
      const en = _tr(key); if (en !== key) el.setAttribute(a, raw.replace(key, en));
    }
  }
  // ── 서브트리 DFS 번역 ──
  function _process(node) {
    if (!node) return;
    const t = node.nodeType;
    if (t === 3) { _doText(node); return; }               // TEXT
    if (t !== 1) return;                                  // ELEMENT만 하위 처리
    if (SKIP_TAGS[node.tagName] || (node.hasAttribute && node.hasAttribute('data-no-i18n'))) return;
    if (node.isContentEditable) return;                   // 사용자 편집영역(메모 등) 보호
    _doAttrs(node);
    for (let c = node.firstChild; c; c = c.nextSibling) _process(c);
  }
  // ── 서브트리 DFS 복원 ──
  function _revert(node) {
    if (!node) return;
    const t = node.nodeType;
    if (t === 3) { if (_origText.has(node)) node.nodeValue = _origText.get(node); return; }
    if (t !== 1) return;
    if (SKIP_TAGS[node.tagName]) return;
    const store = _origAttr.get(node);
    if (store) for (const a in store) { try { node.setAttribute(a, store[a]); } catch (e) {} }
    for (let c = node.firstChild; c; c = c.nextSibling) _revert(c);
  }

  // ── 동적 렌더 추적 (en 모드에서만 작동, 멱등) ──
  function _onMutations(muts) {
    if (!_on) return;
    for (let i = 0; i < muts.length; i++) {
      const m = muts[i];
      if (m.type === 'childList') { for (let j = 0; j < m.addedNodes.length; j++) _process(m.addedNodes[j]); }
      else if (m.type === 'characterData') { _doText(m.target); }
      else if (m.type === 'attributes' && m.target.nodeType === 1) _doAttrs(m.target);
    }
  }

  function setEnabled(on) {
    _on = !!on;
    if (_on) _process(document.body);
    else _revert(document.body);
    if (document.documentElement) document.documentElement.setAttribute('data-lang', _on ? 'en' : 'ko');
  }
  function setLang(l) {
    const en = (l === 'en');
    if (typeof PFLocale !== 'undefined') PFLocale.setLang(en ? 'en' : 'ko');
    setEnabled(en);
    _syncToggle();
  }
  function getLang() { return _on ? 'en' : 'ko'; }
  function retranslate() { if (_on) _process(document.body); }   // 외부 강제 재번역 훅

  // ── 좌하단 토글 버튼 자동 주입 ──
  function _syncToggle() {
    const b = document.getElementById('i18n-toggle');
    if (b) b.textContent = _on ? '🌐 한국어' : '🌐 EN';
  }
  function _injectToggle() {
    if (document.getElementById('i18n-toggle')) return;
    const b = document.createElement('button');
    b.id = 'i18n-toggle'; b.type = 'button'; b.setAttribute('data-no-i18n', '');
    b.title = '언어 전환 (한↔영) / Toggle language';
    b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99998;background:#221e18;color:#e8e3d8;' +
      'border:1px solid #4a3f2e;border-radius:18px;padding:7px 13px;font-size:12px;font-weight:700;cursor:pointer;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.4);opacity:.82;transition:opacity .15s;';
    b.onmouseenter = () => b.style.opacity = '1';
    b.onmouseleave = () => b.style.opacity = '.82';
    b.onclick = () => setLang(_on ? 'ko' : 'en');
    (document.body || document.documentElement).appendChild(b);
    _syncToggle();
  }

  // ── 다이얼로그(alert/confirm/prompt)는 DOM 밖 → 옵저버가 못 잡음. 메시지를 번역 경유 ──
  function _trStr(s) {
    if (typeof s !== 'string' || !s || !KO.test(s)) return s;
    if (_has(s)) { const e = _tr(s); if (e !== s) return e; }      // 전체 정확일치
    if (s.indexOf('\n') >= 0) {                                    // 멀티라인 → 줄 단위(정적 헤드라인만)
      let changed = false;
      const out = s.split('\n').map(function (line) {
        const k = line.trim(); if (!k || !KO.test(k)) return line;
        const f = _findKey(k); if (!f) return line;
        const e = _tr(f[1]); if (e === f[1]) return line;
        changed = true; return line.replace(k, f[0] + e + f[2]);
      }).join('\n');
      if (changed) return out;
    } else {                                                       // 단일행 핵심추출
      const k = s.trim(); const f = _findKey(k);
      if (f) { const e = _tr(f[1]); if (e !== f[1]) return s.replace(k, f[0] + e + f[2]); }
    }
    return s;
  }
  function _patchDialogs() {
    if (root._i18nDialogPatched) return; root._i18nDialogPatched = true;
    const A = root.alert, C = root.confirm, P = root.prompt;
    if (A) root.alert = function (m) { return A.call(root, _on ? _trStr(m) : m); };
    if (C) root.confirm = function (m) { return C.call(root, _on ? _trStr(m) : m); };
    if (P) root.prompt = function (m, d) { return P.call(root, _on ? _trStr(m) : m, d); };
  }

  function init(opts) {
    opts = opts || {};
    if (!document.body) return;
    _patchDialogs();
    if (!_observer) {
      _observer = new MutationObserver(_onMutations);
      _observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TRANS_ATTRS });
    }
    if (opts.toggle !== false) _injectToggle();
    setEnabled((typeof PFLocale !== 'undefined' ? PFLocale.getLang() : 'ko') === 'en');
    _syncToggle();
  }

  const API = { init, setLang, getLang, setEnabled, retranslate };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.I18n = API;

  // ── 자동 부트스트랩: 테이블 로드 → init (HTML은 cs_locale.js + cs_i18n.js만 포함하면 됨) ──
  function _boot() {
    const start = function () {
      if (typeof PFLocale === 'undefined') { console.warn('[i18n] PFLocale(cs_locale.js) 미로드 — 번역 비활성'); return; }
      const go = function () { try { init(); } catch (e) { console.warn('[i18n] init 실패', e); } };
      if (PFLocale.has('재주')) go();                       // 이미 로드됨
      else PFLocale.load().then(go).catch(function (e) { console.warn('[i18n] 테이블 로드 실패', e); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
  if (typeof window !== 'undefined') _boot();
})(typeof window !== 'undefined' ? window : globalThis);
