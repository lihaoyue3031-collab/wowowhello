interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 28,
        boxShadow: "var(--shadow-1)",
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
