import type { Metadata } from "next";
import { DivisionHomePage, gamesDescription } from "../_components/HomeContent";

const gamesTitle = "에르시안 게임부 · 게임 개발과 운영 | ERSIYAN GAMES";

export const metadata: Metadata = {
  title: { absolute: gamesTitle },
  description: gamesDescription,
  alternates: { canonical: "/games" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/games",
    title: gamesTitle,
    description: gamesDescription,
    images: [
      {
        url: "/ersiyan-brand-social.jpg",
        width: 1200,
        height: 630,
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: gamesTitle,
    description: gamesDescription,
    images: [
      {
        url: "/ersiyan-brand-social.jpg",
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
};

export default function GamesHome() {
  return <DivisionHomePage division="games" />;
}
