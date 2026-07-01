#!/usr/bin/env node
/* build_class_features.mjs — 클래스특성 + 서브클래스를 별도 데이터 테이블로 파생
 * 소스(FVTT): feats.base(category=classfeature 826). 클래스 = traits.value의 클래스 slug.
 *   서브클래스 = otherTags의 `<class>-<type>` 태그(bard-muse/sorcerer-bloodline 등 23종)로 식별.
 * 산출: data/derived/class_features.json (전 클래스특성) + data/derived/subclasses.json (서브클래스 옵션)
 * 클래스 성장표(class_progression)와 class slug로, 개별 특성과 slug로 키 매칭.
 * 실행: cd dev && node tools/derive/build_class_features.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));

const feats = load('data/base/feats.base.json');
const classes = load('data/base/classes.base.json');
const ovlFeats = load('data/overlay/feats.ko.json');
const ovlClasses = load('data/overlay/classes.ko.json');
const classSlugs = new Set(classes.map(c => c.system.slug));
const classKo = {}; for (const c of classes) classKo[c.system.slug] = (ovlClasses[c.system.slug] || {}).name || c.name;

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

const cfeatures = [], subclasses = [];
for (const f of feats) {
  const s = f.system; if (s.category !== 'classfeature') continue;
  const slug = s.slug;
  const cls = (s.traits?.value || []).find(t => classSlugs.has(t)) || '';
  const tags = s.traits?.otherTags || [];
  const subTag = tags.find(t => cls && t.startsWith(cls + '-')) || tags.find(t => [...classSlugs].some(c => t.startsWith(c + '-')));
  const isSub = !!subTag;
  const subType = subTag ? subTag.replace(new RegExp('^(' + (cls || subTag.split('-')[0]) + ')-'), '') : '';
  const grants = (s.rules || []).filter(r => r.key === 'GrantItem').length;
  const row = {
    slug, class: cls, name_en: f.name, name_ko: (ovlFeats[slug] || {}).name || f.name,
    level: (grantLevel[slug] && cls && grantLevel[slug][cls] != null) ? grantLevel[slug][cls] : (typeof s.level === 'object' ? s.level?.value : s.level) ?? '',
    is_subclass: isSub ? '✓' : '', subclass_type: subType, tag: subTag || '', grants, rules_n: (s.rules || []).length,
  };
  cfeatures.push(row);
  if (isSub) subclasses.push(row);
}
cfeatures.sort((a, b) => (a.class || '~').localeCompare(b.class || '~') || (a.level || 0) - (b.level || 0) || a.slug.localeCompare(b.slug));
subclasses.sort((a, b) => (a.class || '').localeCompare(b.class || '') || a.subclass_type.localeCompare(b.subclass_type) || a.slug.localeCompare(b.slug));

const note1 = 'FVTT feats(category=classfeature). class=traits, level=클래스 부여레벨, 서브클래스=otherTags 태그';
fs.writeFileSync(path.join(DEV, 'data/derived/class_features.json'), JSON.stringify({ rows: cfeatures, note: note1 }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'data/derived/subclasses.json'), JSON.stringify({ rows: subclasses, note: '서브클래스 옵션 = otherTags `<class>-<type>` 태그로 식별' }, null, 1) + '\n');

const bySubType = {}; for (const s of subclasses) (bySubType[s.class + '/' + s.subclass_type] = bySubType[s.class + '/' + s.subclass_type] || []).push(s.slug);
console.log(`✔ class_features.json — 클래스특성 ${cfeatures.length}`);
console.log(`✔ subclasses.json — 서브클래스 옵션 ${subclasses.length} (${Object.keys(bySubType).length}종)`);
for (const k of Object.keys(bySubType).slice(0, 12)) console.log(`   ${k}: ${bySubType[k].join(', ')}`);
