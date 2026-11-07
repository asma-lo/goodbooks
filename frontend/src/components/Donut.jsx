import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fr } from "../utils";

// Diagramme circulaire animé ; un clic sur une part appelle onSelect.
export default function Donut({ title, data, colorOf, active, onSelect, center, centerLabel, legend }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="panel">
      <h2>{title}</h2>
      <div className="box donut">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="92%"
                 paddingAngle={2} cornerRadius={6} stroke="none" animationDuration={1000}
                 onClick={(d) => onSelect && onSelect(d?.payload?.label ?? d?.label)}>
              {data.map((d) => (
                <Cell key={d.label} fill={colorOf(d.label)}
                      opacity={active && active !== d.label ? 0.22 : 1}
                      style={{ cursor: onSelect ? "pointer" : "default", transition: "opacity .25s", outline: "none" }} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [fr(v), n]}
                     contentStyle={{ background: "rgba(30,24,80,.92)", border: 0, borderRadius: 10, color: "#F2EFFF" }} itemStyle={{ color: "#F2EFFF" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="center"><b>{center}</b><span>{centerLabel}</span></div>
      </div>
      {legend && (
        <ul className="legend">
          {data.map((d) => (
            <li key={d.label}><i style={{ background: colorOf(d.label) }} />{d.label}<small>{Math.round((d.value / total) * 100)} %</small></li>
          ))}
        </ul>
      )}
    </div>
  );
}
