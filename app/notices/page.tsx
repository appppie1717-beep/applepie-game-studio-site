/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page links load complete static documents. */
import type { Metadata } from "next";
import { formatNoticeDate, noticeHref, notices } from "../_components/notices";
import { NoticeLayout } from "./NoticeLayout";
import styles from "./notices.module.css";

const title = "공지사항 | 에르시안";
const description = "에르시안 공식 공지사항입니다. 버츄얼 크리에이터 모집 상태, 지원서·개인정보처리방침 변경, MINE LOGIC 업데이트와 홈페이지 운영 소식을 게시일별로 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/notices" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/notices",
    title,
    description,
    images: [{ url: "/ersiyan-brand-social.jpg", width: 1200, height: 630, alt: "에르시안(ERSIYAN) 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/ersiyan-brand-social.jpg", alt: "에르시안(ERSIYAN) 로고" }],
  },
};

export default function Notices() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://ersiyan.com/notices#webpage",
    url: "https://ersiyan.com/notices",
    name: title,
    description,
    inLanguage: "ko-KR",
    datePublished: "2026-09-28",
    dateModified: "2026-10-02",
    isPartOf: { "@id": "https://ersiyan.com/#website" },
    publisher: { "@type": "Organization", "@id": "https://ersiyan.com/#organization", name: "에르시안", url: "https://ersiyan.com/" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: notices.map((notice, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: notice.title,
        url: `https://ersiyan.com${noticeHref(notice)}`,
      })),
    },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "에르시안", item: "https://ersiyan.com/" },
      { "@type": "ListItem", position: 2, name: "공지사항", item: "https://ersiyan.com/notices" },
    ],
  };

  return (
    <NoticeLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className={styles.indexInner}>
        <section className={styles.hero} aria-labelledby="notices-title">
          <nav className={styles.breadcrumbs} aria-label="현재 위치">
            <a href="/">홈</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">공지사항</span>
          </nav>
          <p className="eyebrow">ERSIYAN NEWS</p>
          <h1 id="notices-title">공지사항</h1>
          <p>모집, 게임 업데이트, 홈페이지 공지.</p>
        </section>
        <section className={styles.noticeIndex} aria-label="공지 목록">
          <ul className={styles.list}>
            {notices.map((notice) => (
              <li key={notice.slug}>
                <a className={styles.row} href={noticeHref(notice)}>
                  <div className={styles.rowMeta}>
                    <time dateTime={notice.date}>{formatNoticeDate(notice.date)}</time>
                    <span>{notice.category}</span>
                  </div>
                  <div className={styles.rowContent}>
                    <h2>{notice.title}</h2>
                    <p>{notice.summary}</p>
                  </div>
                  <span className={styles.rowArrow} aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </NoticeLayout>
  );
}
