import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CorporateExperience, { companies, type CompanyKey } from "../CorporateExperience";

type PageProps = { params: Promise<{ company: string }> };

export function generateStaticParams() {
  return Object.keys(companies).map((company) => ({ company }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { company } = await params;
  const config = companies[company as CompanyKey];
  if (!config) return {};
  return {
    title: { absolute: `${config.name} | ${config.korean} · 벨시엔 서밋` },
    applicationName: "벨시엔 서밋",
    authors: [{ name: "벨시엔 서밋" }],
    creator: "벨시엔 서밋",
    publisher: "벨시엔 서밋",
    icons: { icon: `/${company}-logo.png`, shortcut: `/${company}-logo.png` },
    description: config.description,
    alternates: { canonical: `/velsien-summit/corporate/${company}` },
    openGraph: {
      title: `${config.name} | ${config.korean}`,
      description: config.description,
      url: `/velsien-summit/corporate/${company}`,
      siteName: config.name,
      type: "website",
      locale: "ko_KR",
      images: [{ url: `/${company}-logo.png`, alt: `${config.korean} 공식 로고` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} | ${config.korean}`,
      description: config.description,
      images: [{ url: `/${company}-logo.png`, alt: `${config.korean} 공식 로고` }],
    },
  };
}

export default async function CorporatePage({ params }: PageProps) {
  const { company } = await params;
  if (!companies[company as CompanyKey]) notFound();
  return <CorporateExperience company={company as CompanyKey} />;
}
