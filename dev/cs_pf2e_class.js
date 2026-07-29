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
  // 서브클래스 부여(재주/기술/주문/행동) = 성장표가 그 자체로 지닌 효과. 효과(자동화) 탭 경유 안 함(재주·아이템 전용).
  //   런타임은 이 조회기로 성장표를 직접 읽어 적용(숙련 T/E/M/L과 동일 경로). 소스=subclass_progression.json(큐레이트 병합본).
  let _subGrantTable = null;
  function _buildSubGrantTable(rows) {
    const t = {};
    for (const r of rows || []) {
      const sub = r.subclass; if (!sub) continue;
      const o = t[sub] || (t[sub] = { feats: [], skills: [], spells: [], actions: [], familiar: [] });
      for (const s of (r.grant_feats || [])) o.feats.push({ lv: r.level, slug: s });
      for (const s of (r.grant_skills || [])) o.skills.push({ lv: r.level, slug: s });
      for (const s of (r.grant_spells || [])) o.spells.push({ lv: r.level, slug: s.slug, type: s.type, ...(s.rank != null ? { rank: s.rank } : {}) });
      for (const s of (r.grant_actions || [])) o.actions.push({ lv: r.level, slug: s });
      for (const s of (r.grant_familiar || [])) o.familiar.push({ lv: r.level, slug: (s.slug || s), name: s.name, desc: s.desc });   // 후원자 고유 사역마 능력(펫 고정)
    }
    return t;
  }
  // 서브클래스가 부여하는 것(성장표 직접 소스). level 주면 그 레벨 이하만 반환(레벨 게이팅). 없으면 빈 구조.
  function subclassGrantTable(sub, level) {
    const g = (_subGrantTable && _subGrantTable[sub]) || null;
    if (!g) return { feats: [], skills: [], spells: [], actions: [], familiar: [] };
    if (level == null) return g;
    const f = x => (x.lv || 1) <= level;
    return { feats: g.feats.filter(f), skills: g.skills.filter(f), spells: g.spells.filter(f), actions: g.actions.filter(f), familiar: (g.familiar || []).filter(f) };
  }
  // 사역마 능력 개수 진행표 = data/derived/familiar_progression.json (대원칙 0: 성장 데이터가 직접 소유).
  //   familiarAbilityCount(classId, level) = 그 클래스 사역마의 레벨별 총 능력 개수(후원자 고정 포함). 없으면 보편 기본(2).
  let _famProg = null;
  function _fillFamProg(j) { _famProg = j || null; }
  function familiarAbilityCount(classId, level) {
    const base = (_famProg && _famProg.base_default) || 2;
    const arr = _famProg && _famProg.classes && _famProg.classes[classId];
    if (!arr || !arr.length) return base;
    const lv = Math.max(1, Math.min(20, level | 0 || 1));
    return arr[lv - 1] != null ? arr[lv - 1] : base;
  }
  // 사역마 능력 사전 = data/derived/familiar_abilities.json (slug → {name_ko, desc_ko}). 후원자 고유 능력 표시용.
  let _famAbil = null;
  function _fillFamAbil(rows) { _famAbil = {}; for (const r of (rows || [])) if (r.slug) _famAbil[r.slug] = r; }
  function familiarAbility(slug) { return (_famAbil && _famAbil[slug]) || null; }
  function loadFamiliarData() {
    if (_famProg && _famAbil) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/familiar_progression.json', 'dev/data/derived/familiar_progression.json']) { try { _fillFamProg(JSON.parse(fs.readFileSync(p, 'utf8'))); break; } catch (e) {} }
      for (const p of ['data/derived/familiar_abilities.json', 'dev/data/derived/familiar_abilities.json']) { try { _fillFamAbil(JSON.parse(fs.readFileSync(p, 'utf8')).rows); break; } catch (e) {} }
      return Promise.resolve();
    }
    return Promise.all([
      fetch('data/derived/familiar_progression.json?v=0.315').then(r => r.json()).then(_fillFamProg).catch(() => {}),
      fetch('data/derived/familiar_abilities.json?v=0.315').then(r => r.json()).then(j => _fillFamAbil(j.rows)).catch(() => {}),
    ]).then(() => {});
  }

  async function _ensureSubProfTable() {
    if (_subProfTable) return _subProfTable;
    let rows = null;
    if (isNode) { const fs = require("fs"); for (const p of ["data/derived/subclass_progression.json", "dev/data/derived/subclass_progression.json"]) { try { rows = JSON.parse(fs.readFileSync(p, "utf8")).rows; break; } catch (e) {} } }
    if (rows == null) { try { const r = await fetch("data/derived/subclass_progression.json?v=0.315"); rows = ((await r.json()).rows) || []; } catch (e) { rows = []; } }
    _subProfTable = _buildSubProfTable(rows || []);
    _subGrantTable = _buildSubGrantTable(rows || []);   // 같은 rows에서 부여표도 동시 구축
    return _subProfTable;
  }
  function _profRows() {
    if (isNode) { const fs = require("fs"); for (const p of ["data/derived/class_progression.json","dev/data/derived/class_progression.json"]) { try { return JSON.parse(fs.readFileSync(p,"utf8")).rows || []; } catch(e){} } return []; }
    return null;
  }
  async function _ensureProfTable() {
    if (_profTable) return _profTable;
    let rows = _profRows();
    if (rows == null) { try { const r = await fetch("data/derived/class_progression.json?v=0.315"); rows = ((await r.json()).rows) || []; } catch(e){ rows = []; } }
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
        let granted_feats = [], granted_spells = [], granted_actions = [], prof_changes = {};
        try {
          const a = RE.build({ level: 20, abilities: { str:4,dex:4,con:4,int:4,wis:4,cha:4 }, class: slug, items: [{ doc: f, choices: {} }] });
          for (const g of (a.grantedDocs || [])) {
            if (!g) continue;
            const gslug = (g.system && g.system.slug) || g._id;
            if (g.type === 'feat') granted_feats.push(gslug);  // getSubclassAutoFeats가 슬러그로 조회
            else if (g.type === 'spell') granted_spells.push({ spell_id: gslug, lv: (g.system.level && g.system.level.value) || 1, type: 'spell' });
            else if (g.type === 'action') granted_actions.push(gslug);  // 부여 행동(챔피언 원인=반응 등) — 행동 탭 표시
          }
        } catch (e) {}
        // 부여 행동(챔피언 원인=반응 등)은 RE.build grantedDocs에 안 잡힘 → GrantItem 규칙에서 직접 해소(대상 종류=action).
        if (!granted_actions.length) {
          for (const r of ((f.system && f.system.rules) || [])) {
            if (r.key !== 'GrantItem' || !r.uuid) continue;
            try {
              const g = PF.getByUuid(String(r.uuid).trim().split(/\s+/)[0]);
              if (g && g.type === 'action') granted_actions.push((g.system && g.system.slug) || g._id);
            } catch (e) {}
          }
        }
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
        // 성별화 요구(holy/unholy) = FVTT otherTags 정본(챔피언 원인 등). 없으면 빈 배열(양쪽/무관).
        const _oTags = (f.system && f.system.traits && f.system.traits.otherTags) || [];
        const sanctification = _oTags.filter(t => t === 'holy' || t === 'unholy');
        // 소서러 혈통 보강(GAP 1+2, 대원칙 0=성장/정체성 부여): BLOODLINE_DB에서 고정 혈통 기술 + 부여 레퍼토리 주문.
        //   혈통 초급 집중주문은 위 desc 추출이 이미 granted_spells에 넣음. 여기선 고정 기술·부여 레퍼토리(캔트립+레벨별)만 추가.
        //   ⚠ 드라코닉 등 variable_skill 혈통의 두 번째 기술은 표본 선택(모달)이 담당 → 여기 자동부여 안 함(bl.skills=고정분만).
        let bl_skills = [], bl_tradition = null, bl_features = [];
        const _BLDB = (typeof BLOODLINE_DB !== 'undefined') ? BLOODLINE_DB : (root.BLOODLINE_DB || null);
        const bl = _BLDB && _BLDB[f.system.slug];
        if (bl) {
          bl_skills = (bl.skills || []).slice();
          // 고정 전통 혈통은 tradition 부착 → state.selectedSubclass.tradition이 주문 탭 필터에 반영.
          //   'variable'(드라코닉)은 표본 선택이 런타임에 tradition을 설정하므로 여기선 비움.
          if (bl.tradition && bl.tradition !== 'variable') bl_tradition = bl.tradition;
          for (const g of (bl.granted || [])) {
            if (!g || !g.slug) continue;
            granted_spells.push({ spell_id: g.slug, lv: g.charLevel || 1, type: g.rank === 0 ? 'cantrip' : 'known', rank: g.rank });
          }
          // 혈통 마법 = 혈통이 주는 패시브 특성 → 클래스 특성(features)으로 표현(재주 탭 「클래스 특성」에 표시).
          //   시전 주문이 아님 → 주문 탭 아님. desc=효과+발동조건.
          const bm = bl.blood_magic;
          if (bm && (bm.text_ko || bm.text)) {
            // slug = classfeatures 레지스트리의 blood-magic-<혈통>(build_class_features 신설) → DataManager 대상.
            //   name/desc는 표시용 baked(동일 origin=bloodlines.json). 코드 매칭/dedup은 slug만.
            bl_features.push({
              lv: 1,
              slug: 'blood-magic-' + f.system.slug.replace(/^bloodline-/, ''),
              name_ko: '혈통 마법' + (bm.name_ko ? ': ' + bm.name_ko : ''),
              name_en: 'Blood Magic' + (bm.name_en ? ': ' + bm.name_en : ''),
              desc: `<p>${bm.text_ko || bm.text}</p><p>혈통 주문(집중 점수)이나 마법적 재능 주문(주문 슬롯)을 시전할 때 발동합니다.</p>`,
              kind: 'feature',
            });
          }
        }
        // 오라클 신비 보강(대원칙 0=성장/정체성 부여): MYSTERY_DB에서 미스터리 기술 + 전통(divine) + 부여 레퍼토리 주문 + 예언의 저주.
        //   신비 초급 계시주문(focus)은 위 desc 추출이 이미 granted_spells에 넣음. 여기선 미스터리 기술·전통·부여 레퍼토리·저주만 추가.
        //   ⚠ 상급/고급 계시주문은 재주(상급/고급 계시)로 습득 → 여기 자동부여 안 함(curated_effects $mystery_advanced/greater).
        let my_skills = [], my_tradition = null, my_features = [];
        const _MYDB = (typeof MYSTERY_DB !== 'undefined') ? MYSTERY_DB : (root.MYSTERY_DB || null);
        const my = _MYDB && _MYDB[f.system.slug];
        if (my) {
          if (my.mystery_skill) my_skills.push(my.mystery_skill);
          my_tradition = my.tradition || 'divine';
          for (const g of (my.granted_spells || [])) {
            if (!g || !g.spell) continue;
            granted_spells.push({ spell_id: g.spell, lv: g.char_level || 1, type: g.rank === 'cantrip' ? 'cantrip' : 'known', rank: g.rank === 'cantrip' ? 0 : g.rank });
          }
          // 예언의 저주 = 신비가 정해주는 고유 저주 → 클래스 특성(features)으로 표시(재주 탭 「클래스 특성」).
          //   slug = curse-of-*(실제 classfeature 레지스트리 항목). 클래스표의 일반 oracular-curse 슬롯을 이 특정 저주가 채움.
          if (my.curse) {
            my_features.push({ lv: 1, slug: my.curse, name_ko: my.curse_name_ko || my.curse, name_en: my.curse_name_en || my.curse, kind: 'feature' });
          }
        }
        const _row = {
          id: f.system.slug, class_id: slug, subclass_type: meta.typeKo,
          name_ko: PF.nameKo(f), name_en: f.name_en || f.name,
          desc: PF.enrichDesc(PF.descKo(f) || ''),
          granted_skills: bl_skills.concat(my_skills), granted_feats, granted_spells, granted_actions, features: bl_features.concat(my_features), prof_changes,
          sanctification,
        };
        if (bl_tradition || my_tradition) _row.tradition = bl_tradition || my_tradition;
        out.push(_row);
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
    return fetch('data/derived/cleric_doctrines.json?v=0.315').then(r => r.json()).then(j => { _injectDoctrines(j.rows); _doctrinesLoaded = true; }).catch(() => {});
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
    return fetch('data/derived/subclasses.json?v=0.315').then(r => r.json()).then(j => { inject(j.rows); _subclassesLoaded = true; }).catch(() => {});
  }

  // 소서러 혈통 정본 메타 = data/derived/bloodlines.json → 런타임 BLOODLINE_DB 채움.
  //   subclassList(소서러 혈통 부여 기술·레퍼토리 주문 보강) + cs_feat_effects($bloodline_advanced/greater) + 모달 인라인이 소비.
  let _bloodlinesLoaded = false;
  function _fillBloodlineDB(rows) {
    // 런타임=class_features_db.js의 var BLOODLINE_DB. 빌드 하니스=미선언 → root에 생성(subclassList가 root.BLOODLINE_DB 조회).
    let DB = (typeof BLOODLINE_DB !== 'undefined') ? BLOODLINE_DB : root.BLOODLINE_DB;
    if (!DB) { DB = root.BLOODLINE_DB = {}; }
    for (const r of (rows || [])) { if (r && r.slug) DB[r.slug] = r; }
  }
  function _fillBloodlineGuide(guide) {
    // 「혈통 항목 읽는 법」 공통 용어 설명(전 혈통 공통) → 전역 BLOODLINE_GUIDE.
    if (!Array.isArray(guide)) return;
    const G = (typeof BLOODLINE_GUIDE !== 'undefined') ? BLOODLINE_GUIDE : root.BLOODLINE_GUIDE;
    if (!G) { root.BLOODLINE_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadBloodlines() {
    if (_bloodlinesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/bloodlines.json', 'dev/data/derived/bloodlines.json', '/tmp/PF2e-publish/dev/data/derived/bloodlines.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillBloodlineDB(j.rows); _fillBloodlineGuide(j.guide); _bloodlinesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/bloodlines.json?v=0.315').then(r => r.json()).then(j => { _fillBloodlineDB(j.rows); _fillBloodlineGuide(j.guide); _bloodlinesLoaded = true; }).catch(() => {});
  }

  // 오라클 신비 정본 메타 = data/derived/oracle_mysteries.json → 런타임 MYSTERY_DB 채움.
  //   subclassList(신비 미스터리 기술·전통·부여 레퍼토리 주문 보강). 소서러 BLOODLINE_DB와 동일 패턴.
  let _mysteriesLoaded = false;
  function _fillMysteryDB(rows) {
    let DB = (typeof MYSTERY_DB !== 'undefined') ? MYSTERY_DB : root.MYSTERY_DB;
    if (!DB) { DB = root.MYSTERY_DB = {}; }
    for (const r of (rows || [])) { if (r && r.slug) DB[r.slug] = r; }
  }
  function _fillMysteryGuide(guide) {
    // 「신비 항목 읽는 법」 공통 용어 설명(전 신비 공통) → 전역 MYSTERY_GUIDE.
    if (!Array.isArray(guide)) return;
    const G = (typeof MYSTERY_GUIDE !== 'undefined') ? MYSTERY_GUIDE : root.MYSTERY_GUIDE;
    if (!G) { root.MYSTERY_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadMysteries() {
    if (_mysteriesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/oracle_mysteries.json', 'dev/data/derived/oracle_mysteries.json', '/tmp/PF2e-publish/dev/data/derived/oracle_mysteries.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillMysteryDB(j.rows); _fillMysteryGuide(j.guide); _mysteriesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/oracle_mysteries.json?v=0.315').then(r => r.json()).then(j => { _fillMysteryDB(j.rows); _fillMysteryGuide(j.guide); _mysteriesLoaded = true; }).catch(() => {});
  }

  // 위저드 비전 학파 정본 메타 = data/derived/wizard_schools.json → 런타임 WIZARD_SCHOOL_DB/GUIDE 채움.
  //   cs_feat_effects($school_advanced)/모달 가이드가 소비. 소서러 BLOODLINE_DB·오라클 MYSTERY_DB와 동일 패턴.
  let _wizardSchoolsLoaded = false;
  function _fillWizardSchoolDB(rows) {
    let DB = (typeof WIZARD_SCHOOL_DB !== 'undefined') ? WIZARD_SCHOOL_DB : root.WIZARD_SCHOOL_DB;
    if (!DB) { DB = root.WIZARD_SCHOOL_DB = {}; }
    for (const r of (rows || [])) { if (r && r.slug) DB[r.slug] = r; }
  }
  function _fillWizardSchoolGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof WIZARD_SCHOOL_GUIDE !== 'undefined') ? WIZARD_SCHOOL_GUIDE : root.WIZARD_SCHOOL_GUIDE;
    if (!G) { root.WIZARD_SCHOOL_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadWizardSchools() {
    if (_wizardSchoolsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/wizard_schools.json', 'dev/data/derived/wizard_schools.json', '/tmp/PF2e-publish/dev/data/derived/wizard_schools.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillWizardSchoolDB(j.rows); _fillWizardSchoolGuide(j.guide); _wizardSchoolsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/wizard_schools.json?v=0.315').then(r => r.json()).then(j => { _fillWizardSchoolDB(j.rows); _fillWizardSchoolGuide(j.guide); _wizardSchoolsLoaded = true; }).catch(() => {});
  }

  // 바드 뮤즈 가이드 = data/derived/bard_muses.json → BARD_MUSE_GUIDE 채움(모달 「뮤즈 항목 읽는 법」).
  //   뮤즈별 부여는 subclasses.json 소유 → 여기선 guide만.
  let _bardMusesLoaded = false;
  function _fillBardMuseGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof BARD_MUSE_GUIDE !== 'undefined') ? BARD_MUSE_GUIDE : root.BARD_MUSE_GUIDE;
    if (!G) { root.BARD_MUSE_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadBardMuses() {
    if (_bardMusesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/bard_muses.json', 'dev/data/derived/bard_muses.json', '/tmp/PF2e-publish/dev/data/derived/bard_muses.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillBardMuseGuide(j.guide); _bardMusesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/bard_muses.json?v=0.315').then(r => r.json()).then(j => { _fillBardMuseGuide(j.guide); _bardMusesLoaded = true; }).catch(() => {});
  }

  // 마녀 후원자 가이드 = data/derived/witch_patrons.json → WITCH_PATRON_GUIDE(모달 「후원자 항목 읽는 법」).
  let _witchPatronsLoaded = false;
  function _fillWitchPatronGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof WITCH_PATRON_GUIDE !== 'undefined') ? WITCH_PATRON_GUIDE : root.WITCH_PATRON_GUIDE;
    if (!G) { root.WITCH_PATRON_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadWitchPatrons() {
    if (_witchPatronsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/witch_patrons.json', 'dev/data/derived/witch_patrons.json', '/tmp/PF2e-publish/dev/data/derived/witch_patrons.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillWitchPatronGuide(j.guide); _witchPatronsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/witch_patrons.json?v=0.315').then(r => r.json()).then(j => { _fillWitchPatronGuide(j.guide); _witchPatronsLoaded = true; }).catch(() => {});
  }

  // 드루이드 교단 가이드 = data/derived/druid_orders.json → DRUID_ORDER_GUIDE(모달 「교단 항목 읽는 법」).
  //   교단별 부여는 subclasses.json 소유 → 여기선 guide만.
  let _druidOrdersLoaded = false;
  function _fillDruidOrderGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof DRUID_ORDER_GUIDE !== 'undefined') ? DRUID_ORDER_GUIDE : root.DRUID_ORDER_GUIDE;
    if (!G) { root.DRUID_ORDER_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadDruidOrders() {
    if (_druidOrdersLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/druid_orders.json', 'dev/data/derived/druid_orders.json', '/tmp/PF2e-publish/dev/data/derived/druid_orders.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillDruidOrderGuide(j.guide); _druidOrdersLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/druid_orders.json?v=0.315').then(r => r.json()).then(j => { _fillDruidOrderGuide(j.guide); _druidOrdersLoaded = true; }).catch(() => {});
  }

  // 레인저 사냥 방식 가이드 = data/derived/ranger_edges.json → RANGER_EDGE_GUIDE(모달 「사냥 방식 항목 읽는 법」).
  //   방식별 효과는 subclasses.json 소유 → 여기선 guide만. 레인저=주문 없음(전통/집중주문/금기 없음).
  let _rangerEdgesLoaded = false;
  function _fillRangerEdgeGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof RANGER_EDGE_GUIDE !== 'undefined') ? RANGER_EDGE_GUIDE : root.RANGER_EDGE_GUIDE;
    if (!G) { root.RANGER_EDGE_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadRangerEdges() {
    if (_rangerEdgesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/ranger_edges.json', 'dev/data/derived/ranger_edges.json', '/tmp/PF2e-publish/dev/data/derived/ranger_edges.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillRangerEdgeGuide(j.guide); _rangerEdgesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/ranger_edges.json?v=0.315').then(r => r.json()).then(j => { _fillRangerEdgeGuide(j.guide); _rangerEdgesLoaded = true; }).catch(() => {});
  }

  // 로그 수법 가이드 = data/derived/rogue_rackets.json → ROGUE_RACKET_GUIDE(모달 「수법 항목 읽는 법」).
  //   라켓별 효과는 subclasses.json 소유 → 여기선 guide만. 로그=주문 없음(비전 트릭스터=APG 미보유, 제거).
  let _rogueRacketsLoaded = false;
  function _fillRogueRacketGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof ROGUE_RACKET_GUIDE !== 'undefined') ? ROGUE_RACKET_GUIDE : root.ROGUE_RACKET_GUIDE;
    if (!G) { root.ROGUE_RACKET_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadRogueRackets() {
    if (_rogueRacketsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/rogue_rackets.json', 'dev/data/derived/rogue_rackets.json', '/tmp/PF2e-publish/dev/data/derived/rogue_rackets.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillRogueRacketGuide(j.guide); _rogueRacketsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/rogue_rackets.json?v=0.315').then(r => r.json()).then(j => { _fillRogueRacketGuide(j.guide); _rogueRacketsLoaded = true; }).catch(() => {});
  }

  // 챔피언 원인 가이드 = data/derived/champion_causes.json → CHAMPION_CAUSE_GUIDE(모달 「원인 항목 읽는 법」).
  //   원인별 신조/금기/반응은 subclasses.json 소유 → 여기선 guide만. 신격·성별화·헌신 주문=모달 인라인 컨트롤.
  let _championCausesLoaded = false;
  function _fillChampionCauseGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof CHAMPION_CAUSE_GUIDE !== 'undefined') ? CHAMPION_CAUSE_GUIDE : root.CHAMPION_CAUSE_GUIDE;
    if (!G) { root.CHAMPION_CAUSE_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadChampionCauses() {
    if (_championCausesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/champion_causes.json', 'dev/data/derived/champion_causes.json', '/tmp/PF2e-publish/dev/data/derived/champion_causes.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillChampionCauseGuide(j.guide); _championCausesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/champion_causes.json?v=0.315').then(r => r.json()).then(j => { _fillChampionCauseGuide(j.guide); _championCausesLoaded = true; }).catch(() => {});
  }

  // 바바리안 본능 가이드 = data/derived/barbarian_instincts.json → BARBARIAN_INSTINCT_GUIDE(모달 「본능 항목 읽는 법」).
  //   본능별 능력은 subclasses.json(FVTT _desc_ko) 소유 → 여기선 guide만. 바바리안=주문 없음(분노 기반).
  let _barbarianInstinctsLoaded = false;
  function _fillBarbarianInstinctGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof BARBARIAN_INSTINCT_GUIDE !== 'undefined') ? BARBARIAN_INSTINCT_GUIDE : root.BARBARIAN_INSTINCT_GUIDE;
    if (!G) { root.BARBARIAN_INSTINCT_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadBarbarianInstincts() {
    if (_barbarianInstinctsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/barbarian_instincts.json', 'dev/data/derived/barbarian_instincts.json', '/tmp/PF2e-publish/dev/data/derived/barbarian_instincts.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillBarbarianInstinctGuide(j.guide); _barbarianInstinctsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/barbarian_instincts.json?v=0.315').then(r => r.json()).then(j => { _fillBarbarianInstinctGuide(j.guide); _barbarianInstinctsLoaded = true; }).catch(() => {});
  }

  // 수사관 방법론 가이드 = data/derived/investigator_methodologies.json → INVESTIGATOR_METHODOLOGY_GUIDE(모달 「방법론 항목 읽는 법」).
  //   방법론별 상세는 subclasses.json(build_subclasses investigator 브랜치) 소유 → 여기선 guide만. 수사관=주문 없음(계략 세우기 기반).
  let _investigatorMethodologiesLoaded = false;
  function _fillInvestigatorMethodologyGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof INVESTIGATOR_METHODOLOGY_GUIDE !== 'undefined') ? INVESTIGATOR_METHODOLOGY_GUIDE : root.INVESTIGATOR_METHODOLOGY_GUIDE;
    if (!G) { root.INVESTIGATOR_METHODOLOGY_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadInvestigatorMethodologies() {
    if (_investigatorMethodologiesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/investigator_methodologies.json', 'dev/data/derived/investigator_methodologies.json', '/tmp/PF2e-publish/dev/data/derived/investigator_methodologies.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillInvestigatorMethodologyGuide(j.guide); _investigatorMethodologiesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/investigator_methodologies.json?v=0.315').then(r => r.json()).then(j => { _fillInvestigatorMethodologyGuide(j.guide); _investigatorMethodologiesLoaded = true; }).catch(() => {});
  }

  // 스워시버클러 스타일 가이드 = data/derived/swashbuckler_styles.json → SWASHBUCKLER_STYLE_GUIDE(모달 「스타일 항목 읽는 법」).
  //   스타일별 상세는 subclasses.json(build_subclasses swashbuckler 브랜치) 소유 → 여기선 guide만. 스워시버클러=주문 없음(판아슈 기반).
  let _swashbucklerStylesLoaded = false;
  function _fillSwashbucklerStyleGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof SWASHBUCKLER_STYLE_GUIDE !== 'undefined') ? SWASHBUCKLER_STYLE_GUIDE : root.SWASHBUCKLER_STYLE_GUIDE;
    if (!G) { root.SWASHBUCKLER_STYLE_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadSwashbucklerStyles() {
    if (_swashbucklerStylesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/swashbuckler_styles.json', 'dev/data/derived/swashbuckler_styles.json', '/tmp/PF2e-publish/dev/data/derived/swashbuckler_styles.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillSwashbucklerStyleGuide(j.guide); _swashbucklerStylesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/swashbuckler_styles.json?v=0.315').then(r => r.json()).then(j => { _fillSwashbucklerStyleGuide(j.guide); _swashbucklerStylesLoaded = true; }).catch(() => {});
  }

  // 연금술사 연구 분야 가이드 = data/derived/alchemist_research_fields.json → ALCHEMIST_RESEARCH_FIELD_GUIDE(모달 「연구 분야 항목 읽는 법」).
  //   분야별 상세는 subclasses.json(FVTT _desc_ko) 소유 → 여기선 guide만(바바리안 방식). 연금술사=주문 없음.
  let _alchemistResearchFieldsLoaded = false;
  function _fillAlchemistResearchFieldGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof ALCHEMIST_RESEARCH_FIELD_GUIDE !== 'undefined') ? ALCHEMIST_RESEARCH_FIELD_GUIDE : root.ALCHEMIST_RESEARCH_FIELD_GUIDE;
    if (!G) { root.ALCHEMIST_RESEARCH_FIELD_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadAlchemistResearchFields() {
    if (_alchemistResearchFieldsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/alchemist_research_fields.json', 'dev/data/derived/alchemist_research_fields.json', '/tmp/PF2e-publish/dev/data/derived/alchemist_research_fields.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillAlchemistResearchFieldGuide(j.guide); _alchemistResearchFieldsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/alchemist_research_fields.json?v=0.315').then(r => r.json()).then(j => { _fillAlchemistResearchFieldGuide(j.guide); _alchemistResearchFieldsLoaded = true; }).catch(() => {});
  }

  // 파이터 「클래스 핵심 특징」 가이드 = data/derived/fighter_features.json → FIGHTER_GUIDE(모달 「클래스 핵심 특징」 박스).
  //   ⚠ 파이터=서브클래스 없음 → 서브클래스 드롭다운 대신 이 안내만 표시(cs_modal). 여기선 guide만.
  let _fighterFeaturesLoaded = false;
  function _fillFighterGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof FIGHTER_GUIDE !== 'undefined') ? FIGHTER_GUIDE : root.FIGHTER_GUIDE;
    if (!G) { root.FIGHTER_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadFighterFeatures() {
    if (_fighterFeaturesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/fighter_features.json', 'dev/data/derived/fighter_features.json', '/tmp/PF2e-publish/dev/data/derived/fighter_features.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillFighterGuide(j.guide); _fighterFeaturesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/fighter_features.json?v=0.315').then(r => r.json()).then(j => { _fillFighterGuide(j.guide); _fighterFeaturesLoaded = true; }).catch(() => {});
  }

  // 몽크 「클래스 핵심 특징」 가이드 = data/derived/monk_features.json → MONK_GUIDE(모달 「클래스 핵심 특징」 박스).
  //   ⚠ 몽크=서브클래스 없음 → 서브클래스 드롭다운 대신 이 안내만 표시(cs_modal). 여기선 guide만.
  let _monkFeaturesLoaded = false;
  function _fillMonkGuide(guide) {
    if (!Array.isArray(guide)) return;
    const G = (typeof MONK_GUIDE !== 'undefined') ? MONK_GUIDE : root.MONK_GUIDE;
    if (!G) { root.MONK_GUIDE = guide.slice(); return; }
    G.length = 0; for (const g of guide) G.push(g);
  }
  function loadMonkFeatures() {
    if (_monkFeaturesLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/monk_features.json', 'dev/data/derived/monk_features.json', '/tmp/PF2e-publish/dev/data/derived/monk_features.json']) {
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); _fillMonkGuide(j.guide); _monkFeaturesLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/monk_features.json?v=0.315').then(r => r.json()).then(j => { _fillMonkGuide(j.guide); _monkFeaturesLoaded = true; }).catch(() => {});
  }

  async function init() {
    if (_ready) return;
    // 서브클래스 grants/특성은 feats·spells 카테고리 필요(getByUuid·tag 조회)
    if (isNode) { PF.loadCategorySync('classes'); PF.loadCategorySync('feats'); PF.loadCategorySync('spells'); }
    else await Promise.all([PF.loadCategory('classes'), PF.loadCategory('feats'), PF.loadCategory('spells')]);
    if (isNode) { _ensureProfTable(); _ensureSubProfTable(); } else { await _ensureProfTable(); await _ensureSubProfTable(); }
    if (isNode) loadBloodlines(); else await loadBloodlines();  // 소서러 혈통 메타(subclassList 보강 전 필요)
    if (isNode) loadMysteries(); else await loadMysteries();    // 오라클 신비 메타(subclassList 보강 전 필요)
    if (isNode) loadWizardSchools(); else await loadWizardSchools();  // 위저드 학파 메타($school_advanced·가이드용)
    if (isNode) loadBardMuses(); else await loadBardMuses();          // 바드 뮤즈 가이드
    if (isNode) loadWitchPatrons(); else await loadWitchPatrons();    // 마녀 후원자 가이드
    if (isNode) loadDruidOrders(); else await loadDruidOrders();      // 드루이드 교단 가이드
    if (isNode) loadRangerEdges(); else await loadRangerEdges();      // 레인저 사냥 방식 가이드
    if (isNode) loadRogueRackets(); else await loadRogueRackets();    // 로그 수법 가이드
    if (isNode) loadChampionCauses(); else await loadChampionCauses();  // 챔피언 원인 가이드
    if (isNode) loadBarbarianInstincts(); else await loadBarbarianInstincts();  // 바바리안 본능 가이드
    if (isNode) loadInvestigatorMethodologies(); else await loadInvestigatorMethodologies();  // 수사관 방법론 가이드
    if (isNode) loadSwashbucklerStyles(); else await loadSwashbucklerStyles();  // 스워시버클러 스타일 가이드
    if (isNode) loadAlchemistResearchFields(); else await loadAlchemistResearchFields();  // 연금술사 연구 분야 가이드
    if (isNode) loadFighterFeatures(); else await loadFighterFeatures();  // 파이터 핵심 특징 가이드(서브클래스 없음)
    if (isNode) loadMonkFeatures(); else await loadMonkFeatures();  // 몽크 핵심 특징 가이드(서브클래스 없음)
    if (isNode) loadFamiliarData(); else await loadFamiliarData();    // 사역마 능력 개수표 + 능력 사전(펫 시스템)
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

  // 클래스 「택1 클래스 스킬」 = system.rules의 스킬 ChoiceSet(파이터 곡예/운동 등) → 옵션 배열 그룹.
  //   trainedSkills.value(고정)와 별개 — Pathbuilder의 「Class Skill」 게이지에 해당(빌더 택1 피커).
  function _skillChoiceGroups(rules) {
    const out = [];
    for (const r of (rules || [])) {
      if (r && r.key === 'ChoiceSet' && Array.isArray(r.choices)) {
        const isSkill = r.choices.every(c => c && typeof c.label === 'string' && /^PF2E\.Skill\./.test(c.label)) || /skill/i.test(r.prompt || '');
        if (isSkill) {
          const options = r.choices.map(c => c && c.value).filter(v => typeof v === 'string' && v);
          if (options.length) out.push(options);
        }
      }
    }
    return out;
  }
  function classToLegacy(doc) {
    const s = doc.system || {};
    const slug = s.slug;
    // 핵심 능력치 = store 네이티브 부스트 컬럼 단일소스(build_boosts.mjs 베이크). 옵션1개=고정, 2개=택1.
    const key = (doc.boost_choice && doc.boost_choice.length) ? doc.boost_choice : (doc.boost_fixed || []);
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
      choice_skill_groups: _skillChoiceGroups(s.rules),   // 택1 클래스 스킬(파이터 곡예/운동 등)
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
const API = { init, ready, rebuild, classList, getClassLegacy, classToLegacy, classProfTable, subclassProfTable, subclassGrantTable, isLegacy, classFeatures, classFeatureRoster, subclassList, spellTable, loadBloodlines, loadMysteries, loadWizardSchools, loadBardMuses, loadWitchPatrons, loadDruidOrders, loadRangerEdges, loadRogueRackets, loadChampionCauses, loadBarbarianInstincts, familiarAbilityCount, familiarAbility };
  root.PF2eClass = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
