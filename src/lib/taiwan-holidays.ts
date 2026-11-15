// ============================================================
// 2026 年 台灣國定假日 / 人事行政局行事曆
// 資料來源：行政院人事行政總處 (民國115年政府行政機關辦公日曆表)
// 全年放假 120 天，無補班日
// ============================================================

export interface TaiwanHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  isHoliday: boolean; // true=放假, false=補班
}

// 2026 年國定假日 (民國115年)
// 全年放假 120 天，無補班日
export const TAIWAN_HOLIDAYS_2026: TaiwanHoliday[] = [
  // ── 元旦 (1天) ──
  // 1/1(四) 元旦，無連假
  { date: "2026-01-01", name: "元旦", isHoliday: true },

  // ── 農曆春節 (9天連假 2/14~2/22) ──
  // 含小年夜、除夕、初一至初五
  { date: "2026-02-14", name: "春節連假（週六）", isHoliday: true },
  { date: "2026-02-15", name: "春節連假（週日）", isHoliday: true },
  { date: "2026-02-16", name: "除夕", isHoliday: true },
  { date: "2026-02-17", name: "春節初一", isHoliday: true },
  { date: "2026-02-18", name: "春節初二", isHoliday: true },
  { date: "2026-02-19", name: "春節初三", isHoliday: true },
  { date: "2026-02-20", name: "春節補假", isHoliday: true },
  { date: "2026-02-21", name: "春節連假（週六）", isHoliday: true },
  { date: "2026-02-22", name: "春節連假（週日）", isHoliday: true },

  // ── 和平紀念日 (3天連假 2/27~3/1) ──
  // 2/28(六) 和平紀念日，逢週六於 2/27(五) 補假
  { date: "2026-02-27", name: "和平紀念日（補假）", isHoliday: true },
  { date: "2026-02-28", name: "和平紀念日", isHoliday: true },
  { date: "2026-03-01", name: "和平紀念日連假（週日）", isHoliday: true },

  // ── 兒童節及民族掃墓節 (4天連假 4/3~4/6) ──
  // 4/4(六) 兒童節補於 4/3(五)，4/5(日) 清明節補於 4/6(一)
  { date: "2026-04-03", name: "兒童節（補假）", isHoliday: true },
  { date: "2026-04-04", name: "兒童節", isHoliday: true },
  { date: "2026-04-05", name: "清明節", isHoliday: true },
  { date: "2026-04-06", name: "清明節（補假）", isHoliday: true },

  // ── 勞動節 (3天連假 5/1~5/3) ──
  // 5/1(五) 勞動節，與週末相連
  { date: "2026-05-01", name: "勞動節", isHoliday: true },
  { date: "2026-05-02", name: "勞動節連假（週六）", isHoliday: true },
  { date: "2026-05-03", name: "勞動節連假（週日）", isHoliday: true },

  // ── 端午節 (3天連假 6/19~6/21) ──
  // 6/19(五) 端午節，與週末相連
  { date: "2026-06-19", name: "端午節", isHoliday: true },
  { date: "2026-06-20", name: "端午節連假（週六）", isHoliday: true },
  { date: "2026-06-21", name: "端午節連假（週日）", isHoliday: true },

  // ── 中秋節 (4天連假 9/25~9/28) ──
  // 9/25(五) 中秋節，與週末相連，9/28(一) 教師節
  { date: "2026-09-25", name: "中秋節", isHoliday: true },
  { date: "2026-09-26", name: "中秋節連假（週六）", isHoliday: true },
  { date: "2026-09-27", name: "中秋節連假（週日）", isHoliday: true },
  { date: "2026-09-28", name: "教師節", isHoliday: true },

  // ── 國慶日 (3天連假 10/9~10/11) ──
  // 10/10(六) 國慶日，逢週六於 10/9(五) 補假
  { date: "2026-10-09", name: "國慶日（補假）", isHoliday: true },
  { date: "2026-10-10", name: "國慶日", isHoliday: true },
  { date: "2026-10-11", name: "國慶日連假（週日）", isHoliday: true },

  // ── 臺灣光復暨金門古寧頭大捷紀念日 (3天連假 10/24~10/26) ──
  // 10/25(六) 光復節，逢週日補於 10/26(一)
  { date: "2026-10-24", name: "光復節連假（週六）", isHoliday: true },
  { date: "2026-10-25", name: "臺灣光復節", isHoliday: true },
  { date: "2026-10-26", name: "光復節（補假）", isHoliday: true },

  // ── 行憲紀念日 (3天連假 12/25~12/27) ──
  // 12/25(五) 行憲紀念日，與週末相連
  { date: "2026-12-25", name: "行憲紀念日", isHoliday: true },
  { date: "2026-12-26", name: "行憲紀念日連假（週六）", isHoliday: true },
  { date: "2026-12-27", name: "行憲紀念日連假（週日）", isHoliday: true },
];

// ============================================================
// 2027 年 台灣國定假日 / 人事行政局行事曆
// 資料來源：行政院人事行政總處 (民國116年政府行政機關辦公日曆表)
// 全年放假 121 天，無補班日
// ============================================================
export const TAIWAN_HOLIDAYS_2027: TaiwanHoliday[] = [
  // ── 元旦 (3天連假 1/1~1/3) ──
  // 1/1(五) 元旦，與週末相連
  { date: "2027-01-01", name: "元旦", isHoliday: true },
  { date: "2027-01-02", name: "元旦連假（週六）", isHoliday: true },
  { date: "2027-01-03", name: "元旦連假（週日）", isHoliday: true },

  // ── 農曆春節 (7天連假 2/4~2/10) ──
  // 小年夜 2/4(四)、除夕 2/5(五)、初一 2/6(六)、初二 2/7(日)、初三 2/8(一)
  // 初一初二逢週末，於 2/9(二)、2/10(三) 補假
  { date: "2027-02-04", name: "小年夜", isHoliday: true },
  { date: "2027-02-05", name: "除夕", isHoliday: true },
  { date: "2027-02-06", name: "春節初一", isHoliday: true },
  { date: "2027-02-07", name: "春節初二", isHoliday: true },
  { date: "2027-02-08", name: "春節初三", isHoliday: true },
  { date: "2027-02-09", name: "春節補假", isHoliday: true },
  { date: "2027-02-10", name: "春節補假", isHoliday: true },

  // ── 和平紀念日 (3天連假 2/27~3/1) ──
  // 2/28(日) 和平紀念日，逢週日於 3/1(一) 補假
  { date: "2027-02-27", name: "和平紀念日連假（週六）", isHoliday: true },
  { date: "2027-02-28", name: "和平紀念日", isHoliday: true },
  { date: "2027-03-01", name: "和平紀念日（補假）", isHoliday: true },

  // ── 兒童節及清明節 (4天連假 4/3~4/6) ──
  // 4/4(日) 兒童節補於 4/6(二)，4/5(一) 清明節
  { date: "2027-04-03", name: "兒童節/清明節連假（週六）", isHoliday: true },
  { date: "2027-04-04", name: "兒童節", isHoliday: true },
  { date: "2027-04-05", name: "清明節", isHoliday: true },
  { date: "2027-04-06", name: "兒童節（補假）", isHoliday: true },

  // ── 勞動節 (3天連假 4/30~5/2) ──
  // 5/1(六) 勞動節，逢週六於 4/30(五) 補假
  { date: "2027-04-30", name: "勞動節（補假）", isHoliday: true },
  { date: "2027-05-01", name: "勞動節", isHoliday: true },
  { date: "2027-05-02", name: "勞動節連假（週日）", isHoliday: true },

  // ── 端午節 (1天，無連假) ──
  // 6/9(三) 端午節
  { date: "2027-06-09", name: "端午節", isHoliday: true },

  // ── 中秋節 (1天，無連假) ──
  // 9/15(三) 中秋節
  { date: "2027-09-15", name: "中秋節", isHoliday: true },

  // ── 國慶日 (3天連假 10/9~10/11) ──
  // 10/10(日) 國慶日，逢週日於 10/11(一) 補假
  { date: "2027-10-09", name: "國慶日連假（週六）", isHoliday: true },
  { date: "2027-10-10", name: "國慶日", isHoliday: true },
  { date: "2027-10-11", name: "國慶日（補假）", isHoliday: true },

  // ── 臺灣光復節 (3天連假 10/23~10/25) ──
  // 10/25(一) 臺灣光復節，與週末相連
  { date: "2027-10-23", name: "光復節連假（週六）", isHoliday: true },
  { date: "2027-10-24", name: "光復節連假（週日）", isHoliday: true },
  { date: "2027-10-25", name: "臺灣光復節", isHoliday: true },

  // ── 行憲紀念日 (3天連假 12/24~12/26) ──
  // 12/25(六) 行憲紀念日，逢週六於 12/24(五) 補假
  { date: "2027-12-24", name: "行憲紀念日（補假）", isHoliday: true },
  { date: "2027-12-25", name: "行憲紀念日", isHoliday: true },
  { date: "2027-12-26", name: "行憲紀念日連假（週日）", isHoliday: true },

  // ── 2028 跨年連假 (3天 12/31~2028/1/2) ──
  // 2028/1/1(六) 元旦逢週六，提前於 12/31(五) 補假
  { date: "2027-12-31", name: "2028元旦（補假）", isHoliday: true },
];

// ============================================================
// 合併所有年份假日資料
// ============================================================
const ALL_HOLIDAYS: TaiwanHoliday[] = [
  ...TAIWAN_HOLIDAYS_2026,
  ...TAIWAN_HOLIDAYS_2027,
];

/**
 * 取得指定日期的假日資訊
 */
export function getHoliday(dateStr: string): TaiwanHoliday | undefined {
  return ALL_HOLIDAYS.find((h) => h.date === dateStr);
}

/**
 * 取得指定月份的所有假日
 */
export function getHolidaysByMonth(
  year: number,
  month: number
): TaiwanHoliday[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return ALL_HOLIDAYS.filter((h) => h.date.startsWith(prefix));
}

/**
 * 判斷是否為假日
 */
export function isHoliday(dateStr: string): boolean {
  return ALL_HOLIDAYS.some(
    (h) => h.date === dateStr && h.isHoliday
  );
}
