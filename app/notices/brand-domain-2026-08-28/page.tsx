import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "brand-domain-2026-08-28";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
