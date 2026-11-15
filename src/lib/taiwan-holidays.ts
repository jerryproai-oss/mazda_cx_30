// ============================================================
// 2026 年 台灣國定假日 / 人事行政局行事曆
// 資料來源：行政院人事行政總處
// ============================================================

export interface TaiwanHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  isHoliday: boolean; // true=放假, false=補班
}

// 2026 年國定假日 (民國115年)
// 全年放假 120 天，無補班日
export const TAIWAN_HOLIDAYS_2026: TaiwanHoliday[] = [
  // 元旦
  { date: "2026-01-01", name: "元旦", isHoliday: true },

  // 農曆春節 (2/14~2/22, 9天)
  { date: "2026-02-14", name: "春節假期", isHoliday: true },
  { date: "2026-02-15", name: "春節假期", isHoliday: true },
  { date: "2026-02-16", name: "除夕", isHoliday: true },
  { date: "2026-02-17", name: "春節初一", isHoliday: true },
  { date: "2026-02-18", name: "春節初二", isHoliday: true },
  { date: "2026-02-19", name: "春節初三", isHoliday: true },
  { date: "2026-02-20", name: "春節假期", isHoliday: true },
  { date: "2026-02-21", name: "春節假期", isHoliday: true },
  { date: "2026-02-22", name: "春節假期", isHoliday: true },

  // 228和平紀念日 (2/27~3/1, 3天)
  { date: "2026-02-27", name: "228補假", isHoliday: true },
  { date: "2026-02-28", name: "和平紀念日", isHoliday: true },

  // 兒童節及清明節 (4/3~4/6, 4天)
  { date: "2026-04-03", name: "清明節補假", isHoliday: true },
  { date: "2026-04-04", name: "兒童節", isHoliday: true },
  { date: "2026-04-05", name: "清明節", isHoliday: true },
  { date: "2026-04-06", name: "兒童/清明補假", isHoliday: true },

  // 勞動節 (5/1~5/3, 3天)
  { date: "2026-05-01", name: "勞動節", isHoliday: true },

  // 端午節 (6/19~6/21, 3天)
  { date: "2026-06-19", name: "端午節", isHoliday: true },

  // 中秋節及教師節 (9/25~9/28, 4天)
  { date: "2026-09-25", name: "中秋節", isHoliday: true },
  { date: "2026-09-26", name: "中秋節假期", isHoliday: true },
  { date: "2026-09-27", name: "中秋節假期", isHoliday: true },
  { date: "2026-09-28", name: "教師節", isHoliday: true },

  // 國慶日 (10/9~10/11, 3天)
  { date: "2026-10-09", name: "國慶日補假", isHoliday: true },
  { date: "2026-10-10", name: "國慶日", isHoliday: true },

  // 臺灣光復節 (10/24~10/26, 3天)
  { date: "2026-10-25", name: "臺灣光復節", isHoliday: true },
  { date: "2026-10-26", name: "光復節補假", isHoliday: true },

  // 行憲紀念日 (12/25~12/27, 3天)
  { date: "2026-12-25", name: "行憲紀念日", isHoliday: true },
];

/**
 * 取得指定日期的假日資訊
 */
export function getHoliday(dateStr: string): TaiwanHoliday | undefined {
  return TAIWAN_HOLIDAYS_2026.find((h) => h.date === dateStr);
}

/**
 * 取得指定月份的所有假日
 */
export function getHolidaysByMonth(
  year: number,
  month: number
): TaiwanHoliday[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return TAIWAN_HOLIDAYS_2026.filter((h) => h.date.startsWith(prefix));
}

/**
 * 判斷是否為假日
 */
export function isHoliday(dateStr: string): boolean {
  return TAIWAN_HOLIDAYS_2026.some(
    (h) => h.date === dateStr && h.isHoliday
  );
}
