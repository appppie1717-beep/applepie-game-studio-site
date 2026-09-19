# ERSIYAN 소스·GitHub·운영 사이트 대조

2026-09-19에 로컬 작업 폴더, GitHub `main`의 `8e25066`, `https://ersiyan.com`을 읽기 전용으로 대조한 뒤 로컬 소스를 통합했다. 파일 수정 시각만으로 최신본을 고르지 않고, 원격 커밋의 고유 콘텐츠와 현재 빌드의 페이지별 HTML을 확인했다.

## 대조 결과

| 정식 경로 | 운영 사이트와 통합 빌드 | 선택한 기준 |
| --- | --- | --- |
| `/` | 실질 HTML 동일 | 로컬의 최신 홈·회사 정보·SEO 소스 |
| `/virtual` | 실질 HTML 동일 | 로컬의 독립 Virtual 페이지 |
| `/mine-logic` | 실질 HTML 동일 | 로컬의 제품·메타데이터·반응형 이미지 |
| `/privacy` | 실질 HTML 동일 | 로컬 현행 방침 |
| `/privacy/mine-logic` | 실질 HTML 동일 | 로컬 현행 게임 방침 |
| `/privacy/archive/2026-08-22` | 실질 HTML 동일 | 역사적 원문 보존 |
| `/privacy/archive/2026-08-23` | 실질 HTML 동일 | 역사적 원문 보존 |
| `/privacy/archive/2026-08-28` | 실질 HTML 동일 | 역사적 원문 보존 |
| `/privacy/archive/2026-08-31` | 실질 HTML 동일 | 역사적 원문 보존 |
| `/velsien-summit` | 실질 HTML 동일 | 로컬의 개발 기록·반응형 자산 |
| `/velsien-summit/late-update` | 실질 HTML 동일 | 로컬의 추가 개발 기록 |
| `/velsien-summit/secret` | 운영 사이트에는 개발 캡처 4개가 없음 | GitHub의 캡처 4개와 로컬의 이후 SEO·반응형 수정을 통합 |
| `/velsien-summit/corporate/orysen` | 실질 HTML 동일 | 독립 화면·문구·맞춤 푸터 보존 |
| `/velsien-summit/corporate/virenta` | 실질 HTML 동일 | 독립 화면·문구·맞춤 푸터 보존 |
| `/velsien-summit/corporate/neryx` | 실질 HTML 동일 | 독립 화면·문구·맞춤 푸터 보존 |

모든 운영 경로가 HTTP 200을 반환했다. 14개 경로의 HTML은 새 `dist/client`와 길이가 같고 빌드 자산 이름 및 생성 UUID를 정규화하면 동일했다. Secret은 운영 42,849바이트, 새 빌드 133,626바이트였으며 설명 메타데이터와 개발 캡처 본문이 달랐다. 새 빌드의 `dist`는 이 작업에서 정상 빌드한 결과다. 운영 사이트 배포 여부는 이 대조만으로 판단하지 않는다.

GitHub는 로컬의 기존 HEAD `d12e9ac`보다 13커밋 앞섰으며, 추가 변경은 Secret의 `page.tsx`와 캡처 데이터 모듈 11개였다. 캡처 4개는 모두 480×227 WebP로 확인했다. 로컬의 다른 페이지 수정과 새 라우트·이미지를 보존하고, Secret에만 원격 콘텐츠를 합쳤다. 임시 SEO 크롤 그래프와 루트의 0바이트 명령 잔여물 5개는 소스에서 제외했다. `dist`, `outputs`, `local-private`, 캐시, 환경 파일도 GitHub 편집 기준에서 제외한다.

## 검증

- `npx.cmd tsc --noEmit --incremental false` 통과
- `npm run build:cloudflare` 통과, 16개 경로 프리렌더, 정적 배포 계약 6/6
- `node tests/rendered-html.test.mjs` 18/18, Secret 개발 캡처 4개 포함 여부 확인
- `node tests/legacy-division-route.test.mjs` 3/3
- `node tests/naver-indexnow.test.mjs` 8/8
- `npm run lint`, `node graph-rag/validate.mjs`, `git diff --check` 통과

운영 배포 뒤에는 15개 경로와 Secret의 `FILES 09–12`, 정적 자산, 리다이렉트를 다시 확인한다. GitHub 커밋은 운영 배포를 자동으로 실행하지 않는다.
