import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  date,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// ============================================================
// 用車預約記錄 (BookingLog)
// ============================================================
export const bookingLogs = pgTable("booking_logs", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  userName: varchar("user_name", { length: 20 }).notNull(), // 老大, 老二, 老三, 鴻老爹
  applyDays: integer("apply_days").notNull(), // endDate - startDate + 1
  purpose: text("purpose").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("預約中"),
  // 預約中 | 已出車 | 已完成 | 已取消
  countedDays: integer("counted_days").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================
// 費用結算歷史記錄 (CostRecord / HistoryLog)
// ============================================================
export const costRecords = pgTable("cost_records", {
  id: serial("id").primaryKey(),
  settlementDate: date("settlement_date").notNull(),
  item: varchar("item", { length: 50 }).notNull(),
  // 一般保養 | 大保養 | 牌照稅與燃料稅 | 強制險與超額險
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  daysUser1: integer("days_user1").notNull().default(0), // 老大
  daysUser2: integer("days_user2").notNull().default(0), // 老二
  daysUser3: integer("days_user3").notNull().default(0), // 老三
  totalDays: integer("total_days").notNull().default(0),
  parentAmount: numeric("parent_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  user1Amount: numeric("user1_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  user2Amount: numeric("user2_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  user3Amount: numeric("user3_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  auditCheck: boolean("audit_check").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("待確認"),
  // 待確認 | 已確認入帳
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Types
export type BookingLog = typeof bookingLogs.$inferSelect;
export type NewBookingLog = typeof bookingLogs.$inferInsert;
export type CostRecord = typeof costRecords.$inferSelect;
export type NewCostRecord = typeof costRecords.$inferInsert;
