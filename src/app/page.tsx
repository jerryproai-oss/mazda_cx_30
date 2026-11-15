import { Suspense } from "react";
import { connection } from "next/server";
import { getBookings } from "@/app/actions";
import { BookingPageClient } from "@/app/booking-page-client";

async function BookingContent() {
  await connection();
  const bookings = await getBookings();
  return <BookingPageClient bookings={bookings} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-muted-foreground animate-pulse">載入預約資料中...</span></div>}>
      <BookingContent />
    </Suspense>
  );
}
