import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "hosting-change-2026-08-23";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
