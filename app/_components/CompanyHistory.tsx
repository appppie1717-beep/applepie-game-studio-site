"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type HistoryLink = {
  label: string;
  href: string;
  external?: boolean;
};

type HistoryEvent = {
  id: string;
  dateTime: string;
  dateLabel: string;
  fullDate: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageFit?: "contain" | "cover";
  imageSurface?: "light" | "dark";
  links: readonly HistoryLink[];
};

const HISTORY_DIALOG_CLOSE_MS = 180;

const historyEvents: readonly HistoryEvent[] = [
  {
    id: "mine-logic-release",
    dateTime: "2026",
    dateLabel: "2026",
    fullDate: "2026",
    title: "MINE LOGIC 첫 출시",
    summary: "단계별 힌트와 20단계 훈련을 담은 첫 Android 게임을 선보였습니다.",
    description:
      "MINE LOGIC은 에르시안의 첫 출시작입니다. 초급·중급·고급 지뢰찾기, 논리 과정을 나누어 보여주는 단계별 힌트, 일반훈련과 강화훈련을 담았으며 인터넷 권한 없이 기기 안에서 플레이할 수 있습니다.",
    image: "/images/mine-logic/feature-1024.webp",
    imageAlt: "푸른 지뢰찾기 보드 위의 MINE LOGIC 대표 이미지",
    imageWidth: 1024,
    imageHeight: 500,
    links: [
      { label: "MINE LOGIC 자세히 보기", href: "/mine-logic" },
      {
        label: "Google Play에서 보기",
        href: "https://play.google.com/store/apps/details?id=com.applepie.minelogic",
        external: true,
      },
    ],
  },
  {
    id: "business-opening",
    dateTime: "2026-08-19",
    dateLabel: "08.19",
    fullDate: "2026. 08. 19.",
    title: "개인사업자 개업",
    summary: "모바일 게임 소프트웨어 개발 및 공급업으로 사업을 시작했습니다.",
    description:
      "애플파이 상호로 모바일 게임 소프트웨어 개발 및 공급업을 시작했습니다. 같은 사업자등록번호와 대표자를 유지한 채 이후 법정 상호를 에르시안으로 변경했습니다.",
    image: "/images/brand/ersiyan-logo-hero.webp",
    imageAlt: "현재 법정 상호인 에르시안 로고",
    imageWidth: 960,
    imageHeight: 246,
    imageFit: "contain",
    links: [{ label: "현재 사업자 정보", href: "#business-info" }],
  },
  {
    id: "website-launch",
    dateTime: "2026-08-22",
    dateLabel: "08.22",
    fullDate: "2026. 08. 22.",
    title: "공식 홈페이지 공개",
    summary: "게임 소개와 운영 정보를 담은 공식 홈페이지의 첫 버전을 공개했습니다.",
    description:
      "게임 소개, 사업자 정보와 문의 경로를 한곳에서 확인할 수 있는 공식 홈페이지를 공개했습니다. 같은 날 홈페이지 개인정보처리방침이 처음 시행됐고, 당시 공개된 내용은 보관본으로 남아 있습니다.",
    image: "/ersiyan-social-card.jpg",
    imageAlt: "에르시안 로고가 담긴 공식 홈페이지 소셜 카드",
    imageWidth: 1200,
    imageHeight: 630,
    imageFit: "contain",
    imageSurface: "dark",
    links: [
      {
        label: "최초 개인정보처리방침 보관본",
        href: "/privacy/archive/2026-08-22",
      },
    ],
  },
  {
    id: "mail-order-registration",
    dateTime: "2026-08-24",
    dateLabel: "08.24",
    fullDate: "2026. 08. 24.",
    title: "통신판매업 신고",
    summary: "통신판매업 신고를 마치고 공개 사업자 정보에 등록번호를 반영했습니다.",
    description:
      "통신판매업 신고번호 제2026-광주광산-0682호를 발급받았습니다. 이 홈페이지 자체에서는 주문이나 결제를 받지 않으며, 앱 설치와 거래 정보는 Google Play에서 확인할 수 있습니다.",
    image: "/images/brand/ersiyan-logo-hero.webp",
    imageAlt: "에르시안 로고",
    imageWidth: 960,
    imageHeight: 246,
    imageFit: "contain",
    links: [
      {
        label: "공정위 신고 조회",
        href: "https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2064362580",
        external: true,
      },
      { label: "홈페이지 사업자 정보", href: "#business-info" },
    ],
  },
  {
    id: "game-producer-registration",
    dateTime: "2026-08-25",
    dateLabel: "08.25",
    fullDate: "2026. 08. 25.",
    title: "게임제작업자 등록",
    summary: "모바일 게임 소프트웨어 제작을 위한 게임제작업자 등록을 마쳤습니다.",
    description:
      "게임산업진흥에 관한 법률에 따라 게임제작업자 등록증 제2026-000002호를 발급받았습니다. 등록번호는 홈페이지의 법정 사업자 정보와 각 게임 페이지에서 확인할 수 있습니다.",
    image: "/images/velsien-summit/velsien-summit-social.jpg",
    imageAlt: "개발 중인 VELSIEN SUMMIT의 수직도시 대표 이미지",
    imageWidth: 1200,
    imageHeight: 630,
    links: [{ label: "등록번호 확인", href: "#business-info" }],
  },
  {
    id: "ersiyan-transition",
    dateTime: "2026-08-28",
    dateLabel: "08.28",
    fullDate: "2026. 08. 28.",
    title: "ERSIYAN 브랜드 전환",
    summary: "공식 브랜드와 도메인을 ERSIYAN·ersiyan.com으로 전환했습니다.",
    description:
      "ApplePie 이름으로 시작한 공식 홈페이지의 브랜드를 ERSIYAN으로 바꾸고 공식 도메인을 applepie.im에서 ersiyan.com으로 이전했습니다. 개발 중인 두 번째 게임 VELSIEN SUMMIT의 공개 페이지도 함께 선보였습니다.",
    image: "/images/velsien-summit/teaser-title-960.webp",
    imageAlt: "밝은 수직도시와 VELSIEN SUMMIT 로고가 보이는 개발 화면",
    imageWidth: 960,
    imageHeight: 432,
    links: [
      {
        label: "브랜드·도메인 변경 기록",
        href: "/privacy/archive/2026-08-28",
      },
      { label: "VELSIEN SUMMIT 보기", href: "/velsien-summit" },
    ],
  },
  {
    id: "legal-name-change",
    dateTime: "2026-08-31",
    dateLabel: "08.31",
    fullDate: "2026. 08. 31.",
    title: "법정 상호 에르시안 변경",
    summary: "개인사업자의 법정 상호를 애플파이에서 에르시안으로 변경했습니다.",
    description:
      "브랜드 전환에 이어 사업자등록증과 통신판매업 신고의 상호도 에르시안으로 변경했습니다. 대표자와 사업자등록번호는 그대로이며, 현재 홈페이지와 MINE LOGIC 정책에 변경 이력을 투명하게 남겨 두었습니다.",
    image: "/images/brand/ersiyan-logo-hero.webp",
    imageAlt: "에르시안 공식 로고",
    imageWidth: 960,
    imageHeight: 246,
    imageFit: "contain",
    links: [
      { label: "현재 개인정보처리방침", href: "/privacy" },
      { label: "현재 사업자 정보", href: "#business-info" },
    ],
  },
];

export function CompanyHistory() {
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeHistoryDetail = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimerRef.current !== null) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      dialogRef.current?.close();
    }, HISTORY_DIALOG_CLOSE_MS);
  }, []);

  useEffect(() => {
    if (selectedEvent && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [selectedEvent]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedEvent || !dialog) {
      return;
    }

    function handleBackdropClick(event: MouseEvent) {
      if (event.target === dialog) {
        closeHistoryDetail();
      }
    }

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [closeHistoryDetail, selectedEvent]);

  function handleDialogClosed() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setSelectedEvent(null);
  }

  return (
    <details id="company-history" className="company-history">
      <summary>
        <span className="company-history-summary-copy">
          <small>VERIFIED RECORD</small>
          <strong>Company History</strong>
        </span>
        <span className="company-history-summary-action" aria-hidden="true">
          <span className="company-history-summary-open">OPEN</span>
          <span className="company-history-summary-close">CLOSE</span>
          <i />
        </span>
      </summary>

      <section className="company-history-panel" aria-labelledby="company-history-title">
        <div className="company-history-heading">
          <div>
            <p>COMPANY HISTORY</p>
            <h2 id="company-history-title">에르시안이 걸어온 첫 기록</h2>
          </div>
          <p id="company-history-description">
            사업자 등록 문서와 사이트의 공개 정책·보관 기록을 기준으로 정리했습니다.
            원형 노드를 선택하면 자세한 내용을 볼 수 있습니다.
          </p>
        </div>

        <div className="history-year-group" aria-describedby="company-history-description">
          <div className="history-year" aria-label="2026년">
            <span>YEAR</span>
            <strong>2026</strong>
          </div>

          <div className="history-scroller" role="region" aria-label="2026년 회사 연혁 가로 스크롤">
            <ol className="history-track">
              {historyEvents.map((event) => (
                <li className="history-event" key={event.id}>
                  <time dateTime={event.dateTime}>{event.dateLabel}</time>
                  <button
                    type="button"
                    className="history-node"
                    aria-label={`${event.fullDate} ${event.title} 자세히 보기`}
                    data-history-milestone={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <span aria-hidden="true" />
                  </button>
                  <strong className="history-event-title">{event.title}</strong>
                  <p className="history-event-summary">{event.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="history-scroll-hint">
          <span aria-hidden="true">↔</span> 좌우로 이동해 기록을 살펴보세요
        </p>
      </section>

      {selectedEvent ? (
        <dialog
          ref={dialogRef}
          className={`history-dialog${isClosing ? " history-dialog--closing" : ""}`}
          aria-labelledby="history-dialog-title"
          aria-describedby="history-dialog-description"
          onCancel={(event) => {
            event.preventDefault();
            closeHistoryDetail();
          }}
          onClose={handleDialogClosed}
        >
          <article className="history-dialog-card">
            <div
              className={`history-dialog-image${
                selectedEvent.imageFit === "contain"
                  ? " history-dialog-image--contain"
                  : ""
              }${
                selectedEvent.imageSurface === "dark"
                  ? " history-dialog-image--surface-dark"
                  : ""
              }`}
            >
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.imageAlt}
                width={selectedEvent.imageWidth}
                height={selectedEvent.imageHeight}
                sizes="(max-width: 700px) 100vw, 42vw"
              />
            </div>

            <div className="history-dialog-copy">
              <button
                type="button"
                className="history-dialog-close"
                aria-label="연혁 상세 닫기"
                onClick={closeHistoryDetail}
              >
                <span aria-hidden="true">×</span>
              </button>
              <time dateTime={selectedEvent.dateTime}>{selectedEvent.fullDate}</time>
              <h3 id="history-dialog-title">{selectedEvent.title}</h3>
              <p className="history-dialog-lead">{selectedEvent.summary}</p>
              <p id="history-dialog-description">{selectedEvent.description}</p>
              <div className="history-dialog-links">
                {selectedEvent.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={link.external ? undefined : closeHistoryDetail}
                  >
                    {link.label} <span aria-hidden="true">{link.external ? "↗" : "→"}</span>
                  </a>
                ))}
              </div>
            </div>
          </article>
        </dialog>
      ) : null}
    </details>
  );
}
