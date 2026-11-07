// Appel générique de l'API : ignore les paramètres vides.
export async function get(path, params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v != null) q.set(k, v);
  });
  const r = await fetch(`/api/${path}?${q}`);
  if (!r.ok) throw new Error(`${path} : ${r.status}`);
  return r.json();
}
