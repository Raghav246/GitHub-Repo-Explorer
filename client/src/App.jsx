import { useCallback } from "react";
import SearchBar from "./components/SearchBar";
import UserProfile from "./components/UserProfile";
import RepoList from "./components/RepoList";
import RecentSearches, { saveRecentSearch } from "./components/RecentSearches";
import { ProfileSkeleton, RepoSkeleton } from "./components/Skeleton";
import { useGithubUser } from "./hooks/useGithubUser";

export default function App() {
  const { loading, error, user, repos, hasNextPage, search, loadMore } = useGithubUser();

  const handleSearch = useCallback(
    (username) => {
      saveRecentSearch(username);
      search(username);
    },
    [search]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub Repo Explorer</h1>
        <p className="subtitle">Search any GitHub user to explore their profile and repositories</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} loading={loading} />
        <RecentSearches onSelect={handleSearch} />

        {error && (
          <div className="error-state" role="alert">
            ⚠️ {error}
          </div>
        )}

        {loading && !user && (
          <>
            <ProfileSkeleton />
            <RepoSkeleton />
          </>
        )}

        {user && (
          <>
            <UserProfile user={user} />
            <RepoList
              repos={repos}
              hasNextPage={hasNextPage}
              onLoadMore={loadMore}
              loading={loading}
            />
          </>
        )}

        {!loading && !error && !user && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Enter a GitHub username above to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
