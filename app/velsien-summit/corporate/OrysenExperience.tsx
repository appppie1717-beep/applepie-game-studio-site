"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./orysen.module.css";

type CompetitorKey = "virenta" | "neryx";
type LayerKey = "continuity" | "health" | "home" | "mobility";
type ConsoleView = "timeline" | "maintenance";

type OrysenExperienceProps = {
  onSwitch?: (company: CompetitorKey) => void;
};

type NetworkNode = {
  id: string;
  name: string;
  code: string;
  level: string;
  x: number;
  y: number;
  state: "stable" | "watch" | "locked";
  signal: string;
  detail: string;
};

const networkNodes: NetworkNode[] = [
  { id: "central", name: "중앙 계약 허브", code: "C-00", level: "상층 / 기준점", x: 49, y: 48, state: "stable", signal: "99.98%", detail: "오리센 평생계약의 생활망 검증 노드" },
  { id: "aurelia", name: "오렐리아 의료권", code: "M-14", level: "상층 14구", x: 75, y: 24, state: "stable", signal: "99.94%", detail: "인공장기 교체 예측과 응급 우선 연결을 담당" },
  { id: "meridian", name: "메리디안 주거권", code: "H-08", level: "중층 08구", x: 25, y: 30, state: "watch", signal: "98.61%", detail: "주거·화재·대피 경로에서 유지보수 지연이 감지됨" },
  { id: "lowline", name: "로우라인 물류권", code: "L-31", level: "하층 31구", x: 21, y: 73, state: "stable", signal: "99.72%", detail: "식량·의약품 배송과 생활망 복구 물류를 감시" },
  { id: "orbital", name: "오비탈 이동축", code: "T-05", level: "수직 환승 05축", x: 78, y: 73, state: "locked", signal: "97.08%", detail: "교통 계약 잠금 상태. 보안 심사 후 재개 예정" },
];

const guaranteeLayers: Array<{ key: LayerKey; code: string; name: string; short: string; score: number; promise: string; tradeoff: string; nodes: string }> = [
  { key: "continuity", code: "L0", name: "생애 연속성", short: "삶의 전환을 끊지 않음", score: 96, promise: "질병·이사·가족 변화가 생겨도 하나의 계약 기록으로 이어집니다.", tradeoff: "기업이 존속하는 한 다른 기업으로 옮길 수 없고, 보장 조건 조정에도 심사가 따릅니다.", nodes: "24 / 27" },
  { key: "health", code: "L1", name: "신체 보장", short: "인공장기와 회복을 예측", score: 94, promise: "생체 신호와 교체 주기를 읽어 필요한 치료망을 미리 예약합니다.", tradeoff: "예측 정확도를 위해 의료 기록의 장기 공유 범위가 넓어집니다.", nodes: "18 / 22" },
  { key: "home", code: "L2", name: "거주 안전", short: "집과 도시를 함께 보호", score: 91, promise: "화재·침입·재난·정전 대응을 주거 계약 안에서 자동 연결합니다.", tradeoff: "안전망이 넓어질수록 출입 기록과 생활 패턴 감시가 촘촘해집니다.", nodes: "31 / 34" },
  { key: "mobility", code: "L3", name: "이동 권리", short: "도시의 층을 통과할 권리", score: 88, promise: "거주층·의료권·작업권 사이의 이동 자격을 장기 계약으로 보존합니다.", tradeoff: "신뢰 등급이 낮아지면 일부 환승축과 상층 구역이 잠길 수 있습니다.", nodes: "13 / 17" },
];

const timeline = [
  { date: "오늘 08:14", label: "생체 기준 갱신", body: "신경·심장 보조기의 다음 점검일을 18일 앞당겼습니다.", state: "정상", tone: "stable" },
  { date: "오늘 06:40", label: "도시권 계약 동기화", body: "메리디안 주거권의 화재 대피 경로 3건을 갱신했습니다.", state: "확인", tone: "watch" },
  { date: "어제 22:07", label: "가족 권한 확장", body: "등록 보호자에게 응급 이동 권한을 임시 부여했습니다.", state: "기록", tone: "neutral" },
  { date: "09.18", label: "장기 유지 심사", body: "인공장기 보증과 생애 연속성 등급을 함께 재계산합니다.", state: "예약", tone: "future" },
];

const maintenance = [
  { asset: "신경 보조기 N-7", owner: "개인 신체망", due: "18일 후", risk: "낮음", progress: 82 },
  { asset: "메리디안 대피축", owner: "H-08 도시망", due: "3일 후", risk: "관찰", progress: 57 },
  { asset: "가족 계약 키 04", owner: "생애 권한", due: "오늘", risk: "낮음", progress: 91 },
  { asset: "오비탈 환승 인증", owner: "T-05 이동축", due: "심사 중", risk: "잠금", progress: 34 },
];

function StatusDot({ state }: { state: NetworkNode["state"] }) {
  return <span className={`${styles.statusDot} ${styles[`status${state[0].toUpperCase()}${state.slice(1)}`]}`} aria-hidden="true" />;
}

function Metric({ label, value, note, tone = "default" }: { label: string; value: string; note: string; tone?: "default" | "accent" }) {
  return <div className={`${styles.metric} ${tone === "accent" ? styles.metricAccent : ""}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export default function OrysenExperience({ onSwitch = () => undefined }: OrysenExperienceProps) {
  const [activeLayer, setActiveLayer] = useState<LayerKey>("continuity");
  const [activeNode, setActiveNode] = useState("central");
  const [view, setView] = useState<ConsoleView>("timeline");
  const [showDesk, setShowDesk] = useState(false);
  const selectedLayer = useMemo(() => guaranteeLayers.find((layer) => layer.key === activeLayer) ?? guaranteeLayers[0], [activeLayer]);
  const selectedNode = useMemo(() => networkNodes.find((node) => node.id === activeNode) ?? networkNodes[0], [activeNode]);
  const openDesk = () => setShowDesk(true);
  const nodeStatus = selectedNode.state === "stable" ? "정상 운용" : selectedNode.state === "watch" ? "관찰 필요" : "접근 잠금";
  const nextAction = selectedNode.state === "locked" ? "보안 심사 재요청" : selectedLayer.key === "continuity" ? "생애 연속성 심사 예약" : `${selectedLayer.name} 적용 조건 확인`;
  const nextActionDetail = selectedNode.state === "locked" ? "이동축 권한이 잠겨 있어 새 보장 레이어를 적용하기 전에 권한 심사가 필요합니다." : `${selectedNode.name}에 ${selectedLayer.name}을 연결하면 다음 보장 조건 검토 때 함께 반영됩니다.`;

  useEffect(() => {
    if (!showDesk) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowDesk(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDesk]);

  return (
    <div className={styles.experience} id="top">
      <header className={styles.commandHeader}>
        <div className={styles.headerIdentity}><span className={styles.headerKicker}>벨시엔 서밋 / 생활망 운영실</span><strong>ORYSEN</strong><span className={styles.headerKorean}>오리센</span></div>
        <div className={styles.headerTelemetry} aria-label="오리센 시스템 상태"><span><i className={styles.pulse} /> 도시망 연결 예시</span><span>세계관 기준 2187</span><span className={styles.headerMode}>운영 모드 / 안정 우선</span></div>
        <button type="button" className={styles.headerSupport} onClick={openDesk}><span>계약 데스크</span><b>↗</b></button>
      </header>

      <div className={styles.consoleLayout}>
        <aside className={styles.contractRail} aria-label="오리센 계약 탐색">
          <div className={styles.railBrand}><a href="#top" aria-label="오리센 운영실 맨 위로"><Image src="/orysen-logo.png" alt="" width={62} height={62} priority /></a><span>O / 01</span></div>
          <div className={styles.railTitle}><span>개인 계약자</span><strong>생활 보장<br />탐색기</strong></div>
          <nav className={styles.railNav} aria-label="운영실 섹션"><a className={styles.railActive} href="#network"><span>01</span>생활망</a><a href="#guarantees"><span>02</span>보장 레이어</a><a href="#ledger"><span>03</span>계약 기록</a><a href="#terms"><span>04</span>이용 조건</a></nav>
          <div className={styles.railScope}><span>접근 범위</span><strong>개인 + 보호자</strong><small>중립 계약자 권한<br />4등급 / 읽기·승인</small></div>
          <button type="button" className={styles.railAction} onClick={openDesk}><span>보장 설계 요청</span><b>+</b></button>
        </aside>

        <main className={styles.consoleMain}>
          <section className={styles.consoleIntro} aria-labelledby="orysen-title"><div className={styles.introCopy}><span className={styles.sectionTag}><i /> 계약 관제 샘플 / 세계관 기준 2187</span><h1 id="orysen-title">불확실성을<br /><em>운영 가능한 상태로.</em></h1><p>세 기업은 모두 의료·주거·생산을 포함한 동일한 업종을 운영하며, 인프라와 군사력도 거의 대등합니다. 오리센은 그 힘을 삶의 안정과 장기 보장에 맞춰 신체·주거·이동을 연결합니다.</p></div><div className={styles.introMetrics}><Metric label="생활망 안정성" value="99.98%" note="세계관 참고값 · 시뮬레이션" tone="accent" /><Metric label="계약 경과" value="18.4년" note="한 계약자 운용 예시" /><Metric label="검증 대기" value="04건" note="검토 상태 예시" /></div></section>

          <section className={styles.networkSection} id="network" aria-labelledby="network-title"><div className={styles.panelHeading}><div><span className={styles.sectionTag}>01 / 생활망 상태판</span><h2 id="network-title">도시 전체를 하나의<br /><em>보장 가능한 흐름</em>으로 읽습니다.</h2></div><div className={styles.panelHeadingRight}><span className={styles.liveBadge}><i /> 관제 샘플 / 5개 권역</span><span className={styles.mutedLabel}>참고 지표 · 세계관 기준 시뮬레이션</span></div></div>
            <div className={styles.networkGrid}><div className={styles.mapPanel}><div className={styles.mapPanelTop}><div><span className={styles.monoLabel}>도시망 / V-07</span><strong>벨시엔 수직도시 연결망</strong></div><span className={styles.mapScale}>축척 1 : 48,000</span></div><div className={styles.mapStage}><div className={styles.mapGlow} aria-hidden="true" /><div className={styles.mapGrid} aria-hidden="true" /><svg className={styles.mapSvg} viewBox="0 0 800 500" role="img" aria-label="벨시엔 생활망의 계약 연결선"><defs><linearGradient id="orysenRoute" x1="0" x2="1"><stop offset="0" stopColor="#50d8ff" stopOpacity=".2" /><stop offset=".5" stopColor="#8df6c5" stopOpacity=".95" /><stop offset="1" stopColor="#50d8ff" stopOpacity=".2" /></linearGradient><filter id="orysenBlur"><feGaussianBlur stdDeviation="6" /></filter></defs><path className={styles.mapRouteGhost} d="M85 360 C170 280 190 160 300 214 S478 386 562 268 S690 170 738 108" /><path className={styles.mapRoute} d="M85 360 C170 280 190 160 300 214 S478 386 562 268 S690 170 738 108" /><path className={styles.mapRouteAlt} d="M142 92 C228 160 258 318 396 244 S578 140 684 388" /><path className={styles.mapRing} d="M400 250 m-92 0 a92 92 0 1 0 184 0 a92 92 0 1 0 -184 0" /><path className={styles.mapRingSmall} d="M400 250 m-36 0 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0" /><circle className={styles.mapCore} cx="400" cy="250" r="6" /><g className={styles.mapTicks}><path d="M400 105v24M400 371v24M255 250h24M521 250h24" /><path d="M298 148l17 17M485 335l17 17M502 148l-17 17M315 335l-17 17" /></g></svg><span className={styles.mapNorth}>N<br /><i /></span>{networkNodes.map((node) => <button type="button" key={node.id} className={`${styles.mapNode} ${activeNode === node.id ? styles.mapNodeActive : ""} ${styles[`mapNode${node.state[0].toUpperCase()}${node.state.slice(1)}`]}`} style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as CSSProperties} onClick={() => setActiveNode(node.id)} aria-label={`${node.name} 선택`} aria-pressed={activeNode === node.id}><span className={styles.nodeCore}><i /></span><span className={styles.nodeLabel}><b>{node.code}</b>{node.name}</span></button>)}<div className={styles.mapLegend}><span><i className={styles.legendStable} /> 정상</span><span><i className={styles.legendWatch} /> 관찰</span><span><i className={styles.legendLocked} /> 잠금</span></div></div><div className={styles.mapFooter}><span>동기화 지연 예시 0.08초</span><span>노드 05 / 보장 경로 17</span><span>모델 검증 예시 07:41:59</span></div></div>
              <aside className={styles.nodeInspector} aria-live="polite"><div className={styles.inspectorTop}><span>선택한 노드</span><StatusDot state={selectedNode.state} /></div><div className={styles.inspectorCode}>{selectedNode.code}</div><h3>{selectedNode.name}</h3><p>{selectedNode.detail}</p><dl className={styles.nodeFacts}><div><dt>위치</dt><dd>{selectedNode.level}</dd></div><div><dt>연결 안정성</dt><dd>{selectedNode.signal}</dd></div><div><dt>현재 상태</dt><dd className={styles[`text${selectedNode.state[0].toUpperCase()}${selectedNode.state.slice(1)}`]}>{nodeStatus}</dd></div></dl><div className={styles.inspectorTrace}><span>계약 경로 추적</span><div><i style={{ width: `${selectedNode.state === "stable" ? 92 : selectedNode.state === "watch" ? 66 : 34}%` }} /></div><small>오리센 유지망 / 개인 권한과 연결됨</small></div><button type="button" className={styles.inspectorAction} onClick={openDesk}>이 노드의 보장 조건 열기 <b>↗</b></button></aside>
            </div>
          </section>

          <section className={styles.guaranteeSection} id="guarantees" aria-labelledby="guarantee-title"><div className={styles.guaranteeIntro}><span className={styles.sectionTag}>02 / 보장 레이어</span><h2 id="guarantee-title">필요한 보장만 켜고,<br /><em>대가까지 확인합니다.</em></h2><p>오리센의 계약은 편리함을 무료로 약속하지 않습니다. 어떤 기록을 맡기고 어떤 권한을 얻는지 한 레이어씩 확인할 수 있습니다.</p><div className={styles.layerScale}><span>개방 범위</span><i><b /></i><span>운용 통제</span></div></div><div className={styles.layerExplorer}><div className={styles.layerList} role="tablist" aria-label="보장 레이어 선택">{guaranteeLayers.map((layer) => <button type="button" key={layer.key} className={`${styles.layerTab} ${activeLayer === layer.key ? styles.layerTabActive : ""}`} onClick={() => setActiveLayer(layer.key)} role="tab" aria-selected={activeLayer === layer.key}><span>{layer.code}</span><strong>{layer.name}</strong><small>{layer.short}</small><b>{layer.score}</b></button>)}</div><div className={styles.layerDetail} role="tabpanel"><div className={styles.layerDetailTop}><span className={styles.monoLabel}>활성 보장 / {selectedLayer.code}</span><strong>{selectedLayer.nodes} 노드 연결</strong></div><div className={styles.layerScore}><strong>{selectedLayer.score}</strong><span>신뢰<br />기준점</span><i><b style={{ width: `${selectedLayer.score}%` }} /></i></div><p className={styles.layerPromise}>{selectedLayer.promise}</p><div className={styles.layerTradeoff}><span>관리의 대가</span><p>{selectedLayer.tradeoff}</p></div><button type="button" onClick={openDesk}>내 계약에 이 레이어 적용 <b>↗</b></button></div></div></section>

          <section className={styles.ledgerSection} id="ledger" aria-labelledby="ledger-title"><div className={styles.ledgerHeader}><div><span className={styles.sectionTag}>03 / 계약 기록</span><h2 id="ledger-title">보장은 약속이 아니라<br /><em>계속 남는 기록</em>입니다.</h2></div><div className={styles.viewSwitch} role="tablist" aria-label="계약 기록 보기"><button type="button" className={view === "timeline" ? styles.viewActive : ""} onClick={() => setView("timeline")} role="tab" aria-selected={view === "timeline"}>변경 타임라인</button><button type="button" className={view === "maintenance" ? styles.viewActive : ""} onClick={() => setView("maintenance")} role="tab" aria-selected={view === "maintenance"}>유지보수 원장</button></div></div>{view === "timeline" ? <div className={styles.timeline}>{timeline.map((item) => <div className={styles.timelineRow} key={`${item.date}-${item.label}`}><span className={styles.timelineDate}>{item.date}</span><span className={`${styles.timelineDot} ${styles[`timeline${item.tone[0].toUpperCase()}${item.tone.slice(1)}`]}`} /><div><strong>{item.label}</strong><p>{item.body}</p></div><b>{item.state}</b></div>)}</div> : <div className={styles.maintenanceTable} role="table" aria-label="유지보수 원장"><div className={styles.tableRowHeader} role="row"><span>자산 / 경로</span><span>소속</span><span>다음 점검</span><span>상태</span><span>준비도</span></div>{maintenance.map((item) => <div className={styles.tableRow} role="row" key={item.asset}><strong>{item.asset}</strong><span>{item.owner}</span><span>{item.due}</span><span className={item.risk === "낮음" ? styles.riskLow : item.risk === "관찰" ? styles.riskWatch : styles.riskLocked}>{item.risk}</span><span className={styles.progressCell}><i><b style={{ width: `${item.progress}%` }} /></i>{item.progress}%</span></div>)}</div>}</section>

          <section className={styles.termsSection} id="terms" aria-labelledby="terms-title"><div className={styles.termsSignal} aria-hidden="true"><span /><span /><span /><span /><span /></div><div className={styles.termsCopy}><span className={styles.sectionTag}>04 / 오리센의 조건</span><h2 id="terms-title">안전망이 넓어질수록,<br /><em>맡기는 것도 분명해져야 합니다.</em></h2><p>오리센은 시민의 삶을 오래 관리합니다. 그만큼 계약자는 자신이 무엇을 얻고 어떤 통제를 받아들이는지 언제든 읽을 수 있어야 합니다.</p></div><div className={styles.termsColumns}><div><span>얻는 것</span><strong>예측 가능한 내일</strong><p>의료·주거·이동·가족 권한이 하나의 보장 기준으로 연결됩니다.</p></div><div><span>맡기는 것</span><strong>장기 기록과 선택의 일부</strong><p>생활망은 당신의 위험을 계산하기 위해 계속해서 상태를 읽습니다.</p></div><button type="button" onClick={openDesk}>전체 계약 조건 보기 <b>↗</b></button></div></section>

          <section className={styles.competitionSection} aria-label="경쟁사 비교 이동"><div><span className={styles.sectionTag}>벨시엔 / 기업별 철학</span><h2>같은 도시를,<br /><em>서로 다른 기준으로.</em></h2><p>오리센은 지속성을 우선합니다. 비렌타와 네릭스의 제안이 궁금하다면 각자의 운영 철학을 직접 비교하세요.</p></div><div className={styles.competitorLinks}><button type="button" onClick={() => onSwitch("virenta")}><span>VIRENTA</span><strong>원하는 삶을 편집하다</strong><b>↗</b></button><button type="button" onClick={() => onSwitch("neryx")}><span>NERYX</span><strong>한계를 시스템으로 넘다</strong><b>↗</b></button></div></section>

          <footer className={styles.consoleFooter}><div><strong>ORYSEN / 오리센</strong><span>내일을 보장하는 생활망 운영사</span></div><div><span>벨시엔 서밋 세계관 기준 · 참고용 시뮬레이션</span><a href="/velsien-summit/world">세계관 전체 보기 ↗</a><a href="/velsien-summit">벨시엔 홈 ↗</a><button type="button" onClick={openDesk}>계약 데스크 ↗</button></div></footer>
        </main>
      </div>
      {showDesk && <div className={styles.deskOverlay} role="presentation"><button type="button" className={styles.deskBackdrop} onClick={() => setShowDesk(false)} aria-label="계약 데스크 닫기" /><aside className={styles.deskPanel} role="dialog" aria-modal="true" aria-labelledby="desk-title"><div className={styles.deskPanelTop}><span className={styles.sectionTag}><i /> 오리센 전용 계약 데스크</span><button type="button" className={styles.deskClose} onClick={() => setShowDesk(false)} aria-label="닫기">×</button></div><div className={styles.deskPanelCode}>계약 검토 / {selectedNode.code} · {selectedLayer.code}</div><h2 id="desk-title">선택한 보장 경로를<br /><em>다음 조치로 연결합니다.</em></h2><p className={styles.deskLead}>현재 선택한 노드와 보장 레이어를 기준으로 계약자가 확인할 내용을 정리했습니다.</p><dl className={styles.deskFacts}><div><dt>선택 노드</dt><dd>{selectedNode.name}<small>{selectedNode.level}</small></dd></div><div><dt>보장 레이어</dt><dd>{selectedLayer.name}<small>신뢰 기준점 {selectedLayer.score}</small></dd></div><div><dt>현재 상태</dt><dd className={styles[`text${selectedNode.state[0].toUpperCase()}${selectedNode.state.slice(1)}`]}>{nodeStatus}<small>{selectedNode.signal} · 참고값</small></dd></div></dl><div className={styles.deskNext}><span>권고 다음 조치</span><strong>{nextAction}</strong><p>{nextActionDetail}</p></div><div className={styles.deskActions}><button type="button" className={styles.deskPrimary} onClick={() => setShowDesk(false)}>조건을 확인했습니다 <b>✓</b></button><button type="button" className={styles.deskSecondary} onClick={() => { setShowDesk(false); }}>나중에 검토</button></div><small className={styles.deskDisclaimer}>벨시엔 서밋 세계관 기준 · 실제 계약이 아닌 운영 화면 시뮬레이션</small></aside></div>}
    </div>
  );
}
