const { useState, useMemo, useEffect } = React;

function App() {
  const [allGames, setAllGames]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [platform, setPlatform]   = useState("all");
  const [type, setType]           = useState("all");
  const [sort, setSort]           = useState("discount");
  const [openGame, setOpenGame]   = useState(null);

  useEffect(() => {
    fetch("/deals/?limit=100")
      .then(r => { if (!r.ok) throw new Error(`API ${r.status}`); return r.json(); })
      .then(data => { setAllGames(data.map(window.transformDeal)); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  const freeGames = useMemo(() => allGames.filter(g => g.free), [allGames]);

  const filtered = useMemo(() => {
    let list = allGames.slice();
    if (platform !== "all") list = list.filter(g => g.platform === platform);
    if (type === "free")    list = list.filter(g => g.free);
    if (type === "deals")   list = list.filter(g => !g.free);
    list.sort((a, b) => {
      if (sort === "discount") return b.discount - a.discount;
      if (sort === "ending")   return new Date(a.endsAt) - new Date(b.endsAt);
      if (sort === "price")    return a.currentPrice - b.currentPrice;
      return 0;
    });
    return list;
  }, [allGames, platform, type, sort]);

  const counts = useMemo(() => {
    const tp = p => allGames.filter(g => p === "all" || g.platform === p);
    const tt = t => allGames.filter(g => t === "all" ? true : t === "free" ? g.free : !g.free);
    return {
      platform: { all: tp("all").length, epic: tp("epic").length, steam: tp("steam").length, gog: tp("gog").length },
      type:     { all: tt("all").length, free: tt("free").length, deals: tt("deals").length },
    };
  }, [allGames]);

  const reset = () => { setPlatform("all"); setType("all"); };

  return (
    <React.Fragment>
      <window.Header totalDeals={allGames.length} loading={loading} />
      <main className="gd-main">
        {loading ? (
          <window.LoadingState />
        ) : error ? (
          <window.ErrorState message={error} />
        ) : (
          <React.Fragment>
            {freeGames.length > 0 && (
              <window.FreeRail games={freeGames} onOpen={setOpenGame} />
            )}

            <div className="gd-section-head" style={{ marginBottom: 8 }}>
              <div className="gd-section-title">
                <span style={{ width: 10, height: 10, background: "#6BE078", boxShadow: "0 0 12px rgba(107,224,120,0.7)" }} />
                All deals
              </div>
              <div className="gd-section-sub">Refreshed every 6 hours</div>
            </div>

            <window.FilterBar
              platform={platform} setPlatform={setPlatform}
              type={type} setType={setType}
              sort={sort} setSort={setSort}
              counts={counts}
            />

            <div className="gd-results-count">
              Showing <b>{filtered.length}</b> result{filtered.length !== 1 ? "s" : ""}
              {platform !== "all" && <> · store <b>{window.PLATFORMS[platform].label}</b></>}
              {type !== "all" && <> · type <b>{type}</b></>}
            </div>

            {filtered.length === 0 ? (
              <window.EmptyState onReset={reset} />
            ) : (
              <div className="gd-grid">
                {filtered.map(g => (
                  <window.DealCard key={g.id} game={g} onOpen={setOpenGame} />
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </main>

      {openGame && (
        <window.ExpandedModal game={openGame} onClose={() => setOpenGame(null)} />
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
