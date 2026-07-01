#!/usr/bin/env node
/* normalize_terms.mjs — 핵심 기계용어(조건·생물유형·특성·피해유형 등)를 사용자 정본 용어집으로 통일.
 * 정본 = _glossary/Pathfinder2e.md (사용자 용어집). 레거시 DB(cs_data.js)·FVTT 오버레이·파생 글로서리 모두 여기에 맞춤.
 * 설명문의 참조는 @UUID/traitTag/글로서리가 이 name 값을 해소하므로, name 값만 통일하면 참조가 자동 정합.
 * 실행: node tools/normalize_terms.mjs [--apply]   (기본=dry-run: 변경 로그만 출력, 파일 미변경)
 * 산출(--apply): overlay/conditions.ko.json, cs_data.js(CONDITIONS_DATA/CONDITIONS/TRAIT_DB), data/creatures/_glossary.ko.json,
 *                data/derived/traits.json 갱신 + docs/번역정규화_로그.md 수정로그.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const GLOS_PATH = '/Users/sepi/Library/Mobile Documents/com~apple~CloudDocs/AIwork/01_TTRPG-Translation/_glossary/Pathfinder2e.md';

// ── 1) 용어집 파싱: 섹션 헤더 기준으로 En→Ko 맵 추출 ──
const md = fs.readFileSync(GLOS_PATH, 'utf8');
function parseSection(title) {
  // "## <title>" 이후 다음 "## " 또는 "---" 전까지의 | En | Ko | 행
  const re = new RegExp('##\\s*' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|\\n>|$)');
  const m = md.match(re); const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const c = line.split('|').map(s => s.trim());
    if (c.length < 3 || !c[1] || c[1] === '원문 (English)' || c[1] === '원문' || /^-+$/.test(c[1])) continue;
    let en = c[1].replace(/\s*\([^)]*\)\s*$/, '').trim(); // "Strength (STR)"→"Strength"
    let ko = c[2].replace(/~~[^~]*~~/g, '')               // 금지 표기 제거
                 .replace(/\s*\([^)]*(?:구판|Remaster|Positive|Negative)[^)]*\)\s*$/, '') // 노트 괄호 제거
                 .trim();
    if (en && ko) out[en] = ko;
  }
  return out;
}
const G = {
  condition: parseSection('상태 (Conditions)'),
  trait: parseSection('특성 (Traits)'),
  damage: parseSection('피해 유형'),
  skill: parseSection('기술 (Skills)'),
  attribute: parseSection('능력치 (Attributes)'),
  creatureType: parseSection('생물 유형'),
  save: {}, // 내성: 아래 수동(용어집 "기본 내성" 형식이라 개별 없음)
};
// 능력치 En→약어 매핑(cs_data는 con/dex... 슬러그 사용)
const ATTR_SLUG = { Strength: 'str', Dexterity: 'dex', Constitution: 'con', Intelligence: 'int', Wisdom: 'wis', Charisma: 'cha' };
const abilityBySlug = {}; for (const en in G.attribute) if (ATTR_SLUG[en]) abilityBySlug[ATTR_SLUG[en]] = G.attribute[en];

// ── 2) slug→En 매핑(FVTT base) : 조건 ──
function baseArr(f) { const j = JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8')); return Array.isArray(j) ? j : Object.values(j); }
const condSlugEn = {}; for (const x of baseArr('data/base/conditions.base.json')) { const s = (x.system && x.system.slug) || x.slug; if (s) condSlugEn[s] = x.name; }
// 트레잇/생물유형: slug ≈ En 소문자-하이픈. 역인덱스 구성.
function slugify(en) { return en.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-'); }
const traitBySlug = {}; for (const en in G.trait) traitBySlug[slugify(en)] = G.trait[en];
for (const en in G.creatureType) traitBySlug[slugify(en)] = G.creatureType[en]; // 생물유형도 trait 슬러그
const damageBySlug = {}; for (const en in G.damage) damageBySlug[slugify(en)] = G.damage[en];

const LOG = []; // {file, cat, key, from, to}
function chg(file, cat, key, from, to) { if (from !== to && to) { LOG.push({ file, cat, key, from, to }); return to; } return from; }

// ── 3) 적용 대상 ──
const writes = {}; // path -> new content

// (a) overlay/conditions.ko.json : name = 용어집[condSlugEn[slug]]
{
  const p = 'data/overlay/conditions.ko.json'; const j = JSON.parse(fs.readFileSync(path.join(DEV, p), 'utf8'));
  for (const slug in j) { const en = condSlugEn[slug]; const ko = en && G.condition[en]; if (ko && j[slug] && j[slug].name) j[slug].name = chg(p, 'condition', slug, j[slug].name, ko); }
  writes[p] = JSON.stringify(j, null, 1) + '\n';
}
// (b) data/creatures/_glossary.ko.json : condition/trait/skill/ability/save/damage(무) 슬러그맵
{
  const p = 'data/creatures/_glossary.ko.json'; const j = JSON.parse(fs.readFileSync(path.join(DEV, p), 'utf8'));
  if (j.condition) for (const slug in j.condition) { const en = condSlugEn[slug] || null; const ko = en && G.condition[en]; if (ko) j.condition[slug] = chg(p, 'condition', slug, j.condition[slug], ko); }
  if (j.trait) for (const slug in j.trait) { const ko = traitBySlug[slug]; if (ko) j.trait[slug] = chg(p, 'trait', slug, j.trait[slug], ko); }
  if (j.skill) for (const slug in j.skill) { const en = Object.keys(G.skill).find(e => slugify(e) === slug); const ko = en && G.skill[en]; if (ko) j.skill[slug] = chg(p, 'skill', slug, j.skill[slug], ko); }
  if (j.ability) for (const slug in j.ability) { const ko = abilityBySlug[slug]; if (ko) j.ability[slug] = chg(p, 'ability', slug, j.ability[slug], ko); }
  writes[p] = JSON.stringify(j, null, 1) + '\n';
}
// (c) data/derived/traits.json : name_ko (생물유형/특성 슬러그 매칭)
{
  const p = 'data/derived/traits.json'; const j = JSON.parse(fs.readFileSync(path.join(DEV, p), 'utf8'));
  for (const slug in j) { const ko = traitBySlug[slug] || damageBySlug[slug]; if (ko && j[slug] && j[slug].name_ko) j[slug].name_ko = chg(p, 'trait', slug, j[slug].name_ko, ko); }
  writes[p] = JSON.stringify(j, null, 1) + '\n';
}
// (d) cs_data.js : CONDITIONS_DATA / CONDITIONS / TRAIT_DB 블록 surgical replace
{
  const p = 'cs_data.js'; let src = fs.readFileSync(path.join(DEV, p), 'utf8');
  const nameMap = {}; // 조건 old한글명 → new한글명 (CONDITIONS 배열·설명 매핑용)
  // CONDITIONS_DATA
  src = src.replace(/(const CONDITIONS_DATA = )(\[[\s\S]*?\n\]);/, (all, pre, arr) => {
    const a = JSON.parse(arr);
    for (const e of a) { const ko = e.en && G.condition[e.en]; if (ko && e.name !== ko) { nameMap[e.name] = ko; e.name = chg(p, 'condition', e.id, e.name, ko); } }
    return pre + JSON.stringify(a, null, 2) + ';';
  });
  // CONDITIONS (한글명 배열) — nameMap으로 치환
  src = src.replace(/(const CONDITIONS = )(\[[\s\S]*?\n\]);/, (all, pre, arr) => {
    const a = JSON.parse(arr).map(n => nameMap[n] ? chg(p, 'condition-list', n, n, nameMap[n]) : n);
    return pre + JSON.stringify(a, null, 2) + ';';
  });
  // TRAIT_DB — name_en(있으면)으로 용어집 trait/생물유형/피해 매칭, name_ko 갱신(id는 키라 보존)
  src = src.replace(/(const TRAIT_DB = )(\[[\s\S]*?\n\]);/, (all, pre, arr) => {
    const a = JSON.parse(arr);
    for (const e of a) {
      const en = e.name_en && e.name_en.trim();
      let ko = null;
      if (en) ko = G.trait[en] || G.creatureType[en] || G.damage[en] || traitBySlug[slugify(en)] || damageBySlug[slugify(en)];
      if (ko && e.name_ko) e.name_ko = chg(p, 'trait-db', e.id, e.name_ko, ko);
    }
    return pre + JSON.stringify(a, null, 2) + ';';
  });
  writes[p] = src;
  writes.__nameMap = nameMap;
}

// ── 4) 로그 출력 ──
const byCat = {}; for (const l of LOG) byCat[l.cat] = (byCat[l.cat] || 0) + 1;
console.log('=== 정본 용어집 파싱 ===');
console.log('condition', Object.keys(G.condition).length, '· trait', Object.keys(G.trait).length, '· damage', Object.keys(G.damage).length, '· skill', Object.keys(G.skill).length, '· creatureType', Object.keys(G.creatureType).length);
console.log('=== 변경 예정', LOG.length, '건 ===', JSON.stringify(byCat));
for (const l of LOG) console.log(`  [${l.cat}] ${l.file} :: ${l.key} : "${l.from}" → "${l.to}"`);

if (APPLY) {
  const stamp = process.env.NORM_DATE || '2026-07-01';
  let logMd = `# 번역 정규화 로그 (핵심 기계용어 → 정본 용어집)\n\n정본 = _glossary/Pathfinder2e.md. 생성 = tools/normalize_terms.mjs. 날짜 ${stamp}.\n\n`;
  logMd += `총 ${LOG.length}건. 카테고리별: ${JSON.stringify(byCat)}\n\n`;
  const grp = {}; for (const l of LOG) (grp[l.cat] = grp[l.cat] || []).push(l);
  for (const cat in grp) { logMd += `## ${cat} (${grp[cat].length})\n\n| 파일 | 키 | 기존 | 정본 |\n|---|---|---|---|\n`; for (const l of grp[cat]) logMd += `| ${l.file} | ${l.key} | ${l.from} | ${l.to} |\n`; logMd += '\n'; }
  delete writes.__nameMap;
  for (const p in writes) fs.writeFileSync(path.join(DEV, p), writes[p]);
  fs.mkdirSync(path.join(DEV, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(DEV, 'docs/번역정규화_로그.md'), logMd);
  console.log('\nAPPLIED', LOG.length, '건 →', Object.keys(writes).filter(k => k[0] !== '_').join(', '), '+ docs/번역정규화_로그.md');
} else {
  console.log('\n(dry-run) --apply 로 실제 적용.');
}
