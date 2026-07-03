#!/usr/bin/env python3
"""이름 통일 결정(decision_XX.json)을 override/<cat>.json에 병합 + 검증.
사용: python3 merge.py [--apply]   (--apply 없으면 dry-run)
"""
import json, os, sys, re, glob

DIR = os.path.dirname(os.path.abspath(__file__))
REPO = '/tmp/PF2e-publish'
OVDIR = f'{REPO}/dev/data/override'
APPLY = '--apply' in sys.argv

# 1) 결정 수집
changes = []       # {cat, slug, frm, to, en, action}
decisions_all = []
for f in sorted(glob.glob(f'{DIR}/decision_*.json')):
    d = json.load(open(f))
    for dec in d.get('decisions', []):
        decisions_all.append(dec)
        for ch in dec.get('changes', []):
            changes.append({
                'cat': ch['cat'], 'slug': ch['slug'],
                'frm': ch.get('from', ''), 'to': ch['to'],
                'en': dec['en'], 'action': dec['action'],
            })

# --- 정본 방향 교정 (에이전트가 방향을 거꾸로 잡은 그룹) ---
# 1) Concealed: 조건 정본 = 은폐(사용자 용어집). 조건 변경 제거, 효과를 은폐로.
# 2) Aerekostes: 신격(고유명사) 정본 = 아에레코스테스. 신격 변경 제거, 장비를 맞춤.
DROP = {('conditions', 'concealed'), ('deities', 'aerekostes')}
changes = [c for c in changes if (c['cat'], c['slug']) not in DROP]
changes.append({'cat': 'effects', 'slug': 'concealed', 'frm': '가려진', 'to': '은폐',
                'en': 'Concealed', 'action': 'unify'})
changes.append({'cat': 'equipment', 'slug': 'aerekostes', 'frm': '아레코스테스', 'to': '아에레코스테스',
                'en': 'Aerekostes', 'action': 'unify'})

print(f'결정 그룹: {len(decisions_all)}  |  변경 슬러그: {len(changes)} (정본교정 반영)')
unified = sum(1 for d in decisions_all if d['action'] == 'unify')
kept = sum(1 for d in decisions_all if d['action'] == 'keep_separate')
print(f'  통일 {unified} · 유지 {kept}')

# 2) 검증: 이름 무결성
MARKUP = re.compile(r'[<>@]|\[\[|\(\s*[A-Za-z]')  # 태그/마크업/영문병기
bad = []
for c in changes:
    t = c['to'].strip()
    if not t:
        bad.append((c, 'EMPTY'))
    elif MARKUP.search(t):
        bad.append((c, 'MARKUP/영문'))
if bad:
    print('\n⚠ 이름 검증 실패:')
    for c, why in bad:
        print(f'  [{why}] {c["en"]} → {c["cat"]}:{c["slug"]} = {c["to"]!r}')

# 3) 카테고리별 그룹핑 + override 병합
by_cat = {}
for c in changes:
    by_cat.setdefault(c['cat'], []).append(c)

print('\n=== 카테고리별 변경 ===')
report = []
for cat in sorted(by_cat):
    p = f'{OVDIR}/{cat}.json'
    ov = json.load(open(p)) if os.path.exists(p) else {}
    n_new, n_upd = 0, 0
    for c in by_cat[cat]:
        slug, to = c['slug'], c['to'].strip()
        e = ov.get(slug)
        if isinstance(e, dict):
            old = e.get('name_ko', '')
            if old == to:
                continue
            e['name_ko'] = to
            n_upd += 1
        else:
            ov[slug] = {'name_ko': to}
            n_new += 1
        report.append(f'  {cat}:{slug}  {c["frm"]!r} → {to!r}   [{c["en"]}]')
    print(f'{cat}: 신규 {n_new} · 갱신 {n_upd}  (총 {len(by_cat[cat])})')
    if APPLY and not bad:
        json.dump(ov, open(p, 'w'), ensure_ascii=False, indent=1)

print('\n=== 변경 상세 ===')
print('\n'.join(report))

# keep_separate 중 품질개선(changes 있는) 목록 별도 표시
print('\n=== keep_separate 이지만 개선 적용된 그룹 ===')
for d in decisions_all:
    if d['action'] == 'keep_separate' and d.get('changes'):
        print(f'  {d["en"]}: {d.get("reason","")}')

if bad:
    print('\n❌ 검증 실패로 미적용. 이름 수정 후 재실행.')
    sys.exit(1)
if APPLY:
    print(f'\n✅ 적용 완료: {len(changes)}건 → override/*.json')
else:
    print('\n(dry-run) --apply 로 실제 적용')
