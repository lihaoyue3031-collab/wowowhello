import { StreakCounter } from "@/components/english/StreakCounter";
import { LogList } from "@/components/english/LogList";

export default function EnglishPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          英语学习
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 8 }}>
          每日打卡记录 · 持续进步
        </p>
      </div>

      {/* Streak counter */}
      <div style={{ marginBottom: 40 }}>
        <StreakCounter />
      </div>

      {/* Log section */}
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
          学习记录
        </h2>
        <LogList />
      </div>
    </div>
  );
}
