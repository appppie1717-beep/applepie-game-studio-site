import type { Metadata } from "next";
import { preload } from "react-dom";
import { BrandLockup } from "../_components/BrandLockup";
import { ErFooter } from "../_components/ErFooter";
import { VelsienSignalDeck } from "./VelsienSignalDeck";
import styles from "./page.module.css";

const title = "VELSIEN SUMMIT(벨시엔 서밋) | 모바일 캐릭터 수집형 전략 RPG";
const description =
  "개발 중인 모바일 캐릭터 수집형 전략 RPG 벨시엔 서밋. 미래도시·AI 동행자와 실제 5대5 전투 개발 기록을 만나보세요. 출시일 미정.";

const pageUrl = "https://ersiyan.com/velsien-summit";
const gamesAuthor = {
  "@type": "Organization",
  "@id": "https://ersiyan.com/#games-organization",
  name: "ERSIYAN GAMES",
  url: "https://ersiyan.com/#games",
  parentOrganization: { "@type": "Organization", "@id": "https://ersiyan.com/#organization" },
};

// Both September entries were published in the verified 2026-09-05 deployment.
// Capture dates and the August archive period are not inferred publication dates.
const journalStructuredData = [
  {
    "@type": "Article",
    "@id": `${pageUrl}#devlog-2026-09-05-battle`,
    url: `${pageUrl}#devlog-2026-09-05-battle`,
    headline: "벨시엔 서밋의 5대5 전투 두 순간",
    description: "2026년 9월 5일 촬영한 벨시엔 서밋의 개발 중 실제 5대5 전투 시작과 첫 타격 화면입니다. 현재 2D 기반 화면이며 배치와 일부 적군 표현은 계속 다듬고 있습니다.",
    datePublished: "2026-09-05",
    dateModified: "2026-09-05",
    temporalCoverage: "2026-09-05",
    image: [
      "https://ersiyan.com/images/velsien-summit/devlog-20260905-battle-01-1920.webp",
      "https://ersiyan.com/images/velsien-summit/devlog-20260905-battle-02-1920.webp",
    ],
  },
  {
    "@type": "Article",
    "@id": `${pageUrl}#devlog-2026-09-05`,
    url: `${pageUrl}#devlog-2026-09-05`,
    headline: "벨시엔 서밋, 도시와 동행자의 모습을 다듬으며",
    description: "2026년 9월 5일 공개한 벨시엔 서밋의 도시 배경과 세 동행자의 캐릭터 아트, 첫 진입 화면과 가독성에 관한 개발 기록입니다.",
    datePublished: "2026-09-05",
    dateModified: "2026-09-05",
    image: ["https://ersiyan.com/images/velsien-summit/devlog-20260905-sunlit-1440.webp"],
  },
  {
    "@type": "Article",
    "@id": `${pageUrl}#screens`,
    url: `${pageUrl}#screens`,
    headline: "벨시엔 서밋 2026년 8월의 개발 화면",
    description: "벨시엔 서밋의 2026년 8월 타이틀, 작전 로비와 동행자 상세 화면을 보존한 개발 기록입니다.",
    temporalCoverage: "2026-08",
    image: ["https://ersiyan.com/images/velsien-summit/teaser-lobby.webp"],
  },
].map((article) => ({
  ...article,
  inLanguage: "ko-KR",
  author: gamesAuthor,
  publisher: { "@id": "https://ersiyan.com/#organization" },
  about: { "@id": `${pageUrl}#game` },
  isPartOf: { "@id": `${pageUrl}#webpage` },
  mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
}));

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: [
    "VELSIEN SUMMIT",
    "벨시엔 서밋",
    "모바일 캐릭터 수집형 전략 RPG",
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

const velsienStructuredData = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "@id": "https://ersiyan.com/velsien-summit#game",
  url: "https://ersiyan.com/velsien-summit",
  name: "VELSIEN SUMMIT",
  alternateName: "벨시엔 서밋",
  description,
  image:
    "https://ersiyan.com/images/velsien-summit/velsien-summit-social.jpg",
  genre: ["캐릭터 수집형", "전략 RPG"],
  gamePlatform: "Mobile",
  creativeWorkStatus: "In Development",
  inLanguage: "ko-KR",
  publisher: {
    "@id": "https://ersiyan.com/#games-organization",
  },
  isPartOf: {
    "@id": "https://ersiyan.com/#website",
  },
};

const pageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "ko-KR",
      dateModified: "2026-09-05",
      isPartOf: { "@id": "https://ersiyan.com/#website" },
      mainEntity: { "@id": `${pageUrl}#game` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      hasPart: journalStructuredData.map((article) => ({ "@id": article["@id"] })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ERSIYAN", item: "https://ersiyan.com/" },
        { "@type": "ListItem", position: 2, name: "ERSIYAN GAMES", item: "https://ersiyan.com/#games" },
        { "@type": "ListItem", position: 3, name: "VELSIEN SUMMIT", item: pageUrl },
      ],
    },
    ...journalStructuredData,
  ],
};

const genres = ["MOBILE", "COLLECTIBLE", "STRATEGY RPG"] as const;

const characterArtwork = [
  {
    id: "luena",
    name: "루에나 하벨",
    englishName: "LUENA HAVEL",
    height: 1080,
    alt: "밝은 긴 머리와 흰 의상을 입은 루에나 하벨의 전신 캐릭터 일러스트",
  },
  {
    id: "lesia",
    name: "레시아 벨른",
    englishName: "LESIA VELN",
    height: 1080,
    alt: "붉은 땋은 머리와 짙은 청록색 의상, 긴 검이 보이는 레시아 벨른의 전신 캐릭터 일러스트",
  },
  {
    id: "serin",
    name: "세린 노에르",
    englishName: "SERIN NOER",
    height: 1350,
    alt: "은빛 단발머리와 흰색·회색 의상을 입은 세린 노에르의 전신 캐릭터 일러스트",
  },
] as const;

const battleScreens = [
  {
    id: "01",
    title: "전투 시작",
    alt: "아군 다섯 명과 적군 다섯 기가 마주 선 벨시엔 서밋의 개발 중 실제 전투 시작 화면",
  },
  {
    id: "02",
    title: "첫 타격",
    alt: "아군 다섯 명과 적군 다섯 기의 자동 전투에서 첫 타격이 발생한 벨시엔 서밋 개발 화면",
  },
] as const;

const signalDeckClasses = {
  recordMeta: styles.recordMeta,
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
  // The artwork follows the copy on mobile, so only desktop needs a priority hint.
  preload("/images/velsien-summit/devlog-20260905-city-1600.webp", {
    as: "image",
    imageSrcSet: "/images/velsien-summit/devlog-20260905-city-640.webp 640w, /images/velsien-summit/devlog-20260905-city-960.webp 960w, /images/velsien-summit/devlog-20260905-city-1600.webp 1600w",
    imageSizes: "(max-width: 1060px) calc(100vw - 36px), 54vw",
    media: "(min-width: 1061px)",
    fetchPriority: "high",
  });

  return (
    <div id="top" className={"site-shell velsien-shell " + styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(velsienStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
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
            <a href="#development-log">개발 기록</a>
            <a href="#characters">캐릭터</a>
            <a href="#world">세계관</a>
            <a href="#play">전투</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <ol>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <li><a href="/">ERSIYAN</a></li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <li><a href="/#games">ERSIYAN GAMES</a></li>
            <li aria-current="page">VELSIEN SUMMIT</li>
          </ol>
        </nav>
        <section className={styles.hero} aria-labelledby="velsien-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              ERSIYAN GAMES <span aria-hidden="true">·</span> GAME 002 · IN DEVELOPMENT
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
              편성하는 모바일 캐릭터 수집형 전략 RPG입니다. 전투 전에 배치와
              행동 순서를 준비하는 방향으로 만들고 있습니다.
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
              <a className={styles.primaryLink} href="#development-log">
                최근 개발 기록 <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.secondaryLink} href="/velsien-summit/world">
                최신 세계관 공개본 <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.secondaryLink} href="#world">
                세계관 읽기
              </a>
              <a className={styles.secondaryLink} href="#characters">
                캐릭터 아트
              </a>
              <a className={styles.secondaryLink} href="/velsien-summit/late-update">
                8월말 추가정보
              </a>
            </div>
          </div>

          <figure className={styles.heroVisual}>
            <div className={styles.imageFrame + " " + styles.artFrame}>
              {/* images.unoptimized 정적 배포라 런타임 이미지 청크 없이 원본 크기를 명시합니다. */}
              <picture style={{ display: "contents" }}>
                <img
                  src="/images/velsien-summit/devlog-20260905-city-1600.webp"
                  alt="푸른 하늘과 구름 위로 흰 첨탑과 광장이 펼쳐진 벨시엔의 도시 배경 아트"
                  width={1600}
                  height={900}
                  srcSet="/images/velsien-summit/devlog-20260905-city-640.webp 640w, /images/velsien-summit/devlog-20260905-city-960.webp 960w, /images/velsien-summit/devlog-20260905-city-1600.webp 1600w"
                  sizes="(max-width: 1060px) calc(100vw - 36px), 54vw"
                  loading="eager"
                  fetchPriority="auto"
                  decoding="async"
                />
              </picture>
              <div className={styles.frameStatus} aria-hidden="true">
                <span>WORLD ART</span>
                <span>2026.09 DEV LOG</span>
              </div>
            </div>
            <figcaption>
              개발에 사용 중인 도시 배경 아트입니다. 이곳에 완성 전의 구상과 변화도 함께 남깁니다.
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
              현재 만들고 있는 게임의 큰 방향입니다. 계약을 고르고, 함께할 동행자와 전투 전 전략을 준비합니다.
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

        <VelsienSignalDeck classes={signalDeckClasses} view="introduction" />

        <section
          id="development-log"
          className={styles.developmentLog}
          aria-labelledby="development-log-title"
        >
          <div className={styles.sectionIntro}>
            <p>DEVELOPMENT JOURNAL</p>
            <h2 id="development-log-title">만들어 가는 벨시엔</h2>
            <span>완성되기 전의 모습도 기록합니다. 각 글은 작성 당시의 구상과 작업이며, 개발하면서 달라질 수 있습니다.</span>
          </div>
          <nav className={styles.journalIndex} aria-label="날짜별 개발 기록">
            <p>최근 기록부터 지난 기록까지</p>
            <ol>
              <li>
                <a href="#devlog-2026-09-05-battle">
                  <time dateTime="2026-09-05">2026.09.05</time>
                  <span>실제 5대5 전투 화면</span>
                </a>
              </li>
              <li>
                <a href="#devlog-2026-09-05">
                  <time dateTime="2026-09-05">2026.09.05</time>
                  <span>도시와 캐릭터 아트</span>
                </a>
              </li>
              <li>
                <a href="#devlog-2026-08-late">
                  <time dateTime="2026-08">2026.08 말</time>
                  <span>8월말 추가정보</span>
                </a>
              </li>
              <li>
                <a href="#screens">
                  <time dateTime="2026-08">2026.08</time>
                  <span>개발 화면 기록</span>
                </a>
              </li>
            </ol>
          </nav>
          <article id="devlog-2026-09-05-battle" className={styles.journalEntry}>
            <div className={styles.journalHeading}>
              <time dateTime="2026-09-05">2026.09.05 촬영</time>
              <span>BATTLE IN DEVELOPMENT</span>
              <h3>벨시엔 서밋의 5대5 전투 두 순간</h3>
            </div>
            <p className={styles.recordMeta}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <span>작성 <a href="/#games">ERSIYAN GAMES</a></span>
              <span>게시 <time dateTime="2026-09-05">2026.09.05</time></span>
            </p>
            <div className={styles.journalCopy}>
              <p>2026년 9월 5일 촬영한 벨시엔 서밋의 개발 중 실제 5대5 전투 화면입니다. 전투가 시작되는 순간과 첫 타격이 들어가는 순간을 담았습니다.</p>
              <p>현재는 2D 기반 화면입니다. 캐릭터 배치와 일부 적군의 임시 표현은 계속 다듬고 있습니다.</p>
            </div>
            <div className={styles.battleGallery}>
              {battleScreens.map((screen) => (
                <figure key={screen.id}>
                  <a
                    className={styles.battleImageLink}
                    href={`/images/velsien-summit/devlog-20260905-battle-${screen.id}-1920.webp`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${screen.title} 화면 크게 보기 (새 탭)`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/velsien-summit/devlog-20260905-battle-${screen.id}-960.webp`}
                      srcSet={`/images/velsien-summit/devlog-20260905-battle-${screen.id}-640.webp 640w, /images/velsien-summit/devlog-20260905-battle-${screen.id}-960.webp 960w, /images/velsien-summit/devlog-20260905-battle-${screen.id}-1920.webp 1920w`}
                      sizes="(max-width: 1324px) 90vw, 1180px"
                      width={1920}
                      height={1080}
                      loading="lazy"
                      decoding="async"
                      alt={screen.alt}
                    />
                  </a>
                  <figcaption>
                    <div>
                      <span aria-hidden="true">{screen.id}</span>
                      <strong>{screen.title}</strong>
                    </div>
                    <a
                      href={`/images/velsien-summit/devlog-20260905-battle-${screen.id}-1920.webp`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${screen.title} 화면 크게 보기 (새 탭)`}
                    >
                      크게 보기 <span aria-hidden="true">↗</span>
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>
          <article id="devlog-2026-09-05" className={styles.journalEntry}>
            <div className={styles.journalHeading}>
              <time dateTime="2026-09-05">2026.09.05</time>
              <span>ART & DEVELOPMENT</span>
              <h3>벨시엔 서밋, 도시와 동행자의 모습을 다듬으며</h3>
            </div>
            <p className={styles.recordMeta}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <span>작성 <a href="/#games">ERSIYAN GAMES</a></span>
              <span>게시 <time dateTime="2026-09-05">2026.09.05</time></span>
            </p>
            <div className={styles.journalCopy}>
              <p>밝고 정돈된 미래도시와, 서로 다른 모습의 인간형 AI 동행자들을 그리고 있습니다. 어느 기업에도 속하지 않은 계약자가 이들과 팀을 꾸려 일을 맡는 이야기에서 출발합니다.</p>
              <p>최근에는 게임의 첫 진입 화면과 글자 가독성을 손보고, 3D 표현으로 옮기는 작업도 진행하고 있습니다. 이번에는 개발에 사용 중인 배경과 캐릭터 아트를 조금 꺼내 봅니다.</p>
            </div>
            <div className={styles.journalArt}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/velsien-summit/devlog-20260905-sunlit-960.webp"
                  srcSet="/images/velsien-summit/devlog-20260905-sunlit-640.webp 640w, /images/velsien-summit/devlog-20260905-sunlit-960.webp 960w, /images/velsien-summit/devlog-20260905-sunlit-1440.webp 1440w"
                  sizes="(max-width: 1324px) 90vw, 1180px"
                  width={1440}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  alt="따뜻한 햇빛 아래 수직도시와 빛나는 고가도로가 보이는 벨시엔 배경 아트"
                />
                <figcaption>벨시엔의 풍경 · 도시 배경 아트</figcaption>
              </figure>
            </div>
            <section
              id="characters"
              className={styles.characterGallery}
              aria-labelledby="character-gallery-title"
            >
              <div className={styles.characterHeading}>
                <div>
                  <p>CHARACTER ART <span aria-hidden="true">·</span> 2026.09</p>
                  <h4 id="character-gallery-title">동행자의 얼굴들</h4>
                </div>
                <p>먼저 세 사람의 모습을 소개합니다.<br />각자의 이야기는 조금씩 풀어가겠습니다.</p>
              </div>
              <div className={styles.characterGrid}>
                {characterArtwork.map((character, index) => (
                  <figure className={styles.characterCard} key={character.id}>
                    <a
                      className={styles.characterImageLink}
                      href={`/images/velsien-summit/devlog-20260905-${character.id}-720.webp`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${character.name} 캐릭터 아트 크게 보기 (새 탭)`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/velsien-summit/devlog-20260905-${character.id}-540.webp`}
                        srcSet={`/images/velsien-summit/devlog-20260905-${character.id}-360.webp 360w, /images/velsien-summit/devlog-20260905-${character.id}-540.webp 540w, /images/velsien-summit/devlog-20260905-${character.id}-720.webp 720w`}
                        sizes="(max-width: 620px) calc(100vw - 36px), (max-width: 1324px) 29vw, 382px"
                        width={720}
                        height={character.height}
                        loading="lazy"
                        decoding="async"
                        alt={character.alt}
                      />
                      <span className={styles.characterExpand} aria-hidden="true">크게 보기 ↗</span>
                    </a>
                    <figcaption>
                      <span className={styles.characterIndex} aria-hidden="true">0{index + 1}</span>
                      <div>
                        <small>{character.englishName}</small>
                        <strong>{character.name}</strong>
                        <span>캐릭터 아트</span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
            <p className={styles.journalNote}>
              위 이미지는 배경과 캐릭터 일러스트입니다. 실제 전투 모습은 <a href="#devlog-2026-09-05-battle">같은 날 남긴 5대5 전투 기록</a>에서 볼 수 있습니다.
            </p>
          </article>
          <a id="devlog-2026-08-late" className={styles.previousEntry} href="/velsien-summit/late-update">
            <time dateTime="2026-08">2026.08 말</time>
            <span><strong>8월말 추가정보</strong><small>초기 세계관 구상과 계약·편성 화면이 담긴 이전 기록</small></span>
            <span aria-hidden="true">↗</span>
          </a>
          <VelsienSignalDeck
            classes={{
              ...signalDeckClasses,
              screenSection: styles.screenSection + " " + styles.archiveScreens,
            }}
            view="archive"
          />
        </section>

        <VelsienSignalDeck classes={signalDeckClasses} view="share" />

        <section
          id="status"
          className={styles.closing}
          aria-labelledby="closing-title"
        >
          <p>DEVELOPMENT STATUS</p>
          <h2 id="closing-title">현재 개발 중이며 출시 미정입니다.</h2>
          <span>
            개발하면서 달라지는 모습과 공개할 수 있는 이야기를 날짜별로 남기겠습니다.
          </span>
          <div className={styles.closingLinks}>
            <a href="#top">맨 위로 ↑</a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">ERSIYAN 홈페이지로</a>
          </div>
        </section>
      </main>

      <ErFooter />
    </div>
  );
}
