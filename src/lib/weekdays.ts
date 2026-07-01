export const WEEKDAY_LABELS_SHORT = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
export const WEEKDAY_LABELS_FULL = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัส",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
];

export function todayWeekdayIndex(date: Date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function defaultWorkoutDays(daysPerWeek: number): number[] {
  return Array.from({ length: daysPerWeek }, (_, i) => i);
}

export function normalizeWorkoutDays(
  workoutDays: number[] | undefined,
  daysPerWeek: number
): number[] {
  const unique = Array.from(new Set(workoutDays ?? []))
    .filter((d) => d >= 0 && d <= 6)
    .sort((a, b) => a - b);
  return unique.length === daysPerWeek ? unique : defaultWorkoutDays(daysPerWeek);
}
