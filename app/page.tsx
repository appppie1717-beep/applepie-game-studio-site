import type { Metadata } from "next";
import { DivisionHomePage, homeDescription } from "./_components/HomeContent";

const homeTitle = "에르시안(ERSIYAN) · 게임 개발과 운영";
const homeSocialTitle = homeTitle;
export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/",
    title: homeSocialTitle,
    description: homeDescription,
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSocialTitle,
    description: homeDescription,
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
};

export default function Home() {
  return <DivisionHomePage division="games" />;
}
