import { formatDateShort } from "@/lib/utils";

interface Activity {
  date: string;
  type: string;
  content: string;
  category: "english" | "gallery" | "fund" | "other";
}

interface ActivityFeedProps {
  activities: Activity[];
}

const dotColors: Record<string, string> = {
  english: "#1A73E8",
  gallery: "#9334E6",
  fund: "#34A853",
  other: "#FBBC04",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "var(--shadow-1)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          最近动态
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
          近期活动记录
        </p>
      </div>

      {/* Timeline list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {activities.map((activity, i) => {
          const color = dotColors[activity.category] || dotColors.other;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
              }}
            >
              {/* Dot + line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: 5,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />
                {i < activities.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 20,
                      backgroundColor: "var(--divider)",
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: 16, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {formatDateShort(activity.date)}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: "2px 8px",
                      borderRadius: 20,
                      color,
                      backgroundColor: `${color}14`,
                    }}
                  >
                    {activity.type}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  {activity.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
