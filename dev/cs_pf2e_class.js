/* cs_pf2e_class.js — 클래스(Class) ACCESS 어댑터 (P4)
 * FVTT classes.base(27) ⊕ 한글 OVERLAY → 빌더 CLASS 형태(콘텐츠 + L1 스탯).
 * ⚠ 숙련 진행표는 FVTT 컴펜디움에 없음(파운드리 시스템 코드에만 존재) → 신규 19클래스는 PF2e 정본 기준 수작업(CLASS_PROF_EXT).
 *   L1 contrib는 FVTT classes.base에서 확인(앵커), 상위 레벨 브레이크포인트는 PC1/PC2 정본 진행.
 * 레거시 8클래스(bard/cleric/druid/fighter/ranger/rogue/witch/wizard)는 기존 CLASS_PROF_TABLE 권위 유지.
 * 의존: cs_pf2e.js(PF2eData). 미준비 시 레거시 CLASSES 폴백.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false, _index = null, _list = null;

  const LEGACY = new Set(['bard', 'cleric', 'druid', 'fighter', 'ranger', 'rogue', 'witch', 'wizard']);
  const RANK = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8 };  // FVTT rank → contrib
  const RANK_KO = { 0: '미숙련', 2: '숙련', 4: '전문가', 6: '달인', 8: '전설' };
  const KEY_KO = { str: '근력', dex: '민첩', con: '건강', int: '지능', wis: '지혜', cha: '매력' };
  // 시전 전통(클래스 고정 전통). 선택형(sorcerer 혈통/oracle 신비)은 빌더에서 별도.
  const TRADITION = { sorcerer: 'any', oracle: 'divine', animist: 'divine', psychic: 'occult', summoner: 'any', magus: 'arcane' };
  const CASTING = { sorcerer: 'spontaneous', oracle: 'spontaneous', animist: 'prepared', psychic: 'spontaneous', summoner: 'spontaneous', magus: 'prepared' };

  // ── 수작업 숙련 진행표 (신규 19클래스, PF2e PC1/PC2 정본). contrib 2=T,4=E,6=M,8=L ──
  // L1 값은 FVTT classes.base와 일치(앵커). 누락 selector는 L1 미숙련 또는 해당없음.
  const CLASS_PROF_EXT = {
    barbarian: { fort:{1:4,9:6,17:8}, ref:{1:2,9:4}, will:{1:4,15:6}, perc:{1:4,7:6,15:8}, classdc:{1:2,9:4}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,13:4,19:6}, 'armor-medium':{1:2,13:4,19:6}, 'armor-unarmored':{1:2,13:4,19:6} },
    champion: { fort:{1:4,9:6,17:8}, ref:{1:2,17:4}, will:{1:4,9:6}, perc:{1:2,7:4}, classdc:{1:2,9:4}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,7:4,17:6}, 'armor-medium':{1:2,7:4,17:6}, 'armor-heavy':{1:2,7:4,17:6}, 'armor-unarmored':{1:2,7:4,17:6} },
    monk: { fort:{1:4,9:6,17:8}, ref:{1:4,9:6,17:8}, will:{1:4,9:6,17:8}, perc:{1:2,5:4,17:6}, classdc:{1:2,9:4,19:6}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-unarmored':{1:4,13:6,19:8} },
    alchemist: { fort:{1:4,11:6}, ref:{1:4,7:6,17:8}, will:{1:2,5:4}, perc:{1:2,7:4}, classdc:{1:2,5:4,17:6}, 'weapon-simple':{1:2,13:4}, 'weapon-unarmed':{1:2,13:4}, 'armor-light':{1:2,11:4}, 'armor-medium':{1:2,11:4}, 'armor-unarmored':{1:2,11:4} },
    sorcerer: { fort:{1:2,11:4}, ref:{1:2,5:4}, will:{1:4,9:6,17:8}, perc:{1:2,9:4}, spatk:{1:2,7:4,15:6,19:8}, classdc:{1:2}, 'weapon-simple':{1:2,11:4}, 'weapon-unarmed':{1:2,11:4}, 'armor-unarmored':{1:2,13:4} },
    oracle: { fort:{1:2,9:4}, ref:{1:2,15:4}, will:{1:4,11:6}, perc:{1:2,7:4}, spatk:{1:2,7:4,15:6,19:8}, classdc:{1:2}, 'weapon-simple':{1:2,11:4}, 'weapon-unarmed':{1:2,11:4}, 'armor-light':{1:2,13:4}, 'armor-unarmored':{1:2,13:4} },
    swashbuckler: { fort:{1:2,9:4}, ref:{1:4,9:6,15:8}, will:{1:4,15:6}, perc:{1:4,7:6}, classdc:{1:2,7:4,15:6}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,13:4,17:6}, 'armor-unarmored':{1:2,13:4,17:6} },
    investigator: { fort:{1:2,11:4}, ref:{1:4,9:6}, will:{1:4,17:6}, perc:{1:4,9:6,17:8}, classdc:{1:2,7:4,15:6}, 'weapon-simple':{1:2,11:4}, 'weapon-martial':{1:2,11:4}, 'weapon-unarmed':{1:2,11:4}, 'armor-light':{1:2,13:4,17:6}, 'armor-unarmored':{1:2,13:4,17:6} },
    magus: { fort:{1:4,11:6}, ref:{1:2,9:4}, will:{1:4,9:6}, perc:{1:2,11:4}, spatk:{1:2,9:4,17:6}, classdc:{1:2}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,13:4}, 'armor-medium':{1:2,13:4}, 'armor-unarmored':{1:2,13:4} },
    summoner: { fort:{1:4,17:6}, ref:{1:2,9:4}, will:{1:4,9:6}, perc:{1:2,9:4}, spatk:{1:2,9:4,17:6}, classdc:{1:2}, 'weapon-simple':{1:2,9:4,19:6}, 'weapon-unarmed':{1:2,9:4,19:6}, 'armor-unarmored':{1:2,11:4} },
    gunslinger: { fort:{1:4,15:6}, ref:{1:4,9:6,17:8}, will:{1:2,11:4}, perc:{1:4,7:6,15:8}, classdc:{1:2,7:4,15:6}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,13:4}, 'armor-medium':{1:2,13:4}, 'armor-unarmored':{1:2,13:4} },
    thaumaturge: { fort:{1:4,11:6}, ref:{1:2,9:4}, will:{1:4,17:6}, perc:{1:4,9:6}, classdc:{1:2,9:4,17:6}, 'weapon-simple':{1:2,5:4}, 'weapon-martial':{1:2,5:4}, 'weapon-unarmed':{1:2,5:4}, 'armor-light':{1:2,11:4,17:6}, 'armor-medium':{1:2,11:4,17:6}, 'armor-unarmored':{1:2,11:4,17:6} },
    kineticist: { fort:{1:4,9:6,17:8}, ref:{1:4,9:6,17:8}, will:{1:2,9:4}, perc:{1:2,9:4}, classdc:{1:2,9:4,17:6}, 'weapon-simple':{1:2}, 'weapon-unarmed':{1:2}, 'armor-light':{1:2,13:4}, 'armor-unarmored':{1:2,13:4} },
    psychic: { fort:{1:2,9:4}, ref:{1:2,9:4}, will:{1:4,9:6,17:8}, perc:{1:2,9:4}, spatk:{1:2,7:4,15:6,19:8}, classdc:{1:2}, 'weapon-simple':{1:2,11:4}, 'weapon-unarmed':{1:2,11:4}, 'armor-unarmored':{1:2,13:4} },
    inventor: { fort:{1:4,11:6}, ref:{1:2,9:4}, will:{1:4,17:6}, perc:{1:2,11:4}, classdc:{1:2,9:4,17:6}, 'weapon-simple':{1:2,9:4,17:6}, 'weapon-martial':{1:2,9:4,17:6}, 'weapon-unarmed':{1:2,9:4,17:6}, 'armor-light':{1:2,11:4}, 'armor-medium':{1:2,11:4}, 'armor-unarmored':{1:2,11:4} },
    animist: { fort:{1:2,9:4}, ref:{1:2,15:4}, will:{1:4,11:6}, perc:{1:2,7:4}, spatk:{1:2,7:4,15:6,19:8}, classdc:{1:2}, 'weapon-simple':{1:2,11:4}, 'weapon-unarmed':{1:2,11:4}, 'armor-light':{1:2,13:4}, 'armor-medium':{1:2,13:4}, 'armor-unarmored':{1:2,13:4} },
    guardian: { fort:{1:4,9:6,17:8}, ref:{1:2,9:4}, will:{1:4,15:6}, perc:{1:2,7:4}, classdc:{1:2,9:4}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,7:4,17:6}, 'armor-medium':{1:2,7:4,17:6}, 'armor-heavy':{1:2,7:4,17:6}, 'armor-unarmored':{1:2,7:4,17:6} },
    commander: { fort:{1:2,11:4}, ref:{1:4,9:6}, will:{1:4,17:6}, perc:{1:4,9:6}, classdc:{1:2,9:4,17:6}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,11:4}, 'armor-medium':{1:2,11:4}, 'armor-heavy':{1:2,11:4}, 'armor-unarmored':{1:2,11:4} },
    exemplar: { fort:{1:4,9:6,17:8}, ref:{1:2,9:4}, will:{1:4,15:6}, perc:{1:2,7:4}, classdc:{1:2,9:4,17:6}, 'weapon-simple':{1:2,5:4,13:6}, 'weapon-martial':{1:2,5:4,13:6}, 'weapon-unarmed':{1:2,5:4,13:6}, 'armor-light':{1:2,11:4}, 'armor-medium':{1:2,11:4}, 'armor-unarmored':{1:2,11:4} },
  };

  async function init() {
    if (_ready) return;
    if (isNode) PF.loadCategorySync('classes');
    else await PF.loadCategory('classes');
    _build();
    _ready = true;
  }
  function ready() { return _ready; }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('classes')) {
      const slug = doc.system && doc.system.slug; if (!slug || seen.has(slug)) continue; seen.add(slug);
      const leg = classToLegacy(doc); _index.set(slug, leg); _list.push(leg);
    }
    _list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
  }

  function classToLegacy(doc) {
    const s = doc.system || {};
    const slug = s.slug;
    const key = (s.keyAbility && s.keyAbility.value) || [];
    return {
      id: slug, name: PF.nameKo(doc), en: doc.name_en || doc.name,
      hp: s.hp || 8,
      key_attrs: key.slice(),  // 핵심 속성 옵션(단일이면 자동 선택, ['dex','str']면 빌더에서 택1)
      saves: { fort: RANK_KO[RANK[s.savingThrows.fortitude]], ref: RANK_KO[RANK[s.savingThrows.reflex]], will: RANK_KO[RANK[s.savingThrows.will]] },
      perc: RANK_KO[RANK[s.perception]] || '미숙련',
      tradition: TRADITION[slug] || null, casting: CASTING[slug] || null,
      free_skill_count: (s.trainedSkills && s.trainedSkills.additional) || 0,
      fixed_skills: ((s.trainedSkills && s.trainedSkills.value) || []).slice(),
      choice_skill_groups: [],
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  // 숙련 진행표: 레거시는 기존 CLASS_PROF_TABLE, 신규는 CLASS_PROF_EXT
  function classProfTable(slug) { return CLASS_PROF_EXT[slug] || null; }
  function isLegacy(slug) { return LEGACY.has(slug); }

  function classList() { return _list ? _list.slice() : []; }
  function getClassLegacy(slug) { return _index ? _index.get(slug) || null : null; }

  const API = { init, ready, classList, getClassLegacy, classToLegacy, classProfTable, isLegacy, CLASS_PROF_EXT };
  root.PF2eClass = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
