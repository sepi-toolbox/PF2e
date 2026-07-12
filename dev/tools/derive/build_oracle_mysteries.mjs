#!/usr/bin/env node
/* build_oracle_mysteries.mjs — 오라클 신비(Mystery) 정본 메타 = data/derived/oracle_mysteries.json
 *   소스: data/store/feats.json 신비 classfeature(oracle-mystery 태그) 11종의 _desc_en/_desc_ko + rules.
 *   추출: 미스터리 기술 + 전통(divine 고정) + 부여 레퍼토리 주문 4종(캔트립+3랭크) + 계시 주문(초급/상급/고급) +
 *         관련 영역 4 + 예언의 저주(curse-of-*) + 오라클 보너스 재주(GrantItem).
 *   런타임 MYSTERY_DB(cs_pf2e_class.js)가 이걸 로드 → subclassList가 오라클 서브클래스에 granted_skills/tradition/
 *   granted_spells 주입(소서러 BLOODLINE_DB와 동일 패턴, 대원칙 0=성장/정체성 부여).
 *   실행: cd dev && node tools/derive/build_oracle_mysteries.mjs
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
const byId = {}, bySlug = {};
for (const f of feats) { byId[f._id] = f; bySlug[f.system.slug] = f; }
const uuid2slug = {}, uuid2ko = {};
for (const s of spells) { uuid2slug[s._id] = s.system.slug; uuid2ko[s._id] = s.name_ko || s.name; }
const spellSet = new Set(spells.map(s => s.system.slug));

const SKILL = { Acrobatics: 'acrobatics', Arcana: 'arcana', Athletics: 'athletics', Crafting: 'crafting', Deception: 'deception', Diplomacy: 'diplomacy', Intimidation: 'intimidation', Medicine: 'medicine', Nature: 'nature', Occultism: 'occultism', Performance: 'performance', Religion: 'religion', Society: 'society', Stealth: 'stealth', Survival: 'survival', Thievery: 'thievery' };
const RANKS = { cantrip: 'cantrip', '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, '7th': 7 };

// 신비 slug = oracle-mystery 태그를 가진 classfeature
const mysteries = feats.filter(f => f.system.category === 'classfeature' && (f.system.traits?.otherTags || []).includes('oracle-mystery'))
  .map(f => f.system.slug).sort();

const rows = [];
let miss = 0;
for (const m of mysteries) {
  const f = bySlug[m]; const s = f.system;
  const en = (f._desc_en || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const granted = [], revelation = {};
  for (const mm of en.matchAll(/(cantrip|1st|2nd|3rd|4th|5th|6th|7th|initial|advanced|greater):\s*@UUID\[Compendium\.[^\]]*\.Item\.([A-Za-z0-9]+)\]/g)) {
    const label = mm[1], id = mm[2], slug = uuid2slug[id];
    if (['initial', 'advanced', 'greater'].includes(label)) revelation[label] = slug;
    else {
      const rank = RANKS[label] ?? label;
      // 부여 레퍼토리 주문은 해당 랭크를 시전할 수 있게 되는 캐릭터 레벨에 추가(캔트립=1, 랭크N=2N-1). 소서러 혈통과 동일.
      const char_level = (rank === 'cantrip' || rank === 0) ? 1 : (2 * rank - 1);
      granted.push({ rank, char_level, spell: slug, name_ko: uuid2ko[id] });
    }
  }
  const skillM = en.match(/Mystery Skill\s+([A-Za-z]+)(\s+and one Lore skill of your choice)?/i);
  const domM = en.match(/Related Domains\s+([a-z, ]+?)\s+Mystery Skill/i);
  // GrantItem rules → 저주(curse-of-*) + 오라클 보너스 재주
  const grantSlugs = (s.rules || []).filter(r => r.key === 'GrantItem' && r.uuid).map(r => { const g = byId[('' + r.uuid).split('.').pop()]; return g ? g.system.slug : null; }).filter(Boolean);
  const curse = grantSlugs.find(x => x.startsWith('curse-of-')) || null;
  const oracleFeat = grantSlugs.find(x => !x.startsWith('curse-of-')) || null;
  const curseFeat = curse ? bySlug[curse] : null;

  // 참조 무결성
  for (const g of granted) if (!spellSet.has(g.spell)) { console.error('MISS granted', m, g.spell); miss++; }
  for (const k of ['initial', 'advanced', 'greater']) if (revelation[k] && !spellSet.has(revelation[k])) { console.error('MISS rev', m, k, revelation[k]); miss++; }
  if (curse && !bySlug[curse]) { console.error('MISS curse', m, curse); miss++; }

  rows.push({
    slug: m, name_ko: f.name_ko || f.name, name_en: f.name_en || f.name,
    tradition: 'divine',
    mystery_skill: skillM ? (SKILL[skillM[1]] || null) : null,
    lore_choice: !!(skillM && skillM[2]),
    granted_spells: granted,
    revelation,
    domains: domM ? domM[1].split(',').map(x => x.trim()).filter(Boolean) : [],
    curse, curse_name_ko: curseFeat ? (curseFeat.name_ko || curseFeat.name) : null, curse_name_en: curseFeat ? (curseFeat.name_en || curseFeat.name) : null,
    oracle_feat: oracleFeat,
  });
}

// 「신비 항목 읽는 법」 공통 용어 설명(전 신비 공통) → 전역 MYSTERY_GUIDE. 소서러 혈통 가이드와 동일 역할.
//   신비 드롭다운 위에 항상 노출(desc의 bold 라벨 = 부여 주문/계시 주문/관련 영역/미스터리 스킬/오라클 재주/예언의 저주와 대응).
//   정본 = mystery/revelation-spells/oracular-curse 클래스특성 desc 요약(큐레이션).
const guide = [
  { term: '전통', def: '오라클은 항상 신성(divine) 전통과 그 주문 목록을 사용합니다.' },
  { term: '부여 주문', def: '신비가 나열한 주문을 자동으로 주문 목록(레퍼토리)에 추가합니다. 1레벨에 캔트립 하나와 1랭크 주문 하나를 얻고, 나머지는 해당 랭크의 주문을 시전할 수 있게 되는 즉시 습득합니다.' },
  { term: '계시 주문', def: '신비가 부여하는 특별한 포커스 주문입니다. 1레벨에 신비가 정해주는 초급 계시 주문을 배우며, 「고급 계시」·「대계시」 재주로 상급·고급 계시 주문을 추가로 얻습니다. 포커스 포인트로 시전하고 재집중으로 회복합니다.' },
  { term: '미스터리 스킬', def: '나열된 기술에 숙련됩니다.' },
  { term: '관련 영역', def: '이 신비와 관련된 신성 영역입니다. 「신성한 접근」(11레벨) 등에서 사용합니다.' },
  { term: '오라클 재주', def: '이 신비가 접근을 부여하는 오라클 재주입니다.' },
  { term: '예언의 저주', def: '신비가 정해주는 고유한 저주입니다. 저주 결속 능력을 쓸수록 「저주 묶임(cursebound)」 수치가 오르며 혜택과 대가가 함께 커지고, 재집중할 때 1단계 감소합니다.' },
];

const note = '오라클 신비 정본 메타(11종). 소스=store feats 신비 classfeature 파생. tradition=divine 고정, mystery_skill=미스터리 기술, granted_spells=부여 레퍼토리(캔트립+3랭크), revelation=계시주문(초급/상급/고급 focus), curse=예언의 저주, oracle_feat=신비 보너스 재주. MYSTERY_DB/MYSTERY_GUIDE가 로드.';
fs.writeFileSync(path.join(DEV, 'data/derived/oracle_mysteries.json'), JSON.stringify({ rows, guide, note }, null, 1) + '\n');
console.log(`✔ oracle_mysteries.json — 신비 ${rows.length}종 (참조 미해소 ${miss})`);
if (miss) process.exit(1);
