const request = require("supertest");
const { app, githubAPI, clearCache } = require("../app");

const mockUser = {
  login: "testuser",
  name: "Test User",
  avatar_url: "https://example.com/avatar.png",
  bio: "A test bio",
  followers: 10,
  following: 5,
  public_repos: 3,
  html_url: "https://github.com/testuser",
};

const mockRepo = {
  id: 1,
  name: "test-repo",
  description: "A test repository",
  language: "JavaScript",
  stargazers_count: 42,
  updated_at: "2024-01-01T00:00:00Z",
  html_url: "https://github.com/testuser/test-repo",
  open_issues_count: 2,
  default_branch: "main",
  forks_count: 5,
};

beforeEach(() => {
  clearCache();
  jest.restoreAllMocks();
});

describe("GET /api/users/:username", () => {
  it("returns user profile and repos on success", async () => {
    jest
      .spyOn(githubAPI, "get")
      .mockResolvedValueOnce({ data: mockUser })
      .mockResolvedValueOnce({ data: [mockRepo], headers: {} });

    const res = await request(app).get("/api/users/testuser");

    expect(res.status).toBe(200);
    expect(res.body.user.login).toBe("testuser");
    expect(res.body.repos).toHaveLength(1);
    expect(res.body.repos[0].name).toBe("test-repo");
    expect(res.body.fromCache).toBe(false);
  });

  it("returns 404 when GitHub user does not exist", async () => {
    jest.spyOn(githubAPI, "get").mockRejectedValue({ response: { status: 404 } });

    const res = await request(app).get("/api/users/nonexistentuser99999");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("GitHub user not found.");
  });

  it("returns 429 on GitHub rate limit", async () => {
    jest.spyOn(githubAPI, "get").mockRejectedValue({ response: { status: 403 } });

    const res = await request(app).get("/api/users/someuser");

    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/rate limit/i);
  });

  it("serves from cache on second identical request", async () => {
    const getSpy = jest
      .spyOn(githubAPI, "get")
      .mockResolvedValueOnce({ data: mockUser })
      .mockResolvedValueOnce({ data: [mockRepo], headers: {} });

    await request(app).get("/api/users/testuser");
    const res = await request(app).get("/api/users/testuser");

    expect(res.status).toBe(200);
    expect(res.body.fromCache).toBe(true);
    // Only the first request should have hit GitHub (2 parallel calls)
    expect(getSpy).toHaveBeenCalledTimes(2);
  });
});
