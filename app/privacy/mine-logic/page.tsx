/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../../_components/BrandLockup";
import { businessProfile } from "../../_components/business-profile";
import { MineLogicPrivacyContent } from "./MineLogicPrivacyContent";
import { ErFooter } from "../../_components/ErFooter";

export const metadata: Metadata = {
  title: { absolute: "MINE LOGIC Privacy Policy | 에르시안" },
  description: "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
  alternates: {
    canonical: "/privacy/mine-logic",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    siteName: "ERSIYAN",
    url: "/privacy/mine-logic",
    title: "MINE LOGIC Privacy Policy | 에르시안",
    description: "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
    images: [
      {
        url: "/images/mine-logic/feature-1024.webp",
        width: 1024,
        height: 500,
        alt: "MINE LOGIC 앱 대표 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MINE LOGIC Privacy Policy | 에르시안",
    description: "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
    images: [
      {
        url: "/images/mine-logic/feature-1024.webp",
        alt: "MINE LOGIC 앱 대표 이미지",
      },
    ],
  },
};

const mineLogicPrivacyPolicyStructuredData = {
  "@context": "https://schema.org",
  "@type": ["WebPage", "PrivacyPolicy"],
  "@id": "https://ersiyan.com/privacy/mine-logic#webpage",
  url: "https://ersiyan.com/privacy/mine-logic",
  name: "MINE LOGIC Privacy Policy | 에르시안",
  description:
    "Privacy policy for the MINE LOGIC Android app, available in English and Korean.",
  inLanguage: ["en-US", "ko-KR"],
  datePublished: "2026-07-29",
  dateModified: "2026-08-31",
  mainEntity: { "@id": "https://ersiyan.com/mine-logic#app" },
  isPartOf: { "@id": "https://ersiyan.com/#website" },
  publisher: { "@id": "https://ersiyan.com/#organization" },
};

export default function MineLogicPrivacyPolicy() {
  return (
    <div id="top" className="privacy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mineLogicPrivacyPolicyStructuredData),
        }}
      />
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

      <ErFooter />
    </div>
  );
}
