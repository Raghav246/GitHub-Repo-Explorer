import { useState, useCallback } from "react";
import { fetchUser } from "../api/github";

export function useGithubUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  const search = useCallback(async (username) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setRepos([]);
    setPage(1);
    setCurrentUsername(username.trim());
    try {
      const data = await fetchUser(username.trim(), 1);
      setUser(data.user);
      setRepos(data.repos);
      setHasNextPage(data.hasNextPage);
      setPage(1);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const data = await fetchUser(currentUsername, nextPage);
      setRepos((prev) => [...prev, ...data.repos]);
      setHasNextPage(data.hasNextPage);
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUsername, page]);

  return { loading, error, user, repos, hasNextPage, search, loadMore };
}
