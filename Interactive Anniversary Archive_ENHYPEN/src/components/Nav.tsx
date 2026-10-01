import React from 'react';
import type { Screen } from '../types';

interface NavProps {
  current: Screen;
  navigate: (s: Screen) => void;
}

const NAV_ITEMS: { screen: Screen; label: string; icon: string; shortLabel: string }[] = [
  { screen: 'dashboard', label: 'DASHBOARD', shortLabel: 'DASH', icon: 'M' },
  { screen: 'photobooth', label: 'PHOTOBOOTH', shortLabel: 'CAM', icon: 'P' },
  { screen: 'safezone', label: 'SAFE ZONE', shortLabel: 'ARCH', icon: 'A' },
  { screen: 'vault', label: 'SECURE VAULT', shortLabel: 'VLT', icon: 'V' },
  { screen: 'system', label: 'SYSTEM', shortLabel: 'SYS', icon: 'S' },
];

export function SideNav({ current, navigate }: NavProps) {
  return (
    <nav
      style={{
        width: 200,
        flexShrink: 0,
        borderRight: '1px solid #16161e',
        background: '#0b0b0f',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 24px' }}>
        <div
          className="font-heading"
          style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: '#d4d4e0', lineHeight: 1.1 }}
        >
          EN-ARCHIVE
          <br />
          <span style={{ color: '#8462cc' }}>/ 06</span>
        </div>
        <div className="font-mono" style={{ fontSize: 8, letterSpacing: '0.14em', color: '#4e4e62', marginTop: 5 }}>
          SECURE MEMORY ARCHIVE
        </div>
      </div>

      <div style={{ height: 1, background: '#16161e', margin: '0 0 20px' }} />

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
        {NAV_ITEMS.map((item) => {
          const active = current === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                background: active ? '#14141e' : 'transparent',
                border: active ? '1px solid #1e1e2a' : '1px solid transparent',
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 14,
                  background: active ? '#6244a0' : '#1e1e2a',
                  borderRadius: 1,
                  flexShrink: 0,
                  transition: 'background 0.15s ease',
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  color: active ? '#d4d4e0' : '#4e4e62',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom status */}
      <div style={{ padding: '20px 20px 0', borderTop: '1px solid #16161e', marginTop: 20 }}>
        <StatusDot label="SYSTEM ONLINE" />
        <StatusDot label="ARCHIVE ACTIVE" />
        <StatusDot label="CAM NET READY" />
        <div style={{ marginTop: 12 }} />
        <div className="font-mono" style={{ fontSize: 7, letterSpacing: '0.1em', color: '#28283a' }}>
          EN-ARCHIVE 06.0.1
          <br />
          BUILD 2024.11.21
        </div>
      </div>
    </nav>
  );
}

export function MobileNav({ current, navigate }: NavProps) {
  const mobileItems = NAV_ITEMS.slice(0, 4);
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0b0b0f',
        borderTop: '1px solid #16161e',
        display: 'flex',
        zIndex: 100,
        height: 60,
      }}
    >
      {mobileItems.map((item) => {
        const active = current === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => navigate(item.screen)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderTop: active ? '2px solid #6244a0' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <MobileIcon label={item.icon} active={active} />
            <span
              className="font-mono"
              style={{ fontSize: 7, letterSpacing: '0.1em', color: active ? '#8462cc' : '#4e4e62' }}
            >
              {item.shortLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function MobileIcon({ label, active }: { label: string; active: boolean }) {
  const icons: Record<string, React.ReactElement> = {
    M: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <rect x="9" y="1" width="6" height="6" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <rect x="1" y="9" width="6" height="6" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <rect x="9" y="9" width="6" height="6" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
      </svg>
    ),
    P: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <circle cx="8" cy="8" r="2" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <rect x="12" y="3" width="2" height="2" fill={active ? '#8462cc' : '#4e4e62'} />
      </svg>
    ),
    A: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <line x1="2" y1="6" x2="14" y2="6" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="0.5" />
        <line x1="5" y1="9" x2="11" y2="9" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="0.5" />
        <line x1="5" y1="11" x2="9" y2="11" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="0.5" />
      </svg>
    ),
    V: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="10" rx="1" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <path d="M5 4V3a3 3 0 016 0v1" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="1" />
        <circle cx="8" cy="9" r="1.5" stroke={active ? '#8462cc' : '#4e4e62'} strokeWidth="0.8" />
      </svg>
    ),
  };
  return icons[label] ?? null;
}

function StatusDot({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#246040', flexShrink: 0 }} />
      <span className="font-mono" style={{ fontSize: 8, letterSpacing: '0.08em', color: '#2a2a3a' }}>
        {label}
      </span>
    </div>
  );
}
