export default function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
      <div className="user-info">
        <h2>{user.name || user.login}</h2>
        {user.bio && <p className="bio">{user.bio}</p>}
        <div className="user-stats">
          <span>👥 <strong>{user.followers}</strong> followers</span>
          <span>·</span>
          <span><strong>{user.following}</strong> following</span>
          <span>·</span>
          <span>📦 <strong>{user.public_repos}</strong> public repos</span>
        </div>
        <a href={user.html_url} target="_blank" rel="noreferrer" className="gh-link">
          View on GitHub ↗
        </a>
      </div>
    </div>
  );
}
