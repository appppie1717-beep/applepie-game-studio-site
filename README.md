# ERSIYAN 공식 홈페이지

에르시안 공식 홈페이지의 소스 저장소입니다. 정식 주소는 `https://ersiyan.com`이며 Cloudflare Workers Static Assets에서 제공합니다. 작업을 시작할 때 [PROJECT_GRAPH_RAG_INDEX.md](PROJECT_GRAPH_RAG_INDEX.md)를 먼저 읽고, 라우트·자산·보존 정책은 `graph-rag/`에서 확인합니다.

## 현재 사이트 구성

2026년 9월 30일 승인된 회사 우선 화면을 기준으로 정식 URL은 **28개**, 개인정보 보관본은 **7개**, 개별 공지는 **8개**입니다. `/404`는 오류 페이지이며 사이트맵에 넣지 않습니다.

| 영역 | 정식 경로와 역할 |
| --- | --- |
| 회사 홈 | `/` — 회사 소개, 게임부·버츄얼부 선택, 사업자 정보, 연혁 |
| 게임부 | `/games` — ERSIYAN GAMES, 출시·개발 게임, 제작 원칙 |
| 버츄얼부 | `/virtual` — CHZZK에서 활동할 0기 3D 크리에이터 1명 모집 안내 |
| 게임 상세 | `/mine-logic`, `/velsien-summit` |
| 세계관·시각 자료 | `/velsien-summit/world`, `/velsien-summit/secret` |
| 독립 기업 홈페이지 | `/velsien-summit/corporate/orysen`, `/velsien-summit/corporate/virenta`, `/velsien-summit/corporate/neryx` |
| 공지사항 | `/notices`와 개별 글 8개. 목록은 같은 크기의 행으로 표시 |
| 개인정보처리방침 | `/privacy`, `/privacy/mine-logic` |
| 개인정보 보관본 | `/privacy/archive/` 아래 `2026-08-22`, `2026-08-23`, `2026-08-28`, `2026-08-31`, `2026-09-05`, `2026-09-19`, `2026-09-22` |

`/company`는 회사 홈 `/`으로 301 이동하는 옛 주소입니다. `/games`는 독립된 정식 페이지입니다. 8월 개발 화면은 벨시엔 허브의 개발 기록으로 통합했고, 옛 `/velsien-summit/late-update` 주소는 허브로 301 이동합니다. `.html`, `/index`, trailing slash 별칭은 별도 정식 문서로 등록하지 않습니다. 전체 주소는 GraphRAG 시작점과 `public/sitemap.xml`에서 확인합니다.

버츄얼부는 “지원 접수 일시 중단”과 회색 “지원서 작성하기” 버튼, “(모집 일시중단)” 표시를 유지합니다. **기존 Google Forms 링크는 활성 상태**이며 이메일은 모집 문의에 사용합니다. 구체적인 계약 조건은 지원서에서 안내합니다. 홈페이지의 상태 표시와 실제 폼 설정은 별개입니다.

## 보존할 내용

- 오리센·비렌타·네릭스의 독립 UI·콘텐츠·맞춤 푸터를 공통 `ErFooter`로 합치지 않습니다. 세계관과 기업 홈페이지 사이의 이동은 일반 `<a>`를 사용합니다.
- 공통 법적 상호는 `에르시안`, 대표자는 `탁진`입니다. 공통 푸터 변경 시 `ErFooter.tsx`와 `business-profile.ts`, 개인정보 방침과 테스트를 함께 확인합니다.
- 개인정보 보관본 7개는 당시 정책을 보존하는 법적 기록입니다. 오래됐다는 이유로 삭제하거나 현행 방침으로 덮어쓰지 않습니다. 공지의 원래 게시일과 실제 수정일도 구분합니다.
- 브랜드 로고, MINE LOGIC 등록용 원본 PNG와 승인된 게임 이미지, WebP 파생본을 함께 보존합니다. 벨시엔 Secret에는 GitHub와 통합한 개발 캡처 4개가 포함되어 있습니다.
- 기존 `applepie.im` Worker와 OpenAI Sites 버전, Google 사이트 인증 TXT는 이전·롤백 기록입니다. 변경이나 삭제는 별도로 검토합니다.

사업자 연락처 등 공개 승인된 법적 정보는 푸터에 표시합니다. 사업자등록증·신고증 원본, 정부 문서확인번호, 개인 금융 자료, 비밀키와 계정·브라우저 세션은 공개 소스에 넣지 않습니다.

## 로컬과 GitHub를 맞추는 기준

같게 유지할 대상은 **추적하는 소스·공개 자산·문서·테스트·설정 파일의 경로와 내용**입니다. `app/`, `public/`, `scripts/`, `tests/`, `worker/`, `docs/`, `graph-rag/`와 루트 설정·잠금 파일이 이에 해당합니다. 삭제된 추적 파일도 GitHub에 반영해야 합니다.

`.git/`, `node_modules/`, `dist/`, `.next/`, `.vinext/`, `.wrangler/`, 빌드 캐시, `outputs/`, `work/`, `local-private/`, 환경 파일과 자격 증명은 로컬 전용 또는 생성물입니다. 이들을 제외한 소스의 일치를 확인하며, 컴퓨터의 모든 파일을 GitHub에 올려 물리적으로 같은 폴더를 만들지 않습니다. 제외 범위는 `.gitignore`에서 관리합니다.

2026년 10월 7일 대조 시작 시 GitHub `main`은 `e36ffae`입니다. 로컬에는 9월 30일 승인된 회사 우선 구조·정식 게임부·공지 화면이 있고, 현재 운영의 10월 3일 버전 `6becd6c4`에는 그보다 새로운 회사·게임부·VIRTUAL 문구, FAQ 4개, 검색정보와 브랜드 소셜 이미지가 있습니다. 정식 28개 운영 HTML과 로컬 빌드를 비교해 **GitHub의 공통 소스, 로컬의 승인된 구조·법적 보관본, 현재 운영의 최신 문구·SEO·소셜 자산을 통합 기준으로 선택**합니다. 커밋 날짜나 파일 수정 시각만으로 어느 한쪽 전체를 덮어쓰지 않습니다.

운영에서 복원한 `public/ersiyan-brand-social.jpg`는 1200×630 브랜드 소셜 이미지입니다. 기존 공개 이미지와 용도별 메타데이터 참조를 함께 확인합니다. **2026년 10월 8일 사용자 승인 후 검수 커밋 f973b37을 GitHub main에 반영하고 운영 배포·검증을 완료했습니다.** 활성 Cloudflare 버전은95abc6ee-a368-475d-9cbb-d1901f1196bf(태그f973b37)이며 운영28개 HTML은 최종 빌드와 SHA256까지 동일합니다. 최종 문서 기록 커밋은 배포된 실행 코드를 바꾸지 않습니다.

과거 대조는 [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md)에 있습니다. 당시 원격의 Secret 개발 캡처 4개와 로컬의 이후 변경을 통합했습니다. 그 보고서의 15개 정식 경로·검증 수는 당시 기록이며 현재 주소의 검증 결과로 사용하지 않습니다.

작업 전 `git status`로 미커밋 변경을 확인합니다. `git fetch origin`으로 원격을 읽은 뒤 파일 내용을 비교하고, 미커밋 수정이 있는 상태에서 강제 초기화나 전체 덮어쓰기를 하지 않습니다. GitHub에서 직접 수정할 때도 새 브랜치를 사용하고 로컬 변경과 대조한 뒤 합칩니다.

## 로컬 실행과 검증

Node.js 22.13 이상이 필요합니다. 잠금 파일에 맞춰 설치하고 개발 화면을 엽니다.

```powershell
npm ci
npm run dev
```

다음 명령은 로컬 검증이며 운영 배포를 실행하지 않습니다. HTML 계약은 새로 빌드한 `dist/client`를 대상으로 실행합니다.

```powershell
npx.cmd tsc --noEmit --incremental false
npm run lint
npm run build:cloudflare
node tests/rendered-html.test.mjs
node tests/cloudflare-static.test.mjs
node tests/legacy-division-route.test.mjs
node tests/naver-indexnow.test.mjs
node graph-rag/validate.mjs
git diff --check
```

`npm run build:cloudflare`는 프로덕션 빌드·정적 라우트 준비와 Cloudflare 정적 계약을 실행합니다. `npm test`는 새 빌드와 네 계약을 한 번에 실행합니다. 회사 홈·게임부·버츄얼부, 공지, 개인정보와 보관본, 기업 페이지, metadata·canonical·JSON-LD, 이미지, 리다이렉트·404·robots·sitemap·`llms.txt`를 확인합니다. 빌드가 실패했다면 남은 `dist`를 최신 결과로 취급하지 않습니다.

별도 터미널에서 `npm run dev:cloudflare`로 정적 프리뷰를 열고 Wrangler가 출력한 실제 로컬 주소로 검사합니다. 아래 `8787`은 예시 포트입니다.

```powershell
node scripts/verify-cloudflare-deployment.mjs --target http://127.0.0.1:8787 --target-only --skip-idle
```

자동 계약과 실제 화면 검수는 별도로 기록합니다. 데스크톱·모바일에서 회사 홈의 사업부 이동, 공지 목록·상세, VIRTUAL의 활성 Forms 링크, 개인정보 보관본 복귀, 기업 홈페이지 이동과 가로 넘침을 확인합니다. `--skip-idle`은 장시간 유휴 성능 검사를 생략합니다.

## 최적화와 유지보수

정적 페이지 사이의 이동에는 일반 `<a>`를 사용합니다. 검색용 본문은 초기 HTML에 제공하고 CSS는 외부 파일의 캐시를 사용합니다. 이미지 정리 시 직접 참조뿐 아니라 `srcSet`과 동적으로 만든 경로도 확인합니다. 원본과 반응형 WebP를 보존하며 벨시엔 첫 화면의 preload는 데스크톱 폭 1061px 이상에만 적용합니다.

벨시엔의 420px 이하 화면은 세계관·전투·개발 기록에 `content-visibility: auto`를 적용합니다. 본문과 앵커 이동은 유지하며 데스크톱·인쇄는 기존 렌더링을 사용합니다. 큰 콘텐츠를 추가하면 320·375·390px의 실제 높이와 앵커 이동을 다시 측정해 CSS 예약 높이를 확인합니다. 2026년 9월 5일의 이미지·성능 판단 근거는 로컬 `outputs/seo-polish-2026-09-05/`의 역사 기록입니다.

모집 본문은 `VirtualRecruitment.tsx`, 공통 스타일은 `app/home.css`, 본문 내부 보정은 `VirtualRecruitment.module.css`, 지원 주소는 `virtual-recruitment-config.ts`에서 관리합니다. 공개 문구 결정은 [모집 페이지 비교 보고서](docs/virtual-recruitment-research-2026-09-22.md)를 참고합니다. 지원서 배너 PNG·편집용 SVG는 `public/images/virtual/ersiyan-gen0-form-header.*`이며 `python scripts/render-virtual-form-banner.py`로 다시 생성합니다. Pillow와 Windows Arial·맑은 고딕 글꼴이 필요합니다.

## 승인 후 수동 배포

검증과 화면 검수를 마친 결과를 사용자에게 제시하고 **배포 직전에 명시적인 승인을 받습니다**. GitHub 반영도 별도 승인된 범위로 실행합니다. GitHub 소스 동기화와 운영 배포 결과를 각각 확인합니다.

운영 설정은 `wrangler.cloudflare.jsonc`의 `ersiyan-com-static`입니다. 서버 엔트리·바인딩 없이 `dist/client`의 정적 자산을 배포합니다. 다음 명령은 운영 사이트를 변경하므로 승인 후에만 실행합니다.

```powershell
npm run deploy:cloudflare
```

승인된 소스를 새로 빌드해 배포한 다음 운영 문서·자산·별칭·404·사이트맵을 대조합니다.

```powershell
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8 --skip-idle
```

유휴 성능도 측정할 때는 마지막 `--skip-idle`을 빼고 실행합니다. 새 도메인의 HTTP·www와 옛 도메인은 경로·쿼리를 보존해 새 HTTPS 주소로 한 번만 301 이동해야 합니다. `--reference`는 별도 사본이 현재 빌드와 같은 내용일 때만 사용합니다.

2026년 9월 30일 회사 우선 화면의 최종 배포 `63c30c0f-93f9-4ca1-92ae-a25b2d17052f`는 당시 28개 정식 URL, 29개 프리렌더와 45개 계약을 통과했습니다. 이후 10월 3일 운영 버전의 문구·검색정보·소셜 자산을 이번 소스 대조에서 발견했습니다. 9월 30일 검증 수는 과거 근거이며 이번 통합본의 새 빌드·운영 검증을 대신하지 않습니다. 당시 상세 기록은 `graph-rag/manifest.json`과 로컬 `outputs/company-first-home-2026-09-30/`에 있습니다.

## 검색 변경 통지

`npm run notify:naver -- --url https://ersiyan.com/virtual`은 네트워크 요청 없이 대상을 검사합니다. 승인된 배포·운영 검증 후 실제 변경한 정식 주소만 지정해 `--submit --out outputs/새-접수기록.json`으로 제출합니다. 기록 폴더를 미리 만들고 기존 기록은 덮어쓰지 않습니다. Google·Naver 계정에서의 검색 제출도 승인된 범위로 수행합니다.

IndexNow의 HTTP 200·202와 사이트맵 접수는 실제 색인·최신 검색 문구·노출 순위를 뜻하지 않습니다. 제출, 수집, 색인, 검색 결과 반영과 성능 측정을 구분합니다. [네이버 공식 안내](https://searchadvisor.naver.com/guide/indexnow-about)

## 주요 소스

| 파일 | 역할 |
| --- | --- |
| `app/page.tsx`, `app/company/company.module.css`, `CompanyHistory.tsx` | 회사 홈·연혁 |
| `app/games/page.tsx`, `HomeContent.tsx`, `HomeExperience.tsx` | 게임부·사업부 본문과 공통 헤더 |
| `app/virtual/page.tsx`, `VirtualRecruitment.tsx`, `virtual-recruitment-config.ts` | 버츄얼부·모집·지원 경로 |
| `app/_components/notices.ts`, `app/notices/` | 공지 데이터·목록·8개 상세 글 |
| `ErFooter.tsx`, `business-profile.ts` | 공통 푸터·법적 신원 |
| `app/mine-logic/page.tsx`, `app/velsien-summit/` | 게임 상세·세계관·기업·시각 자료 |
| `app/privacy/` | 현행 개인정보 방침과 7개 보관본 |
| `public/images/`, `public/ersiyan-social-card.jpg`, `public/ersiyan-brand-social.jpg` | 공개 이미지·용도별 소셜 카드 |
| `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`, `public/_redirects`, `public/_headers` | 검색·리다이렉트·보안·캐시 설정 |
| `scripts/stage-static-routes.mjs`, `scripts/verify-cloudflare-deployment.mjs` | 정적 빌드 준비·배포 검증 |

표에서 디렉터리가 생략된 공통 컴포넌트는 `app/_components/`에 있습니다.
