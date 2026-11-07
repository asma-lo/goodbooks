import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Donut from "./Donut";
import { colorOf, fr } from "../utils";

const LANG = ["#8B7CF6", "#F472B6", "#FBBF24", "#34D399", "#22D3EE", "#FB7185", "#A3E635", "#94A3B8"];
const axis = { stroke: "#A9A3D6", fontSize: 12, tickLine: false, axisLine: false };
const tip = { contentStyle: { background: "rgba(30,24,80,.92)", border: 0, borderRadius: 10, color: "#F2EFFF" }, cursor: { fill: "rgba(255,255,255,.06)" } };

export default function Charts({ genres, languages, decades, authors, genre, onGenre }) {
  const total = genres.reduce((s, g) => s + g.value, 0);
  const langColor = (l) => LANG[Math.max(0, languages.findIndex((x) => x.label === l)) % LANG.length];
  return (
    <section className="grid2">
      <Donut title="Répartition par genre" data={genres} colorOf={colorOf} active={genre}
             onSelect={(g) => onGenre(g === genre ? "" : g)} center={fr(total)} centerLabel="livres · clique une part" />
      <div className="panel">
        <h2>Note moyenne par décennie</h2>
        <div className="box">
          <ResponsiveContainer>
            <AreaChart data={decades}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity=".55" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
              <XAxis dataKey="label" {...axis} />
              <YAxis domain={["auto", "auto"]} {...axis} />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="value" name="Note" stroke="#FBBF24" strokeWidth={3} fill="url(#gA)" animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Donut title="Langues" data={languages} colorOf={langColor} legend
             center={languages[0]?.label ?? "–"} centerLabel="langue principale" />
      <div className="panel">
        <h2>Auteurs les plus notés</h2>
        <div className="box">
          <ResponsiveContainer>
            <BarChart data={authors} layout="vertical">
              <defs>
                <linearGradient id="gB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B7CF6" /><stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.07)" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fr(v)} {...axis} />
              <YAxis type="category" dataKey="label" width={120} {...axis} />
              <Tooltip {...tip} formatter={(v) => fr(v)} />
              <Bar dataKey="value" name="Votes" fill="url(#gB)" radius={[0, 6, 6, 0]} animationDuration={1100} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
