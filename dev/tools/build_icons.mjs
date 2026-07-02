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
const sb = loadLegacy(['equipment_db.js', 'feat_db.js', 'class_features_db.js', 'cs_data.js']);

// ── BASE 인덱스: system.slug → img, name(lower) → img ──
// 정규화: 소문자 + 아포스트로피 제거 + 비영숫자→하이픈
function norm(s) { return String(s).toLowerCase().replace(/['’ʼ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
// 클래스/원형 접미사(재주 id가 base slug + '-bard' 형태인 경우)
const CLASS_SUFFIX = new Set(['alchemist','barbarian','bard','champion','cleric','druid','fighter','monk','ranger','rogue','sorcerer','wizard','witch','oracle','investigator','swashbuckler','gunslinger','inventor','magus','summoner','psychic','thaumaturge','kineticist','animist','exemplar','runesmith','commander','guardian']);
function stripClass(id) { if (!id) return null; const i = id.lastIndexOf('-'); return (i > 0 && CLASS_SUFFIX.has(id.slice(i + 1))) ? id.slice(0, i) : null; }

// 평탄 인덱스: slug · norm(slug) · norm(name) → img
function baseIndex(file) {
  const m = {};
  if (!fs.existsSync(file)) return m;
  for (const it of JSON.parse(fs.readFileSync(file, 'utf8'))) {
    if (!it.img) continue;
    const s = it.system && it.system.slug;
    const add = k => { if (k && !(k in m)) m[k] = it.img; };
    if (s) { add(s); add(norm(s)); }
    if (it.name) add(norm(it.name));
  }
  return m;
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
// 클래스/혈통 특성 보조 인덱스 병합(features-extra = class-features+ancestry-features 팩 추출)
// → feats.base에 없는 클래스 특성 아이콘 보강. (재생성: /tmp/iconwork/extract.mjs, classic-level 필요)
const featExtra = baseIndex('data/base/features-extra.base.json');
for (const k in featExtra) if (!(k in BASE.feat)) BASE.feat[k] = featExtra[k];
// 교차 카테고리 폴백(행동 = 실제로 재주/주문/장비인 경우 많음)
const GLOBAL = Object.assign({}, BASE.action, BASE.equipment, BASE.spell, BASE.feat);
// 장비 명명 차이 변환(수량/단위 제거, 도구→toolkit, wood→wooden, +armor 등)
function equipVariants(id) {
  if (!id) return [];
  const v = new Set();
  const qty = id.replace(/-\d+(-(ft|feet|weeks?|days?|hours?))?$/, '').replace(/-\d+$/, '');
  v.add(qty);
  v.add(id.replace(/-tools$/, '-toolkit'));
  v.add(id.replace(/-wood$/, '-wooden'));
  v.add(id.replace(/-waraxe$/, '-war-axe'));
  v.add(id + '-armor');
  v.delete(id);
  return [...v];
}
function resolveImg(scope, it) {
  const idx = BASE[scope] || {};
  const nEn = it.name_en || it.en, nKo = it.name_ko || it.name;
  const sc = stripClass(it.id);
  const tries = [it.id, norm(it.id || ''), nEn && norm(nEn), nKo && norm(nKo), sc, sc && norm(sc)];
  if (scope === 'equipment') for (const ev of equipVariants(it.id)) { tries.push(ev, norm(ev)); }
  const list = tries.filter(Boolean);
  for (const t of list) if (idx[t]) return idx[t];
  if (scope === 'action' || scope === 'feat') for (const t of list) if (GLOBAL[t]) return GLOBAL[t];
  return null;
}

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
const map = { equipment: {}, spell: {}, feat: {}, action: {}, heritage: {}, ancestry: {}, background: {}, deity: {}, condition: {}, class: {} };
const stat = {};
function feed(scope, arr) {
  if (!Array.isArray(arr)) return;
  let total = 0, matched = 0;
  for (const it of arr) {
    // 키 정규화: 일부 배열은 name_ko/name_en, 일부는 name(한)/en(영) 사용
    const nEn = it && (it.name_en || it.en);
    const nKo = it && (it.name_ko || it.name);
    if (!it || (!it.id && !nEn && !nKo)) continue;
    total++;
    let img = resolveImg(scope, it);
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
// 주문 아이콘은 FVTT doc.img → runtime iconImg img-폴백으로 해소(카탈로그=PF2eSpell)
feed('feat', sb.FEAT_DB);
feed('action', sb.ACTION_DB);
feed('heritage', sb.HERITAGE_DB);
feed('ancestry', sb.ANCESTRIES);
feed('background', sb.BACKGROUNDS);
feed('deity', sb.DEITY_DB);
feed('condition', sb.CONDITIONS_DATA);

// class 스코프: BASE classes 직접(레거시 배열 없음 — slug=fighter 등 런타임 selectedClass.id와 일치)
{
  let total = 0, matched = 0;
  for (const it of JSON.parse(fs.readFileSync('data/base/classes.base.json', 'utf8'))) {
    if (!it.img) continue;
    total++;
    if (!copyIcon(it.img)) continue;
    matched++;
    const rel = decodeURIComponent(it.img);
    const s = it.system && it.system.slug;
    for (const k of [s, s && norm(s), it.name && it.name.toLowerCase()]) if (k && !(k in map.class)) map.class[k] = rel;
  }
  stat.class = { total, matched };
}

fs.writeFileSync('data/icon_map.json', JSON.stringify(map));
const mapKB = (fs.statSync('data/icon_map.json').size / 1024).toFixed(0);

console.log('복사된 고유 아이콘:', copied.size, '/ 소스 파일 누락:', missingFiles.length, missingFiles.slice(0, 5));
for (const s of Object.keys(stat)) console.log('  -', s, '매칭', stat[s].matched, '/', stat[s].total, '(', Object.keys(map[s]).length, '키 )');
console.log('icon_map.json:', mapKB, 'KB');
