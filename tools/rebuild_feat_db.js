#!/usr/bin/env node
/**
 * PlayerCore.html에서 재주(feats)를 자동 파싱하여 feat_db.js 형식으로 출력.
 * 혈통 재주는 기존 feat_db.js에 이미 있으므로 class/general/skill만 생성.
 *
 * 사용법: node tools/rebuild_feat_db.js > feat_db_new.js
 */

const fs = require('fs');
const html = fs.readFileSync('PlayerCore.html', 'utf8');

// ── 카테고리 매핑 ──
const CLASS_MAP = {
  '바드':'bard', '챔피언':'champion', '클레릭':'cleric', '드루이드':'druid',
  '파이터':'fighter', '레인저':'ranger', '로그':'rogue', '위저드':'wizard', '위치':'witch',
  '건터':'gunslinger', '인벤터':'inventor', '매거스':'magus', '스워시버클러':'swashbuckler',
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

  // 카테고리 결정
  let category = null;
  let mainTrait = bracketContent;

  if (bracketContent === '일반') {
    category = 'general';
    mainTrait = '일반';
  } else if (bracketContent === '일반 기술') {
    category = 'skill';
    mainTrait = '일반';
  } else {
    // 클래스 재주
    const parts = bracketContent.split(/[,\s]+/);
    for (const p of parts) {
      if (CLASS_MAP[p]) {
        category = CLASS_MAP[p];
        break;
      }
    }
    if (!category) {
      // 혈통 재주 등 — 스킵
      return null;
    }
    mainTrait = bracketContent;
  }

  return { name_ko, name_en, feat_level, category, mainTrait, actionCost, extraTraits };
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
  const emMatch = block.match(/<p>\s*<em>(.*?)<\/em>/);
  const traitsLine = emMatch ? emMatch[1].trim() : '';

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

  // 전체 desc: 모든 <p> 내용 합침 (em 특성줄 제외)
  const pTags = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)];
  let descParts = [];
  for (const m of pTags) {
    let content = m[1].trim();
    // 첫 번째 p가 특성만 있는 경우 스킵
    if (content.match(/^<em>[^<]*<\/em>$/)) continue;
    // 특성+전제조건 합쳐진 경우: em 줄 제거하고 나머지 유지
    content = content.replace(/^<em>[^<]*<\/em>\s*(?:<br\s*\/?>)?/i, '').trim();
    if (content) descParts.push(content);
  }
  const desc = descParts.join('<br>');

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
  if (!['bard','champion','cleric','druid','fighter','ranger','rogue','wizard','witch','general','skill'].includes(header.category)) continue;

  const body = extractBody(h3Idx);

  // traits 배열 구성
  const traits = [];
  if (body.traitsLine) {
    body.traitsLine.replace(/<[^>]*>/g, '').split(/[,，]/).map(t => t.trim()).filter(Boolean).forEach(t => {
      if (!traits.includes(t)) traits.push(t);
    });
  }
  // extraTraits from header
  header.extraTraits.forEach(t => {
    if (t && !traits.includes(t)) traits.push(t);
  });

  // summary 구성 (행동 + 빈도/유발/요구 포함)
  let summaryPrefix = '';
  if (header.actionCost) summaryPrefix = `[${header.actionCost}] `;
  if (body.frequency) summaryPrefix += `빈도: ${body.frequency}. `;
  if (body.trigger) summaryPrefix += `유발 조건: ${body.trigger}. `;
  if (body.requirements) summaryPrefix += `요구사항: ${body.requirements}. `;

  const feat = {
    name_ko: header.name_ko,
    name_en: header.name_en,
    feat_level: header.feat_level,
    prerequisites: body.prerequisites,
    traits: traits,
    category: header.category,
  };

  // summary: 행동 비용이 있으면 앞에 붙임
  if (header.actionCost) {
    feat.summary = `[${header.actionCost}] ${body.summary}`;
  } else {
    feat.summary = body.summary;
  }

  feat.desc = body.desc;

  feats.push(feat);
}

// ── 기존 feat_db.js에서 혈통/아키타입 재주 읽기 ──
const existingDb = fs.readFileSync('feat_db.js', 'utf8');
// ancestry와 archetype 재주 + class_id가 있는 feature 항목 추출
const existingFeats = [];
const existingRe = /\{([^}]+)\}/g;
let em;
while ((em = existingRe.exec(existingDb)) !== null) {
  const inner = em[1];
  const catMatch = inner.match(/category:\s*'([^']+)'/);
  if (!catMatch) continue;
  const cat = catMatch[1];
  // 기존 ancestry, archetype, feature 유지
  if (cat === 'ancestry' || cat === 'archetype') {
    existingFeats.push(em[0]);
  }
  // class_id가 있는 feature (클래스 요소) 유지
  if (inner.includes('class_id:') && inner.includes("cat:'feature'")) {
    existingFeats.push(em[0]);
  }
}

// ── 출력 ──
// 카테고리별 정렬
const order = ['general','skill','bard','champion','cleric','druid','fighter','ranger','rogue','wizard','witch'];
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

// JS 출력
function escStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
}

let out = '// ═══════════════════════════════════════════════\n';
out += '//  FEAT_DB — 자동생성 (rebuild_feat_db.js)\n';
out += '//  ancestry/archetype: 기존 수동 데이터 유지\n';
out += '//  class/general/skill: PlayerCore.html 자동 파싱\n';
out += '// ═══════════════════════════════════════════════\n\n';
out += 'var FEAT_DB = [\n';

// 먼저 기존 ancestry/archetype 출력
out += '  // ── 혈통 재주 (기존) ──\n';
for (const ef of existingFeats) {
  out += '  ' + ef + ',\n';
}

// 새 파싱 재주 출력
let lastCat = '';
for (const f of feats) {
  if (f.category !== lastCat) {
    const label = f.category === 'general' ? '일반 재주' :
                  f.category === 'skill' ? '기술 재주' :
                  `${f.category} 클래스 재주`;
    out += `\n  // ── ${label} ──\n`;
    lastCat = f.category;
  }
  const parts = [];
  parts.push(`name_ko:'${escStr(f.name_ko)}'`);
  parts.push(`name_en:'${escStr(f.name_en)}'`);
  parts.push(`feat_level:${f.feat_level}`);
  if (f.prerequisites) parts.push(`prerequisites:'${escStr(f.prerequisites)}'`);
  parts.push(`traits:[${f.traits.map(t => `'${escStr(t)}'`).join(',')}]`);
  parts.push(`category:'${f.category}'`);
  // summary 200자 제한
  const sum = f.summary.length > 300 ? f.summary.substring(0, 297) + '...' : f.summary;
  parts.push(`summary:'${escStr(sum)}'`);
  parts.push(`desc:'${escStr(f.desc)}'`);
  out += `  {${parts.join(', ')}},\n`;
}

out += '];\n';

process.stdout.write(out);
