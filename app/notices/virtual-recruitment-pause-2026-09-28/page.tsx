import { noticeMetadata, NoticePage } from "../NoticePage";

const slug = "virtual-recruitment-pause-2026-09-28";

export const metadata = noticeMetadata(slug);

export default function NoticeDetail() {
  return <NoticePage slug={slug} />;
}
