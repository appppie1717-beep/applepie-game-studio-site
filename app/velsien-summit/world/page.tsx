/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../../_components/BrandLockup";
import { ErFooter } from "../../_components/ErFooter";
import baseStyles from "../page.module.css";
import styles from "./page.module.css";

const title = "벨시엔 서밋 세계관 | 삶을 고르는 도시, 벨시엔";
const description =
  "2026년 9월 공개한 벨시엔 서밋의 최신 세계관. 수직도시 벨시엔, 오리센·비렌타·네릭스의 생활 생태계, 중립계약자와 인간형 AI 동행자의 이야기를 소개합니다.";
const pageUrl = "https://ersiyan.com/velsien-summit/world";
const published = "2026-09-19";
const socialImage = {
  url: "/images/velsien-summit/velsien-summit-social.jpg",
  width: 1200,
  height: 630,
  alt: "밝은 수직도시와 VELSIEN SUMMIT 로고가 담긴 대표 이미지",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/velsien-summit/world" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/velsien-summit/world",
    title,
    description,
    images: [socialImage],
    publishedTime: published,
    modifiedTime: published,
    authors: ["https://ersiyan.com/#games"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "ko-KR",
      datePublished: published,
      dateModified: published,
      isPartOf: { "@id": "https://ersiyan.com/#website" },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      mainEntity: { "@id": `${pageUrl}#article` },
    },
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      url: pageUrl,
      headline: "삶을 고르는 도시, 벨시엔",
      description,
      inLanguage: "ko-KR",
      datePublished: published,
      dateModified: published,
      author: {
        "@type": "Organization",
        "@id": "https://ersiyan.com/#games-organization",
        name: "ERSIYAN GAMES",
        url: "https://ersiyan.com/#games",
      },
      publisher: { "@id": "https://ersiyan.com/#organization" },
      image: "https://ersiyan.com/images/velsien-summit/velsien-summit-social.jpg",
      about: { "@id": "https://ersiyan.com/velsien-summit#game" },
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ERSIYAN", item: "https://ersiyan.com/" },
        { "@type": "ListItem", position: 2, name: "VELSIEN SUMMIT", item: "https://ersiyan.com/velsien-summit" },
        { "@type": "ListItem", position: 3, name: "세계관", item: pageUrl },
      ],
    },
  ],
};

const companies = [
  {
    number: "01",
    name: "ORYSEN",
    korean: "오리센",
    direction: "안정과 보장",
    copy: "오리센은 오래 지속되는 안전한 삶에 답하려 합니다. 주거와 의료, 생활의 연속성을 하나의 생태계로 묶고 내일도 무너지지 않을 선택을 약속합니다.",
  },
  {
    number: "02",
    name: "VIRENTA",
    korean: "비렌타",
    direction: "감각과 만족",
    copy: "비렌타는 각자가 원하는 모습과 경험에 집중합니다. 몸과 생활 공간, 일상의 감각까지 개인의 취향에 맞게 설계하는 미래를 제안합니다.",
  },
  {
    number: "03",
    name: "NERYX",
    korean: "네릭스",
    direction: "성능과 확장",
    copy: "네릭스는 현재의 한계를 다음 단계의 출발점으로 봅니다. 신체와 지능, 기술의 성능을 확장해 더 멀리 갈 수 있는 삶을 제시합니다.",
  },
];

const storySteps = [
  {
    number: "01",
    title: "작은 계약",
    copy: "시작은 호송과 회수, 조사처럼 도시 어디에서나 일어날 수 있는 일입니다. 계약 하나를 끝낼 때마다 서로 다른 생태계의 틈이 보이기 시작합니다.",
  },
  {
    number: "02",
    title: "세 기업의 경쟁",
    copy: "같은 시민과 같은 사건을 두고도 세 기업은 다른 미래를 말합니다. 생활 전체를 맡기는 평생계약의 경쟁은 도시의 균형까지 흔듭니다.",
  },
  {
    number: "03",
    title: "중립성의 대가",
    copy: "누구의 편도 아니라는 이유로 모두의 일을 맡을 수 있습니다. 하지만 여러 회사의 진실을 알게 된 사람은 그 중립을 계속 지킬 수 있을까요.",
  },
];

export default function VelsienWorldPage() {
  return (
    <div id="top" className={`site-shell velsien-shell ${baseStyles.page} ${styles.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>

      <header className="site-header">
        <div className="header-inner">
          <BrandLockup />
          <nav className={`primary-nav ${baseStyles.summitNav}`} aria-label="벨시엔 페이지 메뉴">
            <a href="/velsien-summit">벨시엔 메인</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <nav className={baseStyles.breadcrumb} aria-label="현재 위치">
          <ol>
            <li><a href="/">ERSIYAN</a></li>
            <li><a href="/velsien-summit">VELSIEN SUMMIT</a></li>
            <li aria-current="page">세계관</li>
          </ol>
        </nav>

        <section className={styles.hero} aria-labelledby="world-title">
          <div className={styles.heroImage} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/velsien-summit/devlog-20260905-city-1600.webp"
              srcSet="/images/velsien-summit/devlog-20260905-city-640.webp 640w, /images/velsien-summit/devlog-20260905-city-960.webp 960w, /images/velsien-summit/devlog-20260905-city-1600.webp 1600w"
              sizes="100vw"
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
            />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>VELSIEN SUMMIT / WORLD FILE</p>
            <h1 id="world-title">삶을 고르는 도시,<br /><span>벨시엔</span></h1>
            <p className={styles.heroLead}>
              벨시엔에서는 오늘의 생활을 어느 기업에 맡길지 고릅니다. 세 기업은
              같은 도시를 서로 다른 미래로 설계합니다. 그 어느 곳에도 속하지
              않은 계약자만이 세 회사의 일을 함께 맡을 수 있습니다.
            </p>
            <div className={styles.heroMeta}>
              <span>세계관 공개본</span>
              <time dateTime={published}>2026.09.19 공개</time>
              <span>개발 중 · 출시 미정</span>
            </div>
            <a className={styles.heroLink} href="#city">도시의 이야기 읽기 <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <nav className={styles.chapterNav} aria-label="세계관 목차">
          <a href="#city">도시</a>
          <a href="#companies">세 기업</a>
          <a href="#contractor">중립계약자</a>
          <a href="#companions">AI 동행자</a>
          <a href="#story">이야기</a>
        </nav>

        <section id="city" className={styles.chapter} aria-labelledby="city-title">
          <div className={styles.sectionHeading}>
            <p>01 / THE CITY</p>
            <h2 id="city-title">기술은 성공했습니다.<br />선택은 더 어려워졌습니다.</h2>
          </div>
          <div className={styles.cityGrid}>
            <p className={styles.largeCopy}>
              벨시엔은 무너진 미래의 폐허가 아닙니다. 깨끗한 수직도시에서
              자동화와 인간형 AI가 일상을 지탱하고, 신체개조는 낯선 실험이
              아니라 삶의 흔한 선택이 되었습니다.
            </p>
            <div className={styles.bodyCopy}>
              <p>
                처음에는 자신의 몸을 바꿀지 말지 자유롭게 고를 수 있었습니다.
                그러나 개조한 사람이 더 많은 기회를 얻으면서, 선택하지 않을
                자유에도 점차 비용이 생겼습니다.
              </p>
              <p>
                정부는 여전히 존재합니다. 다만 시민이 매일 마주하는 주거와
                의료, 인프라와 서비스는 거대한 기업 생태계와 깊이 얽혀
                있습니다. 생존을 위한 노동이 줄어든 자리에는 어느 삶에
                속할 것인가라는 질문이 남았습니다.
              </p>
            </div>
          </div>
          <blockquote className={styles.pullQuote}>
            사람은 자유롭습니다. 그러나 선택에는 구조적인 대가가 따릅니다.
          </blockquote>
        </section>

        <section id="companies" className={`${styles.chapter} ${styles.companiesChapter}`} aria-labelledby="companies-title">
          <div className={styles.sectionHeading}>
            <p>02 / THREE ECOSYSTEMS</p>
            <h2 id="companies-title">같은 도시, 다른 삶의 약속</h2>
            <span>
              오리센, 비렌타, 네릭스는 모두 주거와 의료, AI와 생활 기반을
              다룹니다. 무엇을 만들 수 있느냐보다 어떤 삶을 좋은 삶으로
              보느냐가 서로 다릅니다.
            </span>
          </div>
          <div className={styles.companyGrid}>
            {companies.map((company) => (
              <article className={styles.companyCard} key={company.name}>
                <div className={styles.companyTop}>
                  <span>{company.number}</span>
                  <span>VELSIEN / CORPORATION</span>
                </div>
                <h3>{company.name}<small>{company.korean}</small></h3>
                <strong>{company.direction}</strong>
                <p>{company.copy}</p>
              </article>
            ))}
          </div>
          <p className={styles.companyNote}>
            시민이 맺는 평생계약은 단순한 구독이 아닙니다. 서비스와 주거,
            사회적 소속까지 이어지는 생활의 선택입니다. 한 기업에서
            다른 기업으로 옮겨갈 자유는 있지만, 그 과정의 대가가 사라지는
            것은 아닙니다.
          </p>
        </section>

        <section id="contractor" className={styles.chapter} aria-labelledby="contractor-title">
          <div className={styles.sectionHeading}>
            <p>03 / THE CONTRACTOR</p>
            <h2 id="contractor-title">어느 회사의 사람도 아닌 사람</h2>
          </div>
          <div className={styles.splitStory}>
            <div className={styles.storyNumber} aria-hidden="true">00</div>
            <div className={styles.splitCopy}>
              <p className={styles.largeCopy}>
                플레이어는 신체개조를 하지 않았고 어느 기업과도 평생계약을
                맺지 않은 드문 순수인간입니다.
              </p>
              <p>
                일반 시민에게는 불편한 선택이지만, 서로를 완전히 믿지 못하는
                세 기업에는 이 중립성이 필요합니다. 회사가 직접 맡기 곤란한
                호송과 회수, 시설 방어와 조사 같은 계약이 중립계약자에게
                모입니다.
              </p>
              <p>
                누구의 편도 아니기에 모두에게 필요한 사람. 동시에 어느
                회사에도 속하지 않았기에 누구에게도 완전히 보호받지 못하는
                사람입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="companions" className={`${styles.chapter} ${styles.companionChapter}`} aria-labelledby="companions-title">
          <div className={styles.sectionHeading}>
            <p>04 / AI COMPANIONS</p>
            <h2 id="companions-title">제조사와 동행하는 곳은 다릅니다.</h2>
          </div>
          <div className={styles.companionPanel}>
            <p className={styles.largeCopy}>
              동행자는 이 도시에서 만들어진 인간형 AI입니다. 각자의
              제조사가 있지만, 누가 만들었는지와 지금 누구와 함께
              움직이는지는 같은 질문이 아닙니다.
            </p>
            <div className={styles.bodyCopy}>
              <p>
                계약자는 서로 다른 회사의 AI를 한 팀으로 운용할 수 있습니다.
                제조사와 지금 함께 일하는 계약자가 같지 않아도, 동행자의
                장기 운용이 이어질 수 있는 도시입니다.
              </p>
              <p>
                같은 도시에서 왔어도 동행자마다 거쳐 온 경로와 관계는
                다릅니다. 그들이 어떤 계약을 통해 이 팀에 합류하는지는
                이야기 속에서 드러납니다.
              </p>
            </div>
          </div>
        </section>

        <section id="story" className={styles.chapter} aria-labelledby="story-title">
          <div className={styles.sectionHeading}>
            <p>05 / THE STORY</p>
            <h2 id="story-title">작은 계약이 도시의 균형을 흔듭니다.</h2>
            <span>
              벨시엔 서밋의 이야기는 한 사람의 선택에서 시작해, 같은 사건에
              대한 서로 다른 진실로 넓어집니다.
            </span>
          </div>
          <div className={styles.storyGrid}>
            {storySteps.map((step) => (
              <article className={styles.storyCard} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <div className={styles.summitPanel}>
            <p>THE NAME ABOVE THE CITY</p>
            <h3>Summit에는 무엇이 있습니까.</h3>
            <span>
              도시의 위쪽과 맞닿은 이름을 두고 소문은 엇갈립니다. 장소인지,
              관계인지, 아직 다른 무엇인지 이 페이지는 답을 확정하지 않습니다.
              계약이 깊어질수록 그 이름은 더 가까워집니다.
            </span>
          </div>
        </section>

        <section className={styles.endNote} aria-labelledby="status-title">
          <div>
            <p>PUBLIC WORLD FILE / 2026.09.19</p>
            <h2 id="status-title">지금 공개한 세계관</h2>
            <span>
              이 페이지는 2026년 9월 19일 기준 세계관 문서의 공개판입니다.
              벨시엔 서밋은 개발 중인 전략 RPG이며, 이 공개는 게임 기능의
              완성이나 출시 일정 확정을 뜻하지 않습니다. 화면과 세부 설정은
              개발 과정에서 달라질 수 있습니다.
            </span>
          </div>
          <div className={styles.endLinks}>
            <a href="/velsien-summit">벨시엔 서밋 메인으로 <span aria-hidden="true">↗</span></a>
            <a href="/velsien-summit#development-log">개발 기록 보기 <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <ErFooter />
    </div>
  );
}
