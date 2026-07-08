// 검증 하니스: CLASS_FEATURE_NAMES가 성장표 로스터에서 slug+kind를 싣는지 + 유실 없는지.
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
process.chdir(DEV);

globalThis.CLASS_FEATURE_NAMES = {};
globalThis.CLASS_SPELL_TABLE = {};
globalThis.SUBCLASS_DB = [];

const PFClass = await import(path.join(DEV, 'cs_pf2e_class.js'));
await PFClass.default.init();

const FN = globalThis.CLASS_FEATURE_NAMES;
const classes = Object.keys(FN).sort();
let total = 0, noSlug = 0, noKind = 0;
const kindC = { subclass: 0, choice: 0, feature: 0 };
for (const c of classes) {
  for (const f of FN[c]) {
    total++;
    if (!f.slug && !f.id) noSlug++;
    if (!f.kind) noKind++; else kindC[f.kind] = (kindC[f.kind] || 0) + 1;
  }
}
console.log(`CLASS_FEATURE_NAMES: ${classes.length} 클래스, ${total} 특성`);
console.log(`  slug 없음: ${noSlug}, kind 없음: ${noKind}`);
console.log(`  kind: ${JSON.stringify(kindC)}`);
console.log('\n[cleric]');
for (const f of FN.cleric) console.log(`  lv${f.lv} ${f.slug} (${f.kind}) ${f.name_ko}`);
console.log('\n[fighter]');
for (const f of FN.fighter) console.log(`  lv${f.lv} ${f.slug} (${f.kind}) ${f.name_ko}`);
