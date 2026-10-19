import { useEffect, useState } from "react";
import { api, type Destination } from "./api";

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listDestinations()
      .then(setDestinations)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Agence de voyage</h1>
      <h2>Destinations</h2>
      {loading && <p>Chargement…</p>}
      {error && <p role="alert">Impossible de charger les destinations : {error}</p>}
      {!loading && !error && destinations.length === 0 && (
        <p>Aucune destination. Lance le seed : <code>npm run db:seed</code></p>
      )}
      <ul>
        {destinations.map((d) => (
          <li key={d.id}>
            <strong>{d.name}</strong>, {d.country}
            {d.description && <p>{d.description}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
