import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "mine-logic-update-2026-08-28";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
