import type { Metadata } from "next";
import { ErFooter } from "../../_components/ErFooter";
import styles from "./page.module.css";
import { capture as devCapture01 } from "./devCapture01";
import { capture as devCapture02 } from "./devCapture02";
import { capture as devCapture03 } from "./devCapture03";
import { capture as devCapture04 } from "./devCapture04";

const title = "벨시엔 서밋 시각 자료 보관 | ERSIYAN";
const description =
  "벨시엔 서밋의 캐릭터 설정화 5점, 전투 화면 3점, 이전 개발 화면 4점을 모은 시각 자료 보관 페이지입니다. 현재 공개 세계관은 별도 안내에서 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical: "/velsien-summit/secret",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/velsien-summit/secret",
    title,
    description,
    images: [
      {
        url: "/images/velsien-summit/velsien-summit-social.jpg",
        width: 1200,
        height: 630,
        alt: "벨시엔 서밋 로고와 개발 중인 수직 도시 이미지",
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
        alt: "벨시엔 서밋 로고와 개발 중인 수직 도시 이미지",
      },
    ],
  },
};

const characters = [
  {
    name: "Nika Oren",
    role: "수직 도시의 배달원",
    src: "/images/velsien-summit/secret/nika-oren.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Luena Havel",
    role: "휴머노이드 AI 설정화",
    src: "/images/velsien-summit/secret/luena-havel.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Serin Noer",
    role: "관찰 설정화",
    src: "/images/velsien-summit/secret/serin-noer.webp",
    width: 864,
    height: 1821,
  },
  {
    name: "Pia Morel",
    role: "캐릭터 설정화",
    src: "/images/velsien-summit/secret/pia-morel.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Kael Droen",
    role: "캐릭터 설정화",
    src: "/images/velsien-summit/secret/kael-droen.webp",
    width: 1024,
    height: 1536,
  },
];

const combatCaptures = [
  {
    title: "Shaped Charge",
    detail: "공격과 피격 연출",
    src: "/images/velsien-summit/secret/battle-shaped-charge.webp",
  },
  {
    title: "Prism Orbits",
    detail: "원거리 공격과 피해 연출",
    src: "/images/velsien-summit/secret/battle-prism-orbits.webp",
  },
  {
    title: "Percussion Rings",
    detail: "강한 타격 연출",
    src: "/images/velsien-summit/secret/battle-percussion-rings.webp",
  },
];

const developmentCaptures = [
  devCapture01,
  devCapture02,
  devCapture03,
  devCapture04,
];

function responsiveSrcSet(src: string, widths: readonly number[], originalWidth: number) {
  return [
    ...widths.map((width) => `${src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`),
    `${src} ${originalWidth}w`,
  ].join(", ");
}

export default function VelsienSecretArchivePage() {
  return (
    <div id="top" className={styles.page} lang="ko">
      <header className={styles.header}>
        <p>ERSIYAN <span aria-hidden="true">/</span> VELSIEN SUMMIT</p>
        <a href="/velsien-summit">게임 소개로 돌아가기 <span aria-hidden="true">↗</span></a>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>VISUAL ARCHIVE <span aria-hidden="true">·</span> 12 RECORDS</p>
          <h1>벨시엔 서밋<br />시각 자료 보관</h1>
          <p className={styles.introCopy}>
            개발 과정의 캐릭터 설정화, 전투 장면, 이전 화면을 모았습니다.{" "}
            현재 공개 설정과 게임 소개는 각각 정식 페이지에서 확인할 수 있습니다.
          </p>
          <nav className={styles.introLinks} aria-label="벨시엔 서밋 정식 안내">
            <a href="/velsien-summit/world">현재 세계관 읽기 <span aria-hidden="true">↗</span></a>
            <a href="/velsien-summit">게임 소개 보기 <span aria-hidden="true">↗</span></a>
          </nav>
          <p className={styles.archiveNote}>이 자료는 현재 개발 상태와 다를 수 있습니다.</p>
        </section>

        <section className={styles.section} aria-labelledby="characters-title">
          <div className={styles.sectionHeading}>
            <p>01 — 05 <span aria-hidden="true">/</span> CHARACTER STUDIES</p>
            <h2 id="characters-title">캐릭터 설정화</h2>
          </div>
          <div className={styles.characterGrid}>
            {characters.map((character, index) => (
              <figure className={styles.characterCard} key={character.name}>
                <picture style={{ display: "contents" }}>
                  <source
                    media="(max-width: 680px)"
                    srcSet={responsiveSrcSet(character.src, [400, 720], character.width)}
                    sizes="(max-width: 400px) calc(100vw - 42px), calc(90vw - 2px)"
                  />
                  <img
                    src={character.src}
                    alt={`${character.name} 전신 캐릭터 설정화`}
                    width={character.width}
                    height={character.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    decoding="async"
                  />
                </picture>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{character.name}</strong>
                    <small>{character.role}</small>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="combat-title">
          <div className={styles.sectionHeading}>
            <p>06 — 08 <span aria-hidden="true">/</span> COMBAT CAPTURES</p>
            <h2 id="combat-title">전투 화면</h2>
          </div>
          <div className={styles.combatStack}>
            {combatCaptures.map((capture, index) => (
              <figure className={styles.combatCard} key={capture.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capture.src}
                  srcSet={responsiveSrcSet(capture.src, [640, 960], 1369)}
                  sizes="auto, (max-width: 400px) calc(100vw - 42px), (max-width: 1480px) calc(100vw - clamp(40px, 10vw, 152px) - 2px), 1326px"
                  alt={`벨시엔 서밋 ${capture.title} 전투 화면`}
                  width={1369}
                  height={644}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>{String(index + 6).padStart(2, "0")}</span>
                  <div>
                    <strong>{capture.title}</strong>
                    <small>{capture.detail}</small>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="development-title">
          <div className={styles.sectionHeading}>
            <p>09 — 12 <span aria-hidden="true">/</span> EARLIER BUILDS</p>
            <h2 id="development-title">이전 개발 화면</h2>
          </div>
          <div className={styles.developmentGrid}>
            {developmentCaptures.map((capture, index) => (
              <figure className={styles.combatCard} key={capture.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capture.src}
                  alt={`벨시엔 서밋 이전 개발 화면 ${index + 1}: ${capture.detail}`}
                  width={480}
                  height={227}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>{String(index + 9).padStart(2, "0")}</span>
                  <div>
                    <strong>{capture.title}</strong>
                    <small>{capture.detail}</small>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <ErFooter />
    </div>
  );
}
