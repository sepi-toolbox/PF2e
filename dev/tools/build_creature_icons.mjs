// 크리처 토큰 아이콘 빌더
// pf2e-tokens-{monster,npc}-core Foundry 모듈의 image-mapping.json(컴펜디움 _id→에셋) 을
// 시스템 팩 LevelDB의 _id→slug 와 조인 → 우리 BASE 크리처 id(=slug)와 매칭.
// 토큰 webp를 256px로 리사이즈해 dev/data/creature-icons/ 에 벤더링 + creature_icon_map.json 생성.
//
// 사용: cd dev/tools && node build_creature_icons.mjs
// 의존: classic-level(tools/rebase/node_modules), sharp(dev/tools/node_modules)
// 소스: 로컬 Foundry 설치본(시스템 팩 + 토큰 모듈). /tmp 초기화 시 산출물 커밋되어 있으면 재실행 불필요.

import { ClassicLevel } from '../../tools/rebase/node_modules/classic-level/index.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const HOME = '/Users/sepi/Library/Application Support/FoundryVTT/Data';
const SYS = `${HOME}/systems/pf2e/packs`;
const MOD = `${HOME}/modules`;
const DEV = path.resolve(import.meta.dirname, '..');      // .../dev
const OUT_DIR = path.join(DEV, 'data', 'creature-icons');
const OUT_MAP = path.join(DEV, 'data', 'creature_icon_map.json');
const SIZE = 256, QUALITY = 82;

// 추출기(extract_pf2e.mjs)와 동일한 slug 산출 — 동일 팩이므로 BASE id와 1:1 일치
const slugify = s => (s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function idToSlug(pack){
  const db = new ClassicLevel(`${SYS}/${pack}`, { valueEncoding:'json' });
  const actors = {};
  for await (const [k,v] of db.iterator()){ if (k.startsWith('!actors!')) actors[k.slice('!actors!'.length)] = v; }
  await db.close();
  const seen={}, map={};
  for (const [id,a] of Object.entries(actors)){
    let slug = a.system?.details?.identification?.slug || slugify(a.name);
    if (seen[slug]) slug = `${slug}-${(seen[slug]=(seen[slug]||1)+1)}`; else seen[slug]=1;
    map[id] = slug;
  }
  return map;
}

// [토큰모듈, image-mapping 키, 시스템 팩, 우리 BASE 파일]
const PACKS = [
  ['pf2e-tokens-monster-core','pf2e.pathfinder-bestiary',  'pathfinder-bestiary',    'bestiary.base.json'],
  ['pf2e-tokens-monster-core','pf2e.pathfinder-bestiary-2','pathfinder-bestiary-2',  'bestiary-2.base.json'],
  ['pf2e-tokens-monster-core','pf2e.pathfinder-bestiary-3','pathfinder-bestiary-3',  'bestiary-3.base.json'],
  ['pf2e-tokens-monster-core','pf2e.pathfinder-monster-core','pathfinder-monster-core','monster-core.base.json'],
  ['pf2e-tokens-npc-core',    'pf2e.pathfinder-npc-core',  'pathfinder-npc-core',    'npc-core.base.json'],
];

fs.mkdirSync(OUT_DIR, { recursive:true });
const map = {};                 // { [source]: { [id]: "<basename>.webp" } }
const doneFiles = new Set();    // 리사이즈 완료 basename (공유 아트 중복 방지)
let matched = 0, copied = 0, bytes = 0;

for (const [mod, mapKey, sysPack, baseFile] of PACKS){
  const mapping = JSON.parse(fs.readFileSync(`${MOD}/${mod}/image-mapping.json`,'utf8'))[mapKey] || {};
  const i2s = await idToSlug(sysPack);
  const base = JSON.parse(fs.readFileSync(path.join(DEV,'data','creatures',baseFile),'utf8'));
  const source = base[0]?.source || sysPack;
  const ours = new Set(base.map(c=>c.id));
  let m = 0;
  for (const [aid, entry] of Object.entries(mapping)){
    const slug = i2s[aid];
    if (!slug || !ours.has(slug)) continue;
    // subject(링 없는 순수 크리처 아트) 우선 — 캔버스/CSS 테두리가 유일한 링이 되도록.
    // 토큰 텍스처는 Foundry 다이내믹 링용이라 여백이 47~87%로 제각각 → trim 정규화 필요.
    const src = entry.token?.ring?.subject?.texture || entry.token?.texture?.src;
    if (!src) continue;
    const basename = path.basename(src);
    const absSrc = path.join(MOD, src.replace(/^modules\//,''));
    if (!fs.existsSync(absSrc)) continue;
    if (!doneFiles.has(basename)){
      const out = path.join(OUT_DIR, basename);
      // 투명 여백 trim → 정사각 패딩(중앙, 6% 여유) → 256px. 모든 크리처가 원 안을 균일하게 채움.
      const t = await sharp(absSrc).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }).catch(() => null);
      if (t) {
        // ⚠ sharp는 한 파이프라인에서 resize를 extend보다 먼저 적용 → 정사각 패딩과 분리(2단계) 필수.
        const w = t.info.width, h = t.info.height, side = Math.round(Math.max(w, h) * 1.06);
        const sq = await sharp(t.data)
          .extend({ top:Math.floor((side-h)/2), bottom:Math.ceil((side-h)/2), left:Math.floor((side-w)/2), right:Math.ceil((side-w)/2), background:{ r:0,g:0,b:0,alpha:0 } })
          .toBuffer();
        await sharp(sq).resize(SIZE, SIZE).webp({ quality:QUALITY }).toFile(out);
      } else {
        await sharp(absSrc).resize(SIZE, SIZE, { fit:'inside' }).webp({ quality:QUALITY }).toFile(out);
      }
      doneFiles.add(basename); copied++; bytes += fs.statSync(out).size;
    }
    (map[source] = map[source] || {})[slug] = basename;
    m++; matched++;
  }
  console.log(`${baseFile.padEnd(24)} matched ${m}/${ours.size}`);
}

fs.writeFileSync(OUT_MAP, JSON.stringify(map));
console.log('---');
console.log(`matched creatures : ${matched}`);
console.log(`vendored files    : ${copied}  (${(bytes/1048576).toFixed(1)}MB @ ${SIZE}px)`);
console.log(`map               : ${path.relative(DEV, OUT_MAP)}  (${(fs.statSync(OUT_MAP).size/1024).toFixed(0)}KB)`);
