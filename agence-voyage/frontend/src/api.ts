const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Destination = {
  id: string;
  name: string;
  country: string;
  description: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erreur ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  listDestinations: () => request<Destination[]>("/api/destinations"),
};
