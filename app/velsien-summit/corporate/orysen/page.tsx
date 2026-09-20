import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

const description = "의료·주거·생산·군사 인프라를 갖춘 벨시엔의 초거대기업 오리센. 세 기업이 같은 산업에서 경쟁하는 가운데 안정과 장기 보장을 우선합니다.";

export const metadata: Metadata = {
  title: { absolute: "ORYSEN | 오리센 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/orysen-logo.png", shortcut: "/orysen-logo.png" },
  keywords: ["벨시엔 서밋", "ORYSEN", "오리센", "생활망", "계약", "보장"],
  description,
  alternates: { canonical: "/velsien-summit/corporate/orysen" },
  openGraph: {
    title: "ORYSEN | 오리센",
    description,
    url: "/velsien-summit/corporate/orysen",
    siteName: "ORYSEN",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/orysen-logo.png", alt: "오리센 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORYSEN | 오리센",
    description,
    images: [{ url: "/orysen-logo.png", alt: "오리센 공식 로고" }],
  },
};

export default function OrysenPage() {
  return <CorporateExperience company="orysen" />;
}
