#!/usr/bin/env node
/* build_subclasses.mjs — 서브클래스 옵션 테이블(설명 포함) = data/derived/subclasses.json
 *  소스: data/store/feats.json(category=classfeature + otherTags `<class>-<type>` = 서브클래스 식별).
 *  컬럼: slug·class·name_en·name_ko·level·is_subclass·subclass_type·tag·grants·rules_n·**desc**(_desc_ko).
 *  ⚠ 클레릭: FVTT thin 행(은둔 클레릭 등) 대신 큐레이션 교의(cleric_doctrines.json = 수도원 성직자/전투 사제,
 *     정본 desc·prof_changes)를 표시행으로 매핑 → 런타임 SUBCLASS_DB와 일치(별도 「클레릭 교의」 탭 폐지).
 *  (구 build_class_features.mjs는 삭제된 base/overlay 참조라 stale — 서브클래스 산출은 이 도구가 대체.)
 *  실행: cd dev && node tools/derive/build_subclasses.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));

const feats = load('data/store/feats.json');
const farr = Array.isArray(feats) ? feats : Object.values(feats);
const classes = load('data/store/classes.json');
const carr = Array.isArray(classes) ? classes : Object.values(classes);
const classSlugs = new Set(carr.map(c => c.system && c.system.slug).filter(Boolean));

// 클래스가 이 특성을 부여하는 레벨(class.items 역인덱스)
const grantLevel = {};
for (const c of carr) {
  const cs = c.system && c.system.slug; if (!cs) continue;
  for (const it of Object.values((c.system && c.system.items) || {})) {
    const fid = (it.uuid || '').split('.').pop();
    const f = farr.find(x => x._id === fid);
    const sl = f && f.system && f.system.slug;
    if (sl) (grantLevel[sl] = grantLevel[sl] || {})[cs] = it.level | 0;
  }
}

const rows = [];
for (const f of farr) {
  const s = f.system || {}; if (s.category !== 'classfeature') continue;
  const tags = (s.traits && s.traits.otherTags) || [];
  const cls = (s.traits && s.traits.value || []).find(t => classSlugs.has(t)) || '';
  const subTag = tags.find(t => cls && t.startsWith(cls + '-')) || tags.find(t => [...classSlugs].some(c => t.startsWith(c + '-')));
  if (!subTag) continue;
  if (cls === 'cleric') continue; // 클레릭 교의는 큐레이션으로 대체(아래)
  const subType = subTag.replace(new RegExp('^(' + (cls || subTag.split('-')[0]) + ')-'), '');
  const rules = s.rules || [];
  rows.push({
    slug: s.slug, class: cls, name_en: f.name_en || f.name, name_ko: f.name_ko || f.name,
    level: (grantLevel[s.slug] && cls && grantLevel[s.slug][cls] != null) ? grantLevel[s.slug][cls] : ((typeof s.level === 'object' ? s.level && s.level.value : s.level) ?? 1),
    is_subclass: '✓', subclass_type: subType, tag: subTag,
    grants: rules.filter(r => r.key === 'GrantItem').length, rules_n: rules.length,
    desc: f._desc_ko || '',
  });
}

// 클레릭 교의 = 큐레이션 단일소스(cleric_doctrines.json)를 표시행으로 매핑
const doc = load('data/derived/cleric_doctrines.json');
for (const d of (doc.rows || [])) {
  rows.push({
    slug: d.id, class: d.class_id, name_en: d.name_en, name_ko: d.name_ko,
    level: 1, is_subclass: '✓', subclass_type: d.subclass_type || 'doctrine', tag: 'cleric-doctrine',
    grants: (d.granted_feats || []).length, rules_n: (d.features || []).length,
    desc: d.desc || '',
  });
}

rows.sort((a, b) => (a.class || '').localeCompare(b.class || '') || String(a.subclass_type).localeCompare(String(b.subclass_type)) || a.slug.localeCompare(b.slug));
const out = { rows, note: '서브클래스 옵션(설명 포함). 소스=store feats(otherTags `<class>-<type>`). 클레릭 교의=cleric_doctrines.json 큐레이션.' };
fs.writeFileSync(path.join(DEV, 'data/derived/subclasses.json'), JSON.stringify(out, null, 1) + '\n');

const byClass = {}; rows.forEach(r => byClass[r.class] = (byClass[r.class] || 0) + 1);
const noDesc = rows.filter(r => !r.desc).length;
console.log(`✔ subclasses.json — ${rows.length}종 (desc 없음 ${noDesc})`);
console.log('  클래스별:', JSON.stringify(byClass));
