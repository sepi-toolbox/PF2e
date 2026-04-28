#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION
//  (1) id 없는 7개 테이블에 슬러그 id 추가
//  (2) CLASSES 정규화: fixed_skills/choice_skill_groups/free_skill_count
//
//  Usage: node tools/migrate_pk_and_classes.js [--dry]
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

// ── id 부여 대상 (영문명 기반 슬러그) ──
//   suffixField: 충돌 시 의미 있는 접미사로 사용할 보조 필드 (예: FEAT_DB는 category)
const PK_TARGETS = [
  { var:'FEAT_DB',          file:'feat_db.js',       keyword:'var',   nameField:'name_en', suffixField:'category' },
  { var:'SPELL_DB',         file:'SPELL_DB.js',      keyword:'const', nameField:'name_en' },
  { var:'WEAPON_DB',        file:'equipment_db.js',  keyword:'const', nameField:'name_en' },
  { var:'ARMOR_DB',         file:'equipment_db.js',  keyword:'const', nameField:'name_en' },
  { var:'SHIELD_DB',        file:'equipment_db.js',  keyword:'const', nameField:'name_en' },
  { var:'GEAR_DB',          file:'equipment_db.js',  keyword:'const', nameField:'name_en' },
  { var:'RUNE_DB',          file:'equipment_db.js',  keyword:'const', nameField:'name_en' },
  { var:'CONDITIONS_DATA',  file:'cs_data.js',       keyword:'const', nameField:'en' },
];

// CLASSES 정규화 대상
const CLASSES_DEF = { var:'CLASSES', file:'cs_data.js', keyword:'const' };

// ── DB 로드 (vm 컨텍스트) ──
function loadAllDBs(varList) {
  const files = [...new Set(varList.map(d => d.file))];
  const sandbox = { window:{}, console };
  vm.createContext(sandbox);
  for (const file of files) {
    let src = fs.readFileSync(path.join(DEV_DIR, file), 'utf8');
    for (const def of varList.filter(d => d.file === file)) {
      if (def.keyword === 'const' || def.keyword === 'let') {
        src = src.replace(new RegExp(`^${def.keyword}\\s+${def.var}\\s*=`, 'm'), `var ${def.var} =`);
      }
    }
    // SKILLS도 로드 (CLASSES 정규화에 필요)
    src = src.replace(/^const\s+SKILL_NAME_MAP\s*=/m, 'var SKILL_NAME_MAP =');
    src = src.replace(/^const\s+SKILLS\s*=/m, 'var SKILLS =');
    try { vm.runInContext(src, sandbox, { filename: file }); }
    catch (e) { console.error(`[warn] ${file}: ${e.message}`); }
  }
  return sandbox;
}

// ── 슬러그 생성 ──
function slugify(name) {
  if (!name) return '';
  return String(name).toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── id 추가 + 충돌 회피 ──
//   1순위: name 슬러그 그대로
//   2순위: name + suffixField 슬러그 (suffixField 값 있을 때)
//   3순위: name + 숫자 (-2, -3)
function addIds(arr, sourceField, sheetName, suffixField) {
  if (!Array.isArray(arr)) return { added: 0, suffixed: 0, numbered: 0 };
  const used = new Set();
  for (const obj of arr) {
    if (obj && typeof obj === 'object' && obj.id) used.add(obj.id);
  }
  let added = 0, suffixed = 0, numbered = 0;
  for (const obj of arr) {
    if (!obj || typeof obj !== 'object' || obj.id) continue;
    const base = slugify(obj[sourceField]);
    if (!base) {
      console.error(`[warn] ${sheetName}: empty name for entry`, JSON.stringify(obj).slice(0, 80));
      continue;
    }
    let id = base;
    if (used.has(id) && suffixField && obj[suffixField]) {
      const suffix = slugify(obj[suffixField]);
      if (suffix) {
        const candidate = `${base}-${suffix}`;
        if (!used.has(candidate)) { id = candidate; suffixed++; }
      }
    }
    let n = 2;
    while (used.has(id)) { id = `${base}-${n++}`; numbered++; }
    obj.id = id;
    used.add(id);
    added++;
  }
  return { added, suffixed, numbered };
}

// ── id를 첫 컬럼으로 이동 ──
function reorderIdFirst(arr) {
  if (!Array.isArray(arr)) return;
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    if (!obj || typeof obj !== 'object' || !obj.id) continue;
    const { id, ...rest } = obj;
    arr[i] = { id, ...rest };
  }
}

// ── CLASSES 정규화 ──
function normalizeClasses(arr, skillNameMap) {
  for (const cls of arr) {
    const text = cls.skills || '';
    const fixed_skills = [];
    const choice_skill_groups = [];
    let free_skill_count = 0;
    let deity_skill = false;

    const parts = text.split(' + ');
    for (const p of parts) {
      const m = p.match(/(\d+)\+INT개/);
      if (m) { free_skill_count = parseInt(m[1]); continue; }
      if (p.trim() === '신격기술') { deity_skill = true; continue; }
      for (const seg of p.split(',')) {
        const name = seg.trim();
        if (!name) continue;
        if (name.includes('또는')) {
          const group = name.split(/\s*또는\s*/).map(c => c.trim()).map(n => skillNameMap[n] || n);
          choice_skill_groups.push(group);
        } else {
          const id = skillNameMap[name];
          if (id) fixed_skills.push(id);
          else console.error(`[warn] unknown skill name in ${cls.id}: ${name}`);
        }
      }
    }

    // 새 객체 빌드 (필드 순서 정리: id, name, en, ..., 신컬럼 끝)
    const { skills, ...rest } = cls;
    Object.assign(cls, rest, { fixed_skills, choice_skill_groups, free_skill_count });
    if (deity_skill) cls.deity_skill = true;
    delete cls.skills;
  }
}

// ── findVarBlock (괄호 매칭) ──
function findVarBlock(src, keyword, varName) {
  const re = new RegExp(`^${keyword}\\s+${varName}\\s*=\\s*[\\[\\{]`, 'm');
  const m = re.exec(src);
  if (!m) return null;
  const startDecl = m.index;
  let i = startDecl;
  while (i < src.length && src[i] !== '[' && src[i] !== '{') i++;
  if (i >= src.length) return null;
  let depth = 0, inString = null, inLine = false, inBlock = false;
  while (i < src.length) {
    const c = src[i], nx = src[i+1];
    if (inLine) { if (c === '\n') inLine = false; i++; continue; }
    if (inBlock) { if (c === '*' && nx === '/') { inBlock = false; i += 2; continue; } i++; continue; }
    if (inString) {
      if (c === '\\') { i += 2; continue; }
      if (c === inString) inString = null;
      i++; continue;
    }
    if (c === '/' && nx === '/') { inLine = true; i += 2; continue; }
    if (c === '/' && nx === '*') { inBlock = true; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') { inString = c; i++; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < src.length && /[ \t;]/.test(src[j])) j++;
        return { start: startDecl, end: j };
      }
    }
    i++;
  }
  return null;
}

// ── 부분 교체 + 저장 ──
function replaceVarBlock(file, keyword, varName, newData) {
  const fp = path.join(DEV_DIR, file);
  let src = fs.readFileSync(fp, 'utf8');
  const block = findVarBlock(src, keyword, varName);
  if (!block) { console.error(`[error] ${varName} block not found in ${file}`); return false; }
  const newCode = `${keyword} ${varName} = ${JSON.stringify(newData, null, 2)};`;
  const updated = src.slice(0, block.start) + newCode + src.slice(block.end);
  if (!DRY) fs.writeFileSync(fp, updated);
  return true;
}

// ── 메인 ──
function main() {
  console.log(`[migrate] loading all DBs${DRY ? ' (dry-run)' : ''}...\n`);
  const allVars = [...PK_TARGETS, CLASSES_DEF];
  const ctx = loadAllDBs(allVars);

  // (1) PK 추가
  console.log('=== (1) PK 추가 ===');
  const updates = [];  // {file, keyword, var, data}
  for (const def of PK_TARGETS) {
    const arr = ctx[def.var];
    if (!Array.isArray(arr)) { console.error(`[skip] ${def.var}: not an array`); continue; }
    const { added, suffixed, numbered } = addIds(arr, def.nameField, def.var, def.suffixField);
    reorderIdFirst(arr);
    const note = (suffixed || numbered) ? ` (suffix:${suffixed} num:${numbered})` : '';
    console.log(`  ${def.var.padEnd(18)} +${String(added).padStart(4)} ids${note}`);
    updates.push({ file: def.file, keyword: def.keyword, var: def.var, data: arr });
  }

  // (2) CLASSES 정규화
  console.log('\n=== (2) CLASSES 정규화 ===');
  const classes = ctx.CLASSES;
  const skillMap = ctx.SKILL_NAME_MAP;
  if (!Array.isArray(classes) || !skillMap) {
    console.error('[error] CLASSES or SKILL_NAME_MAP not loaded');
    process.exit(1);
  }
  normalizeClasses(classes, skillMap);
  for (const cls of classes) {
    const fix = (cls.fixed_skills || []).join(',');
    const grp = JSON.stringify(cls.choice_skill_groups || []);
    const free = cls.free_skill_count;
    const deity = cls.deity_skill ? ' deity' : '';
    console.log(`  ${cls.id.padEnd(8)} fixed=[${fix}] choice=${grp} free=${free}${deity}`);
  }
  updates.push({ file: CLASSES_DEF.file, keyword: CLASSES_DEF.keyword, var: CLASSES_DEF.var, data: classes });

  // ── 부분 교체 (파일별 끝쪽부터) ──
  console.log(`\n=== ${DRY ? 'DRY-RUN — ' : ''}저장 ===`);
  // 파일별 그룹화
  const byFile = {};
  for (const u of updates) (byFile[u.file] = byFile[u.file] || []).push(u);

  for (const [file, items] of Object.entries(byFile)) {
    const fp = path.join(DEV_DIR, file);
    let src = fs.readFileSync(fp, 'utf8');
    const blocks = items.map(u => {
      const b = findVarBlock(src, u.keyword, u.var);
      return b ? { ...b, newCode: `${u.keyword} ${u.var} = ${JSON.stringify(u.data, null, 2)};`, var: u.var } : null;
    }).filter(Boolean);
    blocks.sort((a, b) => b.start - a.start);
    for (const b of blocks) {
      src = src.slice(0, b.start) + b.newCode + src.slice(b.end);
    }
    if (!DRY) fs.writeFileSync(fp, src);
    console.log(`  ${file.padEnd(20)} ${blocks.length} blocks ${DRY ? 'would be replaced' : 'replaced'}`);
  }

  console.log(`\n[migrate] ${DRY ? 'dry-run complete' : 'done'}`);
}

main();
