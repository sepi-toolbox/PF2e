# maps/ — 지도 배경 이미지 (URL 참조 모드)

고해상도 지도 배경을 여기에 넣고 커밋·푸시하면, 지도 편집기의 **URL** 입력에
`maps/파일명.jpg` 로 참조할 수 있습니다.

- Firestore에는 URL 문자열만 저장되므로 **용량 제한(1MiB) 없이 원본 해상도** 그대로 표시됩니다.
- 같은 오리진(pathforge.kr)에서 서빙되므로 CORS·캔버스 taint 문제가 없습니다(CCTV 캡처 안전).
- 상대경로는 페이지 기준으로 해석됩니다: 데브(`/dev/Map.html`)에서 `maps/x.jpg` → `/dev/maps/x.jpg`,
  운영 배포 후에는 `/maps/x.jpg`. (배포 rsync가 `dev/maps/` → 루트 `maps/`로 자동 동기화, `*.md` 제외)
- 외부 URL(`https://…`)도 가능 — 표시용 CORS 폴백이 있어 그려지긴 하지만, 호스트가
  `Access-Control-Allow-Origin`을 안 주면 CCTV 미리보기 캡처만 동작하지 않습니다.
  (github.io / raw.githubusercontent.com은 `ACAO:*`라 안전.)
- 파일 한도: GitHub 파일당 100MB. 웹 표시용으로는 5~20MB JPEG/WebP 권장.
