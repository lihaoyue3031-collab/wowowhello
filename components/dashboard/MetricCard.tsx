"use client";

import Link from "next/link";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  href?: string;
}

export function MetricCard({ label, value, sub, trend, href }: MetricCardProps) {
  const card = (
    <div
      className="metric-card"
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "var(--shadow-1)",
        transition: "all 0.2s ease",
        cursor: href ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
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
      {/* Overline label */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          lineHeight: 1.3,
          marginBottom: 12,
        }}
      >
        {label}
      </p>

      {/* Big number */}
      <p
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>

      {/* Bottom row: sub + trend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        {sub && (
          <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
            {sub}
          </span>
        )}
        {trend && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color:
                trend.direction === "up"
                  ? "var(--accent-green)"
                  : trend.direction === "down"
                  ? "var(--accent-red)"
                  : "var(--text-secondary)",
            }}
          >
            {trend.direction === "up" && "↑ "}
            {trend.direction === "down" && "↓ "}
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </Link>
    );
  }

  return card;
}
