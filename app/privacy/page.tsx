/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../_components/BrandLockup";
import { GameProducerRegistration } from "../_components/GameProducerRegistration";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "/privacy",
    title: "개인정보처리방침 | 에르시안",
    description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
  },
};

const policySections = [
  ["change-notice", "2026년 변경 안내"],
  ["overview", "방침 개요"],
  ["collection", "처리하는 정보"],
  ["hosting", "호스팅과 국외 처리"],
  ["purpose", "처리 목적과 보유"],
  ["cookies", "쿠키와 외부 서비스"],
  ["rights", "이용자 권리와 문의"],
  ["apps", "게임 앱 정책"],
  ["changes", "방침 변경"],
];

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <a className="skip-link" href="#policy-content">
        본문으로 바로가기
      </a>

      <header className="privacy-header">
        <div className="header-inner">
          <BrandLockup />
          <a className="back-link" href="/">
            ← 홈페이지로 돌아가기
          </a>
        </div>
      </header>

      <main id="policy-content">
        <section className="privacy-hero section-pad" aria-labelledby="policy-title">
          <p className="eyebrow">PRIVACY POLICY</p>
          <h1 id="policy-title">개인정보처리방침</h1>
          <p>
            에르시안은 필요한 정보만 최소한으로 처리하고, 이용자가
            이해하기 쉬운 방식으로 안내하는 것을 원칙으로 합니다.
          </p>
          <span className="draft-note">
            최초 시행일 2026년 8월 22일 · 최근 변경일 및 시행일 2026년 8월 28일
          </span>
        </section>

        <div className="policy-content section-pad">
          <ol className="policy-index" aria-label="개인정보처리방침 목차">
            {policySections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>

          <div className="policy-sections">
            <section id="change-notice" className="policy-change-notice" aria-labelledby="change-notice-title">
              <p className="policy-change-kicker">2026년 8월 28일 변경 안내</p>
              <h2 id="change-notice-title">브랜드 및 공식 도메인 변경</h2>
              <p>
                개인사업자 애플파이가 운영하는 공식 브랜드가
                에르시안(ERSIYAN)으로 변경되고, 공식 홈페이지가 applepie.im에서
                ersiyan.com으로 이전되었습니다.
              </p>
              <p>
                개인정보 처리 주체, 처리 목적과 범위, 문의 창구, 호스팅 제공자는
                변경되지 않았습니다. 변경 전 방침은 계속 열람할 수 있습니다.
              </p>
              <p>
                <a href="/privacy/archive/2026-08-23">
                  2026년 8월 23일 개인정보처리방침 보기
                </a>
              </p>
            </section>

            <section id="overview" aria-labelledby="overview-title">
              <h2 id="overview-title">1. 방침 개요</h2>
              <p>
                이 방침은 에르시안 공식 홈페이지에 적용됩니다.
                홈페이지와 각 게임 앱은 처리하는 정보와 기능이 다르므로 게임별
                개인정보처리방침은 별도로 제공합니다.
              </p>
              <p>
                이 홈페이지는 개인사업자 애플파이(대표자 탁진, 사업자등록번호
                206-43-62580)가 에르시안(ERSIYAN) 브랜드로 운영합니다.
              </p>
            </section>

            <section id="collection" aria-labelledby="collection-title">
              <h2 id="collection-title">2. 처리하는 정보</h2>
              <p>
                홈페이지는 회원가입과 문의 양식을 제공하지 않으며 방문자의
                개인정보를 자체 데이터베이스에 직접 수집하거나 저장하지 않습니다.
              </p>
              <p>
                이용자가 이메일로 문의하는 경우, 발신 이메일 주소와 메일에 기재한 이름,
                문의 내용, 첨부파일을 확인할 수 있습니다. 홈페이지 제공 과정에서는
                Cloudflare가 IP 주소, 트래픽 라우팅 정보, 시스템 구성 정보와 접속 요청
                정보를 처리할 수 있습니다.
              </p>
            </section>

            <section id="hosting" aria-labelledby="hosting-title">
              <h2 id="hosting-title">3. 호스팅과 국외 처리</h2>
              <p>
                홈페이지의 정적 파일 제공, 콘텐츠 전송, HTTPS와 보안 유지를 위해 미국
                소재 Cloudflare, Inc.의 Workers Static Assets, CDN과 DNS 서비스를
                사용합니다. 접속 과정에서 IP 주소, 트래픽 라우팅 정보, 시스템 구성
                정보와 요청 정보가 암호화된 네트워크를 통해 자동 처리될 수 있습니다.
              </p>
              <p>
                Cloudflare는 미국과 유럽경제지역을 중심으로 정보를 저장하고 글로벌
                서비스 운영 국가에서 정보를 전송하거나 접근할 수 있다고 안내합니다.
                구체적인 처리와 보유는
                {" "}
                <a
                  href="https://www.cloudflare.com/ko-kr/privacypolicy/"
                  rel="noreferrer"
                >
                  Cloudflare 개인정보 취급방침
                </a>
                을 따릅니다.
              </p>
              <p>
                운영자는 별도의 방문자 분석 도구를 추가하지 않으며, Cloudflare의
                개별 방문자 요청 로그를 홈페이지 데이터베이스에 수집하거나 내려받아
                보관하지 않습니다. 접속 정보의 자동 처리를 원하지 않으면 홈페이지에
                접속하지 않는 방법으로 거부할 수 있으나 이 경우 홈페이지를 이용할 수
                없습니다.
              </p>
              <p>
                안정화 기간에는 기존 OpenAI Sites 버전을 장애 복구용으로만 보존합니다.
                OpenAI Sites 주소에 직접 접속하거나 장애 복구로 되돌린 경우에는 해당
                서비스와 그 기반 서비스가 IP 주소, 브라우저 정보와 접속 기록을 처리할
                수 있습니다.
              </p>
            </section>

            <section id="purpose" aria-labelledby="purpose-title">
              <h2 id="purpose-title">4. 개인정보의 처리 목적과 보유 기간</h2>
              <p>이메일로 제공된 정보는 문의 확인·답변과 필요한 후속 조치에 사용합니다.</p>
              <p>
                문의 정보는 답변과 관련 대응이 끝난 뒤 불필요해지면 삭제합니다. 다만
                관계 법령에 따른 보관 의무가 있거나 분쟁 대응이 필요한 경우에는 해당
                기간 동안 보관할 수 있습니다.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title">
              <h2 id="cookies-title">5. 쿠키와 외부 서비스</h2>
              <p>
                현재 홈페이지는 자체 광고 쿠키나 방문자 분석 도구를 사용하지 않습니다.
                향후 관련 기능을 추가하면 적용 전에 이 방침을 변경해 안내합니다.
              </p>
              <p>
                홈페이지에는 Google Play 등 외부 서비스로 이동하는 링크가 포함될 수
                있습니다. 외부 서비스에서 이루어지는 정보 처리는 해당 서비스의
                개인정보처리방침을 따릅니다.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-title">
              <h2 id="rights-title">6. 이용자 권리와 문의</h2>
              <p>
                본인의 개인정보에 대한 열람·정정·삭제 등 개인정보 처리에 관한 문의는
                아래 이메일로 요청할 수 있습니다.
              </p>
              <p>
                개인정보 문의 이메일{" "}
                <a href="mailto:help@ersiyan.com">help@ersiyan.com</a>
              </p>
            </section>

            <section id="apps" aria-labelledby="apps-title">
              <h2 id="apps-title">7. 게임 앱 정책</h2>
              <p>
                이 방침은 공식 홈페이지에 관한 내용입니다. MINE LOGIC과 앞으로 출시할
                게임은 네트워크, 결제, 광고, 분석 도구 등 실제로 사용하는 기능과
                서비스에 맞춰 별도의 개인정보처리방침을 제공합니다.
              </p>
              <p>
                <a href="/privacy/mine-logic">MINE LOGIC 개인정보처리방침 보기</a>
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-title">
              <h2 id="changes-title">8. 방침 변경과 이전 버전</h2>
              <p>
                이 방침이 변경되면 시행 전에 홈페이지에서 변경 내용과 시행일을
                안내합니다. 이 방침의 최초 시행일은 2026년 8월 22일입니다.
              </p>
              <ul>
                <li>
                  2026년 8월 28일 변경본부터 에르시안 브랜드와 ersiyan.com 공식
                  도메인을 사용합니다.
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-23">
                    2026년 8월 23일 변경 방침
                  </a>
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-22">
                    2026년 8월 22일 최초 방침
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p>© {new Date().getFullYear()} ERSIYAN</p>
            <GameProducerRegistration />
          </div>
          <div>
            <a href="/">홈페이지</a>
            <a href="mailto:help@ersiyan.com">문의</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
