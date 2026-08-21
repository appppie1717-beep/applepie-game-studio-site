"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

type GameId = "mine-logic" | "velsien";
type ScreenId = "lobby" | "hint" | "training";

const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.applepie.minelogic";

const games: Array<{ id: GameId; label: string; state: string }> = [
  { id: "mine-logic", label: "MINE LOGIC", state: "출시됨" },
  { id: "velsien", label: "VELSIEN SUMMIT", state: "개발 중" },
];

const screens: Array<{
  id: ScreenId;
  index: string;
  title: string;
  description: string;
  src: string;
  alt: string;
}> = [
  {
    id: "lobby",
    index: "01",
    title: "게임 로비",
    description: "초급, 중급, 고급과 커스텀 보드에서 원하는 도전을 고릅니다.",
    src: "/images/mine-logic/06_lobby.png",
    alt: "MINE LOGIC의 난이도 선택 로비 화면",
  },
  {
    id: "hint",
    index: "02",
    title: "단계별 힌트",
    description: "막힌 순간에 필요한 논리를 단계별로 확인하며 다음 수를 찾습니다.",
    src: "/images/mine-logic/02_hint.png",
    alt: "초급·중급·고급으로 나뉜 MINE LOGIC 단계별 힌트 화면",
  },
  {
    id: "training",
    index: "03",
    title: "20단계 훈련",
    description: "기본 패턴부터 강화 훈련까지 순서대로 논리를 익힙니다.",
    src: "/images/mine-logic/03_training.png",
    alt: "일반훈련과 강화훈련으로 구성된 MINE LOGIC 20단계 훈련 화면",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function GameShowcase() {
  const [activeGame, setActiveGame] = useState<GameId>("mine-logic");
  const [activeScreen, setActiveScreen] = useState<ScreenId>("lobby");

  function moveGameTab(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (current + direction + games.length) % games.length;
    const nextGame = games[next].id;
    setActiveGame(nextGame);
    document.getElementById(`game-tab-${nextGame}`)?.focus();
  }

  function moveScreenTab(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (current + direction + screens.length) % screens.length;
    const nextScreen = screens[next].id;
    setActiveScreen(nextScreen);
    document.getElementById(`screen-tab-${nextScreen}`)?.focus();
  }

  return (
    <div className="game-showcase">
      <div className="project-tabs" role="tablist" aria-label="게임 선택">
        {games.map((game, index) => {
          const isActive = activeGame === game.id;
          return (
            <button
              id={`game-tab-${game.id}`}
              className={`project-tab${isActive ? " project-tab--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`game-panel-${game.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveGame(game.id)}
              onKeyDown={(event) => moveGameTab(event, index)}
              key={game.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{game.label}</strong>
              <small>{game.state}</small>
            </button>
          );
        })}
        <span
          className={`project-tab-indicator project-tab-indicator--${activeGame}`}
          aria-hidden="true"
        />
      </div>

      <article
        id="game-panel-mine-logic"
        className="featured-game interactive-panel"
        role="tabpanel"
        aria-labelledby="game-tab-mine-logic"
        hidden={activeGame !== "mine-logic"}
      >
        <div className="mine-visual mine-visual--interactive">
          <Image
            className="mine-feature"
            src="/images/mine-logic/feature.png"
            alt="푸른 지뢰찾기 보드 위의 붉은 깃발과 지뢰를 표현한 MINE LOGIC 대표 이미지"
            width={1024}
            height={500}
            sizes="(max-width: 1060px) 100vw, 56vw"
          />

          <div className="screen-explorer">
            <div className="screen-device" aria-live="polite">
              {screens.map((screen) => (
                <div
                  id={`screen-panel-${screen.id}`}
                  className="screen-panel"
                  role="tabpanel"
                  aria-labelledby={`screen-tab-${screen.id}`}
                  hidden={activeScreen !== screen.id}
                  key={screen.id}
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={1080}
                    height={1920}
                    sizes="(max-width: 620px) 45vw, 18vw"
                  />
                </div>
              ))}
              <span className="screen-count" aria-hidden="true">
                {screens.findIndex((screen) => screen.id === activeScreen) + 1} / {screens.length}
              </span>
            </div>

            <div className="screen-tabs" role="tablist" aria-label="MINE LOGIC 화면 선택">
              {screens.map((screen, index) => {
                const isActive = activeScreen === screen.id;
                return (
                  <button
                    id={`screen-tab-${screen.id}`}
                    className={`screen-tab${isActive ? " screen-tab--active" : ""}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`screen-panel-${screen.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveScreen(screen.id)}
                    onKeyDown={(event) => moveScreenTab(event, index)}
                    key={screen.id}
                  >
                    <span>{screen.index}</span>
                    <span>
                      <strong>{screen.title}</strong>
                      <small>{screen.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="game-copy">
          <div className="status-row">
            <span className="status status--released">출시작</span>
            <span className="platform">ANDROID · GOOGLE PLAY</span>
          </div>

          <div className="game-title-row">
            <Image
              className="game-icon"
              src="/images/mine-logic/icon.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              sizes="72px"
            />
            <div>
              <p className="game-index">APPLEPIE GAME 001</p>
              <h3 id="mine-logic-title">MINE LOGIC</h3>
            </div>
          </div>

          <p className="game-lead">
            단계별 힌트와 20단계 훈련, 클리어 카드를 갖춘 논리 중심
            지뢰찾기입니다.
          </p>
          <p className="game-description">
            기본 패턴부터 고급 논리까지 차근차근 익히고, 막히는 순간에는 단계별
            힌트로 다음 수를 찾아갑니다. 인터넷 연결 없이도 혼자서 집중해 즐길 수
            있습니다.
          </p>

          <ul className="tag-list" aria-label="MINE LOGIC 주요 특징">
            <li>논리 퍼즐</li>
            <li>20단계 훈련</li>
            <li>단계별 힌트</li>
            <li>오프라인</li>
          </ul>

          <a
            className="text-link text-link--light"
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Play에서 MINE LOGIC 보기 <Arrow />
          </a>
        </div>
      </article>

      <article
        id="game-panel-velsien"
        className="next-project next-project--interactive interactive-panel"
        role="tabpanel"
        aria-labelledby="game-tab-velsien"
        hidden={activeGame !== "velsien"}
      >
        <div className="next-copy">
          <div className="status-row">
            <span className="status status--development">개발 중</span>
            <span className="platform">2D STRATEGY GAME</span>
          </div>
          <p className="game-index">APPLEPIE GAME 002</p>
          <h3 id="velsien-title">
            VELSIEN SUMMIT
            <small>벨시엔 서밋</small>
          </h3>
          <p>
            캐릭터 수집과 편성, 스토리 전투를 결합한 2D 전략 게임을 개발하고
            있습니다. 새로운 소식은 이곳에서 차례로 전하겠습니다.
          </p>
          <span className="development-note">출시일과 플랫폼은 추후 공개</span>
        </div>

        <div className="strategy-board" aria-hidden="true">
          <div className="route-line route-line--one" />
          <div className="route-line route-line--two" />
          <span className="unit unit--one">01</span>
          <span className="unit unit--two">02</span>
          <span className="unit unit--three">03</span>
          <span className="board-label">TACTICAL FORMATION</span>
          <span className="board-status">BUILD IN PROGRESS</span>
        </div>
      </article>
    </div>
  );
}
