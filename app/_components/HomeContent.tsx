import { CompanyHistory } from "./CompanyHistory";
import { GameShowcase } from "./GameShowcase";
import { HomeExperience, type HomeDivision } from "./HomeExperience";
import { StudioAccordion } from "./StudioAccordion";
import { ErFooter } from "./ErFooter";

export const homeDescription =
  "에르시안(ERSIYAN)은 ERSIYAN GAMES에서 게임을 개발·운영하고, ERSIYAN VIRTUAL 0기 소속 크리에이터 한 분을 모집합니다.";
export const virtualDescription =
  "에르시안 버츄얼(ERSIYAN VIRTUAL) 0기 소속 크리에이터 1명을 모집합니다. 방송·버츄얼 경험이 없어도 지원할 수 있습니다. 대화와 비공개 방송 테스트를 거쳐 캐릭터·장비·방송 환경을 함께 준비한 뒤 활동을 시작합니다. biz@ersiyan.com으로 지원하세요.";

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
          ? "에르시안 버츄얼 0기 크리에이터 모집 | ERSIYAN VIRTUAL"
          : "에르시안(ERSIYAN) · 게임 개발과 운영",
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": "https://ersiyan.com/#website" },
        about: { "@id": isVirtual ? virtualId : organizationId },
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

function VirtualContent() {
  return (
    <div className="virtual-recruitment">
      <div className="virtual-hero">
        <div className="virtual-intro">
          <p className="eyebrow">ERSIYAN VIRTUAL / 모집 안내</p>
          <p className="virtual-status"><span aria-hidden="true" /> 0기 크리에이터 지원 접수 중</p>
          <h1 id="virtual-title">
            첫 소속 크리에이터<br />
            <span>한 분을 모집합니다.</span>
          </h1>
          <p className="virtual-description">
            에르시안 버츄얼은 첫 소속 크리에이터 한 분을 모집합니다. 지원 후 곧바로 방송을 시작하는 모집이 아닙니다.
            대화와 비공개 방송 테스트를 거쳐 서로의 방향을 확인하고, 캐릭터·장비·방송 환경을 함께 준비합니다.
          </p>
          <div className="virtual-actions">
            <a className="button button--primary" href="#virtual-apply">지원 방법 확인 <span aria-hidden="true">↓</span></a>
            <a className="button button--quiet" href="mailto:biz@ersiyan.com?subject=ERSIYAN%20VIRTUAL%200%EA%B8%B0%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%A7%80%EC%9B%90">biz@ersiyan.com <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <aside className="virtual-project" aria-label="이번 모집 안내">
          <span className="preparation-status">모집 중</span>
          <h2 className="virtual-project-title">모집 개요</h2>
          <dl className="virtual-project-facts">
            <div><dt>모집 인원</dt><dd>1명</dd></div>
            <div><dt>지원 대상</dt><dd>꾸준히 방송하고 싶은 만 19세 이상 성인</dd></div>
            <div><dt>지원 마감</dt><dd>별도 공지 전까지</dd></div>
          </dl>
          <p className="virtual-project-copy">방송·버츄얼 경험과 팔로워 수는 지원 조건이 아닙니다.</p>
        </aside>
      </div>

      <section className="virtual-section" aria-labelledby="virtual-support-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">01 / 함께 준비할 것</p>
          <h2 id="virtual-support-title">방송을 시작하기 전, 함께 만듭니다</h2>
          <p>목소리와 콘텐츠 방향을 먼저 알아갑니다. 이후 캐릭터, 방송 환경, 데뷔 콘텐츠를 순서대로 준비합니다.</p>
        </div>
        <div className="virtual-support-grid">
          <div className="virtual-support-card">
            <span className="virtual-card-index">01 / 캐릭터</span>
            <h3>캐릭터와 방송 화면</h3>
            <p>크리에이터와 함께 캐릭터를 기획하고 디자인, 3D 모델, 로고와 방송 화면을 준비합니다.</p>
          </div>
          <div className="virtual-support-card">
            <span className="virtual-card-index">02 / 방송 환경</span>
            <h3>방송 준비</h3>
            <p>방송 채널, OBS와 트래킹을 함께 맞춥니다. 필요한 기기와 현재 사용 중인 장비는 대화하면서 확인합니다.</p>
          </div>
          <div className="virtual-support-card">
            <span className="virtual-card-index">03 / 데뷔 이후</span>
            <h3>데뷔와 운영</h3>
            <p>데뷔 콘텐츠, 클립과 홍보를 함께 준비합니다. 활동을 시작한 뒤에도 콘텐츠 기획과 운영을 지원합니다.</p>
          </div>
        </div>
        <p className="virtual-section-note">지원이나 선발 과정에 참가비는 없습니다. 구체적인 제작 범위와 준비 일정은 선정 과정에서 함께 정합니다.</p>
      </section>

      <section className="virtual-section" aria-labelledby="virtual-journey-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">02 / 선발과 준비</p>
          <h2 id="virtual-journey-title">지원이 곧 활동 시작은 아닙니다</h2>
          <p>선발 과정과 제작 기간을 나누어 진행합니다. 구체적인 시작일은 함께 준비한 뒤 정합니다.</p>
        </div>
        <ol className="virtual-journey-grid">
          <li><span className="virtual-card-index">01 / 지원</span><h3>이메일 지원</h3><p>자기소개와 3~5분 자유 음성을 보내주세요.</p></li>
          <li><span className="virtual-card-index">02 / 대화</span><h3>온라인 대화·비공개 방송</h3><p>서로 이야기하고 비공개 방송에서 대화를 이어가 봅니다.</p></li>
          <li><span className="virtual-card-index">03 / 협의</span><h3>활동 방향 결정</h3><p>캐릭터, 필요한 장비와 방송 계획을 함께 정합니다.</p></li>
          <li><span className="virtual-card-index">04 / 준비</span><h3>제작과 환경 테스트</h3><p>최종 결정 후 캐릭터와 방송 환경을 완성하고 활동을 시작합니다.</p></li>
        </ol>
        <p className="virtual-section-note">정산, 활동, 캐릭터 권리, 장비 등 구체적인 조건은 최종 결정 전에 문서로 안내하고 검토할 시간을 드립니다.</p>
      </section>

      <section className="virtual-section virtual-apply" id="virtual-apply" aria-labelledby="virtual-apply-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">03 / 지원 방법</p>
          <h2 id="virtual-apply-title">이메일로 지원해 주세요</h2>
          <p>만 19세 이상이며 한국어로 꾸준히 방송하고, 국내에서 계약·정산할 수 있는 분을 찾습니다. 타 소속 계약과 활동상 충돌이 없어야 합니다. 방송 경력, 버츄얼 경험, 팔로워 수는 지원 조건이 아닙니다. 얼굴 공개도 요구하지 않습니다.</p>
        </div>
        <div className="virtual-apply-grid">
          <div className="virtual-apply-panel">
            <h3>이메일에 담아 주세요</h3>
            <ul>
              <li>활동명 또는 닉네임, 연락 가능한 이메일, 만 19세 이상 여부</li>
              <li>간단한 자기소개와 방송·버츄얼 활동 경험</li>
              <li>현재 직업·학업 여부와 방송 가능한 요일·시간, 월 활동 가능 횟수</li>
              <li>해보고 싶은 콘텐츠, 본인의 장점과 오래 활동할 수 있다고 생각하는 이유</li>
              <li>사용 중인 PC·마이크 등 장비와 타 소속·계약 여부</li>
              <li>3~5분 자유 음성 파일</li>
            </ul>
            <p>음성은 “처음 방송을 켜고 시청자 다섯 명과 이야기한다면”을 떠올리며 자유롭게 녹음해 주세요. Discord 연락을 원하면 계정을 적어 주세요. 얼굴 사진, 정확한 생년월일, 건강 정보는 보내지 마세요.</p>
          </div>
          <div className="virtual-apply-panel virtual-apply-panel--process">
            <h3>지원 전에 알아두세요</h3>
            <p>지원서를 보내도 바로 활동이 시작되는 것은 아닙니다. 서로 대화하고 비공개 방송을 해본 뒤, 캐릭터와 방송 계획을 함께 정합니다. 활동 시작일은 준비 상황을 함께 확인해 정합니다.</p>
            <p>지원 음성은 선발 심사에만 사용하며 AI 학습이나 홍보에 재사용하지 않습니다. 불합격 지원 자료는 최종 선정 또는 모집 종료 후 30일 이내 삭제합니다. 자세한 내용은 <a href="/privacy">개인정보처리방침</a>을 확인해 주세요.</p>
          </div>
        </div>
        <div className="virtual-apply-cta">
          <div>
            <span className="virtual-card-index">GEN 0 · APPLICATIONS OPEN</span>
            <h3>첫 소속 크리에이터를 모집합니다</h3>
            <p>지원서와 음성 파일을 이메일로 보내주세요. 모집 관련 문의도 같은 주소로 받습니다.</p>
          </div>
          <a href="mailto:biz@ersiyan.com?subject=ERSIYAN%20VIRTUAL%200%EA%B8%B0%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%A7%80%EC%9B%90">biz@ersiyan.com <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
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
        {division === "virtual" ? <VirtualContent /> : <GamesContent />}
      </HomeExperience>
    </>
  );
}
