"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/english", label: "英语学习", icon: "book" },
  { href: "/gallery", label: "AI Gallery", icon: "image" },
  { href: "/profile", label: "关于我", icon: "user" },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "var(--accent-blue)" : "var(--text-secondary)";

  switch (name) {
    case "grid":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.5" />
          <rect x="10.5" y="1" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.5" />
          <rect x="1" y="10.5" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.5" />
          <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="2" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "book":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 3.5C2 2.67 2.67 2 3.5 2H7c1.1 0 2 .9 2 2v11.5c0-.83-.67-1.5-1.5-1.5H3.5c-.83 0-1.5-.67-1.5-1.5V3.5Z" stroke={color} strokeWidth="1.5" />
          <path d="M16 3.5C16 2.67 15.33 2 14.5 2H11c-1.1 0-2 .9-2 2v11.5c0-.83.67-1.5 1.5-1.5h4c.83 0 1.5-.67 1.5-1.5V3.5Z" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "image":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1.5" y="1.5" width="15" height="15" rx="3" stroke={color} strokeWidth="1.5" />
          <circle cx="6" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2" />
          <path d="M1.5 13l4-4.5 3 3 2.5-2.5 5.5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "user":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3.5" stroke={color} strokeWidth="1.5" />
          <path d="M2.5 16c0-2.76 2.91-5 6.5-5s6.5 2.24 6.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: 220,
        background: "var(--bg-card)",
        borderRight: "1px solid var(--divider)",
        display: "flex",
        flexDirection: "column",
        padding: "32px 16px",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "0 12px", marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Lee Space
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-blue-light)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--bg-section)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 18,
                    borderRadius: 2,
                    background: "var(--accent-blue)",
                  }}
                />
              )}
              <NavIcon name={item.icon} active={isActive} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: Mini profile */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 12px",
          borderTop: "1px solid var(--divider)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent-blue-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--accent-blue)",
          }}
        >
          L
        </div>
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            Lee
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              lineHeight: 1.3,
            }}
          >
            个人空间
          </p>
        </div>
      </div>
    </aside>
  );
}
