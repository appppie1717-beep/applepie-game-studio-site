/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page links load complete static documents. */
import type { Metadata } from "next";
import "./home.css";
import { BrandLockup } from "./_components/BrandLockup";
import { CompanyHistory } from "./_components/CompanyHistory";
import { ErFooter } from "./_components/ErFooter";
import { businessProfile } from "./_components/business-profile";
import styles from "./company/company.module.css";

const title = "에르시안 | 게임 개발 · 버추얼 크리에이터";
const description =
  "에르시안(ERSIYAN)의 공식 홈페이지입니다. MINE LOGIC 등 게임 개발·운영 소식과 치지직(CHZZK) 3D 버튜버 프로젝트 준비 현황을 안내합니다. 회사 정보와 각 사업부의 소식을 확인해 보세요.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/",
    title,
    description,
    images: [{ url: "/ersiyan-brand-social.jpg", width: 1200, height: 630, alt: "에르시안(ERSIYAN) 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/ersiyan-brand-social.jpg", alt: "에르시안(ERSIYAN) 로고" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ersiyan.com/#website",
      url: "https://ersiyan.com/",
      name: "에르시안",
      alternateName: "ERSIYAN",
      description,
      inLanguage: "ko-KR",
      publisher: { "@id": "https://ersiyan.com/#organization" },
    },
    {
      "@type": "AboutPage",
      "@id": "https://ersiyan.com/#webpage",
      url: "https://ersiyan.com/",
      name: title,
      description,
      inLanguage: "ko-KR",
      isPartOf: { "@id": "https://ersiyan.com/#website" },
      about: { "@id": "https://ersiyan.com/#organization" },
      dateModified: "2026-09-30",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://ersiyan.com/ersiyan-brand-social.jpg",
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ersiyan.com/#organization",
      url: "https://ersiyan.com/",
      name: businessProfile.businessName,
      legalName: businessProfile.businessName,
      alternateName: "ERSIYAN",
      foundingDate: "2026-08-19",
      description,
      email: businessProfile.email,
      telephone: "+82-10-2416-6267",
      image: "https://ersiyan.com/images/brand/ersiyan-logo.png",
      logo: {
        "@type": "ImageObject",
        url: "https://ersiyan.com/images/brand/ersiyan-logo.png",
        contentUrl: "https://ersiyan.com/images/brand/ersiyan-logo.png",
        width: 1448,
        height: 1086,
      },
      department: [
        { "@id": "https://ersiyan.com/#games-organization" },
        { "@id": "https://ersiyan.com/#virtual-organization" },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://ersiyan.com/#games-organization",
      name: "ERSIYAN GAMES",
      url: "https://ersiyan.com/games",
      description: "에르시안의 게임 개발 및 운영 부문입니다. MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하고 있습니다.",
      parentOrganization: { "@id": "https://ersiyan.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://ersiyan.com/#virtual-organization",
      name: "ERSIYAN VIRTUAL",
      url: "https://ersiyan.com/virtual",
      description: "에르시안의 버츄얼 부문입니다. 치지직(CHZZK)에서 3D 버튜버 활동을 준비합니다. 0기 크리에이터 모집은 일시 중단 중입니다.",
      email: "biz@ersiyan.com",
      parentOrganization: { "@id": "https://ersiyan.com/#organization" },
    },
  ],
};

export default function Home() {
  return (
    <div id="top" className={styles.page}>
      <a className="skip-link" href="#company-content">본문으로 바로가기</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <BrandLockup />
          <nav className={styles.navigation} aria-label="에르시안 주요 메뉴">
            <a href="/" aria-current="page">회사 정보</a>
            <a href="/games">게임부</a>
            <a href="/virtual">버츄얼부</a>
            <a href="/notices">공지사항</a>
          </nav>
        </div>
      </header>

      <main id="company-content" tabIndex={-1}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        <section id="ersiyan-company-view" className={styles.hero} aria-labelledby="company-title">
          <div className={styles.inner}>
            <p className={styles.eyebrow}>ERSIYAN</p>
            <h1 id="company-title">에르시안</h1>
            <p className={styles.lead}>
              게임을 개발하고 운영하며,<br className={styles.desktopBreak} /> 버추얼 크리에이터 활동을 준비합니다.
            </p>
          </div>
        </section>

        <section className={styles.divisions} aria-label="사업부 선택">
          <div className={`${styles.inner} ${styles.divisionGrid}`}>
            <a className={styles.divisionCard} href="/games">
              <span className={styles.divisionName}>ERSIYAN GAMES</span>
              <h2>게임부 <span aria-hidden="true">↗</span></h2>
              <p>안드로이드 지뢰찾기 MINE LOGIC과 개발 중인 VELSIEN SUMMIT을 소개합니다.</p>
              <span className={styles.cardAction}>게임부로 이동 <span aria-hidden="true">→</span></span>
            </a>
            <a className={styles.divisionCard} href="/virtual">
              <span className={styles.divisionName}>ERSIYAN VIRTUAL</span>
              <h2>버츄얼부 <span aria-hidden="true">↗</span></h2>
              <p>치지직 3D 버튜버 활동을 준비합니다. 0기 크리에이터 모집은 일시 중단 중입니다.</p>
              <span className={styles.cardAction}>버츄얼부로 이동 <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </section>

        <section className={styles.identity} aria-labelledby="identity-title">
          <div className={styles.inner}>
            <h2 id="identity-title">사업자 정보</h2>
            <dl className={styles.identityList}>
              <div><dt>상호</dt><dd>{businessProfile.businessName}</dd></div>
              <div><dt>대표자</dt><dd>{businessProfile.representative}</dd></div>
              <div><dt>사업자등록번호</dt><dd>{businessProfile.registrationNumber}</dd></div>
            </dl>
            <a className={styles.detailLink} href="#business-info">
              사업자 상세 정보 <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className={`company-info-view section-pad ${styles.history}`} aria-labelledby="history-section-title">
          <div className={styles.historyHeading}>
            <h2 id="history-section-title">에르시안 연혁</h2>
            <p>개업과 게임 출시, 회사의 주요 기록.</p>
          </div>
          <CompanyHistory />
        </section>
      </main>
      <ErFooter context="company" />
    </div>
  );
}
