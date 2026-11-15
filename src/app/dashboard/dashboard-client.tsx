"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Car,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import type { BookingLog, CostRecord } from "@/db/schema";
import { USER_COLORS, STATUS_BADGE_COLORS } from "@/lib/constants";
import { format } from "date-fns";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type UserColorKey = keyof typeof USER_COLORS;

function statusBadgeClass(status: string): string {
  return (
    STATUS_BADGE_COLORS[status as keyof typeof STATUS_BADGE_COLORS] ??
    "bg-gray-100 text-gray-800"
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DashboardClientProps {
  bookings: BookingLog[];
  costRecords: CostRecord[];
}

export function DashboardClient({
  bookings,
  costRecords,
}: DashboardClientProps) {
  // ---- derived data -------------------------------------------------------

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  /** Bookings this month with status 已完成 or 已出車 */
  const monthlyActiveBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const d = new Date(b.startDate);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          (b.status === "已完成" || b.status === "已出車")
        );
      }),
    [bookings, currentYear, currentMonth],
  );

  /** Sum of all cost records totalAmount */
  const totalCost = useMemo(
    () => costRecords.reduce((acc, r) => acc + Number(r.totalAmount), 0),
    [costRecords],
  );

  /** Sum of all countedDays */
  const totalCountedDays = useMemo(
    () => bookings.reduce((acc, b) => acc + b.countedDays, 0),
    [bookings],
  );

  /** Average per-person amount across all cost records */
  const avgPerPerson = useMemo(() => {
    if (costRecords.length === 0) return 0;
    const totalUserAmounts = costRecords.reduce(
      (acc, r) =>
        acc +
        Number(r.parentAmount) +
        Number(r.user1Amount) +
        Number(r.user2Amount) +
        Number(r.user3Amount),
      0,
    );
    return totalUserAmounts / 4 / costRecords.length;
  }, [costRecords]);

  // ---- per-user counted days -----------------------------------------------

  const userDays = useMemo(() => {
    const map: Record<string, number> = {
      老大: 0,
      老二: 0,
      老三: 0,
      鴻老爹: 0,
    };
    for (const b of bookings) {
      if (b.userName in map) {
        map[b.userName] += b.countedDays;
      }
    }
    return map;
  }, [bookings]);

  const maxDays = Math.max(...Object.values(userDays), 1);

  // ---- per-user cost totals ------------------------------------------------

  const userCosts = useMemo(() => {
    const map = { 鴻老爹: 0, 老大: 0, 老二: 0, 老三: 0 };
    for (const r of costRecords) {
      map["鴻老爹"] += Number(r.parentAmount);
      map["老大"] += Number(r.user1Amount);
      map["老二"] += Number(r.user2Amount);
      map["老三"] += Number(r.user3Amount);
    }
    return map;
  }, [costRecords]);

  const maxCost = Math.max(...Object.values(userCosts), 1);

  // ---- recent lists --------------------------------------------------------

  const recentBookings = bookings.slice(0, 5);
  const recentCosts = costRecords.slice(0, 5);

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">儀表板</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="detail">詳細</TabsTrigger>
        </TabsList>

        {/* ===================== 總覽 TAB ===================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* --- Summary cards --- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<Car className="h-5 w-5 text-sky-500" />}
              label="本月用車次數"
              value={monthlyActiveBookings.length}
              sub="已完成 / 已出車"
            />
            <SummaryCard
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              label="總費用"
              value={`NT$ ${totalCost.toLocaleString()}`}
              sub="所有結算紀錄"
            />
            <SummaryCard
              icon={<Calendar className="h-5 w-5 text-violet-500" />}
              label="累計用車天數"
              value={totalCountedDays}
              sub="天"
            />
            <SummaryCard
              icon={<Users className="h-5 w-5 text-orange-500" />}
              label="平均每人分攤"
              value={`NT$ ${Math.round(avgPerPerson).toLocaleString()}`}
              sub="每筆平均"
            />
          </div>

          {/* --- Usage days chart --- */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                各人用車天數統計
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["老大", "老二", "老三", "鴻老爹"] as UserColorKey[]).map(
                (user) => {
                  const days = userDays[user];
                  const pct =
                    totalCountedDays > 0
                      ? Math.round((days / totalCountedDays) * 100)
                      : 0;
                  const colors = USER_COLORS[user];
                  return (
                    <div key={user} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{user}</span>
                        <span className="text-muted-foreground">
                          {days} 天（{pct}%）
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${colors.dot}`}
                          style={{
                            width: `${maxDays > 0 ? (days / maxDays) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </CardContent>
          </Card>

          {/* --- Cost sharing chart --- */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                費用分攤統計
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["鴻老爹", "老大", "老二", "老三"] as const).map(
                (user) => {
                  const amount = userCosts[user];
                  const colors = USER_COLORS[user];
                  return (
                    <div key={user} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{user}</span>
                        <span className="text-muted-foreground">
                          NT$ {amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${colors.dot}`}
                          style={{
                            width: `${maxCost > 0 ? (amount / maxCost) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== 詳細 TAB ===================== */}
        <TabsContent value="detail" className="space-y-6">
          {/* --- Recent bookings --- */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Car className="h-4 w-4" />
                最近預約
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">尚無預約紀錄</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => {
                    const colors =
                      USER_COLORS[b.userName as UserColorKey] ??
                      USER_COLORS["老大"];
                    return (
                      <div
                        key={b.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${colors.border}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${colors.dot}`}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {b.userName} — {b.purpose}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(b.startDate), "yyyy/MM/dd")} ~{" "}
                              {format(new Date(b.endDate), "yyyy/MM/dd")}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={statusBadgeClass(b.status)}
                        >
                          {b.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* --- Recent costs --- */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                最近費用
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCosts.length === 0 ? (
                <p className="text-sm text-muted-foreground">尚無費用紀錄</p>
              ) : (
                <div className="space-y-3">
                  {recentCosts.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{r.item}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(r.settlementDate),
                            "yyyy/MM/dd",
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        NT$ {Number(r.totalAmount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary Card sub-component
// ---------------------------------------------------------------------------

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}
