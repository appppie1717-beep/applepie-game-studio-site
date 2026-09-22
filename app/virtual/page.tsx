import type { Metadata } from "next";
import { DivisionHomePage, virtualDescription } from "../_components/HomeContent";

const virtualTitle = "에르시안 버츄얼 0기 버튜버 모집 | ERSIYAN VIRTUAL";

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
        url: "/ersiyan-virtual-gen0-social-card.png",
        width: 1731,
        height: 909,
        alt: "에르시안 버츄얼 0기 크리에이터 모집 안내",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: virtualTitle,
    description: virtualDescription,
    images: [
      {
        url: "/ersiyan-virtual-gen0-social-card.png",
        alt: "에르시안 버츄얼 0기 크리에이터 모집 안내",
      },
    ],
  },
};

export default function VirtualHome() {
  return <DivisionHomePage division="virtual" />;
}
