// ═══════════════════════════════════════════════════════════════
//  cs_locale.js — Pathforge UI 로컬라이즈 (한↔영)
//  ko-native 앱 + en 오버레이. 테이블: data/locale.json (ko → en, 1663+)
//  사용: 표시 문자열을 t('한글')로 감싸면 영어 모드에서 영문 반환.
//        미등록 문자열은 원문(한글) 폴백 → 점진 배선 안전.
//  배선(호출부 t() 전환)은 별도 단계 — 헬퍼+테이블이 정본.
// ═══════════════════════════════════════════════════════════════
(function (root) {
  'use strict';
  let _en = {};            // ko → en
  let _lang = 'ko';
  try { _lang = (root.localStorage && root.localStorage.getItem('pf_lang')) || 'ko'; } catch (e) {}

  async function load(url) {
    url = url || 'data/locale.json';
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      _en = await fetch(url).then(r => r.json());
    } else {
      _en = JSON.parse(require('fs').readFileSync(url, 'utf8'));
    }
    return _en;
  }
  function ingest(map) { _en = map || {}; }                 // 번들/직접 주입
  function setLang(l) {
    _lang = (l === 'en') ? 'en' : 'ko';
    try { root.localStorage && root.localStorage.setItem('pf_lang', _lang); } catch (e) {}
    if (typeof document !== 'undefined' && document.documentElement)
      document.documentElement.setAttribute('data-lang', _lang);
  }
  function getLang() { return _lang; }
  // 핵심: 한글 원문 → 현재 언어 문자열. en이고 등록돼 있으면 영문, 아니면 원문.
  function t(ko) { return (_lang === 'en' && _en[ko] != null) ? _en[ko] : ko; }
  function has(ko) { return _en[ko] != null; }

  const API = { load, ingest, setLang, getLang, t, has };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.PFLocale = API;
  root.t = t;               // 전역 단축 (t('재주') → 'Feat')
})(typeof window !== 'undefined' ? window : globalThis);
