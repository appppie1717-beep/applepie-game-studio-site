"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

type GameId = "mine-logic" | "velsien";
type ScreenId = "lobby" | "hint" | "training";
type VelsienMode = "scenes" | "world";
type VelsienSceneId = "title" | "lobby" | "character";

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
    description: "난이도와 보드 크기를 고르고 바로 시작합니다.",
    src: "/images/mine-logic/06_lobby.png",
    alt: "MINE LOGIC의 난이도 선택 로비 화면",
  },
  {
    id: "hint",
    index: "02",
    title: "단계별 힌트",
    description: "막힌 곳에서 힌트를 한 단계씩 열어 봅니다.",
    src: "/images/mine-logic/02_hint.png",
    alt: "초급·중급·고급으로 나뉜 MINE LOGIC 단계별 힌트 화면",
  },
  {
    id: "training",
    index: "03",
    title: "20단계 훈련",
    description: "20단계 문제를 순서대로 풀며 기본 패턴을 익힙니다.",
    src: "/images/mine-logic/03_training.png",
    alt: "일반훈련과 강화훈련으로 구성된 MINE LOGIC 20단계 훈련 화면",
  },
];

const velsienModes: Array<{ id: VelsienMode; label: string }> = [
  { id: "scenes", label: "개발 화면" },
  { id: "world", label: "세계관 신호" },
];

const velsienScenes: Array<{
  id: VelsienSceneId;
  index: string;
  label: string;
  title: string;
  src: string;
  srcSet: string;
  alt: string;
}> = [
  {
    id: "title",
    index: "01",
    label: "TITLE",
    title: "도시의 시작",
    src: "/images/velsien-summit/teaser-title.webp",
    srcSet:
      "/images/velsien-summit/teaser-title-640.webp 640w, /images/velsien-summit/teaser-title-960.webp 960w, /images/velsien-summit/teaser-title.webp 1600w",
    alt: "밝은 미래 도시와 VELSIEN SUMMIT 로고가 보이는 개발 중 타이틀 화면",
  },
  {
    id: "lobby",
    index: "02",
    label: "CURRENT OPERATION",
    title: "현재 작전",
    src: "/images/velsien-summit/teaser-lobby.webp",
    srcSet:
      "/images/velsien-summit/teaser-lobby-640.webp 640w, /images/velsien-summit/teaser-lobby-960.webp 960w, /images/velsien-summit/teaser-lobby.webp 1600w",
    alt: "VELSIEN SUMMIT의 개발 중 현재 작전 로비 화면",
  },
  {
    id: "character",
    index: "03",
    label: "CHARACTER ARCHIVE",
    title: "동행자 보관함",
    src: "/images/velsien-summit/teaser-character.webp",
    srcSet:
      "/images/velsien-summit/teaser-character-640.webp 640w, /images/velsien-summit/teaser-character-960.webp 960w, /images/velsien-summit/teaser-character.webp 1600w",
    alt: "VELSIEN SUMMIT의 개발 중 캐릭터 보관함 화면",
  },
];

const worldFiles = [
  {
    index: "01",
    signal: "VERTICAL CITY",
    title: "도시의 정상으로 향하는 계약",
    description: "도시의 정상에 가려면 계약부터 받아야 합니다.",
  },
  {
    index: "02",
    signal: "NEUTRAL CONTRACTOR",
    title: "어느 기업에도 묶이지 않은 계약자",
    description:
      "당신은 평생계약을 거절했습니다. 어느 기업의 장치도 몸에 넣지 않은 채 중립으로 남았습니다.",
  },
  {
    index: "03",
    signal: "THREE CHANNELS",
    title: "세 개의 기업 채널",
    description:
      "세 기업은 직접 나서지 않습니다. 대신 중립인 당신에게 각자의 일을 맡깁니다.",
  },
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function nextTabIndex(key: string, current: number, length: number) {
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "ArrowRight") return (current + 1) % length;
  if (key === "ArrowLeft") return (current - 1 + length) % length;
  return null;
}

export function GameShowcase() {
  const [activeGame, setActiveGame] = useState<GameId>("mine-logic");
  const [activeScreen, setActiveScreen] = useState<ScreenId>("lobby");
  const [activeVelsienMode, setActiveVelsienMode] =
    useState<VelsienMode>("scenes");
  const [activeVelsienScene, setActiveVelsienScene] =
    useState<VelsienSceneId>("title");

  function moveGameTab(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const next = nextTabIndex(event.key, current, games.length);
    if (next === null) return;
    event.preventDefault();
    const nextGame = games[next].id;
    setActiveGame(nextGame);
    document.getElementById(`game-tab-${nextGame}`)?.focus();
  }

  function moveScreenTab(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const next = nextTabIndex(event.key, current, screens.length);
    if (next === null) return;
    event.preventDefault();
    const nextScreen = screens[next].id;
    setActiveScreen(nextScreen);
    document.getElementById(`screen-tab-${nextScreen}`)?.focus();
  }

  function moveVelsienMode(
    event: KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) {
    const next = nextTabIndex(event.key, current, velsienModes.length);
    if (next === null) return;
    event.preventDefault();
    const nextMode = velsienModes[next].id;
    setActiveVelsienMode(nextMode);
    document.getElementById(`velsien-mode-tab-${nextMode}`)?.focus();
  }

  function moveVelsienScene(
    event: KeyboardEvent<HTMLButtonElement>,
    current: number,
  ) {
    const next = nextTabIndex(event.key, current, velsienScenes.length);
    if (next === null) return;
    event.preventDefault();
    const nextScene = velsienScenes[next].id;
    setActiveVelsienScene(nextScene);
    document.getElementById(`velsien-scene-${nextScene}`)?.focus();
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
              <p className="game-index">ERSIYAN GAME 001</p>
              <h3 id="mine-logic-title">MINE LOGIC</h3>
            </div>
          </div>

          <p className="game-lead">
            MINE LOGIC에는 단계별 힌트와 20단계 훈련이 들어 있습니다.
          </p>
          <p className="game-description">
            지뢰찾기가 처음이라면 20단계 훈련부터 시작하면 됩니다. 막히는 곳은
            힌트로 다음 수를 볼 수 있고, 인터넷 연결 없이도 플레이할 수 있습니다.
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
            <span className="platform">MOBILE · COLLECTIBLE · 2D SRPG</span>
          </div>
          <p className="game-index">ERSIYAN GAME 002</p>
          <h3 id="velsien-title">
            VELSIEN SUMMIT
            <small>벨시엔 서밋</small>
          </h3>
          <p>
            캐릭터를 모아 팀을 짜고, 행동 순서를 보며 싸우는 모바일 2D
            SRPG입니다. 아직 만드는 중이라 지금 보여드릴 수 있는 화면만 조금
            올렸습니다.
          </p>
          <ul className="development-tags" aria-label="VELSIEN SUMMIT 장르">
            <li>모바일</li>
            <li>수집형</li>
            <li>2D SRPG</li>
          </ul>
          <span className="development-note">
            아직 개발 중이라 출시할 때 화면이 바뀔 수 있습니다.
          </span>
          <a className="text-link" href="/velsien-summit">
            VELSIEN SUMMIT 자세히 보기 <Arrow />
          </a>
        </div>

        <div
          className="velsien-experience"
          aria-label="VELSIEN SUMMIT 개발 자료 미리보기"
        >
          <div className="velsien-experience__header">
            <div>
              <span>SNEAK PEEK</span>
              <strong>DEV LOG · 001</strong>
            </div>
            <div
              className="velsien-mode-tabs"
              role="tablist"
              aria-label="벨시엔 미리보기 종류"
            >
              {velsienModes.map((mode, index) => {
                const isActive = activeVelsienMode === mode.id;
                return (
                  <button
                    id={`velsien-mode-tab-${mode.id}`}
                    className={`velsien-mode-tab${isActive ? " velsien-mode-tab--active" : ""}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`velsien-mode-panel-${mode.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveVelsienMode(mode.id)}
                    onKeyDown={(event) => moveVelsienMode(event, index)}
                    key={mode.id}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="velsien-mode-panel-scenes"
            className="velsien-mode-panel"
            role="tabpanel"
            aria-labelledby="velsien-mode-tab-scenes"
            hidden={activeVelsienMode !== "scenes"}
          >
            <div
              className={`velsien-scene-gallery velsien-scene-gallery--${activeVelsienScene}`}
              aria-label="벨시엔 개발 화면 선택"
            >
              {velsienScenes.map((scene, index) => {
                const isActive = activeVelsienScene === scene.id;
                return (
                  <button
                    id={`velsien-scene-${scene.id}`}
                    className={`velsien-scene-card${isActive ? " velsien-scene-card--active" : ""}`}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${scene.title} 화면 크게 보기`}
                    onClick={() => setActiveVelsienScene(scene.id)}
                    onKeyDown={(event) => moveVelsienScene(event, index)}
                    key={scene.id}
                  >
                    {/* 정적 배포에서도 작은 화면에는 작은 후보만 전송합니다. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={scene.src}
                      srcSet={scene.srcSet}
                      alt={scene.alt}
                      width={1600}
                      height={720}
                      sizes="(max-width: 620px) 92vw, (max-width: 1060px) 76vw, 42vw"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="velsien-scene-card__copy">
                      <small>{scene.index}</small>
                      <strong>{scene.label}</strong>
                      <span>{scene.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="velsien-experience__foot" aria-hidden="true">
              <span>SELECT A SCENE</span>
              <span>WORK IN PROGRESS</span>
            </div>
          </div>

          <div
            id="velsien-mode-panel-world"
            className="velsien-mode-panel velsien-world"
            role="tabpanel"
            aria-labelledby="velsien-mode-tab-world"
            hidden={activeVelsienMode !== "world"}
          >
            <div className="velsien-world__intro">
              <p>WORLD FILE // PUBLIC ACCESS 03%</p>
              <h4>지금 공개할 수 있는 설정은 여기까지입니다.</h4>
            </div>
            <ol className="world-files">
              {worldFiles.map((file) => (
                <li className="world-file" key={file.index}>
                  <span className="world-file__index">{file.index}</span>
                  <div>
                    <small>{file.signal}</small>
                    <strong>{file.title}</strong>
                    <p>{file.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="velsien-world__locked" aria-hidden="true">
              MORE DATA LOCKED UNTIL NEXT DEV LOG
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
