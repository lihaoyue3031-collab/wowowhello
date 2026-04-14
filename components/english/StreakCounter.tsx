"use client";

import { useEnglishLog } from "@/lib/store";
import { calculateStreak } from "@/lib/utils";

export function StreakCounter() {
  const { logs } = useEnglishLog();
  const dates = logs.map((e) => e.date);
  const streak = calculateStreak(dates);
  const totalDays = dates.length;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 32,
        boxShadow: "var(--shadow-1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 64 }}>
        {/* Streak */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            当前连续
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: "var(--accent-blue)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {streak}
            </span>
            <span style={{ fontSize: 15, color: "var(--text-secondary)" }}>
              天
            </span>
          </div>
        </div>

        {/* Total */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            累计学习
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {totalDays}
            </span>
            <span style={{ fontSize: 15, color: "var(--text-secondary)" }}>
              天
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
