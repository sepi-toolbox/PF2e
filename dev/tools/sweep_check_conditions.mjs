// 2026-07-04 용어 스윕: ①체크(Check)→판정 ②상태이상 개명 잔여 평문(조이기/억제/멍청함/넘어뜨려짐 — '상태' 앵커)
// @link/@UUID 참조는 런타임 정본명 해소라 대상 아님(평문만). 기본 dry-run, --apply 적용.
// 제외(영문 대조로 확정된 비굴림 용례): "어깨로 체크"(Shoulder Check=몸통 박치기), 체크 표시/박스/리스트/무늬
import fs from 'fs'; import path from 'path';
const DEV = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const APPLY = process.argv.includes('--apply');
const files = [];
for (const d of ['data/overlay', 'data/creatures', 'data/derived', 'data/override']) {
  for (const f of fs.readdirSync(path.join(DEV, d))) if (f.endsWith('.json')) files.push(path.join(DEV, d, f));
}
for (const f of ['cs_data.js', 'class_features_db.js', 'equipment_db.js']) files.push(path.join(DEV, f));

const MASKS = [/어깨로 체크/g, /체크 표시/g, /체크박스/g, /체크리스트/g, /체크무늬/g];
const COND = { '조이기': '붙잡힘', '억제': '포박', '멍청함': '멍함', '넘어뜨려짐': '넘어짐' };
const cnt = {}; const tick = t => { cnt[t] = (cnt[t] || 0) + 1; };
const samp = {}; const rec = (t, str, idx, m) => { tick(t); (samp[t] = samp[t] || []); if (samp[t].length < 5) samp[t].push('…' + str.slice(Math.max(0, idx - 20), idx + m.length + 20).replace(/\s+/g, ' ') + '…'); };

function transform(s) {
  let a = s;
  // 0) 제외 용례 마스킹
  const masked = [];
  MASKS.forEach((re, i) => { a = a.replace(re, m => { masked.push(m); return `${masked.length - 1}`; }); });
  // 1) 체크 → 판정 (전량 — 데이터 전수 표본에서 비굴림 용례는 마스크 목록뿐)
  a = a.replace(/체크/g, (m, idx, str) => { rec('체크→판정', String(str), idx, m); return '판정'; });
  // 1b) flat check 표기 통일: 런타임 정본(cs_pf2e _CHECK_KO flat='단순')에 맞춰 플랫→단순
  a = a.replace(/플랫 판정/g, (m, idx, str) => { rec('플랫→단순 판정', String(str), idx, m); return '단순 판정'; });
  // 2) 상태이상 잔여 평문: 'X (수치) 상태' 앵커
  a = a.replace(/(조이기|억제|멍청함|넘어뜨려짐)(\s*(?:\d+\s*)?상태)/g, (m, t, g, idx, str) => { rec(t + '→' + COND[t] + '(상태)', String(str), idx, m); return COND[t] + g; });
  // 3) 멍청함 N (수치 동반 = Stupefied 확정)
  a = a.replace(/멍청함(\s*\d)/g, (m, g, idx, str) => { rec('멍청함N→멍함N', String(str), idx, m); return '멍함' + g; });
  // 4) 넘어뜨려짐 = 조어라 일반어 용례 없음(표본 전수 조건) → 전량
  a = a.replace(/넘어뜨려짐/g, (m, idx, str) => { rec('넘어뜨려짐→넘어짐', String(str), idx, m); return '넘어짐'; });
  // 5) 조사 정정: 체크(모음 끝)→판정(받침 끝) 치환 여파 (판정를→판정을 등)
  for (const [bad, good] of [['판정를', '판정을'], ['판정가', '판정이'], ['판정는', '판정은'], ['판정와', '판정과'], ['판정로', '판정으로']]) {
    a = a.replace(new RegExp(bad, 'g'), (m, idx, str) => { rec('조사정정(' + bad + ')', String(str), idx, m); return good; });
  }
  // 마스크 복원
  a = a.replace(/(\d+)/g, (m, i) => masked[+i]);
  return a;
}
for (const fp of files) {
  const raw = fs.readFileSync(fp, 'utf8');
  const out = transform(raw);
  if (out !== raw) {
    if (fp.endsWith('.json')) { try { JSON.parse(out); } catch (e) { console.error('✗ JSON 손상 위험, 스킵:', fp, e.message); continue; } }
    if (APPLY) fs.writeFileSync(fp, out);
  }
}
console.log('치환:', JSON.stringify(cnt, null, 1), APPLY ? '[APPLIED]' : '[DRY-RUN]');
for (const t of Object.keys(samp)) { console.log('\n=== ' + t + ' ==='); samp[t].forEach(x => console.log(' ', x)); }
