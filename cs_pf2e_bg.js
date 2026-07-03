/* cs_pf2e_bg.js — 배경(Background) ACCESS 어댑터 (P4)
 * FVTT backgrounds.base(490) ⊕ 한글 OVERLAY → 빌더가 쓰는 레거시 형태 + getBackgroundEffects 형태.
 * 배경 효과(능력부스트/기술/지식/재주)는 레벨 무관 = 구조필드 직접 매핑(RE 엔진 불필요). 부여 재주는 system.items(uuid) → 슬러그.
 * 의존: cs_pf2e.js(PF2eData). DOM 무관. 배선=cs_modal/cs_calc/cs_save. 미준비 시 레거시 BACKGROUNDS 폴백.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false;
  let _index = null, _list = null;

  function _slugify(s) { return String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  async function init() {
    if (_ready) return;
    if (isNode) PF.loadCategorySync('backgrounds');
    else await PF.loadCategory('backgrounds');
    _build();
    _ready = true;
  }
  function ready() { return _ready; }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('backgrounds')) {
      const slug = doc.system && doc.system.slug; if (!slug || seen.has(slug)) continue; seen.add(slug);
      const leg = backgroundToLegacy(doc); _index.set(slug, leg); _list.push(leg);
    }
    _list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
  }

  // ── 배경 효과: 구조필드 → getBackgroundEffects 형태 (cs_calc) ──
  function backgroundEffects(doc) {
    const s = doc.system || {};
    const eff = { boosts: [], boost_choices: [], free_boosts: 0, fixed_skills: [], choice_skill_groups: [], fixed_lores: [], feat_id: null, deity_skill: false, deity_lore: false };
    for (const k of Object.keys(s.boosts || {})) {
      const v = ((s.boosts[k] || {}).value) || [];
      if (v.length >= 6) eff.free_boosts++;
      else if (v.length === 1) eff.boosts.push(v[0]);
      else if (v.length > 1) eff.boost_choices.push(v.slice());
    }
    const ts = s.trainedSkills || {};
    for (const sk of (ts.value || [])) eff.fixed_skills.push(sk);
    for (const lo of (ts.lore || [])) eff.fixed_lores.push(String(lo).replace(/\s*Lore$/i, '').trim());
    // 부여 재주 (system.items 첫 항목 = 기술 재주). uuid → 슬러그, getFeat가 한글 해소(재주 이행 후 전량)
    for (const k of Object.keys(s.items || {})) {
      const it = s.items[k];
      let fdoc = null; try { fdoc = it.uuid ? PF.getByUuid(it.uuid) : null; } catch (e) {}
      eff.feat_id = (fdoc && fdoc.system && fdoc.system.slug) || (it.name ? _slugify(it.name) : null);
      if (it.name) eff.feat_name_en = it.name;
      break;
    }
    return eff;
  }

  function backgroundToLegacy(doc) {
    const s = doc.system || {};
    return {
      id: doc.system.slug, name: PF.nameKo(doc), en: doc.name_en || doc.name,
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      rarity: (s.traits && s.traits.rarity) || 'common',
      _effects: backgroundEffects(doc),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  function backgroundList() { return _list ? _list.slice() : []; }
  function getBackgroundLegacy(slug) { return _index ? _index.get(slug) || null : null; }

    // 전 카탈로그 로드 후 재열거 — init 시점에 타 카테고리 미로드로 enrichDesc @link가 영문 스냅샷된 캐시를 정본 한글로 재생성
  function rebuild() { if (_ready) _build(); }
const API = { init, ready, rebuild, backgroundList, getBackgroundLegacy, backgroundToLegacy, backgroundEffects };
  root.PF2eBg = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
