const { useState, useEffect } = React;
const PLATFORMS = window.PLATFORMS;

function fmtPrice(n) {
  return n === 0 ? "FREE" : `R$ ${n.toFixed(2)}`;
}

function timeLeftStr(endsAt) {
  const ms = new Date(endsAt) - new Date();
  if (ms <= 0) return "Ended";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((ms / 60000) % 60);
  return `${h}h ${m}m`;
}

function daysLeft(endsAt) {
  return Math.max(0, Math.ceil((new Date(endsAt) - new Date()) / 86400000));
}

// ===== Art helper: real image or generative SVG =====
function GameArt({ game, aspect = "portrait" }) {
  const [imgErr, setImgErr] = useState(false);
  if (game.image_url && !imgErr) {
    return (
      <img
        src={game.image_url}
        alt={game.title}
        onError={() => setImgErr(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return <window.CoverArt game={game} aspect={aspect} />;
}

// ===== Logo =====
function GameDealsLogo() {
  return (
    <div className="gd-logo-mark">
      <svg viewBox="0 0 38 38" width="38" height="38">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#A06CFF" />
            <stop offset="50%"  stopColor="#5BB7FF" />
            <stop offset="100%" stopColor="#6BE078" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="34" height="34" rx="8" fill="#14141a" stroke="url(#logo-grad)" strokeWidth="1.4" />
        <rect x="12" y="17" width="14" height="4" rx="1" fill="url(#logo-grad)" />
        <rect x="17" y="12" width="4"  height="14" rx="1" fill="url(#logo-grad)" />
        <circle cx="11" cy="11" r="1.6" fill="#F5C84B" />
        <circle cx="27" cy="27" r="1.6" fill="#6BE078" />
      </svg>
    </div>
  );
}

// ===== Header =====
function Header({ totalDeals, loading }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const stamp = now.toISOString().slice(0, 16).replace("T", " ");

  return (
    <header className="gd-header">
      <div className="gd-header-inner">
        <a className="gd-logo" href="#">
          <GameDealsLogo />
          <div className="gd-logo-text">GameDeals</div>
        </a>
        <div className="gd-tagline">
          Free games &amp; deals from <b>Epic</b>, <b>Steam</b> and <b>GOG</b>
        </div>
        <div className="gd-header-status">
          <span className="gd-status-dot" />
          <span>
            {loading
              ? "LOADING…"
              : `LIVE · ${totalDeals} OFFERS · SYNCED ${stamp} UTC`}
          </span>
        </div>
      </div>
    </header>
  );
}

// ===== Filter bar =====
function FilterBar({ platform, setPlatform, type, setType, sort, setSort, counts }) {
  return (
    <div className="gd-filter-bar">
      <div className="gd-filter-group">
        <span className="gd-filter-label">Store</span>
        <div className="gd-tabs" role="tablist">
          {[
            { id: "all",   label: "All" },
            { id: "epic",  label: "Epic",  color: PLATFORMS.epic.color  },
            { id: "steam", label: "Steam", color: PLATFORMS.steam.color },
            { id: "gog",   label: "GOG",   color: PLATFORMS.gog.color   },
          ].map(t => (
            <button key={t.id} className="gd-tab" data-active={platform === t.id} onClick={() => setPlatform(t.id)}>
              {t.color && <span className="platform-dot" style={{ background: t.color }} />}
              {t.label}
              <span className="gd-tab-count">{counts.platform[t.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="gd-filter-group">
        <span className="gd-filter-label">Type</span>
        <div className="gd-tabs" role="tablist">
          {[
            { id: "all",   label: "All"   },
            { id: "free",  label: "Free"  },
            { id: "deals", label: "Deals" },
          ].map(t => (
            <button key={t.id} className="gd-tab" data-active={type === t.id} onClick={() => setType(t.id)}>
              {t.label}
              <span className="gd-tab-count">{counts.type[t.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="gd-filter-spacer" />

      <div className="gd-sort">
        <span className="gd-filter-label">Sort</span>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="discount">Biggest discount</option>
          <option value="ending">Ending soonest</option>
          <option value="price">Lowest price</option>
        </select>
      </div>
    </div>
  );
}

// ===== Free games rail =====
function FreeRail({ games, onOpen }) {
  if (!games.length) return null;
  return (
    <section className="gd-free-section">
      <div className="gd-section-head">
        <div className="gd-section-title">
          <span className="gold-pip" />
          Free this week
        </div>
        <div className="gd-section-sub">{games.length} title{games.length !== 1 ? "s" : ""} · claim before expiry</div>
      </div>
      <div className="gd-free-rail">
        {games.map(g => (
          <article key={g.id} className="gd-free-card" onClick={() => onOpen(g)}>
            <div className="gd-free-art">
              <GameArt game={g} aspect="wide" />
              <div className="gd-free-banner">100% FREE</div>
            </div>
            <div className="gd-free-meta">
              <div className="gd-free-title">{g.title}</div>
              <div className="gd-free-row">
                <span className="gd-badge-platform" data-platform={g.platform} style={{ position: "static", background: "rgba(0,0,0,0.4)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: PLATFORMS[g.platform].color }} />
                  {PLATFORMS[g.platform].short}
                </span>
                <span className="gd-free-countdown">
                  Ends in <b>{timeLeftStr(g.endsAt)}</b>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ===== Deal card =====
function DealCard({ game, onOpen }) {
  const isFree = game.free;
  return (
    <article className="gd-card" data-platform={game.platform} onClick={() => onOpen(game)}>
      <div className="gd-card-art">
        <GameArt game={game} />
        <div className="gd-card-badges">
          <span className="gd-badge-platform" data-platform={game.platform}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PLATFORMS[game.platform].color }} />
            {PLATFORMS[game.platform].short}
          </span>
          <span className="gd-badge-discount" data-free={isFree}>
            {isFree ? "FREE" : `-${game.discount}%`}
          </span>
        </div>
      </div>
      <div className="gd-card-meta">
        <div className="gd-card-title">{game.title}</div>
        <div className="gd-card-bottom">
          <div className="gd-price">
            <span className="gd-price-now" data-free={isFree}>{fmtPrice(game.currentPrice)}</span>
            {game.originalPrice > 0 && game.currentPrice !== game.originalPrice && (
              <span className="gd-price-was">${game.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="gd-cta"
            data-variant={isFree ? "free" : "deal"}
            onClick={e => { e.stopPropagation(); onOpen(game); }}
          >
            Get deal <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

// ===== Empty state =====
function EmptyState({ onReset }) {
  return (
    <div className="gd-empty">
      <div className="gd-empty-art">
        <svg viewBox="0 0 88 88" width="88" height="88">
          <rect x="4" y="20" width="80" height="56" rx="10" fill="none" stroke="#3a3a44" strokeWidth="1.5" />
          <circle cx="28" cy="48" r="6" fill="none" stroke="#5a5a66" strokeWidth="1.5" />
          <circle cx="60" cy="48" r="6" fill="none" stroke="#5a5a66" strokeWidth="1.5" />
          <path d="M 28 60 Q 44 70 60 60" stroke="#5a5a66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="22" y1="14" x2="28" y2="20" stroke="#3a3a44" strokeWidth="1.5" />
          <line x1="66" y1="14" x2="60" y2="20" stroke="#3a3a44" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="gd-empty-title">No deals match your filters</div>
      <div className="gd-empty-sub">
        Try switching to <b>All stores</b> or <b>All types</b> — deals are refreshed every 6 hours.
      </div>
      <button className="gd-empty-reset" onClick={onReset}>Reset filters</button>
    </div>
  );
}

// ===== Loading state =====
function LoadingState() {
  return (
    <div className="gd-empty" style={{ borderStyle: "solid" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {["#A06CFF", "#5BB7FF", "#6BE078"].map((c, i) => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: c,
            boxShadow: `0 0 10px ${c}`,
            animation: `gd-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <div className="gd-empty-title" style={{ fontSize: 16 }}>Fetching deals…</div>
      <div className="gd-empty-sub">Connecting to Epic, Steam and GOG</div>
    </div>
  );
}

// ===== Error state =====
function ErrorState({ message }) {
  return (
    <div className="gd-empty">
      <div className="gd-empty-title" style={{ color: "#FF5A4A" }}>Could not load deals</div>
      <div className="gd-empty-sub">
        Make sure the API is running at <code style={{ color: "var(--ink-1)" }}>localhost:8000</code><br />
        <small style={{ color: "var(--ink-3)" }}>{message}</small>
      </div>
      <button className="gd-empty-reset" onClick={() => location.reload()}>Retry</button>
    </div>
  );
}

// ===== Expanded modal =====
function ExpandedModal({ game, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!game) return null;
  const isFree   = game.free;
  const d        = daysLeft(game.endsAt);
  const savings  = game.originalPrice - game.currentPrice;
  const platform = PLATFORMS[game.platform];

  return (
    <div className="gd-modal-backdrop" onClick={onClose}>
      <div className="gd-modal" onClick={e => e.stopPropagation()}>
        <button className="gd-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="gd-modal-art">
          <div className="gd-modal-art-inner">
            <GameArt game={game} aspect="wide" />
          </div>
        </div>

        <div className="gd-modal-body">
          <div className="gd-modal-platform">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: platform.color, boxShadow: `0 0 8px ${platform.color}` }} />
            <span style={{ color: platform.color }}>{platform.label.toUpperCase()}</span>
          </div>

          <h2 className="gd-modal-title">{game.title}</h2>

          <div className="gd-modal-pricecard">
            <div className="gd-modal-pricestack">
              <span className="now" data-free={isFree}>{fmtPrice(game.currentPrice)}</span>
              {game.originalPrice > 0 && game.currentPrice !== game.originalPrice && (
                <span className="was">Era R$ {game.originalPrice.toFixed(2)} · Economia R$ {savings.toFixed(2)}</span>
              )}
            </div>
            <span className="gd-modal-discount" data-free={isFree}>
              {isFree ? "FREE" : `-${game.discount}%`}
            </span>
          </div>

          <div className="gd-modal-meta-grid">
            <div className="gd-meta-cell">
              <span className="k">Ends</span>
              <span className={`v ${d <= 3 ? "hot" : ""}`}>
                {timeLeftStr(game.endsAt)} · {new Date(game.endsAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="gd-meta-cell">
              <span className="k">Store</span>
              <span className="v">{platform.label}</span>
            </div>
            <div className="gd-meta-cell">
              <span className="k">Region</span>
              <span className="v">US · USD</span>
            </div>
            <div className="gd-meta-cell">
              <span className="k">Type</span>
              <span className="v">{isFree ? "Free game" : "Discount deal"}</span>
            </div>
          </div>

          <div className="gd-modal-cta-row">
            <a
              className="gd-modal-cta"
              data-platform={game.platform}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on {platform.label} →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Header, FilterBar, FreeRail, DealCard, EmptyState, ExpandedModal,
  LoadingState, ErrorState,
});
