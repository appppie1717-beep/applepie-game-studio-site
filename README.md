# ERSIYAN 공식 홈페이지

에르시안 공식 홈페이지 프로젝트입니다. 정식 주소는 `https://ersiyan.com`이며 Cloudflare Workers Static Assets에서 제공합니다. 기존 `applepie.im` Worker와 OpenAI Sites 버전은 이전 안정화와 롤백을 위해 보존합니다.

## 포함된 내용

- 상위 회사 ERSIYAN과 동급의 ERSIYAN GAMES / ERSIYAN VIRTUAL 사업 영역
- `/` 게임부와 `/virtual` 버츄얼부의 독립 초기 HTML 및 같은 크기의 링크 토글, 이전 해시 주소 호환
- Google Play 출시작 `MINE LOGIC`과 단계별 힌트·20단계 훈련·오프라인 플레이를 설명하는 `/mine-logic` 상세 페이지
- 개발 중인 모바일 캐릭터 수집형 전략 RPG `VELSIEN SUMMIT · 벨시엔 서밋`
- 메인 홈페이지의 기존 VELSIEN SUMMIT 소개와 3장 개발 화면 갤러리, `/velsien-summit` 단일 진입 링크
- 타이틀·작전 로비·동행자 상세 화면, 세계관 주제 탭, 전투 흐름 탭으로 구성한 별도 홍보 페이지
- `/velsien-summit/world`에 별도로 공개한 2026-09-19 기준 최신 세계관. 기존 벨시엔 메인 페이지에서 연결합니다.
- 날짜별 개발 기록, 실제 5대5 전투 화면 2장과 캐릭터 아트, 추가정보와 검색 허용 시크릿 보관 페이지. 시크릿에는 캐릭터 5개, 전투 3개, 개발 화면 4개가 있습니다.
- MINE LOGIC 화면 탭과 게임을 만들 때 신경 쓰는 내용을 담은 제작 원칙
- MINE LOGIC 원본 PNG를 보존하면서 전송량을 줄인 반응형 WebP 파생본
- 검색 엔진용 메타데이터, 구조화 데이터, sitemap과 `llms.txt`
- 제삼자의 평가문처럼 들리는 표현을 걷어내고 제작자가 직접 말하는 문체로 정리한 소개 문구
- 통신판매업 신고번호 옆 공정거래위원회 신고 조회 링크
- 홈페이지 및 MINE LOGIC 개인정보처리방침과 이전 홈페이지 방침 보관본 4개
- 1200×630 소셜 미리보기 이미지

종료된 프로젝트, 개인 금융 자료, 영수증, 자동화 스크립트, 비밀키, 개인 Discord, 미확정 상용 아트는 포함하지 않았습니다. 사업자등록증과 통신판매업 신고증 원본, 대표자 생년월일, 집 주소, 정부24 문서확인번호도 사이트에 포함하지 않습니다. 사용자가 공개를 승인한 사업자 연락처 `010-2416-6267`만 홈페이지 하단에 표시합니다.

홈페이지 자체에서는 회원가입, 주문이나 결제를 받지 않으며, 앱 설치와 거래는 Google Play에서 진행됩니다. 소비자가 사업자 신원을 확인할 수 있도록 홈페이지 하단에는 상호, 대표자, 사업자등록번호, 통신판매업 신고번호와 신고기관, 전화번호, 문의 이메일, 호스팅서비스 제공자를 표시합니다. 공정거래위원회 조회는 별도 메뉴로 반복하지 않고 통신판매업 신고번호 옆에 둡니다. 현재 사이트에서 이용자와 별도 계약을 체결하지 않으므로 일반적인 이용약관 페이지는 두지 않습니다. 회원가입, 사전예약 접수, 직접 주문·결제 같은 기능을 추가할 때는 주소, 이용약관과 거래조건 표시 의무를 공개 전에 다시 검토해야 합니다.

## 로컬 실행

가장 간단한 방법은 상위 `잡다한거` 폴더의 `애플파이 홈페이지 미리보기.bat`를 더블클릭하는 것입니다. 열린 명령 창을 닫으면 로컬 미리보기도 종료됩니다.

Node.js 22.13 이상이 필요합니다.

```powershell
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열면 됩니다.

## 검증 명령

```powershell
npm run lint
npm test
npm run build:cloudflare
```

`npm test`는 프로덕션 빌드 뒤 게임부와 버츄얼부의 독립 HTML, 두 게임 상세 페이지, 추가정보·시크릿, 개인정보처리방침과 보관본, 404, robots, sitemap, `llms.txt`, 필수 이미지, Cloudflare 정적 전용 구성과 이전 해시 이동을 확인합니다. 홈페이지에는 MINE LOGIC 화면 선택 탭, 기존 VELSIEN SUMMIT 소개와 3장 갤러리, 각 게임 상세 페이지로 가는 링크, 제작 원칙 아코디언이 포함되어 있습니다. 회사 연혁과 사업자 정보는 두 사업부에서 공통으로 표시합니다.

빌드 의존성 목록과 각 HTML의 CSS 집합을 대조해 누락과 중복을 확인합니다. 인라인 CSS도 시험했지만 현재 vinext 클라이언트가 같은 CSS를 다시 요청하고 운영 성능이 떨어져 적용하지 않습니다. 외부 CSS 파일의 캐시를 사용하며 운영 호스팅은 계속 정적 자산 방식입니다. 측정 원본과 판단은 `outputs/seo-polish-2026-09-05/performance/`에 보존합니다.

벨시엔 첫 화면 이미지는 모바일에서 본문 아래에 있으므로 데스크톱 폭 1061px 이상에만 React 리소스 preload를 적용합니다. 모바일에서도 eager 로딩은 유지하되 높은 우선순위를 강제하지 않습니다.

벨시엔의 420px 이하 화면에서는 세계관·전투 소개와 두 개발 기록을 `content-visibility: auto`로 처리합니다. 본문은 초기 HTML에 그대로 있고 화면 가까이에서 렌더됩니다. 320/375/390px의 실제 콘텐츠 높이를 초기 예약값으로 사용하며, 문서 내 링크로 이동할 때는 네 구간을 모두 즉시 렌더해 좌표를 보존합니다. 데스크톱과 인쇄는 기존 렌더링을 유지합니다. 이 네 구간에 큰 콘텐츠를 추가하면 `performance/artifacts/cv-layout-baseline.json`의 측정 방식으로 예약 높이도 다시 확인합니다.

시크릿 캐릭터는 모바일에서만 400/720px 파생본을 선택하고 데스크톱 원본을 보존합니다. 전투 이미지는 640/960px, 작은 갤러리 썸네일은 160/320px 후보를 추가했습니다. 원본 파일과 과거 본문은 보존하며 파생본·화질·전송량 근거는 `outputs/seo-polish-2026-09-05/image-delivery/`에 있습니다.

정적 문서 사이의 이동은 일반 `<a>` 링크를 사용합니다. MINE LOGIC의 기존 `next/link`가 불필요한 RSC 사전 로딩 오류를 일으켜 제거했고, 재발을 막기 위해 정적 HTML에서 해당 청크가 로드되지 않는지 검사합니다.

최신 세계관을 포함한 정식 문서 16개를 `index, follow`로 제공하고 사이트맵에 넣습니다. 과거 방침 4개도 포함하되 보관본 표시와 당시 본문은 보존합니다. 시크릿은 검색을 허용하지만 일반 메뉴나 세계관 본문에 노출하지 않습니다. 벨시엔 기업 페이지 3개는 일반 메뉴 대신 세계관의 기업 소개에서 연결하며, 각 기업의 맞춤 푸터에서 세계관으로 돌아올 수 있습니다. 기업 페이지의 독립된 화면·문구·맞춤 푸터를 보존합니다. `/games`와 slash·`.html`·index 별칭은 정식 주소로 301 이동하며 별도 검색 문서로 만들지 않습니다.

## GitHub에서 이어서 수정하기

`main`의 `app/`, `public/`, `scripts/`, `tests/`, `worker/`와 루트 설정 파일이 편집 기준입니다. `dist/`는 빌드 결과이고 `outputs/`와 `local-private/`은 저장소에 올리지 않습니다. 페이지와 자산의 관계는 `PROJECT_GRAPH_RAG_INDEX.md`에서 확인합니다.

2026년 9월 19일의 로컬·GitHub·운영 사이트 페이지별 대조는 [SOURCE_RECONCILIATION_2026-09-19.md](SOURCE_RECONCILIATION_2026-09-19.md)에 있습니다.

GitHub에서 직접 수정할 때는 새 브랜치에서 소스 파일을 바꾸고, 변경 파일과 이미지 경로를 확인한 뒤 `main`으로 합칩니다. 로컬에서는 다음 순서로 확인합니다.

```powershell
git pull --ff-only origin main
npm ci
npx tsc --noEmit --incremental false
npm run lint
npm run build:cloudflare
node tests/rendered-html.test.mjs
node tests/legacy-division-route.test.mjs
node tests/naver-indexnow.test.mjs
git diff --check
```

라이브 사이트는 GitHub 커밋만으로 갱신되지 않습니다. 검증된 커밋의 빌드 결과를 `npm run deploy:cloudflare`로 배포한 뒤 `npm run verify:cloudflare`로 운영 주소를 확인해야 합니다. 개인정보 보관본과 벨시엔 기업 페이지 3개는 현재 내용을 임의로 교체하지 않습니다.

## Cloudflare 정적 배포

Cloudflare 전용 설정은 `wrangler.cloudflare.jsonc`입니다. 이 설정에는 서버 Worker 엔트리와 바인딩이 없으며 `dist/client`의 정적 파일만 사용합니다.

```powershell
npm run dev:cloudflare
npm run deploy:cloudflare
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8 --skip-idle
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8
```

마지막 명령은 홈, MINE LOGIC 상세 페이지, 벨시엔 홍보 페이지, 개인정보처리방침과 보관본, `llms.txt`, 404, 이미지, CSS, JavaScript를 현재 로컬 정적 빌드와 대조합니다. 새 도메인의 HTTP·www와 기존 도메인의 HTTP·HTTPS·www는 같은 경로와 쿼리를 보존해 새 HTTPS 주소로 한 번만 301 이동하는지도 확인합니다. 이어서 65초 간격의 홈페이지 요청을 세 번 측정하며, 하나라도 1초 이상이면 실패합니다. `--reference`는 별도 사본이 현재 빌드와 같은 내용일 때만 추가합니다. `--dns-server`는 전환 중 로컬 공유기에 남은 DNS 캐시를 우회해 지정한 공용 DNS의 현재 경로를 검사할 때 사용합니다.

운영 배포는 새 `ersiyan-com-static` Worker에 `ersiyan.com`만 연결합니다. 기존 `applepie-im-static` Worker와 Google 사이트 인증 TXT는 롤백을 위해 보존합니다. 새 주소를 검증한 뒤 `www.ersiyan.com`, `applepie.im`, `www.applepie.im`은 Cloudflare 프록시 DNS와 Single Redirect를 사용해 경로와 쿼리를 보존한 단일 301로 새 HTTPS 주소에 연결합니다.

개인정보처리방침에는 2026년 9월 5일 기존 Cloudflare Web Analytics 방문·성능 통계 안내 정정과 8월 31일 사업자명 변경 고지가 있습니다. 8월 22일·23일·28일·31일 본문은 별도 보관본으로 열람할 수 있습니다. 분석 설정을 새로 바꾼 것이 아니라 실제 작동 중인 기능에 대한 설명을 바로잡았습니다. 현재 법정 운영 사업자 상호는 `에르시안`입니다.

문제가 발생하면 기존 도메인의 이전용 Redirect Rule을 비활성화해 보존된 `applepie-im-static` Worker로 즉시 되돌립니다. 필요하면 OpenAI Sites 버전도 별도 롤백 대상으로 사용할 수 있으며, 어떤 경우에도 Google 사이트 인증 TXT는 유지합니다.

## 네이버 변경 통지

`npm run notify:naver -- --url https://ersiyan.com/virtual`은 네트워크 요청 없이 대상을 검사합니다. 배포와 운영 검증 뒤 실제 바뀐 정식 주소만 `--url`로 나열하고 `--submit --out outputs/새-접수기록.json`을 추가하면 네이버 IndexNow에 통지합니다. 기록 폴더는 미리 만들어야 하며 기존 접수 기록은 덮어쓰지 않습니다. 공개 소유 확인 파일이 운영 주소에서 정확히 제공되는지 먼저 검사하고, 외부 주소·별칭·쿼리·중복 주소는 거부합니다.

전송 대상은 네이버 공식 IndexNow 주소 하나입니다. 프로토콜 특성상 참여 검색엔진에 변경 정보가 공유될 수 있으며 별도 Bing 계정이나 API 설정은 하지 않습니다. HTTP 200은 전달 성공, 202는 소유 확인 대기 중 접수입니다. 둘 다 실제 색인 완료를 뜻하지 않습니다. 기존 사이트맵·서치어드바이저 수집 요청 기록은 유지합니다. [네이버 공식 안내](https://searchadvisor.naver.com/guide/indexnow-about)

## 주요 경로

- 홈페이지 `app/page.tsx`
- 버츄얼부 `app/virtual/page.tsx`
- 사업부 공통 콘텐츠와 회사 정보 `app/_components/HomeContent.tsx`
- MINE LOGIC 상세 페이지 `app/mine-logic/page.tsx`
- 벨시엔 서밋·개발 기록 `app/velsien-summit/page.tsx`
- 공통 스타일 `app/globals.css`, 홈 전용 스타일 `app/home.css`
- 개인정보처리방침 `app/privacy/page.tsx`
- 공개 이미지 `public/images`
- 원본 브랜드 로고 `public/images/brand/ersiyan-logo.png`
- 첫 화면 최적화 로고 `public/images/brand/ersiyan-logo-hero.webp`
- 소셜 미리보기 `public/ersiyan-social-card.jpg`
- sitemap `public/sitemap.xml`
- AI 검색용 공개 안내 `public/llms.txt`

원본 로고와 MINE LOGIC 등록용 이미지는 수정하지 않았으며, 홈페이지 폴더 안에는 원본 사본과 웹 전송용 파생본만 들어 있습니다.
