import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteBrand } from "./_components/brand";

const homeSocialTitle = "에르시안 | ERSIYAN";
const homeDescription =
  "에르시안은 MINE LOGIC을 출시하고 VELSIEN SUMMIT을 개발하는 한국 1인 인디 게임 스튜디오입니다. 단계별 힌트와 20단계 훈련을 갖춘 지뢰찾기 게임, 개발 중인 모바일 수집형 2D SRPG의 소식과 화면을 확인하세요.";

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
    "MINE LOGIC",
    "마인로직",
    "지뢰찾기 게임",
    "1인 인디 게임 스튜디오",
    "게임 개발",
    "인디 게임",
    "VELSIEN SUMMIT",
    "벨시엔 서밋",
    "모바일 2D SRPG",
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
        alt: "MINE LOGIC과 VELSIEN SUMMIT을 만드는 에르시안 로고",
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
        alt: "MINE LOGIC과 VELSIEN SUMMIT을 만드는 에르시안 로고",
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
      <body>{children}</body>
    </html>
  );
}
