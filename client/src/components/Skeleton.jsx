export function ProfileSkeleton() {
  return (
    <div className="user-profile skeleton-wrapper">
      <div className="skeleton avatar-skeleton" />
      <div className="user-info">
        <div className="skeleton" style={{ width: "180px", height: "24px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ width: "280px", height: "16px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ width: "220px", height: "16px" }} />
      </div>
    </div>
  );
}

export function RepoSkeleton() {
  return (
    <div className="repo-list">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="repo-card skeleton-wrapper">
          <div className="skeleton" style={{ width: "40%", height: "20px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ width: "80%", height: "14px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ width: "60%", height: "12px" }} />
        </div>
      ))}
    </div>
  );
}
