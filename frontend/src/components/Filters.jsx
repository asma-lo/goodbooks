import { useEffect, useState } from "react";
import { colorOf, fr } from "../utils";

export default function Filters({ f, options, genres, onChange, onReset }) {
  const [text, setText] = useState(f.q);

  // Recherche avec un délai pour ne pas appeler l'API à chaque lettre.
  useEffect(() => {
    const t = setTimeout(() => text !== f.q && onChange({ q: text }), 300);
    return () => clearTimeout(t);
  }, [text]);
  useEffect(() => { if (f.q === "") setText(""); }, [f.q]);

  const total = genres.reduce((s, g) => s + g.value, 0);

  return (
    <section className="controls" aria-label="Filtres">
      <input type="search" value={text} onChange={(e) => setText(e.target.value)}
             placeholder="Rechercher un titre ou un auteur" aria-label="Recherche" />
      <select value={f.language} onChange={(e) => onChange({ language: e.target.value })} aria-label="Langue">
        <option value="">Toutes les langues</option>
        {options.languages.map((l) => <option key={l}>{l}</option>)}
      </select>
      <select value={f.decade} onChange={(e) => onChange({ decade: e.target.value })} aria-label="Décennie">
        <option value="">Toutes les décennies</option>
        {options.decades.map((d) => <option key={d}>{d}</option>)}
      </select>
      <select value={f.sort} onChange={(e) => onChange({ sort: e.target.value })} aria-label="Tri">
        <option value="ratingsCount">Les plus votés</option>
        <option value="averageRating">Les mieux notés</option>
        <option value="year">Les plus récents</option>
        <option value="title">Ordre alphabétique</option>
      </select>
      <button className="link" onClick={onReset}>Réinitialiser</button>

      <div className="chips">
        <button className={"chip" + (f.genre === "" ? " on" : "")} onClick={() => onChange({ genre: "" })}>
          <i />Tous <small>{fr(total)}</small>
        </button>
        {genres.map((g) => (
          <button key={g.label} className={"chip" + (f.genre === g.label ? " on" : "")}
                  style={{ "--c": colorOf(g.label) }} onClick={() => onChange({ genre: g.label })}>
            <i />{g.label} <small>{fr(g.value)}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
