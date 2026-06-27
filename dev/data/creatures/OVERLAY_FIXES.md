# 한글 오버레이 — 번역 추가 · 품질 검수 로그

PF2e-KR(CC BY-NC-ND) 시드 기반 한글 오버레이에 대한 우리 작업 기록.
원칙: 영문 base(pf2e) 불변, 한글 텍스트만 보강/교정. 모든 손작업은 `_manual.ko.json`(L0, 최우선) 경유 → 재빌드해도 보존.

## 1. 번역 추가 (영문→한글, L4 미해소분)
PF2e-KR/공유팩/템플릿으로 자동 해소되지 않은 항목을 직접 번역. `_manual.ko.json`의 `items`(전역)·`creatures`(생물별).

- **타격명 156종** — 자연무기/특수타격 전수 번역 (Mental Blast→정신 강타, Acid Maw→산성 아가리, Wraith Touch→망령의 손길, Tail Lash→꼬리 후려치기, …). 전체 타격 2605개 한글화 100%.
- **능력 15종** — NPC Core 특수능력 (Acrobatic Specialist→곡예 전문가, Swarming→군집, Skittish→겁많음, Strong Lungs→강한 폐 등). 설명 동반분은 본문도 번역.
- **고유 장비·아이템 194종** — 휴대 장비/무기/방어구/소모품/보물/지식/탄약 (equipment-srd 등 공유팩에 없는 고유항목). 병렬 번역 에이전트 4개로 처리 후 병합·검수. @-참조(@Damage/@Check/@UUID) + HTML 보존, 고유명사 음역(Ydersius→이데르시우스), CJK 0 검증. 예: 공허유리 쿠크리, 연금술 수류탄(화염), 이데르시우스의 종교 상징.
- 표준 PF2e 한국어 관례 적용(용어집에 자연무기 항목 없음). 고유명사는 음역(Taravari→타라바리).

## 2. 품질 검수 — 기계번역 오염 교정
PF2e-KR 본문의 일본어 조각 혼입(MT 파이프라인 잔재) 발견·교정. 이름 필드는 깨끗(외국문자 1건=한자 병기, 의도적).

### 2-1. 토큰 새니타이저 (`build_overlay.mjs`의 SANITIZE 맵) — 12마리 일괄 교정
| 오염 | 교정 |
|------|------|
| 파라スマ | 파라스마 (Pharasma) |
| 인プリント | 인프린트 (Imprint) — Frost/Wyvern/Jungle/Desert/River/Flame Drake 6종 공유 |
| ハンサム | 핸섬 (Succubus) |
| 신경パル스 | 신경 펄스 (Sphinx) |
| 의심の対象 | 의심의 대상 (Werewolf) |
| 灰色の主人 | 회색의 주인 (Jorogumo) |
| 요소への | 요소에의 (Infernal Registrar) |

### 2-2. 생물별 재번역 (`_manual.ko.json` creatures) — 무거운 일본어 절 2건
영문에 생물별 수치(@Damage 등)가 박혀 전역 override 불가 → 생물-범위로 교정. @-참조 보존, 영문에서 재번역.
- **Giant Leech / Blood Drain(피 흡수)**: 일본어 절 → 재번역 (@Damage[2d4] 수치 보존)
- **Thousand Thieves / Squirming Injection(꿈틀거리는 주사)**: 일본어 절 → 재번역 (@Damage[6d6] 보존)

→ 결과: 전체 1209마리 본문 **잔여 가나 0**.

## 3. 리졸버 개선 (매칭 회복, 손번역 불필요분)
- 주문: 다중 괄호 접미사 제거 → "Invisibility (At Will) (Self Only)" 등 회복 (주문 미해소 56→0 수렴)
- 두루마리: `Scroll of {주문} (Rank N)` → 주문 컴펜디엄 조회 + "두루마리"
- 시전블록: CAST_NAMES (Cleric Domain Spells→클레릭 영역 주문 등 표준 16종)
- 장비: 괄호접미사 제거 후 재매칭 ("Breastplate (Shoddy)"→Breastplate)

## 현재 커버리지
- 아이템 해소 **100%** (16,071개 전부) — 생물헤더·타격·능력·장비·주문·효과·조건 전부 한글, **L4 미해소 0**, 전체 1209마리 잔여 가나/CJK 0.
- 해소 경로: 매칭(PF2e-KR 공유팩) ~88% + 손번역(`_manual.ko.json` 365 items + 2 creatures) + 템플릿/새니타이저.

## 비고 (보류)
- Dogslicer→"개살해칼": 어색하나 오역 아님(literal). 음역(도그슬라이서) 전환은 사용자 판단 대기 → 미수정.
