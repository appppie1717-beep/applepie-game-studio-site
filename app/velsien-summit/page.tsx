import type { Metadata } from "next";
import { BrandLockup } from "../_components/BrandLockup";
import { GameProducerRegistration } from "../_components/GameProducerRegistration";
import { VelsienSignalDeck } from "./VelsienSignalDeck";
import styles from "./page.module.css";

const title = "VELSIEN SUMMIT(벨시엔 서밋) | 모바일 수집형 2D SRPG";
const description =
  "현재 개발 중이며 출시 미정인 모바일 수집형 2D SRPG입니다. 기술이 지나치게 성공한 수직도시에서 인간형 AI 팀을 편성하고 계약을 수행합니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "VELSIEN SUMMIT",
    "벨시엔 서밋",
    "모바일 수집형 2D SRPG",
    "ERSIYAN",
    "에르시안",
  ],
  alternates: {
    canonical: "/velsien-summit",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/velsien-summit",
    title,
    description,
    images: [
      {
        url: "/images/velsien-summit/velsien-summit-social.jpg",
        width: 1200,
        height: 630,
        alt: "밝은 수직도시와 VELSIEN SUMMIT 로고, IN DEVELOPMENT 안내",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/images/velsien-summit/velsien-summit-social.jpg",
        alt: "밝은 수직도시와 VELSIEN SUMMIT 로고, IN DEVELOPMENT 안내",
      },
    ],
  },
};

const genres = ["MOBILE", "COLLECTIBLE", "2D SRPG"] as const;

const signalDeckClasses = {
  screenSection: styles.screenSection,
  sectionIntro: styles.sectionIntro,
  galleryShell: styles.galleryShell,
  galleryTabs: styles.galleryTabs,
  galleryTab: styles.galleryTab,
  galleryTabActive: styles.galleryTabActive,
  galleryPanels: styles.galleryPanels,
  galleryPanel: styles.galleryPanel,
  galleryImage: styles.galleryImage,
  worldSection: styles.worldSection,
  worldExplorer: styles.worldExplorer,
  worldTabs: styles.worldTabs,
  worldTab: styles.worldTab,
  worldTabActive: styles.worldTabActive,
  worldPanels: styles.worldPanels,
  worldPanel: styles.worldPanel,
  worldCopy: styles.worldCopy,
  playSection: styles.playSection,
  playExplorer: styles.playExplorer,
  playTabs: styles.playTabs,
  playTab: styles.playTab,
  playTabActive: styles.playTabActive,
  playPanels: styles.playPanels,
  playPanel: styles.playPanel,
  sharePanel: styles.sharePanel,
  shareStatus: styles.shareStatus,
};

export default function VelsienSummitPage() {
  return (
    <div id="top" className={"site-shell " + styles.page}>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="site-header">
        <div className="header-inner">
          <BrandLockup />

          <nav
            className={"primary-nav " + styles.summitNav}
            aria-label="벨시엔 페이지 메뉴"
          >
            <a href="#overview">게임</a>
            <a href="#screens">화면</a>
            <a href="#world">세계관</a>
            <a href="#play">전투</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="velsien-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              ERSIYAN GAME 002 <span aria-hidden="true">·</span> IN DEVELOPMENT
            </p>
            <h1 id="velsien-title" className={styles.title}>
              <span>VELSIEN</span>
              <span>SUMMIT</span>
              <small>벨시엔 서밋</small>
            </h1>
            <p className={styles.lead}>
              완벽하게 돌아가는 도시에서,
              <br />어느 기업에도 속하지 않은 계약자가 됩니다.
            </p>
            <p className={styles.heroDescription}>
              제가 만들고 있는 벨시엔 서밋은 인간형 AI 동행자를 모아 팀을
              편성하고, 전투 전에 배치와 누가 먼저 움직일지 정하는 모바일 수집형 2D
              SRPG입니다.
            </p>
            <p className={styles.developmentState}>
              <span aria-hidden="true" />
              개발 중 · 출시 미정
            </p>
            <ul className={styles.genreList} aria-label="게임 장르">
              {genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#screens">
                개발 화면 보기 <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.secondaryLink} href="#world">
                세계관 읽기
              </a>
              <a className={styles.secondaryLink} href="/velsien-summit/late-update">
                8월말 추가정보
              </a>
            </div>
          </div>

          <figure className={styles.heroVisual}>
            <div className={styles.imageFrame}>
              {/* images.unoptimized 정적 배포라 런타임 이미지 청크 없이 원본 크기를 명시합니다. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/velsien-summit/teaser-title.webp"
                alt="밝은 수직도시와 VELSIEN SUMMIT 로고가 보이는 개발 중 타이틀 화면"
                width={1600}
                height={720}
                srcSet="/images/velsien-summit/teaser-title-640.webp 640w, /images/velsien-summit/teaser-title-960.webp 960w, /images/velsien-summit/teaser-title.webp 1600w"
                sizes="(max-width: 1060px) calc(100vw - 36px), 54vw"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className={styles.frameStatus} aria-hidden="true">
                <span>DEVELOPMENT BUILD</span>
                <span>TITLE SCREEN</span>
              </div>
            </div>
            <figcaption>
              개발 중 타이틀 화면입니다. UI와 문구는 최종 버전에서 달라질 수 있습니다.
            </figcaption>
          </figure>
        </section>

        <section
          id="overview"
          className={styles.overview}
          aria-labelledby="overview-title"
        >
          <div className={styles.sectionIntro}>
            <p>GAME OVERVIEW</p>
            <h2 id="overview-title">어떤 게임인가요</h2>
            <span>
              계약을 고르고, 함께할 동행자를 정한 뒤, 전투 전에 배치와 행동 순서를 준비합니다.
            </span>
          </div>

          <div className={styles.overviewGrid}>
            <article>
              <span>01</span>
              <h3>인간형 AI 동행자</h3>
              <p>
                서로 다른 배경과 역할을 가진 동행자를 확보해 자신만의 계약팀을
                구성합니다.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>전투 전 전략 설계</h3>
              <p>
                진형과 위치, 첫 행동 타이밍을 정합니다. 같은 팀도 준비에 따라
                전투의 흐름이 달라집니다.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>계약 단위의 작전</h3>
              <p>
                회수와 호송, 경비와 조사 같은 계약을 여러 작전으로 해결하며 더
                큰 의뢰로 나아갑니다.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.premise} aria-label="벨시엔 세계관의 출발점">
          <p>WORLD PREMISE</p>
          <blockquote>
            사람의 노동이 거의 필요 없어지자,
            <br />
            기업들은 한 사람이 어떤 서비스 안에서 살아갈지를 두고 경쟁하기 시작했습니다.
          </blockquote>
          <span>
            밝고 편리한 도시를 움직이는 세 기업과, 그 어디에도 속하지 않은 한 계약자의 이야기입니다.
          </span>
        </section>

        <VelsienSignalDeck classes={signalDeckClasses} />

        <section
          id="status"
          className={styles.closing}
          aria-labelledby="closing-title"
        >
          <p>DEVELOPMENT STATUS</p>
          <h2 id="closing-title">현재 개발 중이며 출시 미정입니다.</h2>
          <span>
            새로운 화면과 출시 관련 내용은 정해지는 대로 이 페이지에 반영하겠습니다.
          </span>
          <div className={styles.closingLinks}>
            <a href="#top">맨 위로 ↑</a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">ERSIYAN 홈페이지로</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p>© {new Date().getFullYear()} ERSIYAN</p>
            <GameProducerRegistration />
          </div>
          <nav aria-label="푸터 메뉴">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">홈페이지</a>
            <a href="/privacy">개인정보처리방침</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
