import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { BrandLockup } from "./_components/BrandLockup";
import { businessProfile } from "./_components/business-profile";
import { GameShowcase } from "./_components/GameShowcase";
import { StudioAccordion } from "./_components/StudioAccordion";

const homeTitle =
  "에르시안 | MINE LOGIC·VELSIEN SUMMIT 인디 게임 스튜디오";
const homeDescription =
  "에르시안은 MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하는 한국 1인 인디 게임 스튜디오입니다. 단계별 힌트와 20단계 훈련을 갖춘 지뢰찾기 게임, 개발 중인 모바일 수집형 2D SRPG의 소식과 화면을 확인하세요.";

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/",
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "MINE LOGIC과 VELSIEN SUMMIT을 만드는 에르시안 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        alt: "MINE LOGIC과 VELSIEN SUMMIT을 만드는 에르시안 로고",
      },
    ],
  },
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ersiyan.com/#website",
      url: "https://ersiyan.com/",
      name: "에르시안",
      alternateName: "ERSIYAN",
      description: homeDescription,
      inLanguage: "ko-KR",
      publisher: {
        "@id": "https://ersiyan.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://ersiyan.com/#organization",
      url: "https://ersiyan.com/",
      name: "에르시안",
      alternateName: "ERSIYAN",
      description:
        "MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하는 한국 1인 인디 게임 스튜디오입니다.",
      logo: {
        "@type": "ImageObject",
        url: "https://ersiyan.com/images/brand/ersiyan-logo-hero.webp",
        contentUrl:
          "https://ersiyan.com/images/brand/ersiyan-logo-hero.webp",
        width: 960,
        height: 246,
      },
    },
  ],
};

const logicCells = [
  "2",
  "flag",
  "2",
  "1",
  "0",
  "1",
  "2",
  "mine",
  "2",
  "1",
  "0",
  "1",
  "2",
  "flag",
  "1",
  "0",
  "0",
  "1",
  "1",
  "1",
  "0",
  "0",
  "0",
  "0",
  "0",
];

function LogicGrid() {
  return (
    <div className="logic-grid" aria-hidden="true">
      {logicCells.map((cell, index) => (
        <span
          className={`logic-cell logic-cell--${cell}`}
          key={`${cell}-${index}`}
        >
          {cell === "flag" ? "⚑" : cell === "mine" ? "✦" : cell}
        </span>
      ))}
    </div>
  );
}

function BusinessDetail({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className={className}>{children}</dd>
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="site-header">
        <div className="header-inner">
          <BrandLockup href="#top" />

          <nav className="primary-nav" aria-label="주요 메뉴">
            <a href="#games">게임</a>
            <a href="#studio">소개</a>
            <a href="#business-info">사업자 정보</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">INDEPENDENT GAMES</p>
            <h1 id="hero-title">
              제가 좋아하는 인디 게임을
              <br />
              <span>직접 만들고</span>
              <br />
              끝까지 운영합니다.
            </h1>
            <p className="hero-description">
              에르시안은 MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하는 한국
              1인 인디 게임 스튜디오입니다.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#games">
                게임 살펴보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="button button--quiet" href="#studio">
                에르시안 이야기
              </a>
            </div>

            <dl className="hero-facts" aria-label="에르시안 현황">
              <div>
                <dt>RELEASED</dt>
                <dd>1 title</dd>
              </div>
              <div>
                <dt>IN DEVELOPMENT</dt>
                <dd>1 project</dd>
              </div>
              <div>
                <dt>BASED IN</dt>
                <dd>South Korea</dd>
              </div>
            </dl>
          </div>

          <div className="hero-visual">
            <div className="logo-stage">
              <Image
                src="/images/brand/ersiyan-logo-hero.webp"
                alt="에르시안(ERSIYAN) 로고"
                width={960}
                height={246}
                sizes="(max-width: 1060px) 92vw, 46vw"
                priority
              />
            </div>
            <div className="hero-grid-card">
              <div>
                <span className="mini-label">FIRST RELEASE</span>
                <strong>MINE LOGIC · 2026</strong>
              </div>
              <LogicGrid />
            </div>
          </div>
        </section>

        <section id="games" className="games section-pad" aria-labelledby="games-title">
          <div className="section-heading">
            <p className="eyebrow">OUR GAMES · 01</p>
            <h2 id="games-title">작품 둘러보기</h2>
            <p>게임을 선택해 화면과 소개를 둘러보세요.</p>
          </div>
          <GameShowcase />
        </section>

        <section id="studio" className="studio section-pad" aria-labelledby="studio-title">
          <div className="studio-intro">
            <p className="eyebrow">ABOUT ERSIYAN · 02</p>
            <h2 id="studio-title">
              게임을 만들 때
              <br />
              신경 쓰는 것
            </h2>
          </div>

          <div className="studio-body">
            <StudioAccordion />
          </div>
        </section>
      </main>

      <footer id="business-info" className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <p>© {new Date().getFullYear()} ERSIYAN</p>
            <p className="footer-operator">
              개인사업자 에르시안이 운영하는 공식 홈페이지입니다.
            </p>
            <p className="footer-scope">
              이 홈페이지에서는 주문이나 결제를 받지 않습니다. 앱 설치와 거래는
              Google Play에서 진행됩니다.
            </p>
          </div>

          <div className="footer-business-wrap">
            <div className="footer-business-title">
              <span>BUSINESS INFORMATION</span>
              <strong>사업자 정보</strong>
            </div>
            <dl className="footer-business" aria-label="에르시안 법정 사업자 정보">
              <BusinessDetail label="상호">{businessProfile.businessName}</BusinessDetail>
              <BusinessDetail label="대표자">{businessProfile.representative}</BusinessDetail>
              <BusinessDetail label="사업자등록번호">
                {businessProfile.registrationNumber}
              </BusinessDetail>
              <BusinessDetail label="게임제작업자 등록번호">
                {businessProfile.gameProducerRegistrationNumber}
              </BusinessDetail>
              <BusinessDetail
                label="통신판매업 신고"
                className="footer-business-registration"
              >
                <span>{businessProfile.mailOrderRegistrationNumber}</span>
                <span className="footer-business-authority">
                  신고기관 {businessProfile.mailOrderRegistrationAuthority}
                </span>
                <a
                  className="footer-business-verify"
                  href={businessProfile.ftcBusinessInfoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="공정거래위원회에서 통신판매업 신고 확인"
                >
                  공정위 신고 조회 <span aria-hidden="true">↗</span>
                </a>
              </BusinessDetail>
              <BusinessDetail label="전화번호">
                <a href={businessProfile.phoneHref}>{businessProfile.phone}</a>
              </BusinessDetail>
              <BusinessDetail label="이메일">
                <a href={`mailto:${businessProfile.email}`}>{businessProfile.email}</a>
              </BusinessDetail>
              <BusinessDetail label="호스팅서비스 제공자">
                {businessProfile.hostingProvider}
              </BusinessDetail>
            </dl>
          </div>

          <div className="footer-links">
            <a href="#top">맨 위로</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/privacy/mine-logic">MINE LOGIC 개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
