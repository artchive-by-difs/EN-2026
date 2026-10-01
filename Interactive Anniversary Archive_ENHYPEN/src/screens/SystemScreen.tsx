import { useEffect, useState } from 'react';
import type { Screen } from '../types';

interface Props {
  navigate: (s: Screen) => void;
}

const SUBSYSTEMS = [
  { label: 'CORE SYSTEM', status: 'ONLINE', color: '#2e8050' },
  { label: 'CAMERA NETWORK', status: 'ACTIVE', color: '#2e8050' },
  { label: 'ARCHIVE DATABASE', status: 'CONNECTED', color: '#2e8050' },
  { label: 'VAULT SYSTEM', status: 'READY', color: '#2e8050' },
  { label: 'MEMORY INDEX', status: 'SYNCED', color: '#2e8050' },
  { label: 'SECURE CHANNEL', status: 'ENCRYPTED', color: '#6244a0' },
  { label: 'NETWORK', status: 'STABLE', color: '#2e8050' },
];

const DIAGNOSTICS = [
  { label: 'MEMORY STORAGE', value: 82, unit: '%' },
  { label: 'ARCHIVE CAPACITY', value: 67, unit: '%' },
  { label: 'CAMERA BANDWIDTH', value: 45, unit: '%' },
  { label: 'VAULT ENCRYPTION', value: 100, unit: '%' },
];

const LOG_ENTRIES = [
  { time: '18:42:11', event: 'ARCHIVE ENTRY #062481 SEALED', type: 'info' },
  { time: '17:30:05', event: 'CAMERA 03 SIGNAL RESTORED', type: 'info' },
  { time: '16:21:44', event: 'VAULT ACCESS GRANTED — SESSION #00841', type: 'ok' },
  { time: '14:12:30', event: 'ARCHIVE SYNC COMPLETE — 1,847 RECORDS', type: 'ok' },
  { time: '11:00:00', event: 'SYSTEM BOOT SEQUENCE INITIATED', type: 'warn' },
  { time: '10:59:58', event: 'EN-ARCHIVE 06.0.1 LOADED', type: 'info' },
];

export default function SystemScreen({ navigate }: Props) {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setUptime(Math.floor((Date.now() - start) / 1000));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="font-heading" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0' }}>
          SYSTEM DIAGNOSTICS
        </div>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 4 }}>
          EN-ARCHIVE 06.0.1 · RUNTIME {formatUptime(uptime)} · {time}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Subsystem status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionHeader>SYSTEM STATUS</SectionHeader>
          <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, overflow: 'hidden' }}>
            {SUBSYSTEMS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: i < SUBSYSTEMS.length - 1 ? '1px solid #12121a' : 'none',
                }}
              >
                <span className="font-mono" style={{ fontSize: 9, color: '#4e4e62', letterSpacing: '0.08em' }}>
                  {s.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color }} />
                  <span className="font-mono" style={{ fontSize: 8, color: s.color, letterSpacing: '0.06em' }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionHeader>RESOURCE METRICS</SectionHeader>
          <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, padding: '14px' }}>
            {DIAGNOSTICS.map((d) => (
              <DiagRow key={d.label} {...d} />
            ))}
          </div>

          <SectionHeader>VERSION INFO</SectionHeader>
          <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, padding: '14px' }}>
            <InfoRow label="SYSTEM" value="EN-ARCHIVE" />
            <InfoRow label="VERSION" value="06.0.1" accent />
            <InfoRow label="BUILD" value="2024.11.21" />
            <InfoRow label="PROTOCOL" value="SECURE-06" accent />
            <InfoRow label="CAMERAS" value="7 ACTIVE" />
            <InfoRow label="ANNIVERSARY" value="6TH YEAR" accent />
          </div>
        </div>

        {/* Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, gridColumn: 'span 1' }}>
          <SectionHeader>SYSTEM LOG</SectionHeader>
          <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, overflow: 'hidden' }}>
            {LOG_ENTRIES.map((entry, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 14px',
                  borderBottom: i < LOG_ENTRIES.length - 1 ? '1px solid #0d0d10' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <span className="font-mono" style={{ fontSize: 8, color: '#28283a', letterSpacing: '0.04em', flexShrink: 0, paddingTop: 1 }}>
                  {entry.time}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 8,
                    color: entry.type === 'ok' ? '#246040' : entry.type === 'warn' ? '#7a5a18' : '#4e4e62',
                    letterSpacing: '0.06em',
                    lineHeight: 1.5,
                  }}
                >
                  {entry.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('dashboard')} style={navBtn}>RETURN TO DASHBOARD</button>
        <button onClick={() => navigate('vault')} style={navBtn}>ACCESS VAULT</button>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="font-mono" style={{ fontSize: 8, color: '#28283a', letterSpacing: '0.12em' }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: '#16161e' }} />
    </div>
  );
}

function DiagRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  const barColor = value > 90 ? '#9e2424' : value > 70 ? '#7a5a18' : '#6244a0';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.08em' }}>{label}</span>
        <span className="font-mono" style={{ fontSize: 8, color: '#d4d4e0' }}>{value}{unit}</span>
      </div>
      <div style={{ height: 2, background: '#16161e', borderRadius: 1, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: barColor,
            borderRadius: 1,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #0d0d10' }}>
      <span className="font-mono" style={{ fontSize: 8, color: '#28283a', letterSpacing: '0.08em' }}>{label}</span>
      <span className="font-mono" style={{ fontSize: 8, color: accent ? '#8462cc' : '#4e4e62', letterSpacing: '0.06em' }}>{value}</span>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  padding: '9px 18px',
  background: 'transparent',
  border: '1px solid #1e1e2a',
  borderRadius: 2,
  color: '#4e4e62',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 8,
  letterSpacing: '0.1em',
  cursor: 'pointer',
};
