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
PF.loadCategorySync('feats'); PF.loadCategorySync('heritages'); PF.loadCategorySync('backgrounds'); PF.loadCategorySync('deities'); PF.loadCategorySync('conditions'); PF.loadCategorySync('classes');

// 클래스 slug 집합 — owner-함의 조건 판정용(재주 traits ∩ 클래스slug = owner의 클래스).
const CLASS_SLUGS = new Set(); for (const c of PF.all('classes')) { const sl = c.system && c.system.slug; if (sl) CLASS_SLUGS.add(sl); }
function ownerClassesOf(doc) { const tr = (doc && doc.system && doc.system.traits && doc.system.traits.value) || []; const s = new Set(); for (const t of tr) if (CLASS_SLUGS.has(t)) s.add(t); return s; }

// FVTT-갭 큐레이션: {slug:{rows?,choice?,auto_note?,damage_note?}}. FVTT rules[]가 못 담는 choice/note/수동 grant.
const CURATED = JSON.parse(fs.readFileSync(path.join(DEV, 'data/curated_effects.json'), 'utf8'));

// 바드 작곡/집중 주문 slug → 한글명. 이 주문들은 동명 재주가 부여하지만 FVTT 재주 rules[]가 비어(리마스터가
//   시전 로직으로 처리) 우리 빌더엔 부여가 안 잡힌다 → 재주 루프에서 grant_focus_spell 파생(대원칙: 데이터 도출).
const COMPO_SPELL = {};
try {
  const _spRaw = JSON.parse(fs.readFileSync(path.join(DEV, 'data/store/spells.json'), 'utf8'));
  const _spItems = Array.isArray(_spRaw) ? _spRaw : (_spRaw.items || Object.values(_spRaw));
  for (const sp of _spItems) {
    const ss = (sp && sp.system) || {}; const sl = ss.slug; if (!sl) continue;
    const tr = (ss.traits && ss.traits.value) || [];
    if (tr.includes('bard') && (tr.includes('composition') || tr.includes('focus'))) COMPO_SPELL[sl] = sp.name_ko || sp.name || sl;
  }
} catch (e) { console.warn('[build_effects] spells.json 로드 실패(작곡주문 파생 생략):', e.message); }

const rows = [];
const refs = { feats: {}, heritages: {}, backgrounds: {}, conditions: {}, deities: {} };
const stat = { fvtt: 0, curated: 0 };
const dbBySlug = {};
const ownerMeta = {}; // slug → {owner_kind,owner_name,owner_level,category} (큐레이션 표시행용)

// ── FVTT rule → 효과행 매핑 ──
const SKILLS = new Set(['acrobatics', 'arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 'medicine', 'nature', 'occultism', 'performance', 'religion', 'society', 'stealth', 'survival', 'thievery']);
// 기술 slug→한글명 (choice_opt 옵션 표시명용). cs_data.js SKILLS 단일소스에서 파생(중복 정의 금지 — 원칙#1).
const SKILL_KO = {};
try {
  const _sd = fs.readFileSync(path.join(DEV, 'cs_data.js'), 'utf8');
  const _m = _sd.match(/const SKILLS\s*=\s*(\[[\s\S]*?\n\]);/);
  if (_m) for (const s of eval(_m[1])) { if (s && s.id && !s.isLore) SKILL_KO[s.id] = s.name; }
} catch (e) { console.warn('SKILL_KO 파생 실패:', e.message); }
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
// ── 조건 컬럼 = 영문 열거형 slug + 단일 원자값(1NF). type·target이 영문 slug인데 조건만 한글이면 불일치 → 전부 영문.
//   condition ∈ {'' 무조건 | level | class | feat | feature | heritage | ancestry | trait | armor | size | sense
//                | no-class | no-feat | no-feature | ... (not 부정) | compound(진짜 다원자)}. cond_value = 한 원자값(barbarian, >=7, champions-reaction).
//   ★ owner-함의 조건 제거: 효과는 재주/유산에 붙는 하위 로직. 그 owner를 가졌다는 것이 상위 필터이므로,
//     owner의 클래스(traits∩class)와 겹치는 class:X, owner 자신을 가리키는 feat/feature:self, 그런 원자를 포함한 OR(자격 재확인)은
//     조건에서 제거 → 무조건으로 정정. DISPLAY(effects.json)와 RUNTIME(cond) 모두 이 정제된 조건을 동일하게 사용(런타임=데이터).
const _CMP = { gte: '>=', gt: '>', lte: '<=', lt: '<', eq: '==' };
// owner-함의 원자? (class∈ownerClasses | feat/feature:self)
function _isOwnerAtom(a, ocls, oslug) {
  if (typeof a !== 'string') return false; let m;
  if ((m = /^class:(.+)$/.exec(a))) return ocls.has(m[1]);
  // ⚠ 정확일치만 owner-self. feat:owner:suboption(예 magical-resistance:cold, order-explorer:wave-order)은 선택지값이라 의미가 있음 → 제거 금지.
  if ((m = /^feat:(.+)$/.exec(a))) return m[1] === oslug;
  if ((m = /^feature:(.+)$/.exec(a))) return m[1] === oslug;
  return false;
}
// 우리 런타임이 만들지 않는 상태 = 항상 거짓 원자. order-explorer로 결단을 얻는 경로 미모델(order-explorer=재주필터 choice일 뿐,
//   결단(wave-order 등)은 GrantItem 안 함 — 동적 uuid라 드롭됨). → feat:order-explorer:X는 우리 캐릭터 상태에 절대 없음.
function _isUnmodeledFalseAtom(a) { return typeof a === 'string' && /^feat:order-explorer:/.test(a); }
// 노드가 owner에게 항상 참인가? owner-원자 자신 | owner-원자 포함 OR(하나만 참이면 OR 참) | not(항상거짓)=항상참.
function _isOwnerNode(node, ocls, oslug) {
  if (typeof node === 'string') return _isOwnerAtom(node, ocls, oslug);
  if (node && typeof node === 'object') {
    if (node.not != null && _isUnmodeledFalseAtom(node.not)) return true;   // not(항상거짓)=항상참 → 제거(결단탐험 게이트 무효)
    for (const op of ['or', 'nor']) if (node[op] != null) { const a = Array.isArray(node[op]) ? node[op] : [node[op]]; if (op === 'or' && a.some(x => _isOwnerNode(x, ocls, oslug))) return true; }
  }
  return false;
}
// owner-함의 조건 제거 후 정제 predicate(빈 → null). top-level 배열=AND이므로 항상-참 원소 제거는 등가.
function refineCond(pred, ocls, oslug) {
  if (pred == null) return null;
  const arr = Array.isArray(pred) ? pred : [pred];
  const kept = arr.filter(el => !_isOwnerNode(el, ocls, oslug));
  return kept.length ? kept : null;
}
// 단일 정적 원자 → {condition, cond_value} | null(=다원자/복합)
function _singleAtom(node) {
  if (typeof node === 'string') {
    let m;
    if ((m = /^class:(.+)$/.exec(node))) return { condition: 'class', cond_value: m[1] };
    if ((m = /^feat:(.+)$/.exec(node))) return { condition: 'feat', cond_value: m[1] };
    if ((m = /^feature:(.+)$/.exec(node))) return { condition: 'feature', cond_value: m[1] };
    if ((m = /^self:heritage:(.+)$/.exec(node))) return { condition: 'heritage', cond_value: m[1] };
    if ((m = /^self:ancestry:(.+)$/.exec(node))) return { condition: 'ancestry', cond_value: m[1] };
    if ((m = /^self:trait:(.+)$/.exec(node))) return { condition: 'trait', cond_value: m[1] };
    if ((m = /^armor:(.+)$/.exec(node))) return { condition: 'armor', cond_value: m[1] };
    if (/^self:armored$/.test(node)) return { condition: 'armor', cond_value: 'worn' };
    if ((m = /^self:size:(.+)$/.exec(node))) return { condition: 'size', cond_value: m[1] };
    if ((m = /^self:(low-light-vision|darkvision|see-invisibility)(?::(.+))?$/.exec(node))) return { condition: 'sense', cond_value: m[1] + (m[2] ? (':' + m[2]) : '') };
    return null;
  }
  if (node && typeof node === 'object') {
    for (const op of Object.keys(node)) {
      if (_CMP[op]) { const a = Array.isArray(node[op]) ? node[op] : [node[op]]; return a[0] === 'self:level' ? { condition: 'level', cond_value: _CMP[op] + a[1] } : null; }
      if (op === 'not') { const inner = _singleAtom(node.not); return inner ? { condition: 'no-' + inner.condition, cond_value: inner.cond_value } : null; }
      return null;
    }
  }
  return null;
}
// 진짜 다원자 조건 → 영문 slug 식(정직, FVTT/한글 프로즈 금지). atom=class:x/feat:x/level>=n, AND=' & ', OR='(a | b)', NOT='!a'.
function _compoundStr(node) {
  if (node == null) return '';
  if (Array.isArray(node)) return node.map(_compoundStr).filter(Boolean).join(' & ');
  if (typeof node === 'object') {
    for (const op of Object.keys(node)) {
      const o = node[op];
      if (_CMP[op]) { const a = Array.isArray(o) ? o : [o]; return a[0] === 'self:level' ? ('level' + _CMP[op] + a[1]) : ''; }
      if (op === 'and' || op === 'nand') return _compoundStr(o);
      if (op === 'or' || op === 'nor') return '(' + (Array.isArray(o) ? o : [o]).map(_compoundStr).filter(Boolean).join(' | ') + ')';
      if (op === 'not') { const inner = _compoundStr(o); return inner ? ('!' + inner) : ''; }
      return '';
    }
  }
  const sa = _singleAtom(String(node)); return sa ? (sa.condition + ':' + sa.cond_value) : '';
}
// 섀시(성장표)가 전담하는 숙련 진행 owner → 그 proficiency 행은 효과 테이블에서 제외(emitFvtt에서 skip). owner-함의 제거 후에도 남던 조건부 숙련상향 4건.
//   ★ 무조건화가 아니라 "런타임·표시 모두 제외": subclass_progression(전투사제 lvl13 방어구 E)·class_progression(레인저 spellcasting)이 이미 정본으로 소유.
//   무조건화하면 runtime proficiency 상향덮기가 저레벨에 상위랭크를 오적용(전투사제 lvl1 방어구 숙달 버그). 상세 [[session_handoff]] 5번.
const CHASSIS_PROF = new Set(['ranger-expertise', 'initiate-benefit-tome', 'first-doctrine-warpriest', 'ruffian']);   // ruffian 중형 방어구=racket-ruffian 성장표 전담(경장 따라 T@1/E@13/M@17)
function parseCondition(rawPred, ocls, oslug) {
  ocls = ocls || new Set();
  let pred = refineCond(rawPred, ocls, oslug);
  if (pred == null) return { kind: 'none', condition: '', cond_value: '', cond: null };
  const kind = _classifyNode(pred);
  const arr = Array.isArray(pred) ? pred : [pred];
  if (arr.length === 1) { const sa = _singleAtom(arr[0]); if (sa) return { kind, condition: sa.condition, cond_value: sa.cond_value, cond: pred }; }
  return { kind, condition: 'compound', cond_value: _compoundStr(pred), cond: pred };
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
  'extra_sense', 'resistance', 'grant_feat', 'grant_lore', 'grant_innate_spell', 'grant_focus_spell', 'grant_action', 'speed_extra', 'proficiency', 'bulk_bonus', 'initiative_bonus']);
// v0.163~ 조건엔진 활성 타입: 정적조건 붙은 부여·훈련·저항·숙련을 런타임 편입(조건 충족 시 적용).
//   proficiency(v0.166): 표준 카테고리만 런타임 _profTargetToDom이 매핑+상향덮기. 개별무기/시전별칭/공식값은 미적용(섀시 담당).
//   resistance(v0.165): 유형별 최댓값 병합. 공식/착용갑옷 컨텍스트 의존분은 미해소 skip. bonus류는 여전히 표시만.
const ACT_COND_TYPES = new Set(['grant_feat', 'grant_focus_spell', 'grant_innate_spell', 'grant_lore', 'skill_trained', 'resistance', 'proficiency']);
const GRANT_DEDUP = new Set(['grant_feat', 'grant_focus_spell', 'grant_innate_spell', 'grant_action']);   // owner 내 (type,target) 이중부여 방지(무조건 우선)
// ★ 표시 테이블 = 우리가 모델링하는 효과만(우리 열거형). FVTT 룰을 그대로 덤프하지 않는다(개발 원칙).
//   아래 KEEP만 effects.json 표시행으로 방출. 미모델 FVTT 룰타입(ael/roll_option/adjust_*/item_alteration/strike/modifier/
//   damage_dice/critical_specialization/actor_traits/item/attack_bonus 등)과 상황조건행(롤타임 predicate)은 제외.
const KEEP_DISPLAY_TYPES = new Set([
  'grant_feat', 'grant_focus_spell', 'grant_innate_spell', 'grant_lore', 'grant_item', 'grant_spell', 'grant_action', 'grant_weapon',
  'skill_trained', 'skill_bonus', 'save_bonus', 'ac_bonus', 'hp_bonus', 'perception_bonus', 'initiative_bonus', 'speed_extra', 'speed_bonus', 'bulk_bonus', 'proficiency',
  'resistance', 'weakness', 'immunity', 'vision_upgrade', 'extra_sense',
  'attribute_boost',   // 신격 선호 능력치(구조필드). ability_boost/ability_boost_choice/free_boost_slots는 store 네이티브 부스트 컬럼으로 이관(폐기).
  'domain', 'favored_weapon', 'divine_font', 'sanctification', 'rune',
  'note', 'display_note', 'damage_note', 'choice'
]);
// 우리가 모델링하는 표준 숙련 카테고리(런타임 _profTargetToDom과 동치). 그 외 숙련 target은 표시 제외.
const PROF_STD = new Set(['simple', 'martial', 'advanced', 'unarmed', 'unarmored', 'light', 'medium', 'heavy', 'fortitude', 'reflex', 'will', 'perception']);
// FVTT 경로 target을 우리 표기로 정리(system.proficiencies.X.rank → X). FVTT 내부 경로 노출 방지.
function _cleanTarget(t) {
  if (typeof t !== 'string') return t;
  let m;
  if ((m = /^system\.proficiencies\.(?:attacks|defenses|saves)\.([a-z0-9-]+)\.rank$/.exec(t))) return m[1];
  if (/^system\.proficiencies\.perception\.rank$/.test(t)) return 'perception';
  return t;
}
// X-Lore 혈통 재주(엘프 지식 등): FVTT는 일반 「추가 지식」(grant_feat:additional-lore, $choice 지식)을 부여하나,
//   정본상 이 재주가 주는 지식은 고정(엘프 지식·오크 지식…). → additional-lore 부여를 억제하고 curated가 고정명 grant_lore로 대체.
//   (이게 기존 '빈 지식' 슬롯의 원인이었음. R1: 기술 픽커 choice도 curated에서 제거.)
const LORE_FEATS = new Set(['orc-lore', 'changeling-lore', 'dwarven-lore', 'halfling-lore', 'leshy-lore', 'nephilim-lore', 'goblin-lore', 'elven-lore']);
function emitFvtt(base, doc, bake = true) {
  if (!doc) return;
  let rr = fvttRuleRows(doc);
  if (LORE_FEATS.has(base.owner_slug)) rr = rr.filter(r => !(r.type === 'grant_feat' && String(r.target || '').includes('additional-lore')));
  if (!rr.length) return;
  const ocls = ownerClassesOf(doc), oslug = base.owner_slug;   // owner-함의 조건 판정 컨텍스트
  const b = { owner_kind: base.owner_kind, owner_slug: base.owner_slug, owner_name: base.owner_name, owner_level: base.owner_level, category: base.category, src: 'rule' };
  for (const r of rr) {
    const { re_key, _pred, condition, ...rest } = r;
    if (!KEEP_DISPLAY_TYPES.has(rest.type)) continue;   // FVTT 룰 덤프 타입 제외(우리 모델만)
    const pc = parseCondition(_pred, ocls, oslug);       // owner-함의 제거·정제된 조건(DISPLAY=RUNTIME 동일)
    if (pc.kind === 'sit') continue;                    // 상황조건행 제외(롤옵션 predicate 덤프 금지 — 자동화 안 하는 효과)
    if (rest.target != null) rest.target = _cleanTarget(rest.target);
    const _tgt = String(rest.target == null ? '' : rest.target);
    if (/system\.|[{}]/.test(_tgt)) continue;           // 정리 후에도 남은 FVTT 경로·동적 브래킷 target = 미모델 → 제외
    if (rest.type === 'proficiency' && !PROF_STD.has(_tgt)) continue;   // 표준 카테고리 아닌 숙련(개별무기·시전별칭)=미모델 → 제외
    if (rest.type === 'proficiency' && CHASSIS_PROF.has(oslug)) continue;   // 섀시(성장표) 전담 숙련 진행 → 효과 테이블 제외
    rows.push({ ...b, rule: re_key || '', ...rest, condition: pc.condition, cond_value: pc.cond_value || '' });
    stat.fvtt++;
  }
  // 런타임 소스: 적용가능 type + 브래킷 미포함 + (무조건 OR 정적조건∧활성타입). 상황조건·bake=false(신격)=표시·FK만.
  //  무조건(kind='none', owner-함의 제거로 무조건이 된 것 포함) + 정적조건(kind='static')이면서 ACT_COND_TYPES(부여+기술훈련)만 편입.
  //  ★ cond = pc.cond(정제된 predicate) — RUNTIME=DISPLAY 동일 조건. 런타임 _evalEffectCondition이 캐릭터 상태로 평가(미충족·미해소=skip).
  if (!bake) return;
  const runRows = rr.filter(r => APPLY_TYPES.has(r.type)
    && !(r.type === 'proficiency' && CHASSIS_PROF.has(oslug))   // 섀시 전담 숙련 진행 → 런타임 제외(저레벨 상향덮기 오적용 방지)
    && !/[{}]/.test(String(r.target == null ? '' : r.target)) && !/[{}]/.test(String(r.value == null ? '' : r.value))
    && (() => { const k = parseCondition(r._pred, ocls, oslug).kind; return k === 'none' || (k === 'static' && ACT_COND_TYPES.has(r.type)); })())
    .map(r => { const pc = parseCondition(r._pred, ocls, oslug); const o = { type: r.type }; if (r.target !== '' && r.target != null) o.target = r.target; if (r.value !== '' && r.value != null) o.value = r.value; if (r.bonus_type) o.bonus_type = r.bonus_type; if (pc.kind === 'static' && pc.cond) o.cond = pc.cond; return o; });
  if (runRows.length) dbBySlug[base.owner_slug] = { rows: runRows };
}

// ── 신격 효과행 파생(deities.base엔 rules[] 없음 → 구조화 필드에서 도출) ──
const legDeity = {}; for (const d of DEITY_DB) if (d) legDeity[d.id] = d;
function arrf(v) { return Array.isArray(v) ? v : (v == null || v === '' ? [] : [v]); }
function deityRows(doc, leg) {
  const s = doc.system || {}; const out = [];
  for (const a of arrf(s.attribute)) out.push({ type: 'attribute_boost', target: a });
  for (const sk of (arrf(s.skill).length ? arrf(s.skill) : arrf(leg && leg.skill))) out.push({ type: 'skill_trained', target: sk, condition: 'class', cond_value: 'cleric' });   // 신격 숙련=클레릭이 훈련(기존 조건 enum)
  for (const w of (arrf(s.weapons).length ? arrf(s.weapons) : arrf(leg && leg.weapon))) out.push({ type: 'favored_weapon', target: w });
  const font = arrf(s.font); if (font.length) out.push({ type: 'divine_font', target: font.join(', ') });
  const sanc = s.sanctification ? (Array.isArray(s.sanctification.what) ? s.sanctification.what : arrf(s.sanctification.what)) : arrf(leg && leg.sanctification);
  if (sanc.length) out.push({ type: 'sanctification', target: sanc.join(', '), bonus_type: (s.sanctification && s.sanctification.modal) || '' });
  const dom = s.domains || {}; const prim = arrf(dom.primary).length ? arrf(dom.primary) : arrf(leg && leg.domains);
  for (const d of prim) out.push({ type: 'domain', target: d, bonus_type: 'primary' });
  for (const d of arrf(dom.alternate)) out.push({ type: 'domain', target: d, bonus_type: 'alternate' });
  if (s.spells && typeof s.spells === 'object') for (const rk of Object.keys(s.spells)) {
    let nm = s.spells[rk], sl = ''; try { const g = PF.getByUuid(String(nm).trim()); if (g) { sl = (g.system && g.system.slug) || ''; nm = g.name_ko || g.name; } } catch (e) {}
    out.push({ type: 'grant_spell', target: sl || nm, value: rk, condition: 'class', cond_value: 'cleric' });   // 신격 주문=클레릭에게 부여(기존 조건 enum)
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
  // 능력치 부스트는 store 네이티브 4컬럼(build_boosts.mjs)이 단일소스 → 효과 테이블에서 제외.
  //   (ability_boost/ability_boost_choice/free_boost_slots 폐기. getBackgroundEffects가 컬럼을 직접 읽음.)
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
  // 바드 작곡/집중 재주: 동명 집중주문을 부여해야 하나 FVTT rules[]가 비어 안 잡힘 → grant_focus_spell 파생.
  //   (이미 룰/큐레이션으로 같은 주문을 주고 있으면 중복 생성 안 함)
  if (COMPO_SPELL[slug] && (((s.traits && s.traits.value) || []).includes('bard'))) {
    const cur = dbBySlug[slug];
    const already = cur && cur.rows.some(r => r.type === 'grant_focus_spell' && r.target === slug);
    if (!already) {
      (dbBySlug[slug] = cur || { rows: [] }).rows.push({ type: 'grant_focus_spell', target: slug });
      rows.push({ owner_kind: 'feat', owner_slug: slug, owner_name: PF.nameKo(doc) || slug, owner_level: (s.level && s.level.value) != null ? s.level.value : '', category: s.category || '', src: 'derived', rule: '', type: 'grant_focus_spell', target: slug, name: COMPO_SPELL[slug], condition: '', cond_value: '' });
      stat.derived = (stat.derived || 0) + 1;
    }
  }
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

// 큐레이션 효과 owner 분류: slug가 실제 어느 store에 있는지로 owner_kind 결정.
//   (기본 'feat' 오분류 교정 — 룬/방어구룬=equipment, 뮤즈·결단·후원자·학파·교리=subclass. DataManager 정합성 링크가 올바른 탭 지목.)
const _EQUIP_SLUGS = new Set((PF.all('equipment') || []).map(d => d.system && d.system.slug).filter(Boolean));
let _SUBCLASS_SLUGS = new Set();
try { const _sc = (JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclasses.json'), 'utf8')).rows) || []; _SUBCLASS_SLUGS = new Set(_sc.map(r => r.slug).filter(Boolean)); } catch (e) {}
function curatedOwnerKind(slug) {
  if (_EQUIP_SLUGS.has(slug)) return 'equipment';
  if (_SUBCLASS_SLUGS.has(slug)) return 'subclass';
  return 'feat';
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
  const om = ownerMeta[slug] || { owner_kind: curatedOwnerKind(slug), owner_name: slug, owner_level: '', category: '' };
  const b = { owner_kind: om.owner_kind, owner_slug: slug, owner_name: om.owner_name, owner_level: om.owner_level, category: om.category, rule: 'curated' };
  if (c.rows) for (const r of c.rows) rows.push({ ...b, src: 'effect', ...r });
  if (c.auto_note) rows.push({ ...b, src: 'note', type: 'display_note', note: c.auto_note });
  if (c.damage_note) rows.push({ ...b, src: 'note', type: 'damage_note', note: typeof c.damage_note === 'object' ? JSON.stringify(c.damage_note) : c.damage_note });
  if (c.choice) {
    // 선택지 헤더행(무엇을 고르는지: kind·개수·대상 풀) + 선택지 옵션을 choice_opt 행으로 펼침(그리드에서 보이게, 숨은 blob 제거).
    const flt = c.choice.filter || {};
    // value=수치 제약(개수/랭크/최대레벨), target=선택 대상 풀(고정기술·주문전통·재주카테고리). kind가 해석 기준.
    const _num = (flt.count != null) ? flt.count : ((flt.rank != null) ? flt.rank : ((flt.pickMaxLevel != null) ? flt.pickMaxLevel : ''));
    const _pool = flt.fixedSkill || flt.tradition || flt.pickCategory || flt.min_rank || '';
    rows.push({ ...b, src: 'choice', type: 'choice', choice: c.choice.id || '', choice_kind: c.choice.kind || '', choice_label: c.choice.label || '', value: _num, target: _pool });
    const _opt = (oid, onm, val) => rows.push({ ...b, src: 'choice_opt', type: 'choice_opt', choice: c.choice.id || '', option: oid, option_name: onm, value: val });
    const explicit = c.choice.options || [];
    if (explicit.length) {
      // 명시 옵션(custom·familiar_pick): 큐레이션 options[] 그대로. id/name·option_id/option_name 양쪽 표기 허용(런타임 _getFeatEffectsDef와 동일).
      for (const op of explicit) {
        const oid = (typeof op === 'string') ? op : (op.option_id != null ? op.option_id : (op.id != null ? op.id : (op.value || '')));
        const onm = (typeof op === 'object') ? (op.option_name || op.name || op.label || '') : '';
        _opt(oid, onm, (op && op.default) ? 'default' : '');
      }
    } else if (c.choice.kind === 'skill_defaults') {
      // 기본 기술 = owner의 skill_trained/skill_expert 부여행에서 파생(정본=실제 부여되는 기술, 이름/label 재파싱 아님).
      for (const r of (e.rows || [])) if (r.type === 'skill_trained' || r.type === 'skill_expert') _opt(r.target, SKILL_KO[r.target] || r.target, 'default');
    } else if (c.choice.kind === 'skill_fixed' && flt.fixedSkill) {
      _opt(flt.fixedSkill, SKILL_KO[flt.fixedSkill] || flt.fixedSkill, 'default');
    } else if (c.choice.kind === 'skill' && flt.filter && Array.isArray(flt.filter.custom)) {
      // 후보 기술 목록(택1) — 기본 아님(value 빈칸).
      for (const sk of flt.filter.custom) _opt(sk, SKILL_KO[sk] || sk, '');
    }
    // 그 외(feat_pick·spell_rank/cantrip·weapon_pick·ancestry_pick·lore·skill_multi·동적 custom)=동적 필터라 고정 옵션 없음(헤더행 kind/label/target으로 문서화).
  }
  refs.feats[slug] = refs.feats[slug] || 'curated';
  stat.curated++;
}

// ── grant 이중부여 방지 dedup(v0.163): 조건 grant행이 같은 owner의 (동일 type,target) grant와 겹치면 조건행만 드롭. ──
//   무조건 baseline은 절대 건드리지 않음(바이트 동일 유지) — 새로 켜지는 조건행이 기존 부여와 중복될 때만 정리.
//   예: shaman = curated 무조건 grant_feat:enhanced-familiar + FVTT 조건부 동일 grant → 조건행 제거해 1회만 부여.
let _dedupDropped = 0;
for (const slug of Object.keys(dbBySlug)) {
  const e = dbBySlug[slug]; if (!e.rows) continue;
  if (!e.rows.some(r => r.cond && GRANT_DEDUP.has(r.type))) continue;   // 조건 grant행 없는 owner=무변경
  const present = new Set();
  for (const r of e.rows) if (GRANT_DEDUP.has(r.type) && !r.cond) present.add(r.type + '|' + r.target);   // 무조건 grant 키
  const kept = [];
  for (const r of e.rows) {
    if (r.cond && GRANT_DEDUP.has(r.type)) {
      const k = r.type + '|' + r.target;
      if (present.has(k)) { _dedupDropped++; continue; }   // 무조건 또는 앞선 조건행이 이미 같은 grant 제공 → 조건행 드롭
      present.add(k);
    }
    kept.push(r);
  }
  e.rows = kept;
}

// ── 서브클래스 부여 → 성장표(subclass_progression) 전담. 효과(자동화) 탭은 재주·아이템·클래스특성 전용. ──
//   합의 구조: 클래스성장/혈통/유산/서브클래스성장 → 재주/아이템/클래스특성 → 효과(자동화).
//   서브클래스 슬러그의 무조건 부여행(재주/기술/주문/행동)을 성장표용 사이드파일로 우회하고 효과 탭(런타임·표시)에서 제거.
//   런타임은 PF2eClass.subclassGrantTable(성장표)에서 직접 읽어 적용(숙련 T/E/M/L과 동일 경로). build_subclass_progression.mjs가 이 파일을 흡수.
const SUB_GRANT_DIVERT = new Set(['grant_feat', 'skill_trained', 'grant_focus_spell', 'grant_known_spell', 'grant_innate_spell', 'grant_action']);
const SPELL_TYPE_OF = { grant_focus_spell: 'focus', grant_known_spell: 'known', grant_innate_spell: 'innate' };
// 조건에서 부여 레벨 추출: {gte:[self:level,N]} = N레벨에 부여. 그 외(비-레벨 조건)=null(성장표 무조건 표현 불가 → 우회 제외).
function _grantLevel(cond) {
  if (!cond) return 1;                                  // 무조건 = 1레벨
  const arr = Array.isArray(cond) ? cond : [cond];
  if (arr.length !== 1) return null;                    // 복합 조건 = 미표현
  const a = arr[0];
  if (a && a.gte && Array.isArray(a.gte) && a.gte[0] === 'self:level' && typeof a.gte[1] === 'number') return a.gte[1];
  return null;                                          // 레벨 외 조건(특성/클래스 등) = 미표현
}
const subGrantsRaw = {};
function _collectSubGrant(slug, r, lv) {
  const o = subGrantsRaw[slug] || (subGrantsRaw[slug] = { grant_feats: new Map(), grant_skills: new Map(), grant_spells: new Map(), grant_actions: new Map() });
  if (!r.target) return;
  const keepMin = (m, k, v) => { const p = m.get(k); if (p == null || v < (p.lv != null ? p.lv : p)) m.set(k, v); };  // 같은 대상 최소 레벨 유지
  if (r.type === 'grant_feat') keepMin(o.grant_feats, r.target, lv);
  else if (r.type === 'skill_trained') keepMin(o.grant_skills, r.target, lv);
  else if (r.type === 'grant_action') keepMin(o.grant_actions, r.target, lv);
  else if (SPELL_TYPE_OF[r.type]) { const p = o.grant_spells.get(r.target); if (!p || lv < p.lv) o.grant_spells.set(r.target, { type: SPELL_TYPE_OF[r.type], lv }); }
}
let _subDiverted = 0, _subCondLeft = 0;
for (const slug of Object.keys(dbBySlug)) {
  if (!_SUBCLASS_SLUGS.has(slug)) continue;
  const e = dbBySlug[slug]; if (!e.rows) continue;
  const kept = [];
  for (const r of e.rows) {
    if (SUB_GRANT_DIVERT.has(r.type) && r.target) {
      const lv = _grantLevel(r.cond);
      if (lv != null) { _collectSubGrant(slug, r, lv); _subDiverted++; continue; }   // 무조건·레벨조건 부여 → 성장표(해당 레벨)로 우회
      _subCondLeft++;                                                                 // 비-레벨 조건 부여만 효과 탭 잔류
    }
    kept.push(r);
  }
  e.rows = kept;
}
// 표시행(effects.json)에서도 우회 대상 제거(무조건·레벨조건 부여)
for (let i = rows.length - 1; i >= 0; i--) { const r = rows[i]; if (_SUBCLASS_SLUGS.has(r.owner_slug) && SUB_GRANT_DIVERT.has(r.type) && r.target && _grantLevel(r.cond) != null) rows.splice(i, 1); }
// 사이드파일: Map → 배열 직렬화(build_subclass_progression.mjs 소비). 각 항목에 부여 레벨(lv) 포함.
const subGrantsOut = {};
for (const slug of Object.keys(subGrantsRaw)) {
  const o = subGrantsRaw[slug];
  subGrantsOut[slug] = {
    grant_feats: [...o.grant_feats].map(([slug, lv]) => ({ slug, lv })),
    grant_skills: [...o.grant_skills].map(([slug, lv]) => ({ slug, lv })),
    grant_spells: [...o.grant_spells].map(([slug, v]) => ({ slug, type: v.type, lv: v.lv })),
    grant_actions: [...o.grant_actions].map(([slug, lv]) => ({ slug, lv })),
  };
}
fs.writeFileSync(path.join(DEV, 'data/derived/subclass_grants_raw.json'),
  JSON.stringify({ note: '서브클래스 부여 원본(효과 추출에서 우회) — build_subclass_progression.mjs가 subclasses.json granted_*와 합쳐 성장표 grant_* 칸 생성. build_effects.mjs 생성.', rows: subGrantsOut }, null, 1) + '\n');

const byType = {}; for (const r of rows) if (r.type) byType[r.type] = (byType[r.type] || 0) + 1;
const note = `자동화 효과 테이블 — 우리가 모델링하는 효과만, 우리 열거형으로. 효과행 ${rows.length} · ${Object.keys(byType).length} type. `
  + `소스=FVTT system.rules[](feat/heritage/background)를 우리 스키마로 번역 + 신격 구조필드 + curated_effects.json. `
  + `★ FVTT 룰을 그대로 덤프하지 않음: 미모델 룰타입(ael/roll_option/adjust_*/item_alteration/strike/… )·상황조건행(롤타임 predicate)·미모델 숙련(개별무기·시전별칭)은 표시 제외. `
  + `효과타입·대상·값·값종류·조건 전부 영문 열거형/slug(한글 프로즈 없음). 조건=열거형 slug, 조건밸류=한 원자값. 코드가 실제 처리하는 자료형은 _schema 참조. 재생성=node tools/derive/build_effects.mjs.`;

// ── 코드가 실제 처리하는 자료형 스키마(DataManager 문서화용, 코드 상수에서 파생 → 드리프트 방지) ──
//   조건 평가 = cs_calc _evalCondAtom(런타임). 효과타입 적용 = APPLY_TYPES / 정적조건 게이트 = ACT_COND_TYPES.
const COND_EVALUATED = ['level', 'class', 'feat', 'feature', 'heritage', 'ancestry', 'trait'];   // cs_calc _evalCondAtom이 캐릭터 상태로 판정·게이트
const COND_DISPLAY_ONLY = ['armor', 'size', 'sense'];   // 미모델 → _evalCondAtom null(미해소) = 표시만, 적용 안 함
const _schema = {
  note: '코드가 실제 처리하는 자료형(런타임 소스). 이 목록 밖 값은 런타임이 모름 = 데이터·코드 불변식. 조건 평가=cs_calc _evalEffectCondition, 효과 적용=applyFeatEffects.',
  condition: {
    unconditional: '(빈칸) = 무조건 적용',
    evaluated: COND_EVALUATED,          // 런타임 조건엔진이 캐릭터 상태로 판정·게이트
    display_only: COND_DISPLAY_ONLY,    // 미해소(표시만, 적용 안 함)
    negation: 'no-<enum> (예: no-class, no-feat)',
    compound: 'compound = 다원자 조건(원자별 판정; & 그리고 · | 또는 · ! 아님)',
  },
  effect_type: {
    runtime_applied: [...APPLY_TYPES].sort(),                                       // applyFeatEffects가 캐릭터에 적용
    condition_gated: [...ACT_COND_TYPES].sort(),                                    // 정적조건 붙으면 런타임 조건엔진이 게이트
    display_only: [...KEEP_DISPLAY_TYPES].filter(t => !APPLY_TYPES.has(t)).sort(),  // 표시만(런타임 미적용 — 섀시/별도경로 소유)
  },
};

fs.writeFileSync(path.join(DEV, 'data/derived/effects.json'), JSON.stringify({ rows, note, _schema, _types: byType }, null, 1) + '\n');
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
const _condRuntime = Object.values(dbBySlug).reduce((n, e) => n + ((e.rows || []).filter(r => r.cond).length), 0);
console.log('effects_db slugs:', Object.keys(dbBySlug).length, '| rows(display):', rows.length, '| stat:', JSON.stringify(stat), '| types:', Object.keys(byType).length);
console.log('조건엔진(v0.163): 런타임 편입 정적조건행', _condRuntime, '| grant 이중부여 dedup 드롭', _dedupDropped);
console.log('서브클래스 부여 → 성장표 우회:', _subDiverted, '행(효과 탭 제거) · 사이드파일 서브클래스', Object.keys(subGrantsOut).length, '종' + (_subCondLeft ? ` · 조건부 부여 효과탭 잔류 ${_subCondLeft}` : ''));
