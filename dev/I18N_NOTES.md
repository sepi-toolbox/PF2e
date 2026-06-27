# Pathforge UI 로컬라이즈 (한↔영) — 구조 노트

Pathforge UI를 런타임에 한국어↔영어로 전환하는 오버레이 시스템. **앱 거대 파일(cs_ui/cs_modal/cs_data 등 200~365KB) 무수정**이 핵심 원칙 — 데이터층 Babele 오버레이("영어에 한글 씌우기")의 UI 역방향판.

## 구성
- **`data/locale.json`** — `{ 한글: English }` 평면 테이블 (1689 엔트리, 영문값 한글누출 0). 단일 정본.
- **`cs_locale.js`** — `PFLocale.{load, ingest, t, has, setLang, getLang}` + 전역 `t()`. 미등록 키는 원문(한글) 폴백. `pf_lang`을 localStorage에 영속.
- **`cs_i18n.js`** — 런타임 DOM 번역 오버레이 (아래).
- **추출기** `tools/i18n/extract_strings.mjs`(UI 문자열), `tools/i18n/extract_dialogs.mjs`(다이얼로그 문자열).

## cs_i18n.js 동작
- **DOM 텍스트노드 + 속성**(placeholder/title/alt/aria-label)을 테이블 **정확 일치**로 치환. 원문은 `WeakMap`에 보존 → 한국어 완전 가역.
- **MutationObserver**(childList/characterData/attributes)로 동적 렌더분 자동 번역. 멱등(영문은 재매칭 안 됨).
- **기본 한국어 모드 오버헤드 ≈ 0** (`_on=false`면 옵저버 콜백 즉시 반환).
- **좌하단 🌐 토글 자동 주입**(다이스 FAB와 안 겹침). `[data-no-i18n]` 서브트리·SCRIPT/STYLE/TEXTAREA·contentEditable 제외.
- **핵심추출 `_findKey`** — 정확일치 실패 시 장식을 분리하고 **핵심이 테이블 정확일치일 때만** 번역(오탐 위험 낮음):
  - ① 선두 글리프/이모지: "⚠ 의식불명"→"⚠ Unconscious"
  - ② 후미 정수: "레벨 1"→"Level 1", "근력 10"→"Strength 10"
  - ③ ①+② 결합: "⚠ 빈사 1"→"⚠ Dying 1"
  - ④ 선두 카운터: "0/4 선택"→"0/4 Select"
  - ⑤ 후미 생략부호: "생사의 기로…사망...."(목록 미리보기 `desc.substring(0,60)+'...'`)→영문
- **다이얼로그 패치** — `alert/confirm/prompt`는 DOM 밖이라 옵저버가 못 잡음 → 메시지를 `_trStr`로 번역(EN 모드만). 멀티라인은 줄 단위(정적 헤드라인만 번역, 보간 값 라인은 한글 유지). 반환값 의미 보존.

## 배선
`CharacterSheet.html` / `GMSheet.html` / `Map.html` 각각에 `cs_locale.js` + `cs_i18n.js` 2줄만 추가. cs_i18n은 DOMContentLoaded에 테이블 로드 후 자동 init. (Bestiary.html은 자체 `data-t` 토글 보유 — cs_i18n 미적용. 몬스터 스탯블록은 의도적 한/영 병기.)

## 검증 (Chrome 헤드리스 E2E)
- 실제 CharacterSheet iframe: 레벨→Level, "레벨 1"→"Level 1", "0/4 선택"→"0/4 Select", 조건 설명 등. 한글↔영문 **가역 복원** 정상.
- **정적 쉘 번역율 ≈ 100%** (캐릭터 미로드 기준, 잔존 0).
- 다이얼로그: "소지금이 부족합니다!\n필요: …" → "Not enough funds!\n…"(헤드라인 번역, 값 라인 유지), "세션을 나가시겠습니까?"→"Leave the session?".
- 조건(상태이상) 설명 40종 전부 테이블화 → 상태이상 모달 일관 번역.

## 한계 (graceful — 모두 한글 유지, 깨지지 않음)
1. **혼합 노드** — 소스가 한 텍스트노드에 한글+값을 **중간에** 박은 경우(예: `${a}개 중 ${b}`처럼 양쪽에 값). 정적 쉘에선 0이지만, 캐릭터/콘텐츠 로드 시 일부 동적 문장에 잔존 가능.
2. **60자 초과 잘림 미리보기** — `desc.substring(0,60)+'...'`로 60자에서 잘린 긴 설명은 핵심이 부분문자열이라 미매칭(상세뷰는 전체 desc라 번역됨).
3. 이를 잡으려면 해당 **소스 호출부를 `t()`로 분리**(거대 파일 수정)해야 함 — 무수정 원칙과 트레이드오프. 필요한 소수만 선별 적용 권장.

## 확장 방법
1. 새 UI 한글이 영어로 안 뜨면 → `data/locale.json`에 `"한글":"English"` 추가(누출 0 유지). 글리프/후미숫자는 핵심만 등록(예 "빈사"만 등록하면 "⚠ 빈사 1" 자동 처리).
2. 새 다이얼로그 정적 문자열 → `tools/i18n/extract_dialogs.mjs` 재실행으로 누락분 확인 후 테이블 추가.
3. 보간형을 꼭 번역해야 하면 → 그 호출부만 `t('정적조각')` + 값 조합으로 소스 수정.
