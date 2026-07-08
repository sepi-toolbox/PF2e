#!/usr/bin/env node
/* build_domains.mjs — 신격 영역(Domain) 통합 테이블
 * 각 영역: slug · name_en/ko · desc_en/ko · initial(집중주문 슬러그)+initial_ko · advanced+advanced_ko
 * 규칙: 영역은 집중주문 2개(초기=영역입문 / 고급=고급영역 재주로 습득). 클레릭은 자기 신격 영역에서만 선택.
 * 소스:
 *   - 영역 집합 = deities.json이 참조하는 primary/alternate 슬러그 전량(정본) ∪ SEED
 *   - initial/advanced 슬러그 = SEED(구 DOMAIN_DB 61 큐레이션 + Divine Mysteries 신규 3)  ← 트레잇 자동파생 불가(원소만 식별)
 *   - name_en/desc_en = pf2e 시스템 en.json PF2E.Item.Deity.Domain.<Pascal>
 *   - name_ko/desc_ko = PF2e-KR ko.json 동일 경로(정본) → 폴백 SEED.name / 신규3 인라인
 *   - initial_ko/advanced_ko = spells 스토어 slug→name_ko
 * 산출: data/derived/domains.json  (shape rows)
 * 실행: cd dev && node tools/derive/build_domains.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const HOME = process.env.HOME;
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

const deities = load(path.join(DEV, 'data/store/deities.json')) || [];
const spells = load(path.join(DEV, 'data/store/spells.json')) || [];
const en = load(path.join(HOME, 'Library/Application Support/FoundryVTT/Data/systems/pf2e/lang/en.json')) || {};
const kr = load('/tmp/PF2e-KR/lang/ko.json')
        || load(path.join(HOME, 'Library/Application Support/FoundryVTT/Data/modules/PF2e-KR/lang/ko.json')) || {};

const EN_DOM = (en.PF2E && en.PF2E.Item && en.PF2E.Item.Deity && en.PF2E.Item.Deity.Domain) || {};
const KR_DOM = (kr.PF2E && kr.PF2E.Item && kr.PF2E.Item.Deity && kr.PF2E.Item.Deity.Domain) || {};

// slug → PascalCase(en.json/ko.json 키). 영역 슬러그는 전부 단일어.
const pascal = s => s ? s[0].toUpperCase() + s.slice(1) : s;

// 주문 slug → name_ko 인덱스
const spellArr = Array.isArray(spells) ? spells : Object.values(spells);
const SPELL_KO = {};
for (const sp of spellArr) { const sl = sp.system && sp.system.slug; if (sl) SPELL_KO[sl] = sp.name_ko || sp.name || sl; }

// SEED: 구 DOMAIN_DB(초기/고급 슬러그 큐레이션, AoN 검수) + Divine Mysteries 신규 3
//  name은 폴백용(PF2e-KR 있으면 그쪽 우선). desc_en/ko는 en.json/KR에 없는 신규 3만 인라인.
const SEED = load(path.join(__dirname, 'domains_seed.json')) || {};

// 영역 집합 = 신격 참조 전량 ∪ SEED
const domSet = new Set(Object.keys(SEED));
const darr = Array.isArray(deities) ? deities : Object.values(deities);
for (const d of darr) {
  const dm = (d.system && d.system.domains) || {};
  (dm.primary || []).forEach(s => domSet.add(s));
  (dm.alternate || []).forEach(s => domSet.add(s));
}

const rows = [];
const missingSpell = [];
for (const slug of [...domSet].sort()) {
  const seed = SEED[slug] || {};
  const P = pascal(slug);
  const enE = EN_DOM[P] || {};
  const krE = KR_DOM[P] || {};
  const initial = seed.initial || '';
  const advanced = seed.advanced || '';
  if (initial && !SPELL_KO[initial]) missingSpell.push(`${slug}.initial=${initial}`);
  if (advanced && !SPELL_KO[advanced]) missingSpell.push(`${slug}.advanced=${advanced}`);
  rows.push({
    slug,
    name_en: enE.Label || seed.name_en || pascal(slug),
    name_ko: krE.Label || seed.name_ko || seed.name || slug,
    initialSpell: initial,
    initialSpell_ko: initial ? (SPELL_KO[initial] || initial) : '',
    advancedSpell: advanced,
    advancedSpell_ko: advanced ? (SPELL_KO[advanced] || advanced) : '',
    desc_ko: krE.Description || seed.desc_ko || '',
    desc_en: enE.Description || seed.desc_en || '',
  });
}

const noInitial = rows.filter(r => !r.initialSpell).map(r => r.slug);
const out = {
  rows,
  note: `영역 ${rows.length}종. 집중주문 슬러그 미해소 ${missingSpell.length}건, initial 없는 영역 ${noInitial.length}종.`,
};
fs.writeFileSync(path.join(DEV, 'data/derived/domains.json'), JSON.stringify(out, null, 2));
console.log(`✅ domains.json: ${rows.length}종`);
if (missingSpell.length) console.log('  ⚠ 주문 슬러그 미해소:', missingSpell.join(', '));
if (noInitial.length) console.log('  ⚠ initial 없는 영역:', noInitial.join(', '));
