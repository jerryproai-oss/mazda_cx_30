"use server";

import { db } from "@/db";
import { bookingLogs, costRecords } from "@/db/schema";
import { eq, and, or, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calculateCostSharing } from "@/lib/cost-calculator";
import type { CostInput } from "@/lib/cost-calculator";

// ============================================================
// Booking Actions
// ============================================================

export async function getBookings() {
  const results = await db
    .select()
    .from(bookingLogs)
    .orderBy(sql`${bookingLogs.startDate} DESC`);
  return results;
}

export async function getBookingsByMonth(year: number, month: number) {
  // Build first and last day of the target month
  const monthStr = String(month).padStart(2, "0");
  const firstDay = `${year}-${monthStr}-01`;

  // Last day: create a date for the *next* month, then subtract 1 day
  const lastDayDate = new Date(year, month, 0); // day 0 of next month = last day of this month
  const lastDay = `${year}-${monthStr}-${String(lastDayDate.getDate()).padStart(2, "0")}`;

  // A booking belongs to this month if its startDate or endDate falls within [firstDay, lastDay]
  const results = await db
    .select()
    .from(bookingLogs)
    .where(
      or(
        and(gte(bookingLogs.startDate, firstDay), lte(bookingLogs.startDate, lastDay)),
        and(gte(bookingLogs.endDate, firstDay), lte(bookingLogs.endDate, lastDay))
      )
    )
    .orderBy(sql`${bookingLogs.startDate} DESC`);

  return results;
}

export async function createBooking(formData: FormData) {
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const userName = formData.get("userName") as string;
  const purpose = formData.get("purpose") as string;

  // Calculate applyDays = difference in days + 1 (inclusive)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const applyDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;

  await db.insert(bookingLogs).values({
    startDate,
    endDate,
    userName,
    purpose,
    applyDays,
    status: "預約中",
    countedDays: 0,
  });

  revalidatePath("/");
}

export async function updateBookingStatus(id: number, newStatus: string) {
  // Fetch the current booking to get applyDays
  const [booking] = await db
    .select()
    .from(bookingLogs)
    .where(eq(bookingLogs.id, id))
    .limit(1);

  if (!booking) return;

  let countedDays = booking.countedDays;

  if (newStatus === "已完成") {
    countedDays = booking.applyDays;
  } else if (newStatus === "已取消") {
    countedDays = 0;
  }

  await db
    .update(bookingLogs)
    .set({ status: newStatus, countedDays })
    .where(eq(bookingLogs.id, id));

  revalidatePath("/");
}

export async function deleteBooking(id: number) {
  await db.delete(bookingLogs).where(eq(bookingLogs.id, id));
  revalidatePath("/");
}

export async function getAccumulatedDays(
  startDate?: string,
  endDate?: string
): Promise<{ user1: number; user2: number; user3: number }> {
  // Build conditions: status = '已完成' and optional date range
  const conditions = [eq(bookingLogs.status, "已完成")];

  if (startDate) {
    conditions.push(gte(bookingLogs.startDate, startDate));
  }
  if (endDate) {
    conditions.push(lte(bookingLogs.endDate, endDate));
  }

  const rows = await db
    .select({
      userName: bookingLogs.userName,
      totalDays: sql<number>`COALESCE(SUM(${bookingLogs.countedDays}), 0)`,
    })
    .from(bookingLogs)
    .where(and(...conditions))
    .groupBy(bookingLogs.userName);

  const result = { user1: 0, user2: 0, user3: 0 };

  for (const row of rows) {
    if (row.userName === "老大") result.user1 = Number(row.totalDays);
    else if (row.userName === "老二") result.user2 = Number(row.totalDays);
    else if (row.userName === "老三") result.user3 = Number(row.totalDays);
  }

  return result;
}

// ============================================================
// Cost Record Actions
// ============================================================

export async function getCostRecords() {
  const results = await db
    .select()
    .from(costRecords)
    .orderBy(sql`${costRecords.settlementDate} DESC`);
  return results;
}

export async function createCostRecord(formData: FormData) {
  const item = formData.get("item") as CostInput["item"];
  const totalAmount = Number(formData.get("totalAmount"));
  const daysUser1 = Number(formData.get("daysUser1"));
  const daysUser2 = Number(formData.get("daysUser2"));
  const daysUser3 = Number(formData.get("daysUser3"));
  const settlementDate = formData.get("settlementDate") as string;

  // Use the cost calculator engine
  const sharing = calculateCostSharing({
    item,
    totalAmount,
    daysUser1,
    daysUser2,
    daysUser3,
  });

  await db.insert(costRecords).values({
    settlementDate,
    item,
    totalAmount: totalAmount.toFixed(2),
    daysUser1,
    daysUser2,
    daysUser3,
    totalDays: sharing.totalDays,
    parentAmount: sharing.parentAmount.toFixed(2),
    user1Amount: sharing.user1Amount.toFixed(2),
    user2Amount: sharing.user2Amount.toFixed(2),
    user3Amount: sharing.user3Amount.toFixed(2),
    auditCheck: sharing.auditCheck,
    status: "已確認入帳",
  });

  revalidatePath("/history");
}

export async function deleteCostRecord(id: number) {
  await db.delete(costRecords).where(eq(costRecords.id, id));
  revalidatePath("/history");
}
