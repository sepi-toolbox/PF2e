#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  EXPORT TO EXCEL — dev/ JS DB → 단일 xlsx
//
//  Usage:
//    node tools/export_to_excel.js [output.xlsx]
//  Default output: /tmp/PF2e-publish/PF2e_DB.xlsx
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');
const { DB_DEFS } = require('./db_schema');
const { getDescription } = require('./db_column_dict');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const OUT_PATH = process.argv[2] || path.join(ROOT, 'PF2e_DB.xlsx');

// ── 1. dev/ JS 파일들을 vm 모듈로 로드 ──
//   const/let은 vm 컨텍스트 globalThis에 안 붙음 → 알고 있는 DB 변수의 const/let을 var로 치환
function loadAllDBs() {
  const files = [...new Set(DB_DEFS.map(d => d.file))];
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);

  for (const file of files) {
    const fp = path.join(DEV_DIR, file);
    let src = fs.readFileSync(fp, 'utf8');
    // 이 파일에 속한 DB 변수들의 선언 키워드를 var로 치환
    for (const def of DB_DEFS.filter(d => d.file === file)) {
      if (def.keyword === 'const' || def.keyword === 'let') {
        const re = new RegExp(`^${def.keyword}\\s+${def.var}\\s*=`, 'm');
        src = src.replace(re, `var ${def.var} =`);
      }
    }
    try {
      vm.runInContext(src, sandbox, { filename: file });
    } catch (e) {
      console.error(`[warn] ${file} eval: ${e.message}`);
    }
  }
  return sandbox;
}

// ── 2. 셀 값 직렬화 ──
//   undefined → 빈 셀 (키 없음)
//   null → 'null' 문자열 (의미 보존)
//   원시값(string/number/boolean) → 그대로
//   객체/배열 → JSON.stringify
function serializeCell(v) {
  if (v === undefined) return undefined;  // 키 없음
  if (v === null) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return v;
  if (typeof v === 'string') return v;
  return JSON.stringify(v);
}

// ── 3. 배열형 DB → 시트 (행=요소, 열=키 합집합) ──
//   원소가 모두 원시값이면 단일 'value' 컬럼 사용
function arrayToSheet(arr, sheetName) {
  if (!Array.isArray(arr)) {
    console.error(`[error] ${sheetName} is not an array (got ${typeof arr})`);
    return null;
  }
  const allPrim = arr.every(x => x === null || typeof x !== 'object');
  if (allPrim) {
    const rows = arr.map(x => ({ value: serializeCell(x) }));
    return XLSX.utils.json_to_sheet(rows, { header: ['value'] });
  }
  // 키 순서: 등장 순
  const seen = new Set();
  const keys = [];
  for (const obj of arr) {
    if (obj === null || obj === undefined) continue;
    if (typeof obj !== 'object') continue;
    for (const k of Object.keys(obj)) {
      if (!seen.has(k)) { seen.add(k); keys.push(k); }
    }
  }
  const rows = arr.map(obj => {
    if (obj === null || obj === undefined) return {};
    if (typeof obj !== 'object') return { value: serializeCell(obj) };
    const row = {};
    for (const k of keys) {
      const cell = serializeCell(obj[k]);
      if (cell !== undefined) row[k] = cell;
    }
    return row;
  });
  return XLSX.utils.json_to_sheet(rows, { header: keys });
}

// ── 4. kv-json DB → 시트 (key, value_json 두 컬럼) ──
function kvJsonToSheet(obj, sheetName) {
  if (typeof obj !== 'object' || obj === null) {
    console.error(`[error] ${sheetName} is not an object (got ${typeof obj})`);
    return null;
  }
  const rows = [];
  for (const [k, v] of Object.entries(obj)) {
    rows.push({ key: k, value_json: serializeCell(v) });
  }
  return XLSX.utils.json_to_sheet(rows, { header: ['key', 'value_json'] });
}

// ── 5. 메인 ──
function main() {
  console.log(`[export] loading dev/ DBs...`);
  const ctx = loadAllDBs();
  const wb = XLSX.utils.book_new();

  // 메타데이터 시트 (제일 앞)
  const metaRows = DB_DEFS.map(d => ({
    sheet: d.sheet,
    var: d.var,
    file: d.file,
    keyword: d.keyword,
    shape: d.shape,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(metaRows), '_META');

  // 컬럼 사전 시트 (_DICT) — export 끝에 빌드. 모든 시트의 헤더 자동 수집 + 사전 매핑.
  const dictRows = [];
  // 임시: 시트 빌드 후 정보 모으기 위해 콜백으로 처리
  const sheetColumns = {};  // sheet → [columns]

  let okCount = 0;
  let totalRows = 0;
  for (const def of DB_DEFS) {
    const data = ctx[def.var];
    if (data === undefined) {
      console.error(`[skip] ${def.var} undefined in ${def.file}`);
      continue;
    }
    let sheet = null;
    let n = 0;
    if (def.shape === 'array') {
      sheet = arrayToSheet(data, def.sheet);
      n = Array.isArray(data) ? data.length : 0;
    } else if (def.shape === 'kv-json') {
      sheet = kvJsonToSheet(data, def.sheet);
      n = Object.keys(data || {}).length;
    } else {
      console.error(`[skip] unknown shape: ${def.shape}`);
      continue;
    }
    if (sheet) {
      XLSX.utils.book_append_sheet(wb, sheet, def.sheet);
      console.log(`  ${def.sheet.padEnd(22)} ${String(n).padStart(5)} ${def.shape === 'array' ? 'rows' : 'keys'}`);
      okCount++;
      totalRows += n;
      // 컬럼명 수집 (사전 빌드용)
      const ref = sheet['!ref'];
      if (ref) {
        const range = XLSX.utils.decode_range(ref);
        const cols = [];
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell = sheet[XLSX.utils.encode_cell({ r: 0, c: C })];
          if (cell && cell.v) cols.push(String(cell.v));
        }
        sheetColumns[def.sheet] = { cols, shape: def.shape };
      }
    }
  }

  // _DICT 시트 빌드 — 모든 시트의 (시트, 컬럼, 설명) 행
  for (const def of DB_DEFS) {
    const info = sheetColumns[def.sheet];
    if (!info) continue;
    for (const col of info.cols) {
      dictRows.push({
        sheet: def.sheet,
        column: col,
        description: getDescription(def.sheet, col, info.shape),
      });
    }
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dictRows), '_DICT');
  const filledCount = dictRows.filter(r => r.description).length;
  console.log(`\n  _DICT sheet: ${dictRows.length} columns total, ${filledCount} described, ${dictRows.length - filledCount} blank (사용자 채움 가능)`);

  XLSX.writeFile(wb, OUT_PATH);
  console.log(`\n[export] ${okCount}/${DB_DEFS.length} DBs, ${totalRows} total entries → ${OUT_PATH}`);
}

main();
