import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BusinessDisclosure } from "./_components/BusinessDisclosure";
import { GameShowcase } from "./_components/GameShowcase";
import { StudioAccordion } from "./_components/StudioAccordion";

export const metadata: Metadata = {
  description:
    "MINE LOGIC을 시작으로 생각하는 재미가 오래 남는 게임을 만드는 독립 게임 스튜디오입니다.",
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

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

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

export default function Home() {
  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand-lockup" href="#top" aria-label="애플파이 게임 스튜디오 홈">
            <span className="brand-mark" aria-hidden="true">
              AP
            </span>
            <span className="brand-name">
              <strong>APPLEPIE</strong>
              <small>GAME STUDIO</small>
            </span>
          </a>

          <nav className="primary-nav" aria-label="주요 메뉴">
            <a href="#games">게임</a>
            <a href="#studio">스튜디오</a>
            <a href="#profile">사업자 정보</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">INDEPENDENT GAME STUDIO</p>
            <h1 id="hero-title">
              작은 규칙에서
              <br />
              <span>오래 남는 플레이</span>를
              <br />
              만듭니다.
            </h1>
            <p className="hero-description">
              애플파이 게임 스튜디오는 생각하는 재미를 게임으로 다듬는 독립 게임
              스튜디오입니다. 출시작 MINE LOGIC을 시작으로, 오래 즐길 수 있는 게임을
              한 작품씩 선보입니다.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#games">
                게임 살펴보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="button button--quiet" href="#studio">
                스튜디오 이야기
              </a>
            </div>

            <dl className="hero-facts" aria-label="스튜디오 현황">
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

          <div className="hero-visual" aria-label="애플파이 게임 스튜디오 브랜드 로고">
            <div className="logo-stage">
              <Image
                src="/images/brand/applepie-logo-original.png"
                alt="ApplePie 글자와 파이 모양 심볼로 구성된 애플파이 로고"
                width={1536}
                height={1152}
                sizes="(max-width: 1060px) 92vw, 46vw"
                priority
              />
            </div>
            <div className="hero-grid-card">
              <div>
                <span className="mini-label">OUR STARTING POINT</span>
                <strong>Logic becomes play.</strong>
              </div>
              <LogicGrid />
            </div>
          </div>
        </section>

        <section id="games" className="games section-pad" aria-labelledby="games-title">
          <div className="section-heading">
            <p className="eyebrow">OUR GAMES · 01</p>
            <h2 id="games-title">출시작과 다음 게임</h2>
            <p>
              작품 탭과 화면 메뉴를 눌러 현재의 애플파이 게임을 살펴보세요.
            </p>
          </div>
          <GameShowcase />
        </section>

        <section id="studio" className="studio section-pad" aria-labelledby="studio-title">
          <div className="studio-intro">
            <p className="eyebrow">ABOUT APPLEPIE · 02</p>
            <h2 id="studio-title">
              작은 시작을
              <br />
              하나의 브랜드로
            </h2>
          </div>

          <div className="studio-body">
            <p className="studio-statement">
              좋은 시작은 대개 작은 호기심에서 나옵니다. 애플파이 게임 스튜디오는
              그 호기심을 게임의 규칙으로 다듬고, 직접 출시해 다음 작품으로
              이어갑니다.
            </p>
            <p className="interaction-hint">
              아래 항목을 누르면 애플파이가 게임을 만드는 방식을 더 볼 수 있습니다.
            </p>
            <StudioAccordion />
          </div>
        </section>

        <section id="profile" className="profile section-pad" aria-labelledby="profile-title">
          <div className="profile-panel">
            <div className="profile-copy">
              <p className="eyebrow eyebrow--light">STUDIO PROFILE · 03</p>
              <h2 id="profile-title">애플파이 게임 스튜디오</h2>
              <p>
                애플파이는 개인사업자 형태로 운영되는 독립 게임 스튜디오입니다.
                게임물제작업 등록을 마쳤으며, 직접 만든 게임을 개발하고 운영합니다.
              </p>
            </div>
            <BusinessDisclosure />
          </div>
        </section>

        <section className="contact-strip section-pad" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">NEXT CHAPTER</p>
            <h2 id="contact-title">다음 게임을 만들고 있습니다.</h2>
          </div>
          <div className="contact-copy">
            <p>게임 및 스튜디오 관련 문의는 이메일로 보내주세요.</p>
            <a className="contact-email" href="mailto:asoul122@naver.com">
              asoul122@naver.com
            </a>
            <Link className="text-link" href="/privacy">
              개인정보처리방침 보기 <Arrow />
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} APPLEPIE GAME STUDIO</p>
          <div>
            <a href="#top">맨 위로</a>
            <Link href="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
