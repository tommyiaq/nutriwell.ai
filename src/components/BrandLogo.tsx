import * as React from 'react';

type Variant = 'mark' | 'wordmark' | 'lockup';
type Tone = 'teal' | 'white' | 'black';

export default function BrandLogo({
  variant = 'lockup',
  tone = 'teal',
  size = 28,
}: { variant?: Variant; tone?: Tone; size?: number }) {
  const fill =
    tone === 'white' ? '#FFFFFF' : tone === 'black' ? '#0F172A' : '#16A394';

  const Word = () => (
    <svg
      aria-hidden
      viewBox="0 0 520 120"
      style={{ height: size * 1.6, width: 'auto' }}
    >
      <g fill={fill}>
        <path d="M101 85V35h18l14 34 14-34h18v50h-12V53l-12 32h-15L113 53v32zM213 85V35h14v50zM244 85V35h13l30 33V35h13v50h-13l-30-33v33zM345 35h15l15 50h-14l-3-12h-17l-3 12h-13zm9 13-5 19h11zM399 35h39v12h-25v7h21v11h-21v8h26v12h-40zM451 35h14v18h19V35h14v50h-14V64h-19v21h-14z" />
      </g>
    </svg>
  );

  const Mark = () => (
    <svg
      aria-hidden
      viewBox="0 0 256 256"
      style={{ height: size, width: size }}
    >
      <rect rx="48" ry="48" width="256" height="256" fill={fill} />
      {/* N */}
      <path
        d="M70 176V84a14 14 0 0 1 28 0v44l48-44a14 14 0 0 1 24 10v82a14 14 0 0 1-28 0v-44l-48 44a14 14 0 0 1-24-10Z"
        fill="#ffffff"
      />
      {/* leaf/heart dot */}
      <path
        d="M188 84c0-10 8-18 18-18 10 0 18 8 18 18 0 18-18 28-18 28s-18-10-18-28Z"
        fill="#ffffff"
      />
    </svg>
  );

  if (variant === 'mark') return <Mark />;

  if (variant === 'wordmark')
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Mark />
        <Word />
      </div>
    );

  // lockup default
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Mark />
      <Word />
    </div>
  );
}
