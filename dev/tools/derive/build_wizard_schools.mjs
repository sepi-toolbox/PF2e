#!/usr/bin/env node
/* build_wizard_schools.mjs — 위저드 비전 학파(Arcane School) 정본 메타 = data/derived/wizard_schools.json
 *   소스: store feats 학파 classfeature(arcane-school 태그) 중 앱이 쓰는 7개 코어 학파.
 *   추출: 교육과정(curriculum: 랭크별 주문 풀) + 학파 주문(school spell: 초급/상급 focus). 전통=arcane(클래스 레벨에서 이미 적용).
 *   커리큘럼 규칙(위저드 정본): 각 랭크마다 커리큘럼 주문을 주문서에 추가 + 랭크별 보너스 준비 슬롯(캔트립1·주문1)을 커리큘럼에서 채움.
 *   실행: cd dev && node tools/derive/build_wizard_schools.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));
const asArray = raw => Array.isArray(raw) ? raw : (raw.items || Object.values(raw));
const feats = asArray(load('data/store/feats.json'));
const spells = asArray(load('data/store/spells.json'));
const uuid2slug = {}, uuid2ko = {}; for (const s of spells) { uuid2slug[s._id] = s.system.slug; uuid2ko[s._id] = s.name_ko || s.name; }
const spellSet = new Set(spells.map(s => s.system.slug));

// 앱 서브클래스 id ↔ 학파 classfeature slug(코어 7개만)
const SCHOOLS = {
  'school-ars-grammatica': 'school-of-ars-grammatica',
  'school-battle-magic': 'school-of-battle-magic',
  'school-boundary': 'school-of-the-boundary',
  'school-civic-wizardry': 'school-of-civic-wizardry',
  'school-mentalism': 'school-of-mentalism',
  'school-protean-form': 'school-of-protean-form',
  'school-unified': 'school-of-unified-magical-theory',
};
const RANKS = { cantrips: 'cantrip', '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, '7th': 7, '8th': 8, '9th': 9 };
const rows = []; let miss = 0;
for (const [subId, featSlug] of Object.entries(SCHOOLS)) {
  const f = feats.find(x => x.system.slug === featSlug);
  if (!f) { console.error('missing school feat', featSlug); continue; }
  const en = (f._desc_en || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const curriculum = {};
  const curM = en.match(/Curriculum\s+(.+?)\s+School Spells/);
  if (curM) {
    const parts = curM[1].split(/\b(cantrips|1st|2nd|3rd|4th|5th|6th|7th|8th|9th):/).filter(Boolean);
    for (let i = 0; i < parts.length; i += 2) {
      const label = parts[i]; if (RANKS[label] === undefined) continue;
      const ids = [...parts[i + 1].matchAll(/@UUID\[Compendium\.[^\]]*\.Item\.([A-Za-z0-9]+)\]/g)].map(m => m[1]);
      curriculum[RANKS[label]] = ids.map(id => ({ spell: uuid2slug[id], name_ko: uuid2ko[id] })).filter(x => x.spell);
    }
  }
  const school_spell = {};
  const spM = en.match(/School Spells\s+initial:\s*@UUID\[Compendium\.[^\]]*\.Item\.([A-Za-z0-9]+)\][^;]*(?:;\s*advanced:\s*@UUID\[Compendium\.[^\]]*\.Item\.([A-Za-z0-9]+)\])?/);
  if (spM) { school_spell.initial = uuid2slug[spM[1]]; if (spM[2]) school_spell.advanced = uuid2slug[spM[2]]; }
  for (const r in curriculum) for (const c of curriculum[r]) if (!spellSet.has(c.spell)) { console.error('MISS cur', subId, c.spell); miss++; }
  for (const k of ['initial', 'advanced']) if (school_spell[k] && !spellSet.has(school_spell[k])) { console.error('MISS sp', subId, k, school_spell[k]); miss++; }
  rows.push({ slug: subId, feature_slug: featSlug, name_ko: f.name_ko || f.name, name_en: f.name_en || f.name, tradition: 'arcane', curriculum, school_spell });
}
// 「학파 항목 읽는 법」 공통 용어 설명(전 학파 공통) → 전역 WIZARD_SCHOOL_GUIDE. 소서러 혈통·오라클 신비 가이드와 동일 역할.
const guide = [
  { term: '전통', def: '위저드는 항상 신비(arcane) 전통과 그 주문 목록을 사용합니다.' },
  { term: '교육과정', def: '학파가 지정한 주문 목록입니다(아래 랭크별 나열). 이 주문들이 위저드의 주문서에 자동으로 들어오며, 시전 가능한 각 주문 랭크마다 이 목록의 주문만 준비할 수 있는 보너스 준비 슬롯 1개를 추가로 얻습니다.' },
  { term: '학파 주문', def: '학파가 부여하는 집중 주문입니다. 1레벨에 초급 학파 주문을 얻고, 「고급 학파 주문」 재주로 상급 학파 주문을 추가로 얻습니다. 집중 점수로 시전하고 재집중으로 회복합니다.' },
  { term: '아케인 결속', def: '위저드 공통 특성입니다. 매일 아이템 하나를 결속해 「결속 아이템 소진」 자유 행동으로 소비한 주문 슬롯의 주문을 한 번 더 시전할 수 있습니다.' },
];

const note = '위저드 비전 학파 정본 메타(코어 7종). 소스=store 학파 classfeature 파생. tradition=arcane(클래스 레벨 적용), curriculum=랭크별 교육과정 주문 풀(주문서 추가+보너스 준비슬롯), school_spell=학파 주문(초급/상급 focus). WIZARD_SCHOOL_DB/WIZARD_SCHOOL_GUIDE가 로드.';
fs.writeFileSync(path.join(DEV, 'data/derived/wizard_schools.json'), JSON.stringify({ rows, guide, note }, null, 1) + '\n');
console.log(`✔ wizard_schools.json — 학파 ${rows.length}종 (참조 미해소 ${miss})`);
if (miss) process.exit(1);
