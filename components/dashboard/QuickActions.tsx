"use client";

import Link from "next/link";

const actions = [
  {
    label: "英语学习",
    desc: "查看打卡记录",
    href: "/english",
    icon: "📖",
  },
  {
    label: "AI Gallery",
    desc: "浏览作品集",
    href: "/gallery",
    icon: "🎨",
  },
  {
    label: "个人信息",
    desc: "编辑资料",
    href: "/profile",
    icon: "👤",
  },
  {
    label: "数据统计",
    desc: "查看趋势",
    href: "/",
    icon: "📊",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 16,
        }}
      >
        快捷操作
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                padding: "20px 16px",
                boxShadow: "var(--shadow-1)",
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-2)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>
                {action.icon}
              </span>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {action.label}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  marginTop: 2,
                }}
              >
                {action.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
