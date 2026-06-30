// PF2e-KR lang/ko.json(시스템 통합 용어 사전) → 슬러그 기반 글로서리.
// 출력: dev/data/creatures/_glossary.ko.json {skill,sense,condition,ability,save,trait}
// trait은 기존 dev/data/overlay/_lang.ko.json(1224) 재사용 병합.
// 사용: node tools/rebase/build_glossary.mjs
import fs from 'fs';
const KR = process.env.PF2E_KR_SRC ? process.env.PF2E_KR_SRC + '/lang/ko.json' : '/tmp/PF2e-KR/lang/ko.json';
const LANG = '/tmp/PF2e-publish/dev/data/overlay/_lang.ko.json';
const OUT = '/tmp/PF2e-publish/dev/data/creatures/_glossary.ko.json';

const ko = JSON.parse(fs.readFileSync(KR, 'utf8')).PF2E || {};
const flat = {};
(function rec(o, pre) { for (const k in o) { const v = o[k]; const key = pre ? pre + '.' + k : k; if (v && typeof v === 'object') rec(v, key); else flat[key] = v; } })(ko, '');

const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();

const out = { skill: {}, sense: {}, condition: {}, ability: {}, save: {}, trait: {}, attackEffect: {} };

for (const key in flat) {
  const val = flat[key];
  if (typeof val !== 'string') continue;
  let m;
  if ((m = key.match(/^Skill\.([A-Za-z]+)$/))) out.skill[m[1].toLowerCase()] = val;
  else if ((m = key.match(/^Actor\.Creature\.Sense\.Type\.([A-Za-z]+)$/))) out.sense[kebab(m[1])] = val;
  else if ((m = key.match(/^ConditionType([A-Za-z]+)$/))) out.condition[kebab(m[1])] = val;
  else if ((m = key.match(/^Ability(Str|Dex|Con|Int|Wis|Cha)$/))) out.ability[m[1].toLowerCase()] = val;
  else if ((m = key.match(/^Saves?(Fortitude|Reflex|Will)(?:Label)?$/))) out.save[m[1].toLowerCase()] = val;
  else if ((m = key.match(/^AttackEffect([A-Za-z]+)$/))) out.attackEffect[kebab(m[1])] = val;
}
// 저장(save) 폴백 — 키 패턴이 다를 수 있어 직접 보강
const SAVE = { fortitude: flat['Fortitude'] || flat['SavesFortitude'] || '인내', reflex: flat['Reflex'] || flat['SavesReflex'] || '반사', will: flat['Will'] || flat['SavesWill'] || '의지' };
out.save = Object.assign(SAVE, out.save);

// trait: _lang.ko.json 재사용
try { out.trait = JSON.parse(fs.readFileSync(LANG, 'utf8')).traits || {}; } catch (e) { console.warn('trait 병합 실패:', e.message); }

fs.writeFileSync(OUT, JSON.stringify(out));
const n = c => Object.keys(out[c]).length;
console.log(`글로서리 → ${OUT}`);
console.log(`  skill ${n('skill')} · sense ${n('sense')} · condition ${n('condition')} · ability ${n('ability')} · save ${n('save')} · trait ${n('trait')}`);
console.log('  샘플:', ['skill.acrobatics=' + out.skill.acrobatics, 'sense.low-light-vision=' + out.sense['low-light-vision'], 'sense.scent=' + out.sense.scent, 'condition.sickened=' + out.condition.sickened, 'trait.agile=' + out.trait.agile].join(' | '));
