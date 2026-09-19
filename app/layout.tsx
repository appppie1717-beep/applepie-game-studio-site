import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteBrand } from "./_components/brand";
import { legacyDivisionRouteScript } from "./_components/legacy-division-route";

const homeSocialTitle = "에르시안 | ERSIYAN";
const homeDescription =
  "에르시안(ERSIYAN)은 ERSIYAN GAMES에서 게임을 개발·운영하고, ERSIYAN VIRTUAL에서 첫 소속 버츄얼 크리에이터 한 분을 모집합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteBrand.origin),
  title: {
    default: "에르시안",
    template: "%s | 에르시안",
  },
  description: homeDescription,
  applicationName: siteBrand.name,
  keywords: [
    "ERSIYAN",
    "에르시안",
    "ERSIYAN GAMES",
    "ERSIYAN VIRTUAL",
    "버츄얼 크리에이터",
    "디지털 캐릭터",
    "MINE LOGIC",
    "마인로직",
    "지뢰찾기 게임",
    "1인 인디 게임 스튜디오",
    "게임 개발",
    "인디 게임",
    "VELSIEN SUMMIT",
    "벨시엔 서밋",
    "모바일 캐릭터 수집형 전략 RPG",
  ],
  authors: [{ name: siteBrand.name }],
  creator: siteBrand.name,
  publisher: siteBrand.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/ersiyan-mark.svg",
    shortcut: "/ersiyan-mark.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: siteBrand.name,
    url: "/",
    title: homeSocialTitle,
    description: homeDescription,
    images: [
      {
        url: siteBrand.socialCardPath,
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
        url: siteBrand.socialCardPath,
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#091324",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="baefeb696d0dddb453f1d3edcb9d5149aeda089c" />
        <style>{"html[data-division-redirect] body{visibility:hidden}"}</style>
        <script
          id="legacy-division-route"
          dangerouslySetInnerHTML={{ __html: legacyDivisionRouteScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
