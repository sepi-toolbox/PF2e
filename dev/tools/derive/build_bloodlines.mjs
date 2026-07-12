#!/usr/bin/env node
/* build_bloodlines.mjs — 소서러 혈통(bloodline) 정본 메타 = data/derived/bloodlines.json
 *   런타임 BLOODLINE_DB(cs_pf2e_class.js)가 로드. DOMAIN_DB(build_domains)와 동형 모델.
 *   소스 = store/feats.json 혈통 특성(bloodline-*)의 FVTT desc(영문 원문, @UUID→slug는 PF.getByUuid).
 *   각 혈통에서 추출:
 *     tradition(또는 'variable') / skills(고정 훈련 기술 slug) / variable_skill(드라코닉식 택1)
 *     initial·advanced·greater(혈통 집중주문 slug) / granted(부여 레퍼토리 주문 [{rank,slug,charLevel}])
 *     blood_magic(name_ko/en) / exemplars(드라코닉/뷔름블레스드 표본별 tradition·skill·granted override)
 *   실행: cd dev && node tools/derive/build_bloodlines.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const PF = require(path.join(DEV, 'cs_pf2e.js'));

const SKILL_EN2SLUG = {
  Acrobatics: 'acrobatics', Arcana: 'arcana', Athletics: 'athletics', Crafting: 'crafting',
  Deception: 'deception', Diplomacy: 'diplomacy', Intimidation: 'intimidation', Medicine: 'medicine',
  Nature: 'nature', Occultism: 'occultism', Performance: 'performance', Religion: 'religion',
  Society: 'society', Stealth: 'stealth', Survival: 'survival', Thievery: 'thievery',
};
// 부여 레퍼토리 주문(Granted Spells)의 랭크 라벨 → 획득 캐릭터 레벨(랭크 N = 2N-1레벨).
const RANK_LABEL = { cantrip: { rank: 0, charLevel: 1 } };
for (let n = 1; n <= 10; n++) RANK_LABEL[n + (['th','st','nd','rd'][n] || 'th')] = { rank: n, charLevel: 2 * n - 1 };
RANK_LABEL['1st'] = { rank: 1, charLevel: 1 }; RANK_LABEL['2nd'] = { rank: 2, charLevel: 3 };
RANK_LABEL['3rd'] = { rank: 3, charLevel: 5 };

function uuidToSpell(uuid) {
  try { const t = PF.getByUuid(String(uuid).trim().split(/\s+/)[0]); return t && t.type === 'spell' ? t : null; } catch (e) { return null; }
}
function slugKo(uuid) {
  const t = uuidToSpell(uuid);
  return t ? { slug: (t.system && t.system.slug) || t._id, ko: PF.nameKo(t) } : null;
}
// "<strong>Label</strong> value</p>" 구간 추출(label 정확 매칭, 다음 <strong> 또는 </p>까지)
function section(html, label) {
  const re = new RegExp('<strong>' + label + '(?:[—-][^<]*)?</strong>\\s*([\\s\\S]*?)(?:</p>)', 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}
function parseSkills(seg) {
  if (!seg) return { skills: [], variable: false };
  const skills = [];
  for (const [en, sl] of Object.entries(SKILL_EN2SLUG)) if (new RegExp('\\b' + en + '\\b').test(seg)) skills.push(sl);
  const variable = /one other skill|other skill/i.test(seg);
  return { skills, variable };
}
function parseBloodlineSpells(seg) {
  const out = {};
  if (!seg) return out;
  for (const tag of ['initial', 'advanced', 'greater']) {
    const m = seg.match(new RegExp(tag + ':\\s*@UUID\\[([^\\]]+)\\]', 'i'));
    if (m) { const sk = slugKo(m[1]); if (sk) out[tag] = sk; }
  }
  return out;
}
function parseGranted(seg) {
  // "cantrip @UUID..., 1st: @UUID..., 2nd: @UUID..." → [{rank,charLevel,slug,ko}]
  const out = [];
  if (!seg) return out;
  const re = /(cantrip|\d+(?:st|nd|rd|th))\s*:?\s*@UUID\[([^\]]+)\]/gi;
  let m;
  while ((m = re.exec(seg))) {
    const key = m[1].toLowerCase();
    const meta = RANK_LABEL[key];
    const sk = slugKo(m[2]);
    if (meta && sk) out.push({ rank: meta.rank, charLevel: meta.charLevel, slug: sk.slug, ko: sk.ko });
  }
  return out;
}
function bloodMagic(html, slug) {
  const m = html.match(/<strong>Blood Magic(?:[—-]([^<]*))?<\/strong>\s*([\s\S]*?)<\/p>/i);
  if (!m) return null;
  const nameEn = (m[1] || '').trim();
  const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return { name_en: nameEn, text };
}
// 표본/원소/지니 유형 한글명(정본 용어)
const EXEMPLAR_KO = {
  Arcane: '아케인', Divine: '신성', Occult: '오컬트', Primal: '프라이멀',
  Air: '공기', Earth: '대지', Fire: '불', Metal: '금속', Water: '물', Wood: '나무',
  Janni: '잔니', Jaathoom: '자툼', Ifrit: '이프리트', Faydhaan: '파이드한', Jabali: '자발리',
};
// 표본/원소/지니 유형 <ul><li> 목록 파싱(옵션별 tradition·skill·damage·gifts override).
//   형식: draconic="Name—Tradition</strong> t; <strong>Bloodline Skill</strong> S; <strong>Sorcerous Gifts</strong> ..."
//         elemental="Element—Sorcerous Gifts</strong> ...; <strong>Blood Magic Damage</strong> d"
//         genie="Genie</strong> 2nd: ..." (gifts만)
function parseExemplars(html) {
  const ulMatch = html.match(/<ul>([\s\S]*?)<\/ul>/i);
  if (!ulMatch) return null;
  const items = ulMatch[1].split(/<li>/i).slice(1);
  const ex = [];
  for (const it of items) {
    const nameM = it.match(/<strong>([A-Za-z][A-Za-z'’ ]*?)(?:—|<\/strong>)/);
    if (!nameM) continue;
    const trad = it.match(/Tradition<\/strong>\s*([a-z]+)/i);
    const skill = it.match(/Bloodline Skill<\/strong>\s*([A-Za-z]+)/i);
    const dmg = it.match(/Blood Magic Damage<\/strong>\s*([a-z]+)/i);
    const gifts = parseGranted(it);   // 옵션별 재능 주문 override
    const nameEn = nameM[1].trim();
    ex.push({
      name_en: nameEn, name_ko: EXEMPLAR_KO[nameEn] || nameEn,
      tradition: trad ? trad[1].toLowerCase() : null,
      skill: skill && SKILL_EN2SLUG[skill[1]] ? SKILL_EN2SLUG[skill[1]] : null,
      damage: dmg ? dmg[1].toLowerCase() : null,
      gifts,
    });
  }
  return ex.length ? ex : null;
}

// 「혈통 항목 읽는 법」 정본 용어 설명(클래스 규칙, 전 혈통 공통) = bloodline-spells 항목 한글 desc에서 추출.
//   각 혈통 박스의 값(전통/혈통 기술/마법적 재능/혈통 주문/혈통 마법)이 '무엇인지' 설명하는 범례.
function extractGuide(feats) {
  const item = (Array.isArray(feats) ? feats : Object.values(feats)).find(r => (r.system && r.system.slug) === 'bloodline-spells');
  if (!item) return null;
  const ko = item._desc_ko || (item.system && item.system.description && item.system.description.value) || '';
  const i = ko.indexOf('혈통 항목');
  const seg = i >= 0 ? ko.slice(i) : ko;
  const guide = [];
  const re = /<strong>\s*(전통|혈통 기술|마법적 재능|혈통 주문|혈통 마법)\s*<\/strong>\s*([^<]+)/g;
  let m;
  while ((m = re.exec(seg))) guide.push({ term: m[1].trim(), def: m[2].trim() });
  return guide.length ? guide : null;
}

const feats = JSON.parse(fs.readFileSync(path.join(DEV, 'data/store/feats.json'), 'utf8'));
const rows = [];
for (const r of (Array.isArray(feats) ? feats : Object.values(feats))) {
  const sys = r.system || {};
  const slug = sys.slug || '';
  if (!slug.startsWith('bloodline-')) continue;
  const html = (sys.description && sys.description.value) || '';
  // 리마스터 18혈통만: Bloodline Skills + Bloodline Spells 둘 다 있는 것(레거시 paragon/spells 제외)
  if (!/Bloodline Skills/i.test(html) || !/Bloodline Spells/i.test(html)) continue;
  const skillSeg = section(html, 'Bloodline Skills');
  const { skills, variable } = parseSkills(skillSeg);
  const bspells = parseBloodlineSpells(section(html, 'Bloodline Spells'));
  if (!bspells.initial) continue;   // 레거시 집합 항목(bloodline-spells 등) 제외 — 실제 혈통만
  const granted = parseGranted(section(html, 'Granted Spells') || section(html, 'Sorcerous Gifts'));
  const tradM = section(html, 'Tradition') || section(html, 'Spell List');
  const tradition = tradM ? tradM.replace(/<[^>]+>/g, '').trim().split(/\s+/)[0].toLowerCase() : 'variable';
  const exemplars = parseExemplars(html);
  const flat = (o) => o ? o.slug : null, flatKo = (o) => o ? o.ko : null;
  rows.push({
    slug, name_en: r.name_en || r.name, name_ko: PF.nameKo(r),
    tradition, skills, variable_skill: variable,
    initial: flat(bspells.initial), initial_ko: flatKo(bspells.initial),
    advanced: flat(bspells.advanced), advanced_ko: flatKo(bspells.advanced),
    greater: flat(bspells.greater), greater_ko: flatKo(bspells.greater),
    granted, blood_magic: bloodMagic(html), exemplars,
  });
}
rows.sort((a, b) => a.slug.localeCompare(b.slug));
const guide = extractGuide(feats);
const out = { rows, guide, note: '소서러 혈통 정본 메타(런타임 BLOODLINE_DB). build_bloodlines.mjs 생성(소스=store/feats.json bloodline-* FVTT desc). guide=혈통 항목 읽는 법(bloodline-spells 항목).' };
fs.writeFileSync(path.join(DEV, 'data/derived/bloodlines.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`✔ bloodlines.json — ${rows.length}혈통`);
for (const r of rows) console.log(`  ${r.slug}: 전통=${r.tradition} 기술=[${r.skills}]${r.variable_skill?'+택1':''} 집중=${r.initial}/${r.advanced}/${r.greater} 부여${r.granted.length} 표본${r.exemplars?r.exemplars.map(e=>e.name_en+'('+e.tradition+'/'+e.skill+')').join(','):0}`);
