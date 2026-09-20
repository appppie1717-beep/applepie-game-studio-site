"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import styles from "./virenta.module.css";

export type VirentaCompany = "orysen" | "neryx";

export type VirentaExperienceProps = {
  onSwitch?: (company: VirentaCompany) => void;
};

type AxisKey = "beauty" | "body" | "sense" | "relation" | "experience";

type Axis = {
  id: AxisKey;
  ko: string;
  color: string;
  soft: string;
  noun: string;
  low: string;
  high: string;
  unit: string;
  description: string;
  recommendation: string;
  gentleRecommendation: string;
  result: string;
};

const axes: Axis[] = [
  {
    id: "beauty",
    ko: "아름다움",
    color: "#ee8d73",
    soft: "#ffe2d7",
    noun: "형태와 표정",
    low: "있는 그대로",
    high: "새로운 인상",
    unit: "형태 선호",
    description: "얼굴, 피부, 실루엣에서 원하는 인상의 방향을 조절합니다.",
    recommendation: "빛의 온도를 낮춘 표정 교정 세션",
    gentleRecommendation: "현재 인상을 살리는 낮은 강도의 조명",
    result: "부드러운 윤곽과 낮은 채도의 스타일",
  },
  {
    id: "body",
    ko: "몸",
    color: "#e8bf73",
    soft: "#f8edc7",
    noun: "회복과 리듬",
    low: "천천히 회복",
    high: "더 오래 움직임",
    unit: "신체 리듬",
    description: "회복과 움직임 중 오늘 더 중시할 리듬을 정합니다.",
    recommendation: "수면 후 22분 근육 회복 프로토콜",
    gentleRecommendation: "수면 시간을 우선하는 회복 일정",
    result: "회복을 먼저 두는 낮은 자극의 하루",
  },
  {
    id: "sense",
    ko: "감각",
    color: "#70c9ba",
    soft: "#d9f3eb",
    noun: "자극과 여백",
    low: "고요한 표면",
    high: "강한 몰입",
    unit: "감각 밀도",
    description: "소리, 향, 빛, 촉감에 대한 반응의 폭을 조절합니다.",
    recommendation: "수면 잔향을 지우는 투명한 향의 방",
    gentleRecommendation: "소리와 빛을 줄인 조용한 휴식실",
    result: "청각과 촉각 사이에 여백을 남긴 환경",
  },
  {
    id: "relation",
    ko: "관계",
    color: "#ac91dc",
    soft: "#eee7ff",
    noun: "거리와 친밀도",
    low: "나만의 거리",
    high: "깊은 연결",
    unit: "연결 선호",
    description: "누구와 얼마만큼 가까워질지, 관계의 속도를 다시 맞춥니다.",
    recommendation: "비슷한 호흡을 가진 두 사람의 저녁 산책",
    gentleRecommendation: "알림을 줄이고 혼자 보내는 저녁",
    result: "대화의 공백까지 존중하는 관계 경로",
  },
  {
    id: "experience",
    ko: "경험",
    color: "#7d9be5",
    soft: "#e1ebff",
    noun: "기억과 장면",
    low: "익숙한 하루",
    high: "처음의 감각",
    unit: "새로움 선호",
    description: "기억에 남기고 싶은 장면의 밀도와 낯섦을 선택합니다.",
    recommendation: "상부 지구의 빛을 기록하는 새벽 이동",
    gentleRecommendation: "익숙한 길을 천천히 다시 걷기",
    result: "아직 이름 붙이지 않은 장면을 향한 경로",
  },
];

const initialValues: Record<AxisKey, number> = {
  beauty: 62,
  body: 74,
  sense: 48,
  relation: 55,
  experience: 68,
};

const profiles: { id: string; label: string; detail: string; image: string; values: Record<AxisKey, number> }[] = [
  { id: "l", label: "루에나 하벨", detail: "프로필 03 · 중립 허브 안내 AI", image: "/images/velsien-summit/secret/luena-havel-400.webp", values: initialValues },
  { id: "p", label: "피아 모렐", detail: "프로필 07 · 감각 계약", image: "/images/velsien-summit/secret/pia-morel-400.webp", values: { beauty: 78, body: 58, sense: 83, relation: 49, experience: 72 } },
  { id: "n", label: "니카 오렌", detail: "프로필 12 · 관계 편집", image: "/images/velsien-summit/secret/nika-oren-400.webp", values: { beauty: 44, body: 65, sense: 51, relation: 86, experience: 61 } },
];

function getLevel(value: number) {
  if (value < 34) return "낮음";
  if (value < 67) return "중간";
  return "높음";
}

function getWaveHeight(index: number, value: number, axisIndex: number) {
  const wave = Math.sin(index * 0.72 + axisIndex * 1.3) * 18;
  const pulse = Math.sin(index * 1.57 + value / 22) * 10;
  return Math.round(Math.max(13, Math.min(93, 37 + value * 0.42 + wave + pulse)) * 100) / 100;
}

function AxisIcon({ axis }: { axis: AxisKey }) {
  return (
    <span className={`${styles.axisIcon} ${styles[`icon${axis}`]}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function VirentaExperience({ onSwitch }: VirentaExperienceProps) {
  const [activeAxis, setActiveAxis] = useState<AxisKey>("sense");
  const [values, setValues] = useState(initialValues);
  const [profile, setProfile] = useState("l");
  const [showContract, setShowContract] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const conciergeRef = useRef<HTMLElement>(null);
  const conciergeCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showConcierge) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    conciergeCloseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowConcierge(false);
        return;
      }
      if (event.key !== "Tab" || !conciergeRef.current) return;
      const focusable = Array.from(conciergeRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [showConcierge]);

  const active = axes.find((axis) => axis.id === activeAxis) ?? axes[0];
  const activeIndex = axes.findIndex((axis) => axis.id === activeAxis);
  const value = values[activeAxis];
  const profileScore = Math.round(Object.values(values).reduce((sum, current) => sum + current, 0) / axes.length);
  const profileData = profiles.find((item) => item.id === profile) ?? profiles[0];
  const level = getLevel(value);
  const toneStyle = { "--active-tone": active.color, "--active-soft": active.soft } as CSSProperties;

  const signals = useMemo(
    () => axes.map((axis) => ({ ...axis, value: values[axis.id], level: getLevel(values[axis.id]) })),
    [values],
  );

  const recommendations = useMemo(() => {
    const sorted = [...signals].sort((a, b) => b.value - a.value);
    return sorted.slice(0, 3).map((axis, index) => ({
      ...axis,
      rank: index + 1,
      title: axis.value >= 67 ? axis.recommendation : axis.gentleRecommendation,
    }));
  }, [signals]);

  const updateValue = (next: number) => {
    setValues((current) => ({ ...current, [activeAxis]: next }));
  };

  return (
    <div className={styles.experience} style={toneStyle}>
      <a className={styles.skipLink} href="#virenta-main">본문으로 바로가기</a>

      <header className={styles.header}>
        <div className={styles.brandLockup}>
          <Image src="/virenta-logo.png" alt="" width={50} height={42} priority />
          <div>
            <strong>VIRENTA</strong>
            <span>비렌타 생활 편집국</span>
          </div>
        </div>
        <div className={styles.headerStatus}>
          <span className={styles.liveSignal}><i /> 개인화 체험 중</span>
          <span>벨시엔 상부 지구 · 2187</span>
          <button type="button" onClick={() => setShowConcierge(true)}>개인화 안내 <b>↗</b></button>
        </div>
      </header>

      <main id="virenta-main">
        <section className={styles.instrument} aria-labelledby="instrument-title">
          <aside className={styles.instrumentAside}>
            <div className={styles.editionStamp}>
              <span>V / 03</span>
              <i />
              <span>개인 생활 시스템</span>
            </div>
            <p className={styles.eyebrow}>비렌타 생활 편집기</p>
            <h1 id="instrument-title">원하는 삶을<br /><em>조정하세요.</em></h1>
            <p className={styles.intro}>표정, 회복, 감각, 관계, 경험. 다섯 가지 생활 축을 움직여 지금 원하는 하루의 모습을 확인해 보세요.</p>
            <div className={styles.profileChooser} aria-label="생활 프로필 선택">
              <div className={styles.chooserHead}><span>체험용 인물 프로필</span><b>평균 설정값 {profileScore}</b></div>
              <div className={styles.profileStack}>
                {profiles.map((item) => (
                  <button
                    className={`${styles.profileChip} ${profile === item.id ? styles.profileChipActive : ""}`}
                    key={item.id}
                    type="button"
                    onClick={() => { setProfile(item.id); setValues({ ...item.values }); }}
                    aria-pressed={profile === item.id}
                  >
                    <Image src={item.image} alt="" width={34} height={48} />
                    <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                    {profile === item.id && <b className={styles.checkMark}>✓</b>}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.privacyNote}><span>◎</span> 이 체험의 조정값은 화면에만 반영됩니다.</div>
          </aside>

          <div className={styles.editorSurface}>
            <div className={styles.surfaceTopline}>
              <span>생활 편집 미리보기 / {profileData.label}</span>
              <span className={styles.surfaceActions}><span><i className={styles.pulseDot} /> 선택에 따라 갱신</span><span className={styles.sessionNote}>저장되지 않는 체험</span></span>
            </div>
            <nav className={styles.axisTabs} aria-label="욕구 축 선택">
              {axes.map((axis) => (
                <button
                  className={activeAxis === axis.id ? styles.axisTabActive : ""}
                  key={axis.id}
                  type="button"
                  onClick={() => setActiveAxis(axis.id)}
                  aria-pressed={activeAxis === axis.id}
                  style={{ "--tab-tone": axis.color } as CSSProperties}
                >
                  <AxisIcon axis={axis.id} />
                  <span>{axis.ko}</span>
                  <small>{axis.unit}</small>
                </button>
              ))}
            </nav>

            <div className={styles.editorGrid}>
              <section className={styles.tuningPanel} aria-labelledby="tuning-title">
                <div className={styles.panelCode}><span>입력값 01</span><span>축 {String(activeIndex + 1).padStart(2, "0")} / 05</span></div>
                <div className={styles.axisTitleLine}>
                  <AxisIcon axis={active.id} />
                  <div><p>{active.unit}</p><h2 id="tuning-title">{active.ko}</h2></div>
                </div>
                <p className={styles.axisDescription}>{active.description}</p>
                <div className={styles.rangeReadout}>
                  <div><span>현재 강도</span><strong>{value}</strong><small>/ 100</small></div>
                  <em>{level}</em>
                </div>
                <label className={styles.rangeControl}>
                  <span className={styles.visuallyHidden}>{active.ko} 강도 조절</span>
                  <input type="range" min="0" max="100" value={value} onChange={(event) => updateValue(Number(event.target.value))} style={{ "--range-value": `${value}%` } as CSSProperties} />
                  <span className={styles.rangeTicks} aria-hidden="true"><i /><i /><i /><i /><i /></span>
                </label>
                <div className={styles.rangeLabels}><span>{active.low}</span><span>{active.high}</span></div>
                <div className={styles.tuningMeta}><span>{active.unit}</span><b>체험용 설정값</b></div>
              </section>

              <section className={styles.previewPanel} aria-labelledby="preview-title">
                <div className={styles.previewHeader}><span>감각 파형 / {active.ko}</span><span className={styles.previewLive}>미리보기</span></div>
                <div className={styles.waveField} aria-label={`${active.ko} 선택값 파형`}>
                  <div className={styles.waveGrid} aria-hidden="true" />
                  <div className={styles.waveBars} aria-hidden="true">
                    {Array.from({ length: 28 }, (_, index) => <i key={index} style={{ height: `${getWaveHeight(index, value, activeIndex)}%`, animationDelay: `${index * 31}ms` }} />)}
                  </div>
                  <div className={styles.waveLabel}><span>현재의 {active.noun}</span><strong>{value > 66 ? "확장" : value > 33 ? "조율" : "완화"}</strong></div>
                </div>
                <div className={styles.previewCopy}>
                  <span>비렌타 추천 예시</span>
                  <h2 id="preview-title">{active.result}</h2>
                  <p>현재 선택한 축과 강도를 바탕으로 보여주는 체험용 장면입니다.</p>
                </div>
                <div className={styles.previewFooter}><span><i /> {active.ko} 설정값</span><b>{value} / 100</b></div>
              </section>
            </div>
          </div>
        </section>

        <section className={styles.readoutSection} aria-labelledby="readout-title">
          <div className={styles.readoutLead}>
            <div className={styles.sectionCode}>02 / 프로필 판독</div>
            <h2 id="readout-title">당신의 선택이<br /><em>다음 장면이 됩니다.</em></h2>
            <p>다섯 축을 한눈에 비교하고, 가장 높게 둔 선택부터 추천 예시를 보여줍니다.</p>
            <div className={styles.scoreDial}>
              <div><strong>{profileScore}</strong><span>평균 설정값</span></div>
              <i style={{ transform: `rotate(${profileScore * 3.6}deg)` }} />
            </div>
          </div>
          <div className={styles.signalLedger}>
            <div className={styles.ledgerHead}><span>생활 신호 장부</span><span>각 축의 현재값</span></div>
            {signals.map((signal) => (
              <button className={`${styles.ledgerRow} ${activeAxis === signal.id ? styles.ledgerRowActive : ""}`} key={signal.id} type="button" onClick={() => setActiveAxis(signal.id)}>
                <span className={styles.ledgerName}><AxisIcon axis={signal.id} /><b>{signal.ko}</b><small>{signal.unit}</small></span>
                <span className={styles.ledgerBar}><i style={{ width: `${signal.value}%`, background: signal.color }} /></span>
                <strong>{signal.value}</strong><em>{signal.level}</em>
              </button>
            ))}
          </div>
          <aside className={styles.recommendationPanel}>
            <div className={styles.recommendationHead}><span>지금 열리는 추천</span><i /></div>
            {recommendations.map((item) => (
              <article className={styles.recommendationItem} key={item.id}>
                <span>0{item.rank}</span>
                <div><small>{item.ko} · {item.value}%</small><h3>{item.title}</h3><p>{item.result}</p></div>
              </article>
            ))}
          </aside>
        </section>

        <section id="virenta-contract" className={styles.contractSection} aria-labelledby="contract-title">
          <div className={styles.contractVisual}>
            <div className={styles.contractOrbit}><span>V</span><i /><i /><i /></div>
            <div className={styles.contractLegend}><span><i /> 동의한 데이터</span><span><i /> 계산된 추천</span><span><i /> 아직 닫힌 정보</span></div>
          </div>
          <div className={styles.contractCopy}>
            <span className={styles.sectionCode}>03 / 동의 레이어</span>
            <h2 id="contract-title">개인화에는<br /><em>경계가 필요합니다.</em></h2>
            <p>비렌타는 몸과 관계의 기록을 이용해 더 정확한 삶을 제안합니다. 그 기록은 비렌타의 소유가 아니라, 평생계약 안에서 이용 범위를 확인하는 당신의 영역입니다.</p>
            <button className={styles.contractToggle} type="button" onClick={() => setShowContract((current) => !current)} aria-expanded={showContract}>
              {showContract ? "계약 범위 닫기" : "내 데이터가 쓰이는 곳 보기"}<b>{showContract ? "−" : "+"}</b>
            </button>
            {showContract && (
              <div className={styles.contractDetails}>
                <div><span>이용 예시</span><strong>수면 리듬 · 감각 반응 · 선택 기록</strong></div>
                <div><span>제외 예시</span><strong>대화 원문 · 위치 이력 · 타인 프로필</strong></div>
                <div><span>소속</span><strong>기업이 존속하는 한 평생계약 해지와 타사 이전은 불가</strong></div>
              </div>
            )}
          </div>
        </section>

        <section className={styles.protocolSection} aria-labelledby="protocol-title">
          <div className={styles.protocolHeading}>
            <span className={styles.sectionCode}>04 / 생활 프로토콜</span>
            <h2 id="protocol-title">욕구가 장면이 되는<br /><em>네 번의 변환.</em></h2>
          </div>
          <div className={styles.protocolTrack}>
            {[
              ["01", "감지", "몸과 감각에 남은 미세한 변화를 듣습니다."],
              ["02", "해석", "현재의 욕구와 오래된 계약을 구분합니다."],
              ["03", "편집", "다섯 축의 충돌을 줄여 하나의 경로를 만듭니다."],
              ["04", "동의", "당신이 허락한 다음 장면만 생활에 연결합니다."],
            ].map(([number, title, copy]) => (
              <article key={number} className={styles.protocolStep}>
                <span>{number}</span><i /><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.rivalSection} aria-labelledby="rival-title">
          <div className={styles.rivalIntro}>
            <span className={styles.sectionCode}>벨시엔 생활권 / 세 기업</span>
            <h2 id="rival-title">같은 도시에서<br /><em>다른 삶을 제안합니다.</em></h2>
            <p>세 기업 모두 의료·주거·생산 등 같은 업종을 운영하고, 인프라와 군사력도 거의 대등합니다. 오리센은 안정을, 네릭스는 능력의 확장을, 비렌타는 개인이 원하는 삶의 만족을 우선합니다.</p>
          </div>
          <div className={styles.rivalMap}>
            <div className={styles.rivalAxis}><span>안정</span><i /><span>만족</span><i /><span>확장</span></div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Keep direct anchors for Cloudflare static route navigation. */}
            <a href="/velsien-summit/corporate/orysen" onClick={(event) => { if (onSwitch) { event.preventDefault(); onSwitch("orysen"); } }}><small>ORYSEN / 오리센</small><strong>삶을 지키다</strong><span>보장 · 예측 · 장기관리 ↗</span></a>
            <div className={styles.rivalCurrent}><small>VIRENTA / 비렌타</small><strong>삶을 원하는 쪽으로</strong><span>취향 · 감각 · 관계 · 경험</span><i>현재 편집 중</i></div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Keep direct anchors for Cloudflare static route navigation. */}
            <a href="/velsien-summit/corporate/neryx" onClick={(event) => { if (onSwitch) { event.preventDefault(); onSwitch("neryx"); } }}><small>NERYX / 네릭스</small><strong>삶의 한계를 넘다</strong><span>성능 · 신경 · 업그레이드 ↗</span></a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}><Image src="/virenta-logo.png" alt="" width={42} height={35} /><span>VIRENTA<br /><small>비렌타 생활 편집국</small></span></div>
        <p>원하는 삶에 더 가까이.</p>
        <div className={styles.footerActions}><button type="button" onClick={() => setShowConcierge(true)}>개인화 안내 보기 ↗</button><a href="/velsien-summit/world">세계관 전체 보기 ↗</a><a href="/velsien-summit">벨시엔 서밋</a></div>
        <small>© 2187 VIRENTA GROUP · 평생계약 · 접근성 · 데이터 이용 범위</small>
      </footer>
      {showConcierge && (
        <div className={styles.conciergeLayer} role="presentation">
          <section ref={conciergeRef} className={styles.conciergePanel} role="dialog" aria-modal="true" aria-labelledby="virenta-concierge-title" aria-describedby="virenta-concierge-description">
            <button ref={conciergeCloseRef} className={styles.conciergeClose} type="button" onClick={() => setShowConcierge(false)} aria-label="안내 창 닫기">×</button>
            <span className={styles.sectionCode}>비렌타 개인 편집실 / 체험 안내</span>
            <h2 id="virenta-concierge-title">{active.ko} 편집을<br /><em>이어갈까요?</em></h2>
            <p id="virenta-concierge-description">현재 {profileData.label} 프로필의 {active.ko} 강도는 {value}입니다. 조정값은 이 화면에만 반영됩니다. 아래에서 비렌타의 데이터 이용 범위 예시를 확인할 수 있습니다.</p>
            <div className={styles.conciergeActions}>
              <a href="#virenta-contract" onClick={() => { setShowConcierge(false); setShowContract(true); }}>계약 범위 확인 <b>↗</b></a>
              <button type="button" onClick={() => setShowConcierge(false)}>나중에</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
