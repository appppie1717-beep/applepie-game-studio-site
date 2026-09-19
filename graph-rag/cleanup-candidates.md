# 정리 후보와 보존 경계

## 현재 상태

- 사용자 승인: 완료
- 실제 삭제 실행: 미완료
- 상태: `pending_auto_review_limit`
- 사유: 파일 삭제 명령이 자동 승인 검토의 사용량 한도로 거부됨
- 이 문서와 `graph-rag/manifest.json`의 `cleanup.executed`가 `false`인 동안 삭제 완료로 판단하지 않음

## 삭제 후보

아래 항목은 전수 조회와 참조 검색에서 현재 런타임 참조가 없거나 민감한 브라우저 잔여물로 분류되었습니다. 자동 삭제가 재개될 때에도 각 절대 경로가 저장소 루트 안인지 먼저 확인해야 합니다.

- 루트의 0바이트 명령 잔여물: `console.error(String(e)))`, `console.log(x`, `n.mtime)n`, `{console.error(e)`, `{try{for(e`
- 빈 디렉터리: `.vinext`, `db`, `drizzle/meta`, `examples/d1/app/api/notes`, `코드/벨서`, `work`
- 현재 런타임 참조가 없는 임시 SEO 스냅샷: `.seo-audit-fresh`
- 현재 런타임 참조가 없는 과거 원시 SEO 캐시: `.seo-cache`
- `outputs/seo-audit-2026-09-05/performance/chrome-profile`
- `outputs/seo-polish-2026-09-05/**/chrome-profile`

Chrome profile 하위의 `Cookies`, `Login Data`, `History`, `Sessions`, 캐시, LOCK 파일은 민감 데이터이므로 GraphRAG에 색인하지 않습니다.

## 현재 보존

- `app`, `public`, `scripts`, `tests`, `worker`와 모든 프로젝트 설정
- `.git`, `.openai/hosting.json`, Google 소유권 검증 파일
- `local-private/velsien-summit`의 teaser 원본
- `dist`와 `node_modules`는 최신 빌드·검증이 끝나기 전 보존
- `outputs/seo-audit-2026-09-13` 최신 보고서와 인포그래픽
- 과거 SEO 감사·수정·배포·검색 제출의 최종 보고서와 법적 근거
- `outputs` 루트의 Cloudflare·Google Search Console·Naver 제출 기록

빈 디렉터리와 과거 캐시를 장기 보존할 필요가 있으면 이 문서의 후보 상태를 `preserve`로 바꾼 뒤 작업합니다. 삭제 실행 후에는 실제 파일 부재와 manifest 상태를 다시 확인해야 합니다.
