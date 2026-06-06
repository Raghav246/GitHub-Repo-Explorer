const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

app.use(cors());
app.use(express.json());

// In-memory cache: { [username]: { data, cachedAt } }
const cache = {};

function getCached(key) {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    delete cache[key];
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache[key] = { data, cachedAt: Date.now() };
}

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  },
});

// GET /api/users/:username  — profile + repos (paginated)
app.get("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;
  const cacheKey = `${username}:${page}`;

  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, fromCache: true });

  try {
    const [userRes, reposRes] = await Promise.all([
      githubAPI.get(`/users/${username}`),
      githubAPI.get(`/users/${username}/repos`, {
        params: { per_page: 30, page, sort: "updated" },
      }),
    ]);

    const linkHeader = reposRes.headers["link"] || "";
    const hasNextPage = linkHeader.includes('rel="next"');

    const user = {
      login: userRes.data.login,
      name: userRes.data.name,
      avatar_url: userRes.data.avatar_url,
      bio: userRes.data.bio,
      followers: userRes.data.followers,
      following: userRes.data.following,
      public_repos: userRes.data.public_repos,
      html_url: userRes.data.html_url,
    };

    const repos = reposRes.data.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      updated_at: r.updated_at,
      html_url: r.html_url,
      open_issues_count: r.open_issues_count,
      default_branch: r.default_branch,
      forks_count: r.forks_count,
    }));

    const payload = { user, repos, page, hasNextPage };
    setCache(cacheKey, payload);
    res.json({ ...payload, fromCache: false });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "GitHub user not found." });
    }
    if (err.response?.status === 403) {
      return res.status(429).json({ error: "GitHub rate limit exceeded. Please try again later." });
    }
    res.status(500).json({ error: "Failed to fetch data from GitHub." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
