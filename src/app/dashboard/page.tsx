import { Suspense } from "react";
import { connection } from "next/server";
import { getBookings, getCostRecords } from "@/app/actions";
import { DashboardClient } from "./dashboard-client";

async function DashboardContent() {
  await connection();
  const [bookings, costRecords] = await Promise.all([
    getBookings(),
    getCostRecords(),
  ]);
  return <DashboardClient bookings={bookings} costRecords={costRecords} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-muted-foreground animate-pulse">載入統計資料...</span></div>}>
      <DashboardContent />
    </Suspense>
  );
}
