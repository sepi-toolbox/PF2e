// alert/confirm/prompt 등 다이얼로그 문자열에서 정적 한글 라인 추출 → 누락분 산출
import fs from 'fs';
const DEV = '/tmp/PF2e-publish/dev';
const FILES = ['cs_ui.js','cs_modal.js','cs_calc.js','cs_save.js','cs_session.js','cs_data.js','cs_dice.js','cs_feat_effects.js','cs_map.js'];
const loc = JSON.parse(fs.readFileSync(`${DEV}/data/locale.json`, 'utf8'));
const KO = /[가-힣]/;
const set = new Set();
for (const f of FILES) {
  const s = fs.readFileSync(`${DEV}/${f}`, 'utf8');
  // alert/confirm/prompt( <quote> ... <quote>  (첫 인자만)
  const re = /(?:alert|confirm|prompt)\s*\(\s*([`'"])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let m;
  while ((m = re.exec(s))) {
    let raw = m[2];
    if (!KO.test(raw)) continue;
    raw = raw.replace(/\\n/g, '\n').replace(/\\(.)/g, '$1');
    for (let line of raw.split('\n')) {
      line = line.trim();
      if (!line || !KO.test(line)) continue;
      if (/\$\{/.test(line)) {                       // 보간 라인 → ${} 앞 정적 헤드만
        const head = line.split('${')[0].trim();
        if (head && KO.test(head) && head.length >= 2 && !/[（(]$/.test(head)) set.add(head);
        continue;
      }
      if (line.length > 60) continue;
      set.add(line);
    }
  }
}
const all = [...set].sort((a, b) => a.localeCompare(b, 'ko'));
const missing = all.filter(k => loc[k] == null);
fs.writeFileSync('/tmp/dlg_missing.json', JSON.stringify(missing, null, 1));
console.log(`정적 다이얼로그 distinct ${all.length} | 기존 ${all.length - missing.length} | 누락 ${missing.length}`);
console.log('\n[누락 — 번역 필요]');
missing.forEach((k, i) => console.log(`${i + 1}. ${k}`));
