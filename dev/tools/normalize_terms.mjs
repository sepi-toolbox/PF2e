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
  action: parseSection('주요 행동'),
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

// (e) overlay/actions.ko.json : name = 용어집 주요행동
{
  const p = 'data/overlay/actions.ko.json'; const j = JSON.parse(fs.readFileSync(path.join(DEV, p), 'utf8'));
  const actBySlug = {}; for (const en in G.action) actBySlug[slugify(en)] = G.action[en];
  for (const slug in j) { const ko = actBySlug[slug]; if (ko && j[slug] && j[slug].name) j[slug].name = chg(p, 'action', slug, j[slug].name, ko); }
  writes[p] = JSON.stringify(j, null, 1) + '\n';
}
// (f) data/derived/system_terms.json : name_ko(damage_type/skill/ability/rarity)
{
  const p = 'data/derived/system_terms.json'; const j = JSON.parse(fs.readFileSync(path.join(DEV, p), 'utf8'));
  const rarityBySlug = {}; for (const en of ['Rare', 'Uncommon', 'Common', 'Unique']) if (G.trait[en]) rarityBySlug[en.toLowerCase()] = G.trait[en];
  for (const r of j.rows) {
    const k = r.type, en = (r.name_en || '').trim(), sl = r.slug; let ko = null;
    if (k === 'damage_type') ko = damageBySlug[sl] || G.damage[en];
    else if (k === 'skill') { const e = Object.keys(G.skill).find(x => slugify(x) === sl); ko = e && G.skill[e]; }
    else if (k === 'ability') ko = abilityBySlug[sl];
    else if (k === 'rarity') ko = rarityBySlug[sl];
    if (ko && r.name_ko) r.name_ko = chg(p, k, sl, r.name_ko, ko);
  }
  writes[p] = JSON.stringify(j, null, 1) + '\n';
}
// (g) 조건 @UUID 라벨 정본화: 라벨을 id→slug→용어집 정본으로 교체.
// ⚠ 안전: 라벨 내부에 중괄호/대괄호({},[])가 없는 '단순 텍스트 라벨'만 매칭([[/act ...]] 매크로 임베드 라벨은 건드리지 않음 — 경계오인 손상 방지).
const condId = {}; for (const x of baseArr('data/base/conditions.base.json')) { if (x._id && x.system && x.system.slug) condId[x._id] = x.system.slug; }
const canonBySlug = {}; for (const slug in condSlugEn) { const ko = G.condition[condSlugEn[slug]]; if (ko) canonBySlug[slug] = ko; }
let labelCount = 0;
function labelSweep(text) {
  return text.replace(/@UUID\[Compendium\.pf2e\.conditionitems\.Item\.(\w+)\]\{([^{}\[\]]*)\}/g, (m, id, label) => {
    const slug = condId[id]; const canon = slug && canonBySlug[slug]; if (!canon) return m;
    const num = label.match(/\s(\d+)\s*$/); const nl = canon + (num ? ' ' + num[1] : '');
    if (nl !== label) labelCount++;
    return `@UUID[Compendium.pf2e.conditionitems.Item.${id}]{${nl}}`;
  });
}
const LABEL_FILES = ['data/overlay/feats.ko.json', 'data/overlay/spells.ko.json', 'data/overlay/actions.ko.json', 'data/overlay/effects.ko.json', 'data/overlay/equipment.ko.json', 'data/overlay/conditions.ko.json', 'data/overlay/heritages.ko.json', 'data/overlay/backgrounds.ko.json', 'data/overlay/deities.ko.json', 'data/overlay/ancestries.ko.json', 'data/overlay/classes.ko.json', 'data/derived/localize.ko.json', 'data/derived/traits.json', 'data/creatures/_trait_desc.ko.json', 'data/creatures/_glossary.ko.json', 'cs_data.js', 'data/overlay/_lang.ko.json'];
for (const p of LABEL_FILES) { let t = writes[p] !== undefined ? writes[p] : fs.readFileSync(path.join(DEV, p), 'utf8'); writes[p] = labelSweep(t); }

// (h) 설명문 평문 조건 참조 — "X 상태" 앵커 안전 치환(옛 FVTT어→정본). 상태(=조건) 접미가 게임 조건을 강하게 지시.
// ⚠ 공통명사성 강한 옛어(실명/부서진/부러진/투명한)는 제외(일반 산문 오탐 위험). 값 미동반 평문(예 "병약 2와")은 미처리(정밀 패스).
const PROSE_MAP = { '가려진': '은폐', '서투른': '둔함', '병약': '구역질', '느려짐': '둔화', '엎드린': '넘어뜨려짐', '붙잡힌': '조이기', '흡수됨': '생명력 고갈', '눈부신': '눈부심', '고정된': '이동 불가', '혼미': '멍청함', '구속됨': '억제', '제어됨': '지배됨', '신속': '가속', '매혹된': '매혹', '피곤함': '피로' };
let proseCount = 0;
function proseSweep(text) {
  for (const oldk in PROSE_MAP) { const re = new RegExp(oldk + '( \\d+)? 상태', 'g'); text = text.replace(re, (m, num) => { proseCount++; return PROSE_MAP[oldk] + (num || '') + ' 상태'; }); }
  return text;
}
const PROSE_FILES = ['data/overlay/feats.ko.json', 'data/overlay/spells.ko.json', 'data/overlay/effects.ko.json', 'data/overlay/equipment.ko.json', 'data/overlay/conditions.ko.json', 'data/overlay/heritages.ko.json', 'data/overlay/backgrounds.ko.json', 'data/overlay/deities.ko.json', 'data/overlay/ancestries.ko.json', 'data/overlay/actions.ko.json',
  // 크리처 번역도 동일 스윕(2026-07-02 전수검사부터 포함)
  ...fs.readdirSync(path.join(DEV, 'data/creatures')).filter(f => /\.ko\.json$/.test(f) && !f.startsWith('_')).map(f => 'data/creatures/' + f)];
for (const p of PROSE_FILES) { let t = writes[p] !== undefined ? writes[p] : fs.readFileSync(path.join(DEV, p), 'utf8'); writes[p] = proseSweep(t); }

// (i) 설명문 평문 고정구 정본화 — 게임 고정 용어구라 앵커 불필요(일반 산문 오탐 없음).
// ⚠ '마스터'(일반어/이름)·'특기'(일반어)·'대가'(일반어)는 문맥판단 필요라 제외(별도 정밀 패스).
const TERM_MAP = { '공격 굴림': '명중 굴림', '오프-가드': '무방비', '오프 가드': '무방비',
  // 피해유형·기술 정본화(2026-07-02 전수검사): 용어집 정본 = force 역장(2026-07-02 사용자 정정, 힘 아님)·vitality 활력·spirit 영혼·sonic 음파·Intimidation 위협·Society 사회
  '힘 피해': '역장 피해', '포스 피해': '역장 피해', '생명력 피해': '활력 피해', '정신력 피해': '영혼 피해',
  '협박 판정': '위협 판정', '협박 기술': '위협 기술', '사회학': '사회',
  '음향 효과': '음파 효과', '음향적 효과': '음파 효과', '음향 특성': '음파 특성' };
let termCount = 0;
function termSweep(text) {
  for (const o in TERM_MAP) { const re = new RegExp(o, 'g'); text = text.replace(re, () => { termCount++; return TERM_MAP[o]; }); }
  return text;
}
for (const p of PROSE_FILES) { let t = writes[p] !== undefined ? writes[p] : fs.readFileSync(path.join(DEV, p), 'utf8'); writes[p] = termSweep(t); }

// ── 4) 로그 출력 ──
const byCat = {}; for (const l of LOG) byCat[l.cat] = (byCat[l.cat] || 0) + 1;
console.log('=== 정본 용어집 파싱 ===');
console.log('condition', Object.keys(G.condition).length, '· trait', Object.keys(G.trait).length, '· damage', Object.keys(G.damage).length, '· skill', Object.keys(G.skill).length, '· creatureType', Object.keys(G.creatureType).length);
console.log('=== 변경 예정', LOG.length, '건 ===', JSON.stringify(byCat));
for (const l of LOG) console.log(`  [${l.cat}] ${l.file} :: ${l.key} : "${l.from}" → "${l.to}"`);
console.log('=== 조건 @UUID 라벨(단순) 정본화:', labelCount, '건 ===');
console.log('=== 설명문 "X 상태" 조건 평문 정본화:', proseCount, '건 ===');
console.log('=== 설명문 고정구 정본화(공격굴림→명중굴림, 오프가드→무방비):', termCount, '건 ===');

if (APPLY) {
  const stamp = process.env.NORM_DATE || '2026-07-01';
  let logMd = `# 번역 정규화 로그 (핵심 기계용어 → 정본 용어집)\n\n정본 = _glossary/Pathfinder2e.md. 생성 = tools/normalize_terms.mjs. 날짜 ${stamp}.\n\n`;
  logMd += `총 ${LOG.length}건(name). 카테고리별: ${JSON.stringify(byCat)}\n조건 @UUID 단순라벨 정본화: ${labelCount}건.\n\n`;
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
