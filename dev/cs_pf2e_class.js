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
  const RE = root.REEngine || (isNode ? require('/tmp/PF2e-publish/dev/cs_re_engine.js') : null);

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

  // 시전자: 전수(full)=공유 _FULL_CASTER_TABLE, 제한(limited)=하단 표. champion=집중주문(슬롯표 없음).
  const FULL_CASTERS = new Set(['sorcerer', 'oracle', 'animist']);
  // 제한 시전자 슬롯표(PF2e 정본 근사 — 검수 대상). cantrips + ranks[1..10]
  function _limitedTable(slotsByLv, cantrips) {
    const t = {};
    for (let lv = 1; lv <= 20; lv++) t[lv] = { cantrips: cantrips, slots: (slotsByLv[lv] || slotsByLv[lv - 1] || [0,0,0,0,0,0,0,0,0,0]).slice() };
    return t;
  }
  // 제한시전 슬롯표 — PF2e 정본(AoN 검수 완료, 2026-07-01). 두 패턴이 다름:
  //  ① FOCUSED(매서·소환사): 항상 최상위 2개 랭크에만 2슬롯(하위 랭크 슬롯은 위로 이동·소멸). 10랭크 없음. 캔트립 5.
  //  ② PSYCHIC: 거의 풀 진행(모든 시전 랭크 2슬롯, 신규 최상위 랭크는 1슬롯), 10랭크 있음. 캔트립 3(+의식정신 psi cantrip은 별도 경로).
  const FOCUSED_SLOTS = { 1:[1,0,0,0,0,0,0,0,0,0],2:[2,0,0,0,0,0,0,0,0,0],3:[2,1,0,0,0,0,0,0,0,0],4:[2,2,0,0,0,0,0,0,0,0],5:[0,2,2,0,0,0,0,0,0,0],6:[0,2,2,0,0,0,0,0,0,0],7:[0,0,2,2,0,0,0,0,0,0],8:[0,0,2,2,0,0,0,0,0,0],9:[0,0,0,2,2,0,0,0,0,0],10:[0,0,0,2,2,0,0,0,0,0],11:[0,0,0,0,2,2,0,0,0,0],12:[0,0,0,0,2,2,0,0,0,0],13:[0,0,0,0,0,2,2,0,0,0],14:[0,0,0,0,0,2,2,0,0,0],15:[0,0,0,0,0,0,2,2,0,0],16:[0,0,0,0,0,0,2,2,0,0],17:[0,0,0,0,0,0,0,2,2,0],18:[0,0,0,0,0,0,0,2,2,0],19:[0,0,0,0,0,0,0,2,2,0],20:[0,0,0,0,0,0,0,2,2,0] };
  const PSYCHIC_SLOTS = { 1:[1,0,0,0,0,0,0,0,0,0],2:[2,0,0,0,0,0,0,0,0,0],3:[2,1,0,0,0,0,0,0,0,0],4:[2,2,0,0,0,0,0,0,0,0],5:[2,2,1,0,0,0,0,0,0,0],6:[2,2,2,0,0,0,0,0,0,0],7:[2,2,2,1,0,0,0,0,0,0],8:[2,2,2,2,0,0,0,0,0,0],9:[2,2,2,2,1,0,0,0,0,0],10:[2,2,2,2,2,0,0,0,0,0],11:[2,2,2,2,2,1,0,0,0,0],12:[2,2,2,2,2,2,0,0,0,0],13:[2,2,2,2,2,2,1,0,0,0],14:[2,2,2,2,2,2,2,0,0,0],15:[2,2,2,2,2,2,2,1,0,0],16:[2,2,2,2,2,2,2,2,0,0],17:[2,2,2,2,2,2,2,2,1,0],18:[2,2,2,2,2,2,2,2,2,0],19:[2,2,2,2,2,2,2,2,2,1],20:[2,2,2,2,2,2,2,2,2,1] };

  function spellTable(slug) {
    if (FULL_CASTERS.has(slug)) {
      if (typeof _FULL_CASTER_TABLE !== 'undefined') return _FULL_CASTER_TABLE();   // bare name(함수선언=전역)
      if (typeof root._FULL_CASTER_TABLE === 'function') return root._FULL_CASTER_TABLE();
    }
    if (slug === 'magus' || slug === 'summoner') return _limitedTable(FOCUSED_SLOTS, 5);
    if (slug === 'psychic') return _limitedTable(PSYCHIC_SLOTS, 3);
    return null;
  }

  // 레벨별 클래스 특성 (CLASS_FEATURE_NAMES 형태) — system.items에서 도출, 한글 해소
  function classFeatures(doc) {
    const items = (doc.system && doc.system.items) || {};
    const out = [];
    for (const it of Object.values(items)) {
      let d = null; try { d = it.uuid ? PF.getByUuid(it.uuid) : null; } catch (e) {}
      out.push({ lv: it.level || 1, name_ko: d ? PF.nameKo(d) : it.name, name_en: (d && (d.name_en || d.name)) || it.name });
    }
    return out.sort((a, b) => a.lv - b.lv);
  }

  // 서브클래스 메타: ChoiceSet 특성에서 tag + 유형명 추출.
  // ⚠ 다차원 클래스(사이킥=의식/잠재의식, 에그젬플러=이콘/별칭 등)는 ChoiceSet이 여러 개 → 전부 수집(첫 개만 잡으면 나머지 차원 유실).
  // ⚠ item:tag: 뿐 아니라 item:trait: 필터도 허용(커맨더 등). kind로 feat 매칭 방식 구분(tag=otherTags, trait=traits.value).
  function _subclassMetas(doc) {
    const items = (doc.system && doc.system.items) || {};
    const metas = []; const seen = new Set();
    for (const it of Object.values(items)) {
      let d = null; try { d = it.uuid ? PF.getByUuid(it.uuid) : null; } catch (e) {}
      if (!d) continue;
      for (const r of (d.system && d.system.rules) || []) {
        if (r.key !== 'ChoiceSet' || !r.choices) continue;
        let filt = Array.isArray(r.choices.filter) ? r.choices.filter : (Array.isArray(r.choices) ? r.choices : null);
        if (!filt) continue;
        for (const x of filt) {
          if (typeof x !== 'string') continue;
          let tag = null, kind = null;
          if (x.indexOf('item:tag:') === 0) { tag = x.slice('item:tag:'.length); kind = 'tag'; }
          else if (x.indexOf('item:trait:') === 0) { tag = x.slice('item:trait:'.length); kind = 'trait'; }
          if (!tag || seen.has(kind + ':' + tag)) continue;
          seen.add(kind + ':' + tag);
          metas.push({ tag, kind, typeKo: PF.nameKo(d), typeEn: d.name_en || d.name });
        }
      }
    }
    return metas;
  }

  // 서브클래스 목록 (SUBCLASS_DB 형태) — 모든 서브클래스 차원의 tag/trait 일치 feat에서. grants는 RE로 추출(best-effort).
  function subclassList(doc) {
    const slug = doc.system.slug;
    const metas = _subclassMetas(doc);
    if (!metas.length || !RE) return [];
    const out = []; const seenFeat = new Set();
    for (const meta of metas) {
      for (const f of PF.all('feats')) {
        const tr = (f.system && f.system.traits) || {};
        const hit = meta.kind === 'trait' ? (tr.value || []).includes(meta.tag) : (tr.otherTags || []).includes(meta.tag);
        if (!hit) continue;
        if (seenFeat.has(f.system.slug)) continue;   // 한 feat이 여러 차원에 걸치면 첫 차원으로 귀속
        seenFeat.add(f.system.slug);
        let granted_feats = [], granted_spells = [], prof_changes = {};
        try {
          const a = RE.build({ level: 20, abilities: { str:4,dex:4,con:4,int:4,wis:4,cha:4 }, class: slug, items: [{ doc: f, choices: {} }] });
          for (const g of (a.grantedDocs || [])) {
            if (!g) continue;
            const gslug = (g.system && g.system.slug) || g._id;
            if (g.type === 'feat') granted_feats.push(gslug);  // getSubclassAutoFeats가 슬러그로 조회
            else if (g.type === 'spell') granted_spells.push({ spell_id: gslug, lv: (g.system.level && g.system.level.value) || 1, type: 'spell' });
          }
        } catch (e) {}
        out.push({
          id: f.system.slug, class_id: slug, subclass_type: meta.typeKo,
          name_ko: PF.nameKo(f), name_en: f.name_en || f.name,
          desc: PF.enrichDesc(PF.descKo(f) || ''),
          granted_skills: [], granted_feats, granted_spells, features: [], prof_changes,
        });
      }
    }
    return out;
  }

  // 신규 클래스 데이터를 기존 전역 구조(CLASS_FEATURE_NAMES/CLASS_SPELL_TABLE/SUBCLASS_DB)에 병합 → 모든 소비처 자동 동작
  function _mergeIntoGlobals() {
    // ⚠ top-level const(SUBCLASS_DB)은 window에 안 붙음 → bare name + typeof 가드로 접근(v622 교훈)
    const FN = (typeof CLASS_FEATURE_NAMES !== 'undefined') ? CLASS_FEATURE_NAMES : (root.CLASS_FEATURE_NAMES || null);
    const ST = (typeof CLASS_SPELL_TABLE !== 'undefined') ? CLASS_SPELL_TABLE : (root.CLASS_SPELL_TABLE || null);
    const SD = (typeof SUBCLASS_DB !== 'undefined') ? SUBCLASS_DB : (root.SUBCLASS_DB || null);
    for (const doc of PF.all('classes')) {
      const slug = doc.system && doc.system.slug; if (!slug || LEGACY.has(slug)) continue;
      if (FN && !FN[slug]) FN[slug] = classFeatures(doc);
      if (ST && !ST[slug]) { const t = spellTable(slug); if (t) ST[slug] = t; }
      if (SD && Array.isArray(SD) && !SD.some(s => s.class_id === slug)) {
        for (const sub of subclassList(doc)) SD.push(sub);
      }
    }
  }

  async function init() {
    if (_ready) return;
    // 서브클래스 grants/특성은 feats·spells 카테고리 필요(getByUuid·tag 조회)
    if (isNode) { PF.loadCategorySync('classes'); PF.loadCategorySync('feats'); PF.loadCategorySync('spells'); }
    else await Promise.all([PF.loadCategory('classes'), PF.loadCategory('feats'), PF.loadCategory('spells')]);
    _build();
    try { _mergeIntoGlobals(); } catch (e) { if (typeof console !== 'undefined') console.warn('PF2eClass 전역 병합 실패', e); }
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

  const API = { init, ready, classList, getClassLegacy, classToLegacy, classProfTable, isLegacy, CLASS_PROF_EXT, classFeatures, subclassList, spellTable };
  root.PF2eClass = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
