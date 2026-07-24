#!/usr/bin/env node
/* build_schema_doc.mjs — DATA_SCHEMA.md 생성기(단일소스=DataManager TABS + 실제 데이터 파일).
 *   DataManager.html의 TABS/COLMETA를 파싱해 "현행 데이터 스키마"를 문서로 추출·기록(#5 데이터 스키마 페이지).
 *   구식 수기 문서(삭제된 base/overlay 3층 서술)를 대체 — 항상 실제 탭·컬럼·파일과 일치(재생성 가능).
 *   실행: cd dev && node tools/derive/build_schema_doc.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const html = fs.readFileSync(path.join(DEV, 'DataManager.html'), 'utf8');
const COMMON = ['slug', 'name_en', 'name_ko', 'level', 'traits_ko', 'source'];   // TABS eval용(DataManager와 동일 정의)
const TABS = eval(html.match(/const TABS = (\[[\s\S]*?\n  \]);/)[1]);
const COLMETA = eval('(' + html.match(/const COLMETA ?= ?(\{[\s\S]*?\n  \});/)[1] + ')');
const hdr = c => (COLMETA[c] && COLMETA[c].h) || c;

// 데이터 파일 행수(실측)
function rowCount(src) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DEV, src), 'utf8'));
    if (Array.isArray(j)) return j.length;
    if (Array.isArray(j.rows)) return j.rows.length;
    if (j && typeof j === 'object') return Object.keys(j).length + ' 키';
  } catch (e) { return '?'; }
  return '?';
}
function storeCount(cat) { return rowCount(`data/store/${cat}.json`); }

const storeT = TABS.filter(t => t.cat);
const derivedT = TABS.filter(t => t.kind === 'derived');
const refT = TABS.filter(t => t.ref);

let md = `# Pathforge 데이터 스키마

> **자동 생성** — \`tools/derive/build_schema_doc.mjs\`가 \`DataManager.html\`의 TABS/COLMETA와 실제 데이터 파일에서 추출.
> 수기 편집 금지(재실행하면 덮어씀). 스키마를 바꾸려면 DataManager TABS를 고치고 재생성.
> 생성 시점 탭 ${TABS.length}개(스토어 ${storeT.length} + 파생 ${derivedT.length} + 참조 ${refT.length}).

---

## 0. 아키텍처 (store 단일소스)

| 레이어 | 경로 | 내용 | 편집 |
|---|---|---|---|
| **STORE(단일소스)** | \`data/store/<cat>.json\` | 게임 자료 정본(materialized: 구조 + 기계효과 \`system.rules[]\` + 한글 \`_desc_ko\`) | ✅ DataManager |
| **DERIVED(산출물)** | \`data/derived/<name>.json\` | store에서 계산된 파생(성장표·효과·서브클래스·가이드 등). \`tools/derive/*.mjs\` 생성 | 생성물(재생성) |
| **OVERRIDE(라이브)** | 클라우드/localStorage 작업본 | DataManager 편집이 slug→부분필드로 store 위에 덮임 | ✅ DataManager |

- **Primary Key = \`slug\`**(모든 엔티티·조인·자동화·override 키). \`_id\`=FVTT 문서 id(UUID 조인 보조).
- **런타임 조인**: \`cs_pf2e.js\`가 store 로드 + override 덮음 → \`name_ko\`/\`_desc_ko\`/필드 최종값. 정본 필터(\`allowed_content.json\`)로 보유 룰북 6권 밖 콘텐츠 제외.
- **번역은 스택 결과일 뿐** — 자동화는 전부 slug/rules 기반이라 번역 편집이 기계효과에 영향 0.

### 데이터 3대 원칙
1. 같은 기능을 중복 로직으로 나누지 말 것(공용 함수 하나).
2. 모든 기능은 효과(자동화)/파생 **데이터에서 파생**(런타임에 상수표·if-슬러그 심지 말 것).
3. 모든 효과 처리는 **출처(source/slug) 기반**(이름 매칭 금지).

### 대원칙 0 — 데이터 테이블 플로우
\`[성장·정체성]\`(클래스성장·혈통·유산·서브클래스성장) → \`[부여대상]\`(재주·아이템·클래스특성) → \`[자동화]\`(효과). 효과 탭은 재주·아이템·클래스특성 슬러그 전용. 성장·정체성 테이블은 자기 슬러그로 효과행을 만들지 않고, 부여를 성장표 칸이 소유(런타임이 직접 읽음).

---

## 1. 공통 엔벨로프 (엔티티 카테고리 공통)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| \`slug\` | string(PK) | 키(읽기전용) |
| \`name_en\` | string | 영문명 |
| \`name_ko\` | string | 한글명(✅편집, OVERRIDE) |
| \`_desc_ko\`/\`desc\` | html | 한글 설명(✅편집) |
| \`traits_ko\` | slug[] | 특성(→「특성」 레지스트리 단일편집) |
| \`source\` | string | 출처 서적 |

---

## 2. 스토어 탭 (게임 자료 정본, DataManager 편집)

| 탭 | id | 파일 | 행수 | 주요 컬럼 |
|---|---|---|---|---|
`;
for (const t of storeT) {
  md += `| ${t.label} | \`${t.id}\` | \`data/store/${t.cat}.json\` | ${storeCount(t.cat)} | ${t.cols.map(hdr).join(' · ')} |\n`;
}

md += `
---

## 3. 파생 탭 (store에서 계산, 재생성 가능)

| 탭 | id | 소스 파일 | 행수 | 주요 컬럼 |
|---|---|---|---|---|
`;
for (const t of derivedT) {
  const src = (t.src || '').replace('data/derived/', '');
  md += `| ${t.label} | \`${t.id}\` | \`${src}\` | ${rowCount(t.src)} | ${(t.cols || []).map(hdr).join(' · ')} |\n`;
}

md += `
${refT.length ? '> 참조 전용 탭(편집 없음): ' + refT.map(t => `${t.label}(\`${t.id}\`)`).join(', ') + '\n' : ''}
---

## 4. 효과(자동화) 테이블 7컬럼 정규화

\`effects\`(효과) 탭 = 재주·아이템·클래스특성의 기계효과. 1행=1원자효과.

| 컬럼 | 역할 |
|---|---|
| \`owner_kind\`/\`owner_slug\` | 출처(어느 재주/특성/아이템) |
| \`type\` | 효과타입(작은 enum: proficiency·hp_bonus·grant_feat·resistance·grant_action·choice…) |
| \`target\` | 대상(데이터: 기술/능력치/무기범주 slug 등) |
| \`value\` / \`bonus_type\` | 값 / 값종류(upgrade·status·circumstance…) |
| \`condition\` / \`cond_value\` | 조건(enum: level·class·feat·trait·armor·no-* …) / 조건 원자값 |

- 런타임 소비: \`getEffectRows(slug)\` → \`_evalEffectCondition\`(정적 조건만: level/class/feat/trait/armor). 상황부(off-guard 등)=표시전용.
- 코드가 실제 처리하는 자료형 목록 = DataManager 「자료형 스키마」 버튼(effects.json \`_schema\`, 코드 상수에서 파생).

---

## 5. 생성 파이프라인 (tools/derive/*.mjs)

- **부트스트랩**: build_subclasses → build_effects → build_subclass_progression / build_class_growth(kind) / 가이드 빌더(독립).
- **가이드(항목 읽는 법)**: build_{bloodlines,oracle_mysteries,wizard_schools,bard_muses,witch_patrons,druid_orders,ranger_edges,rogue_rackets,champion_causes,barbarian_instincts,investigator_methodologies,swashbuckler_styles,alchemist_research_fields,fighter_features,monk_features}.mjs → 각 \`*_*.json\`(guide[]).
- **이 문서**: build_schema_doc.mjs(DataManager TABS에서 추출).
- 데이터 수정 → 해당 빌더 재실행 → \`node tools/bump_version.mjs <v>\`(캐시버스터).
`;

fs.writeFileSync(path.join(DEV, 'DATA_SCHEMA.md'), md);
console.log(`✔ DATA_SCHEMA.md 생성 — 스토어 ${storeT.length} + 파생 ${derivedT.length} 탭`);
