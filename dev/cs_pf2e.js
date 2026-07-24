/* cs_pf2e.js — FVTT-Native 재기반 ACCESS 코어 (P1)
 * BASE(영문 FVTT 구조) ⊕ OVERLAY(한글 텍스트) 조인 + predicate/roll-option 평가기.
 * 브라우저(fetch) / Node(fs) 양쪽 동작. 상위 레이어(RE 엔진/빌더 어댑터)가 이 모듈만 통해 데이터 접근.
 * 설계: dev/FVTT_NATIVE_REBASE.md
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  // 데이터 디렉토리: 기본 'data/...'(운영 시트 기준). 다른 폴더(예: builder/)에서 로드 시
  // window.PF2eDataConfig = {dataRoot:'../data'} 로 override (하위호환 — 미설정 시 기존 동작).
  const _cfg = (!isNode && root.PF2eDataConfig) || {};
  const _dataRoot = _cfg.dataRoot || 'data';
  const STORE_DIR = _cfg.storeDir || (_dataRoot + '/store'); // 단일 소스(materialized: 기계데이터 + 한글 baked)
  const BASE_DIR = _cfg.baseDir || (_dataRoot + '/base');    // (레거시, store 전환으로 미사용)
  const OVL_DIR = _cfg.ovlDir || (_dataRoot + '/overlay');   // (레거시, store 전환으로 미사용)
  const OVR_DIR = _cfg.ovrDir || (_dataRoot + '/override'); // L3 OVERRIDE(관리툴 편집본, 최종 적용)

  // 비크리처 카테고리(단일 파일). 크리처는 별도(팩 분할 + _index).
  const CATEGORIES = ['equipment', 'spells', 'feats', 'actions', 'backgrounds',
    'deities', 'heritages', 'ancestries', 'conditions', 'classes', 'effects'];

  // ── 정본(보유 룰북) 필터 ── data/derived/allowed_content.json.
  //   FVTT store에는 보유 안 한 서적(AP·Lost Omens·G&G 등) 콘텐츠가 섞여 있음 → 보유 6권 소속만 유지.
  //   store 원본 불변(되돌림 가능): 로드 시점에 제외. publication.title이 허용목록이면 유지, 아니면 제외.
  //   단 FVTT가 룰북 수록 항목을 타 서적으로 오태깅(신격=Divine Mysteries)하면 rescue 로스터(이름)로 구제.
  //   자동화층(effects)·공용 글로서리는 필터 대상 아님(콘텐츠 카탈로그만). content catalog만 여기 나열.
  const FILTER_CATS = new Set(['equipment', 'spells', 'feats', 'actions', 'backgrounds', 'deities', 'heritages', 'ancestries', 'conditions', 'classes']);
  let _allowed = null;
  function _prepAllowed(j) {
    j = j || {};
    const books = new Set(j.allowed_books || []);
    const rescue = {};
    for (const cat in (j.rescue || {})) rescue[cat] = new Set(j.rescue[cat] || []);
    return { books, rescue, enabled: books.size > 0 };
  }
  function _ensureAllowedSync() { if (_allowed) return _allowed; _allowed = _prepAllowed(isNode ? _readJSON(`${_dataRoot}/derived/allowed_content.json`) : null); return _allowed; }
  async function loadAllowed() { if (_allowed) return _allowed; _allowed = _prepAllowed(await _fetchJSON(`${_dataRoot}/derived/allowed_content.json?v=0.248`)); return _allowed; }
  function _pubOf(d) {
    const s = d.system || {}; const p = s.publication || {};
    let t = p.title;
    if (!t) { const src = s.source; t = (src && typeof src === 'object') ? src.value : src; }
    return t || '';
  }
  function _isAllowedDoc(cat, d) {
    const a = _allowed; if (!a || !a.enabled) return true;         // 미로드/비활성 = 전부 허용(안전 폴백)
    if (a.books.has(_pubOf(d))) return true;
    const r = a.rescue[cat];
    if (r) { const nm = d.name_en || d.name; if (nm && r.has(nm)) return true; }   // 룰북 수록·오태깅 구제
    return false;
  }
  function _filterAllowed(cat, docs) {
    if (!FILTER_CATS.has(cat)) return docs;
    const a = _allowed; if (!a || !a.enabled) return docs;
    return docs.filter(d => _isAllowedDoc(cat, d));
  }

  // ---- 로더 (지연, 카테고리 단위 캐시) ----
  const _baseCache = {};   // cat → array
  const _ovlCache = {};    // cat → {slug→{name,description,traits}}
  const _ovrCache = {};    // cat → {slug→{name_ko,desc_ko,...}} (L3 OVERRIDE)
  const _index = {};       // cat → Map(slug→doc) (조인 결과)
  let _localize = null;    // @Localize 사전: {PF2E.key → 한글}

  function _ensureLocalizeSync() { if (_localize) return _localize; if (isNode) _localize = _readJSON(`${_dataRoot}/derived/localize.ko.json`) || {}; return _localize; }
  async function loadLocalize() { if (_localize) return _localize; if (isNode) return _ensureLocalizeSync(); _localize = (await _fetchJSON(`${_dataRoot}/derived/localize.ko.json`)) || {}; return _localize; }

  // ---- 공용 글로서리 (data/store/_glossary.json): traits/damageType/weaponGroup/armorGroup 등 slug→한글 ----
  //   과거 어댑터(equip/feat/spell/action/anc)마다 개별 fetch(5회 중복) + 동일한 _traitKo를 각자 정의했음.
  //   → PF 단일 로더+캐시로 통합(fetch 1회). traitKo도 단일 소스. 각 어댑터는 이 API로 위임.
  let _glossary = null;
  function _ensureGlossarySync() { if (_glossary) return _glossary; if (isNode) _glossary = _readJSON(`${STORE_DIR}/_glossary.json`) || { traits: {} }; return _glossary || { traits: {} }; }
  async function loadGlossary() { if (_glossary) return _glossary; if (isNode) return _ensureGlossarySync(); _glossary = (await _fetchJSON(`${STORE_DIR}/_glossary.json`)) || { traits: {} }; return _glossary; }
  function glossary() { return _glossary || (isNode ? _ensureGlossarySync() : { traits: {} }); }  // 동기 접근자(항상 객체 반환)
  function traitKo(slug) { const g = glossary(); return (g.traits && g.traits[slug]) || slug; }

  function _readJSON(relPath) {
    if (isNode) {
      const fs = require('fs'), path = require('path');
      // dev/ 기준 상대경로 해소 (cwd가 dev 또는 repo 루트 양쪽 대응)
      const cands = [relPath, path.join('dev', relPath), path.join(__dirname, relPath)];
      for (const p of cands) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} }
      return null;
    }
    // 브라우저: 동기 로드 회피 → loadCategory가 async fetch 사용
    throw new Error('_readJSON sync는 Node 전용');
  }

  async function _fetchJSON(relPath) {
    const res = await fetch(relPath);
    if (!res.ok) return null;
    return res.json();
  }

  // 카테고리 로드(조인 포함). Node=동기 가능, 브라우저=async.
  function loadCategorySync(cat) {
    if (_index[cat]) return _index[cat];
    _ensureAllowedSync();
    // 단일 소스: data/store/{cat}.json (materialized — name_ko/_desc_ko 및 기계데이터 baked).
    const store = _filterAllowed(cat, _readJSON(`${STORE_DIR}/${cat}.json`) || []);   // 보유 룰북 밖 콘텐츠 제외(정본 필터)
    _baseCache[cat] = store; _ovlCache[cat] = {}; _ovrCache[cat] = {};
    return _buildIndex(cat, store, {});
  }
  const _loadPromises = {}; // 브라우저 in-flight dedup — 동시 호출(어댑터 init + 전체 게이트)이 같은 대용량 파일을 중복 fetch하지 않게
  async function loadCategory(cat) {
    if (_index[cat]) return _index[cat];
    if (isNode) return loadCategorySync(cat);
    if (_loadPromises[cat]) return _loadPromises[cat];
    _loadPromises[cat] = _loadCategoryFetch(cat).catch(e => { delete _loadPromises[cat]; throw e; });
    return _loadPromises[cat];
  }
  async function _loadCategoryFetch(cat) {
    await loadAllowed();   // 정본 필터 목록(보유 룰북) 준비 후 로드
    const store = _filterAllowed(cat, (await _fetchJSON(`${STORE_DIR}/${cat}.json`)) || []);
    let merged = {};
    // L4 클라우드 override: DataManager에서 라이브 저장한 편집(Firestore) — store 위에 slug 단위로 덮음.
    // 공개 read라 로그인 불필요. 실패/미제공/느림이면 store만으로 조용히 진행(비침입).
    if (typeof window !== 'undefined' && typeof window.PF2eOverrideFetcher === 'function') {
      try { const cloud = await window.PF2eOverrideFetcher(cat); if (cloud && typeof cloud === 'object') merged = cloud; } catch (e) {}
    }
    _baseCache[cat] = store; _ovlCache[cat] = {}; _ovrCache[cat] = merged;
    return _buildIndex(cat, store, merged);
  }
  // 파일 override(a) 위에 클라우드 override(b)를 슬러그 단위 병합(b 우선). 원본 불변.
  function _mergeOvr(a, b) {
    const out = Object.assign({}, a || {});
    for (const slug in b) { out[slug] = Object.assign({}, (a && a[slug]) || {}, b[slug]); }
    return out;
  }

  function _slugOf(d) { return (d.system && d.system.slug) || d._id; }

  function _buildIndex(cat, storeDocs, ovr) {
    ovr = ovr || {};
    const m = new Map();
    for (const d of storeDocs) {
      const slug = _slugOf(d);
      // store 문서는 materialize 시 name_ko/name_en/_desc_ko/_desc_en가 이미 baked됨(base⊕overlay⊕file-override 해소).
      if (d.name_en == null) d.name_en = d.name;
      if (d.name_ko == null) d.name_ko = d.name;
      // L4 클라우드 override(DataManager 라이브 편집)만 store 위에 적용. base/overlay/file-override는 store에 흡수됨.
      _applyOverride(d, ovr[slug]);
      m.set(slug, d);
      m.set(d._id, d);
    }
    _index[cat] = m;
    return m;
  }

  // OVERRIDE 부분필드 적용. name_ko/desc_ko는 조인 필드에 매핑, 그 외는 관리툴이 쓴 필드명 그대로 부착(구조 편집 대비).
  function _applyOverride(joined, ov) {
    if (!ov || typeof ov !== 'object') return;
    for (const f in ov) {
      const v = ov[f];
      if (v == null || v === '') continue;      // 빈값=미설정(BASE/OVERLAY 유지)
      if (f === 'name_ko') joined.name_ko = v;
      else if (f === 'desc_ko') {               // 설명 오버라이드 → 조인 desc 필드
        if (joined._desc_en == null) joined._desc_en = joined.system && joined.system.description && joined.system.description.value;
        joined._desc_ko = v;
      } else joined[f] = v;                      // 기타 필드(향후 구조 override)
    }
  }

  // 단건 조회: key=slug|_id|영문명. cat 미지정 시 전 카테고리 탐색은 비권장(명시 권장).
  function get(cat, key) {
    const m = isNode ? loadCategorySync(cat) : _index[cat];
    if (!m) return null;
    if (m.has(key)) return m.get(key);
    // 영문명 폴백
    for (const v of m.values()) if (v.name_en === key || v.name === key) return v;
    return null;
  }
  function all(cat) {
    if (isNode) loadCategorySync(cat);
    return _baseCache[cat] || [];
  }

  // 표시용 한글명/설명 헬퍼
  function nameKo(doc) { return doc && (doc.name_ko || doc.name); }
  function descKo(doc) { return doc && (doc._desc_ko || (doc.system && doc.system.description && doc.system.description.value)); }

  // FVTT 인라인 @참조(@UUID/@Damage/@Check/@Template/@Localize…) → 한글 가독 렌더.
  // 시트의 모든 FVTT desc 표시 공통 진입점(장비/재주/주문). 미인식 @X[..]는 라벨만 남김.
  const _DMG_KO = { piercing: '관통', slashing: '참격', bludgeoning: '타격', fire: '화염', cold: '냉기', acid: '산성', electricity: '전기', sonic: '음파', mental: '정신', poison: '독', void: '공허', spirit: '영혼', vitality: '활력', force: '역장', bleed: '출혈', untyped: '', precision: '정밀', healing: '회복' };
  const _SAVE_KO = { fortitude: '인내', reflex: '반사', will: '의지' };
  const _SKILL_KO = { acrobatics: '곡예', arcana: '주문학', athletics: '운동', crafting: '제작', deception: '기만', diplomacy: '외교', intimidation: '위협', medicine: '의학', nature: '자연학', occultism: '오컬티즘', performance: '공연', religion: '종교학', society: '사회', stealth: '은신', survival: '생존', thievery: '도둑질' };
  const _CHECK_KO = Object.assign({ perception: '지각', flat: '플랫', spell: '주문' }, _SAVE_KO, _SKILL_KO);
  function _checkTypeKo(t) { if (_CHECK_KO[t]) return _CHECK_KO[t]; const m = /^(.*)-lore$/.exec(t); if (m) return m[1].replace(/-/g, ' ') + ' 지식'; return t; }
  // @Check 렌더용: 내성='X 내성', 그 외(단순/지각/기술/지식)='X 판정'. 자연스러운 한글 표기.
  const _SAVE_TYPES = new Set(['fortitude', 'reflex', 'will']);
  function _checkPhrase(t) { const ko = _checkTypeKo(t); if (!t || t === 'spell') return ko; return ko + (_SAVE_TYPES.has(t) ? ' 내성' : ' 판정'); }
  function _escDesc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function enrichDesc(html) {
    if (!html) return '';
    let s = String(html);
    // @Localize[PF2E.key] → 사전 한글로 치환(먼저 처리 → 치환된 내용의 @UUID/@Check 등도 이어서 렌더)
    const _loc = _localize || (isNode ? _ensureLocalizeSync() : null);
    s = s.replace(/@Localize\[([^\]]+)\]/g, (m, key) => { const t = _loc && _loc[key]; return t != null ? String(t) : ''; });
    // FVTT 전용 '효과 부여'·저널 링크 문단 제거: <p>@UUID[…-effects…]{효과: X}</p>, <p>@UUID[…journals…]{…}</p>
    // — FVTT에선 클릭/드래그 기능, 패스포지엔 없어 죽은 텍스트 → 문단째(선행 <hr> 포함) 삭제. 문장 중간 참조는 하단 @UUID 해소로 유지.
    s = s.replace(/(<hr\s*\/?>\s*)?<p>(?:\s*@UUID\[Compendium\.pf2e\.(?:[a-z-]*-effects\.Item|journals\.JournalEntry)[^\]]*\](?:\{[^}]*\})?\s*[,;·]?)+\s*<\/p>\s*/g, '');
    // 문단전용 @Embed 제거(FVTT는 전체 카드 임베드, 패스포지엔 이름만 남는 죽은 줄)
    s = s.replace(/(<hr\s*\/?>\s*)?<p>\s*@Embed\[[^\]]+\](?:\{[^}]*\})?\s*<\/p>\s*/g, '');
    // 인라인 행동 매크로 [[/act slug …]]{라벨} → 행동 카탈로그 한글명(FVTT 클릭 굴림 기능 없음 → 텍스트 렌더)
    s = s.replace(/\[\[\/act\s+([a-z0-9-]+)([^\]]*)\]\](?:\{([^}]*)\})?/g, (m, slug, opts, label) => {
      let name = label || '';
      if (!name) { try { const a = get('actions', slug); if (a) name = a.name_ko || a.name; } catch (e) {} }
      if (!name) name = slug.replace(/-/g, ' ');
      const dc = (opts.match(/dc[=:](\d+)/) || [])[1];
      const st = (opts.match(/statistic[=:]([a-z-]+)/) || [])[1];
      const extra = [st ? _checkTypeKo(st) : '', dc ? `DC ${dc}` : ''].filter(Boolean).join(' ');
      return `<span class="ref-link">${_escDesc(name)}${extra ? ` (${extra})` : ''}</span>`;
    });
    // 인라인 굴림 매크로 [[/r 2d6[fire]]]{라벨} / [[/gmr …]] / [[/br …]] → 라벨, 없으면 주사위식+피해유형 한글
    s = s.replace(/\[\[\/[a-z]+\s+((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => {
      if (label) return `<span class="ref-roll">${_escDesc(label)}</span>`;
      let f = body.replace(/#[^\s\]]*/g, '').replace(/\{([^}]*)\}/g, '$1');
      f = f.replace(/\[([a-z, -]+)\]/g, (mm, tys) => ' ' + tys.split(',').map(t => _DMG_KO[t.trim()] !== undefined ? _DMG_KO[t.trim()] : t.trim()).filter(Boolean).join(' '));
      return `<span class="ref-roll">${_escDesc(f.replace(/\s+/g, ' ').trim())}</span>`;
    });
    // 잔여 [[…]]{라벨} 폴백
    s = s.replace(/\[\[((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => `<span class="ref-roll">${_escDesc(label || body.replace(/^\s*\/[a-z]+\s*/i, '').replace(/#.*$/, '').trim())}</span>`);
    s = s.replace(/@Damage\[((?:[^\[\]]|\[[^\]]*\])*)\](\{[^}]*\})?/g, (m, body) => {
      const parts = body.split(/,(?![^\[]*\])/).map(p => {
        const mm = p.match(/\(?\s*([0-9dD()+\-* ]+?)\s*\)?\s*\[([^\]]+)\]/);
        if (!mm) return p.replace(/[\[\]]/g, ' ').trim();
        const types = mm[2].split(',').map(t => t.trim()); const persistent = types.includes('persistent');
        const dts = types.filter(t => t !== 'persistent').map(t => _DMG_KO[t] !== undefined ? _DMG_KO[t] : t).filter(Boolean);
        return `${mm[1].trim()} ${persistent ? '지속 ' : ''}${dts.join(' ')}`.replace(/\s+/g, ' ').trim();
      });
      return `<span class="ref-dmg">${parts.join(' + ')}</span>`;
    });
    s = s.replace(/@Check\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const tm = body.match(/(?:^|[|[])type:([a-z0-9-]+)/) || body.match(/\b(perception|flat|fortitude|reflex|will|athletics|acrobatics|arcana|crafting|deception|diplomacy|intimidation|medicine|nature|occultism|performance|religion|society|stealth|survival|thievery)\b/); const type = tm ? tm[1] : ''; const dc = (body.match(/dc:(\d+)/) || [])[1]; const basic = /basic/.test(body) ? '기본 ' : ''; return `<span class="ref-check">${dc ? `DC ${dc} ` : ''}${basic}${_checkPhrase(type)}</span>`; });
    // @link[cat.slug]{label}: 프로젝트 네이티브 엔티티 링크 → 항상 정본 name_ko로 렌더(라벨은 참조마다 제각각이라 불일치 원인).
    // 라벨의 뒤 숫자(조건 값 등, 예 "기절 2")만 정본명에 보존. 미해소 엔티티일 때만 라벨/슬러그 폴백.
    s = s.replace(/@link\[([a-z]+)\.([a-z0-9._-]+)\](?:\{([^}]*)\})?/g, (m, cat, slug, label) => {
      let name = ''; try { const t = get(cat, slug); if (t) name = t.name_ko || t.name; } catch (e) {}
      if (name) {
        const numM = label && label.match(/([0-9]+)\s*$/);
        if (numM && !/[0-9]\s*$/.test(name)) name += ' ' + numM[1];
      } else name = label || slug.replace(/-/g, ' ');
      return `<span class="ref-link" data-ref="${cat}.${slug}">${_escDesc(name)}</span>`;
    });
    // @UUID: 참조 엔티티 정본 한글명으로 해소(로드된 카테고리 한정, 미해소 시 라벨 폴백)
    s = s.replace(/@UUID\[([^\]]+)\](?:\{([^}]*)\})?/g, (m, uuid, label) => { let name = ''; try { const t = getByUuid((uuid || '').trim().split(/\s+/)[0]); if (t) name = t.name_ko || t.name; } catch (e) {} const shown = name || label; return shown ? `<span class="ref-link">${_escDesc(shown)}</span>` : ''; });
    // @Embed: 인라인 임베드 → 참조 엔티티 정본명(전체 임베드 대신 명칭 링크)
    s = s.replace(/@Embed\[([^\]]+)\](?:\{([^}]*)\})?/g, (m, body, label) => { let name = ''; try { const t = getByUuid((body || '').trim().split(/\s+/)[0]); if (t) name = t.name_ko || t.name; } catch (e) {} const shown = label || name; return shown ? `<span class="ref-link">${_escDesc(shown)}</span>` : ''; });
    s = s.replace(/@Template\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const d = (body.match(/distance:(\d+)/) || [])[1]; const SH = { emanation: '발산', burst: '폭발', cone: '원뿔', line: '직선' }; const ty = (body.match(/type:(\w+)/) || [])[1]; return `<span class="ref-area">${d || ''}피트 ${SH[ty] || ty || ''}</span>`; });
    s = s.replace(/@[A-Za-z]+\[[^\]]*\](?:\{([^}]*)\})?/g, (m, l) => l || '');
    return s;
  }

  // 비-엔티티 매크로(@Check/@Damage/@Template/[[…]] 굴림)를 "지금 시트에 보이는 한글 평문"으로 굽는다(span 없이).
  // 데이터 정리용(bake) — enrichDesc의 해당 변환과 동일 결과의 평문. @UUID/@Embed(엔티티 참조)는 건드리지 않음(→ @link 단계에서 처리).
  function bakePlainMacros(html) {
    if (!html) return html;
    let s = String(html);
    // [[/act slug …]]{label} → 행동 한글명 (+ 판정 DC)
    s = s.replace(/\[\[\/act\s+([a-z0-9-]+)([^\]]*)\]\](?:\{([^}]*)\})?/g, (m, slug, opts, label) => {
      let name = label || '';
      if (!name) { try { const a = get('actions', slug); if (a) name = a.name_ko || a.name; } catch (e) {} }
      if (!name) name = slug.replace(/-/g, ' ');
      const dc = (opts.match(/dc[=:](\d+)/) || [])[1];
      const st = (opts.match(/statistic[=:]([a-z-]+)/) || [])[1];
      const extra = [st ? _checkTypeKo(st) : '', dc ? `DC ${dc}` : ''].filter(Boolean).join(' ');
      return `${name}${extra ? ` (${extra})` : ''}`;
    });
    // [[/r|gmr|br|roll …]]{label} → label 또는 주사위식+피해유형 한글
    s = s.replace(/\[\[\/[a-z]+\s+((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => {
      if (label) return label;
      let f = body.replace(/#[^\s\]]*/g, '').replace(/\{([^}]*)\}/g, '$1');
      f = f.replace(/\[([a-z, -]+)\]/g, (mm, tys) => ' ' + tys.split(',').map(t => _DMG_KO[t.trim()] !== undefined ? _DMG_KO[t.trim()] : t.trim()).filter(Boolean).join(' '));
      return f.replace(/\s+/g, ' ').trim();
    });
    // 잔여 [[…]]{label}
    s = s.replace(/\[\[((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => label || body.replace(/^\s*\/[a-z]+\s*/i, '').replace(/#.*$/, '').trim());
    // @Damage → 라벨 있으면 라벨(수식형은 라벨이 정본 표기), 없으면 주사위식 + 한글 피해유형
    s = s.replace(/@Damage\[((?:[^\[\]]|\[[^\]]*\])*)\](?:\{([^}]*)\})?/g, (m, body, label) => {
      if (label) return label;
      const _dtKo = t => { t = t.trim(); if (t === 'persistent' || /^@/.test(t)) return ''; return _DMG_KO[t] !== undefined ? _DMG_KO[t] : t; };
      // 수식(@actor/ceil/ternary…)이 섞이면 주사위 정적표기 불가 → comma-split 없이 모든 [유형]의 한글만(주사위 생략)
      if (/@|ceil|floor|ternary|round|\bmax\(|\bmin\(|abs\(/.test(body)) {
        const types = []; body.replace(/\[([^\]]+)\]/g, (mm, t) => { t.split(',').forEach(x => { const k = _dtKo(x); if (k) types.push(k); }); return mm; });
        return [...new Set(types)].join(' ');
      }
      const parts = body.split(/,(?![^\[]*\])/).map(p => {
        const typeM = p.match(/\[([^\]]+)\]\s*$/) || p.match(/\[([^\]]+)\]/);
        if (!typeM) return p.replace(/[\[\]]/g, ' ').trim();
        const types = typeM[1].split(',').map(t => t.trim()); const persistent = types.includes('persistent');
        const dts = types.map(_dtKo).filter(Boolean);
        const dm = p.match(/\(?\s*([0-9dD()+\-* ]+?)\s*\)?\s*\[/);
        const dice = dm ? dm[1].trim() : '';
        return `${dice} ${persistent ? '지속 ' : ''}${dts.join(' ')}`.replace(/\s+/g, ' ').trim();
      });
      return parts.filter(Boolean).join(' + ');
    });
    // @Check → 라벨 있으면 라벨, 없으면 (DC) (기본) 한글 판정명
    s = s.replace(/@Check\[([^\]]+)\](?:\{([^}]*)\})?/g, (m, body, label) => { if (label) return label; const tm = body.match(/(?:^|[|[])type:([a-z0-9-]+)/) || body.match(/\b(perception|flat|fortitude|reflex|will|athletics|acrobatics|arcana|crafting|deception|diplomacy|intimidation|medicine|nature|occultism|performance|religion|society|stealth|survival|thievery)\b/); const type = tm ? tm[1] : ''; const dc = (body.match(/dc:(\d+)/) || [])[1]; const basic = /basic/.test(body) ? '기본 ' : ''; return `${dc ? `DC ${dc} ` : ''}${basic}${_checkPhrase(type)}`.trim(); });
    // @Template → N피트 형태
    s = s.replace(/@Template\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const d = (body.match(/distance:(\d+)/) || [])[1]; const SH = { emanation: '발산', burst: '폭발', cone: '원뿔', line: '직선' }; const ty = (body.match(/type:(\w+)/) || [])[1]; return `${d || ''}피트 ${SH[ty] || ty || ''}`.trim(); });
    return s;
  }

  // @UUID/@Embed(엔티티 참조) → @link[cat.slug] 변환. 콘텐츠 카테고리만(effects/journals/외부 몬스터 등 제외 → @UUID 유지).
  const _LINK_CATS = new Set(['feats', 'spells', 'equipment', 'actions', 'conditions', 'heritages', 'ancestries', 'backgrounds', 'deities', 'classes']);
  function _uuidToCatSlug(uuid) {
    const u = (uuid || '').trim().split(/\s+/)[0];
    const parts = u.split('.'); const id = parts[parts.length - 1]; const pack = parts[2];
    let cat = PACK2CAT[pack], t = null;
    if (cat) { const m = isNode ? loadCategorySync(cat) : _index[cat]; if (m && m.has(id)) t = m.get(id); else cat = null; }
    if (!t) { for (const c of CATEGORIES) { const m = isNode ? loadCategorySync(c) : _index[c]; if (m && m.has(id)) { t = m.get(id); cat = c; break; } } }
    if (!t || !cat || !_LINK_CATS.has(cat)) return null;
    const slug = (t.system && t.system.slug) || '';
    return slug ? { cat, slug } : null;
  }
  function bakeEntityLinks(html) {
    if (!html) return html;
    let s = String(html);
    const conv = (m, uuid, label) => { const cs = _uuidToCatSlug(uuid); if (!cs) return m; return `@link[${cs.cat}.${cs.slug}]${label != null ? `{${label}}` : ''}`; };
    s = s.replace(/@UUID\[([^\]]+)\](?:\{([^}]*)\})?/g, conv);
    s = s.replace(/@Embed\[([^\]]+)\](?:\{([^}]*)\})?/g, conv);
    return s;
  }

  /* ====== Predicate 엔진 (pf2e 포맷) ======
   * predicate: 배열. 원소 = 문자열(옵션 존재) | {not} | {and} | {or} | {nor} | {nand}
   *           | {lt|gt|lte|gte|eq:[a,b]} | {xor} | {iff}
   * options: Set<string> 또는 배열.
   */
  function _opt(options) { return options instanceof Set ? options : new Set(options || []); }

  function testPredicate(predicate, options) {
    if (!predicate || (Array.isArray(predicate) && predicate.length === 0)) return true;
    const opts = _opt(options);
    const arr = Array.isArray(predicate) ? predicate : [predicate];
    return arr.every(s => _testStatement(s, opts));
  }

  function _testStatement(st, opts) {
    if (typeof st === 'string') return opts.has(st);
    if (!st || typeof st !== 'object') return false;
    if ('not' in st) return !_testStatement(st.not, opts);
    if ('and' in st) return st.and.every(s => _testStatement(s, opts));
    if ('or' in st) return st.or.some(s => _testStatement(s, opts));
    if ('nor' in st) return !st.nor.some(s => _testStatement(s, opts));
    if ('nand' in st) return !st.nand.every(s => _testStatement(s, opts));
    if ('xor' in st) return st.xor.filter(s => _testStatement(s, opts)).length === 1;
    if ('iff' in st) { const r = st.iff.map(s => _testStatement(s, opts)); return r.every(Boolean) || r.every(x => !x); }
    // 수치 비교: {gte:["a","b"]} — a,b는 옵션 prefix:value 또는 숫자
    for (const op of ['gt', 'gte', 'lt', 'lte', 'eq']) {
      if (op in st) { const [a, b] = st[op]; return _cmp(op, _numFromOpt(a, opts), _numFromOpt(b, opts)); }
    }
    return false;
  }
  function _numFromOpt(x, opts) {
    if (typeof x === 'number') return x;
    if (typeof x === 'string') {
      const n = Number(x); if (!Number.isNaN(n)) return n;
      // 옵션 중 "x:<num>" 형태 탐색
      const pre = x + ':';
      for (const o of opts) if (o.startsWith(pre)) { const v = Number(o.slice(pre.length)); if (!Number.isNaN(v)) return v; }
    }
    return 0;
  }
  function _cmp(op, a, b) {
    switch (op) { case 'gt': return a > b; case 'gte': return a >= b; case 'lt': return a < b; case 'lte': return a <= b; case 'eq': return a === b; }
    return false;
  }

  // ---- UUID 조회 (GrantItem용): "Compendium.pf2e.<pack>.Item.<id>" ----
  // pack → category 매핑(주요). 모르면 전 카테고리 _id 탐색.
  const PACK2CAT = {
    'feats-srd': 'feats', classfeatures: 'feats', ancestryfeatures: 'feats', 'campaign-feats': 'feats',
    'equipment-srd': 'equipment', 'spells-srd': 'spells', spells: 'spells',
    'spell-effects': 'effects', 'feat-effects': 'effects', 'equipment-effects': 'effects',
    'other-effects': 'effects', 'bestiary-effects': 'effects', 'campaign-effects': 'effects', conditionitems: 'conditions',
    actionspf2e: 'actions', heritages: 'heritages', ancestries: 'ancestries', backgrounds: 'backgrounds',
    deities: 'deities', classes: 'classes',
  };
  function getByUuid(uuid) {
    if (!uuid || typeof uuid !== 'string') return null;
    const parts = uuid.split('.');
    const id = parts[parts.length - 1];
    const pack = parts[2];
    const cat = PACK2CAT[pack];
    if (cat) { const m = isNode ? loadCategorySync(cat) : _index[cat]; if (m && m.has(id)) return m.get(id); }
    for (const c of CATEGORIES) { const m = isNode ? loadCategorySync(c) : _index[c]; if (m && m.has(id)) return m.get(id); }
    return null;
  }

  // ---- 브래킷 해소: "{item|path}" / "{actor|path}" ----
  // ctx = { item: doc, rulesSelections: {flag:value}, actor }
  function resolveBrackets(val, ctx) {
    if (typeof val !== 'string') return val;
    if (val.indexOf('{') === -1) return val;
    return val.replace(/\{(item|actor)\|([^}]+)\}/g, (m, who, path) => {
      try {
        if (who === 'item') {
          if (path.startsWith('flags.system.rulesSelections.')) {
            const flag = path.slice('flags.system.rulesSelections.'.length);
            return (ctx.rulesSelections && ctx.rulesSelections[flag] != null) ? ctx.rulesSelections[flag] : m;
          }
          if (path === 'id') return (ctx.item && ctx.item._id) || m;
          if (path === 'name') return (ctx.item && (ctx.item.name_ko || ctx.item.name)) || m;
          return _dig(ctx.item, path) ?? m;
        }
        if (who === 'actor') return _dig(ctx.actor, path) ?? m;
      } catch (e) {}
      return m;
    });
  }
  function _dig(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }

  // ---- FVTT 수식 평가: "max(1,floor(@actor.level/2))" / "@actor.level" / "floor(@actor.abilities.str.mod/2)" ----
  // ctx.actor = { level, abilities:{str..cha = mod 숫자} }. 미지원 형태(삼항 등)는 NaN(graceful).
  function evalFormula(val, ctx) {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return NaN;
    let s = resolveBrackets(val.trim(), ctx || {});
    if (s === '') return NaN;
    const actor = (ctx && ctx.actor) || {};
    s = s.replace(/@actor\.level\b/g, String(actor.level || 0));
    s = s.replace(/@actor\.abilities\.(\w+)\.mod\b/g, (m, ab) => String((actor.abilities && actor.abilities[ab]) || 0));
    s = s.replace(/@[\w.]+/g, '0'); // 미지원 @참조 → 0 (graceful)
    // 식별자 화이트리스트: 허용 함수만 남기고 제거 후 잔여 글자 있으면 거부
    const residue = s.replace(/\b(max|min|floor|ceil|abs|round|sign)\b/g, '').replace(/[0-9+\-*/%(),.\s]/g, '');
    if (residue.length) return NaN; // 알 수 없는 식별자/연산 → 거부
    try {
      const fn = new Function('max', 'min', 'floor', 'ceil', 'abs', 'round', 'sign', 'return (' + s + ');');
      const r = fn(Math.max, Math.min, Math.floor, Math.ceil, Math.abs, Math.round, Math.sign);
      return (typeof r === 'number' && isFinite(r)) ? r : NaN;
    } catch (e) { return NaN; }
  }

  const API = {
    CATEGORIES, loadCategory, loadCategorySync, get, all, nameKo, descKo, enrichDesc, bakePlainMacros, bakeEntityLinks, loadLocalize,
    loadGlossary, glossary, traitKo,
    testPredicate, _testStatement, getByUuid, resolveBrackets, evalFormula,
    _state: { base: _baseCache, ovl: _ovlCache, ovr: _ovrCache, index: _index },
  };
  root.PF2eData = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
