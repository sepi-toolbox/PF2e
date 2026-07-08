// 재번역 파이프라인 1단계: store/<cat>.json 의 _desc_en 을 pre-resolve.
//   @UUID/@Embed(엔티티 참조) → @link[cat.slug]  (PF.bakeEntityLinks, 결정적 변환 — LLM이 슬러그 추측 금지)
//   나머지 매크로(@Check/@Damage/@Template/[[/r]])는 그대로 두어 번역 단계(LLM)가 한글 프로즈로 푼다.
// 출력: [{slug, name_en, name_ko, en}] JSON  → 번역 워크플로 args 로 투입.
// 사용:  node tools/pretranslate_prep.mjs <cat> [outfile]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.join(__dir, '..');
const PF = (await import(path.join(DEV, 'cs_pf2e.js'))).default || (await import(path.join(DEV, 'cs_pf2e.js')));

const cat = process.argv[2];
if (!cat) { console.error('usage: node tools/pretranslate_prep.mjs <cat> [outfile]'); process.exit(1); }
const out = process.argv[3] || `/private/tmp/claude-501/-Users-sepi/194c948e-3bcc-434d-a425-a9d2d18d7b91/scratchpad/pretrans_${cat}.json`;

// 참조 해소용 카탈로그 로드
for (const c of ['conditions','actions','spells','feats','equipment','heritages','ancestries','backgrounds','deities','classes','effects']) {
  try { await PF.loadCategory(c); } catch (e) {}
}

const raw = JSON.parse(fs.readFileSync(path.join(DEV, `data/store/${cat}.json`), 'utf8'));
const docs = Array.isArray(raw) ? raw : (raw.docs || Object.values(raw));
const rows = [];
for (const d of docs) {
  const slug = (d.system && d.system.slug) || d.name_en || d._id;
  const en = d._desc_en;
  if (!slug || !en || !en.trim()) continue;
  rows.push({ slug, name_en: d.name_en || d.name || '', name_ko: d.name_ko || '', en: PF.bakeEntityLinks(en) });
}
fs.writeFileSync(out, JSON.stringify(rows));
console.log(`[${cat}] pre-resolved ${rows.length} entries → ${out}`);
