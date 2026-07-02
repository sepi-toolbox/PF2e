// 전수검사 payload 생성기 — /tmp/PF2e-publish/dev 기준 실행
const fs = require('fs'), path = require('path');
const DEV = '/tmp/PF2e-publish/dev';
const OUT = process.env.PF2E_AUDIT_DIR || '/tmp/pf2e-audit';
const PAY = path.join(OUT, 'payload');
fs.mkdirSync(PAY, { recursive: true });
fs.mkdirSync(path.join(OUT, 'out'), { recursive: true });
const PF = require(path.join(DEV, 'cs_pf2e.js'));
const CATS = ['actions','ancestries','backgrounds','classes','conditions','deities','effects','equipment','feats','heritages','spells'];
const broken = JSON.parse(fs.readFileSync(path.join(OUT, 'broken_entities.json'), 'utf8'));
const brokenSet = {}; // cat -> Set(slug)
for (const k in broken) if (!k.startsWith('creatures/')) brokenSet[k] = new Set(broken[k]);

const LIMIT = 68 * 1024;
const counts = {};
function writeBatches(prefix, rows, limit = LIMIT) {
  let batch = [], size = 2, n = 0;
  const flush = () => { if (!batch.length) return; fs.writeFileSync(path.join(PAY, `${prefix}_${String(n).padStart(3,'0')}.json`), JSON.stringify(batch)); n++; batch = []; size = 2; };
  for (const r of rows) {
    const s = JSON.stringify(r).length + 1;
    if (size + s > limit && batch.length) flush();
    batch.push(r); size += s;
  }
  flush();
  counts[prefix] = n;
  return n;
}

// ── 1) name index ──
const nameIndex = {};
for (const c of CATS) { PF.loadCategorySync(c); nameIndex[c] = {}; for (const d of PF.all(c)) nameIndex[c][d.slug || d._id] = { en: d.name, ko: PF.nameKo(d) }; }
fs.writeFileSync(path.join(OUT, 'name_index.json'), JSON.stringify(nameIndex));

// ── 2) items payloads (손상 엔티티 제외 — repair로) ──
for (const c of CATS) {
  const rows = [];
  for (const d of PF.all(c)) {
    const slug = d.slug || d._id;
    if (brokenSet[c] && brokenSet[c].has(slug)) continue;
    const en = (d.system && d.system.description && d.system.description.value) || '';
    const ko = d._desc_ko || '';
    if (!ko && !PF.nameKo(d)) continue;
    rows.push({ slug, name_en: d.name, name_ko: PF.nameKo(d), desc_en: en, desc_ko: ko });
  }
  writeBatches('items_' + c, rows);
}

// ── 3) creatures payloads (ko 중심; en은 base name만) ──
const CRE_DIR = path.join(DEV, 'data/creatures');
const creRows = [];
for (const f of fs.readdirSync(CRE_DIR)) {
  if (!/\.ko\.json$/.test(f) || f.startsWith('_')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(CRE_DIR, f), 'utf8'));
  const ent = j.entries || j;
  const bset = new Set(broken['creatures/' + f] || []);
  for (const key in ent) {
    if (bset.has(key)) continue;
    creRows.push({ file: f, key, data: ent[key] });
  }
}
writeBatches('creatures', creRows);

// ── 4) repair payloads (손상 엔티티: 영문 원문 대조 재구성) ──
const repRows = [];
for (const c in brokenSet) {
  for (const slug of brokenSet[c]) {
    const d = PF.get(c, slug);
    if (!d) { repRows.push({ kind: 'item', cat: c, slug, note: 'NOT FOUND' }); continue; }
    repRows.push({ kind: 'item', cat: c, slug, name_en: d.name, name_ko: PF.nameKo(d), desc_en: (d.system && d.system.description && d.system.description.value) || '', desc_ko_broken: d._desc_ko || '' });
  }
}
for (const k in broken) {
  if (!k.startsWith('creatures/')) continue;
  const f = k.slice('creatures/'.length);
  const j = JSON.parse(fs.readFileSync(path.join(CRE_DIR, f), 'utf8'));
  const ent = j.entries || j;
  // 크리처 영문 원문: base 파일에서 대응 문서
  const baseF = path.join(CRE_DIR, f.replace('.ko.json', '.base.json'));
  let baseIdx = {};
  if (fs.existsSync(baseF)) { const b = JSON.parse(fs.readFileSync(baseF, 'utf8')); for (const doc of (Array.isArray(b) ? b : Object.values(b))) baseIdx[doc.name] = doc; }
  for (const key of broken[k]) {
    const bd = baseIdx[key];
    // 손상 필드만 특정: 전체 entry에서 �/⟬ 포함 문자열 경로 수집
    const paths = [];
    (function walk(o, p) { if (typeof o === 'string') { if (/�|⟬|⟟|⟭/.test(o)) paths.push(p); return; } if (o && typeof o === 'object') for (const kk in o) walk(o[kk], p ? p + '.' + kk : kk); })(ent[key], '');
    const enFields = {};
    if (bd) for (const pth of paths) {
      // base에서 유사 경로의 영문 확보(간이: items.<slug>.description ↔ base items name/desc)
      const m = pth.match(/^items\.([^.]+)\.(name|description)$/);
      if (m && bd.items) { const bi = bd.items.find(x => (x.system && x.system.slug) === m[1] || (x.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === m[1]); if (bi) enFields[pth] = m[2] === 'name' ? bi.name : (bi.system && bi.system.description && bi.system.description.value) || ''; }
      else if (pth === 'description') enFields[pth] = (bd.system && bd.system.details && (bd.system.details.publicNotes || bd.system.details.blurb)) || '';
    }
    repRows.push({ kind: 'creature', file: f, key, broken_paths: paths, entry: ent[key], en_fields: enFields });
  }
}
writeBatches('repair', repRows, 60 * 1024);

// ── 5) rename payloads (카테고리 내 한글명 충돌) ──
const renRows = [];
for (const c of CATS) {
  const byKo = {};
  for (const d of PF.all(c)) { const ko = PF.nameKo(d); if (!ko) continue; (byKo[ko] = byKo[ko] || []).push(d); }
  for (const ko in byKo) {
    const g = byKo[ko]; const ens = new Set(g.map(d => d.name));
    if (ens.size < 2) continue;
    renRows.push({ cat: c, name_ko: ko, members: g.map(d => ({ slug: d.slug || d._id, name_en: d.name, desc_en: ((d.system && d.system.description && d.system.description.value) || '').replace(/<[^>]+>/g, ' ').slice(0, 350), desc_ko: (d._desc_ko || '').replace(/<[^>]+>/g, ' ').slice(0, 350) })) });
  }
}
writeBatches('rename', renRows, 48 * 1024);

// ── 6) UI/큐레이션 payloads ──
const uiRows = [];
function pushKV(file, obj, pathPrefix) {
  (function walk(o, p) {
    if (typeof o === 'string') { if (/[가-힣]/.test(o) || /^[A-Za-z]/.test(o)) uiRows.push({ file, key: p, ko: o }); return; }
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, p + '[' + i + ']')); return; }
    if (o && typeof o === 'object') for (const k in o) walk(o[k], p ? p + '.' + k : k);
  })(obj, pathPrefix || '');
}
for (const f of ['data/overlay/_lang.ko.json', 'data/creatures/_trait_desc.ko.json', 'data/creatures/_glossary.ko.json', 'data/creatures/_manual.ko.json', 'data/derived/action_curation.json', 'tools/derive/lore_ko.json']) {
  const full = path.join(DEV, f);
  if (!fs.existsSync(full)) continue;
  pushKV(f, JSON.parse(fs.readFileSync(full, 'utf8')), '');
}
writeBatches('ui', uiRows, 55 * 1024);

// ── 7) cs_data 큐레이션 블록 ──
const src = fs.readFileSync(path.join(DEV, 'cs_data.js'), 'utf8');
const csRows = [];
function grabArr(name) { const m = src.match(new RegExp('const ' + name + ' = (\\[[\\s\\S]*?\\n\\]);')); return m ? JSON.parse(m[1]) : null; }
const tdb = grabArr('TRAIT_DB'); if (tdb) for (const e of tdb) csRows.push({ block: 'TRAIT_DB', id: e.id, name_ko: e.name_ko, desc: e.desc || '' });
const cdb = grabArr('CONDITIONS_DATA'); if (cdb) for (const e of cdb) csRows.push({ block: 'CONDITIONS_DATA', id: e.id, name_ko: e.name, desc: e.desc || '' });
const m2 = src.match(/const SUBCLASS_DB = (\{[\s\S]*?\n\});/); // 객체형일 수도
let sdb = null; try { sdb = m2 ? JSON.parse(m2[1]) : grabArr('SUBCLASS_DB'); } catch (e) { sdb = grabArr('SUBCLASS_DB'); }
if (sdb) { const arr = Array.isArray(sdb) ? sdb : Object.values(sdb).flat(); for (const e of arr) if (e && e.name_ko) csRows.push({ block: 'SUBCLASS_DB', id: e.id || e.name_en, name_ko: e.name_ko, desc: e.desc || '' }); }
writeBatches('csdata', csRows, 55 * 1024);

console.log(JSON.stringify(counts, null, 1));
let tot = 0; for (const k in counts) tot += counts[k];
console.log('TOTAL batch files:', tot);
