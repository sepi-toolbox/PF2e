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
cfeatures.sort((a, b) => (a.class || '~').localeCompare(b.class || '~') || (a.level || 0) - (b.level || 0) || a.slug.localeCompare(b.slug));

const note1 = 'store feats(category=classfeature). class=traits, level=클래스 부여레벨, desc=_desc_ko(재번역), 서브클래스=otherTags 태그(표시용)';
fs.writeFileSync(path.join(DEV, 'data/derived/class_features.json'), JSON.stringify({ rows: cfeatures, note: note1 }, null, 1) + '\n');
console.log(`✔ class_features.json — 클래스특성 ${cfeatures.length} (desc 포함)`);
