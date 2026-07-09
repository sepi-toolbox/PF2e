#!/usr/bin/env node
/* build_effects.mjs — FVTT 단일 소스 자동화 효과 생성기 (2026-07-06 재구축).
 *   legacy/EFFECT_GROUPS/feat_db 이원 파이프라인 폐지 — 오직 FVTT system.rules[]에서 효과행 추출.
 *   FVTT가 못 담는 갭(choice/note/수동 grant rows: additional-lore·composition-spells 등)은
 *   data/curated_effects.json 큐레이션으로 병합(DataManager 편집 가능한 단일 큐레이션 파일).
 *   source/origin/legacy·fvtt 구분 없음. 런타임 미사용 메타(re_key)는 표시 컬럼 rule로 통합.
 * 산출:
 *   - effects_db.js / data/derived/effects_db.json  slug→{rows,choice?,auto_note?,damage_note?}  (런타임)
 *   - data/derived/effects.json  {rows,note}  (DataManager 표시 전량)
 *   - data/derived/effect_refs.json  엔티티→슬러그 FK 마커
 * 실행: cd dev && node tools/derive/build_effects.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const PF = await import(path.join(DEV, 'cs_pf2e.js')).then(m => m.default || m);

// DEITY_DB(class_features_db.js) — 신격 구조필드 효과행용. feat_db/EFFECT_GROUPS 의존 없음.
const ctx = { console, document: { getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, classList: { add() {}, remove() {} } }), addEventListener() {} }, window: {}, navigator: {}, location: {} };
ctx.window = ctx; vm.createContext(ctx);
function load(f, expose) { let s = fs.readFileSync(path.join(DEV, f), 'utf8'); if (expose) s += '\n;' + expose; vm.runInContext(s, ctx); }
load('class_features_db.js', 'globalThis.DEITY_DB=(typeof DEITY_DB!=="undefined"?DEITY_DB:[]);');
const { DEITY_DB } = ctx;
PF.loadCategorySync('feats'); PF.loadCategorySync('heritages'); PF.loadCategorySync('backgrounds'); PF.loadCategorySync('deities'); PF.loadCategorySync('conditions');

// FVTT-갭 큐레이션: {slug:{rows?,choice?,auto_note?,damage_note?}}. FVTT rules[]가 못 담는 choice/note/수동 grant.
const CURATED = JSON.parse(fs.readFileSync(path.join(DEV, 'data/curated_effects.json'), 'utf8'));

const rows = [];
const refs = { feats: {}, heritages: {}, backgrounds: {}, conditions: {}, deities: {} };
const stat = { fvtt: 0, curated: 0 };
const dbBySlug = {};
const ownerMeta = {}; // slug → {owner_kind,owner_name,owner_level,category} (큐레이션 표시행용)

// ── FVTT rule → 효과행 매핑 ──
const SKILLS = new Set(['acrobatics', 'arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 'medicine', 'nature', 'occultism', 'performance', 'religion', 'society', 'stealth', 'survival', 'thievery']);
const SAVES = new Set(['fortitude', 'reflex', 'will', 'saving-throw']);
const SPEEDS = new Set(['speed', 'land-speed', 'all-speeds']);
function selList(s) { return Array.isArray(s) ? s : (s == null ? [] : [s]); }
function predSummary(p) { if (!p) return ''; try { return JSON.stringify(p).slice(0, 120); } catch (e) { return ''; } }

// ── parseCondition: FVTT predicate → 정적/상황 분류 + 구조화 조건 컬럼(그룹·효과타입·대상·값·값종류·조건·조건밸류의 마지막 2컬럼) ──
//  정적(static)=캐릭터 상태로 확정평가 가능(레벨/클래스/재주/특징/유산/특성/갑옷) → 런타임 조건엔진이 평가.
//  상황(sit)=롤타임(무기·주문·대상·행동·활성효과 등) → 정적 시트 미적용(표시·감사만).  bracket({}) 포함=동적참조=상황.
const STATIC_LEAF = [/^class:/, /^feat:/, /^feature:/, /^self:heritage/, /^self:trait:/, /^self:ancestry/, /^self:class/, /^armor:(?!id:)/, /^self:armored$/, /^self:size:/, /^self:(low-light-vision|darkvision|see-invisibility)/, /^self:level$/];
function _leafKind(s) {
  if (typeof s !== 'string') return 'num';
  if (/[{}]/.test(s)) return 'sit';            // 동적 브래킷 참조 → 상황
  if (/^-?\d+$/.test(s)) return 'num';
  for (const re of STATIC_LEAF) if (re.test(s)) return 'static';
  return 'sit';                                 // 미인식 leaf(item:/spellcasting:/target:/action:/self:effect|condition/ + bare 태그)=상황(보수적)
}
function _classifyNode(node) {
  if (node == null) return 'static';
  if (Array.isArray(node)) { let k = 'static'; for (const x of node) if (_classifyNode(x) === 'sit') k = 'sit'; return k; }
  if (typeof node === 'object') {
    for (const op of Object.keys(node)) {
      const operand = node[op];
      if (['gte', 'gt', 'lte', 'lt', 'eq'].includes(op)) { const arr = Array.isArray(operand) ? operand : [operand]; for (const a of arr) if (typeof a === 'string' && _leafKind(a) === 'sit') return 'sit'; return 'static'; }
      if (['and', 'or', 'not', 'nand', 'nor', 'if', 'xor'].includes(op)) { if (_classifyNode(operand) === 'sit') return 'sit'; }
      else return 'sit';                          // 미인식 연산자 = 보수적 상황
    }
    return 'static';
  }
  return _leafKind(node) === 'sit' ? 'sit' : 'static';
}
// 표시용 한글 라벨 요약(런타임은 raw predicate `cond`만 사용 — 라벨은 lossy 허용).
const _CMP = { gte: '≥', gt: '>', lte: '≤', lt: '<', eq: '=' };
function _leafLabel(s) {
  let m;
  if ((m = /^class:(.+)$/.exec(s))) return { c: '클래스', v: m[1] };
  if ((m = /^feat:(.+)$/.exec(s))) return { c: '재주 보유', v: m[1] };
  if ((m = /^feature:(.+)$/.exec(s))) return { c: '특징 보유', v: m[1] };
  if ((m = /^self:heritage:(.+)$/.exec(s)) || (m = /^self:heritage$/.exec(s))) return { c: '유산', v: m[1] || '' };
  if ((m = /^self:trait:(.+)$/.exec(s))) return { c: '특성', v: m[1] };
  if (/^armor:|^self:armored$/.test(s)) return { c: '갑옷', v: s.replace(/^armor:/, '') };
  if ((m = /^self:size:(.+)$/.exec(s))) return { c: '크기', v: m[1] };
  if (/^self:(low-light-vision|darkvision|see-invisibility)/.test(s)) return { c: '감각', v: s.replace(/^self:/, '') };
  return { c: '', v: s };
}
function _summarize(node) { // → {parts:[{c,v}], joiner}
  if (node == null) return { parts: [], joiner: ' 그리고 ' };
  if (Array.isArray(node)) { const parts = []; for (const x of node) parts.push(..._summarize(x).parts); return { parts, joiner: ' 그리고 ' }; }
  if (typeof node === 'object') {
    for (const op of Object.keys(node)) {
      const operand = node[op];
      if (_CMP[op]) { const arr = Array.isArray(operand) ? operand : [operand]; const lhs = arr[0], rhs = arr[1]; if (lhs === 'self:level') return { parts: [{ c: '레벨', v: _CMP[op] + rhs }], joiner: ' 그리고 ' }; return { parts: [{ c: String(lhs), v: _CMP[op] + rhs }], joiner: ' 그리고 ' }; }
      if (op === 'not') { const s = _summarize(operand); return { parts: s.parts.map(p => ({ c: p.c, v: '아님:' + p.v })), joiner: ' 그리고 ' }; }
      if (op === 'or' || op === 'nor') { const s = _summarize(operand); s.joiner = ' 또는 '; return s; }
      if (['and', 'nand', 'if', 'xor'].includes(op)) return _summarize(operand);
    }
    return { parts: [], joiner: ' 그리고 ' };
  }
  return { parts: [_leafLabel(String(node))], joiner: ' 그리고 ' };
}
function parseCondition(pred) {
  if (!pred || (Array.isArray(pred) && !pred.length)) return { kind: 'none', condition: '', cond_value: '' };
  const kind = _classifyNode(pred);
  const sm = _summarize(pred);
  if (!sm.parts.length) return { kind, condition: kind === 'sit' ? '상황' : '조건', cond_value: predSummary(pred) };
  if (sm.parts.length === 1) { const p = sm.parts[0]; return { kind, condition: kind === 'sit' ? ('상황:' + (p.c ? p.c : p.v)) : (p.c || '조건'), cond_value: p.v, cond: kind === 'static' ? pred : undefined }; }
  const cond = sm.parts.map(p => (p.c ? p.c + '=' : '') + p.v).join(sm.joiner);
  return { kind, condition: kind === 'sit' ? '상황(복합)' : '복합', cond_value: cond, cond: kind === 'static' ? pred : undefined };
}
function flatType(sel) {
  if (SAVES.has(sel)) return 'save_bonus';
  if (SKILLS.has(sel)) return 'skill_bonus';
  if (sel === 'ac') return 'ac_bonus';
  if (sel === 'hp') return 'hp_bonus';
  if (sel === 'perception') return 'perception_bonus';
  if (sel === 'initiative') return 'initiative_bonus';
  if (SPEEDS.has(sel) || /speed/.test(sel)) return 'speed_bonus';
  if (/^(strike|attack|melee|ranged)/.test(sel) || sel === 'attack-roll') return 'attack_bonus';
  return 'modifier';
}
function aelType(p) {
  const m = /^system\.skills\.([a-z-]+)\.rank$/.exec(p || '');
  if (m) return { type: 'skill_trained', target: m[1] };
  if (/lore/i.test(p || '')) return { type: 'grant_lore', target: p };
  if (/(martial|proficienc|attacks\.|defenses\.)/i.test(p || '')) return { type: 'proficiency', target: p };
  if (/attributes\.(hp|dying|doomed|wounded)/i.test(p || '')) return { type: 'attribute_change', target: p };
  if (/spellcasting|spells\./i.test(p || '')) return { type: 'spell_change', target: p };
  return { type: 'ael', target: p };
}
function grantRow(uuid) {
  let name = '', slug = '', kind = 'item';
  try { const g = PF.getByUuid((uuid || '').trim().split(/\s+/)[0]); if (g) { name = g.name_ko || g.name; slug = (g.system && g.system.slug) || ''; const t = g.type; const tr = (g.system && g.system.traits && g.system.traits.value) || []; kind = t === 'feat' ? 'grant_feat' : t === 'spell' ? (tr.includes('focus') ? 'grant_focus_spell' : 'grant_innate_spell') : 'grant_item'; } } catch (e) {}
  // target = slug(정본 식별자, 이름 편집에 불변). name은 표시/폴백용 보조.
  return { type: kind, target: slug || name || uuid, name: name || undefined };
}
function fvttRuleRows(doc) {
  const out = [];
  const rules = (doc.system && doc.system.rules) || [];
  for (const r of rules) {
    const cond = predSummary(r.predicate);
    const val = (v) => (v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : v));
    const _before = out.length;
    switch (r.key) {
      case 'FlatModifier': for (const s of selList(r.selector)) out.push({ re_key: r.key, type: flatType(s), target: s, value: val(r.value), bonus_type: r.type || 'untyped', condition: cond }); break;
      case 'ActiveEffectLike': { const a = aelType(r.path); out.push({ re_key: r.key, type: a.type, target: a.target, value: val(r.value), bonus_type: r.mode || '', condition: cond }); break; }
      case 'Sense': { const sl = r.selector || ''; out.push({ re_key: r.key, type: /vision|darkvision|low-light/.test(sl) ? 'vision_upgrade' : 'extra_sense', target: sl, condition: cond }); break; }
      case 'BaseSpeed': out.push({ re_key: r.key, type: 'speed_extra', target: r.selector || '', value: val(r.value), condition: cond }); break;
      case 'Resistance': out.push({ re_key: r.key, type: 'resistance', target: val(r.type), value: val(r.value), condition: cond }); break;
      case 'Weakness': out.push({ re_key: r.key, type: 'weakness', target: val(r.type), value: val(r.value), condition: cond }); break;
      case 'Immunity': out.push({ re_key: r.key, type: 'immunity', target: val(r.type), condition: cond }); break;
      case 'GrantItem': out.push({ re_key: r.key, ...grantRow(r.uuid), condition: cond }); break;
      case 'DamageDice': out.push({ re_key: r.key, type: 'damage_dice', target: r.selector || '', value: [r.diceNumber, r.dieSize].filter(Boolean).join(''), condition: cond }); break;
      case 'Note': out.push({ re_key: r.key, type: 'note', target: r.selector || '', note: val(r.text), condition: cond }); break;
      case 'RollOption': out.push({ re_key: r.key, type: 'roll_option', target: val(r.option), condition: cond }); break;
      case 'ChoiceSet': out.push({ re_key: r.key, type: 'choice', target: r.flag || 'choice', value: Array.isArray(r.choices) ? r.choices.length + '개' : '', condition: cond }); break;
      case 'AdjustModifier': out.push({ re_key: r.key, type: 'adjust_modifier', target: r.selector || '', value: val(r.value), condition: cond }); break;
      default: out.push({ re_key: r.key, type: (r.key || 'rule').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(), target: r.selector || r.path || '', value: val(r.value), condition: cond }); break;
    }
    for (let i = _before; i < out.length; i++) out[i]._pred = r.predicate || null;  // raw predicate → parseCondition(표시·런타임)
  }
  return out;
}
// 런타임 적용 가능한 효과 type(applyFeatEffects switch가 처리하는 것). 그 외 fvtt 룰은 표시 테이블엔 남기되 런타임 소스엔 안 넣음.
const APPLY_TYPES = new Set(['hp_bonus', 'skill_trained', 'skill_bonus', 'save_bonus', 'ac_bonus', 'vision_upgrade',
  'extra_sense', 'resistance', 'grant_feat', 'grant_lore', 'grant_innate_spell', 'grant_focus_spell', 'speed_extra', 'proficiency', 'bulk_bonus', 'initiative_bonus']);
function emitFvtt(base, doc, bake = true) {
  if (!doc) return;
  const rr = fvttRuleRows(doc);
  if (!rr.length) return;
  const b = { owner_kind: base.owner_kind, owner_slug: base.owner_slug, owner_name: base.owner_name, owner_level: base.owner_level, category: base.category, src: 'rule' };
  for (const r of rr) {
    const { re_key, _pred, condition, ...rest } = r;
    const pc = parseCondition(_pred);   // 구조화 조건 컬럼(조건·조건밸류). deity/background/curated는 자체 condition 텍스트 유지(이 경로 밖).
    rows.push({ ...b, rule: re_key || '', ...rest, condition: pc.kind === 'none' ? '' : pc.condition, cond_value: pc.cond_value || '' });
    stat.fvtt++;
  }
  // 런타임 소스: 적용가능 type + (무조건 OR 정적조건) + 브래킷 미포함. 상황조건·bake=false(신격)=표시·FK만.
  //  Phase 2: 무조건(kind==='none')만 편입 = 종전과 동일(런타임 무변경). 정적조건 편입은 Phase 3(조건엔진 동반).
  if (!bake) return;
  const runRows = rr.filter(r => APPLY_TYPES.has(r.type) && !r.condition
    && !/[{}]/.test(String(r.target == null ? '' : r.target)) && !/[{}]/.test(String(r.value == null ? '' : r.value)))
    .map(r => { const o = { type: r.type }; if (r.target !== '' && r.target != null) o.target = r.target; if (r.value !== '' && r.value != null) o.value = r.value; if (r.bonus_type) o.bonus_type = r.bonus_type; return o; });
  if (runRows.length) dbBySlug[base.owner_slug] = { rows: runRows };
}

// ── 신격 효과행 파생(deities.base엔 rules[] 없음 → 구조화 필드에서 도출) ──
const legDeity = {}; for (const d of DEITY_DB) if (d) legDeity[d.id] = d;
function arrf(v) { return Array.isArray(v) ? v : (v == null || v === '' ? [] : [v]); }
function deityRows(doc, leg) {
  const s = doc.system || {}; const out = [];
  for (const a of arrf(s.attribute)) out.push({ type: 'attribute_boost', target: a });
  for (const sk of (arrf(s.skill).length ? arrf(s.skill) : arrf(leg && leg.skill))) out.push({ type: 'skill_trained', target: sk, condition: '클레릭 숙련' });
  for (const w of (arrf(s.weapons).length ? arrf(s.weapons) : arrf(leg && leg.weapon))) out.push({ type: 'favored_weapon', target: w });
  const font = arrf(s.font); if (font.length) out.push({ type: 'divine_font', target: font.join(', ') });
  const sanc = s.sanctification ? (Array.isArray(s.sanctification.what) ? s.sanctification.what : arrf(s.sanctification.what)) : arrf(leg && leg.sanctification);
  if (sanc.length) out.push({ type: 'sanctification', target: sanc.join(', '), bonus_type: (s.sanctification && s.sanctification.modal) || '' });
  const dom = s.domains || {}; const prim = arrf(dom.primary).length ? arrf(dom.primary) : arrf(leg && leg.domains);
  for (const d of prim) out.push({ type: 'domain', target: d, bonus_type: 'primary' });
  for (const d of arrf(dom.alternate)) out.push({ type: 'domain', target: d, bonus_type: 'alternate' });
  if (s.spells && typeof s.spells === 'object') for (const rk of Object.keys(s.spells)) {
    let nm = s.spells[rk], sl = ''; try { const g = PF.getByUuid(String(nm).trim()); if (g) { sl = (g.system && g.system.slug) || ''; nm = g.name_ko || g.name; } } catch (e) {}
    out.push({ type: 'grant_spell', target: sl || nm, value: rk, condition: '신격 주문' });
  }
  return out;
}
function emitDeity(base, doc, leg) {
  const rr = deityRows(doc, leg); if (!rr.length) return;
  refs.deities[base.owner_slug] = base.owner_slug;
  const b = { owner_kind: base.owner_kind, owner_slug: base.owner_slug, owner_name: base.owner_name, owner_level: base.owner_level, category: base.category, src: 'field', rule: '' };
  for (const r of rr) { rows.push({ ...b, ...r }); stat.fvtt++; }
}

// ── 배경 구조필드 → 효과행(재주와 동일 효과 테이블 경로로 통일) ──
// FVTT 배경은 능력치부스트·훈련기술·지식을 system.boosts/system.trainedSkills 구조필드에 담음(rules[] 아님).
// getBackgroundEffects(getEffectRows 경로)가 파싱하는 type으로 방출 → 배경도 EFFECTS_DB 단일 소스.
function emitBackground(base, doc) {
  const s = doc.system || {};
  const out = [];
  let bg = 0;
  for (const k of Object.keys(s.boosts || {})) {
    const v = ((s.boosts[k] || {}).value) || [];
    if (v.length >= 6) out.push({ type: 'free_boost_slots', value: 1 });
    else if (v.length === 1) out.push({ type: 'ability_boost', target: v[0] });
    else if (v.length > 1) { bg++; for (const a of v) out.push({ type: 'ability_boost_choice', target: a, group_no: bg }); }
  }
  const ts = s.trainedSkills || {};
  for (const sk of (ts.value || [])) out.push({ type: 'skill_trained', target: sk });
  // 지식(lore): FVTT는 "A or B Lore"/"A, B, or C Lore"(택1)를 배열/문자열로 담음.
  //  - "or" 있으면 택1 선택 → 단일 grant_lore $choice(choice_lore 경로 재사용, gossip과 동일 로직).
  //  - 없으면 각 항목을 고정 grant_lore로. (설명문의 "and"는 전부 부여, 슬롯 초과는 런타임이 처리.)
  const loreArr = (ts.lore || []).map(x => String(x));
  if (/\bor\s/i.test(loreArr.join(', '))) {
    out.push({ type: 'grant_lore', target: '$choice' });
  } else {
    for (const lo of loreArr) out.push({ type: 'grant_lore', target: lo.replace(/\s*Lore$/i, '').trim() });
  }
  // 부여 재주: 배경은 skill feat을 system.items(UUID)로 담음(rules[] 아님) → slug로 grant_feat 방출.
  // (런타임 getBackgroundEffects/rebuildCoreEffects·배경 모달이 feat_id를 이미 소비. 하드코딩 없이 구조데이터 단일 소스.)
  for (const k of Object.keys(s.items || {})) {
    const uuid = ((s.items[k] || {}).uuid || '').trim().split(/\s+/)[0];
    if (!uuid) continue;
    try { const g = PF.getByUuid(uuid); if (g && g.type === 'feat') { const sl = (g.system && g.system.slug) || ''; if (sl) out.push({ type: 'grant_feat', target: sl }); } } catch (e) {}
  }
  if (!out.length) return;
  const cur = dbBySlug[base.owner_slug];
  dbBySlug[base.owner_slug] = { rows: (cur && cur.rows || []).concat(out) };
  refs.backgrounds[base.owner_slug] = base.owner_slug;
  const b = { owner_kind: base.owner_kind, owner_slug: base.owner_slug, owner_name: base.owner_name, owner_level: base.owner_level, category: base.category, src: 'field', rule: '' };
  for (const r of out) rows.push({ ...b, ...r });
}

// ── 소스 순회: FVTT 문서 풀 전량 ──
function ownerBase(kind, doc, slug, name, level, category) { ownerMeta[slug] = { owner_kind: kind, owner_name: name, owner_level: level, category }; return { owner_kind: kind, owner_slug: slug, owner_name: name, owner_level: level, category }; }

for (const doc of PF.all('feats')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  emitFvtt(ownerBase('feat', doc, slug, PF.nameKo(doc) || slug, (s.level && s.level.value) != null ? s.level.value : '', s.category || ''), doc);
  if (Object.keys(refs.feats).length === 0) {} // (FK 마커는 큐레이션/조건/신격에서만; feat rules는 slug 자체가 키)
}
for (const doc of PF.all('heritages')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  emitFvtt(ownerBase('heritage', doc, slug, PF.nameKo(doc) || slug, '', (s.ancestry && (s.ancestry.slug || s.ancestry.name)) || ''), doc);
}
for (const doc of PF.all('backgrounds')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const base = ownerBase('background', doc, slug, PF.nameKo(doc) || slug, '', '');
  emitFvtt(base, doc);          // rules[](grant_item 등) 있으면
  emitBackground(base, doc);    // 구조필드(부스트/기술/지식) → 효과행
}
// 조건(CONDITIONS.auto): 표시·FK만(런타임=conditionMod).
for (const doc of PF.all('conditions')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const before = rows.length;
  emitFvtt(ownerBase('condition', doc, slug, PF.nameKo(doc) || slug, '', s.group || ''), doc, false);
  if (rows.length > before) refs.conditions[slug] = slug;
}
// 신격(DEITY): 구조화 필드 → 효과행. 표시·FK만(런타임=selectDeity).
for (const doc of PF.all('deities')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  emitDeity(ownerBase('deity', doc, slug, PF.nameKo(doc) || slug, '', s.category || 'deity'), doc, legDeity[slug]);
}

// ── FVTT-갭 큐레이션 병합(choice/note/수동 grant rows) ──
for (const slug of Object.keys(CURATED)) {
  const c = CURATED[slug];
  const e = dbBySlug[slug] || (dbBySlug[slug] = {});
  if (c.rows && c.rows.length) e.rows = (e.rows || []).concat(c.rows);
  if (c.choice) e.choice = c.choice;
  if (c.auto_note) e.auto_note = c.auto_note;
  if (c.damage_note) e.damage_note = c.damage_note;
  if (!e.rows) e.rows = [];
  // 표시행(effects.json) 반영
  const om = ownerMeta[slug] || { owner_kind: 'feat', owner_name: slug, owner_level: '', category: '' };
  const b = { owner_kind: om.owner_kind, owner_slug: slug, owner_name: om.owner_name, owner_level: om.owner_level, category: om.category, rule: 'curated' };
  if (c.rows) for (const r of c.rows) rows.push({ ...b, src: 'effect', ...r });
  if (c.auto_note) rows.push({ ...b, src: 'note', type: 'display_note', note: c.auto_note });
  if (c.damage_note) rows.push({ ...b, src: 'note', type: 'damage_note', note: typeof c.damage_note === 'object' ? JSON.stringify(c.damage_note) : c.damage_note });
  if (c.choice) rows.push({ ...b, src: 'choice', type: 'choice', choice: c.choice.id || '', choice_kind: c.choice.kind || '', choice_label: c.choice.label || '' });
  refs.feats[slug] = refs.feats[slug] || 'curated';
  stat.curated++;
}

const byType = {}; for (const r of rows) if (r.type) byType[r.type] = (byType[r.type] || 0) + 1;
const note = `자동화 정본 효과 테이블(FVTT 단일소스 재구축, 2026-07-06). 효과행 ${rows.length} · ${Object.keys(byType).length} type. `
  + `소스=FVTT system.rules[](feat/heritage/background) + 신격 구조필드 + curated_effects.json(FVTT 갭 큐레이션). `
  + `rule=정의 규칙(FVTT Rule Element 종류 또는 curated). owner_kind=소속. condition=조건보유효과·deity=신격효과 → 표시/FK만(런타임 미편입). raw slug 표시. 재생성=node tools/derive/build_effects.mjs.`;

fs.writeFileSync(path.join(DEV, 'data/derived/effects.json'), JSON.stringify({ rows, note, _types: byType }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'data/derived/effect_refs.json'), JSON.stringify(refs, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'data/derived/effects_db.json'), JSON.stringify(dbBySlug) + '\n');
fs.writeFileSync(path.join(DEV, 'effects_db.js'),
  '/* effects_db.js — 자동화 정본 단일 소스(slug→{rows,auto_note?,damage_note?,choice?}).\n'
  + ' * 생성물: node tools/derive/build_effects.mjs (FVTT system.rules[] + curated_effects.json). 수기 편집 금지. */\n'
  + 'const EFFECTS_DB = ' + JSON.stringify(dbBySlug) + ';\n'
  + "if (typeof window !== 'undefined') window.EFFECTS_DB = EFFECTS_DB;\n"
  + "if (typeof module !== 'undefined') module.exports = EFFECTS_DB;\n");
try { fs.unlinkSync(path.join(DEV, 'data/derived/feat_effects.json')); } catch (e) {}
console.log('wrote effects.json + effect_refs.json + effects_db.json + effects_db.js');
console.log('effects_db slugs:', Object.keys(dbBySlug).length, '| rows(display):', rows.length, '| stat:', JSON.stringify(stat), '| types:', Object.keys(byType).length);
