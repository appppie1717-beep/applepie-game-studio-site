import { VIRTUAL_APPLICATION_URL } from "./virtual-recruitment-config";
import styles from "./VirtualRecruitment.module.css";

export function VirtualRecruitment() {
  return (
    <div className={`virtual-recruitment ${styles.root}`}>
      <div className="virtual-hero">
        <div className="virtual-intro">
          <div className={styles.heroMeta}>
            <p className="eyebrow">ERSIYAN VIRTUAL</p>
            <p className="virtual-status">
              <a className={styles.statusLink} href="/notices/virtual-recruitment-pause-2026-09-28">
                지원 접수 일시 중단
              </a>
            </p>
          </div>
          <h1 id="virtual-title">
            에르시안 버츄얼<br />
            <span>0기 크리에이터 안내</span>
          </h1>
          <p className="virtual-description">
            치지직(CHZZK)에서 3D 캐릭터로 방송하는 버튜버 활동을 준비합니다.
            0기 버추얼 크리에이터 한 분을 위한 모집·활동 안내이며, 방송 경험이나 팔로워 수는 관계없습니다.
          </p>
          <div className="virtual-actions">
            <div className={styles.applicationAction}>
              <a
                className={`button button--primary ${styles.applicationButton}`}
                href={VIRTUAL_APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="지원서 작성하기 (새 창)"
              >
                지원서 작성하기 <span aria-hidden="true">↗</span>
              </a>
              <p className={styles.applicationNote}>(모집 일시중단)</p>
            </div>
            <a className={styles.guideLink} href="#virtual-apply">
              지원 안내 <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <aside className="virtual-project" aria-label="이번 모집 안내">
          <h2 className="virtual-project-title">모집 안내</h2>
          <dl className="virtual-project-facts">
            <div>
              <dt>모집 인원</dt>
              <dd>1명</dd>
            </div>
            <div>
              <dt>지원 대상</dt>
              <dd>만 19세 이상 성인</dd>
            </div>
            <div>
              <dt>활동 플랫폼</dt>
              <dd>CHZZK · 3D 버츄얼</dd>
            </div>
            <div>
              <dt>접수 현황</dt>
              <dd>일시 중단</dd>
            </div>
          </dl>
          <p className="virtual-project-copy">지원서는 기본 정보와 3~5분 음성 파일로 구성됩니다.</p>
        </aside>
      </div>

      <section id="virtual-support" className="virtual-section" aria-labelledby="virtual-support-title">
        <div className="virtual-section-heading">
          <h2 id="virtual-support-title">활동 지원</h2>
          <p>캐릭터 제작과 방송 환경, 콘텐츠 기획을 함께 준비하는 크리에이터 매니지먼트를 계획하고 있습니다. 구체적인 지원 범위와 일정은 협의해 정합니다.</p>
        </div>
        <div className="virtual-support-grid">
          <div className="virtual-support-card">
            <h3>캐릭터와 방송 화면</h3>
            <p>캐릭터 기획, 3D 모델과 방송 화면을 준비합니다. 제작 범위와 일정은 함께 정합니다.</p>
          </div>
          <div className="virtual-support-card">
            <h3>장비와 방송 세팅</h3>
            <p>사용 중인 장비를 확인하고 필요한 지원을 협의합니다. 트래킹과 음향, 방송 송출을 함께 맞춥니다.</p>
          </div>
          <div className="virtual-support-card">
            <h3>기획과 운영</h3>
            <p>데뷔 방송과 정기 콘텐츠를 기획하고, 활동 계획에 맞춰 클립 제작과 홍보를 준비합니다.</p>
          </div>
        </div>
      </section>

      <section className="virtual-section" aria-labelledby="virtual-journey-title">
        <div className="virtual-section-heading">
          <h2 id="virtual-journey-title">선발 과정</h2>
        </div>
        <ol className="virtual-journey-grid">
          <li>
            <span className="virtual-card-index" aria-hidden="true">01</span>
            <h3>지원서 접수</h3>
            <p>기본 정보와 음성 파일을 확인합니다.</p>
          </li>
          <li>
            <span className="virtual-card-index" aria-hidden="true">02</span>
            <h3>온라인 대화·방송 테스트</h3>
            <p>다음 단계로 진행할 분께 이메일로 연락드립니다. 방송 테스트는 비공개로 진행합니다.</p>
          </li>
          <li>
            <span className="virtual-card-index" aria-hidden="true">03</span>
            <h3>활동 조건 협의</h3>
            <p>구체적인 조건을 문서로 확인하고 검토한 뒤 결정합니다.</p>
          </li>
          <li>
            <span className="virtual-card-index" aria-hidden="true">04</span>
            <h3>데뷔 준비</h3>
            <p>캐릭터와 방송 환경을 준비하고 첫 방송 일정을 정합니다.</p>
          </li>
        </ol>
        <p className="virtual-section-note">지원·선발 과정에 참가비는 없습니다.</p>
      </section>

      <section
        className="virtual-section virtual-apply"
        id="virtual-apply"
        aria-labelledby="virtual-apply-title"
      >
        <div className="virtual-section-heading">
          <h2 id="virtual-apply-title">지원 안내</h2>
          <p>지원 대상은 만 19세 이상이며 한국어로 꾸준히 방송할 수 있는 분입니다. 국내 계약·정산이 가능하고 타 소속 계약과 활동상 충돌이 없어야 합니다.</p>
        </div>
        <div className="virtual-apply-grid">
          <div className="virtual-apply-panel">
            <h3>지원서</h3>
            <ul>
              <li>닉네임, 생년월일, 성별, 회신받을 이메일</li>
              <li>방송 가능한 시간대와 현재 소속사 여부</li>
              <li>3~5분 음성 파일</li>
            </ul>
            <p>활동 조건은 지원서 안에서 확인할 수 있습니다. 파일 첨부에는 Google 로그인이 필요합니다.</p>
          </div>
          <div className="virtual-apply-panel virtual-apply-panel--process">
            <h3>음성 과제</h3>
            <p className={styles.voiceLead}>“처음 방송을 켜고 시청자 다섯 명과 이야기한다면”을 떠올리며 3~5분 자유롭게 녹음해 주세요.</p>
            <p>MP3, M4A, WAV 등 음성 파일 1개를 지원서에 첨부해 주세요.</p>
          </div>
        </div>
        <div className="virtual-apply-cta">
          <div>
            <h3>에르시안 버츄얼 0기 지원</h3>
            <p>모집 문의 · <a href="mailto:biz@ersiyan.com">biz@ersiyan.com</a></p>
          </div>
          <div className={`${styles.applicationAction} ${styles.lowerApplicationAction}`}>
            <a
              className={`${styles.applicationButton} ${styles.lowerApplicationButton}`}
              href={VIRTUAL_APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="지원서 작성하기 (새 창)"
            >
              지원서 작성하기 <span aria-hidden="true">↗</span>
            </a>
            <p className={styles.applicationNote}>(모집 일시중단)</p>
          </div>
        </div>
        <p className="virtual-section-note">지원 자료는 선발 심사에 사용합니다. 자료 처리와 보관에 관한 내용은 <a href="/privacy">개인정보처리방침</a>에서 확인해 주세요.</p>
      </section>

      <section
        id="virtual-faq"
        className={`virtual-section ${styles.faq}`}
        aria-labelledby="virtual-faq-title"
      >
        <div className="virtual-section-heading">
          <h2 id="virtual-faq-title">자주 묻는 질문</h2>
        </div>
        <div className="virtual-support-grid">
          <div className="virtual-support-card">
            <h3>어떤 버튜버 활동을 준비하고 있나요?</h3>
            <p>버튜버(VTuber)는 가상 캐릭터로 영상이나 방송 콘텐츠를 만드는 크리에이터를 말합니다. 에르시안은 치지직에서 3D 캐릭터로 방송하는 0기 버추얼 크리에이터 활동을 준비합니다. 캐릭터와 방송 환경의 준비 계획은 <a href="#virtual-support">활동 지원 안내</a>에서 확인할 수 있습니다.</p>
          </div>
          <div className="virtual-support-card">
            <h3>지금 지원할 수 있나요?</h3>
            <p>현재 내부 준비로 신규 모집을 일시 중단했습니다. 지원서 링크가 열려 있어도 모집 재개를 뜻하지 않습니다. <a href="/notices/virtual-recruitment-pause-2026-09-28">모집 중단 공지</a>를 먼저 확인해 주세요. 모집을 다시 시작하면 <a href="/notices">공지사항</a>으로 안내합니다.</p>
          </div>
          <div className="virtual-support-card">
            <h3>매니지먼트나 MCN을 알아볼 때 무엇을 확인해야 하나요?</h3>
            <p>이름만으로 지원 범위를 판단하기보다 캐릭터 제작, 방송 장비, 콘텐츠 기획에서 어떤 도움을 받을 수 있는지 확인해 주세요. 에르시안은 위의 활동 지원을 준비하고 있으며, 구체적인 지원 범위와 활동 조건은 문서로 확인하고 협의합니다. 조건을 확인하는 방법은 <a href="#virtual-apply">지원 안내</a>에 정리했습니다.</p>
          </div>
          <div className="virtual-support-card">
            <h3>지원 자료는 어떻게 사용되나요?</h3>
            <p>지원서의 기본 정보와 음성 파일은 선발 심사에 사용합니다. 수집 항목과 보관·삭제 기준은 <a href="/privacy">개인정보처리방침</a>에서 확인해 주세요. 활동 조건과 모집에 관한 문의는 <a href="mailto:biz@ersiyan.com">biz@ersiyan.com</a>으로 보내실 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
