# ApplePie Game Studio 공식 홈페이지

애플파이 게임 스튜디오 공식 홈페이지 프로젝트입니다. 현재 `https://applepie.im`은 무료 Cloudflare Workers Static Assets에서 제공됩니다. OpenAI Sites 버전 5와 6은 전환 뒤 최소 72시간 동안 롤백 대상으로 유지합니다.

## 포함된 내용

- 애플파이 브랜드 로고와 스튜디오 소개
- Google Play 출시작 `MINE LOGIC`
- 개발 중인 2D 전략 게임 `VELSIEN SUMMIT · 벨시엔 서밋`
- 스튜디오 프로필과 문의 이메일
- 홈페이지용 개인정보처리방침 초안
- 1200×630 소셜 미리보기 이미지

종료된 프로젝트, 개인 금융 자료, 영수증, 자동화 스크립트, 비밀키, 개인 Discord, 미확정 상용 아트는 포함하지 않았습니다.

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

`npm test`는 프로덕션 빌드 뒤 홈페이지, 개인정보처리방침, 404 페이지, 필수 이미지, Cloudflare 정적 전용 구성, 스타터 잔재 제거 여부를 확인합니다. 홈페이지에는 작품 탭, 스크린샷 선택 탭, 스튜디오 원칙 아코디언, 사업자 정보 펼침 기능이 포함되어 있습니다.

## Cloudflare 정적 배포

Cloudflare 전용 설정은 `wrangler.cloudflare.jsonc`입니다. 이 설정에는 서버 Worker 엔트리와 바인딩이 없으며 `dist/client`의 정적 파일만 사용합니다.

```powershell
npm run dev:cloudflare
npm run deploy:cloudflare
npm run verify:cloudflare -- --target https://applepie.im --reference https://applepie.appppie1717.chatgpt.site --www https://www.applepie.im --dns-server 8.8.8.8 --skip-idle
npm run verify:cloudflare -- --target https://applepie.im --reference https://applepie.appppie1717.chatgpt.site --www https://www.applepie.im --dns-server 8.8.8.8
```

마지막 명령은 홈, 개인정보처리방침, 404, 이미지, CSS, JavaScript, `www`의 경로·쿼리 보존 301과 롤백판의 문구·링크·이미지 구성을 확인한 뒤 65초 간격의 홈페이지 요청을 세 번 측정합니다. 세 요청 중 하나라도 1초 이상이면 검증에 실패합니다. `--dns-server`는 전환 중 로컬 공유기에 남은 DNS 캐시를 우회해 지정한 공용 DNS의 현재 경로를 검사할 때 사용합니다.

외부 배포, Cloudflare DNS 영역 추가, Namecheap 네임서버 변경은 각각 승인 뒤 실행합니다. 네임서버 변경 전에는 Google 사이트 인증 TXT 보존, 미사용 Namecheap MX와 이메일 SPF 제거, DNSSEC 상태 확인이 필요합니다. `www.applepie.im`은 Cloudflare 프록시 DNS와 Single Redirect를 사용해 경로와 쿼리를 유지한 301 이동으로 구성합니다.

개인정보처리방침에는 2026년 8월 23일부터 Cloudflare를 호스팅 제공자로 사용한다는 변경 고지와 이전 방침 보관본이 포함되어 있습니다. Google 사이트 인증 TXT는 보존했고, 사용하지 않던 메일 수신용 MX와 SPF는 이전하지 않았습니다.

문제가 발생하면 Cloudflare Worker 사용자 도메인 연결을 해제하고 OpenAI Sites 사용자 도메인과 제공자 지정 DNS 기록을 복구합니다. 롤백 과정에서도 Google 사이트 인증 TXT는 유지합니다.

## 주요 경로

- 홈페이지 `app/page.tsx`
- 전체 스타일 `app/globals.css`
- 개인정보처리방침 `app/privacy/page.tsx`
- 공개 이미지 `public/images`
- 소셜 미리보기 `public/applepie-social-card.png`

원본 로고와 MINE LOGIC 등록용 이미지는 수정하지 않았으며, 홈페이지 폴더 안에는 별도 사본만 들어 있습니다.
