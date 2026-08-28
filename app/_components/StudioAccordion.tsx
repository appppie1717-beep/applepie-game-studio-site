"use client";

import { useState } from "react";

const principles = [
  {
    index: "01",
    title: "규칙은 적게, 생각할 건 많게",
    summary: "처음에는 바로 이해되고, 할수록 생각할 게 생기는 게임을 좋아합니다.",
    detail:
      "기능을 이것저것 넣기보다, 같은 규칙 안에서 선택지가 늘어나는 쪽이 더 좋습니다.",
  },
  {
    index: "02",
    title: "필요한 정보부터 보이게",
    summary: "메뉴를 헤매지 않고 바로 할 일을 찾을 수 있게 화면을 만듭니다.",
    detail:
      "버튼을 많이 늘어놓지 않고, 그 순간 필요한 정보가 먼저 보이게 정리합니다. 설명은 필요한 곳에만 짧게 붙입니다.",
  },
  {
    index: "03",
    title: "출시한 뒤에도 계속 고치기",
    summary: "제가 직접 플레이하면서 불편한 곳을 계속 고칩니다.",
    detail:
      "MINE LOGIC도 출시 뒤에 힌트와 훈련을 계속 손봤습니다. 다음 게임도 실제로 해 보고 고쳐 가며 만들 생각입니다.",
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
