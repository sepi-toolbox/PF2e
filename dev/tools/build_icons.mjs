// build_icons.mjs — FVTT 아이콘 벤더링 + icon_map.json 생성
// 레거시 DB(id=slug + 한글명 + 영문명) ⨝ BASE(system.slug + name + img) 조인.
// 출처: pf2e 시스템 = ~/Library/Application Support/FoundryVTT/Data/systems/pf2e/icons
//       코어        = /Applications/Foundry Virtual Tabletop.app/.../public/icons
// 사용: dev/ 에서  node tools/build_icons.mjs
//
// 결과:
//   dev/data/icons/<img 경로 그대로>   (참조된 파일만 복사, %xx 디코딩)
//   dev/data/icon_map.json   { equipment:{key:rel}, spell:{}, feat:{}, action:{} }
//                            key = 레거시 id | 영문명(lower) | 한글명(lower)
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const HOME = process.env.HOME;
const SRC_PF2E = path.join(HOME, 'Library/Application Support/FoundryVTT/Data');
const SRC_CORE = '/Applications/Foundry Virtual Tabletop.app/Contents/Resources/app/public';
const DEST_ICONS = 'data/icons';

// ── 레거시 DB 로드(데이터 파일 vm 평가) ──
function loadLegacy(files) {
  const sb = { window: {}, document: { addEventListener(){}, getElementById(){return null;}, createElement(){return {appendChild(){},style:{}};}, body:{appendChild(){}} }, console };
  vm.createContext(sb);
  for (const f of files) {
    let src = fs.readFileSync(f, 'utf8').replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
    try { vm.runInContext(src, sb, { filename: f }); }
    catch (e) { console.warn('  load 경고', f, e.message.split('\n')[0]); }
  }
  return sb;
}
const sb = loadLegacy(['equipment_db.js', 'SPELL_DB.js', 'feat_db.js', 'class_features_db.js', 'cs_data.js']);

// ── BASE 인덱스: system.slug → img, name(lower) → img ──
function baseIndex(file) {
  const slug = {}, name = {};
  if (!fs.existsSync(file)) return { slug, name };
  for (const it of JSON.parse(fs.readFileSync(file, 'utf8'))) {
    if (!it.img) continue;
    const s = it.system && it.system.slug;
    if (s && !(s in slug)) slug[s] = it.img;
    if (it.name && !(it.name.toLowerCase() in name)) name[it.name.toLowerCase()] = it.img;
  }
  return { slug, name };
}
const BASE = {
  equipment: baseIndex('data/base/equipment.base.json'),
  spell: baseIndex('data/base/spells.base.json'),
  feat: baseIndex('data/base/feats.base.json'),
  action: baseIndex('data/base/actions.base.json'),
  heritage: baseIndex('data/base/heritages.base.json'),
  ancestry: baseIndex('data/base/ancestries.base.json'),
  background: baseIndex('data/base/backgrounds.base.json'),
  deity: baseIndex('data/base/deities.base.json'),
  condition: baseIndex('data/base/conditions.base.json'),
};

// ── 복사 ──
const copied = new Set(), missingFiles = [];
function copyIcon(img) {
  if (copied.has(img)) return true;
  const decoded = decodeURIComponent(img);
  const src = decoded.startsWith('systems/') ? path.join(SRC_PF2E, decoded) : path.join(SRC_CORE, decoded);
  const dest = path.join(DEST_ICONS, decoded);
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied.add(img); return true;
  } catch (e) { missingFiles.push(img); return false; }
}

// ── 레거시 → BASE 매칭 후 맵 적재 ──
const map = { equipment: {}, spell: {}, feat: {}, action: {}, heritage: {}, ancestry: {}, background: {}, deity: {}, condition: {} };
const stat = {};
function feed(scope, arr) {
  if (!Array.isArray(arr)) return;
  const idx = BASE[scope];
  let total = 0, matched = 0;
  for (const it of arr) {
    // 키 정규화: 일부 배열은 name_ko/name_en, 일부는 name(한)/en(영) 사용
    const nEn = it && (it.name_en || it.en);
    const nKo = it && (it.name_ko || it.name);
    if (!it || (!it.id && !nEn && !nKo)) continue;
    total++;
    let img = (it.id && idx.slug[it.id]) ||
              (nEn && idx.name[String(nEn).toLowerCase()]) || null;
    if (!img) continue;
    if (!copyIcon(img)) continue;
    matched++;
    const rel = decodeURIComponent(img);
    for (const k of [it.id, nEn && String(nEn).toLowerCase(), nKo && String(nKo).toLowerCase()]) {
      if (k && !(k in map[scope])) map[scope][k] = rel;
    }
  }
  stat[scope] = (stat[scope] || { total: 0, matched: 0 });
  stat[scope].total += total; stat[scope].matched += matched;
}

feed('equipment', sb.ARMOR_DB);
feed('equipment', sb.SHIELD_DB);
feed('equipment', sb.WEAPON_DB);
feed('equipment', sb.GEAR_DB);
feed('spell', sb.SPELL_DB);
feed('feat', sb.FEAT_DB);
feed('action', sb.ACTION_DB);
feed('heritage', sb.HERITAGE_DB);
feed('ancestry', sb.ANCESTRIES);
feed('background', sb.BACKGROUNDS);
feed('deity', sb.DEITY_DB);
feed('condition', sb.CONDITIONS_DATA);

fs.writeFileSync('data/icon_map.json', JSON.stringify(map));
const mapKB = (fs.statSync('data/icon_map.json').size / 1024).toFixed(0);

console.log('복사된 고유 아이콘:', copied.size, '/ 소스 파일 누락:', missingFiles.length, missingFiles.slice(0, 5));
for (const s of Object.keys(stat)) console.log('  -', s, '매칭', stat[s].matched, '/', stat[s].total, '(', Object.keys(map[s]).length, '키 )');
console.log('icon_map.json:', mapKB, 'KB');
