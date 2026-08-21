"use client";

import { useState } from "react";

const principles = [
  {
    index: "01",
    title: "작은 규칙을 깊이 있게",
    summary: "설명은 간결하게 다듬고, 선택과 해법은 오래 고민할 수 있도록 설계합니다.",
    detail:
      "처음에는 쉽게 이해되지만, 플레이할수록 새로운 판단이 생기는 구조를 좋아합니다. 규칙을 늘리기보다 하나의 규칙이 얼마나 다양한 선택을 만드는지 오래 들여다봅니다.",
  },
  {
    index: "02",
    title: "혼자서도 온전히 즐기도록",
    summary: "플레이어의 속도와 집중을 방해하지 않는 경험을 지향합니다.",
    detail:
      "언제 어디서든 자신의 속도로 시작하고 멈출 수 있는 게임을 만듭니다. 불필요한 연결이나 압박 대신, 게임 자체에 머무는 시간을 중요하게 생각합니다.",
  },
  {
    index: "03",
    title: "출시 뒤에도 계속 다듬기",
    summary: "출시는 끝이 아니라, 다음 개선을 시작하는 기준이라고 생각합니다.",
    detail:
      "직접 출시하고 운영하며 발견한 불편을 기록합니다. 한 작품에서 배운 것을 현재 게임의 개선과 다음 작품의 더 나은 시작으로 이어갑니다.",
  },
];

export function StudioAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="principle-accordion">
      {principles.map((principle, index) => {
        const isOpen = openIndex === index;
        return (
          <section className={`principle-item${isOpen ? " principle-item--open" : ""}`} key={principle.index}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`principle-panel-${index}`}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="principle-index">{principle.index}</span>
                <span className="principle-title">{principle.title}</span>
                <span className="principle-toggle" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            <div
              id={`principle-panel-${index}`}
              className="principle-panel"
              aria-hidden={!isOpen}
            >
              <div>
                <p className="principle-summary">{principle.summary}</p>
                <p className="principle-detail">{principle.detail}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
