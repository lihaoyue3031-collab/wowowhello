"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StudyChartProps {
  data: { week: string; minutes: number }[];
}

export function StudyChart({ data }: StudyChartProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 12,
        padding: 24,
        boxShadow: "var(--shadow-1)",
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
          每周学习时长
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
            marginTop: 2,
          }}
        >
          按周统计（分钟）
        </p>
      </div>

      <div style={{ height: 220, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#1A73E8" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#EEEEEE"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#AEAEB2" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#AEAEB2" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E0E0",
                borderRadius: 12,
                fontSize: 13,
                boxShadow: "var(--shadow-3)",
                padding: "8px 14px",
              }}
              labelStyle={{ color: "#1D1D1F", fontWeight: 500 }}
              itemStyle={{ color: "#86868B" }}
              formatter={(value) => [`${value} 分钟`, "学习时长"]}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#1A73E8"
              strokeWidth={2}
              fill="url(#studyGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#1A73E8",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
