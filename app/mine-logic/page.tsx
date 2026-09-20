import type { Metadata } from "next";
/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page links load complete static documents. */
import { BrandLockup } from "../_components/BrandLockup";
import { ErFooter } from "../_components/ErFooter";
import { ResponsivePicture } from "../_components/ResponsivePicture";
import styles from "./page.module.css";

const title =
  "MINE LOGIC(마인로직) | Android 오프라인 지뢰찾기 · 단계별 힌트 · 20단계 훈련";
const description =
  "MINE LOGIC(마인로직)은 Android에서 인터넷 없이 즐기는 오프라인 지뢰찾기 게임입니다. 단계별 힌트와 일반훈련 15단계·강화훈련 5단계, 총 20단계 훈련을 제공합니다.";
const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.applepie.minelogic";
const currentVersion = "1.3.3";
const supportedLanguages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "영어" },
  { code: "ja", name: "일본어" },
  { code: "zh-Hans", name: "중국어 간체" },
  { code: "zh-Hant", name: "중국어 번체" },
  { code: "es", name: "스페인어" },
  { code: "pt-BR", name: "포르투갈어(브라질)" },
  { code: "th", name: "태국어" },
  { code: "id", name: "인도네시아어" },
  { code: "fr", name: "프랑스어" },
  { code: "de", name: "독일어" },
  { code: "ar", name: "아랍어" },
] as const;

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/mine-logic",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/mine-logic",
    title,
    description,
    images: [
      {
        url: "/images/mine-logic/feature-1024.webp",
        width: 1024,
        height: 500,
        alt: "푸른 지뢰찾기 보드 위의 붉은 깃발과 지뢰를 표현한 MINE LOGIC 대표 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/images/mine-logic/feature-1024.webp",
        alt: "푸른 지뢰찾기 보드 위의 붉은 깃발과 지뢰를 표현한 MINE LOGIC 대표 이미지",
      },
    ],
  },
};

const mineLogicStructuredData = {
  "@context": "https://schema.org",
  "@type": ["VideoGame", "MobileApplication"],
  "@id": "https://ersiyan.com/mine-logic#app",
  name: "MINE LOGIC",
  alternateName: "마인로직",
  url: "https://ersiyan.com/mine-logic",
  mainEntityOfPage: "https://ersiyan.com/mine-logic",
  description,
  operatingSystem: "Android",
  applicationCategory: "GameApplication",
  genre: ["지뢰찾기", "논리 퍼즐"],
  softwareVersion: currentVersion,
  identifier: "com.applepie.minelogic",
  sameAs: playStoreUrl,
  contentRating: "전체이용가",
  downloadUrl: playStoreUrl,
  offers: {
    "@type": "Offer",
    url: playStoreUrl,
    price: 0,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  },
  image: "https://ersiyan.com/images/mine-logic/feature-1024.webp",
  screenshot: [
    "https://ersiyan.com/images/mine-logic/06_lobby-720.webp",
    "https://ersiyan.com/images/mine-logic/02_hint-720.webp",
    "https://ersiyan.com/images/mine-logic/03_training-720.webp",
  ],
  featureList: [
    "초급·중급·고급 지뢰찾기",
    "논리 과정을 나누어 보여주는 단계별 힌트",
    "일반훈련 1~15단계와 강화훈련 16~20단계",
    "인터넷 권한이 필요 없는 오프라인 플레이",
  ],
  inLanguage: supportedLanguages.map((language) => language.code),
  publisher: {
    "@id": "https://ersiyan.com/#organization",
  },
  isPartOf: {
    "@id": "https://ersiyan.com/#website",
  },
};

const mineLogicPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://ersiyan.com/mine-logic#webpage",
  url: "https://ersiyan.com/mine-logic",
  name: title,
  description,
  inLanguage: "ko-KR",
  dateModified: "2026-09-05",
  mainEntity: { "@id": "https://ersiyan.com/mine-logic#app" },
  isPartOf: { "@id": "https://ersiyan.com/#website" },
  publisher: { "@id": "https://ersiyan.com/#organization" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ERSIYAN",
        item: "https://ersiyan.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "MINE LOGIC(마인로직)",
        item: "https://ersiyan.com/mine-logic",
      },
    ],
  },
};

const difficulties = [
  {
    label: "BEGINNER",
    title: "초급",
    board: "9 × 9 · 지뢰 10개",
    description: "작은 보드에서 숫자와 주변 지뢰의 기본 관계를 익힙니다.",
  },
  {
    label: "INTERMEDIATE",
    title: "중급",
    board: "16 × 16 · 지뢰 40개",
    description: "더 넓어진 보드에서 여러 숫자 단서를 함께 비교합니다.",
  },
  {
    label: "EXPERT",
    title: "고급",
    board: "30 × 16 · 지뢰 99개",
    description: "긴 보드와 높은 지뢰 밀도에서 끝까지 논리를 이어 갑니다.",
  },
] as const;

const screens = [
  {
    title: "게임 로비",
    description: "초급·중급·고급 난이도와 훈련 메뉴를 한 화면에서 선택합니다.",
    src: "/images/mine-logic/06_lobby.png",
    srcSet:
      "/images/mine-logic/06_lobby-360.webp 360w, /images/mine-logic/06_lobby-540.webp 540w, /images/mine-logic/06_lobby-720.webp 720w",
    alt: "초급·중급·고급 난이도와 훈련 메뉴가 보이는 MINE LOGIC 로비 화면",
  },
  {
    title: "단계별 힌트",
    description:
      "이 화면에서는 힌트 3단계가 3행 3열을 안전 칸으로 표시합니다. 초록색 확인 표시가 난 칸을 열어 다음 수를 이어갈 수 있습니다.",
    src: "/images/mine-logic/02_hint.png",
    srcSet:
      "/images/mine-logic/02_hint-360.webp 360w, /images/mine-logic/02_hint-540.webp 540w, /images/mine-logic/02_hint-720.webp 720w",
    alt: "숫자 단서와 주변 칸을 강조해 논리 과정을 보여주는 MINE LOGIC 힌트 화면",
  },
  {
    title: "20단계 훈련",
    description: "일반훈련 15단계와 강화훈련 5단계를 순서대로 풀어 봅니다.",
    src: "/images/mine-logic/03_training.png",
    srcSet:
      "/images/mine-logic/03_training-360.webp 360w, /images/mine-logic/03_training-540.webp 540w, /images/mine-logic/03_training-720.webp 720w",
    alt: "일반훈련 1~15단계와 강화훈련 16~20단계가 보이는 MINE LOGIC 훈련 화면",
  },
] as const;

export default function MineLogicPage() {
  return (
    <div id="top" className={`site-shell ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([mineLogicStructuredData, mineLogicPageStructuredData]),
        }}
      />
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="site-header">
        <div className="header-inner">
          <BrandLockup />
          <nav className="primary-nav" aria-label="MINE LOGIC 페이지 메뉴">
            <a href="#screens">게임 화면</a>
            <a href="#difficulty">난이도</a>
            <a href="#features">특징</a>
            <a href="#install">설치</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="mine-logic-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <a href="/#games">ERSIYAN GAMES</a> / MINE LOGIC · ANDROID
              </p>
              <h1 id="mine-logic-title">
                지뢰찾기, 막히면
                <br />
                이유를 보고 풉니다.
              </h1>
              <p className={styles.heroLead}>
                MINE LOGIC(마인로직)은 단계별 힌트와 20단계 훈련으로 지뢰찾기를 처음
                배우는 사람도 즐길 수 있게 만든 Android 논리 퍼즐 게임입니다.
              </p>
              <div className={styles.heroActions}>
                <a
                  className="button button--primary"
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play에서 보기 <span aria-hidden="true">↗</span>
                </a>
                <a className="button button--quiet" href="#screens">
                  실제 게임 화면 보기
                </a>
              </div>
            </div>

            <figure className={styles.heroVisual}>
              <div className={styles.heroScreenFrame}>
                <ResponsivePicture
                  className={styles.heroScreen}
                  src="/images/mine-logic/02_hint.png"
                  webpSrcSet="/images/mine-logic/02_hint-360.webp 360w, /images/mine-logic/02_hint-540.webp 540w, /images/mine-logic/02_hint-720.webp 720w"
                  alt="MINE LOGIC의 실제 초급 게임 화면. 숫자 단서와 주변 칸을 강조하고 3단계 힌트가 안전 칸을 표시합니다"
                  width={1080}
                  height={1920}
                  sizes="(max-width: 680px) 280px, (max-width: 980px) 330px, 360px"
                  fetchPriority="high"
                />
              </div>
              <figcaption>
                <span>실제 게임 화면 · 단계별 힌트 3단계</span>
                <strong>숫자 단서를 보고 안전한 칸을 확인합니다.</strong>
              </figcaption>
            </figure>

            <dl className={styles.heroFacts} aria-label="MINE LOGIC 제품 정보">
              <div>
                <dt>PLATFORM</dt>
                <dd>Android</dd>
              </div>
              <div>
                <dt>CURRENT BUILD</dt>
                <dd>v{currentVersion}</dd>
              </div>
              <div>
                <dt>NETWORK</dt>
                <dd>오프라인 플레이</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          id="screens"
          className={`${styles.section} ${styles.screensSection}`}
          aria-labelledby="screens-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <p>ACTUAL GAME SCREENS</p>
              <h2 id="screens-title">게임 화면을 살펴보세요</h2>
              <span>
                난이도를 고르는 로비, 막힌 수를 풀어보는 힌트, 20단계 훈련
                화면을 소개합니다.
              </span>
            </div>
            <div className={styles.screenGrid}>
              {screens.map((screen) => (
                <figure className={styles.screenCard} key={screen.title}>
                  <div className={styles.screenImageWrap}>
                    <ResponsivePicture
                      className={styles.screenImage}
                      src={screen.src}
                      webpSrcSet={screen.srcSet}
                      alt={screen.alt}
                      width={1080}
                      height={1920}
                      sizes="(max-width: 680px) 76vw, (max-width: 980px) 36vw, 24vw"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption>
                    <strong>{screen.title}</strong>
                    <span>{screen.description}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          id="difficulty"
          className={styles.section}
          aria-labelledby="difficulty-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <p>STANDARD BOARDS</p>
              <h2 id="difficulty-title">익숙한 세 가지 난이도를 그대로</h2>
              <span>
                초급 9×9부터 고급 30×16까지, 지뢰찾기의 대표적인 보드 크기로
                바로 시작할 수 있습니다.
              </span>
            </div>
            <div className={styles.difficultyGrid}>
              {difficulties.map((difficulty) => (
                <article className={styles.difficultyCard} key={difficulty.title}>
                  <small>{difficulty.label}</small>
                  <h3>{difficulty.title}</h3>
                  <strong>{difficulty.board}</strong>
                  <p>{difficulty.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className={`${styles.section} ${styles.sectionDark}`}
          aria-labelledby="features-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.featureIntro}>
              <div className={styles.sectionHeading}>
                <p>LEARN THE LOGIC</p>
                <h2 id="features-title">답만 보여주지 않고 과정을 나눕니다</h2>
                <span>
                  막힌 순간에는 강조된 단서부터 관계 비교, 확정 결과까지 차례로
                  확인하고, 훈련에서는 쉬운 논리부터 어려운 패턴까지 순서대로
                  연습합니다.
                </span>
              </div>
              <ResponsivePicture
                className={styles.featureArtwork}
                src="/images/mine-logic/feature.png"
                webpSrcSet="/images/mine-logic/feature-480.webp 480w, /images/mine-logic/feature-768.webp 768w, /images/mine-logic/feature-1024.webp 1024w"
                alt="푸른 지뢰찾기 보드 위의 붉은 깃발과 지뢰를 표현한 MINE LOGIC 대표 이미지"
                width={1024}
                height={500}
                sizes="(max-width: 980px) 90vw, 38vw"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.featureGrid}>
              <article className={styles.featureCard}>
                <small>01 · STAGED HINTS</small>
                <h3>단계별 힌트</h3>
                <p>
                  1단계에서 숫자 단서와 주변 깃발을 확인하고, 2단계에서 주변
                  칸들의 관계를 비교한 뒤, 3단계에서 확정되는 안전 칸이나 지뢰를
                  확인합니다.
                </p>
              </article>
              <article className={styles.featureCard}>
                <small>02 · TRAINING 01–20</small>
                <h3>20단계 훈련</h3>
                <p>
                  일반훈련과 강화훈련으로 나뉜 문제를 단계별로 풀며 지뢰찾기에서
                  자주 쓰는 논리와 더 복잡한 패턴을 익힙니다.
                </p>
                <div className={styles.trainingBands}>
                  <span>일반훈련 1~15단계</span>
                  <span>강화훈련 16~20단계</span>
                </div>
              </article>
              <article className={styles.featureCard}>
                <small>03 · OFFLINE</small>
                <h3>인터넷 없이 플레이</h3>
                <p>
                  Android INTERNET 권한을 요청하지 않습니다. 회원가입, 광고,
                  온라인 순위 없이 게임 상태와 설정을 기기 안에서 관리합니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="install" className={styles.section} aria-labelledby="install-title">
          <div className={styles.sectionInner}>
            <div className={styles.installPanel}>
              <div>
                <h2 id="install-title">Google Play에서 MINE LOGIC 확인하기</h2>
                <p>
                  설치와 앱 거래 정보는 Google Play에서 확인할 수 있습니다.
                  개인정보 처리 방식과 기기에 저장되는 정보는 별도 정책에 자세히
                  정리했습니다.
                </p>
                <p>
                  <strong>무료 · 전체이용가</strong>
                  <br />
                  Google Play 대한민국 스토어에서 <time dateTime="2026-09-05">2026년 9월 5일</time> 확인했습니다.
                </p>
                <p>
                  <strong>v{currentVersion} 업데이트</strong>
                  <br />
                  스토어 업데이트 날짜는 <time dateTime="2026-08-28">2026년 8월 28일</time>입니다.
                  ERSIYAN 로고와 제작자 표기를 반영하고 개인정보처리방침 링크를
                  변경했으며, 다크 모드의 일부 글자를 더 잘 읽을 수 있게 조정했습니다.
                </p>
                <p>
                  <strong>12개 언어 지원</strong>
                  <br />
                  {supportedLanguages.map((language) => language.name).join(" · ")}
                </p>
                <div className={styles.supportLinks}>
                  <a href="/privacy/mine-logic">MINE LOGIC 개인정보처리방침</a>
                  <a href="mailto:help@ersiyan.com">help@ersiyan.com</a>
                </div>
              </div>
              <div className={styles.installActions}>
                <a
                  className="button button--primary"
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play로 이동 <span aria-hidden="true">↗</span>
                </a>
                <a className="button button--quiet" href="/">
                  에르시안 홈페이지
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ErFooter />
    </div>
  );
}
