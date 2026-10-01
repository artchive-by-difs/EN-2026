import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const BOOT_LINES = [
  { label: 'MEMORY ARCHIVE', delay: 400 },
  { label: 'SECURITY NETWORK', delay: 900 },
  { label: 'CAMERA SYSTEM', delay: 1400 },
  { label: 'VAULT DATABASE', delay: 1900 },
  { label: 'MEMORY INDEX', delay: 2400 },
  { label: 'ARCHIVE RECORDS', delay: 2900 },
];

export default function BootScreen({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showGranted, setShowGranted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setTitleVisible(true), 200);
    const t1 = setTimeout(() => setSubVisible(true), 700);

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 90));
      }, line.delay);
    });

    const tProgress = setTimeout(() => setProgress(100), 3200);
    const tGranted = setTimeout(() => setShowGranted(true), 3600);
    const tExit = setTimeout(() => setExiting(true), 4200);
    const tComplete = setTimeout(onComplete, 4800);

    return () => {
      [t0, t1, tProgress, tGranted, tExit, tComplete].forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: '#07070a',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Subtle scan line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(130, 98, 204, 0.15)',
          animation: 'scan-line 4s linear infinite',
        }}
      />

      <div style={{ width: '100%', maxWidth: 480, padding: '0 24px' }}>
        {/* Title */}
        <div
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'none' : 'translateY(4px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            marginBottom: 8,
          }}
        >
          <div
            className="font-heading"
            style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#d4d4e0',
            }}
          >
            EN-ARCHIVE / 06
          </div>
        </div>

        <div
          style={{
            opacity: subVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
            marginBottom: 40,
          }}
        >
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: '#4e4e62' }}>
            SECURE MEMORY ARCHIVE · 6 YEARS / ONE ARCHIVE
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#16161e', marginBottom: 28 }} />

        {/* Boot lines */}
        <div style={{ marginBottom: 28 }}>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4e4e62', marginBottom: 14 }}>
            SYSTEM INITIALIZING...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BOOT_LINES.map((line, i) => (
              <BootLine
                key={line.label}
                label={line.label}
                visible={visibleLines > i}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#4e4e62' }}>
              ARCHIVE LOAD
            </span>
            <span className="font-mono" style={{ fontSize: 9, color: '#4e4e62' }}>
              {progress}%
            </span>
          </div>
          <div style={{ height: 1, background: '#16161e', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                background: '#6244a0',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Access granted */}
        <div
          style={{
            opacity: showGranted ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2e8050' }} />
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#2e8050' }}>
            ACCESS GRANTED — ENTERING ARCHIVE
          </span>
        </div>
      </div>
    </div>
  );
}

function BootLine({ label, visible, index }: { label: string; visible: boolean; index: number }) {
  const dots = '.'.repeat(Math.max(2, 28 - label.length));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateX(-6px)',
        transition: `opacity 0.3s ease ${index * 30}ms, transform 0.3s ease ${index * 30}ms`,
      }}
    >
      <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', color: '#4e4e62', minWidth: 140 }}>
        {label}
      </span>
      <span className="font-mono" style={{ fontSize: 9, color: '#1e1e2a', flex: 1 }}>
        {dots}
      </span>
      <span
        className="font-mono"
        style={{ fontSize: 9, letterSpacing: '0.1em', color: '#2e8050' }}
      >
        ONLINE
      </span>
    </div>
  );
}
