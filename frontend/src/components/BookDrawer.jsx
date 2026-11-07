import { useEffect, useState } from "react";
import { get } from "../api";
import { useCountUp } from "../hooks";
import { colorOf, fr, short } from "../utils";

export default function BookDrawer({ id, onClose }) {
  const [b, setB] = useState(null);
  const score = useCountUp(b ? b.averageRating : 0, 800);

  useEffect(() => {
    if (id == null) return;
    setB(null);
    get(`books/${id}`).then(setB).catch(() => setB(null));
  }, [id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = id != null;
  return (
    <>
      <div className={"scrim" + (open ? " show" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open} aria-label="Détail du livre">
        <button className="link" onClick={onClose}>Fermer ✕</button>
        {b && (
          <div key={b.bookId} className="drawer-body">
            <span className="tag" style={{ "--c": colorOf(b.mainGenre) }}><i />{b.mainGenre}</span>
            <h3>{short(b.title)}</h3>
            <div className="author">{b.mainAuthor}</div>
            <div className="score">{fr(score, 2)}<small> / 5 ★</small></div>
            <div className="meter"><div style={{ "--w": `${(b.averageRating / 5) * 100}%` }} /></div>
            <dl>
              <dt>Votes</dt><dd>{fr(b.ratingsCount)}</dd>
              <dt>Année</dt><dd>{b.year ?? "–"}</dd>
              <dt>Langue</dt><dd>{b.languageCode}</dd>
              <dt>Identifiant</dt><dd>#{b.bookId}</dd>
            </dl>
          </div>
        )}
      </aside>
    </>
  );
}
