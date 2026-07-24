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
    s.desc = PF.enrichDesc(PF.descKo(feat) || '');   // 서브클래스 설명 = 서브클래스 데이터(s.desc). 정본 학파 특성 desc를 소스로(혈통·신비와 동일).
    s.name_en = nameEn;                               // 「Ars Grammatica」 stub → 「School of Ars Grammatica」
    // ⚠ 학파 자신(school-of-*)을 features(클래스 특성)로 넣지 않음 — 서브클래스 설명이 성장표에 클래스특성으로
    //   중복 분류되던 문제. 혈통이 자신 대신 혈통마법(blood-magic-*)을 feature로 두는 것과 동일. 학파는 별도
    //   패시브 특성이 없어 빈 배열. 학파 효과(학파주문=granted_spells, 교육과정=curriculum)는 아래 필드가 소유.
    s.features = [];
    // 교육과정(curriculum) = 서브클래스 성장 데이터에 실음(대원칙 0) → 런타임이 subclass.curriculum을 직접 읽어
    //   주문서 편입·보너스 슬롯 적용(클래스 하드코딩 없이 데이터 구동). 학파주문(school_spell)도 참조용으로 부착.
    if (meta.curriculum) s.curriculum = meta.curriculum;
    if (meta.school_spell) s.school_spell = meta.school_spell;
    patched++;
  }
  console.log(`  위저드 학파 정본 desc/feature 주입: ${patched}종`);

  // 바드 뮤즈 = 큐레이션 stub → 정본 FVTT 특성(enigma/maestro/polymath/warrior)의 완전 _desc_ko(@link 뮤즈재주·뮤즈주문)로 교체.
  //   위저드 학파·소서러 혈통과 동일: 설명은 서브클래스 데이터(s.desc). 뮤즈 재주/주문은 granted_feats/granted_spells 소유
  //   → features(클래스 특성)엔 뮤즈 자신·부여물 넣지 않음(빈 배열). 매핑=muse-<x> → FVTT slug <x>.
  let musePatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'bard') continue;
    const fslug = String(s.id).replace(/^muse-/, '');   // muse-enigma → enigma
    const feat = featBySlug[fslug];
    if (!feat) continue;
    s.desc = PF.enrichDesc(PF.descKo(feat) || '');
    s.name_en = feat.name || feat.name_en || s.name_en;
    s.features = [];   // 뮤즈 자신/부여 재주는 features가 아님(granted_* 소유)
    musePatched++;
  }
  console.log(`  바드 뮤즈 정본 desc 주입: ${musePatched}종`);

  // 마녀 후원자 = 실제 Player Core 7후원자(subclasses_curated 재구성). 큐레이션 필드(flavor·전통·기술·교훈·사역마)로
  //   rich desc 조립: 소개 + 전통 + 후원자 기술 + 교훈(주술 캔트립 @link + 사역마 습득 주문 @link) + 사역마 능력(카드는 features).
  const TRAD_KO = { arcane: '비전', divine: '신성', occult: '오컬트', primal: '원시' };
  const SKILL_KO = { religion: '종교학', arcana: '주문학', occultism: '오컬티즘', nature: '자연학', society: '사회학', crafting: '제작', medicine: '의학', deception: '기만', intimidation: '위협' };
  let patronPatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'witch') continue;
    const tradKo = TRAD_KO[s.tradition] || s.tradition || '';
    const skillKo = SKILL_KO[s.patron_skill_slug] || s.patron_skill_slug || '';
    const hex = (s.granted_spells || []).find(g => g.type === 'focus');
    const fam = (s.granted_spells || []).find(g => g.type === 'known');
    let d = '';
    if (s.flavor) d += `<p><em>${s.flavor}</em></p>`;
    if (tradKo) d += `<p><strong>전통</strong> ${tradKo}</p>`;
    if (skillKo) d += `<p><strong>후원자 기술</strong> ${skillKo}</p>`;
    const lessonParts = [];
    if (hex) lessonParts.push(`@link[spells.${hex.spell_id}] 주술 캔트립을 얻고`);
    if (fam) lessonParts.push(`사역마가 @link[spells.${fam.spell_id}] 주문을 배웁니다`);
    else if (Array.isArray(s.familiar_spell_choice)) lessonParts.push(`사역마가 ${s.familiar_spell_choice.map(x => `@link[spells.${x}] 주문`).join(' 또는 ')} 중 하나를 배웁니다`);
    if (lessonParts.length) d += `<p><strong>교훈</strong> ${s.lesson_ko ? s.lesson_ko + ' — ' : ''}${lessonParts.join(', ')}.</p>`;
    // 사역마 고유 능력 = 이름 + 실제 효과 설명을 desc에 자기완결적으로(이름만 두면 "저게 뭐냐" — 사용자 지적).
    if (s.features && s.features[0] && s.features[0].name_ko) {
      const famName = s.features[0].name_ko, famDesc = String(s.features[0].desc || '').replace(/^\s*<p>|<\/p>\s*$/g, '').trim();
      d += `<p><strong>사역마 능력</strong> ${famName}${famDesc ? ' — ' + famDesc : ''}</p>`;
      // 후원자 고정 사역마 능력 = grant_familiar(성장표) 소스. 펫(사역마)이 이 이름/설명을 그대로 표시하도록
      //   slug(=식별, 실 엔티티 참조) + 큐레이트 name/desc(=서브클래스 설명과 동일 텍스트, 단일소스)를 함께 실음.
      const _fslug = (typeof s.granted_familiar === 'string') ? s.granted_familiar : (s.granted_familiar && s.granted_familiar.slug);
      if (_fslug) s.granted_familiar = { slug: _fslug, name: famName, desc: famDesc };
    }
    s.desc = PF.enrichDesc(d);
    // 후원자가 주는 것(전통·기술·교훈·사역마 능력)을 desc 한 곳에 모음 → 클래스 특성 카드로 중복 표시 안 함(features 비움).
    //   familiar 데이터는 위 desc에 이미 소비됨. 성장표 특성 칸도 비어 자기참조/중복 없음.
    s.features = [];
    patronPatched++;
  }
  console.log(`  마녀 후원자 desc(정본 7후원자 조립) 주입: ${patronPatched}종`);
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
