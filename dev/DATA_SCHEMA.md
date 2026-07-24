# Pathforge 데이터 스키마

> **자동 생성** — `tools/derive/build_schema_doc.mjs`가 `DataManager.html`의 TABS/COLMETA와 실제 데이터 파일에서 추출.
> 수기 편집 금지(재실행하면 덮어씀). 스키마를 바꾸려면 DataManager TABS를 고치고 재생성.
> 생성 시점 탭 30개(스토어 11 + 파생 18 + 참조 1).

---

## 0. 아키텍처 (store 단일소스)

| 레이어 | 경로 | 내용 | 편집 |
|---|---|---|---|
| **STORE(단일소스)** | `data/store/<cat>.json` | 게임 자료 정본(materialized: 구조 + 기계효과 `system.rules[]` + 한글 `_desc_ko`) | ✅ DataManager |
| **DERIVED(산출물)** | `data/derived/<name>.json` | store에서 계산된 파생(성장표·효과·서브클래스·가이드 등). `tools/derive/*.mjs` 생성 | 생성물(재생성) |
| **OVERRIDE(라이브)** | 클라우드/localStorage 작업본 | DataManager 편집이 slug→부분필드로 store 위에 덮임 | ✅ DataManager |

- **Primary Key = `slug`**(모든 엔티티·조인·자동화·override 키). `_id`=FVTT 문서 id(UUID 조인 보조).
- **런타임 조인**: `cs_pf2e.js`가 store 로드 + override 덮음 → `name_ko`/`_desc_ko`/필드 최종값. 정본 필터(`allowed_content.json`)로 보유 룰북 6권 밖 콘텐츠 제외.
- **번역은 스택 결과일 뿐** — 자동화는 전부 slug/rules 기반이라 번역 편집이 기계효과에 영향 0.

### 데이터 3대 원칙
1. 같은 기능을 중복 로직으로 나누지 말 것(공용 함수 하나).
2. 모든 기능은 효과(자동화)/파생 **데이터에서 파생**(런타임에 상수표·if-슬러그 심지 말 것).
3. 모든 효과 처리는 **출처(source/slug) 기반**(이름 매칭 금지).

### 대원칙 0 — 데이터 테이블 플로우
`[성장·정체성]`(클래스성장·혈통·유산·서브클래스성장) → `[부여대상]`(재주·아이템·클래스특성) → `[자동화]`(효과). 효과 탭은 재주·아이템·클래스특성 슬러그 전용. 성장·정체성 테이블은 자기 슬러그로 효과행을 만들지 않고, 부여를 성장표 칸이 소유(런타임이 직접 읽음).

---

## 1. 공통 엔벨로프 (엔티티 카테고리 공통)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `slug` | string(PK) | 키(읽기전용) |
| `name_en` | string | 영문명 |
| `name_ko` | string | 한글명(✅편집, OVERRIDE) |
| `_desc_ko`/`desc` | html | 한글 설명(✅편집) |
| `traits_ko` | slug[] | 특성(→「특성」 레지스트리 단일편집) |
| `source` | string | 출처 서적 |

---

## 2. 스토어 탭 (게임 자료 정본, DataManager 편집)

| 탭 | id | 파일 | 행수 | 주요 컬럼 |
|---|---|---|---|---|
| 재주 | `feats` | `data/store/feats.json` | 7398 | slug · 영문명 · 한글명 · Lv · 특성 · 출처 · 클래스 · 분류 · 효과그룹(FK) · 비용 · 빈도 · RE |
| 주문 | `spells` | `data/store/spells.json` | 1796 | slug · 영문명 · 한글명 · 랭크 · 특성 · 사거리 · 범위 · 방어 · 지속 · RE · 출처 |
| 장비 | `equipment` | `data/store/equipment.json` | 5646 | slug · 영문명 · 한글명 · Lv · 유형 · 가격 · 부피 · 피해 · 특성 · 출처 |
| 클래스 | `classes` | `data/store/classes.json` | 27 | slug · 영문명 · 한글명 · 고정증강 · 자유수 · 택1풀 · 결함 · 시전 · 전통 · HP · 지각 · 내성(F/R/W) · 공격숙련 · 방어숙련 · 출처 |
| 상태이상 | `conditions` | `data/store/conditions.json` | 44 | slug · 영문명 · 한글명 · 효과그룹(FK) · 수치형 · 그룹 · RE · 출처 |
| 행동 | `actions` | `data/store/actions.json` | 1340 | slug · 영문명 · 한글명 · 분류 · 비용 · 빈도 · 특성 · RE |
| 혈통 | `ancestries` | `data/store/ancestries.json` | 50 | slug · 영문명 · 한글명 · 고정증강 · 자유수 · 택1풀 · 결함 · HP · 크기 · 속도 · 시야 · 언어 · 출처 |
| 배경 | `backgrounds` | `data/store/backgrounds.json` | 490 | slug · 영문명 · 한글명 · 고정증강 · 자유수 · 택1풀 · 결함 · 효과그룹(FK) · 훈련기술 · RE · 출처 |
| 유산 | `heritages` | `data/store/heritages.json` | 322 | slug · 영문명 · 한글명 · 효과그룹(FK) · 혈통 · 특성 · RE · 출처 |
| 신격 | `deities` | `data/store/deities.json` | 478 | slug · 영문명 · 한글명 · 설명 · 효과그룹(FK) · 분류 · 능력치 · 영역(주) · 영역(대체) · 신격주문(랭크:슬러그) · 신성원천 · 성별화 · 출처 |
| 효과 | `effects` | `data/store/effects.json` | 2809 | slug · 영문명 · 한글명 · Lv · 특성 · 지속 · RE · 출처 |

---

## 3. 파생 탭 (store에서 계산, 재생성 가능)

| 탭 | id | 소스 파일 | 행수 | 주요 컬럼 |
|---|---|---|---|---|
| 효과(자동화) | `effects` | `effects.json` | 1249 | 소속 · 엔티티 · 엔티티(한글) · 유형 · 대상 · 값 · 값종류 · 조건 · 조건밸류 · 규칙/그룹 · 구분 · 행동비용 · 요약 · 노트 · 선택지ID · 선택종류 · 선택안내 · 옵션ID · 옵션명 |
| 선행조건 | `prereqs` | `prereqs.json` | 1141 | 엔티티 · 그룹 · 유형 · 대상 · 값 · src_text |
| 영역 | `domains` | `domains.json` | 64 | slug · 영문명 · 한글명 · 초기주문 · 초기주문(한) · 고급주문 · 고급주문(한) · 설명 |
| 특성 | `traits` | `traits.json` | 1247 키 | slug · 영문명 · 한글명 · 설명 · 설명有 |
| 클래스특성 | `classfeatures` | `class_features.json` | 854 | slug · 클래스 · 영문명 · 한글명 · Lv · 설명 · 서브 · 서브클래스종류 · 부여 · RE |
| 서브클래스 | `subclasses` | `subclasses.json` | 76 | slug · 클래스 · 서브클래스종류 · 영문명 · 한글명 · 전통 · 설명 · 부여 재주 · 부여 기술 · 부여 주문 · 부여 행동 · 클래스 특성 · 부여 · RE |
| 클래스성장(파생) | `class_progression` | `class_progression.json` | 540 | 클래스 · 한글명 · Lv · 클래스 특성 · 지각 · 인내 · 반사 · 의지 · 단순 · 군용 · 비무장 · 고급 · 미착용 · 경장 · 중장 · 중장갑 · 클래스DC · 시전 · 증가원(특성) |
| 서브클래스성장(파생) | `subclass_progression` | `subclass_progression.json` | 1520 | subclass · 클래스 · 한글명 · Lv · 클래스 특성 · 부여 재주 · 부여 기술 · 부여 주문 · 부여 행동 · 지각 · 인내 · 반사 · 의지 · 단순 · 군용 · 비무장 · 고급 · 미착용 · 경장 · 중장 · 중장갑 · 클래스DC · 시전 · 증가원(특성) |
| 크리처 | `creatures` | `creatures.json` | 1711 | id · 영문명 · 한글명 · Lv · 크기 · AC · HP · 인내 · 부가 · 의지 · 지각 · 특성 · 공격 · 능력 · 주문 · 팩 |
| 해저드 | `hazards` | `hazards.json` | 53 | id · 영문명 · 한글명 · Lv · 복합 · AC · 경도 · HP · 은신 · 인내 · 부가 · 의지 · 특성 |
| 크리처공격 | `creature_strikes` | `creature_strikes.json` | 4480 | 소유(크리처) · 크리처(한글) · 공격명 · 공격(한글) · 유형 · 명중 · 피해 · 특성 · 팩 |
| 크리처능력 | `creature_abilities` | `creature_abilities.json` | 8455 | 소유(크리처) · 크리처(한글) · 능력명 · 능력(한글) · 비용 · 분류 · 특성 · 팩 |
| 시스템용어 | `system_terms` | `system_terms.json` | 233 | 유형 · slug · 영문명 · 한글명 · 설명 · 부가 |
| 사역마능력 | `familiar_abilities` | `familiar_abilities.json` | 111 | slug · 영문명 · 한글명 · 특성 · 설명 |
| 동물동료 | `companions` | `companions.json` | 16 | id · 한글명 · 영문명 · 크기 · HP · 근력 · 민첩 · 건강 · 지능 · 지혜 · 매력 · skill · 감각 · 속도 · 탈것 |
| 상태이상(표시) | `condition_catalog` | `conditions.json` | 41 | id · 이름 · 영문 · 수치형 · 최대치 · 설명 |
| UI용어집 | `ui_terms` | `ui_glossary.json` | 832 | slug · 한글명 |
| NPC능력 | `npc_abilities` | `localize.ko.json` | 75 키 | slug · 한글 / HTML |

> 참조 전용 탭(편집 없음): 변환자 사전(`enrichers`)

---

## 4. 효과(자동화) 테이블 7컬럼 정규화

`effects`(효과) 탭 = 재주·아이템·클래스특성의 기계효과. 1행=1원자효과.

| 컬럼 | 역할 |
|---|---|
| `owner_kind`/`owner_slug` | 출처(어느 재주/특성/아이템) |
| `type` | 효과타입(작은 enum: proficiency·hp_bonus·grant_feat·resistance·grant_action·choice…) |
| `target` | 대상(데이터: 기술/능력치/무기범주 slug 등) |
| `value` / `bonus_type` | 값 / 값종류(upgrade·status·circumstance…) |
| `condition` / `cond_value` | 조건(enum: level·class·feat·trait·armor·no-* …) / 조건 원자값 |

- 런타임 소비: `getEffectRows(slug)` → `_evalEffectCondition`(정적 조건만: level/class/feat/trait/armor). 상황부(off-guard 등)=표시전용.
- 코드가 실제 처리하는 자료형 목록 = DataManager 「자료형 스키마」 버튼(effects.json `_schema`, 코드 상수에서 파생).

---

## 5. 생성 파이프라인 (tools/derive/*.mjs)

- **부트스트랩**: build_subclasses → build_effects → build_subclass_progression / build_class_growth(kind) / 가이드 빌더(독립).
- **가이드(항목 읽는 법)**: build_{bloodlines,oracle_mysteries,wizard_schools,bard_muses,witch_patrons,druid_orders,ranger_edges,rogue_rackets,champion_causes,barbarian_instincts,investigator_methodologies,swashbuckler_styles,alchemist_research_fields,fighter_features,monk_features}.mjs → 각 `*_*.json`(guide[]).
- **이 문서**: build_schema_doc.mjs(DataManager TABS에서 추출).
- 데이터 수정 → 해당 빌더 재실행 → `node tools/bump_version.mjs <v>`(캐시버스터).
