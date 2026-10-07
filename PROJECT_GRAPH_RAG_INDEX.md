# ERSIYAN / ApplePie site GraphRAG 시작점

## Summary

- 공식 도메인: `https://ersiyan.com`
- 저장소: `C:\Users\USER\Desktop\잡다한거\applepie-game-studio-site`
- 목적: ERSIYAN GAMES, ERSIYAN VIRTUAL, MINE LOGIC, VELSIEN SUMMIT와 관련 공지·개인정보·기업 페이지의 라우트, 소스, 자산, SEO, 검증, 정적 Cloudflare 배포 관계를 한눈에 찾는 것
- GraphRAG 최초 검증 근거 기준일:2026-09-13. 2026-09-30 현행 구조는 정식URL28개이며 오류를 포함한 라우트노드는29개입니다. 공식 루트 `/`에서 회사 정보와 사업부 선택을 먼저 보여주고 게임부 `/games`·버츄얼부 `/virtual`을 각각 정식 경로로 둡니다. `/company`는 회사 홈으로301 이동하고 사이트맵에서 제외합니다. 공지 목록은 `/notices`에서8개를 동등한 행으로 표시합니다. 9월 30일 당시 최종 운영 배포 `63c30c0f-93f9-4ca1-92ae-a25b2d17052f`가 검증됐습니다. 10월 7일 실제 운영에서 이후 10월 3일 버전 `6becd6c4-da2a-4d2c-806c-0d3f2da8edd7`의 최신 문구·FAQ·검색정보·소셜 자산을 확인하여 소스로 복원했습니다. `575b599b-0e7f-4b6d-b4bf-0b4edfe2711e`는 최종 공지 상세 CSS 보정 전, `da372027-f474-4085-a045-d4090a630a17`은 이전 `/company` 정식 경로 시점의 중간 배포입니다. 검색 제출과 실제 색인은 별도 근거로 확인합니다.
- 2026-10-07 로컬·GitHub 소스 전수 대조·정리·최적화: [SOURCE_RECONCILIATION_2026-10-07.md](SOURCE_RECONCILIATION_2026-10-07.md). 사용자 승인 후 GitHub main과 로컬 소스를 맞추고95abc6ee(태그f973b37) 운영 배포·검수를 완료했습니다. 운영28HTML은 최종 빌드 해시와 일치하며 최신 검증 상태는 manifest의 currentTask를 확인합니다.
- 2026-09-19 로컬·GitHub·운영 사이트 재대조 결과: [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md). 이후 변경은 새로 검증해야 합니다.
- 상세 그래프: `graph-rag/manifest.json`, `graph-rag/nodes.jsonl`, `graph-rag/edges.jsonl`, `graph-rag/chunks.jsonl`

## 읽는 순서

1. 이 파일에서 보존 정책과 라우트 지도를 확인합니다.
2. `graph-rag/manifest.json`에서 검증 근거 기준일과 2026-09-30 라우트 지도 갱신일, 색인 경계, 정리 상태를 확인합니다. `/virtual` 모집과 VELSIEN 세계관 문구는 현행 소스를 우선합니다.
3. 필요한 route·file·component 노드를 `graph-rag/nodes.jsonl`에서 찾습니다. 현행 소스·사이트맵과 과거 검증 스냅샷의 경로 수를 구분합니다.
4. `graph-rag/edges.jsonl`에서 `renders`, `imports`, `has_metadata`, `tested_by`, `preserves` 관계를 따라갑니다.
5. 최신 판단 근거는 `manifest.json`의 `currentTask`, `currentSourceValidation`, `currentValidation`과 `graph-rag/chunks.jsonl`에서 확인합니다. `outputs/seo-audit-2026-09-13/SEO-AUDIT-REPORT.md`는 과거 기록이며 계정 화면·검색 보고서 전문은 GraphRAG에 복사하지 않습니다.

## 사이트 경계

| 영역 | 대표 라우트 | 소유 소스 | 정책 |
|---|---|---|---|
| 회사 홈 | `/` | `app/page.tsx`, `app/company/company.module.css`, `app/_components/CompanyHistory.tsx`, `app/_components/ErFooter.tsx` | 회사 소개·두 사업부 선택·현행 사업자 정보·연혁을 먼저 제공. 법적 신원과 공통 푸터 유지 |
| ERSIYAN GAMES | `/games` | `app/games/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 출시·개발 게임과 제작 기준. 회사 소개·최근 공지 미리보기 없음 |
| ERSIYAN VIRTUAL | `/virtual` | `app/virtual/page.tsx`, `app/_components/VirtualRecruitment.tsx`, `VirtualRecruitment.module.css`, `virtual-recruitment-config.ts`, 기존 `app/home.css` | CHZZK 3D 버츄얼 0기 1명 모집·활동 안내. “지원 접수 일시 중단”과 회색 지원 버튼·작은 상태 표시를 유지하지만 중복 안내 상자는 삭제. 기존 Google Forms 링크는 활성 상태. 구체적인 계약 조건은 지원서에서 안내 |
| 공지사항 | `/notices`와 개별 공지 8개 | `app/_components/notices.ts`, `app/notices/page.tsx`, `NoticePage.tsx`, `NoticeLayout.tsx`, `notices.module.css`, 각 명시적 하위 `page.tsx` | 목록의8개 글은 동등한 행으로 표시하고 개별 상세 정식 URL·원래 공개일·실제 변경일을 유지 |
| MINE LOGIC | `/mine-logic` | `app/mine-logic/page.tsx` | Android 오프라인 지뢰찾기 제품 페이지 |
| VELSIEN SUMMIT | `/velsien-summit` | `app/velsien-summit/page.tsx`, `VelsienSignalDeck.tsx` | 게임·세계관·개발 기록 허브 |
| 최신 공개 세계관 | `/velsien-summit/world` | `app/velsien-summit/world/page.tsx` | 현재 공개 세계관. 기존 허브에서 연결하는 별도 정식 페이지 |
| 2026년 8월 개발 화면 | `/velsien-summit#devlog-2026-08-late` | `app/velsien-summit/page.tsx` | 3개 화면을 허브 개발 기록으로 통합. 이전 `/late-update` 주소는 허브로 301 이동 |
| Secret 시각 자료 | `/velsien-summit/secret` | `app/velsien-summit/secret/page.tsx` | searchable-but-unlisted 기록 보관 페이지. 임의로 noindex 처리하지 않음 |
| 기업 홈페이지 | `/velsien-summit/corporate/orysen`, `/virenta`, `/neryx` | 각 기업 `page.tsx`, `*Experience.tsx`, `*.module.css` | 독립 UI·콘텐츠·맞춤 푸터 보존. 세계관의 기업 소개에서 세 홈페이지로 연결하고 각 맞춤 푸터에서 세계관으로 돌아감. 정적 클릭 이동은 일반 `<a>` 사용. 공통 푸터로 합치지 않음 |
| 개인정보 | `/privacy`, `/privacy/mine-logic` | 각 `page.tsx`, 서버 본문 `MineLogicPrivacyContent.tsx`, 클라이언트 전환 `MineLogicPrivacyLanguage.tsx` | 현행 방침의 조항 1–9와 2026-09-22 시행일·Google Forms·음성 첨부 처리·기존 이메일 지원 자료 기준 보존. 공지 본문은 별도 글로 이동하고 기존 공지 ID는 간결한 보관본·공지 링크에 유지. 게임 정책과 대표자 `탁진` 보존 |
| 보관본 | `/privacy/archive/2026-08-22`, `/2026-08-23`, `/2026-08-28`, `/2026-08-31`, `/2026-09-05`, `/2026-09-19`, `/2026-09-22` | 각 보관 `page.tsx` | 역사 기록 7개 보존. 9월 19일 이메일 모집 방침과 9월 22일 공지 이전 전 전체 방침을 현재 구성과 구분 |

## 정식 라우트 목록

2026-09-30 로컬 소스 기준 정식 URL은 28개입니다. 공지 목록1개·글8개·9월22일 개인정보 보관본과 정식 게임부 `/games`를 포함합니다. `/`는 회사 홈이고 `/company`는 해당 홈으로301 이동하는 옛 주소입니다. 오류 경로 `/404`까지 포함한 정식 라우트 노드는29개이며, `/404`와 `/company`는 사이트맵에 넣지 않습니다. `/virtual`의 지원 경로는 Google Forms이며 이메일은 모집 문의에 사용합니다. 현재 모집 상태는 헤더의 “지원 접수 일시 중단”과 지원 버튼 아래 “(모집 일시중단)”에 남고, 별도 중복 안내 상자는 삭제했습니다. 실제 Forms 링크와 폼 설정은 유지합니다. 변경한 페이지의 실제 변경일만 사이트맵에 반영합니다.

`/`, `/games`, `/virtual`, `/mine-logic`, `/privacy`, `/privacy/mine-logic`, `/privacy/archive/2026-08-22`, `/privacy/archive/2026-08-23`, `/privacy/archive/2026-08-28`, `/privacy/archive/2026-08-31`, `/privacy/archive/2026-09-05`, `/privacy/archive/2026-09-19`, `/privacy/archive/2026-09-22`, `/velsien-summit`, `/velsien-summit/world`, `/velsien-summit/secret`, `/velsien-summit/corporate/orysen`, `/velsien-summit/corporate/virenta`, `/velsien-summit/corporate/neryx`, `/notices`, `/notices/virtual-recruitment-pause-2026-09-28`, `/notices/application-form-2026-09-22`, `/notices/recruitment-privacy-2026-09-19`, `/notices/analytics-correction-2026-09-05`, `/notices/business-name-2026-08-31`, `/notices/brand-domain-2026-08-28`, `/notices/hosting-change-2026-08-23`, `/notices/mine-logic-update-2026-08-28`.

`/404`와 기존 `/velsien-summit/late-update`, `/company`, legacy `.html`, `/index`, trailing-slash 별칭은 배포 리다이렉트·404 계약으로만 취급합니다. `/games`는 정식 페이지이며 `/company`를 검색용 정식 페이지로 중복 등록하지 않습니다.

## SEO와 배포 연결

- 전역 metadata: `app/layout.tsx`
- 회사 홈 metadata·WebSite·AboutPage·Organization JSON-LD는 `app/page.tsx`에서, 게임부 `/games`·VIRTUAL의 WebPage·사업부 Organization은 `app/games/page.tsx`, `app/virtual/page.tsx`, `app/_components/HomeContent.tsx`에서 제공합니다.
- VIRTUAL 본문과 지원 주소: `app/_components/VirtualRecruitment.tsx`, `virtual-recruitment-config.ts`. `HomeContent.tsx`가 본문을 연결하고 기존 `app/home.css` 클래스를 사용합니다. `VirtualRecruitment.module.css`는 회색 버튼·작은 상태 표시·모바일 정보 행·과제 간격·포커스를 보정합니다. 별도 중복 안내 상자는 렌더링하지 않습니다. `HomeExperience.tsx`는 `/games`·`/virtual` 헤더에서 회사 홈 `/`과 공지 `/notices`로 연결하며, `ErFooter.tsx`는 법정 사업자 정보를 제공합니다. 사업부 본문의 회사 소개·최근 공지 미리보기는 렌더링하지 않습니다.
- 지원 주소 설정은 게시된 Google Forms 응답자용 URL을 사용합니다. 문항 구성 기준은 기본 필수 7개·필수가 아닌 방송 채널 1개·동의 2개이며, 방송 채널 제목에 “선택”을 붙이지 않습니다. 실제 문항은 게시된 폼에서 별도 검증합니다.
- 지원서 배너: `public/images/virtual/ersiyan-gen0-form-header.png`, 편집 원본 `.svg`, 재생성 스크립트 `scripts/render-virtual-form-banner.py`. 웹 소셜 카드와 지원서 배너는 용도가 다릅니다.
- 지원서 헤더는 공식 별 마크·ERSIYAN 로고와 “에르시안 버츄얼 / 0기 크리에이터 모집” 문구로 교체했습니다. 2026-09-23 새 PNG 42,521바이트를 업로드·저장한 뒤 게시된 응답자 화면 1904·390px에서 실제 표시를 확인했습니다. 폼 테마색 `#c64035`·배경 `#f9eceb`를 적용하고 문항·폼 설정은 유지했습니다.
- 모집 페이지 비교·문구 결정 근거: `docs/virtual-recruitment-research-2026-09-22.md`. 공개 홈페이지에는 세부 계약 비율·장비 반환 조건을 반복하지 않고 지원서에서 확인하게 합니다.
- MINE LOGIC metadata·`VideoGame`·`MobileApplication`·`BreadcrumbList`: `app/mine-logic/page.tsx`
- 공지 목록·상세 metadata: `app/notices/page.tsx`와 각 하위 `page.tsx`, `NoticePage.tsx`. 개별 canonical·OG URL을 사용하며 공지 출처 날짜와 실제 수정일을 구분합니다. 목록은8개 같은 행과 `CollectionPage`·`ItemList`·`BreadcrumbList`, 상세는 `Article`·`BreadcrumbList`를 제공합니다. 공지사항은 독립 `/notices`와 회사 홈·사업부 헤더·`ErFooter.tsx` 링크로 진입합니다. 미사용 `NoticePreview.tsx`와 전용 CSS는 2026-10-07 참조 검수 후 제거했습니다. 공지 8개와 화면은 보존합니다. 독립 기업 홈페이지는 변경 대상이 아닙니다.
- 현재 개인정보 방침의 네 공지 본문은 9월 22일 전체 보관본에 남기고 개별 공지에서 제공합니다. `forms-notice`, `recruitment-notice`, `change-notice`, `business-name-notice`는 현재 방침 변경 목록에서 유지합니다. MINE LOGIC 방침의 한·영 사업자명 설명은 법적 신원 문장과 공지 링크로 정리하며 처리 조항·시행일은 유지합니다. 제품 업데이트 원문은 공지 글로 연결합니다.
- VELSIEN metadata·구조화 데이터: `app/velsien-summit/page.tsx`, `app/velsien-summit/world/page.tsx`, `app/velsien-summit/secret/page.tsx`
- 검색 제어: `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/_redirects`
- 보안·캐시 헤더: `public/_headers`
- 정적 빌드와 Cloudflare Worker: `vite.config.ts`, `worker/index.ts`, `wrangler.cloudflare.jsonc`, `scripts/stage-static-routes.mjs`, `scripts/verify-cloudflare-deployment.mjs`
- 과거 SEO 인포그래픽·보고서: `outputs/seo-audit-2026-09-13/SEO-BEFORE-AFTER.svg`, `SEO-AUDIT-REPORT.md`. 생성물·계정·프로필 전문은 GraphRAG 내용에 넣지 않습니다.

## 검증 계약

- 타입 검사: `npx.cmd tsc --noEmit --incremental false`
- HTML·metadata·footer·JSON-LD: `node tests/rendered-html.test.mjs`
- 정적 Cloudflare 계약: `node tests/cloudflare-static.test.mjs`
- legacy route: `node tests/legacy-division-route.test.mjs`
- Naver IndexNow 계약: `node tests/naver-indexnow.test.mjs`
- 전체 빌드·검증: `npm run build:cloudflare`

2026-09-30 회사 우선 홈 `/`, 정식 게임부 `/games`, `/company` 301과 공지 8개 동등 행을 최종 `63c30c0f-93f9-4ca1-92ae-a25b2d17052f`로 운영 배포했습니다. 첫 배포 `575b599b-0e7f-4b6d-b4bf-0b4edfe2711e`의 독립 화면 검수에서 공지 상세 분류·날짜 간격이 붙는 문제를 발견해 CSS를 복구했습니다. 최종 TypeScript·lint·45계약·29프리렌더와 운영 verifier 28정식URL·319자산검사(91고유)·150별칭(회사 옛 주소6개 포함)·sitemap·404·llms.txt가 통과했습니다. 구현과 별개인 UI·SEO·콘텐츠 검수 3건도 최종 배포에서 통과했고 PC·375px 실화면의 공지 상세 간격14px, 운영 28 URL의 self-canonical/index-follow와 live/dist HTML 일치, 공지8건 본문·게시일·법적 기록·Forms 링크 보존을 확인했습니다. 근거는 `outputs/company-first-home-2026-09-30`이며 GraphRAG 검증은 `outputs/virtual-pause-cleanup-2026-09-30/graph-validation.txt`입니다. Google 사이트맵은 첫 배포에서 재제출되어 성공·발견28이고 URL검사28개는27개 색인·신규 `/games` 미색인입니다. Naver IndexNow 4개(`/`, `/games`, `/virtual`, `/notices`)는 HTTP200·accepted이고 URL검사28개는16개 색인·1개 수집 후 미색인·11개 데이터 없음입니다. Naver의 루트 검색 제목은 이전 게임 중심 문구라 새 회사 홈이 아직 반영되지 않았습니다. 최종 재배포는 CSS만 바꿔 URL·본문·메타데이터·사이트맵은 그대로이며 검색 제출을 중복하지 않았습니다. Google 최신 본문과 다른 Naver 페이지의 새 검색 문구 반영은 미확인입니다. 제출 접수와 실제 최신 색인은 구분합니다.

직전 중간 배포 `da372027-f474-4085-a045-d4090a630a17`은 게임부가 `/`, 회사 정보가 `/company`였던 시점의 역사 기록입니다. 당시 TypeScript·lint·44계약·29프리렌더와 운영 verifier 28정식URL·319자산검사(91고유)·150별칭·sitemap·404·llms.txt가 통과했습니다. Google은 당시 사이트맵 재제출과 기존 변경 주소15개 개별 요청을 접수했고, 신규 `/company` 요청은 일일 할당량 초과로 접수되지 않았습니다. Naver 당시 15개와 최종3개(`/`, `/virtual`, `/company`) IndexNow 제출은 HTTP200·accepted였으며 실제 색인 완료 근거는 아닙니다. 당시 근거는 `outputs/virtual-pause-cleanup-2026-09-30`와 `outputs/search-refresh-2026-09-30`에 보존합니다.

2026-09-29 선행 사용자 요청으로 모든 공지의 “게시 당시 기준” 안내상자와 전용CSS를 삭제했습니다. 제목·게시일·본문·관련링크·검색정보는 유지했습니다. 당시 배포c1f5041a-0af2-4fe1-8cb4-e5f367228cc9은 TypeScript/lint/43계약/28프리렌더와 운영27경로·307자산검사(88고유)·145별칭·sitemap/404/llms 검증을 통과했습니다. 실제운영IAB1280x960·375x812의 지난글에서 상자삭제·정상본문간격·가로넘침없음·콘솔오류경고0을 확인했습니다. 근거 `outputs/notices-history-banner-removal-2026-09-29`. 아래cd97c571은 선행 문구수정 기록입니다.

2026-09-29 선행 문구 수정은 공지8건의 장식 표현(함께 살펴봐요·쉬어가요)을 빼고 짧고 직접적인 해요체로 정리한 작업입니다. 모집 글은 “버츄얼 모집 일시 중단”과2문장으로 정리하고, 반복 상태 문장·요청한 /virtual 본문 링크·빈 관련링크 영역을 삭제했습니다. 홈·VIRTUAL 공유안내와 검색정보가 일치하며4지정제목·원래게시일·주소·사실·법적보관본·활성Forms·기업UI는 보존합니다. 마지막수정일은9/29입니다. 배포cd97c571-5c7a-419e-8927-df08309109b9은 TypeScript/lint/43계약/28프리렌더와 운영27경로·307자산검사(88고유)·145별칭·sitemap/404/llms 검증을 통과했습니다. 실제IAB1280x960/375x812에서 목록·모집글·VIRTUAL·지난글을 확인했고 가로넘침과 콘솔오류경고가 없으며 Forms3개는 활성입니다. GraphRAG170노드·454관계·40청크. 근거는 `outputs/notices-direct-copy-2026-09-28`입니다. 아래35207362와3c6bae6b는 선행검증입니다.

선행 사용자 후속 요청으로 공지4건 제목을 “사업자명. 에르시안”, “지원할때 자료?”, “에르시안 출범!”, “홈페이지 이전”으로 정확히 바꿨습니다. 목록의 “지난 소식”을 “공지사항”으로 바꾸고 그 옆 설명 문장을 삭제했습니다. 다른 공지 본문·날짜·주소·지원 링크는 유지합니다. 당시 배포35207362-5771-4de4-a444-d720454b145d은 TypeScript·lint·43계약·28프리렌더·운영27경로/307자산검사(88고유)/145별칭/sitemap/404/llms 검증을 통과했습니다. 실제IAB1280×960 목록과375×812 목록/상세에서 제목·설명삭제·가로넘침없음·콘솔오류경고0을 확인했습니다. 근거는 `outputs/notices-title-edits-2026-09-28`입니다. 아래3c6bae6b는 선행 전체 문체 수정 검증입니다.

2026-09-28 선행 전체 문구 정리는 공지8건의 제목·요약·본문과 목록 소개·지난 안내를 부드러운 해요체로 바꾼 작업입니다. 홈 최근 공지와 VIRTUAL 알림은 같은 공지 데이터를 사용합니다. 원래 게시일·주소·사실·개인정보 조항·보관본·Forms 설정·기업 UI를 유지합니다. 사용자의 즉시 배포 요청에 따라 3c6bae6b-3952-4055-882d-82e930f89f1a으로 운영 배포했습니다. TypeScript·lint exit0, 전체 계약43/43, 배포의 새 빌드28프리렌더와 static7/7을 통과했습니다. 운영 verifier exit0은27정식경로·307자산검사(88고유)·145별칭·sitemap·404·llms.txt를 확인했습니다. 실제 운영 IAB Chromium1280×960에서 목록·지난 공지,375×812에서 목록·모집 공지·VIRTUAL 알림을 검수했습니다. 검수한 화면에 가로 넘침이 없고 오류·경고 로그가 비어 있으며 원래 Forms 링크3개가 활성 상태입니다. 뷰포트 설정을 복원했습니다. 근거는 `outputs/notices-tone-2026-09-28`입니다. GraphRAG는169노드·451관계·39청크입니다. Git push·검색 제출·색인 확인·유휴 성능 측정은 하지 않았습니다. 아래0200af75는 공지 이전의 선행 검증 기록입니다.

2026-09-28 공지 이전은 사용자 승인 후0200af75-27b9-47c3-97fb-56266cb3664f로 운영 배포하고 검증했습니다. GraphRAG는 168개 노드·447개 관계·38개 청크와 27개 정식 URL을 기록합니다. JSON 파싱·중복 ID/관계·참조 무결성·현재 소스 경로 존재·사이트맵 URL 집합 대조를 통과했습니다. 루트 에이전트가 `npm run build:cloudflare`를 실행해 404 포함 28개 프리렌더 경로(정식 27개)를 확인했고, TypeScript·lint도 exit 0으로 통과했습니다. lint 경고는 없습니다. 루트가 실행한 네 계약은 rendered HTML 25/25·정적 Cloudflare 7/7·legacy 3/3·Naver IndexNow 8/8, 총 43/43이며 실패·취소·건너뜀은 없습니다. 근거는 `outputs/notices-2026-09-28/contracts.txt`입니다.

루트의 로컬 Wrangler 프리뷰 `http://127.0.0.1:4173`에서 `node scripts/verify-cloudflare-deployment.mjs --target http://127.0.0.1:4173 --target-only --skip-idle`는 exit 0으로 27개 정식 경로·참조 자산·145개 별칭·사이트맵·404·llms.txt를 검증했습니다. 이는 로컬 런타임 검증이며 운영 배포 결과와 구분합니다. 유휴 성능은 측정하지 않았습니다. 실제 IAB Chromium의 데스크톱 1280×960·모바일 375×812에서 공지 목록·모집 안내·과거 공지·현재 방침·보관본 복귀·홈 최근 공지·VIRTUAL 화면을 검수했습니다. 검수한 375px 화면에 가로 넘침이 없고, Tab·Return으로 공지 skip link가 `MAIN#notice-content`에 포커스를 옮겼습니다. 모집 공지 화면의 콘솔 오류·경고는 0이며 VIRTUAL의 원래 Forms 링크 3개는 새 창 연결·활성 상태를 유지합니다. 화면 근거는 `outputs/notices-2026-09-28`에 있습니다. 새 공지 운영 배포는 `npm run deploy:cloudflare` exit0이며, 운영 verifier exit0으로27정식경로·307자산검사(88고유자산)·145별칭·sitemap·404·llms.txt를 검증했습니다. 실제 운영 IAB Chromium1280×960·375×812에서 공지 목록·상세·VIRTUAL·현재 방침·보관본 이동·홈 최근 공지를 확인했고 검수한 화면에 가로 넘침과 콘솔 오류·경고가 없었습니다. 원래 활성 Forms 링크3개를 보존했습니다. 근거는 `outputs/notices-deployment-2026-09-28`입니다. Git push·검색 제출·새 공지 색인 확인은 수행하지 않았습니다.

공지 이전 전 9월 28일 모집 중단 안내 배포 `c4a6a381-442f-46c9-b9e7-b599298ef7ce`는 Wrangler exit 0, 기존 38개 계약, 실제 Chrome 데스크톱·390px 검수와 활성 Forms 링크 확인을 통과했습니다. 운영 verifier는 `node scripts/verify-cloudflare-deployment.mjs --target https://ersiyan.com --target-only --skip-idle` exit 0으로 17개 정식 경로·208개 참조 자산·95개 별칭·사이트맵·404·llms.txt를 검증했습니다. 근거 경로는 `outputs/virtual-pause-notice-2026-09-28/production-verification.txt`이며 유휴 성능은 측정하지 않았습니다. 앞선 `66bf43ba`는 같은 날짜의 이전 표시 변경 배포이고 `c4a6a381`가 후속 검증 스냅샷입니다.

아래는 2026-09-23의 역사적 검증 기록입니다. 당시 최종 모집 본문·배너 소스는 TypeScript·lint·17개 라우트 빌드, rendered HTML 21/21·정적 계약 6/6·legacy 3/3·Naver 계약 8/8을 통과했습니다. 로컬 Chrome 1440px 첫 화면·지원 버튼, 768px 정보 행·지원 대상, 390px 첫 화면·지원 안내·하단을 확인했고 가로 넘침 없이 모바일 본문 16px·지원 버튼 높이 49px을 확인했습니다. 공통 내비게이션은 유지했습니다. 당시 Cloudflare 배포 `a3a6d985-8094-4957-904e-238e084791a0`의 운영 verifier는 exit 0으로 17개 정식 URL·사이트맵·모든 라우트와 자산·별칭·404·llms.txt 검사를 통과했습니다. 당시 운영 화면도 360px·동작 줄이기 설정에서 가로 넘침 0·Forms 링크 3개·공통 틀 유지를 확인했습니다. 앞선 `8a88bb35` 배포 기록은 별도로 보존합니다. verifier는 `--target-only --skip-idle`을 사용했으며 유휴 성능은 측정하지 않았습니다.

9월 23일 모집 내용 배포 후 Google은 당시 정식 17개 URL의 개별 색인을 확인하고 6개 갱신 요청을 완료했습니다. 사이트맵 성공·발견 수 16은 당시 지연된 집계입니다. 네이버는 기존 16개 색인·6개 재수집 접수·VIRTUAL 최신 메타데이터 색인을 확인했으며 신규 9월 19일 보관본은 수집 성공·미색인이었습니다. 마지막 스타일·반복 라벨 정리에는 검색 요청을 중복 제출하지 않았습니다. 이 기록은 9월 28일 새 공지 경로의 색인을 증명하지 않습니다.

아래는 2026-09-13 GraphRAG 생성 당시의 역사적 검증 기록입니다. 당시 소스 타입 검사와 JavaScript 구문 검사는 통과했고, 일회성 로컬 shim 빌드와 스테이징 후 rendered HTML 18/18, 정적 Cloudflare 계약 6/6, legacy route 3/3, Naver IndexNow 계약 8/8이 통과했습니다. 일반 `npm run build`와 `npm run build:cloudflare`는 당시 Windows 샌드박스의 Node `child_process.spawn` `EPERM`으로 중단됐습니다. 일회성 shim으로 당시 소스의 `vinext build` 5/5 단계와 16개 프리렌더 경로를 확인한 뒤 shim은 삭제했습니다. 이 기록은 새 세계관·VIRTUAL 모집 변경의 빌드 성공이나 운영 배포를 증명하지 않습니다. 현행 검증 결과는 이번 변경의 별도 테스트와 배포 확인으로 판단합니다.

## 보존·삭제 경계

- 반드시 보존: `.git`, `.openai/hosting.json`, `app`, `public`, `scripts`, `tests`, `worker`, package·TypeScript·Vite·Wrangler 설정, Google 소유권 파일, `local-private` 원본, 법적·검색 제출 증거, 최신 SEO 보고서, 배포에 필요한 `dist`·`node_modules`.
- 기업 3개: 오리센·비렌타·네릭스의 독립 화면과 맞춤 푸터를 공통 `ErFooter`로 통합하지 않습니다. 2026-09-19 사용자 지시로 세계관↔각 기업의 명시 링크만 추가했습니다. 정적 프리뷰에서 실제 클릭 이동을 보장하기 위해 해당 링크는 plain `<a>`를 사용합니다.
- `local-private`와 Chrome profile 내용은 GraphRAG에 넣지 않습니다.
- 삭제 승인 대상의 상세 상태는 `graph-rag/cleanup-candidates.md`를 따릅니다. 10월 7~8일 정리는 활성 경로에서 제거 후 복구 사본을 보존했고, 실행 목록과 실제 파일 부재를 확인했습니다. 과거 자동 승인 제한 기록은 현행 상태가 아닙니다.

## 대표자 법적 신원

공통 법적 프로필의 대표자는 `탁진`입니다. 현재 검색 근거는 `app/_components/business-profile.ts`, 개인정보 페이지, rendered HTML 테스트입니다.

## 다음 에이전트용 빠른 질문

- 페이지를 찾으려면 `route:` 노드를 검색합니다.
- 어떤 컴포넌트가 렌더링하는지 보려면 `renders`와 `imports`를 따라갑니다.
- 색인·canonical·JSON-LD는 `has_metadata`, `has_canonical`, `in_sitemap`을 따라갑니다.
- 기업 3개를 건드리기 전에는 `policy:corporate-independent`와 `preserves`를 먼저 확인합니다.
- 삭제 전에는 `sensitivity`, `runtime_dependency`, `evidence_value`, `cleanupStatus`를 확인합니다.
