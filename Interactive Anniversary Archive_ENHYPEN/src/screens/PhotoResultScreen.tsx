import { useRef } from 'react';
import type { Screen } from '../types';

interface Props {
  photo1: string;
  photo2: string;
  navigate: (s: Screen) => void;
}

function genArchiveId() {
  return '#06' + Math.floor(1000 + Math.random() * 9000);
}

const ARCHIVE_ID = genArchiveId();

export default function PhotoResultScreen({ photo1, photo2, navigate }: Props) {
  const compositeRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

  const handleDownload = async () => {
    // Use html2canvas-like approach via canvas
    const canvas = document.createElement('canvas');
    const W = 1000;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#07070a';
    ctx.fillRect(0, 0, W, H);

    // Draw header bar
    ctx.fillStyle = '#0b0b0f';
    ctx.fillRect(0, 0, W, 60);
    ctx.strokeStyle = '#1e1e2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(W, 60);
    ctx.stroke();

    // Header text
    ctx.fillStyle = '#4e4e62';
    ctx.font = '400 11px "JetBrains Mono", monospace';
    ctx.fillText('REC', 20, 35);
    ctx.fillText('CAMERA 06', W / 2 - 50, 35);
    ctx.fillText('EN-ARCHIVE / 06', W - 150, 35);

    // Draw photos
    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
      });

    try {
      const [img1, img2] = await Promise.all([loadImg(photo1), loadImg(photo2)]);
      const imgH = (H - 60 - 120) / 2 - 8;

      ctx.drawImage(img1, 20, 68, W - 40, imgH);
      ctx.drawImage(img2, 20, 68 + imgH + 8, W - 40, imgH);

      // Scanlines
      ctx.globalAlpha = 0.1;
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, y + 3, W, 1);
      }
      ctx.globalAlpha = 1;

      // Footer
      ctx.fillStyle = '#0b0b0f';
      ctx.fillRect(0, H - 120, W, 120);
      ctx.strokeStyle = '#1e1e2a';
      ctx.beginPath();
      ctx.moveTo(0, H - 120);
      ctx.lineTo(W, H - 120);
      ctx.stroke();

      ctx.fillStyle = '#4e4e62';
      ctx.font = '400 10px "JetBrains Mono", monospace';
      ctx.fillText(`ARCHIVE ID: ${ARCHIVE_ID}`, 20, H - 90);
      ctx.fillText(`DATE: ${dateStr}`, 20, H - 70);
      ctx.fillText(`TIME: ${timeStr}`, 20, H - 50);
      ctx.fillText('STATUS: VERIFIED · MEMORY SEALED', 20, H - 30);

      ctx.fillStyle = '#6244a0';
      ctx.font = '600 14px "Barlow Condensed", sans-serif';
      ctx.fillText('EN-ARCHIVE / 06 · 6TH ANNIVERSARY', W / 2 - 140, H - 10);
    } catch {
      // fallback: just download composite layout
    }

    const link = document.createElement('a');
    link.download = `en-archive-06-${ARCHIVE_ID.replace('#', '')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  };

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="font-heading" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0' }}>
            ARCHIVE RESULT
          </div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 4 }}>
            CAMERA 06 · MEMORY COMPOSITE · SYSTEM VERIFIED
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2e8050' }} />
          <span className="font-mono" style={{ fontSize: 9, color: '#2e8050', letterSpacing: '0.1em' }}>MEMORY PRESERVED</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 220px',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Composite photo display */}
        <div
          ref={compositeRef}
          style={{
            background: '#0b0b0f',
            border: '1px solid #1e1e2a',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Archive header */}
          <div
            style={{
              background: '#07070a',
              borderBottom: '1px solid #16161e',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="rec-blink" style={{ width: 5, height: 5, borderRadius: '50%', background: '#cc2e2e' }} />
              <span className="font-mono" style={{ fontSize: 7, color: '#cc2e2e', letterSpacing: '0.1em' }}>REC</span>
            </div>
            <span className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.1em' }}>CAMERA 06 · EN-ARCHIVE / 06</span>
            <span className="font-mono" style={{ fontSize: 7, color: '#4e4e62' }}>{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>

          {/* Photos */}
          <div style={{ position: 'relative' }}>
            {/* Photo 1 */}
            <div style={{ position: 'relative', borderBottom: '1px solid #16161e' }}>
              <img src={photo1} alt="Memory 01" style={{ width: '100%', display: 'block' }} />
              {/* Scanlines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'absolute', top: 8, left: 10 }}>
                <span className="font-mono" style={{ fontSize: 7, color: 'rgba(212,212,224,0.7)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', letterSpacing: '0.1em' }}>
                  MEMORY 01
                </span>
              </div>
            </div>

            {/* Photo 2 */}
            <div style={{ position: 'relative' }}>
              <img src={photo2} alt="Memory 02" style={{ width: '100%', display: 'block' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'absolute', top: 8, left: 10 }}>
                <span className="font-mono" style={{ fontSize: 7, color: 'rgba(212,212,224,0.7)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', letterSpacing: '0.1em' }}>
                  MEMORY 02
                </span>
              </div>
            </div>
          </div>

          {/* Archive footer */}
          <div
            style={{
              background: '#07070a',
              borderTop: '1px solid #16161e',
              padding: '10px 14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
            }}
          >
            <MetaField label="ARCHIVE ID" value={ARCHIVE_ID} accent />
            <MetaField label="DATE" value={dateStr} />
            <MetaField label="TIME" value={timeStr} />
            <MetaField label="STATUS" value="SYSTEM VERIFIED" accent />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, padding: '12px 14px' }}>
            <div className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.12em', marginBottom: 10, borderBottom: '1px solid #16161e', paddingBottom: 8 }}>
              ARCHIVE RECORD
            </div>
            <MetaField label="ARCHIVE ID" value={ARCHIVE_ID} accent />
            <div style={{ margin: '6px 0' }} />
            <MetaField label="CAMERA" value="CAM 06" />
            <div style={{ margin: '6px 0' }} />
            <MetaField label="DATE" value={dateStr} />
            <div style={{ margin: '6px 0' }} />
            <MetaField label="FORMAT" value="LANDSCAPE × 2" />
            <div style={{ margin: '6px 0' }} />
            <MetaField label="STATUS" value="● VERIFIED" accent />
          </div>

          <button onClick={handleDownload} style={primaryBtn}>DOWNLOAD IMAGE</button>
          <button onClick={() => navigate('photobooth')} style={secondaryBtn}>RETAKE</button>
          <button onClick={() => navigate('dashboard')} style={dimBtn}>RETURN TO ARCHIVE</button>
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 7, color: '#28283a', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
      <div className="font-mono" style={{ fontSize: 8, color: accent ? '#8462cc' : '#d4d4e0', letterSpacing: '0.06em' }}>{value}</div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 14px',
  background: 'transparent',
  border: '1px solid #6244a0',
  borderRadius: 2,
  color: '#8462cc',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9,
  letterSpacing: '0.12em',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
};

const secondaryBtn: React.CSSProperties = {
  padding: '9px 14px',
  background: 'transparent',
  border: '1px solid #1e1e2a',
  borderRadius: 2,
  color: '#4e4e62',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 9,
  letterSpacing: '0.12em',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
};

const dimBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  border: 'none',
  color: '#28283a',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 8,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
};
