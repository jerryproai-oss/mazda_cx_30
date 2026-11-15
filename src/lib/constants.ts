// ============================================================
// 使用人色彩對照表
// ============================================================
export const USER_COLORS: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  老大: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700",
    dot: "bg-blue-500",
  },
  老二: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-300 dark:border-green-700",
    dot: "bg-green-500",
  },
  老三: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-700",
    dot: "bg-orange-500",
  },
  鴻老爹: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700",
    dot: "bg-purple-500",
  },
};

export const USERS = ["老大", "老二", "老三", "鴻老爹"] as const;
export type UserName = (typeof USERS)[number];

export const STATUS_OPTIONS = [
  "預約中",
  "已出車",
  "已完成",
  "已取消",
] as const;
export type BookingStatus = (typeof STATUS_OPTIONS)[number];

export const COST_ITEMS = [
  "一般保養",
  "大保養",
  "牌照稅與燃料稅",
  "強制險與超額險",
] as const;
export type CostItem = (typeof COST_ITEMS)[number];

export const STATUS_BADGE_COLORS: Record<string, string> = {
  預約中: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  已出車: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  已完成: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  已取消: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};
