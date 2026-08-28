# ERSIYAN 공식 홈페이지

에르시안 공식 홈페이지 프로젝트입니다. 정식 주소는 `https://ersiyan.com`이며 Cloudflare Workers Static Assets에서 제공합니다. 기존 `applepie.im` Worker와 OpenAI Sites 버전은 이전 안정화와 롤백을 위해 보존합니다.

## 포함된 내용

- 에르시안 브랜드 로고와 소개
- Google Play 출시작 `MINE LOGIC`
- 개발 중인 모바일 수집형 2D SRPG `VELSIEN SUMMIT · 벨시엔 서밋`
- 메인 홈페이지의 기존 VELSIEN SUMMIT 소개와 3장 개발 화면 갤러리, `/velsien-summit` 단일 진입 링크
- 타이틀·작전 로비·동행자 상세 화면, 세계관 주제 탭, 전투 흐름 탭으로 구성한 별도 홍보 페이지
- MINE LOGIC 화면 탭과 게임을 만들 때 신경 쓰는 내용을 담은 제작 원칙
- 제삼자의 평가문처럼 들리는 표현을 걷어내고 제작자가 직접 말하는 문체로 정리한 소개 문구
- 통신판매업 신고번호 옆 공정거래위원회 신고 조회 링크
- 홈페이지용 개인정보처리방침 초안
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

`npm test`는 프로덕션 빌드 뒤 홈페이지, `/velsien-summit`, 개인정보처리방침과 보관본, 404 페이지, robots, sitemap, 필수 이미지, Cloudflare 정적 전용 구성, 스타터 잔재 제거 여부를 확인합니다. 홈페이지에는 MINE LOGIC 화면 선택 탭, 기존 VELSIEN SUMMIT 소개와 3장 갤러리, 홍보 페이지로 가는 링크 하나, 제작 원칙 아코디언이 포함되어 있습니다. 사업자 정보는 별도 펼침 없이 홈페이지 하단에 항상 표시합니다.

## Cloudflare 정적 배포

Cloudflare 전용 설정은 `wrangler.cloudflare.jsonc`입니다. 이 설정에는 서버 Worker 엔트리와 바인딩이 없으며 `dist/client`의 정적 파일만 사용합니다.

```powershell
npm run dev:cloudflare
npm run deploy:cloudflare
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8 --skip-idle
npm run verify:cloudflare -- --target https://ersiyan.com --target-only --redirect-from http://ersiyan.com --redirect-from https://www.ersiyan.com --redirect-from http://www.ersiyan.com --redirect-from https://applepie.im --redirect-from http://applepie.im --redirect-from https://www.applepie.im --redirect-from http://www.applepie.im --dns-server 8.8.8.8
```

마지막 명령은 홈, 벨시엔 홍보 페이지, 개인정보처리방침과 보관본, 404, 이미지, CSS, JavaScript를 현재 로컬 정적 빌드와 대조합니다. 새 도메인의 HTTP·www와 기존 도메인의 HTTP·HTTPS·www는 같은 경로와 쿼리를 보존해 새 HTTPS 주소로 한 번만 301 이동하는지도 확인합니다. 이어서 65초 간격의 홈페이지 요청을 세 번 측정하며, 하나라도 1초 이상이면 실패합니다. `--reference`는 별도 사본이 현재 빌드와 같은 내용일 때만 추가합니다. `--dns-server`는 전환 중 로컬 공유기에 남은 DNS 캐시를 우회해 지정한 공용 DNS의 현재 경로를 검사할 때 사용합니다.

운영 배포는 새 `ersiyan-com-static` Worker에 `ersiyan.com`만 연결합니다. 기존 `applepie-im-static` Worker와 Google 사이트 인증 TXT는 롤백을 위해 보존합니다. 새 주소를 검증한 뒤 `www.ersiyan.com`, `applepie.im`, `www.applepie.im`은 Cloudflare 프록시 DNS와 Single Redirect를 사용해 경로와 쿼리를 보존한 단일 301로 새 HTTPS 주소에 연결합니다.

개인정보처리방침에는 2026년 8월 28일 브랜드·도메인 변경 고지와 2026년 8월 22일·23일 방침 보관본이 포함되어 있습니다. 법정 운영 사업자 상호는 행정상 변경 전까지 `애플파이`로 유지합니다.

문제가 발생하면 기존 도메인의 이전용 Redirect Rule을 비활성화해 보존된 `applepie-im-static` Worker로 즉시 되돌립니다. 필요하면 OpenAI Sites 버전도 별도 롤백 대상으로 사용할 수 있으며, 어떤 경우에도 Google 사이트 인증 TXT는 유지합니다.

## 주요 경로

- 홈페이지 `app/page.tsx`
- 전체 스타일 `app/globals.css`
- 개인정보처리방침 `app/privacy/page.tsx`
- 공개 이미지 `public/images`
- 원본 브랜드 로고 `public/images/brand/ersiyan-logo.png`
- 첫 화면 최적화 로고 `public/images/brand/ersiyan-logo-hero.webp`
- 소셜 미리보기 `public/ersiyan-social-card.jpg`

원본 로고와 MINE LOGIC 등록용 이미지는 수정하지 않았으며, 홈페이지 폴더 안에는 원본 사본과 웹 전송용 파생본만 들어 있습니다.
