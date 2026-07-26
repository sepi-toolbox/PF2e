#!/bin/sh
# 캐릭터 빌드 인터랙션 회귀 스위트 — 모든 ?flow= 시나리오를 순차 검증한다.
#   각 흐름은 실제 함수 체인(모달 열기→확정→빌더 선택)을 구동하고 단계별 자동 assert.
#   하나라도 FAIL이면 exit 1. 개별 흐름은 tools/verifyflow.sh 로 단독 실행/디버그.
# 사용: sh tools/verifyall.sh
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"
FLOWS="
flow=class-build&class=cleric&sub=doctrine-warpriest&deity=sarenrae&trainpick=medicine
flow=class-build&class=wizard&trainpick=arcana
flow=ancestry-build&ancestry=elf&heritage=arctic-elf
flow=background-build&background=acolyte
flow=ability-boost&class=fighter&level=5&clskey=str
flow=skill-increase&class=rogue&siLevel=7&skill=athletics
flow=feat-select&class=fighter&feat=vicious-swing&featType=class&featLevel=1
flow=default-build
flow=lore-build
"
FAIL=0; N=0
echo "════════════════════ PF2e 빌드 흐름 회귀 스위트 ════════════════════"
for F in $FLOWS; do
  [ -z "$F" ] && continue
  N=$((N+1))
  LINE="$(sh tools/verifyflow.sh "$F" 2>/dev/null | tail -1)"
  RC=$?
  NAME="$(printf '%s' "$F" | sed -n 's/^flow=\([a-z-]*\).*/\1/p')"
  ARGS="$(printf '%s' "$F" | sed 's/^flow=[a-z-]*&*//')"
  if [ "$RC" -eq 0 ]; then printf '  \033[32m✔ PASS\033[0m  %-16s %s\n' "$NAME" "$ARGS"
  else FAIL=$((FAIL+1)); printf '  \033[31m✘ FAIL\033[0m  %-16s %s  → %s\n' "$NAME" "$ARGS" "$LINE"; fi
done
echo "───────────────────────────────────────────────────────────────────"
if [ "$FAIL" -eq 0 ]; then echo "  \033[32m전체 통과: $N/$N\033[0m"; exit 0
else echo "  \033[31m실패 $FAIL/$N — 위 FAIL 흐름을 tools/verifyflow.sh 로 단독 실행해 디버그\033[0m"; exit 1; fi
