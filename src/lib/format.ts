// @ts-check

/** "2026-10-20" style, locale-independent so the archive sorts and reads the same everywhere. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
