export type SiteNotice = {
  slug: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  paragraphs: readonly string[];
  links: readonly { href: string; label: string }[];
  historical: boolean;
};

export const notices: readonly SiteNotice[] = [
  {
    slug: "virtual-recruitment-pause-2026-09-28",
    date: "2026-09-28",
    title: "버츄얼 모집 일시 중단",
    category: "모집",
    summary: "내부 준비로 버츄얼 크리에이터 모집을 일시 중단해요. 모집을 다시 시작하면 공지할게요.",
    paragraphs: [
      "내부 준비를 위해 버츄얼 크리에이터 모집을 일시 중단해요.",
      "모집을 다시 시작하면 공지할게요.",
    ],
    links: [],
    historical: false,
  },
  {
    slug: "application-form-2026-09-22",
    date: "2026-09-22",
    title: "지원서를 좀 더 간단하게 바꿨어요",
    category: "모집",
    summary: "지원서를 Google 설문지로 받도록 바꾸고 지원 항목을 줄였어요.",
    paragraphs: [
      "2026년 9월 22일, 지원서와 음성 파일을 Google 설문지로 받도록 바꿨어요. 지원 항목을 줄였고, 기본 항목은 닉네임, 생년월일, 성별, 회신 이메일, 방송 가능 시간대, 현재 소속사 여부, 음성 파일의 7개예요.",
      "Google 설문지와 Drive의 자료 처리 기준을 같은 날 개인정보처리방침에 반영했어요. 기존 이메일 지원 자료의 심사 목적과 삭제 기준은 유지해요.",
    ],
    links: [
      { href: "/notices/virtual-recruitment-pause-2026-09-28", label: "현재 모집 공지" },
      { href: "/privacy/archive/2026-09-22", label: "2026.09.22 개인정보처리방침" },
      { href: "/privacy/archive/2026-09-19", label: "2026.09.19 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
  {
    slug: "recruitment-privacy-2026-09-19",
    date: "2026-09-19",
    title: "지원할때 자료?",
    category: "개인정보",
    summary: "지원 자료와 선발 기록의 사용 목적, 보관 기간, 지원 철회 방법을 방침에 반영했어요.",
    paragraphs: [
      "첫 소속 버츄얼 크리에이터 모집에 맞춰 이메일 지원서, 음성 파일, 선발 기록의 사용 목적과 보관 기간을 개인정보처리방침에 반영했어요. 지원 철회 방법도 추가했어요.",
      "일반 문의와 홈페이지 방문 정보에 대한 내용은 유지했어요.",
      "당시에는 이메일로 지원서를 받았어요. 2026년 9월 22일부터 Google 설문지로 바꿨어요.",
    ],
    links: [
      { href: "/notices/virtual-recruitment-pause-2026-09-28", label: "현재 모집 공지" },
      { href: "/notices/application-form-2026-09-22", label: "2026.09.22 지원서 변경 공지" },
      { href: "/privacy/archive/2026-09-19", label: "2026.09.19 개인정보처리방침" },
      { href: "/privacy/archive/2026-09-05", label: "2026.09.05 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
  {
    slug: "analytics-correction-2026-09-05",
    date: "2026-09-05",
    title: "방문 통계 설명을 바로잡았어요",
    category: "개인정보",
    summary: "이미 사용하던 Cloudflare Web Analytics의 방문·성능 통계 설명을 정정했어요.",
    paragraphs: [
      "이미 사용하던 Cloudflare Web Analytics의 방문·성능 통계 설명을 정정했어요. 새로운 분석 도구를 추가한 건 아니에요.",
      "측정 항목과 쿠키·브라우저 저장소 사용 여부를 개인정보처리방침에 반영했어요. 개인정보 처리 사업자와 문의처는 그대로예요.",
    ],
    links: [
      { href: "/privacy/archive/2026-09-05", label: "2026.09.05 개인정보처리방침" },
      { href: "/privacy/archive/2026-08-31", label: "2026.08.31 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
  {
    slug: "business-name-2026-08-31",
    date: "2026-08-31",
    title: "사업자명. 에르시안",
    category: "운영",
    summary: "사업자명을 애플파이에서 에르시안으로 바꿨어요. 대표자와 사업자등록번호는 그대로예요.",
    paragraphs: [
      "개인사업자명을 애플파이에서 에르시안으로 바꿨어요. 대표자와 사업자등록번호는 그대로예요.",
      "개인정보 처리 목적·범위, 문의처, 호스팅 제공자는 그대로예요. 2026년 8월 28일 방침을 포함한 이전 방침은 보관본에서 확인할 수 있어요.",
    ],
    links: [
      { href: "/privacy/archive/2026-08-31", label: "2026.08.31 개인정보처리방침" },
      { href: "/privacy/archive/2026-08-28", label: "2026.08.28 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
  {
    slug: "mine-logic-update-2026-08-28",
    date: "2026-08-28",
    title: "MINE LOGIC 1.3.3, 이렇게 바뀌었어요",
    category: "게임",
    summary: "에르시안 로고와 제작자명을 반영하고 개인정보처리방침 링크를 바꿨어요. 다크 모드 글자도 더 잘 보이게 했어요.",
    paragraphs: [
      "2026년 8월 28일, MINE LOGIC v1.3.3을 Google Play 스토어에 업데이트했어요.",
      "에르시안(ERSIYAN) 로고와 제작자명을 반영하고 개인정보처리방침 링크를 바꿨어요. 다크 모드에서 일부 글자가 더 잘 보이도록 바꿨어요.",
    ],
    links: [
      { href: "/mine-logic", label: "MINE LOGIC" },
      { href: "https://play.google.com/store/apps/details?id=com.applepie.minelogic", label: "Google Play" },
    ],
    historical: true,
  },
  {
    slug: "brand-domain-2026-08-28",
    date: "2026-08-28",
    title: "에르시안 출범!",
    category: "운영",
    summary: "브랜드명을 에르시안(ERSIYAN)으로 바꾸고 홈페이지를 ersiyan.com으로 옮겼어요.",
    paragraphs: [
      "애플파이에서 운영하던 브랜드명을 에르시안(ERSIYAN)으로 바꿨어요. 공식 홈페이지 주소도 applepie.im에서 ersiyan.com으로 옮겼어요.",
      "당시 사업자명은 애플파이였고, 사업자명 변경은 2026년 8월 31일에 반영했어요. 이 공지 시점에는 개인정보 처리 사업자, 처리 목적·범위, 문의처, 호스팅 제공자를 유지했어요. 이전 방침은 보관본에서 확인할 수 있어요.",
    ],
    links: [
      { href: "/notices/business-name-2026-08-31", label: "2026.08.31 사업자명 변경 공지" },
      { href: "/privacy/archive/2026-08-28", label: "2026.08.28 개인정보처리방침" },
      { href: "/privacy/archive/2026-08-23", label: "2026.08.23 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
  {
    slug: "hosting-change-2026-08-23",
    date: "2026-08-23",
    title: "홈페이지 이전",
    category: "운영",
    summary: "OpenAI Sites에서 Cloudflare Workers Static Assets로 홈페이지 호스팅을 이전하는 공지예요.",
    paragraphs: [
      "2026년 8월 23일, applepie.im 홈페이지의 호스팅을 OpenAI Sites에서 Cloudflare Workers Static Assets로 이전한다고 공지했어요. 관련 방침은 공식 도메인이 Cloudflare에 연결되는 시점부터 적용해요.",
      "홈페이지 화면·기능과 직접 수집하는 정보의 범위는 유지했어요. 이메일 문의 자료의 사용 목적과 보관 기간도 그대로예요. 이전 방침은 보관본에서 확인할 수 있어요.",
    ],
    links: [
      { href: "/privacy/archive/2026-08-23", label: "2026.08.23 개인정보처리방침" },
      { href: "/privacy/archive/2026-08-22", label: "2026.08.22 개인정보처리방침" },
      { href: "/privacy", label: "현재 개인정보처리방침" },
    ],
    historical: true,
  },
];

export function noticeHref(notice: Pick<SiteNotice, "slug">): string {
  return `/notices/${notice.slug}`;
}

export function formatNoticeDate(date: string): string {
  return date.replaceAll("-", ".");
}

export function getNotice(slug: string): SiteNotice {
  const notice = notices.find((item) => item.slug === slug);
  if (!notice) throw new Error(`Unknown notice: ${slug}`);
  return notice;
}
