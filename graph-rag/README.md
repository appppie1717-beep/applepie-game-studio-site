# ERSIYAN 현재 구조 GraphRAG

이 디렉터리는 현재 홈페이지의 라우트·담당 소스·자산·보존 정책과 실행 계약만 설명합니다. 작업 보고서, 과거 검수·배포·검색 제출 이력, 스냅샷과 복구 기록은 Obsidian에 보관합니다.

## 찾는 순서

1. `PROJECT_GRAPH_RAG_INDEX.md`와 루트 `README.md`에서 현재 구조와 운영 정책을 읽습니다.
2. `manifest.json`에서 정식 경로 수·색인 경계·현재 확인된 운영 상태·Obsidian 기록 위치를 확인합니다.
3. `nodes.jsonl`의 `route:`와 `path`에서 담당 소스를 찾습니다.
4. `edges.jsonl`의 `renders`, `imports`, `policy_applies`, `preserves`를 따라갑니다.
5. `chunks.jsonl`에서 필요한 현재 구조 설명만 읽습니다.

정식 URL은28개이며 오류 페이지를 포함한 라우트 노드는29개입니다. 회사 홈은 `/`, 게임부는 `/games`, 버츄얼부는 `/virtual`입니다. `/company`는 `/`로301이동하고 `/404`와 함께 사이트맵에서 제외합니다. 공지 목록과 개별 글8개, 개인정보 보관본7개는 실제 서비스하는 공개 콘텐츠입니다.

## 보존 경계

- 오리센·비렌타·네릭스는 독립 UI·콘텐츠·맞춤 푸터를 유지합니다. 공통 `ErFooter`로 합치지 않으며 정적 내부 이동에는 일반 `<a>`를 사용합니다.
- 공통 법적 대표자는 `탁진`입니다. 방침의 조항·시행일·기존 자료 처리 기준과 과거 법적 보관본을 보존합니다.
- Secret은 searchable-but-unlisted공개 자료이며 현재 사이트맵과 색인 허용을 유지합니다.
- VIRTUAL의 회색 모집 버튼과 작은 일시중단 표시는 실제 Forms 링크·폼 설정과 구분합니다. 공개 제공 범위와 계약 안내 경계는 루트 README에서 관리합니다.
- `local-private/velsien-summit` 원본은 이미지 생성 입력으로 보존하되 내용은 색인하지 않습니다. 동적srcSet으로 사용하는 파생 이미지도 실제 참조 자산입니다.
- 정리 판단은 `cleanup-candidates.md`의 현재 보존 규칙을 따릅니다.

## 색인과 기록 경계

`app`, `public`, `scripts`, `tests`, `worker`, 필수 설정과 현재 유지관리 문서의 의미 있는 구조를 색인합니다. 공개 공지·법적 보관본의 날짜는 콘텐츠 속성이며 내부 작업 이력과 다릅니다.

Git내부, 의존성, 생성 빌드·캐시, 비공개 원본, 비밀환경파일과 자격증명은 내용 색인에서 제외합니다. 브라우저 Cookies·Login Data·History·Sessions·프로필 내용도 읽거나 색인하지 않습니다. 노드의 경로 존재 확인은 메타데이터 검사이며 내용 열람과 다릅니다.

작업 기록은 Obsidian만 사용합니다. 기록 위치는 `manifest.json`의 `workRecords` 메타데이터에서 찾습니다. 저장소에는 과거 실행 결과의 본문이나 작업별 연대기를 다시 추가하지 않습니다.

## 검증

`node graph-rag/validate.mjs`는 중복 노드·관계·청크, 참조 무결성, 실제 경로·저장소 경계·종류, 정식URL과사이트맵집합을 검사합니다. GraphRAG를 줄이거나 기록을 옮길 때도 검증을 약하게 만들지 않습니다.

타입·lint·새빌드·HTML·Cloudflare static·legacy·IndexNow 계약과 실제 PC/모바일 화면 검수는 루트 README의 절차를 따릅니다. 현재 확인된 운영 버전과 실행소스는 manifest에 상태만 남기며 상세 근거·최종 동기화 SHA는 Obsidian 기록에서 확인합니다.
