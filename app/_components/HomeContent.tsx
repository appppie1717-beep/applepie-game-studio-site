import { CompanyHistory } from "./CompanyHistory";
import { GameShowcase } from "./GameShowcase";
import { HomeExperience, type HomeDivision } from "./HomeExperience";
import { StudioAccordion } from "./StudioAccordion";
import { ErFooter } from "./ErFooter";

export const homeDescription =
  "에르시안(ERSIYAN)은 한국 1인 인디 게임 스튜디오로서 ERSIYAN GAMES에서 게임을 개발·운영하고, ERSIYAN VIRTUAL에서 버츄얼 크리에이터·디지털 캐릭터 사업을 준비합니다.";
export const virtualDescription =
  "ERSIYAN VIRTUAL은 에르시안의 버츄얼 크리에이터·디지털 캐릭터·엔터테인먼트 사업 영역입니다. 현재 PROJECT 001을 준비 중이며, 공개된 상세 정보는 아직 없습니다.";

const organizationId = "https://ersiyan.com/#organization";
const gamesId = "https://ersiyan.com/#games-organization";
const virtualId = "https://ersiyan.com/#virtual-organization";

function structuredData(division: HomeDivision) {
  const isVirtual = division === "virtual";
  const pageUrl = isVirtual ? "https://ersiyan.com/virtual" : "https://ersiyan.com/";
  const description = isVirtual ? virtualDescription : homeDescription;

  return {
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
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": isVirtual ? "https://ersiyan.com/virtual#webpage" : "https://ersiyan.com/#webpage",
        url: pageUrl,
        name: isVirtual
          ? "ERSIYAN VIRTUAL · 버츄얼 크리에이터·디지털 캐릭터 | 에르시안"
          : "에르시안(ERSIYAN) · 게임 개발과 운영",
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": "https://ersiyan.com/#website" },
        about: { "@id": isVirtual ? virtualId : organizationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://ersiyan.com/ersiyan-social-card.jpg",
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        url: "https://ersiyan.com/",
        name: "에르시안",
        legalName: "에르시안",
        alternateName: "ERSIYAN",
        foundingDate: "2026-08-19",
        description: homeDescription,
        email: "help@ersiyan.com",
        telephone: "+82-10-2416-6267",
        image: "https://ersiyan.com/images/brand/ersiyan-logo-hero.webp",
        logo: {
          "@type": "ImageObject",
          url: "https://ersiyan.com/images/brand/ersiyan-logo-hero.webp",
          contentUrl: "https://ersiyan.com/images/brand/ersiyan-logo-hero.webp",
          width: 960,
          height: 246,
        },
        department: [{ "@id": gamesId }, { "@id": virtualId }],
      },
      {
        "@type": "Organization",
        "@id": gamesId,
        name: "ERSIYAN GAMES",
        url: "https://ersiyan.com/",
        description: "에르시안의 게임 개발 및 운영 영역입니다. MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하고 있습니다.",
        parentOrganization: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": virtualId,
        name: "ERSIYAN VIRTUAL",
        url: "https://ersiyan.com/virtual",
        description: virtualDescription,
        parentOrganization: { "@id": organizationId },
      },
    ],
  };
}

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

function GamesContent() {
  return (
          <>
        <section className="hero section-pad" aria-labelledby="games-intro-title">
          <div className="hero-copy">
            <p className="eyebrow">ERSIYAN GAMES · INDEPENDENT GAMES</p>
            <h2 id="games-intro-title">
              제가 좋아하는 인디 게임을
              <br />
              <span>직접 만들고</span>
              <br />
              끝까지 운영합니다.
            </h2>
            <p className="hero-description">
              ERSIYAN GAMES는 에르시안의 게임 개발 및 운영 영역입니다.
              한국 1인 인디 게임 스튜디오로서 MINE LOGIC을 출시하고
              VELSIEN SUMMIT을 개발하고 있습니다.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#games">
                게임 살펴보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="button button--quiet" href="#studio">
                게임을 만드는 기준
              </a>
            </div>

            <dl className="hero-facts" aria-label="ERSIYAN GAMES 현황">
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
              <picture>
              <img
                src="/images/brand/ersiyan-logo-hero.webp"
                alt="에르시안(ERSIYAN) 로고"
                width={960}
                height={246}
                sizes="(max-width: 1060px) 92vw, 46vw"
                loading="eager"
                decoding="async"
              />
              </picture>
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
            <p className="eyebrow">ABOUT ERSIYAN GAMES · 02</p>
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
          </>
  );
}

function VirtualContent() {
  return (
          <>
            <div className="virtual-intro">
              <p className="eyebrow">ERSIYAN · VIRTUAL</p>
              <h2 id="virtual-title">ERSIYAN VIRTUAL</h2>
              <p className="virtual-description">
                에르시안은 버츄얼 크리에이터와 디지털 캐릭터를 중심으로 한<br className="desktop-break" />{" "}
                엔터테인먼트 사업을 준비하고 있습니다. 현재 PROJECT 001을 준비 중이며,
                공개된 상세 정보는 아직 없습니다.
              </p>
            </div>
            <div className="virtual-project" aria-label="프로젝트 001 준비 중">
              <span className="preparation-status">IN PREPARATION</span>
              <h3>PROJECT 001</h3>
              <p>버츄얼 크리에이터·디지털 캐릭터 프로젝트로 준비 중입니다.</p>
            </div>
          </>
  );
}

function CompanyContent() {
  return (
          <>
            <div className="company-intro">
              <div>
                <p className="eyebrow">ABOUT ERSIYAN</p>
                <h2 id="company-title">에르시안 회사 정보</h2>
              </div>
              <div>
                <p>
                  에르시안은 ERSIYAN GAMES와 ERSIYAN VIRTUAL을 두 사업 영역으로
                  둔 회사이자 브랜드입니다. 게임 개발과 운영을 이어가며,
                  버츄얼·디지털 엔터테인먼트 영역을 준비하고 있습니다.
                </p>
                <a className="company-info-link" href="#business-info">
                  에르시안 사업자 정보 <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <CompanyHistory />
          </>
  );
}

function CompanyFooter() {
  return <ErFooter id="business-info" />;
}

export function DivisionHomePage({ division }: { division: HomeDivision }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(division)) }}
      />
      <HomeExperience
        division={division}
        company={<CompanyContent />}
        footer={<CompanyFooter />}
      >
        {division === "virtual" ? <VirtualContent /> : <GamesContent />}
      </HomeExperience>
    </>
  );
}
