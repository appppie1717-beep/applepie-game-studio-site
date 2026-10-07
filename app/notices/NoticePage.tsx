/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page links load complete static documents. */
import type { Metadata } from "next";
import { formatNoticeDate, getNotice, noticeHref } from "../_components/notices";
import { NoticeLayout } from "./NoticeLayout";
import styles from "./notices.module.css";

export function noticeMetadata(slug: string): Metadata {
  const notice = getNotice(slug);
  const title = `${notice.title} | 공지사항 | 에르시안`;
  return {
    title: { absolute: title },
    description: notice.summary,
    alternates: { canonical: noticeHref(notice) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: "ERSIYAN",
      url: noticeHref(notice),
      title,
      description: notice.summary,
      publishedTime: notice.date,
      modifiedTime: "2026-09-29",
      images: [{ url: "/ersiyan-brand-social.jpg", width: 1200, height: 630, alt: "에르시안(ERSIYAN) 로고" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: notice.summary,
      images: [{ url: "/ersiyan-brand-social.jpg", alt: "에르시안(ERSIYAN) 로고" }],
    },
  };
}

export function NoticePage({ slug }: { slug: string }) {
  const notice = getNotice(slug);
  const url = `https://ersiyan.com${noticeHref(notice)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: notice.title,
    description: notice.summary,
    inLanguage: "ko-KR",
    datePublished: notice.date,
    dateModified: "2026-09-29",
    mainEntityOfPage: url,
    author: { "@type": "Organization", "@id": "https://ersiyan.com/#organization", name: "에르시안", url: "https://ersiyan.com/" },
    publisher: { "@type": "Organization", "@id": "https://ersiyan.com/#organization", name: "에르시안", url: "https://ersiyan.com/" },
    image: "https://ersiyan.com/ersiyan-brand-social.jpg",
    isPartOf: { "@id": "https://ersiyan.com/notices#webpage" },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "에르시안", item: "https://ersiyan.com/" },
      { "@type": "ListItem", position: 2, name: "공지사항", item: "https://ersiyan.com/notices" },
      { "@type": "ListItem", position: 3, name: notice.title, item: url },
    ],
  };

  return (
    <NoticeLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <article className={styles.article} aria-labelledby="notice-title">
        <nav className={styles.breadcrumbs} aria-label="현재 위치">
          <a href="/">홈</a>
          <span aria-hidden="true">/</span>
          <a href="/notices">공지 목록</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">현재 글</span>
        </nav>
        <header className={styles.articleHeader}>
          <div className={styles.meta}>
            <span className={styles.category}>{notice.category}</span>
            <time dateTime={notice.date}>{formatNoticeDate(notice.date)}</time>
          </div>
          <h1 id="notice-title">{notice.title}</h1>
        </header>
        <div className={styles.articleBody}>
          {notice.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {notice.links.length > 0 && <section className={styles.related} aria-labelledby="notice-related-title">
          <h2 id="notice-related-title">관련 링크</h2>
          <ul>
            {notice.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} rel={link.href.startsWith("https://") ? "noreferrer" : undefined}>
                  {link.label}<span aria-hidden="true">{link.href.startsWith("https://") ? "↗" : "→"}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>}
      </article>
    </NoticeLayout>
  );
}
