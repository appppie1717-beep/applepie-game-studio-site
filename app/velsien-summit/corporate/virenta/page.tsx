import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

const description = "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 비렌타. 세 기업이 같은 산업에서 경쟁하는 가운데 개인화와 삶의 만족을 우선합니다.";

export const metadata: Metadata = {
  title: { absolute: "VIRENTA | 비렌타 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/virenta-logo.png", shortcut: "/virenta-logo.png" },
  keywords: ["벨시엔 서밋", "VIRENTA", "비렌타", "개인화", "라이프 에디트", "경험"],
  description,
  alternates: { canonical: "/velsien-summit/corporate/virenta" },
  openGraph: {
    title: "VIRENTA | 비렌타",
    description,
    url: "/velsien-summit/corporate/virenta",
    siteName: "VIRENTA",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/virenta-logo.png", alt: "비렌타 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIRENTA | 비렌타",
    description,
    images: [{ url: "/virenta-logo.png", alt: "비렌타 공식 로고" }],
  },
};

export default function VirentaPage() {
  return <CorporateExperience company="virenta" />;
}
