# 몬스터 UI · 토큰↔몬스터 연동 · HP 시스템 — 구조 노트

BASE(영문 pf2e) ⊕ OVERLAY(한글) 크리처 데이터(1209마리)를 시트/지도에서 쓰기 위한 UI 레이어.

## 구성
- **`cs_monster.js`** (MonsterDB) — 데이터 로드/접근자 + `renderStatBlock(id)`(한글 스탯블록 HTML) + `resolveFoundryRefs`(@Damage/@Check/@UUID/@Template→한글) + `bindRolls(el)`(이벤트위임 .roll→DiceRoller) + `injectStyles`/`STYLES`.
- **`cs_dice.js`** — `rollFormula(formula,label)` 추가: 다중 주사위 그룹+상수 합산("2d8+6+2d6"→4주사위+6).
- **`Bestiary.html`** — 자립형 몬스터 도감(검색·출처·레벨대·정렬 + 스탯패널 + 클릭굴림 + 한/영 토글). MonsterDB+cs_dice+cs_locale 사용.
- **`Map.html` + `cs_map.js`** — 토큰↔몬스터 연동 + HP 시스템(아래).

## 토큰↔몬스터 연동 (Map)
- 토큰 편집기(드로어 팔레트)에 **몬스터 검색행** → 선택 시 `monsterId`/`monsterName`/`hpMax` 저장 + **크기 자동**(lg→large)·이름 자동.
- 배치 토큰 탭 → **📋 스탯** 팝오버(renderStatBlock + 굴림), **HP 컨트롤**(−피해/＋회복).
- `MonsterLink` 글루(Map.html): 26MB 데이터 **첫 사용 시 지연 로드**.

## HP 시스템
- 몬스터 연결 시 `hpMax` = MonsterDB.hp(creature).max 자동. 배치 토큰은 `hp` = `hpMax`로 시작.
- **HP 바**: `_drawOneToken`에서 `hpMax>0 && _effGM()`일 때 토큰 위 렌더(녹>황>적). **GM 뷰 전용**(플레이어는 적 HP 안 보임). PC 토큰은 hpMax=0 → 바 없음(HP는 시트에서 관리).
- **피해/회복**: 토큰 액션 팝오버에서 값 입력 + −피해/＋회복 → `upsertToken({hp:clamp(0,hpMax)})` → 전 클라이언트 동기화.

## 동기화 경로 (감사 완료 — 코드 레벨)
1. 템플릿 생성(`createTemplate`) → 몬스터 링크 시 `updateTemplate({monsterId,monsterName,hpMax})` **merge** → 템플릿 리스너 전체필드 스프레드.
2. 드래그 배치 `_placeTemplateAtClient` → `createNpc` → `createToken`(화이트리스트에 monsterId/monsterName/hpMax/hp 포함, hp 기본=hpMax).
3. 토큰 리스너 `Object.assign({id}, doc.data())` **전체필드 스프레드** → 전 클라이언트 `_tokens`에 필드 복원.
4. 피해/회복 `upsertToken({hp})` **merge** → 리스너 재발화 → HP 바 갱신.
- 모든 단계가 전체필드 스프레드 또는 신규필드 포함 화이트리스트 → **누락 지점 없음**.

## ⚠️ 라이브 멀티세션 점검 (사용자 몫 — 헤드리스 불가)
헤드리스로 Firebase 인증·2클라이언트 왕복은 못 돌림. 아래 절차로 직접 확인 권장:
1. GMSheet에서 세션 생성 → 지도 진입(GM).
2. 드로어 🎭토큰 → ＋토큰 추가 → 편집기에서 **몬스터 검색·선택**(예 "고블린") → 크기/HP 자동 채워지는지 확인.
3. 토큰을 지도로 드래그 배치 → **HP 바**가 토큰 위에 뜨는지(GM 뷰).
4. 토큰 탭 → **📋 스탯**(한글 스탯블록 + 능력치/공격/피해 클릭 굴림), **−피해 10** → HP 바 감소.
5. 다른 브라우저/탭에서 **플레이어로 입장**(role=player) → 같은 토큰 위치/이동 동기화, 적 HP 바는 **안 보임** 확인.

## 검증 완료 (Chrome 헤드리스)
- 스탯블록: 다중피해 2d8+6+2d6→4주사위+6=합산, 공격 d20, 내성 d20.
- Bestiary: 1209마리 렌더·필터·클릭굴림·한/영 토글.
- 토큰 연동 글루(실제 Map.html 추출): 검색→연결(크기 large·HP 150 자동·monsterId 저장)→스탯→굴림→해제.
- HP: 배치 hp=hpMax, 피해/회복 클램프(0~max).
