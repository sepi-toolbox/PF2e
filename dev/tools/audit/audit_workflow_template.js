export const meta = {
  name: 'pf2e-audit-split',
  description: 'PF2e 번역 데이터 전수검사 — 오탈자·오역·용어정본·손상수복·충돌리네임 (496 배치 병렬)',
  phases: [
    { title: '전수검사', detail: '11카테고리+크리처+UI 배치 감수' },
    { title: '수복', detail: '손상 엔티티 73건 재구성' },
    { title: '리네임', detail: '한글명 충돌 161건 구분' },
  ],
}
const P = '/tmp/pf2e-audit' // ⚠ 실행 세션의 감사 디렉토리로 조정
const COUNTS = { items_actions: 21, items_ancestries: 1, items_backgrounds: 12, items_classes: 1, items_conditions: 1, items_deities: 15, items_effects: 24, items_equipment: 127, items_feats: 113, items_heritages: 4, items_spells: 44, creatures: 279, ui: 11, csdata: 2, repair: 12, rename: 5 }

const CANON = `## 정본 용어집 (위반 발견 시 반드시 정정)
- 숙련도: Untrained 미숙련 / Trained 숙련 / Expert 전문가 / Master 달인(«마스터»·«대가» 금지) / Legendary 전설
- 기술: Acrobatics 곡예 / Arcana 주문학 / Athletics 운동 / Crafting 제작 / Deception 기만 / Diplomacy 외교 / Intimidation 위협(«협박» 금지) / Lore 지식 / Medicine 의학 / Nature 자연학 / Occultism 오컬티즘 / Perception 지각 / Performance 공연 / Religion 종교학 / Society 사회(«사회학» 금지) / Stealth 은신 / Survival 생존 / Thievery 도둑질
- 피해유형: Bludgeoning 타격 / Piercing 관통 / Slashing 참격 / Fire 화염 / Cold 냉기 / Electricity 전기 / Acid 산성 / Sonic 음파(«음향» 금지) / Poison 독 / Vitality 활력(«생명력 피해» 금지) / Void 공허 / Mental 정신 / Force 역장(«힘»·«포스» 금지 — 2026-07-02 사용자 확정) / Spirit 영혼(«정신력» 금지) / Bleed 출혈
- 상태: Blinded 눈멈 / Broken 파손됨 / Clumsy 둔함 / Concealed 은폐 / Confused 혼란 / Controlled 지배됨 / Dazzled 눈부심 / Deafened 귀먹음 / Doomed 파멸 / Drained 생명력 고갈 / Dying 빈사 / Encumbered 과적 / Enfeebled 약화됨 / Fascinated 매혹 / Fatigued 피로 / Fleeing 도주 / Frightened 공포 / Grabbed 조이기 / Hidden 숨겨짐 / Immobilized 이동 불가 / Invisible 투명 / Observed 발각됨 / Off-Guard 무방비(«오프가드» 금지) / Paralyzed 마비 / Petrified 석화 / Prone 넘어뜨려짐 / Quickened 가속 / Restrained 억제 / Sickened 구역질 / Slowed 둔화 / Stunned 기절 / Stupefied 멍청함 / Unconscious 무의식 / Undetected 미탐지 / Unnoticed 존재 미인지 / Wounded 부상
- 핵심: Attack Roll 명중 굴림(«공격 굴림» 금지) / Feat 재주(«특기»·«피트» 금지) / Trait 특성(«특질» 금지) / Spell Rank 랭크(주문에 «등급» 금지) / Check 판정 / Counteract 상쇄 / Flanking 협공 / Initiative 선제력 / Recall Knowledge 지식 회상 / Saving Throw 내성 굴림 / Hero Point 영웅 점수 / Flat Check 단순 판정 / Bulk 부피 / Persistent Damage 지속 피해 / MAP 다중공격 페널티 / Hardness 경도 / Dedication 헌신 / Archetype 원형
- 전통: Arcane 비전 / Divine 신성 / Occult 비학 / Primal 원시(«근원» 금지)
- 행동명: Strike 타격 / Stride 보폭 / Step 걸음 / Interact 상호작용 / Escape 탈출 / Seek 탐색 / Hide 숨기 / Sneak 은밀 이동 / Demoralize 사기 꺾기 / Feint 기만 동작 / Aid 지원 / Raise a Shield 방패 올리기 / Refocus 재집중 / Disarm 무장 해제 / Shove 밀기 / Trip 넘어뜨리기 / Grapple 붙잡기
- 장비: Simple 단순 무기 / Martial 군용 무기 / Advanced 고급 무기 / Light Armor 경갑 / Medium Armor 평갑(Medium을 «중갑»으로 금지) / Heavy Armor 중갑
- 생물유형: Aberration 기형체 / Celestial 천상체 / Construct 구조물 / Elemental 정령 / Fey 페이 / Fiend 악마 / Fungus 균류 / Humanoid 인간형 / Monitor 주시자 / Ooze 점액체 / Undead 언데드
- 주문어: Cantrip 캔트립 / Focus Spell 집중 주문 / Focus Point 집중점 / Heightened 강화 / Innate 선천 주문 / Signature 시그니처 주문 / Sustain 주문 유지 / Divine Font 신성 원천`

const MARKUP = `## 마크업 절대 보존 규칙
- @UUID[...]·@Damage[...]·@Check[...]·@Localize[...]·@Template[...]·@Embed[...] — 대괄호 내부 절대 무수정. 뒤따르는 {라벨}만 한글화/교정 가능.
- [[/act ...]]·[[/r ...]]·[[/gmr ...]]·[[/br ...]] 굴림 매크로 — 대괄호 골격 무수정(런타임이 한글 렌더함). 뒤 {라벨}만 교정 가능.
- HTML 태그 구조(태그 종류·중첩·개수) 유지. <em>·<strong>·<p>·<ul>·<hr /> 삭제/추가 금지.
- ⟬…⟟·⟬T0000 같은 잔존 토큰이나 � 문자 발견 시 = 손상 → 그 부분만 문맥에 맞는 정상 한국어 문장으로 재구성(영문 원문 desc_en 참고).
- 숫자·주사위식(2d6 등)·DC·거리(피트)·지속시간은 영문 원문과 대조해 정확성 최우선 검증.`

const SCHEMA = { type: 'object', properties: { checked: { type: 'number' }, fixed: { type: 'number' }, flagged: { type: 'number' }, note: { type: 'string' } }, required: ['checked', 'fixed', 'flagged'] }

function itemsPrompt(file) {
  return `당신은 Pathfinder 2e 한국어 번역 전수검사 감수자입니다.

입력: ${P}/payload/${file} 파일을 Read 하세요. JSON 배열이며 각 원소 = {slug, name_en, name_ko, desc_en(영문 원문), desc_ko(현재 한국어 번역)}.

각 항목을 꼼꼼히 검사:
1. **오역**: desc_ko를 desc_en과 대조. 수치·주사위·DC·지속시간·거리·조건(대성공/성공/실패/대실패) 오류, 의미 반전, 누락 문장, 이중 번역(같은 내용 두 번), 미번역 영어 잔존.
2. **오탈자·문법**: 맞춤법, 조사 오류, 어색한 직역투 중 명백히 틀린 것.
3. **용어 정본 위반**: 아래 용어집 기준. 단, «마스터»는 문맥 판단(사역마 주인·스승·명품(masterwork)·"숙달" 동사는 정당 — 숙련도 Master만 «달인»). «특기»는 Feat일 때만 «재주»로. "N피트" 거리 표현은 절대 건드리지 말 것.
4. **경어체 혼재**: 한 desc 안에서 합니다체/한다체가 섞인 경우만 다수 쪽으로 통일(전체 코퍼스 통일은 하지 말 것).
5. name_ko도 검사(오타·명백한 오역만. 스타일 취향 리네임 금지).

${CANON}

${MARKUP}

## 최소 수정 원칙
- 문제 없는 항목은 출력에서 제외. 전체 항목 중 대부분은 정상일 것.
- desc 전면 재번역은 번역이 총체적으로 잘못된 경우만(reason에 사유 명기).
- 확신 없으면 고치지 말고 flags에 기록.

출력: ${P}/out/${file.replace('.json', '')}.out.json 파일을 Write 하세요:
{"fixes":[{"slug":"...","name_ko":"(이름 수정 시만)","desc_ko":"(수정된 전체 desc, desc 수정 시만)","reason":"짧은 사유"}],"flags":[{"slug":"...","note":"확신 없는 의심점"}]}
fixes에는 실제 변경된 필드만 포함. 수정 0건이면 {"fixes":[],"flags":[...]}.

마지막으로 StructuredOutput으로 {checked: 검사한 항목수, fixed: 수정 항목수, flagged: 플래그수, note: 특이사항 한 줄}을 반환하세요.`
}

function creaturesPrompt(file) {
  return `당신은 Pathfinder 2e 한국어 번역 전수검사 감수자입니다. 크리처(몬스터) 번역 데이터를 **영문 정본과 대조**하며 검사합니다.

입력: ${P}/payload/${file} 파일을 Read 하세요. JSON 배열, 각 원소 = {file(원본 파일명), key(영문 크리처명), data(번역 오브젝트: name, description, items{slug:{name,description}}, …), en(영문 정본: description, items{slug:{name,description}})}.

검사:
1. **영-한 대조(최우선)**: data의 각 필드를 en의 대응 필드와 대조 — 수치·주사위·DC·거리(피트)·지속시간·조건(대성공/성공/실패/대실패) 오류, 의미 반전, 문장 누락, 원문에 없는 내용 삽입, 이중 번역(같은 내용이 두 번역으로 반복). en에 대응 필드가 없으면 한국어 자체 품질만 검사.
2. **표기 일관성**: 같은 desc/entry 안에서 동일 고유명사가 다르게 음역된 경우(예: "심포뭄프/심포푼프/심리폼프스" 혼재) → 가장 표준적인 하나로 통일. 크리처 자신의 이름(data.name)과 본문 표기도 일치시킬 것.
3. **유효하지 않은 스트링**: 잘린 @UUID/@Damage 골격, @표현식 밖에 노출된 고아 Compendium 경로, 닫히지 않은 {라벨}, 잔존 토큰(⟬…⟟·�), FVTT 전용 기능의 무의미한 파편 → 영문 정본(en)의 올바른 @표현식을 복사해 복원하고 {라벨}만 한글화. 복원 근거가 없는 무의미 파편은 삭제.
4. **미번역 잔존**: 영문 단어/문장이 번역 안 된 채 남은 것(예: "Requian이라는") → 문맥에 맞게 음역/번역.
5. **오탈자·문법·이중 번역**(같은 문장 반복), 명백한 기계번역 오류.
6. **용어 정본 위반** (아래 표).
7. **경어체 혼재**: 한 필드 안에서 합니다/한다 섞이면 다수 쪽으로.

${CANON}

${MARKUP}

## 최소 수정 원칙: 문제 있는 필드만. 확신 없으면 flags로.

출력: ${P}/out/${file.replace('.json', '')}.out.json 을 Write:
{"fixes":[{"file":"monster-core.ko.json","key":"Yamaraj","path":"description 또는 items.call-spirit.description 같은 점 경로","value":"수정된 전체 문자열","reason":"사유"}],"flags":[{"file":"...","key":"...","note":"..."}]}

StructuredOutput: {checked, fixed(수정 필드 수), flagged, note}.`
}

function uiPrompt(file) {
  return `당신은 Pathfinder 2e 한국어 UI 문자열/용어사전 감수자입니다.

입력: ${P}/payload/${file} 을 Read. JSON 배열, 각 원소 = {file(원본 파일), key(경로), ko(문자열)}.

검사: 오탈자·문법 / 미번역 영어 잔존(값이 영어인데 한글이어야 자연스러운 UI 문자열) / 용어 정본 위반(아래) / 깨진 플레이스홀더({0}, {actor} 등은 보존) / 어색한 직역.
key가 PF2E.* 형태면 FVTT 시스템 로컬라이즈 키이므로 key로 의미를 유추해 값의 적절성을 판단.
값이 slug/영문 enum이어야 정상인 것(레지스트리 키 등)은 건드리지 말 것 — 화면 표시용 한글 문자열만 교정.

${CANON}

## 최소 수정: 명백한 문제만. 확신 없으면 flags.

출력: ${P}/out/${file.replace('.json', '')}.out.json 을 Write:
{"fixes":[{"file":"...","key":"...","ko":"수정값","reason":"..."}],"flags":[{"file":"...","key":"...","note":"..."}]}

StructuredOutput: {checked, fixed, flagged, note}.`
}

function csdataPrompt(file) {
  return `당신은 Pathfinder 2e 한국어 게임 데이터 감수자입니다. 앱 내장 큐레이션 DB(특성 설명·상태이상·서브클래스)를 검사합니다.

입력: ${P}/payload/${file} 을 Read. JSON 배열, 각 원소 = {block(TRAIT_DB|CONDITIONS_DATA|SUBCLASS_DB), id, name_ko, desc}.

검사: 오탈자·문법 / 용어 정본 위반(아래) / 명백한 오역·어색한 문장 / 미번역 잔존. name_ko는 명백한 오타만(리네임 금지 — 다른 시스템이 이름으로 참조함).

${CANON}

${MARKUP}

출력: ${P}/out/${file.replace('.json', '')}.out.json 을 Write:
{"fixes":[{"block":"...","id":"...","name_ko":"(수정 시만)","desc":"(수정 시만)","reason":"..."}],"flags":[...]}

StructuredOutput: {checked, fixed, flagged, note}.`
}

function repairPrompt(file) {
  return `당신은 Pathfinder 2e 한국어 번역 손상 수복 전문가입니다. UTF-8 손상(�)과 번역 플레이스홀더 토큰(⟬T0005⟟, ⟬U0002 등)이 본문에 남은 엔티티들을 수복합니다.

입력: ${P}/payload/${file} 을 Read. JSON 배열:
- kind=item: {cat, slug, name_en, name_ko, desc_en(영문 정본), desc_ko_broken(손상된 한국어)}
- kind=creature: {file, key, broken_paths(손상 필드 경로들), entry(전체 번역 오브젝트), en_fields(일부 경로의 영문 원문)}
- kind=markup: {cat, slug, name_en, name_ko, problems(감지된 손상: truncated-@Damage/truncated-@UUID/orphan-compendium/unclosed-label/truncated-roll), desc_en(영문 정본), desc_ko(현재 한국어)} — 잘린 @표현식·고아 경로를 영문 정본의 올바른 @표현식으로 복원({라벨}만 한글).
- kind=markup-creature: {file, key, problems, entry(전체 번역), en(영문 정본)} — 손상 필드(점 경로)를 찾아 복원.

수복 방법:
1. desc_en(또는 en_fields)을 기준으로 손상 부위를 정상 한국어로 재구성. 토큰(⟬…⟟)은 원래 @UUID/@Damage/굴림 매크로 자리였을 가능성이 높음 — 영문 원문의 해당 위치에 @참조가 있으면 **영문 원문의 @표현식을 그대로 복사**해 넣고 {라벨}만 한글화.
2. 이중 번역(같은 내용이 다른 번역으로 두 번 이어 붙은 경우 — 예: "가이딩 스타 오브는길잡이 별의 구슬") → 하나만 남기고 정리. 남길 표기는 name_ko와 일치시킬 것.
3. 구조 깨진 HTML(빈 <strong></strong>, 태그 밖으로 나온 "대성공" 등) → 영문 원문 구조대로 복원.
4. 손상 부위 밖은 최소 수정(정상 번역 보존).

${CANON}

${MARKUP}

출력: ${P}/out/${file.replace('.json', '')}.out.json 을 Write:
{"fixes":[{"kind":"item","cat":"...","slug":"...","desc_ko":"수복된 전체 desc","name_ko":"(수정 시만)"} 또는 {"kind":"creature","file":"...","key":"...","path":"...","value":"수복된 전체 문자열"}],"flags":[...]}
(kind=markup 는 "kind":"item"으로, kind=markup-creature 는 "kind":"creature"로 출력)
모든 입력 항목이 수복되어야 함(수복 불가 시 flags에 사유).

StructuredOutput: {checked, fixed, flagged, note}.`
}

function renamePrompt(file) {
  return `당신은 Pathfinder 2e 한국어 번역 명명 심판자입니다. 서로 다른 영문 엔티티가 같은 한글명을 쓰는 충돌을 해소합니다.

입력: ${P}/payload/${file} 을 Read. JSON 배열, 각 원소 = {cat, name_ko(충돌 한글명), members:[{slug, name_en, desc_en, desc_ko}]}.

각 충돌 그룹에서:
1. 영문 원명에 가장 충실한 번역인 멤버가 기존 한글명을 유지. 나머지는 각자 영문 원명을 정확히 반영한 **구별되는** 새 한글명 부여.
2. 새 이름은 영문 원명 의미·뉘앙스 차이를 살릴 것 (예: Scythe 낫 / Sickle 조각낫, Javelin 투창 / Lance 기병창 / Spear 창, Cane 지팡이 케인 아님 → 의미 구분이 어려우면 음역 허용).
3. "Effect: X" / "Spell Effect: X" 이름은 "효과: X한글" / "주문 효과: X한글" 형식 유지 — X의 한글명은 원본 주문/재주의 한글명과 일치해야 함. 필요시 ${P}/name_index.json 에서 Bash grep으로 원본 엔티티 한글명을 확인(파일이 큼 — 통째로 Read 금지, grep만).
4. (Greater)/(LOWG) 같은 판본·등급 접미는 「(상급)」·출처 병기 등 기존 관례대로.
5. 같은 카테고리 내 다른 엔티티와 또 충돌하지 않는지 name_index.json grep으로 확인.

출력: ${P}/out/${file.replace('.json', '')}.out.json 을 Write:
{"renames":[{"cat":"...","slug":"...","old":"기존 한글명","new":"새 한글명","reason":"짧은 사유"}],"flags":[...]}
유지되는 멤버는 출력하지 않음. 모든 그룹이 해소되어야 함.

StructuredOutput: {checked: 그룹수, fixed: 리네임수, flagged, note}.`
}

// ── 태스크 목록 구성: args.files(파일명 배열) + args.ranges([{p:프리픽스, from, to}] → p_from..p_to 전개) ──
const FILES = [...((args && args.files) || [])]
for (const r of ((args && args.ranges) || [])) {
  for (let i = r.from; i <= r.to; i++) FILES.push(`${r.p}_${String(i).padStart(3, '0')}.json`)
}
const tasks = []
for (const file of FILES) {
  let prompt, ph
  if (file.startsWith('creatures_')) { prompt = creaturesPrompt(file); ph = '전수검사' }
  else if (file.startsWith('ui_')) { prompt = uiPrompt(file); ph = '전수검사' }
  else if (file.startsWith('csdata_')) { prompt = csdataPrompt(file); ph = '전수검사' }
  else if (file.startsWith('repair_')) { prompt = repairPrompt(file); ph = '수복' }
  else if (file.startsWith('rename_')) { prompt = renamePrompt(file); ph = '리네임' }
  else { prompt = itemsPrompt(file); ph = '전수검사' }
  tasks.push({ file, prompt, ph })
}
log(`총 ${tasks.length}개 배치 감수 시작`)

let done = 0, agg = { checked: 0, fixed: 0, flagged: 0 }
const results = await pipeline(tasks, t =>
  agent(t.prompt, { label: t.file, phase: t.ph, schema: SCHEMA }).then(r => {
    done++
    if (r) { agg.checked += r.checked || 0; agg.fixed += r.fixed || 0; agg.flagged += r.flagged || 0 }
    if (done % 25 === 0) log(`${done}/${tasks.length} 완료 — 누적 검사 ${agg.checked} · 수정 ${agg.fixed} · 플래그 ${agg.flagged}`)
    return r ? { file: t.file, ...r } : { file: t.file, failed: true }
  })
)
const failed = results.filter(Boolean).filter(r => r.failed).map(r => r.file)
return { total: tasks.length, agg, failed, failedCount: failed.length }
