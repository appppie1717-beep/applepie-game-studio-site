# ERSIYAN / ApplePie site GraphRAG 시작점

## Summary

- 공식 도메인: `https://ersiyan.com`
- 저장소: `C:\Users\USER\Desktop\잡다한거\applepie-game-studio-site`
- 목적: ERSIYAN GAMES, ERSIYAN VIRTUAL, MINE LOGIC, VELSIEN SUMMIT와 관련 개인정보·기업 페이지의 라우트, 소스, 자산, SEO, 검증, 정적 Cloudflare 배포 관계를 한눈에 찾는 것
- 기준일: 2026-09-13
- 2026-09-19 로컬·GitHub·운영 사이트 재대조 결과: [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md). 아래 검증 수치와 manifest는 9월 13일 당시의 기록입니다.
- 상세 그래프: `graph-rag/manifest.json`, `graph-rag/nodes.jsonl`, `graph-rag/edges.jsonl`, `graph-rag/chunks.jsonl`

## 읽는 순서

1. 이 파일에서 보존 정책과 라우트 지도를 확인합니다.
2. `graph-rag/manifest.json`에서 생성 시점, 색인 경계, 정리 상태를 확인합니다.
3. 필요한 route·file·component 노드를 `graph-rag/nodes.jsonl`에서 찾습니다.
4. `graph-rag/edges.jsonl`에서 `renders`, `imports`, `has_metadata`, `tested_by`, `preserves` 관계를 따라갑니다.
5. 판단 근거는 `graph-rag/chunks.jsonl`과 `outputs/seo-audit-2026-09-13/SEO-AUDIT-REPORT.md`에서 확인합니다.

## 사이트 경계

| 영역 | 대표 라우트 | 소유 소스 | 정책 |
|---|---|---|---|
| ERSIYAN GAMES | `/` | `app/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 브랜드·게임 허브 |
| ERSIYAN VIRTUAL | `/virtual` | `app/virtual/page.tsx`, `app/_components/HomeExperience.tsx`, `app/_components/HomeContent.tsx` | 버츄얼·디지털 캐릭터 준비 영역. 공개된 상세 정보만 사용 |
| MINE LOGIC | `/mine-logic` | `app/mine-logic/page.tsx` | Android 오프라인 지뢰찾기 제품 페이지 |
| VELSIEN SUMMIT | `/velsien-summit` | `app/velsien-summit/page.tsx`, `VelsienSignalDeck.tsx` | 게임·세계관·개발 기록 허브 |
| 추가 개발 기록 | `/velsien-summit/late-update` | `app/velsien-summit/late-update/page.tsx` | 날짜를 확인할 수 있는 기록만 구조화 |
| Secret 기록 | `/velsien-summit/secret` | `app/velsien-summit/secret/page.tsx` | searchable-but-unlisted 정책. 임의로 noindex 처리하지 않음 |
| 기업 홈페이지 | `/velsien-summit/corporate/orysen`, `/virenta`, `/neryx` | 각 기업 `page.tsx`, `*Experience.tsx`, `*.module.css` | 사용자 지시로 독립 UI·콘텐츠·푸터 보존. 공통 푸터로 합치지 않음. 정적 클릭 라우팅을 위해 Experience 내부 이동 링크는 plain `<a>`를 사용 |
| 개인정보 | `/privacy`, `/privacy/mine-logic` | 각 `page.tsx`, `MineLogicPrivacyContent.tsx` | 현재 법적 문서 및 대표자 `탁진` 보존 |
| 보관본 | `/privacy/archive/2026-08-22`, `/2026-08-23`, `/2026-08-28`, `/2026-08-31` | 각 보관 `page.tsx` | 역사 기록 보존. 현재 문서와 혼동하지 않음 |

## 정식 라우트 목록

`public/sitemap.xml` 기준 정식 URL은 15개입니다.

`/`, `/virtual`, `/mine-logic`, `/privacy`, `/privacy/mine-logic`, `/privacy/archive/2026-08-22`, `/privacy/archive/2026-08-23`, `/privacy/archive/2026-08-28`, `/privacy/archive/2026-08-31`, `/velsien-summit`, `/velsien-summit/late-update`, `/velsien-summit/secret`, `/velsien-summit/corporate/orysen`, `/velsien-summit/corporate/virenta`, `/velsien-summit/corporate/neryx`.

`/404`와 legacy `.html`, `/index`, `/games`, trailing-slash 별칭은 배포 리다이렉트·404 계약으로만 취급합니다. 검색용 정식 페이지로 중복 등록하지 않습니다.

## SEO와 배포 연결

- 전역 metadata: `app/layout.tsx`
- 홈·VIRTUAL metadata와 JSON-LD: `app/page.tsx`, `app/virtual/page.tsx`, `app/_components/HomeContent.tsx`
- MINE LOGIC metadata·`VideoGame`·`MobileApplication`·`BreadcrumbList`: `app/mine-logic/page.tsx`
- VELSIEN `VideoGame`·`WebPage`·`Article`·`BreadcrumbList`: `app/velsien-summit/page.tsx`, `app/velsien-summit/late-update/page.tsx`
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

2026-09-13 기준 소스 타입 검사와 JavaScript 구문 검사는 통과했습니다. 최신 shim 빌드와 스테이징 후 rendered HTML은 18/18, 정적 Cloudflare 계약은 6/6, legacy route는 3/3, Naver IndexNow 계약은 8/8로 통과했습니다. 일반 `npm run build`와 `npm run build:cloudflare`는 이 Windows 샌드박스에서 Node 내부 `child_process.spawn`의 `EPERM`으로 중단되며, 일회성 로컬 검증 shim으로 최신 소스의 `vinext build` 5/5 단계와 16개 프리렌더 경로를 확인한 뒤 shim은 삭제했습니다. 외부 배포 완료나 일반 빌드 성공으로 표시하지 않습니다. 라이브 `ersiyan.com`은 최신 로컬 산출물과 드리프트되어 있어 배포 후 15개 경로를 다시 확인해야 합니다.

## 보존·삭제 경계

- 반드시 보존: `.git`, `.openai/hosting.json`, `app`, `public`, `scripts`, `tests`, `worker`, package·TypeScript·Vite·Wrangler 설정, Google 소유권 파일, `local-private` 원본, 법적·검색 제출 증거, 최신 SEO 보고서, 배포에 필요한 `dist`·`node_modules`.
- 기업 3개: 오리센·비렌타·네릭스의 독립 페이지와 맞춤 푸터를 수정하거나 공통 `ErFooter`로 통합하지 않습니다. 정적 프리뷰에서 실제 클릭 이동을 보장하기 위해 Experience 내부 이동 링크만 plain `<a>`로 유지합니다.
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
