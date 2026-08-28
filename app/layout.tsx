import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteBrand } from "./_components/brand";

export const metadata: Metadata = {
  metadataBase: new URL(siteBrand.origin),
  title: {
    default: "에르시안",
    template: "%s | 에르시안",
  },
  description: "에르시안 공식 홈페이지입니다.",
  applicationName: siteBrand.name,
  keywords: [
    "ERSIYAN",
    "에르시안",
    "MINE LOGIC",
    "마인로직",
    "게임 개발",
    "인디 게임",
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
    title: "에르시안",
    description: "에르시안 공식 홈페이지입니다.",
    images: [
      {
        url: siteBrand.socialCardPath,
        width: 1200,
        height: 630,
        alt: "에르시안 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "에르시안",
    description: "에르시안 공식 홈페이지입니다.",
    images: [siteBrand.socialCardPath],
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
