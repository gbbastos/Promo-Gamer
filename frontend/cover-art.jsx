// Stylized SVG cover art generated per-game from palette + motif.
// Looks intentionally graphic/poster-like rather than trying to fake a real screenshot.

const motifPaths = {
  blade: (c) => (
    <g>
      <path d={`M 100 280 L 140 60 L 160 60 L 160 280 Z`} fill={c[1]} opacity="0.9"/>
      <rect x="90" y="280" width="80" height="14" fill={c[2]}/>
      <rect x="118" y="294" width="24" height="50" fill={c[1]}/>
      <circle cx="130" cy="50" r="6" fill={c[2]}/>
    </g>
  ),
  crown: (c) => (
    <g>
      <path d="M 50 240 L 70 140 L 110 200 L 150 120 L 190 200 L 230 140 L 250 240 Z" fill={c[1]} opacity="0.95"/>
      <rect x="55" y="240" width="190" height="22" fill={c[2]}/>
      <circle cx="70" cy="135" r="8" fill={c[2]}/>
      <circle cx="230" cy="135" r="8" fill={c[2]}/>
      <circle cx="150" cy="115" r="10" fill={c[2]}/>
    </g>
  ),
  tie: (c) => (
    <g>
      <path d="M 130 90 L 170 90 L 165 130 L 175 130 L 200 280 L 100 280 L 125 130 L 135 130 Z" fill={c[1]}/>
      <path d="M 130 90 L 170 90 L 165 130 L 135 130 Z" fill={c[2]} opacity="0.85"/>
      <line x1="150" y1="50" x2="150" y2="90" stroke={c[2]} strokeWidth="3"/>
    </g>
  ),
  fox: (c) => (
    <g>
      <polygon points="80,180 110,80 150,160 190,80 220,180" fill={c[1]}/>
      <polygon points="100,170 120,110 150,150 180,110 200,170" fill={c[0]}/>
      <circle cx="125" cy="200" r="6" fill={c[2]}/>
      <circle cx="175" cy="200" r="6" fill={c[2]}/>
      <path d="M 140 230 Q 150 240 160 230" stroke={c[2]} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
  ),
  eye: (c) => (
    <g>
      <path d="M 40 170 Q 150 60 260 170 Q 150 280 40 170 Z" fill={c[1]} opacity="0.95"/>
      <circle cx="150" cy="170" r="50" fill={c[0]}/>
      <circle cx="150" cy="170" r="22" fill={c[2]}/>
      <circle cx="160" cy="160" r="6" fill={c[0]}/>
    </g>
  ),
  chip: (c) => (
    <g>
      <rect x="80" y="100" width="140" height="140" fill={c[1]} opacity="0.92"/>
      <rect x="100" y="120" width="100" height="100" fill={c[0]}/>
      <g stroke={c[2]} strokeWidth="3" fill="none">
        <line x1="100" y1="140" x2="60" y2="140"/>
        <line x1="100" y1="180" x2="60" y2="180"/>
        <line x1="200" y1="140" x2="240" y2="140"/>
        <line x1="200" y1="180" x2="240" y2="180"/>
        <line x1="140" y1="100" x2="140" y2="60"/>
        <line x1="180" y1="100" x2="180" y2="60"/>
        <line x1="140" y1="240" x2="140" y2="280"/>
        <line x1="180" y1="240" x2="180" y2="280"/>
      </g>
      <text x="150" y="180" textAnchor="middle" fontSize="38" fontWeight="900" fill={c[2]} fontFamily="JetBrains Mono, monospace">2077</text>
    </g>
  ),
  ring: (c) => (
    <g>
      <circle cx="150" cy="170" r="90" fill="none" stroke={c[1]} strokeWidth="14"/>
      <circle cx="150" cy="170" r="60" fill="none" stroke={c[2]} strokeWidth="3"/>
      <circle cx="150" cy="80" r="10" fill={c[1]}/>
      <path d="M 150 170 L 150 100" stroke={c[2]} strokeWidth="2"/>
    </g>
  ),
  moth: (c) => (
    <g>
      <ellipse cx="100" cy="170" rx="55" ry="80" fill={c[1]} opacity="0.85"/>
      <ellipse cx="200" cy="170" rx="55" ry="80" fill={c[1]} opacity="0.85"/>
      <ellipse cx="150" cy="170" rx="8" ry="70" fill={c[2]}/>
      <circle cx="100" cy="150" r="10" fill={c[2]}/>
      <circle cx="200" cy="150" r="10" fill={c[2]}/>
    </g>
  ),
  moon: (c) => (
    <g>
      <circle cx="150" cy="170" r="80" fill={c[1]}/>
      <circle cx="180" cy="155" r="80" fill={c[0]}/>
      <circle cx="220" cy="100" r="3" fill={c[2]}/>
      <circle cx="60" cy="130" r="2" fill={c[2]}/>
      <circle cx="90" cy="240" r="2" fill={c[2]}/>
      <circle cx="250" cy="220" r="3" fill={c[2]}/>
    </g>
  ),
  wolf: (c) => (
    <g>
      <polygon points="150,90 100,170 90,260 130,240 150,260 170,240 210,260 200,170" fill={c[1]}/>
      <polygon points="105,150 120,180 95,180" fill={c[0]}/>
      <polygon points="195,150 180,180 205,180" fill={c[0]}/>
      <circle cx="130" cy="200" r="6" fill={c[2]}/>
      <circle cx="170" cy="200" r="6" fill={c[2]}/>
      <polygon points="140,230 150,250 160,230" fill={c[0]}/>
    </g>
  ),
  leaf: (c) => (
    <g>
      <path d="M 150 70 Q 80 150 90 260 Q 150 230 210 260 Q 220 150 150 70 Z" fill={c[1]}/>
      <path d="M 150 70 L 150 250" stroke={c[2]} strokeWidth="2"/>
      <path d="M 150 120 L 110 150 M 150 160 L 105 200 M 150 200 L 115 235" stroke={c[2]} strokeWidth="2"/>
      <path d="M 150 120 L 190 150 M 150 160 L 195 200 M 150 200 L 185 235" stroke={c[2]} strokeWidth="2"/>
    </g>
  ),
  drop: (c) => (
    <g>
      <path d="M 150 70 Q 90 200 150 270 Q 210 200 150 70 Z" fill={c[1]} opacity="0.9"/>
      <ellipse cx="140" cy="180" rx="14" ry="30" fill={c[2]} opacity="0.6"/>
      <path d="M 60 290 Q 150 270 240 290" stroke={c[2]} strokeWidth="2" fill="none" opacity="0.5"/>
    </g>
  ),
};

function CoverArt({ game, aspect = "portrait" }) {
  const c = game.palette;
  const motif = motifPaths[game.motif] || motifPaths.eye;
  const id = `g-${game.id}`;
  const w = aspect === "wide" ? 480 : 300;
  const h = aspect === "wide" ? 270 : 360;
  return (
    <svg viewBox="0 0 300 360" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c[0]}/>
          <stop offset="100%" stopColor="#000"/>
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor={c[1]} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={c[1]} stopOpacity="0"/>
        </radialGradient>
        <pattern id={`${id}-grid`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={c[2]} strokeWidth="0.4" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="300" height="360" fill={`url(#${id}-bg)`}/>
      <rect width="300" height="360" fill={`url(#${id}-glow)`}/>
      <rect width="300" height="360" fill={`url(#${id}-grid)`}/>
      {/* horizon line */}
      <line x1="0" y1="290" x2="300" y2="290" stroke={c[2]} strokeWidth="0.6" opacity="0.3"/>
      <g transform="translate(0, 10)">{motif(c)}</g>
      {/* small caption / sku */}
      <g opacity="0.55">
        <text x="20" y="335" fontSize="9" fill={c[2]} fontFamily="JetBrains Mono, monospace" letterSpacing="2">
          {game.tags[0]?.toUpperCase()}
        </text>
        <text x="280" y="335" textAnchor="end" fontSize="9" fill={c[2]} fontFamily="JetBrains Mono, monospace" letterSpacing="1">
          {`№${String(game.id).padStart(3, "0")}`}
        </text>
      </g>
      {/* corner brackets */}
      <g stroke={c[2]} strokeWidth="1.2" fill="none" opacity="0.55">
        <path d="M 14 14 L 14 28 M 14 14 L 28 14"/>
        <path d="M 286 14 L 286 28 M 286 14 L 272 14"/>
        <path d="M 14 346 L 14 332 M 14 346 L 28 346"/>
        <path d="M 286 346 L 286 332 M 286 346 L 272 346"/>
      </g>
    </svg>
  );
}

window.CoverArt = CoverArt;
