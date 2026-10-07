/* eslint-disable @next/next/no-html-link-for-pages -- Static deployment uses full document navigation. */
import "../home.css";
import type { ReactNode } from "react";
import { BrandLockup } from "./BrandLockup";

export type HomeDivision = "games" | "virtual";

const divisions = [
  { id: "games", href: "/games", label: "게임부", name: "ERSIYAN GAMES" },
  { id: "virtual", href: "/virtual", label: "버츄얼부", name: "ERSIYAN VIRTUAL" },
] as const;

type HomeExperienceProps = {
  division: HomeDivision;
  children: ReactNode;
  footer: ReactNode;
};

export function HomeExperience({
  division,
  children,
  footer,
}: HomeExperienceProps) {
  return (
    <div id="top" className="site-shell home-shell">
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <header className="site-header home-header">
        <div className="header-inner">
          <BrandLockup />
          <nav className="home-view-controls" aria-label="에르시안 주요 메뉴">
            <div className="ersiyan-view-switch">
              {divisions.map((item) => (
                <a
                  id={`ersiyan-${item.id}-tab`}
                  className="home-view-button"
                  href={item.href}
                  aria-current={division === item.id ? "page" : undefined}
                  key={item.id}
                >
                  <strong>{item.label}</strong>
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
            <div className="home-utility-links">
              <a className="company-view-button" href="/">회사 정보</a>
              <a className="company-view-button" href="/notices">공지사항</a>
            </div>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {division === "games" && (
          <h1 className="home-page-title">에르시안 게임부 · 게임 개발과 운영</h1>
        )}
        <section
          id={`ersiyan-${division}-view`}
          className={division === "virtual"
            ? "home-division-panel virtual-view section-pad"
            : "home-division-panel games-division"}
          aria-labelledby={`ersiyan-${division}-tab`}
        >
          {children}
        </section>
      </main>
      {footer}
    </div>
  );
}
