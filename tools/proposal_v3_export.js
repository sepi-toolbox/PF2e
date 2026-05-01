#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  Proposal v3 Export — 사용자 정리 모델 (effect/choice 분리)
//
//  사용자 모델:
//    FEAT_DB 행: 공통효과(effect_group_id) + 선택지(choice_id) 둘 다 가능
//    선택지 옵션 → 옵션의 effect_group_id 직접 연결 (if_choice 컬럼 안 씀)
//    공통효과 + 옵션효과 둘 다 적용 가능
//
//  3 시트: FEATS / CHOICES / EFFECTS
//  Output: _proposals/PF2e_DB_proposal_v3_effects_choice.xlsx
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

const ROOT = path.resolve(__dirname, '..');
const DEV = path.join(ROOT, 'dev');
const OUT = path.join(ROOT, '_proposals', 'PF2e_DB_proposal_v3_effects_choice.xlsx');

// ── dev/ JS 로드 (vm) ──
const sandbox = { window: {}, console };
vm.createContext(sandbox);
function loadJs(file) {
  let src = fs.readFileSync(path.join(DEV, file), 'utf8');
  src = src.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
  vm.runInContext(src, sandbox, { filename: file });
}
loadJs('feat_db.js');
loadJs('cs_data.js');
const FEAT_DB = sandbox.FEAT_DB || [];

// ── 변환 ──
const feats = [];
const choices = [];
const effects = [];

// 시트 동작 변화 없는 효과 = display_note, damage_note → FEAT_DB로 흡수
const NOTE_TYPES = new Set(['display_note', 'damage_note']);

function pushEffects(groupId, arr) {
  for (const e of arr) {
    if (NOTE_TYPES.has(e.type)) continue;  // 노트는 EFFECTS에 안 들어감
    const row = { group_id: groupId, type: e.type };
    for (const k of Object.keys(e)) if (k !== 'type') row[k] = e[k];
    effects.push(row);
  }
}

// 재주의 effects 배열에서 노트만 추출 → FEAT_DB 컬럼용 객체 반환
function extractNotes(arr) {
  const out = { auto_note: '', damage_note: '' };
  if (!Array.isArray(arr)) return out;
  for (const e of arr) {
    if (e.type === 'display_note') out.auto_note = e.text || '';
    else if (e.type === 'damage_note') {
      const d = {};
      for (const k of Object.keys(e)) if (k !== 'type') d[k] = e[k];
      out.damage_note = d;
    }
  }
  return out;
}

for (const f of FEAT_DB) {
  const row = {
    id: f.id,
    name_ko: f.name_ko || '',
    name_en: f.name_en || '',
    category: f.category || '',
    feat_level: f.feat_level ?? '',
    traits: f.traits || '',
    summary: f.summary || '',
    acquisition: f.acquisition || '',
    source: f.source || '',
    prereq_group_id: f.prereq_group_id || '',
    auto_note: '',
    damage_note: '',
    effect_group_id: '',
    choice_id: '',
    choice_kind: '',
    choice_label: '',
    choice_filter: '',
  };

  // ── 노트류는 FEAT_DB로 흡수 ──
  const notes = extractNotes(f.effects);
  row.auto_note = notes.auto_note;
  row.damage_note = notes.damage_note;

  // ── 공통 효과(노트 제외) → effect_group_id ──
  if (Array.isArray(f.effects) && f.effects.some(e => !NOTE_TYPES.has(e.type))) {
    const egId = `eg-${f.id}`;
    row.effect_group_id = egId;
    pushEffects(egId, f.effects);
  }

  // ── choice → choice_id + CHOICES 시트 + (분기효과는 옵션의 effect_group_id) ──
  if (f.choice) {
    const chId = `cho-${f.id}`;
    row.choice_id = chId;
    row.choice_kind = f.choice.type || '';
    row.choice_label = f.choice.label || '';

    // type/label/options/defaults 외 필터 메타는 JSON 한 셀에 보존
    const filter = {};
    for (const k of Object.keys(f.choice)) {
      if (['type', 'label', 'options', 'defaults'].includes(k)) continue;
      filter[k] = f.choice[k];
    }
    if (Object.keys(filter).length) row.choice_filter = filter;

    if (f.choice.type === 'custom' && Array.isArray(f.choice.options)) {
      for (const opt of f.choice.options) {
        const optEgId = (f.choiceEffects && f.choiceEffects[opt.id])
          ? `eg-${f.id}-${opt.id}` : '';
        choices.push({
          choice_id: chId,
          option_id: opt.id,
          option_name: opt.name,
          effect_group_id: optEgId,
          is_default: '',
        });
        if (optEgId) pushEffects(optEgId, f.choiceEffects[opt.id]);
      }
    } else if (f.choice.type === 'skill_defaults' && Array.isArray(f.choice.defaults)) {
      for (const sk of f.choice.defaults) {
        choices.push({
          choice_id: chId,
          option_id: sk,
          option_name: sk,
          effect_group_id: '',
          is_default: true,
        });
      }
    }
    // 그 외 11종 type: 옵션 행 없음 (런타임 쿼리, choice_filter 메타로 충분)
  }

  feats.push(row);
}

// ── EFFECTS 단일 테이블 유지 + 컬럼 통합 (sparse 해결) ──
//   대상 식별자 7-8개 컬럼 → target 1개로 통합 (type이 어느 종류인지 알려줌)
//   weapons 배열 → 행 펼침
//   damage_type → resistance type 표시용으로만 남음 (modifier 컬럼 통합 가능)
const TARGET_COLS = ['skill','spell','feat','action','weapon_name','vision','sense','save'];

const compactEffects = [];
for (const e of effects) {
  // weapons 배열은 행 펼침
  if (Array.isArray(e.weapons) && e.weapons.length) {
    for (const w of e.weapons) {
      const row = { group_id: e.group_id, type: e.type, target: w };
      for (const k of Object.keys(e)) {
        if (k === 'weapons' || k === 'group_id' || k === 'type') continue;
        if (TARGET_COLS.includes(k)) continue;  // target에 통합되는 컬럼 skip
        row[k] = e[k];
      }
      compactEffects.push(row);
    }
    continue;
  }

  const row = { group_id: e.group_id, type: e.type };
  // target 통합: 7개 식별자 컬럼 중 하나라도 있으면 target에
  for (const c of TARGET_COLS) {
    if (e[c] !== undefined && e[c] !== null && e[c] !== '') {
      row.target = e[c];
      break;
    }
  }
  // 나머지 컬럼
  for (const k of Object.keys(e)) {
    if (k === 'group_id' || k === 'type') continue;
    if (TARGET_COLS.includes(k)) continue;  // target에 흡수됨
    row[k] = e[k];
  }
  compactEffects.push(row);
}
effects.length = 0;
effects.push(...compactEffects);

// ── 한글 헤더 사전 ──
const featKoMap = {
  id: 'ID', name_ko: '한글명', name_en: '영문명', category: '분류',
  feat_level: '레벨', traits: '특성', summary: '요약',
  acquisition: '획득경로', source: '출처', prereq_group_id: '전제조건GID',
  auto_note: '자동표시노트', damage_note: '피해노트(JSON)',
  effect_group_id: '공통효과GID', choice_id: '선택ID',
  choice_kind: '선택종류', choice_label: '선택라벨', choice_filter: '선택필터(JSON)',
};
const choiceKoMap = {
  choice_id: '선택ID', option_id: '옵션ID', option_name: '옵션이름',
  effect_group_id: '옵션효과GID', is_default: '기본값',
};
const effectKoMap = {
  group_id: '그룹ID', type: '효과종류', value: '수치', skill: '기술', text: '텍스트',
  save: '내성', bonus_type: '보너스타입', condition: '조건',
  spell: '주문', tradition: '전통', spell_type: '주문타입', spellType: '주문타입',
  uses: '사용횟수', feat: '재주', defaultChoice: '기본선택', default_choice: '기본선택',
  weapons: '무기들(배열)', weapon_name: '무기이름', weapon_category: '무기분류',
  damage: '피해', range: '사정거리', traits: '특성(배열)',
  vision: '시야', sense: '감각', damage_type: '피해종류', scaling: '스케일링(객체)',
  action: '행동ID', summary: '행동요약', actionCost: '행동비용',
  name: '이름', target: '대상', rank: '랭크', key: '키', from: '출처분류',
};

// ── 시트 빌드 (행1: 한글, 행2: 영문, 행3+: 데이터) ──
function serialize(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return v;
  return JSON.stringify(v);
}
function buildSheet(headers, rows, koMap) {
  const koRow = headers.map(h => koMap[h] || h);
  const aoa = [koRow, headers, ...rows.map(r => headers.map(h => serialize(r[h])))];
  const sh = XLSX.utils.aoa_to_sheet(aoa);
  sh['!freeze'] = { ySplit: 2 };
  sh['!rows'] = [{ hpx: 22 }];
  return sh;
}

const featHeaders = Object.keys(featKoMap);
const choiceHeaders = Object.keys(choiceKoMap);

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, buildSheet(featHeaders, feats, featKoMap), 'FEATS');
XLSX.utils.book_append_sheet(wb, buildSheet(choiceHeaders, choices, choiceKoMap), 'CHOICES');
// EFFECTS 헤더 = 단일 테이블, target 통합 후 동적 헤더
function effHeadersForCompact(rows) {
  const keys = new Set();
  for (const e of rows) for (const k of Object.keys(e)) keys.add(k);
  // 우선순위 순서: group_id, type, value, value2, ...
  const priority = ['group_id','type','target','value','bonus_type','condition','tradition','spell_type','uses','default_choice'];
  const ordered = priority.filter(k => keys.has(k));
  const rest = [...keys].filter(k => !priority.includes(k)).sort();
  return [...ordered, ...rest];
}
const effectKoMap2 = {
  group_id:'그룹ID', type:'효과종류', target:'대상',
  value:'수치', bonus_type:'보너스타입', condition:'조건',
  tradition:'전통', spell_type:'주문타입', spellType:'주문타입',
  uses:'사용횟수', default_choice:'기본선택', defaultChoice:'기본선택',
  summary:'행동요약', actionCost:'행동비용',
  weapon_category:'무기분류', damage:'피해', range:'사정거리', traits:'특성',
  scaling:'스케일링', rank:'랭크', key:'키', from:'출처분류',
  name:'이름', damage_type:'피해종류',
};
XLSX.utils.book_append_sheet(wb, buildSheet(effHeadersForCompact(effects), effects, effectKoMap2), 'EFFECTS');

if (!fs.existsSync(path.dirname(OUT))) fs.mkdirSync(path.dirname(OUT), { recursive: true });
XLSX.writeFile(wb, OUT);

// ── 통계 ──
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Proposal v3 export 완료');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`FEATS:    ${feats.length} 행`);
console.log(`  공통효과 보유 (effect_group_id):  ${feats.filter(f => f.effect_group_id).length}`);
console.log(`  선택지 보유 (choice_id):           ${feats.filter(f => f.choice_id).length}`);
console.log(`  공통+선택 모두 보유:               ${feats.filter(f => f.effect_group_id && f.choice_id).length}`);
console.log(`CHOICES:  ${choices.length} 행 (custom/skill_defaults 옵션 펼침)`);
console.log(`  옵션효과 가진 옵션:                ${choices.filter(c => c.effect_group_id).length}`);
console.log(`EFFECTS:  ${effects.length} 행 (노트 제외, 시트 변화 효과만)`);
console.log(`  type 종류:                         ${new Set(effects.map(e => e.type)).size}`);
console.log(`  type별 분포:`);
const typeCount = {};
for (const e of effects) typeCount[e.type] = (typeCount[e.type] || 0) + 1;
for (const [t, c] of Object.entries(typeCount).sort((a,b)=>b[1]-a[1])) {
  console.log(`    ${t.padEnd(28)} ${String(c).padStart(4)}`);
}
console.log(`  컬럼별 채움률:`);
const colFill = {};
for (const e of effects) for (const k of Object.keys(e)) colFill[k] = (colFill[k]||0) + 1;
for (const [k, c] of Object.entries(colFill).sort((a,b)=>b[1]-a[1])) {
  const pct = ((c/effects.length)*100).toFixed(0);
  console.log(`    ${k.padEnd(20)} ${String(c).padStart(4)} (${pct}%)`);
}
console.log(`FEAT_DB.auto_note 보유 재주: ${feats.filter(f=>f.auto_note).length}`);
console.log(`FEAT_DB.damage_note 보유 재주: ${feats.filter(f=>f.damage_note).length}`);
console.log('');
console.log(`Output: ${OUT}`);
