import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "business-name-2026-08-31";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
