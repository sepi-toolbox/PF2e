// migrate_heritage_grantfeats_fk.js
// HERITAGE_DB.grantFeats: 한국어/영문 혼합 텍스트 → FEAT_DB.id
//   문자열: '위협적 노려보기 (Intimidating Glare)' → 'intimidating-glare'
//   객체: {name:'...', choice:'...'} → {id:'...', choice:'...'}
// 일회성. dev/cs_data.js를 in-place 갱신.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEV = path.resolve(__dirname, '..', 'dev');
const fpData = path.join(DEV, 'cs_data.js');
const fpFeat = path.join(DEV, 'feat_db.js');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(fpFeat, 'utf8').replace(/^const /gm, 'var '), ctx);
const F = ctx.FEAT_DB;

// PlayerCore에는 언급되지만 FEAT_DB에 미등재 (PC1 별도 정의 없음, 잔재 데이터)
const FEAT_PENDING = {
  '전투 등반가': 'combat-climber',
};

function resolveFeatId(textRaw) {
  const text = textRaw.trim();
  // "한글 (English)" 패턴
  const m = text.match(/^([^(]+?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const ko = m[1].trim(), en = m[2].trim();
    let f = F.find(x => x && x.name_en === en);
    if (!f) f = F.find(x => x && x.name_ko === ko);
    if (f) return f.id;
    if (FEAT_PENDING[ko]) return FEAT_PENDING[ko];
  } else {
    const f = F.find(x => x && x.name_ko === text);
    if (f) return f.id;
    if (FEAT_PENDING[text]) return FEAT_PENDING[text];
  }
  return null;
}

const src = fs.readFileSync(fpData, 'utf8');

// HERITAGE_DB 블록 내의 grantFeats 배열만 정규식으로 교체
// grantFeats:[ ... ] 한 줄 처리 (원본은 단일 라인)
const PENDING = [];
const updated = src.replace(/grantFeats\s*:\s*\[([^\]]*)\]/g, (match, body) => {
  // body 안의 항목들: 'string' 또는 {name:'...',choice:'...'}
  const items = [];
  const re = /(\{[^}]*\}|'[^']*'|"[^"]*")/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const tok = m[1];
    if (tok.startsWith('{')) {
      // 객체: name, choice 추출
      const nameMatch = tok.match(/name\s*:\s*['"]([^'"]+)['"]/);
      const choiceMatch = tok.match(/choice\s*:\s*['"]([^'"]+)['"]/);
      if (!nameMatch) { console.error('객체 파싱 실패:', tok); process.exit(1); }
      const id = resolveFeatId(nameMatch[1]);
      if (!id) { console.error('feat 매칭 실패:', nameMatch[1]); process.exit(1); }
      if (Object.values(FEAT_PENDING).includes(id)) PENDING.push(nameMatch[1].trim()+' → '+id);
      const choice = choiceMatch ? `,choice:'${choiceMatch[1]}'` : '';
      items.push(`{id:'${id}'${choice}}`);
    } else {
      const txt = tok.slice(1, -1);
      const id = resolveFeatId(txt);
      if (!id) { console.error('feat 매칭 실패:', txt); process.exit(1); }
      if (Object.values(FEAT_PENDING).includes(id)) PENDING.push(txt.trim()+' → '+id);
      items.push(`'${id}'`);
    }
  }
  console.log(`  ${items.join(', ')}`);
  return `grantFeats:[${items.join(',')}]`;
});

if (src === updated) {
  console.log('변경 없음 — 이미 정규화된 상태일 수 있음');
  process.exit(0);
}

fs.writeFileSync(fpData, updated, 'utf8');
console.log('\n✓ cs_data.js HERITAGE_DB grantFeats 정규화 완료');
if (PENDING.length) {
  console.log('\n※ FEAT_DB 미등재 (슬러그만 부여, 향후 등재 시 자동 매칭):');
  PENDING.forEach(p => console.log('  -', p));
}
