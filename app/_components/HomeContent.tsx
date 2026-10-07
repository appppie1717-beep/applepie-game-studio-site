import { GameShowcase } from "./GameShowcase";
import { HomeExperience, type HomeDivision } from "./HomeExperience";
import { StudioAccordion } from "./StudioAccordion";
import { ErFooter } from "./ErFooter";
import { VirtualRecruitment } from "./VirtualRecruitment";

export const homeDescription =
  "에르시안(ERSIYAN)의 공식 홈페이지입니다. MINE LOGIC 등 게임 개발·운영 소식과 치지직(CHZZK) 3D 버튜버 프로젝트 준비 현황을 안내합니다. 회사 정보와 각 사업부의 소식을 확인해 보세요.";
export const gamesDescription =
  "에르시안 게임부의 1인 인디 게임 개발·운영 소식입니다. 출시한 안드로이드 지뢰찾기 게임 MINE LOGIC(마인로직)과 개발 중인 VELSIEN SUMMIT의 소개, 게임 화면, 개발 기록을 확인할 수 있습니다.";
export const virtualDescription =
  "에르시안의 0기 버추얼 크리에이터 모집·활동 안내입니다. 치지직(CHZZK) 3D 버튜버(VTuber) 활동과 매니지먼트를 준비하며, 내부 준비로 신규 모집은 일시 중단 중입니다. 모집 재개 시 공지합니다. 지원 범위와 조건은 FAQ에서 확인해 주세요.";

const organizationId = "https://ersiyan.com/#organization";
const gamesId = "https://ersiyan.com/#games-organization";
const virtualId = "https://ersiyan.com/#virtual-organization";

function structuredData(division: HomeDivision) {
  const isVirtual = division === "virtual";
  const pageUrl = isVirtual ? "https://ersiyan.com/virtual" : "https://ersiyan.com/games";
  const description = isVirtual ? virtualDescription : gamesDescription;

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
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isVirtual
          ? "에르시안 버츄얼 | 버튜버 활동 안내 · 모집 일시 중단"
          : "에르시안 게임부 · 게임 개발과 운영 | ERSIYAN GAMES",
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": "https://ersiyan.com/#website" },
        about: { "@id": isVirtual ? virtualId : gamesId },
        dateModified: "2026-09-30",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: isVirtual
            ? "https://ersiyan.com/ersiyan-virtual-gen0-social-card.png"
            : "https://ersiyan.com/ersiyan-brand-social.jpg",
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
        image: "https://ersiyan.com/images/brand/ersiyan-logo.png",
        logo: {
          "@type": "ImageObject",
          url: "https://ersiyan.com/images/brand/ersiyan-logo.png",
          contentUrl: "https://ersiyan.com/images/brand/ersiyan-logo.png",
          width: 1448,
          height: 1086,
        },
        department: [{ "@id": gamesId }, { "@id": virtualId }],
      },
      {
        "@type": "Organization",
        "@id": gamesId,
        name: "ERSIYAN GAMES",
        url: "https://ersiyan.com/games",
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
              에르시안의 1인 인디 게임 개발·운영 부문입니다. 안드로이드 지뢰찾기 게임
              MINE LOGIC(마인로직)을 출시했고, 새 프로젝트 VELSIEN SUMMIT을 개발하고 있습니다.
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
        footer={<CompanyFooter division={division} />}
      >
        {division === "virtual" ? <VirtualRecruitment /> : <GamesContent />}
      </HomeExperience>
    </>
  );
}
