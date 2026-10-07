# 정리 결과와 보존 경계

## 현재 상태

- 2026-10-07 사용자 요청 범위에서 실행했습니다.
- 활성 경로 제거 후 실제 파일 부재를 확인했습니다.
- 복구 사본: `local-private/reconciliation-2026-10-07/removed` (Git 제외·GraphRAG 내용 색인 제외).
- 세부 실행 목록과 크기: `outputs/reconciliation-2026-10-07/cleanup-executed.json`.
- 기존 `pending_auto_review_limit`은 9월 작업 당시 기록이며 현재 정리 상태를 뜻하지 않습니다.

## 제거한 항목

- 사용하지 않는 GameProducerRegistration.tsx, NoticePreview.tsx와 해당 CSS. 실제 등록 정보와 공지8개는 유지합니다.
- 오래된 SEO 캐시, 임시 브라우저 스냅샷, TypeScript 증분 캐시, 빈 db/drizzle/examples/work/코드 폴더와 명령 잔여물.
- outputs 안의 임시 Chrome profile 10개와 raw *-trace.json 61개. 프로필 내용·쿠키·로그인·History·Sessions는 검사하거나 색인하지 않았습니다. 최종 보고서·스크린샷·법적/검색 제출/배포 근거는 보존합니다.
- 사용되지 않는 PostCSS 설정과 Tailwind 의존성. 다른 패키지 버전은 유지하고 이미지 생성에 이미 사용하던 sharp를 직접 고정했습니다.

## 보존 항목

- app/public/scripts/tests/worker의 사용 중인 소스와 필수 설정, `.git`, `.openai/hosting.json`, 소유권 확인 파일.
- 각 독립 기업 UI·맞춤푸터와 법적7보관본.
- 동적 srcSet에 실제 사용되는 teaser160/320·640/960 및 Secret400/720 이미지.
- 비공개 teaser 원본, 복구 사본, 최종 감사/배포/검색 제출 자료.
- node_modules와 검증한 dist는 설치·빌드 생성물이며 GitHub 업로드 대상이 아닙니다. `.next/types/routes.d.ts`는 next-env.d.ts에서 참조합니다.

모든 경로를 저장소 안의 절대경로로 확인하고 링크를 거부한 뒤 정리했습니다. 원본을 영구 파기하지 않고 복구 가능 사본을 보존합니다.
