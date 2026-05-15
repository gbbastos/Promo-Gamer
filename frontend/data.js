window.PLATFORMS = {
  epic:  { label: "Epic Games", color: "#A06CFF", short: "EPIC"  },
  steam: { label: "Steam",      color: "#5BB7FF", short: "STEAM" },
  gog:   { label: "GOG",        color: "#EFEAE1", short: "GOG"   },
};

const PALETTES = [
  ["#1a2530", "#5b8db8", "#e8d8a0"],
  ["#1f0d18", "#c43a5a", "#f4d35e"],
  ["#2b1f3a", "#e25822", "#f5e6c8"],
  ["#1c2f1f", "#6dbf67", "#f9a13a"],
  ["#1a0e0a", "#d4521a", "#f3c969"],
  ["#0e0e1a", "#fcee0a", "#ff003c"],
  ["#1d160a", "#caa15a", "#3e2a14"],
  ["#0a0d12", "#7ab6ff", "#e8334a"],
  ["#10162a", "#a07cff", "#ffba49"],
  ["#1a1410", "#8e6b3a", "#d9534f"],
  ["#1e2a18", "#8fbf5b", "#f5d24a"],
  ["#0c1014", "#c8c8c8", "#f9b04a"],
];

const MOTIFS = ["blade", "crown", "tie", "fox", "eye", "chip", "ring", "moth", "moon", "wolf", "leaf", "drop"];

function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

window.transformDeal = function(deal, idx) {
  const h = hashStr(deal.title);
  const isFree = deal.type === "free" || deal.discount_percent === 100;
  const discount = deal.discount_percent || 0;
  const originalPrice = deal.original_price || 0;
  const currentPrice = isFree ? 0 : Math.round(originalPrice * (1 - discount / 100) * 100) / 100;

  return {
    id: deal.id || String(idx),
    title: deal.title,
    platform: deal.platform,
    free: isFree,
    discount,
    originalPrice,
    currentPrice,
    url: deal.url || "#",
    image_url: deal.image_url || null,
    endsAt: deal.end_date || new Date(Date.now() + 7 * 86400000).toISOString(),
    tags: [deal.type || "deal"],
    palette: PALETTES[h % PALETTES.length],
    motif: MOTIFS[h % MOTIFS.length],
  };
};
