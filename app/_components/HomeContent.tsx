import { CompanyHistory } from "./CompanyHistory";
import { GameShowcase } from "./GameShowcase";
import { HomeExperience, type HomeDivision } from "./HomeExperience";
import { StudioAccordion } from "./StudioAccordion";
import { ErFooter } from "./ErFooter";
import { VirtualRecruitment } from "./VirtualRecruitment";

export const homeDescription =
  "에르시안(ERSIYAN)은 ERSIYAN GAMES에서 게임을 개발·운영하고, ERSIYAN VIRTUAL 0기 소속 크리에이터 한 분을 모집합니다.";
export const virtualDescription =
  "에르시안 버츄얼 0기 소속 크리에이터 1명을 모집합니다. 만 19세 이상, 경력 없이 지원할 수 있는 치지직 3D 버튜버 모집입니다. 모집 안내를 확인하고 Google 설문지에 간단한 기본 정보와 시청자 다섯 명과 이야기하는 3~5분 자유 토크 음성을 보내주세요.";

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
          ? "에르시안 버츄얼 0기 버튜버 모집 | ERSIYAN VIRTUAL"
          : "에르시안(ERSIYAN) · 게임 개발과 운영",
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": "https://ersiyan.com/#website" },
        about: { "@id": isVirtual ? virtualId : organizationId },
        ...(isVirtual ? { dateModified: "2026-09-22" } : {}),
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: isVirtual
            ? "https://ersiyan.com/ersiyan-virtual-gen0-social-card.png"
            : "https://ersiyan.com/ersiyan-social-card.jpg",
          width: isVirtual ? 1731 : 1200,
          height: isVirtual ? 909 : 630,
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
        email: "biz@ersiyan.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "recruitment",
          email: "biz@ersiyan.com",
        },
        parentOrganization: { "@id": organizationId },
      },
    ],
  };
}

function GamesContent() {
  return (
      <>
        <section className="hero section-pad" aria-labelledby="games-intro-title">
          <div className="hero-copy">
            <p className="eyebrow">ERSIYAN GAMES / 게임 개발·운영</p>
            <h2 id="games-intro-title">
              직접 만든 게임을<br />
              <span>출시하고 운영합니다.</span>
            </h2>
            <p className="hero-description">
              에르시안의 게임 개발·운영 부문입니다. 1인 개발 게임 MINE LOGIC을
              출시했고, 새 프로젝트 VELSIEN SUMMIT을 개발하고 있습니다.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#games">
                게임 살펴보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="button button--quiet" href="#studio">
                게임을 만드는 기준
              </a>
            </div>

          </div>

          <div className="hero-visual" aria-label="에르시안 게임 화면 미리보기">
            <a className="hero-proof hero-proof--mine" href="/mine-logic">
              <span className="hero-proof__image">
                {/* eslint-disable-next-line @next/next/no-img-element -- preoptimized static WebP for Cloudflare assets */}
                <img
                  src="/images/mine-logic/02_hint-540.webp"
                  alt="MINE LOGIC 초급 지뢰찾기 화면. 숫자 힌트와 열기·깃발 버튼이 보입니다"
                  width={540}
                  height={960}
                  loading="eager"
                  decoding="async"
                />
              </span>
              <span className="hero-proof__caption">
                <small>출시 · ANDROID</small>
                <strong>MINE LOGIC <span aria-hidden="true">↗</span></strong>
              </span>
            </a>
            <a className="hero-proof hero-proof--velsien" href="/velsien-summit">
              <span className="hero-proof__image">
                {/* eslint-disable-next-line @next/next/no-img-element -- preoptimized static WebP for Cloudflare assets */}
                <img
                  src="/images/velsien-summit/devlog-20260905-city-960.webp"
                  alt="VELSIEN SUMMIT 개발 중인 하늘 위 수직도시 장면"
                  width={960}
                  height={540}
                  loading="eager"
                  decoding="async"
                />
              </span>
              <span className="hero-proof__caption">
                <small>개발 중 · WORLD PROJECT</small>
                <strong>VELSIEN SUMMIT <span aria-hidden="true">↗</span></strong>
              </span>
            </a>
            <p className="hero-visual-note">
              <span>01 / 02</span>
              실제 게임 화면과 공개 개발 이미지
            </p>
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

function CompanyContent({ division }: { division: HomeDivision }) {
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
                  에르시안 버츄얼 0기 크리에이터 한 분을 모집하고 있습니다.
                </p>
                <div className="company-intro-links">
                  {division === "games" && (
                    <a className="company-info-link" href="/virtual">
                      버츄얼 0기 크리에이터 모집 안내 <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  <a className="company-info-link" href="#business-info">
                    에르시안 사업자 정보 <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </div>
            <CompanyHistory />
          </>
  );
}

function CompanyFooter({ division }: { division: HomeDivision }) {
  return <ErFooter id="business-info" context={division} />;
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
        company={<CompanyContent division={division} />}
        footer={<CompanyFooter division={division} />}
      >
        {division === "virtual" ? <VirtualRecruitment /> : <GamesContent />}
      </HomeExperience>
    </>
  );
}
