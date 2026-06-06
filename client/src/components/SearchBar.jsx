import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const debounceRef = useRef(null);

  // Debounced search-as-you-type (500ms)
  useEffect(() => {
    if (!value.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 500);
    return () => clearTimeout(debounceRef.current);
  }, [value]); // eslint-disable-line

  function handleSubmit(e) {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    if (value.trim()) onSearch(value);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a GitHub username…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        aria-label="GitHub username"
      />
      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
