#!/bin/sh
# 렌더 확인 하니스 — dev/_rendertest.html을 로컬서버+헤드리스 Chrome로 그려 스크린샷.
# 사용: sh tools/rendershot.sh [out.png] [ "?class=cleric" ] [ WxH ]
#   3번째 인자=창 크기(기본 500,3600). 모달 데스크톱 레이아웃(목록+상세 2단)은 폭>900 필요 → 예: "1000,1400".
# 결과 PNG 경로를 stdout으로 출력 → Read 도구로 이미지 확인.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"          # dev/
OUT="${1:-/tmp/pf2e_render.png}"
QUERY="${2:-}"
SIZE="${3:-500,3600}"
PORT=8899
cd "$DIR"
# 기존 서버 정리 후 기동
lsof -ti tcp:$PORT 2>/dev/null | xargs kill 2>/dev/null || true
python3 -m http.server $PORT >/tmp/rt_server.log 2>&1 &
SRV=$!
sleep 1.5
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=$SIZE --virtual-time-budget=20000 \
  --screenshot="$OUT" "http://localhost:$PORT/_rendertest.html$QUERY" 2>/tmp/rt_chrome.log || true
kill $SRV 2>/dev/null || true
echo "$OUT"
