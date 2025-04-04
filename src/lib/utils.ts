import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diff = now.getTime() - targetDate.getTime();

  // Date in the future
  if (diff < 0) {
    return "posted in the future";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const formatTime = (value: number, unit: string) => (value === 1 ? `1 ${unit}` : `${value} ${unit}s`);

  if (seconds < 60) return formatTime(seconds, "second") + " ago";
  if (minutes < 60) return formatTime(minutes, "minute") + " ago";
  if (hours < 24) return formatTime(hours, "hour") + " ago";
  if (days < 7) return formatTime(days, "day") + " ago";
  if (weeks < 5) return formatTime(weeks, "week") + " ago";
  if (months < 12) return formatTime(months, "month") + " ago";
  return formatTime(years, "year") + " ago";
}
