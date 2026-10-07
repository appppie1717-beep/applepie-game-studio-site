import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "application-form-2026-09-22";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
