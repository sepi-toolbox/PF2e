#!/usr/bin/env node
/* build_class_growth.mjs — 클래스 성장표(class_progression.json)에 레벨별 특성 로스터를 흡수(enrich).
 *
 *  배경: data/base·overlay 삭제(FVTT 미사용) → 구 build_class_progression/build_class_features는 죽은 코드.
 *  숙련값(perception/saves/무기/방어/spellcasting)은 되살릴 소스가 없는 손큐레이션 정본이므로 **그대로 보존**.
 *  이 생성기는 유일 정본인 data/store/에서 "레벨별 획득 클래스특성 로스터"만 뽑아 각 (class,level) 행에 features[]로 추가.
 *
 *  소스: data/store/classes.json(system.items = 레벨별 특성 uuid) + data/store/feats.json(classfeature 엔티티: slug/한글명/rules).
 *  분류(kind): 각 특성이 자동부여/선택/서브클래스 선택자 중 무엇인지 — 런타임이 이걸로 UI·부여 경로를 가름.
 *    - subclass : rules에 ChoiceSet(item:tag:*) → 서브클래스/교의 선택자(doctrine/muses/rogues-racket…). 선택 UI가 담당.
 *    - choice   : rules에 ChoiceSet(비 item:tag: — item:category:deity·명시 list 등, deity/divine-font). 선택 UI가 담당.
 *    - feature  : 그 외 — auto special 재주로 주입, 효과는 EFFECTS_DB[slug]로 해소(shield-block/sneak-attack/perception-expertise…).
 *
 *  ⚠ 숙련·교의 레벨효과는 FVTT 룰엘리먼트(actor 플래그) 전용이라 기계 판독 불가 → 우리 관리표(이 성장표 prof + 교의 prof_changes)가 유일 정본.
 *  실행: cd dev && node tools/derive/build_class_growth.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));

const prog = load('data/derived/class_progression.json');
const classes = load('data/store/classes.json');
const feats = load('data/store/feats.json');

// _id → 특성 엔티티(classfeature 우선, 없으면 아무 feat)
const byId = {};
for (const f of feats) if (f && f._id) byId[f._id] = f;

// 특성의 ChoiceSet 필터에서 "순수 태그풀"(item:tag:<X>만, item:trait: 동반 없음) 태그 추출.
//  → 진짜 서브클래스 선택자(doctrine/muse/bloodline)는 filter:["item:tag:cleric-doctrine"] 형태.
//  → 진행형(commander tactics=item:trait:tactic 최상위)은 태그풀 아님 → 제외.
function tagPoolsOf(feat) {
  const pools = [];
  for (const r of ((feat.system && feat.system.rules) || [])) {
    if (r.key !== 'ChoiceSet') continue;
    const filt = r.choices && r.choices.filter;
    if (!Array.isArray(filt)) continue;
    const topStrs = filt.filter(x => typeof x === 'string');
    const hasTrait = topStrs.some(s => s.startsWith('item:trait:'));
    const tags = topStrs.filter(s => s.startsWith('item:tag:')).map(s => s.slice('item:tag:'.length));
    if (tags.length && !hasTrait) pools.push(...tags);
  }
  return [...new Set(pools)];
}
function hasChoiceSet(feat) {
  return ((feat.system && feat.system.rules) || []).some(r => r.key === 'ChoiceSet');
}

// 클래스별 (level → 특성 로스터[]) — 2패스:
//  1패스: 특성별 raw 수집(level·태그풀·ChoiceSet 여부)
//  2패스: 같은 클래스·같은 태그풀은 최저 레벨만 subclass, 이후 레벨의 동종 픽(gates-threshold·second-implement)은 feature로 강등.
const roster = {};   // slug → { level → [featureObj] }
for (const c of classes) {
  const slug = c.system && c.system.slug; if (!slug) continue;
  const items = (c.system && c.system.items) || {};
  const raw = [];
  for (const it of Object.values(items)) {
    const tail = (it.uuid || '').split('.').pop();
    const f = byId[tail];
    if (!f) continue;   // store에 없는 참조(코어 아이템 등)는 스킵 — 로스터 대상 아님
    const lv = it.level || (f.system.level && f.system.level.value) || 1;
    const rkeys = ((f.system && f.system.rules) || []).map(r => r.key);
    raw.push({
      slug: f.system.slug, name_ko: f.name_ko || f.name, name_en: f.name_en || f.name, lv,
      _pools: tagPoolsOf(f), _choice: hasChoiceSet(f), rules_n: rkeys.length, rule_keys: rkeys,
    });
  }
  // 태그별 최저 레벨(=진짜 선택자) 기록
  const tagMinLv = {};
  for (const e of raw) for (const t of e._pools) tagMinLv[t] = Math.min(tagMinLv[t] ?? 99, e.lv);
  // kind 확정
  const byLv = {};
  for (const e of raw) {
    let kind;
    const isPrimarySelector = e._pools.some(t => tagMinLv[t] === e.lv);
    if (e._pools.length && isPrimarySelector) kind = 'subclass';   // 태그풀 최저레벨 = 선택자
    else if (e._choice) kind = 'choice';                          // 그 외 선택형(deity/divine-font/진행 픽)
    else kind = 'feature';
    (byLv[e.lv] = byLv[e.lv] || []).push({ slug: e.slug, name_ko: e.name_ko, name_en: e.name_en, kind, rules_n: e.rules_n, rule_keys: e.rule_keys });
  }
  // 레벨 내 정렬: subclass/choice 먼저(선택 UI), 그다음 이름
  for (const lv of Object.keys(byLv)) {
    byLv[lv].sort((a, b) => {
      const ord = k => k === 'subclass' ? 0 : k === 'choice' ? 1 : 2;
      return ord(a.kind) - ord(b.kind) || a.name_ko.localeCompare(b.name_ko);
    });
  }
  roster[slug] = byLv;
}

// 각 성장표 행에 features[] 주입
let enriched = 0, totalFeatures = 0;
const kindCount = { subclass: 0, choice: 0, feature: 0 };
for (const row of prog.rows) {
  const fl = (roster[row.class] && roster[row.class][row.level]) || [];
  row.features = fl;
  if (fl.length) { enriched++; totalFeatures += fl.length; fl.forEach(f => kindCount[f.kind]++); }
}

prog.note = '클래스 성장 단일소스 — 레벨별 숙련(손큐레이션 정본) + features[](store classes.json 로스터, kind=subclass/choice/feature). build_class_growth.mjs 생성. 숙련값은 되살릴 소스 없어 보존.';
fs.writeFileSync(path.join(DEV, 'data/derived/class_progression.json'), JSON.stringify(prog, null, 1) + '\n');

// 리포트
const classesWithFeatures = new Set(prog.rows.filter(r => r.features.length).map(r => r.class));
console.log(`✔ class_progression.json enriched — ${enriched}/${prog.rows.length}행에 특성, 총 ${totalFeatures}개 (${classesWithFeatures.size}/27 클래스)`);
console.log(`  kind: subclass ${kindCount.subclass}, choice ${kindCount.choice}, feature ${kindCount.feature}`);
// 로스터 없는 클래스(경고)
const missing = [...new Set(prog.rows.map(r => r.class))].filter(c => !classesWithFeatures.has(c));
if (missing.length) console.log(`  ⚠ 로스터 0 클래스:`, missing.join(', '));
// 클레릭 샘플
console.log('\n  [클레릭 레벨별 features 샘플]');
for (const row of prog.rows.filter(r => r.class === 'cleric' && r.features.length)) {
  console.log(`   lv${row.level}: ` + row.features.map(f => `${f.slug}(${f.kind})`).join(', '));
}
