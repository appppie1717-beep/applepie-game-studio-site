"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandLockup } from "./BrandLockup";

type HomeView = "games" | "virtual" | "company";

type HomeExperienceProps = {
  games: ReactNode;
  company: ReactNode;
  footer: ReactNode;
};

export function HomeExperience({
  games,
  company,
  footer,
}: HomeExperienceProps) {
  const [activeView, setActiveView] = useState<HomeView>("games");
  const previousView = useRef<HomeView>(activeView);

  useEffect(() => {
    if (previousView.current === activeView) {
      return;
    }

    previousView.current = activeView;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeView]);

  const selectView = (view: HomeView) => {
    setActiveView(view);
  };

  return (
    <div id="top" className="site-shell" data-home-view={activeView}>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="site-header home-header">
        <div className="header-inner">
          <BrandLockup href="#top" />

          <div className="home-view-controls" aria-label="에르시안 화면 선택">
            <div className="ersiyan-view-switch" role="group" aria-label="에르시안 서비스">
              <button
                type="button"
                className="home-view-button"
                aria-pressed={activeView === "games"}
                aria-controls="ersiyan-games-view"
                onClick={() => selectView("games")}
              >
                ERSIYAN GAMES
              </button>
              <button
                type="button"
                className="home-view-button"
                aria-pressed={activeView === "virtual"}
                aria-controls="ersiyan-virtual-view"
                onClick={() => selectView("virtual")}
              >
                ERSIYAN VIRTUAL
              </button>
            </div>

            <button
              type="button"
              className="company-view-button"
              aria-pressed={activeView === "company"}
              aria-controls="ersiyan-company-view"
              onClick={() => selectView("company")}
            >
              회사 정보
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <div id="ersiyan-games-view" hidden={activeView !== "games"}>
          {games}
        </div>

        <section
          id="ersiyan-virtual-view"
          className="virtual-view"
          aria-label="ERSIYAN VIRTUAL"
          hidden={activeView !== "virtual"}
        >
          <p role="heading" aria-level={1}>
            COMING SOON
          </p>
        </section>

        <section
          id="ersiyan-company-view"
          className="company-info-view section-pad"
          aria-label="회사 정보"
          hidden={activeView !== "company"}
        >
          {company}
        </section>
      </main>

      <div className="home-footer-view" hidden={activeView === "virtual"}>
        {footer}
      </div>
    </div>
  );
}
