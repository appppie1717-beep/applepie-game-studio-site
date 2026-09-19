# ERSIYAN site GraphRAG

이 디렉터리는 현재 저장소의 공개 웹 구조를 다른 에이전트가 빠르게 파악할 수 있도록 만든 정적 GraphRAG 인덱스입니다.

- 시작점: `PROJECT_GRAPH_RAG_INDEX.md`
- 구조화 노드: `nodes.jsonl`
- 관계: `edges.jsonl`
- 검색용 설명 청크: `chunks.jsonl`
- 정리 상태와 보존 경계: `cleanup-candidates.md`
- 생성 시점과 집계: `manifest.json`

## 색인 경계

`app`, `public`, `scripts`, `tests`, `worker`, 프로젝트 설정과 최신 SEO 보고서의 의미 있는 구조만 색인합니다. `.git`, `node_modules`, `.next`, `.vinext`, `.wrangler`, `dist`의 생성물 전문과 `local-private` 원본은 내용 색인에서 제외합니다. `outputs` 안의 Chrome profile 및 `Cookies`, `Login Data`, `History`, 세션·캐시는 개인정보 보호를 위해 색인하지 않습니다.

노드의 `status`, `publicness`, `sensitivity`, `source` 필드를 먼저 확인한 뒤 필요한 청크만 검색하세요. 정리 후보는 사용자가 승인했지만 자동 승인 검토 사용량 제한으로 실행이 보류되어 있으므로, `cleanup-candidates.md`와 `manifest.json`의 상태를 확인한 뒤 동일한 삭제 작업을 재시도해야 합니다.
