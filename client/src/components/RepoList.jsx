import { useState, useMemo } from "react";
import RepoCard from "./RepoCard";

const SORT_OPTIONS = [
  { value: "updated", label: "Last Updated" },
  { value: "stars", label: "Stars" },
  { value: "name", label: "Name" },
];

export default function RepoList({ repos, hasNextPage, onLoadMore, loading }) {
  const [sort, setSort] = useState("updated");

  const sorted = useMemo(() => {
    const arr = [...repos];
    if (sort === "stars") arr.sort((a, b) => b.stargazers_count - a.stargazers_count);
    else if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    else arr.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return arr;
  }, [repos, sort]);

  if (repos.length === 0) return null;

  return (
    <section className="repo-section">
      <div className="repo-header">
        <h3>{repos.length} Repositories</h3>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="repo-list">
        {sorted.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {hasNextPage && (
        <button className="load-more" onClick={onLoadMore} disabled={loading}>
          {loading ? "Loading…" : "Load more repositories"}
        </button>
      )}
    </section>
  );
}
