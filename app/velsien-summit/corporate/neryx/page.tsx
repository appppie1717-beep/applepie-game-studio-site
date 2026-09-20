import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

const description = "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 네릭스. 세 기업이 같은 산업에서 경쟁하는 가운데 능력과 성능의 확장을 우선합니다.";

export const metadata: Metadata = {
  title: { absolute: "NERYX | 네릭스 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/neryx-logo.png", shortcut: "/neryx-logo.png" },
  keywords: ["벨시엔 서밋", "NERYX", "네릭스", "신경기술", "로보틱스", "시스템"],
  description,
  alternates: { canonical: "/velsien-summit/corporate/neryx" },
  openGraph: {
    title: "NERYX | 네릭스",
    description,
    url: "/velsien-summit/corporate/neryx",
    siteName: "NERYX",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/neryx-logo.png", alt: "네릭스 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NERYX | 네릭스",
    description,
    images: [{ url: "/neryx-logo.png", alt: "네릭스 공식 로고" }],
  },
};

export default function NeryxPage() {
  return <CorporateExperience company="neryx" />;
}
