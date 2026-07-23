#!/usr/bin/env node
/* build_subclasses.mjs — 서브클래스 단일소스 테이블 = data/derived/subclasses.json (런타임 SUBCLASS_DB가 이걸 로드)
 *  런타임 조립을 그대로 구움(parity by construction):
 *    ① 큐레이션 6클래스(subclasses_curated.json = bard/druid/ranger/rogue/witch/wizard, PC1 리치데이터)
 *    ② FVTT 파생(cs_pf2e_class.subclassList: 신규 클래스, granted_feats/spells·desc)
 *    ③ 클레릭 교의(cleric_doctrines.json 큐레이션, prof_changes/features)
 *  = PF2eClass.init()이 _mergeIntoGlobals + loadDoctrines로 조립하는 결과 전량.
 *  desc는 enrichDesc 결과(런타임 SUBCLASS_DB와 동일). 표시용 별칭 slug/class/grants/rules_n 부가.
 *  실행: cd dev && node tools/derive/build_subclasses.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

// ① 큐레이션 6클래스를 전역 SUBCLASS_DB 초기값으로(하니스: 브라우저 전역을 globalThis로 모사)
const curated = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclasses_curated.json'), 'utf8')).rows;
globalThis.SUBCLASS_DB = curated.map(x => ({ ...x }));
globalThis.CLASS_FEATURE_NAMES = {};
globalThis.CLASS_SPELL_TABLE = {};

// ②③ PF2eClass.init → _mergeIntoGlobals(FVTT 서브클래스) + loadDoctrines(cleric) 가 globalThis.SUBCLASS_DB에 병합
const PFClass = await import(path.join(DEV, 'cs_pf2e_class.js'));
await PFClass.default.init();
const SD = globalThis.SUBCLASS_DB;

// 위저드 비전 학파 = 큐레이션 stub의 한 줄 desc 대신 정본 FVTT 특성(school-of-*)의 완전한 _desc_ko(@link 교육과정·학파주문 포함)로 교체.
//   소서러 혈통·오라클 신비처럼 정본 설명·링크가 나오도록. 매핑=wizard_schools.json feature_slug. (구조 필드 granted_spells/prof는 큐레이션 유지)
{
  const PF = (await import(path.join(DEV, 'cs_pf2e.js'))).default;
  PF.loadCategorySync('feats'); PF.loadCategorySync('spells');
  const ws = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/wizard_schools.json'), 'utf8'));
  const wsRows = Array.isArray(ws) ? ws : (ws.rows || Object.values(ws));
  const featBySlug = {};
  for (const f of PF.all('feats')) { const s = f.system && f.system.slug; if (s) featBySlug[s] = f; }
  let patched = 0;
  for (const s of SD) {
    if (s.class_id !== 'wizard') continue;
    const meta = wsRows.find(w => w.slug === s.id || w.feature_slug === s.id);
    const feat = meta && featBySlug[meta.feature_slug];
    if (!feat) continue;
    const nameKo = PF.nameKo(feat), nameEn = feat.name || feat.name_en || s.name_en;
    s.desc = PF.enrichDesc(PF.descKo(feat) || '');   // 완전 정본 설명(교육과정·학파주문 @link)
    s.name_en = nameEn;                               // 「Ars Grammatica」 stub → 「School of Ars Grammatica」
    // 클래스 특성 = 학파 특성 slug로 참조(레지스트리 해소→링크·정본명). 수기 desc 제거.
    s.features = [{ lv: 1, slug: meta.feature_slug, name_ko: nameKo, name_en: nameEn, kind: 'feature' }];
    patched++;
  }
  console.log(`  위저드 학파 정본 desc/feature 주입: ${patched}종`);
}

// 표시용 별칭(DataManager 서브클래스 탭: slug/class/grants/rules_n) 부가 — 런타임 필드(id/class_id/...)는 보존
const rows = SD.map(s => ({
  slug: s.id, class: s.class_id,
  ...s,
  grants: (s.granted_feats || []).length + (s.granted_spells || []).length + (s.granted_actions || []).length,
  rules_n: (s.features || []).length,
}));
rows.sort((a, b) => (a.class || '').localeCompare(b.class || '') || String(a.subclass_type).localeCompare(String(b.subclass_type)) || String(a.slug).localeCompare(String(b.slug)));

const out = { rows, note: '서브클래스 단일소스(런타임 SUBCLASS_DB가 로드). 큐레이션 6 + FVTT파생 + 클레릭 교의 조립. id/class_id=런타임, slug/class=표시별칭.' };
fs.writeFileSync(path.join(DEV, 'data/derived/subclasses.json'), JSON.stringify(out, null, 1) + '\n');

const by = {}; rows.forEach(r => by[r.class] = (by[r.class] || 0) + 1);
const noDesc = rows.filter(r => !r.desc).length, noType = rows.filter(r => !r.subclass_type).length;
console.log(`✔ subclasses.json — ${rows.length}종 (desc 없음 ${noDesc}, subclass_type 없음 ${noType})`);
console.log('  클래스별:', JSON.stringify(by));
