/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../../_components/BrandLockup";
import { businessProfile } from "../../_components/business-profile";
import { GameProducerRegistration } from "../../_components/GameProducerRegistration";
import { MineLogicPrivacyContent } from "./MineLogicPrivacyContent";

export const metadata: Metadata = {
  title: "MINE LOGIC Privacy Policy",
  description: "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
  alternates: {
    canonical: "/privacy/mine-logic",
  },
  openGraph: {
    url: "/privacy/mine-logic",
    title: "MINE LOGIC Privacy Policy",
    description: "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
  },
};

export default function MineLogicPrivacyPolicy() {
  return (
    <div className="privacy-page">
      <a className="skip-link" href="#policy-content">
        본문으로 바로가기
      </a>

      <header className="privacy-header">
        <div className="header-inner">
          <BrandLockup />
          <a className="back-link" href="/">
            ← 홈페이지로
          </a>
        </div>
      </header>

      <main id="policy-content">
        <MineLogicPrivacyContent
          businessName={businessProfile.businessName}
          representative={businessProfile.representative}
          email={businessProfile.email}
        />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p>© {new Date().getFullYear()} ERSIYAN</p>
            <GameProducerRegistration />
          </div>
          <div className="privacy-footer-links">
            <a href="/">홈페이지</a>
            <a href="/privacy">사이트 개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
