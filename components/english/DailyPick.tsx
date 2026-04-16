"use client";

import { useState } from "react";
import { useCompletedPicks } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import defaultDailyPicks from "@/data/daily-picks.json";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

interface DailyPickItem {
  id: string;
  date: string;
  section: "update" | "curated";
  title: string;
  channel: string;
  category: string;
  rating: number;
  duration: string;
  reason: string;
  videoId: string;
  url: string;
}

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

const categoryColors: Record<string, { color: string; bg: string }> = {
  访谈: { color: "#1A73E8", bg: "#E8F0FE" },
  教学: { color: "#34A853", bg: "#E6F4EA" },
  短片段: { color: "#E37400", bg: "#FEF3E0" },
  发音: { color: "#9334E6", bg: "#F3E8FD" },
};

function renderStars(rating: number): string {
  return "⭐".repeat(rating);
}

function groupByDate(picks: DailyPickItem[]): Map<string, DailyPickItem[]> {
  const map = new Map<string, DailyPickItem[]>();
  for (const pick of picks) {
    const existing = map.get(pick.date) || [];
    existing.push(pick);
    map.set(pick.date, existing);
  }
  return map;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export function DailyPick() {
  const picks = defaultDailyPicks.picks as DailyPickItem[];
  const { togglePick, isCompleted } = useCompletedPicks();

  // Group by date, sorted newest first
  const grouped = groupByDate(picks);
  const sortedDates = [...grouped.keys()].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // Track collapsed state for historical dates (not the first/newest)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  return (
    <div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          marginBottom: 16,
        }}
      >
        Daily English Pick
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {sortedDates.map((date, dateIdx) => {
          const datePicks = grouped.get(date)!;
          const updatePicks = datePicks.filter((p) => p.section === "update");
          const curatedPicks = datePicks.filter((p) => p.section === "curated");
          const isHistory = dateIdx > 0;
          const isCollapsed = collapsed.has(date);

          return (
            <div
              key={date}
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                boxShadow: "var(--shadow-1)",
                overflow: "hidden",
              }}
            >
              {/* Date header */}
              <div
                onClick={isHistory ? () => toggleCollapse(date) : undefined}
                style={{
                  padding: "16px 24px",
                  borderBottom: isCollapsed ? "none" : "1px solid var(--divider)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: isHistory ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  📅 {formatDate(date)}
                </span>
                {isHistory && (
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-tertiary)",
                      transition: "transform 200ms ease",
                      transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                )}
              </div>

              {/* Content (collapsible for history dates) */}
              {!isCollapsed && (
                <div style={{ padding: "0 24px 20px" }}>
                  {/* Update section */}
                  {updatePicks.length > 0 && (
                    <SectionBlock
                      emoji="📡"
                      label="今日更新推荐"
                      picks={updatePicks}
                      isCompleted={isCompleted}
                      togglePick={togglePick}
                    />
                  )}

                  {/* Curated section */}
                  {curatedPicks.length > 0 && (
                    <SectionBlock
                      emoji="📚"
                      label="今日精选课程"
                      picks={curatedPicks}
                      isCompleted={isCompleted}
                      togglePick={togglePick}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section block (update / curated)
   ───────────────────────────────────────────── */

function SectionBlock({
  emoji,
  label,
  picks,
  isCompleted,
  togglePick,
}: {
  emoji: string;
  label: string;
  picks: DailyPickItem[];
  isCompleted: (id: string) => boolean;
  togglePick: (id: string) => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-secondary)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{emoji}</span>
        <span>{label}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {picks.map((pick, idx) => (
          <div key={pick.id}>
            {idx > 0 && (
              <div
                style={{
                  height: 1,
                  background: "var(--divider)",
                  margin: "0",
                }}
              />
            )}
            <PickCard
              pick={pick}
              completed={isCompleted(pick.id)}
              onToggle={() => togglePick(pick.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pick card
   ───────────────────────────────────────────── */

function PickCard({
  pick,
  completed,
  onToggle,
}: {
  pick: DailyPickItem;
  completed: boolean;
  onToggle: () => void;
}) {
  const catStyle = categoryColors[pick.category] || {
    color: "var(--text-secondary)",
    bg: "var(--bg-section)",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 0",
        opacity: completed ? 0.5 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      {/* Left: info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Stars */}
        <div style={{ fontSize: 13, lineHeight: 1, marginBottom: 6 }}>
          {renderStars(pick.rating)}
        </div>

        {/* Title + channel + category in one row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.4,
            }}
          >
            {pick.title}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              whiteSpace: "nowrap",
            }}
          >
            {pick.channel}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: 20,
              color: catStyle.color,
              backgroundColor: catStyle.bg,
              whiteSpace: "nowrap",
            }}
          >
            {pick.category}
          </span>
        </div>

        {/* Reason */}
        <div
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            paddingLeft: 10,
            borderLeft: "2px solid var(--divider)",
            marginBottom: 6,
          }}
        >
          {pick.reason}
        </div>

        {/* Duration tag */}
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-tertiary)",
            background: "var(--bg-section)",
            padding: "2px 8px",
            borderRadius: 20,
          }}
        >
          🕐 {pick.duration}
        </span>
      </div>

      {/* Right: thumbnail */}
      <a
        href={pick.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flexShrink: 0,
          display: "block",
          width: 160,
          borderRadius: 8,
          overflow: "hidden",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "var(--shadow-2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${pick.videoId}/mqdefault.jpg`}
          alt={pick.title}
          style={{
            width: 160,
            height: 90,
            objectFit: "cover",
            display: "block",
            borderRadius: 8,
          }}
        />
      </a>

      {/* Checkbox */}
      <label
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 4,
        }}
        title={completed ? "标记为未看" : "标记为已看"}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          style={{
            width: 20,
            height: 20,
            accentColor: "var(--accent-blue)",
            cursor: "pointer",
          }}
        />
      </label>
    </div>
  );
}
