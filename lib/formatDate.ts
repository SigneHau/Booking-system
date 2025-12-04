// lib/formatDate.ts
export function formatDateDK(date: Date) {
  return date
    .toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\./g, "-"); // 01.12.2025 → 01-12-2025
}