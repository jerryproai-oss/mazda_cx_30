// ============================================================
// 費用分攤計算引擎
// ============================================================

export interface CostInput {
  item: "一般保養" | "大保養" | "牌照稅與燃料稅" | "強制險與超額險";
  totalAmount: number;
  daysUser1: number;
  daysUser2: number;
  daysUser3: number;
}

export interface CostResult {
  parentAmount: number;
  user1Amount: number;
  user2Amount: number;
  user3Amount: number;
  totalDays: number;
  auditCheck: boolean;
}

// 費用項目 → 父母出資比率 α
const PARENT_RATIO: Record<CostInput["item"], number> = {
  一般保養: 0,
  大保養: 0.3,
  牌照稅與燃料稅: 0.3,
  強制險與超額險: 0.3,
};

// 哪些項目使用雙軌制（情況 A），其餘使用均分制（情況 B）
const DUAL_TRACK_ITEMS: Set<CostInput["item"]> = new Set([
  "一般保養",
  "大保養",
]);

/**
 * 計算費用分攤
 */
export function calculateCostSharing(input: CostInput): CostResult {
  const { item, totalAmount, daysUser1, daysUser2, daysUser3 } = input;
  const C = totalAmount;
  const alpha = PARENT_RATIO[item];

  // 父母應付金額
  const parentAmount = round(C * alpha);

  // 子女總分擔池
  const poolChildren = C * (1 - alpha);

  let user1Amount: number;
  let user2Amount: number;
  let user3Amount: number;

  if (DUAL_TRACK_ITEMS.has(item)) {
    // ---- 情況 A：雙軌天數計費制 ----
    const totalDays = daysUser1 + daysUser2 + daysUser3;

    // 50% 基本均分池
    const poolBase = poolChildren * 0.5;
    const shareBase = round(poolBase / 3);

    // 50% 天數比例池
    const poolDays = poolChildren * 0.5;

    if (totalDays === 0) {
      // D = 0 退化為均分
      user1Amount = round(poolChildren / 3);
      user2Amount = round(poolChildren / 3);
      user3Amount = round(poolChildren - user1Amount - user2Amount);
    } else {
      const shareDays1 = round(poolDays * (daysUser1 / totalDays));
      const shareDays2 = round(poolDays * (daysUser2 / totalDays));
      const shareDays3 = round(poolDays * (daysUser3 / totalDays));

      user1Amount = round(shareBase + shareDays1);
      user2Amount = round(shareBase + shareDays2);
      user3Amount = round(shareBase + shareDays3);
    }
  } else {
    // ---- 情況 B：三兄弟直接均分制 ----
    user1Amount = round(poolChildren / 3);
    user2Amount = round(poolChildren / 3);
    user3Amount = round(poolChildren - user1Amount - user2Amount);
  }

  // 修正尾差：確保總額平衡
  const sum = parentAmount + user1Amount + user2Amount + user3Amount;
  const diff = round(C - sum);
  if (diff !== 0) {
    user3Amount = round(user3Amount + diff);
  }

  const totalDays = daysUser1 + daysUser2 + daysUser3;
  const auditCheck =
    round(parentAmount + user1Amount + user2Amount + user3Amount) === round(C);

  return {
    parentAmount,
    user1Amount,
    user2Amount,
    user3Amount,
    totalDays,
    auditCheck,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
