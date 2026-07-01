#!/usr/bin/env node
/* build_prereqs.mjs — FVTT 재주의 자유문자열 선행조건(system.prerequisites.value)을
 *   기계 판정 가능한 구조화 조건으로 파싱. 문자열은 표시로 유지(비파괴).
 * 정본 구조 = _checkOnePrereq(cs_modal.js) 포맷: {skill,rank}/{lore}/{feat,featSlug}/{ability,min}/{subclass}/{heritage}/{or:[...]}.
 * 고신뢰 패턴만 구조화(dedication·"trained in X"·재주명·기술숙련·실존 서브클래스(뮤즈/본능/교단/racket)·실존 유산), 나머지는 conds 없이 text만(폴백).
 * ★서브클래스/유산은 실존 엔티티(SUBCLASS_DB·heritages)로 해소되는 것만 emit → 미해소는 내러티브=자동달성(false-negative 0).
 * 산출:
 *   data/derived/prereqs.json  {slug:{text, conds:[...], parsed:bool}}  — DataManager '선행조건' 탭
 *   prereqs_db.js              const PREREQ_STRUCT={slug:[conds]}       — 런타임(동기 로드, effects_db 패턴)
 * 실행: cd dev && node tools/derive/build_prereqs.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const PF = await import(path.join(DEV, 'cs_pf2e.js')).then(m => m.default || m);
PF.loadCategorySync('feats');
PF.loadCategorySync('heritages');

// ── 서브클래스(SUBCLASS_DB, cs_data.js) : name_en/name_ko → 엔티티 ──
// 런타임 _checkOnePrereq({subclass})가 state.selectedSubclass + 추가뮤즈(SUBCLASS_DB) 순회로 판정.
// 실존 SUBCLASS_DB 엔티티로 해소되는 조건만 구조화(못 찾으면 내러티브=자동달성 유지 → false-negative 0).
const subByEn = {}, subByKo = {};
{
  const m = fs.readFileSync(path.join(DEV, 'cs_data.js'), 'utf8').match(/const SUBCLASS_DB = \[[\s\S]*?\n\];/);
  if (m) {
    const ctx = { }; vm.createContext(ctx);
    vm.runInContext(m[0] + '\nthis.SUBCLASS_DB=SUBCLASS_DB;', ctx);
    for (const s of ctx.SUBCLASS_DB || []) {
      if (s.name_en) subByEn[s.name_en.toLowerCase()] = s;
      if (s.name_ko) subByKo[s.name_ko] = s;
    }
  }
}
// 서브클래스 카테고리 접미어(뮤즈/본능/교단/racket/…) — 식별자 앞부분 추출용(엔티티 게이트로 과매칭 무해).
const SUBWORDS = "muse|instinct|order|racket|bloodline|patron|mystery|doctrine|thesis|methodology|style|hybrid study|conscious mind|discipline|element|innovation|research field|calling|cause|hunter'?s edge|way|school|practice|stance|study|source|tenets|implement|shape|form|philosophy";
const SUBWORDS_RE = new RegExp('^(.+?)\\s+(?:' + SUBWORDS + ')$', 'i');
function parseSubclass(s) {
  const m = s.match(SUBWORDS_RE);
  const id = (m ? m[1] : s).trim();
  const sub = subByEn[id.toLowerCase()] || subByKo[m ? m[1].trim() : ''] || null;
  if (!sub) return null;
  return { subclass: sub.name_ko || sub.name_en, subclass_en: sub.name_en };
}

// ── 유산(heritages 카테고리) : name_en/name_ko → 엔티티 ──
// nameMatches는 정확일치(id/name_en/name_ko) → 런타임 getHeritageLegacy 산출명 드리프트 방지 위해
// name_en·name_ko 둘 다 OR로 emit(name_en은 FVTT-stable).
const herByEn = {}, herByKo = {};
for (const h of PF.all('heritages')) {
  const en = (h.name_en || h.name || ''); const ko = PF.nameKo(h) || '';
  if (en) herByEn[en.toLowerCase()] = { en, ko };
  if (ko) herByKo[ko] = { en, ko };
}
function parseHeritage(s) {
  const m = s.match(/^(.+?)\s+heritage$/i); if (!m) return null;
  const id = m[1].trim();
  const h = herByEn[id.toLowerCase()] || herByKo[id] || null;
  if (!h) return null;
  if (h.ko && h.en && h.ko !== h.en) return { or: [{ heritage: h.en }, { heritage: h.ko }] };
  return { heritage: h.en || h.ko };
}

// ── 재주/특성 이름 집합(bareFeat/dedication/feature 해소용) : 영문·한글 → slug ──
const featByName = {};   // 소문자 영문명 → {slug, name_en, name_ko}
for (const doc of PF.all('feats')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  const en = doc.name_en || doc.name || ''; const ko = PF.nameKo(doc) || '';
  if (en) featByName[en.toLowerCase()] = { slug, name_en: en, name_ko: ko };
}

// ── 기술 영문명 → id ──
const SKILL_ID = { acrobatics: 'acrobatics', arcana: 'arcana', athletics: 'athletics', crafting: 'crafting', deception: 'deception', diplomacy: 'diplomacy', intimidation: 'intimidation', medicine: 'medicine', nature: 'nature', occultism: 'occultism', performance: 'performance', religion: 'religion', society: 'society', stealth: 'stealth', survival: 'survival', thievery: 'thievery' };
const RANK = { trained: 2, expert: 4, master: 6, legendary: 8 };

function cleanSeg(s) { return String(s || '').trim().replace(/\.$/, '').trim(); }

// 세그먼트 1개 → 조건 객체 or null(미해소)
function parseSeg(seg) {
  const s = cleanSeg(seg); if (!s) return null;
  // 1) 기술/지각/지식 숙련: "trained in Religion", "master in Athletics", "expert in X Lore"
  let m = s.match(/^(trained|expert|master|legendary)\s+in\s+(?:the\s+)?(.+)$/i);
  if (m) {
    const rank = RANK[m[1].toLowerCase()]; const what = m[2].trim();
    if (/^perception$/i.test(what)) return { perception: rank };
    if (/\blore$/i.test(what)) return { lore: rank };
    const id = SKILL_ID[what.toLowerCase()];
    if (id) return { skill: id, rank };
    return null; // 알 수 없는 대상
  }
  // 2) 능력치: "Charisma +2", "Strength +3" → {ability, min}
  const ABBR = { strength: 'str', dexterity: 'dex', constitution: 'con', intelligence: 'int', wisdom: 'wis', charisma: 'cha' };
  m = s.match(/^(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s*\+\s*(\d+)$/i);
  if (m) return { ability: ABBR[m[1].toLowerCase()], min: parseInt(m[2]) };
  // 3) Dedication / 알려진 재주명(대문자 시작) / 소문자 특성명 → feat 보유 (반드시 slug 해소)
  const fb = featByName[s.toLowerCase()];
  if (fb) return { feat: fb.name_en, feat_ko: fb.name_ko, featSlug: fb.slug };
  // 4) 서브클래스(뮤즈/본능/교단/racket 등) — 실존 SUBCLASS_DB 엔티티로만 해소
  const sc = parseSubclass(s);
  if (sc) return sc;
  // 5) 유산("X heritage") — 실존 heritages 엔티티로만 해소
  const hr = parseHeritage(s);
  if (hr) return hr;
  // slug/엔티티 미해소 = 기계판정 불가 → null(내러티브 취급=자동 달성). 이름-only 매칭 안 함(slug 원칙).
  return null;
}

// 조건 문자열 전체 → conds[] (AND 목록; 각 원소는 조건 or {or:[...]})
function parseValue(pv) {
  const conds = []; let allParsed = true;
  for (const part of pv) {
    const raw = cleanSeg(part.value || part);
    if (!raw) continue;
    if (raw.includes('/')) { // OR 그룹
      const subs = raw.split('/').map(x => parseSeg(x)).filter(Boolean);
      const total = raw.split('/').length;
      if (subs.length === total && subs.length) conds.push({ or: subs });
      else allParsed = false;
    } else {
      const c = parseSeg(raw);
      if (c) conds.push(c); else allParsed = false;
    }
  }
  return { conds, allParsed };
}

const out = {}; const struct = {};
const stat = { total: 0, withPre: 0, fullyParsed: 0, partial: 0, none: 0, conds: 0 };
for (const doc of PF.all('feats')) {
  const s = doc.system || {}; const slug = s.slug; if (!slug) continue;
  stat.total++;
  const pv = (s.prerequisites && s.prerequisites.value) || [];
  if (!pv.length) continue;
  stat.withPre++;
  const text = pv.map(p => (p && p.value) || p).join(', ');
  const { conds, allParsed } = parseValue(pv);
  out[slug] = { text, conds, parsed: allParsed && conds.length > 0 };
  if (conds.length) { struct[slug] = conds; stat.conds += conds.length; }
  if (allParsed && conds.length) stat.fullyParsed++;
  else if (conds.length) stat.partial++;
  else stat.none++;
}

const note = `재주 선행조건 구조화(파싱). 조건보유 ${stat.withPre} · 완전구조화 ${stat.fullyParsed} · 부분 ${stat.partial} · 텍스트폴백 ${stat.none}. `
  + `conds 포맷=_checkOnePrereq({skill,rank}/{lore}/{perception}/{feat,featSlug}/{subclass}/{heritage}/{or:[...]}). 서브클래스·유산은 실존 엔티티 해소분만(미해소=자동달성). 문자열(text)은 표시 유지. 재생성=node tools/derive/build_prereqs.mjs.`;
fs.writeFileSync(path.join(DEV, 'data/derived/prereqs.json'), JSON.stringify({ note, rows: Object.entries(out).map(([slug, v]) => ({ slug, text: v.text, parsed: v.parsed ? 1 : '', conds: JSON.stringify(v.conds) })) }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'prereqs_db.js'),
  '/* prereqs_db.js — 재주 선행조건 구조화 조건(slug→conds[]). 생성물: node tools/derive/build_prereqs.mjs. 수기편집 금지.\n'
  + ' * 문자열 표시는 유지하고, 이 구조로 _checkPrereqs 기계 판정(문자열 정규식 폴백 대체). */\n'
  + 'const PREREQ_STRUCT = ' + JSON.stringify(struct) + ';\n'
  + "if (typeof window !== 'undefined') window.PREREQ_STRUCT = PREREQ_STRUCT;\n"
  + "if (typeof module !== 'undefined') module.exports = PREREQ_STRUCT;\n");
console.log('wrote data/derived/prereqs.json + prereqs_db.js');
console.log(JSON.stringify(stat));
