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

// flat check 용어 통일: LLM이 "평판정/평면 판정/단순 판정"으로 제각각 쓴 것을 정본 "플랫 판정"으로.
function normTerms(s) {
  return String(s)
    .replace(/평면\s*판정/g, '플랫 판정').replace(/평판정/g, '플랫 판정').replace(/단순\s*판정/g, '플랫 판정')
    .replace(/주님/g, '군주')  // 신격 호칭 "Lord": 현대 기독교 어감 '주님' → 판타지 '군주'
    .replace(/능력치\s*(?:상승|증가)/g, '능력치 증강');  // ability boost 정본 = 능력치 증강(상승/증가 혼용 통일)
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
  d._desc_ko = normTerms(stripLinkLabels(stripDeadRefs(PF.bakePlainMacros(r.ko))));
  applied++;
}
fs.writeFileSync(fp, JSON.stringify(j, null, indent) + (trailNL ? '\n' : ''));
console.log(`[${cat}] 적용 ${applied} / 결과 ${results.length}` + (missing.length ? ` | 미매칭 ${missing.length}: ${missing.slice(0,8).join(', ')}` : ''));
