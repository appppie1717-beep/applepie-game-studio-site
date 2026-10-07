# 현재 정리 판단과 보존 경계

이 파일은 현재 소스와 자산의 정리 규칙입니다. 삭제 실행 목록·검수 보고서·복구 사본·작업 연대기는 Obsidian에서 관리합니다. 현재 확정된 미사용 소스 삭제 후보는 없습니다.

## 반드시 보존

- `app`, `public`, `scripts`, `tests`, `worker`의 사용 중인 소스와 필수 package·TypeScript·Vite·Wrangler설정.
- `.git`, `.openai/hosting.json`, Google소유권 확인 파일과 브랜드·지원서 편집 원본.
- 독립 기업3개의 UI·콘텐츠·맞춤푸터, 개인정보 법적 보관본7개와 공개 공지8개.
- 현재법적대표자·조항·시행일·기존 지원자료 처리기준, Secret의검색허용정책.
- `local-private/velsien-summit`의 이미지 생성 입력 원본. 내용은 읽거나 색인하지 않습니다.
- 동적으로 사용하는 teaser160/320/640/960와 Secret400/720이미지. 문자열 검색만으로 미참조 판단하지 않습니다.

## 판단 방법

삭제 전에 import/export, 정적HTML/CSS/JS참조, 동적srcSet과URL생성, 스크립트 입력, 공개라우트·metadata·법적·기업 보존 관계를 함께 확인합니다. 파일 수정시각이 오래됐다는 이유만으로 삭제하지 않습니다. 실제 경로가 저장소 안인지와 링크 여부도 확인합니다.

`node_modules`, `dist`, `.next`, `.vinext`, `.wrangler`는 설치·빌드·개발 생성물로 GitHub소스 동등성에서 제외합니다. 활성 프로세스와 필요한 참조를 확인하고 다룹니다. `next-env.d.ts`는 `.next/types`를 참조하며 성공한 최신 `dist/client`는 배포 검증에 사용합니다.

## 작업 기록의 위치

작업 보고서·실행 로그·배포/검색 근거·화면 캡처·복구 기록은 Obsidian만 사용합니다. 프로젝트 안에 작업별 보고서나 복구 폴더를 새로 만들지 않습니다. 외부 기록 위치와 보관 상태는 `manifest.json`의 `workRecords` 메타데이터를 확인합니다.

현재 구조 GraphRAG·README·AGENTS와 실제 서비스하는 공지·법적 보관본은 유지관리 또는 제품 문서이며 제거 대상인 내부 작업 기록과 구분합니다.
