// 재번역 파이프라인 3단계: 번역 결과([{slug, ko}])를 store/<cat>.json 의 _desc_ko 에 기록.
//   @link 라벨 스트립: @link[cat.slug]{라벨} → @link[cat.slug] (끝 숫자값만 {N} 보존 — 렌더러가 정본명 사용).
// 포맷 보존(리포맷 사고 방지): 원본 들여쓰기 자동 감지 + round-trip 충실도 가드.
// 사용:  node tools/pretranslate_apply.mjs <cat> <results.json>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.join(__dir, '..');

const cat = process.argv[2], resFile = process.argv[3];
if (!cat || !resFile) { console.error('usage: node tools/pretranslate_apply.mjs <cat> <results.json>'); process.exit(1); }

// 안전망: LLM이 놓친 잔여 매크로(@Check/@Damage/@Template/[[/r]])를 기계적으로 한글 평문화(@link은 미변경).
const PF = (await import(path.join(DEV, 'cs_pf2e.js'))).default;
for (const c of ['actions', 'conditions', 'spells', 'feats', 'equipment']) { try { await PF.loadCategory(c); } catch (e) {} }

// 죽은 @UUID 참조 정리: pre-resolve가 @link로 못 바꾼 @UUID(저널/효과/외부)는 우리 앱에 대상이 없음 → 제거.
//   ①@UUID만 있는 문단(<em>/<strong> 래핑 허용) 통째 제거 ②남은 인라인 @UUID는 라벨 평문화. (@link은 미변경)
function stripDeadRefs(s) {
  s = String(s);
  s = s.replace(/(<hr\s*\/?>\s*)?<p>\s*(?:<(?:em|strong)>\s*)?(?:@UUID\[[^\]]*\](?:\{[^}]*\})?\s*[,;·]?\s*)+(?:<\/(?:em|strong)>\s*)?<\/p>\s*/g, '');
  s = s.replace(/@UUID\[[^\]]*\](?:\{([^}]*)\})?/g, (m, label) => label || '');
  return s;
}

// creature 정본 = 크리처. ⚠ 원어가 creature일 때만 변환(organism/being/entity가 생물/생명체로 번역된 것은 보존).
//   → 엔티티 원문(en)에 creature가 있을 때만 생물/생명체를 변환. 생명체는 being까지 없을 때만(오변환 방지).
//   무생물/미생물/괴생물/생물학은 제외. 생물(받침)→크리처(모음)는 조사 정정 동반.
function normCreature(s, en) {
  s = String(s).replace(/크리쳐/g, '크리처');  // 오타 표기 통일 — 항상 안전
  if (!/\bcreatures?\b/i.test(en || '')) return s;  // 원문에 creature 없으면 생물/생명체 미변환
  const map = { '이라도': '라도', '이라면': '라면', '이라는': '라는', '이라': '라', '이란': '란', '이나': '나', '이며': '며', '이면': '면', '이든': '든', '이다': '다', '입니다': '입니다', '인': '인', '이': '가', '을': '를', '은': '는', '과': '와', '으로': '로' };
  s = s.replace(/(?<![무미괴])생물(?!학)(이라도|이라면|이라는|이라|이란|이나|이며|이면|이든|이다|입니다|인|이|을|은|과|으로)?/g, (m, j) => j === undefined ? '크리처' : '크리처' + (map[j] !== undefined ? map[j] : j));
  if (!/\bbeings?\b/i.test(en || '')) s = s.replace(/생명체/g, '크리처');  // 생명체=being 오변환 방지
  return s;
}

// flat check 용어 통일: LLM이 "평판정/평면 판정/단순 판정"으로 제각각 쓴 것을 정본 "플랫 판정"으로.
function normTerms(s) {
  return String(s)
    .replace(/평면\s*판정/g, '플랫 판정').replace(/평판정/g, '플랫 판정').replace(/단순\s*판정/g, '플랫 판정')
    .replace(/능력치\s*(?:상승|증가)/g, '능력치 증강')  // ability boost 정본 = 능력치 증강(상승/증가 혼용 통일)
    // Heightened 정본 = 고양(앱 용어). 키워드 변형(상향·강화·상승·상승 시전·등급 상승) 전부 통일. 프로즈 상승(더 높이 상승된·피해 상승치 등)은 접미 게이트로 보존.
    .replace(/(?:등급\s*상승|상승\s*시전|상향\s*시전|상승|상향|강화)(\s*\((?:\+\d+|\d+\s*(?:레벨|랭크|등급|단계|위계|환))\s*\))/g, '고양$1')
    .replace(/<strong>(\s*)(?:상승|상향|강화)(\s*)<\/strong>/g, '<strong>$1고양$2</strong>')  // 접미 없는 Heightened 헤딩(소환 계열)
    .replace(/공격\s*굴림/g, '명중 굴림');  // attack roll 정본 = 명중 굴림
}

// 신격 전용: flavor 설명 ↔ 구조 레이블(칭호/판테온 구성원 등) 사이에 구분선(이미 있으면 유지).
function insertDeityDivider(s) {
  return String(s).replace(/(<hr\s*\/?>\s*)?(<p>\s*<strong>\s*(?:칭호|판테온 구성원|관심 영역))/, (m, hr, p) => hr ? m : '<hr />' + p);
}

function stripLinkLabels(s) {
  return String(s).replace(/@link\[([a-z]+\.[a-z0-9._-]+)\](?:\{([^}]*)\})?/g, (m, ref, label) => {
    const num = label && label.match(/([0-9]+)\s*$/);
    return num ? `@link[${ref}]{${num[1]}}` : `@link[${ref}]`;
  });
}

const fp = path.join(DEV, `data/store/${cat}.json`);
const orig = fs.readFileSync(fp, 'utf8');
// 들여쓰기 감지 + 충실도 확인
const j = JSON.parse(orig);
let indent = null, trailNL = false;
for (const cand of [0, 1, 2, 4, '\t']) {
  const base = JSON.stringify(j, null, cand);
  if (base === orig) { indent = cand; trailNL = false; break; }
  if (base + '\n' === orig) { indent = cand; trailNL = true; break; }
}
if (indent === null) { console.error('⚠ 포맷 충실도 실패 — 리포맷 위험, 중단.'); process.exit(2); }

const results = JSON.parse(fs.readFileSync(resFile, 'utf8'));
const bySlug = {};
const docs = Array.isArray(j) ? j : (j.docs || Object.values(j));
for (const d of docs) { const s = (d.system && d.system.slug) || d.name_en || d._id; if (s) bySlug[s] = d; }

let applied = 0, missing = [];
for (const r of results) {
  const d = bySlug[r.slug];
  if (!d) { missing.push(r.slug); continue; }
  if (!r.ko || !r.ko.trim()) { missing.push(r.slug + '(빈번역)'); continue; }
  d._desc_ko = normCreature(normTerms(stripLinkLabels(stripDeadRefs(PF.bakePlainMacros(r.ko)))), d._desc_en);
  if (cat === 'deities') d._desc_ko = insertDeityDivider(d._desc_ko);
  applied++;
}
fs.writeFileSync(fp, JSON.stringify(j, null, indent) + (trailNL ? '\n' : ''));
console.log(`[${cat}] 적용 ${applied} / 결과 ${results.length}` + (missing.length ? ` | 미매칭 ${missing.length}: ${missing.slice(0,8).join(', ')}` : ''));
