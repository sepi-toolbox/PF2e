#!/usr/bin/env node
/* build_prereqs.mjs — FVTT 재주의 자유문자열 선행조건(system.prerequisites.value)을
 *   기계 판정 가능한 구조화 조건으로 파싱. 문자열은 표시로 유지(비파괴).
 * 정본 구조 = _checkOnePrereq(cs_modal.js) 포맷: {skill,rank}/{lore}/{feat}/{ability,min}/{or:[...]}.
 * 고신뢰 패턴만 구조화(dedication·"trained in X"·알려진 재주명·기술숙련), 나머지는 conds 없이 text만(폴백).
 * 산출:
 *   data/derived/prereqs.json  {slug:{text, conds:[...], parsed:bool}}  — DataManager '선행조건' 탭
 *   prereqs_db.js              const PREREQ_STRUCT={slug:[conds]}       — 런타임(동기 로드, effects_db 패턴)
 * 실행: cd dev && node tools/derive/build_prereqs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const PF = await import(path.join(DEV, 'cs_pf2e.js')).then(m => m.default || m);
PF.loadCategorySync('feats');

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
  // slug 미해소 = 기계판정 불가 → null(내러티브 취급=자동 달성). 이름-only 매칭 안 함(slug 원칙).
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
  + `conds 포맷=_checkOnePrereq({skill,rank}/{lore}/{perception}/{feat,featSlug}/{or:[...]}). 문자열(text)은 표시 유지. 재생성=node tools/derive/build_prereqs.mjs.`;
fs.writeFileSync(path.join(DEV, 'data/derived/prereqs.json'), JSON.stringify({ note, rows: Object.entries(out).map(([slug, v]) => ({ slug, text: v.text, parsed: v.parsed ? 1 : '', conds: JSON.stringify(v.conds) })) }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'prereqs_db.js'),
  '/* prereqs_db.js — 재주 선행조건 구조화 조건(slug→conds[]). 생성물: node tools/derive/build_prereqs.mjs. 수기편집 금지.\n'
  + ' * 문자열 표시는 유지하고, 이 구조로 _checkPrereqs 기계 판정(문자열 정규식 폴백 대체). */\n'
  + 'const PREREQ_STRUCT = ' + JSON.stringify(struct) + ';\n'
  + "if (typeof window !== 'undefined') window.PREREQ_STRUCT = PREREQ_STRUCT;\n"
  + "if (typeof module !== 'undefined') module.exports = PREREQ_STRUCT;\n");
console.log('wrote data/derived/prereqs.json + prereqs_db.js');
console.log(JSON.stringify(stat));
