# ERSIYAN 공식 홈페이지

에르시안 공식 홈페이지의 소스 저장소입니다. 공식 주소는 https://ersiyan.com 이며 Cloudflare Workers Static Assets에서 제공합니다. 작업을 시작할 때 [PROJECT_GRAPH_RAG_INDEX.md](PROJECT_GRAPH_RAG_INDEX.md)와 GraphRAG의 담당 소스·보존 정책을 확인합니다.

## 현재 사이트

정식 URL은 28개입니다. 오류 페이지 /404는 사이트맵에 포함하지 않습니다.

| 영역 | 정식 경로와 역할 |
| --- | --- |
| 회사 홈 | / — 회사 소개, 사업부 선택, 사업자 정보, 연혁 |
| 게임부·버츄얼부 | /games, /virtual |
| 게임 상세 | /mine-logic, /velsien-summit |
| 벨시엔 세계관·시각 자료 | /velsien-summit/world, /velsien-summit/secret |
| 독립 기업 홈페이지 | /velsien-summit/corporate/orysen, /virenta, /neryx |
| 공지 | /notices와 개별 글 8개 |
| 개인정보처리방침 | /privacy, /privacy/mine-logic과 법적 보관본 7개 |

/company는 회사 홈으로, /velsien-summit/late-update는 벨시엔 허브로 301 이동합니다. 별칭은 정식 문서에 포함하지 않습니다. 전체 주소는 public/sitemap.xml과 GraphRAG의 route 노드에서 확인합니다.

## 보존할 내용

- 오리센·비렌타·네릭스는 각각 독립 UI·콘텐츠·맞춤 푸터를 유지합니다. 공통 ErFooter로 합치거나 승인 없이 화면·문구·SEO를 바꾸지 않습니다. 정적 내부 이동에는 일반 a 링크를 사용합니다.
- 공통 법적 상호는 에르시안, 대표자는 탁진입니다. 공통 푸터 변경 시 app/_components/ErFooter.tsx와 business-profile.ts, 개인정보 방침과 테스트를 함께 확인합니다.
- 공개 개인정보 보관본 7개는 당시 정책을 보존합니다. 공지의 원래 게시일과 실제 수정일을 구분하고, 오래됐다는 이유로 서비스 콘텐츠를 삭제하지 않습니다.
- 벨시엔 Secret은 검색 가능하지만 일반 메뉴에는 노출하지 않는 공개 페이지입니다. 승인된 개발 캡처·이미지 원본·반응형 WebP·동적 srcSet 참조를 유지합니다.
- local-private/velsien-summit의 비공개 이미지 원본은 scripts/prepare-velsien-responsive.mjs의 입력입니다. 생성물만 보고 원본을 삭제하지 않습니다.
- 사업자등록증·신고증 원본, 정부 문서확인번호, 개인 금융 자료, 비밀키와 계정·브라우저 세션은 공개 소스와 GraphRAG에 넣지 않습니다.

## 버츄얼부 공개 범위

/virtual은 CHZZK에서 활동할 0기 3D 크리에이터 1명 모집을 안내합니다. 회색 지원 버튼·지원 접수 일시 중단 문구·작은 모집 상태 표시는 유지하며 기존 Google Forms 링크는 활성 상태입니다. 홈페이지 표시와 실제 폼 설정은 별개입니다. 이메일은 모집 문의에 사용합니다.

승인된 활동·지원 안내와 FAQ만 공개합니다. 구체적인 계약 조건은 지원서에서 안내하며 미확정 수익 배분·계약 조건, 비공개 운영 정보, 미승인 캐릭터 자료와 세계관 결말을 임의로 추가하지 않습니다. 문구는 app/_components/VirtualRecruitment.tsx, 스타일은 app/home.css와 VirtualRecruitment.module.css, 지원 주소는 virtual-recruitment-config.ts에서 관리합니다.

## 로컬과 GitHub를 맞추는 기준

같게 유지할 대상은 Git이 추적하는 홈페이지 소스·공개 자산·설정·잠금 파일·테스트·현재 유지보수 안내의 경로와 내용입니다. app/, public/, scripts/, tests/, worker/, graph-rag/와 루트 관리 파일이 해당합니다. 추적 파일의 삭제도 GitHub에 반영합니다.

.git/, node_modules/, dist/, .next/, .vinext/, .wrangler/, 빌드 캐시, 비공개 원본, 환경 파일·자격 증명은 별도 로컬 자료입니다. 포함 여부는 .gitignore에서 관리합니다. 작업 전 git status와 원격 상태를 확인하고 미커밋 변경을 강제 초기화하거나 전체 덮어쓰지 않습니다.

작업 보고서·QA 및 SEO 결과·배포 이력·복구 사본은 Obsidian에만 보관합니다. 저장소에는 현재 소스와 유지보수 안내만 남깁니다. 기록 시작점은 Obsidian Vault/DevLogs/Ersiyan_Repository_Records_To_Obsidian_2026_10_08.md이며 구체적인 위치는 graph-rag/manifest.json의 workRecords에서 확인합니다. 새 작업 기록도 Obsidian에 작성하며 저장소에 날짜별 보고서와 산출물 폴더를 다시 쌓지 않습니다.

## 실행과 검증

Node.js 22.13 이상이 필요합니다. 로컬은 소스와 자산만 보관하는 형태이며 설치 라이브러리와 빌드·개발 캐시는 제거할 수 있습니다. 다음 개발 전에 잠금 파일에 맞춰 설치하고 라우트 타입을 다시 생성합니다.

~~~powershell
npm ci
npx.cmd vinext typegen
npm run dev
~~~

다음 명령은 로컬 검증입니다. HTML 계약은 새로 빌드한 dist/client를 대상으로 실행합니다.

~~~powershell
npx.cmd tsc --noEmit --incremental false
npm run lint
npm run build:cloudflare
node tests/rendered-html.test.mjs
node tests/cloudflare-static.test.mjs
node tests/legacy-division-route.test.mjs
node tests/naver-indexnow.test.mjs
node graph-rag/validate.mjs
git diff --check
~~~

npm test는 새 빌드와 네 계약을 실행합니다. 빌드가 실패했다면 남은 dist를 최신 결과로 취급하지 않습니다. node_modules, dist, .next, .vinext, .wrangler는 재생성할 수 있습니다. next-env.d.ts의 생성 타입 import는 유지하며 .next/types/routes.d.ts는 vinext typegen 또는 개발·빌드로 다시 생성합니다. 빌드 결과가 없는 상태에서는 HTML·배포 검증 전에 npm run build:cloudflare를 실행합니다.

npm run dev:cloudflare로 정적 프리뷰를 열고 Wrangler가 출력한 실제 로컬 주소로 검사합니다. 다음 포트는 예시입니다.

~~~powershell
node scripts/verify-cloudflare-deployment.mjs --target http://127.0.0.1:8787 --target-only --skip-idle
~~~

자동 계약과 실제 화면 검수는 별도로 Obsidian에 기록합니다. 데스크톱·모바일의 사업부 이동, 공지, VIRTUAL의 활성 Forms 링크, 개인정보 보관본 복귀, 기업 페이지 이동과 가로 넘침을 확인합니다.

## 유지보수

검색용 본문은 초기 HTML로 제공합니다. 개인정보 본문은 서버에서 렌더링하고 언어 선택만 클라이언트에서 처리합니다. 이미지 정리 시 직접 참조·srcSet·동적으로 만든 경로를 함께 확인합니다. 원본과 반응형 WebP를 보존하며 벨시엔 첫 화면 preload는 데스크톱 폭 1061px 이상에 적용합니다.

벨시엔의 420px 이하 화면은 세계관·전투·개발 기록에 content-visibility: auto를 적용합니다. 큰 콘텐츠를 추가하면 320·375·390px에서 실제 높이와 앵커 이동을 측정해 예약 높이를 확인합니다. 지원서 배너 PNG·편집용 SVG는 public/images/virtual/ersiyan-gen0-form-header.*이며 python scripts/render-virtual-form-banner.py로 생성합니다. Pillow와 Windows Arial·맑은 고딕 글꼴이 필요합니다.

## 승인 후 배포와 검색 통지

검증과 실제 화면 검수를 마친 결과를 제시하고 배포 직전에 사용자 승인을 받습니다. GitHub 반영도 승인된 범위에서 실행합니다. 소스 동기화와 운영 배포는 각각 확인합니다. 현재 확인된 운영 버전은 graph-rag/manifest.json에서 찾고 상세 실행 근거는 Obsidian에서 읽습니다.

운영 설정은 wrangler.cloudflare.jsonc의 ersiyan-com-static입니다. 다음 명령은 새 빌드의 dist/client를 운영에 배포하므로 승인 후에만 실행합니다.

~~~powershell
npm run deploy:cloudflare
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8 --skip-idle
~~~

운영 문서·자산·별칭·404·사이트맵을 새 빌드와 대조합니다. 유휴 성능을 측정할 때는 --skip-idle을 빼고 실행합니다. 리다이렉트는 경로와 쿼리를 유지합니다.

npm run notify:naver -- --url https://ersiyan.com/virtual은 제출 없이 대상을 검사합니다. 실제 제출은 승인 후 변경한 정식 주소에만 --submit을 사용합니다. --out에는 Obsidian의 새 기록 경로를 지정해 기존 기록을 덮어쓰지 않습니다. 접수와 실제 색인·최신 검색 문구·노출 순위는 각각 구분합니다.

## 주요 소스

| 파일 | 역할 |
| --- | --- |
| app/page.tsx, app/company/company.module.css, app/_components/CompanyHistory.tsx | 회사 홈·연혁 |
| app/games/page.tsx, app/_components/HomeContent.tsx, HomeExperience.tsx | 게임부·공통 헤더 |
| app/virtual/page.tsx, app/_components/VirtualRecruitment.tsx | 버츄얼부·모집 |
| app/_components/notices.ts, app/notices/ | 공지 데이터·목록·상세 |
| app/_components/ErFooter.tsx, business-profile.ts | 공통 푸터·법적 신원 |
| app/mine-logic/, app/velsien-summit/ | 게임 상세·세계관·기업·시각 자료 |
| app/privacy/ | 현행 방침·법적 보관본 |
| public/ | 공개 이미지·소셜 카드·검색·리다이렉트·보안 설정 |
| scripts/stage-static-routes.mjs, verify-cloudflare-deployment.mjs | 정적 빌드 준비·배포 검증 |

표에서 디렉터리가 생략된 파일은 앞에 표시한 디렉터리에 있습니다.
