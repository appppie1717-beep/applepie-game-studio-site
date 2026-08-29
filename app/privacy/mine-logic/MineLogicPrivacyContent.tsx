"use client";

import { useEffect, useState } from "react";

type PolicyLanguage = "ko" | "en";

type MineLogicPrivacyContentProps = {
  businessName: string;
  representative: string;
  email: string;
};

const koreanSections = [
  ["scope", "적용 범위"],
  ["local-data", "기기에서 처리되는 정보"],
  ["result-card", "닉네임과 결과 카드"],
  ["network", "서버 전송과 자동 공유"],
  ["permissions", "권한과 외부 코드"],
  ["deletion", "정보 삭제"],
  ["children", "아동의 개인정보"],
  ["website", "정책 페이지 접속"],
  ["contact", "문의와 변경"],
] as const;

const englishSections = [
  ["scope", "Scope"],
  ["local-data", "Information processed on the device"],
  ["result-card", "Nickname and result cards"],
  ["network", "Server transmission and automatic sharing"],
  ["permissions", "Permissions and external code"],
  ["deletion", "Deletion"],
  ["children", "Children’s privacy"],
  ["website", "Accessing this policy"],
  ["contact", "Contact and changes"],
] as const;

export function MineLogicPrivacyContent({
  businessName,
  representative,
  email,
}: MineLogicPrivacyContentProps) {
  const [language, setLanguage] = useState<PolicyLanguage>("en");

  useEffect(() => {
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = "ko";
    };
  }, [language]);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.lang="en";',
        }}
      />
      <div className="policy-language-toolbar section-pad">
        <div className="policy-language-switcher" role="group" aria-label="Privacy policy language">
          <button
            type="button"
            aria-controls="mine-logic-policy-ko"
            aria-pressed={language === "ko"}
            onClick={() => setLanguage("ko")}
          >
            한국어
          </button>
          <button
            type="button"
            aria-controls="mine-logic-policy-en"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
        </div>
      </div>

      <noscript>
        <style>{`
          .policy-language-switcher { display: none !important; }
          #mine-logic-policy-ko[hidden] { display: block !important; }
        `}</style>
        <p className="policy-noscript-notice section-pad">
          JavaScript가 꺼져 있어 English와 한국어 방침을 연속으로 표시합니다. {" "}
          <a href="#mine-logic-policy-ko">한국어 개인정보처리방침으로 이동</a>
        </p>
      </noscript>

      <div id="mine-logic-policy-ko" lang="ko" hidden={language !== "ko"}>
        <section className="privacy-hero section-pad" aria-labelledby="policy-title-ko">
          <p className="eyebrow">MINE LOGIC · PRIVACY POLICY</p>
          <h1 id="policy-title-ko">MINE LOGIC 개인정보처리방침</h1>
          <p>
            이 방침은 MINE LOGIC Android 앱에서 정보가 처리되는 방식과 이용자가
            직접 관리할 수 있는 방법을 안내합니다.
          </p>
          <span className="draft-note">
            최초 시행일 2026년 7월 29일 · 최근 변경일 및 시행일 2026년 8월 28일
          </span>
        </section>

        <div className="policy-content section-pad">
          <ol className="policy-index" aria-label="MINE LOGIC 개인정보처리방침 목차">
            {koreanSections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}-ko`}>{label}</a>
              </li>
            ))}
          </ol>

          <div className="policy-sections">
            <section id="scope-ko" aria-labelledby="scope-title-ko">
              <h2 id="scope-title-ko">1. 적용 범위</h2>
              <p>
                이 방침은 개인사업자 {businessName}(대표자 {representative})가
                에르시안(ERSIYAN) 브랜드로 제공하는 MINE LOGIC Android 앱에 적용됩니다.
              </p>
              <p>
                앱은 회원가입, 계정 생성, 결제, 광고 또는 온라인 순위 기능을 제공하지
                않습니다.
              </p>
            </section>

            <section id="local-data-ko" aria-labelledby="local-data-title-ko">
              <h2 id="local-data-title-ko">2. 기기에서 처리되는 정보</h2>
              <p>
                언어, 테마, 화면 외관과 음향 설정 및 강화훈련에서 이미 제공한 문제의
                이력은 이용자의 기기 내부 앱 전용 저장공간에서 처리되거나 보관될 수
                있습니다.
              </p>
              <p>
                이 정보는 선택한 표시·음향 환경을 유지하고 강화훈련의 문제 제공을
                관리하기 위해 기기 안에서 사용됩니다.
              </p>
            </section>

            <section id="result-card-ko" aria-labelledby="result-card-title-ko">
              <h2 id="result-card-title-ko">3. 닉네임과 결과 카드</h2>
              <p>
                이용자가 선택적으로 입력한 닉네임은 결과 카드에 표시하기 위해 앱 안에서
                처리됩니다. 결과 카드 이미지는 이용자의 기기에서 생성됩니다.
              </p>
              <p>
                이용자가 저장 또는 공유 기능을 직접 선택하면 Android 시스템 기능을 통해
                이용자가 지정한 위치나 앱으로 결과 카드 사본이 전달될 수 있습니다. 전달된
                사본에는 이용자가 입력한 닉네임과 게임 결과, 선택에 따른 완료 날짜가
                포함될 수 있습니다.
              </p>
            </section>

            <section id="network-ko" aria-labelledby="network-title-ko">
              <h2 id="network-title-ko">4. 서버 전송과 자동 공유</h2>
              <p>
                MINE LOGIC은 개발자가 운영하는 서버로 앱 설정, 강화훈련 문제 제공 이력,
                닉네임 또는 게임 결과를 자동 수집하거나 전송하도록 구현되어 있지
                않습니다. 앱에서 처리되는 이용자 정보를 개발자가 판매하지 않습니다.
              </p>
              <p>
                결과 카드는 이용자가 저장 또는 공유 동작을 선택한 경우에만 이용자가
                지정한 대상으로 전달되며, 앱이 임의로 외부에 공유하지 않습니다.
              </p>
            </section>

            <section id="permissions-ko" aria-labelledby="permissions-title-ko">
              <h2 id="permissions-title-ko">5. 권한과 외부 코드</h2>
              <p>
                앱 패키지는 Android의 INTERNET 권한을 요청하지 않으며, 위치, 연락처,
                카메라, 마이크, 사진과 파일 같은 민감한 정보 접근 권한도 요청하지
                않습니다.
              </p>
              <p>
                현재 앱에는 광고 제공, 이용자 행동 분석 또는 원격측정을 목적으로 하는
                기능이나 라이브러리가 포함되어 있지 않습니다.
              </p>
            </section>

            <section id="deletion-ko" aria-labelledby="deletion-title-ko">
              <h2 id="deletion-title-ko">6. 정보 삭제</h2>
              <p>
                앱 내부 설정과 강화훈련 문제 제공 이력은 Android 설정에서 MINE LOGIC의
                앱 데이터를 삭제하거나 앱을 제거하는 방식으로 삭제할 수 있습니다.
              </p>
              <p>
                공유용 결과 카드 PNG는 앱 전용 cache/shared_cards 폴더에 임시 생성될 수
                있습니다. 이후 공유를 준비할 때 오래되거나 허용 수를 초과한 캐시 파일이
                정리될 수 있으며, 앱 캐시나 앱 데이터를 삭제하거나 앱을 제거하는
                방법으로도 삭제할 수 있습니다.
              </p>
              <p>
                이용자가 사진, 파일 또는 다른 앱과 서비스에 저장하거나 공유한 결과 카드
                사본은 앱 외부에 남을 수 있으며, 앱 데이터 삭제나 앱 제거만으로 함께
                삭제되지 않을 수 있습니다. 해당 사본은 저장한 위치나 전달한 서비스에서
                이용자가 별도로 삭제해야 합니다.
              </p>
            </section>

            <section id="children-ko" aria-labelledby="children-title-ko">
              <h2 id="children-title-ko">7. 아동의 개인정보</h2>
              <p>
                MINE LOGIC은 아동의 개인정보를 개발자가 운영하는 서버로 의도적으로
                수집하도록 설계되지 않았습니다. 보호자는 아동이 결과 카드를 공유할 때
                실명, 연락처 등 개인을 식별할 수 있는 정보를 닉네임으로 사용하지 않도록
                안내할 수 있습니다.
              </p>
            </section>

            <section id="website-ko" aria-labelledby="website-title-ko">
              <h2 id="website-title-ko">8. 정책 페이지 접속</h2>
              <p>
                정책은 ersiyan.com에서 제공합니다. 기존 앱 버전에서 개인정보처리방침을
                열면 외부 브라우저가 applepie.im을 먼저 열 수 있으며, 같은 정책 경로의
                ersiyan.com 주소로 이동합니다. 이 접속은 앱의 게임 기능과 분리된
                웹사이트 이용이며, Cloudflare가 IP 주소와 접속 요청 정보를 처리할 수
                있습니다.
              </p>
              <p>
                웹사이트 접속 과정의 자세한 내용은{" "}
                <a href="/privacy">에르시안 홈페이지 개인정보처리방침</a>
                에서 확인할 수 있습니다.
              </p>
            </section>

            <section id="contact-ko" aria-labelledby="contact-title-ko">
              <h2 id="contact-title-ko">9. 문의와 방침 변경</h2>
              <p>
                MINE LOGIC의 정보 처리에 관한 문의는{" "}
                <a href={`mailto:${email}`}>{email}</a>로 보낼 수 있습니다.
              </p>
              <p>
                앱 기능이나 정보 처리 방식이 바뀌면 이 페이지에 변경 내용과 시행일을
                반영합니다. 이 방침의 최초 시행일은 2026년 7월 29일이며, 최근 변경일 및
                변경본 시행일은 2026년 8월 28일입니다.
              </p>
            </section>
          </div>
        </div>
      </div>

      <div id="mine-logic-policy-en" lang="en" hidden={language !== "en"}>
        <section className="privacy-hero section-pad" aria-labelledby="policy-title-en">
          <p className="eyebrow">MINE LOGIC · PRIVACY POLICY</p>
          <h1 id="policy-title-en">MINE LOGIC Privacy Policy</h1>
          <p>
            This policy explains how information is processed in the MINE LOGIC Android app
            and how users can manage information on their devices.
          </p>
          <span className="draft-note">
            First effective July 29, 2026 · Last updated and effective August 28, 2026
          </span>
        </section>

        <div className="policy-content section-pad">
          <ol className="policy-index" aria-label="MINE LOGIC Privacy Policy contents">
            {englishSections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}-en`}>{label}</a>
              </li>
            ))}
          </ol>

          <div className="policy-sections">
            <section id="scope-en" aria-labelledby="scope-title-en">
              <h2 id="scope-title-en">1. Scope</h2>
              <p>
                This policy applies to the MINE LOGIC Android app provided under the ERSIYAN
                brand by {businessName}, a Korean sole proprietorship represented by {representative}.
              </p>
              <p>
                The app does not provide registration, user accounts, payments, advertising,
                or online leaderboards.
              </p>
            </section>

            <section id="local-data-en" aria-labelledby="local-data-title-en">
              <h2 id="local-data-title-en">2. Information processed on the device</h2>
              <p>
                Language, theme, visual appearance, and sound settings, together with the history
                of problems already offered in Enhanced Training, may be processed or stored in
                the app-specific storage area on the user’s device.
              </p>
              <p>
                This information is used on the device to retain the selected display and sound
                preferences and to manage problem selection in Enhanced Training.
              </p>
            </section>

            <section id="result-card-en" aria-labelledby="result-card-title-en">
              <h2 id="result-card-title-en">3. Nickname and result cards</h2>
              <p>
                An optional nickname entered by the user is processed in the app for display on a
                result card. The result card image is generated on the user’s device.
              </p>
              <p>
                When the user directly chooses to save or share, Android system features may send
                a copy of the result card to a location or app selected by the user. The copy may
                contain the nickname entered by the user, game results, and, when selected, a
                completion date.
              </p>
            </section>

            <section id="network-en" aria-labelledby="network-title-en">
              <h2 id="network-title-en">4. Server transmission and automatic sharing</h2>
              <p>
                MINE LOGIC is not designed to automatically collect or transmit app settings,
                Enhanced Training problem-offer history, nicknames, or game results to a server
                operated by the developer. The developer does not sell information processed in
                the app.
              </p>
              <p>
                A result card is sent to a destination selected by the user only when the user
                chooses a save or share action. The app does not automatically share it with an
                external party.
              </p>
            </section>

            <section id="permissions-en" aria-labelledby="permissions-title-en">
              <h2 id="permissions-title-en">5. Permissions and external code</h2>
              <p>
                The app package does not request the Android INTERNET permission or sensitive
                access permissions for information such as location, contacts, camera,
                microphone, photos, or files.
              </p>
              <p>
                The current app does not include features or libraries for advertising, user
                behavior analytics, or telemetry.
              </p>
            </section>

            <section id="deletion-en" aria-labelledby="deletion-title-en">
              <h2 id="deletion-title-en">6. Deletion</h2>
              <p>
                App settings and Enhanced Training problem-offer history can be deleted by
                clearing MINE LOGIC app data in Android settings or by uninstalling the app.
              </p>
              <p>
                A share-ready result card PNG may be created temporarily in the app-private
                cache/shared_cards directory. Older files or files above the cache limit may be
                removed when another card is prepared for sharing. These cached files can also be
                deleted by clearing the app cache or app data, or by uninstalling the app.
              </p>
              <p>
                A result card copy saved to photos or files, or shared with another app or service,
                may remain outside MINE LOGIC and may not be removed when app data is cleared or the
                app is uninstalled. The user must delete that copy separately from the location or
                service where it was saved or sent.
              </p>
            </section>

            <section id="children-en" aria-labelledby="children-title-en">
              <h2 id="children-title-en">7. Children’s privacy</h2>
              <p>
                MINE LOGIC is not designed to intentionally collect children’s personal
                information on a server operated by the developer. A parent or guardian can guide
                a child not to use identifying information, such as a full name or contact details,
                as a nickname when sharing a result card.
              </p>
            </section>

            <section id="website-en" aria-labelledby="website-title-en">
              <h2 id="website-title-en">8. Accessing this policy</h2>
              <p>
                This policy is provided at ersiyan.com. Existing app versions may first open
                applepie.im in an external browser and then move to the same policy path at
                ersiyan.com. This is website use separate from the app’s gameplay functions, and
                Cloudflare may process the IP address and request information for that visit.
              </p>
              <p>
                See the{" "}
                <a href="/privacy">ERSIYAN Website Privacy Policy</a> for details
                about website access.
              </p>
            </section>

            <section id="contact-en" aria-labelledby="contact-title-en">
              <h2 id="contact-title-en">9. Contact and changes</h2>
              <p>
                Questions about information processing in MINE LOGIC can be sent to{" "}
                <a href={`mailto:${email}`}>{email}</a>.
              </p>
              <p>
                If app functions or information-processing practices change, this page will be
                updated with the changes and their effective date. This policy was first effective
                on July 29, 2026. It was last updated, and this version became effective, on August
                28, 2026.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
