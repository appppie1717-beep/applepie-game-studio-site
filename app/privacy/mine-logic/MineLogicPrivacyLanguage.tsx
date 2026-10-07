"use client";

import { useEffect, useState, type ReactNode } from "react";

type PolicyLanguage = "ko" | "en";

const policyLocale: Record<PolicyLanguage, "ko-KR" | "en-US"> = {
  ko: "ko-KR",
  en: "en-US",
};

type MineLogicPrivacyLanguageProps = {
  koreanPolicy: ReactNode;
  englishPolicy: ReactNode;
  children: ReactNode;
};

export function MineLogicPrivacyLanguage({
  koreanPolicy,
  englishPolicy,
  children,
}: MineLogicPrivacyLanguageProps) {
  const [language, setLanguage] = useState<PolicyLanguage>("en");

  useEffect(() => {
    document.documentElement.lang = policyLocale[language];
    return () => {
      document.documentElement.lang = "ko-KR";
    };
  }, [language]);

  return (
    <>
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

      {children}

      <div id="mine-logic-policy-ko" lang="ko-KR" hidden={language !== "ko"}>
        {koreanPolicy}
      </div>

      <div id="mine-logic-policy-en" lang="en-US" hidden={language !== "en"}>
        {englishPolicy}
      </div>
    </>
  );
}
