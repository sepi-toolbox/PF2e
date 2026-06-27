# Pathforge 데이터 재기반 설계 — pf2e 영문 base + 한글 overlay

작성: 2026-06-27 세션 / 상태: **설계 확정, Phase 1 착수 대기**

## 0. 확정된 결정 (사용자)
- **전면 재기반**: Pathforge 데이터를 pf2e 구조화 데이터 위에 재구축
- **EN base + KO overlay**: 영문(수치·구조)을 base로 두고 한글은 텍스트만 오버레이 (영문 대체 X)
- **한글 소스**: PF2e-KR을 시드로 쓰고 **검수**(품질 문제는 수정 허용 + 업데이트 로그 작성)
- **dev 전용**: 배포/라이선스는 추후 사용자 협의 (운영 sync 금지)
- **max effort + 꼼꼼한 검수**, 과도 소요 시 보고

## 1. 데이터 소스 (실측 확인)
| 소스 | 내용 | 형식 | 비고 |
|------|------|------|------|
| Foundry pf2e v8.2.0 packs | 수치·구조·관계 (AC/HP/명중/피해/내성/주문) | LevelDB | `classic-level`로 추출 검증됨 |
| PF2e-KR (Rutz179) | 영/한 텍스트 (name/desc/hp·ac details/items) | Babele JSON (en/ko/ko-en) | CC BY-NC-ND → dev 전용·출처표기·검수로 수렴 |
| 6종 PDF (Downloads/패스파인더) | 정본 대조 | PDF | PZO12001/2/3/4/7(NPC Core)/9(Monster Core 2) |

> PF2e-KR `en` 폴더는 **텍스트만** (숫자 없음). 숫자·구조는 전부 Foundry pf2e에서.

## 2. 검증 결과 (monster-core 492마리 실측)
- LevelDB 추출 OK → 492 액터 / 6203 임베디드 아이템 / base 8.2MB
- **생물 헤더 오버레이 100%** (이름/설명/hpdetails, 영문명 키 정확 일치)
- **임베디드 per-creature _id 매칭 38.6%** (pf2e 버전 드리프트로 Foundry _id 불일치) → **의존 폐기**
- **공유팩 해소**: 주문 84.3%(접미사 제거 시 ~98%), 범용능력 27.8%(+템플릿/용어집)
- 병합 샘플: "고블린 전사(Goblin Warrior)" AC16/HP6/내성5·7·3, 타격 +7 1d6 — 정상

## 3. 아키텍처: 3 레이어
```
┌── BASE (영문, pf2e-native) ──────────── 불변, 재동기화 가능
│   creature/spell/feat/... 각 컬렉션. 수치·구조·관계 전부.
│   우리가 손대지 않음 (pf2e import 결과 그대로).
├── OVERLAY (한글, 텍스트만) ───────────── 우리가 채움/검수
│   { id → { 필드경로: 한글텍스트 } }. 숫자 없음.
│   PF2e-KR 시드 + 검수. 품질수정은 여기 + changelog.
└── ACCESS (헬퍼/뷰) ─────────────────── 앱이 읽는 통로
    base ⊕ overlay 조인 → 굴림/HP 엔진이 쓰는 형태로 노출.
    앱 전면 재작성 회피 (어댑터).
```

## 4. 엔티티 분류 (pf2e 타입 → Pathforge 컬렉션)
| pf2e | Pathforge | 현행 대응 |
|------|-----------|-----------|
| Actor npc | CREATURE_DB | (신규) |
| Item melee | (creature 내) strikes | (신규) |
| Item action | (creature 내) abilities | ACTION_DB 일부 |
| Item spell / spellcastingEntry | SPELL_DB / casting | SPELL_DB |
| Item feat | FEAT_DB | FEAT_DB |
| Item ancestry/heritage/background/class | 각 DB | 각 DB |
| Item weapon/armor/shield/equipment/consumable/treasure/ammo | EQUIPMENT | equipment_db |
| Item condition / affliction | CONDITIONS / AFFLICTIONS | CONDITIONS_DATA |
| Item deity / lore | DEITY_DB / lore | DEITY_DB |
| Actor hazard (GM Core) | HAZARD_DB | (신규) |

## 5. BASE 스키마 (pf2e-native, 실데이터)
```jsonc
// CREATURE_DB[i]
{
  "id": "goblin-warrior",          // slug (안정 키)
  "name": "Goblin Warrior",        // 영문 (overlay 매칭 키)
  "type": "npc",
  "system": {
    "abilities": { "str":{"mod":0}, "dex":{"mod":3}, ... },  // 수정치 직접
    "attributes": {
      "ac": {"value":16,"details":""},
      "hp": {"value":6,"max":6,"temp":0,"details":""},
      "speed": {"value":25,"otherSpeeds":[]}    // [{type:'fly',value:30}]
    },
    "saves": {"fortitude":{"value":5},"reflex":{"value":7},"will":{"value":3}},
    "perception": {"mod":2,"senses":[{"type":"darkvision"}],"details":""},
    "skills": {"acrobatics":{"base":5}, ...},
    "traits": {"rarity":"common","size":{"value":"sm"},"value":["goblin","humanoid"]},
    "details": {"level":{"value":-1},"languages":{...},"publicNotes":"...","blurb":"..."}
  },
  "items": [ /* strikes/abilities/spells, 아래 */ ]
}
// strike (item.type=melee, 근/원거리 공용)
{ "_id":"...","type":"melee","name":"Dogslicer",
  "system":{ "bonus":{"value":7},
    "damageRolls":{"<k>":{"damage":"1d6","damageType":"slashing"}},
    "range":{"increment":60,"max":null},          // 원거리만
    "attackEffects":{"value":["grab"]},           // 라이더(조건/행동 slug)
    "traits":{"value":["agile","finesse"]}, "slug":"dogslicer" } }
// ability (item.type=action)
{ "_id":"...","type":"action","name":"Goblin Scuttle",
  "system":{"actionType":{"value":"reaction"},"actions":{"value":null},
            "category":"...","description":{"value":"..."},"traits":{...},"slug":"..."} }
```

## 6. OVERLAY 스키마 + 4-레이어 텍스트 해소
```jsonc
// CREATURE_KO = { "Goblin Warrior": {
//   name:"고블린 전사", description:"...", hpdetails:"...",
//   items: { "<slug 또는 name>": {name:"...", description:"..."} } } }
```
아이템 한글은 **slug/이름 기반 다단 해소** (per-creature _id 의존 X):
1. **L1 per-creature overlay** — 생물 헤더 + 고유 아이템 (PF2e-KR 그대로, 100%/필요분)
2. **L2 주문 공유팩** — `spells-srd` 오버레이, 이름에서 `(At Will)/(Constant)/(Self Only)` 접미사 제거 후 매칭 (~98%)
3. **L3 능력 용어집 + 템플릿** — `bestiary-ability-glossary-srd`/`actionspf2e` + `텔레파시 N피트`·`빠른치유 N`·`암시야` 등 파라미터 템플릿
4. **L4 우리 번역 채움** — 위로 안 풀리는 생물 고유 능력만 (소량). PDF/용어집 기준.

## 7. 파이프라인
- **import**: `tools/extract_pf2e.mjs` (classic-level) → 팩별 BASE JSON (slug 키, 임베디드 join)
- **overlay resolve**: `tools/build_overlay.mjs` → L1~L4 병합 → CREATURE_KO
- **quality-fix**: 검수 수정은 overlay에만, `OVERLAY_FIXES.md`에 {대상, 원문, 수정, 사유} 로그
- **sync**: pf2e/PF2e-KR 갱신 시 재추출 (base는 덮어쓰기, overlay 수정분은 fix 로그로 재적용)

## 8. 빌드 단계 + 비용 정직 보고
- **Phase 1 (착수)**: monster-core 492 — 그린필드·고가치. 추출→오버레이→ACCESS 헬퍼→토큰 연동(굴림/HP). 위험 낮음.
- **Phase 2**: npc-core(250+)·monster-core-2(300+)·bestiary 1~3.
- **Phase 3 (비용 큼 — 별도 협의)**: 플레이어 콘텐츠(feat/spell/ancestry/class) 재기반.
  - **주의**: 현 빌더는 평탄 스키마 위 깊은 커스텀 자동화(EFFECT_GROUPS·PREREQ_GROUPS·choice UI·prereqs). pf2e는 Rule Elements 사용 → 전면 치환 = 빌더 데이터층 재작성 + 룰엔진 재구현 수준.
  - **권장**: base는 pf2e로 두되, 우리 확장 컬럼(effect_group_id 등)은 **overlay-extension 레이어**로 유지하며 기능별 점진 이행. 이 구간이 "과도 소요" 위험 → 진입 전 재보고.
```
