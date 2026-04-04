#!/usr/bin/env node
// PlayerCore.html에서 SPELL_DB 재생성
// Usage: node rebuild_spell_db.js > ../SPELL_DB.js

const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../PlayerCore.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// 기존 SPELL_DB에서 보존할 데이터
const oldDbPath = path.resolve(__dirname, '../SPELL_DB.js');
const oldDbText = fs.readFileSync(oldDbPath, 'utf-8');
let OLD_DB = [];
try {
  const m = oldDbText.match(/const SPELL_DB\s*=\s*(\[[\s\S]*\]);/);
  if (m) OLD_DB = eval(m[1]);
} catch(e) {}
const oldMap = {};
OLD_DB.forEach(sp => { oldMap[sp.name_en] = sp; });

// <div class="note">...</div> 블록 추출
// 멀티라인이므로 [\s\S]를 사용하되 다음 </div>까지
const blocks = [];
let pos = 0;
while (true) {
  const start = html.indexOf('<div class="note">', pos);
  if (start < 0) break;
  const end = html.indexOf('</div>', start);
  if (end < 0) break;
  blocks.push(html.slice(start, end + 6));
  pos = end + 6;
}

const spells = [];

blocks.forEach(block => {
  // 헤더 파싱: <strong>이름 <span class="en">Name</span></strong> [행동] — 랭크
  const headerM = block.match(/<strong>(.+?)<\/strong>\s*\[(.+?)\]\s*—\s*(.+?)<br>/);
  if (!headerM) return;

  const nameM = headerM[1].match(/^(.+?)\s*<span class="en">(.+?)<\/span>/);
  if (!nameM) return;
  const name_ko = nameM[1].trim();
  const name_en = nameM[2].trim();
  const actions = headerM[2].trim();
  const rankRaw = headerM[3].trim();

  // 랭크
  let rank = 1, is_cantrip = false, is_focus = false;
  const rm1 = rankRaw.match(/캔트립\s*(\d+)/);
  const rm2 = rankRaw.match(/주문\s*(\d+)/);
  const rm3 = rankRaw.match(/집중\s*(\d+)/);
  if (rm1) { rank = parseInt(rm1[1]); is_cantrip = true; }
  else if (rm2) { rank = parseInt(rm2[1]); }
  else if (rm3) { rank = parseInt(rm3[1]); is_focus = true; }

  // 헤더 이후 본문
  const bodyStart = block.indexOf('<br>', block.indexOf('—')) + 4;
  const bodyEnd = block.indexOf('</div>');
  let body = block.slice(bodyStart, bodyEnd).trim();

  // 라인 분리
  const lines = body.split('<br>').map(l => l.trim()).filter(l => l);

  // 메타 필드 추출
  let traits = [], traditions = [];
  const meta = {};
  const descLines = [];
  const metaKeywords = ['특질','특성','전통','사거리','영역','대상','방어','지속 시간','지속시간','요구사항','빈도','유발 조건','비용','시전'];

  lines.forEach(line => {
    // 이 줄이 메타 필드인지 (파이프로 여러 필드 연결 가능)
    const parts = line.split('|').map(p => p.trim());
    let allMeta = true;
    const parsedFields = [];
    parts.forEach(part => {
      const fm = part.match(/^<?\/?strong>?\s*<strong>(.+?):?\s*<\/strong>\s*(.+)/);
      if (fm) {
        parsedFields.push({key: fm[1].trim().replace(/:$/, ''), val: fm[2].replace(/<[^>]+>/g, '').trim()});
      } else {
        // 줄 시작이 <strong>KEY:</strong>
        const fm2 = part.match(/^<strong>(.+?):?\s*<\/strong>\s*(.+)/);
        if (fm2) {
          parsedFields.push({key: fm2[1].trim().replace(/:$/, ''), val: fm2[2].replace(/<[^>]+>/g, '').trim()});
        } else {
          allMeta = false;
        }
      }
    });

    if (allMeta && parsedFields.length > 0 && parsedFields.every(f => metaKeywords.includes(f.key))) {
      parsedFields.forEach(f => { meta[f.key] = f.val; });
    } else {
      descLines.push(line);
    }
  });

  // 특성 ('특질' 또는 '특성' 키)
  const rawTraits = meta['특성'] || meta['특질'] || '';
  if (rawTraits) {
    traits = rawTraits.split(',').map(t => t.trim()).filter(t => t && t !== '캔트립' && t !== '집중');
  }
  // 전통
  if (meta['전통']) {
    const tradMap = {'비전':'arcane','신성':'divine','비학':'occult','오컬트':'occult','원시':'primal'};
    traditions = meta['전통'].split(',').map(t => tradMap[t.trim()] || t.trim()).filter(t => t);
  }

  // desc 구축: 메타 헤더 + 본문
  let descMeta = '';
  const showKeys = ['사거리','영역','대상','방어','지속 시간','지속시간','요구사항','빈도','유발 조건','비용','시전'];
  showKeys.forEach(k => {
    if (meta[k]) descMeta += `<strong>${k}:</strong> ${meta[k]}<br>`;
  });
  const descBody = descLines.join('<br>');
  const desc = descMeta + descBody;

  // summary
  const plainDesc = descBody.replace(/<[^>]+>/g, '').trim();
  const summary = plainDesc.length > 200 ? plainDesc.slice(0, 197) + '...' : plainDesc;

  // 기존 DB 보존
  const old = oldMap[name_en] || {};
  if (old.is_focus) is_focus = true;
  if (traditions.length === 0 && old.traditions && old.traditions.length > 0) traditions = old.traditions;

  const spell = {
    name_ko, name_en, rank, is_cantrip, is_focus,
    traditions, actions, traits,
  };
  if (meta['사거리']) spell.range = meta['사거리'];
  if (meta['영역']) spell.area = meta['영역'];
  if (meta['대상']) spell.target = meta['대상'];
  if (meta['방어']) spell.defense = meta['방어'];
  if (meta['지속 시간'] || meta['지속시간']) spell.duration = meta['지속 시간'] || meta['지속시간'];
  if (meta['빈도']) spell.frequency = meta['빈도'];
  if (meta['유발 조건']) spell.trigger = meta['유발 조건'];
  if (meta['요구사항']) spell.requirements = meta['요구사항'];
  if (meta['비용']) spell.cost = meta['비용'];
  if (meta['시전']) spell.castTime = meta['시전'];
  spell.summary = summary;
  spell.desc = desc;

  spells.push(spell);
});

// 정렬
spells.sort((a,b) => {
  if (a.is_cantrip !== b.is_cantrip) return a.is_cantrip ? -1 : 1;
  if (a.is_focus !== b.is_focus) return a.is_focus ? -1 : 1;
  if (a.rank !== b.rank) return a.rank - b.rank;
  return a.name_en.localeCompare(b.name_en);
});

// 출력
function toJs(sp) {
  const p = [];
  p.push(`name_ko: ${JSON.stringify(sp.name_ko)}`);
  p.push(`name_en: ${JSON.stringify(sp.name_en)}`);
  p.push(`rank: ${sp.rank}`);
  p.push(`is_cantrip: ${sp.is_cantrip}`);
  p.push(`is_focus: ${sp.is_focus}`);
  p.push(`traditions: ${JSON.stringify(sp.traditions)}`);
  p.push(`actions: ${JSON.stringify(sp.actions)}`);
  p.push(`traits: ${JSON.stringify(sp.traits)}`);
  ['range','area','target','defense','duration','frequency','trigger','requirements','cost','castTime'].forEach(k => {
    if (sp[k]) p.push(`${k}: ${JSON.stringify(sp[k])}`);
  });
  p.push(`summary: ${JSON.stringify(sp.summary)}`);
  p.push(`desc: ${JSON.stringify(sp.desc)}`);
  return `  { ${p.join(',\n    ')} }`;
}

let out = `// Pathfinder 2e Player Core — 주문 데이터베이스
// PlayerCore.html 7장에서 자동 생성
// Generated: ${new Date().toISOString().split('T')[0]}
// Total: ${spells.length} spells

const SPELL_DB = [\n`;

let curSection = '';
spells.forEach(sp => {
  let section = sp.is_cantrip ? 'CANTRIPS' : sp.is_focus ? 'FOCUS' : `RANK ${sp.rank}`;
  if (section !== curSection) {
    out += `\n  // ─── ${section} ${'─'.repeat(50-section.length)}\n\n`;
    curSection = section;
  }
  out += toJs(sp) + ',\n\n';
});

out += '];\n';
process.stdout.write(out);
console.error(`Done: ${spells.length} spells`);
