// 운영/데브 세이브 격리 마이그레이션 (2026-06-30) — dev/ 에서 실행.
// /dev/ 경로면 별도 Firestore 컬렉션(characters_dev/sessions_dev) + dev_ localStorage 네임스페이스 사용.
// 환경 감지 = location.pathname.includes('/dev/'). 운영(루트)=기존 경로 그대로(데이터 보존).
import fs from 'fs';

const HELPER = `
// ── 운영/데브 세이브 격리: /dev/ 경로면 별도 컬렉션·localStorage 네임스페이스 ──
window.PF_ENV = location.pathname.includes('/dev/') ? 'dev' : 'prod';
window.PF_COL = { characters: PF_ENV === 'dev' ? 'characters_dev' : 'characters',
                  sessions:   PF_ENV === 'dev' ? 'sessions_dev'   : 'sessions' };
window.PF_LS  = function(k){ return (PF_ENV === 'dev' ? 'dev_' : '') + k; };`;

const ANCHOR    = 'const db = firebase.firestore();';
const htmlFiles = ['index.html', 'Map.html', 'GMSheet.html'];
const colFiles  = ['index.html', 'Map.html', 'GMSheet.html', 'cs_session.js', 'cs_modal.js', 'cs_save.js', 'cs_map.js'];
const lsFiles   = ['index.html', 'cs_session.js'];
const LS_KEYS   = ['pf2e_lastSlot', 'pf2e_sessionId', 'pf2e_sessionRole'];  // 저장 상태 키(쿠키 cosmetic 제외)

// 1) 헬퍼 주입 (firebase.firestore() 직후, 1회)
for (const f of htmlFiles) {
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes('window.PF_COL')) { console.log(`  ${f}: 헬퍼 이미 존재, skip`); continue; }
  if (!s.includes(ANCHOR)) { console.error(`  ✗ ${f}: anchor 없음`); continue; }
  s = s.replace(ANCHOR, ANCHOR + '\n' + HELPER);
  fs.writeFileSync(f, s);
  console.log(`  ${f}: 헬퍼 주입`);
}

// 2) 컬렉션 네임스페이스
let colN = 0;
for (const f of colFiles) {
  let s = fs.readFileSync(f, 'utf8'); const b = s;
  s = s.replace(/\.collection\('characters'\)/g, '.collection(PF_COL.characters)');
  s = s.replace(/\.collection\('sessions'\)/g, '.collection(PF_COL.sessions)');
  if (s !== b) {
    const n = (b.match(/\.collection\('(characters|sessions)'\)/g) || []).length;
    fs.writeFileSync(f, s); colN += n; console.log(`  ${f}: collection ${n}곳`);
  }
}

// 3) localStorage 네임스페이스 (저장 상태 키)
for (const f of lsFiles) {
  let s = fs.readFileSync(f, 'utf8'); const b = s;
  for (const k of LS_KEYS) s = s.replace(new RegExp(`'${k}'`, 'g'), `PF_LS('${k}')`);
  if (s !== b) { fs.writeFileSync(f, s); console.log(`  ${f}: localStorage 키 래핑`); }
}

console.log(`\n✓ env split 완료 — 헬퍼 3파일 + collection ${colN}곳 + localStorage ${LS_KEYS.join('/')}`);
