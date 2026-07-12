#!/usr/bin/env node
/* build_subclass_effects.mjs — [폐지됨 · DEPRECATED · 2026-07-12]
 *
 *  합의된 데이터 구조:
 *    성장·정체성(클래스 성장 · 혈통 · 유산 · 서브클래스 성장)
 *        → 재주 / 아이템 / 클래스 특성 (부여 대상)
 *            → 효과(자동화)
 *
 *  즉 효과(자동화) 탭은 **재주·아이템·클래스 특성 슬러그 전용**이다.
 *  서브클래스 성장은 "그 자체로 효과를 지닌다" — 부여(재주/기술/주문/행동)를 효과 탭에 서브클래스
 *  슬러그로 파생하지 않고, **서브클래스 성장표(data/derived/subclass_progression.json)의
 *  grant_feats / grant_skills / grant_spells / grant_actions 칸**에 담는다(build_subclass_progression.mjs).
 *  런타임은 PF2eClass.subclassGrantTable(성장표)에서 직접 읽어 적용한다(숙련 T/E/M/L과 동일 경로).
 *
 *  이 생성기(서브클래스 부여를 curated_effects.json으로 파생하던 것)는 그 구조에 위배되어 폐지됐다.
 *  실행해도 아무것도 하지 않는다. (부여 정의는 서브클래스 탭 granted_* → build_subclass_progression.mjs 참조.)
 */
console.log('⏹ build_subclass_effects.mjs 는 폐지됨(2026-07-12).');
console.log('   서브클래스 부여는 서브클래스 성장표(subclass_progression)의 grant_* 칸에서 관리 →');
console.log('   런타임이 PF2eClass.subclassGrantTable로 직접 적용. 효과(자동화) 탭 경유 안 함.');
console.log('   (부여 정의: 서브클래스 탭 granted_* → node tools/derive/build_subclass_progression.mjs)');
