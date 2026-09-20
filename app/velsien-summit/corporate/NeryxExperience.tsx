"use client";
/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./neryx.module.css";

export type NeryxCompanyKey = "orysen" | "virenta" | "neryx";

export type NeryxExperienceProps = {
  onSwitch?: (company: NeryxCompanyKey) => void;
};

type BenchmarkMode = "baseline" | "configured";

type BenchmarkMetric = {
  label: string;
  baseline: string;
  configured: string;
  baselineScore: number;
  configuredScore: number;
};

const benchmarkMetrics: BenchmarkMetric[] = [
  { label: "반응 지연", baseline: "420 ms", configured: "38 ms", baselineScore: 28, configuredScore: 92 },
  { label: "집중 처리", baseline: "1.0×", configured: "4.6×", baselineScore: 22, configuredScore: 88 },
  { label: "하중 지속", baseline: "8 h", configured: "26 h", baselineScore: 34, configuredScore: 84 },
  { label: "위험 감지", baseline: "1.0 s", configured: "0.08 s", baselineScore: 18, configuredScore: 96 },
];

type Module = {
  id: string;
  code: string;
  discipline: string;
  name: string;
  description: string;
  price: string;
  upkeep: number;
  response: number;
  output: number;
  risk: number;
  accent: "cyan" | "green" | "orange" | "violet";
};

const modules: Module[] = [
  { id: "neural", code: "NX-01", discipline: "신경 인터페이스", name: "Neural/X", description: "의도를 명령으로 번역하는 학습·기억·제어 모듈.", price: "₳ 2,840", upkeep: 1.4, response: 32, output: 1.7, risk: 0.8, accent: "cyan" },
  { id: "organ", code: "BC-07", discipline: "인공장기", name: "Augment Core", description: "자연 장기의 한계를 넘어서는 순환·대사 유지 장치.", price: "₳ 4,120", upkeep: 2.2, response: 12, output: 2.6, risk: 1.5, accent: "green" },
  { id: "motor", code: "MM-12", discipline: "신체 기계화", name: "Motor Mesh", description: "근력과 균형을 도시 작업 규격에 맞춰 다시 매핑합니다.", price: "₳ 3,680", upkeep: 1.8, response: 16, output: 3.4, risk: 2.1, accent: "orange" },
  { id: "tactical", code: "AI-21", discipline: "전술 인공지능", name: "Orbit Mind", description: "현장의 변수를 읽고 다음 행동 순서를 계산합니다.", price: "₳ 5,460", upkeep: 2.7, response: 21, output: 4.1, risk: 2.8, accent: "violet" },
];

type Domain = {
  id: string;
  code: string;
  title: string;
  copy: string;
  proof: string;
  color: string;
  x: string;
  y: string;
};

const domains: Domain[] = [
  { id: "neural", code: "01", title: "신경 기술", copy: "학습·반응·기억을 직접 연결해 의도와 실행 사이의 지연을 줄입니다.", proof: "평균 반응 38 ms", color: "#65dcff", x: "17%", y: "28%" },
  { id: "ai", code: "02", title: "인지 AI", copy: "인간형 AI가 도시의 복잡한 변수를 읽고 사람과 함께 판단합니다.", proof: "엣지 추론 12.6 P", color: "#b58cff", x: "49%", y: "16%" },
  { id: "robotics", code: "03", title: "로보틱스", copy: "사람이 들어갈 필요가 없는 위험을 휴머노이드 플랫폼이 먼저 감당합니다.", proof: "자율 작업 99.1%", color: "#ffad62", x: "80%", y: "31%" },
  { id: "industry", code: "04", title: "산업 자동화", copy: "연산·에너지·물류를 엮어 노동 이후의 도시를 계속 움직이게 합니다.", proof: "운용 가동 24/7", color: "#62e5be", x: "80%", y: "72%" },
  { id: "defense", code: "05", title: "도시 방위", copy: "재난과 분쟁의 첫 신호를 찾아 시민과 인프라를 동시에 보호합니다.", proof: "위협 분류 0.08 s", color: "#ff7182", x: "49%", y: "84%" },
  { id: "bio", code: "06", title: "신체 확장", copy: "기존 장기를 모방하는 데서 멈추지 않고 더 높은 성능과 유지성을 설계합니다.", proof: "지속 하중 3.2×", color: "#c4f36c", x: "17%", y: "72%" },
];

type AccessTopic = "configuration" | "upkeep" | "research";

const accessTopics: { id: AccessTopic; label: string; title: string; copy: string }[] = [
  { id: "configuration", label: "구성 사양", title: "선택한 모듈 살펴보기", copy: "구성기에서 선택한 모듈과 예상 반응·출력·부담을 비교할 수 있습니다. 수치는 벨시엔 서밋 세계관의 기술 예시입니다." },
  { id: "upkeep", label: "유지 조건", title: "확장에는 관리가 따릅니다", copy: "신체 적응, 정기 유지보수, 위험 부담을 함께 살펴보세요. 기업과 평생계약한 뒤에는 그 기업이 존속하는 동안 다른 기업으로 옮길 수 없습니다." },
  { id: "research", label: "연구 기록", title: "도시 현장 검증 과정", copy: "신경 신호 수집에서 도시 시스템 적용까지의 연구 흐름을 아래 현장 기록에서 볼 수 있습니다. 이 화면은 실제 기술 문서나 접수 창구가 아닙니다." },
];

function NetworkLink({ company, active, onSwitch }: { company: NeryxCompanyKey; active?: boolean; onSwitch?: (company: NeryxCompanyKey) => void }) {
  const names: Record<NeryxCompanyKey, string> = { neryx: "네릭스", orysen: "오리센", virenta: "비렌타" };
  return <a className={active ? styles.competitorActive : styles.competitorLink} href={`/velsien-summit/corporate/${company}`} aria-current={active ? "page" : undefined} onClick={() => onSwitch?.(company)}>{names[company]}</a>;
}

function Blueprint({ mode, activeCount }: { mode: BenchmarkMode; activeCount: number }) {
  const highlight = mode === "configured" ? "#65dcff" : "#536b7b";
  return (
    <svg className={styles.blueprint} viewBox="0 0 620 580" role="img" aria-label="기준 인간과 네릭스 증강 시스템의 회로 청사진">
      <defs><linearGradient id="blueprintGlow" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#65dcff" stopOpacity=".95" /><stop offset="1" stopColor="#b8f36a" stopOpacity=".35" /></linearGradient><filter id="blueprintBlur"><feGaussianBlur stdDeviation="8" /></filter></defs>
      <g className={styles.blueprintGrid}>{Array.from({ length: 13 }, (_, index) => <line key={`v-${index}`} x1={40 + index * 45} y1="0" x2={40 + index * 45} y2="580" />)}{Array.from({ length: 13 }, (_, index) => <line key={`h-${index}`} x1="0" y1={20 + index * 45} x2="620" y2={20 + index * 45} />)}</g>
      <g className={styles.blueprintGlow} opacity={mode === "configured" ? 0.75 : 0.18} filter="url(#blueprintBlur)"><circle cx="310" cy="120" r="45" fill="#65dcff" /><path d="M310 170 L310 390 M250 223 L370 223 M250 223 L186 340 M370 223 L434 340 M274 390 L222 510 M346 390 L398 510" stroke="#65dcff" strokeWidth="18" fill="none" /></g>
      <g className={styles.blueprintFigure} stroke={highlight}><circle cx="310" cy="120" r="47" /><path d="M310 167 L310 392 M252 223 L368 223 M252 223 L181 342 M368 223 L439 342 M272 392 L220 510 M348 392 L400 510" /><path d="M286 204 Q310 225 334 204 M280 280 Q310 260 340 280 M286 344 Q310 363 334 344" className={styles.bodyContour} /><circle cx="310" cy="120" r="19" className={styles.neuralNode} /><path d="M310 101 V139 M291 120 H329" className={styles.crosshair} /><path d="M310 169 V389" className={styles.spine} /><path d="M257 227 L207 318 M363 227 L413 318 M275 398 L236 483 M345 398 L384 483" className={styles.circuit} /><circle cx="207" cy="318" r="6" className={styles.node} /><circle cx="413" cy="318" r="6" className={styles.node} /><circle cx="236" cy="483" r="6" className={styles.node} /><circle cx="384" cy="483" r="6" className={styles.node} /></g>
      {mode === "configured" && <g className={styles.moduleLabels}><g><path d="M328 120 H470 V96" /><text x="478" y="93">NEURAL/X · 연결</text></g><g><path d="M324 270 H500 V250" /><text x="508" y="247">AUGMENT CORE · 안정</text></g><g><path d="M397 475 H505 V456" /><text x="513" y="453">MOTOR MESH · 3.2×</text></g></g>}
      <text x="32" y="36" className={styles.blueprintCaption}>인체 기준선 / {mode === "configured" ? `구성 ${activeCount}개` : "미개조"}</text><text x="32" y="550" className={styles.blueprintCaption}>네릭스 생체기계 설계 / 설계판 07</text>
    </svg>
  );
}

function SignalRadar({ response, output, risk }: { response: number; output: number; risk: number }) {
  const size = 210;
  const points = [response, output * 20, Math.max(0, 100 - risk * 13), 72, 85].map((value, index) => { const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 5; const radius = Math.min(92, Math.max(20, value)); return `${size / 2 + Math.cos(angle) * radius},${size / 2 + Math.sin(angle) * radius}`; }).join(" ");
  const outline = [0, 1, 2, 3, 4].map((index) => { const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 5; return `${size / 2 + Math.cos(angle) * 92},${size / 2 + Math.sin(angle) * 92}`; }).join(" ");
  return <svg className={styles.radar} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="선택 모듈 구성 성능 레이더"><polygon points={outline} className={styles.radarOutline} /><polygon points={points} className={styles.radarValue} />{points.split(" ").map((point) => { const [cx, cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="3" className={styles.radarPoint} />; })}<text x="105" y="18" textAnchor="middle">반응</text><text x="203" y="91" textAnchor="end">출력</text><text x="167" y="202" textAnchor="middle">유지</text><text x="43" y="202" textAnchor="middle">안전</text><text x="7" y="91">자율</text></svg>;
}

export default function NeryxExperience({ onSwitch }: NeryxExperienceProps) {
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>("configured");
  const [activeModuleIds, setActiveModuleIds] = useState<string[]>(["neural", "organ"]);
  const [activeDomainId, setActiveDomainId] = useState(domains[0].id);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [accessTopic, setAccessTopic] = useState<AccessTopic>("configuration");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeModules = useMemo(() => modules.filter((module) => activeModuleIds.includes(module.id)), [activeModuleIds]);
  const activeDomain = domains.find((domain) => domain.id === activeDomainId) ?? domains[0];
  const configuredStats = useMemo(() => { const response = activeModules.reduce((total, module) => total + module.response, 0); const output = activeModules.reduce((total, module) => total + module.output, 0); const upkeep = activeModules.reduce((total, module) => total + module.upkeep, 0); const risk = activeModules.reduce((total, module) => total + module.risk, 0); return { response: Math.max(18, 420 - response * 3), output: (1 + output).toFixed(1), upkeep: upkeep.toFixed(1), risk: risk.toFixed(1), price: activeModules.reduce((total, module) => total + Number(module.price.replace(/[^0-9]/g, "")), 0).toLocaleString("ko-KR") }; }, [activeModules]);
  const toggleModule = (id: string) => { setActiveModuleIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); setBenchmarkMode("configured"); };
  const openTerminal = (topic: AccessTopic = "configuration") => { setAccessTopic(topic); setTerminalOpen(true); };
  const onSupport = () => openTerminal();
  const selectedTopic = accessTopics.find((topic) => topic.id === accessTopic) ?? accessTopics[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !terminalOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    closeRef.current?.focus();
    const handleCancel = (event: Event) => { event.preventDefault(); setTerminalOpen(false); };
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      if (dialog.open) dialog.close();
      previousFocus?.focus();
    };
  }, [terminalOpen]);

  return (
    <div className={styles.shell} id="neryx-top">
      <div className={styles.noise} aria-hidden="true" />
      <header className={styles.masthead}>
        <a href="#neryx-top" className={styles.wordmark} aria-label="네릭스 홈으로 이동"><span className={styles.wordmarkMark}><Image src="/neryx-logo.png" alt="" width={38} height={38} priority /></span><span><strong>NERYX</strong><small>능력 확장 연구소</small></span></a>
        <div className={styles.mastTelemetry} aria-label="네릭스 현재 상태"><span className={styles.statusLight} /> 벨시엔 상층 도시 <b>2187 / 04</b><i /> 인간 성능 기준선 개정 중</div>
        <nav className={styles.mastNav} aria-label="네릭스 메뉴"><a href="#benchmark">기준선</a><a href="#configure">구성기</a><a href="#systems">영역 지도</a><a href="#competition">경쟁 분석</a><button type="button" onClick={onSupport}>기술 안내 <span>↗</span></button></nav>
      </header>

      <main>
        <section className={styles.hero} id="benchmark" aria-labelledby="neryx-hero-title"><div className={styles.heroRail}><span>NX / 00</span><span>증강 연구소</span><span>스크롤 ↓</span></div><div className={styles.heroIntro}><span className={styles.kicker}><i /> 네릭스 / 능력 확장 연구소</span><h1 id="neryx-hero-title">한계를<br /><em>재설계한다.</em></h1><p>네릭스는 사람의 능력을 지금의 기준선에 묶어두지 않습니다. 신경기술과 인공장기, AI와 로봇을 연결해 더 빠르게 판단하고 오래 움직일 수 있는 삶을 설계합니다. 그 성능에 따르는 유지 부담도 함께 보여줍니다.</p><div className={styles.heroActions}><a className={styles.actionPrimary} href="#configure">증강 구성 살펴보기 <span>↓</span></a><button className={styles.actionGhost} type="button" onClick={onSupport}>공개 기술 안내 <span>+</span></button></div></div><div className={styles.blueprintStage}><div className={styles.stageHeader}><span>인체-기계 설계판 / H-00 → NX-04</span><strong><i /> 선택에 따라 달라지는 설계도</strong></div><Blueprint mode={benchmarkMode} activeCount={activeModules.length} /><div className={styles.stageFoot}><span>기준 인간</span><b>→</b><span className={benchmarkMode === "configured" ? styles.stageActive : ""}>구성 인간</span><small>회로 / 인체 / 기계 연결</small></div></div><div className={styles.benchmarkDock}><div className={styles.dockLabel}><span>성능 기준 비교</span><small>세계관 속 성능 예시 · 실제 제품 수치 아님</small></div><div className={styles.benchmarkSwitch} role="tablist" aria-label="기준 인간과 구성 인간 비교"><button type="button" role="tab" aria-selected={benchmarkMode === "baseline"} className={benchmarkMode === "baseline" ? styles.modeActive : ""} onClick={() => setBenchmarkMode("baseline")}>기준 인간 / H-00</button><button type="button" role="tab" aria-selected={benchmarkMode === "configured"} className={benchmarkMode === "configured" ? styles.modeActive : ""} onClick={() => setBenchmarkMode("configured")}>네릭스 구성 / NX-{String(activeModules.length).padStart(2, "0")}</button></div><div className={styles.metricStrip}>{benchmarkMetrics.map((metric) => { const configured = benchmarkMode === "configured"; return <div className={styles.benchmarkMetric} key={metric.label}><span>{metric.label}</span><strong>{configured ? metric.configured : metric.baseline}</strong><div><i style={{ width: `${configured ? metric.configuredScore : metric.baselineScore}%` }} /></div><small>{configured ? "확장 예시" : "기준 예시"}</small></div>; })}</div></div></section>

        <section className={styles.builder} id="configure" aria-labelledby="neryx-builder-title"><div className={styles.sectionTag}><span>01</span><i /> 능력 구성기</div><div className={styles.builderHead}><div><h2 id="neryx-builder-title">더 빠르게.<br /><em>더 오래.</em></h2><p>모듈을 선택하면 처리 속도와 출력, 유지보수 부담이 함께 바뀝니다. 네릭스는 성능만 약속하지 않습니다. 무엇을 감수하는지도 공개합니다.</p></div><div className={styles.builderStamp}>NX 구성기<br /><b>공개 사양판 4.8</b></div></div><div className={styles.builderGrid}><div className={styles.moduleList} role="group" aria-label="증강 모듈 선택">{modules.map((module) => { const selected = activeModuleIds.includes(module.id); return <button key={module.id} type="button" aria-pressed={selected} className={`${styles.moduleItem} ${selected ? styles.moduleSelected : ""}`} onClick={() => toggleModule(module.id)}><span className={`${styles.moduleCode} ${styles[module.accent]}`}>{module.code}</span><span className={styles.moduleText}><strong>{module.name}</strong><small>{module.discipline}</small><em>{module.description}</em></span><span className={styles.moduleToggle} aria-hidden="true">{selected ? "−" : "+"}</span></button>; })}<div className={styles.moduleHint}><span>선택 모듈 {activeModules.length}개</span><span>다중 선택 가능</span></div></div><div className={styles.configReadout}><div className={styles.readoutTop}><span>구성 결과 / NX-{String(activeModules.length).padStart(2, "0")}</span><strong><i /> 설계 가능 상태</strong></div><div className={styles.readoutMain}><div className={styles.readoutCopy}><span className={styles.readoutEyebrow}>당신이 선택한 능력의 모양</span><h3>{activeModules.length ? "능력은 조합에서 나온다." : "모듈을 선택하세요."}</h3><p>{activeModules.length ? `${activeModules.map((module) => module.name).join(" · ")} 구성이 도시 작업 규격에 맞춰 계산되었습니다.` : "좌측 모듈을 선택하면 성능과 부담이 계산됩니다."}</p><button type="button" className={styles.readoutAction} onClick={onSupport}>선택 구성 해설 보기 <span>↗</span></button></div><SignalRadar response={activeModules.length ? Math.min(92, 40 + activeModules.length * 12) : 18} output={activeModules.reduce((sum, module) => sum + module.output, 0)} risk={activeModules.reduce((sum, module) => sum + module.risk, 0)} /></div><div className={styles.costGrid}><div><span>예상 반응 시간</span><strong>{configuredStats.response} <small>ms</small></strong></div><div><span>처리 출력</span><strong>{configuredStats.output} <small>×</small></strong></div><div><span>월 유지 부담</span><strong>{configuredStats.upkeep} <small>지수</small></strong></div><div><span>누적 위험 부담</span><strong>{configuredStats.risk} <small>단계</small></strong></div></div><div className={styles.costFooter}><span>세계관 구성 예시 <b>₳ {configuredStats.price}</b></span><span>실제 견적·계약은 제공하지 않음</span><button type="button" onClick={() => openTerminal("upkeep")}>유지 조건 보기</button></div></div></div></section>

        <section className={styles.systems} id="systems" aria-labelledby="neryx-systems-title"><div className={styles.systemsLead}><div className={styles.sectionTag}><span>02</span><i /> 도시 시스템 지도</div><h2 id="neryx-systems-title">한 회사가<br /><em>여섯 방향으로 뻗는다.</em></h2><p>네릭스는 하나의 제품 회사가 아닙니다. 같은 기술을 신경망, 인체, 로봇, 생산시설과 방위망까지 확장합니다.</p><div className={styles.domainReadout}><span>{activeDomain.code} / 현재 선택</span><strong style={{ color: activeDomain.color }}>{activeDomain.title}</strong><p>{activeDomain.copy}</p><b>{activeDomain.proof}</b></div></div><div className={styles.systemMap}><div className={styles.mapHead}><span>벨시엔 운용 메시</span><span>노드 06 / 연결 상태 정상</span></div><svg className={styles.mapLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M17 28 L49 16 L80 31 L80 72 L49 84 L17 72 Z M17 28 L80 72 M80 31 L17 72 M49 16 L49 84" /></svg><div className={styles.mapCore}><span>N</span><small>네릭스<br />코어</small></div>{domains.map((domain) => <button type="button" key={domain.id} className={`${styles.domainNode} ${activeDomainId === domain.id ? styles.domainNodeActive : ""}`} style={{ left: domain.x, top: domain.y, "--node-color": domain.color } as React.CSSProperties} onClick={() => setActiveDomainId(domain.id)} aria-pressed={activeDomainId === domain.id}><span>{domain.code}</span><strong>{domain.title}</strong></button>)}<div className={styles.mapLegend}><span><i className={styles.legendLive} /> 운용 중</span><span><i className={styles.legendPulse} /> 확장 가능</span></div></div></section>

        <section className={styles.competition} id="competition" aria-labelledby="neryx-competition-title"><div className={styles.competitionTop}><div className={styles.sectionTag}><span>03</span><i /> 경쟁 시장 분석</div><div className={styles.competitorNav}><span>같은 도시, 다른 계약</span><NetworkLink company="orysen" onSwitch={onSwitch} /><NetworkLink company="virenta" onSwitch={onSwitch} /><NetworkLink company="neryx" active onSwitch={onSwitch} /></div></div><div className={styles.competitionBody}><div className={styles.competitionTitle}><span className={styles.redacted}>시장 문서 / 공개 등급 A</span><h2 id="neryx-competition-title">안전을 살 것인가.<br />만족을 살 것인가.<br /><em>아니면 앞서갈 것인가.</em></h2><p>세 기업 모두 의료·주거·생산을 비롯한 동일한 업종을 운영하며, 인프라와 군사력도 거의 대등합니다. 차이는 맡은 일이 아니라 지향점에 있습니다. 네릭스는 성능 확장의 이익과 위험을 함께 판단합니다.</p></div><div className={styles.marketDials}><div className={`${styles.marketDial} ${styles.dialOrysen}`}><span>오리센</span><strong>보장</strong><small>예측 가능한 장기관리</small><i /></div><div className={`${styles.marketDial} ${styles.dialVirenta}`}><span>비렌타</span><strong>만족</strong><small>원하는 감각과 경험</small><i /></div><div className={`${styles.marketDial} ${styles.dialNeryx}`}><span>네릭스</span><strong>전진</strong><small>더 높은 능력과 속도</small><i /></div></div></div><div className={styles.riskRibbon}><span>네릭스 선택의 실제 비용</span><b>유지보수 주기 단축</b><b>신체 적응 부담 증가</b><b>기업이 존속하는 한 타사 이전 불가</b><button type="button" onClick={() => openTerminal("upkeep")}>유지 조건 보기 <span>↗</span></button></div></section>

        <section className={styles.lab} id="lab" aria-labelledby="neryx-lab-title"><div className={styles.labTerminal}><div className={styles.terminalTop}><span><i /> 현장 검증 터미널</span><b>노드 07 / 현장 기록</b></div><div className={styles.terminalScreen}><div className={styles.terminalGrid} aria-hidden="true" /><div className={styles.terminalCore}><span>연구개발</span><strong>07</strong><small>연구는 이미<br />현장에 있다</small></div><div className={styles.terminalCoords}>37°11′04″ N<br />벨시엔 상층 도시</div><div className={styles.terminalSignal}>신호 강도 <b>98.4%</b><i style={{ width: "98.4%" }} /></div></div><div className={styles.terminalFoot}><span>인간 / 기계 공동 판단</span><span>연구 단계 / 현장 검증</span></div></div><div className={styles.labCopy}><div className={styles.sectionTag}><span>04</span><i /> 연구소 현장 기록</div><h2 id="neryx-lab-title">미래는<br /><em>실험실 밖에서 증명된다.</em></h2><p>네릭스의 기술은 완벽한 조건에서만 작동하도록 만들어지지 않습니다. 네릭스 계약자의 현장, 자동화 생산시설, 도시 방위망에서 다음 버전을 시험합니다.</p><ol className={styles.labSteps}><li><span>01</span><strong>실제 신경 신호 수집</strong><small>인간의 의도와 기계 명령을 맞춘다</small></li><li><span>02</span><strong>도시 메시 적용</strong><small>로봇·물류·방위 시스템과 연결한다</small></li><li><span>03</span><strong>유지 부담 공개</strong><small>능력의 대가를 계약서에 남긴다</small></li></ol><button type="button" className={styles.labAction} onClick={() => openTerminal("research")}>연구 과정 보기 <span>↗</span></button></div></section>
      </main>

      <footer className={styles.footer}><div className={styles.footerIdentity}><Image src="/neryx-logo.png" alt="" width={38} height={38} /><div><strong>NERYX / 네릭스</strong><span>한계를 넘어, 다음으로.</span></div></div><div className={styles.footerSwitch}><span>벨시엔 경쟁 기업</span><a href="/velsien-summit/corporate/orysen" onClick={() => onSwitch?.("orysen")}>오리센</a><a href="/velsien-summit/corporate/virenta" onClick={() => onSwitch?.("virenta")}>비렌타</a><button type="button" onClick={onSupport}>기술 안내</button></div><div className={styles.footerMeta}><span>© 2187 NERYX 산업 시스템</span><span>세계관 참고 페이지 · 실제 제품 아님</span><a href="/velsien-summit/world">세계관 전체 보기</a><a href="/velsien-summit">벨시엔 서밋 홈</a></div></footer>
      <dialog ref={dialogRef} className={styles.accessLayer} aria-labelledby="neryx-access-title" onPointerDown={(event) => { if (event.target === event.currentTarget) setTerminalOpen(false); }}>
        <section className={styles.accessTerminal}>
          <button ref={closeRef} type="button" className={styles.accessClose} onClick={() => setTerminalOpen(false)} aria-label="기술 안내 닫기">×</button>
          <span className={styles.accessKicker}>NERYX / 공개 기술 안내</span>
          <h2 id="neryx-access-title">능력 확장<br /><em>살펴보기</em></h2>
          <p>네릭스의 구성과 유지 조건, 연구 과정을 세계관 자료로 살펴볼 수 있습니다.</p>
          <div className={styles.accessChoices} role="group" aria-label="기술 안내 주제">
            {accessTopics.map((topic, index) => <button key={topic.id} type="button" aria-pressed={accessTopic === topic.id} onClick={() => setAccessTopic(topic.id)}><span>{String(index + 1).padStart(2, "0")}</span>{topic.label}<i aria-hidden="true">{accessTopic === topic.id ? "●" : "↗"}</i></button>)}
          </div>
          <div className={styles.accessDetail} aria-live="polite"><strong>{selectedTopic.title}</strong><p>{selectedTopic.copy}</p></div>
          <small>이 페이지는 벨시엔 서밋의 세계관 자료입니다. 실제 상담·견적·문서 요청은 접수하지 않습니다.</small>
        </section>
      </dialog>
    </div>
  );
}
