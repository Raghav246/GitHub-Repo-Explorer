const MAX_RECENT = 5;
const KEY = "gh_recent_searches";

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(username) {
  const prev = getRecentSearches().filter((u) => u !== username);
  localStorage.setItem(KEY, JSON.stringify([username, ...prev].slice(0, MAX_RECENT)));
}

export default function RecentSearches({ onSelect }) {
  const searches = getRecentSearches();
  if (searches.length === 0) return null;

  return (
    <div className="recent-searches">
      <span className="recent-label">Recent:</span>
      {searches.map((u) => (
        <button key={u} className="recent-chip" onClick={() => onSelect(u)}>
          {u}
        </button>
      ))}
    </div>
  );
}
