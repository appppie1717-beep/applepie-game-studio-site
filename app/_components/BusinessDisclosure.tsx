"use client";

import { useState } from "react";

export function BusinessDisclosure() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`business-disclosure${isOpen ? " business-disclosure--open" : ""}`}>
      <button
        className="business-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="business-information"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <small>VERIFIED BUSINESS INFORMATION</small>
          <strong>{isOpen ? "사업자 정보 접기" : "사업자 정보 펼쳐보기"}</strong>
        </span>
        <span className="business-trigger-icon" aria-hidden="true">
          ↓
        </span>
      </button>

      <div id="business-information" className="business-panel" aria-hidden={!isOpen}>
        <div>
          <dl className="business-list">
            <div>
              <dt>상호</dt>
              <dd>애플파이</dd>
            </div>
            <div>
              <dt>대표자</dt>
              <dd>탁진</dd>
            </div>
            <div>
              <dt>사업자등록번호</dt>
              <dd>206-43-62580</dd>
            </div>
            <div>
              <dt>업태</dt>
              <dd>정보통신업</dd>
            </div>
            <div>
              <dt>종목</dt>
              <dd>모바일 게임 소프트웨어 개발 및 공급업</dd>
            </div>
            <div>
              <dt>문의</dt>
              <dd>
                <a href="mailto:asoul122@naver.com" tabIndex={isOpen ? 0 : -1}>
                  asoul122@naver.com
                </a>
              </dd>
            </div>
          </dl>
          <p className="business-source-note">
            사업자등록증에서 확인한 정보만 표시합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
