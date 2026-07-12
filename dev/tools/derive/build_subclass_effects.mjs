#!/usr/bin/env node
/* build_subclass_effects.mjs — 서브클래스 부여(granted_feats/granted_spells)를 효과(자동화) 테이블로 이관.
 *
 *  배경: 서브클래스 부여 재주의 상당수(29/41)는 이미 FVTT 룰 추출로 effects_db에 grant_feat 행으로 존재.
 *   SUBCLASS_DB.granted_* 는 그걸 RE.build로 또 뽑은 병렬 중복(= CLASS_AUTO_FEATS가 성장표와 중복이던 것과 동형).
 *  단일 통합: 런타임을 getEffectRows(subclassSlug) 경로로 배선(Phase B) → 이미 있는 grant_feat가 그 경로로 적용.
 *   이 생성기는 **효과 테이블에 아직 없는 갭만** curated_effects.json에 slug 키로 채운다(이중부여 방지):
 *     - granted_feats 중 effects_db에 grant_feat 없는 것 → grant_feat 행
 *     - granted_spells(전량, effects_db에 0건) → grant_focus_spell / grant_known_spell 행
 *  prof_changes는 숙련 진행 도메인(class_progression과 동일 규칙) → 여기서 다루지 않음.
 *
 *  ⚠ 재실행 안전(idempotent): '이미 FVTT에 있음' 판정은 effects_db.json에서 **기존 curated 기여분을 뺀** 것.
 *  실행: cd dev && node tools/derive/build_subclass_effects.mjs  (그다음 build_effects.mjs 재실행)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const loadJson = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));

const subs = loadJson('data/derived/subclasses.json').rows;
const effDb = loadJson('data/derived/effects_db.json');
const curated = loadJson('data/curated_effects.json');
const spells = loadJson('data/store/spells.json');
const spellKo = {}; for (const s of spells) if (s && s.system && s.system.slug) spellKo[s.system.slug] = s.name_ko || s.name;

// grant target 집합 헬퍼: effects_db[slug]의 특정 type target 집합
function grantTargets(slug, types) {
  const rows = (effDb[slug] && effDb[slug].rows) || [];
  return new Set(rows.filter(r => types.includes(r.type)).map(r => r.target));
}
// 기존 curated[slug]가 이미 기여한 target(재실행 시 FVTT-only 판정에서 빼기 위함)
function curatedTargets(slug, types) {
  const rows = (curated[slug] && curated[slug].rows) || [];
  return new Set(rows.filter(r => types.includes(r.type)).map(r => r.target));
}

let nFeat = 0, nFeatSkipDup = 0, nFocus = 0, nKnown = 0, nOther = 0, nAction = 0, nActionSkipDup = 0, nSkill = 0, touched = 0;
for (const sc of subs) {
  const slug = sc.slug; if (!slug) continue;
  const gf = sc.granted_feats || [];
  const gs = sc.granted_spells || [];
  const ga = sc.granted_actions || [];
  const gk = sc.granted_skills || [];
  if (!gf.length && !gs.length && !ga.length && !gk.length) continue;

  // 이미 효과행에 있는 grant_feat/grant_action = effects_db 존재분 − 내 curated 기여분 (이중부여 방지)
  const inDb = grantTargets(slug, ['grant_feat']);
  const inCur = curatedTargets(slug, ['grant_feat']);
  const fvttHas = new Set([...inDb].filter(t => !inCur.has(t)));
  const inDbA = grantTargets(slug, ['grant_action']);
  const inCurA = curatedTargets(slug, ['grant_action']);
  const dbHasA = new Set([...inDbA].filter(t => !inCurA.has(t)));

  const rows = [];
  for (const t of gf) {
    if (fvttHas.has(t)) { nFeatSkipDup++; continue; }   // 이미 FVTT 효과행 → 이중부여 방지
    rows.push({ type: 'grant_feat', target: t });
    nFeat++;
  }
  // 부여 행동(챔피언 원인=반응 등) → grant_action 행
  for (const t of ga) {
    if (dbHasA.has(t)) { nActionSkipDup++; continue; }
    rows.push({ type: 'grant_action', target: t });
    nAction++;
  }
  // 부여 기술(드루이드 교단 등) → skill_trained 행 (target=기술 id)
  for (const t of gk) {
    if (!t) continue;
    rows.push({ type: 'skill_trained', target: t });
    nSkill++;
  }
  for (const g of gs) {
    const tgt = g.spell_id; if (!tgt) continue;
    const name = spellKo[tgt] || tgt;
    if (g.type === 'known') { rows.push({ type: 'grant_known_spell', target: tgt, name, ...(g.rank != null ? { rank: g.rank } : {}) }); nKnown++; }
    else if (g.type === 'focus' || g.type === 'spell') { rows.push({ type: 'grant_focus_spell', target: tgt, name }); nFocus++; }
    else { rows.push({ type: 'grant_focus_spell', target: tgt, name }); nOther++; }  // cantrip 등 미관측 — 집중으로 근사(로그)
  }
  if (!rows.length) continue;

  // 병합(재실행 idempotent): 기존 curated[slug].rows에서 동일 (type,target) 제거 후 추가
  const cur = curated[slug] || (curated[slug] = {});
  const keep = (cur.rows || []).filter(r => !rows.some(nr => nr.type === r.type && nr.target === r.target));
  cur.rows = keep.concat(rows);
  touched++;
}

fs.writeFileSync(path.join(DEV, 'data/curated_effects.json'), JSON.stringify(curated, null, 1) + '\n');
console.log(`✔ curated_effects.json — 서브클래스 ${touched}종에 효과행 추가/갱신`);
console.log(`  grant_feat 추가 ${nFeat} (이미 FVTT에 있어 스킵 ${nFeatSkipDup}), grant_focus_spell ${nFocus}, grant_known_spell ${nKnown}` + (nOther ? `, 근사 ${nOther}` : ''));
console.log(`  curated 총 키수: ${Object.keys(curated).length}`);
