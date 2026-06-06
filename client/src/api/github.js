const BASE = import.meta.env.VITE_API_URL || "/api";

export async function fetchUser(username, page = 1) {
  const res = await fetch(`${BASE}/users/${username}?page=${page}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
