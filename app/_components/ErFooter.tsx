import { businessProfile } from "./business-profile";

type ErFooterProps = {
  id?: string;
  context?: "games" | "virtual";
};

export function ErFooter({ id = "business-info", context = "games" }: ErFooterProps) {
  return (
    <footer
      id={id}
      className="er-footer"
      aria-label="에르시안 사업자 정보"
      data-er-footer
    >
      <div className="er-footer__inner">
        <div className="er-footer__top">
          <div>
            <div className="er-footer__brand" aria-label="ERSIYAN">
              <span className="er-footer__mark" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="currentColor"
                >
                  <path d="M12 2.5 15 9l6.5 3-6.5 3-3 6.5L9 15l-6.5-3L9 9z" />
                </svg>
              </span>
              <span className="er-footer__wordmark">ERSIYAN</span>
            </div>
          </div>
          <div className="er-footer__contact">
            <span className="er-footer__contact-label">문의</span>
            <a className="er-footer__email" href={`mailto:${businessProfile.email}`}>
              {businessProfile.email}
              <svg
                className="er-footer__arrow"
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12 12 4m-5 0h5v5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <p className="er-footer__notice">
          {context === "virtual"
            ? "개인사업자 에르시안이 운영하는 공식 홈페이지입니다. 버츄얼 크리에이터 지원은 biz@ersiyan.com에서 접수하며, 이 홈페이지에서는 주문이나 결제를 받지 않습니다."
            : "개인사업자 에르시안이 운영하는 공식 홈페이지입니다. 이 홈페이지에서는 주문이나 결제를 받지 않으며, 앱 설치와 거래는 Google Play에서 진행됩니다."}
        </p>

        <div className="er-footer__info">
          <dl className="er-footer__identity">
            <div>
              <dt>상호</dt>
              <dd>{businessProfile.businessName}</dd>
            </div>
            <div>
              <dt>대표자</dt>
              <dd>{businessProfile.representative}</dd>
            </div>
            <div>
              <dt>사업자등록번호</dt>
              <dd>{businessProfile.registrationNumber}</dd>
            </div>
            <div>
              <dt>전화번호</dt>
              <dd>
                <a href={businessProfile.phoneHref}>{businessProfile.phone}</a>
              </dd>
            </div>
          </dl>

          <div className="er-footer__trade">
            <span className="er-footer__trade-pair">
              <span className="er-footer__label">통신판매업 신고</span>
              <span className="er-footer__value">
                {businessProfile.mailOrderRegistrationNumber}
              </span>
            </span>
            <a
              className="er-footer__text-link"
              href={businessProfile.ftcBusinessInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="공정위 신고 조회 (새 창)"
            >
              공정위 신고 조회
              <svg
                className="er-footer__arrow"
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12 12 4m-5 0h5v5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <details
            className="er-footer__details"
            data-er-details
          >
            <summary className="er-footer__summary">
              <span>사업자 상세 정보</span>
              <span className="er-footer__summary-label">
                <span className="er-footer__open">보기</span>
                <span className="er-footer__close">닫기</span>
              </span>
              <svg
                className="er-footer__chevron"
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className="er-footer__panel">
              <div className="er-footer__details-grid">
                <section
                  className="er-footer__detail-group"
                  aria-label="등록 정보"
                >
                  <h3>등록 정보</h3>
                  <dl className="er-footer__detail-list">
                    <div>
                      <dt>게임제작업자 등록번호</dt>
                      <dd>{businessProfile.gameProducerRegistrationNumber}</dd>
                    </div>
                    <div>
                      <dt>등록 업종</dt>
                      <dd>
                        {businessProfile.registrationIndustries
                          .map((industry) => industry.code)
                          .join(" / ")}
                        <small>
                          {businessProfile.registrationIndustries[0].name},
                          <br />
                          {businessProfile.registrationIndustries[1].name},{" "}
                          {businessProfile.registrationIndustries[2].name}
                        </small>
                      </dd>
                    </div>
                  </dl>
                </section>
                <section
                  className="er-footer__detail-group"
                  aria-label="운영 정보"
                >
                  <h3>운영 정보</h3>
                  <dl className="er-footer__detail-list">
                    <div>
                      <dt>신고기관</dt>
                      <dd>{businessProfile.mailOrderRegistrationAuthority}</dd>
                    </div>
                    <div>
                      <dt>호스팅서비스 제공자</dt>
                      <dd>{businessProfile.hostingProvider}</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          </details>
        </div>

        <div className="er-footer__bottom">
          <p className="er-footer__copyright">© 2026 ERSIYAN</p>
          <nav className="er-footer__nav" aria-label="개인정보 및 페이지 이동">
            <a
              className="er-footer__nav-link er-footer__nav-link--primary"
              href="/privacy"
            >
              개인정보처리방침
            </a>
            <a className="er-footer__nav-link" href="/privacy/mine-logic">
              MINE LOGIC 개인정보처리방침
            </a>
            <a
              className="er-footer__nav-link er-footer__back"
              href="#top"
              data-er-back-top
            >
              맨 위로
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 13V3m-4 4 4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
