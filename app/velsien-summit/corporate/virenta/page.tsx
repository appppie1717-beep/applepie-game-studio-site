import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

export const metadata: Metadata = {
  title: { absolute: "VIRENTA | 비렌타 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/virenta-logo.png", shortcut: "/virenta-logo.png" },
  keywords: ["벨시엔 서밋", "VIRENTA", "비렌타", "개인화", "라이프 에디트", "경험"],
  description: "감각, 외형, 건강, 경험을 개인의 취향에 맞춰 설계하는 비렌타 공식 사이트입니다.",
  alternates: { canonical: "/velsien-summit/corporate/virenta" },
  openGraph: {
    title: "VIRENTA | 비렌타",
    description: "감각, 외형, 건강, 경험을 개인의 취향에 맞춰 설계하는 비렌타 공식 사이트입니다.",
    url: "/velsien-summit/corporate/virenta",
    siteName: "VIRENTA",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/virenta-logo.png", alt: "비렌타 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIRENTA | 비렌타",
    description: "감각, 외형, 건강, 경험을 개인의 취향에 맞춰 설계하는 비렌타 공식 사이트입니다.",
    images: [{ url: "/virenta-logo.png", alt: "비렌타 공식 로고" }],
  },
};

export default function VirentaPage() {
  return <CorporateExperience company="virenta" />;
}
