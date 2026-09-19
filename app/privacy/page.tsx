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
  "@type": ["WebPage", "PrivacyPolicy"],
  "@id": "https://ersiyan.com/privacy#webpage",
  url: "https://ersiyan.com/privacy",
  name: "개인정보처리방침 | 에르시안",
  description: "에르시안 공식 홈페이지의 개인정보처리방침입니다.",
  inLanguage: "ko-KR",
  datePublished: "2026-08-22",
  dateModified: "2026-09-19",
  isPartOf: { "@id": "https://ersiyan.com/#website" },
  publisher: { "@id": "https://ersiyan.com/#organization" },
};

const policySections = [
  ["recruitment-notice", "2026년 9월 19일 모집 지원 안내"],
  ["change-notice", "2026년 9월 5일 안내 정정"],
  ["business-name-notice", "2026년 8월 31일 사업자명 변경"],
  ["overview", "방침 개요"],
  ["collection", "처리하는 정보"],
  ["hosting", "호스팅과 국외 처리"],
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
            최초 시행일 2026년 8월 22일 · 최근 변경일 및 시행일 2026년 9월 19일
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
                모집 이메일 접수에 적용됩니다.
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
                홈페이지는 회원가입과 문의 양식을 제공하지 않으며 방문자의
                개인정보를 자체 데이터베이스에 직접 수집하거나 저장하지 않습니다.
              </p>
              <p>
                이용자가 이메일로 문의하는 경우, 발신 이메일 주소와 메일에 기재한 이름,
                문의 내용, 첨부파일을 확인할 수 있습니다. 홈페이지 제공 과정에서는
                Cloudflare가 IP 주소, 트래픽 라우팅 정보, 시스템 구성 정보와 접속 요청
                정보를 처리할 수 있습니다.
              </p>
              <p>
                버츄얼 크리에이터 모집 주소 biz@ersiyan.com에 이메일로 지원하는 경우
                발신 이메일 주소,
                활동명 또는 닉네임, 만 19세 이상 여부, 선택적으로 제공한 Discord 계정,
                직업·학업 여부, 월 활동 가능 횟수와 방송 가능 요일·시간대,
                방송·버츄얼 경험, PC·마이크 등 장비 정보, 콘텐츠 아이디어,
                본인이 적은 장점과 장기간 활동할 수 있다고 생각하는 이유, 타 소속 및
                계약 여부, 제출한 3~5분 음성 파일을 확인할 수 있습니다. 온라인
                인터뷰와 비공개 방송 테스트에 참여하면 진행과 평가에 필요한 기록도
                처리할 수 있습니다. 실제 얼굴 사진이나 신분증 사본은 지원 접수에
                요구하지 않습니다.
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

            <section id="purpose" aria-labelledby="purpose-title">
              <h2 id="purpose-title">4. 개인정보의 처리 목적과 보유 기간</h2>
              <p>일반 문의 이메일로 제공된 정보는 문의 확인·답변과 필요한 후속 조치에 사용합니다.</p>
              <p>
                문의 정보는 답변과 관련 대응이 끝난 뒤 불필요해지면 삭제합니다. 다만
                관계 법령에 따른 보관 의무가 있거나 분쟁 대응이 필요한 경우에는 해당
                기간 동안 보관할 수 있습니다.
              </p>
              <p>
                모집 지원 자료는 지원 자격 확인, 지원자 연락, 서류·음성 심사,
                인터뷰·비공개 방송 테스트, 최종 선정과 조건 안내에 사용합니다.
                음성 파일은 선발 심사에만 사용하며 AI 학습이나 홍보 콘텐츠에
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
                모집 지원은 선택 사항이며, 선발에 필요한 정보를 제공하지 않으면
                심사를 진행할 수 없습니다. 지원과 무관한 민감한 개인정보는
                이메일에 포함하지 마세요.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title">
              <h2 id="cookies-title">5. 쿠키와 외부 서비스</h2>
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
                홈페이지에는 Google Play 등 외부 서비스로 이동하는 링크가 포함될 수
                있습니다. 외부 서비스에서 이루어지는 정보 처리는 해당 서비스의
                개인정보처리방침을 따릅니다.
              </p>
            </section>

            <section id="rights" aria-labelledby="rights-title">
              <h2 id="rights-title">6. 이용자 권리와 문의</h2>
              <p>
                본인의 개인정보에 대한 열람·정정·삭제 등 개인정보 처리에 관한 문의는
                아래 이메일로 요청할 수 있습니다.
              </p>
              <p>
                개인정보 문의 이메일{" "}
                <a href="mailto:help@ersiyan.com">help@ersiyan.com</a>
              </p>
              <p>
                버츄얼 크리에이터 지원 철회와 지원 자료 열람·정정·삭제 요청은
                지원을 보낸 이메일 주소에서{" "}
                <a href="mailto:biz@ersiyan.com">biz@ersiyan.com</a>으로
                보내주세요.
              </p>
            </section>

            <section id="apps" aria-labelledby="apps-title">
              <h2 id="apps-title">7. 게임 앱 정책</h2>
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
              <h2 id="changes-title">8. 방침 변경과 이전 버전</h2>
              <p>
                이 방침이 변경되면 시행 전에 홈페이지에서 변경 내용과 시행일을
                안내합니다. 이 방침의 최초 시행일은 2026년 8월 22일입니다.
              </p>
              <ul>
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
