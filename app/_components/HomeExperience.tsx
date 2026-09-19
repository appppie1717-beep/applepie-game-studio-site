import "../home.css";
import type { ReactNode } from "react";
import { BrandLockup } from "./BrandLockup";

export type HomeDivision = "games" | "virtual";

const divisions = [
  { id: "games", href: "/", label: "게임부", name: "ERSIYAN GAMES" },
  { id: "virtual", href: "/virtual", label: "버츄얼부", name: "ERSIYAN VIRTUAL" },
] as const;

type HomeExperienceProps = {
  division: HomeDivision;
  children: ReactNode;
  company: ReactNode;
  footer: ReactNode;
};

export function HomeExperience({
  division,
  children,
  company,
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
            <a className="company-view-button" href="#ersiyan-company-view">회사 정보</a>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <h1 className="home-page-title">
          {division === "virtual"
            ? "에르시안 버츄얼 0기 크리에이터 모집"
            : "에르시안(ERSIYAN) · 게임 개발과 운영"}
        </h1>
        <section
          id={`ersiyan-${division}-view`}
          className={division === "virtual"
            ? "home-division-panel virtual-view section-pad"
            : "home-division-panel games-division"}
          aria-labelledby={`ersiyan-${division}-tab`}
        >
          {children}
        </section>
        <section
          id="ersiyan-company-view"
          className="company-info-view section-pad"
          aria-labelledby="company-title"
        >
          {company}
        </section>
      </main>
      {footer}
    </div>
  );
}
