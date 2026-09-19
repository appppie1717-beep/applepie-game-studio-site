import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

export const metadata: Metadata = {
  title: { absolute: "NERYX | 네릭스 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/neryx-logo.png", shortcut: "/neryx-logo.png" },
  keywords: ["벨시엔 서밋", "NERYX", "네릭스", "신경기술", "로보틱스", "시스템"],
  description: "신경기술, AI, 로보틱스, 고성능 개조를 통해 인간의 능력을 확장하는 네릭스 공식 사이트입니다.",
  alternates: { canonical: "/velsien-summit/corporate/neryx" },
  openGraph: {
    title: "NERYX | 네릭스",
    description: "신경기술, AI, 로보틱스, 고성능 개조를 통해 인간의 능력을 확장하는 네릭스 공식 사이트입니다.",
    url: "/velsien-summit/corporate/neryx",
    siteName: "NERYX",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/neryx-logo.png", alt: "네릭스 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NERYX | 네릭스",
    description: "신경기술, AI, 로보틱스, 고성능 개조를 통해 인간의 능력을 확장하는 네릭스 공식 사이트입니다.",
    images: [{ url: "/neryx-logo.png", alt: "네릭스 공식 로고" }],
  },
};

export default function NeryxPage() {
  return <CorporateExperience company="neryx" />;
}
