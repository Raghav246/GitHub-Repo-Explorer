# GitHub Repo Explorer

A full-stack web app where you type a GitHub username and instantly see their public profile along with all their repositories. The React frontend never calls GitHub directly — all requests are proxied through an Express backend that also caches responses to avoid hitting rate limits.

## Live Demo

- Frontend: *(deploy to Vercel/Netlify and add link here)*
- Backend: *(deploy to Render/Railway and add link here)*

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + Vite | Fast HMR, minimal config, functional components with hooks |
| Backend | Node.js + Express | Lightweight, familiar, easy proxy layer |
| HTTP client | axios | Clean API, good error handling |
| Styling | Plain CSS | No extra dependencies, full control, dark theme |
| Testing | Jest + supertest | Straightforward unit + integration tests for the API |

## How to Run Locally

Requires Node.js 18+. Open two terminal tabs.

**Terminal 1 — Backend**
```bash
cd server
npm install
# Optional: create a .env file from .env.example and add your GITHUB_TOKEN
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd client
npm install
npm run dev
# App opens at http://localhost:5173
```

Or from the repo root, install everything at once:
```bash
npm run install:all
```
Then start each with `npm run dev:server` and `npm run dev:client` in separate terminals.

**Run tests:**
```bash
cd server
npm test
```

## API Documentation

### `GET /api/users/:username?page=<n>`

Fetches a GitHub user's profile and their paginated list of public repositories. Responses are cached for 60 seconds per username+page combination.

**Path param:** `username` — GitHub login  
**Query param:** `page` (optional, default `1`) — repo page number (30 repos per page)

**Success `200`**
```json
{
  "user": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "avatar_url": "https://...",
    "bio": "...",
    "followers": 234567,
    "following": 0,
    "public_repos": 8,
    "html_url": "https://github.com/torvalds"
  },
  "repos": [
    {
      "id": 2325298,
      "name": "linux",
      "description": "Linux kernel source tree",
      "language": "C",
      "stargazers_count": 183000,
      "updated_at": "2024-06-01T12:00:00Z",
      "html_url": "https://github.com/torvalds/linux",
      "open_issues_count": 398,
      "default_branch": "master",
      "forks_count": 56000
    }
  ],
  "page": 1,
  "hasNextPage": false,
  "fromCache": false
}
```

**Error `404`** — username not found
```json
{ "error": "GitHub user not found." }
```

**Error `429`** — GitHub rate limit hit
```json
{ "error": "GitHub rate limit exceeded. Please try again later." }
```

**Error `500`** — unexpected failure
```json
{ "error": "Failed to fetch data from GitHub." }
```

## Project Structure

```
GitHub-Repo-Explorer/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── github.js        # fetch wrapper calling /api
│   │   ├── components/
│   │   │   ├── SearchBar.jsx    # debounced search input
│   │   │   ├── UserProfile.jsx  # avatar, name, bio, stats
│   │   │   ├── RepoList.jsx     # sort controls + list container
│   │   │   ├── RepoCard.jsx     # expandable repo row
│   │   │   ├── Skeleton.jsx     # loading placeholders
│   │   │   └── RecentSearches.jsx # localStorage recent list
│   │   ├── hooks/
│   │   │   └── useGithubUser.js # search + pagination state
│   │   ├── App.jsx              # root component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # global dark-theme styles
│   ├── index.html
│   └── vite.config.js           # proxy /api → localhost:5000
│
├── server/                  # Express backend
│   ├── __tests__/
│   │   └── api.test.js          # Jest + supertest tests
│   ├── app.js                   # Express app + cache + route
│   ├── index.js                 # starts HTTP listener
│   ├── .env.example             # GITHUB_TOKEN template
│   └── package.json
│
├── package.json             # root convenience scripts
└── README.md
```

## Features Implemented

- Search by GitHub username with debounced search-as-you-type (500 ms)
- User profile: avatar, name, bio, followers, following, repo count
- Repository list with name, description, language dot, stars, last updated
- Click any repo card to expand: forks, open issues, default branch
- Sort repos by Last Updated / Stars / Name
- Pagination — "Load more" button when a user has > 30 repos
- Server-side in-memory cache (60 s TTL) to avoid GitHub rate limits
- Optional `GITHUB_TOKEN` on the server to increase rate limit to 5 000 req/hr
- Graceful error states for 404 (user not found) and 429 (rate limited)
- Skeleton loading placeholders while requests are in flight
- Recently searched usernames persisted to localStorage (up to 5)
- Responsive on mobile (single-column layout below 480 px)
- Dark theme throughout

## Next Steps

Given more time I would:

- **Language chart** — a small pie/bar chart (Recharts) showing the distribution of programming languages across all repos
- **Persistent cache** — swap the in-memory cache for Redis so it survives server restarts
- **Auth** — add GitHub OAuth so users get a higher personal rate limit (5 000 → their own quota)
- **Search within repos** — a client-side filter input to narrow the repo list by name
- **CI/CD** — a GitHub Actions workflow that runs `npm test` on every PR
- **Deployed demo** — wire up Render (backend) + Vercel (frontend) with env vars set

## Notes

- AI tools (Amazon Q) were used to assist with scaffolding and boilerplate. All logic, architecture decisions, and test design were reasoned through and are understood line-by-line.
- GitHub's unauthenticated rate limit is 60 requests/hour per IP. Adding a `GITHUB_TOKEN` in `server/.env` raises this to 5 000/hour.
