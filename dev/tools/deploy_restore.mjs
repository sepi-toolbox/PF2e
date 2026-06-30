// 운영 마커 복원 — 저장소 루트에서 실행(/pf2e-deploy 가 dev→루트 복사 직후 호출).
// dev 표시("(dev)" 텍스트 + 오렌지 #ff8c42)를 운영용으로 되돌린다.
//   "Pathforge (dev)" → "Pathforge",  "Pathforge - GM (dev)" → "Pathforge - GM"
//   모드선택 타이틀의 (dev) 스팬 제거,  #ff8c42(오렌지) → var(--gold-light)(운영 골드)
import fs from 'fs';

for (const f of ['index.html', 'GMSheet.html']) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  // 모드선택 타이틀: "Pathforge <span ...color:#ff8c42;>(dev)</span>" → "Pathforge"
  s = s.replace(/ <span style="font-size:14px;color:#ff8c42;">\(dev\)<\/span>/g, '');
  // 일반 " (dev)" 텍스트 제거 (title·brand·footer·h1)
  s = s.split(' (dev)').join('');
  // 잔여 오렌지 → 운영 골드
  s = s.split('#ff8c42').join('var(--gold-light)');
  fs.writeFileSync(f, s);
  console.log(`  복원: ${f}`);
}
console.log('✓ 운영 마커 복원 완료 (검증: grep "(dev)\\|#ff8c42" 비어야 함)');
