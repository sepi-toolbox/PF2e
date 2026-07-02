// 전수검사 결과 병합 + 마크업 자동검증
// 사용: node merge_results.js [--apply]   (기본 dry-run: 검증 리포트만)
const fs = require('fs'), path = require('path');
const DEV = '/tmp/PF2e-publish/dev';
const OUT = process.env.PF2E_AUDIT_DIR || '/tmp/pf2e-audit';
const APPLY = process.argv.includes('--apply');
const CATS = ['actions','ancestries','backgrounds','classes','conditions','deities','effects','equipment','feats','heritages','spells'];

// ── 검증 헬퍼: 마크업 골격 비교 ──
function skeleton(s) {
  const at = []; // @표현식 골격(라벨 제외)
  for (const m of String(s).matchAll(/@([A-Za-z]{2,12})\[((?:[^\[\]]|\[[^\]]*\])*)\]/g)) at.push('@' + m[1] + '[' + m[2].replace(/name:[^|\]]*/g, 'name:*') + ']');
  const tags = {};
  for (const m of String(s).matchAll(/<\/?([a-zA-Z0-9]+)[^>]*>/g)) { const k = (m[0][1] === '/' ? '/' : '') + m[1].toLowerCase(); tags[k] = (tags[k] || 0) + 1; }
  return { at: at.sort(), tags };
}
function skelDiff(a, b) {
  const A = skeleton(a), B = skeleton(b);
  const issues = [];
  // @표현식: B(수정본)의 각 골격이 A(원본)에 존재해야(삭제는 허용 — 죽은 파편 삭제 케이스, 추가·변형은 검사)
  const aSet = {}; for (const x of A.at) aSet[x] = (aSet[x] || 0) + 1;
  for (const x of B.at) { if (!aSet[x]) issues.push('new/changed @expr: ' + x.slice(0, 80)); else aSet[x]--; }
  // 태그 개수 차이(±2 초과만 — 문단 정리 허용치)
  const keys = new Set([...Object.keys(A.tags), ...Object.keys(B.tags)]);
  for (const k of keys) { const d = (B.tags[k] || 0) - (A.tags[k] || 0); if (Math.abs(d) > 2) issues.push(`tag ${k} ${d > 0 ? '+' : ''}${d}`); }
  return issues;
}
function editRatio(a, b) { a = String(a); b = String(b); const l = Math.max(a.length, b.length); if (!l) return 0; let same = 0; const min = Math.min(a.length, b.length); let p = 0; while (p < min && a[p] === b[p]) p++; let sfx = 0; while (sfx < min - p && a[a.length - 1 - sfx] === b[b.length - 1 - sfx]) sfx++; same = p + sfx; return 1 - same / l; }

// ── out 파일 수집 ──
const outFiles = fs.readdirSync(path.join(OUT, 'out')).filter(f => f.endsWith('.out.json'));
const stats = { files: outFiles.length, parseErr: [], itemFix: 0, creFix: 0, uiFix: 0, csFix: 0, renames: 0, rejected: [], warns: [] };
const ovAdd = {}; // cat -> slug -> {name_ko?, desc_ko?}
const creSet = []; // {file, key, path, value}
const uiFixes = []; const csFixes = []; const renameList = []; const allFlags = [];

// 유입 값 용어 후처리: 초기 28배치가 구 CANON(force=힘)으로 작업됨 → 역장 정본 강제
function termFilter(v) { return typeof v === 'string' ? v.replace(/힘 피해/g, '역장 피해').replace(/포스 피해/g, '역장 피해') : v; }
function pushOv(cat, slug, field, val, src, reason) {
  val = termFilter(val);
  if (!CATS.includes(cat)) { stats.rejected.push(src + ': bad cat ' + cat); return; }
  (ovAdd[cat] = ovAdd[cat] || {})[slug] = ovAdd[cat][slug] || {};
  ovAdd[cat][slug][field] = val;
  ovAdd[cat][slug]['_reason'] = ((ovAdd[cat][slug]['_reason'] || '') + ' ' + (reason || '')).trim();
}

// 런타임 현재값 로드(검증 원본)
const PF = require(path.join(DEV, 'cs_pf2e.js'));
for (const c of CATS) PF.loadCategorySync(c);

for (const f of outFiles) {
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(OUT, 'out', f), 'utf8')); }
  catch (e) { stats.parseErr.push(f); continue; }
  const kind = f.split('_')[0];
  const fixes = j.fixes || [];
  for (const fl of (j.flags || [])) allFlags.push({ src: f, ...fl });
  if (f.startsWith('rename')) {
    for (const r of (j.renames || [])) { renameList.push(r); }
    continue;
  }
  for (const fx of fixes) {
    if (f.startsWith('items_')) {
      const cat = f.match(/^items_([a-z]+)_/)[1];
      const cur = PF.get(cat, fx.slug);
      if (!cur) { stats.rejected.push(f + ':' + fx.slug + ' not found'); continue; }
      if (fx.desc_ko != null) {
        const orig = cur._desc_ko || '';
        const issues = skelDiff(orig, fx.desc_ko);
        const ratio = editRatio(orig, fx.desc_ko);
        if (issues.length) { stats.rejected.push(`${f}:${fx.slug} skel[${issues.join(';').slice(0, 120)}]`); continue; }
        if (ratio > 0.6 && orig.length > 200) stats.warns.push(`${f}:${fx.slug} big-edit ${(ratio * 100) | 0}% (${(fx.reason || '').slice(0, 60)})`);
        pushOv(cat, fx.slug, 'desc_ko', fx.desc_ko, f, fx.reason); stats.itemFix++;
      }
      if (fx.name_ko != null && fx.name_ko !== PF.nameKo(cur)) { pushOv(cat, fx.slug, 'name_ko', fx.name_ko, f, fx.reason); stats.itemFix++; }
    } else if (f.startsWith('creatures') || (f.startsWith('repair') && (fx.kind === 'creature'))) {
      if (!fx.file || !fx.key || !fx.path || fx.value == null) { stats.rejected.push(f + ': bad creature fix ' + JSON.stringify(fx).slice(0, 80)); continue; }
      creSet.push({ ...fx, value: termFilter(fx.value), src: f });
    } else if (f.startsWith('repair')) { // kind=item
      const cat = fx.cat, slug = fx.slug;
      if (!cat || !slug) { stats.rejected.push(f + ': bad repair fix'); continue; }
      if (fx.desc_ko != null) { pushOv(cat, slug, 'desc_ko', fx.desc_ko, f, 'repair'); stats.itemFix++; }
      if (fx.name_ko != null) { pushOv(cat, slug, 'name_ko', fx.name_ko, f, 'repair'); stats.itemFix++; }
    } else if (f.startsWith('ui_')) {
      if (fx.file && fx.key != null && fx.ko != null) { uiFixes.push({ ...fx, ko: termFilter(fx.ko) }); stats.uiFix++; } else stats.rejected.push(f + ': bad ui fix');
    } else if (f.startsWith('csdata')) {
      if (fx.block && fx.id != null) { csFixes.push(fx); stats.csFix++; } else stats.rejected.push(f + ': bad csdata fix');
    }
  }
}
// 리네임: override name_ko (아이템 fix보다 나중 = 우선)
for (const r of renameList) {
  if (!r.cat || !r.slug || !r.new) { stats.rejected.push('rename bad: ' + JSON.stringify(r).slice(0, 80)); continue; }
  pushOv(r.cat, r.slug, 'name_ko', r.new, 'rename', r.reason); stats.renames++;
}

// ── 크리처 fix 검증(마크업) ──
const creByFile = {};
for (const c of creSet) (creByFile[c.file] = creByFile[c.file] || []).push(c);
const creOK = [];
for (const file in creByFile) {
  const full = path.join(DEV, 'data/creatures', file);
  if (!fs.existsSync(full)) { stats.rejected.push('creature file missing: ' + file); continue; }
  const j = JSON.parse(fs.readFileSync(full, 'utf8'));
  const ent = j.entries || j;
  for (const c of creByFile[file]) {
    const e = ent[c.key];
    if (!e) { stats.rejected.push(`${c.src}: creature key missing ${file}/${c.key}`); continue; }
    // path 해소
    const parts = c.path.split('.');
    let node = e; let ok = true;
    for (let i = 0; i < parts.length - 1; i++) { node = node && node[parts[i]]; if (node == null) { ok = false; break; } }
    const last = parts[parts.length - 1];
    if (!ok || node == null || typeof node !== 'object' || !(last in node)) { stats.rejected.push(`${c.src}: bad path ${file}/${c.key}.${c.path}`); continue; }
    const orig = node[last];
    if (typeof orig === 'string' && typeof c.value === 'string') {
      const issues = skelDiff(orig, c.value);
      if (issues.length) { stats.rejected.push(`${c.src}:${c.key}.${c.path} skel[${issues.join(';').slice(0, 100)}]`); continue; }
    }
    creOK.push({ ...c, _node: node, _last: last });
    stats.creFix++;
  }
}

console.log('=== 병합 요약 ===');
console.log(JSON.stringify({ files: stats.files, parseErr: stats.parseErr.length, itemFix: stats.itemFix, creFix: stats.creFix, uiFix: stats.uiFix, csFix: stats.csFix, renames: stats.renames, rejected: stats.rejected.length, warns: stats.warns.length, flags: allFlags.length }, null, 1));
fs.writeFileSync(path.join(OUT, 'merge_report.json'), JSON.stringify({ stats, flags: allFlags }, null, 1));
if (stats.parseErr.length) console.log('PARSE ERR:', stats.parseErr.slice(0, 10));
console.log('REJECTED sample:'); stats.rejected.slice(0, 25).forEach(x => console.log(' ', x));
console.log('WARN sample:'); stats.warns.slice(0, 15).forEach(x => console.log(' ', x));

if (!APPLY) { console.log('\n(dry-run) --apply 로 실제 적용.'); process.exit(0); }

// ── 적용 ──
// 1) override 병합
for (const cat in ovAdd) {
  const p = path.join(DEV, 'data/override', cat + '.json');
  const j = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  let n = 0;
  for (const slug in ovAdd[cat]) {
    const { _reason, ...fields } = ovAdd[cat][slug];
    j[slug] = Object.assign(j[slug] || {}, fields); n++;
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 1) + '\n');
  console.log('override', cat, '+' + n);
}
// 2) 크리처 적용(파일별로 한 번에)
const creFiles = {};
for (const c of creOK) (creFiles[c.file] = creFiles[c.file] || []).push(c);
for (const file in creFiles) {
  const full = path.join(DEV, 'data/creatures', file);
  const j = JSON.parse(fs.readFileSync(full, 'utf8'));
  const ent = j.entries || j;
  let n = 0;
  for (const c of creFiles[file]) {
    const parts = c.path.split('.');
    let node = ent[c.key];
    for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]];
    node[parts[parts.length - 1]] = c.value; n++;
  }
  fs.writeFileSync(full, JSON.stringify(j, null, 1) + '\n');
  console.log('creatures', file, '+' + n);
}
// 3) UI 적용
const uiByFile = {};
for (const u of uiFixes) (uiByFile[u.file] = uiByFile[u.file] || []).push(u);
for (const file in uiByFile) {
  const full = path.join(DEV, file);
  if (!fs.existsSync(full)) { console.log('SKIP ui file', file); continue; }
  const j = JSON.parse(fs.readFileSync(full, 'utf8'));
  let n = 0, miss = 0;
  for (const u of uiByFile[file]) {
    // key = 점 경로(+[i] 배열)
    const parts = u.key.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
    let node = j; let ok = true;
    for (let i = 0; i < parts.length - 1; i++) { node = node[parts[i]]; if (node == null) { ok = false; break; } }
    const last = parts[parts.length - 1];
    if (!ok || node == null || !(last in node)) { miss++; continue; }
    if (typeof node[last] !== 'string') { miss++; continue; }
    node[last] = u.ko; n++;
  }
  fs.writeFileSync(full, JSON.stringify(j, null, 1) + '\n');
  console.log('ui', file, '+' + n, miss ? ('miss ' + miss) : '');
}
// 4) cs_data 적용
if (csFixes.length) {
  const p = path.join(DEV, 'cs_data.js');
  let src = fs.readFileSync(p, 'utf8');
  const byBlock = {};
  for (const c of csFixes) (byBlock[c.block] = byBlock[c.block] || []).push(c);
  function patchArr(name, idField, apply) {
    if (!byBlock[name]) return;
    src = src.replace(new RegExp('(const ' + name + ' = )(\\[[\\s\\S]*?\\n\\]);'), (all, pre, arr) => {
      const a = JSON.parse(arr);
      let n = 0;
      for (const fx of byBlock[name]) { const e = a.find(x => String(x[idField]) === String(fx.id)); if (e) { apply(e, fx); n++; } }
      console.log('cs_data', name, '+' + n);
      return pre + JSON.stringify(a, null, 2) + ';';
    });
  }
  patchArr('TRAIT_DB', 'id', (e, fx) => { if (fx.name_ko != null) e.name_ko = fx.name_ko; if (fx.desc != null) e.desc = fx.desc; });
  patchArr('CONDITIONS_DATA', 'id', (e, fx) => { if (fx.name_ko != null) e.name = fx.name_ko; if (fx.desc != null) e.desc = fx.desc; });
  patchArr('SUBCLASS_DB', 'id', (e, fx) => { if (fx.desc != null) e.desc = fx.desc; });
  fs.writeFileSync(p, src);
}
console.log('APPLY 완료');
