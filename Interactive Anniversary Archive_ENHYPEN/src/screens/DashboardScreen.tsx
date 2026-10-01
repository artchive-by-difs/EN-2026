import { useState, useEffect } from 'react';
import type { Screen } from '../types';

interface Props {
  navigate: (s: Screen) => void;
}

const MEMBER_CAMS = [
  {
    id: 'CAM 01',
    member: 'JUNGWON',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL A',
  },
  {
    id: 'CAM 02',
    member: 'HEESEUNG',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL B',
  },
  {
    id: 'CAM 03',
    member: 'JAY',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL C',
  },
  {
    id: 'CAM 04',
    member: 'JAKE',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL D',
  },
  {
    id: 'CAM 05',
    member: 'SUNGHOON',
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL E',
  },
  {
    id: 'CAM 06',
    member: 'SUNOO',
    img: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL F',
  },
  {
    id: 'CAM 07',
    member: 'NI-KI',
    img: 'https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=640&h=480&fit=crop&auto=format',
    signal: 'SIGNAL G',
  },
];

const STATS = [
  { label: 'ARCHIVED MEMORIES', value: '1,847' },
  { label: 'SAFE ENTRIES', value: '342' },
  { label: 'ACTIVE SESSIONS', value: '18' },
  { label: 'VAULT RECORDS', value: '96' },
];

export default function DashboardScreen({ navigate }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="font-heading" style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0', lineHeight: 1 }}>
            SECURITY MONITORING
          </div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 6 }}>
            EN-ARCHIVE 06 · SURVEILLANCE FEED · LIVE
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="font-mono" style={{ fontSize: 11, color: '#d4d4e0' }}>{time}</div>
          <div className="font-mono" style={{ fontSize: 9, color: '#4e4e62', marginTop: 2 }}>{date}</div>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#0b0b0f',
              border: '1px solid #16161e',
              padding: '10px 14px',
              borderRadius: 2,
            }}
          >
            <div className="font-mono" style={{ fontSize: 7, letterSpacing: '0.12em', color: '#4e4e62', marginBottom: 4 }}>
              {s.label}
            </div>
            <div className="font-heading" style={{ fontSize: 20, fontWeight: 600, color: '#d4d4e0', letterSpacing: '0.04em' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* CCTV Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="rec-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#cc2e2e' }} />
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4e4e62' }}>
            LIVE FEED — 7 CAMERAS ACTIVE
          </span>
        </div>
        <div className="font-mono" style={{ fontSize: 8, color: '#28283a', letterSpacing: '0.08em' }}>
          MEMORY ARCHIVE ONLINE
        </div>
      </div>

      {/* CCTV Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {MEMBER_CAMS.map((cam, idx) => (
          <CCTVFeed
            key={cam.id}
            cam={cam}
            active={activeIdx === idx}
            onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
            time={time}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 8,
        }}
      >
        <ActionCard
          label="PHOTOBOOTH"
          desc="CAPTURE A MEMORY"
          sub="CAMERA SYSTEM READY"
          onClick={() => navigate('photobooth')}
          accent
        />
        <ActionCard
          label="SECURE VAULT"
          desc="SEAL A MESSAGE"
          sub="VAULT ACCESS OPEN"
          onClick={() => navigate('vault')}
        />
        <ActionCard
          label="SAFE ZONE"
          desc="PUBLIC ARCHIVE"
          sub="342 ENTRIES STORED"
          onClick={() => navigate('safezone')}
        />
      </div>
    </div>
  );
}

function CCTVFeed({
  cam,
  active,
  onClick,
  time,
}: {
  cam: (typeof MEMBER_CAMS)[0];
  active: boolean;
  onClick: () => void;
  time: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        background: '#0b0b0f',
        border: `1px solid ${active ? '#6244a0' : '#16161e'}`,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Image with CCTV treatment */}
      <img
        src={cam.img}
        alt={cam.member}
        className="cctv-feed-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(70%) brightness(0.5) contrast(1.2)',
          display: 'block',
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0.14) 4px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 11,
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div className="rec-blink" style={{ width: 5, height: 5, borderRadius: '50%', background: '#cc2e2e' }} />
          <span className="font-mono" style={{ fontSize: 7, color: '#cc2e2e', letterSpacing: '0.1em' }}>REC</span>
        </div>
        <span className="font-mono" style={{ fontSize: 7, color: 'rgba(212,212,224,0.5)', letterSpacing: '0.08em' }}>
          {cam.id}
        </span>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: 7, color: 'rgba(212,212,224,0.6)', letterSpacing: '0.08em' }}>
            {time}
          </div>
          <div className="font-heading" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(212,212,224,0.8)', letterSpacing: '0.12em', marginTop: 1 }}>
            {cam.member}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2e8050' }} />
          <span className="font-mono" style={{ fontSize: 6, color: 'rgba(78,78,98,0.8)', letterSpacing: '0.08em' }}>{cam.signal}</span>
        </div>
      </div>

      {/* Active frame */}
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(98,68,160,0.6)',
            boxShadow: 'inset 0 0 20px rgba(98,68,160,0.15)',
            zIndex: 25,
            pointerEvents: 'none',
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
}

function ActionCard({
  label,
  desc,
  sub,
  onClick,
  accent,
}: {
  label: string;
  desc: string;
  sub: string;
  onClick: () => void;
  accent?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#101018' : '#0b0b0f',
        border: `1px solid ${hover ? '#26263a' : '#16161e'}`,
        borderLeft: accent ? `2px solid ${hover ? '#8462cc' : '#6244a0'}` : undefined,
        borderRadius: 2,
        padding: '14px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
      }}
    >
      <div className="font-heading" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.08em', color: '#d4d4e0', marginBottom: 4 }}>
        {label}
      </div>
      <div className="font-mono" style={{ fontSize: 8, letterSpacing: '0.1em', color: accent ? '#8462cc' : '#d4d4e0', marginBottom: 6 }}>
        {desc}
      </div>
      <div className="font-mono" style={{ fontSize: 7, letterSpacing: '0.08em', color: '#4e4e62' }}>
        {sub}
      </div>
    </button>
  );
}
