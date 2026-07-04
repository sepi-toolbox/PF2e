# 이름 매칭 → slug 통일 전수검사 (2026-07-04, v0.96 기준)

목표: 엔티티 **식별/조회/dedup**을 이름(name_ko/name_en)이 아닌 **slug(id)** 기준으로 통일.
이름은 사용자가 자유 편집 → 이름 매칭은 전부 잠재 버그. (표시·검색·자유입력 항목은 제외.)

상태 범례: ☐ 미착수 / ☑ 완료

## 진행 현황
- **Phase 1 (v0.97, 완료·브라우저 검증)** = R1 데이터테이블(CLASS_AUTO_FEATS/SPELLS에 slug id + 소비처 id해소·slug dedup) + R2 하드코딩 한글명 감지기 전량(Acumen/Obsession/Longevity×2/AdoptedAncestry×3/DomainInitiate/MultifariousMuse/repeatable). **발견: 이 감지기·테이블의 하드코딩 한글명이 이미 카탈로그와 드리프트해 여러 특수재주가 조용히 고장나 있었음** — slug 전환이 실제로 복구함. 덤: `_subAutoSp` null spread 선재버그 수정(서브클래스 미선택 시 바드/소환사 자동 집중주문 누락).
- **Phase 2 (v0.98, 완료·브라우저 검증) = grant 소비 핸들러 slug 견고화 + 부여 로직 데이터화 원칙 확립**:
  - grant_feat / grant_feat_if_trained / grant_innate_spell / grant_focus_spell 핸들러가 target을 `getFeat`/`getSpell`으로 해소(slug·이름 모두 허용) + **slug로 dedup·저장**. → effects_db가 이름 타깃이어도 런타임은 견고(단 부여 **대상 엔티티**가 개명되면 이름타깃은 미스 → 타깃 slug화 필요, 아래).
  - `applyFeatEffects`가 효과 def를 **feat.id(slug) 우선** 해소(구: `_extractEnName(feat.name)` 이름). 
  - **사용자 아키텍처 확정**: 부여 로직은 엔티티가 아니라 **효과(자동화) 데이터**에 있음 = `EFFECTS_DB[slug].rows` 또는 override `data/override/effect_groups.json`(slug→rows, DataManager 효과탭 편집지점). 각 grant 행 = `{type: grant_feat|grant_focus_spell|grant_innate_spell|..., target: <slug>}`.
  - **exemplar 완성**: `composition-spells`(작곡 주문, 바드 L1 특성) 효과데이터에 `grant_focus_spell→courageous-anthem` 추가(override) + 바드 자동특성에 composition-spells 등재(slug) + CLASS_AUTO_SPELLS.bard의 용기의 찬가 하드코딩 제거. 검증: 용기의 찬가가 `_sourceFeat=composition-spells`로 부여됨.
- **⚠ 생성기 파손 발견**: `tools/derive/build_effects.mjs`가 레거시 제거된 `feat_db.js` 참조로 **실행 불가**(레거시 제거 v0.51~ 이후). effects_db.js 재생성 불가 상태. build_effects의 grantRow는 slug 방출로 고쳤으나 **생성기 수리 전엔 반영 안 됨** → 351 grant행 target은 여전히 이름. 
- **다음(미착수)**: build_effects 생성기 수리(feat_db 의존 제거) → 재생성해 351 target slug화(또는 타깃 정규화 스크립트) / 남은 CLASS_AUTO_SPELLS·SUBCLASS_AUTO_* 하드코딩을 효과데이터로 이관 / R3 성장슬롯 slug / R4 행동게이팅 slug / R5 cs_ui 무기·제조식·cs_calc / R6 저장 dedup / R7 조건 서브시스템(별도 신중).

## R1. 카탈로그 데이터가 엔티티를 id 없이 이름으로 저장 (근본)
- ☐ `tools/derive/build_effects.mjs:104` — GrantItem `target: name||uuid` → **slug** 방출. effects_db.js 재생성. (grant_feat 348 + grant_innate_spell 3 = 351행이 전부 한글명 타깃)
- ☐ `effects_db.js` grant 351행 (위 재생성 산출)
- ☐ `cs_feat_effects.js:327-357` grant_feat / grant_feat_if_trained — 이름 부분매칭 dedup+무-id 저장 → slug 해소·dedup·저장
- ☐ `cs_feat_effects.js:379-393` grant_innate_spell — `s.name===eff.spell` dedup → spellSame/id
- ☐ `cs_feat_effects.js:400-413` grant_focus_spell — `s.name===spellName` dedup → id
- ☐ `class_features_db.js:114-130` CLASS_AUTO_FEATS — 각 항목에 `id:`(slug) 추가
- ☐ `class_features_db.js:138-148` CLASS_AUTO_SPELLS — 각 항목에 `id:`(slug) 추가
- ☐ `cs_modal.js:730/731` 자동특성 dedup·`getFeat(name)` → id
- ☐ `cs_modal.js:769/775/779/783` 자동주문 dedup·`getSpell(name)` → id
- ☐ `cs_modal.js:1649-1667` getAutoKnownAtLevel `{name:s.name_ko}` → id 포함

## R2. 하드코딩 한글명 재주 감지 (특수 헬퍼)
- ☐ `cs_modal.js:99/104/108` _hasOtherworldlyAcumen — `.includes('이세계 통찰')` → `otherworldly-acumen`
- ☐ `cs_modal.js:121/124` _hasGnomeObsession — `.includes('집착적 연구')` → `gnome-obsession`
- ☐ `cs_modal.js:129` _hasExpertLongevity — `.includes('전문가의 장수')` → `expert-longevity`
- ☐ `cs_modal.js:133` _hasAncestralLongevity — `.includes('조상의 장수')` → `ancestral-longevity`
- ☐ `cs_modal.js:172` applyRest 집착적 연구 재탐색 → slug
- ☐ `cs_modal.js:2828/3040`, `cs_calc.js:1027` 양자 혈통 감지 → `adopted-ancestry`
- ☐ `cs_feat_effects.js:877` Domain Initiate (`영역 입문`/`Domain Initiate`) → `domain-initiate`
- ☐ `cs_feat_effects.js:819` Multifarious Muse (`다양한 뮤즈`) → `multifarious-muse`
- ☐ `cs_feat_effects.js:869` repeatable dedup `name.split(' (')[0]===featBaseName` → featSlug

## R3. 성장/슬롯 저장을 표시문자열로, 이름 매칭
- ☐ `cs_modal.js:4885/4879/1313` growth 재주 슬롯 = 표시명 저장·매칭 → slug (+로드 마이그레이션)
- ☐ `cs_modal.js:4933-4956` 주문슬롯 `{name:sp.name_ko}` 무-id 저장 → id (growth 경로 1957/1968은 이미 slug)
- ☐ `cs_modal.js:5299` bgSkillFeat 표시명 저장 → beff.feat_id
- ☐ `cs_modal.js:4673` 배경재주 정리 `f.name===fn` → slug
- ☐ `cs_modal.js:700/734` savedAutoChoices 이름 키 → slug 키

## R4. 행동 게이팅을 재주 이름으로
- ☐ `cs_modal.js:5449` isActionAvailable `learned.has(action.req_feat)` (한글명 Set) → slug Set
- ☐ `cs_modal.js:5559/5606/5621` req_feat = name_ko → slug
- ☐ `cs_modal.js:5433-5440/5547` getLearnedFeatNames → slug 열거
- ☐ `cs_modal.js:5554` action id `'feat-auto-'+name_en` → slug

## R5. cs_ui / cs_calc 개별 매칭
- ☐ `cs_ui.js:301/308/522/527` 사역마·훈련무기 보너스 = 무기 표시명 매칭 (전투수학, HIGH) → w._dbData.id slug
- ☐ `cs_ui.js:2343` grant-weapon 정리 = 추출 영문명 → featSlug
- ☐ `cs_ui.js:1341/1355/1364` 제조식 dedup = 한글명 → id (수동입력만 name)
- ☐ `cs_calc.js:878-884` getSpellFeatNotes / SPELL_FEAT_MODS = 한글명 키 테이블 → slug 키
- ☐ `cs_calc.js:917` 룬 조회 name-first → id-first
- ☐ `cs_calc.js:1141-1143` 헌신 자기클래스 배제 = 클래스명 부분매칭 → class slug
- ☐ `cs_calc.js:1149` owned 재주 dedup = name_ko Set → slug Set

## R6. 저장/로드
- ☐ `cs_save.js:489` 재주 dedup 키 = name → featSlug (ghost-cleanup는 이미 3중매칭)

## R7. 조건(상태이상) = 한글명 키 (서브시스템 전역, 별도 신중 페이즈)
- ☐ `state.conditions[c.name]` (cs_calc/cs_modal/cs_ui 전역) + `CONDITIONS_DATA.find(c=>c.name===)` → id 키 (+ _condMigrate 확장)
- 주의: 최근 조건명 개명(붙잡힘 등) 이력 있음. 저장 키 실제 포맷(영문 slug? 한글?) 먼저 실측. 마이그레이션 필수.

## 부수 발견 (버그)
- ☐ `cs_calc.js:858` `deity.domains.includes(opt.name)` — 888은 `opt.id`. domains는 id 배열 → 858도 id여야(도메인 필터 무음 실패 의심)
- ☐ `cs_session.js:268` `name: data.name` — collectData는 `data.fields.name` → 세션 슬롯명 항상 '이름 없음'
- 참고 `cs_monster.js:215` ko.json이 en-name 키로 저작 (데이터 조인, 저위험)

## 검증
- 인앱 하니스: Chrome 헤드리스 + `tools/make_preview.py` 파생 진단(파이터 재주 재현에 사용). 페이즈마다 재주/주문/자동화 실호출 assert.
- 각 페이즈 후 node -c 문법 + 브라우저 diag.
</content>
</invoke>
