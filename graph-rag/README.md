# ERSIYAN site GraphRAG

이 디렉터리는 현재 저장소의 공개 웹 구조를 다른 에이전트가 빠르게 파악할 수 있도록 만든 정적 GraphRAG 인덱스입니다.

- 시작점: `PROJECT_GRAPH_RAG_INDEX.md`
- 구조화 노드: `nodes.jsonl`
- 관계: `edges.jsonl`
- 검색용 설명 청크: `chunks.jsonl`
- 정리 상태와 보존 경계: `cleanup-candidates.md`
- 생성 시점과 집계: `manifest.json`

2026-09-22 라우트 지도는 개인정보 보관본 6개를 포함한 정식 URL 17개를 설명합니다. VIRTUAL 본문은 `VirtualRecruitment.tsx`와 지원 주소 설정으로 분리하며 기존 `app/home.css` 클래스와 공통 홈페이지 틀을 유지합니다. `VirtualRecruitment.module.css`의 보정 범위는 모집 본문 내부입니다. 본문 문구와 Google Forms 지원 경로를 교정하고 세부 계약 조건은 공개 홈페이지에 반복하지 않습니다. `manifest.json`의 `validation`·`validationObservedAt`은 과거 기록이며 `currentValidation`은 9월 23일 배포 스냅샷·검색 확인 결과입니다. `currentSourceValidation`은 그 배포 이후의 변경까지 검증했는지 구분합니다.

## 색인 경계

`app`, `public`, `scripts`, `tests`, `worker`, `docs`의 공개 비교 보고서, 프로젝트 설정과 SEO 근거의 의미 있는 구조만 색인합니다. `.git`, `node_modules`, `.next`, `.vinext`, `.wrangler`, `dist`, `.seo-cache`, `.seo-audit-fresh`의 생성물 전문과 `local-private` 원본은 내용 색인에서 제외합니다. `outputs`의 작업 산출물·계정 화면·Chrome profile 및 `Cookies`, `Login Data`, `History`, 세션·캐시는 내용 색인하지 않습니다. 과거 보고서 경로와 검증 요약만 유지하며, 지원 응답·음성 파일·계정 정보와 내부 운영 문서 원문은 추가하지 않습니다.

노드의 `status`, `publicness`, `sensitivity`, `source` 필드를 먼저 확인한 뒤 필요한 청크만 검색하세요. 정리 후보는 사용자가 승인했지만 자동 승인 검토 사용량 제한으로 실행이 보류되어 있으므로, `cleanup-candidates.md`와 `manifest.json`의 상태를 확인한 뒤 동일한 삭제 작업을 재시도해야 합니다.
