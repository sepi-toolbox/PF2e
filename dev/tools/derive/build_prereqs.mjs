#!/usr/bin/env node
/* build_prereqs.mjs — FVTT 재주의 자유문자열 선행조건(system.prerequisites.value)을
 *   기계 판정 가능한 구조화 조건으로 파싱. 문자열은 표시로 유지(비파괴).
 *
 * 산출 2종(효과 테이블의 effects_db.js↔effects.json 관계와 동일):
 *   prereqs_db.js              const PREREQ_STRUCT={slug:[conds]}  — 런타임(_checkOnePrereq 동기 소비)
 *   data/derived/prereqs.json  정규화 1:N 행                       — DataManager '선행조건' 탭
 *      행 스키마 = owner_slug | group | type | target | value | src_text  (한 컬럼 한 역할)
 *      · group  : AND/OR 묶음 번호. 같은 번호=OR(택1), 다른 번호=AND(모두 필요). (효과 테이블 group_no와 동일)
 *      · type   : skill|perception|lore|ability|feat|subclass|heritage|ancestry|narrative
 *      · target : 슬러그(feat/subclass/heritage) 또는 기술id/능력치코드. 없으면 공란.
 *      · value  : 숙련 rank(2/4/6/8)·능력치 min. 없으면 공란.
 *      · narrative = 파싱 불가(서사조건, 자동달성) — 무엇이 판정 제외됐는지 투명하게 행으로 남김.
 *
 * ★ 서브클래스/유산은 실존 엔티티(subclasses.json·heritages)로 해소되는 것만 구조화(미해소=narrative=자동달성, false-negative 0).
 * ★ 서브클래스는 슬러그로 판정/표시(order-leaf 등). "X order/muse/…"(교단 소속)은 slug 서브클래스 조건 —
 *    동명 classfeature(leaf-order 등)로 새지 않도록 접미어↔subclass_type 검증 후 feat보다 먼저 해소.
 * 실행: cd dev && node tools/derive/build_prereqs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const PF = await import(path.join(DEV, 'cs_pf2e.js')).then(m => m.default || m);
PF.loadCategorySync('feats');
PF.loadCategorySync('heritages');

// ── 서브클래스 : data/derived/subclasses.json(권위 단일소스, 80종) → name_en/name_ko → {id(slug),subclass_type} ──
//   ⚠ cs_data.js SUBCLASS_DB는 []로 비었음(v0.157 파생 이관) → 반드시 subclasses.json에서 해소.
const subByEn = {}, subByKo = {};
{
  const sj = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclasses.json'), 'utf8'));
  for (const s of (sj.rows || [])) {
    const rec = { id: s.id, name_en: s.name_en, name_ko: s.name_ko, type: s.subclass_type };
    if (s.name_en) subByEn[s.name_en.toLowerCase()] = rec;
    if (s.name_ko) subByKo[s.name_ko] = rec;
  }
}
// 서브클래스 카테고리 접미어(en) → subclass_type(ko). 이 map에 있는 접미어로 끝나고, 벗겨낸 이름이 실존 서브클래스이며,
//   그 서브클래스의 subclass_type이 접미어와 일치할 때만 {subclass}로 해소(오충돌 방지: 재주 "untamed form"은 form≠교단 → 거부→feat).
const SUBWORD_TYPE = {
  'order': '교단', 'instinct': '본능', 'muse': '뮤즈', 'bloodline': '혈통',
  'mystery': '신비', 'doctrine': '교리', 'racket': '전문', 'patron': '후원자',
  'school': '비전 학파', 'methodology': '방법론', 'research field': '연구 분야',
  'cause': '원인', "hunter's edge": '사냥 방식', "hunters edge": '사냥 방식',
};
const SUBWORDS_RE = new RegExp('^(.+?)\\s+(' + Object.keys(SUBWORD_TYPE).join('|') + ')$', 'i');
function parseSubclass(s) {
  const m = s.match(SUBWORDS_RE);
  if (!m) return null;
  const name = m[1].trim(), word = m[2].toLowerCase();
  const sub = subByEn[name.toLowerCase()] || subByKo[name] || null;
  if (!sub) return null;
  if (SUBWORD_TYPE[word] !== sub.type) return null;   // 접미어↔타입 불일치 → 서브클래스 아님(재주로 폴백)
  return { t: 'subclass', target: sub.id, name_en: sub.name_en, name_ko: sub.name_ko };
}

// ── 유산(heritages 카테고리) : name_en/name_ko → {slug,en,ko} ──
const herByEn = {}, herByKo = {};
for (const h of PF.all('heritages')) {
  const en = (h.name_en || h.name || ''); const ko = PF.nameKo(h) || ''; const slug = (h.system && h.system.slug) || '';
  const rec = { en, ko, slug };
  if (en) herByEn[en.toLowerCase()] = rec;
  if (ko) herByKo[ko] = rec;
}
function parseHeritage(s) {
  const m = s.match(/^(.+?)\s+heritage$/i); if (!m) return null;
  const id = m[1].trim();
  const h = herByEn[id.toLowerCase()] || herByKo[id] || null;
  if (!h) return null;
  return { t: 'heritage', target: h.slug || '', name_en: h.en, name_ko: h.ko };
}

// ── 재주/특성 이름 집합(dedication/재주명/특성명 → slug) ──
const featByName = {};
for (const doc of PF.all('feats')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const en = doc.name_en || doc.name || ''; const ko = PF.nameKo(doc) || '';
  if (en) featByName[en.toLowerCase()] = { slug, name_en: en, name_ko: ko };
}

const SKILL_ID = { acrobatics: 'acrobatics', arcana: 'arcana', athletics: 'athletics', crafting: 'crafting', deception: 'deception', diplomacy: 'diplomacy', intimidation: 'intimidation', medicine: 'medicine', nature: 'nature', occultism: 'occultism', performance: 'performance', religion: 'religion', society: 'society', stealth: 'stealth', survival: 'survival', thievery: 'thievery' };
const RANK = { trained: 2, expert: 4, master: 6, legendary: 8 };
const ABBR = { strength: 'str', dexterity: 'dex', constitution: 'con', intelligence: 'int', wisdom: 'wis', charisma: 'cha' };

function cleanSeg(s) { return String(s || '').trim().replace(/\.$/, '').trim(); }

// 세그먼트 1개 → 정규 조건 {t,target?,value?,name_*?} or null(미해소=narrative).
//  해소 순서: 기술/능력치(구체 패턴) → 서브클래스(접미어+타입 검증, feat보다 먼저) → 유산 → 재주.
function parseSeg(seg) {
  const s = cleanSeg(seg); if (!s) return null;
  // 기술/지각/지식 숙련: "trained in Religion", "master in Athletics", "expert in X Lore"
  let m = s.match(/^(trained|expert|master|legendary)\s+in\s+(?:the\s+)?(.+)$/i);
  if (m) {
    const rank = RANK[m[1].toLowerCase()]; const what = m[2].trim();
    if (/^perception$/i.test(what)) return { t: 'perception', value: rank };
    if (/\blore$/i.test(what)) return { t: 'lore', value: rank };
    const id = SKILL_ID[what.toLowerCase()];
    if (id) return { t: 'skill', target: id, value: rank };
    return null;
  }
  // 능력치: "Charisma +2"
  m = s.match(/^(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s*\+\s*(\d+)$/i);
  if (m) return { t: 'ability', target: ABBR[m[1].toLowerCase()], value: parseInt(m[2]) };
  // 서브클래스 소속("X order/muse/…") — 실존 서브클래스 slug로만, feat보다 먼저(동명 classfeature 회피)
  const sc = parseSubclass(s);
  if (sc) return sc;
  // 유산("X heritage")
  const hr = parseHeritage(s);
  if (hr) return hr;
  // 재주 보유(dedication·재주명·특성명) → slug
  const fb = featByName[s.toLowerCase()];
  if (fb) return { t: 'feat', target: fb.slug, name_en: fb.name_en, name_ko: fb.name_ko };
  return null;   // 미해소 = narrative(자동달성)
}

// 정규 조건 → 런타임 PREREQ_STRUCT 형태(_checkOnePrereq 소비)
function toRuntime(c) {
  switch (c.t) {
    case 'skill': return { skill: c.target, rank: c.value };
    case 'perception': return { perception: c.value };
    case 'lore': return { lore: c.value };
    case 'ability': return { ability: c.target, min: c.value };
    case 'feat': return { feat: c.name_en, feat_ko: c.name_ko, featSlug: c.target };
    case 'subclass': return { subclass: c.target };   // slug — _checkOnePrereq가 state.selectedSubclass.id로 판정
    case 'heritage': return (c.name_en && c.name_ko && c.name_en !== c.name_ko)
      ? { or: [{ heritage: c.name_en }, { heritage: c.name_ko }] } : { heritage: c.name_en || c.name_ko };
    case 'ancestry': return { ancestry: c.target };
    default: return null;
  }
}
// 정규 조건 → DataManager 정규화 행
function toRow(c, ownerSlug, group, srcText) {
  const noTarget = (c.t === 'perception' || c.t === 'lore');
  return { owner_slug: ownerSlug, owner_kind: 'feat', group, type: c.t, target: noTarget ? '' : (c.target || ''), value: (c.value != null ? c.value : ''), src_text: srcText };
}

const rows = [];          // DataManager 정규화 행(전 재주)
const struct = {};        // 런타임 PREREQ_STRUCT
const stat = { total: 0, withPre: 0, fullyParsed: 0, partial: 0, none: 0, rows: 0, narrative: 0 };

for (const doc of PF.all('feats')) {
  const sdoc = doc.system || {}; const slug = sdoc.slug; if (!slug) continue;
  stat.total++;
  const pv = (sdoc.prerequisites && sdoc.prerequisites.value) || [];
  if (!pv.length) continue;
  stat.withPre++;
  const rt = [];              // 이 재주의 런타임 conds
  let hasNarr = false, hasParsed = false;
  pv.forEach((part, idx) => {
    const group = idx + 1;
    const raw = cleanSeg((part && part.value) || part);
    if (!raw) return;
    const isOr = raw.includes('/');
    const branches = (isOr ? raw.split('/') : [raw]).map(cleanSeg).filter(Boolean);
    const parsed = branches.map(b => ({ b, c: parseSeg(b) }));
    // 표시 행: 분기마다 1행(파싱=타입행, 미파싱=narrative행), 같은 group
    for (const { b, c } of parsed) {
      if (c) { rows.push(toRow(c, slug, group, b)); hasParsed = true; }
      else { rows.push({ owner_slug: slug, owner_kind: 'feat', group, type: 'narrative', target: '', value: '', src_text: b }); hasNarr = true; stat.narrative++; }
      stat.rows++;
    }
    // 런타임: OR은 전부 파싱될 때만 {or:[]}, 단일은 파싱분만. 미파싱=드롭(자동달성).
    if (isOr) { if (parsed.every(x => x.c)) rt.push({ or: parsed.map(x => toRuntime(x.c)) }); }
    else if (parsed[0].c) rt.push(toRuntime(parsed[0].c));
  });
  if (rt.length) struct[slug] = rt;
  if (hasParsed && !hasNarr) stat.fullyParsed++;
  else if (hasParsed) stat.partial++;
  else stat.none++;
}

const note = `재주 선행조건 정규화(1:N). 조건보유 ${stat.withPre} · 완전구조화 ${stat.fullyParsed} · 부분(narrative혼재) ${stat.partial} · 전부서사 ${stat.none} · 총행 ${stat.rows}(narrative ${stat.narrative}). `
  + `행=owner_slug|group|type|target|value|src_text. group 같으면 OR·다르면 AND. type=skill|perception|lore|ability|feat|subclass|heritage|ancestry|narrative. 서브클래스=slug(order-leaf 등). 런타임=prereqs_db.js(PREREQ_STRUCT). 재생성=node tools/derive/build_prereqs.mjs.`;

fs.writeFileSync(path.join(DEV, 'data/derived/prereqs.json'), JSON.stringify({ note, rows }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'prereqs_db.js'),
  '/* prereqs_db.js — 재주 선행조건 구조화 조건(slug→conds[]). 생성물: node tools/derive/build_prereqs.mjs. 수기편집 금지.\n'
  + ' * 문자열 표시는 유지하고, 이 구조로 _checkPrereqs 기계 판정(문자열 정규식 폴백 대체). 서브클래스=slug. */\n'
  + 'const PREREQ_STRUCT = ' + JSON.stringify(struct) + ';\n'
  + "if (typeof window !== 'undefined') window.PREREQ_STRUCT = PREREQ_STRUCT;\n"
  + "if (typeof module !== 'undefined') module.exports = PREREQ_STRUCT;\n");
console.log('wrote data/derived/prereqs.json (정규화 행) + prereqs_db.js');
console.log(JSON.stringify(stat));
