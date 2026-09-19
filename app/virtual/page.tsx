import type { Metadata } from "next";
import { DivisionHomePage, virtualDescription } from "../_components/HomeContent";

const virtualTitle = "에르시안 버츄얼 0기 크리에이터 모집 | ERSIYAN VIRTUAL";

export const metadata: Metadata = {
  title: { absolute: virtualTitle },
  description: virtualDescription,
  alternates: { canonical: "/virtual" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/virtual",
    title: virtualTitle,
    description: virtualDescription,
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
    title: virtualTitle,
    description: virtualDescription,
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
};

export default function VirtualHome() {
  return <DivisionHomePage division="virtual" />;
}
