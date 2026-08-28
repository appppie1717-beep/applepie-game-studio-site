type BrandLockupProps = {
  href?: string;
};

export function BrandLockup({ href = "/" }: BrandLockupProps) {
  return (
    <a className="brand-lockup" href={href} aria-label="에르시안 공식 홈페이지">
      <span className="brand-mark" aria-hidden="true">
        ✦
      </span>
      <span className="brand-name">
        <strong>ERSIYAN</strong>
      </span>
    </a>
  );
}
