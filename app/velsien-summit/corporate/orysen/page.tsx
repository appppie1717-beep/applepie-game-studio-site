import type { Metadata } from "next";
import CorporateExperience from "../CorporateExperience";

export const metadata: Metadata = {
  title: { absolute: "ORYSEN | 오리센 · 벨시엔 서밋" },
  applicationName: "벨시엔 서밋",
  authors: [{ name: "벨시엔 서밋" }],
  creator: "벨시엔 서밋",
  publisher: "벨시엔 서밋",
  icons: { icon: "/orysen-logo.png", shortcut: "/orysen-logo.png" },
  keywords: ["벨시엔 서밋", "ORYSEN", "오리센", "생활망", "계약", "보장"],
  description: "주거, 의료, 금융, 가족 지원을 하나의 안전한 생활망으로 연결하는 오리센 공식 사이트입니다.",
  alternates: { canonical: "/velsien-summit/corporate/orysen" },
  openGraph: {
    title: "ORYSEN | 오리센",
    description: "주거, 의료, 금융, 가족 지원을 하나의 안전한 생활망으로 연결하는 오리센 공식 사이트입니다.",
    url: "/velsien-summit/corporate/orysen",
    siteName: "ORYSEN",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/orysen-logo.png", alt: "오리센 공식 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORYSEN | 오리센",
    description: "주거, 의료, 금융, 가족 지원을 하나의 안전한 생활망으로 연결하는 오리센 공식 사이트입니다.",
    images: [{ url: "/orysen-logo.png", alt: "오리센 공식 로고" }],
  },
};

export default function OrysenPage() {
  return <CorporateExperience company="orysen" />;
}
