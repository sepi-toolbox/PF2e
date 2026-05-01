# FEAT_DB v3 시안 — effects/choice 1:N 정규화

작성: 2026-05-01 (v529 dev/ 기준)
선행: `project_feat_db_v2_architecture.md` (Phase 1+2 적용 완료)
정책 근거: `SKILL.md` v527 데이터 모델링 정책 — "다양한 종류 묶음 배열 → 별도 1:N 테이블"

---

## 1. 배경 및 동기

v528~v529에서 PREREQ_GROUPS 정규화 (1:N 외래키), FEAT_EFFECTS/CLASS_FEATURE_NAMES 통합을 완료했지만, 그 과정에서 추가된 `FEAT_DB.effects` 컬럼은 **타입이 다른 효과 객체를 한 배열에 묶은 형태** — v527 정책 ("배열은 같은 종류 복수에만") 위반이 그대로 남아있다.

PREREQ_GROUPS와 같은 1:N 별도 테이블로 분리하면:
- v527 정책 일관성 회복
- type별 컬럼 사전 명확화 (Excel 편집 / db_column_dict.js)
- v9 시안의 미적용 항목 ("choice 시스템을 effects type으로 흡수")까지 한 번에 정리 가능
- 미래 PC2 등재 시 FEAT_EFFECTS const 완전 제거의 사전 정지작업

## 2. 현황 통계 (dev/feat_db.js v529)

```
FEAT_DB:                987 행
effects 보유 행:        796 (단일 725 / 복수 71)
choice 보유 행:          39
choiceEffects 보유 행:    2 (beast-trainer, hold-mark)

effect type 종류:        33
top types:
  display_note    713
  grant_action     33
  skill_trained    27
  grant_focus_spell 19
  grant_feat       12
  grant_innate_spell 10
  familiar_abilities 8
  weapon_familiarity 7
  save_bonus        5
  hp_bonus          4
  cantrip_slots     4
  speed_bonus       3
  spell_slots       3
  speed_extra       2
  bulk_bonus        2
  ... (그 외 18개 type 각 1~2건)

다중 effects 케이스 (length>1): 71행 — 정규화 시 group_id로 묶임
top type 조합:
  display_note + grant_focus_spell : 18
  display_note + grant_action       : 13
  display_note + skill_trained      :  9
  grant_feat   + skill_trained      :  7
  ...
```

## 3. 제안 스키마

### 3.1 EFFECT_GROUPS (신규 const, cs_data.js — PREREQ_GROUPS 다음)

PREREQ_GROUPS 패턴을 그대로 따른다. 단일 테이블 + sparse 컬럼.

```js
const EFFECT_GROUPS = [
  // group_id, type, value, ...type별 sparse 컬럼
  { group_id: 'eg-bard-dedication', type: 'display_note', text: '오컬트 캔트립 2개 습득. ...' },
  { group_id: 'eg-bard-dedication', type: 'skill_trained', skill: 'occultism' },
  { group_id: 'eg-bard-dedication', type: 'skill_trained', skill: 'performance' },
  { group_id: 'eg-fighter-resiliency', type: 'hp_bonus', value: 3 },
  { group_id: 'eg-fighter-resiliency', type: 'display_note', text: '...' },
  ...
];
```

### 3.2 FEAT_DB 컬럼 변경

```
- effects: [...]                 ← 제거
+ effect_group_id: 'eg-...'      ← 신규 (PREREQ pattern과 동일)
```

### 3.3 EFFECT_GROUPS 컬럼 사전 (db_column_dict.js)

| 컬럼 | 사용 type | 설명 |
|---|---|---|
| `group_id` | 모두 | FEAT_DB.effect_group_id 외래키 |
| `type` | 모두 | enum: hp_bonus, skill_trained, grant_action, ... (33종) |
| `value` | hp_bonus, save_bonus, speed_bonus, ac_bonus, bulk_bonus, cantrip_slots, dying_threshold, familiar_abilities, initiative_bonus, recovery_dc, resistance, speed_extra, spell_slots | 수치 또는 'level' 키워드 |
| `skill` | skill_trained, grant_feat_if_trained | skill id (occultism 등) |
| `text` | display_note | 자유 텍스트 (한글 + `$choice_name` 토큰) |
| `save` | save_bonus | will/fort/reflex/all |
| `bonus_type` | save_bonus, ac_bonus, initiative_bonus | circumstance/status/item/... |
| `condition` | save_bonus, ac_bonus | 한글 조건 텍스트 ("감정 효과") |
| `spell` | grant_innate_spell, grant_focus_spell | 주문명 (또는 `$domain_initial`) |
| `tradition` | grant_innate_spell | arcane/divine/occult/primal |
| `spell_type` | grant_innate_spell | spell/cantrip |
| `uses` | grant_innate_spell | "하루 1회" 등 |
| `feat` | grant_feat, grant_feat_if_trained | 부여 재주명 (한+영) |
| `default_choice` | grant_feat, grant_feat_if_trained | 자식 재주의 기본 choice |
| `weapons` | weapon_familiarity, weapon_trained | **배열 OK** (같은 종류 복수) |
| `weapon_name` | grant_weapon | |
| `weapon_category` | grant_weapon | unarmed/simple/martial |
| `damage` | grant_weapon | "1d6 P" |
| `range` | grant_weapon | 0=근접 |
| `traits` | grant_weapon | **배열 OK** (같은 종류 복수) |
| `vision` | vision_upgrade | "암시야" / "상위 암시야" |
| `sense` | extra_sense | 자유 텍스트 |
| `damage_type` | resistance, damage_note | "정밀" / "냉기" |
| `scaling` | damage_note | dice scaling — **단일 객체 예외** (별도 시트 SCALING_DB로 분리 가능, 현재는 인라인 유지 권장 — 적용처 1건뿐) |
| `action` | grant_action | action id (aoo 등 — ACTION_DB 외래키) |
| `summary` | grant_action | action id 없는 인라인 행동 텍스트 |
| `action_cost` | grant_action | 1/2/3/free/reaction |
| `name` | grant_lore | 지식 분야 한글명 |
| `target` | proficiency | 무기/갑옷/기타 |
| `rank` | proficiency, spell_slots | T/E/M/L 또는 1~10 |
| `key` | speed_extra | climb/swim/fly |
| `from` | armor_upgrade | 변환 전 갑옷 카테고리 |

→ ~30 컬럼, 거의 모두 sparse. PREREQ_GROUPS(4 컬럼)보다 크지만 type 다양성 자체가 PREREQ보다 큼. v527 정책의 "컬럼 폭증 vs 별도 테이블" 비교에서, 33 type을 type별 별도 테이블로 쪼개면 33개 테이블 폭증이 더 심하므로 단일 테이블 + sparse 컬럼이 정도.

### 3.4 choice / choiceEffects 통합 옵션 (별도 결정)

#### 옵션 A: choice를 effect type='choice'로 흡수 (v9 시안 원안)

```js
// EFFECT_GROUPS 행
{ group_id: 'eg-bard-dedication', type: 'choice', choice_kind: 'custom',
  choice_label: '뮤즈를 선택하세요', choice_options_id: 'co-bard-muse' }

// CHOICE_OPTIONS (또 다른 1:N 테이블, custom/skill_defaults용)
{ options_id: 'co-bard-muse', option_id: 'muse-enigma', option_name: '수수께끼' }
{ options_id: 'co-bard-muse', option_id: 'muse-maestro', option_name: '마에스트로' }
...
```

choiceEffects (2건뿐: beast-trainer, hold-mark)는 EFFECT_GROUPS 행에 `if_choice='sun'` 같은 필터 컬럼 추가:
```js
{ group_id: 'eg-hold-mark', type: 'skill_trained', skill: 'diplomacy', if_choice: 'sun' }
{ group_id: 'eg-hold-mark', type: 'save_bonus', save: 'will', value: 1, if_choice: 'sun', condition: '...' }
```

장점: choice도 effect로 통일, 컬럼 사전 일원화.
단점: choice type이 12종(custom/skill/skill_defaults/skill_fixed/skill_multi/spell_cantrip/spell_rank/feat_pick/weapon_pick/ancestry_pick/lore/muse_pick)이라 EFFECT_GROUPS 컬럼이 더 늘어남. CHOICE_OPTIONS 테이블 추가 필요.

#### 옵션 B: choice는 별도 컬럼 유지 (현 v529 그대로)

`FEAT_DB.choice` JSON 객체 + `FEAT_DB.choice_effects` 객체를 v529 형태로 유지.

장점: 변경 범위 최소. choice 호출 코드(`openFeatChoiceModal`) 무수정.
단점: v527 정책 위반 잔존. `choiceEffects.sun = [...]` 형태가 또 다른 묶음 객체.

#### 옵션 C: 단계 분할 (권장)

**Phase 3a (effects만 분리)**: 옵션 B 채택 (choice 그대로) — 영향 범위 작고 검증 쉬움.
**Phase 3b (choice 흡수)**: PC2 등재 후 별도 토론. choice는 모달 UI와 결합도가 높아서 함께 리팩터링.

## 4. 마이그레이션 계획

### Phase 3a — effects만 분리 (choice 유지)

#### 4.1 일회성 스크립트 `tools/migrate_feat_db_v3_phase3a.js`
1. dev/feat_db.js, dev/cs_data.js를 vm 컨텍스트로 로드
2. 모든 FEAT_DB 행 순회:
   - `effects` 배열 → EFFECT_GROUPS 행들로 펼침
   - `group_id = 'eg-' + feat.id` 규칙 (PREREQ와 동일)
   - 단일/복수 모두 group으로 묶임 (PREREQ가 단일도 group_id 가지는 패턴)
   - 빈 effects 행은 effect_group_id=null
3. FEAT_DB의 `effects` 컬럼 제거, `effect_group_id` 추가
4. cs_data.js에 EFFECT_GROUPS const surgical insert (PREREQ_GROUPS 다음)
5. `--dry`: 통계 (총 effect 행 수, type 분포, FK 무결성) 만 출력

#### 4.2 cs_calc.js — 헬퍼 추가
```js
let _effectGroupIndex = null;
function getEffectRows(groupId) {
  if (!groupId) return [];
  if (!_effectGroupIndex) {
    _effectGroupIndex = new Map();
    for (const r of EFFECT_GROUPS) {
      const arr = _effectGroupIndex.get(r.group_id) || [];
      arr.push(r);
      _effectGroupIndex.set(r.group_id, arr);
    }
  }
  return _effectGroupIndex.get(groupId) || [];
}
function _rowToEffect(r) {
  // group row → 기존 effect 객체 형태로 변환 (호환층)
  const e = { type: r.type };
  for (const k of Object.keys(r)) if (k!=='group_id' && k!=='type' && r[k]!=null) e[k]=r[k];
  return e;
}
```

#### 4.3 cs_feat_effects.js — `_getFeatEffectsDef` 갱신
```js
function _getFeatEffectsDef(nameEn) {
  const fd = getFeat(nameEn);
  if (fd && (fd.effect_group_id || fd.choice || fd.choiceEffects)) {
    const def = {};
    if (fd.effect_group_id) {
      def.effects = getEffectRows(fd.effect_group_id).map(_rowToEffect);
    }
    if (fd.choice) def.choice = fd.choice;
    if (fd.choiceEffects) def.choiceEffects = fd.choiceEffects;
    return def;
  }
  // PC2 미등재용 legacy fallback
  if (typeof FEAT_EFFECTS!=='undefined' && FEAT_EFFECTS[nameEn]) return FEAT_EFFECTS[nameEn];
  return null;
}
```

→ `applyFeatEffects` 본체는 `def.effects` 배열만 보고 동작하므로 호출 측 무수정.

#### 4.4 도구 갱신
- `tools/db_schema.js`: EFFECT_GROUPS 시트 등록
- `tools/db_column_dict.js`: EFFECT_GROUPS 컬럼 30개 사전 + FEAT_DB.effects 제거 / effect_group_id 추가
- `tools/rebuild_feat_db.js`: effects 보존 → effect_group_id 보존으로 변경. EFFECT_GROUPS는 별도 보존 풀 또는 별도 rebuild 스크립트 (`rebuild_effect_groups.js`?)
- `tools/audit_text_lookups.js`: HIGH 0 유지 확인

## 5. 영향 범위 (Phase 3a 변경 코드)

### 5.1 데이터 (cs_data.js)
- EFFECT_GROUPS const 신규 (예상 ~900행 — 796 base + 71 다중분 ~70추가)

### 5.2 데이터 (feat_db.js)
- 모든 effect 보유 행에서 `"effects": [...]` → `"effect_group_id": "eg-..."` 치환

### 5.3 cs_calc.js
- `getEffectRows(groupId)` 헬퍼 신규 (Map 인덱스)
- `_rowToEffect(r)` 변환 함수 신규

### 5.4 cs_feat_effects.js
- `_getFeatEffectsDef` 갱신 (1곳)
- 그 외 `applyFeatEffects`/`_applyOneEffect` 본체는 무수정 (effect 객체 형태가 같음)

### 5.5 도구 (tools/)
- 신규: `migrate_feat_db_v3_phase3a.js`, `rebuild_effect_groups.js` (선택)
- 갱신: `db_schema.js`, `db_column_dict.js`, `rebuild_feat_db.js`, `audit_text_lookups.js`

### 5.6 무영향 (변경 없음)
- cs_modal.js (PREREQ는 이미 정규화됨, effects는 헬퍼 경유)
- cs_ui.js, cs_save.js, cs_session.js, cs_dice.js
- class_features_db.js (CLASS_FEATURE_NAMES IIFE는 effect_group_id도 동일하게 파생 가능)
- SPELL_DB, equipment_db (무관)

## 6. 검증 체크리스트

- [ ] 모든 dev/*.js `node -c` syntax pass
- [ ] `node tools/audit_text_lookups.js` HIGH 0 유지
- [ ] FK 무결성:
  - FEAT_DB.effect_group_id → EFFECT_GROUPS.group_id orphan 0
  - EFFECT_GROUPS.group_id 중 FEAT_DB에서 참조 안 되는 unused 0
- [ ] effect type 분포가 v529와 동일 (총 행 수, type별 카운트)
- [ ] rebuild_feat_db.js 재실행 시 effect_group_id 보존
- [ ] rebuild_effect_groups (또는 등가)로 EFFECT_GROUPS 재생성 가능
- [ ] 스모크 테스트:
  - getFeat('Toughness').effect_group_id 존재
  - getEffectRows(...) → hp_bonus 행 반환
  - applyFeatEffects 동작 (HP 보너스 +레벨 적용)
  - keen-eyes / plant-nourishment / 클래스 features 효과 정상
  - hold-mark 4가지 choice 분기 (choiceEffects 호환)
- [ ] 버전 범프: dev/ 한정 +1, 운영은 별도 deploy
- [ ] 사용자 브라우저 회귀 테스트 (자동화 불가) — 재주 추가/제거, 기존 캐릭터 로드

## 7. 트레이드오프 및 미결정 사항

### 7.1 단일 테이블 sparse vs type별 분리
**선택**: 단일 테이블 + sparse 컬럼 (PREREQ 패턴 일관성).
**이유**: 33 type을 별도 테이블로 쪼개면 테이블 수 폭증. PREREQ는 4 컬럼이라 sparse가 자연스러웠지만, EFFECT는 ~30 컬럼이라 Excel에서 시인성 떨어짐 — `db_column_dict.js`로 보완. 사용자 정책 우선순위에 따라 변경 가능.

### 7.2 damage_note.scaling (단일 객체)
**선택**: 인라인 유지 (적용처 sneak-attacker 1건뿐).
**이유**: 별도 SCALING_DB로 분리할 만한 양이 안 됨. 미래 추가 시 재검토.

### 7.3 weapons / traits 배열
**선택**: 배열 유지.
**이유**: v527 정책의 "같은 종류 복수"에 해당. weapon_familiarity의 weapons는 모두 무기명, traits는 모두 trait. type 정보가 섞이지 않으므로 OK.

### 7.4 choice/choiceEffects 흡수 시점
**선택**: Phase 3a에서 미흡수, 옵션 C(단계 분할).
**이유**: choice는 `openFeatChoiceModal` UI 분기 12종과 결합도가 높아서 effects와 별개로 토론 필요. PC2 등재 후 Phase 3b로.

### 7.5 group_id 명명 규칙
**선택**: `eg-` + feat.id (PREREQ는 `gid-` + feat.id).
**이유**: PREREQ와 prefix 충돌 방지. `eg-`(effect group)가 짧고 검색 용이.

### 7.6 빈 effects 처리
**선택**: `effect_group_id: null` (행 자체 없음).
**이유**: PREREQ_GROUPS도 prereq 없는 재주는 prereq_group_id=null. 일관성.

## 8. 진행 순서 (사용자 승인 시)

1. 본 시안 검토 및 결정사항 확정
2. `tools/migrate_feat_db_v3_phase3a.js` 작성 (--dry 지원)
3. dry-run으로 통계/FK 무결성 검증
4. 본 적용 → cs_data.js EFFECT_GROUPS 삽입 + feat_db.js effect_group_id 치환
5. `cs_calc.js` 헬퍼 + `cs_feat_effects.js` `_getFeatEffectsDef` 갱신
6. 도구 갱신 (db_schema, db_column_dict, rebuild_feat_db)
7. 검증 체크리스트 전체 통과
8. 버전 범프 (dev/만, v530)
9. 사용자 브라우저 회귀 테스트
10. `/pf2e-deploy` (v523~v530 누적)

## 9. 미결정 / 사용자 입력 필요

- [ ] 옵션 A vs C (choice 흡수 여부) — Phase 3a는 C 권장
- [ ] EFFECT_GROUPS 컬럼명 케이스 (snake_case 권장 vs camelCase) — PREREQ_GROUPS 기존 패턴 확인 필요
- [ ] rebuild_effect_groups.js 필요 여부 (수동 편집만 가능하면 생략 가능)
- [ ] feat_legacy_id 등 메타 컬럼처럼 `effect_legacy_format` 보존 필요한지 (옵션 — 디버깅용)
