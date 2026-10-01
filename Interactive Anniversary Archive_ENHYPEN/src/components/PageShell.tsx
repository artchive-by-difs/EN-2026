import { useState, useEffect, type ReactNode } from 'react';
import type { Screen } from '../types';
import { SideNav, MobileNav } from './Nav';

interface Props {
  current: Screen;
  navigate: (s: Screen) => void;
  children: ReactNode;
}

export default function PageShell({ current, navigate, children }: Props) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#07070a' }}>
      {/* Desktop sidebar */}
      {isDesktop && <SideNav current={current} navigate={navigate} />}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Top bar */}
        <div
          style={{
            height: 40,
            borderBottom: '1px solid #16161e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0,
            background: '#0b0b0f',
          }}
        >
          {/* Mobile logo */}
          {!isDesktop && (
            <div
              className="font-heading"
              style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#d4d4e0' }}
            >
              EN-ARCHIVE <span style={{ color: '#8462cc' }}>/ 06</span>
            </div>
          )}
          {isDesktop && <div />}

          {/* Status chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 18 : 12 }}>
            <StatusChip color="#2e8050" label="ONLINE" />
            {isDesktop && <StatusChip color="#6244a0" label="ARCHIVE" />}
            {isDesktop && <StatusChip color="#2e8050" label="CAMERAS" />}
            <div className="font-mono" style={{ fontSize: 8, letterSpacing: '0.08em', color: '#28283a' }}>
              <LiveClock />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            paddingBottom: isDesktop ? 0 : 72,
          }}
        >
          {children}
        </div>
      </div>

      {/* Mobile bottom nav */}
      {!isDesktop && <MobileNav current={current} navigate={navigate} />}
    </div>
  );
}

function StatusChip({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
      <span className="font-mono" style={{ fontSize: 8, letterSpacing: '0.1em', color: '#28283a' }}>{label}</span>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}
