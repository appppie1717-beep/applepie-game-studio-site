import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "애플파이 게임 스튜디오",
    template: "%s | 애플파이 게임 스튜디오",
  },
  description:
    "MINE LOGIC을 시작으로 생각하는 재미가 오래 남는 게임을 만드는 독립 게임 스튜디오입니다.",
  applicationName: "ApplePie Game Studio",
  keywords: [
    "애플파이 게임 스튜디오",
    "ApplePie Game Studio",
    "MINE LOGIC",
    "마인로직",
    "인디 게임",
  ],
  authors: [{ name: "ApplePie Game Studio" }],
  creator: "ApplePie Game Studio",
  publisher: "ApplePie Game Studio",
  icons: {
    icon: "/images/brand/applepie-logo-original.png",
    shortcut: "/images/brand/applepie-logo-original.png",
    apple: "/images/mine-logic/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ApplePie Game Studio",
    title: "애플파이 게임 스튜디오",
    description:
      "작은 규칙에서 오래 남는 플레이를 만드는 독립 게임 스튜디오입니다.",
    images: [
      {
        url: "/applepie-social-card.png",
        width: 1200,
        height: 630,
        alt: "ApplePie Game Studio 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "애플파이 게임 스튜디오",
    description:
      "작은 규칙에서 오래 남는 플레이를 만드는 독립 게임 스튜디오입니다.",
    images: ["/applepie-social-card.png"],
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
