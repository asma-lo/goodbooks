import { fr, short } from "../utils";

export default function BookTable({ data, page, onPage, onOpen }) {
  const pages = Math.max(1, Math.ceil(data.total / data.size));
  return (
    <section className="tablewrap">
      <h2>Tous les livres</h2>
      <div className="sc">
        <table>
          <thead>
            <tr><th>Titre</th><th>Auteur</th><th className="n">Année</th><th className="n">Note</th><th className="n">Votes</th></tr>
          </thead>
          <tbody>
            {data.items.map((b) => (
              <tr key={b.bookId}>
                <td><button className="plain" onClick={() => onOpen(b.bookId)}>{short(b.title)}</button></td>
                <td>{b.mainAuthor}</td>
                <td className="n">{b.year ?? "–"}</td>
                <td className="n">{fr(b.averageRating, 2)}</td>
                <td className="n">{fr(b.ratingsCount)}</td>
              </tr>
            ))}
            {data.items.length === 0 && <tr><td colSpan="5">Aucun résultat</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pg">
        <button className="link" disabled={page <= 1} onClick={() => onPage(page - 1)}>Précédent</button>
        <span>Page {page} sur {pages}</span>
        <button className="link" disabled={page >= pages} onClick={() => onPage(page + 1)}>Suivant</button>
      </div>
    </section>
  );
}
