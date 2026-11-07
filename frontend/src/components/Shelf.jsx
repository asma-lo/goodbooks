import { useState } from "react";
import { colorOf, fr, short } from "../utils";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Étagère : hauteur = note, largeur = nombre de votes, couleur = genre.
export default function Shelf({ books, onOpen }) {
  const [hover, setHover] = useState(null);
  return (
    <section className="panel shelfpanel">
      <div className="shelfhead">
        <h2>Sur l’étagère</h2>
        <p className="hint">Hauteur = note · largeur = votes · couleur = genre</p>
      </div>
      <p className="caption" aria-live="polite">
        {hover
          ? <><b>{short(hover.title)}</b> · {hover.mainAuthor} · {fr(hover.averageRating, 2)} ★ · {fr(hover.ratingsCount)} votes</>
          : "Survole un livre pour le découvrir, clique pour ouvrir sa fiche."}
      </p>
      <div className="shelf" key={books.map((b) => b.bookId).join("-")}>
        {books.length === 0 && <p className="hint">Aucun livre ne correspond à ces filtres.</p>}
        {books.map((b, i) => (
          <button key={b.bookId} className="spine" onClick={() => onOpen(b.bookId)}
                  onMouseEnter={() => setHover(b)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(b)} onBlur={() => setHover(null)}
                  title={`${short(b.title)} · ${b.mainAuthor}`}
                  style={{
                    height: clamp(Math.round((b.averageRating - 3.2) * 140 + 140), 120, 300),
                    width: clamp(Math.round(14 + (Math.log10(b.ratingsCount) - 3) * 10), 24, 52),
                    background: `linear-gradient(90deg, ${colorOf(b.mainGenre)}, ${colorOf(b.mainGenre)}cc)`,
                    animationDelay: `${i * 28}ms`,
                    "--glow": colorOf(b.mainGenre),
                  }}>
            {short(b.title)}
          </button>
        ))}
      </div>
      <div className="plank" />
    </section>
  );
}
