/* eslint-disable @next/next/no-html-link-for-pages -- Cross-page links load complete static documents. */
import type { ReactNode } from "react";
import { BrandLockup } from "../_components/BrandLockup";
import { ErFooter } from "../_components/ErFooter";
import styles from "./notices.module.css";

export function NoticeLayout({ children }: { children: ReactNode }) {
  return (
    <div id="top" className={styles.page}>
      <a className="skip-link" href="#notice-content">본문으로 바로가기</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <BrandLockup />
          <nav className={styles.navigation} aria-label="주요 페이지">
            <a href="/">회사 정보</a>
            <a href="/games">게임부</a>
            <a href="/virtual">버츄얼부</a>
            <a href="/notices" aria-current="page">공지사항</a>
          </nav>
        </div>
      </header>
      <main id="notice-content" tabIndex={-1}>{children}</main>
      <ErFooter context="company" />
    </div>
  );
}
