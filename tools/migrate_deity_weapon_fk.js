// migrate_deity_weapon_fk.js
// DEITY_DB.weapon: 한국어 무기명 → WEAPON_DB.id 외래키 변환
// 일회성. dev/class_features_db.js를 in-place 갱신.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEV = path.resolve(__dirname, '..', 'dev');
const fpDeity = path.join(DEV, 'class_features_db.js');
const fpEquip = path.join(DEV, 'equipment_db.js');

// WEAPON_DB 로드 (const → var 치환 후 vm 실행)
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(fpEquip, 'utf8').replace(/^const /gm, 'var '), ctx);
const WEAPON_DB = ctx.WEAPON_DB;

// 한국어 alias 추가 보정 (필요 시)
const ALIAS = {
  // 직접 매칭 안 되는 경우 여기에 alias 추가
};

const src = fs.readFileSync(fpDeity, 'utf8');

// DEITY_DB 블록 추출 + 한국어 weapon → id 변환
let updated = src.replace(/("id":\s*"[a-z-]+",[\s\S]*?"weapon":\s*")([^"]+)(",)/g, (match, pre, weaponKo, post) => {
  const aliasKo = ALIAS[weaponKo] || weaponKo;
  const wpn = WEAPON_DB.find(w => w.name_ko === aliasKo);
  if (!wpn) {
    console.error(`✗ NO MATCH: weapon="${weaponKo}" — alias 추가 또는 WEAPON_DB 등재 필요`);
    process.exit(1);
  }
  console.log(`  ${weaponKo.padEnd(10)} → ${wpn.id}`);
  return pre + wpn.id + post;
});

if (src === updated) {
  console.log('변경 없음 — 이미 정규화된 상태일 수 있음');
  process.exit(0);
}

fs.writeFileSync(fpDeity, updated, 'utf8');
console.log('\n✓ class_features_db.js DEITY_DB.weapon 정규화 완료');
