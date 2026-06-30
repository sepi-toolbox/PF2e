#!/usr/bin/env bash
# PF2e-KR 번역 동기화 (Rutz179 원조 → dev/data). 인자는 sync_kr.mjs로 전달.
#   ./tools/rebase/sync_kr.sh              # Rutz179 최신 fetch 후 전량 동기화
#   ./tools/rebase/sync_kr.sh --local      # 로컬 Foundry 설치본 사용
#   ./tools/rebase/sync_kr.sh --no-creatures
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
exec node "$DIR/tools/rebase/sync_kr.mjs" "$@"
