import { useState } from "react";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
};

export default function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false);
  const langColor = LANGUAGE_COLORS[repo.language] || "#8b949e";
  const updatedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="repo-card" onClick={() => setExpanded((v) => !v)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      <div className="repo-main">
        <a href={repo.html_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
          className="repo-name">
          {repo.name}
        </a>
        {repo.description && <p className="repo-desc">{repo.description}</p>}
        <div className="repo-meta">
          {repo.language && (
            <span className="repo-lang">
              <span className="lang-dot" style={{ background: langColor }} />
              {repo.language}
            </span>
          )}
          <span>⭐ {repo.stargazers_count}</span>
          <span>Updated {updatedDate}</span>
        </div>
      </div>

      {expanded && (
        <div className="repo-details" onClick={(e) => e.stopPropagation()}>
          <span>🔀 {repo.forks_count} forks</span>
          <span>🐛 {repo.open_issues_count} open issues</span>
          <span>🌿 Default branch: <code>{repo.default_branch}</code></span>
        </div>
      )}
    </div>
  );
}
