import { CompanyHistory } from "./CompanyHistory";
import { GameShowcase } from "./GameShowcase";
import { HomeExperience, type HomeDivision } from "./HomeExperience";
import { StudioAccordion } from "./StudioAccordion";
import { ErFooter } from "./ErFooter";

export const homeDescription =
  "에르시안(ERSIYAN)은 ERSIYAN GAMES에서 게임을 개발·운영하고, ERSIYAN VIRTUAL에서 첫 소속 버츄얼 크리에이터 한 분을 모집합니다.";
export const virtualDescription =
  "ERSIYAN VIRTUAL에서 첫 번째 소속 버츄얼 크리에이터 한 분의 지원을 받습니다. 선정 후 캐릭터와 장비, 방송 환경을 함께 준비하며 지원은 biz@ersiyan.com 이메일로 받습니다.";

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
          ? "ERSIYAN VIRTUAL · 첫 버츄얼 크리에이터 모집 | 에르시안"
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
    <div className="virtual-recruitment">
      <div className="virtual-hero">
        <div className="virtual-intro">
          <p className="eyebrow">ERSIYAN VIRTUAL · FIRST CREATOR</p>
          <p className="virtual-status"><span aria-hidden="true" /> 첫 번째 소속 크리에이터 모집 중</p>
          <h2 id="virtual-title">
            첫 번째 이야기를<br />
            <span>함께 시작할 한 분</span>을 찾습니다.
          </h2>
          <p className="virtual-description">
            에르시안 역시 이번이 첫 버츄얼 크리에이터 영입입니다. 그래서 한 명만 모집합니다.
            지원은 지금부터 받습니다. 선정 후 캐릭터와 방송 방향, 필요한 장비를 함께 정하고 준비를 마친 뒤 활동을 시작합니다.
          </p>
          <div className="virtual-actions">
            <a className="button button--primary" href="#virtual-apply">지원 방법 보기 <span aria-hidden="true">↓</span></a>
            <a className="button button--quiet" href="mailto:biz@ersiyan.com?subject=ERSIYAN%20VIRTUAL%20%EC%B2%AB%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%A7%80%EC%9B%90">이메일로 지원하기 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <aside className="virtual-project" aria-label="이번 모집의 핵심 조건">
          <span className="preparation-status">APPLICATIONS OPEN</span>
          <p className="virtual-project-kicker">ERSIYAN VIRTUAL / 001</p>
          <h3>ONE CREATOR.<br />ONE BEGINNING.</h3>
          <p className="virtual-project-copy">대규모 오디션 대신 첫 한 분과 함께 출발합니다.</p>
          <dl className="virtual-project-facts">
            <div><dt>모집 인원</dt><dd>1명</dd></div>
            <div><dt>데뷔 후 활동</dt><dd>월 12회 이상</dd></div>
            <div><dt>지원 마감</dt><dd>별도 공지 전까지</dd></div>
          </dl>
        </aside>
      </div>

      <section className="virtual-section" aria-labelledby="virtual-support-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">01 / WHAT WE BUILD</p>
          <h3 id="virtual-support-title">시작에 필요한 것을 함께 만듭니다.</h3>
          <p>완성된 캐릭터에 사람을 맞추지 않습니다. 선정된 분의 목소리와 성격, 해보고 싶은 콘텐츠를 바탕으로 함께 방향을 정합니다.</p>
        </div>
        <div className="virtual-support-grid">
          <div className="virtual-support-card">
            <span className="virtual-card-index">01 · CHARACTER</span>
            <h4>캐릭터와 방송 화면</h4>
            <p>캐릭터 공동 기획, 디자인, 3D 모델·리깅·표정, 로고, 채널 디자인과 방송 오버레이를 회사가 제작·지원합니다.</p>
          </div>
          <div className="virtual-support-card">
            <span className="virtual-card-index">02 · SETUP</span>
            <h4>방송 준비</h4>
            <p>OBS·트래킹과 채널 세팅을 함께 테스트합니다. 필요한 트래킹 기기·마이크 등은 회사 소유 장비로 대여하며, PC와 인터넷은 본인이 준비합니다.</p>
          </div>
          <div className="virtual-support-card">
            <span className="virtual-card-index">03 · GROWTH</span>
            <h4>데뷔와 운영</h4>
            <p>데뷔 티저와 월 4개 안팎의 쇼츠·클립 제작, 공식 홈페이지·SNS 소개, 초기 홍보, 콘텐츠 기획, 협찬 업무와 정산을 지원합니다. 악성 이용자와 권리 침해 대응도 함께합니다.</p>
          </div>
        </div>
        <p className="virtual-section-note">지원·오디션 참가비는 없습니다. 회사가 부담한 캐릭터 제작비와 초기 홍보비를 크리에이터의 채무로 만들거나 정산금에서 다시 공제하지 않습니다.</p>
      </section>

      <section className="virtual-section" aria-labelledby="virtual-terms-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">02 / CLEAR TERMS</p>
          <h3 id="virtual-terms-title">활동과 정산 기준을 먼저 공개합니다.</h3>
        </div>
        <div className="virtual-terms-grid">
          <div className="virtual-term-card virtual-term-card--featured">
            <span className="virtual-card-index">방송 · 콘텐츠 · 광고/협찬</span>
            <strong>70 <span>/</span> 30</strong>
            <p>크리에이터 70%, 에르시안 30%. 플랫폼·결제 수수료를 제외하고 실제 지급된 금액을 기준으로 합니다. 회사가 부담한 제작비·초기 홍보비를 추가 공제하지 않습니다.</p>
          </div>
          <div className="virtual-term-card">
            <span className="virtual-card-index">굿즈</span>
            <strong>50 <span>/</span> 50</strong>
            <p>매출에서 사전에 공유한 제작비와 배송·플랫폼 실비를 뺀 순이익을 절반씩 나눕니다. 굿즈 진행과 비용은 사전에 협의합니다.</p>
          </div>
          <div className="virtual-term-card">
            <span className="virtual-card-index">활동 · 계약</span>
            <strong>12 <span>회 / 월</span></strong>
            <p>월 12회 이상 방송은 활동을 시작한 뒤의 기본 기준입니다. 데뷔 일정과 준비 과정은 함께 정하고, 직장·학업·건강·가족 일정 등 합리적인 사유가 있으면 활동 횟수도 협의해 조정합니다. 첫 계약은 1년이며 자동 연장하지 않습니다.</p>
          </div>
        </div>
        <div className="virtual-rights">
          <h4>캐릭터와 개인의 권리</h4>
          <p>회사가 제작·확보한 캐릭터, 모델, 로고 등의 권리 범위는 계약서에 명시합니다. 크리에이터의 기존 저작물과 실제 신원·얼굴·목소리는 양도 대상이 아닙니다. 계약 종료 후 실제 목소리의 재현이나 후임자의 캐릭터 사용은 별도 합의 사항입니다. 대여 장비는 계약 종료 시 정상 반환합니다.</p>
          <p>수익 정산, IP, 장비, 활동 조건과 계약 종료 절차는 최종 결정 전에 문서로 안내하고 검토할 시간을 드립니다.</p>
        </div>
      </section>

      <section className="virtual-section virtual-apply" id="virtual-apply" aria-labelledby="virtual-apply-title">
        <div className="virtual-section-heading">
          <p className="eyebrow">03 / APPLY</p>
          <h3 id="virtual-apply-title">경험보다 함께할 가능성을 봅니다.</h3>
          <p>만 19세 이상이며 한국어 방송과 국내 계약·정산이 가능하고, 데뷔 후 월 12회 이상 꾸준히 활동할 수 있는 분이라면 지원할 수 있습니다. 타 소속 계약과 활동상 충돌이 없어야 합니다. 방송·버츄얼 경력과 팔로워·구독자 수는 지원 조건이 아닙니다. 얼굴 공개도 요구하지 않습니다.</p>
        </div>
        <div className="virtual-apply-grid">
          <div className="virtual-apply-panel">
            <h4>이메일에 담아 주세요</h4>
            <ul>
              <li>활동명 또는 닉네임, 연락 가능한 이메일, 만 19세 이상 여부</li>
              <li>간단한 자기소개, 현재 직업·학업 여부, 방송·버츄얼 활동 경험</li>
              <li>월 활동 가능 횟수와 방송 가능한 요일·시간대</li>
              <li>해보고 싶은 방송·콘텐츠, 본인의 장점과 오래 활동할 수 있다고 생각하는 이유</li>
              <li>사용 가능한 PC·마이크 등 방송 장비와 타 소속·계약 여부</li>
              <li>3~5분 자유 음성 파일</li>
            </ul>
            <p>Discord 연락을 원한다면 계정을 함께 적어 주세요. 음성은 “처음 방송을 켜고 시청자 다섯 명과 이야기한다면”을 떠올리며 자유롭게 녹음해 주세요. 얼굴 사진, 정확한 생년월일, 건강 정보는 보내지 마세요.</p>
          </div>
          <div className="virtual-apply-panel virtual-apply-panel--process">
            <h4>선발 과정</h4>
            <ol>
              <li><span>01</span> 지원서·음성 확인</li>
              <li><span>02</span> 온라인 인터뷰</li>
              <li><span>03</span> 비공개 방송 테스트</li>
              <li><span>04</span> 캐릭터·장비·방송 계획 및 계약 조건 협의</li>
              <li><span>05</span> 최종 선정 및 계약</li>
            </ol>
            <p>최종 선정 이후에도 캐릭터 제작과 방송 환경 준비가 이어집니다. 활동 시작일은 준비 상황을 함께 확인해 정합니다.</p>
            <p>지원 음성은 선발 심사에만 사용하며 AI 학습이나 홍보에 재사용하지 않습니다. 지원 시 <a href="/privacy">개인정보처리방침</a>을 확인해 주세요.</p>
          </div>
        </div>
        <div className="virtual-apply-cta">
          <div>
            <span className="virtual-card-index">FIRST CREATOR · APPLICATION OPEN</span>
            <h4>첫 번째 멤버를 기다립니다.</h4>
            <p>지원서와 음성 파일을 이메일로 보내주세요. 문의도 같은 주소로 받습니다.</p>
          </div>
          <a href="mailto:biz@ersiyan.com?subject=ERSIYAN%20VIRTUAL%20%EC%B2%AB%20%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%20%EC%A7%80%EC%9B%90">biz@ersiyan.com <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
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
                  첫 소속 버츄얼 크리에이터 한 분을 모집하고 있습니다.
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
