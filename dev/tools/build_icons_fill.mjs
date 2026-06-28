// icon_map 누락분 보충 — 레거시 DB(FEAT_DB/RUNE_DB)의 미매칭 항목을 BASE(FVTT)에 캐스케이드 매칭해
// 실제 아이콘을 부여, 매칭 실패 시 FVTT 스코프 기본 아이콘(빈칸 없음=FVTT 동작) 부여. icon_map.json 갱신 + 아이콘 벤더링.
// 사용: cd dev/tools && node build_icons_fill.mjs
// 소스: 로컬 Foundry 설치본. 산출물(icon_map.json + data/icons/*) 커밋.

import vm from 'vm';
import fs from 'fs';
import path from 'path';

const DEV = path.resolve(import.meta.dirname, '..');
const OUT = path.join(DEV, 'data', 'icons');
const MAPF = path.join(DEV, 'data', 'icon_map.json');
const DATA = '/Users/sepi/Library/Application Support/FoundryVTT/Data/';
const CORE = '/Applications/Foundry Virtual Tabletop.app/Contents/Resources/app/public/';

const map = JSON.parse(fs.readFileSync(MAPF, 'utf8'));
const lc = v => v ? String(v).toLowerCase() : null;
const norm = s => lc(s).replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, '').trim();

// 레거시 DB 로드
const sb = { window: {}, console };
sb.document = { addEventListener() {}, getElementById() { return null; }, createElement() { return { appendChild() {}, style: {}, classList: { add() {} } }; }, body: { appendChild() {} } };
vm.createContext(sb);
for (const f of ['cs_data.js', 'equipment_db.js', 'feat_db.js']) {
  let s = fs.readFileSync(path.join(DEV, f), 'utf8').replace(/^const /gm, 'var ').replace(/^let /gm, 'var ');
  try { vm.runInContext(s, sb, { filename: f }); } catch (e) { console.log('load warn', f, e.message); }
}

function baseIndex(file) {
  const arr = JSON.parse(fs.readFileSync(path.join(DEV, 'data', 'base', file), 'utf8'));
  const bySlug = new Map(), byNorm = new Map();
  for (const b of (Array.isArray(arr) ? arr : Object.values(arr))) {
    const sl = b.system && b.system.slug;
    if (sl) { bySlug.set(sl, b); if (!byNorm.has(norm(sl))) byNorm.set(norm(sl), b); }
    if (b.name && !byNorm.has(norm(b.name))) byNorm.set(norm(b.name), b);
  }
  return { bySlug, byNorm };
}
const FEAT = baseIndex('feats.base.json');
const EQUIP = baseIndex('equipment.base.json');

const CLASS_ANC_SUF = /-(bard|cleric|witch|wizard|druid|fighter|ranger|rogue|sorcerer|champion|monk|barbarian|alchemist|oracle|investigator|swashbuckler|gunslinger|magus|summoner|psychic|thaumaturge|kineticist|orc|half-orc|elf|dwarf|halfling|gnome|goblin|leshy|human)$/;
const RUNE_PREFIX = /^(greater|major|true|lesser|moderate|minor)-/;

function cascade(item, idx, extraKeys) {
  const tries = [item.id, item.id && item.id.replace(CLASS_ANC_SUF, ''), ...(extraKeys || []),
    norm(item.name_en), item.name_en && norm(item.name_en.replace(/'/g, ''))];
  for (const t of tries) {
    if (!t) continue;
    const b = idx.bySlug.get(t) || idx.byNorm.get(norm(t));
    if (b && b.img) return b.img;
  }
  return null;
}

// 벤더링: img 경로 → data/icons 로 복사(없을 때만). svg 기본아이콘 포함.
function vendor(img) {
  const dest = path.join(OUT, decodeURIComponent(img));
  if (fs.existsSync(dest)) return true;
  const d = decodeURIComponent(img);
  const src = fs.existsSync(DATA + d) ? DATA + d : (fs.existsSync(CORE + d) ? CORE + d : null);
  if (!src) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

const GENERIC_FEAT = 'icons/sundries/books/book-red-exclamation.webp';      // FVTT 재주 기본(6010/7398가 사용)
const GENERIC_RUNE = 'systems/pf2e/icons/equipment/runes/weapon-property-runes/weapon-property-runes.webp';

function fill(scope, dbArr, label, resolve) {
  let real = 0, generic = 0, novendor = 0;
  for (const it of (dbArr || [])) {
    if (!it) continue;
    const keys = [it.id, lc(it.name_en), lc(it.name_ko)].filter(Boolean);
    if (keys.some(k => map[scope][k])) continue;                 // 이미 아이콘 있음
    const { img, isGeneric } = resolve(it);
    if (!img) continue;
    if (!vendor(img)) { novendor++; continue; }
    for (const k of keys) map[scope][k] = img;
    if (isGeneric) generic++; else real++;
  }
  console.log(`${label.padEnd(10)} +real ${real} | +generic ${generic}` + (novendor ? ` | vendor실패 ${novendor}` : ''));
}

// FEAT_DB: BASE 재주 매칭 → 실패 시 제네릭 책
fill('feat', sb.FEAT_DB, 'FEAT', it => {
  const m = cascade(it, FEAT);
  return m ? { img: m, isGeneric: m === GENERIC_FEAT } : { img: GENERIC_FEAT, isGeneric: true };
});
// RUNE_DB: BASE 장비(룬) 매칭(greater/major 접두사 제거 폴백) → 실패 시 제네릭 룬
fill('equipment', sb.RUNE_DB, 'RUNE', it => {
  const extra = [it.id && it.id.replace(RUNE_PREFIX, ''), it.name_en && norm(it.name_en.replace(RUNE_PREFIX, '').replace(/\b(greater|major|lesser|moderate|minor|true)\b/gi, ''))];
  const m = cascade(it, EQUIP, extra.filter(Boolean));
  return m ? { img: m, isGeneric: false } : { img: GENERIC_RUNE, isGeneric: true };
});

fs.writeFileSync(MAPF, JSON.stringify(map));
console.log('icon_map 갱신:', path.relative(DEV, MAPF), '(' + (fs.statSync(MAPF).size / 1024 | 0) + 'KB)');
