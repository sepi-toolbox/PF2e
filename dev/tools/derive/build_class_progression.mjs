#!/usr/bin/env node
/* build_class_progression.mjs — 클래스 레벨별 숙련 진행표를 FVTT에서 파생
 * 데이터(FVTT): ①클래스 아이템 base 숙련(레벨1) ②system.items = 레벨별 부여 클래스특성(이름/slug/레벨)
 * 규칙맵(얇은 보편 규칙, ~클래스별 하드코딩 아님): 특성 slug → {대상 숙련, 랭크}. "juggernaut=인내 마스터" 류.
 * 산출: data/derived/class_progression.json  (구조본 + 툴 그리드용 flat rows + provenance)
 * 실행: cd dev && node tools/derive/build_class_progression.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const RANK = ['U', 'T', 'E', 'M', 'L'];          // 0~4
const SAVES = ['fortitude', 'reflex', 'will'];
const WEAPONS = ['simple', 'martial', 'unarmed', 'advanced'];
const ARMORS = ['unarmored', 'light', 'medium', 'heavy'];
const COLS = ['perception', ...SAVES, ...WEAPONS, ...ARMORS, 'classDC', 'spellcasting'];

const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));
const feats = load('data/base/feats.base.json');
const classes = load('data/base/classes.base.json');
const ovlClasses = load('data/overlay/classes.ko.json');
const byId = {}; for (const f of feats) byId[f._id] = f;

// ── 특성 slug → 숙련 효과 규칙맵 (보편) ─────────────────────────────
// rank: legend=4, master/mastery=3, expert/expertise=2. 랭크어 없으면 special에서.
function rankWord(s) { return /legend/.test(s) ? 4 : /master|mastery/.test(s) ? 3 : /expert|expertise/.test(s) ? 2 : null; }
// 특정 대상 없이 이름으로 특별 지정 (랭크어 없는 정본 특성)
const SPECIAL = {
  'juggernaut': { fortitude: 3 }, 'greater-juggernaut': { fortitude: 3 },
  'evasion': { reflex: 2 }, 'improved-evasion': { reflex: 3 }, 'greater-evasion': { reflex: 3 },
  'assured-evasion': { reflex: 2 }, 'confident-evasion': { reflex: 2 }, 'evasive-reflexes': { reflex: 2 },
  'natural-reflexes': { reflex: 2 }, 'greater-natural-reflexes': { reflex: 3 },
  'rogue-reflexes': { reflex: 2 }, 'greater-rogue-reflexes': { reflex: 3 }, 'tempered-reflexes': { reflex: 3 },
  'bravery': { will: 2 }, 'iron-will': { will: 2 }, 'great-fortitude': { fortitude: 2 }, 'lightning-reflexes': { reflex: 2 },
  'indomitable-will': { will: 3 }, 'commanding-will': { will: 2 }, 'divine-will': { will: 2 },
  'dogged-will': { will: 2 }, 'greater-dogged-will': { will: 3 }, 'mysterious-resolve': { will: 2 },
  'greater-mysterious-resolve': { will: 3 }, 'resolve': { will: 3 }, 'greater-resolve': { will: 4 },
  'fortress-of-will': { will: 3 }, 'unassailable-soul': { will: 2 }, 'greater-unassailable-soul': { will: 3 },
  'alertness': { perception: 2 }, 'vigilant-senses': { perception: 3 }, 'incredible-senses': { perception: 4 },
  'battlefield-surveyor': { perception: 3 }, 'extrasensory-perception': { perception: 3 }, 'perception-expertise': { perception: 2 },
  'guardians-armor': { /* champion 시작 armor, 레벨1 base가 처리 */ },
};
// 대상 그룹 추론 (WEAPON/ARMOR는 클래스가 이미 훈련한 카테고리로 확장)
function domainOf(s) {
  const t = [];
  if (/fortitude/.test(s)) t.push('fortitude');
  if (/reflex/.test(s)) t.push('reflex');
  if (/\bwill\b|resolve/.test(s)) t.push('will');
  if (/perception|senses|surveyor|vigilant|alertness/.test(s)) t.push('perception');
  if (/weapon|strikes|striking|overdrive|deed|gunsling/.test(s)) t.push('WEAPON');
  if (/armor|defens|robes/.test(s)) t.push('ARMOR');
  if (/spellcaster|spellcasting/.test(s)) t.push('spellcasting');
  return t;
}

function build() {
  const out = {};
  const flatRows = [];
  for (const c of classes) {
    const cs = c.system, slug = cs.slug;
    // 레벨1 base
    const base = {};
    base.perception = rankNum(cs.perception);
    for (const s of SAVES) base[s] = (cs.savingThrows && cs.savingThrows[s]) | 0;
    for (const w of WEAPONS) base[w] = (cs.attacks && cs.attacks[w]) | 0;
    for (const a of ARMORS) base[a] = (cs.defenses && cs.defenses[a]) | 0;
    base.classDC = 1;                 // 대부분 클래스 레벨1 훈련(정본). 증가는 {class}-expertise 등에서.
    base.spellcasting = (typeof cs.spellcasting === 'number' ? cs.spellcasting : (cs.spellcasting ? 1 : 0)) | 0;

    // 부여 특성 레벨순
    const items = Object.values(cs.items || {}).map(it => ({ level: it.level | 0, name: it.name, fslug: (byId[(it.uuid || '').split('.').pop()] || {}).system?.slug || slugify(it.name) }))
      .sort((a, b) => a.level - b.level);

    // 증가 이벤트 수집
    const increases = [];
    for (const it of items) {
      const fs2 = it.fslug || '';
      let effects = {};
      // special 우선
      if (SPECIAL[fs2]) effects = { ...SPECIAL[fs2] };
      else {
        const rank = rankWord(fs2); const doms = domainOf(fs2);
        // {class}-expertise / {class}-mastery → classDC (+캐스터 spellcasting)
        if ((fs2 === `${slug}-expertise` || /-expertise$/.test(fs2)) && rank && doms.length === 0) effects.classDC = rank;
        if ((fs2 === `${slug}-mastery` || /-mastery$/.test(fs2)) && rank && doms.length === 0) effects.classDC = rank;
        for (const d of doms) {
          if (d === 'WEAPON') { const r = rank || 2; for (const w of ['simple', 'martial', 'unarmed']) if ((base[w] | 0) >= 1) effects[w] = Math.max(effects[w] || 0, r); if ((base.advanced | 0) >= 1) effects.advanced = Math.max(effects.advanced || 0, r >= 3 ? r - 1 : r); }
          else if (d === 'ARMOR') { for (const a of ARMORS) if ((base[a] | 0) >= 1) effects[a] = Math.max(effects[a] || 0, rank || 2); }
          else if (rank) effects[d] = rank;
        }
      }
      const keys = Object.keys(effects).filter(k => COLS.includes(k));
      if (keys.length) increases.push({ level: it.level, feature: it.name, feature_slug: fs2, effects: pick(effects, keys) });
    }

    // 레벨 1..20 확장 (증가 적용, 이전 랭크 유지)
    const cur = { ...base };
    const table = {};
    for (let lv = 1; lv <= 20; lv++) {
      for (const inc of increases) if (inc.level === lv) for (const k in inc.effects) cur[k] = Math.max(cur[k] | 0, inc.effects[k]);
      table[lv] = { ...cur };
      // flat row (툴 그리드)
      flatRows.push({ class: slug, name_ko: (ovlClasses[slug] || {}).name || c.name, level: lv, ...mapRanks(cur), _src: increases.filter(i => i.level === lv).map(i => i.feature).join('; ') });
    }
    out[slug] = { name_en: c.name, name_ko: (ovlClasses[slug] || {}).name || c.name, key_ability: keyAb(cs), base: mapRanks(base), increases, table };
  }
  return { classes: out, rows: flatRows, cols: COLS, generated_from: 'FVTT classes.base + classfeature levels + 보편 규칙맵', note: '핵심 랭크증가는 FVTT 데이터에 rank값이 없어 특성 slug 규칙맵으로 해석. 레벨/특성/base는 100% FVTT.' };
}
function rankNum(o) { if (o == null) return 0; return (typeof o === 'object' ? o.value : o) | 0; }
function keyAb(cs) { const k = cs.keyAbility && cs.keyAbility.value; return Array.isArray(k) ? k.join('/') : ''; }
function mapRanks(o) { const r = {}; for (const c of COLS) r[c] = RANK[o[c] | 0]; return r; }
function pick(o, ks) { const r = {}; for (const k of ks) r[k] = o[k]; return r; }
function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

const result = build();
const outPath = path.join(DEV, 'data', 'derived', 'class_progression.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 1) + '\n');
console.log(`✔ ${path.relative(DEV, outPath)} — ${Object.keys(result.classes).length}클래스 × 20레벨 = ${result.rows.length}행`);
// 스팟체크 출력
for (const slug of ['fighter', 'wizard', 'rogue']) {
  const t = result.classes[slug]; if (!t) continue;
  console.log(`\n[${slug}] 증가 이벤트:`);
  for (const inc of t.increases) console.log(`  L${inc.level} ${inc.feature} → ${JSON.stringify(inc.effects)}`);
  console.log(`  L1 : ${JSON.stringify(t.table[1])}`);
  console.log(`  L20: ${JSON.stringify(t.table[20])}`);
}
