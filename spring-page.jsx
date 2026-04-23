// spring-page.jsx — Interactive spring garden landing page
// Hover/click-driven animations; no autoplay timeline.

const C = {
  cream:     '#faf4e8',
  paper:     '#fff9ee',
  ink:       '#2a2320',
  inkSoft:   '#4a3f36',
  inkMute:   '#8a7d70',
  line:      'rgba(42,35,32,0.12)',
  sage:      '#8bab5a',
  sageDark:  '#556b3a',
  soil:      '#5a3f32',
  sun:       '#ffd48a',
  // tulip palette
  red:       'oklch(68% 0.18 25)',
  redDeep:   'oklch(58% 0.18 22)',
  pink:      'oklch(78% 0.13 10)',
  yellow:    'oklch(85% 0.14 85)',
  purple:    'oklch(55% 0.14 310)',
  coral:     'oklch(72% 0.16 45)',
  white:     'oklch(82% 0.09 60)',  // warm cream-blush (not pure white)
  lavender:  'oklch(72% 0.09 300)',
};
const SERIF = "'Fraunces', Georgia, serif";
const SANS  = "'Inter', system-ui, sans-serif";
const MONO  = "'JetBrains Mono', ui-monospace, monospace";

// ── Tulip SVG (reusable) ────────────────────────────────────────────────────
function Tulip({ color = C.red, openness = 1, size = 60, sway = 0, stemH = 0.95 }) {
  const o = Math.max(0, Math.min(1, openness));
  const petalW = 18 + 6 * o;
  const petalH = 28 + 4 * o;
  const sideLean = 4 + 10 * o;
  return (
    <svg width={size} height={size * 2.6} viewBox="0 0 60 160"
      style={{ overflow: 'visible', transform: `rotate(${sway}deg)`, transformOrigin: '30px 160px', display: 'block' }}>
      <path d={`M30 ${160 - 150*stemH} C 32 110 28 80 30 ${40 + (1-o)*5}`} stroke={C.sageDark} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M30 95 C 10 90 6 74 14 58 C 18 70 24 82 30 93 Z" fill={C.sage} opacity="0.95"/>
      <path d="M30 105 C 48 103 54 86 48 72 C 42 82 36 94 30 105 Z" fill={C.sageDark} opacity="0.85"/>
      <ellipse cx="30" cy={42 - o * 6} rx={petalW * 0.85} ry={petalH} fill={color} style={{filter:'brightness(0.85)'}} />
      <ellipse cx={30 - sideLean} cy={44 - o * 2} rx={petalW * 0.8} ry={petalH * 0.95} fill={color} transform={`rotate(-${8 + o*8} ${30 - sideLean} 44)`} />
      <ellipse cx={30 + sideLean} cy={44 - o * 2} rx={petalW * 0.8} ry={petalH * 0.95} fill={color} transform={`rotate(${8 + o*8} ${30 + sideLean} 44)`} />
      <ellipse cx="30" cy={46 - o * 2} rx={petalW * 0.75} ry={petalH * 0.9} fill={color} style={{filter:'brightness(1.08)'}} />
      <ellipse cx={30 - 4} cy={38} rx="2.5" ry="6" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

function DaisyMark({ size = 18, color = 'white', center = C.yellow }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{display:'block'}}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <ellipse key={deg} cx="20" cy="10" rx="3.8" ry="7.5" fill={color} transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3.5" fill={center} />
    </svg>
  );
}

// ── Cursor tracker (normalized -1..1 from an element) ──────────────────────
function useCursorInside(ref) {
  const [pos, setPos] = React.useState({ x: 0, y: 0, inside: false });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = ((e.clientY - r.top) / r.height) * 2 - 1;
      setPos({ x, y, inside: true });
    };
    const onLeave = () => setPos(p => ({ ...p, inside: false }));
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref]);
  return pos;
}

// ── Hero garden: tulips sway toward cursor, bloom on hover ──────────────────
function HeroGarden() {
  const gardenRef = React.useRef(null);
  const cursor = useCursorInside(gardenRef);

  const tulips = React.useMemo(() => ([
    { xPct: 6,   color: C.red,    size: 80, stemH: 0.95, o: 0.95 },
    { xPct: 14,  color: C.pink,   size: 66, stemH: 0.82, o: 0.9 },
    { xPct: 22,  color: C.yellow, size: 72, stemH: 0.88, o: 1.0 },
    { xPct: 30,  color: C.purple, size: 74, stemH: 0.92, o: 0.85 },
    { xPct: 38,  color: C.coral,  size: 68, stemH: 0.84, o: 0.95 },
    { xPct: 46,  color: C.lavender, size: 62, stemH: 0.78, o: 0.9 },
    { xPct: 54,  color: C.red,    size: 78, stemH: 0.94, o: 1.0 },
    { xPct: 62,  color: C.pink,   size: 70, stemH: 0.86, o: 0.9 },
    { xPct: 70,  color: C.yellow, size: 74, stemH: 0.9, o: 0.95 },
    { xPct: 78,  color: C.purple, size: 66, stemH: 0.82, o: 0.9 },
    { xPct: 86,  color: C.coral,  size: 76, stemH: 0.94, o: 1.0 },
    { xPct: 94,  color: C.lavender, size: 64, stemH: 0.8, o: 0.9 },
  ]), []);

  return (
    <div ref={gardenRef} style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 360,
      pointerEvents: 'auto',
    }}>
      {/* soil gradient */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 90,
        background: `linear-gradient(180deg, ${C.sageDark} 0%, ${C.soil} 50%, #2e1f18 100%)`,
      }}/>
      {/* grass blades */}
      {Array.from({length: 80}).map((_, i) => {
        const seed = i * 7.3 + 2;
        const x = (seed * 17) % 100;
        const h = 10 + (seed % 18);
        const tilt = ((seed % 7) - 3) * 2;
        const hueVar = [C.sage, C.sageDark, '#7a9a48'][i % 3];
        return (
          <div key={'g'+i} style={{
            position: 'absolute',
            left: `${x}%`, bottom: 80,
            width: 3, height: h,
            background: hueVar,
            borderRadius: '3px 3px 0 0',
            transformOrigin: 'bottom center',
            transform: `rotate(${tilt}deg)`,
          }}/>
        );
      })}
      {/* tulips */}
      {tulips.map((t, i) => {
        // sway toward cursor X; amount falls off with distance
        const cursorX = cursor.inside ? cursor.x : 0;
        const sway = cursor.inside ? cursorX * 7 + (i % 2 === 0 ? 1 : -1) * 1.5 : 0;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${t.xPct}%`, bottom: 70,
            transform: 'translateX(-50%)',
            transition: 'transform 420ms cubic-bezier(.2,.8,.2,1)',
          }}>
            <div style={{
              transform: `rotate(${sway}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)',
            }}>
              <Tulip color={t.color} openness={t.o} size={t.size} stemH={t.stemH} />
            </div>
          </div>
        );
      })}
      {/* mist */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 90, height: 80,
        background: 'linear-gradient(180deg, rgba(250,244,232,0) 0%, rgba(250,244,232,0.5) 60%, rgba(250,244,232,0) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

// ── Sparkle button: tiny flower particles on click, static hover ──────────
function SparkleButton({ children, variant = 'primary', onClick }) {
  const btnRef = React.useRef(null);
  const [bursts, setBursts] = React.useState([]);
  const [hover, setHover] = React.useState(false);
  const [magnet, setMagnet] = React.useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = btnRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // subtle magnet — 10% of cursor offset, capped
    const dx = Math.max(-6, Math.min(6, (e.clientX - cx) * 0.1));
    const dy = Math.max(-4, Math.min(4, (e.clientY - cy) * 0.1));
    setMagnet({ x: dx, y: dy });
  };
  const onLeave = () => { setHover(false); setMagnet({ x: 0, y: 0 }); };

  const spawnBurst = (e) => {
    const r = btnRef.current.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const particles = Array.from({ length: 14 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.3;
      const dist = 60 + Math.random() * 70;
      const colors = [C.red, C.pink, C.yellow, C.purple, C.coral];
      return {
        id: i,
        angle,
        dist,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        kind: Math.random() > 0.5 ? 'tulip' : 'daisy',
        size: 14 + Math.random() * 10,
      };
    });
    setBursts(b => [...b, { id, particles }]);
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1100);
    if (onClick) onClick(e);
  };

  const isPrimary = variant === 'primary';
  const bg = isPrimary ? C.ink : 'transparent';
  const fg = isPrimary ? C.cream : C.ink;
  const border = isPrimary ? 'none' : `1.5px solid ${C.ink}`;

  return (
    <button
      ref={btnRef}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={spawnBurst}
      style={{
        position: 'relative',
        padding: '18px 34px',
        background: bg,
        color: fg,
        border,
        borderRadius: 999,
        fontFamily: SANS,
        fontSize: 16,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        transform: `translate(${magnet.x}px, ${magnet.y}px)`,
        transition: 'transform 320ms cubic-bezier(.2,.8,.2,1), background 200ms, box-shadow 300ms',
        boxShadow: hover && isPrimary ? '0 10px 24px rgba(42,35,32,0.22)' : isPrimary ? '0 6px 18px rgba(42,35,32,0.18)' : 'none',
        overflow: 'visible',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        outline: 'none',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      <span style={{ position: 'relative', zIndex: 2, fontSize: 18, transform: `translateX(${hover ? 4 : 0}px)`, transition: 'transform 250ms' }}>→</span>
      {/* Hover sparkle - 2 daisies in opposite corners */}
      {hover && (() => {
        const daisyColor = isPrimary ? '#fff4d8' : '#fff4b8';
        return (
          <>
            <span style={{ position: 'absolute', top: 6, left: 10, zIndex: 1, animation: 'bloomIn 320ms ease forwards' }}>
              <DaisyMark size={13} color={daisyColor} center={C.coral}/>
            </span>
            <span style={{ position: 'absolute', bottom: 6, right: 12, zIndex: 1, animation: 'bloomIn 460ms ease forwards' }}>
              <DaisyMark size={13} color={daisyColor} center={C.red}/>
            </span>
          </>
        );
      })()}
      {/* click-burst particles */}
      {bursts.map(b => (
        <span key={b.id} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 0, height: 0, pointerEvents: 'none', zIndex: 3,
        }}>
          {b.particles.map(p => (
            <span key={p.id} style={{
              position: 'absolute',
              left: 0, top: 0,
              '--tx': `${Math.cos(p.angle) * p.dist}px`,
              '--ty': `${Math.sin(p.angle) * p.dist}px`,
              '--rot': `${p.rotation}deg`,
              animation: 'sparkleBurst 1000ms cubic-bezier(.15,.75,.3,1) forwards',
            }}>
              {p.kind === 'tulip' ? (
                <svg width={p.size} height={p.size * 1.4} viewBox="0 0 60 80" style={{display:'block'}}>
                  <ellipse cx="30" cy="30" rx="18" ry="24" fill={p.color} style={{filter:'brightness(0.9)'}}/>
                  <ellipse cx="22" cy="34" rx="14" ry="22" fill={p.color}/>
                  <ellipse cx="38" cy="34" rx="14" ry="22" fill={p.color} style={{filter:'brightness(1.08)'}}/>
                  <rect x="28" y="48" width="3" height="28" fill={C.sageDark}/>
                </svg>
              ) : (
                <DaisyMark size={p.size} color={p.color} center={C.yellow}/>
              )}
            </span>
          ))}
        </span>
      ))}
    </button>
  );
}

// ── Variety card (lift + petal tilt on hover) ───────────────────────────────
function VarietyCard({ name, kind, color, desc, bloomTime }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: C.paper,
        borderRadius: 24,
        border: `1px solid ${C.line}`,
        padding: 28,
        cursor: 'pointer',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 24px 48px rgba(42,35,32,0.14), 0 6px 14px rgba(42,35,32,0.08)'
          : '0 2px 6px rgba(42,35,32,0.04)',
        transition: 'transform 400ms cubic-bezier(.2,.8,.2,1), box-shadow 400ms',
        overflow: 'hidden',
      }}
    >
      {/* Color swatch background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 180,
        background: `linear-gradient(180deg, ${color} 0%, ${color} 60%, rgba(255,249,238,0) 100%)`,
        opacity: 0.18,
      }}/>
      {/* Flower */}
      <div style={{
        position: 'relative',
        height: 180,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        transform: hover ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
        transformOrigin: 'bottom center',
        transition: 'transform 500ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{
          transform: hover ? 'rotate(-4deg)' : 'rotate(0deg)',
          transformOrigin: 'bottom center',
          transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)',
        }}>
          <Tulip color={color} openness={hover ? 1 : 0.9} size={78} stemH={0.92} />
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 12 }}>
        <div style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: C.inkMute, marginBottom: 6,
        }}>
          {kind} · Blooms {bloomTime}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 500, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.inkSoft, lineHeight: 1.55, marginTop: 10 }}>
          {desc}
        </div>
        <div style={{
          marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink,
        }}>
          <span>View variety</span>
          <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: hover ? C.ink : 'transparent',
            border: `1.5px solid ${C.ink}`,
            color: hover ? C.cream : C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 250ms',
          }}>→</span>
        </div>
      </div>
    </div>
  );
}

// ── Nav link with underline sweep ───────────────────────────────────────────
function NavLink({ children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', color: C.ink, textDecoration: 'none',
        fontFamily: SANS, fontSize: 15, fontWeight: 500,
      }}>
      {children}
      <span style={{
        position: 'absolute', left: 0, right: 0, bottom: -6, height: 2,
        background: C.ink,
        transform: hover ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: hover ? 'left' : 'right',
        transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)',
      }}/>
    </a>
  );
}

// ── Growing guide step (hover to see stem grow) ─────────────────────────────
function GuideStep({ num, title, detail, month }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '32px 0',
        borderTop: `1px solid ${C.line}`,
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '80px 120px 1fr 100px',
        gap: 32,
        alignItems: 'center',
        transition: 'padding-left 300ms',
        paddingLeft: hover ? 24 : 0,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 13, color: C.inkMute, letterSpacing: '0.1em' }}>
        {num}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 12, color: C.ink, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {month}
      </div>
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 32, color: C.ink, letterSpacing: '-0.02em', fontWeight: 500, marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, color: C.inkSoft, lineHeight: 1.55, maxWidth: 580 }}>
          {detail}
        </div>
      </div>
      <div style={{
        height: 80, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end',
      }}>
        <div style={{
          transform: hover ? 'scaleY(1) translateY(0)' : 'scaleY(0.3) translateY(10px)',
          transformOrigin: 'bottom center',
          opacity: hover ? 1 : 0.5,
          transition: 'transform 550ms cubic-bezier(.2,.8,.2,1), opacity 400ms',
        }}>
          <Tulip color={[C.red, C.pink, C.yellow, C.purple][num - 1] || C.coral} openness={hover ? 1 : 0} size={50} stemH={0.9} />
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
function SpringPage() {
  const [email, setEmail] = React.useState('');

  return (
    <div style={{
      background: C.cream,
      color: C.ink,
      fontFamily: SANS,
      minWidth: 1280,
    }}>
      {/* Keyframes */}
      <style>{`
        @keyframes sparkleBurst {
          0%   { transform: translate(0,0) rotate(0deg) scale(0.2); opacity: 0; }
          15%  { opacity: 1; transform: translate(calc(var(--tx)*0.3), calc(var(--ty)*0.3)) rotate(calc(var(--rot)*0.3)) scale(1); }
          70%  { opacity: 1; }
          100% { transform: translate(var(--tx), calc(var(--ty) + 30px)) rotate(var(--rot)) scale(0.7); opacity: 0; }
        }
        @keyframes bloomIn {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes driftPetal {
          0%   { transform: translate(0,0) rotate(0deg); }
          50%  { transform: translate(20px, 40px) rotate(180deg); }
          100% { transform: translate(0, 80px) rotate(360deg); opacity: 0; }
        }
        @keyframes subtleFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.red}; color: ${C.cream}; }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 64px',
        background: 'rgba(250,244,232,0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="24" viewBox="0 0 20 24">
              <ellipse cx="10" cy="8" rx="6.5" ry="7.5" fill={C.coral}/>
              <ellipse cx="6" cy="10" rx="4.5" ry="6.5" fill={C.red}/>
              <ellipse cx="14" cy="10" rx="4.5" ry="6.5" fill={C.red} style={{filter:'brightness(1.1)'}}/>
              <rect x="9" y="14" width="2" height="9" fill={C.sage}/>
            </svg>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Hollowbrook
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40 }}>
          <NavLink>Varieties</NavLink>
          <NavLink>Garden Guide</NavLink>
          <NavLink>Calendar</NavLink>
          <NavLink>Journal</NavLink>
          <NavLink>Shop</NavLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <NavLink>Sign in</NavLink>
          <SparkleButton variant="primary">Shop blooms</SparkleButton>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: 820,
        paddingTop: 100,
        overflow: 'hidden',
      }}>
        {/* Sun */}
        <div style={{
          position: 'absolute', right: -120, top: 80,
          width: 420, height: 420, borderRadius: '50%',
          background: `radial-gradient(circle, #fff6e0 0%, ${C.sun} 45%, rgba(255,212,138,0) 75%)`,
          animation: 'subtleFloat 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}/>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 64px', position: 'relative' }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: C.ink, marginBottom: 36,
            display: 'inline-flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ width: 28, height: 1, background: C.ink, display: 'inline-block' }}/>
            Spring Collection · 2026
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: SERIF,
            fontSize: 'clamp(72px, 9vw, 148px)',
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
            fontWeight: 400,
            margin: 0,
            maxWidth: 1080,
          }}>
            Bloom where<br/>
            you&rsquo;re <em style={{ color: C.red, fontStyle: 'italic', fontWeight: 400 }}>planted.</em>
          </h1>

          {/* Subhead + CTA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 80,
            marginTop: 48,
            alignItems: 'start',
          }}>
            <div>
              <p style={{
                fontFamily: SANS, fontSize: 20, lineHeight: 1.55,
                color: C.inkSoft, maxWidth: 560, margin: 0,
              }}>
                Heirloom tulips, daffodils, and rare bulbs — hand-packed on a small
                family farm in the valley. Plant in autumn, wake up to spring.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
                <SparkleButton variant="primary">Browse all varieties</SparkleButton>
                <SparkleButton variant="ghost">Plan ur visit</SparkleButton>
              </div>
            </div>
            {/* Stat block */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
              padding: '24px 0',
            }}>
              {[
                { k: '142', u: 'Heirloom varieties' },
                { k: '38', u: 'Years of growing' },
                { k: 'Sep 1', u: 'Fall shipping opens' },
                { k: 'Zones 3–9', u: 'Planting regions' },
              ].map((s, i) => (
                <div key={i} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 500, letterSpacing: '-0.02em', color: C.ink, lineHeight: 1 }}>
                    {s.k}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkMute, marginTop: 8 }}>
                    {s.u}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive garden at bottom */}
        <div style={{ position: 'relative', height: 400, marginTop: 40 }}>
          <HeroGarden />
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.cream, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'subtleFloat 2.5s ease-in-out infinite',
        }}>
          <span style={{ width: 1, height: 24, background: C.cream, display: 'inline-block' }}/>
          Hover the garden
        </div>
      </section>

      {/* ══ VARIETIES ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 64px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, gap: 32 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 16 }}>
              ◦ 04 Featured varieties
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 72, fontWeight: 400, letterSpacing: '-0.03em', margin: 0, lineHeight: 1, maxWidth: 720 }}>
              A garden with <em style={{ fontStyle: 'italic', color: C.red }}>personality.</em>
            </h2>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 16, color: C.inkSoft, maxWidth: 360, lineHeight: 1.55 }}>
            Selected from four generations of growing — each variety tested for
            cold-hardiness, scent, and that one small detail you&rsquo;ll notice in April.
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}>
          <VarietyCard
            name="Angelique"
            kind="Double Late"
            color={C.pink}
            bloomTime="May"
            desc="Soft peony-form petals with a faint blush at the base. A favorite for cutting gardens."
          />
          <VarietyCard
            name="Queen of Night"
            kind="Single Late"
            color={C.purple}
            bloomTime="May"
            desc="The darkest tulip in cultivation — near-black with a velvet finish that catches light strangely."
          />
          <VarietyCard
            name="Flaming Parrot"
            kind="Parrot"
            color={C.red}
            bloomTime="April"
            desc="Ruffled, twisted petals in crimson streaked with yellow. A tulip that refuses to sit still."
          />
          <VarietyCard
            name="Yellow Crown"
            kind="Triumph"
            color={C.yellow}
            bloomTime="April"
            desc="Warm lemon gold, unfading in full sun. The workhorse of cheerful spring beds."
          />
        </div>
        <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center' }}>
          <SparkleButton variant="ghost">See all 142 varieties</SparkleButton>
        </div>
      </section>

      {/* ══ GROWING GUIDE ═══════════════════════════════════════════════ */}
      <section style={{
        background: C.paper,
        padding: '140px 64px',
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, marginBottom: 64, alignItems: 'end' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 16 }}>
                ◦ Growing guide
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 72, fontWeight: 400, letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
                Four seasons,<br/>one perfect spring.
              </h2>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 17, color: C.inkSoft, lineHeight: 1.6, maxWidth: 520 }}>
              Tulips are patient. They want cold soil, time, and very little from you
              in between. Here&rsquo;s our simple calendar — hover each step to watch
              it come up.
            </div>
          </div>
          <div>
            <GuideStep num={1} month="Oct · Nov" title="Tuck them in." detail="Plant bulbs 6 inches deep, pointy end up, after the first cold nights. Water once and forget them until April." />
            <GuideStep num={2} month="Dec · Feb" title="The long quiet." detail="A hard winter is a gift. Bulbs need roughly twelve weeks below 50°F to set the chemistry for a strong stem." />
            <GuideStep num={3} month="Mar" title="First green." detail="Leaves break ground in thin green blades. Feed lightly if your soil is tired; never overwater." />
            <GuideStep num={4} month="Apr · May" title="Bloom." detail="Flowers open over two to three weeks. Cut at an angle in the cool of morning; they'll last eight days in a vase." />
          </div>
        </div>
      </section>

      {/* ══ VISIT / MAP ═════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 64px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, marginBottom: 56, alignItems: 'end' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 16 }}>
                ◦ Visit the farm
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 72, fontWeight: 400, letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
                Come see the<br/>fields in <em style={{ fontStyle: 'italic', color: C.red }}>bloom.</em>
              </h2>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 17, color: C.inkSoft, lineHeight: 1.6, maxWidth: 520 }}>
              The farm opens to visitors during peak bloom each April and May.
              Wander the rows, cut your own bouquet, and leave with bulbs for fall
              planting. A short drive up the Hudson Valley.
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 24,
            background: C.paper,
            borderRadius: 32,
            border: `1px solid ${C.line}`,
            padding: 24,
          }}>
            {/* Stylized map */}
            <div style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              minHeight: 520,
              background: '#eaddc0',
            }}>
              <svg viewBox="0 0 600 520" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <defs>
                  <pattern id="fieldStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)">
                    <rect width="4" height="8" fill="rgba(107,138,74,0.22)"/>
                  </pattern>
                  <pattern id="tulipField" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(30)">
                    <rect width="5" height="10" fill="rgba(215,84,82,0.22)"/>
                  </pattern>
                </defs>

                {/* land base */}
                <rect width="600" height="520" fill="#eed9b5"/>

                {/* river */}
                <path d="M -20 80 C 80 120, 120 220, 80 300 S 40 450, 90 540"
                      stroke="#b8d2c9" strokeWidth="38" fill="none" strokeLinecap="round" opacity="0.9"/>
                <path d="M -20 80 C 80 120, 120 220, 80 300 S 40 450, 90 540"
                      stroke="#a8c5bb" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" strokeDasharray="1 6"/>

                {/* far field (sage stripes) */}
                <path d="M 200 60 L 540 50 L 580 180 L 230 200 Z" fill="url(#fieldStripes)" stroke="rgba(85,107,58,0.35)" strokeWidth="1"/>
                {/* tulip field (red stripes) */}
                <path d="M 230 210 L 580 195 L 560 340 L 210 360 Z" fill="url(#tulipField)" stroke="rgba(168,60,60,0.4)" strokeWidth="1"/>
                {/* orchard */}
                <path d="M 210 370 L 560 355 L 540 480 L 190 495 Z" fill="rgba(107,138,74,0.18)" stroke="rgba(85,107,58,0.3)" strokeWidth="1"/>

                {/* roads */}
                <path d="M 0 430 Q 180 420 320 400 T 600 340"
                      stroke="#fbf2df" strokeWidth="14" fill="none" strokeLinecap="round"/>
                <path d="M 0 430 Q 180 420 320 400 T 600 340"
                      stroke="rgba(90,63,50,0.18)" strokeWidth="1" fill="none" strokeDasharray="3 6"/>
                <path d="M 240 0 Q 260 120 300 250 T 360 520"
                      stroke="#fbf2df" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M 240 0 Q 260 120 300 250 T 360 520"
                      stroke="rgba(90,63,50,0.18)" strokeWidth="1" fill="none" strokeDasharray="3 6"/>

                {/* scattered trees */}
                {[[120,160,6],[160,180,5],[90,360,6],[150,420,5],[520,440,6],[470,400,5],[540,80,6],[490,110,5]].map(([cx,cy,r],i) => (
                  <g key={i} transform={`translate(${cx} ${cy})`}>
                    <circle r={r} fill="#6b8a4a" opacity="0.85"/>
                    <circle cx={-r*0.5} cy={-r*0.4} r={r*0.35} fill="#8bab5a" opacity="0.6"/>
                  </g>
                ))}

                {/* barns/buildings near marker */}
                <g transform="translate(300 280)">
                  <rect x="-22" y="-6" width="28" height="18" fill="#8a5a3e" stroke="#5a3f32" strokeWidth="1"/>
                  <polygon points="-22,-6 -8,-16 6,-6" fill="#6a4530" stroke="#5a3f32" strokeWidth="1"/>
                  <rect x="10" y="-2" width="20" height="14" fill="#c4a278" stroke="#5a3f32" strokeWidth="1"/>
                  <polygon points="10,-2 20,-10 30,-2" fill="#9a7a50" stroke="#5a3f32" strokeWidth="1"/>
                </g>

                {/* labels */}
                <text x="40" y="64" fill="rgba(42,35,32,0.55)" fontSize="11" fontFamily={MONO} letterSpacing="2">HUDSON RIVER</text>
                <text x="380" y="130" fill="rgba(42,35,32,0.55)" fontSize="11" fontFamily={MONO} letterSpacing="2">SAGE FIELD</text>
                <text x="370" y="280" fill="rgba(168,60,60,0.8)" fontSize="11" fontFamily={MONO} letterSpacing="2">TULIP ROWS</text>
                <text x="360" y="430" fill="rgba(85,107,58,0.75)" fontSize="11" fontFamily={MONO} letterSpacing="2">ORCHARD</text>
                <text x="20" y="420" fill="rgba(90,63,50,0.55)" fontSize="10" fontFamily={MONO} letterSpacing="2" transform="rotate(-4 20 420)">COUNTY RD 9W</text>
                <text x="310" y="110" fill="rgba(90,63,50,0.55)" fontSize="10" fontFamily={MONO} letterSpacing="2" transform="rotate(82 310 110)">HOLLOW LN</text>
              </svg>

              {/* Pin marker */}
              <div style={{
                position: 'absolute', left: '50%', top: '54%',
                transform: 'translate(-50%, -100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                filter: 'drop-shadow(0 6px 10px rgba(42,35,32,0.2))',
              }}>
                <div style={{
                  background: C.ink, color: C.cream,
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', marginBottom: 10,
                }}>
                  Hollowbrook Farm
                </div>
                <div style={{ width: 36, height: 48, position: 'relative' }}>
                  <svg width="36" height="48" viewBox="0 0 36 48">
                    <path d="M 18 47 C 18 36 32 28 32 16 A 14 14 0 1 0 4 16 C 4 28 18 36 18 47 Z"
                          fill={C.red} stroke={C.ink} strokeWidth="1.5"/>
                    <circle cx="18" cy="16" r="5" fill={C.cream}/>
                  </svg>
                </div>
              </div>

              {/* Compass */}
              <div style={{
                position: 'absolute', bottom: 18, right: 18,
                width: 56, height: 56, borderRadius: '50%',
                background: C.cream, border: `1px solid ${C.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(42,35,32,0.12)',
                fontFamily: MONO, fontSize: 10, color: C.inkMute, letterSpacing: '0.1em',
                position: 'absolute',
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="20,6 23,20 20,18 17,20" fill={C.red}/>
                  <polygon points="20,34 17,20 20,22 23,20" fill={C.ink}/>
                </svg>
                <span style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: C.ink, fontWeight: 600 }}>N</span>
              </div>

              {/* Scale bar */}
              <div style={{
                position: 'absolute', bottom: 18, left: 18,
                padding: '6px 12px',
                background: C.cream,
                border: `1px solid ${C.line}`,
                borderRadius: 999,
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkMute,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 30, height: 2, background: C.ink, display: 'inline-block' }}/>
                1/4 mile
              </div>
            </div>

            {/* Visit info panel */}
            <div style={{ padding: '24px 16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Address */}
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 10 }}>
                  Address
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: C.ink, lineHeight: 1.2, marginBottom: 6 }}>
                  Hollowbrook Farm
                </div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: C.inkSoft, lineHeight: 1.55 }}>
                  482 Hollow Lane<br/>
                  Rhinebeck, NY 12572
                </div>
              </div>

              {/* Hours */}
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 12 }}>
                  Opening Hours · Bloom season
                </div>
                <div style={{ borderTop: `1px solid ${C.line}` }}>
                  {[
                    { day: 'Mon', hrs: 'Closed',        muted: true  },
                    { day: 'Tue', hrs: '10:00 – 5:00',  muted: false },
                    { day: 'Wed', hrs: '10:00 – 5:00',  muted: false },
                    { day: 'Thu', hrs: '10:00 – 6:00',  muted: false },
                    { day: 'Fri', hrs: '10:00 – 6:00',  muted: false },
                    { day: 'Sat', hrs: '9:00 – 7:00',   muted: false, accent: true },
                    { day: 'Sun', hrs: '9:00 – 5:00',   muted: false, accent: true },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '11px 0',
                      borderBottom: `1px solid ${C.line}`,
                      fontFamily: SANS, fontSize: 15,
                      color: r.muted ? C.inkMute : C.ink,
                    }}>
                      <span style={{ fontWeight: r.accent ? 600 : 500, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        {r.accent && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, display: 'inline-block' }}/>}
                        {r.day}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 13, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
                        {r.hrs}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.inkMute, marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, display: 'inline-block' }}/>
                  Peak bloom · Apr 15 – May 20
                </div>
              </div>

              {/* Contact row */}
              <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${C.line}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 4 }}>
                    Call
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 15, color: C.ink }}>
                    (845) 876‑0482
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 4 }}>
                    Write
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 15, color: C.ink }}>
                    hello@hollowbrook.farm
                  </div>
                </div>
              </div>

              <SparkleButton variant="primary">Get directions</SparkleButton>
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER / FOOTER ═════════════════════════════════════════ */}
      <section style={{ padding: '120px 64px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            background: C.ink, color: C.cream,
            borderRadius: 32,
            padding: '80px 80px',
            display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -40, bottom: -80, opacity: 0.25 }}>
              <Tulip color={C.coral} openness={1} size={260} stemH={1}/>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.sun, marginBottom: 20 }}>
                ◦ Field notes
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 400, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                A letter from the<br/>farm, once a season.
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 17, color: 'rgba(250,244,232,0.7)', marginTop: 20, maxWidth: 480, lineHeight: 1.55 }}>
                Planting charts, what&rsquo;s blooming this week, and the occasional
                grouchy weather report. No marketing.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                background: 'rgba(250,244,232,0.08)',
                border: '1px solid rgba(250,244,232,0.18)',
                borderRadius: 999,
                padding: 6,
              }}>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    background: 'transparent', border: 'none', outline: 'none',
                    color: C.cream,
                    padding: '14px 20px',
                    fontFamily: SANS, fontSize: 15,
                  }}
                />
                <SparkleButton variant="primary">Subscribe</SparkleButton>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,244,232,0.5)', marginTop: 14 }}>
                4× a year · unsubscribe anytime
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{
            marginTop: 80,
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
            gap: 40,
            paddingTop: 40,
            borderTop: `1px solid ${C.line}`,
          }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
                Hollowbrook
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.inkMute, marginTop: 12, lineHeight: 1.6 }}>
                Family-grown bulbs since 1987.<br/>
                Hollowbrook Farm, Hudson Valley NY.
              </div>
            </div>
            {[
              { h: 'Shop', items: ['Tulips', 'Daffodils', 'Alliums', 'Gift cards'] },
              { h: 'Learn', items: ['Planting guide', 'Zone calendar', 'Journal', 'FAQ'] },
              { h: 'Farm',  items: ['Our story', 'Visit us', 'Press', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.inkMute, marginBottom: 14 }}>
                  {col.h}
                </div>
                {col.items.map(it => (
                  <div key={it} style={{ fontFamily: SANS, fontSize: 14, color: C.ink, marginBottom: 8 }}>
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </footer>
          <div style={{
            marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.line}`,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: C.inkMute,
          }}>
            <span>© 2026 Hollowbrook Farm</span>
            <span>Grown slowly · shipped gently</span>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SpringPage });
