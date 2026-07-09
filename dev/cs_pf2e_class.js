/* cs_pf2e_class.js — 클래스(Class) ACCESS 어댑터 (P4)
 * FVTT classes.base(27) ⊕ 한글 OVERLAY → 빌더 CLASS 형태(콘텐츠 + L1 스탯).
 * ⚠ 숙련 진행표는 FVTT 컴펜디움에 없음(파운드리 시스템 코드에만 존재) → 숙련표는 DataManager 단일소스(class_progression.json)에서 런타임 구성.
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
  const _FOCUS_ONLY = new Set(['champion']); // spellcasting=1이지만 집중 주문 전용(슬롯 없음) — 가드 예외
  // 시전 방식/전통/신격기술 = 데이터 단일 소스 `data/override/classes.json` (slug→{casting,tradition,deity_skill}).
  // FVTT classes.base엔 spellcasting:0|1(시전자 여부)만 있고 준비/즉흥·전통은 없음(시스템 TS 코드 영역) → 큐레이션 필수.
  // 코드 맵으로 두면 신규 클래스 추가 시 무음 누락(v0.92 회귀: 코어 8클래스 casting=null → 주문 탭 미표시) →
  // 데이터로 이전 + _build()의 spellcasting=1 정합 가드가 누락을 즉시 경고. 선택형 전통(소서러 혈통 등)='any'.

  // ── 수작업 숙련 진행표 (신규 19클래스, PF2e PC1/PC2 정본). contrib 2=T,4=E,6=M,8=L ──
  // L1 값은 FVTT classes.base와 일치(앵커). 누락 selector는 L1 미숙련 또는 해당없음.
  // 숙련 진행표 = DataManager 단일 소스(data/derived/class_progression.json). 하드코딩(CLASS_PROF_TABLE/CLASS_PROF_EXT) 폐기.
  // 소비처(cs_pf2e_stats.classContrib 등)는 root.CLASS_PROF_TABLE[cls][statKey][level] 형식을 읽음(레벨별 full).
  const _PROF_L = { U:0, T:2, E:4, M:6, L:8 };
  const _PROF_COL2T = { perception:"perc", fortitude:"fort", reflex:"ref", will:"will", classDC:"classdc", simple:"weapon-simple", martial:"weapon-martial", unarmed:"weapon-unarmed", advanced:"weapon-advanced", unarmored:"armor-unarmored", light:"armor-light", medium:"armor-medium", heavy:"armor-heavy", spellcasting:"spatk" };
  let _profTable = null, _featRoster = null;
  function _buildProfTable(rows) {
    const t = {};
    for (const r of rows || []) {
      const cls = r.class; if (!cls) continue;
      const o = t[cls] || (t[cls] = {});
      for (const col in _PROF_COL2T) {
        const v = r[col]; if (v == null || v === "") continue;
        const tgt = _PROF_COL2T[col];
        (o[tgt] || (o[tgt] = {}))[r.level] = _PROF_L[v] || 0;
      }
    }
    return t;
  }
  // 레벨별 클래스특성 로스터 = 성장표 rows[].features 단일소스(build_class_growth.mjs 생성).
  //   각 항목: {lv, slug/id, name_ko, name_en, kind:subclass|choice|feature, rule_keys}.
  //   kind가 소비처의 UI·부여 경로를 가름(subclass/choice=선택 UI, feature=auto 재주).
  function _buildFeatRoster(rows) {
    const t = {};
    for (const r of rows || []) {
      const cls = r.class; if (!cls) continue;
      for (const f of (r.features || [])) {
        (t[cls] || (t[cls] = [])).push({
          lv: r.level, name_ko: f.name_ko, name_en: f.name_en,
          id: f.slug, slug: f.slug, kind: f.kind || 'feature', rule_keys: f.rule_keys || [],
        });
      }
    }
    for (const cls in t) t[cls].sort((a, b) => a.lv - b.lv);
    return t;
  }
  function classFeatureRoster(slug) { return (_featRoster && _featRoster[slug]) || null; }
  // 서브클래스 숙련 진행표(섀시) = data/derived/subclass_progression.json (클래스표와 동일 스키마).
  //   런타임 소비(applyClassFeatures)는 prof_changes와 동일한 {runtimeStat:{level:rankNum}} 형태로 재구성해 반환.
  let _subProfTable = null;
  const _SP_COL2STAT = { perception: 'perc', fortitude: 'fort', reflex: 'ref', will: 'will', classDC: 'classdc', simple: 'weapon-simple', martial: 'weapon-martial', unarmed: 'weapon-unarmed', advanced: 'weapon-advanced', unarmored: 'armor-unarmored', light: 'armor-light', medium: 'armor-medium', heavy: 'armor-heavy', spellcasting: 'spatk' };
  function _buildSubProfTable(rows) {
    const t = {};
    for (const r of rows || []) {
      const sub = r.subclass; if (!sub) continue;
      const o = t[sub] || (t[sub] = {});
      for (const col in _SP_COL2STAT) {
        const v = r[col]; if (!v) continue;
        const stat = _SP_COL2STAT[col];
        (o[stat] || (o[stat] = {}))[r.level] = _PROF_L[v] || 0;
      }
    }
    return t;
  }
  function subclassProfTable(sub) { return (_subProfTable && _subProfTable[sub]) || null; }
  async function _ensureSubProfTable() {
    if (_subProfTable) return _subProfTable;
    let rows = null;
    if (isNode) { const fs = require("fs"); for (const p of ["data/derived/subclass_progression.json", "dev/data/derived/subclass_progression.json"]) { try { rows = JSON.parse(fs.readFileSync(p, "utf8")).rows; break; } catch (e) {} } }
    if (rows == null) { try { const r = await fetch("data/derived/subclass_progression.json?v=0.171"); rows = ((await r.json()).rows) || []; } catch (e) { rows = []; } }
    _subProfTable = _buildSubProfTable(rows || []);
    return _subProfTable;
  }
  function _profRows() {
    if (isNode) { const fs = require("fs"); for (const p of ["data/derived/class_progression.json","dev/data/derived/class_progression.json"]) { try { return JSON.parse(fs.readFileSync(p,"utf8")).rows || []; } catch(e){} } return []; }
    return null;
  }
  async function _ensureProfTable() {
    if (_profTable) return _profTable;
    let rows = _profRows();
    if (rows == null) { try { const r = await fetch("data/derived/class_progression.json?v=0.171"); rows = ((await r.json()).rows) || []; } catch(e){ rows = []; } }
    _profTable = _buildProfTable(rows);
    _featRoster = _buildFeatRoster(rows);   // 레벨별 특성 로스터(같은 성장표 rows에서)
    root.CLASS_PROF_TABLE = _profTable;   // 전역 노출(cs_pf2e_stats/actor/cs_modal 소비)
    return _profTable;
  }

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

  // 레벨별 클래스 특성 (CLASS_FEATURE_NAMES 형태) = 성장표 로스터 단일소스(slug+kind 포함).
  //   로스터 미로드(폴백) 시에만 구 경로(doc.system.items 도출, slug/kind 없음).
  function classFeatures(doc) {
    const slug = doc.system && doc.system.slug;
    const r = classFeatureRoster(slug);
    if (r && r.length) return r.map(x => ({ ...x }));
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
        // ⚠ 서브클래스 = item:tag: ChoiceSet만(에이돌론·의식/잠재의식 등). item:trait: 는 재주선택(진화 재주 등)이라 서브클래스 아님 — 오수집 시 진화재주가 서브클래스로 뜸(v0.46 회귀).
        for (const x of filt) {
          if (typeof x !== 'string' || x.indexOf('item:tag:') !== 0) continue;
          const tag = x.slice('item:tag:'.length);
          if (!tag || seen.has(tag)) continue;
          seen.add(tag);
          metas.push({ tag, kind: 'tag', typeKo: PF.nameKo(d), typeEn: d.name_en || d.name });
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
        // 서브클래스 초기 집중 주문(혈통/미스터리/기질/영역/학파/융합 등)은 RE로 안 잡힘 — desc에서 통일 규칙으로 추출(FVTT 시스템 TS 전용 데이터의 유일 추출원).
        //   ★통일 규칙: desc의 @UUID 주문 참조 중 '집중 주문'(traditions 빈값=전통 무소속)의 첫 번째 = L1 부여분.
        //   초기(initial)가 advanced/greater보다 먼저 나오므로 첫 것=초기. 레퍼토리 주문(traditions 있음)은 건너뜀.
        //   is_focus 플래그가 아닌 traditions-빈값으로 판별 → 집중 캔트립(에이돌론 강화·헥스 등 is_focus=false)까지 포함. advanced/greater는 재주로 습득(제외됨).
        if (!granted_spells.length) {
          const dv = (f.system && f.system.description && f.system.description.value) || '';
          for (const mm of dv.matchAll(/@UUID\[([^\]{}]+)\]/g)) {
            try {
              const sp = PF.getByUuid(mm[1].trim());
              if (sp && sp.type === 'spell') {
                const trads = (sp.system && sp.system.traits && sp.system.traits.traditions) || [];
                if (!trads.length) { granted_spells.push({ spell_id: (sp.system && sp.system.slug) || sp._id, lv: 1, type: 'focus' }); break; }
              }
            } catch (e) {}
          }
        }
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
    // 전 클래스(구 8 legacy 포함) 병합. FEAT_DB 제거 후 CLASS_FEATURE_NAMES는 여기서만 채워짐.
    // present-only 채우기(!FN[slug]/!ST[slug]/!SD.some) → 큐레이션(CLASS_SPELL_TABLE·SUBCLASS_DB)은 안 덮음.
    for (const doc of PF.all('classes')) {
      const slug = doc.system && doc.system.slug; if (!slug) continue;
      if (FN && !FN[slug]) FN[slug] = classFeatures(doc);
      if (ST && !ST[slug]) { const t = spellTable(slug); if (t) ST[slug] = t; }
      if (SD && Array.isArray(SD) && !SD.some(s => s.class_id === slug)) {
        for (const sub of subclassList(doc)) SD.push(sub);
      }
    }
  }

  // 클레릭 교의(Doctrine) = DataManager 단일소스(data/derived/cleric_doctrines.json).
  //   레벨별 숙련성장(prof_changes)+주문시전 발전(features)은 FVTT 컴펜디움에 없는 기계효과(수작업 정본).
  //   ⚠ _mergeIntoGlobals 이전에 SUBCLASS_DB에 주입 → FVTT-thin 자동추출(prof_changes 없음) 스킵되게 함.
  let _doctrinesLoaded = false;
  function _injectDoctrines(rows) {
    const SD = (typeof SUBCLASS_DB !== 'undefined') ? SUBCLASS_DB : (root.SUBCLASS_DB || null);
    if (!SD || !Array.isArray(SD)) return;
    for (const r of (rows || [])) { if (r && r.id && !SD.some(s => s.id === r.id)) SD.push(r); }
  }
  function loadDoctrines() {
    if (_doctrinesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/cleric_doctrines.json', 'dev/data/derived/cleric_doctrines.json', '/tmp/PF2e-publish/dev/data/derived/cleric_doctrines.json']) {
        try { _injectDoctrines(JSON.parse(fs.readFileSync(p, 'utf8')).rows); _doctrinesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/cleric_doctrines.json?v=0.171').then(r => r.json()).then(j => { _injectDoctrines(j.rows); _doctrinesLoaded = true; }).catch(() => {});
  }

  // 서브클래스 단일소스 = data/derived/subclasses.json → 런타임 SUBCLASS_DB 채움.
  //   ⚠ SUBCLASS_DB가 비었을 때만 로드. 런타임=cs_data 빈 배열→로드. 빌드 하니스=큐레이션으로 미리 채워
  //   있으므로 스킵→_mergeIntoGlobals/loadDoctrines가 조립(그 조립 결과가 이 파일로 구워짐, parity by construction).
  let _subclassesLoaded = false;
  function loadSubclasses() {
    if (_subclassesLoaded) return Promise.resolve();
    const SD0 = (typeof SUBCLASS_DB !== 'undefined') ? SUBCLASS_DB : (root.SUBCLASS_DB || null);
    if (SD0 && SD0.length > 0) { _subclassesLoaded = true; return Promise.resolve(); } // 이미 채워짐(빌드 하니스) → 조립 경로로
    const inject = rows => { const SD = (typeof SUBCLASS_DB !== 'undefined') ? SUBCLASS_DB : (root.SUBCLASS_DB || null); if (SD && Array.isArray(SD)) for (const r of (rows || [])) { if (r && r.id && !SD.some(s => s.id === r.id)) SD.push(r); } };
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/subclasses.json', 'dev/data/derived/subclasses.json', '/tmp/PF2e-publish/dev/data/derived/subclasses.json']) {
        try { inject(JSON.parse(fs.readFileSync(p, 'utf8')).rows); _subclassesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/subclasses.json?v=0.171').then(r => r.json()).then(j => { inject(j.rows); _subclassesLoaded = true; }).catch(() => {});
  }

  async function init() {
    if (_ready) return;
    // 서브클래스 grants/특성은 feats·spells 카테고리 필요(getByUuid·tag 조회)
    if (isNode) { PF.loadCategorySync('classes'); PF.loadCategorySync('feats'); PF.loadCategorySync('spells'); }
    else await Promise.all([PF.loadCategory('classes'), PF.loadCategory('feats'), PF.loadCategory('spells')]);
    if (isNode) { _ensureProfTable(); _ensureSubProfTable(); } else { await _ensureProfTable(); await _ensureSubProfTable(); }
    if (isNode) loadSubclasses(); else await loadSubclasses();  // 단일소스 로드(비었을 때). 채워지면 아래 조립은 자연 스킵.
    if (isNode) loadDoctrines(); else await loadDoctrines();    // (subclasses.json에 cleric 포함 → 가드로 스킵. 빌드 하니스 조립 경로에서만 실주입)
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
      // 정합 가드: 원본이 시전 클래스(spellcasting=1)라 하는데 큐레이션(casting)이 없으면 즉시 경고 —
      // v0.92 회귀(코어 8클래스 casting 누락→주문 탭 미표시)가 무음으로 재발하지 못하게.
      // 예외: 집중 주문 전용 클래스(슬롯 시전 아님 → casting 없음이 정상).
      if (doc.system.spellcasting === 1 && !_FOCUS_ONLY.has(slug) && !leg.casting && typeof console !== 'undefined')
        console.warn('[PF2eClass] 시전 클래스인데 casting 큐레이션 누락(주문 탭 미표시 위험):', slug, '→ data/override/classes.json에 casting/tradition 추가 필요');
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
      tradition: doc.tradition || null, casting: doc.casting || null,   // ← data/override/classes.json (L3 조인 부착)
      deity_skill: !!doc.deity_skill,  // 클레릭: 신격 선택 시 자동 숙련 게이트(cs_modal deitySkill)
      // 성장 계획 = 클래스별 재주/기술 획득 레벨(FVTT system.*FeatLevels). getGrowthTable가 파생.
      growth: {
        classFeat:     (s.classFeatLevels && s.classFeatLevels.value) || [],
        skillFeat:     (s.skillFeatLevels && s.skillFeatLevels.value) || [],
        generalFeat:   (s.generalFeatLevels && s.generalFeatLevels.value) || [],
        ancestryFeat:  (s.ancestryFeatLevels && s.ancestryFeatLevels.value) || [],
        skillIncrease: (s.skillIncreaseLevels && s.skillIncreaseLevels.value) || [],
      },
      free_skill_count: (s.trainedSkills && s.trainedSkills.additional) || 0,
      fixed_skills: ((s.trainedSkills && s.trainedSkills.value) || []).slice(),
      choice_skill_groups: [],
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  // 숙련 진행표: 레거시는 기존 CLASS_PROF_TABLE, 신규는 CLASS_PROF_EXT
  function classProfTable(slug) { return (_profTable && _profTable[slug]) || null; }
  function isLegacy(slug) { return LEGACY.has(slug); }

  function classList() { return _list ? _list.slice() : []; }
  function getClassLegacy(slug) { return _index ? _index.get(slug) || null : null; }

    // 전 카탈로그 로드 후 재열거 — init 시점에 타 카테고리 미로드로 enrichDesc @link가 영문 스냅샷된 캐시를 정본 한글로 재생성
  function rebuild() { if (_ready) _build(); }
const API = { init, ready, rebuild, classList, getClassLegacy, classToLegacy, classProfTable, subclassProfTable, isLegacy, classFeatures, classFeatureRoster, subclassList, spellTable };
  root.PF2eClass = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
