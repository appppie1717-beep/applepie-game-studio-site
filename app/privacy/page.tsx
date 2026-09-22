/* eslint-disable @next/next/no-html-link-for-pages -- vinext production Link navigation fails in this deployment target */
import type { Metadata } from "next";
import { BrandLockup } from "../_components/BrandLockup";
import { ErFooter } from "../_components/ErFooter";

export const metadata: Metadata = {
  title: { absolute: "개인정보처리방침 | 에르시안" },
  description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "ERSIYAN",
    url: "/privacy",
    title: "개인정보처리방침 | 에르시안",
    description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "개인정보처리방침 | 에르시안",
    description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
    images: [
      {
        url: "/ersiyan-social-card.jpg",
        alt: "에르시안(ERSIYAN) 로고",
      },
    ],
  },
};

const privacyPolicyStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://ersiyan.com/privacy#webpage",
  url: "https://ersiyan.com/privacy",
  name: "개인정보처리방침 | 에르시안",
  description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
  inLanguage: "ko-KR",
  datePublished: "2026-08-22",
  dateModified: "2026-09-22",
  isPartOf: { "@id": "https://ersiyan.com/#website" },
  publisher: { "@id": "https://ersiyan.com/#organization" },
};

const policySections = [
  ["forms-notice", "2026년 9월 22일 지원서 변경"],
  ["recruitment-notice", "2026년 9월 19일 모집 지원 안내"],
  ["change-notice", "2026년 9월 5일 안내 정정"],
  ["business-name-notice", "2026년 8월 31일 사업자명 변경"],
  ["overview", "방침 개요"],
  ["collection", "처리하는 정보"],
  ["hosting", "호스팅과 국외 처리"],
  ["application-service", "지원서와 파일의 외부 서비스 처리"],
  ["purpose", "처리 목적과 보유"],
  ["cookies", "쿠키와 외부 서비스"],
  ["rights", "이용자 권리와 문의"],
  ["apps", "게임 앱 정책"],
  ["changes", "방침 변경"],
];

export default function PrivacyPolicy() {
  return (
    <div id="top" className="privacy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyPolicyStructuredData),
        }}
      />
      <a className="skip-link" href="#policy-content">
        본문으로 바로가기
      </a>

      <header className="privacy-header">
        <div className="header-inner">
          <BrandLockup />
          <a className="back-link" href="/">
            ← 홈페이지로 돌아가기
          </a>
        </div>
      </header>

      <main id="policy-content">
        <section className="privacy-hero section-pad" aria-labelledby="policy-title">
          <p className="eyebrow">PRIVACY POLICY</p>
          <h1 id="policy-title">개인정보처리방침</h1>
          <p>
            에르시안은 필요한 정보만 최소한으로 처리하고, 이용자가
            이해하기 쉬운 방식으로 안내하는 것을 원칙으로 합니다.
          </p>
          <span className="draft-note">
            최초 시행일 2026년 8월 22일 · 최근 변경일 및 시행일 2026년 9월 22일
          </span>
        </section>

        <div className="policy-content section-pad">
          <ol className="policy-index" aria-label="개인정보처리방침 목차">
            {policySections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>

          <div className="policy-sections">
            <section id="forms-notice" className="policy-change-notice" aria-labelledby="forms-notice-title">
              <p className="policy-change-kicker">2026년 9월 22일 변경 안내</p>
              <h2 id="forms-notice-title">간단한 지원서와 음성 파일로 접수합니다</h2>
              <p>
                버츄얼 크리에이터 모집을 Google 설문지로 접수합니다. 지원 항목을
                닉네임, 생년월일, 성별, 회신 이메일, 방송 가능 시간대,
                현재 소속사 여부와 음성 파일로 간소화하고,
                Google 설문지·Drive에서의 자료 처리를 아래에 안내합니다.
                이전에 이메일로 접수한 지원 자료에도 기존의 심사 목적과 삭제 기준을 유지합니다.
              </p>
              <p>
                변경 전 방침은{" "}
                <a href="/privacy/archive/2026-09-19">
                  2026년 9월 19일 개인정보처리방침 보관본
                </a>
                에서 열람할 수 있습니다.
              </p>
            </section>

            <section id="recruitment-notice" className="policy-change-notice" aria-labelledby="recruitment-notice-title">
              <p className="policy-change-kicker">2026년 9월 19일 변경 안내</p>
              <h2 id="recruitment-notice-title">에르시안 버츄얼 크리에이터 모집 지원 정보</h2>
              <p>
                첫 소속 버츄얼 크리에이터 모집을 위해 지원자가 이메일로 제출한
                지원서와 음성 파일, 이후 선발 과정의 기록을 처리하는 목적과 기간을
                아래에 추가했습니다. 일반 문의와 홈페이지 방문 정보에 관한 기존
                안내는 유지합니다.
              </p>
              <p>
                변경 전 방침은{" "}
                <a href="/privacy/archive/2026-09-05">
                  2026년 9월 5일 개인정보처리방침 보관본
                </a>
                에서 열람할 수 있습니다.
              </p>
            </section>

            <section id="change-notice" className="policy-change-notice" aria-labelledby="change-notice-title">
              <p className="policy-change-kicker">2026년 9월 5일 안내 정정</p>
              <h2 id="change-notice-title">방문·성능 통계 안내 정정</h2>
              <p>
                홈페이지에서 이미 작동 중인 Cloudflare Web Analytics의 방문·성능
                측정에 대한 설명을 바로잡았습니다. 이번 정정으로 새로운 방문자 분석
                도구를 추가한 것은 아닙니다.
              </p>
              <p>
                측정 항목과 쿠키·브라우저 저장소 사용 여부를 아래에 명시했습니다.
                개인정보 처리 주체와 문의 창구는 그대로이며, 이전 방침은 계속 열람할
                수 있습니다.
              </p>
              <p>
                <a href="/privacy/archive/2026-08-31">
                  2026년 8월 31일 개인정보처리방침 보기
                </a>
              </p>
            </section>

            <section id="business-name-notice" className="policy-change-notice" aria-labelledby="business-name-notice-title">
              <p className="policy-change-kicker">2026년 8월 31일 변경 안내</p>
              <h2 id="business-name-notice-title">사업자명 변경</h2>
              <p>
                개인정보 처리 주체인 개인사업자의 상호가 애플파이에서
                에르시안으로 변경되었습니다. 대표자와 사업자등록번호는 동일합니다.
              </p>
              <p>
                이번 변경은 사업자명 변경을 반영한 것으로, 개인정보 처리 목적과 범위,
                문의 창구, 호스팅 제공자는 변경되지 않았습니다. 2026년 8월 28일
                변경본과 이전 방침은 계속 열람할 수 있습니다.
              </p>
              <p>
                <a href="/privacy/archive/2026-08-28">
                  2026년 8월 28일 개인정보처리방침 보기
                </a>
              </p>
            </section>

            <section id="overview" aria-labelledby="overview-title">
              <h2 id="overview-title">1. 방침 개요</h2>
              <p>
                이 방침은 에르시안 공식 홈페이지와 에르시안 버츄얼 크리에이터
                모집 지원서와 관련 문의에 적용됩니다.
                홈페이지와 각 게임 앱은 처리하는 정보와 기능이 다르므로 게임별
                개인정보처리방침은 별도로 제공합니다.
              </p>
              <p>
                이 홈페이지의 개인정보 처리자는 개인사업자 에르시안(대표자 탁진,
                사업자등록번호 206-43-62580)입니다.
              </p>
            </section>

            <section id="collection" aria-labelledby="collection-title">
              <h2 id="collection-title">2. 처리하는 정보</h2>
              <p>
                홈페이지 자체에는 회원가입 기능이나 지원자 데이터베이스가 없습니다.
                버츄얼 크리에이터 지원 버튼을 누르면 외부 서비스인 Google 설문지로
                이동합니다.
              </p>
              <p>
                이용자가 이메일로 문의하는 경우, 발신 이메일 주소와 메일에 기재한 이름,
                문의 내용, 첨부파일을 확인할 수 있습니다. 홈페이지 제공 과정에서는
                Cloudflare가 IP 주소, 트래픽 라우팅 정보, 시스템 구성 정보와 접속 요청
                정보를 처리할 수 있습니다.
              </p>
              <p>
                지원서에서 필수로 받는 정보는 활동명 또는 닉네임, 생년월일, 성별(남자·여자),
                회신받을 이메일 주소, 방송 가능 시간대, 현재 소속사 여부(없음·있음·확인 필요),
                3~5분 음성 파일 1개입니다.
                생년월일은 만 19세 이상인지 확인하는 데 사용합니다.
                접수 시각과 개인정보 동의 응답도 함께 기록됩니다.
              </p>
              <p>
                방송한 적이 있는 지원자가 채널 링크를 제공하면 공개된 방송 활동을
                확인하여 선발 심사의 참고 자료로 사용합니다. 채널 링크는 지원자가
                선택하여 제공하는 정보이며, 제공하지 않아도 지원할 수 있습니다.
                제공한 링크의 보유 기간과 삭제 기준은 다른 지원 자료와 같습니다.
              </p>
              <p>
                온라인 인터뷰와 비공개 방송 테스트에 참여하면 진행과 평가에 필요한
                기록을 처리할 수 있으며, 추가 정보를 요청하거나 녹음·녹화가 필요하면
                먼저 범위와 목적을 안내합니다.
              </p>
            </section>

            <section id="hosting" aria-labelledby="hosting-title">
              <h2 id="hosting-title">3. 호스팅과 국외 처리</h2>
              <p>
                홈페이지의 정적 파일 제공, 콘텐츠 전송, HTTPS와 보안 유지를 위해 미국
                소재 Cloudflare, Inc.의 Workers Static Assets, CDN과 DNS 서비스를
                사용합니다. 접속 과정에서 IP 주소, 트래픽 라우팅 정보, 시스템 구성
                정보와 요청 정보가 암호화된 네트워크를 통해 자동 처리될 수 있습니다.
              </p>
              <p>
                Cloudflare는 미국과 유럽경제지역을 중심으로 정보를 저장하고 글로벌
                서비스 운영 국가에서 정보를 전송하거나 접근할 수 있다고 안내합니다.
                구체적인 처리와 보유는
                {" "}
                <a
                  href="https://www.cloudflare.com/ko-kr/privacypolicy/"
                  rel="noreferrer"
                >
                  Cloudflare 개인정보 취급방침
                </a>
                을 따릅니다.
              </p>
              <p>
                홈페이지의 이용 현황과 로딩 속도, 반응 속도, 화면 배치의 안정성을
                확인하기 위해 Cloudflare Web Analytics를 사용합니다. 페이지 경로,
                유입 경로, 국가, 브라우저·기기 종류와 성능 지표가 Cloudflare에
                전송되어 통계로 제공됩니다. 측정 항목은
                {" "}
                <a
                  href="https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/"
                  rel="noreferrer"
                >
                  Cloudflare 통계 항목 안내
                </a>
                와
                {" "}
                <a
                  href="https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/"
                  rel="noreferrer"
                >
                  웹 성능 측정 안내
                </a>
                에서 확인할 수 있습니다.
              </p>
              <p>
                운영자는 Cloudflare의 개별 방문자 요청 로그를 홈페이지
                데이터베이스에 수집하거나 내려받아
                보관하지 않습니다. 접속 정보의 자동 처리를 원하지 않으면 홈페이지에
                접속하지 않는 방법으로 거부할 수 있으나 이 경우 홈페이지를 이용할 수
                없습니다.
              </p>
              <p>
                안정화 기간에는 기존 OpenAI Sites 버전을 장애 복구용으로만 보존합니다.
                OpenAI Sites 주소에 직접 접속하거나 장애 복구로 되돌린 경우에는 해당
                서비스와 그 기반 서비스가 IP 주소, 브라우저 정보와 접속 기록을 처리할
                수 있습니다.
              </p>
            </section>

            <section id="application-service" aria-labelledby="application-service-title">
              <h2 id="application-service-title">4. 지원서와 파일의 외부 서비스 처리</h2>
              <p>
                지원서 접수와 저장에 Google LLC의 Google 설문지와 Google Drive를
                사용합니다. 입력한 응답은 설문지에 저장되고, 업로드한 음성 파일은
                운영자가 관리하는 Drive 폴더에 저장됩니다. 지원서와 파일은 공개하지
                않으며, 선발 업무에 필요한 담당자만 접근하도록 권한을 제한합니다.
              </p>
              <p>
                파일 업로드에는 Google 계정 로그인이 필요합니다. 파일을 업로드하고
                설문지를 제출하면 로그인한 Google 계정의 이름, 이메일 주소와
                프로필 사진이 함께 기록됩니다. 계정 정보와 접속·기기 정보 등
                Google 서비스 자체의 정보 처리는
                Google의 개인정보처리방침을 따릅니다. 에르시안의 회신에는 지원서에
                직접 적은 이메일 주소를 사용합니다.
              </p>
              <p>
                Google LLC는 미국 소재 회사이며, Google은 전 세계 서버에서
                거주 국가 밖으로 정보를 전송·처리할 수 있다고 안내합니다.
                이 지원서에 사용하는 일반 Google 설문지·Drive의 저장 국가를
                에르시안이 지정하거나 개별 파일의 실제 저장 위치를 확인할 수는 없습니다.
              </p>
              <ul>
                <li>
                  처리 서비스와 연락처는 Google LLC의 Google 설문지·Drive이며,
                  Google의 개인정보 문의 주소는 googlekrsupport@google.com입니다.
                </li>
                <li>
                  전송 항목은 지원자가 작성한 지원서 응답과 제공한 채널 링크,
                  동의 응답, 접수 시각, 업로드한 음성 파일과 파일 업로드에 연결되는
                  Google 계정의 이름·이메일 주소·프로필 사진입니다.
                  작성·업로드·제출 과정에서 인터넷을 통해
                  Google 시스템으로 전송되며 지원서 접수·저장·검토에 사용됩니다.
                </li>
                <li>
                  에르시안의 보유 기간과 삭제 기준은 다음 항목에 따릅니다.
                  Google 시스템의 백업 등에서 삭제가 완료되는 시점은 Google의
                  보관 정책에 따라 달라질 수 있습니다.
                </li>
                <li>
                  Google 서비스를 통한 처리에 동의하지 않으면 설문지를 제출하지
                  않을 수 있습니다. 이 경우 Google 설문지를 통한 접수는 어렵습니다.
                  관련 문의는 biz@ersiyan.com으로 보내주세요.
                </li>
              </ul>
              <p>
                <a href="https://support.google.com/docs/answer/7322334?hl=ko" rel="noreferrer">
                  Google 설문지 파일 업로드 안내
                </a>
                {" · "}
                <a href="https://policies.google.com/privacy?hl=ko" rel="noreferrer">
                  Google 개인정보처리방침
                </a>
                {" · "}
                <a href="https://policies.google.com/technologies/retention?hl=ko" rel="noreferrer">
                  Google 보관·삭제 안내
                </a>
              </p>
            </section>

            <section id="purpose" aria-labelledby="purpose-title">
              <h2 id="purpose-title">5. 개인정보의 처리 목적과 보유 기간</h2>
              <p>일반 문의 이메일로 제공된 정보는 문의 확인·답변과 필요한 후속 조치에 사용합니다.</p>
              <p>
                문의 정보는 답변과 관련 대응이 끝난 뒤 불필요해지면 삭제합니다. 다만
                관계 법령에 따른 보관 의무가 있거나 분쟁 대응이 필요한 경우에는 해당
                기간 동안 보관할 수 있습니다.
              </p>
              <p>
                모집 지원 자료는 지원 자격 확인, 지원자 연락, 서류·음성 심사,
                인터뷰·비공개 방송 테스트, 최종 선정과 조건 안내에 사용합니다.
                방송 가능 시간대와 현재 소속사 여부는 활동 조건 확인과 후속 대화에 사용합니다.
                에르시안은 음성 파일을 선발 심사에만 사용하며 AI 학습이나 홍보 콘텐츠에
                재사용하지 않습니다. 별도로 동의받지 않은 다른 용도로 사용하지
                않습니다.
              </p>
              <p>
                불합격 지원자의 지원서, 음성 파일과 선발 기록은 최종 선정일로부터
                30일 이내에 삭제합니다. 선정 없이 모집을 취소하거나 종료하면
                전체 지원자의 자료를 그 취소·종료일로부터 30일 이내에 삭제합니다.
                지원자가 선발 도중 지원을 철회하면
                처리 완료 후 지체 없이 삭제합니다. 최종 합격자의 자료는 계약과
                정산 절차에 필요한 항목 및 보유 기간을 계약 전에 별도로 안내합니다.
                법령상 보관 의무나 분쟁 대응이 필요한 경우에는 해당 범위와 기간에
                한하여 보관할 수 있습니다.
              </p>
              <p>
                자료를 삭제할 때에는 설문지 응답과 Drive의 원본 파일, 심사 과정에서
                별도로 보관한 사본을 함께 삭제합니다. 운영자가 관리하는 휴지통에
                남은 사본도 삭제 대상에 포함합니다. Google이 서비스 운영을 위해
                처리하는 백업·접속 기록 등의 보유와 삭제는 Google 정책에 따릅니다.
              </p>
              <p>
                모집 지원과 개인정보 제공 동의는 거부할 수 있습니다. 다만 필수 정보와
                음성 파일이 없으면 본 지원서로 선발 심사를 진행할 수 없습니다.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title">
              <h2 id="cookies-title">6. 쿠키와 외부 서비스</h2>
              <p>
                홈페이지는 자체 광고 쿠키를 사용하지 않습니다. Cloudflare는 Web
                Analytics의 방문·성능 측정에 쿠키나 브라우저 저장소를 사용하지 않으며,
                IP 주소나 브라우저 정보 등을 조합해 개인을 식별하는 지문 정보를
                만들지 않는다고
                {" "}
                <a
                  href="https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/"
                  rel="noreferrer"
                >
                  공식 문서
                </a>
                에서 안내합니다. 관련 기능이 달라지면 적용 전에 이 방침을 변경해
                안내합니다.
              </p>
              <p>
                홈페이지에는 Google 설문지, Google Play 등 외부 서비스로 이동하는 링크가 포함될 수
                있습니다. 외부 서비스에서 이루어지는 정보 처리는 해당 서비스의
                개인정보처리방침을 따릅니다.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-title">
              <h2 id="rights-title">7. 이용자 권리와 문의</h2>
              <p>
                본인의 개인정보에 대한 열람·정정·삭제, 동의 철회, 처리 정지 등 문의는
                아래 이메일로 요청할 수 있습니다.
              </p>
              <p>
                개인정보 문의 이메일{" "}
                <a href="mailto:help@ersiyan.com">help@ersiyan.com</a>
              </p>
              <p>
                버츄얼 크리에이터 지원 철회와 지원 자료 열람·정정·삭제 요청은
                지원서에 적은 회신 이메일 주소에서{" "}
                <a href="mailto:biz@ersiyan.com">biz@ersiyan.com</a>으로
                보내주세요. 이전 이메일 지원자는 지원을 보낸 이메일 주소에서 요청할
                수 있습니다. Google 설문지 접속이나 파일 업로드에 문제가 있을 때에도
                이 주소로 문의할 수 있습니다.
              </p>
            </section>

            <section id="apps" aria-labelledby="apps-title">
              <h2 id="apps-title">8. 게임 앱 정책</h2>
              <p>
                이 방침은 공식 홈페이지에 관한 내용입니다. MINE LOGIC과 앞으로 출시할
                게임은 네트워크, 결제, 광고, 분석 도구 등 실제로 사용하는 기능과
                서비스에 맞춰 별도의 개인정보처리방침을 제공합니다.
              </p>
              <p>
                <a href="/privacy/mine-logic">MINE LOGIC 개인정보처리방침 보기</a>
              </p>
            </section>

            <section id="changes" aria-labelledby="changes-title">
              <h2 id="changes-title">9. 방침 변경과 이전 버전</h2>
              <p>
                이 방침이 변경되면 시행 전에 홈페이지에서 변경 내용과 시행일을
                안내합니다. 이 방침의 최초 시행일은 2026년 8월 22일입니다.
              </p>
              <ul>
                <li>
                  2026년 9월 22일 변경본부터 Google 설문지 접수, 간소화한 지원서
                  항목, Google 설문지·Drive의 처리와 지원 자료 삭제 방법을 안내합니다.
                </li>
                <li>
                  <a href="/privacy/archive/2026-09-19">
                    2026년 9월 19일 모집 지원 정보 추가 방침
                  </a>
                </li>
                <li>
                  2026년 9월 19일 변경본부터 버츄얼 크리에이터 모집 지원 정보의
                  수집 항목, 처리 목적, 보유 기간과 지원 철회 방법을 명시합니다.
                </li>
                <li>
                  <a href="/privacy/archive/2026-09-05">
                    2026년 9월 5일 방문·성능 통계 정정 방침
                  </a>
                </li>
                <li>
                  2026년 9월 5일 정정본부터 이미 작동 중인 Cloudflare Web Analytics의
                  방문·성능 측정 항목과 쿠키·브라우저 저장소 사용 여부를 명시합니다.
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-31">
                    2026년 8월 31일 사업자명 변경 방침
                  </a>
                </li>
                <li>
                  2026년 8월 31일 변경본부터 개인정보 처리 주체의 상호를 에르시안으로
                  표시합니다.
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-28">
                    2026년 8월 28일 브랜드·도메인 변경 방침
                  </a>
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-23">
                    2026년 8월 23일 변경 방침
                  </a>
                </li>
                <li>
                  <a href="/privacy/archive/2026-08-22">
                    2026년 8월 22일 최초 방침
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <ErFooter />
    </div>
  );
}
