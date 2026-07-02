# 레거시 FEAT_DB 제거 시 드롭된 재주 (v0.54)

FEAT_DB(구 큐레이션 1036) 제거 → FVTT 재주 카탈로그(PF2eFeat, feats.base 7398) 단일 소스 전환.
레거시 1036 중 FVTT에서 slug·name_en·name_ko 어느 것으로도 해소되지 않는 56개를 분류:

## ① 자동 클래스 특성 (28) — 기능 손실 없음
피트풀에서 선택하는 재주가 아니라 클래스 진행 자동 특성. `class_features_db.js`(CLASS_FEATURE_NAMES) + `CLASS_PROF_EXT` 숙련표가 처리한다. 레거시가 이를 "재주"로도 중복 등재했을 뿐.
counterspell-witch, lightning-reflexes-{bard,druid,witch,wizard}, vigilant-senses-{bard,rogue}, magistry-spells-bard, {divine,primal,arcane}-spellcasting-{cleric,druid,wizard}, steadfast-faith-cleric, sixth-doctrine-cleric, great-fortitude-druid, wild-resolve-druid, perception-master-ranger, greater-evasion-ranger, incredible-senses-{ranger,rogue}, sneak-attack-{1,2,3,4}d6-rogue, racket-rogue, slippery-mind-rogue, hexes-witch, witch-weapon-expertise-witch

## ② FVTT에 소스접미사 변형 존재 (13) — 손실 없음
FVTT는 여러 출처에 등장하는 재주를 "이름 (출처)"로 분리 등재한다. 레거시의 제네릭 slug 대신 FVTT 변형을 선택하면 된다(예: tusks → tusks-orc / tusks-half-orc, guardians-deflection → guardians-deflection-fighter, blade-break → blade-brake 철자정정).
tusks, blessed-blood, tree-climber, irrepressible, eternal-wings, soulsight, guardians-deflection, dueling-dance, twinned-defense, tumble-behind, predictive-purchase, implausible-purchase, spirit-familiar

## ③ 실제 드롭 (15) — 리마스터 컴펜디움 부재 = 프리마스터/갭 재주
FVTT `pathfinder-` 리마스터 팩(feats.base 7398)에 slug·이름 어느 것으로도 없음. 대부분 프리마스터(CRB) 재주로 리마스터에서 제거/개명됨(무기 전문/frenzy → 리마스터는 weapon-familiarity 계열, versatile-heritage → 리마스터 방식 변경 등).
blade-break, coercion, connections, mountain-roots, vengeful-hatred, expert-elven-weaponry, gnome-weapon-expertise, goblin-weapon-frenzy, halfling-weapon-expertise, versatile-heritage, orc-weapon-expertise, recognize-poison, planar-sense, fast-study, sound-estimation

### 대응
- 앱은 FVTT/리마스터 네이티브 방향 → 프리마스터 재주 미포함이 정합.
- 구 저장 캐릭터가 이 slug를 담고 있으면 getFeat가 null → 인스턴스 저장 데이터(_data)로 graceful 표시(카탈로그 보강만 없음).
- 사용자가 특정 항목 복원을 원하면 `data/override/feats.json` 또는 소규모 갭 큐레이션으로 재추가 가능(요청 시).
