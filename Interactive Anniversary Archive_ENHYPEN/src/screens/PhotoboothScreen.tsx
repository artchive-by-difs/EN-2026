import { useState, useRef, useEffect, useCallback } from 'react';
import type { Screen } from '../types';

type BoothState = 'idle' | 'ready' | 'countdown1' | 'preview1' | 'countdown2' | 'preview2' | 'final';

interface Props {
  navigate: (s: Screen) => void;
  onComplete: (photo1: string, photo2: string) => void;
}

export default function PhotoboothScreen({ navigate, onComplete }: Props) {
  const [state, setState] = useState<BoothState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState('');
  const [time, setTime] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (countRef.current) {
      clearInterval(countRef.current);
      countRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const startCamera = async (facing = facingMode) => {
    setCameraError('');
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState('ready');
    } catch {
      setCameraError('CAMERA ACCESS DENIED · ALLOW CAMERA PERMISSION TO CONTINUE');
    }
  };

  const switchCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    if (state === 'ready') startCamera(next);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    if (facingMode === 'user') ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Apply CCTV filter via grayscale canvas manipulation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = d[i] * 0.2 + d[i + 1] * 0.6 + d[i + 2] * 0.2;
      d[i] = Math.min(255, gray * 0.7 + 10);
      d[i + 1] = Math.min(255, gray * 0.65 + 8);
      d[i + 2] = Math.min(255, gray * 0.75 + 14);
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const doCountdown = (onCapture: () => void) => {
    setCountdown(3);
    let c = 3;
    countRef.current = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(countRef.current!);
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
        onCapture();
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  const handleCapture1 = () => {
    setState('countdown1');
    doCountdown(() => {
      const dataUrl = capturePhoto();
      if (dataUrl) setPhoto1(dataUrl);
      setState('preview1');
    });
  };

  const handleCapture2 = () => {
    setState('countdown2');
    doCountdown(() => {
      const dataUrl = capturePhoto();
      if (dataUrl) setPhoto2(dataUrl);
      setState('preview2');
    });
  };

  const handleRetake1 = () => {
    setPhoto1(null);
    setState('ready');
  };

  const handleRetake2 = () => {
    setPhoto2(null);
    setState('preview1');
  };

  const handleFinalize = () => {
    if (photo1 && photo2) {
      stopStream();
      onComplete(photo1, photo2);
    }
  };

  const isCountdown = state === 'countdown1' || state === 'countdown2';
  const showVideo = state === 'ready' || isCountdown || state === 'preview1';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 28px)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="font-heading" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.06em', color: '#d4d4e0' }}>
          CAMERA SYSTEM / PHOTOBOOTH
        </div>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62', marginTop: 4 }}>
          ARCHIVE CAM 06 · LANDSCAPE FORMAT · DUAL CAPTURE
        </div>
      </div>

      {/* Status chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <StatusChip color={state !== 'idle' ? '#2e8050' : '#246040'} label={state !== 'idle' ? 'CAMERA LIVE' : 'CAMERA STANDBY'} />
        {photo1 && <StatusChip color="#6244a0" label="MEMORY 01 CAPTURED" />}
        {photo2 && <StatusChip color="#6244a0" label="MEMORY 02 CAPTURED" />}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: state === 'final' || (state === 'preview2' && photo2) ? '1fr' : 'minmax(0,1fr) 260px',
          gap: 16,
          alignItems: 'start',
        }}
        className="booth-grid"
      >
        {/* Camera / Preview area */}
        <div>
          {state === 'idle' && (
            <div
              style={{
                aspectRatio: '16/9',
                background: '#0b0b0f',
                border: '1px solid #16161e',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              {cameraError ? (
                <div className="font-mono" style={{ fontSize: 9, color: '#9e2424', letterSpacing: '0.1em', textAlign: 'center', padding: '0 24px' }}>
                  {cameraError}
                </div>
              ) : (
                <>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="14" stroke="#26263a" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="8" stroke="#26263a" strokeWidth="1" />
                    <rect x="28" y="8" width="4" height="4" fill="#26263a" />
                  </svg>
                  <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', color: '#4e4e62' }}>
                    CAMERA SYSTEM STANDBY
                  </div>
                </>
              )}
              <button
                onClick={() => startCamera()}
                style={{
                  marginTop: 8,
                  padding: '9px 20px',
                  background: 'transparent',
                  border: '1px solid #6244a0',
                  borderRadius: 2,
                  color: '#8462cc',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  cursor: 'pointer',
                }}
              >
                START CAMERA
              </button>
            </div>
          )}

          {/* Video feed */}
          {showVideo && (
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                background: '#0b0b0f',
                border: '1px solid #16161e',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'grayscale(40%) brightness(0.8) contrast(1.1)',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                }}
              />

              {/* Scanlines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              />
              {/* Vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                  pointerEvents: 'none',
                  zIndex: 11,
                }}
              />

              {/* HUD top */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="rec-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#cc2e2e' }} />
                  <span className="font-mono" style={{ fontSize: 8, color: '#cc2e2e', letterSpacing: '0.1em' }}>REC</span>
                </div>
                <span className="font-mono" style={{ fontSize: 8, color: 'rgba(212,212,224,0.6)', letterSpacing: '0.1em' }}>CAMERA 06</span>
              </div>

              {/* HUD bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 20 }}>
                <div>
                  <div className="font-mono" style={{ fontSize: 8, color: 'rgba(212,212,224,0.7)' }}>{time}</div>
                  <div className="font-mono" style={{ fontSize: 7, color: 'rgba(78,78,98,0.8)' }}>{currentDate}</div>
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: 7, color: 'rgba(78,78,98,0.8)', textAlign: 'right' }}>
                    {state === 'preview1' ? 'CAPTURE PHOTO 02' : 'CAPTURE PHOTO 01'}
                  </div>
                  <div className="font-mono" style={{ fontSize: 7, color: 'rgba(46,128,80,0.8)', textAlign: 'right' }}>SIGNAL STABLE</div>
                </div>
              </div>

              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 16, left: 16, width: 20, height: 20, borderTop: '1px solid rgba(98,68,160,0.5)', borderLeft: '1px solid rgba(98,68,160,0.5)', zIndex: 20 }} />
              <div style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderTop: '1px solid rgba(98,68,160,0.5)', borderRight: '1px solid rgba(98,68,160,0.5)', zIndex: 20 }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, width: 20, height: 20, borderBottom: '1px solid rgba(98,68,160,0.5)', borderLeft: '1px solid rgba(98,68,160,0.5)', zIndex: 20 }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 20, height: 20, borderBottom: '1px solid rgba(98,68,160,0.5)', borderRight: '1px solid rgba(98,68,160,0.5)', zIndex: 20 }} />

              {/* Countdown overlay */}
              {isCountdown && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                    background: 'rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    className="font-heading"
                    style={{
                      fontSize: 'clamp(80px, 20vw, 140px)',
                      fontWeight: 700,
                      color: 'rgba(212,212,224,0.9)',
                      animation: 'countdown-pulse 1s ease-in-out infinite',
                      textShadow: '0 0 40px rgba(98,68,160,0.5)',
                    }}
                  >
                    {countdown}
                  </div>
                </div>
              )}

              {/* Flash */}
              {flash && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'white',
                    zIndex: 40,
                    animation: 'flash-capture 0.3s ease-out forwards',
                  }}
                />
              )}
            </div>
          )}

          {/* Photo preview row (after both captures, before final) */}
          {(state === 'preview1' || state === 'preview2') && photo1 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {/* Photo 1 thumbnail */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.1em', marginBottom: 4 }}>MEMORY 01</div>
                <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid #1e1e2a' }}>
                  <img src={photo1} alt="Photo 1" style={{ width: '100%', display: 'block' }} />
                  <div style={{ position: 'absolute', top: 4, left: 4 }}>
                    <span className="font-mono" style={{ fontSize: 6, color: '#6244a0', background: 'rgba(0,0,0,0.7)', padding: '1px 4px' }}>✓ CAPTURED</span>
                  </div>
                </div>
                {state === 'preview1' && (
                  <button onClick={handleRetake1} style={retakeBtn}>RETAKE 01</button>
                )}
              </div>
              {/* Photo 2 thumbnail */}
              {photo2 && (
                <div style={{ flex: 1 }}>
                  <div className="font-mono" style={{ fontSize: 7, color: '#4e4e62', letterSpacing: '0.1em', marginBottom: 4 }}>MEMORY 02</div>
                  <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid #1e1e2a' }}>
                    <img src={photo2} alt="Photo 2" style={{ width: '100%', display: 'block' }} />
                    <div style={{ position: 'absolute', top: 4, left: 4 }}>
                      <span className="font-mono" style={{ fontSize: 6, color: '#6244a0', background: 'rgba(0,0,0,0.7)', padding: '1px 4px' }}>✓ CAPTURED</span>
                    </div>
                  </div>
                  {state === 'preview2' && (
                    <button onClick={handleRetake2} style={retakeBtn}>RETAKE 02</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {state === 'idle' && (
            <InfoCard title="INSTRUCTIONS">
              <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', lineHeight: 1.7, letterSpacing: '0.08em' }}>
                01 · START CAMERA<br />
                02 · CAPTURE PHOTO 01<br />
                03 · KEEP OR RETAKE<br />
                04 · CAPTURE PHOTO 02<br />
                05 · KEEP OR RETAKE<br />
                06 · SAVE ARCHIVE IMAGE
              </div>
            </InfoCard>
          )}

          {state === 'ready' && (
            <>
              <InfoCard title="CAMERA READY">
                <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.08em' }}>
                  PHOTO 01 / 02
                  <br />FORMAT: LANDSCAPE
                </div>
              </InfoCard>
              <button onClick={handleCapture1} style={primaryBtn}>CAPTURE PHOTO 01</button>
              <button onClick={switchCamera} style={secondaryBtn}>SWITCH CAMERA</button>
            </>
          )}

          {(state === 'countdown1' || state === 'countdown2') && (
            <InfoCard title="COUNTDOWN">
              <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.08em' }}>
                HOLD STILL...
              </div>
            </InfoCard>
          )}

          {state === 'preview1' && (
            <>
              <InfoCard title="PHOTO 01 CAPTURED">
                <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.08em' }}>
                  REVIEW AND PROCEED TO<br />CAPTURE PHOTO 02
                </div>
              </InfoCard>
              <button onClick={handleCapture2} style={primaryBtn}>CAPTURE PHOTO 02</button>
              <button onClick={handleRetake1} style={secondaryBtn}>RETAKE PHOTO 01</button>
            </>
          )}

          {state === 'preview2' && photo2 && (
            <>
              <InfoCard title="BOTH MEMORIES READY">
                <div className="font-mono" style={{ fontSize: 8, color: '#4e4e62', letterSpacing: '0.08em' }}>
                  REVIEW YOUR CAPTURES<br />AND FINALIZE
                </div>
              </InfoCard>
              <button onClick={handleFinalize} style={primaryBtn}>FINALIZE ARCHIVE</button>
              <button onClick={handleRetake2} style={secondaryBtn}>RETAKE PHOTO 02</button>
              <button onClick={handleRetake1} style={secondaryBtn}>RETAKE PHOTO 01</button>
            </>
          )}

          <div style={{ height: 1, background: '#16161e' }} />
          <button onClick={() => { stopStream(); navigate('dashboard'); }} style={dimBtn}>
            RETURN TO ARCHIVE
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
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

const retakeBtn: React.CSSProperties = {
  marginTop: 6,
  padding: '5px 10px',
  background: 'transparent',
  border: '1px solid #1e1e2a',
  borderRadius: 2,
  color: '#4e4e62',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 7,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center' as const,
};

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b0b0f', border: '1px solid #16161e', borderRadius: 2, padding: '10px 12px' }}>
      <div className="font-mono" style={{ fontSize: 7, letterSpacing: '0.12em', color: '#4e4e62', marginBottom: 8, borderBottom: '1px solid #16161e', paddingBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatusChip({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
      <span className="font-mono" style={{ fontSize: 8, letterSpacing: '0.1em', color: '#4e4e62' }}>{label}</span>
    </div>
  );
}
