# 저장소 에이전트 안내

이 저장소에서 작업을 시작하는 모든 에이전트는 먼저 [PROJECT_GRAPH_RAG_INDEX.md](PROJECT_GRAPH_RAG_INDEX.md)를 읽고, 필요한 경우 `graph-rag/manifest.json`·`nodes.jsonl`·`edges.jsonl`·`chunks.jsonl`을 따라가야 합니다. 그래프RAG의 정리 경계와 민감 자료 제외 규칙은 `graph-rag/README.md`와 `graph-rag/cleanup-candidates.md`에 있습니다.

## 작업 전 확인

- 현재 기준일과 정리 상태를 `graph-rag/manifest.json`에서 확인합니다.
- 라우트와 담당 소스는 `graph-rag/nodes.jsonl`에서 찾고, 관계는 `graph-rag/edges.jsonl`에서 확인합니다.
- 변경 전 해당 파일의 소유 관계와 `preserves`·`policy_applies` 엣지를 확인합니다.
- `app`, `public`, `scripts`, `tests`, `worker`와 배포 설정을 임의로 삭제하지 않습니다.
- `local-private`, `.git`, `node_modules`, `.next`, `.vinext`, `.wrangler`, `dist`, Chrome 프로필의 쿠키·로그인 데이터·방문 기록·세션은 GraphRAG 내용에 넣지 않습니다.

## 기업 홈페이지 보존

`/velsien-summit/corporate/orysen`, `/virenta`, `/neryx`는 서로 독립된 공식 홈페이지입니다. 각 페이지의 UI·콘텐츠·맞춤 푸터를 공통 `ErFooter`로 바꾸거나 합치지 않습니다. 이 세 사이트는 사용자 지시로 SEO·푸터 변경 대상에서 제외되어 있습니다. 정적 배포에서 내부 이동이 작동하도록 Experience 안의 내부 이동 링크는 일반 `<a>`를 사용하며, 화면·문구·맞춤 푸터는 변경하지 않았습니다. 그 밖의 변경이 필요하면 먼저 사용자에게 확인합니다.

## 법적 신원과 푸터

공통 사이트의 법적 대표자는 `탁진`입니다. 공통 푸터를 다룰 때는 `app/_components/ErFooter.tsx`와 `app/_components/business-profile.ts`를 함께 확인하고, 개인정보처리방침·테스트의 대표자 계약을 유지합니다.

## 정리와 검증

현재 사용자가 삭제를 승인한 미사용 후보는 `graph-rag/cleanup-candidates.md`에 고정되어 있습니다. 삭제 명령이 실행됐는지는 `manifest.json`의 `cleanup.executed`를 기준으로 판단하며, 기록만 보고 삭제 완료로 간주하지 않습니다.

SEO·라우트·법적 문서를 변경한 뒤에는 다음 계약을 실행합니다.

- `npx.cmd tsc --noEmit --incremental false`
- `node tests/rendered-html.test.mjs`
- `node tests/cloudflare-static.test.mjs`
- `node tests/legacy-division-route.test.mjs`
- `node tests/naver-indexnow.test.mjs`

빌드와 배포가 성공하지 않은 상태에서는 `dist`가 최신 소스라고 주장하거나 배포 완료로 보고하지 않습니다. Chrome 사람 눈 검수 결과와 자동 테스트 결과를 분리해서 기록합니다.
