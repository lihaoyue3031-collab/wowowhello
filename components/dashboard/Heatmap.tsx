"use client";

import { buildHeatmapData } from "@/lib/utils";

interface HeatmapProps {
  dates: string[];
}

/* GitHub contribution style — 5 levels from no-data to high-active */
const LEVELS = [
  "#EBEDF0", // 0: no data
  "#C6DBF7", // 1: low
  "#80B3F0", // 2: medium
  "#4A90E2", // 3: active
  "#1A73E8", // 4: high
];

export function Heatmap({ dates }: HeatmapProps) {
  const data = buildHeatmapData(dates, 15);

  /* Group into columns (weeks). Each column = 7 day-cells max. */
  const weeks: { date: string; level: number }[][] = [];
  let currentWeek: { date: string; level: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const d = new Date(data[i].date);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(data[i]);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "var(--shadow-1)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.4,
            }}
          >
            学习热力图
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>
            最近 15 周打卡记录
          </p>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: "var(--text-tertiary)",
          }}
        >
          <span>少</span>
          {[LEVELS[0], LEVELS[1], LEVELS[2], LEVELS[3], LEVELS[4]].map(
            (color, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
            )
          )}
          <span>多</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 3 }}>
        {/* Day labels column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginRight: 4,
          }}
        >
          {dayLabels.map((label, i) => (
            <div
              key={i}
              style={{
                height: 13,
                width: 18,
                fontSize: 9,
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {i % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Pad first week */}
            {wi === 0 &&
              week.length < 7 &&
              Array.from({ length: 7 - week.length }).map((_, pi) => (
                <div key={`pad-${pi}`} style={{ width: 13, height: 13 }} />
              ))}
            {week.map((day) => (
              <div
                key={day.date}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 2,
                  backgroundColor: LEVELS[day.level],
                  transition: "background-color 0.15s",
                }}
                title={`${day.date}: ${day.level > 0 ? "已学习" : "未学习"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
