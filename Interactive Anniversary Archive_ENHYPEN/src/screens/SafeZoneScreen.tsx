import { useState } from 'react';
import type { Screen, Message } from '../types';

interface Props {
  navigate: (s: Screen) => void;
  messages: Message[];
}

const SEED_MESSAGES: Message[] = [
  {
    id: '#062481',
    text: 'Happy 6th anniversary ENHYPEN. Six years of memories, six years of growth. Thank you for always being the light in difficult times. ENHA forever.',
    timestamp: '18:42',
    date: '11/20/2024',
  },
  {
    id: '#061337',
    text: 'To the 7 boys who changed my life — your bond is unbreakable. Every performance, every song, every moment has meant everything to me. Here\'s to six years and so many more.',
    timestamp: '14:21',
    date: '11/20/2024',
    attachment: 'https://weverse.io',
  },
  {
    id: '#060891',
    text: 'Six years ago, you debuted and immediately captured my heart. I\'m so proud of how far you\'ve come. ENHYPEN 6th anniversary — we made it!',
    timestamp: '09:07',
    date: '11/20/2024',
  },
  {
    id: '#060444',
    text: 'Jungwon, Heeseung, Jay, Jake, Sunghoon, Sunoo, Ni-Ki — thank you for your iron bond and every memory you\'ve given us.',
    timestamp: '07:33',
    date: '11/20/2024',
  },
];

export default function SafeZoneScreen({ navigate, messages }: Props) {
  const [search, setSearch] = useState('');
  const allMessages = [...messages, ...SEED_MESSAGES];
  const filtered = search.trim()
    ? allMessages.filter((m) => m.text.toLowerCase().includes(search.toLowerCase()))
    : allMessages;

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="font-heading" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0' }}>
            SAFE ZONE
          </div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 4 }}>
            PUBLIC MEMORY ARCHIVE · {allMessages.length} ENTRIES
          </div>
        </div>
        <button
          onClick={() => navigate('vault')}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #6244a0',
            borderRadius: 2,
            color: '#8462cc',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            letterSpacing: '0.12em',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          + SEAL A MESSAGE
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 400 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH ARCHIVE..."
          style={{
            width: '100%',
            background: '#0b0b0f',
            border: '1px solid #1e1e2a',
            borderRadius: 2,
            color: '#d4d4e0',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.1em',
            padding: '9px 14px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6244a0'; }}
          onBlur={(e) => { e.target.style.borderColor = '#1e1e2a'; }}
        />
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr 80px',
          gap: 12,
          padding: '6px 12px',
          marginBottom: 6,
          borderBottom: '1px solid #16161e',
        }}
      >
        <span className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.1em' }}>ENTRY ID</span>
        <span className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.1em' }}>MESSAGE</span>
        <span className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.1em', textAlign: 'right' }}>STATUS</span>
      </div>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: '#0b0b0f',
              border: '1px solid #16161e',
              borderRadius: 2,
            }}
          >
            <div className="font-mono" style={{ fontSize: 9, color: '#28283a', letterSpacing: '0.1em' }}>NO ENTRIES FOUND</div>
          </div>
        )}
        {filtered.map((msg, i) => (
          <ArchiveCard key={msg.id + i} msg={msg} />
        ))}
      </div>
    </div>
  );
}

function ArchiveCard({ msg }: { msg: Message }) {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#0d0d12' : '#0b0b0f',
        border: `1px solid ${hover ? '#1e1e2a' : '#16161e'}`,
        borderRadius: 2,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        animation: 'fadeInUp 0.3s ease forwards',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 80px', gap: 12, alignItems: 'start' }}>
        {/* Entry ID */}
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: '#8462cc', letterSpacing: '0.06em', marginBottom: 3 }}>
            {msg.id}
          </div>
          <div className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.06em' }}>
            {msg.timestamp}
          </div>
          {msg.date && (
            <div className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.06em' }}>
              {msg.date}
            </div>
          )}
        </div>

        {/* Message text */}
        <div>
          <p
            style={{
              color: '#d4d4e0',
              fontSize: 12,
              lineHeight: 1.65,
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            "{msg.text}"
          </p>
          {msg.attachment && expanded && (
            <div style={{ marginTop: 8 }}>
              <a
                href={msg.attachment}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 8,
                  color: '#6244a0',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  borderBottom: '1px solid #6244a0',
                  paddingBottom: 1,
                }}
              >
                OPEN ATTACHMENT ↗
              </a>
            </div>
          )}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#246040' }} />
            <span className="font-mono" style={{ fontSize: 7, color: '#246040', letterSpacing: '0.06em' }}>VERIFIED</span>
          </div>
          {msg.attachment && (
            <span className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.06em' }}>+ LINK</span>
          )}
        </div>
      </div>
    </div>
  );
}
