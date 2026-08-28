"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

type SceneId = "title" | "lobby" | "character";
type WorldId = "city" | "corporations" | "contractor" | "companions";
type PlayId = "contract" | "team" | "plan" | "battle";
type SignalDeckClassName =
  | "screenSection"
  | "sectionIntro"
  | "galleryShell"
  | "galleryTabs"
  | "galleryTab"
  | "galleryTabActive"
  | "galleryPanels"
  | "galleryPanel"
  | "galleryImage"
  | "worldSection"
  | "worldExplorer"
  | "worldTabs"
  | "worldTab"
  | "worldTabActive"
  | "worldPanels"
  | "worldPanel"
  | "worldCopy"
  | "playSection"
  | "playExplorer"
  | "playTabs"
  | "playTab"
  | "playTabActive"
  | "playPanels"
  | "playPanel"
  | "sharePanel"
  | "shareStatus";

type SignalDeckClasses = Record<SignalDeckClassName, string>;

const scenes: Array<{
  id: SceneId;
  index: string;
  tabLabel: string;
  title: string;
  description: string;
  src: string;
  srcSet: string;
  alt: string;
}> = [
  {
    id: "title",
    index: "01",
    tabLabel: "타이틀",
    title: "수직도시 벨시엔",
    description:
      "밝고 정돈된 도시의 전경과 작품 로고를 담은 타이틀 화면입니다. 도시의 정상으로 향하는 계약이라는 문장이 이야기의 출발점을 보여 줍니다.",
    src: "/images/velsien-summit/teaser-title.webp",
    srcSet:
      "/images/velsien-summit/teaser-title-640.webp 640w, /images/velsien-summit/teaser-title-960.webp 960w, /images/velsien-summit/teaser-title.webp 1600w",
    alt: "해 질 무렵의 미래 수직도시와 빛나는 고가도로가 펼쳐진 VELSIEN SUMMIT 타이틀 화면",
  },
  {
    id: "lobby",
    index: "02",
    tabLabel: "작전 로비",
    title: "계약과 작전 준비",
    description:
      "작전의 목적과 현재 상태를 확인하고, 함께할 동행자와 편성을 준비하는 로비 화면입니다. 하나의 계약은 여러 작전과 결과 정산으로 이어집니다.",
    src: "/images/velsien-summit/teaser-lobby.webp",
    srcSet:
      "/images/velsien-summit/teaser-lobby-640.webp 640w, /images/velsien-summit/teaser-lobby-960.webp 960w, /images/velsien-summit/teaser-lobby.webp 1600w",
    alt: "미래 도시 위로 작전 정보와 현재 동행자 초상이 겹쳐진 VELSIEN SUMMIT 로비 화면",
  },
  {
    id: "character",
    index: "03",
    tabLabel: "동행자",
    title: "동행자와 행동 구성",
    description:
      "동행자의 역할과 현재 행동 정보를 살펴보는 상세 화면입니다. 각 동행자의 쓰임과 행동 타이밍을 읽고 다음 작전에 맞는 팀을 구성합니다.",
    src: "/images/velsien-summit/teaser-character.webp",
    srcSet:
      "/images/velsien-summit/teaser-character-640.webp 640w, /images/velsien-summit/teaser-character-960.webp 960w, /images/velsien-summit/teaser-character.webp 1600w",
    alt: "방패형 장비를 든 동행자와 역할 및 행동 정보가 표시된 VELSIEN SUMMIT 상세 화면",
  },
];

const worldTopics: Array<{
  id: WorldId;
  index: string;
  label: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  facts: readonly string[];
}> = [
  {
    id: "city",
    index: "01",
    label: "도시",
    eyebrow: "VERTICAL CITY",
    title: "기술이 너무 잘 작동하는 도시",
    paragraphs: [
      "벨시엔은 폐허가 된 미래도시가 아닙니다. 인간형 AI와 자동화가 일상의 대부분을 맡고, 거리와 시설은 밝고 깨끗하게 유지됩니다.",
      "이 도시에서 높이는 단순한 위치가 아닙니다. 주거 수준과 보안, 최신 기술에 접근할 수 있는 권한과 사회적 영향력이 도시의 층과 함께 달라집니다.",
    ],
    facts: ["초거대 수직도시", "자동화된 풍요", "높이와 권력이 맞물린 구조"],
  },
  {
    id: "corporations",
    index: "02",
    label: "세 기업",
    eyebrow: "THREE CORPORATIONS",
    title: "사람의 생활 전체를 두고 경쟁하는 기업들",
    paragraphs: [
      "세 초거대 기업은 물건만 파는 회사가 아닙니다. 주거와 의료, 이동과 통신, 신체 기술과 오락까지 한 사람의 생활 전체를 서비스합니다.",
      "시민에게 기업의 생태계는 실제로 편리하고 안전한 선택입니다. 다만 어떤 기업을 고르는지는 곧 자신의 생활과 데이터, 미래가 어디에 속할지를 고르는 일이 됩니다.",
    ],
    facts: ["생활 전반을 묶는 서비스", "서로를 견제하는 세 권력", "편리함과 소속의 대가"],
  },
  {
    id: "contractor",
    index: "03",
    label: "계약자",
    eyebrow: "INDEPENDENT CONTRACTOR",
    title: "어디에도 속하지 않았기에 필요한 사람",
    paragraphs: [
      "대부분의 시민이 한 기업의 생태계 안에서 살아가는 동안, 플레이어는 어느 기업에도 평생을 맡기지 않은 독립 계약자입니다.",
      "한 기업이 직접 움직이면 충돌이 될 회수, 호송, 경비와 조사를 대신 맡습니다. 작은 의뢰로 시작한 계약은 점차 도시의 더 높은 이해관계로 이어집니다.",
    ],
    facts: ["세 기업 모두와 계약 가능", "회수·호송·경비·조사", "작은 의뢰에서 시작하는 성장"],
  },
  {
    id: "companions",
    index: "04",
    label: "동행자",
    eyebrow: "HUMANOID AI",
    title: "서로 다른 과거를 가진 계약팀",
    paragraphs: [
      "인간형 AI는 의료와 운송, 연구와 경호처럼 도시 곳곳에서 일하는 익숙한 존재입니다. 모두가 같은 이유로 만들어졌거나 같은 방식으로 플레이어를 따르지는 않습니다.",
      "서로 다른 제조 배경과 원래 용도, 과거 계약을 가진 동행자를 확보해 팀을 만듭니다. 누구를 함께 데려가고 어떤 역할을 맡길지가 작전의 선택지를 바꿉니다.",
    ],
    facts: ["다양한 출신과 원래 용도", "계약으로 구성하는 팀", "편성에 따라 달라지는 작전"],
  },
];

const playSteps: Array<{
  id: PlayId;
  index: string;
  label: string;
  title: string;
  description: string;
  detail: string;
}> = [
  {
    id: "contract",
    index: "01",
    label: "계약 확인",
    title: "무엇을 해결할지 먼저 읽습니다",
    description:
      "회수, 호송, 경비와 조사처럼 목적이 다른 계약에서 다음 작전을 고릅니다. 의뢰의 배경과 위험을 확인해야 어떤 팀이 필요한지 판단할 수 있습니다.",
    detail: "계약 선택 → 작전 브리핑",
  },
  {
    id: "team",
    index: "02",
    label: "팀 편성",
    title: "계약에 맞는 동행자를 고릅니다",
    description:
      "보유한 인간형 AI 가운데 작전에 나설 동행자를 고릅니다. 서로 다른 역할과 행동을 조합해 한 팀 안에서 맡을 자리를 정합니다.",
    detail: "동행자 선택 → 역할 조합",
  },
  {
    id: "plan",
    index: "03",
    label: "전투 설계",
    title: "배치와 누가 먼저 움직일지 정합니다",
    description:
      "누구를 어느 위치에 둘지, 누가 먼저 움직이게 할지 전투 전에 정합니다. 행동에 걸리는 시간과 기본 타겟 규칙 때문에 같은 팀도 배치와 순서에 따라 흐름이 달라집니다.",
    detail: "진형 배치 → 행동 타이밍 조정",
  },
  {
    id: "battle",
    index: "04",
    label: "자동 전투",
    title: "준비한 순서와 규칙대로 전투가 진행됩니다",
    description:
      "전투가 시작되면 동행자들은 미리 정한 행동과 타겟 규칙에 따라 자동으로 싸웁니다. 결과와 전투 기록을 확인한 뒤 편성과 행동 구성을 다시 다듬어 다음 작전을 준비합니다.",
    detail: "자동 전투 → 결과 확인 → 재설계",
  },
];

function getNextIndex(
  key: string,
  current: number,
  length: number,
): number | null {
  if (key === "Home") return 0;
  if (key === "End") return length - 1;
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (current + 1) % length;
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (current - 1 + length) % length;
  }
  return null;
}

function focusAt(
  refs: RefObject<Array<HTMLButtonElement | null>>,
  index: number,
) {
  refs.current[index]?.focus();
}

export function VelsienSignalDeck({
  classes,
}: {
  classes: SignalDeckClasses;
}) {
  const [activeScene, setActiveScene] = useState<SceneId>("lobby");
  const [activeWorld, setActiveWorld] = useState<WorldId>("city");
  const [activePlay, setActivePlay] = useState<PlayId>("contract");
  const [shareStatus, setShareStatus] = useState("");
  const sceneRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const worldRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const playRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveTab<T extends string>(
    event: KeyboardEvent<HTMLButtonElement>,
    current: number,
    items: ReadonlyArray<{ id: T }>,
    setActive: (id: T) => void,
    refs: RefObject<Array<HTMLButtonElement | null>>,
  ) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") return;
    const next = getNextIndex(event.key, current, items.length);
    if (next === null) return;
    event.preventDefault();
    setActive(items[next].id);
    focusAt(refs, next);
  }

  async function sharePage() {
    const canonicalUrl = "https://ersiyan.com/velsien-summit";
    const shareData = {
      title: "VELSIEN SUMMIT(벨시엔 서밋) | 모바일 수집형 2D SRPG",
      text: "ERSIYAN이 만들고 있는 모바일 수집형 2D SRPG, 벨시엔 서밋을 소개합니다.",
      url: canonicalUrl,
    };

    setShareStatus("");

    try {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setShareStatus("공유 창을 열었습니다.");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }

      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(canonicalUrl);
      setShareStatus("링크를 복사했습니다.");
    } catch {
      setShareStatus("주소창에서 링크를 복사해 주세요.");
    }
  }

  return (
    <>
      <section
        id="screens"
        className={classes.screenSection}
        aria-labelledby="screens-title"
      >
        <div className={classes.sectionIntro}>
          <p>DEVELOPMENT SCREENS · 03</p>
          <h2 id="screens-title">실제 개발 화면</h2>
          <span>
            타이틀뿐 아니라 작전을 준비하고 동행자를 살펴보는 실제 화면도 볼 수 있습니다. 이름과 개발 수치는 공개용 이미지에서 일부 흐리게 처리했습니다.
          </span>
        </div>

        <div className={classes.galleryShell}>
          <div
            className={classes.galleryTabs}
            role="tablist"
            aria-label="개발 중 화면 선택"
            aria-orientation="horizontal"
          >
            {scenes.map((scene, index) => {
              const isActive = activeScene === scene.id;
              return (
                <button
                  id={`scene-tab-${scene.id}`}
                  className={isActive ? classes.galleryTabActive : classes.galleryTab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`scene-panel-${scene.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveScene(scene.id)}
                  onKeyDown={(event) =>
                    moveTab(event, index, scenes, setActiveScene, sceneRefs)
                  }
                  ref={(element) => {
                    sceneRefs.current[index] = element;
                  }}
                  key={scene.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scene.src}
                    srcSet={scene.srcSet}
                    sizes="160px"
                    alt=""
                    width={1600}
                    height={720}
                    loading="lazy"
                  />
                  <span>
                    <small>{scene.index}</small>
                    <strong>{scene.tabLabel}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <div className={classes.galleryPanels}>
            {scenes.map((scene) => (
              <figure
                id={`scene-panel-${scene.id}`}
                className={classes.galleryPanel}
                role="tabpanel"
                aria-labelledby={`scene-tab-${scene.id}`}
                tabIndex={0}
                hidden={activeScene !== scene.id}
                key={scene.id}
              >
                <div className={classes.galleryImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scene.src}
                    srcSet={scene.srcSet}
                    sizes="(max-width: 1060px) calc(100vw - 36px), 64vw"
                    alt={scene.alt}
                    width={1600}
                    height={720}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <span>{scene.index} · DEVELOPMENT BUILD</span>
                  <strong>{scene.title}</strong>
                  <p>{scene.description}</p>
                  <small>
                    개발 중 화면이며 UI, 문구와 수치는 최종 버전에서 달라질 수 있습니다.
                  </small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        id="world"
        className={classes.worldSection}
        aria-labelledby="world-title"
      >
        <div className={classes.sectionIntro}>
          <p>WORLD OF VELSIEN</p>
          <h2 id="world-title">벨시엔이라는 도시</h2>
          <span>
            도시가 왜 아름답고 불편한지, 그리고 플레이어가 왜 필요한지만 먼저 소개합니다.
          </span>
        </div>

        <div className={classes.worldExplorer}>
          <div
            className={classes.worldTabs}
            role="tablist"
            aria-label="벨시엔 세계관 주제 선택"
            aria-orientation="horizontal"
          >
            {worldTopics.map((topic, index) => {
              const isActive = activeWorld === topic.id;
              return (
                <button
                  id={`world-tab-${topic.id}`}
                  className={isActive ? classes.worldTabActive : classes.worldTab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`world-panel-${topic.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveWorld(topic.id)}
                  onKeyDown={(event) =>
                    moveTab(event, index, worldTopics, setActiveWorld, worldRefs)
                  }
                  ref={(element) => {
                    worldRefs.current[index] = element;
                  }}
                  key={topic.id}
                >
                  <span>{topic.index}</span>
                  <strong>{topic.label}</strong>
                </button>
              );
            })}
          </div>

          <div className={classes.worldPanels}>
            {worldTopics.map((topic) => (
              <article
                id={`world-panel-${topic.id}`}
                className={classes.worldPanel}
                role="tabpanel"
                aria-labelledby={`world-tab-${topic.id}`}
                tabIndex={0}
                hidden={activeWorld !== topic.id}
                key={topic.id}
              >
                <p>{topic.eyebrow}</p>
                <h3>{topic.title}</h3>
                <div className={classes.worldCopy}>
                  {topic.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <ul aria-label={`${topic.label} 핵심 정보`}>
                  {topic.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="play"
        className={classes.playSection}
        aria-labelledby="play-title"
      >
        <div className={classes.sectionIntro}>
          <p>HOW IT PLAYS</p>
          <h2 id="play-title">전투는 준비에서 갈립니다</h2>
          <span>
            손이 빠른 것보다 계약을 읽고, 팀과 진형, 첫 행동 타이밍을 준비하는 판단이 중요합니다.
          </span>
        </div>

        <div className={classes.playExplorer}>
          <div
            className={classes.playTabs}
            role="tablist"
            aria-label="게임 진행 단계 선택"
            aria-orientation="horizontal"
          >
            {playSteps.map((step, index) => {
              const isActive = activePlay === step.id;
              return (
                <button
                  id={`play-tab-${step.id}`}
                  className={isActive ? classes.playTabActive : classes.playTab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`play-panel-${step.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActivePlay(step.id)}
                  onKeyDown={(event) =>
                    moveTab(event, index, playSteps, setActivePlay, playRefs)
                  }
                  ref={(element) => {
                    playRefs.current[index] = element;
                  }}
                  key={step.id}
                >
                  <span>{step.index}</span>
                  <strong>{step.label}</strong>
                </button>
              );
            })}
          </div>

          <div className={classes.playPanels}>
            {playSteps.map((step) => (
              <article
                id={`play-panel-${step.id}`}
                className={classes.playPanel}
                role="tabpanel"
                aria-labelledby={`play-tab-${step.id}`}
                tabIndex={0}
                hidden={activePlay !== step.id}
                key={step.id}
              >
                <span>{step.index} / 04</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <strong>{step.detail}</strong>
              </article>
            ))}
          </div>
        </div>

      </section>

      <section className={classes.sharePanel} aria-labelledby="share-title">
        <div>
          <p>SHARE</p>
          <h2 id="share-title">벨시엔 서밋을 궁금해할 사람에게 보내세요.</h2>
        </div>
        <button type="button" onClick={sharePage}>
          페이지 공유하기 <span aria-hidden="true">↗</span>
        </button>
        <p
          className={classes.shareStatus}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {shareStatus}
        </p>
      </section>
    </>
  );
}
