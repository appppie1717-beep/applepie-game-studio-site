import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "analytics-correction-2026-09-05";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
