"use client";

import { useState } from "react";
import { BookingCalendar } from "@/components/booking-calendar";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, List } from "lucide-react";
import {
  USER_COLORS,
  STATUS_BADGE_COLORS,
} from "@/lib/constants";
import type { BookingLog } from "@/db/schema";
import { cn } from "@/lib/utils";

interface BookingPageClientProps {
  bookings: BookingLog[];
}

export function BookingPageClient({ bookings }: BookingPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingLog | null>(
    null
  );
  const [view, setView] = useState<"calendar" | "list">("calendar");

  function handleDateClick(date: Date) {
    setSelectedBooking(null);
    setSelectedDate(date);
  }

  function handleBookingClick(booking: BookingLog) {
    setSelectedDate(null);
    setSelectedBooking(booking);
  }

  function handleClose() {
    setSelectedDate(null);
    setSelectedBooking(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header & View Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">用車預約</h1>
        <div className="flex items-center gap-1 rounded-lg border p-0.5">
          <Button
            variant={view === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <Calendar className="mr-1 size-4" />
            月曆
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="mr-1 size-4" />
            列表
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <BookingCalendar
          bookings={bookings}
          onDateClick={handleDateClick}
          onBookingClick={handleBookingClick}
        />
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>使用者</TableHead>
                <TableHead>開始日期</TableHead>
                <TableHead>結束日期</TableHead>
                <TableHead className="hidden sm:table-cell">天數</TableHead>
                <TableHead className="hidden md:table-cell">用途</TableHead>
                <TableHead>狀態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    目前沒有預約紀錄
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const colorKey = booking.userName as keyof typeof USER_COLORS;
                  const colors = USER_COLORS[colorKey];
                  const statusColor =
                    STATUS_BADGE_COLORS[
                      booking.status as keyof typeof STATUS_BADGE_COLORS
                    ] ?? "";

                  return (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer"
                      onClick={() => handleBookingClick(booking)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2.5 shrink-0 rounded-full",
                              colors?.dot ?? "bg-gray-400"
                            )}
                          />
                          <span className="font-medium">
                            {booking.userName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.startDate}</TableCell>
                      <TableCell>{booking.endDate}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {booking.applyDays} 天
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                        {booking.purpose}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(statusColor)}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Booking Form (floating + button & dialogs) */}
      <BookingForm
        selectedDate={selectedDate}
        selectedBooking={selectedBooking}
        onClose={handleClose}
      />
    </div>
  );
}
