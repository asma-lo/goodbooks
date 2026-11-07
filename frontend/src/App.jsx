import { useEffect, useState } from "react";
import { get } from "./api";
import { fr } from "./utils";
import Filters from "./components/Filters";
import Shelf from "./components/Shelf";
import Charts from "./components/Charts";
import Kpi from "./components/Kpi";
import Reveal from "./components/Reveal";
import BookTable from "./components/BookTable";
import BookDrawer from "./components/BookDrawer";

const EMPTY = { genre: "", language: "", decade: "", q: "", sort: "ratingsCount" };

export default function App() {
  const [f, setF] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState({ genres: [], languages: [], decades: [] });
  const [data, setData] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState("");
  const [live, setLive] = useState(null);

  useEffect(() => {
    get("health").then(() => setLive(true)).catch(() => setLive(false));
  }, []);

  useEffect(() => {
    get("filters").then(setOptions).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let live = true;
    const base = { genre: f.genre, language: f.language, decade: f.decade, q: f.q };
    Promise.all([
      get("stats", base),
      get("genres", { ...base, genre: "" }), // les pastilles montrent tous les genres
      get("decades", base),
      get("authors", base),
      get("languages", base),
      get("books", { ...base, sort: f.sort, size: 40 }),
      get("books", { ...base, sort: f.sort, page, size: 10 }),
    ])
      .then(([stats, genres, decades, authors, languages, shelf, table]) => {
        if (!live) return;
        setData({ stats, genres, decades, authors, languages, shelf: shelf.items, table });
        setError("");
      })
      .catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [f, page]);

  const change = (patch) => { setF((prev) => ({ ...prev, ...patch })); setPage(1); };

  return (
    <>
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div>
      <main>
        <header className="top">
          <span className={"live" + (live === false ? " off" : "")}>
            <i />{live === false ? "API hors ligne" : "API en ligne · Spring Boot"}
          </span>
          <h1>Goodbooks</h1>
          <p className="sub">10 000 livres rangés sur une étagère : explore-les par genre, époque et popularité.</p>
        </header>

        <Filters f={f} options={options} genres={data?.genres ?? []} onChange={change} onReset={() => change(EMPTY)} />

        {error && <p className="error" role="alert">Erreur : {error}</p>}
        {!data && !error && <p className="hint pulse">Chargement…</p>}

        {data && (
          <>
            <section className="kpis">
              <Kpi icon="📚" value={data.stats.books} label="livres" />
              <Kpi icon="⭐" value={data.stats.avgRating} decimals={2} label="note moyenne, pondérée par les votes" />
              <Kpi icon="🗳️" value={data.stats.votes} label="votes au total" />
            </section>
            <Reveal minHeight={420}><Shelf books={data.shelf} onOpen={setOpenId} /></Reveal>
            <Reveal minHeight={600}>
              <Charts genres={data.genres} languages={data.languages} decades={data.decades}
                      authors={data.authors} genre={f.genre} onGenre={(g) => change({ genre: g })} />
            </Reveal>
            <Reveal minHeight={300}><BookTable data={data.table} page={page} onPage={setPage} onOpen={setOpenId} /></Reveal>
          </>
        )}

        <BookDrawer id={openId} onClose={() => setOpenId(null)} />
      </main>
    </>
  );
}
