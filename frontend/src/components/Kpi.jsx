import { useCountUp } from "../hooks";
import { fr } from "../utils";

export default function Kpi({ value, decimals = 0, label, icon }) {
  const v = useCountUp(value ?? 0);
  return (
    <div className="kpi">
      <span className="kpi-icon" aria-hidden="true">{icon}</span>
      <b>{value == null ? "–" : fr(v, decimals)}</b>
      <span>{label}</span>
    </div>
  );
}
