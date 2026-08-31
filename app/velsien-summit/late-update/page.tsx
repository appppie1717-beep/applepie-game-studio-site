import type { Metadata } from "next";
import { BrandLockup } from "../../_components/BrandLockup";
import { GameProducerRegistration } from "../../_components/GameProducerRegistration";
import styles from "../page.module.css";

const title =
  "VELSIEN SUMMIT 8월말 추가정보 | ERSIYAN";
const description =
  "벨시엔 서밋의 8월 말 추가 공개 기록입니다. 수직도시와 세 기업, 중립계약자와 인간형 AI 동행자에 관한 단서를 개발 화면과 함께 소개합니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/velsien-summit/late-update",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/velsien-summit/late-update",
    title,
    description,
  },
};

const worldSignals = [
  {
    title: "너무 완벽한 도시는 누구의 것인가",
    items: [
      "벨시엔은 기술이 지나치게 성공한 깨끗하고 아름다운 초거대 수직도시입니다.",
      "세 초거대기업은 주거와 의료, 신체와 데이터, 오락까지 이어지는 평생 생태계를 제공하며 사실상 국가처럼 기능합니다.",
      "도시의 정상은 누구에게나 보이지만, 그곳에 무엇이 있는지는 아직 공개하지 않습니다.",
    ],
  },
  {
    title: "중립은 자유와 같은 말이 아닙니다",
    items: [
      "플레이어는 신체개조와 기업 평생계약이 없는 희귀한 순수인간 중립계약자입니다.",
      "세 기업은 서로 직접 충돌하기 곤란한 회수와 호송, 시설 방어와 조사 같은 제한 계약을 중립인 플레이어에게 맡깁니다.",
      "어느 기업에도 속하지 않았기에 모두에게 필요하지만, 바로 그 이유로 누구도 완전히 믿어 주지는 않습니다.",
    ],
  },
  {
    title: "동행자는 하나의 소속으로 끝나지 않습니다",
    items: [
      "플레이 가능한 동행자는 모두 제조사를 가진 인간형 AI이며, 정상 제품과 임대, 퇴역, 재판매, 사건 합류처럼 서로 다른 경로를 지닙니다.",
      "제조사가 가진 소유권과 플레이어가 받은 운용권은 같은 말이 아닙니다.",
      "누가 처음으로 팀에 들어오는지, 무엇을 기억하고 있는지는 최종 공개까지 남겨 둡니다.",
    ],
  },
];

const playSignals = [
  {
    title: "첫 계약은 완성된 팀으로 시작되지 않습니다",
    items: [
      "플레이어는 한 명의 동행자와 첫 전투를 시작하고, 계약과 사건을 지나며 함께 싸울 인원을 늘려 갑니다.",
      "초반 작전은 소수 인원으로 열리며 이후 전투에서만 더 넓은 편성이 허용됩니다.",
      "최대 인원보다 중요한 것은 누구를 언제 만나게 되는가입니다.",
    ],
  },
  {
    title: "전투는 시작 버튼을 누르기 전에 흔들립니다",
    items: [
      "동행자의 위치와 첫 행동 시점을 정한 뒤 전투가 자동으로 진행됩니다.",
      "같은 팀도 배치와 순서가 달라지면 앞줄이 무너지는 순간과 다음 행동자가 달라집니다.",
      "전술 보드의 배치와 순서는 같은 팀의 전투 흐름을 전혀 다르게 만듭니다.",
    ],
  },
  {
    title: "강화는 더 센 기술을 고르는 일만은 아닙니다",
    items: [
      "동행자의 두 기본 행동을 충분히 확인한 뒤 한 방향의 강화를 선택하게 됩니다.",
      "한 번의 선택은 반대쪽 강화 가능성을 닫지만, 이미 익힌 기본 행동까지 지우지는 않습니다.",
      "누구에게 어떤 선택을 맡길지는 아직 공개하지 않습니다.",
    ],
  },
];

const sealedSignals = [
  "세 기업의 실제 이름과 상징",
  "SUMMIT이 장소인지 조직인지, 혹은 다른 무엇인지",
  "최종 동행자 명단과 각자의 제조사",
  "첫 계약이 도시의 균형에 남기는 결과",
];

const gallery = [
  {
    src: "/images/velsien-summit/late-update-operation.webp",
    alt: "벨시엔 서밋 작전 계약 화면",
    note: "계약별 세부 작전과 진행 경로를 고르는 작전 계약 화면",
  },
  {
    src: "/images/velsien-summit/late-update-gacha.webp",
    alt: "벨시엔 서밋 신호 계약 스캐너 화면",
    note: "새로운 동행자의 신호를 탐색하는 계약 스캐너",
  },
  {
    src: "/images/velsien-summit/late-update-formation.webp",
    alt: "벨시엔 서밋 편성 화면",
    note: "위치와 첫 행동 시점을 정하는 전투 준비 화면",
  },
];

export default function VelsienLateUpdatePage() {
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
            <a href="/velsien-summit">벨시엔 메인</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.sectionIntro + " " + styles.lateUpdateIntro}>
          <p>VELSIEN SUMMIT · AUGUST UPDATE</p>
          <h1>8월말 추가정보</h1>
          <span>
            기존 소개에서 한 걸음 더 들어갑니다. 벨시엔이 왜 중립계약자를
            필요로 하는지, 동행자와 전투가 어떤 방향으로 이어지는지 몇 가지
            단서만 먼저 공개합니다.
          </span>
        </section>

        <section className={styles.lateUpdateSection} aria-label="추가 공개 항목">
          <div className={styles.sectionIntro}>
            <p>새롭게 열린 세계관 기록</p>
            <h2>밝은 도시일수록 계약의 그림자는 짙어집니다</h2>
            <span>
              편리함이 사라진 세계가 아니라, 편리함이 너무 완벽해져 누구의
              생태계에서 살아갈지를 선택해야 하는 세계입니다.
            </span>
          </div>
          <div className={styles.infoGrid}>
            {worldSignals.map((signal) => (
              <article className={styles.infoCard} key={signal.title}>
                <h3>{signal.title}</h3>
                <ul>
                  {signal.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.lateUpdateSection} aria-label="플레이 구조 단서">
          <div className={styles.sectionIntro}>
            <p>계약과 전투의 단서</p>
            <h2>모든 선택은 전투가 시작되기 전에 남습니다</h2>
            <span>
              계약을 고르고 동행자를 배치하는 순간부터 전투의 흐름은 달라집니다.
              공개된 단서 너머의 규칙은 게임 안에서 차례로 드러납니다.
            </span>
          </div>
          <div className={styles.infoGrid}>
            {playSignals.map((signal) => (
              <article className={styles.infoCard} key={signal.title}>
                <h3>{signal.title}</h3>
                <ul>
                  {signal.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.lateUpdateSection} aria-label="추가 화면 공개">
          <div className={styles.sectionIntro}>
            <p>실제 화면 공개</p>
            <h2>벨시엔의 현재 모습</h2>
            <span>
              작전 계약과 신호 탐색, 전투를 준비하는 순간을 먼저 공개합니다.
              화면과 문구, 수치와 구성은 개발 과정에서 달라질 수 있습니다.
            </span>
          </div>
          <div className={styles.lateGallery}>
            {gallery.map((image) => (
              <figure key={image.src} className={styles.updateGalleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={960}
                  height={452}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <strong>{image.note}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.lateUpdateSection} aria-label="아직 공개하지 않는 정보">
          <div className={styles.sectionIntro}>
            <p>봉인된 기록</p>
            <h2>나머지는 아직 도시 위쪽에 남겨 둡니다</h2>
            <span>
              지금 공개하면 답이 되어 버리는 정보는 일부러 남겨 둡니다.
            </span>
          </div>
          <div className={styles.sealedPanel}>
            <p>PUBLIC ACCESS ENDS HERE</p>
            <ul>
              {sealedSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.lateUpdateSection} aria-label="페이지 이동">
          <div className={styles.sectionIntro}>
            <p>페이지 이동</p>
            <h2>벨시엔 서밋 본문으로 돌아가기</h2>
            <span>
              개발 화면 정리와 핵심 설정은 메인 페이지에서 다시 정돈되어 보입니다.
            </span>
          </div>
          <div className={styles.lateBack}>
            <a className={styles.secondaryLink} href="/velsien-summit">
              벨시엔 서밋 메인 페이지로
            </a>
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
