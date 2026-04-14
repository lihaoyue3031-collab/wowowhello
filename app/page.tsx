"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { StudyChart } from "@/components/dashboard/StudyChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { GalleryPreview } from "@/components/dashboard/GalleryPreview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useEnglishLog } from "@/lib/store";
import { useGallery } from "@/lib/store";
import {
  calculateStreak,
  totalMinutes,
  formatMinutes,
  formatTodayFull,
  buildWeeklyData,
} from "@/lib/utils";

export default function DashboardPage() {
  const { logs } = useEnglishLog();
  const { items: galleryItems } = useGallery();

  const dates = logs.map((e) => e.date);
  const streak = calculateStreak(dates);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthEntries = logs.filter((e) => e.date.startsWith(currentMonth));
  const monthMinutes = totalMinutes(monthEntries.map((e) => e.duration));
  const galleryCount = galleryItems.length;
  const weeklyData = buildWeeklyData(logs);

  const recentActivities = [
    ...logs
      .slice(-5)
      .reverse()
      .map((e) => ({
        date: e.date,
        type: e.type || "学习",
        content: e.content,
        category: "english" as const,
      })),
    ...galleryItems
      .slice(-2)
      .reverse()
      .map((item) => ({
        date: item.date,
        type: item.tool,
        content: `创作了「${item.title}」— ${item.description}`,
        category: "gallery" as const,
      })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div style={{ maxWidth: 1080 }}>
      {/* ── Area 1: Header ── */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 8,
              }}
            >
              {formatTodayFull()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Area 2: Metric cards row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard
          label="连续打卡"
          value={`${streak}`}
          sub="天"
          trend={{ direction: "up", text: "持续中" }}
          href="/english"
        />
        <MetricCard
          label="本月学习"
          value={formatMinutes(monthMinutes)}
          sub={`${monthEntries.length} 次学习`}
          trend={{ direction: "up", text: `${monthEntries.length}天` }}
          href="/english"
        />
        <MetricCard
          label="AI 作品"
          value={`${galleryCount}`}
          sub="件作品"
          trend={{ direction: "neutral", text: "持续创作" }}
          href="/gallery"
        />
        <MetricCard
          label="PUBG"
          value="5500+"
          sub="小时"
        />
      </div>

      {/* ── Area 3: Chart + Activity (60/40 split) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StudyChart data={weeklyData} />
        <ActivityFeed activities={recentActivities} />
      </div>

      {/* ── Area 4: Heatmap (full width) ── */}
      <div style={{ marginBottom: 32 }}>
        <Heatmap dates={dates} />
      </div>

      {/* ── Area 5a: Gallery Preview ── */}
      <div style={{ marginBottom: 40 }}>
        <GalleryPreview />
      </div>

      {/* ── Area 5b: Quick Actions ── */}
      <QuickActions />
    </div>
  );
}
