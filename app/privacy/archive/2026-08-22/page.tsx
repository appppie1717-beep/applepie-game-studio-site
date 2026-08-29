/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../../../_components/BrandLockup";
import { GameProducerRegistration } from "../../../_components/GameProducerRegistration";

export const metadata: Metadata = {
  title: "개인정보처리방침 2026년 8월 22일 보관본",
  description: "애플파이 게임 스튜디오 개인정보처리방침의 최초 공개 버전입니다.",
  alternates: {
    canonical: "/privacy/archive/2026-08-22",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const policySections = [
  ["overview", "방침 개요"],
  ["collection", "처리하는 정보"],
  ["purpose", "처리 목적과 보유"],
  ["cookies", "쿠키와 외부 서비스"],
  ["rights", "이용자 권리와 문의"],
  ["apps", "게임 앱 정책"],
  ["changes", "방침 변경"],
];

export default function ArchivedPrivacyPolicy() {
  return (
    <div className="privacy-page">
      <a className="skip-link" href="#policy-content">
        본문으로 바로가기
      </a>

      <header className="privacy-header">
        <div className="header-inner">
          <BrandLockup />
          <a className="back-link" href="/privacy">
            ← 현행 방침으로 돌아가기
          </a>
        </div>
      </header>

      <main id="policy-content">
        <section className="privacy-hero section-pad" aria-labelledby="policy-title">
          <p className="eyebrow">PRIVACY POLICY ARCHIVE</p>
          <h1 id="policy-title">개인정보처리방침 보관본</h1>
          <p>
            2026년 8월 22일부터 다음 변경본 적용 직전까지 공개된 애플파이 게임
            스튜디오 공식 홈페이지의 최초 개인정보처리방침입니다.
          </p>
          <span className="draft-note">적용일 2026년 8월 22일</span>
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
            <section id="overview" aria-labelledby="overview-title">
              <h2 id="overview-title">1. 방침 개요</h2>
              <p>
                이 방침은 애플파이 게임 스튜디오 공식 홈페이지에 적용됩니다.
                홈페이지와 각 게임 앱은 처리하는 정보와 기능이 다르므로 게임별
                개인정보처리방침은 별도로 제공합니다.
              </p>
              <p>
                이 홈페이지는 개인사업자 애플파이(대표자 탁진, 사업자등록번호
                206-43-62580)가 애플파이 게임 스튜디오 브랜드로 운영합니다.
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
                문의 내용, 첨부파일을 확인할 수 있습니다. 또한 홈페이지 호스팅에
                사용하는 OpenAI Sites와 그 기반 서비스가 서비스 제공과 보안 유지를
                위해 IP 주소, 브라우저 정보, 접속 기록을 자동으로 처리할 수 있습니다.
              </p>
            </section>

            <section id="purpose" aria-labelledby="purpose-title">
              <h2 id="purpose-title">3. 개인정보의 처리 목적과 보유 기간</h2>
              <p>이메일로 제공된 정보는 문의 확인·답변과 필요한 후속 조치에 사용합니다.</p>
              <p>
                문의 정보는 답변과 관련 대응이 끝난 뒤 불필요해지면 삭제합니다. 다만
                관계 법령에 따른 보관 의무가 있거나 분쟁 대응이 필요한 경우에는 해당
                기간 동안 보관할 수 있습니다.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title">
              <h2 id="cookies-title">4. 쿠키와 외부 서비스</h2>
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
              <h2 id="rights-title">5. 이용자 권리와 문의</h2>
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
              <h2 id="apps-title">6. 게임 앱 정책</h2>
              <p>
                이 방침은 공식 홈페이지에 관한 내용입니다. MINE LOGIC과 앞으로 출시할
                게임은 네트워크, 결제, 광고, 분석 도구 등 실제로 사용하는 기능과
                서비스에 맞춰 별도의 개인정보처리방침을 제공합니다.
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-title">
              <h2 id="changes-title">7. 방침 변경</h2>
              <p>
                이 방침이 변경되면 시행 전에 홈페이지에서 변경 내용과 시행일을
                안내합니다. 이 방침의 최초 시행일은 2026년 8월 22일입니다.
              </p>
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
            <a href="/privacy">현행 방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
