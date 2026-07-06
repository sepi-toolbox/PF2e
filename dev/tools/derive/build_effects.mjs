#!/usr/bin/env node
/* ⚠ 파손 상태(레거시 feat_db.js 의존 → 실행 불가) + 수리 요구사항(2026-07-06):
 *   legacy/fvtt `source`/`origin` 이원 태그 폐지 — 효과 데이터는 단일 소스여야 함(사용자 지시).
 *   현재 effects_db.js/effects.json에서 source·origin 필드는 제거됨. 생성기 수리 시 재도입 금지.
 * build_effects.mjs — 모든 소스의 자동화(기계효과)를 하나의 정본 효과 테이블로 통합.
 * origin=legacy: FEAT_DB/HERITAGE_DB/BACKGROUNDS 의 effect_group_id ⨝ EFFECT_GROUPS(+CHOICE_OPTIONS/노트).
 * origin=fvtt  : 각 엔티티 FVTT 문서의 system.rules[] 를 읽어 효과행으로 매핑(기술/지식/내성/시야/저항/부여 등
 *                레거시에 없던 대량 자동화까지 전부 데이터화). 미해소 rule = 원형 표시.
 * 각 행 = "엔티티 1개의 효과/규칙/선택지/노트 1건". raw slug/enum 보존(치환 금지).
 * 산출:
 *   - data/derived/effects.json      {rows, note}  — 통합 효과 테이블(DataManager '효과' 탭)
 *   - data/derived/effect_refs.json   {feats/heritages/backgrounds:{slug→effect_group_id}} — 엔티티 FK 역참조
 * 실행: cd dev && node tools/derive/build_effects.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const PF = await import(path.join(DEV, 'cs_pf2e.js')).then(m => m.default || m);

// ── 레거시 DB(vm 로드: EFFECT_GROUPS/CHOICE_OPTIONS/FEAT_DB/HERITAGE_DB/BACKGROUNDS) ──
const ctx = { console, document: { getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, classList: { add() {}, remove() {} } }), addEventListener() {} }, window: {}, navigator: {}, location: {} };
ctx.window = ctx; vm.createContext(ctx);
function load(f, expose) { let s = fs.readFileSync(path.join(DEV, f), 'utf8'); if (expose) s += '\n;' + expose; vm.runInContext(s, ctx); }
load('feat_db.js', 'globalThis.FEAT_DB=FEAT_DB;');
load('cs_data.js', 'globalThis.EFFECT_GROUPS=(typeof EFFECT_GROUPS!=="undefined"?EFFECT_GROUPS:[]);globalThis.CHOICE_OPTIONS=(typeof CHOICE_OPTIONS!=="undefined"?CHOICE_OPTIONS:[]);globalThis.HERITAGE_DB=(typeof HERITAGE_DB!=="undefined"?HERITAGE_DB:[]);globalThis.BACKGROUNDS=(typeof BACKGROUNDS!=="undefined"?BACKGROUNDS:[]);globalThis.CONDITIONS_DATA=(typeof CONDITIONS_DATA!=="undefined"?CONDITIONS_DATA:[]);');
load('class_features_db.js', 'globalThis.DEITY_DB=(typeof DEITY_DB!=="undefined"?DEITY_DB:[]);');
const { FEAT_DB, EFFECT_GROUPS, CHOICE_OPTIONS, HERITAGE_DB, BACKGROUNDS, CONDITIONS_DATA, DEITY_DB } = ctx;
PF.loadCategorySync('feats'); PF.loadCategorySync('heritages'); PF.loadCategorySync('backgrounds'); PF.loadCategorySync('deities'); PF.loadCategorySync('conditions');

const egIdx = {}; for (const r of EFFECT_GROUPS) (egIdx[r.group_id] = egIdx[r.group_id] || []).push(r);
const coIdx = {}; for (const o of CHOICE_OPTIONS) (coIdx[o.choice_id] = coIdx[o.choice_id] || []).push(o);
const legFeat = {}; for (const f of FEAT_DB) if (f) legFeat[f.id] = f;
const legHer = {}; for (const h of HERITAGE_DB) if (h) legHer[h.id] = h;
const legBg = {}; for (const b of BACKGROUNDS) if (b) legBg[b.id] = b;

function egFields(r) { const o = {}; for (const k of Object.keys(r)) { if (k === 'group_id') continue; const v = r[k]; o[k] = Array.isArray(v) ? v.join(', ') : v; } return o; }

const rows = [];
const refs = { feats: {}, heritages: {}, backgrounds: {}, conditions: {}, deities: {} };
const stat = { legacy: 0, fvtt: 0 };
// 런타임 단일 소스: slug → { source, rows:[raw effect rows], auto_note?, damage_note?, choice? } (legacy 우선)
const dbBySlug = {};

// ── 레거시 효과행 ──
function emitLegacy(base, f) {
  const eg = f.effect_group_id, ch = f.choice_id;
  if (!(eg || ch || f.auto_note || f.damage_note)) return false;
  if (eg) refs[base._refKey][base.owner_slug] = eg;
  // 런타임 단일 소스(legacy 우선): raw 효과행 + choice 원형 보존 (_getFeatEffectsDef가 그대로 조립 → 파리티 보장)
  const def = { source: 'legacy', rows: (egIdx[eg] || []).map(r => { const o = {}; for (const k in r) if (k !== 'group_id') o[k] = r[k]; return o; }) };
  if (f.auto_note) def.auto_note = f.auto_note;
  if (f.damage_note) def.damage_note = f.damage_note;
  if (ch) {
    def.choice = { id: ch, kind: f.choice_kind || '', label: f.choice_label || '', filter: f.choice_filter || null,
      options: (coIdx[ch] || []).map(o => ({ option_id: o.option_id, option_name: o.option_name, is_default: !!o.is_default,
        rows: (egIdx[o.effect_group_id] || []).map(r => { const x = {}; for (const k in r) if (k !== 'group_id') x[k] = r[k]; return x; }) })) };
  }
  dbBySlug[base.owner_slug] = def;
  const b = { ...base, effect_group_id: eg || '', origin: 'legacy', re_key: '' }; delete b._refKey;
  for (const r of (egIdx[eg] || [])) { rows.push({ ...b, src: 'effect', choice: '', option: '', ...egFields(r) }); stat.legacy++; }
  if (f.auto_note) { rows.push({ ...b, src: 'note', type: 'display_note', note: f.auto_note }); stat.legacy++; }
  if (f.damage_note) { rows.push({ ...b, src: 'note', type: 'damage_note', note: typeof f.damage_note === 'object' ? JSON.stringify(f.damage_note) : f.damage_note }); stat.legacy++; }
  if (ch) {
    const opts = coIdx[ch] || [];
    if (!opts.length) { rows.push({ ...b, src: 'choice', choice: ch, type: 'choice', choice_kind: f.choice_kind || '', choice_label: f.choice_label || '' }); stat.legacy++; }
    for (const o of opts) {
      const orow = { ...b, src: 'choice_opt', choice: ch, option: o.option_id, type: 'choice_option', choice_kind: f.choice_kind || '', option_name: o.option_name || '', is_default: o.is_default ? 1 : '' };
      const oeff = egIdx[o.effect_group_id] || [];
      if (!oeff.length) { rows.push(orow); stat.legacy++; } else for (const r of oeff) { rows.push({ ...orow, ...egFields(r) }); stat.legacy++; }
    }
  }
  return true;
}

// ── FVTT rule → 효과행 매핑 ──
const SKILLS = new Set(['acrobatics', 'arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 'medicine', 'nature', 'occultism', 'performance', 'religion', 'society', 'stealth', 'survival', 'thievery']);
const SAVES = new Set(['fortitude', 'reflex', 'will', 'saving-throw']);
const SPEEDS = new Set(['speed', 'land-speed', 'all-speeds']);
function selList(s) { return Array.isArray(s) ? s : (s == null ? [] : [s]); }
function predSummary(p) { if (!p) return ''; try { return JSON.stringify(p).slice(0, 120); } catch (e) { return ''; } }
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
  }
  return out;
}
// 런타임 적용 가능한 효과 type(applyFeatEffects switch가 처리하는 것). 그 외 fvtt 룰(strike/item_alteration/
// roll_option/adjust_modifier/note/choice/ael/modifier/attack_bonus/perception_bonus/weakness/immunity/damage_dice)은
// 표시 테이블엔 남기되 런타임 소스엔 넣지 않음(applyFeatEffects 미처리 → 무의미 + 부정확 방지).
const APPLY_TYPES = new Set(['hp_bonus', 'skill_trained', 'skill_bonus', 'save_bonus', 'ac_bonus', 'vision_upgrade',
  'extra_sense', 'resistance', 'grant_feat', 'grant_lore', 'grant_innate_spell', 'grant_focus_spell', 'speed_extra', 'proficiency', 'bulk_bonus', 'initiative_bonus']);
function emitFvtt(base, doc, bake = true) {
  if (!doc) return;
  const rr = fvttRuleRows(doc);
  if (!rr.length) return;
  const b = { ...base, effect_group_id: '', origin: 'fvtt', src: 'rule' }; delete b._refKey;
  for (const r of rr) { rows.push({ ...b, ...r }); stat.fvtt++; }
  // 런타임 단일 소스: legacy 우선(이미 있으면 스킵). 적용가능 type + 무조건(predicate 없음) + 브래킷 미포함만.
  // bake=false(조건/신격 등): 표시 테이블·FK만, 런타임 EFFECTS_DB엔 넣지 않음(적용 모델이 다름 — 조건=conditionMod, 신격=selectDeity).
  if (!bake || dbBySlug[base.owner_slug]) return;
  const runRows = rr.filter(r => APPLY_TYPES.has(r.type) && !r.condition
    && !/[{}]/.test(String(r.target == null ? '' : r.target)) && !/[{}]/.test(String(r.value == null ? '' : r.value)))
    .map(r => { const o = { type: r.type }; if (r.target !== '' && r.target != null) o.target = r.target; if (r.value !== '' && r.value != null) o.value = r.value; if (r.bonus_type) o.bonus_type = r.bonus_type; return o; });
  if (runRows.length) dbBySlug[base.owner_slug] = { source: 'fvtt', rows: runRows };
}

// ── 신격 효과행 파생(deities.base엔 rules[] 없음 → 구조화 필드에서 효과행 도출) ──
const legDeity = {}; for (const d of DEITY_DB) if (d) legDeity[d.id] = d;
function arrf(v) { return Array.isArray(v) ? v : (v == null || v === '' ? [] : [v]); }
function deityRows(doc, leg) {
  const s = doc.system || {}; const out = [];
  for (const a of arrf(s.attribute)) out.push({ type: 'attribute_boost', target: a }); // 신봉 능력치
  for (const sk of (arrf(s.skill).length ? arrf(s.skill) : arrf(leg && leg.skill))) out.push({ type: 'skill_trained', target: sk, condition: '클레릭 숙련' }); // 신성 기술
  for (const w of (arrf(s.weapons).length ? arrf(s.weapons) : arrf(leg && leg.weapon))) out.push({ type: 'favored_weapon', target: w }); // 선호 무기
  const font = arrf(s.font); if (font.length) out.push({ type: 'divine_font', target: font.join(', ') }); // 신성 원천
  const sanc = s.sanctification ? (Array.isArray(s.sanctification.what) ? s.sanctification.what : arrf(s.sanctification.what)) : arrf(leg && leg.sanctification);
  if (sanc.length) out.push({ type: 'sanctification', target: sanc.join(', '), bonus_type: (s.sanctification && s.sanctification.modal) || '' }); // 성별화
  const dom = s.domains || {}; const prim = arrf(dom.primary).length ? arrf(dom.primary) : arrf(leg && leg.domains);
  for (const d of prim) out.push({ type: 'domain', target: d, bonus_type: 'primary' });
  for (const d of arrf(dom.alternate)) out.push({ type: 'domain', target: d, bonus_type: 'alternate' });
  if (s.spells && typeof s.spells === 'object') for (const rk of Object.keys(s.spells)) { // 신격 부여 클레릭 주문
    let nm = s.spells[rk]; try { const g = PF.getByUuid(String(nm).trim()); if (g) nm = g.name_ko || g.name; } catch (e) {}
    out.push({ type: 'grant_spell', target: nm, value: rk, condition: '신격 주문' });
  }
  return out;
}
function emitDeity(base, doc, leg) {
  const rr = deityRows(doc, leg); if (!rr.length) return;
  refs.deities[base.owner_slug] = base.owner_slug; // FK 마커(양방향 가시화)
  const b = { ...base, effect_group_id: '', origin: 'fvtt', src: 'field' }; delete b._refKey;
  for (const r of rr) { rows.push({ ...b, ...r }); stat.fvtt++; }
}

// ── 소스 순회: FVTT 문서 풀 기준(전량) + 레거시 조인 ──
function ownerBase(kind, refKey, doc, slug, name, level, category) { return { owner_kind: kind, _refKey: refKey, owner_slug: slug, owner_name: name, owner_level: level, category }; }

for (const doc of PF.all('feats')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const name = PF.nameKo(doc) || slug;
  const base = ownerBase('feat', 'feats', doc, slug, name, (s.level && s.level.value) != null ? s.level.value : '', s.category || '');
  const leg = legFeat[slug]; if (leg) emitLegacy({ ...base, owner_name: leg.name_ko || name }, leg);
  emitFvtt(base, doc);
}
for (const doc of PF.all('heritages')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const name = PF.nameKo(doc) || slug;
  const base = ownerBase('heritage', 'heritages', doc, slug, name, '', (s.ancestry && (s.ancestry.slug || s.ancestry.name)) || '');
  const leg = legHer[slug]; if (leg) emitLegacy({ ...base, owner_name: leg.name_ko || name }, leg);
  emitFvtt(base, doc);
}
for (const doc of PF.all('backgrounds')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const name = PF.nameKo(doc) || slug;
  const base = ownerBase('background', 'backgrounds', doc, slug, name, '', '');
  const leg = legBg[slug]; if (leg) emitLegacy({ ...base, owner_name: leg.name || name }, leg);
  emitFvtt(base, doc);
}
// 조건(CONDITIONS.auto): FVTT 조건 문서의 rules[](FlatModifier 등)=조건 보유 시 자동 기계효과. 표시·FK만(런타임=conditionMod).
for (const doc of PF.all('conditions')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const name = PF.nameKo(doc) || slug;
  const base = ownerBase('condition', 'conditions', doc, slug, name, '', s.group || '');
  const before = rows.length;
  emitFvtt(base, doc, false);
  if (rows.length > before) refs.conditions[slug] = slug; // 효과행 생겼을 때만 FK 마커
}
// 신격(DEITY): 구조화 필드 → 효과행(신성기술/선호무기/신성원천/성별화/영역/부여주문). 표시·FK만(런타임=selectDeity).
for (const doc of PF.all('deities')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const name = PF.nameKo(doc) || slug;
  const base = ownerBase('deity', 'deities', doc, slug, name, '', s.category || 'deity');
  emitDeity(base, doc, legDeity[slug]);
}
// 레거시 전용(FVTT 문서 없는 slug, 예: *-witch 서브클래스 변형)도 누락 없이
for (const [tbl, refKey, kind] of [[legFeat, 'feats', 'feat'], [legHer, 'heritages', 'heritage'], [legBg, 'backgrounds', 'background']]) {
  const pfCat = refKey; const seen = new Set(PF.all(pfCat).map(d => d.system && d.system.slug));
  for (const slug of Object.keys(tbl)) {
    if (seen.has(slug)) continue;
    const f = tbl[slug];
    emitLegacy(ownerBase(kind, refKey, null, slug, f.name_ko || f.name || slug, f.feat_level != null ? f.feat_level : '', f.category || ''), f);
  }
}

const byType = {}; for (const r of rows) if (r.type) byType[r.type] = (byType[r.type] || 0) + 1;
const byOrigin = {}; for (const r of rows) byOrigin[r.origin] = (byOrigin[r.origin] || 0) + 1;
const note = `자동화 정본 효과 테이블(통합·전량). 효과행 ${rows.length} (legacy ${byOrigin.legacy || 0}·fvtt ${byOrigin.fvtt || 0}) · ${Object.keys(byType).length} type. `
  + `origin=legacy(EFFECT_GROUPS 큐레이션)/fvtt(system.rules[]·신격 구조필드). owner_kind=소속(feat/heritage/background/condition/deity), effect_group_id=레거시 FK, re_key=FVTT 룰키. `
  + `condition=조건 보유 시 자동효과(CONDITIONS.auto, 런타임=conditionMod)·deity=신격 신봉효과(런타임=selectDeity) — 둘 다 표시/감사·FK만(런타임 EFFECTS_DB 미편입, 적용모델 상이). `
  + `raw slug/enum 표시(치환 금지). 재생성=node tools/derive/build_effects.mjs.`;

fs.writeFileSync(path.join(DEV, 'data/derived/effects.json'), JSON.stringify({ rows, note, _types: byType, _origin: byOrigin }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'data/derived/effect_refs.json'), JSON.stringify(refs, null, 1) + '\n');
// 런타임 단일 소스(slug→def). EFFECT_GROUPS/CHOICE_OPTIONS/RE-브리지를 대체.
fs.writeFileSync(path.join(DEV, 'data/derived/effects_db.json'), JSON.stringify(dbBySlug) + '\n');
// 동기 로드용 JS 상수(오프라인·타이밍 안전, feat_db.js 패턴). index.html이 script로 로드.
fs.writeFileSync(path.join(DEV, 'effects_db.js'),
  '/* effects_db.js — 자동화 정본 단일 소스(slug→{source,rows,auto_note?,damage_note?,choice?}).\n'
  + ' * 생성물: node tools/derive/build_effects.mjs. 수기 편집 금지. EFFECT_GROUPS/CHOICE_OPTIONS/RE-브리지 대체(효과 단일화). */\n'
  + 'const EFFECTS_DB = ' + JSON.stringify(dbBySlug) + ';\n'
  + "if (typeof window !== 'undefined') window.EFFECTS_DB = EFFECTS_DB;\n"
  + "if (typeof module !== 'undefined') module.exports = EFFECTS_DB;\n");
const dbStat = { total: Object.keys(dbBySlug).length, legacy: 0, fvtt: 0 };
for (const s in dbBySlug) dbStat[dbBySlug[s].source]++;
try { fs.unlinkSync(path.join(DEV, 'data/derived/feat_effects.json')); } catch (e) {}
console.log('wrote effects.json + effect_refs.json + effects_db.json');
console.log('effects_db slugs:', dbStat.total, JSON.stringify(dbStat));
console.log('rows:', rows.length, 'origin:', JSON.stringify(byOrigin), 'types:', Object.keys(byType).length);
console.log('refs feats=' + Object.keys(refs.feats).length, 'heritages=' + Object.keys(refs.heritages).length, 'backgrounds=' + Object.keys(refs.backgrounds).length);
