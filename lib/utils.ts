/**
 * Merge class names — a minimal cn() utility.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date to short form: "4月14日"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
}

/**
 * Get today's date in YYYY-MM-DD format.
 */
export function getToday(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

/**
 * Format today's date for display: "2026年4月14日 星期二"
 */
export function formatTodayFull(): string {
  const d = new Date();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dateStr = d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${dateStr} ${weekdays[d.getDay()]}`;
}

/**
 * Calculate streak days from a list of date strings.
 */
export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates]
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = sorted[i].getTime() - sorted[i + 1].getTime();
    const dayDiff = diff / (1000 * 60 * 60 * 24);
    if (dayDiff <= 1.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Parse duration string like "45min" to minutes number.
 */
export function parseDuration(dur: string): number {
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Sum total minutes from duration strings.
 */
export function totalMinutes(durations: string[]): number {
  return durations.reduce((sum, d) => sum + parseDuration(d), 0);
}

/**
 * Format minutes to "Xh Ym" display.
 */
export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Get entries for a specific month (YYYY-MM).
 */
export function getMonthEntries<T extends { date: string }>(
  entries: T[],
  yearMonth: string
): T[] {
  return entries.filter((e) => e.date.startsWith(yearMonth));
}

/**
 * Build heatmap data for the last N weeks.
 * Returns a flat array of { date, count } objects.
 */
export function buildHeatmapData(
  dates: string[],
  weeks: number = 15
): { date: string; level: number }[] {
  const dateSet = new Set(dates);
  const result: { date: string; level: number }[] = [];
  const today = new Date();

  // Find the start of the current week (Sunday)
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - today.getDay());

  // Go back N weeks
  const start = new Date(startOfCurrentWeek);
  start.setDate(start.getDate() - (weeks - 1) * 7);

  // Fill all days
  const cursor = new Date(start);
  const endDate = new Date(today);
  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split("T")[0];
    const hasEntry = dateSet.has(dateStr);
    result.push({
      date: dateStr,
      level: hasEntry ? 3 : 0, // Simple: 0 = no data, 3 = has data
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Build weekly study time data for chart.
 */
export function buildWeeklyData(
  entries: { date: string; duration: string }[]
): { week: string; minutes: number }[] {
  const weekMap = new Map<string, number>();

  for (const entry of entries) {
    const d = new Date(entry.date);
    // Get Monday of that week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = `${monday.getMonth() + 1}/${monday.getDate()}`;

    const mins = parseDuration(entry.duration);
    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + mins);
  }

  return Array.from(weekMap.entries())
    .sort((a, b) => {
      // Sort by date
      return 0; // Already in insertion order which is chronological
    })
    .map(([week, minutes]) => ({ week, minutes }));
}
