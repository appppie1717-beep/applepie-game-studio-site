# ERSIYAN GraphRAG 시작점

현재 홈페이지의 라우트·담당 소스·자산·보존 정책을 찾는 안내입니다. 공식 주소는 https://ersiyan.com 입니다. 작업 이력과 검수 증거는 Obsidian에 보관하며 현재 운영 상태는 graph-rag/manifest.json에서 확인합니다.

## 읽는 순서

1. [README.md](README.md)의 현재 서비스 구성·공개 범위·보존 정책·실행 절차를 읽습니다.
2. [graph-rag/manifest.json](graph-rag/manifest.json)의 색인 경계·라우트 수·운영 상태·기록 위치를 확인합니다.
3. graph-rag/nodes.jsonl에서 route·file·component의 담당 소스를 찾습니다.
4. graph-rag/edges.jsonl의 renders·imports·has_metadata·tested_by·preserves·policy_applies 관계를 따라갑니다.
5. graph-rag/chunks.jsonl에서 해당 구조 설명만 읽습니다. 정리 전 [graph-rag/cleanup-candidates.md](graph-rag/cleanup-candidates.md)의 보존 경계를 확인합니다.

## 사이트 지도

정식 URL은 28개이며 /404를 포함한 라우트 노드는 29개입니다. public/sitemap.xml과 GraphRAG의 정식 경로 집합이 같아야 합니다.

| 영역 | 담당 소스 | 보존 경계 |
| --- | --- | --- |
| 회사 홈 / | app/page.tsx, app/company/company.module.css, CompanyHistory.tsx | 회사 소개·사업부 선택·법적 정보·연혁 |
| 게임부 /games | app/games/page.tsx, HomeContent.tsx, HomeExperience.tsx | 출시·개발 게임과 제작 기준 |
| 버츄얼부 /virtual | app/virtual/page.tsx, VirtualRecruitment.tsx, virtual-recruitment-config.ts | 승인된 모집 문구·FAQ·회색 상태 표시·활성 Forms 링크 |
| 공지 /notices 및 상세 8개 | app/notices/, app/_components/notices.ts | 공개 본문·게시일과 수정일 |
| 게임 상세·벨시엔 세계관·Secret | app/mine-logic/, app/velsien-summit/ | 게임 콘텐츠·승인된 이미지·동적 srcSet |
| 오리센·비렌타·네릭스 | app/velsien-summit/corporate/ | 독립 UI·콘텐츠·맞춤 푸터·일반 a 링크 |
| 개인정보 현행 및 법적 보관본 7개 | app/privacy/ | 조항·시행일·당시 정책·언어 전환 |

생략된 공통 컴포넌트 파일은 app/_components/에 있습니다. /company는 /로, /velsien-summit/late-update는 벨시엔 허브로 301 이동합니다. 별칭과 /404는 사이트맵에 포함하지 않습니다.

## 변경 전 확인

- 관련 노드의 소유 관계와 preserves·policy_applies 엣지를 확인합니다.
- 공통 대표자 탁진과 사업자 프로필·푸터·개인정보·테스트의 계약을 함께 유지합니다.
- 기업 홈페이지 세 곳의 UI·문구·SEO·맞춤 푸터는 사용자 확인 없이 변경하지 않습니다.
- 미확정 계약·비공개 운영·미승인 캐릭터·세계관 결말은 공개 페이지에 추가하지 않습니다.
- local-private/velsien-summit의 이미지 생성 원본은 보존하되 내용을 색인하지 않습니다.
- Git 내부·의존성·빌드·캐시·비밀 환경 파일·금융/정부 증빙·브라우저 Cookies·Login Data·History·Sessions는 내용 색인에서 제외합니다.

## 검증과 기록

node graph-rag/validate.mjs로 실제 경로·참조 무결성·저장소 경계·사이트맵 집합을 검증합니다. 타입·lint·새 빌드·HTML·Cloudflare static·legacy·IndexNow와 실제 화면 검수는 README의 절차를 따릅니다. 검증 규칙을 약하게 만들어 정리를 통과시키지 않습니다.

저장소는 현재 코드·공개 자산·설정·테스트·유지보수 안내를 관리합니다. 날짜별 작업 보고서, QA·SEO 산출물, 배포/검색 제출 이력과 복구 사본은 Obsidian에서 관리합니다. 기록 시작점은 Obsidian Vault/DevLogs/Ersiyan_Repository_Records_To_Obsidian_2026_10_08.md이며 전체 위치는 manifest의 workRecords에서 찾습니다. 공개 공지와 법적 개인정보 보관본은 실제 서비스 콘텐츠이므로 작업 기록 정리 대상에 포함하지 않습니다.
