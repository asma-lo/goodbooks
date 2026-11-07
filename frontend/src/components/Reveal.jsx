import { useEffect, useRef, useState } from "react";

// Affiche son contenu avec une animation quand il entre dans l'écran.
// Le contenu n'est monté qu'à ce moment : les graphiques s'animent sous les yeux de l'utilisateur.
export default function Reveal({ children, delay = 0, minHeight = 200 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"reveal" + (on ? " in" : "")} style={{ transitionDelay: `${delay}ms`, minHeight: on ? undefined : minHeight }}>
      {on && children}
    </div>
  );
}
