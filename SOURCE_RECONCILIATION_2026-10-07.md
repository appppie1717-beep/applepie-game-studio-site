# ERSIYAN 소스 대조·정리·최적화 — 2026-10-07~08

## 결과와 승인 경계

로컬 통합·정리·최적화와 최종 검수를 완료했습니다. GitHub push, 운영 배포, 검색 제출은 아직 실행하지 않았습니다. 사용자 지시에 따라 검수본을 제시한 뒤 GitHub main 반영과 ersiyan.com 배포 승인을 받습니다.

같게 유지하는 대상은 추적 소스·공개 자산·문서·설정·테스트의 경로와 내용입니다. 비밀 환경파일, Git 내부 자료, node_modules, dist, 생성 캐시, outputs와 local-private는 GitHub 동기화 대상에서 제외합니다. README에 이 경계와 승인 후 배포·검증 절차를 정리했습니다.

## 최신본 선택 근거

| 비교 대상 | 직접 확인한 상태 | 통합 결정 |
| --- | --- | --- |
| GitHub main | e36ffae16152171cfd0c3fd3e058eeb91e47c711; 205개 파일 중 최초 로컬174개 동일·31개 수정·누락0 | 공통 소스와 기존 공개 자산을 보존 |
| 로컬 | 승인된 회사 우선 루트, 독립 /games, 공지8개와 법적 보관본7개 등 후속 변경 | 미커밋 작업을 보존하고 유지관리 가능한 소스로 통합 |
| 실제 운영 | 10월3일 버전6becd6c4-da2a-4d2c-806c-0d3f2da8edd7; 공개28개 HTML·소셜 이미지·검색파일 | 로컬에 없던 홈/게임부/버츄얼 문구, FAQ4개, 검색정보와 브랜드 소셜 JPG를 복원 |

파일 수정 시각만으로 선택하거나 어느 한쪽 폴더 전체를 덮어쓰지 않았습니다. 현재 운영본이 과거9월30일 기록보다 새롭다는 것을 실제 배포 목록과 공개 HTML로 확인했습니다. 개인정보 본문·원래 공지 게시일·활성 Forms 링크·대표자 탁진은 유지합니다.

최종 빌드와 운영 스냅샷은 28개 경로의 본문 텍스트·metadata·JSON-LD·링크·의미 있는 기존 스크립트가 모두 같습니다. 정규화한 본문 마크업은27개 경로 동일하며, Secret만 picture/source에서 반응형 img로 바뀌었습니다. 사이트맵과 브랜드 JPG는 바이트 해시까지 동일하고 robots/llms의 차이는 줄바꿈입니다. 브랜드 JPG는1200×630·79,410bytes이며 SHA256은 cf5f6b4b7af8786a5e90be3b41a003e4094611150675a1dc2b94df5bb6ba92e2입니다.

## 파일 정리와 보존

활성 경로86개, 포함 파일2,270개,296,683,766bytes(약283MiB)를 제거했습니다. 미사용 GameProducerRegistration, NoticePreview와 해당CSS, 미사용 PostCSS 설정, 오래된 SEO/TypeScript/브라우저 캐시, 빈 폴더와 명령 잔여물, 임시 Chrome 프로필10개 및 원시 성능 추적61개를 정리했습니다.

원본 영구 파기나 디스크 공간 회수 완료를 뜻하지 않습니다. 복구 사본은 Git과 내용 색인에서 제외한 local-private/reconciliation-2026-10-07/removed에 남겼고, 원래 경로의 파일 부재를 확인했습니다. 프로필의 쿠키·로그인·History·Sessions 내용을 읽거나 색인하지 않았습니다.

- 독립 기업3곳의 소스11개는 이전 체크포인트와 SHA256까지 동일합니다. 각 UI·콘텐츠·맞춤 푸터를 보존했습니다.
- 법적 보관본7개의 JSX는 동일합니다. 검색용 소셜 이미지 참조만 현행 운영본에 맞춰 복원했습니다.
- 사용 중인 공개 자산·원본·반응형 파생본, 등록 이미지, 소유권 확인 파일, 비공개 teaser 원본과 최종 법적/검색/배포 증거를 유지합니다.
- 동적으로 참조하는 teaser160/320을 보존하고 이미지 생성기에 해당 크기를 추가했습니다.
- node_modules와 검증된 dist는 설치·빌드 생성물입니다. next-env.d.ts가 사용하는 .next/types도 유지합니다.

## 코드 최적화

- 미사용 CSS 규칙을 제거했습니다. 보존한 선언·미디어 조건·순서는 독립 AST 비교로 확인했습니다.
- MINE LOGIC 개인정보 본문을 서버 컴포넌트로 옮기고 언어 전환만 작은 클라이언트 컴포넌트로 분리했습니다. 한·영18개 조항, 기본 English, 숨김·접근성·문서 언어 복원·JavaScript 없는 표시를 유지했습니다.
- Secret 캐릭터5개의400/720/원본 후보를 화면 너비에 따라 선택합니다. 이미지·설명·비율·로딩 우선순위는 유지합니다.
- 미사용 Tailwind 의존성과 설정을 제거하고 기존 이미지 생성에 쓰던 sharp0.34.5를 직접 고정했습니다. 다른 설치 버전은 바꾸지 않았습니다.
- 검증 도구의 요청 제한15초, 오류·중단 처리와 자산 중복 검사 제거를 적용했습니다. HTML 비교의 접두사 길이 차이도 정확히 잡습니다.
- GraphRAG 검증에 중복 관계/청크·실제 경로·폴더 종류·경계 검사를 추가했습니다. 복구 사본과 생성물을 TypeScript/ESLint에서 제외해 활성 코드 검수 범위를 유지합니다.

정량 비교는 다음과 같습니다.

| 측정 | 이전 → 현재 |
| --- | --- |
| CSS 소스5개 |151,515 →127,045bytes (24,470bytes 감소)|
| 빌드 CSS 전체 |258,105 →238,064bytes|
| 개인정보 클라이언트 청크 |16,327 →1,067bytes|
| 해당 청크gzip |5,116 →534bytes|
| Secret5개 원본 →400px후보 |407,208 →108,332bytes|

청크는 Vite manifest의 실제 매핑으로 비교했습니다. 전체 CSS 변화에는 운영 최신본 복원도 포함됩니다. 이미지 선택과 실제 전송량은 화면·DPR·지연 로딩에 따라 다릅니다. 실제 필드 Core Web Vitals와 장시간 유휴 성능은 측정하지 않았습니다. 상세 경계는 optimization-metrics 보고서에 기록합니다.

## 최종 검증

| 확인 | 결과 |
| --- | --- |
| npm run build:cloudflare | exit0;오류 페이지 포함29개 HTML 스테이징;정적 계약7/7 |
| 필수 계약4개 | rendered26/static7/legacy4/IndexNow8, 총45/45 |
| TypeScript·ESLint | 모두exit0 |
| GraphRAG |180노드·495관계·48청크;28개 정식 경로;유효 |
| git diff --check | exit0;공백 오류 없음 |
| 로컬 Wrangler verifier |28개 경로·266개 자산 검사·150개 쿼리 보존301별칭·사이트맵·404·llms 통과 |
| 실제 Chrome |375×812의28개 경로 가로넘침 없음;1280×960 주요 화면과 기업3곳 확인;기록된 콘솔오류·경고0 |
| 상호작용 |회사 연혁·게임 선택·개발 화면 선택·모집 중단 공지 이동·방침 언어전환/JavaScript 없는 표시 확인;viewport복원 |

자동 검증과 실제 화면 검수를 별도로 기록했습니다. 로컬 미리보기는 종료했고 최종 빌드를 다시 성공시켰습니다. 로컬 검증을 새 운영 배포 완료로 해석하지 않습니다.

## 근거와 복구 위치

- outputs/reconciliation-2026-10-07: final-live-parity.json/.md, final-file-inventory.json/.md, cleanup-executed.json, optimization-metrics.json/.md, validation-summary.json, build.txt, contracts.txt, local-verifier.txt, browser-final.json와 화면 JPG.
- local-private/reconciliation-2026-10-07: source-before, dist-before, GitHub zip, 원래 미커밋 patch와 removed 복구 사본.
- 현재 승인 상태: graph-rag/manifest.json의 currentTask/currentValidation/sourceSync.

승인 후에는 검수한 소스를 GitHub main에 반영하고 원격/로컬 커밋과 파일 일치를 확인한 뒤 ersiyan-com-static에 배포합니다. 배포 후 운영28개 경로·자산·별칭·404·검색파일과 실제 화면을 다시 검증합니다.
