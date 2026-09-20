# ERSIYAN / ApplePie site GraphRAG 시작점

## Summary

- 공식 도메인: `https://ersiyan.com`
- 저장소: `C:\Users\USER\Desktop\잡다한거\applepie-game-studio-site`
- 목적: ERSIYAN GAMES, ERSIYAN VIRTUAL, MINE LOGIC, VELSIEN SUMMIT와 관련 개인정보·기업 페이지의 라우트, 소스, 자산, SEO, 검증, 정적 Cloudflare 배포 관계를 한눈에 찾는 것
- GraphRAG 파일·검증 근거 기준일: 2026-09-13. 라우트 지도는 2026-09-20 소스의 정식 URL 16개에 맞춰 갱신했습니다. `manifest.json`의 빌드·운영 검증 수치는 9월 13일 당시 기록이며 현재 운영 사이트 상태를 뜻하지 않습니다.
- 2026-09-19 로컬·GitHub·운영 사이트 재대조 결과: [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md). 이후 변경은 새로 검증해야 합니다.
- 상세 그래프: `graph-rag/manifest.json`, `graph-rag/nodes.jsonl`, `graph-rag/edges.jsonl`, `graph-rag/chunks.jsonl`

## 읽는 순서

1. 이 파일에서 보존 정책과 라우트 지도를 확인합니다.
2. `graph-rag/manifest.json`에서 파일·검증 근거 기준일과 2026-09-20 라우트 지도 갱신일, 색인 경계, 정리 상태를 확인합니다. `/virtual` 모집과 VELSIEN 세계관 문구는 현행 소스를 우선합니다.
3. 필요한 route·file·component 노드를 `graph-rag/nodes.jsonl`에서 찾습니다. 9월 20일 이후 변경은 소스와 사이트맵에서 추가 확인합니다.
4. `graph-rag/edges.jsonl`에서 `renders`, `imports`, `has_metadata`, `tested_by`, `preserves` 관계를 따라갑니다.
5. 판단 근거는 `graph-rag/chunks.jsonl`과 `outputs/seo-audit-2026-09-13/SEO-AUDIT-REPORT.md`에서 확인합니다.

## 사이트 경계

| 영역 | 대표 라우트 | 소유 소스 | 정책 |
|---|---|---|---|
| ERSIYAN GAMES | `/` | `app/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 브랜드·게임 허브 |
| ERSIYAN VIRTUAL | `/virtual` | `app/virtual/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 0기 첫 소속 버츄얼 크리에이터 1명 모집 안내. 이메일 지원 조건은 현행 소스에서 확인 |
| MINE LOGIC | `/mine-logic` | `app/mine-logic/page.tsx` | Android 오프라인 지뢰찾기 제품 페이지 |
| VELSIEN SUMMIT | `/velsien-summit` | `app/velsien-summit/page.tsx`, `VelsienSignalDeck.tsx` | 게임·세계관·개발 기록 허브 |
| 최신 공개 세계관 | `/velsien-summit/world` | `app/velsien-summit/world/page.tsx` | 현재 공개 세계관. 기존 허브에서 연결하는 별도 정식 페이지 |
| 2026년 8월 개발 화면 | `/velsien-summit#devlog-2026-08-late` | `app/velsien-summit/page.tsx` | 3개 화면을 허브 개발 기록으로 통합. 이전 `/late-update` 주소는 허브로 301 이동 |
| Secret 시각 자료 | `/velsien-summit/secret` | `app/velsien-summit/secret/page.tsx` | searchable-but-unlisted 기록 보관 페이지. 임의로 noindex 처리하지 않음 |
| 기업 홈페이지 | `/velsien-summit/corporate/orysen`, `/virenta`, `/neryx` | 각 기업 `page.tsx`, `*Experience.tsx`, `*.module.css` | 독립 UI·콘텐츠·맞춤 푸터 보존. 세계관의 기업 소개에서 세 홈페이지로 연결하고 각 맞춤 푸터에서 세계관으로 돌아감. 정적 클릭 이동은 일반 `<a>` 사용. 공통 푸터로 합치지 않음 |
| 개인정보 | `/privacy`, `/privacy/mine-logic` | 각 `page.tsx`, `MineLogicPrivacyContent.tsx` | 2026-09-19 모집 이메일 지원 자료 처리 안내와 대표자 `탁진` 보존 |
| 보관본 | `/privacy/archive/2026-08-22`, `/2026-08-23`, `/2026-08-28`, `/2026-08-31`, `/2026-09-05` | 각 보관 `page.tsx` | 역사 기록 보존. 현재 문서와 혼동하지 않음 |

## 정식 라우트 목록

2026-09-20 소스 기준 정식 URL은 최신 세계관과 9월 5일 개인정보 보관본을 포함해 16개입니다. `/virtual`은 0기 첫 소속 크리에이터 1명의 이메일 지원을 안내하며, 사이트맵 변경일은 2026-09-20입니다. 운영 반영 여부는 배포 후 검증 결과로 판단합니다. `graph-rag/manifest.json`의 라우트 수는 현행 소스 지도이며, 검증 결과는 9월 13일 기록입니다.

`/`, `/virtual`, `/mine-logic`, `/privacy`, `/privacy/mine-logic`, `/privacy/archive/2026-08-22`, `/privacy/archive/2026-08-23`, `/privacy/archive/2026-08-28`, `/privacy/archive/2026-08-31`, `/privacy/archive/2026-09-05`, `/velsien-summit`, `/velsien-summit/world`, `/velsien-summit/secret`, `/velsien-summit/corporate/orysen`, `/velsien-summit/corporate/virenta`, `/velsien-summit/corporate/neryx`.

`/404`와 기존 `/velsien-summit/late-update`, legacy `.html`, `/index`, `/games`, trailing-slash 별칭은 배포 리다이렉트·404 계약으로만 취급합니다. 검색용 정식 페이지로 중복 등록하지 않습니다.

## SEO와 배포 연결

- 전역 metadata: `app/layout.tsx`
- 홈·VIRTUAL metadata와 JSON-LD: `app/page.tsx`, `app/virtual/page.tsx`, `app/_components/HomeContent.tsx`
- MINE LOGIC metadata·`VideoGame`·`MobileApplication`·`BreadcrumbList`: `app/mine-logic/page.tsx`
- VELSIEN metadata·구조화 데이터: `app/velsien-summit/page.tsx`, `app/velsien-summit/world/page.tsx`, `app/velsien-summit/secret/page.tsx`
- 검색 제어: `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `public/_redirects`
- 보안·캐시 헤더: `public/_headers`
- 정적 빌드와 Cloudflare Worker: `vite.config.ts`, `worker/index.ts`, `wrangler.cloudflare.jsonc`, `scripts/stage-static-routes.mjs`, `scripts/verify-cloudflare-deployment.mjs`
- 최신 SEO 인포그래픽·보고서: `outputs/seo-audit-2026-09-13/SEO-BEFORE-AFTER.svg`, `SEO-AUDIT-REPORT.md`

## 검증 계약

- 타입 검사: `npx.cmd tsc --noEmit --incremental false`
- HTML·metadata·footer·JSON-LD: `node tests/rendered-html.test.mjs`
- 정적 Cloudflare 계약: `node tests/cloudflare-static.test.mjs`
- legacy route: `node tests/legacy-division-route.test.mjs`
- Naver IndexNow 계약: `node tests/naver-indexnow.test.mjs`
- 전체 빌드·검증: `npm run build:cloudflare`

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
