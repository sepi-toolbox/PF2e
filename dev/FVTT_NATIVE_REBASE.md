# Pathforge → FVTT-Native 전면 재기반 설계

작성: 2026-06-27 / 상태: **P0~P4 완료(v0.9). 5개 엔티티(혈통·유산·배경·주문·재주) FVTT-네이티브 + 클래스 콘텐츠/숙련. 잔여=클래스 서브클래스/특성/주문슬롯, RE v2 키**
선행: `PATHFORGE_REBASE_DESIGN.md`(크리처 BASE+OVERLAY) 의 Phase 3를 본 문서가 대체.

## 0. 사용자 확정 결정
> **방향성(2026-06-27)**: Pathforge는 앞으로 **FVTT급 가상 테이블탑(VTT)**. 따라서 **디테일 데이터화**가 핵심 — 데이터 임의 축소 금지, FVTT 수준 상세 보존. BASE는 system.*+rules+embedded+flags+prototypeToken 전부 보존(월드관리 필드만 제거). 어댑터/슬림카드는 비파괴적 파생 뷰. 아트팩은 사용자가 추후 추가(SRD는 토큰아트 미동봉). 상세=메모리 project_pf2e_vtt_direction.

- **전량 이식**: FVTT pf2e 8.2.0 컴펜디움 전체를 Pathforge로.
- **FVTT 구조로 재설계 허용**: 기존 평탄 스키마 폐기 가능. FVTT 네이티브 구조 채택.
- **Rule Elements 완전 채택**: 빌더 자동화를 FVTT Rule Element(RE) 해석 엔진으로 재구현.
- **전 베스티어리 전량**: npc 6308 + hazard 1199 + vehicle/army/familiar 포함.
- dev 전용, 배포/라이선스는 추후 협의(PF2e-KR 파생 = CC BY-NC-ND, 공개 repo 푸시 금지).

## 1. Phase 0 — 데이터 추출 (✅ 완료)
도구: `tools/pf2e/extract_all.mjs`(아이템/플레이어콘텐츠), `extract_creatures.mjs`(액터), `inventory.mjs`(집계). classic-level로 LevelDB 직접 read. 출력 `dev/data/base/`.

| 카테고리 | BASE 항목수 | 파일 |
|---|---|---|
| feats (재주+campaignFeature) | 7,398 | feats.base.json |
| equipment (weapon/armor/shield/consumable/treasure/ammo/backpack/kit) | 5,646 | equipment.base.json |
| effects (자동화 효과 캐리어) | 2,809 | effects.base.json |
| spells | 1,796 | spells.base.json |
| actions | 1,340 | actions.base.json |
| backgrounds | 490 | backgrounds.base.json |
| deities | 478 | deities.base.json |
| heritages | 322 | heritages.base.json |
| ancestries | 50 | ancestries.base.json |
| conditions | 44 | conditions.base.json |
| classes | 27 | classes.base.json |
| **creatures** (npc/hazard/vehicle/army/familiar) | **7,633** | creatures/<pack>.json + _index.json(슬림) |

- BASE는 FVTT system 구조 그대로 보존(불필요 필드만 제거: ownership/sort/_stats/folder/prototypeToken).
- 동일 slug 중복은 첫 등장만 채택. `_pack` 출처 필드 부착.
- 크리처는 embedded items(strikes/abilities/spells) join 포함. 1.14MB 슬림 `_index.json`으로 브라우징(지연 풀로드).
- 총 용량 ≈ 49MB(비크리처 33 + 크리처 16). **지연로드 + 인덱스 필수**.

## 2. 한글 OVERLAY 소스 (PF2e-KR Babele)
`modules/PF2e-KR/compendium/ko/pf2e.<pack>.json`, 영문 entry명 키 → `{name, description, ...}`.
- 커버리지: equipment 5509(≈98%) · spells 1785(≈99%) · feats 5727(≈77%, 미번역분 우리가 검수 채움).
- OVERLAY는 **텍스트만**(수치/구조는 BASE). 영문명/slug 매칭. 미해소분은 L4 우리 번역.

## 3. 3-레이어 아키텍처 (크리처에서 검증된 패턴을 전 엔티티로)
```
BASE (영문, FVTT-native)  ── 불변, 재추출 가능. system.rules 포함.
OVERLAY (한글, 텍스트만)  ── PF2e-KR 시드 + 검수. {id→{필드경로:한글}}
ACCESS (헬퍼/뷰 + RE엔진) ── BASE⊕OVERLAY 조인 + Rule Element 해석 → 시트/굴림 노출
```

## 4. Rule Element 엔진 — 빈도 기반 로드맵 (핵심 난관)
RE 인스턴스 총 17,216개 / 고유 key 38개 / RE 보유 문서 7,879개. **상위 10개가 80.8% 커버.**

| 순위 | RE key | 빈도 | 누적% | 역할(요약) |
|---|---|---|---|---|
| 1 | FlatModifier | 3909 | 22.7 | 스탯/굴림 보너스·페널티(type별 stacking) |
| 2 | ItemAlteration | 1758 | 32.9 | 다른 아이템 필드 변경 |
| 3 | GrantItem | 1549 | 41.9 | 아이템(재주/효과) 부여 |
| 4 | ActiveEffectLike | 1499 | 50.6 | 액터 데이터 경로 직접 증감 |
| 5 | RollOption | 1396 | 58.7 | 조건 토글/굴림 옵션 플래그 |
| 6 | ChoiceSet | 1295 | 66.3 | 선택지(우리 choice UI 대응) |
| 7 | Resistance | 751 | 70.6 | 저항 |
| 8 | Note | 703 | 74.7 | 굴림 노트 |
| 9 | DamageDice | 594 | 78.1 | 피해 주사위 추가/변경 |
| 10 | AdjustModifier | 460 | 80.8 | 기존 수정치 조정 |

11~38위(점진): AdjustDegreeOfSuccess, Strike, BaseSpeed, TempHP, AdjustStrike, Aura, Sense, Weakness, TokenLight, DamageAlteration, BattleForm, MartialProficiency, CriticalSpecialization, TokenMark, RollTwice, ActorTraits, CreatureSize, FastHealing, EphemeralEffect, Immunity, TokenEffectIcon, CraftingAbility, DexterityModifierCap, SubstituteRoll, MultipleAttackPenalty, SpecialStatistic, SpecialResource, LoseHitPoints.

**구현 전략**: 미구현 RE는 graceful no-op(데이터/표시는 정상, 자동화만 누락) + 로그. 빈도순으로 채워 커버리지 점증.

### RE 엔진 v1 구현 현황 (`dev/cs_re_engine.js`, P2 완료)
- **실측 커버리지 74.9%** (RE 17,198 중 12,889 처리). 솔로빌드 2000재주 0에러.
- **구현(13 key)**: FlatModifier, GrantItem(재귀+UUID해소), ActiveEffectLike(수치경로), RollOption(toggleable=기본off), ChoiceSet(preselected/기본=첫선택지→`rulesSelections` 플래그), Resistance/Weakness/Immunity, Note, DamageDice, AdjustModifier(slug매칭), BaseSpeed, Sense.
- **2-pass**: pass1=옵션/Choice/Grant/AELike/Sense/Speed → pass2=predicate평가 후 수정치풀 수집. **PF2e 스태킹**: 동일type 보너스=최고1·페널티=최저1, untyped=전부합산. `getStatistic(actor,selector)`.
- **브래킷 해소**(cs_pf2e.js `resolveBrackets`): `{item|flags.system.rulesSelections.X}`·`{item|name|id}`·`{actor|path}`.
- **v2 우선순위(미구현)**: ItemAlteration 1756(추가시 ~85%), AdjustDegreeOfSuccess 353, Strike 340, TempHP 238, AdjustStrike 220, Aura 215, TokenLight 141, DamageAlteration 130.
- **남은 P2 후속**: 베이스 숙련 수학(class/level/ability → 숙련등급별 기본치) 레이어는 P4 빌더통합에서 수정치풀 위에 결합.

## 5. 빌드 페이즈 (각 끝에 실데이터 검증 + 보고)
- **P0** 데이터 추출 ✅
- **P1** ACCESS 코어: 로더(인덱스+지연), BASE⊕OVERLAY 조인, predicate/roll-option 평가기, predicate 엔진.
- **P2** RE 엔진 v1: 상위 10 key(80%) + ChoiceSet→기존 choice UI 브리지. 액터 파생(AC/HP/내성/명중/기술/주문 DC) 재계산 파이프.
- **P3** 장비 통합: equipment.base → 장비/무기/방어구/룬 UI. 가장 위험 낮고 사용자 체감 큼.
  - ✅ **데이터 백본(`dev/cs_pf2e_equip.js`)**: 5646 장비 검색·필터(type/search/level/rarity/traits) + 한글 카드(가격/벌크/피해/특성/AC/dexCap…). enum 한글맵 `data/overlay/_lang.ko.json`(traits 1224·damageType·group). Node검증: sword검색·full-plate·longsword 카드 정확.
  - ✅ **P3.5 UI 배선**: `toLegacy()` 변환기(FVTT doc→레거시 WEAPON/ARMOR/SHIELD/GEAR shape 정확매칭: damage"1d8 S"·category군용·group·traits·ac_bonus·hardness/hp/bt). cs_ui.js `renderEquipBrowseItems`/`switchEquipTab`가 `PF2eEquip.legacyList` 소비(async 게이트 `_ensureEquipData`+레거시 폴백), gear탭은 FVTT일반장비+레거시 RUNE_DB(부착보존). HTML에 cs_pf2e/cs_pf2e_equip 스크립트 추가, **v565→v566 범프**. cs_save onload 사전로드. **헤드리스 검증**: 브라우저 fetch로 무기975·sword검색19·longsword=롱소드/군용/1d8 S/소드·gear4352 정상. node -c 4파일 OK.
  - ⏳ 남은 장비고도화(후속): 룬을 FVTT rune아이템으로 통합(현재 레거시 RUNE_DB 유지), @Damage/@UUID desc 인라인참조 해소(cs_monster resolveFoundryRefs 재사용), 장비 RE(저항/보너스)를 P2 엔진과 연결.
  - ⚠ 용어: PF2e-KR이 일부 음역(longsword=롱소드, 기존 Pathforge=장검 가능). P6 OVERLAY 검수에서 용어집과 reconcile.
- **P4** 주문/재주/혈통/배경/클래스/신격 빌더 연결. 기존 커스텀 DB(EFFECT_GROUPS 등) → BASE+RE로 이행.
  - ✅ **P4 파일럿 = 혈통+유산 (v0.5, 2026-06-30)**: 빌더 혈통(8→50)·유산(41→322)을 FVTT BASE⊕OVERLAY로 전면 교체. 유산 자동화 = RE 엔진(EFFECT_GROUPS 폐기 경로).
    - 신규 `dev/cs_pf2e_anc.js`(`PF2eAnc`): `ancestryToLegacy`(구조필드 boosts/flaws/hp/speed/size/vision/languages/grantWeapon 직접 매핑)·`heritageToLegacy`·`heritageEffects(herDoc,ctx)`(RE 엔진 → 레거시 `getHeritageEffects` 형태: vision/extraSenses/hpBonus/resistances/grantFeats/grantSkills). PF2eEquip 패턴 차용. node/브라우저 양용.
    - **RE 엔진 보강(cs_re_engine.js)**: ① `_num`+`PF2eData.evalFormula`(@actor.level·floor/max 수식 평가 → 저항 레벨스케일) ② ChoiceSet `rollOption` 시드(선택의존 predicate 발동, 예 warden-human hp/fort/armor) ③ AELike/Sense/GrantItem `predicate` 준수 ④ `dataChanges`(비능력치 AELike 경로)·`grantedDocs` 수집. **솔로 정전대조 37/37**.
    - **배선(레거시 폴백 병존)**: `getOptionsData`(모달 목록)·`getHeritage`/`getHeritageEffects`(cs_calc, `h._reEffects`면 RE 분기, 레벨/능력치 캐시키)·save 복원·`ancestry_pick` → `PF2eAnc.ready()` 우선. onload `_ensureAncData()` 사전로드 + 모달 미준비 시 재오픈.
    - **버그수정**: 유산 단독 시야(동굴 엘프 암시야 등)가 `state._featVisionUpgrade`(재주만 셋) 게이트에 막혀 미적용 → 시야 **항상 재계산**(혈통base→유산upgrade→재주 max). 레거시 유산에도 영향.
    - **남은 갭(graceful no-op)**: 미구현 RE 47유산(ItemAlteration/Strike/AdjustDegreeOfSuccess 등 상황형, 설명문이 커버) + 선택의존 GrantItem 5(고대 엘프·다재다능 인간 등 — 재주선택 UI 필요). 혈통 자체 RE(13/50, 대부분 조건부)는 구조필드 위주라 후속.
    - **확장 패턴**: 동일 어댑터(toLegacy + RE→레거시효과 + `_reEffects` 분기 + ready 폴백)를 배경·클래스·주문·재주에 복제. ✅ 완료.
  - ✅ **P4 확장 완료 (v0.6~0.9, 2026-06-30)**: 동일 패턴으로 4개 엔티티 추가.
    - **배경(v0.6)** `cs_pf2e_bg.js`: 40→490. 구조필드(부스트/기술/지식/재주) 직접매핑(레벨무관 _effects). getBackgroundEffects/모달/save 배선.
    - **주문(v0.7)** `cs_pf2e_spell.js`: 417→1796. 데이터카탈로그(rank/cantrip/focus/traditions/traits/range·area·defense 한글변환). getSpell 폴백 + `_allSpells()` 머지접근자(filterSpells/learn·memorize/choice).
    - **재주(v0.8)** `cs_pf2e_feat.js`: 1036→7398 **머지**(레거시 검증효과 우선, 미등재 6851 보강). featEffects(RE→레거시 effects). getFeat 폴백 + `_allFeats()` + `_getFeatEffectsDef` RE분기(`_fvttFeatDef`). **교차참조 ✅**: GrantItem getByUuid(effects/actions onload 프리로드) → 재주→재주(414)·재주→주문 grant 발동; 선행조건 feat-name 매칭. 라이브검증: 바람의베개→강력한도약, 해로우어헌신→해로우카드점술, 사우멘카르의왕관 prereq 협약헌신 보유 후 충족.
    - **클래스(v0.9)** `cs_pf2e_class.js`: 8→27. ⚠ **숙련진행이 FVTT 컴펜디움에 없음**(파운드리 시스템 TS 코드 전용, 데이터화 안 됨) → 신규 19클래스 `CLASS_PROF_EXT` **수작업**(PF2e PC1/PC2 정본, L1 contrib는 classes.base 앵커검증 173match). 레거시 8은 기존 CLASS_PROF_TABLE 유지. classToLegacy(hp/key_attrs/saves/perc/skills/casting). applyClassFeatures cp폴백 + 모달머지 + save. **잔여(후속)**: 신규클래스 서브클래스(SUBCLASS_DB)·레벨별특성(CLASS_FEATURE_NAMES)·시전 주문슬롯표(CLASS_SPELL_TABLE).
    - **아이콘 벤더링** `tools/build_pf4_icons.mjs`: 신규 엔티티 img(혈통42·유산194·주문789·재주365)를 로컬 Foundry(pf2e system + 코어 public)에서 data/icons/ 복사. iconImg img-폴백 해소.
    - **RE 엔진 v1.1 보강**: evalFormula(@actor.level)·ChoiceSet rollOption 시드·predicate 준수(AELike/Sense/GrantItem)·dataChanges/grantedDocs. 시야 게이트 버그 수정.
- **P5** 크리처 전량(7633) + hazard 시트/지도 연동(기존 cs_monster 확장). OVERLAY 병합.
- **P6** OVERLAY 검수·품질수정 로그(OVERLAY_FIXES.md), 미번역 채움.

## 6. 로딩/성능 전략
- 슬림 인덱스(id/name/level/traits/size)만 초기 로드 → 검색/목록.
- 상세는 slug 단위 지연 fetch(팩 파일 or 분할 청크). 49MB 전량 메모리 금지.
- 기존 헤드리스 E2E(iframe 하니스) 패턴으로 RE 엔진 단위검증.

## 6.5. P7 — GM 지도 드로어 DB 브라우저 (우선도 낮음, P0~P6 완료 후 착수)
사용자 요청(2026-06-27). **기존 청사진 전부 끝난 뒤** 진행.
- GM 지도 드로어를 **3분류 탭**으로: **지도 / 크리처 / 해저드**. 각 탭이 DB 목록 노출.
- 크리처/해저드 목록 = `data/base/creatures/_index.json`(슬림: id/name/level/size/traits/pack) 기반 → 한글명은 OVERLAY 조인.
- **검색 필수**(데이터 7633+1199 대량): 이름/레벨대/특성/출처 필터. Bestiary.html 검색 UI 패턴 재사용 가능.
- **기존 커스텀 기능 유지**: 드로어 탭 분리·드래그앤드롭 배치·툴바 최소화 등 기존 GM 드로어 규칙(SKILL.md "GM 지도 운영 = 드로어 중심") 그대로. DB 목록은 기존 커스텀 토큰/맵 위에 *추가*되는 소스.
- 토큰 배치 흐름 = 드로어 목록 항목 드래그 → 기존 createNpc/createToken 화이트리스트 경유(monsterId/hp/hpMax 자동).

## 7. 미해결/주의
- RE 엔진 = 사실상 미니 룰엔진. P2가 최대 리스크 구간 → predicate/option 평가가 정확해야 자동화 신뢰.
- 기존 빌더(EFFECT_GROUPS/PREREQ_GROUPS/choice)는 P4 이행 완료까지 **병존**. 한 번에 제거 금지.
- 라이선스: 배포 전까지 dev 전용. 공개 repo 푸시 보류 지속.
