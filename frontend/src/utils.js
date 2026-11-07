export const COLORS = {
  fantasy: "#8B7CF6", romance: "#F472B6", "non-fiction": "#38BDF8", "young-adult": "#FBBF24",
  mystery: "#34D399", history: "#A3E635", "science-fiction": "#22D3EE", thriller: "#FB7185",
  horror: "#94A3B8", other: "#64748B",
};
export const colorOf = (g) => COLORS[g] || "#64748B";
export const fr = (n, d = 0) => Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d });
export const short = (t) => t.replace(/\s*\(.*\)\s*$/, "");
