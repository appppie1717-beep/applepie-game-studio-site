import type { Metadata } from "next";
import styles from "./page.module.css";

const title = "VELSIEN SUMMIT Secret Archive | ERSIYAN";
const description =
  "A discoverable but unlisted VELSIEN SUMMIT development archive with five character studies and three current combat captures.";

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
    locale: "en_US",
    siteName: "ERSIYAN",
    url: "/velsien-summit/secret",
    title,
    description,
  },
};

const characters = [
  {
    name: "Nika Oren",
    role: "Vertical City Courier",
    src: "/images/velsien-summit/secret/nika-oren.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Luena Havel",
    role: "Character Study",
    src: "/images/velsien-summit/secret/luena-havel.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Serin Noer",
    role: "Observation Study",
    src: "/images/velsien-summit/secret/serin-noer.webp",
    width: 864,
    height: 1821,
  },
  {
    name: "Pia Morel",
    role: "Character Study",
    src: "/images/velsien-summit/secret/pia-morel.webp",
    width: 1024,
    height: 1536,
  },
  {
    name: "Kael Droen",
    role: "Character Study",
    src: "/images/velsien-summit/secret/kael-droen.webp",
    width: 1024,
    height: 1536,
  },
];

const combatCaptures = [
  {
    title: "Shaped Charge",
    detail: "Attack and impact frame",
    src: "/images/velsien-summit/secret/battle-shaped-charge.webp",
  },
  {
    title: "Prism Orbits",
    detail: "Ranged strike and damage frame",
    src: "/images/velsien-summit/secret/battle-prism-orbits.webp",
  },
  {
    title: "Percussion Rings",
    detail: "Heavy impact frame",
    src: "/images/velsien-summit/secret/battle-percussion-rings.webp",
  },
];

export default function VelsienSecretArchivePage() {
  return (
    <div className={styles.page} lang="en">
      <header className={styles.header}>
        <p>ERSIYAN / VELSIEN SUMMIT</p>
        <span>UNLISTED ARCHIVE</span>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <p>ARCHIVE ACCESS // 08</p>
          <h1>Secret Archive</h1>
          <span>
            Five character studies and three current combat captures from
            VELSIEN SUMMIT. These materials come from a game in development,
            so visuals and interface details may change before release. Read
            the <a href="/velsien-summit">official game overview</a> for the
            current public description.
          </span>
        </section>

        <section className={styles.section} aria-labelledby="characters-title">
          <div className={styles.sectionHeading}>
            <p>FILES 01–05</p>
            <h2 id="characters-title">Character Studies</h2>
          </div>
          <div className={styles.characterGrid}>
            {characters.map((character, index) => (
              <figure className={styles.characterCard} key={character.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={character.src}
                  alt={`${character.name} full-body character study`}
                  width={character.width}
                  height={character.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
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
            <p>FILES 06–08</p>
            <h2 id="combat-title">Combat Captures</h2>
          </div>
          <div className={styles.combatStack}>
            {combatCaptures.map((capture, index) => (
              <figure className={styles.combatCard} key={capture.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capture.src}
                  alt={`VELSIEN SUMMIT combat capture, ${capture.title}`}
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
      </main>

      <footer className={styles.footer}>
        <p>VELSIEN SUMMIT // DEVELOPMENT ARCHIVE</p>
        <span>© {new Date().getFullYear()} ERSIYAN</span>
      </footer>
    </div>
  );
}
