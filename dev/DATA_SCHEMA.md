# Pathforge 데이터 스키마 (FVTT 단일 기반)

> 목표: 레거시 엔티티 DB를 제거하고 **모든 데이터를 FVTT에서 기반**. 각 카테고리를 관리 HTML 툴의 탭(엑셀시트)으로 보고·편집·dev 커밋.
> 실측 근거: `data/base/*.base.json`(영문 FVTT) + `data/overlay/*.ko.json`(PF2e-KR 한글) 전 카테고리 필드 전수조사(2026-07-01).

---

## 0. 레이어 & 키

| 레이어 | 경로 | 내용 | 편집 |
|---|---|---|---|
| **L1 BASE** | `data/base/<cat>.base.json` | 영문 FVTT 원본(구조 + 기계효과 `rules[]`) | 읽기전용(추출물) |
| **L2 OVERLAY** | `data/overlay/<cat>.ko.json` | 한글 번역 {name, description, traits} (PF2e-KR 추출) | 읽기전용(추출물) |
| **L3 OVERRIDE** | `data/override/<cat>.json` *(신규)* | 개선/수정본. `slug → {부분 필드}`. **최종 적용**(BASE⊕OVERLAY⊕OVERRIDE) | ✅ 관리 툴이 씀 |
| **DERIVED** | `data/derived/<name>.json` *(신규)* | 계산 산출물(예 class_progression). BASE+RE walk 결과 | 생성물(재생성 가능) |

- **Primary Key = `slug`** (모든 엔티티·조인·자동화·override 키). `_id`는 FVTT 문서 id(UUID 조인/GrantItem용 보조키).
- **런타임 조인**: `cs_pf2e.js`가 BASE에 OVERLAY를 덮고, 그 위에 OVERRIDE를 덮음 → `name_ko`/`_desc_ko`/필드 최종값. (현행 조인에 L3 훅 추가)
- **번역은 이 스택의 결과일 뿐** — 자동화는 전부 slug/rules 기반이라 번역 편집이 기계효과에 영향 0.

---

## 1. 공통 엔벨로프 (모든 카테고리 공통 컬럼)

| 컬럼 | 출처 | 타입 | 설명 |
|---|---|---|---|
| `slug` | BASE.system.slug | string(PK) | 키. 읽기전용 |
| `_id` | BASE._id | string | FVTT 문서 id(보조) |
| `name_en` | BASE.name | string | 영문명 |
| `name_ko` | OVERLAY.name → OVERRIDE | string | 한글명 ✅편집 |
| `level` | BASE.system.level.value | int | 레벨(해당 시) |
| `traits` | BASE.system.traits.value[] | slug[] | 특성 slug |
| `traits_ko` | traits→글로서리/OVERLAY | string[] | 한글 특성 ✅편집 |
| `source` | BASE.system.publication.title | string | 출처(PC1/PC2/…) |
| `rules_n` | BASE.system.rules.length | int | RE 룰 개수(기계효과 지표) |
| `desc_en` | BASE.system.description.value | html | 영문 설명 |
| `desc_ko` | OVERLAY.description → OVERRIDE | html | 한글 설명 ✅편집 |
| `has_ko` | 계산 | bool | 한글 커버 여부(필터용) |

**편집 정책**: `name_ko`/`desc_ko`/`traits_ko` = 번역(OVERRIDE). 구조/기계 필드도 편집 가능하나 `구조수정` 플래그로 경고. `rules[]`·`slug`·`_id` = 읽기전용(행 상세에서 JSON 열람만).

---

## 2. 카테고리별 탭 스키마 (그리드 컬럼)

공통 엔벨로프 + 아래 고유 컬럼.

### feats (7398 / ko 6572)
`category`(class 4030·ancestry 1552·classfeature 826·skill 335·general·deityboon·curse…) · `actionType`·`actions`(비용) · `prerequisites`(선행) · `frequency` · `maxTakable`·`onlyLevel1` · `subfeatures` · `rules[]`(ItemAlteration/ActiveEffectLike/GrantItem/RollOption/FlatModifier/ChoiceSet…)

### spells (1796 / ko 1784)
`rank`(=level) · `traits`(전통 arcane/divine/occult/primal 포함) · `range`·`area`·`target`·`defense`·`duration`·`time`·`cost` · `damage` · `heightening`(543) · `ritual`(155) · `rules[]`

### equipment (5646 / ko 5501)
`type`(equipment 2282·martial 598·simple 306·ammo·potion·talisman·elixir·wand·shield·poison…) · `price` · `bulk` · `hardness`·`hp` · `damage`(무기) · `usage`·`material`·`baseItem` · `rules[]`(FlatModifier/Resistance/DamageDice/Aura…)

### classes (27)
`keyAbility` · `hp` · `savingThrows{fortitude,reflex,will}`(rank) · `attacks{simple,martial,unarmed,advanced}` · `defenses{unarmored,light,medium,heavy}` · `perception` · `trainedSkills{value[],additional}` · `classFeatLevels`·`skillFeatLevels`·`skillIncreaseLevels`·`ancestryFeatLevels`·`generalFeatLevels` · `spellcasting` · `items{}`(레벨별 부여 클래스특성 UUID) → **DERIVED class_progression 소스**

### conditions (44 / ko 43)
`valued`(system.value≠null) · `group` · `overrides` · `duration` · `references`(관계 조건) · `rules[]`(FlatModifier/GrantItem/ItemAlteration…)

### actions (1340 / ko 660)
`category`(offensive 679·interaction 309·defensive 217·familiar 105) · `actionType`·`actions`(비용) · `frequency` · `rules[]`

### ancestries (50 / ko 48)
`hp` · `size` · `speed` · `boosts[]`·`flaws[]` · `languages[]`·`additionalLanguages` · `vision` · `reach`·`hands` · `items{}`(혈통특성) · `rules[]`

### backgrounds (490 / ko 459)
`boosts[]` · `trainedSkills[]` · `items{}`(부여 재주/기술) · `rules[]`(GrantItem/ChoiceSet…)

### heritages (322 / ko 311)
`ancestry`(소속 혈통 slug) · `rules[]`(FlatModifier/GrantItem/Sense/Resistance/Strike…)

### deities (478 / ko 453)
`category`(deity 418·pantheon·covenant·philosophy) · `attribute`(능력치) · `domains[]` · `font`(신성원천) · `sanctification` · `skill`·`weapons[]` · `spells{}`(신격 주문)

---

## 3. DERIVED 테이블 (FVTT에서 계산 파생)

### class_progression  *(CLASS_PROF_EXT 수작업표 대체)*
`class_slug × level(1..20) → { perception, fortitude, reflex, will, simple, martial, unarmed, advanced, unarmored, light, medium, heavy, classDC }` 각 = rank(0=U,1=T,2=E,3=M,4=L).
- **산출**: ①L1 앵커 = classes.base의 savingThrows/attacks/defenses/perception ②레벨 증가 = `system.items`의 클래스특성(feats.base category=classfeature)들을 레벨순 walk하며 그 `rules[]`의 Proficiency 상향(ActiveEffectLike/MartialProficiency 등) 적용.
- 생성기 `tools/derive/class_progression.mjs` → `data/derived/class_progression.json`. 관리 툴은 파생표를 탭으로 표시(읽기전용 + 재생성 버튼).

### term_dictionary  *(번역 단계에서 사용, 지금은 스켈레톤)*
`slug → {ko(정본), category, variants[]}`. 글로서리+PF2e-KR+실사용 빈도. (번역 파트에서 채움)

---

## 4. 레거시 → FVTT 매핑 (무엇이 어디로 가는가)

| 레거시(cs_data.js/*_db.js) | 처리 |
|---|---|
| FEAT_DB / SPELL_DB / WEAPON·ARMOR·GEAR_DB / CONDITIONS_DATA / ACTION_DB / TRAIT_DB / DEITY_DB / BACKGROUNDS / HERITAGE_DB / ANCESTRIES / CLASSES | **제거** → 해당 FVTT 카테고리로 대체(slug 조인) |
| `effect_group_id`/`prereq_group_id`/`choice_id` + EFFECT_GROUPS/PREREQ_GROUPS/CHOICE_OPTIONS | **제거** → FVTT `rules[]`(RE 엔진)로 대체 |
| CLASS_PROF_EXT(클래스 숙련표) | **제거** → DERIVED class_progression |
| SKILLS / LANGUAGES / 능력치 상수 | **유지**(앱 config 상수, FVTT 엔티티 아님) → "config" 탭 |
| state 저장(재주/주문 by name) | **id/slug 기반으로 마이그레이션**(번역 편집 안전화) |

---

## 5. 관리 HTML 툴 매핑 (DataManager.html)

- **탭** = 카테고리 10종 + DERIVED(class_progression) + config + (후일 term_dictionary)
- **그리드**: 가상 스크롤(수천 행), 컬럼 정렬·필터·검색, 셀 인라인 편집, 행 클릭 → 상세 패널(rules[] JSON 뷰, desc HTML 프리뷰, 레이어별 값 BASE/OVL/OVR 비교)
- **편집 대상 = L3 OVERRIDE 작업본**(localStorage) → 변경 diff 뱃지
- **dev 커밋**: 컴패니언 서버(`tools/datatool_server.mjs`)가 툴을 서빙 + `/save`(override JSON 파일 반영) + `/commit`(git add/commit, **사용자 버튼 누를 때만**) 엔드포인트 제공. 정적 호스팅만으론 파일쓰기 불가하므로 로컬 실행 전제.
