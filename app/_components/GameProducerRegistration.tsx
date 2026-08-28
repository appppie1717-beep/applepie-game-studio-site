import { businessProfile } from "./business-profile";

export function GameProducerRegistration() {
  return (
    <p className="footer-registration">
      게임제작업자 등록번호 · {businessProfile.gameProducerRegistrationNumber}
    </p>
  );
}
