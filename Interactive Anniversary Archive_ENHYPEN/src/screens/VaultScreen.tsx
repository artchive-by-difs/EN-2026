import { useState } from 'react';
import type { Screen, Message } from '../types';

interface Props {
  navigate: (s: Screen) => void;
  onSubmit: (msg: Message) => void;
}

function genId() {
  return '#06' + Math.floor(1000 + Math.random() * 89999);
}

type VaultState = 'entry' | 'sealing' | 'sealed';

export default function VaultScreen({ navigate, onSubmit }: Props) {
  const [vaultState, setVaultState] = useState<VaultState>('entry');
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState('');
  const [archiveId] = useState(genId);
  const [sealedId, setSealedId] = useState('');
  const MAX = 300;

  const handleSeal = () => {
    if (!text.trim()) return;
    setVaultState('sealing');
    const id = genId();
    setSealedId(id);
    setTimeout(() => {
      const now = new Date();
      onSubmit({
        id,
        text: text.trim(),
        timestamp: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        attachment: attachment.trim() || undefined,
      });
      setVaultState('sealed');
    }, 1800);
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="font-heading" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0' }}>
          SECURE VAULT
        </div>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 4 }}>
          LEAVE A MEMORY · SEAL A MESSAGE · ARCHIVE YOUR WORDS
        </div>
      </div>

      {vaultState === 'entry' && (
        <div style={{ maxWidth: 560 }}>
          {/* Archive ID display */}
          <div
            style={{
              background: '#0b0b0f',
              border: '1px solid #16161e',
              borderRadius: 2,
              padding: '14px 18px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.1em', marginBottom: 4 }}>VAULT ENTRY</div>
              <div className="font-heading" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '0.1em', color: '#d4d4e0' }}>
                {archiveId}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <StatusDot color="#246040" label="VAULT OPEN" />
              <StatusDot color="#6244a0" label="ENCRYPTION READY" />
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#16161e' }} />
            <span className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.1em' }}>COMPOSE MESSAGE</span>
            <div style={{ flex: 1, height: 1, background: '#16161e' }} />
          </div>

          {/* Message field */}
          <div style={{ marginBottom: 14 }}>
            <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.1em', marginBottom: 6 }}>
              ANNIVERSARY MESSAGE
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX))}
              placeholder="Write your anniversary message..."
              rows={6}
              style={{
                width: '100%',
                background: '#0b0b0f',
                border: '1px solid #1e1e2a',
                borderRadius: 2,
                color: '#d4d4e0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                padding: '12px 14px',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.6,
                transition: 'border-color 0.15s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#6244a0'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e1e2a'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <span className="font-mono" style={{ fontSize: 8, color: text.length > MAX * 0.85 ? '#9e2424' : '#28283a' }}>
                {text.length} / {MAX}
              </span>
            </div>
          </div>

          {/* Attachment */}
          <div style={{ marginBottom: 24 }}>
            <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.1em', marginBottom: 6 }}>
              ATTACHMENT URL <span style={{ color: '#28283a' }}>/ OPTIONAL</span>
            </div>
            <input
              type="url"
              value={attachment}
              onChange={(e) => setAttachment(e.target.value)}
              placeholder="paste link..."
              style={{
                width: '100%',
                background: '#0b0b0f',
                border: '1px solid #1e1e2a',
                borderRadius: 2,
                color: '#d4d4e0',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                padding: '9px 14px',
                outline: 'none',
                transition: 'border-color 0.15s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#6244a0'; }}
              onBlur={(e) => { e.target.style.borderColor = '#1e1e2a'; }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSeal}
              disabled={!text.trim()}
              style={{
                padding: '11px 24px',
                background: text.trim() ? 'transparent' : 'transparent',
                border: `1px solid ${text.trim() ? '#6244a0' : '#1e1e2a'}`,
                borderRadius: 2,
                color: text.trim() ? '#8462cc' : '#28283a',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.14em',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              SEAL MESSAGE
            </button>
            <button
              onClick={() => navigate('safezone')}
              style={{
                padding: '11px 20px',
                background: 'transparent',
                border: '1px solid #16161e',
                borderRadius: 2,
                color: '#4e4e62',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.12em',
                cursor: 'pointer',
              }}
            >
              VIEW ARCHIVE
            </button>
          </div>
        </div>
      )}

      {vaultState === 'sealing' && (
        <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#0b0b0f', border: '1px solid #1e1e2a', borderRadius: 2, padding: '32px 28px', textAlign: 'center' }}>
            <SealAnimation />
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#4e4e62', marginTop: 20 }}>
              SEALING MESSAGE...
            </div>
          </div>
        </div>
      )}

      {vaultState === 'sealed' && (
        <div style={{ maxWidth: 480, animation: 'fadeInUp 0.4s ease forwards' }}>
          <div
            style={{
              background: '#0b0b0f',
              border: '1px solid #1e1e2a',
              borderLeft: '2px solid #6244a0',
              borderRadius: 2,
              padding: '24px 24px',
              marginBottom: 16,
            }}
          >
            <div className="font-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0', marginBottom: 4 }}>
              MESSAGE SEALED
            </div>
            <div className="font-mono" style={{ fontSize: 9, color: '#4e4e62', letterSpacing: '0.1em', marginBottom: 20 }}>
              YOUR WORDS HAVE BEEN ARCHIVED
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MetaBlock label="ENTRY ID" value={sealedId} accent />
              <MetaBlock label="STATUS" value="● ARCHIVED" accent />
              <MetaBlock label="VERIFICATION" value="● VERIFIED" accent />
              <MetaBlock label="ACCESS" value="PUBLIC ARCHIVE" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('safezone')}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #6244a0',
                borderRadius: 2,
                color: '#8462cc',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.12em',
                cursor: 'pointer',
              }}
            >
              VIEW IN ARCHIVE
            </button>
            <button
              onClick={() => {
                setVaultState('entry');
                setText('');
                setAttachment('');
              }}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #1e1e2a',
                borderRadius: 2,
                color: '#4e4e62',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.12em',
                cursor: 'pointer',
              }}
            >
              SEAL ANOTHER
            </button>
            <button
              onClick={() => navigate('dashboard')}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: 'none',
                color: '#28283a',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 8,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              RETURN TO ARCHIVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SealAnimation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        style={{ animation: 'seal-spin 1.5s linear infinite' }}
      >
        <circle cx="24" cy="24" r="20" stroke="#1e1e2a" strokeWidth="1" />
        <circle cx="24" cy="24" r="20" stroke="#6244a0" strokeWidth="1" strokeDasharray="60 66" />
        <circle cx="24" cy="24" r="12" stroke="#26263a" strokeWidth="0.5" />
        <circle cx="24" cy="24" r="4" fill="#6244a0" />
      </svg>
    </div>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
      <span className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.08em' }}>{label}</span>
    </div>
  );
}

function MetaBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
      <div className="font-mono" style={{ fontSize: 9, color: accent ? '#8462cc' : '#d4d4e0', letterSpacing: '0.06em' }}>{value}</div>
    </div>
  );
}
