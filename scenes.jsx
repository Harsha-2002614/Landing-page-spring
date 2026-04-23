// scenes.jsx — Spring garden animation scenes
// Tulip/flower variety garden landing page animation.

// ── Design tokens ───────────────────────────────────────────────────────────
const COLORS = {
  skyDawn:   '#f3e4cf',
  skyMid:    '#f7ead6',
  skyNoon:   '#fbf3e2',
  sun:       '#ffd48a',
  soilDark:  '#3a2a22',
  soilMid:   '#5a3f32',
  grassDark: '#4a6b3a',
  grassMid:  '#6b8a4a',
  leafLight: '#8bab5a',
  stem:      '#556b3a',
  ink:       '#2a2320',
  cream:     '#faf4e8',
  paper:     '#fff9ee',
  // Tulip hues — harmonized chroma, varying hue
  tulipRed:    'oklch(68% 0.18 25)',
  tulipPink:   'oklch(78% 0.13 10)',
  tulipYellow: 'oklch(85% 0.14 85)',
  tulipPurple: 'oklch(55% 0.14 310)',
  tulipWhite:  'oklch(96% 0.02 80)',
  tulipCoral:  'oklch(72% 0.16 45)',
};

const SERIF = "'Fraunces', 'Playfair Display', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ── Tulip SVG (simple, composed from arcs/ellipses) ─────────────────────────
// openness: 0 (closed bud) → 1 (fully open)
function TulipSVG({ color = COLORS.tulipRed, openness = 1, stemH = 120, size = 60, sway = 0 }) {
  const o = Math.max(0, Math.min(1, openness));
  // Petals spread as openness increases
  const petalW = 18 + 6 * o;
  const petalH = 28 + 4 * o;
  const sideLean = 4 + 10 * o;
  const darker = shade(color, -0.15);
  const lighter = shade(color, 0.10);

  return (
    <svg width={size} height={size * 2.5} viewBox="0 0 60 150" style={{ overflow: 'visible', transform: `rotate(${sway}deg)`, transformOrigin: '30px 150px' }}>
      {/* stem */}
      <path d={`M30 ${150 - stemH * 0.0} C 32 ${110} 28 ${80} 30 ${40 + (1-o)*5}`} stroke={COLORS.stem} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* long leaf */}
      <path d={`M30 90 C 10 85 6 70 14 55 C 18 65 24 78 30 88 Z`} fill={COLORS.leafLight} opacity="0.95"/>
      <path d={`M30 100 C 48 98 54 82 48 68 C 42 78 36 90 30 100 Z`} fill={COLORS.grassMid} opacity="0.9"/>

      {/* back petal */}
      <ellipse cx="30" cy={42 - o * 6} rx={petalW * 0.85} ry={petalH} fill={darker} />
      {/* side petals */}
      <ellipse cx={30 - sideLean} cy={44 - o * 2} rx={petalW * 0.8} ry={petalH * 0.95} fill={color} transform={`rotate(-${8 + o*8} ${30 - sideLean} ${44})`} />
      <ellipse cx={30 + sideLean} cy={44 - o * 2} rx={petalW * 0.8} ry={petalH * 0.95} fill={color} transform={`rotate(${8 + o*8} ${30 + sideLean} ${44})`} />
      {/* front petal */}
      <ellipse cx="30" cy={46 - o * 2} rx={petalW * 0.75} ry={petalH * 0.9} fill={lighter} />
      {/* tiny highlight */}
      <ellipse cx={30 - 4} cy={38} rx="3" ry="7" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

// Daffodil (yellow variety, different shape)
function DaffodilSVG({ size = 50, sway = 0 }) {
  return (
    <svg width={size} height={size * 2.5} viewBox="0 0 60 150" style={{ overflow: 'visible', transform: `rotate(${sway}deg)`, transformOrigin: '30px 150px' }}>
      <path d={`M30 150 C 32 110 28 70 30 30`} stroke={COLORS.stem} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={`M30 95 C 16 90 12 78 18 66 C 22 74 27 85 30 94 Z`} fill={COLORS.leafLight} />
      {/* 6 outer petals */}
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <ellipse key={deg} cx="30" cy="30" rx="7" ry="14"
          fill={COLORS.tulipYellow}
          transform={`rotate(${deg} 30 30) translate(0 -10)`} />
      ))}
      {/* trumpet */}
      <circle cx="30" cy="30" r="8" fill="oklch(75% 0.16 70)" />
      <circle cx="30" cy="30" r="5" fill="oklch(65% 0.17 55)" />
    </svg>
  );
}

// Little daisy
function DaisySVG({ size = 28, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <ellipse key={deg} cx="20" cy="10" rx="4" ry="8" fill={color}
          transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4" fill={COLORS.tulipYellow} />
    </svg>
  );
}

function shade(c, amt) {
  // simple OKLCH shade via wrapping; falls back to same color
  if (typeof c !== 'string' || !c.startsWith('oklch')) return c;
  return c.replace(/oklch\(\s*(\d+(?:\.\d+)?)%/, (m, L) => {
    const newL = Math.max(0, Math.min(100, parseFloat(L) + amt * 100));
    return `oklch(${newL}%`;
  });
}

// ── Scene 1: Sky, sun, soil ─────────────────────────────────────────────────
function SkyAndGround() {
  const t = useTime();
  // Sun rises from -80 to 140, brightens
  const sunY = interpolate([0, 3, 14], [520, 140, 120], Easing.easeOutCubic)(t);
  const sunOpacity = interpolate([0, 1.5, 14], [0, 1, 1], Easing.easeOutQuad)(t);
  // Sky gradient shifts from dawn to noon
  const skyMix = interpolate([0, 3, 8], [0, 0.6, 1])(t);
  const skyTop = mixColor(COLORS.skyDawn, COLORS.skyNoon, skyMix);
  const skyBot = mixColor('#e8c9a0', COLORS.skyMid, skyMix);

  return (
    <>
      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${skyTop} 0%, ${skyBot} 60%, ${COLORS.cream} 100%)`,
      }} />
      {/* Soft sun halo */}
      <div style={{
        position: 'absolute',
        left: 1400, top: sunY,
        width: 340, height: 340,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.sun} 0%, rgba(255,212,138,0.3) 40%, transparent 70%)`,
        opacity: sunOpacity * 0.9,
        filter: 'blur(2px)',
        transform: 'translate(-50%,-50%)',
      }} />
      {/* Sun disk */}
      <div style={{
        position: 'absolute',
        left: 1400, top: sunY,
        width: 120, height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, #fff6e0 0%, ${COLORS.sun} 60%, #f0a860 100%)`,
        opacity: sunOpacity,
        transform: 'translate(-50%,-50%)',
        boxShadow: `0 0 80px ${COLORS.sun}`,
      }} />

      {/* Distant hills */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 520,
        height: 160,
        background: `linear-gradient(180deg, #c8b892 0%, #a89968 100%)`,
        clipPath: 'polygon(0 40%, 10% 30%, 22% 45%, 38% 25%, 55% 38%, 72% 22%, 88% 35%, 100% 28%, 100% 100%, 0 100%)',
        opacity: 0.55,
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 560,
        height: 140,
        background: `linear-gradient(180deg, #9eb07c 0%, #7a8f5e 100%)`,
        clipPath: 'polygon(0 60%, 8% 45%, 24% 58%, 42% 40%, 60% 55%, 78% 42%, 94% 55%, 100% 50%, 100% 100%, 0 100%)',
        opacity: 0.8,
      }} />

      {/* Ground / soil */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 680,
        background: `linear-gradient(180deg, ${COLORS.grassMid} 0%, ${COLORS.grassDark} 20%, ${COLORS.soilMid} 40%, ${COLORS.soilDark} 100%)`,
      }} />
      {/* Soil texture blotches */}
      {Array.from({length: 40}).map((_,i) => {
        const seed = i * 9.7 + 3;
        const x = (seed * 137) % 1920;
        const y = 700 + ((seed * 53) % 380);
        const r = 8 + (seed % 14);
        return <div key={i} style={{
          position: 'absolute', left: x, top: y,
          width: r, height: r*0.6,
          borderRadius: '50%',
          background: `rgba(0,0,0,${0.08 + (seed%3)*0.03})`,
        }}/>;
      })}

      {/* Morning mist */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 500, height: 220,
        background: 'linear-gradient(180deg, rgba(255,249,238,0) 0%, rgba(255,249,238,0.55) 50%, rgba(255,249,238,0) 100%)',
        opacity: interpolate([0, 2, 4.5], [0.9, 0.6, 0])(t),
        filter: 'blur(20px)',
      }} />
    </>
  );
}

function mixColor(a, b, t) {
  // naive hex mix (for #rrggbb only)
  const ha = a.replace('#', ''); const hb = b.replace('#', '');
  const ra = parseInt(ha.slice(0,2),16), ga = parseInt(ha.slice(2,4),16), ba = parseInt(ha.slice(4,6),16);
  const rb = parseInt(hb.slice(0,2),16), gb = parseInt(hb.slice(2,4),16), bb = parseInt(hb.slice(4,6),16);
  const r = Math.round(ra + (rb - ra) * t);
  const g = Math.round(ga + (gb - ga) * t);
  const bl = Math.round(ba + (bb - ba) * t);
  return `rgb(${r},${g},${bl})`;
}

// ── Growing tulip: stem pushes up, flower scales in ────────────────────────
function GrowingTulip({ x, color, growStart = 2, bloomStart = 4.5, stemH = 140, size = 60, baseSway = 0, delay = 0 }) {
  const t = useTime();
  const g = Math.max(0, Math.min(1, (t - (growStart + delay)) / 1.5));
  const b = Math.max(0, Math.min(1, (t - (bloomStart + delay)) / 1.2));
  const growEase = Easing.easeOutCubic(g);
  const bloomEase = Easing.easeOutBack(b);

  // gentle sway after bloom
  const swayT = Math.max(0, t - (bloomStart + delay));
  const sway = baseSway + Math.sin(swayT * 1.2) * 2;

  const flowerOp = bloomEase;
  const actualStemH = growEase * stemH;
  const openness = Math.max(0, Math.min(1, (t - (bloomStart + delay + 0.3)) / 0.8));

  if (g <= 0) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      bottom: 110,
      transform: `translateX(-50%)`,
      transformOrigin: 'bottom center',
    }}>
      <div style={{
        transform: `scaleY(${growEase}) rotate(${sway * 0.3}deg)`,
        transformOrigin: 'bottom center',
        opacity: Math.max(0.3, growEase),
      }}>
        <div style={{ opacity: flowerOp, transform: `scale(${0.3 + 0.7 * bloomEase})`, transformOrigin: 'bottom center' }}>
          <TulipSVG color={color} openness={openness} stemH={stemH} size={size} sway={sway * 0.5} />
        </div>
      </div>
    </div>
  );
}

function GrowingDaffodil({ x, growStart, bloomStart, size = 45, baseSway = 0 }) {
  const t = useTime();
  const g = Math.max(0, Math.min(1, (t - growStart) / 1.4));
  const b = Math.max(0, Math.min(1, (t - bloomStart) / 1.0));
  const growEase = Easing.easeOutCubic(g);
  const bloomEase = Easing.easeOutBack(b);
  const swayT = Math.max(0, t - bloomStart);
  const sway = baseSway + Math.sin(swayT * 1.4 + x) * 2.5;

  if (g <= 0) return null;
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 110, transform: 'translateX(-50%)',
    }}>
      <div style={{ transform: `scaleY(${growEase}) rotate(${sway * 0.3}deg)`, transformOrigin: 'bottom center' }}>
        <div style={{ opacity: bloomEase, transform: `scale(${0.3 + 0.7*bloomEase})`, transformOrigin: 'bottom center' }}>
          <DaffodilSVG size={size} sway={sway * 0.5} />
        </div>
      </div>
    </div>
  );
}

// Grass blades at base
function GrassLayer() {
  const t = useTime();
  const appear = interpolate([1.5, 3], [0, 1], Easing.easeOutCubic)(t);
  const blades = React.useMemo(() => {
    return Array.from({length: 120}).map((_,i) => {
      const seed = i * 7.3 + 2;
      const x = (seed * 17) % 1920;
      const h = 12 + (seed % 20);
      const tilt = ((seed % 7) - 3) * 2;
      const color = [COLORS.grassMid, COLORS.grassDark, COLORS.leafLight][i % 3];
      return { x, h, tilt, color, delay: (seed % 10) * 0.05 };
    });
  }, []);
  return (
    <>
      {blades.map((b, i) => {
        const t2 = useTime();
        const localAppear = Math.max(0, Math.min(1, (t2 - (1.5 + b.delay)) / 0.8));
        const sway = Math.sin(t2 * 2 + i) * 1.5;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: b.x, bottom: 100,
            width: 3, height: b.h * localAppear,
            background: b.color,
            borderRadius: '3px 3px 0 0',
            transformOrigin: 'bottom center',
            transform: `rotate(${b.tilt + sway * 0.3}deg)`,
            opacity: localAppear,
          }}/>
        );
      })}
    </>
  );
}

// Flying particles — petals + pollen drifting across
function PollenLayer() {
  const t = useTime();
  const appear = interpolate([5, 7], [0, 1])(t);
  const particles = React.useMemo(() => Array.from({length: 28}).map((_,i) => {
    const seed = i * 11 + 4;
    return {
      startX: (seed * 97) % 1920,
      startY: 200 + ((seed * 31) % 500),
      speedX: 15 + (seed % 30),
      speedY: -4 - (seed % 6),
      wobble: 40 + (seed % 40),
      wobbleFreq: 0.8 + (seed % 5) * 0.1,
      size: 3 + (seed % 4),
      color: [COLORS.tulipPink, COLORS.tulipYellow, COLORS.tulipCoral, 'rgba(255,255,255,0.9)'][i % 4],
      phase: seed % 6,
    };
  }), []);
  return (
    <>
      {particles.map((p, i) => {
        const life = t - 5;
        if (life < 0) return null;
        const x = p.startX + p.speedX * life + Math.sin(life * p.wobbleFreq + p.phase) * p.wobble;
        const y = p.startY + p.speedY * life * 10 + Math.cos(life * p.wobbleFreq + p.phase) * 20;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: ((x % 2000) + 2000) % 2000 - 40,
            top: y,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: appear * 0.7,
            boxShadow: `0 0 ${p.size*2}px ${p.color}`,
          }}/>
        );
      })}
    </>
  );
}

// Butterfly (simple geometric) — drifts across mid-animation
function Butterfly() {
  const t = useTime();
  if (t < 5.5 || t > 11.5) return null;
  const life = t - 5.5;
  const x = -60 + life * 320;
  const y = 420 + Math.sin(life * 2.2) * 50;
  const flap = Math.sin(t * 18) * 25;
  const op = interpolate([5.5, 6.0, 11.0, 11.5], [0, 1, 1, 0])(t);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      opacity: op,
      transform: `translate(-50%,-50%) rotate(${Math.sin(life*2.2)*8}deg)`,
    }}>
      <svg width="50" height="40" viewBox="-25 -20 50 40" style={{ overflow: 'visible' }}>
        <ellipse cx="-10" cy="-3" rx="10" ry="14"
          fill={COLORS.tulipCoral}
          transform={`rotate(${-flap} 0 0)`} />
        <ellipse cx="10" cy="-3" rx="10" ry="14"
          fill={COLORS.tulipCoral}
          transform={`rotate(${flap} 0 0)`} />
        <ellipse cx="-8" cy="8" rx="7" ry="10"
          fill={COLORS.tulipPurple}
          transform={`rotate(${-flap*0.8} 0 0)`} />
        <ellipse cx="8" cy="8" rx="7" ry="10"
          fill={COLORS.tulipPurple}
          transform={`rotate(${flap*0.8} 0 0)`} />
        <ellipse cx="0" cy="0" rx="1.5" ry="14" fill={COLORS.ink} />
      </svg>
    </div>
  );
}

// ── Garden composition ─────────────────────────────────────────────────────
function Garden() {
  // Predefined bulbs: x position, color, timing offset, size, sway bias
  const tulips = [
    { x: 160,  color: COLORS.tulipRed,    delay: 0.0, size: 70, sway: -3, stemH: 160 },
    { x: 280,  color: COLORS.tulipPink,   delay: 0.15, size: 60, sway: 2, stemH: 140 },
    { x: 380,  color: COLORS.tulipYellow, delay: 0.3, size: 65, sway: -1, stemH: 150 },
    { x: 480,  color: COLORS.tulipPurple, delay: 0.1, size: 68, sway: 1, stemH: 155 },
    { x: 600,  color: COLORS.tulipCoral,  delay: 0.45, size: 62, sway: -2, stemH: 145 },
    { x: 720,  color: COLORS.tulipRed,    delay: 0.25, size: 66, sway: 3, stemH: 150 },
    { x: 830,  color: COLORS.tulipWhite,  delay: 0.55, size: 58, sway: -1, stemH: 135 },
    { x: 940,  color: COLORS.tulipPink,   delay: 0.35, size: 72, sway: 2, stemH: 165 },
    { x: 1060, color: COLORS.tulipPurple, delay: 0.2, size: 60, sway: -2, stemH: 140 },
    { x: 1170, color: COLORS.tulipYellow, delay: 0.5, size: 64, sway: 1, stemH: 148 },
    { x: 1290, color: COLORS.tulipRed,    delay: 0.4, size: 68, sway: -3, stemH: 152 },
    { x: 1410, color: COLORS.tulipCoral,  delay: 0.15, size: 62, sway: 2, stemH: 145 },
    { x: 1530, color: COLORS.tulipPink,   delay: 0.3, size: 66, sway: -1, stemH: 150 },
    { x: 1640, color: COLORS.tulipWhite,  delay: 0.55, size: 58, sway: 3, stemH: 138 },
    { x: 1760, color: COLORS.tulipPurple, delay: 0.25, size: 70, sway: -2, stemH: 158 },
  ];
  const daffodils = [
    { x: 220, delay: 0.1 },
    { x: 540, delay: 0.4 },
    { x: 780, delay: 0.2 },
    { x: 1110, delay: 0.35 },
    { x: 1360, delay: 0.25 },
    { x: 1580, delay: 0.45 },
    { x: 1700, delay: 0.15 },
  ];

  return (
    <>
      <GrassLayer />
      {/* back row (smaller, behind) */}
      {tulips.map((t, i) => (
        <div key={'back'+i} style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(-20px) scale(0.7)`, transformOrigin: 'bottom center', opacity: 0.6 }}>
          <GrowingTulip x={t.x + 50} color={t.color} growStart={2} bloomStart={4.5} stemH={t.stemH * 0.8} size={t.size * 0.85} baseSway={t.sway} delay={t.delay + 0.3} />
        </div>
      ))}
      {/* Daffodils between tulips */}
      {daffodils.map((d, i) => (
        <GrowingDaffodil key={'daf'+i} x={d.x} growStart={2.2 + d.delay} bloomStart={4.8 + d.delay} size={48} />
      ))}
      {/* Main tulip row */}
      {tulips.map((t, i) => (
        <GrowingTulip key={i} x={t.x} color={t.color} growStart={2} bloomStart={4.5} stemH={t.stemH} size={t.size} baseSway={t.sway} delay={t.delay} />
      ))}
    </>
  );
}

// ── Landing page UI overlay ────────────────────────────────────────────────
function LandingUI() {
  const t = useTime();

  // Nav fades in 6.0s (as butterfly enters)
  const navOp = interpolate([6.0, 6.8], [0, 1], Easing.easeOutCubic)(t);
  const navY = interpolate([6.0, 6.8], [-30, 0], Easing.easeOutCubic)(t);

  // Headline reveals word-by-word
  const headlineStart = 6.4;
  const words = ['Bloom', 'where', 'you\u2019re', 'planted.'];

  // Subhead
  const subOp = interpolate([7.8, 8.5], [0, 1], Easing.easeOutCubic)(t);
  const subY = interpolate([7.8, 8.5], [16, 0], Easing.easeOutCubic)(t);

  // CTA
  const ctaOp = interpolate([8.3, 8.9], [0, 1], Easing.easeOutBack)(t);
  const ctaScale = interpolate([8.3, 8.9], [0.85, 1], Easing.easeOutBack)(t);

  // Variety cards slide in
  const cardsStart = 7.2;

  const varieties = [
    { name: 'Angelique', kind: 'Double Late', color: COLORS.tulipPink },
    { name: 'Queen of Night', kind: 'Single Late', color: COLORS.tulipPurple },
    { name: 'Flaming Parrot', kind: 'Parrot', color: COLORS.tulipRed },
    { name: 'Yellow Crown', kind: 'Triumph', color: COLORS.tulipYellow },
  ];

  return (
    <>
      {/* Top nav */}
      <div style={{
        position: 'absolute', top: 48, left: 80, right: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: navOp,
        transform: `translateY(${navY}px)`,
        fontFamily: SANS,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 12,
            background: COLORS.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 18, height: 22, position: 'relative' }}>
              <svg width="18" height="22" viewBox="0 0 18 22">
                <ellipse cx="9" cy="8" rx="6" ry="7" fill={COLORS.tulipCoral} />
                <rect x="8" y="10" width="2" height="12" fill={COLORS.leafLight}/>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: COLORS.ink, fontFamily: SERIF }}>
            Hollowbrook
          </div>
        </div>
        <div style={{ display: 'flex', gap: 36, fontSize: 16, color: COLORS.ink, fontWeight: 500 }}>
          <span>Varieties</span>
          <span>Garden Guide</span>
          <span>Seasonal Calendar</span>
          <span>Journal</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 15, color: COLORS.ink, fontWeight: 500 }}>Sign in</span>
          <div style={{
            padding: '10px 18px',
            background: COLORS.ink,
            color: COLORS.cream,
            borderRadius: 999,
            fontSize: 14, fontWeight: 500,
          }}>
            Shop blooms
          </div>
        </div>
      </div>

      {/* Eyebrow */}
      <div style={{
        position: 'absolute', top: 180, left: 100,
        opacity: interpolate([6.2, 6.7], [0, 1])(t),
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: COLORS.ink,
      }}>
        ◦ Spring Collection · 2026
      </div>

      {/* Headline — 2 lines: "Bloom where" / "you're planted." */}
      <div style={{
        position: 'absolute', top: 220, left: 100, right: 560,
        fontFamily: SERIF,
        fontSize: 132,
        lineHeight: 1.0,
        letterSpacing: '-0.04em',
        color: COLORS.ink,
        fontWeight: 400,
      }}>
        {[['Bloom', 'where'], ['you\u2019re', 'planted.']].map((line, li) => (
          <div key={li} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'visible' }}>
            {line.map((w, ii) => {
              const i = li * 2 + ii;
              const wStart = headlineStart + i * 0.18;
              const op = interpolate([wStart, wStart + 0.5], [0, 1], Easing.easeOutCubic)(t);
              const ty = interpolate([wStart, wStart + 0.5], [30, 0], Easing.easeOutCubic)(t);
              const italic = i === 3;
              return (
                <span key={i} style={{
                  display: 'inline-block',
                  marginRight: 24,
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  fontStyle: italic ? 'italic' : 'normal',
                  color: italic ? COLORS.tulipRed : COLORS.ink,
                }}>
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Subhead */}
      <div style={{
        position: 'absolute', top: 560, left: 100, maxWidth: 520,
        opacity: subOp,
        transform: `translateY(${subY}px)`,
        fontFamily: SANS,
        fontSize: 20,
        lineHeight: 1.5,
        color: COLORS.ink,
      }}>
        Heirloom tulips, daffodils, and rare bulbs — hand‑packed on a small farm
        in the valley. Plant in autumn, wake up to spring.
      </div>

      {/* CTAs */}
      <div style={{
        position: 'absolute', top: 680, left: 100,
        display: 'flex', gap: 14,
        opacity: ctaOp,
        transform: `scale(${ctaScale})`,
        transformOrigin: 'left center',
      }}>
        <div style={{
          padding: '18px 34px',
          background: COLORS.ink,
          color: COLORS.cream,
          borderRadius: 999,
          fontFamily: SANS,
          fontSize: 17,
          fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          Browse all varieties
          <span style={{ fontSize: 20 }}>→</span>
        </div>
        <div style={{
          padding: '18px 34px',
          background: 'rgba(255,249,238,0.7)',
          backdropFilter: 'blur(6px)',
          border: `1.5px solid ${COLORS.ink}`,
          color: COLORS.ink,
          borderRadius: 999,
          fontFamily: SANS,
          fontSize: 17,
          fontWeight: 500,
        }}>
          Plan my garden
        </div>
      </div>

      {/* Variety cards on right */}
      <div style={{
        position: 'absolute',
        top: 240, right: 80,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {varieties.map((v, i) => {
          const cStart = cardsStart + i * 0.15;
          const op = interpolate([cStart, cStart + 0.5], [0, 1], Easing.easeOutCubic)(t);
          const tx = interpolate([cStart, cStart + 0.5], [40, 0], Easing.easeOutCubic)(t);
          return (
            <div key={i} style={{
              width: 320,
              padding: 16,
              background: 'rgba(255,249,238,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 18,
              border: '1px solid rgba(42,35,32,0.08)',
              display: 'flex', alignItems: 'center', gap: 14,
              opacity: op,
              transform: `translateX(${tx}px)`,
              boxShadow: '0 8px 24px rgba(58,42,34,0.08)',
            }}>
              <div style={{
                width: 56, height: 56,
                borderRadius: 14,
                background: v.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="28" height="36" viewBox="0 0 60 150">
                  <ellipse cx="30" cy="38" rx="20" ry="30" fill="rgba(255,255,255,0.4)" />
                  <path d="M30 65 C 32 90 28 115 30 145" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <div style={{ flex: 1, fontFamily: SANS }}>
                <div style={{ fontSize: 11, fontFamily: MONO, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(42,35,32,0.5)', marginBottom: 3 }}>
                  {v.kind}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: SERIF, color: COLORS.ink, letterSpacing: '-0.01em' }}>
                  {v.name}
                </div>
              </div>
              <div style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: COLORS.ink,
                color: COLORS.cream,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>→</div>
            </div>
          );
        })}
      </div>

      {/* Bottom corner: info chip */}
      <div style={{
        position: 'absolute',
        bottom: 40, left: 100,
        opacity: interpolate([8.7, 9.3], [0, 1])(t),
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: MONO,
        fontSize: 12,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: COLORS.ink,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.tulipRed, boxShadow: `0 0 12px ${COLORS.tulipRed}` }}/>
        Shipping begins Sep 1 · Zones 3–9
      </div>
    </>
  );
}

// Timestamp label updater (sets data-screen-label each second)
function TimestampLabeler() {
  const t = useTime();
  React.useEffect(() => {
    const sec = Math.floor(t);
    const root = document.getElementById('anim-root');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [Math.floor(t)]);
  return null;
}

// ── Main Scene ─────────────────────────────────────────────────────────────
function MainScene() {
  return (
    <>
      <TimestampLabeler />
      <SkyAndGround />
      <Garden />
      <PollenLayer />
      <Butterfly />
      <LandingUI />
      <VignetteAndGrain />
    </>
  );
}

function VignetteAndGrain() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 55%, rgba(58,42,34,0.15) 100%)',
    }}/>
  );
}

Object.assign(window, { MainScene, COLORS });
