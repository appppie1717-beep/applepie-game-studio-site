"use client";

import { useCallback } from "react";
import OrysenExperience from "./OrysenExperience";
import VirentaExperience from "./VirentaExperience";
import NeryxExperience from "./NeryxExperience";

export type CompanyKey = "orysen" | "virenta" | "neryx";

export type Company = {
  name: string;
  korean: string;
  accent: string;
  strap: string;
  description: string;
  /** Kept for route metadata and backwards-compatible static data consumers. */
  support: string[];
  supportEyebrow: string;
  supportTitle: string;
  supportDescription: string;
  supportNote: string;
};

/**
 * The route uses this record for static params and metadata. It is deliberately
 * data only; no shared header, support panel, network switcher, or brand UI is
 * rendered from this module.
 */
export const companies: Record<CompanyKey, Company> = {
  orysen: {
    name: "ORYSEN",
    korean: "오리센",
    accent: "#146bb2",
    strap: "내일을 더 확실하게.",
    description: "건강, 주거, 금융과 가족의 시간을 하나의 생활망으로 연결합니다.",
    support: ["의료 지원", "거주지 문제", "계약 문의", "가족 구성원 지원", "긴급 보호 요청"],
    supportEyebrow: "계약 데스크 / 오리센 생활망",
    supportTitle: "필요한 순간, 먼저 연결됩니다.",
    supportDescription: "계약과 생활망에 관한 안내를 선택해 주세요.",
    supportNote: "오리센 공식 계약 데스크 · 생활망 지원",
  },
  virenta: {
    name: "VIRENTA",
    korean: "비렌타",
    accent: "#d98276",
    strap: "원하는 삶에 더 가까이.",
    description: "감각, 외형, 건강과 경험을 당신의 취향에 맞춰 다시 설계합니다.",
    support: ["프로필 상담", "감각 설정 변경", "바이오 케어", "경험 예약", "개인정보 문의"],
    supportEyebrow: "컨시어지 / 비렌타 라이프 에디트",
    supportTitle: "당신에게 맞는 다음 장면.",
    supportDescription: "비렌타 컨시어지가 취향과 프로필을 함께 살펴봅니다.",
    supportNote: "비렌타 공식 컨시어지 · 개인 경험 설계",
  },
  neryx: {
    name: "NERYX",
    korean: "네릭스",
    accent: "#1d8fff",
    strap: "한계를 넘어, 다음으로.",
    description: "신경기술, AI, 로보틱스로 인간의 다음 능력을 만듭니다.",
    support: ["제품 상담", "업그레이드 예약", "기술 문서", "안전 및 유지보수", "파트너 문의"],
    supportEyebrow: "콘솔 열기 / 네릭스 시스템",
    supportTitle: "어떤 시스템을 열까요?",
    supportDescription: "필요한 기술 채널을 선택하면 다음 단계로 연결됩니다.",
    supportNote: "네릭스 공식 콘솔 · 시스템 및 필드 지원",
  },
};

export type CorporateExperienceProps = {
  company: CompanyKey;
};

type ExperienceProps = {
  onSwitch: (company: CompanyKey) => void;
};

/**
 * Thin route dispatcher. The three experiences intentionally own their whole
 * composition, navigation, status readouts, and support/tool interactions.
 * Keeping this component free of visual chrome prevents a hidden shared
 * template from leaking across the rival corporate sites.
 */
export default function CorporateExperience({ company }: CorporateExperienceProps) {
  const switchCompany = useCallback(
    (nextCompany: CompanyKey) => {
      if (nextCompany === company || typeof window === "undefined") return;
      window.location.assign(`/velsien-summit/corporate/${nextCompany}`);
    },
    [company],
  );

  const experienceProps: ExperienceProps = { onSwitch: switchCompany };

  if (company === "orysen") return <OrysenExperience {...experienceProps} />;
  if (company === "virenta") return <VirentaExperience {...experienceProps} />;
  return <NeryxExperience {...experienceProps} />;
}
