/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../../_components/BrandLockup";
import { ErFooter } from "../../_components/ErFooter";
import baseStyles from "../page.module.css";
import styles from "./page.module.css";

const title = "벨시엔 서밋 세계관 안내 | 처음 만나는 벨시엔";
const description =
  "벨시엔 서밋을 처음 보는 사람을 위한 2026년 9월 공개 세계관. 수직도시와 평생 생태계 계약, 오리센·비렌타·네릭스, 중립계약자와 인간형 AI, 계약에서 시작되는 이야기를 순서대로 설명합니다.";
const pageUrl = "https://ersiyan.com/velsien-summit/world";
const published = "2026-09-19";
const modified = "2026-09-20";
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
    modifiedTime: modified,
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
      dateModified: modified,
      isPartOf: { "@id": "https://ersiyan.com/#website" },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      mainEntity: { "@id": `${pageUrl}#article` },
    },
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      url: pageUrl,
      headline: "처음 만나는 벨시엔 서밋 세계관",
      description,
      inLanguage: "ko-KR",
      datePublished: published,
      dateModified: modified,
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
    slug: "orysen",
    direction: "안정과 보장",
    slogan: "내일을 더 확실하게.",
    copy: "오리센은 예측 가능한 내일을 약속합니다. 의료, 주거, AI와 생활 기반을 안정적으로 연결하고 오래 유지하는 데 강합니다.",
    shadow: "안전을 맡길수록 생활의 더 많은 부분을 회사의 기준과 관리에 맡기게 됩니다.",
    example: "오래 쓸 수 있고 유지·점검 체계가 촘촘한 인공심장",
  },
  {
    number: "02",
    name: "VIRENTA",
    korean: "비렌타",
    slug: "virenta",
    direction: "감각과 만족",
    slogan: "원하는 삶에 더 가까이.",
    copy: "비렌타는 각자가 원하는 모습과 경험에 집중합니다. 의료와 주거, AI 서비스를 개인의 취향과 감각에 맞춰 설계합니다.",
    shadow: "편리하고 만족스러운 경험에 익숙해질수록 다른 생태계로 옮기기가 어려워집니다.",
    example: "몸의 감각과 생활 습관에 세밀하게 맞추는 인공심장",
  },
  {
    number: "03",
    name: "NERYX",
    korean: "네릭스",
    slug: "neryx",
    direction: "성능과 확장",
    slogan: "한계를 넘어, 다음으로.",
    copy: "네릭스는 지금 가능한 성능을 다음 단계의 출발점으로 봅니다. 신체와 지능, 기술의 한계를 넓히는 데 투자합니다.",
    shadow: "성능 향상이 일상이 되면 멈출 자유에도 경쟁의 압력이 따라옵니다.",
    example: "더 큰 출력과 확장 가능성을 우선하는 인공심장",
  },
];

const societySteps = [
  {
    number: "01",
    title: "기술이 일상을 바꿉니다",
    copy: "AI가 반복 노동을 맡고 생산과 물류가 자동화됩니다. 신경칩, 인공장기, 유전자 설계와 감각 기술도 생활 속으로 들어옵니다.",
  },
  {
    number: "02",
    title: "기업이 생활망을 묶습니다",
    copy: "세 기업은 한 가지 제품만 팔지 않습니다. 주거와 식사, 의료, 교통, 통신, 개인 AI까지 이어지는 생활망을 각각 제공합니다.",
  },
  {
    number: "03",
    title: "시민이 평생계약을 고릅니다",
    copy: "어느 생활망에 오래 속할지 결정합니다. 더 나은 서비스를 얻는 대신, 기기와 데이터, 관계도 그 생태계에 쌓입니다.",
  },
  {
    number: "04",
    title: "생활의 선택이 권력이 됩니다",
    copy: "한 사람의 계약은 의료망과 결제, 데이터와 가족의 미래까지 이어집니다. 시민을 확보하려는 경쟁이 기업 간 분쟁으로 커집니다.",
  },
];

const storySteps = [
  {
    number: "01",
    title: "오늘의 계약",
    copy: "처음에는 호송, AI 회수, 시설 경비와 조사 같은 일을 맡습니다. 플레이어가 처음부터 도시의 비밀을 해결할 영웅인 것은 아닙니다.",
  },
  {
    number: "02",
    title: "계약이 남긴 단서",
    copy: "일을 마칠수록 평판과 더 어려운 계약이 쌓입니다. 같은 사건을 두고 세 기업이 서로 다른 설명과 증거를 제시하기 시작합니다.",
  },
  {
    number: "03",
    title: "평생계약의 전쟁",
    copy: "시민을 어느 생태계에 묶을 것인가를 둘러싼 경쟁이 격해집니다. 호송과 회수, 시설 확보 같은 현장 계약이 더 큰 분쟁의 일부가 됩니다.",
  },
  {
    number: "04",
    title: "중립성의 가격",
    copy: "서로를 믿지 못하는 회사들이 같은 계약자를 찾습니다. 모두의 일을 할 수 있었던 자유가, 어느 편을 들 것인지 답해야 하는 압력으로 바뀝니다.",
  },
];

const playLoop = [
  { number: "01", title: "계약 확인", copy: "현장의 목적과 위험, 의뢰인이 공개한 정보를 읽습니다." },
  { number: "02", title: "팀 준비", copy: "서로 다른 제조사의 AI를 편성하고 임무에 맞게 정비합니다." },
  { number: "03", title: "작전 수행", copy: "진형과 행동 순서를 생각한 뒤 계약 현장의 전투에 들어갑니다." },
  { number: "04", title: "결과와 다음 일", copy: "보수와 평판을 얻고 팀을 다듬으며 더 깊은 분쟁으로 향합니다." },
];

const worldTerms = [
  { term: "기업 생태계", meaning: "한 회사가 의료, 주거, 이동, 통신, AI 같은 생활 서비스를 연결해 제공하는 체계" },
  { term: "평생 생태계 계약", meaning: "그 생활망에 오랫동안 속하며 삶의 많은 부분을 한 기업과 함께 운영하는 계약" },
  { term: "순수인간", meaning: "신체를 개조하지 않고 기업 생활망에도 묶이지 않은 사람을 가리키는 이 문서의 편의 표현" },
  { term: "중립계약자", meaning: "서로를 믿지 못하는 기업 사이에서 호송, 회수, 조사와 경비를 맡는 독립 계약자" },
  { term: "동행자", meaning: "계약자와 한 팀으로 움직이는 인간형 AI. 제조사와 현재 운용자는 다를 수 있음" },
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
            <p className={styles.eyebrow}>VELSIEN SUMMIT / THE WORLD EXPLAINED</p>
            <h1 id="world-title">처음 만나는<br /><span>벨시엔</span></h1>
            <p className={styles.heroLead}>
              벨시엔 서밋은 수직도시 벨시엔을 배경으로 개발 중인 모바일 전략
              RPG입니다. 기술이 생활을 풍요롭게 만든 이 도시에서 사람들은
              어느 기업과 평생을 함께할지 고릅니다. 기업에 속하지 않은 한
              계약자의 시선으로, 그 선택 뒤에 숨은 이야기를 따라갑니다.
            </p>
            <div className={styles.heroMeta}>
              <span>세계관 공개본</span>
              <time dateTime={published}>2026.09.19 첫 공개</time>
              <time dateTime={modified}>2026.09.20 갱신</time>
              <span>개발 중 · 출시 미정</span>
            </div>
            <a className={styles.heroLink} href="#overview">처음부터 읽기 <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        <section id="overview" className={styles.introBand} aria-labelledby="overview-title">
          <div className={styles.introGrid}>
            <p className={styles.introLabel}>이 세계를 이해하는 순서 / 00</p>
            <div className={styles.introText}>
              <h2 id="overview-title">기술이 실패해 폐허가 된 미래는 아닙니다.<br />편리한 삶을 누가 운영하는지가 문제입니다.</h2>
              <p>
                사람 대신 일하는 AI, 몸을 바꾸는 기술, 생활 전체를 제공하는
                기업이 있습니다. 시민은 서비스를 얻기 위해 기업과 깊이
                연결되고, 기업의 경쟁은 도시 전체의 갈등이 됩니다. 이 페이지는
                그 원인부터 플레이어의 이야기까지 처음 보는 사람의 순서로
                설명합니다.
              </p>
            </div>
          </div>
        </section>

        <nav className={styles.chapterNav} aria-label="세계관 목차">
          <a href="#city">도시</a>
          <a href="#society">생활과 계약</a>
          <a href="#companies">세 기업</a>
          <a href="#contractor">중립계약자</a>
          <a href="#companions">AI 동행자</a>
          <a href="#story">계약과 이야기</a>
          <a href="#terms">용어 정리</a>
        </nav>

        <section id="city" className={styles.chapter} aria-labelledby="city-title">
          <div className={styles.sectionHeading}>
            <p>01 / THE CITY</p>
            <h2 id="city-title">기술은 성공했습니다.<br />선택은 더 어려워졌습니다.</h2>
            <span>벨시엔은 오염과 폐허에 잠긴 도시가 아닙니다. 자동화가 실제로 삶을 편하게 만든 미래의 거대한 수직도시입니다.</span>
          </div>
          <div className={styles.cityGrid}>
            <p className={styles.largeCopy}>
              깨끗한 거리에서 인간형 AI가 일합니다. 생산과 물류는 자동화되고,
              의료는 인공장기와 유전자 설계까지 다룹니다. XR과 감각 기술은
              오락뿐 아니라 일상의 경험을 바꿉니다.
            </p>
            <div className={styles.bodyCopy}>
              <p>
                기본적인 생존을 위해 사람이 꼭 일해야 할 이유는 크게 줄었습니다.
                그럼에도 사람들은 연구와 창작, 성취와 지위를 위해 일합니다.
                목적을 찾지 못해 XR과 감각·기억 상품, 약물이나 성인 유흥 같은
                자극에 머무는 사람도 있습니다.
              </p>
              <p>
                위로 뻗은 도시의 높이는 풍경만 바꾸지 않습니다. 사는 곳과
                자산, 기업의 영향력, 최신 기술과 보안에 접근할 수 있는 정도가
                층에 따라 달라집니다. 정확한 층의 이름이나 경계보다 중요한
                것은 같은 도시 안에서도 가능한 삶이 다르다는 점입니다.
              </p>
            </div>
          </div>
          <div className={styles.cityScene}>
            <strong>벨시엔의 한 거리에서</strong>
            <p>
              길은 잘 정돈돼 있고 운송 AI가 조용히 지나갑니다. 한쪽에는
              완벽한 의료·주거 서비스를 알리는 기업 광고가 흐릅니다. 같은
              거리에서 어떤 사람은 다음 연구를 준비하고, 어떤 사람은 XR 속에
              하루를 보냅니다. 도시의 시스템은 멈추지 않지만 모두가 같은
              방향으로 살아가는 것은 아닙니다.
            </p>
          </div>
          <blockquote className={styles.pullQuote}>
            사람은 자유롭습니다. 그러나 선택에는 구조적인 대가가 따릅니다.
          </blockquote>
        </section>

        <section id="society" className={`${styles.chapter} ${styles.societyChapter}`} aria-labelledby="society-title">
          <div className={styles.sectionHeading}>
            <p>02 / HOW THE CITY WORKS</p>
            <h2 id="society-title">왜 삶을 기업과 계약할까요.</h2>
            <span>
              여기서 ‘기업 생태계’는 한 회사가 서로 연결해 제공하는 생활망을
              뜻합니다. 시민은 병원 하나를 고르는 대신 의료·주거·교통·통신과
              개인 AI까지 이어지는 삶의 방식을 고릅니다.
            </span>
          </div>
          <ol className={styles.chainGrid}>
            {societySteps.map((step) => (
              <li className={styles.chainStep} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
          <div className={styles.contractPanel}>
            <div>
              <p>하나의 계약에 묶이는 것</p>
              <h3>평생 생태계 계약</h3>
              <span>
                한 기업의 생활망에 오래 머무는 계약입니다. 생필품과 의료,
                신체개조의 유지 관리, 주거·교통·통신·개인 AI가 서로 연결됩니다.
                기업에는 고객 한 사람의 생활과 데이터가 장기적으로 쌓입니다.
              </span>
            </div>
            <div>
              <ul className={styles.contractList}>
                <li>의료와 개조 유지 관리</li>
                <li>주거·식사·교통·통신</li>
                <li>개인 AI와 결제·데이터</li>
              </ul>
              <p className={styles.contractTradeoff}>
                다른 기업으로 옮기는 일은 가능합니다. 그러나 기기 호환,
                의료 기록과 데이터 이전, 이용하던 시설의 접근권이 함께
                바뀌므로 ‘계약을 바꾼다’는 말은 삶의 기반을 옮기는 일에
                가깝습니다.
              </p>
            </div>
          </div>
          <div className={styles.bodyCopy}>
            <p>
              국가는 사라지지 않았습니다. 주민등록과 외교, 법과 공공 행정은
              남아 있습니다. 다만 의료와 물류, 통신 등 도시의 핵심 기반을
              기업이 운영하기 때문에 정부도 이들의 요구를 쉽게 무시할 수
              없습니다. 세 기업을 실질적으로 견제하는 힘은 서로 다른 두
              기업에서 나옵니다.
            </p>
            <p>
              공식 국적과 별개로 일상에서는 어느 기업의 계약자인지가 중요해집니다.
              다른 회사의 구역에 들어가면 신체기기 호환 검사가 필요할 수 있고,
              의료 기록과 데이터 이전, 시설 이용권도 새 계약의 영향을 받습니다.
              그래서 기업을 바꾸는 선택은 병원을 바꾸는 일보다 훨씬 큽니다.
            </p>
          </div>
        </section>

        <section id="companies" className={`${styles.chapter} ${styles.companiesChapter}`} aria-labelledby="companies-title">
          <div className={styles.sectionHeading}>
            <p>03 / THREE ECOSYSTEMS</p>
            <h2 id="companies-title">같은 도시, 다른 삶의 약속</h2>
            <span>
              오리센, 비렌타, 네릭스는 모두 의료, 주거, AI, 금융과 도시 기반을
              다룹니다. 한 회사는 병원만, 다른 회사는 기계만 만드는 구조가
              아닙니다. 같은 문제를 어떤 기준으로 해결하는지가 다릅니다.
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
                <p className={styles.companySlogan}>{company.slogan}</p>
                <p>{company.copy}</p>
                <p className={styles.companyShadow}><b>그 약속의 다른 면</b><br />{company.shadow}</p>
                <a
                  className={styles.companyLink}
                  href={`/velsien-summit/corporate/${company.slug}`}
                  aria-label={`${company.korean} 공식 홈페이지 보기`}
                >
                  회사 홈페이지 보기 <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
          <div className={styles.companyExample}>
            <div className={styles.exampleIntro}>
              <p>SAME NEED / THREE ANSWERS</p>
              <h3>같은 인공심장을 만든다면.</h3>
              <span>
                아래는 확정된 판매 제품 목록이 아닌 세계관의 비교 예시입니다.
                세 회사의 차이는 ‘무엇을 파는가’보다 ‘어떤 삶에 맞추는가’에서
                드러납니다.
              </span>
            </div>
            <div className={styles.exampleGrid}>
              {companies.map((company) => (
                <div className={styles.exampleCard} key={company.name}>
                  <b>{company.korean}</b>
                  <p>{company.example}</p>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.companyNote}>
            어느 기업도 모든 면에서 선하거나 악한 답은 아닙니다. 안정은
            통제로, 만족은 의존으로, 성능 향상은 끝없는 경쟁으로 이어질 수
            있습니다. 시민은 약속과 그 비용을 함께 고릅니다.
          </p>
        </section>

        <section id="contractor" className={styles.chapter} aria-labelledby="contractor-title">
          <div className={styles.sectionHeading}>
            <p>04 / THE UNATTACHED HUMAN</p>
            <h2 id="contractor-title">아무것도 연결하지 않은 사람이<br />왜 필요해졌을까요.</h2>
            <span>
              몸을 바꾸는 기술은 강제로 시작되지 않았습니다. 하지만 신경칩과
              신체 강화가 실제 기회를 넓히자 서비스와 사회의 기준도 개조한
              사람에게 맞춰졌습니다.
            </span>
          </div>
          <div className={styles.humanGrid}>
            <div className={styles.humanCard}>
              <p>처음에는 선택</p>
              <h3>개조를 하지 않아도 됩니다.</h3>
              <span>칩 없이 살고, 인공장기를 쓰지 않으며, 유전자 능력 강화 없이 태어날 수도 있습니다. 법이 모두에게 개조를 명령한 것은 아닙니다.</span>
            </div>
            <div className={styles.humanCard}>
              <p>나중에는 불이익</p>
              <h3>그러나 기회는 줄어듭니다.</h3>
              <span>개조한 사람이 더 빠르게 배우고 일하자 기업과 서비스가 그 조건을 표준으로 삼습니다. 자유로운 선택에도 사회적 비용이 생깁니다.</span>
            </div>
          </div>
          <div className={styles.splitStory}>
            <div className={styles.storyNumber} aria-hidden="true">00</div>
            <div className={styles.splitCopy}>
              <p className={styles.largeCopy}>
                플레이어는 신경칩과 인공장기, 기능성 기계 이식과 유전자
                강화를 받지 않았습니다. 어느 기업과도 평생 생태계 계약을 맺지
                않은 드문 사람입니다.
              </p>
              <p>
                이 페이지에서는 이런 상태를 편의상 ‘순수인간’이라 부릅니다.
                세계 안의 공식 명칭은 아직 정해지지 않았습니다. 평범한 시민에게는
                불편하게 사는 사람처럼 보이지만, 경쟁 기업 입장에서는
                몸속 장치나 장기 생활계약을 통해 한쪽에 묶여 있지 않은
                드문 중립자입니다.
              </p>
              <p>
                플레이어는 특별한 혈통이나 초능력으로 출발하지 않습니다.
                자신의 거점과 AI 팀을 운영하고, 필요한 서비스를 직접 고르며,
                맡은 계약의 결과를 스스로 책임집니다.
              </p>
            </div>
          </div>
          <div className={styles.conflictPanel}>
            <div>
              <p>왜 제3자가 필요한가</p>
              <h3>세 기업은 서로의 사람을 믿지 못합니다.</h3>
            </div>
            <p>
              한 기업의 무장 정규 인력이 경쟁사 시설에 들어가면 군사행동으로
              해석될 수 있습니다. 각자의 고객과 인프라가 한 도시 안에
              얽혀 있어 정면충돌은 자기 생활망도 해칩니다. 그래서
              제한된 현장 임무를 맡는 중립계약 시장이 커졌고, 플레이어는
              세 회사의 일을 모두 맡을 수 있습니다.
            </p>
          </div>
        </section>

        <section id="companions" className={`${styles.chapter} ${styles.companionChapter}`} aria-labelledby="companions-title">
          <div className={styles.sectionHeading}>
            <p>05 / AI COMPANIONS</p>
            <h2 id="companions-title">이 도시의 AI는<br />전장 밖에서도 살아갑니다.</h2>
            <span>
              인간형 AI는 가사와 의료, 운송, 건설, 경호와 안내까지 일상에
              있는 존재입니다. 팀에 합류하는 개체도 모두 폐기되거나 고장 난
              AI가 아닙니다. 만들어진 목적과 지나온 관계가 서로 다릅니다.
            </span>
          </div>
          <div className={styles.companionPanel}>
            <p className={styles.largeCopy}>
              벨시엔의 일상을 함께하는 AI에게는 만든 회사가 있습니다.
              그러나 제조사와 지금 현장에서 함께 움직이는 계약자는
              서로 다를 수 있습니다.
            </p>
            <div className={styles.bodyCopy}>
              <p>
                플레이어는 계약을 통해 서로 다른 회사가 만든 AI를 장기간
                운용하고 한 팀으로 편성합니다. 중립 임무에서는 제조사가
                현장의 AI를 마음대로 원격 지휘하지 못하도록 제한됩니다.
                구체적인 계약과 권리의 범위는 이야기 속에서 드러납니다.
              </p>
              <p>
                모든 AI가 전투용으로 태어난 것도 아닙니다. 비전투형도
                높은 잠재 신체 성능을 가질 수 있지만 안전 제한과
                운용 목적이 다릅니다. 팀은 각자의 기능과 현장 경험을 살려
                계약을 수행합니다. 제조사의 이해를 더 중시하거나 처음에는
                플레이어를 믿지 않는 동행자도 있을 수 있습니다.
              </p>
              <p>
                이들은 접객과 간병, 교육, 물류, 연구 보조, 공연, 경호처럼
                다양한 일을 맡습니다. 사람의 공간에서 일하도록 만든 감각과
                동작 능력이 있어 비전투형에도 잠재력이 있지만, 위험한 현장에
                투입할 때는 목적과 안전 제한에 맞는 별도 운용이 필요합니다.
              </p>
            </div>
          </div>
          <div className={styles.aiRoles}>
            <div className={styles.aiRoleCard}>
              <b>제조사</b>
              <p>AI를 설계하고 만든 기업입니다. 각자의 기술과 제품 철학이 개체에 남습니다.</p>
            </div>
            <div className={styles.aiRoleCard}>
              <b>현장 운용자</b>
              <p>계약 기간 동안 AI와 함께 임무를 수행하고 팀을 지휘하는 사람입니다.</p>
            </div>
            <div className={styles.aiRoleCard}>
              <b>동행자</b>
              <p>출처만으로 설명되지 않는 개별 경험과 관계를 가진 인간형 AI입니다.</p>
            </div>
          </div>
          <p className={styles.companyNote}>
            계약 보수는 팀의 운용과 정비에도 쓰입니다. 오래 함께한 AI를 바로
            바꾸는 대신 원래 가진 기능에 맞춰 센서와 출력, 판단 알고리즘을
            다듬을 수 있습니다. 새 동행자를 만나는 일과 기존 동행자를
            길러가는 일이 모두 팀의 성장에 포함됩니다. 제조사와 현장 운용자는
            같지 않을 수 있으며, 운용 계약과 소유권 이전도 서로 다른 일입니다.
          </p>
        </section>

        <section id="story" className={styles.chapter} aria-labelledby="story-title">
          <div className={styles.sectionHeading}>
            <p>06 / CONTRACTS AND STORY</p>
            <h2 id="story-title">계약 하나에서<br />도시 전체의 이야기로.</h2>
            <span>
              기업은 서로의 생활망을 부술 전면전 대신 제한된 현장 계약으로
              충돌합니다. 호송, 회수, 점거와 경비가 전투로 번질 수 있는
              이유입니다. 플레이어는 이런 의뢰를 받아 팀을 키웁니다.
            </span>
          </div>
          <div className={styles.playLoopGrid}>
            {playLoop.map((step) => (
              <div className={styles.playLoopStep} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
          <p className={styles.companyNote}>
            벨시엔 서밋의 전투는 계약을 읽고 AI 팀의 편성과 진형, 행동
            타이밍을 준비하면 팀이 현장에서 자동으로 행동하는 전략 경험으로
            설계하고 있습니다. 한 계약도 브리핑, 여러 작전과 결과 정산으로 이어질 수
            있습니다. 이 설명은 개발 방향이며 완성된 기능 목록은 아닙니다.
          </p>
          <div className={styles.bodyCopy}>
            <p>
              작은 계약의 보수와 실적은 팀을 유지하고 더 어려운 의뢰에 지원할
              기반이 됩니다. 현장에서 함께한 AI를 정비하거나 새 동행자를
              편성하면서 계약자가 맡을 수 있는 일도 넓어집니다. 이것이
              캐릭터의 성장과 이야기의 진행이 연결되는 이유입니다.
            </p>
            <p>
              개발 방향에는 일부 계약의 브리핑에서 접근 방식을 고르거나,
              AI가 원래 맡던 일에 따라 작은 현장 이점을 얻는 구상도 있습니다.
              특정 AI가 없으면 계약을 진행할 수 없는 필수 조건으로 만들지는
              않습니다. 이 구상은 게임 속 계약 임무를 위한 것이며, 구체적인 효과와
              적용 시점은 아직 확정된 출시 기능이 아닙니다.
            </p>
          </div>
          <div className={styles.sectionHeading}>
            <p>THE LONGER STORY</p>
            <h2>의뢰가 커질수록, 하나의 진실도 흔들립니다.</h2>
            <span>
              작은 일에서 출발한 중립계약자는 평생계약을 둘러싼 갈등과 같은
              사건의 서로 다른 증언을 만납니다. 평판이 높아질수록 기업들은
              그를 더 필요로 하면서도 더 강하게 압박합니다.
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
            <p>07 / THE NAME ABOVE THE CITY</p>
            <h3>Summit은 무엇일까요.</h3>
            <span>
              공개적으로 알려진 것은 이 이름이 도시의 정상부와 연결돼
              있다는 정도입니다. 닫힌 구역이라는 말도, 가장 높은 계약망이라는
              말도, 세 기업이 그곳에서 무언가를 공동으로 운영한다거나 단지
              상징이라는 말도 있습니다.
              서로 맞지 않는 소문 가운데 무엇이 사실인지는 아직 드러나지
              않았습니다. 계약이 깊어질수록 플레이어는 그 이름에 가까워집니다.
            </span>
          </div>
        </section>

        <section id="terms" className={styles.chapter} aria-labelledby="terms-title">
          <div className={styles.sectionHeading}>
            <p>08 / FIELD NOTES</p>
            <h2 id="terms-title">처음 만난 용어를 다시 읽기.</h2>
            <span>이 다섯 가지를 알면 벨시엔의 생활과 플레이어의 선택을 따라갈 수 있습니다.</span>
          </div>
          <dl className={styles.glossaryGrid}>
            {worldTerms.map(({ term, meaning }) => (
              <div className={styles.glossaryTerm} key={term}>
                <dt>{term}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.endNote} aria-labelledby="status-title">
          <div>
            <p>PUBLIC WORLD FILE / UPDATED 2026.09.20</p>
            <h2 id="status-title">여기까지가 지금 공개된 벨시엔입니다.</h2>
            <span>
              이 페이지는 2026년 9월 20일 기준 통합 세계관과 추가 설정을
              처음 보는 사람의 순서로 설명한 공개판입니다. 플레이어의 구체적
              과거와 계약 법률의 세부 조항, Summit의 실체는 아직 공개된
              사실로 확정하지 않습니다. 벨시엔 서밋은 개발 중이며 이
              공개는 게임 기능의 완성이나 출시 일정 확정을 뜻하지 않습니다.
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
