#!/usr/bin/env node
/**
 * PlayerCore.html에서 재주(feats)를 자동 파싱하여 feat_db.js 형식으로 출력.
 * 혈통 재주는 기존 feat_db.js에 이미 있으므로 class/general/skill만 생성.
 *
 * 사용법:
 *   루트 cwd: node tools/rebuild_feat_db.js > feat_db_new.js
 *   dev/ cwd: cd dev && node ../tools/rebuild_feat_db.js > feat_db_new.js
 *
 * 출력 형식: JSON (var FEAT_DB = [...];) — dev/feat_db.js 호환
 * 입력 형식: 양쪽 호환 (eval로 처리, JSON 또는 JS literal 모두 가능)
 * id 보존: 기존 항목의 id 유지, 신규 항목은 name_en에서 자동 슬러그 생성
 */

const fs = require('fs');
const path = require('path');

// PlayerCore.html은 루트에만 있음 — cwd가 dev/면 ../PlayerCore.html
const PLAYERCORE_PATH = fs.existsSync('PlayerCore.html')
  ? 'PlayerCore.html'
  : fs.existsSync('../PlayerCore.html') ? '../PlayerCore.html' : null;
if (!PLAYERCORE_PATH) {
  console.error('ERROR: PlayerCore.html not found in cwd or parent');
  process.exit(1);
}
const html = fs.readFileSync(PLAYERCORE_PATH, 'utf8');

// ── 카테고리 매핑 ──
const CLASS_MAP = {
  '바드':'bard', '챔피언':'champion', '클레릭':'cleric', '드루이드':'druid',
  '파이터':'fighter', '레인저':'ranger', '로그':'rogue', '위저드':'wizard', '위치':'witch',
  '건터':'gunslinger', '인벤터':'inventor', '매거스':'magus', '스워시버클러':'swashbuckler',
};
const ANCESTRY_MAP = {
  '드워프':'dwarf', '엘프':'elf', '노움':'gnome', '고블린':'goblin',
  '하플링':'halfling', '인간':'human', '레쉬':'leshy', '오크':'orc',
  '체인질링':'changeling', '네피림':'nephilim', '아이우바린':'aiuvarin', '드로마르':'dromaar',
};

// ── h3 헤더에서 재주 파싱 ──
// 패턴: <h3 ...>한글명 <span class="en">English</span> [행동] — 재주 N [카테고리1] 추가특성...</h3>
const h3Re = /<h3 class="sub"[^>]*>([\s\S]*?)<\/h3>/g;

// h3 내부 파싱
function parseHeader(h3Inner) {
  // span.en 추출
  const enMatch = h3Inner.match(/<span class="en">(.*?)<\/span>/);
  if (!enMatch) return null;
  const name_en = enMatch[1].trim();

  // 한글 이름: h3 시작부터 <span 전까지
  let name_ko = h3Inner.substring(0, h3Inner.indexOf('<span class="en">')).trim();
  // HTML 태그 제거
  name_ko = name_ko.replace(/<[^>]*>/g, '').trim();

  // "— 재주 N [...]" 파싱
  const after = h3Inner.substring(h3Inner.indexOf('</span>') + 7);
  const featMatch = after.match(/—\s*재주\s*(\d+)\s*\[([^\]]+)\]/);
  if (!featMatch) return null;

  const feat_level = parseInt(featMatch[1]);
  const bracketContent = featMatch[2].trim(); // e.g. "바드" or "일반 기술" or "일반"

  // 행동 비용 추출 (이름 뒤, — 앞)
  const actionMatch = after.match(/\[(자유 행동|1행동|2행동|3행동|반응)\]/);
  const actionCost = actionMatch ? actionMatch[1] : null;

  // 괄호 뒤 추가 특성 (e.g. "행운", "비일반", "비밀")
  // featMatch의 전체 매칭 끝 이후의 텍스트에서 추출
  const afterCategory = after.substring(after.indexOf(featMatch[0]) + featMatch[0].length).trim();
  const extraTraits = afterCategory.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(t => t && t !== '—');

  // 카테고리 결정 — bracket을 토큰화하여 처리
  // 패턴 예: [일반], [일반 기술], [일반 기술 휴식 조작], [일반 비밀 기술], [바드 행운] 등
  const tokens = bracketContent.split(/[,\s]+/).filter(Boolean);
  let category = null;
  let mainTrait = bracketContent;
  let extraFromBracket = [];

  if (tokens.includes('일반') && tokens.includes('기술')) {
    category = 'skill';
    mainTrait = '일반';
    extraFromBracket = tokens.filter(t => t !== '일반' && t !== '기술');
  } else if (tokens.includes('일반')) {
    category = 'general';
    mainTrait = '일반';
    extraFromBracket = tokens.filter(t => t !== '일반');
  } else {
    // 클래스 또는 혈통 재주
    for (const p of tokens) {
      if (CLASS_MAP[p]) { category = CLASS_MAP[p]; break; }
      if (ANCESTRY_MAP[p]) { category = 'ancestry'; break; }
    }
    if (!category) {
      // 미인식 카테고리 — 스킵
      return null;
    }
    mainTrait = bracketContent;
    extraFromBracket = tokens.filter(t => !CLASS_MAP[t] && !ANCESTRY_MAP[t]);
  }

  // bracket 안의 추가 토큰(휴식, 조작, 비밀 등)을 extraTraits에 합침
  const mergedExtraTraits = [...extraFromBracket, ...extraTraits];

  return { name_ko, name_en, feat_level, category, mainTrait, actionCost, extraTraits: mergedExtraTraits };
}

// ── 본문 추출: h3 이후 ~ 다음 h3 또는 h2 전까지의 <p> 태그들 ──
function extractBody(startIdx) {
  const searchFrom = html.indexOf('</h3>', startIdx) + 5;
  const nextH3 = html.indexOf('<h3 ', searchFrom);
  const nextH2 = html.indexOf('<h2 ', searchFrom);
  const nextDiv = html.indexOf('</div>', searchFrom);
  let endIdx = html.length;
  if (nextH3 > 0) endIdx = Math.min(endIdx, nextH3);
  if (nextH2 > 0) endIdx = Math.min(endIdx, nextH2);
  // Don't use nextDiv as boundary — it cuts off too early in nested structures

  const block = html.substring(searchFrom, endIdx).trim();

  // 특성(em) 줄 추출
  // 특성 줄: <p><em>바드</em> 또는 <p><em>행운, 바드</em> — 짧은 키워드 나열
  // 주문명: <em>치유의 찬송(hymn of healing)</em> — 괄호 안에 영문 소문자
  const emMatch = block.match(/<p>\s*<em>(.*?)<\/em>/);
  let traitsLine = '';
  if (emMatch) {
    const emText = emMatch[1].replace(/<[^>]*>/g, '').trim();
    // 주문명 이탤릭은 특성 줄이 아님: (영문 소문자)가 포함되면 스킵
    const isSpellName = /\([a-z]/.test(emText);
    if (!isSpellName) traitsLine = emText;
  }

  // 전제조건 추출
  const prereqMatch = block.match(/<strong>전제조건[^<]*<\/strong>\s*(.*?)(?:<\/p>|<br)/);
  const prerequisites = prereqMatch ? prereqMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // 빈도 추출
  const freqMatch = block.match(/<strong>빈도[^<]*<\/strong>\s*(.*?)(?:<\/p>|<br)/);
  const frequency = freqMatch ? freqMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // 유발 조건 추출
  const triggerMatch = block.match(/<strong>유발 조건[^<]*<\/strong>\s*(.*?)(?:<\/p>|<br)/);
  const trigger = triggerMatch ? triggerMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // 요구사항 추출
  const reqMatch = block.match(/<strong>요구사항[^<]*<\/strong>\s*(.*?)(?:<\/p>|<br)/);
  const requirements = reqMatch ? reqMatch[1].replace(/<[^>]*>/g, '').trim() : '';

  // 전체 desc: 모든 <p> 내용 합침 (첫 번째 p의 em 특성줄만 제외)
  const pTags = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)];
  let descParts = [];
  let isFirstP = true;
  for (const m of pTags) {
    let content = m[1].trim();
    if (isFirstP) {
      isFirstP = false;
      // 첫 번째 p가 특성만 있는 경우 스킵
      if (content.match(/^<em>[^<]*<\/em>$/)) continue;
      // 첫 번째 p에서 특성+전제조건 합쳐진 경우: em 줄 제거하고 나머지 유지
      if (traitsLine) {
        content = content.replace(/^<em>[^<]*<\/em>\s*(?:<br\s*\/?>)?/i, '').trim();
      }
    }
    // 레벨 구분 헤더 스킵: <p><strong>2레벨</strong></p> 등
    if (content.match(/^<strong>\d+레벨<\/strong>$/)) continue;
    if (content) descParts.push(content);
  }
  let desc = descParts.join('<br>');
  // desc에서 전제조건/빈도/유발조건/요구사항 메타데이터 제거 (별도 필드에 있으므로)
  desc = desc.replace(/<strong>전제조건[^<]*<\/strong>\s*[^<]*(?:<br\s*\/?>)?/i, '').trim();

  // summary: desc에서 HTML 태그 제거
  let summary = desc.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]*>/g, '').trim();

  return { traitsLine, prerequisites, frequency, trigger, requirements, desc, summary };
}

// ── 메인 파싱 ──
const feats = [];
let match;
while ((match = h3Re.exec(html)) !== null) {
  const h3Full = match[0];
  const h3Inner = match[1];
  const h3Idx = match.index;

  const header = parseHeader(h3Inner);
  if (!header) continue; // 혈통 재주 등 스킵
  if (!['ancestry','bard','champion','cleric','druid','fighter','ranger','rogue','wizard','witch','general','skill'].includes(header.category)) continue;

  const body = extractBody(h3Idx);

  // traits 배열 구성
  const traits = [];
  if (body.traitsLine) {
    body.traitsLine.replace(/<[^>]*>/g, '').split(/[,，]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (!traits.includes(t)) traits.push(t);
    });
  }
  // extraTraits from header (비일반, 행운 등)
  header.extraTraits.forEach(t => {
    if (t && !traits.includes(t)) traits.push(t);
  });
  // 특성 줄이 비어있으면 카테고리의 한글명을 기본 특성으로 추가
  const CAT_KO = {bard:'바드',champion:'챔피언',cleric:'클레릭',druid:'드루이드',
    fighter:'파이터',ranger:'레인저',rogue:'로그',wizard:'위저드',witch:'위치',
    general:'일반',skill:'일반'};
  if (traits.length === 0 && CAT_KO[header.category]) {
    traits.push(CAT_KO[header.category]);
  }

  // summary 구성 (행동 + 빈도/유발/요구 포함)
  let summaryPrefix = '';
  if (header.actionCost) summaryPrefix = `[${header.actionCost}] `;
  if (body.frequency) summaryPrefix += `빈도: ${body.frequency}. `;
  if (body.trigger) summaryPrefix += `유발 조건: ${body.trigger}. `;
  if (body.requirements) summaryPrefix += `요구사항: ${body.requirements}. `;

  // actionCost 정규화: PlayerCore 표기 → state value
  // '반응'→'reaction', '1행동'→'1', '2행동'→'2', '3행동'→'3', '자유 행동'→'free'
  const ACTION_COST_MAP = {'반응':'reaction','1행동':'1','2행동':'2','3행동':'3','자유 행동':'free'};
  const actionCost = header.actionCost ? (ACTION_COST_MAP[header.actionCost] || null) : null;

  const feat = {
    name_ko: header.name_ko,
    name_en: header.name_en,
    feat_level: header.feat_level,
    prerequisites: body.prerequisites,
    traits: traits,
    category: header.category,
    actionCost: actionCost,
  };

  // summary: 행동 비용이 있으면 앞에 붙임
  if (header.actionCost) {
    feat.summary = `[${header.actionCost}] ${body.summary}`;
  } else {
    feat.summary = body.summary;
  }

  feat.desc = body.desc;

  // "특수: 여러 번 선택 가능" 패턴 → repeatable:true
  if (/여러\s*번\s*선택|최대\s*\d+회\s*선택/.test(body.desc)) {
    feat.repeatable = true;
  }

  feats.push(feat);
}

// ── 기존 feat_db.js를 eval로 로드 (양쪽 형식 호환: JSON 또는 JS literal) ──
const existingDb = fs.readFileSync('feat_db.js', 'utf8');
const existingByNameEn = {}; // name_en → 객체 (id, prereqs, desc 등 보존)
const existingArchetype = []; // 보존할 archetype 객체 그대로
const existingFeatures = []; // 보존할 feature(class_id 있는) 객체
const existingAutoAncestry = []; // 보존할 auto-acquisition 혈통/일반 자동 부여 항목 (v528~)

try {
  eval(existingDb);
  if (typeof FEAT_DB !== 'undefined') {
    for (const f of FEAT_DB) {
      if (!f || !f.name_en) continue;
      existingByNameEn[f.name_en] = f;
      if (f.category === 'archetype') existingArchetype.push(f);
      else if (f.cat === 'feature' && f.class_id) existingFeatures.push(f);
      else if (f.acquisition === 'auto' && f.source) existingAutoAncestry.push(f);
    }
  }
} catch(e) {
  console.error('  기존 feat_db.js 로드 실패:', e.message);
  process.exit(1);
}
const preservedPrereqGroups = Object.values(existingByNameEn).filter(f => f.prereq_group_id).length;
const preservedDescRefs = Object.values(existingByNameEn).filter(f => f.desc && /\{\{(spell|feat|condition|trait|action):/.test(f.desc)).length;
console.error(`  기존 항목 로드: ${Object.keys(existingByNameEn).length}개`);
console.error(`  prereq_group_id 보존 후보: ${preservedPrereqGroups}개`);
console.error(`  desc 템플릿 보존 후보: ${preservedDescRefs}개`);

// ── id 슬러그 생성 ──
function slugify(name_en) {
  return name_en.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 기존 id 풀 + 신규 슬러그 충돌 처리
const allIds = new Set();
for (const f of Object.values(existingByNameEn)) {
  if (f.id) allIds.add(f.id);
}

function assignId(feat) {
  // 기존 항목이면 기존 id 재사용
  const existing = existingByNameEn[feat.name_en];
  if (existing && existing.id) return existing.id;
  // 신규: name_en에서 슬러그 생성
  let base = slugify(feat.name_en);
  if (!allIds.has(base)) { allIds.add(base); return base; }
  // 1차 충돌: 카테고리 접미사
  const withCat = `${base}-${feat.category}`;
  if (!allIds.has(withCat)) { allIds.add(withCat); return withCat; }
  // 2차 충돌: 숫자 접미사
  for (let i = 2; i < 100; i++) {
    const withNum = `${base}-${i}`;
    if (!allIds.has(withNum)) { allIds.add(withNum); return withNum; }
  }
  // 폴백
  allIds.add(base + '-x');
  return base + '-x';
}

// ── 카테고리별 정렬 ──
const order = ['ancestry','general','skill','bard','champion','cleric','druid','fighter','ranger','rogue','wizard','witch'];
feats.sort((a, b) => {
  const oi = order.indexOf(a.category) - order.indexOf(b.category);
  if (oi !== 0) return oi;
  return a.feat_level - b.feat_level;
});

// 통계 출력 (stderr)
const stats = {};
feats.forEach(f => { stats[f.category] = (stats[f.category] || 0) + 1; });
console.error('=== 파싱 결과 ===');
for (const [cat, count] of Object.entries(stats)) {
  console.error(`  ${cat}: ${count}`);
}
console.error(`  합계: ${feats.length}`);

// ── 최종 객체 배열 빌드 ──
// 1) archetype: 기존 객체 그대로 유지 (id 포함)
// 2) feature(class_id): 기존 객체 그대로
// 3) parsed: id 부여 + prereqs/desc 템플릿 보존 (기존 항목과 머지)
const finalFeats = [];

// summary 첫 [N행동] 패턴 → actionCost 추출 (자동 파싱 안 되는 archetype/feature용)
const ACTION_COST_KO_TO_VAL = {'반응':'reaction','1행동':'1','2행동':'2','3행동':'3','자유 행동':'free','자유행동':'free'};
function extractActionCostFromSummary(summary) {
  if (!summary) return null;
  const m = summary.match(/^\[(반응|1행동|2행동|3행동|자유 행동|자유행동)\]/);
  return m ? (ACTION_COST_KO_TO_VAL[m[1]] || null) : null;
}

// archetype 먼저 (actionCost 자동 추출 — 누락된 경우만)
for (const ef of existingArchetype) {
  if (!ef.id) ef.id = assignId(ef);
  if (ef.actionCost === undefined) {
    const ac = extractActionCostFromSummary(ef.summary);
    if (ac) ef.actionCost = ac;
  }
  finalFeats.push(ef);
}
for (const ef of existingFeatures) {
  if (!ef.id) ef.id = assignId(ef);
  if (ef.actionCost === undefined) {
    const ac = extractActionCostFromSummary(ef.summary);
    if (ac) ef.actionCost = ac;
  }
  finalFeats.push(ef);
}
// v528~ auto-acquisition 혈통 자동 부여 (keen-eyes / plant-nourishment 등) — PlayerCore 파싱 대상 아님
for (const ef of existingAutoAncestry) {
  if (!ef.id) ef.id = assignId(ef);
  finalFeats.push(ef);
}

// parsed feats
for (const f of feats) {
  const existing = existingByNameEn[f.name_en];
  // auto-acquisition 항목은 이미 existingAutoAncestry로 푸시됨 — 중복 방지
  if (existing && existing.acquisition === 'auto' && existing.source) continue;
  // 출력 객체 — 키 순서: id, name_ko, name_en, feat_level, category, acquisition, source,
  //   prereq_group_id, auto_note, damage_note, effect_group_id, choice_id, choice_kind, choice_label, choice_filter,
  //   prerequisites, traits, actionCost, desc, summary, repeatable (v532~ Phase 3a)
  const obj = {};
  obj.id = assignId(f);
  obj.name_ko = f.name_ko;
  obj.name_en = f.name_en;
  obj.feat_level = f.feat_level;
  obj.category = f.category;
  // v528~ 신규 필드 (기본값 또는 기존값)
  obj.acquisition = (existing && existing.acquisition) || 'choice';
  obj.source = (existing && existing.source) || '';
  obj.prereq_group_id = (existing && existing.prereq_group_id) || '';
  // v532~ Phase 3a 신규 필드 (모두 옵셔널 — 있을 때만 보존)
  if (existing) {
    if (existing.auto_note) obj.auto_note = existing.auto_note;
    if (existing.damage_note) obj.damage_note = existing.damage_note;
    if (existing.effect_group_id) obj.effect_group_id = existing.effect_group_id;
    if (existing.choice_id) obj.choice_id = existing.choice_id;
    if (existing.choice_kind) obj.choice_kind = existing.choice_kind;
    if (existing.choice_label) obj.choice_label = existing.choice_label;
    if (existing.choice_filter) obj.choice_filter = existing.choice_filter;
  }
  if (f.prerequisites) obj.prerequisites = f.prerequisites;
  obj.traits = f.traits;
  if (f.actionCost) obj.actionCost = f.actionCost;
  // desc 템플릿 보존
  if (existing && existing.desc && /\{\{(spell|feat|condition|trait|action):/.test(existing.desc)) {
    obj.desc = existing.desc;
  } else {
    obj.desc = f.desc;
  }
  obj.summary = f.summary.length > 300 ? f.summary.substring(0, 297) + '...' : f.summary;
  if (f.repeatable) obj.repeatable = true;
  // 사용자 정의 추가 컬럼 보존 (명시 처리한 키 외 모든 키)
  if (existing) {
    const known = new Set([
      'id','name_ko','name_en','feat_level','category',
      'acquisition','source','prereq_group_id',
      'auto_note','damage_note','effect_group_id',
      'choice_id','choice_kind','choice_label','choice_filter',
      'prerequisites','traits','actionCost','desc','summary','repeatable',
      // legacy/internal — 새 obj에 옮기지 않음
      'effects','choice','choiceEffects','prereqs','cat','class_id',
    ]);
    for (const k of Object.keys(existing)) {
      if (!known.has(k)) obj[k] = existing[k];
    }
  }
  finalFeats.push(obj);
}

// ── JSON 출력 ──
let out = '// ═══════════════════════════════════════════════\n';
out += '//  FEAT_DB — 자동생성 (rebuild_feat_db.js)\n';
out += '//  ancestry/archetype: 기존 수동 데이터 유지\n';
out += '//  class/general/skill: PlayerCore.html 자동 파싱\n';
out += '// ═══════════════════════════════════════════════\n\n';
out += 'var FEAT_DB = ' + JSON.stringify(finalFeats, null, 2) + ';\n';

process.stdout.write(out);
