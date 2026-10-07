import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "recruitment-privacy-2026-09-19";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
