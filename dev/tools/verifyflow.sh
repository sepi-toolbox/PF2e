#!/bin/sh
# 인터랙션 흐름 자동 검증 — _rendertest.html의 ?flow= 러너를 headless Chrome로 돌려
#   #assert-out(JSON)을 --dump-dom으로 뽑아 단계별 PASS/FAIL을 판정한다.
#   스크린샷(눈 검증)과 달리 스크립트가 통과여부를 판정 → 회귀 테스트로 자동화 가능.
#   exit code: 0=PASS, 1=FAIL(어긋난 단계 있음), 2=러너 미완주.
# 사용:
#   sh tools/verifyflow.sh "flow=class-build&class=cleric&sub=doctrine-warpriest&trainpick=medicine"
#   sh tools/verifyflow.sh                       # 기본 flow=class-build&class=cleric
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"          # dev/
QUERY="${1:-flow=class-build&class=cleric}"
PORT=8899
cd "$DIR"
lsof -ti tcp:$PORT 2>/dev/null | xargs kill 2>/dev/null || true
python3 -m http.server $PORT >/tmp/vf_server.log 2>&1 &
SRV=$!
sleep 1.5
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DOM="$(mktemp /tmp/vf_dom.XXXXXX)"
"$CHROME" --headless=new --disable-gpu --no-sandbox --virtual-time-budget=20000 \
  --dump-dom "http://localhost:$PORT/_rendertest.html?$QUERY" > "$DOM" 2>/tmp/vf_chrome.log || true
kill $SRV 2>/dev/null || true
python3 - "$DOM" <<'PY'
import sys, re, json, html
dom = open(sys.argv[1], encoding='utf-8', errors='replace').read()
m = re.search(r'<div id="assert-out"[^>]*>(.*?)</div>', dom, re.S)
if not m:
    sys.stderr.write("NO_ASSERT_OUTPUT — 러너가 완주하지 못함. /tmp/vf_chrome.log 확인\n")
    sys.exit(2)
data = json.loads(html.unescape(m.group(1)))
mark = lambda ok: '\033[32m✔\033[0m' if ok else '\033[31m✘\033[0m'
for a in data['asserts']:
    print(f"  {mark(a['pass'])} {a['name']}" + (f"  ({a['detail']})" if a['detail'] else ""))
ok = data['ok']
print(("\033[32mPASS\033[0m " if ok else "\033[31mFAIL\033[0m ") + f"{data['pass']}/{data['total']}  [{data['flow']}]")
sys.exit(0 if ok else 1)
PY
