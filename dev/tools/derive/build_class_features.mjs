#!/usr/bin/env node
/* build_class_features.mjs — 클래스특성을 별도 데이터 테이블로 파생
 * 소스: data/store/feats.json(category=classfeature 826) — 단일소스(store). name_ko/_desc_ko 직접 사용.
 *   클래스 = traits.value의 클래스 slug. 서브클래스 = otherTags의 `<class>-<type>` 태그로 식별(표시용 컬럼).
 *   설명(desc) = store의 _desc_ko(재번역 한글) → 「클래스특성」 탭에서 바로 편집/열람.
 * 산출: data/derived/class_features.json  (⚠ subclasses.json은 build_subclasses.mjs 소유 — 여기서 쓰지 않음)
 * 실행: cd dev && node tools/derive/build_class_features.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));
const asArray = raw => Array.isArray(raw) ? raw : (raw.items || Object.values(raw));

const feats = asArray(load('data/store/feats.json'));
const classes = asArray(load('data/store/classes.json'));
const classSlugs = new Set(classes.map(c => c.system.slug));

// 클래스가 레벨 몇에 이 특성을 부여하는지 (class.items 역인덱스)
const grantLevel = {};   // slug → {class: level}
for (const c of classes) {
  const cs = c.system.slug;
  for (const it of Object.values(c.system.items || {})) {
    const fid = (it.uuid || '').split('.').pop();
    const f = feats.find(x => x._id === fid);
    const sl = f ? f.system.slug : null;
    if (sl) (grantLevel[sl] = grantLevel[sl] || {})[cs] = it.level | 0;
  }
}

const cfeatures = [];
for (const f of feats) {
  const s = f.system; if (s.category !== 'classfeature') continue;
  const slug = s.slug;
  const cls = (s.traits?.value || []).find(t => classSlugs.has(t)) || '';
  const tags = s.traits?.otherTags || [];
  const subTag = tags.find(t => cls && t.startsWith(cls + '-')) || tags.find(t => [...classSlugs].some(c => t.startsWith(c + '-')));
  const isSub = !!subTag;
  const subType = subTag ? subTag.replace(new RegExp('^(' + (cls || subTag.split('-')[0]) + ')-'), '') : '';
  const grants = (s.rules || []).filter(r => r.key === 'GrantItem').length;
  cfeatures.push({
    slug, class: cls, name_en: f.name_en || f.name, name_ko: f.name_ko || f.name,
    level: (grantLevel[slug] && cls && grantLevel[slug][cls] != null) ? grantLevel[slug][cls] : (typeof s.level === 'object' ? s.level?.value : s.level) ?? '',
    desc: f._desc_ko || '',   // 설명 단일소스 = store _desc_ko(재번역). 「클래스특성」 탭에서 편집(override→feats).
    is_subclass: isSub ? '✓' : '', subclass_type: subType, tag: subTag || '', grants, rules_n: (s.rules || []).length,
  });
}
// 혈통 마법(Blood Magic) = 혈통별 고유 클래스 특성. FVTT엔 별도 classfeature 아이템 없음(혈통 재주 desc에 프로즈로만 존재)
//   → 우리 레지스트리에 slug 대상 신설(소스=bloodlines.json blood_magic 파생). 서브클래스 features[]가 이 slug 참조.
//   slug = blood-magic-<혈통>(bloodline- 접두 제거). FVTT effect-*-blood-magic(효과 계층)은 사용 안 함.
const bloodlines = load('data/derived/bloodlines.json').rows;
for (const bl of bloodlines) {
  const bm = bl.blood_magic;
  if (!bm || !(bm.text_ko || bm.text)) continue;
  const suffix = bl.slug.replace(/^bloodline-/, '');
  cfeatures.push({
    slug: `blood-magic-${suffix}`, class: 'sorcerer',
    name_en: 'Blood Magic' + (bm.name_en ? `: ${bm.name_en}` : ''),
    name_ko: '혈통 마법' + (bm.name_ko ? `: ${bm.name_ko}` : ''),
    level: 1,
    desc: `<p>${bm.text_ko || bm.text}</p><p>혈통 주문(집중 점수)이나 마법적 재능 주문(주문 슬롯)을 시전할 때 발동합니다.</p>`,
    is_subclass: '', subclass_type: '', tag: 'sorcerer-blood-magic', grants: 0, rules_n: 0,
  });
}

// 서브클래스 features[](표시 로스터) 중 우리 레지스트리(feats/spells/classfeatures)로 해소 안 되는 slug =
//   FVTT에 개별 아이템이 없는 파생 특성 → 그 features[] 항목 자체(name/desc/lv)로 클래스특성 엔티티 신설(혈통 마법과 동일 원칙).
//   현재 대상: 후원자의 선물 6종(전통·주술별, patrons-gift-<후원자>) + 순수 숙련 특성 3종(전사 뮤즈·전쟁사제 교리).
//   소스 = 큐레이션 파일(subclasses_curated.json/cleric_doctrines.json)의 features[] — build_subclasses/doctrine 이전 원본.
const spells = asArray(load('data/store/spells.json'));
const realReg = new Set([
  ...feats.map(f => f.system.slug),
  ...spells.map(s => s.system.slug),
  ...cfeatures.map(r => r.slug),   // 실제 classfeature + 위에서 신설한 혈통 마법
]);
const curatedSubs = load('data/derived/subclasses_curated.json').rows;
const doctrineRaw = load('data/derived/cleric_doctrines.json');
const doctrineSubs = doctrineRaw.rows || doctrineRaw;
const seenSyn = new Set();
const synthLog = [];
for (const sub of [...curatedSubs, ...doctrineSubs]) {
  const cls = sub.class_id || sub.class || '';
  for (const f of (sub.features || [])) {
    const sl = f.slug;
    if (!sl || realReg.has(sl) || seenSyn.has(sl)) continue;
    seenSyn.add(sl); realReg.add(sl);
    cfeatures.push({
      slug: sl, class: cls,
      name_en: f.name_en || f.name_ko || sl,
      name_ko: f.name_ko || f.name_en || sl,
      level: f.lv ?? '',
      desc: f.desc ? (/^\s*</.test(f.desc) ? f.desc : `<p>${f.desc}</p>`) : '',
      is_subclass: '', subclass_type: '', tag: cls ? `${cls}-subclass-feature` : '', grants: 0, rules_n: 0,
    });
    synthLog.push(sl);
  }
}
if (synthLog.length) console.log(`  ↳ 서브클래스 파생특성 엔티티 신설 ${synthLog.length}: ${synthLog.join(', ')}`);

cfeatures.sort((a, b) => (a.class || '~').localeCompare(b.class || '~') || (a.level || 0) - (b.level || 0) || a.slug.localeCompare(b.slug));

const note1 = 'store feats(category=classfeature) + 혈통 마법 18종(bloodlines.json 파생) + 서브클래스 파생특성(후원자의 선물·순수 숙련 등, 레지스트리 미해소 features[] slug를 큐레이션 원본으로 신설). class=traits, level=클래스 부여레벨, desc=_desc_ko(재번역), 서브클래스=otherTags 태그(표시용)';
fs.writeFileSync(path.join(DEV, 'data/derived/class_features.json'), JSON.stringify({ rows: cfeatures, note: note1 }, null, 1) + '\n');
console.log(`✔ class_features.json — 클래스특성 ${cfeatures.length} (desc 포함)`);
