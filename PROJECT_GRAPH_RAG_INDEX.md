# ERSIYAN / ApplePie site GraphRAG 시작점

## Summary

- 공식 도메인: `https://ersiyan.com`
- 저장소: `C:\Users\USER\Desktop\잡다한거\applepie-game-studio-site`
- 목적: ERSIYAN GAMES, ERSIYAN VIRTUAL, MINE LOGIC, VELSIEN SUMMIT와 관련 개인정보·기업 페이지의 라우트, 소스, 자산, SEO, 검증, 정적 Cloudflare 배포 관계를 한눈에 찾는 것
- GraphRAG 최초 검증 근거 기준일: 2026-09-13. 라우트 지도는 2026-09-22 소스의 정식 URL 17개에 맞춰 갱신했습니다. `manifest.json`의 `validation`은 9월 13일 역사 기록이고, `currentValidation`은 9월 23일 배포 스냅샷과 후속 변경 대기 상태를 구분합니다.
- 2026-09-19 로컬·GitHub·운영 사이트 재대조 결과: [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md). 이후 변경은 새로 검증해야 합니다.
- 상세 그래프: `graph-rag/manifest.json`, `graph-rag/nodes.jsonl`, `graph-rag/edges.jsonl`, `graph-rag/chunks.jsonl`

## 읽는 순서

1. 이 파일에서 보존 정책과 라우트 지도를 확인합니다.
2. `graph-rag/manifest.json`에서 검증 근거 기준일과 2026-09-22 라우트 지도 갱신일, 색인 경계, 정리 상태를 확인합니다. `/virtual` 모집과 VELSIEN 세계관 문구는 현행 소스를 우선합니다.
3. 필요한 route·file·component 노드를 `graph-rag/nodes.jsonl`에서 찾습니다. 9월 22일 이후 변경은 소스와 사이트맵에서 추가 확인합니다.
4. `graph-rag/edges.jsonl`에서 `renders`, `imports`, `has_metadata`, `tested_by`, `preserves` 관계를 따라갑니다.
5. 최신 판단 근거는 `manifest.json`의 `currentValidation`과 `graph-rag/chunks.jsonl`에서 확인합니다. `outputs/seo-audit-2026-09-13/SEO-AUDIT-REPORT.md`는 과거 기록이며 계정 화면·검색 보고서 전문은 GraphRAG에 복사하지 않습니다.

## 사이트 경계

| 영역 | 대표 라우트 | 소유 소스 | 정책 |
|---|---|---|---|
| ERSIYAN GAMES | `/` | `app/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 브랜드·게임 허브 |
| ERSIYAN VIRTUAL | `/virtual` | `app/virtual/page.tsx`, `app/_components/VirtualRecruitment.tsx`, `VirtualRecruitment.module.css`, `virtual-recruitment-config.ts`, 기존 `app/home.css` | 공통 홈페이지 틀을 유지하고 본문 내부만 다듬은 CHZZK 3D 버츄얼 0기 1명 모집 안내. 공개 본문은 모집 개요·준비 과정·지원 방법을 설명하며 지원은 Google Forms로 연결. 구체적인 계약 조건은 지원서에서 안내 |
| MINE LOGIC | `/mine-logic` | `app/mine-logic/page.tsx` | Android 오프라인 지뢰찾기 제품 페이지 |
| VELSIEN SUMMIT | `/velsien-summit` | `app/velsien-summit/page.tsx`, `VelsienSignalDeck.tsx` | 게임·세계관·개발 기록 허브 |
| 최신 공개 세계관 | `/velsien-summit/world` | `app/velsien-summit/world/page.tsx` | 현재 공개 세계관. 기존 허브에서 연결하는 별도 정식 페이지 |
| 2026년 8월 개발 화면 | `/velsien-summit#devlog-2026-08-late` | `app/velsien-summit/page.tsx` | 3개 화면을 허브 개발 기록으로 통합. 이전 `/late-update` 주소는 허브로 301 이동 |
| Secret 시각 자료 | `/velsien-summit/secret` | `app/velsien-summit/secret/page.tsx` | searchable-but-unlisted 기록 보관 페이지. 임의로 noindex 처리하지 않음 |
| 기업 홈페이지 | `/velsien-summit/corporate/orysen`, `/virenta`, `/neryx` | 각 기업 `page.tsx`, `*Experience.tsx`, `*.module.css` | 독립 UI·콘텐츠·맞춤 푸터 보존. 세계관의 기업 소개에서 세 홈페이지로 연결하고 각 맞춤 푸터에서 세계관으로 돌아감. 정적 클릭 이동은 일반 `<a>` 사용. 공통 푸터로 합치지 않음 |
| 개인정보 | `/privacy`, `/privacy/mine-logic` | 각 `page.tsx`, `MineLogicPrivacyContent.tsx` | 2026-09-22 Google Forms 지원서와 음성 첨부 처리 안내. 게임 정책과 대표자 `탁진` 보존 |
| 보관본 | `/privacy/archive/2026-08-22`, `/2026-08-23`, `/2026-08-28`, `/2026-08-31`, `/2026-09-05`, `/2026-09-19` | 각 보관 `page.tsx` | 역사 기록 보존. 9월 19일 이메일 모집 방침은 별도 보관하고 현재 Google Forms 안내와 구분 |

## 정식 라우트 목록

2026-09-22 소스 기준 정식 URL은 최신 세계관과 9월 19일 개인정보 보관본을 포함해 17개입니다. `/virtual`의 지원 경로는 Google Forms이며 이메일은 모집 문의에 사용합니다. 변경한 페이지의 실제 변경일만 사이트맵에 반영합니다. 9월 23일 최종 버츄얼 본문·배너를 포함한 `a3a6d985` 버전은 배포와 운영 대조를 통과했습니다. `graph-rag/manifest.json`의 `validation`과 `currentValidation`으로 과거 검증과 최신 스냅샷을 구분합니다.

`/`, `/virtual`, `/mine-logic`, `/privacy`, `/privacy/mine-logic`, `/privacy/archive/2026-08-22`, `/privacy/archive/2026-08-23`, `/privacy/archive/2026-08-28`, `/privacy/archive/2026-08-31`, `/privacy/archive/2026-09-05`, `/privacy/archive/2026-09-19`, `/velsien-summit`, `/velsien-summit/world`, `/velsien-summit/secret`, `/velsien-summit/corporate/orysen`, `/velsien-summit/corporate/virenta`, `/velsien-summit/corporate/neryx`.

`/404`와 기존 `/velsien-summit/late-update`, legacy `.html`, `/index`, `/games`, trailing-slash 별칭은 배포 리다이렉트·404 계약으로만 취급합니다. 검색용 정식 페이지로 중복 등록하지 않습니다.

## SEO와 배포 연결

- 전역 metadata: `app/layout.tsx`
- 홈·VIRTUAL metadata와 JSON-LD: `app/page.tsx`, `app/virtual/page.tsx`, `app/_components/HomeContent.tsx`
- VIRTUAL 본문과 지원 주소: `app/_components/VirtualRecruitment.tsx`, `virtual-recruitment-config.ts`. `HomeContent.tsx`가 본문을 연결하고 기존 `app/home.css` 클래스를 사용합니다. `VirtualRecruitment.module.css`는 본문 안의 모바일 글자 크기·정보 행·과제 간격·포커스만 보정합니다. `HomeExperience.tsx`의 공통 헤더·사업부 이동·회사 정보·푸터와 게임부 화면은 유지합니다.
- 지원 주소 설정은 게시된 Google Forms 응답자용 URL을 사용합니다. 문항 구성 기준은 기본 필수 7개·필수가 아닌 방송 채널 1개·동의 2개이며, 방송 채널 제목에 “선택”을 붙이지 않습니다. 실제 문항은 게시된 폼에서 별도 검증합니다.
- 지원서 배너: `public/images/virtual/ersiyan-gen0-form-header.png`, 편집 원본 `.svg`, 재생성 스크립트 `scripts/render-virtual-form-banner.py`. 웹 소셜 카드와 지원서 배너는 용도가 다릅니다.
- 지원서 헤더는 공식 별 마크·ERSIYAN 로고와 “에르시안 버츄얼 / 0기 크리에이터 모집” 문구로 교체했습니다. 2026-09-23 새 PNG 42,521바이트를 업로드·저장한 뒤 게시된 응답자 화면 1904·390px에서 실제 표시를 확인했습니다. 폼 테마색 `#c64035`·배경 `#f9eceb`를 적용하고 문항·폼 설정은 유지했습니다.
- 모집 페이지 비교·문구 결정 근거: `docs/virtual-recruitment-research-2026-09-22.md`. 공개 홈페이지에는 세부 계약 비율·장비 반환 조건을 반복하지 않고 지원서에서 확인하게 합니다.
- MINE LOGIC metadata·`VideoGame`·`MobileApplication`·`BreadcrumbList`: `app/mine-logic/page.tsx`
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

2026-09-23 최종 모집 본문·배너 소스는 TypeScript·lint·17개 라우트 빌드, rendered HTML 21/21·정적 계약 6/6·legacy 3/3·Naver 계약 8/8을 통과했습니다. 로컬 Chrome 1440px 첫 화면·지원 버튼, 768px 정보 행·지원 대상, 390px 첫 화면·지원 안내·하단을 확인했고 가로 넘침 없이 모바일 본문 16px·지원 버튼 높이 49px을 확인했습니다. 공통 내비게이션은 유지했습니다. 최종 Cloudflare 배포 `a3a6d985-8094-4957-904e-238e084791a0`의 운영 verifier는 exit 0으로 17개 정식 URL·사이트맵·모든 라우트와 자산·별칭·404·llms.txt 검사를 통과했습니다. 실제 운영 화면도 360px·동작 줄이기 설정에서 가로 넘침 0·Forms 링크 3개·공통 틀 유지를 확인했습니다. 앞선 `8a88bb35` 배포 기록은 별도로 보존합니다. verifier는 `--target-only --skip-idle`을 사용했으며 유휴 성능은 측정하지 않았습니다.

모집 내용 배포 후 Google은 정식 17개 URL의 개별 색인을 확인하고 6개 갱신 요청을 완료했습니다. 사이트맵 성공·발견 수 16은 지연된 집계입니다. 네이버는 기존 16개 색인·6개 재수집 접수·VIRTUAL 최신 메타데이터 색인을 확인했으며 신규 9월 19일 보관본은 수집 성공·미색인입니다. 마지막 스타일·반복 라벨 정리에는 검색 요청을 중복 제출하지 않았습니다.

아래는 2026-09-13 GraphRAG 생성 당시의 역사적 검증 기록입니다. 당시 소스 타입 검사와 JavaScript 구문 검사는 통과했고, 일회성 로컬 shim 빌드와 스테이징 후 rendered HTML 18/18, 정적 Cloudflare 계약 6/6, legacy route 3/3, Naver IndexNow 계약 8/8이 통과했습니다. 일반 `npm run build`와 `npm run build:cloudflare`는 당시 Windows 샌드박스의 Node `child_process.spawn` `EPERM`으로 중단됐습니다. 일회성 shim으로 당시 소스의 `vinext build` 5/5 단계와 16개 프리렌더 경로를 확인한 뒤 shim은 삭제했습니다. 이 기록은 새 세계관·VIRTUAL 모집 변경의 빌드 성공이나 운영 배포를 증명하지 않습니다. 현행 검증 결과는 이번 변경의 별도 테스트와 배포 확인으로 판단합니다.

## 보존·삭제 경계

- 반드시 보존: `.git`, `.openai/hosting.json`, `app`, `public`, `scripts`, `tests`, `worker`, package·TypeScript·Vite·Wrangler 설정, Google 소유권 파일, `local-private` 원본, 법적·검색 제출 증거, 최신 SEO 보고서, 배포에 필요한 `dist`·`node_modules`.
- 기업 3개: 오리센·비렌타·네릭스의 독립 화면과 맞춤 푸터를 공통 `ErFooter`로 통합하지 않습니다. 2026-09-19 사용자 지시로 세계관↔각 기업의 명시 링크만 추가했습니다. 정적 프리뷰에서 실제 클릭 이동을 보장하기 위해 해당 링크는 plain `<a>`를 사용합니다.
- `local-private`와 Chrome profile 내용은 GraphRAG에 넣지 않습니다.
- 삭제 승인 대상의 상세 상태는 `graph-rag/cleanup-candidates.md`를 따릅니다. 현재 파일 삭제는 자동 승인 사용량 제한으로 실행되지 않았으므로 `pending` 상태입니다.

## 대표자 법적 신원

공통 법적 프로필의 대표자는 `탁진`입니다. 현재 검색 근거는 `app/_components/business-profile.ts`, 개인정보 페이지, rendered HTML 테스트입니다.

## 다음 에이전트용 빠른 질문

- 페이지를 찾으려면 `route:` 노드를 검색합니다.
- 어떤 컴포넌트가 렌더링하는지 보려면 `renders`와 `imports`를 따라갑니다.
- 색인·canonical·JSON-LD는 `has_metadata`, `has_canonical`, `in_sitemap`을 따라갑니다.
- 기업 3개를 건드리기 전에는 `policy:corporate-independent`와 `preserves`를 먼저 확인합니다.
- 삭제 전에는 `sensitivity`, `runtime_dependency`, `evidence_value`, `cleanupStatus`를 확인합니다.
